from flask import Blueprint, request, jsonify, send_file
from backend.database import get_db
from backend.middleware import token_required
import stripe
import os
from backend.utils.pdf_generator import generate_invoice_pdf

order_bp = Blueprint('orders', __name__)
db = get_db()
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

@order_bp.route('/checkout', methods=['POST'])
@token_required
def checkout(current_user_id, role):
    key = os.getenv('STRIPE_SECRET_KEY', '').strip()
    stripe.api_key = key
    
    data = request.get_json()
    items = data.get('items') # List of {product_id, quantity, price}
    address = data.get('address')
    payment_method = data.get('payment_method', 'stripe') # 'stripe' or 'cod'
    
    if not items:
        return jsonify({"error": "No items to checkout"}), 400

    total_amount = sum(item['price'] * item['quantity'] for item in items)
    gst_amount = total_amount * 0.18
    final_amount = total_amount + gst_amount

    # If COD, process immediately
    if payment_method == 'cod':
        try:
            # Create Order in DB
            order_res = db.table('orders').insert({
                "user_id": current_user_id,
                "total_amount": final_amount,
                "gst_amount": gst_amount,
                "status": "Processing (COD)"
            }).execute()
            
            order_id = order_res.data[0]['id']

            # Create Order Items and Update Stock
            order_items = []
            for item in items:
                order_items.append({
                    "order_id": order_id,
                    "product_id": item['product_id'],
                    "quantity": item['quantity'],
                    "price": item['price']
                })
                
                # Deduct stock
                current_product = db.table('products').select('stock').eq('id', item['product_id']).single().execute()
                if current_product.data:
                    new_stock = current_product.data['stock'] - item['quantity']
                    db.table('products').update({"stock": max(0, new_stock)}).eq('id', item['product_id']).execute()

            db.table('order_items').insert(order_items).execute()
            
            # Clear Cart
            db.table('cart_items').delete().eq('user_id', current_user_id).execute()

            return jsonify({"message": "Order placed successfully (COD)", "order_id": order_id, "method": "cod"}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Otherwise, handle Stripe
    line_items = []
    for item in items:
        # Get actual product name from DB for stripe
        product = db.table('products').select('name').eq('id', item['product_id']).single().execute()
        product_name = product.data['name'] if product.data else "Industrial Equipment"
        
        line_items.append({
            'price_data': {
                'currency': 'inr',
                'product_data': {
                    'name': product_name,
                },
                'unit_amount': int(item['price'] * 1.18 * 100), # Include tax in stripe amount
            },
            'quantity': item['quantity'],
        })

    try:
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
        # Create Stripe Checkout Session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=f"{frontend_url}/success?success=true&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{frontend_url}/checkout?cancelled=true",
            customer_email=db.table('users').select('email').eq('id', current_user_id).single().execute().data['email'],
            metadata={
                "user_id": current_user_id,
                "address": str(address)
            }
        )

        # Create Pending Order
        order_res = db.table('orders').insert({
            "user_id": current_user_id,
            "total_amount": final_amount,
            "gst_amount": gst_amount,
            "status": "Pending Payment (Stripe)"
        }).execute()
        
        # Note: We still can't use stripe_session_id column if it doesn't exist, 
        # but we can store it in metadata or handle it via session_id in URL.
        # For now, let's keep it simple as we did before.
        
        order_id = order_res.data[0]['id']

        order_items = []
        for item in items:
            order_items.append({
                "order_id": order_id,
                "product_id": item['product_id'],
                "quantity": item['quantity'],
                "price": item['price']
            })
        db.table('order_items').insert(order_items).execute()

        return jsonify({"url": checkout_session.url, "session_id": checkout_session.id, "method": "stripe"}), 201
    except Exception as e:
        return jsonify({"error": f"Payment provider error: {str(e)}. Please try Cash on Delivery."}), 400

@order_bp.route('/finalize-stripe', methods=['POST'])
@token_required
def finalize_stripe(current_user_id, role):
    import traceback
    data = request.get_json() or {}
    session_id = data.get('session_id')
    print(f"DEBUG: Finalizing stripe session: {session_id} for user: {current_user_id} (Type: {type(current_user_id)})")
    
    try:
        # 1. Find the last pending order for this user
        print("DEBUG: Fetching pending order...")
        # Try both direct and casted current_user_id
        query = db.table('orders').select('*').eq('status', 'Pending Payment (Stripe)')
        
        # Determine if it's likely a UUID or an INT
        uid = current_user_id
        try:
            if str(current_user_id).isdigit():
                uid = int(current_user_id)
        except:
            pass
            
        order_res = query.eq('user_id', uid).order('created_at', desc=True).limit(1).execute()
        
        if not order_res.data:
            print("DEBUG: No pending order discovered.")
            return jsonify({"message": "No pending order found"}), 200

        order = order_res.data[0]
        print(f"DEBUG: Found order: {order['id']}")
        
        # 2. Update Order Status
        print("DEBUG: Updating order status to Processing...")
        db.table('orders').update({"status": "Processing"}).eq('id', order['id']).execute()
        
        # 3. Deduct Stock
        print("DEBUG: Extracting order items...")
        items_res = db.table('order_items').select('*').eq('order_id', order['id']).execute()
        for item in items_res.data:
            print(f"DEBUG: Processing stock for product: {item['product_id']}")
            # Use normal select to avoid .single() exceptions
            product_res = db.table('products').select('stock').eq('id', item['product_id']).execute()
            if product_res.data and len(product_res.data) > 0:
                curr_stock = product_res.data[0].get('stock', 0)
                new_stock = max(0, curr_stock - item['quantity'])
                print(f"DEBUG: Updating stock from {curr_stock} to {new_stock}")
                db.table('products').update({"stock": new_stock}).eq('id', item['product_id']).execute()
        
        # 4. Clear Cart
        print("DEBUG: Purging user cart...")
        db.table('cart_items').delete().eq('user_id', current_user_id).execute()
        
        print("DEBUG: Finalization complete.")
        return jsonify({"message": "Order finalized successfully"}), 200
    except Exception as e:
        print(f"CRITICAL ERROR in finalize_stripe: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@order_bp.route('/', methods=['GET'])
@token_required
def get_user_orders(current_user_id, role):
    try:
        response = db.table('orders').select('*').eq('user_id', current_user_id).order('created_at', desc=True).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@order_bp.route('/<order_id>/invoice', methods=['GET'])
@token_required
def get_invoice(current_user_id, role, order_id):
    try:
        order = db.table('orders').select('*').eq('id', order_id).single().execute()
        if not order.data:
            return jsonify({"error": "Order not found"}), 404
        
        user = db.table('users').select('*').eq('id', current_user_id).single().execute()
        items = db.table('order_items').select('*, products(*)').eq('order_id', order_id).execute()
        
        pdf_buffer = generate_invoice_pdf(order.data, user.data, items.data)
        
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=f"invoice_{order_id[:8]}.pdf",
            mimetype='application/pdf'
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
