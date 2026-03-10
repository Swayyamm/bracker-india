from functools import wraps
from flask import request, jsonify
import jwt
import os

SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method == 'OPTIONS':
            return f(*args, **kwargs)
            
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user_id = data['user_id']
            current_user_role = data.get('role', 'user')
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401

        return f(current_user_id, current_user_role, *args, **kwargs)

    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(current_user_id, current_user_role, *args, **kwargs):
        if current_user_role != 'admin':
            return jsonify({'message': 'Admin access required!'}), 403
        return f(current_user_id, current_user_role, *args, **kwargs)
    return decorated
