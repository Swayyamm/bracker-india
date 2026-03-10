from flask import Blueprint, request, jsonify
from backend.database import get_db
from backend.middleware import token_required

cart_bp = Blueprint('cart', __name__)
db = get_db()

@cart_bp.route('/', methods=['GET'])
@token_required
def get_cart(current_user_id, role):
    try:
        response = db.table('cart_items').select('*, products(*)').eq('user_id', current_user_id).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@cart_bp.route('/add', methods=['POST'])
@token_required
def add_to_cart(current_user_id, role):
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    try:
        # Check if item exists in cart
        existing = db.table('cart_items').select('*').eq('user_id', current_user_id).eq('product_id', product_id).execute()
        
        if existing.data:
            # Update quantity
            new_qty = existing.data[0]['quantity'] + quantity
            response = db.table('cart_items').update({"quantity": new_qty}).eq('id', existing.data[0]['id']).execute()
        else:
            # Insert new
            response = db.table('cart_items').insert({
                "user_id": current_user_id,
                "product_id": product_id,
                "quantity": quantity
            }).execute()
            
        return jsonify(response.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@cart_bp.route('/update/<item_id>', methods=['PATCH'])
@token_required
def update_cart_item(current_user_id, role, item_id):
    data = request.get_json()
    quantity = data.get('quantity')
    
    try:
        response = db.table('cart_items').update({"quantity": quantity}).eq('id', item_id).eq('user_id', current_user_id).execute()
        return jsonify(response.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@cart_bp.route('/remove/<item_id>', methods=['DELETE'])
@token_required
def remove_from_cart(current_user_id, role, item_id):
    try:
        db.table('cart_items').delete().eq('id', item_id).eq('user_id', current_user_id).execute()
        return jsonify({"message": "Item removed"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@cart_bp.route('/clear', methods=['DELETE'])
@token_required
def clear_cart(current_user_id, role):
    try:
        db.table('cart_items').delete().eq('user_id', current_user_id).execute()
        return jsonify({"message": "Cart cleared"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
