import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import SubscriptionManagement from './SubscriptionManagement';

export default function UserDashboard({ onClose }) {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!currentUser) {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 text-center">
          <p>Please log in to view your dashboard.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      if (onClose) onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full z-50">
      <div className="flex justify-center items-start min-h-full p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">User Dashboard</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close dashboard"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-blue-600">
                        {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {currentUser.displayName || 'User'}
                    </h3>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {['profile', 'subscription'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full text-left px-4 py-2 rounded-md ${
                        activeTab === tab
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </nav>
              </div>

              <div className="flex-1">
                {activeTab === 'profile' && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {currentUser.displayName || 'Not set'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{currentUser.email}</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'subscription' && <SubscriptionManagement />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
