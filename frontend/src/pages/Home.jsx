import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Clock, Award } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data } = await api.get('/products/featured');
                setFeaturedProducts(data);
            } catch (error) {
                console.error('Error fetching featured products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center overflow-hidden bg-accent-dark">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
                        alt="Industrial Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="max-w-7xl mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="inline-block px-4 py-1.5 bg-accent-blue/20 border border-accent-blue/30 rounded-full text-accent-blue font-bold text-sm uppercase tracking-widest animate-pulse">
                            Precision Industrial Solutions
                        </div>
                        <h1 className="text-5xl md:text-7xl text-white leading-tight">
                            Powering India's <span className="text-accent-blue">Industrial</span> Revolution
                        </h1>
                        <p className="text-xl text-industrial-300 max-w-lg">
                            The Bracker India provides world-class riveting machines, automation parts, and expert engineering services for modern manufacturing.
                        </p>
                        <div className="flex space-x-4">
                            <Link to="/shop" className="btn-primary py-4 px-8 text-lg flex items-center group">
                                Shop Equipment <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/contact" className="btn-secondary bg-transparent border border-industrial-600 text-white hover:bg-white/10 py-4 px-8 text-lg">
                                Get a Quote
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { icon: ShieldCheck, title: "Quality Assured", desc: "Certified Precision" },
                        { icon: Truck, title: "Pan-India Shipping", desc: "Fast & Secure" },
                        { icon: Clock, title: "24/7 Support", desc: "Technical Assistance" },
                        { icon: Award, title: "Industry Leader", desc: "20+ Years Expertise" }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-xl shadow-xl border border-industrial-50 flex flex-col items-center text-center space-y-3">
                            <div className="p-3 bg-industrial-50 text-accent-blue rounded-lg">
                                <item.icon className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-industrial-900">{item.title}</h3>
                            <p className="text-xs text-industrial-500 uppercase tracking-tighter">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Featured Equipment</h2>
                        <div className="w-20 h-1.5 bg-accent-blue rounded-full"></div>
                    </div>
                    <Link to="/shop" className="text-accent-blue font-bold flex items-center hover:underline">
                        View All Products <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="animate-pulse bg-industrial-50 rounded-xl h-96"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-industrial-500">
                                No products found. Checkout our admin panel to add some!
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* About Section */}
            <section className="bg-industrial-50 py-24">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80"
                            alt="Industrial Engineering"
                            className="rounded-3xl shadow-2xl relative z-10"
                        />
                        <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-accent-blue rounded-3xl -z-0"></div>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-accent-blue font-bold uppercase tracking-widest">Our Legacy</h4>
                        <h2 className="text-4xl font-bold leading-tight">Decades of Engineering <br />Excellence in India</h2>
                        <p className="text-lg text-industrial-600">
                            The Bracker India has been a pioneer in bringing advanced riveting technology and industrial automation to the Indian sub-continent. We don't just sell machines; we provide comprehensive solutions that optimize production lines.
                        </p>
                        <ul className="space-y-4">
                            {['Original Bracker Riveting Machines', 'Customized Automation Solutions', 'Precision Tooling & Components', 'Expert Maintenance & Training'].map((text, idx) => (
                                <li key={idx} className="flex items-center space-x-3 text-industrial-800 font-semibold">
                                    <div className="w-6 h-6 bg-accent-blue/10 text-accent-blue rounded-full flex items-center justify-center">✓</div>
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="btn-primary py-4 px-8 mt-4">Learn More About Us</button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="bg-accent-dark rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold">Ready to Elevate Your Production?</h2>
                        <p className="text-xl text-industrial-400">
                            Get in touch with our engineers today for a free consultation and project estimation.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link to="/contact" className="btn-primary py-4 px-10">Contact Sales</Link>
                            <Link to="/shop" className="btn-secondary bg-white/10 text-white hover:bg-white/20 py-4 px-10 border border-white/10">Browse Catalogue</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
