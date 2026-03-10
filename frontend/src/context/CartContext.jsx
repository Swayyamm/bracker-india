import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const { data } = await api.get('/cart/');
            setCartItems(data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const addToCart = async (product, quantity = 1) => {
        try {
            if (user) {
                await api.post('/cart/add', { product_id: product.id, quantity });
                fetchCart();
            } else {
                // Local cart for guest users (optional but good for UX)
                setCartItems(prev => {
                    const existing = prev.find(item => item.product_id === product.id);
                    if (existing) {
                        return prev.map(item => item.product_id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item);
                    }
                    return [...prev, { product_id: product.id, product, quantity }];
                });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            if (user) {
                await api.patch(`/cart/update/${itemId}`, { quantity });
                fetchCart();
            } else {
                setCartItems(prev => prev.map(item => item.product_id === itemId ? { ...item, quantity } : item));
            }
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            if (user) {
                await api.delete(`/cart/remove/${itemId}`);
                fetchCart();
            } else {
                setCartItems(prev => prev.filter(item => item.product_id !== itemId));
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const clearCart = async () => {
        try {
            if (user) {
                await api.delete('/cart/clear');
                setCartItems([]);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const cartTotal = cartItems.reduce((total, item) => total + (item.products?.price * item.quantity), 0);
    const gstAmount = cartTotal * 0.18;
    const grandTotal = cartTotal + gstAmount;

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, gstAmount, grandTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
