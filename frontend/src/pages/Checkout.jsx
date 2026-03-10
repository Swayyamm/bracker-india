import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, MapPin, Truck, CreditCard, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cartItems, grandTotal, cartTotal, gstAmount } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' or 'cod'
    const [address, setAddress] = useState({
        line1: '',
        city: '',
        state: '',
        postalCode: '',
        company: ''
    });

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!address.line1 || !address.city || !address.postalCode) {
            toast.error('Please fill in required address fields');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.products.price
                })),
                address: address,
                payment_method: paymentMethod
            };

            const { data } = await api.post('/orders/checkout', orderData);

            if (data.method === 'stripe' && data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                setSuccess(true);
                toast.success(data.message || 'Order placed successfully!');
                setTimeout(() => navigate('/profile'), 3000);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-32 text-center space-y-8">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-bold text-industrial-900">Thank You for Your Order!</h1>
                <p className="text-xl text-industrial-500">Your order has been placed successfully. You will receive an email confirmation shortly.</p>
                <div className="p-8 bg-industrial-50 rounded-3xl border border-industrial-100 italic font-medium text-industrial-600">
                    "The Bracker India team is now preparing your industrial equipment for dispatch."
                </div>
                <div className="flex justify-center space-x-4">
                    <button onClick={() => navigate('/profile')} className="btn-primary py-3 px-8">View My Orders</button>
                    <button onClick={() => navigate('/')} className="btn-secondary py-3 px-8">Back to Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <button onClick={() => navigate('/cart')} className="flex items-center text-industrial-500 hover:text-accent-blue mb-8 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Cart
            </button>

            <div className="grid lg:grid-cols-2 gap-16">
                {/* Shipping Form */}
                <div className="space-y-12">
                    <section>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-10 h-10 bg-accent-blue text-white rounded-lg flex items-center justify-center">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-bold">Shipping Information</h2>
                        </div>

                        <form className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-industrial-700 mb-2">Company Name (Optional)</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={address.company}
                                    onChange={(e) => setAddress({ ...address, company: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-industrial-700 mb-2">Address Line 1*</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    required
                                    value={address.line1}
                                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-industrial-700 mb-2">City*</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    required
                                    value={address.city}
                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-industrial-700 mb-2">State*</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    required
                                    value={address.state}
                                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-industrial-700 mb-2">Postal Code*</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    required
                                    value={address.postalCode}
                                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                                />
                            </div>
                        </form>
                    </section>

                    <section>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-10 h-10 bg-accent-blue text-white rounded-lg flex items-center justify-center">
                                <Truck className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-bold">Delivery Method</h2>
                        </div>
                        <div className="p-6 bg-white border-2 border-accent-blue rounded-2xl flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-4 h-4 rounded-full border-4 border-accent-blue bg-white"></div>
                                <div>
                                    <p className="font-bold">Standard Ground Shipping</p>
                                    <p className="text-sm text-industrial-500">Delivered in 5-7 business days</p>
                                </div>
                            </div>
                            <span className="font-bold text-green-600">FREE</span>
                        </div>
                    </section>
                </div>

                {/* Order Review */}
                <div>
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-industrial-100 sticky top-24">
                        <h3 className="text-2xl font-bold mb-8">Order Review</h3>

                        <div className="space-y-6 mb-12 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center bg-industrial-50/50 p-4 rounded-xl">
                                    <div className="flex items-center space-x-4">
                                        <img src={item.products?.image_url} alt="" className="w-12 h-12 object-contain bg-white rounded-lg" />
                                        <div>
                                            <p className="font-bold text-sm line-clamp-1">{item.products?.name}</p>
                                            <p className="text-xs text-industrial-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-sm">₹{(item.products?.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 border-t border-industrial-100 pt-8 mb-8">
                            <h4 className="text-sm font-bold text-industrial-700 uppercase tracking-widest">Select Payment Method</h4>
                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={() => setPaymentMethod('stripe')}
                                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${paymentMethod === 'stripe' ? 'border-accent-blue bg-accent-blue/5' : 'border-industrial-100 bg-white'}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-4 h-4 rounded-full border-4 ${paymentMethod === 'stripe' ? 'border-accent-blue' : 'border-industrial-300'}`}></div>
                                        <span className="font-bold text-sm">Online Payment (Stripe)</span>
                                    </div>
                                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'stripe' ? 'text-accent-blue' : 'text-industrial-400'}`} />
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${paymentMethod === 'cod' ? 'border-accent-blue bg-accent-blue/5' : 'border-industrial-100 bg-white'}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-4 h-4 rounded-full border-4 ${paymentMethod === 'cod' ? 'border-accent-blue' : 'border-industrial-300'}`}></div>
                                        <span className="font-bold text-sm">Cash on Delivery</span>
                                    </div>
                                    <Truck className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-accent-blue' : 'text-industrial-400'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-industrial-100 pt-8 mb-10">
                            <div className="flex justify-between">
                                <span className="text-industrial-600">Subtotal</span>
                                <span className="font-semibold">₹{cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-industrial-600">GST (18%)</span>
                                <span className="font-semibold">₹{gstAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold pt-4 border-t border-dashed border-industrial-200">
                                <span>Total Amount</span>
                                <span className="text-accent-blue">₹{grandTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="w-full btn-primary py-5 text-xl flex items-center justify-center space-x-3 shadow-2xl shadow-blue-500/40"
                        >
                            <CreditCard className="w-6 h-6" />
                            <span>{loading ? 'Processing...' : 'Place Order & Pay'}</span>
                        </button>
                        <p className="text-center text-xs text-industrial-400 mt-6">
                            By placing an order, you agree to our Terms of Sale and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
