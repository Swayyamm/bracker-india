import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, send_from_directory
from flask_cors import CORS

from backend.routes.auth_routes import auth_bp
from backend.routes.product_routes import product_bp
from backend.routes.cart_routes import cart_bp
from backend.routes.order_routes import order_bp
from backend.routes.chatbot_routes import chatbot_bp
from backend.routes.admin_routes import admin_bp


# Correct path to React build folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIST = os.path.join(BASE_DIR, "..", "frontend", "dist")


app = Flask(
    __name__,
    static_folder=FRONTEND_DIST,
    static_url_path=""
)

CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")


# -------------------------
# API ROUTES
# -------------------------

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(product_bp, url_prefix="/api/products")
app.register_blueprint(order_bp, url_prefix="/api/orders")
app.register_blueprint(admin_bp, url_prefix="/api/admin")
app.register_blueprint(cart_bp, url_prefix="/api/cart")
app.register_blueprint(chatbot_bp, url_prefix="/api/chatbot")


# -------------------------
# SERVE REACT FRONTEND
# -------------------------

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):

    # Do NOT intercept API routes
    if path.startswith("api"):
        return {"error": "API route not found"}, 404

    file_path = os.path.join(FRONTEND_DIST, path)

    # Serve static assets (js/css/images)
    if os.path.exists(file_path):
        return send_from_directory(FRONTEND_DIST, path)

    # Otherwise serve React index.html
    return send_from_directory(FRONTEND_DIST, "index.html")


# -------------------------
# START SERVER
# -------------------------

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)