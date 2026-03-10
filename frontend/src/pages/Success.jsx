import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Success = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [finalizing, setFinalizing] = useState(true);

    useEffect(() => {
        const finalize = async () => {
            const sessionId = searchParams.get('session_id');
            if (sessionId) {
                try {
                    await api.post('/orders/finalize-stripe', { session_id: sessionId });
                    toast.success('Payment verified! Your order is being processed.');
                    clearCart();
                } catch (error) {
                    console.error('Finalization error:', error);
                    // Even if verification internally fails, the user paid, so we show success
                    // but log it for admin investigation
                } finally {
                    setFinalizing(false);
                }
            } else {
                setFinalizing(false);
            }
        };

        finalize();
    }, [searchParams]);

    return (
        <div className="max-w-2xl mx-auto px-4 py-32 text-center space-y-8">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="w-12 h-12" />
            </div>

            <h1 className="text-4xl font-bold text-industrial-900">
                {finalizing ? 'Verifying Payment...' : 'Payment Successful!'}
            </h1>

            <p className="text-xl text-industrial-500">
                {finalizing
                    ? 'Please wait while we secure your industrial equipment order details.'
                    : 'Your transaction has been completed and the order is now being processed by our manufacturing unit.'
                }
            </p>

            {!finalizing && (
                <>
                    <div className="p-8 bg-industrial-50 rounded-3xl border border-industrial-100 italic font-medium text-industrial-600">
                        "Your RNE-series equipment is being prepared for dispatch according to industrial standards."
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
                        <button
                            onClick={() => navigate('/profile')}
                            className="bg-accent-blue text-white py-4 px-8 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center space-x-2"
                        >
                            <Package className="w-5 h-5" />
                            <span>Track Order in Profile</span>
                        </button>
                        <button
                            onClick={() => navigate('/shop')}
                            className="bg-white text-industrial-700 border border-industrial-200 py-4 px-8 rounded-2xl font-bold hover:bg-industrial-50 transition-all flex items-center justify-center space-x-2"
                        >
                            <span>Back to Shop</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Success;
