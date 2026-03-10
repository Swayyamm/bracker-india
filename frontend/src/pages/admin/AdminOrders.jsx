import { useEffect, useState } from 'react';
import { ShoppingCart, Search, Eye, Download, Edit3, X } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/admin/orders');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/admin/orders/${selectedOrder.id}/status`, { status: newStatus });
            toast.success('Order status updated!');
            setShowStatusModal(false);
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
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
        } catch (error) {
            toast.error('Failed to download invoice');
        }
    };

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold text-industrial-900 mb-2">Order Management</h1>
                <p className="text-industrial-500 font-medium">Monitor and process industrial equipment fulfillment.</p>
            </div>

            <div className="bg-white rounded-[3rem] shadow-sm border border-industrial-100 overflow-hidden">
                <div className="p-8 border-b border-industrial-50 flex items-center justify-between">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-industrial-400 w-5 h-5" />
                        <input type="text" placeholder="Search orders by ID or customer..." className="input-field pl-12 h-12 bg-industrial-50 border-none" />
                    </div>
                    <div className="flex items-center space-x-2 text-industrial-400 text-sm font-bold">
                        <ShoppingCart className="w-5 h-5" />
                        <span>{orders.length} Active Orders</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-industrial-50 text-left">
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Order Details</th>
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Customer</th>
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-industrial-50">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-industrial-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <p className="font-mono text-sm font-bold text-industrial-900">#{order.id.substring(0, 8)}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-industrial-900">{order.users?.name}</p>
                                        <p className="text-xs text-industrial-400">{order.users?.email}</p>
                                    </td>
                                    <td className="px-8 py-6 font-bold text-accent-blue">₹{order.total_amount.toLocaleString()}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-industrial-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => { setSelectedOrder(order); setNewStatus(order.status); setShowStatusModal(true); }}
                                                className="p-2 hover:bg-industrial-100 rounded-lg text-industrial-400 hover:text-industrial-900 transition-all"
                                                title="Update Status"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDownloadInvoice(order.id)}
                                                className="p-2 hover:bg-accent-blue/10 rounded-lg text-accent-blue transition-all"
                                                title="Download Invoice"
                                            >
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Status Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-accent-dark/80 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 bg-industrial-900 text-white flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Update Status</h2>
                            <button onClick={() => setShowStatusModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                                <X className="w-8 h-8" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateStatus} className="p-10 space-y-6">
                            <div>
                                <label className="text-sm font-bold text-industrial-700 block mb-2">Order ID</label>
                                <p className="font-mono text-industrial-500">#{selectedOrder.id}</p>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-industrial-700 block mb-2">Order Status</label>
                                <select
                                    className="input-field"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full btn-primary py-4 text-lg">Update Order State</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
