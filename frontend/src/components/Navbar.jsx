import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Menu, X, Settings } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const { cartItems } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-accent-dark text-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-accent-blue rounded-lg flex items-center justify-center font-bold text-xl">B</div>
                        <span className="font-display font-bold text-xl tracking-tight">THE BRACKER <span className="text-accent-blue">INDIA</span></span>
                    </Link>

                    <div className="hidden md:flex space-x-8 items-center">
                        <Link to="/shop" className="hover:text-accent-blue transition-colors">Shop</Link>
                        <Link to="/about" className="hover:text-accent-blue transition-colors">About</Link>
                        <Link to="/contact" className="hover:text-accent-blue transition-colors">Contact</Link>

                        <div className="flex items-center space-x-4 border-l border-industrial-700 ml-4 pl-4">
                            <Link to="/cart" className="relative p-2 hover:bg-industrial-800 rounded-full transition-all">
                                <ShoppingCart className="w-6 h-6" />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-accent-blue text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <Link to={isAdmin ? "/admin" : "/profile"} className="flex items-center space-x-2 hover:text-accent-blue transition-colors">
                                        <User className="w-5 h-5" />
                                        <span>{user.name.split(' ')[0]}</span>
                                    </Link>
                                    <button onClick={handleLogout} className="p-2 hover:bg-red-500/20 text-red-400 rounded-full transition-all">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="btn-primary py-1.5 px-4">Login</Link>
                            )}
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-accent-dark border-t border-industrial-800 pb-4">
                    <div className="px-4 py-2 space-y-2">
                        <Link to="/shop" className="block py-2 hover:text-accent-blue">Shop</Link>
                        <Link to="/about" className="block py-2 hover:text-accent-blue">About</Link>
                        <Link to="/contact" className="block py-2 hover:text-accent-blue">Contact</Link>
                        <Link to="/cart" className="block py-2 hover:text-accent-blue">Cart ({cartItems.length})</Link>
                        {user ? (
                            <>
                                <Link to={isAdmin ? "/admin" : "/profile"} className="block py-2 hover:text-accent-blue">Dashboard</Link>
                                <button onClick={handleLogout} className="block w-full text-left py-2 text-red-400">Logout</button>
                            </>
                        ) : (
                            <Link to="/login" className="block py-2 text-accent-blue">Login</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
