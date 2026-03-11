import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Success from './pages/Success';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import { AdminRoute, PrivateRoute } from './components/ProtectedRoutes';

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className={`flex flex-col min-h-screen ${isAdminPath ? 'lg:flex-row' : ''}`}>
      {!isAdminPath && <Navbar />}
      {isAdminPath && <Sidebar />}

      <main className={`flex-1 ${isAdminPath ? 'p-8 lg:p-12 bg-industrial-50' : 'bg-white'}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> 
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route  path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Private Routes */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/success" element={<Success />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        </Routes>
      </main>

      {!isAdminPath && (
        <footer className="bg-accent-dark text-industrial-500 py-20 border-t border-white/5 px-4 mt-auto">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-white">
                <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center font-bold">B</div>
                <span className="font-display font-bold text-lg tracking-tight">The Bracker India</span>
              </div>
              <p className="text-sm leading-relaxed">
                Empowering India's manufacturing sector with world-class riveting technology and precision engineering since 2004.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Explore</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="/shop" className="hover:text-accent-blue">Shop Catalogue</a></li>
                <li><a href="/about" className="hover:text-accent-blue">Our Legacy</a></li>
                <li><a href="/contact" className="hover:text-accent-blue">Service Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Account</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="/profile" className="hover:text-accent-blue">My Orders</a></li>
                <li><a href="/cart" className="hover:text-accent-blue">Shopping Cart</a></li>
                <li><a href="/login" className="hover:text-accent-blue">Business Portal</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">HQ Contact</h4>
              <ul className="space-y-4 text-sm">
                <li>Mumbai Branch, Maharashtra</li>
                <li>+91 (022) 2345 6789</li>
                <li>contact@brackerindia.com</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs">
            <p>© 2026 The Bracker India. All Rights Reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">GST Details</a>
            </div>
          </div>
        </footer>
      )}

      {!isAdminPath && <Chatbot />}
      <Toaster position="bottom-center" />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
