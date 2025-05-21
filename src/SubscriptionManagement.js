import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export default function SubscriptionManagement() {
  const { currentUser, userSubscription } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancellationInProgress, setCancellationInProgress] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Make API request to get subscription details
        const response = await fetch('/api/get-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: currentUser.uid,
          }),
        });
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setSubscription(data.subscription);
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError('Failed to load subscription details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptionDetails();
  }, [currentUser]);

  const handleCancelSubscription = async () => {
    if (!currentUser || !subscription) return;
    
    try {
      setCancellationInProgress(true);
      setError(null);
      
      // Make API request to cancel subscription
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          subscriptionId: subscription.id,
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setSuccess('Your subscription has been canceled. You will have access until the end of your current billing period.');
      
      // Update local subscription state
      setSubscription({
        ...subscription,
        status: 'canceled',
        cancelAtPeriodEnd: true,
      });
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError('Failed to cancel subscription. Please try again later or contact support.');
    } finally {
      setCancellationInProgress(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Please sign in to manage your subscription.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Loading subscription details...</p>
      </div>
    );
  }

  if (!subscription || subscription.status === 'canceled' || userSubscription?.tier === 'free') {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Management</h3>
        <p className="text-gray-500 mb-4">You don't have an active paid subscription.</p>
        <button
          onClick={() => window.location.href = '#pricing'}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        >
          View Plans
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Management</h3>
      
      {/* Success Message */}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-md p-4 text-sm">
          {success}
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-md p-4 text-sm">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Current Plan</span>
          <span className="text-sm font-medium text-gray-900">
            {userSubscription?.tier === 'pro' ? 'Pro' : 
             userSubscription?.tier === 'unlimited' ? 'Unlimited' : 'Free'}
          </span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Status</span>
          <span className="text-sm font-medium">
            {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
              <span className="text-green-600">Active</span>
            )}
            {subscription.status === 'active' && subscription.cancelAtPeriodEnd && (
              <span className="text-yellow-600">Canceling</span>
            )}
            {subscription.status !== 'active' && (
              <span className="text-gray-600">{subscription.status}</span>
            )}
          </span>
        </div>
        
        {subscription.currentPeriodEnd && (
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">
              {subscription.cancelAtPeriodEnd ? 'Access Until' : 'Next Billing Date'}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}
            </span>
          </div>
        )}
        
        {subscription.paymentMethod && (
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Payment Method</span>
            <span className="text-sm font-medium text-gray-900">
              {subscription.paymentMethod.brand} •••• {subscription.paymentMethod.last4}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        {subscription.status === 'active' && !subscription.cancelAtPeriodEnd ? (
          <button
            onClick={handleCancelSubscription}
            disabled={cancellationInProgress}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            {cancellationInProgress ? 'Canceling...' : 'Cancel Subscription'}
          </button>
        ) : subscription.status === 'active' && subscription.cancelAtPeriodEnd ? (
          <p className="text-sm text-gray-500 italic">
            Your subscription will be canceled at the end of the current billing period.
          </p>
        ) : null}
        
        <button
          onClick={() => window.location.href = '#pricing'}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        >
          {userSubscription?.tier === 'free' ? 'Upgrade Plan' : 'Change Plan'}
        </button>
      </div>
    </div>
  );
}
