import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiLayers, FiSmartphone, FiImage, FiDownload, FiShield } from 'react-icons/fi';

// Animation variants for better performance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

const FeaturesPage = () => {
  const features = [
    {
      icon: <FiZap className="w-8 h-8 text-blue-500" />,
      title: 'AI-Powered Generation',
      description: 'Generate professional mockups in seconds using our advanced AI algorithms. Simply upload your design and let our AI handle the rest.'
    },
    {
      icon: <FiLayers className="w-8 h-8 text-purple-500" />,
      title: 'Template Library',
      description: 'Choose from hundreds of pre-made templates for various devices and use cases. Perfect for e-commerce, apps, and marketing materials.'
    },
    {
      icon: <FiSmartphone className="w-8 h-8 text-green-500" />,
      title: 'Device Mockups',
      description: 'Showcase your designs on realistic device frames including iPhones, Androids, laptops, and tablets.'
    },
    {
      icon: <FiImage className="w-8 h-8 text-yellow-500" />,
      title: 'Scene Customization',
      description: 'Adjust lighting, shadows, and perspectives to create the perfect product presentation.'
    },
    {
      icon: <FiDownload className="w-8 h-8 text-red-500" />,
      title: 'High-Resolution Export',
      description: 'Download your mockups in high-resolution PNG, JPG, or SVG formats, ready for presentations or marketing materials.'
    },
    {
      icon: <FiShield className="w-8 h-8 text-indigo-500" />,
      title: 'Privacy First',
      description: 'Your designs remain private and secure. We never share or use your content without permission.'
    }
  ];

  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20"
      role="main"
      aria-label="Features of our mockup generation service"
    >
      <div className="container mx-auto px-4">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          aria-labelledby="features-heading"
        >
          <h1 
            id="features-heading"
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-4"
          >
            Powerful Features
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Everything you need to create stunning mockups in minutes, not hours.
          </p>
        </motion.header>

        <motion.div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          aria-label="List of features"
        >
          {features.map((feature, index) => (
            <motion.article
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 will-change-transform"
              tabIndex="0"
              aria-label={`Feature: ${feature.title}`}
            >
              <div 
                className="p-3 bg-blue-50 rounded-full mb-4 w-14 h-14 flex items-center justify-center"
                aria-hidden="true"
              >
                {React.cloneElement(feature.icon, { 
                  className: `${feature.icon.props.className} w-8 h-8`,
                  'aria-hidden': 'true'
                })}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {feature.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturesPage;
