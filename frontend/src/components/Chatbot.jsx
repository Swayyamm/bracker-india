import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Bot, User, ShoppingCart } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const Chatbot = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm BrackerBot. How can I help you today? You can ask me to show products, add them to your cart, or view your cart.", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef();
    const { addToCart } = useCart();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        const query = input.trim();
        if (!query || loading) return;

        const userMsg = { text: query, isBot: false };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await api.post('/chatbot/query', { query: query });

            if (data.action === 'ADD_TO_CART' && data.data) {
                addToCart(data.data, 1);
            }
            if (data.action === 'NAVIGATE' && data.data) {
                navigate(data.data);
                setIsOpen(false);
            }

            setMessages(prev => [...prev, {
                text: data.response,
                isBot: true,
                action: data.action,
                actionData: data.data
            }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Protocol disruption: Unable to reach Bracker Intelligence. Please check your uplink.", isBot: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[60]">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-80 sm:w-96 h-[34rem] rounded-[2.5rem] shadow-2xl border border-industrial-100 flex flex-col overflow-hidden mb-6 animate-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-accent-dark p-6 text-white flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-accent-blue rounded-xl flex items-center justify-center">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold">BrackerBot</h4>
                                <div className="flex items-center text-[10px] text-green-400 font-bold uppercase tracking-wider">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 border-none"></span>
                                    AI Agent Online
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-industrial-50/50 custom-scrollbar">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`p-4 rounded-2xl max-w-[85%] text-sm shadow-sm whitespace-pre-wrap ${m.isBot
                                    ? 'bg-white text-industrial-800 rounded-tl-none border border-industrial-100'
                                    : 'bg-accent-blue text-white rounded-tr-none'
                                    }`}>
                                    {m.text}
                                    {m.action === 'SHOW_PRODUCTS' && m.actionData && (
                                        <div className="mt-4 flex flex-col space-y-3 pb-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                                            {m.actionData.map(product => (
                                                <div key={product.id} className="bg-white p-2 rounded-xl border border-industrial-200 flex items-center shadow-sm space-x-3">
                                                    <img
                                                        src={product.image_url || 'https://placehold.co/100x100?text=Equipment'}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-cover rounded-lg bg-industrial-50"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-xs font-bold text-industrial-800 truncate" title={product.name}>{product.name}</div>
                                                        <div className="text-xs text-accent-blue font-bold mt-0.5">₹{product.price}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => addToCart(product, 1)}
                                                        className="bg-industrial-800 text-white p-2 rounded-lg text-xs font-bold hover:bg-accent-blue transition flex items-center justify-center flex-shrink-0 active:scale-95"
                                                        title="Add to Cart"
                                                    >
                                                        <ShoppingCart className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-industrial-100 animate-pulse flex space-x-1.5 h-12 items-center">
                                    <div className="w-2 h-2 bg-accent-blue/50 rounded-full"></div>
                                    <div className="w-2 h-2 bg-accent-blue/50 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-accent-blue/50 rounded-full"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-industrial-100 flex items-center space-x-3">
                        <input
                            type="text"
                            className="flex-1 bg-industrial-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent-blue outline-none"
                            placeholder="Type to chat with AI..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" className="p-3 bg-accent-blue text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50" disabled={loading}>
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            )}

            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-5 rounded-3xl shadow-2xl transition-all duration-500 flex items-center space-x-3 group ${isOpen ? 'bg-red-500 text-white rotate-90' : 'bg-accent-blue text-white hover:scale-110 active:scale-95'}`}
            >
                {isOpen ? <X className="w-8 h-8" /> : (
                    <>
                        <MessageCircle className="w-8 h-8" />
                        {!isOpen && <span className="font-bold pr-2 hidden sm:inline">Ask AI Agent</span>}
                    </>
                )}
            </button>
        </div>
    );
};

export default Chatbot;
