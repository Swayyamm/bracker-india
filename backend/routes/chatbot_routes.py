from flask import Blueprint, request, jsonify
import random
from backend.database import get_db
chatbot_bp = Blueprint('chatbot', __name__)

# High-Performance Industrial AI Knowledge Base
INTENTS = [
    {
        "keywords": ["hello", "hi", "hey", "greetings", "good morning", "good evening", "who are you"],
        "responses": [
            "◈ BRACKER INTELLIGENCE SYSTEM v4.0 ONLINE ◈\n\nGreetings. I am the centralized AI coordinator for Bracker India. My primary directive is to optimize your industrial joining operations. \n\nHow can I facilitate your technical success today?",
            "System Status: OPTIMAL\nConnection: SECURE\n\nWelcome to Bracker India's digital expert system. I am equipped with technical data for our entire machinery lineup. Please state your query for immediate analysis.",
            "◈ PROTOCOL GREETING INITIATED ◈\n\nHello! I am your AI-powered industrial consultant. I can assist with:\n• Precision Machine Specs\n• Supply Chain Logistics\n• Corporate Compliance & GST\n• Real-time Order Deployment"
        ]
    },
    {
        "keywords": ["shipping", "delivery", "track", "logistics", "reach", "courier", "package"],
        "responses": [
            "◈ LOGISTICS ANALYSIS ◈\n\nCurrent Protocol: Standard Pan-India Dispatch\nTimeframe: 5 - 7 Business Days\n\nParameters:\n1. Units are secured in industrial-grade crates.\n2. Dispatch occurs within 48 hours for stock items.\n3. Real-time tracking is activated upon transit handover.",
            "◈ SITE DELIVERY METRICS ◈\n\nOur specialized freight grid covers 100% of Indian industrial zones. Heavy machinery (Radials) requires reinforced logistics, which we manage end-to-end to ensure zero-deformation arrival."
        ]
    },
    {
        "keywords": ["gst", "tax", "invoice", "billing", "receipt", "gstin"],
        "responses": [
            "◈ COMPLIANCE VERIFICATION ◈\n\nFinancial Protocol: GST-Compliant Billing (18%)\n\nSystem Data:\n• Digital Tax Invoices are generated instantly.\n• Invoices include HSN/SAC codes for industrial machinery.\n• You can download certificates via the 'Profile' portal.\n\nPlease ensure your Corporate GSTIN is correctly mapped during checkout.",
            "◈ BILLING ARCHITECTURE ◈\n\nBracker India operates under centralized tax frameworks. All transactions include a complete breakdown of CGST/SGST/IGST. Your business compliance is our priority."
        ]
    },
    {
        "keywords": ["machine", "riveting", "radial", "orbital", "equipment", "rne", "joining", "head", "form"],
        "responses": [
            "◈ TECHNICAL MATRIX: RIVETING SYSTEMS ◈\n\nMachine Classification:\n1. RADIAL (RNE Series): 11° contact angle. Best for high-precision, low-force delicate joining.\n2. ORBITAL: Constant angle. Best for high-volume standard fastening.\n\nRecommendation: Use Radial for electronic components or aviation-grade assemblies.",
            "◈ EQUIPMENT CATALOG ANALYSIS ◈\n\nAnalyzing primary units:\n• RNE-180: Precision micro-joining.\n• RNE-280: Specialized medium-force application.\n• Automation Kits: Ready for PLC integration.\n\nWhich force-range does your assembly line require?"
        ]
    },
    {
        "keywords": ["order", "buy", "purchase", "checkout", "cod", "stripe", "payment", "pay", "cash"],
        "responses": [
            "◈ TRANSACTIONAL PROTOCOLS active ◈\n\nGateway Options:\n• STRIPE: Encrypted digital processing (Credit/Debit/UPI).\n• COD: Cash on Delivery for industrial onsite settlement.\n\nSecurity Level: 256-bit AES Encryption verified.",
            "◈ PAYMENT GATEWAY STATUS ◈\n\nWe utilize diversified payment ecosystems. Digital payments are processed via Stripe for 100% security. Alternatively, COD is available for manual reconciliation at the time of delivery."
        ]
    },
    {
        "keywords": ["contact", "support", "help", "phone", "email", "manager", "call", "office", "address"],
        "responses": [
            "◈ HUMAN INTERVENTION PROTOCOL ◈\n\nSenior Support Directory:\n• Email: contact@brackerindia.com\n• Technical Hotline: +91-9876543210\n• HQ: Mumbai Industrial Hub, Maharashtra.\n\nWould you like me to flag an engineer for a callback?",
            "◈ SUPPORT ACCESS ◈\n\nTechnical helpdesk current wait-time: < 2 Minutes.\nDirect Line: +91-9876543210\n\nI am also capable of resolving 95% of technical machine queries immediately."
        ]
    }
]

@chatbot_bp.route('/query', methods=['POST'])
def query_chatbot():
    data = request.get_json() or {}
    user_query = (data.get('query') or data.get('message') or '').lower()
    
    if not user_query:
        return jsonify({"response": "◈ SYSTEM ALERT ◈\n\nPlease provide a technical query for analysis."})

    db = get_db()

    # 1. SHOW PRODUCTS INTENT
    is_show_products = (
        "product" in user_query or 
        "catalog" in user_query or 
        "shop" in user_query or 
        "inventory" in user_query or 
        "item" in user_query or
        "machine" in user_query or
        ("show" in user_query and "list" in user_query)
    )
    if is_show_products:
        try:
            res = db.table('products').select('*').execute()
            products = res.data
            response_text = "◈ PRODUCT CATALOG ◈\n\nHere are some of our top industrial machines:\n"
            for p in products:
                response_text += f"• {p['name']} - ₹{p['price']}\n"
            response_text += "\nWould you like me to add any of these to your cart? You can just click the shopping cart icon next to the product."
            return jsonify({
                "response": response_text,
                "action": "SHOW_PRODUCTS",
                "data": products
            })
        except Exception as e:
            pass
            
    # 2. ADD TO CART INTENT
    if "add" in user_query and "cart" in user_query:
        try:
            res = db.table('products').select('*').execute()
            products = res.data
            added_product = None
            for p in products:
                if p['name'].lower() in user_query:
                    added_product = p
                    break
            
            if added_product:
                return jsonify({
                    "response": f"◈ ACTION DISPATCHED ◈\n\n{added_product['name']} has been queued for your cart.",
                    "action": "ADD_TO_CART",
                    "data": added_product # Frontend will handle adding to cart using data
                })
            else:
                return jsonify({
                    "response": "◈ ACTION FAILED ◈\n\nPlease specify the exact product name, or click the cart icon on standard catalog views."
                })
        except Exception as e:
            pass
            
    # 3. NAVIGATE TO CART / CHECKOUT INTENT
    nav_keywords = ["view cart", "show cart", "go to cart", "open cart", "checkout", "my cart", "cart"]
    if any(k in user_query for k in nav_keywords):
        return jsonify({
            "response": "◈ NAVIGATION PROTOCOL INTENT ◈\n\nRedirecting you to the secure checkout environment.",
            "action": "NAVIGATE",
            "data": "/cart"
        })

    # Intent analysis
    matched_response = None
    for intent in INTENTS:
        if any(keyword in user_query for keyword in intent['keywords']):
            matched_response = random.choice(intent['responses'])
            break
            
    if matched_response:
        return jsonify({"response": matched_response})
    
    # Fallback for unknown queries
    return jsonify({
        "response": "◈ UNKNOWN QUERY ANALYSIS ◈\n\nI've mapped your request but it fell outside my primary data sectors. I am currently optimized for:\n• Machine Engineering Specs\n• Shipping Logistics\n• GST & Billing Compliance\n• Transactional Methods\n\nCould you refine your request with specific industrial keywords?"
    })
