import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCcw, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success(`${quantity} x ${product.name} added to cart!`);
    };

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-industrial-500 font-bold">Loading equipment details...</p>
        </div>
    );

    if (!product) return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h2 className="text-2xl font-bold">Product not found</h2>
            <Link to="/shop" className="text-accent-blue hover:underline mt-4 inline-block">Return to shop</Link>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <Link to="/shop" className="flex items-center text-industrial-500 hover:text-accent-blue mb-8 transition-colors group">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Catalogue
            </Link>

            <div className="grid md:grid-cols-2 gap-16">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-industrial-100 p-8 flex items-center justify-center">
                        <img
                            src={product.image_url || 'https://placehold.co/600x600?text=Industrial+Equipment'}
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Product Details */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center space-x-2 text-accent-blue font-bold text-sm uppercase mb-2">
                            <span>{product.categories?.name}</span>
                            <span>•</span>
                            <div className="flex items-center text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="ml-1 text-industrial-500">4.9 (12 Reviews)</span>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-industrial-900 mb-4">{product.name}</h1>
                        <p className="text-2xl font-bold text-accent-blue mb-6">₹{product.price.toLocaleString()}</p>
                        <p className="text-industrial-600 leading-relaxed text-lg">
                            {product.description}
                        </p>
                    </div>

                    <div className="bg-industrial-50 p-6 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-industrial-700 font-semibold">Quantity</span>
                            <div className="flex items-center bg-white border border-industrial-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 hover:bg-industrial-50 transition-colors"
                                >-</button>
                                <span className="px-6 py-2 font-bold min-w-[3rem] text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-2 hover:bg-industrial-50 transition-colors"
                                >+</button>
                            </div>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                            className="w-full btn-primary py-4 text-lg flex items-center justify-center space-x-3"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            <span>{product.stock > 0 ? 'Add to Quote/Cart' : 'Out of Stock'}</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { icon: ShieldCheck, text: "1 Year Warranty" },
                            { icon: Truck, text: "Fast Delivery" },
                            { icon: RefreshCcw, text: "Easy Returns" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center p-4 bg-white border border-industrial-100 rounded-xl text-center">
                                <item.icon className="w-6 h-6 text-accent-blue mb-2" />
                                <span className="text-xs font-semibold text-industrial-600">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-industrial-200 pt-8">
                        <h3 className="font-bold text-lg mb-4">Technical Specifications</h3>
                        <div className="bg-white border border-industrial-100 rounded-xl overflow-hidden">
                            {product.specifications ? (
                                <div className="p-6 text-industrial-700 whitespace-pre-wrap font-mono text-sm">
                                    {product.specifications}
                                </div>
                            ) : (
                                <div className="p-6 text-industrial-400 italic">No technical specifications provided for this model.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
