import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, PackageSearch, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/products/categories');
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async (catId = selectedCategory, searchTerm = search) => {
        setLoading(true);
        try {
            const params = {};
            if (catId) params.category_id = catId;
            if (searchTerm) params.search = searchTerm;

            const { data } = await api.get('/products/', { params });
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    const handleCategoryChange = (catId) => {
        setSelectedCategory(catId);
        fetchProducts(catId, search);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-industrial-900 mb-2">Industrial Catalogue</h1>
                    <p className="text-industrial-500">Find the right equipment for your assembly line.</p>
                </div>

                <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="input-field pl-12 h-14"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-industrial-400 w-5 h-5" />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary py-1.5 px-4 text-sm">
                        Search
                    </button>
                </form>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 space-y-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Filter className="w-5 h-5 text-accent-blue" />
                            <h3 className="font-bold text-lg">Categories</h3>
                        </div>
                        <div className="space-y-2">
                            <button
                                onClick={() => handleCategoryChange('')}
                                className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${!selectedCategory ? 'bg-accent-blue text-white shadow-md' : 'hover:bg-industrial-100 text-industrial-600'}`}
                            >
                                All Products
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${selectedCategory === cat.id ? 'bg-accent-blue text-white shadow-md' : 'hover:bg-industrial-100 text-industrial-600'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-industrial-900 rounded-2xl text-white">
                        <h4 className="font-bold mb-2">Need a Bulk Order?</h4>
                        <p className="text-xs text-industrial-400 mb-4">Contact our B2B team for special commercial pricing and GST invoicing.</p>
                        <Link to="/contact" className="text-accent-blue font-bold text-sm flex items-center hover:underline">
                            Enquire Now <ArrowRight className="ml-1 w-3 h-3" />
                        </Link>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-industrial-100">
                        <div className="flex items-center space-x-2 text-industrial-500 text-sm">
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>Showing {products.length} products</span>
                        </div>
                        <select className="bg-transparent border-none text-sm font-bold text-industrial-900 outline-none cursor-pointer">
                            <option>Newest Arrivals</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="animate-pulse bg-industrial-50 rounded-xl h-96"></div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-industrial-50 rounded-[3rem] border-2 border-dashed border-industrial-200">
                            <PackageSearch className="w-16 h-16 text-industrial-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-industrial-900 mb-2">No products found</h3>
                            <p className="text-industrial-500">Try adjusting your filters or search terms.</p>
                            <button onClick={() => { setSearch(''); handleCategoryChange(''); }} className="mt-6 text-accent-blue font-bold">
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
