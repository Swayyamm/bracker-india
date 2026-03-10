import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        toast.success('Reset link sent to your business email!');
        setSubmitted(true);
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center bg-industrial-50 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-industrial-100 p-12">
                {!submitted ? (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-industrial-900 mb-2">Reset Password</h2>
                            <p className="text-industrial-500">Enter your business email and we'll send you a link to reset your password.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-industrial-700">Business Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-industrial-400" />
                                    <input
                                        type="email"
                                        className="input-field pl-12 h-14"
                                        placeholder="name@company.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full btn-primary py-4 text-lg flex items-center justify-center space-x-2 group"
                            >
                                <span>Send Reset Link</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <Link to="/login" className="flex items-center justify-center text-industrial-500 hover:text-accent-blue font-bold text-sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Sign In
                        </Link>
                    </div>
                ) : (
                    <div className="text-center space-y-8">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-industrial-900">Check Your Email</h2>
                        <p className="text-industrial-500">
                            We've sent a password reset link to <span className="font-bold text-industrial-900">{email}</span>. Please check your inbox and follow the instructions.
                        </p>
                        <Link to="/login" className="btn-primary py-3 px-8 inline-block">Return to Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
