'use client';

import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Settings() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isSubscribed: false,
    plan: 'free',
    status: null,
    renewalDate: null,
    cancelAtPeriodEnd: false,
    dailyReportsCount: 0,
    dailyReportsLimit: 3,
    loading: false,
    error: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's subscription status
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user) return;
      
      setSubscriptionStatus(prev => ({ ...prev, loading: true, error: '' }));
      try {
        const response = await fetch('/api/user/subscription-status');
        if (!response.ok) throw new Error('Failed to fetch subscription status');
        
        const data = await response.json();
        setSubscriptionStatus({
          isSubscribed: data.isSubscribed,
          plan: data.plan || 'free',
          status: data.status,
          renewalDate: data.renewalDate || null,
          cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
          dailyReportsCount: data.dailyReportsCount || 0,
          dailyReportsLimit: data.dailyReportsLimit || 3,
          loading: false,
          error: ''
        });
      } catch (error) {
        console.error('Error fetching subscription status:', error);
        setSubscriptionStatus(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load subscription information'
        }));
      }
    };

    fetchSubscriptionStatus();
  }, [user]);

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/manage-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'cancel' }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel subscription');
      }
      
      // Update subscription status
      setSubscriptionStatus(prev => ({
        ...prev,
        cancelAtPeriodEnd: true,
      }));
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle subscription reactivation
  const handleReactivateSubscription = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/manage-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reactivate' }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reactivate subscription');
      }
      
      // Update subscription status
      setSubscriptionStatus(prev => ({
        ...prev,
        cancelAtPeriodEnd: false,
      }));
    } catch (err) {
      console.error('Error reactivating subscription:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl sm:text-2xl font-bold text-purple-600">Nexus AI Consulting</Link>
              <div className="ml-2 sm:ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                Settings
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="/solutions" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">Solutions</a>
                <Link href="/reports" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">My Reports</Link>
                <a href="/dashboard" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">Dashboard</a>
                <a href="/settings" className="text-purple-600 px-3 py-2 text-sm font-medium border-b-2 border-purple-600">Settings</a>
                {isLoaded && user && (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">👋 Hi, {user.firstName || 'there'}!</span>
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              >
                <span className="sr-only">Open main menu</span>
                {!mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              <a href="/solutions" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-purple-600 hover:bg-purple-50 rounded-md">Solutions</a>
              <Link href="/reports" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-purple-600 hover:bg-purple-50 rounded-md">My Reports</Link>
              <a href="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-purple-600 hover:bg-purple-50 rounded-md">Dashboard</a>
              <a href="/settings" className="block px-3 py-2 text-base font-medium text-purple-600 bg-purple-50 rounded-md">Settings</a>
              {isLoaded && user && (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex items-center px-3 py-2">
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                        },
                      }}
                    />
                    <span className="ml-3 text-sm text-gray-700">👋 Hi, {user.firstName || 'there'}!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Settings Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Account Settings</h1>
          <p className="mt-2 text-black text-sm sm:text-base">Manage your account preferences and subscription</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Account Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-4">Profile Information</h3>
              {isLoaded && user && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-16 h-16",
                        },
                      }}
                    />
                    <div>
                      <h4 className="text-base font-medium text-black">{user.firstName} {user.lastName}</h4>
                      <p className="text-sm text-gray-600">{user.emailAddresses[0].emailAddress}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input 
                        type="text" 
                        value={user.firstName || ''} 
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input 
                        type="text" 
                        value={user.lastName || ''} 
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={user.emailAddresses[0].emailAddress} 
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    To update your profile information, please use the profile menu in the top right corner.
                  </p>
                </div>
              )}
            </div>

            {/* Subscription Status */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-black">Your Account Status</h3>
                <div className="text-sm text-gray-600">✨ Keep creating amazing reports!</div>
              </div>
              
              {subscriptionStatus.loading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-700"></div>
                </div>
              ) : subscriptionStatus.error ? (
                <div className="text-red-600 text-sm py-2">{subscriptionStatus.error}</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Active Plan:</span>
                    <span className="text-sm font-medium capitalize">
                      {subscriptionStatus.plan === 'free' ? 'Free Tier' : 
                       subscriptionStatus.plan === 'monthly' ? 'Professional (Billed Monthly)' : 
                       subscriptionStatus.plan === 'yearly' ? 'Enterprise (Billed Annually)' : 'Plan Unknown'}
                    </span>
                  </div>
                  
                  {subscriptionStatus.plan === 'free' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black">Reports Remaining Today:</span>
                      <span className="text-sm font-medium">{Math.max(0, subscriptionStatus.dailyReportsLimit - subscriptionStatus.dailyReportsCount)} of {subscriptionStatus.dailyReportsLimit} available</span>
                    </div>
                  )}
                  
                  {subscriptionStatus.plan !== 'free' && subscriptionStatus.renewalDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black">Next Billing Date:</span>
                      <span className="text-sm font-medium">{new Date(subscriptionStatus.renewalDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    {subscriptionStatus.plan === 'free' ? (
                      <div className="text-xs text-gray-500">
                        You&apos;re currently on the free tier with {subscriptionStatus.dailyReportsLimit} reports per day.
                      </div>
                    ) : (
                      <div className="text-xs text-green-600">
                        ✓ You have unlimited access to all AI reports and premium features.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Subscription Management */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-4">Subscription Management</h3>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              {subscriptionStatus.plan === 'free' ? (
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <div className="text-gray-600 mb-4">
                      <svg className="w-12 h-12 mx-auto mb-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      <h4 className="text-lg font-medium text-black mb-2">Upgrade Your Plan</h4>
                      <p className="text-sm text-gray-600">
                        Unlock unlimited reports and premium features with our Professional or Enterprise plans.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <a 
                        href="/pricing" 
                        className="block w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors text-center"
                      >
                        View Pricing Plans
                      </a>
                      <div className="text-xs text-gray-500">
                        Choose from monthly or yearly billing options
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Current Plan:</span>
                    <span className="text-sm font-medium capitalize">
                      {subscriptionStatus.plan === 'monthly' ? 'Professional (Monthly)' : 
                       subscriptionStatus.plan === 'yearly' ? 'Enterprise (Yearly)' : subscriptionStatus.plan}
                    </span>
                  </div>
                  
                  {subscriptionStatus.renewalDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black">
                        {subscriptionStatus.cancelAtPeriodEnd ? 'Cancels on:' : 'Renews on:'}
                      </span>
                      <span className="text-sm font-medium">
                        {new Date(subscriptionStatus.renewalDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="space-y-3 mb-4">
                      <a 
                        href="/pricing" 
                        className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                      >
                        Update Subscription Plan
                      </a>
                      <p className="text-xs text-gray-500 text-center">
                        Switch between monthly and yearly billing or change your plan
                      </p>
                    </div>
                    
                    {subscriptionStatus.cancelAtPeriodEnd ? (
                      <div className="space-y-3">
                        <div className="flex items-center text-amber-600 text-sm">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Your subscription will be cancelled at the end of the current billing period.
                        </div>
                        <button
                          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleReactivateSubscription}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Processing...' : 'Reactivate Subscription'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center text-green-600 text-sm">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Your subscription is active and will automatically renew.
                        </div>
                        <button
                          className="w-full border border-red-600 text-red-600 py-2 px-4 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleCancelSubscription}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Processing...' : 'Cancel Subscription'}
                        </button>
                        <p className="text-xs text-gray-500">
                          You can cancel anytime. Your subscription will remain active until the end of your current billing period.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a 
                  href="/dashboard" 
                  className="block w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors text-center"
                >
                  Go to Dashboard
                </a>
                <Link 
                  href="/reports" 
                  className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors text-center"
                >
                  View My Reports
                </Link>
                <a 
                  href="/solutions" 
                  className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors text-center"
                >
                  Explore Solutions
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-4">Support</h3>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  Need help? Our support team is here to assist you.
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}