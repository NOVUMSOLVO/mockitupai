import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCheck, FaRocket, FaGem, FaCrown } from 'react-icons/fa';

const PricingPage = () => {
  const plans = [
    {
      name: 'Starter',
      price: 0,
      period: 'forever',
      description: 'Perfect for trying out our platform',
      features: [
        '5 mockups per month',
        'Basic templates',
        'Community support',
        'Standard quality exports'
      ],
      cta: 'Get Started',
      popular: false,
      icon: <FaRocket className="text-blue-500 text-2xl" />
    },
    {
      name: 'Pro',
      price: 19,
      period: 'per month',
      description: 'For professionals and small teams',
      features: [
        '50 mockups per month',
        'All templates',
        'Priority support',
        'High quality exports',
        'Custom branding',
        'API access'
      ],
      cta: 'Go Pro',
      popular: true,
      icon: <FaGem className="text-purple-500 text-2xl" />
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'per month',
      description: 'For large teams and agencies',
      features: [
        'Unlimited mockups',
        'All templates + custom',
        '24/7 dedicated support',
        'Highest quality exports',
        'Custom branding',
        'API access',
        'Team collaboration',
        'Custom integrations'
      ],
      cta: 'Contact Sales',
      popular: false,
      icon: <FaCrown className="text-yellow-500 text-2xl" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-blue-500' : 'border border-gray-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              whileHover={{ y: -5 }}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                  <span className="bg-indigo-500 text-white text-xs font-semibold px-4 py-1 rounded-full">Most Popular</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                {plan.icon}
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              </div>
              <p className="mt-2 text-gray-500">{plan.description}</p>
              <div className="mt-6">
                <p className="text-4xl font-extrabold text-gray-900">
                  {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                </p>
                <p className="mt-1 text-gray-500">{plan.period}</p>
              </div>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <FaCheck className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                    <span className="ml-3 text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  to={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                  className={`block w-full py-3 px-6 text-center rounded-md text-white font-medium transition-colors duration-200 ${
                    plan.popular 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-gray-800 hover:bg-gray-900'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900">Frequently asked questions</h2>
          <div className="mt-8 space-y-8">
            {[
              {
                question: 'Can I change plans later?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
              },
              {
                question: 'Do you offer discounts for non-profits?',
                answer: 'Yes, we offer special pricing for non-profit organizations. Please contact our sales team for more information.'
              },
              {
                question: 'Is there a free trial?',
                answer: 'Yes, you can try our Pro plan free for 14 days. No credit card required.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
