import { useEffect, useState } from 'react';
import { Layers, Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/products/categories');
            setCategories(data);
        } catch (error) {
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await api.patch(`/admin/categories/${editingCategory.id}`, formData);
                toast.success('Category updated!');
            } else {
                await api.post('/admin/categories', formData);
                toast.success('Category added!');
            }
            setShowModal(false);
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save category');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This might affect products in this category.')) return;
        try {
            await api.delete(`/admin/categories/${id}`);
            toast.success('Category deleted');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, description: category.description || '' });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
        }
        setShowModal(true);
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-industrial-900 mb-2">Category Management</h1>
                    <p className="text-industrial-500 font-medium">Organize your industrial catalogue structure.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="btn-primary py-4 px-8 flex items-center space-x-2 shadow-xl shadow-blue-500/20"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create Category</span>
                </button>
            </div>

            <div className="bg-white rounded-[3rem] shadow-sm border border-industrial-100 overflow-hidden">
                <div className="p-8 border-b border-industrial-50 flex items-center justify-between bg-industrial-50/30">
                    <div className="flex items-center space-x-2 text-industrial-400 text-sm font-bold uppercase tracking-widest">
                        <Layers className="w-5 h-5" />
                        <span>{categories.length} Categories Defined</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-industrial-50/50 text-left">
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Category Name</th>
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Description</th>
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-industrial-50">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="3" className="px-8 py-6 h-20 bg-industrial-50/20"></td>
                                    </tr>
                                ))
                            ) : categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-industrial-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-industrial-900">{cat.name}</p>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-industrial-500 max-w-md">
                                        {cat.description || <span className="italic opacity-50">No description provided</span>}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => openModal(cat)}
                                                className="p-2 hover:bg-industrial-100 rounded-lg text-industrial-400 hover:text-industrial-900 transition-all"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg text-industrial-400 hover:text-red-600 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-accent-dark/80 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 bg-industrial-900 text-white flex items-center justify-between">
                            <h2 className="text-2xl font-bold">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                                <X className="w-8 h-8" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-industrial-700">Category Name</label>
                                <input
                                    type="text"
                                    className="input-field h-14"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-industrial-700">Description</label>
                                <textarea
                                    className="input-field py-4 min-h-[120px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full btn-primary py-5 text-xl mt-4">
                                {editingCategory ? 'Update Category' : 'Create Category'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
