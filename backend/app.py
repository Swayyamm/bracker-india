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


# Correct path for Render
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIST = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend", "dist"))

app = Flask(__name__, static_folder=FRONTEND_DIST, static_url_path="")
@app.after_request
def add_security_headers(response):
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' https://js.stripe.com blob:; "
        "frame-src https://js.stripe.com https://checkout.stripe.com; "
        "connect-src 'self' https://api.stripe.com https://checkout.stripe.com; "
        "img-src 'self' data: https:; "
        "style-src 'self' 'unsafe-inline';"
    )
    return response

CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")


# ---------------- API ROUTES ----------------

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(product_bp, url_prefix="/api/products")
app.register_blueprint(order_bp, url_prefix="/api/orders")
app.register_blueprint(admin_bp, url_prefix="/api/admin")
app.register_blueprint(cart_bp, url_prefix="/api/cart")
app.register_blueprint(chatbot_bp, url_prefix="/api/chatbot")


# ---------------- SERVE REACT ----------------

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):

    # Do not intercept API routes
    if path.startswith("api"):
        return {"error": "API route"}, 404

    # Serve static files (js, css, images)
    full_path = os.path.join(FRONTEND_DIST, path)
    if path != "" and os.path.exists(full_path):
        return send_from_directory(FRONTEND_DIST, path)

    # Always return React index.html for routes like /success /shop /profile
    return send_from_directory(FRONTEND_DIST, "index.html")

# ---------------- RUN ----------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)