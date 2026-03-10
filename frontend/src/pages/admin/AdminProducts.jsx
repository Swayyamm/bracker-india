import { useEffect, useState } from 'react';
import { Package, Plus, Search, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        price: '',
        stock: '',
        description: '',
        specifications: '',
        image_url: ''
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products/');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/products/categories');
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.patch(`/admin/products/${editingProduct.id}`, formData);
                toast.success('Product updated!');
            } else {
                await api.post('/admin/products', formData);
                toast.success('Product added!');
            }
            setShowModal(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/admin/products/${id}`);
                toast.success('Product deleted');
                fetchProducts();
            } catch (error) {
                toast.error('Deletion failed');
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category_id: product.category_id,
            price: product.price,
            stock: product.stock,
            description: product.description,
            specifications: product.specifications || '',
            image_url: product.image_url || ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            category_id: '',
            price: '',
            stock: '',
            description: '',
            specifications: '',
            image_url: ''
        });
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-industrial-900 mb-2">Inventory Control</h1>
                    <p className="text-industrial-500 font-medium">Manage your industrial equipment catalogue.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="btn-primary py-4 px-8 flex items-center justify-center space-x-3 rounded-2xl"
                >
                    <Plus className="w-6 h-6" />
                    <span>Add New Equipment</span>
                </button>
            </div>

            <div className="bg-white rounded-[3rem] shadow-sm border border-industrial-100 overflow-hidden">
                <div className="p-8 border-b border-industrial-50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-industrial-400 w-5 h-5" />
                        <input type="text" placeholder="Search inventory..." className="input-field pl-12 h-12 bg-industrial-50 border-none" />
                    </div>
                    <div className="flex items-center space-x-2 text-industrial-400 text-sm font-bold">
                        <Package className="w-5 h-5" />
                        <span>{products.length} Total Units</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-industrial-50 text-left">
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Product Info</th>
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Price</th>
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Stock</th>
                                <th className="px-8 py-5 text-xs font-bold text-industrial-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-industrial-50">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-industrial-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-industrial-100 rounded-xl overflow-hidden flex items-center justify-center">
                                                <img src={product.image_url} alt="" className="w-10 h-10 object-contain" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-industrial-900">{product.name}</p>
                                                <p className="text-xs text-industrial-400 font-mono">ID: {product.id.substring(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-semibold text-industrial-600">{product.categories?.name}</td>
                                    <td className="px-8 py-6 font-bold text-accent-blue">₹{product.price.toLocaleString()}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-2">
                                            <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            <span className="font-bold text-sm tracking-tight">{product.stock} units</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => handleEdit(product)} className="p-2 hover:bg-industrial-100 rounded-lg text-industrial-400 hover:text-industrial-900 transition-all">
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 text-red-100 hover:text-red-500 rounded-lg transition-all">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-accent-dark/80 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 bg-industrial-900 text-white flex items-center justify-between">
                            <h2 className="text-2xl font-bold">{editingProduct ? 'Edit Equipment' : 'Add New Equipment'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 grid md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-bold text-industrial-700 block mb-2">Equipment Name</label>
                                    <input type="text" required className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-industrial-700 block mb-2">Category</label>
                                    <select required className="input-field" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}>
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold text-industrial-700 block mb-2">Price (INR)</label>
                                        <input type="number" required className="input-field" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-industrial-700 block mb-2">Stock Level</label>
                                        <input type="number" required className="input-field" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-industrial-700 block mb-2">Short Description</label>
                                    <textarea rows="3" required className="input-field" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-bold text-industrial-700 block mb-2">Image URL</label>
                                    <div className="flex items-center space-x-3">
                                        <input type="text" className="input-field" placeholder="https://..." value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} />
                                        <div className="w-12 h-12 bg-industrial-100 rounded-xl flex items-center justify-center text-industrial-300">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-industrial-700 block mb-2">Technical Specifications</label>
                                    <textarea rows="8" className="input-field font-mono text-xs" placeholder="Weight: 45kg\nPressure: 6 bar..." value={formData.specifications} onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}></textarea>
                                </div>
                            </div>

                            <div className="md:col-span-2 flex justify-end space-x-4 pt-8 border-t border-industrial-100">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary py-3 px-8">Cancel</button>
                                <button type="submit" className="btn-primary py-3 px-12 text-lg">Save Terminal Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
