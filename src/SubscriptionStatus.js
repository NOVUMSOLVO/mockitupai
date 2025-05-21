import React from 'react';
import { useAuth } from './AuthContext';

export default function SubscriptionStatus() {
  const { userSubscription } = useAuth();

  if (!userSubscription) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-gray-500 text-sm">No active subscription</p>
      </div>
    );
  }

  // Determine the tier and styling
  let bgColor, textColor, borderColor, statusText, mockupsText;
  
  switch (userSubscription.tier) {
    case 'pro':
      bgColor = 'bg-purple-50';
      textColor = 'text-purple-700';
      borderColor = 'border-purple-200';
      statusText = 'Pro';
      mockupsText = `${userSubscription.mockupsRemaining} mockups remaining`;
      break;
    case 'unlimited':
      bgColor = 'bg-indigo-50';
      textColor = 'text-indigo-700';
      borderColor = 'border-indigo-200';
      statusText = 'Unlimited';
      mockupsText = 'Unlimited mockups';
      break;
    default:
      bgColor = 'bg-gray-50';
      textColor = 'text-gray-700';
      borderColor = 'border-gray-200';
      statusText = 'Free';
      mockupsText = `${userSubscription.mockupsRemaining} mockups remaining`;
  }

  return (
    <div className={`rounded-lg p-4 border ${borderColor} ${bgColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className={`${textColor} font-medium mr-2`}>{statusText}</span>
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
            {mockupsText}
          </span>
        </div>
        
        {userSubscription.tier !== 'unlimited' && userSubscription.mockupsRemaining < 3 && (
          <button className="text-xs bg-indigo-600 text-white py-1 px-3 rounded-md hover:bg-indigo-700">
            Upgrade
          </button>
        )}
      </div>
    </div>
  );
}
