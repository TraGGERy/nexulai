'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { PLAN_PRICES } from '@/lib/stripe';
import Link from 'next/link';
import SocialShare from '../components/SocialShare';

// Component that uses searchParams wrapped in Suspense
function SearchParamsHandler() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  
  return (
    <>
      {/* This component just reads URL params and passes them to parent via context or props */}
      <input type="hidden" id="success-param" value={success || ''} />
      <input type="hidden" id="canceled-param" value={canceled || ''} />
    </>
  );
}

export default function Pricing() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    isSubscribed: boolean;
    plan: string;
    status: string | null;
    renewalDate: Date | null;
    cancelAtPeriodEnd: boolean;
  }>({
    isSubscribed: false,
    plan: 'free',
    status: null,
    renewalDate: null,
    cancelAtPeriodEnd: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [urlParams, setUrlParams] = useState<{success: string | null, canceled: string | null}>({
    success: null,
    canceled: null
  });
  
  // Effect to read the URL parameters from the hidden inputs after they're populated
  useEffect(() => {
    const successParam = document.getElementById('success-param') as HTMLInputElement;
    const canceledParam = document.getElementById('canceled-param') as HTMLInputElement;
    
    if (successParam && canceledParam) {
      setUrlParams({
        success: successParam.value || null,
        canceled: canceledParam.value || null
      });
    }
  }, []);
  
  // Fetch user's subscription status
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/user/subscription-status');
        if (!response.ok) throw new Error('Failed to fetch subscription status');
        
        const status = await response.json();
        setSubscriptionStatus(prevState => ({
          ...prevState,
          ...status
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load subscription status');
      }
    };
    
    if (isLoaded) {
      fetchSubscriptionStatus();
    }
  }, [user, isLoaded]);
  
  // Handle subscription checkout
  const handleSubscribe = async (plan: string) => {
    if (!user) {
      router.push('/sign-in');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create checkout session');
      }
      
      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  

  
  return (
    <div className="min-h-screen bg-white">
      {/* Suspense boundary for SearchParams */}
      <Suspense fallback={<div>Loading URL parameters...</div>}>
        <SearchParamsHandler />
      </Suspense>
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-purple-600">Nexus AI Consulting</div>
              <div className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                AI-Powered
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="/solutions" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">Solutions</Link>
                <Link href="/ai-tools" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">AI Tools</Link>
                <Link href="/pricing" className="text-purple-600 px-3 py-2 text-sm font-medium border-b-2 border-purple-600">Pricing</Link>
                <Link href="/dashboard" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">Dashboard</Link>
                {!user && (
                  <Link href="/sign-up" className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700">Start Free Analysis</Link>
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
              <Link href="/solutions" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-purple-600 hover:bg-purple-50 rounded-md">Solutions</Link>
              <Link href="/ai-tools" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-purple-600 hover:bg-purple-50 rounded-md">AI Tools</Link>
              <Link href="/pricing" className="block px-3 py-2 text-base font-medium text-purple-600 hover:bg-purple-50 rounded-md">Pricing</Link>
              <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-purple-600 hover:bg-purple-50 rounded-md">Dashboard</Link>
              {!user && (
                <Link href="/sign-up" className="block px-3 py-2 text-base font-medium bg-purple-600 text-white hover:bg-purple-700 rounded-md">Start Free Analysis</Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            Simple, Transparent <span className="text-purple-600">Pricing</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              No hidden fees, no long-term contracts, no expensive consultants. Pay only for the AI insights you need.
            </p>
          <div className="mt-8 flex justify-center">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              💰 Save 99% vs Traditional Consulting • ⚡ Get Results in 15 Minutes
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Traditional vs AI Consulting</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-red-800 mb-6">Traditional Consulting</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-red-700">Strategy Project</span>
                  <span className="text-2xl font-bold text-red-800">$150,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-700">Market Analysis</span>
                  <span className="text-2xl font-bold text-red-800">$75,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-700">Operations Review</span>
                  <span className="text-2xl font-bold text-red-800">$100,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-700">Timeline</span>
                  <span className="text-xl font-bold text-red-800">3-6 months</span>
                </div>
              </div>
            </div>
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-8 transform scale-105">
              <h3 className="text-2xl font-bold text-green-800 mb-6">Nexus AI Consulting</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-green-700">AI Strategy Generator</span>
                  <span className="text-2xl font-bold text-green-800">$299</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Market Analysis AI</span>
                  <span className="text-2xl font-bold text-green-800">$149</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Operations Optimizer</span>
                  <span className="text-2xl font-bold text-green-800">$199</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Timeline</span>
                  <span className="text-xl font-bold text-green-800">15 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Choose Your Plan</h2>
            <p className="mt-4 text-xl text-gray-600">Start free, scale as you grow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <p className="text-gray-600 mb-6">Perfect for small businesses and startups</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                {subscriptionStatus.isSubscribed && subscriptionStatus.plan === 'free' ? (
                  <div className="w-full bg-green-100 text-green-800 py-3 rounded-lg font-semibold">
                    Current Plan
                  </div>
                ) : (
                  <button 
                    className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    disabled={!user}
                    onClick={() => router.push('/dashboard')}
                  >
                    {!user ? 'Sign in to Start' : 'Start Free'}
                  </button>
                )}
              </div>
              <div className="mt-8">
                <h4 className="font-semibold text-gray-900 mb-4">What&apos;s included:</h4>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">1 Free AI Analysis per month</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Basic market insights</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Email support</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">PDF reports</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="bg-white border-2 border-purple-300 rounded-xl p-8 hover:shadow-xl transition-all duration-300 transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                <p className="text-gray-600 mb-6">For growing companies and consultants</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-purple-600">${PLAN_PRICES.MONTHLY}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                {!user ? (
                  <button 
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    onClick={() => router.push('/sign-in?redirect=/pricing')}
                  >
                    Sign in to Subscribe
                  </button>
                ) : subscriptionStatus.isSubscribed && subscriptionStatus.plan === 'monthly' ? (
                  <div className="space-y-2">
                    <div className="w-full bg-green-100 text-green-800 py-3 rounded-lg font-semibold">
                      Current Plan
                    </div>
                    <a
                      href="/settings"
                      className="w-full border border-purple-600 text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-sm text-center block"
                    >
                      Manage Subscription
                    </a>
                  </div>
                ) : (
                  <button
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    onClick={() => handleSubscribe('monthly')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Subscribe Monthly'}
                  </button>
                )}
              </div>
              <div className="mt-8">
                <h4 className="font-semibold text-gray-900 mb-4">Everything in Starter, plus:</h4>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Unlimited AI analyses</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Advanced AI tools suite</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Real-time data integration</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Custom branding</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-6">For large organizations and consulting firms</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${PLAN_PRICES.YEARLY}</span>
                  <span className="text-gray-600">/year</span>
                </div>
                {!user ? (
                  <button 
                    className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    onClick={() => router.push('/sign-in?redirect=/pricing')}
                  >
                    Sign in to Subscribe
                  </button>
                ) : subscriptionStatus.isSubscribed && subscriptionStatus.plan === 'yearly' ? (
                  <div className="space-y-2">
                    <div className="w-full bg-green-100 text-green-800 py-3 rounded-lg font-semibold">
                      Current Plan
                    </div>
                    <a
                      href="/settings"
                      className="w-full border border-gray-900 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm text-center block"
                    >
                      Manage Subscription
                    </a>
                  </div>
                ) : (
                  <button
                    className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    onClick={() => handleSubscribe('yearly')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Subscribe Yearly'}
                  </button>
                )}
              </div>
              <div className="mt-8">
                <h4 className="font-semibold text-gray-900 mb-4">Everything in Professional, plus:</h4>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">White-label solution</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">API access</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Dedicated account manager</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Custom AI model training</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">SLA guarantee</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pay-per-use Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Or Pay Per Analysis</h2>
            <p className="mt-4 text-xl text-gray-600">No subscription needed - pay only for what you use</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Strategy Generator</h3>
              <p className="text-gray-600 mb-4">Comprehensive business strategy in 15 minutes</p>
              <div className="flex justify-between items-center">
                <button 
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => user ? router.push('/reports/new?type=strategy') : router.push('/sign-in?redirect=/reports/new?type=strategy')}
                  disabled={subscriptionStatus.isSubscribed && subscriptionStatus.plan !== 'free'}
                >
                  {!user ? 'Sign in to Buy' : subscriptionStatus.isSubscribed && subscriptionStatus.plan !== 'free' ? 'Included in Plan' : 'Buy Now'}
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Analysis AI</h3>
              <p className="text-gray-600 mb-4">Real-time competitive analysis and market sizing</p>
              <div className="flex justify-between items-center">
                <button 
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => user ? router.push('/reports/new?type=market') : router.push('/sign-in?redirect=/reports/new?type=market')}
                  disabled={subscriptionStatus.isSubscribed && subscriptionStatus.plan !== 'free'}
                >
                  {!user ? 'Sign in to Buy' : subscriptionStatus.isSubscribed && subscriptionStatus.plan !== 'free' ? 'Included in Plan' : 'Buy Now'}
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Operations Optimizer</h3>
              <p className="text-gray-600 mb-4">AI-driven process optimization recommendations</p>
              <div className="flex justify-between items-center">
                <button 
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => user ? router.push('/reports/new?type=operations') : router.push('/sign-in?redirect=/reports/new?type=operations')}
                  disabled={subscriptionStatus.isSubscribed && subscriptionStatus.plan !== 'free'}
                >
                  {!user ? 'Sign in to Buy' : subscriptionStatus.isSubscribed && subscriptionStatus.plan !== 'free' ? 'Included in Plan' : 'Buy Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How does AI consulting compare to traditional consulting?</h3>
              <p className="text-gray-600">Our AI delivers the same quality insights as top-tier consulting firms like McKinsey, but 1000x faster and at 1/100th the cost. No meetings, no delays, just instant results.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What is included in the free plan?</h3>
              <p className="text-gray-600">The free plan includes basic AI analysis capabilities, limited to 1 report per day, with standard templates and basic export options.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How do the subscription plans work?</h3>
              <p className="text-gray-600">Our subscription plans are billed monthly ($29.99/month) or annually ($299.99/year, saving 16%). You can upgrade, downgrade, or cancel at any time with no long-term commitments.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. When you cancel, your subscription will remain active until the end of your current billing period.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens when I cancel my subscription?</h3>
              <p className="text-gray-600">When you cancel, your subscription will remain active until the end of your current billing period. After that, you&apos;ll be downgraded to the free plan with a limit of 1 report per day.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What if I&apos;m not satisfied with the results?</h3>
              <p className="text-gray-600">We offer a 30-day money-back guarantee. If you&apos;re not completely satisfied with our AI insights, we&apos;ll refund your payment.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How accurate is the AI analysis?</h3>
              <p className="text-gray-600">Our AI is trained on 10,000+ successful business cases and real-time market data. It consistently delivers insights that match or exceed traditional consulting quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Save 99% on Consulting Costs?
          </h2>
          <p className="mt-4 text-xl text-purple-100">
            Start with our free plan or try Professional for 14 days
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg shadow-lg"
              onClick={() => user ? router.push('/dashboard') : router.push('/sign-in?redirect=/dashboard')}
            >
              {user ? 'Start Free Plan' : 'Sign in to Start'}
            </button>
            <button 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors text-lg"
              onClick={() => user ? handleSubscribe('monthly') : router.push('/sign-in?redirect=/pricing')}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : user ? 'Subscribe Monthly' : 'Sign in to Subscribe'}
            </button>
          </div>
          
          {/* Social Share */}
          <div className="mt-8 flex justify-center">
            <div className="bg-white rounded-full px-6 py-3 shadow-lg">
              <SocialShare 
                title="Affordable AI Consulting Plans - Save 99% on Consulting Costs"
                description="Revolutionary AI-powered consulting platform delivering McKinsey-quality insights in just 15 minutes at 1/100th the cost."
                hashtags={['AIConsulting', 'AffordableStrategy', 'BusinessIntelligence']}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Nexus AI Consulting</h3>
              <p className="text-gray-400">
                Revolutionary AI-powered consulting platform delivering enterprise-grade solutions in minutes, not months.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">AI Solutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Strategy Generator</a></li>
                <li><a href="#" className="hover:text-white">Market Analysis</a></li>
                <li><a href="#" className="hover:text-white">Operations Optimizer</a></li>
                <li><a href="#" className="hover:text-white">Financial Modeling</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Case Studies</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">API Docs</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
                <li><a href="#" className="hover:text-white">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Nexus AI Consulting. Disrupting traditional consulting with AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}