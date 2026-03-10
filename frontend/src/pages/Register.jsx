import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Building, Phone, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        company_name: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await register(formData);
        if (result.success) {
            toast.success('Account created! Please login.');
            navigate('/login');
        } else {
            toast.error(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-industrial-50 px-4 py-20">
            <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-industrial-100 p-12 md:p-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-industrial-900 mb-4">Create Your Account</h1>
                    <p className="text-industrial-500">Join our B2B network for world-class equipment and pricing.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-industrial-700">Full Name*</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-industrial-400" />
                                <input
                                    type="text"
                                    className="input-field pl-12 h-12"
                                    placeholder="John Doe"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-industrial-700">Business Email*</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-industrial-400" />
                                <input
                                    type="email"
                                    className="input-field pl-12 h-12"
                                    placeholder="john@company.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-industrial-700">Company Name</label>
                            <div className="relative">
                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-industrial-400" />
                                <input
                                    type="text"
                                    className="input-field pl-12 h-12"
                                    placeholder="Acme Industrial Ltd."
                                    value={formData.company_name}
                                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-industrial-700">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-industrial-400" />
                                <input
                                    type="tel"
                                    className="input-field pl-12 h-12"
                                    placeholder="+91 98765-43210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-industrial-700">Password*</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-industrial-400" />
                            <input
                                type="password"
                                className="input-field pl-12 h-12"
                                placeholder="Minimum 8 characters"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-4 text-lg flex items-center justify-center space-x-2 group mt-8"
                    >
                        <span>{loading ? 'Creating Account...' : 'Register Business'}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="text-center text-industrial-500 mt-12 pt-8 border-t border-industrial-100">
                    Already registered? <Link to="/login" className="text-accent-blue font-bold hover:underline">Log in to your workspace</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
