import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiLayers, FiEdit3, FiDownload, FiArrowRight } from 'react-icons/fi';

// Animation variants for better performance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

const HowItWorksPage = () => {
  const steps = [
    {
      icon: <FiUpload className="w-6 h-6" />,
      number: '01',
      title: 'Upload Your Design',
      description: 'Start by uploading your design file (PNG, JPG, or SVG) or paste a URL. Our platform supports all standard design formats.'
    },
    {
      icon: <FiLayers className="w-6 h-6" />,
      number: '02',
      title: 'Select a Mockup Style',
      description: 'Browse our extensive library of mockup templates. Choose from devices, apparel, packaging, or environmental scenes.'
    },
    {
      icon: <FiEdit3 className="w-6 h-6" />,
      number: '03',
      title: 'Customize & Enhance',
      description: 'Adjust the perspective, lighting, and shadows. Add backgrounds or text overlays to make your mockup stand out.'
    },
    {
      icon: <FiDownload className="w-6 h-6" />,
      number: '04',
      title: 'Download & Share',
      description: 'Download high-resolution mockups in your preferred format or share directly to social media and design platforms.'
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
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16 md:py-24"
      role="main"
      aria-label="How our mockup generation service works"
    >
      <div className="container mx-auto px-4">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          aria-labelledby="how-it-works-heading"
        >
          <span 
            className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1 rounded-full mb-4"
            aria-hidden="true"
          >
            SIMPLE STEPS
          </span>
          <h1 
            id="how-it-works-heading"
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-4"
          >
            Create Stunning Mockups in Minutes
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Transform your designs into professional product presentations with just a few clicks
          </p>
        </motion.header>

        <div className="max-w-4xl mx-auto">
          <motion.div 
            ref={containerRef}
            className="relative"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            aria-label="Step by step guide"
          >
            {/* Vertical line */}
            <div 
              className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-100 to-purple-100"
              aria-hidden="true"
            ></div>
            
            <ol className="space-y-12">
              {steps.map((step, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  className="relative flex items-start group will-change-transform"
                >
                  <div 
                    className="hidden md:flex absolute left-0 mt-1.5 w-16 h-16 rounded-full bg-white border-4 border-white shadow-md items-center justify-center z-10"
                    aria-hidden="true"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
                      {React.cloneElement(step.icon, { 
                        className: `${step.icon.props.className} w-6 h-6`,
                        'aria-hidden': 'true'
                      })}
                    </div>
                  </div>
                  
                  <div className="ml-0 md:ml-24 pl-0 md:pl-6 pt-1">
                    <div className="flex items-center mb-2">
                      <span 
                        className="md:hidden mr-3 flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center"
                        aria-hidden="true"
                      >
                        {step.icon}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">
                        <span className="sr-only">Step {index + 1}: </span>
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 pl-0 md:pl-0 leading-relaxed">
                      {step.description}
                    </p>
                    {index < steps.length - 1 && (
                      <div 
                        className="absolute -bottom-6 left-8 w-0.5 h-6 bg-gradient-to-b from-blue-100 to-purple-100 hidden md:block"
                        aria-hidden="true"
                      ></div>
                    )}
                  </div>
                </motion.li>
              ))}
            </ol>
            
            <motion.div 
              className="mt-12 text-center"
              variants={itemVariants}
            >
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 will-change-transform"
                aria-label="Get started with your free trial"
              >
                Get Started for Free
                <FiArrowRight className="ml-2" aria-hidden="true" />
              </motion.a>
              <p className="mt-4 text-sm text-gray-600">
                No credit card required. Start with 3 free mockups.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
