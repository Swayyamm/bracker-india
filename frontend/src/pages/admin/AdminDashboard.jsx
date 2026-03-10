import { useEffect, useState } from 'react';
import { TrendingUp, ShoppingBag, Package, Users, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total_sales: 0,
        total_orders: 0,
        total_products: 0,
        total_users: 0,
        sales_distribution: {}
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const chartData = {
        labels: Object.keys(stats.sales_distribution),
        datasets: [
            {
                label: 'Daily Revenue',
                data: Object.values(stats.sales_distribution),
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: '#3b82f6',
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#111827',
                titleFont: { size: 14, weight: 'bold' },
                padding: 12,
                cornerRadius: 12,
                displayColors: false,
                callbacks: {
                    label: (context) => `₹${context.parsed.y.toLocaleString()}`
                }
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } },
            y: { grid: { borderDash: [5, 5] }, ticks: { callback: (v) => `₹${v / 1000}k` } }
        }
    };

    const statCards = [
        { title: 'Total Revenue', value: `₹${stats.total_sales.toLocaleString()}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+12.5%' },
        { title: 'Total Orders', value: stats.total_orders, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-100', trend: '+5.2%' },
        { title: 'Active Products', value: stats.total_products, icon: Package, color: 'text-orange-600', bg: 'bg-orange-100', trend: '-2.1%' },
        { title: 'Registered Users', value: stats.total_users, icon: Users, color: 'text-green-600', bg: 'bg-green-100', trend: '+8.4%' },
    ];

    const handleExportReport = async (reportType) => {
        try {
            const response = await api.get(`/admin/reports/${reportType}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${reportType}_report.csv`);
            document.body.appendChild(link);
            link.click();
            toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported!`);
        } catch (error) {
            toast.error('Failed to export report');
        }
    };

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold text-industrial-900 mb-2">Management Workspace</h1>
                <p className="text-industrial-500 font-medium">Overview of Bracker India's business performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-industrial-100 space-y-4 hover:shadow-xl transition-all duration-300">
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-industrial-400 uppercase tracking-widest">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-industrial-900 mt-1">{stat.value}</h3>
                        </div>
                        <div className={`flex items-center text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                            {stat.trend.startsWith('+') ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                            {stat.trend} from last month
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-industrial-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold flex items-center">
                            <BarChart3 className="w-6 h-6 mr-3 text-accent-blue" />
                            Sales Distribution
                        </h2>
                        <select className="bg-industrial-50 border-none rounded-lg px-4 py-2 text-xs font-bold font-mono">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-center justify-center">
                        {Object.keys(stats.sales_distribution).length > 0 ? (
                            <Line data={chartData} options={chartOptions} />
                        ) : (
                            <div className="text-industrial-400 font-bold italic">No sales data available for this period</div>
                        )}
                    </div>
                </div>

                <div className="bg-accent-dark text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/20 rounded-full blur-3xl"></div>
                    <h2 className="text-2xl font-bold mb-8 relative z-10">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        {[
                            { label: 'Inventory Report', action: () => handleExportReport('inventory') },
                            { label: 'Sales Report', action: () => handleExportReport('sales') },
                            { label: 'Users Report', action: () => handleExportReport('users') },
                            { label: 'Orders Report', action: () => handleExportReport('orders') },
                            { label: 'Add Product', path: '/admin/products' },
                            { label: 'Update Stock', path: '/admin/products' },
                        ].map((btn, idx) => (
                            <button
                                key={idx}
                                onClick={btn.action ? btn.action : () => navigate(btn.path)}
                                className="p-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/10 transition-all text-left font-bold text-sm"
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
