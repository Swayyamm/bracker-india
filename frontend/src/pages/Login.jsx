import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(email, password);
        if (result.success) {
            toast.success('Welcome back!');

            // Check if the logged-in user is an admin
            // We need to check the user object from the result or storage
            // login function in AuthContext updates the state, but result doesn't return user
            // We can check if redirectPath is '/' and user is admin
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser?.role === 'admin' && redirectPath === '/') {
                navigate('/admin');
            } else {
                navigate(redirectPath);
            }
        } else {
            toast.error(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center bg-industrial-50 px-4 py-12">
            <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-industrial-100">
                <div className="bg-accent-dark p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center space-x-2 mb-12">
                            <div className="w-10 h-10 bg-accent-blue rounded-lg flex items-center justify-center font-bold text-xl">B</div>
                            <span className="font-display font-bold text-2xl tracking-tight uppercase">The Bracker India</span>
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">Access India's Leading Industrial Hub</h1>
                        <p className="text-industrial-400 text-lg">Manage orders, track shipping, and access exclusive B2B pricing for all your industrial needs.</p>
                    </div>
                    <div className="flex items-center space-x-4 text-industrial-500 relative z-10">
                        <ShieldCheck className="w-8 h-8 text-accent-blue" />
                        <span className="text-sm">Secure biometric-grade encryption for all transactions</span>
                    </div>
                </div>

                <div className="p-12 md:p-20">
                    <div className="max-w-md mx-auto space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-industrial-900 mb-2">Welcome Back</h2>
                            <p className="text-industrial-500">Please enter your credentials to continue.</p>
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

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-industrial-700">Password</label>
                                    <Link to="/forgot-password" size="sm" className="text-accent-blue text-sm font-bold hover:underline">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-industrial-400" />
                                    <input
                                        type="password"
                                        className="input-field pl-12 h-14"
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-4 text-lg flex items-center justify-center space-x-2 group"
                            >
                                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <div className="text-center text-industrial-500">
                            Don't have an account? <Link to="/register" className="text-accent-blue font-bold hover:underline">Register your company</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
