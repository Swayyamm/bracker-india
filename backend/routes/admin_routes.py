from flask import Blueprint, request, jsonify
from backend.database import get_db
from backend.middleware import token_required, admin_required
import pandas as pd
import io

admin_bp = Blueprint('admin', __name__)
db = get_db()

@admin_bp.route('/stats', methods=['GET'])
@token_required
@admin_required
def get_stats(current_user_id, role):
    try:
        # Get total sales
        orders = db.table('orders').select('total_amount, created_at').execute()
        sales_sum = sum(o['total_amount'] for o in orders.data)
        
        # Get counts
        total_orders = db.table('orders').select('id', count='exact').execute()
        total_products = db.table('products').select('id', count='exact').execute()
        total_users = db.table('users').select('id', count='exact').execute()

        # Generate sales distribution (Last 7 days)
        df = pd.DataFrame(orders.data)
        if not df.empty:
            df['created_at'] = pd.to_datetime(df['created_at']).dt.date
            daily_sales = df.groupby('created_at')['total_amount'].sum().tail(7).to_dict()
            # Convert date keys to strings
            daily_sales = {str(k): v for k, v in daily_sales.items()}
        else:
            daily_sales = {}

        return jsonify({
            "total_sales": sales_sum,
            "total_orders": len(total_orders.data),
            "total_products": len(total_products.data),
            "total_users": len(total_users.data),
            "sales_distribution": daily_sales
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/products', methods=['POST'])
@token_required
@admin_required
def add_product(current_user_id, role):
    data = request.get_json()
    try:
        response = db.table('products').insert(data).execute()
        return jsonify(response.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/products/<product_id>', methods=['PATCH'])
@token_required
@admin_required
def update_product(current_user_id, role, product_id):
    data = request.get_json()
    try:
        response = db.table('products').update(data).eq('id', product_id).execute()
        return jsonify(response.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/products/<product_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_product(current_user_id, role, product_id):
    try:
        db.table('products').delete().eq('id', product_id).execute()
        return jsonify({"message": "Product deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/orders', methods=['GET'])
@token_required
@admin_required
def get_all_orders(current_user_id, role):
    try:
        response = db.table('orders').select('*, users(name, email)').order('created_at', desc=True).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/orders/<order_id>/status', methods=['PATCH'])
@token_required
@admin_required
def update_order_status(current_user_id, role, order_id):
    data = request.get_json()
    status = data.get('status')
    try:
        response = db.table('orders').update({"status": status}).eq('id', order_id).execute()
        return jsonify(response.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/users', methods=['GET'])
@token_required
@admin_required
def get_users(current_user_id, role):
    try:
        response = db.table('users').select('*').order('created_at', desc=True).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/reports/sales', methods=['GET'])
@token_required
@admin_required
def export_sales_report(current_user_id, role):
    try:
        response = db.table('orders').select('*, users(name, email)').execute()
        df = pd.DataFrame(response.data)
        if not df.empty and 'users' in df.columns:
            df['user_name'] = df['users'].apply(lambda x: x.get('name') if x else 'N/A')
            df['user_email'] = df['users'].apply(lambda x: x.get('email') if x else 'N/A')
            df.drop(columns=['users'], inplace=True)
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        return output.getvalue(), 200, {'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=sales_report.csv'}
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/reports/inventory', methods=['GET'])
@token_required
@admin_required
def export_inventory_report(current_user_id, role):
    try:
        response = db.table('products').select('*, categories(name)').execute()
        df = pd.DataFrame(response.data)
        if not df.empty and 'categories' in df.columns:
            df['category_name'] = df['categories'].apply(lambda x: x.get('name') if x else 'N/A')
            df.drop(columns=['categories'], inplace=True)
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        return output.getvalue(), 200, {'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=inventory_report.csv'}
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/reports/users', methods=['GET'])
@token_required
@admin_required
def export_users_report(current_user_id, role):
    try:
        response = db.table('users').select('id, name, email, role, phone, company_name, created_at').execute()
        df = pd.DataFrame(response.data)
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        return output.getvalue(), 200, {'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=users_report.csv'}
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/reports/categories', methods=['GET'])
@token_required
@admin_required
def export_categories_report(current_user_id, role):
    try:
        response = db.table('categories').select('*').execute()
        df = pd.DataFrame(response.data)
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        return output.getvalue(), 200, {'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=categories_report.csv'}
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/reports/orders', methods=['GET'])
@token_required
@admin_required
def export_orders_report(current_user_id, role):
    try:
        response = db.table('orders').select('*').execute()
        df = pd.DataFrame(response.data)
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        return output.getvalue(), 200, {'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=orders_report.csv'}
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/categories', methods=['POST'])
@token_required
@admin_required
def add_category(current_user_id, role):
    data = request.get_json()
    try:
        response = db.table('categories').insert(data).execute()
        return jsonify(response.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/categories/<category_id>', methods=['PATCH'])
@token_required
@admin_required
def update_category(current_user_id, role, category_id):
    data = request.get_json()
    try:
        response = db.table('categories').update(data).eq('id', category_id).execute()
        return jsonify(response.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/categories/<category_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_category(current_user_id, role, category_id):
    try:
        db.table('categories').delete().eq('id', category_id).execute()
        return jsonify({"message": "Category deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

