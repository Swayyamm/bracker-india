from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
import io

def generate_invoice_pdf(order_data, user_data, items):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Header
    p.setFont("Helvetica-Bold", 20)
    p.drawString(50, height - 50, "THE BRACKER INDIA")
    
    p.setFont("Helvetica", 10)
    p.drawString(50, height - 65, "Industrial Equipment Specialists")
    p.drawString(50, height - 75, "GSTIN: 27AABCU9603R1ZN")

    # Invoice Info
    p.setFont("Helvetica-Bold", 14)
    p.drawString(400, height - 50, "INVOICE")
    p.setFont("Helvetica", 10)
    p.drawString(400, height - 65, f"Order ID: {order_data['id'][:8]}")
    p.drawString(400, height - 75, f"Date: {order_data['created_at'][:10]}")

    # Billing Info
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, height - 120, "Bill To:")
    p.setFont("Helvetica", 10)
    p.drawString(50, height - 135, f"{user_data['name']}")
    p.drawString(50, height - 145, f"{user_data['email']}")
    p.drawString(50, height - 155, f"{user_data.get('company_name', '')}")

    # Table Header
    p.line(50, height - 180, 550, height - 180)
    p.setFont("Helvetica-Bold", 10)
    p.drawString(50, height - 195, "Product")
    p.drawString(300, height - 195, "Qty")
    p.drawString(400, height - 195, "Price")
    p.drawString(500, height - 195, "Total")
    p.line(50, height - 200, 550, height - 200)

    # Table Rows
    y = height - 215
    for item in items:
        p.setFont("Helvetica", 10)
        p.drawString(50, y, f"{item['products']['name'][:40]}")
        p.drawString(300, y, f"{item['quantity']}")
        p.drawString(400, y, f"INR {item['price']}")
        p.drawString(500, y, f"INR {item['price'] * item['quantity']}")
        y -= 20

    # Totals
    p.line(50, y - 10, 550, y - 10)
    y -= 30
    p.setFont("Helvetica", 10)
    p.drawString(400, y, "Total Amount:")
    p.drawString(500, y, f"INR {order_data['total_amount']}")
    y -= 15
    p.drawString(400, y, "GST (18%) is Included:")
    # p.drawString(500, y, f"INR {order_data['gst_amount']}")
    y -= 20
    p.setFont("Helvetica-Bold", 12)
    p.drawString(400, y, "Grand Total:")
    p.drawString(500, y, f"INR {order_data['total_amount']}")

    p.showPage()
    p.save()

    buffer.seek(0)
    return buffer
