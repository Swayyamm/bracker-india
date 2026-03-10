import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
        toast.success(`${product.name} added to cart!`);
    };

    return (
        <div className="card group">
            <div className="relative aspect-square overflow-hidden bg-industrial-50">
                <img
                    src={product.image_url || 'https://placehold.co/400x400?text=Industrial+Equipment'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-accent-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                    <Link
                        to={`/product/${product.id}`}
                        className="p-3 bg-white text-accent-dark rounded-full hover:bg-accent-blue hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0"
                    >
                        <Eye className="w-5 h-5" />
                    </Link>
                    <button
                        onClick={handleAddToCart}
                        className="p-3 bg-white text-accent-dark rounded-full hover:bg-accent-blue hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 delay-75"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="p-4">
                <div className="text-xs font-bold text-accent-blue uppercase tracking-wider mb-1">
                    {product.categories?.name || 'Equipment'}
                </div>
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-bold text-industrial-900 mb-1 line-clamp-1 group-hover:text-accent-blue transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-sm text-industrial-500 line-clamp-2 mb-4">
                    {product.description}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-industrial-900">
                        ₹{product.price.toLocaleString()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
