import React, { useState } from 'react';
import { useAuth } from './AuthContext';

// Import payment components (which we'll create next)
import StripeCheckout from './payments/StripeCheckout';
import PayPalCheckout from './payments/PayPalCheckout';

export default function PricingPlans() {
  const { currentUser, userSubscription } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' or 'paypal'

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0/month',
      features: [
        '3 mockups/month',
        'Standard templates',
        'Watermarked exports',
        'Basic support'
      ],
      mostPopular: false,
      current: userSubscription?.tier === 'free',
      priceId: 'price_free' // No actual price ID for free plan
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$10/month',
      features: [
        '15 mockups/month',
        'All templates',
        'HD exports',
        'Priority rendering',
        'Email support'
      ],
      mostPopular: true,
      current: userSubscription?.tier === 'pro',
      priceId: 'price_pro' // Replace with actual Stripe price ID
    },
    {
      id: 'unlimited',
      name: 'Unlimited',
      price: '$50/month',
      features: [
        'Unlimited mockups',
        'All templates',
        'HD exports',
        'Priority rendering',
        'API access',
        'Team accounts',
        '24/7 support'
      ],
      mostPopular: false,
      current: userSubscription?.tier === 'unlimited',
      priceId: 'price_unlimited' // Replace with actual Stripe price ID
    }
  ];

  const handleSubscriptionClick = (plan) => {
    if (!currentUser) {
      // If not logged in, redirect to login page or show login modal
      setIsModalOpen(true);
      return;
    }

    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose the perfect plan for your needs
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Start for free, upgrade when you need more power.
          </p>
        </div>

        <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl shadow-lg overflow-hidden ${
                plan.mostPopular ? 'border-2 border-indigo-500' : 'border border-gray-200'
              }`}
            >
              <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                {plan.mostPopular && (
                  <div className="absolute top-0 right-0 pt-2 pr-2">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      Most popular
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                <p className="mt-4 text-3xl font-extrabold text-gray-900">{plan.price}</p>
              </div>
              
              <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-500">{feature}</p>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <button
                    onClick={() => handleSubscriptionClick(plan)}
                    className={`w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md ${
                      plan.current
                        ? 'bg-gray-300 text-gray-800 cursor-default'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : 'Get Started'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Modal */}
      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Subscribe to {selectedPlan.name} Plan</h3>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      You're subscribing to the {selectedPlan.name} plan at {selectedPlan.price}.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {/* Payment Method Selection */}
                  <div className="flex justify-center space-x-4 mb-4">
                    <button
                      onClick={() => setPaymentMethod('stripe')}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        paymentMethod === 'stripe'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                    >
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#635BFF">
                          <path d="M14.24 0H9.76C4.37 0 0 4.37 0 9.76v4.48C0 19.63 4.37 24 9.76 24h4.48C19.63 24 24 19.63 24 14.24V9.76C24 4.37 19.63 0 14.24 0z"/>
                          <path fill="#fff" d="M11.92 7.32c-1.2 0-2.17.43-2.17.43l.03-.19c0-.05-.03-.1-.09-.1H8.5c-.05 0-.09.04-.1.09l-.75 4.73c0 .05.03.09.08.09h1.2c.05 0 .09-.04.1-.09l.26-1.63S10.5 11.94 12 11.94c.63 0 1.13-.25 1.13-.8 0-.54-.43-.7-1.2-.7-1 0-1.44.29-1.44.29l.1-.67s.54-.23 1.63-.23c1.4 0 2.23.56 2.23 1.82 0 1.82-2.3 1.82-2.3 1.82s1.86.09 1.86 1.61c0 1.59-1.74 1.52-1.74 1.52-1.51 0-1.77-.42-1.77-.42l-.1.66s.42.2 1.86.2c1.42 0 2.94-.6 2.94-2.25s-2.28-1.84-2.28-1.84 1.79-.25 1.79-1.82c0-1.58-1.68-1.8-2.79-1.8z"/>
                        </svg>
                        Stripe
                      </span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('paypal')}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        paymentMethod === 'paypal'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                    >
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#0070E0">
                          <path d="M20.067 8.478c.492.876.66 1.9.463 3.13-.508 3.214-3.34 5.144-7.137 5.144H11.35a.93.93 0 0 0-.922.788l-.028.15-.48 3.039-.013.07a.93.93 0 0 1-.922.788H6.485a.538.538 0 0 1-.532-.625l.37-2.344.703-4.454L7.39 10.8l.99-6.273a.594.594 0 0 1 .587-.515h5.578c2.77 0 4.848 1.52 5.513 4.465z" fill="#003087"/>
                          <path d="M20.067 8.478c.492.876.66 1.9.463 3.13-.508 3.214-3.34 5.144-7.137 5.144H11.35a.93.93 0 0 0-.922.788l-.028.15-.48 3.039-.013.07a.93.93 0 0 1-.922.788H6.485a.538.538 0 0 1-.532-.625l.37-2.344.703-4.454.026-.167c.049-.37.361-.653.739-.653h1.95c3.798 0 6.63-1.93 7.137-5.144a4.704 4.704 0 0 0 3.189 3.478z" fill="#003087"/>
                          <path d="M8.988 8.478a5.368 5.368 0 0 0-.36 1.785c-.508 3.214-3.34 5.144-7.137 5.144H.948a.538.538 0 0 0-.532.627l1.099 6.954a.594.594 0 0 0 .587.513h4.066a.93.93 0 0 0 .922-.79l.024-.12.48-3.04.03-.15a.93.93 0 0 1 .922-.789h2.043c3.798 0 6.63-1.93 7.137-5.144a4.703 4.703 0 0 0-.463-3.13 4.705 4.705 0 0 0-3.189-3.476c-.695-.2-1.469-.304-2.297-.304H6.104a.93.93 0 0 0-.92.788l-.027.151-.169 1.081z" fill="#009cde"/>
                        </svg>
                        PayPal
                      </span>
                    </button>
                  </div>

                  {/* Payment Forms */}
                  <div className="mt-4">
                    {paymentMethod === 'stripe' ? (
                      <StripeCheckout plan={selectedPlan} onClose={closeModal} />
                    ) : (
                      <PayPalCheckout plan={selectedPlan} onClose={closeModal} />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:text-sm"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Login Modal - Show when user tries to subscribe but isn't logged in */}
      {isModalOpen && !selectedPlan && !currentUser && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          {/* Login Modal Content */}
          {/* We'll implement this in the Auth components */}
        </div>
      )}
    </div>
  );
}
