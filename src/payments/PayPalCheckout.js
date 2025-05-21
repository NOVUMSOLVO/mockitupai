import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth } from '../AuthContext';
import './PayPalCheckout.css';

export default function PayPalCheckout({ plan, onClose }) {
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const { currentUser, updateSubscription } = useAuth();

  // Initial PayPal options
  const initialOptions = {
    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "subscription",
    vault: true
  };

  // Get plan ID for PayPal
  const getPayPalPlanId = () => {
    // These are your actual PayPal plan IDs from the PayPal Developer Dashboard
    switch(plan.id) {
      case 'pro':
        return process.env.REACT_APP_PAYPAL_PLAN_ID_PRO;
      case 'unlimited':
        return process.env.REACT_APP_PAYPAL_PLAN_ID_UNLIMITED;
      default:
        console.error('Unknown plan ID:', plan.id);
        return null;
    }
  };

  const handleApprove = async (data, actions) => {
    try {
      // Send the subscription details to your server
      const response = await fetch('/api/confirm-paypal-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionID: data.subscriptionID,
          planId: plan.id,
          userId: currentUser.uid,
          email: currentUser.email,
        }),
      });

      const subscription = await response.json();

      if (subscription.error) {
        setError(`Subscription failed: ${subscription.error}`);
        return;
      }

      // Update user's subscription in Firestore
      await updateSubscription(currentUser.uid, plan.id);
      
      setSucceeded(true);
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(`An error occurred: ${err.message}`);
    }
  };

  return (
    <div>
      {/* Show success message */}
      {succeeded && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Payment successful! Your subscription to the {plan.name} plan is now active.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Show error message if any */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          createSubscription={(data, actions) => {
            return actions.subscription.create({
              plan_id: getPayPalPlanId(),
            });
          }}
          onApprove={handleApprove}
          onError={(err) => {
            setError(`PayPal Error: ${err.message}`);
            console.error(err);
          }}
          style={{
            shape: 'rect',
            color: 'blue',
            layout: 'vertical',
            label: 'subscribe'
          }}
          className="paypal-buttons"
        />
      </PayPalScriptProvider>

      <div className="paypal-button-container">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        <span>Payments are secure and encrypted</span>
      </div>
    </div>
  );
}
