import { useEffect, useState } from 'react';
import { Users, Search, Mail, Phone, Building, Shield, User as UserIcon } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.company_name && user.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold text-industrial-900 mb-2">User Directory</h1>
                <p className="text-industrial-500 font-medium">Manage corporate accounts and administrative access.</p>
            </div>

            <div className="bg-white rounded-[3rem] shadow-sm border border-industrial-100 overflow-hidden">
                <div className="p-8 border-b border-industrial-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-industrial-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email or company..."
                            className="input-field pl-12 h-12 bg-industrial-50 border-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2 text-industrial-400 text-sm font-bold uppercase tracking-widest">
                        <Users className="w-5 h-5" />
                        <span>{filteredUsers.length} Registered Users</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-industrial-50/50">
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Member</th>
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Company & Contact</th>
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Role</th>
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Registered</th>
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-industrial-50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-8 py-6 h-24 bg-industrial-50/20"></td>
                                    </tr>
                                ))
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-industrial-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-accent-blue/10 text-accent-blue rounded-2xl flex items-center justify-center font-bold text-lg">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-industrial-900">{user.name}</p>
                                                <p className="text-xs text-industrial-500 flex items-center mt-1">
                                                    <Mail className="w-3 h-3 mr-1" /> {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div>
                                            <p className="text-sm font-bold text-industrial-700 flex items-center">
                                                <Building className="w-3.5 h-3.5 mr-2 text-industrial-400" />
                                                {user.company_name || 'Individual'}
                                            </p>
                                            <p className="text-xs text-industrial-500 flex items-center mt-1">
                                                <Phone className="w-3 h-3 mr-2" /> {user.phone || 'N/A'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-industrial-100 text-industrial-700'
                                            }`}>
                                            <Shield className="w-3 h-3 mr-1.5" />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-industrial-500">
                                        {new Date(user.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="flex items-center text-xs font-bold text-green-500 uppercase tracking-tighter">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!loading && filteredUsers.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-industrial-50 text-industrial-300 rounded-full flex items-center justify-center mx-auto">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-industrial-900">No users found</h3>
                        <p className="text-industrial-500">Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
