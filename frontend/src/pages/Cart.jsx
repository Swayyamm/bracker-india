import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight, CreditCard, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, gstAmount, grandTotal } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            toast.error('Please login to continue to checkout');
            navigate('/login?redirect=cart');
            return;
        }
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-32 text-center">
                <div className="w-24 h-24 bg-industrial-50 text-industrial-200 rounded-full flex items-center justify-center mx-auto mb-8">
                    <ShoppingBag className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-bold text-industrial-900 mb-4">Your cart is empty</h1>
                <p className="text-industrial-500 mb-8 max-w-md mx-auto">Looks like you haven't added any industrial equipment to your cart yet.</p>
                <Link to="/shop" className="btn-primary py-3 px-8">Browse Catalogue</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-industrial-900 mb-12 flex items-center">
                Shopping Cart <span className="ml-4 text-industrial-400 text-lg font-normal">({cartItems.length} items)</span>
            </h1>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {cartItems.map((item) => (
                        <div key={item.id || item.product_id} className="flex flex-col sm:flex-row items-center bg-white p-6 rounded-2xl shadow-sm border border-industrial-100 group">
                            <div className="w-32 h-32 bg-industrial-50 rounded-xl overflow-hidden mb-4 sm:mb-0">
                                <img
                                    src={item.products?.image_url || 'https://placehold.co/200x200?text=Equipment'}
                                    alt={item.products?.name}
                                    className="w-full h-full object-contain p-4 transition-transform group-hover:scale-110"
                                />
                            </div>

                            <div className="flex-1 sm:ml-8 text-center sm:text-left space-y-2">
                                <h3 className="text-lg font-bold text-industrial-900">{item.products?.name}</h3>
                                <p className="text-sm text-industrial-500 line-clamp-1">{item.products?.description}</p>
                                <div className="flex items-center justify-center sm:justify-start space-x-6 mt-4">
                                    <div className="flex items-center border border-industrial-200 rounded-lg overflow-hidden h-10">
                                        <button
                                            onClick={() => updateQuantity(item.id || item.product_id, Math.max(1, item.quantity - 1))}
                                            className="px-3 hover:bg-industrial-50"
                                        >-</button>
                                        <span className="px-4 font-bold">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id || item.product_id, item.quantity + 1)}
                                            className="px-3 hover:bg-industrial-50"
                                        >+</button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id || item.product_id)}
                                        className="text-red-400 hover:text-red-600 p-2 flex items-center text-sm font-semibold"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                                    </button>
                                </div>
                            </div>

                            <div className="sm:ml-8 mt-4 sm:mt-0 text-right">
                                <p className="text-lg font-bold text-industrial-900">₹{(item.products?.price * item.quantity).toLocaleString()}</p>
                                <p className="text-xs text-industrial-400">₹{item.products?.price.toLocaleString()} per unit</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="space-y-6">
                    <div className="bg-accent-dark text-white p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                        <h2 className="text-2xl font-bold">Order Summary</h2>

                        <div className="space-y-4 border-b border-white/10 pb-6">
                            <div className="flex justify-between text-industrial-300">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-industrial-300">
                                <span>GST (18%)</span>
                                <span>₹{gstAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-industrial-300">
                                <span>Shipping</span>
                                <span className="text-green-400">FREE</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-industrial-400 uppercase tracking-widest font-bold">Total Amount</p>
                                <p className="text-3xl font-bold text-white">₹{grandTotal.toLocaleString()}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full btn-primary py-4 text-lg flex items-center justify-center space-x-3 group bg-white text-accent-dark hover:bg-industrial-100 border-none"
                        >
                            <span>Checkout</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="flex items-center justify-center space-x-4 opacity-50 grayscale pt-4">
                            <CreditCard className="w-8 h-8" />
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                    </div>

                    <div className="p-6 bg-industrial-50 rounded-2xl border border-industrial-100 flex items-start space-x-4">
                        <ShieldCheck className="w-10 h-10 text-accent-blue" />
                        <div>
                            <h4 className="font-bold text-sm">Secure Checkout</h4>
                            <p className="text-xs text-industrial-500">Your transactions are protected with industry-standard 256-bit SSL encryption.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
