import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Since Swiper is loaded from a CDN, we need to declare it for TypeScript
declare const Swiper: any;

// Google Translate declaration
declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

const Header: React.FC<{ onNavLinkClick: (id: string) => void }> = ({ onNavLinkClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        onNavLinkClick(id);
        setIsMenuOpen(false); // Close mobile menu on link click
    };

    const handleGetStarted = () => {
        // Set authentication flag and navigate to tools
        localStorage.setItem('agri_user', 'true');
        navigate('/tools/assistant');
    };

    return (
        <header className="sticky top-0 z-50 bg-[#f9fbf8]/80 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <a className="text-2xl font-bold flex items-center gap-2" href="#">
                        <span className="material-symbols-outlined text-4xl text-[#4cdf20]">eco</span>
                        AgriAssist Pro
                    </a>
                    <nav className="hidden md:flex gap-10 items-center">
                        <a className="text-base font-medium hover:text-[#4cdf20] transition-colors" href="#capabilities" onClick={(e) => handleLinkClick(e, 'capabilities')}>Capabilities</a>
                        <a className="text-base font-medium hover:text-[#4cdf20] transition-colors" href="#how-it-works" onClick={(e) => handleLinkClick(e, 'how-it-works')}>How It Works</a>
                        <a className="text-base font-medium hover:text-[#4cdf20] transition-colors" href="#testimonials" onClick={(e) => handleLinkClick(e, 'testimonials')}>Testimonials</a>
                    </nav>
                    <button onClick={handleGetStarted} className="hidden md:flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#4cdf20] text-[#111b0e] text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors">
                        <span className="truncate">Get Started</span>
                    </button>
                    <button className="md:hidden text-[#111b0e]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span className="material-symbols-outlined text-3xl">{isMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
                 {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4">
                        <nav className="flex flex-col gap-4">
                             <a className="text-base font-medium hover:text-[#4cdf20] transition-colors" href="#capabilities" onClick={(e) => handleLinkClick(e, 'capabilities')}>Capabilities</a>
                            <a className="text-base font-medium hover:text-[#4cdf20] transition-colors" href="#how-it-works" onClick={(e) => handleLinkClick(e, 'how-it-works')}>How It Works</a>
                            <a className="text-base font-medium hover:text-[#4cdf20] transition-colors" href="#testimonials" onClick={(e) => handleLinkClick(e, 'testimonials')}>Testimonials</a>
                            <button onClick={handleGetStarted} className="mt-2 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#4cdf20] text-[#111b0e] text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors">
                                <span className="truncate">Get Started</span>
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

const Hero: React.FC = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        // Set authentication flag and navigate to tools
        localStorage.setItem('agri_user', 'true');
        navigate('/tools/assistant');
    };

    return (
        <section className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center bg-cover bg-center bg-no-repeat p-4" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDsVQJva-QX9jjo53RQmWpPQgw8vvkHf7hVEIeVUrBoW1eGVWxLeTP_lu28_Xbr29O32aOR3MXrK0Tz9J9vL3Wx9GxKi9uGZvHswJKyXAGzGhGb2fktCgOGhA2Me98B3Cefam2yUsPd8oI6p-yh7ZtFFQCWJR1q-DbZypGYSmCtY02dh_h1kM8v8Nsr5xrRy3rRspdVO-HD7L9Y8JHwX7Jd_VPN0lD5mSVBod2ZYMy5KvCEx-DbLpoD73U8-ua5pjhdzvDhA9l0widl")' }}>
            <div className="container mx-auto text-center text-white max-w-4xl">
                <h1 className="text-5xl font-extrabold leading-tight tracking-[-0.03em] md:text-7xl">Smarter Farming, Sustainable Future.</h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg font-light leading-relaxed md:text-xl">
                    Harness the power of AI to optimize your farming operations for greater productivity and sustainability.
                </p>
                <button onClick={handleGetStarted} className="mt-10 flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-[#4cdf20] text-[#111b0e] text-lg font-bold leading-normal tracking-[0.015em] mx-auto hover:bg-opacity-90 transition-transform hover:scale-105">
                    <span className="truncate">Start Your Free Trial</span>
                </button>
            </div>
        </section>
    );
};

const Capabilities: React.FC = () => (
    <section className="py-20 sm:py-28" id="capabilities">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-4xl font-bold tracking-tight">Platform Capabilities</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#609550]">Everything you need for data-driven farming, all in one place.</p>
            </div>
            <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col items-center text-center p-8 rounded-xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-300">
                    <div className="bg-[#4cdf20]/20 p-5 rounded-full mb-5"><span className="material-symbols-outlined text-5xl text-[#4cdf20]">agriculture</span></div>
                    <h3 className="text-xl font-bold">Crop Monitoring</h3>
                    <p className="mt-2 text-base text-[#609550]">Track crop health and growth with real-time satellite and drone imagery analysis.</p>
                </div>
                <div className="flex flex-col items-center text-center p-8 rounded-xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-300">
                    <div className="bg-[#4cdf20]/20 p-5 rounded-full mb-5"><span className="material-symbols-outlined text-5xl text-[#4cdf20]">bug_report</span></div>
                    <h3 className="text-xl font-bold">Pest &amp; Disease Detection</h3>
                    <p className="mt-2 text-base text-[#609550]">Identify threats early with our AI-powered image recognition technology.</p>
                </div>
                <div className="flex flex-col items-center text-center p-8 rounded-xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-300">
                    <div className="bg-[#4cdf20]/20 p-5 rounded-full mb-5"><span className="material-symbols-outlined text-5xl text-[#4cdf20]">trending_up</span></div>
                    <h3 className="text-xl font-bold">Yield Prediction</h3>
                    <p className="mt-2 text-base text-[#609550]">Forecast your harvest with high accuracy using predictive analytics.</p>
                </div>
                <div className="flex flex-col items-center text-center p-8 rounded-xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-300">
                    <div className="bg-[#4cdf20]/20 p-5 rounded-full mb-5"><span className="material-symbols-outlined text-5xl text-[#4cdf20]">water_drop</span></div>
                    <h3 className="text-xl font-bold">Precision Irrigation</h3>
                    <p className="mt-2 text-base text-[#609550]">Optimize water usage with AI-driven irrigation schedules based on soil moisture data.</p>
                </div>
            </div>
        </div>
    </section>
);

const HowItWorks: React.FC = () => (
    <section className="py-20 sm:py-28 bg-white" id="how-it-works">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-4xl font-bold tracking-tight">How It Works</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#609550]">Unlock the potential of your farm in three simple steps.</p>
            </div>
            <div className="relative mt-16">
                <div aria-hidden="true" className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-[#d6e6d1] hidden md:block"></div>
                <div className="relative grid md:grid-cols-3 gap-12 text-center">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center size-20 rounded-full bg-[#4cdf20] text-white font-bold text-3xl flex-shrink-0 z-10 border-4 border-white">1</div>
                        <h3 className="mt-6 text-xl font-bold">Connect Your Data</h3>
                        <p className="mt-2 text-base text-[#609550]">Easily upload farm data or connect your existing sensors and machinery.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center size-20 rounded-full bg-[#4cdf20] text-white font-bold text-3xl flex-shrink-0 z-10 border-4 border-white">2</div>
                        <h3 className="mt-6 text-xl font-bold">AI Analysis</h3>
                        <p className="mt-2 text-base text-[#609550]">Our platform analyzes your data to generate actionable insights and alerts.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center size-20 rounded-full bg-[#4cdf20] text-white font-bold text-3xl flex-shrink-0 z-10 border-4 border-white">3</div>
                        <h3 className="mt-6 text-xl font-bold">Optimize &amp; Grow</h3>
                        <p className="mt-2 text-base text-[#609550]">Implement AI-driven recommendations to boost efficiency and profitability.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const ToolsInAction: React.FC = () => {
    const navigate = useNavigate();

    const handleExploreFeatures = () => {
        localStorage.setItem('agri_user', 'true');
        navigate('/tools/assistant');
    };

    return (
        <section className="py-20 sm:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-0 items-center">
                    <div className="p-10 sm:p-16 lg:p-12 order-2 lg:order-1">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">See Our Tools in Action</h2>
                        <p className="mt-4 text-lg text-[#609550]">
                            Visualize crop health, detect anomalies, and take proactive measures with our intuitive dashboard. Experience the future of farm management.
                        </p>
                        <button onClick={handleExploreFeatures} className="mt-8 flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-[#4cdf20] text-[#111b0e] text-lg font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-transform hover:scale-105">
                            <span className="truncate">Explore Features</span>
                        </button>
                    </div>
                    <div className="aspect-w-16 aspect-h-9 lg:aspect-w-4 lg:aspect-h-3 order-1 lg:order-2">
                        <div className="w-full h-full bg-center bg-no-repeat bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBGEW6ewPeV1egrN5LjWAmTnzdovrLQDLy-KhjEpBkxEilEn7Im8JDmUqOgFJ931DvbU9kNRB1HgjO0vuh9SJk5835370hcr4d51DSAsfh_56LP2zC0ucl14uRT4KBB4SsFENfbgT6rp4XyR_iIhNM6FJQMNFXPhquqJ9_kezWYB0nkjiwDZIqA5i7SPUvG_wam0tVlkDFt4btO0gpoPusLJ9pBYSubykI2RX2KG-FsRgo9-TY503-bnBsAPTjewFd5Kqqr8zr5Gtja')" }}></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Testimonials: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const testimonials = [
        {
            text: "AgriAssist Pro has completely transformed our farm's efficiency. The yield prediction is astonishingly accurate, and it's saved us thousands in potential losses.",
            name: "John D.",
            role: "Family Farm Owner",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format"
        },
        {
            text: "The smart irrigation feature alone cut our water consumption by 30%. This platform is a must-have for any farmer serious about sustainability and profit.",
            name: "Maria S.",
            role: "Vineyard Manager", 
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face&auto=format"
        },
        {
            text: "As a large-scale operation, data is everything. AgriAssist Pro provides the critical insights we need to make informed decisions quickly. It's an indispensable part of our workflow.",
            name: "David Chen",
            role: "Agribusiness CEO",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    return (
        <section className="py-20 sm:py-28 bg-white" id="testimonials">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-center tracking-tight">Loved by Modern Farmers</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-[#609550]">Don't just take our word for it. Here's what our users are saying.</p>
                </div>
                
                {/* Desktop view - show all testimonials */}
                <div className="hidden md:grid md:grid-cols-3 gap-8 mt-16">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-[#f9fbf8] p-8 rounded-xl border border-[#d6e6d1] h-full flex flex-col justify-between">
                            <p className="text-base text-[#111b0e] flex-grow">"{testimonial.text}"</p>
                            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-[#d6e6d1]">
                                <img 
                                    src={testimonial.avatar} 
                                    alt={testimonial.name}
                                    className="w-14 h-14 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-bold text-lg">{testimonial.name}</p>
                                    <p className="text-sm text-[#609550]">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile view - carousel */}
                <div className="md:hidden mt-16">
                    <div className="relative overflow-hidden">
                        <div 
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="w-full flex-shrink-0 px-2">
                                    <div className="bg-[#f9fbf8] p-8 rounded-xl border border-[#d6e6d1] h-full flex flex-col justify-between min-h-[300px]">
                                        <p className="text-base text-[#111b0e] flex-grow">"{testimonial.text}"</p>
                                        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-[#d6e6d1]">
                                            <img 
                                                src={testimonial.avatar} 
                                                alt={testimonial.name}
                                                className="w-14 h-14 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-bold text-lg">{testimonial.name}</p>
                                                <p className="text-sm text-[#609550]">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Pagination dots */}
                    <div className="flex justify-center mt-8 space-x-2">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                                    currentSlide === index ? 'bg-[#4cdf20]' : 'bg-[#d6e6d1]'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};


const CallToAction: React.FC = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        localStorage.setItem('agri_user', 'true');
        navigate('/tools/assistant');
    };

    return (
        <section className="py-20 sm:py-32 text-center bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(249, 251, 248, 0.9), rgba(249, 251, 248, 0.9)), url("https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1974&auto=format&fit=crop")' }}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Take Control of Your Harvest.</h2>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-[#609550]">
                    Join the growing community of farmers leveraging AI for a more productive and sustainable future.
                </p>
                <button onClick={handleGetStarted} className="mt-10 flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-16 px-10 bg-[#4cdf20] text-[#111b0e] text-xl font-bold leading-normal tracking-[0.015em] mx-auto hover:bg-opacity-90 transition-transform hover:scale-105 shadow-lg hover:shadow-2xl">
                    <span className="truncate">Start Farming Smarter</span>
                </button>
            </div>
        </section>
    );
};

const Footer: React.FC<{ onNavLinkClick: (id: string) => void }> = ({ onNavLinkClick }) => {
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        onNavLinkClick(id);
    };
    return(
        <footer className="bg-white border-t border-[#d6e6d1]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="font-bold text-xl flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-[#4cdf20]">eco</span>AgriAssist Pro</h3>
                        <p className="text-base text-[#609550] mt-4">Smarter Farming, Sustainable Future.</p>
                        {/* Language selector removed from footer to avoid duplicate widgets - the sidebar provides a single translator instance */}
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">Quick Links</h4>
                        <nav className="mt-4 flex flex-col gap-3">
                            <a className="text-base text-[#609550] hover:text-[#4cdf20] transition-colors" href="#capabilities" onClick={(e) => handleLinkClick(e, 'capabilities')}>Capabilities</a>
                            <a className="text-base text-[#609550] hover:text-[#4cdf20] transition-colors" href="#how-it-works" onClick={(e) => handleLinkClick(e, 'how-it-works')}>How It Works</a>
                            <a className="text-base text-[#609550] hover:text-[#4cdf20] transition-colors" href="#testimonials" onClick={(e) => handleLinkClick(e, 'testimonials')}>Testimonials</a>
                        </nav>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">Legal</h4>
                        <nav className="mt-4 flex flex-col gap-3">
                            <a className="text-base text-[#609550] hover:text-[#4cdf20] transition-colors" href="#">Privacy Policy</a>
                            <a className="text-base text-[#609550] hover:text-[#4cdf20] transition-colors" href="#">Terms of Service</a>
                        </nav>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">Connect</h4>
                        <div className="flex gap-4 mt-4">
                            <a className="text-[#609550] hover:text-[#4cdf20] transition-colors text-2xl" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
                            <a className="text-[#609550] hover:text-[#4cdf20] transition-colors text-2xl" href="#"><span className="material-symbols-outlined">message</span></a>
                            <a className="text-[#609550] hover:text-[#4cdf20] transition-colors text-2xl" href="#"><span className="material-symbols-outlined">share</span></a>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-[#d6e6d1] pt-8 text-center text-base text-[#609550]">
                    <p>© 2024 AgriAssist Pro. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
};


// Main Landing Page Component
const LandingPage: React.FC = () => {
    
    useEffect(() => {
        // Dynamically load the Material Symbols font stylesheet
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Load Swiper CSS and JS
        const swiperCSS = document.createElement('link');
        swiperCSS.rel = 'stylesheet';
        swiperCSS.href = 'https://unpkg.com/swiper/swiper-bundle.min.css';
        document.head.appendChild(swiperCSS);

        const swiperJS = document.createElement('script');
        swiperJS.src = 'https://unpkg.com/swiper/swiper-bundle.min.js';
        document.head.appendChild(swiperJS);

        // Load Google Fonts
        const fontsLink = document.createElement('link');
        fontsLink.href = 'https://fonts.googleapis.com/css2?display=swap&family=Manrope:wght@400;500;700;800&family=Noto+Sans:wght@400;500;700;900';
        fontsLink.rel = 'stylesheet';
        document.head.appendChild(fontsLink);

        // Cleanup function to remove the links when the component unmounts
        return () => {
            if (document.head.contains(link)) document.head.removeChild(link);
            if (document.head.contains(swiperCSS)) document.head.removeChild(swiperCSS);
            if (document.head.contains(swiperJS)) document.head.removeChild(swiperJS);
            if (document.head.contains(fontsLink)) document.head.removeChild(fontsLink);
        };
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    // Function for smooth scrolling
    const handleNavLinkClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="bg-[#f9fbf8] text-[#111b0e]" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
            <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
                <Header onNavLinkClick={handleNavLinkClick}/>
                <main className="flex-grow">
                    <Hero />
                    <Capabilities />
                    <HowItWorks />
                    <ToolsInAction />
                    <Testimonials />
                    <CallToAction />
                </main>
                <Footer onNavLinkClick={handleNavLinkClick}/>
            </div>
        </div>
    );
};

export default LandingPage;
