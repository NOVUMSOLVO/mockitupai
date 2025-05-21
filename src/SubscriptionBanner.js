import React from 'react';
import { useAuth } from './AuthContext';

export default function SubscriptionBanner({ onUpgradeClick }) {
  const { currentUser, userSubscription } = useAuth();

  // Don't show banner for users with Pro or Unlimited subscriptions
  if (!currentUser || 
      !userSubscription || 
      userSubscription.tier === 'pro' || 
      userSubscription.tier === 'unlimited') {
    return null;
  }

  // Calculate percentage of mockups used
  const mockupsRemaining = userSubscription.mockupsRemaining || 0;
  const showLowWarning = mockupsRemaining <= 1;

  return (
    <div className={`${showLowWarning ? 'bg-red-50 border-red-200' : 'bg-indigo-50 border-indigo-200'} border-l-4 p-4 mb-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {showLowWarning ? (
            <svg className="h-5 w-5 text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-indigo-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <div>
            <p className={`text-sm font-medium ${showLowWarning ? 'text-red-800' : 'text-indigo-800'}`}>
              {showLowWarning 
                ? `You only have ${mockupsRemaining} mockup${mockupsRemaining === 1 ? '' : 's'} remaining!` 
                : `You have ${mockupsRemaining} mockup${mockupsRemaining === 1 ? '' : 's'} remaining on your free plan.`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {showLowWarning 
                ? 'Upgrade now to continue creating amazing mockups without interruption.' 
                : 'Get unlimited mockups and more features with our Pro and Unlimited plans.'}
            </p>
          </div>
        </div>
        <button
          onClick={onUpgradeClick}
          className={`${
            showLowWarning 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          } px-4 py-2 rounded-md text-sm font-medium text-white`}
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
}
