import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './HomePage.css';

// Image placeholders will be handled with CSS and emojis

// Add these styles to your global CSS or in a style tag
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(1deg); }
  }
  .animate-float {
    animation: float 8s ease-in-out infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  .animate-gradient {
    background-size: 200% auto;
    animation: gradient 3s ease infinite;
  }
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// Add styles to the document head
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

// Feature Card Component with enhanced design and animations
const FeatureCard = ({ emoji, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: delay * 0.1 }}
    className="group relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden border border-white/20"
  >
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-700"></div>
    <div className="relative z-10">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl text-white mb-6 shadow-lg">
        {emoji}
      </div>
      <h3 className="text-2xl font-extrabold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-900 leading-relaxed font-medium">{description}</p>
    </div>
  </motion.div>
);

// Stats Component with animated counters
const StatCard = ({ number, label, isRating, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(number.replace(/\D/g, ''));
  const duration = 2; // seconds
  
  useEffect(() => {
    let start = 0;
    const increment = target / (60 * duration);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 1000 / 60);
    
    return () => clearInterval(timer);
  }, [target]);

  return (
    <motion.div 
      className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
        {count}{suffix}
      </div>
      <div className="mt-3 text-gray-800 font-medium">
        {isRating ? (
          <div className="flex items-center justify-center space-x-1">
            {Array(5).fill().map((_, i) => (
              <span key={i} className="text-yellow-400 text-xl">★</span>
            ))}
            <span className="ml-1 text-gray-800 font-semibold">{number}</span>
          </div>
        ) : (
          <span className="text-sm font-semibold uppercase tracking-wider text-gray-800">{label}</span>
        )}
      </div>
    </motion.div>
  );
};

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        setActiveTestimonial(prev => (prev + 1) % 3);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isHovered]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen flex flex-col overflow-x-hidden">
      {/* Navigation - Fixed at top */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-lg py-3' 
            : 'bg-white/90 backdrop-blur-md py-4 md:py-6'
        }`}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Mockitup.ai
            </Link>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 hover:text-blue-600 text-2xl focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Features</Link>
              <Link to="/how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">How it Works</Link>
              <Link to="/testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Testimonials</Link>
              <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Pricing</Link>
              
              <div className="flex items-center space-x-4 ml-4">
                <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-blue-600">
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <div className="flex flex-col space-y-3">
                <Link 
                  to="/features" 
                  className="text-gray-600 hover:text-blue-600 py-2 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  to="/how-it-works" 
                  className="text-gray-600 hover:text-blue-600 py-2 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How it Works
                </Link>
                <Link 
                  to="/testimonials" 
                  className="text-gray-600 hover:text-blue-600 py-2 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimonials
                </Link>
                <Link 
                  to="/pricing" 
                  className="text-gray-600 hover:text-blue-600 py-2 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <Link 
                    to="/login" 
                    className="block text-center text-gray-600 hover:text-blue-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block text-center bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-full mt-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Main Content - Pushed down by navbar */}
      <div className="flex-grow pt-24 md:pt-28">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 w-[500px] h-[500px] bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
        </div>

        {/* Main content area */}
        <main className="relative z-10">
      <section className="relative pt-12 pb-8 md:pt-16 md:pb-12 overflow-hidden">
        <div className="container mx-auto relative z-10 max-w-7xl">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              🚀 Now with AI-powered design suggestions
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Design Stunning Mockups
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient">
                In Seconds, Not Hours
              </span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Transform your ideas into beautiful, professional mockups with our AI-powered design tool. 
              <span className="block mt-2">No design skills required. Start creating in seconds.</span>
            </motion.p>
          </motion.div>

          <motion.div 
            className="mt-12 flex flex-col sm:flex-row justify-center gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link
              to="/signup"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Get Started Free
                <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link
              to="/demo"
              className="group relative px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl text-lg border-2 border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Watch Demo
              </span>
              <span className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            <StatCard number="50" suffix="+" label="Design Templates" />
            <StatCard number="100" suffix="+" label="Happy Customers" />
            <StatCard number="1" suffix="K+" label="Mockups Created" />
            <StatCard number="4.9" isRating={true} />
          </motion.div>

          {/* Mockup Preview */}
          <motion.div 
            className="mt-16 md:mt-24 relative max-w-6xl mx-auto px-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Browser mockup */}
              <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center">
                <div className="flex space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                  <span className="w-3 h-3 rounded-full bg-green-400"></span>
                </div>
                <div className="flex-1 mx-4 bg-gray-100 rounded-lg px-4 py-1.5 text-sm text-gray-500 text-center truncate">
                  mockitup.ai/your-project
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Mockup Preview</h3>
                    <p className="text-gray-600">Your beautiful mockup will appear here</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20 -z-10"></div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20 -z-10"></div>
            </div>
            
            {/* Floating elements around the mockup */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20 -z-10"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20 -z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-blue-50 -z-10"></div>
        
        <div className="container mx-auto relative max-w-7xl">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              ✨ Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Everything you need to create<br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">stunning mockups</span></h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Designed to help you create beautiful designs faster than ever before</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                emoji: "🎨",
                title: "Drag & Drop Editor",
                description: "Create beautiful designs with our intuitive drag and drop interface. No design skills needed!"
              },
              {
                emoji: "📱",
                title: "100+ Templates",
                description: "Choose from our extensive library of professionally designed templates for any device."
              },
              {
                emoji: "⚡",
                title: "AI-Powered Tools",
                description: "Let our AI suggest the perfect color schemes, fonts, and layouts for your designs."
              },
              {
                emoji: "🔄",
                title: "Real-time Collaboration",
                description: "Work together with your team in real-time on the same design project."
              },
              {
                emoji: "📤",
                title: "Easy Export",
                description: "Export your designs in multiple formats including PNG, JPG, PDF, and more."
              },
              {
                emoji: "🔒",
                title: "Secure & Private",
                description: "Your designs are always secure and private. We respect your data and privacy."
              }
            ].map((feature, index) => (
              <FeatureCard 
                key={index}
                emoji={feature.emoji}
                title={feature.title}
                description={feature.description}
                delay={index}
              />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/features" 
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 group"
            >
              Explore all features
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-40 top-1/4 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute -left-40 bottom-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      </section>

      {/* Testimonials Section */}
      <section id="how-it-works" className="py-12 md:py-20 px-4 relative overflow-hidden bg-gradient-to-br from-blue-50 to-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>
        
        <div className="container mx-auto relative max-w-7xl">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              ❤️ Loved by Thousands
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Trusted by designers at</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Join thousands of users who have transformed their design workflow</p>
          </motion.div>

          {/* Logo Cloud */}
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 mb-20 opacity-70">
            {[
              { name: 'Google', logo: 'G' },
              { name: 'Microsoft', logo: 'M' },
              { name: 'Airbnb', logo: 'A' },
              { name: 'Spotify', logo: 'S' },
              { name: 'Netflix', logo: 'N' },
            ].map((company, index) => (
              <motion.div 
                key={company.name}
                className="text-3xl font-bold text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {company.name}
              </motion.div>
            ))}
          </div>

          {/* Testimonials Carousel */}
          <div 
            className="relative max-w-5xl mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl">
              <div className="relative h-full">
                {[
                  {
                    id: 1,
                    name: "Sarah Johnson",
                    role: "Lead Designer at DesignCo",
                    content: "Mockitup has completely transformed how I create mockups. The intuitive interface and powerful features save me hours of work every week.",
                    rating: 5
                  },
                  {
                    id: 2,
                    name: "Michael Chen",
                    role: "Frontend Developer at TechCorp",
                    content: "As a developer, I love how easy it is to turn my designs into interactive prototypes. The code export feature is a game-changer!",
                    rating: 5
                  },
                  {
                    id: 3,
                    name: "Emily Rodriguez",
                    role: "Product Manager at StartupX",
                    content: "The collaboration features have made it so much easier to work with my remote team. Real-time feedback has sped up our design process by 40%.",
                    rating: 4
                  }
                ].map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    className={`absolute inset-0 p-8 md:p-12 flex flex-col justify-center ${activeTestimonial === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    initial={{ opacity: 0, x: index === 0 ? 50 : -50 }}
                    animate={{ 
                      opacity: activeTestimonial === index ? 1 : 0,
                      x: activeTestimonial === index ? 0 : (index < activeTestimonial ? -50 : 50)
                    }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-2xl text-purple-500">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                        <p className="text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                      "{testimonial.content}"
                    </h2>
                    <div className="mt-auto">
                      <div className="flex items-center mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-6 h-6 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        {[...Array(5 - testimonial.rating)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-6 h-6 text-gray-200"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Navigation Dots */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeTestimonial ? 'w-6 bg-blue-600' : 'bg-gray-300'}`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <div className="relative">
                <button 
                  onClick={() => setActiveTestimonial(prev => (prev - 1 + 3) % 3)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Previous testimonial"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => setActiveTestimonial(prev => (prev + 1) % 3)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Next testimonial"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">1M+</div>
              <div className="text-gray-600">Mockups Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-600 mb-2">4.9</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden bg-gray-50">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50 via-white to-white -z-10"></div>
        
        {/* Decorative elements */}
        <div className="home-bg-pattern"></div>
        
        {/* Decorative blobs */}
        <div className="home-blob-1"></div>
        <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        
        <div className="container mx-auto relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-sm font-semibold text-white mb-8 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300 group"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.05, rotate: '-1deg' }}
            >
              <span className="mr-2">🚀</span>
              <span>Start creating today</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </motion.div>
            
            <motion.h2 
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="block mb-4">Ready to transform</span>
              <span className="relative inline-block">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-600 to-purple-700">
                  your workflow?
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 shadow-inner blur-2xl -z-10 rounded-full"></span>
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-800 mb-12 max-w-3xl mx-auto leading-relaxed font-medium tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Join <span className="font-bold text-blue-700">thousands</span> of designers and developers who trust Mockitup to bring their ideas to life faster and easier than ever before.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/signup"
                  className="group relative px-10 py-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold rounded-2xl text-lg hover:shadow-2xl hover:shadow-yellow-500/30 transform transition-all duration-300 inline-flex items-center justify-center overflow-hidden min-w-[220px]"
                >
                  <span className="relative z-10 flex items-center text-lg">
                    Get Started Free
                    <svg className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/demo"
                  className="ml-4 bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-8 rounded-full text-lg border-2 border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-sm"
                >
                  <span className="relative z-10 flex items-center text-lg">
                    <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Watch Demo
                  </span>
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-14 text-sm text-gray-700 flex items-center justify-center gap-6 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No credit card required
              </span>
              <span className="w-1 h-1 bg-white/40 rounded-full"></span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Cancel anytime
              </span>
              <span className="w-1 h-1 bg-white/40 rounded-full"></span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                14-day free trial
              </span>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent"></div>
      </section>
        {/* Add padding bottom to ensure footer is visible */}
        <div className="pb-32"></div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-700">
            <p className="font-medium">© {new Date().getFullYear()} Mockitup.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
