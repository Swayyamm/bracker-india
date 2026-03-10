import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, ChevronRight, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { title: 'Overview', icon: LayoutDashboard, path: '/admin' },
        { title: 'Categories', icon: Layers, path: '/admin/categories' },
        { title: 'Inventory', icon: Package, path: '/admin/products' },
        { title: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
        { title: 'Users', icon: Users, path: '/admin/users' },
    ];

    return (
        <aside className="w-80 h-screen sticky top-0 bg-accent-dark text-white p-8 flex flex-col justify-between hidden lg:flex">
            <div>
                <div className="flex items-center space-x-3 mb-12">
                    <div className="w-10 h-10 bg-accent-blue rounded-xl flex items-center justify-center font-bold text-xl">A</div>
                    <p className="font-display font-bold text-lg tracking-tight">BRACKER <span className="text-accent-blue font-bold">ADMIN</span></p>
                </div>

                <nav className="space-y-4">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.title}
                                to={item.path}
                                className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${isActive ? 'bg-accent-blue text-white shadow-xl shadow-blue-500/20' : 'hover:bg-white/5 text-industrial-400 hover:text-white'}`}
                            >
                                <div className="flex items-center space-x-4">
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-bold">{item.title}</span>
                                </div>
                                {isActive && <ChevronRight className="w-4 h-4" />}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <p className="text-xs font-bold text-industrial-500 uppercase tracking-widest mb-2">System Status</p>
                    <div className="flex items-center text-sm font-bold text-green-400">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Operational
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center space-x-4 p-4 w-full text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-bold"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
