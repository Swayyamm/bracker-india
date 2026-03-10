import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Package, Download, User as UserIcon, Building, Phone, Mail, Clock, Settings } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user } = useAuth();
    const { clearCart } = useCart();
    const [searchParams] = useSearchParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}/invoice`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice_${orderId.substring(0, 8)}.pdf`);
            document.body.appendChild(link);
            link.click();
            toast.success('Invoice downloaded!');
        } catch (error) {
            toast.error('Failed to download invoice');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-3 gap-12">
                {/* User Card */}
                <div className="space-y-8">
                    <div className="bg-accent-dark text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/20 rounded-full blur-2xl"></div>
                        <div className="flex items-center space-x-6 mb-10">
                            <div className="w-20 h-20 bg-accent-blue rounded-3xl flex items-center justify-center text-3xl font-bold border-4 border-white/10">
                                {user?.name[0]}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{user?.name}</h2>
                                <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest inline-block mt-2">
                                    {user?.role} Account
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <Mail className="w-5 h-5 text-accent-blue" />
                                <span className="text-industrial-300">{user?.email}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Building className="w-5 h-5 text-accent-blue" />
                                <span className="text-industrial-300">{user?.company_name || 'Individual'}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Phone className="w-5 h-5 text-accent-blue" />
                                <span className="text-industrial-300">{user?.phone || 'Not provided'}</span>
                            </div>
                        </div>

                        <button className="w-full mt-10 py-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-sm font-bold transition-all">
                            Edit Business Profile
                        </button>

                        {user?.role === 'admin' && (
                            <Link
                                to="/admin"
                                className="w-full mt-4 py-3 bg-accent-blue hover:bg-blue-600 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20"
                            >
                                <Settings className="w-4 h-4" />
                                <span>Go to Admin Workspace</span>
                            </Link>
                        )}
                    </div>

                    <div className="bg-industrial-50 p-8 rounded-[2.5rem] border border-industrial-100">
                        <h3 className="font-bold text-lg mb-6 flex items-center">
                            <Clock className="w-5 h-5 mr-3 text-accent-blue" />
                            Recent Activity
                        </h3>
                        <div className="space-y-6">
                            {orders.slice(0, 3).map(order => (
                                <div key={order.id} className="flex items-center justify-between">
                                    <div className="text-xs">
                                        <p className="font-bold text-industrial-800">Order Placed</p>
                                        <p className="text-industrial-400">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className="text-xs font-bold text-accent-blue">₹{order.total_amount.toLocaleString()}</span>
                                </div>
                            ))}
                            {orders.length === 0 && <p className="text-center text-sm text-industrial-400 italic py-4">No recent activity</p>}
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold text-industrial-900 mb-2">Order History</h2>
                        <p className="text-industrial-500">Track your industrial equipment orders and download invoices.</p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-industrial-100 overflow-hidden">
                        {loading ? (
                            <div className="p-20 text-center animate-pulse text-industrial-300">
                                <Package className="w-16 h-16 mx-auto mb-4" />
                                <p className="font-bold">Syncing order data...</p>
                            </div>
                        ) : orders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-industrial-50 text-left">
                                            <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Order ID</th>
                                            <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Date</th>
                                            <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Amount</th>
                                            <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-industrial-50">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-industrial-50/50 transition-colors">
                                                <td className="px-8 py-6 font-mono text-sm text-industrial-600">#{order.id.substring(0, 8)}</td>
                                                <td className="px-8 py-6 text-sm font-semibold">{new Date(order.created_at).toLocaleDateString()}</td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 font-bold">₹{order.total_amount.toLocaleString()}</td>
                                                <td className="px-8 py-6">
                                                    <button
                                                        onClick={() => handleDownloadInvoice(order.id)}
                                                        className="bg-accent-blue/10 text-accent-blue p-2 rounded-lg hover:bg-accent-blue hover:text-white transition-all group"
                                                        title="Download Invoice"
                                                    >
                                                        <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-20 text-center space-y-4">
                                <div className="w-20 h-20 bg-industrial-50 rounded-full flex items-center justify-center mx-auto text-industrial-200">
                                    <Package className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold">No orders found</h3>
                                <p className="text-industrial-500">You haven't placed any orders yet.</p>
                                <Link to="/shop" className="btn-primary py-2 px-6 inline-block">Start Shopping</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
