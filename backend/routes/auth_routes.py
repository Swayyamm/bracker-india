from flask import Blueprint, request, jsonify
from database import get_db
from passlib.hash import pbkdf2_sha256
import jwt
import datetime
import os

auth_bp = Blueprint('auth', __name__)
db = get_db()
SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    company_name = data.get('company_name')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    # Hash password
    password_hash = pbkdf2_sha256.hash(password)

    try:
        # Check if user exists
        existing_user = db.table('users').select('*').eq('email', email).execute()
        if existing_user.data:
            return jsonify({"error": "User already exists"}), 400

        # Insert user
        new_user = {
            "name": name,
            "email": email,
            "phone": phone,
            "company_name": company_name,
            "password_hash": password_hash,
            "role": "user"
        }
        response = db.table('users').insert(new_user).execute()
        return jsonify({"message": "User registered successfully", "user": response.data[0]}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({"error": "Missing email or password"}), 400

    try:
        user = db.table('users').select('*').eq('email', email).execute()
        if not user.data:
            return jsonify({"error": "Invalid credentials"}), 401

        user_data = user.data[0]
        if not pbkdf2_sha256.verify(password, user_data['password_hash']):
            return jsonify({"error": "Invalid credentials"}), 401

        # Generate Token
        token = jwt.encode({
            'user_id': user_data['id'],
            'role': user_data['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user_data['id'],
                "name": user_data['name'],
                "email": user_data['email'],
                "role": user_data['role']
            }
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
