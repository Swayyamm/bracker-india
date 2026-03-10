import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.product_routes import product_bp
from routes.order_routes import order_bp
from routes.admin_routes import admin_bp
from routes.cart_routes import cart_bp
from routes.chatbot_routes import chatbot_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(product_bp, url_prefix='/api/products')
app.register_blueprint(order_bp, url_prefix='/api/orders')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(cart_bp, url_prefix='/api/cart')
app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')

@app.route('/')
def home():
    return {"message": "Welcome to The Bracker India API"}
import os
from flask import send_from_directory

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    frontend_build = os.path.join(os.getcwd(), "frontend", "dist")

    if path != "" and os.path.exists(os.path.join(frontend_build, path)):
        return send_from_directory(frontend_build, path)

    return send_from_directory(frontend_build, "index.html")

if __name__ == '__main__':
    app.run(debug=True, port=int(os.getenv('PORT', 5000)))
