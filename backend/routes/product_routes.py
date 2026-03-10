from flask import Blueprint, request, jsonify
from backend.database import get_db

product_bp = Blueprint('products', __name__)
db = get_db()

@product_bp.route('/', methods=['GET'])
def get_products():
    category_id = request.args.get('category_id')
    search = request.args.get('search')
    
    query = db.table('products').select('*, categories(name)')
    
    if category_id:
        query = query.eq('category_id', category_id)
    if search:
        query = query.ilike('name', f'%{search}%')
        
    try:
        response = query.execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        response = db.table('products').select('*, categories(name)').eq('id', product_id).single().execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 404

@product_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        response = db.table('categories').select('*').execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_bp.route('/featured', methods=['GET'])
def get_featured_products():
    try:
        # For simplicity, just taking the last 4 products
        response = db.table('products').select('*').limit(4).order('created_at', desc=True).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
