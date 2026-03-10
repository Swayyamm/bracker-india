# ◈ THE BRACKER INDIA ◈
### Industrial Riveting Excellence System v4.0

The Bracker India is a premium e-commerce and operation management platform designed specifically for high-precision industrial riveting machinery. Based on world-class Radial and Orbital technology, this platform streamlines the procurement and deployment of industrial equipment.

---

## 🚀 Key Features

### 🛠 Industrial Core
- **Machine Catalog**: Technical specifications for RNE-series Radial and Orbital riveting machines.
- **Dynamic Inventory**: Real-time stock tracking and industrial spare parts management.
- **Precision Search**: Filter equipment by force range, technology type, and automation compatibility.

### 💳 Transactional Ecosystem
- **Stripe Integration**: Secure 256-bit encrypted digital payments.
- **Cash on Delivery (COD)**: Specialized industrial onsite reconciliation flow.
- **GST Compliance**: Automated 18% tax invoice generation with HSN/SAC code mapping.

### 🤖 Bracker Intelligence System
- **AI Consultant**: Intent-based technical support for machine specs and logistics.
- **Logistics Matrix**: Real-time shipping updates for Pan-India industrial zones.

### 📊 Operations Dashboard
- **Sales Analytics**: 7-day revenue distribution charts powered by Chart.js.
- **Order Management**: End-to-end tracking from "Pending" to "Dispatched".
- **Business Reporting**: Exportable CSV reports for Sales, Inventory, and Users.

---

## 🛠 Technical Stack

### Frontend
- **React.js**: High-performance UI library.
- **Tailwind CSS**: Professional industrial aesthetic.
- **Lucide Icons**: Precision iconography.
- **Chart.js**: Real-time sales visualization.
- **Framer Motion**: Smooth industrial transitions.

### Backend
- **Python / Flask**: Scalable micro-service architecture.
- **Supabase (PostgreSQL)**: Cloud-native database and authentication.
- **Stripe API**: Secure payment processing.
- **JWT**: Industry-standard secure authentication.
- **Pandas**: Advanced data analytics for reporting.

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16+)
- Python (v3.9+)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/harshpareshbhaigosalya/INDIA-BRACKER.git
cd INDIA-BRACKER
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
**Create a `.env` in the `backend` folder:**
```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_key
FRONTEND_URL=http://localhost:5173
PORT=5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
**Create a `.env` in the `frontend` folder:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_COMPANY_NAME=The Bracker India
```

---

## 🏃 Running the Application

### Start Backend
```bash
cd backend
venv\Scripts\activate
python app.py
```

### Start Frontend
```bash
cd frontend
npm run dev
```

---

## ◈ BRACKER INTELLIGENCE SYSTEM ◈
*Optimized. Precise. Relentless.*
