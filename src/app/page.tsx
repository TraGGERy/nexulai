"use client";

import Image from "next/image";
import { useState } from "react";
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-xl sm:text-2xl font-bold text-purple-600">Nexus AI Consulting</div>
              <div className="ml-2 sm:ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                AI-Powered
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="/solutions" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">Solutions</a>
                <a href="/ai-tools" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">AI Tools</a>
                <a href="/pricing" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">Pricing</a>
                {isLoaded && user ? (
                  <Link href="/dashboard" className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/sign-in" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">
                      Sign In
                    </Link>
                    <Link href="/sign-up" className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700">
                      Start Free Analysis
                    </Link>
                  </>
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
              <a href="/ai-tools" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-purple-600 hover:bg-purple-50 rounded-md">AI Tools</a>
              <a href="/pricing" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-purple-600 hover:bg-purple-50 rounded-md">Pricing</a>
              {isLoaded && user ? (
                <Link href="/dashboard" className="block px-3 py-2 text-base font-medium bg-purple-600 text-white hover:bg-purple-700 rounded-md">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/sign-in" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-purple-600 hover:bg-purple-50 rounded-md">
                    Sign In
                  </Link>
                  <Link href="/sign-up" className="block px-3 py-2 text-base font-medium bg-purple-600 text-white hover:bg-purple-700 rounded-md">
                    Start Free Analysis
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 sm:py-16 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="text-center lg:col-span-6 lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-4 sm:mb-6">
                <span className="bg-purple-100 text-purple-800 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">
                  🚀 Revolutionary AI Consulting
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight md:text-5xl lg:text-6xl">
                Get <span className="text-purple-600">McKinsey-quality</span> insights in
                <span className="text-green-600"> 15 minutes</span>
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-600 leading-7 sm:leading-8">
                Revolutionary AI-powered consulting platform that delivers enterprise-grade business solutions at 1/100th the cost and 1000x faster than traditional consulting firms.
              </p>
              
              <div className="mt-4 sm:mt-6 flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  15-minute delivery
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  99% cost reduction
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No consultants needed
                </div>
              </div>

              <div className="mt-6 sm:mt-8 mx-auto lg:mx-0 max-w-xs sm:max-w-md">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {isLoaded && user ? (
                    <Link href="/dashboard" className="bg-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-base sm:text-lg shadow-lg text-center w-full sm:w-auto">
                      Go to Dashboard
                    </Link>
                  ) : (
                    <Link href="/sign-up" className="bg-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-base sm:text-lg shadow-lg text-center w-full sm:w-auto">
                      Start Free 15-Min Analysis
                    </Link>
                  )}
                  <Link href="/pricing" className="border-2 border-purple-600 text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-base sm:text-lg w-full sm:w-auto text-center">
                    View Pricing
                  </Link>
                </div>
                <p className="mt-3 text-xs sm:text-sm text-gray-500 text-center lg:text-left">
                  No credit card required • Instant results • 100% AI-powered
                </p>
              </div>
            </div>
            <div className="mt-10 sm:mt-12 mx-auto lg:mt-0 lg:col-span-6 lg:flex lg:items-center max-w-sm sm:max-w-md">
              <div className="relative mx-auto w-full rounded-xl shadow-xl lg:max-w-md">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-6 sm:p-8 rounded-xl text-white">
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl font-bold mb-2">15</div>
                    <div className="text-purple-100 mb-4 sm:mb-6 text-sm sm:text-base">Minutes Average</div>
                    
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-2">$99</div>
                    <div className="text-purple-100 mb-4 sm:mb-6 text-sm sm:text-base">vs $50,000+ Traditional</div>
                    
                    <div className="text-2xl sm:text-3xl font-bold text-green-300 mb-2">24/7</div>
                    <div className="text-purple-100 text-sm sm:text-base">AI Availability</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 md:text-4xl">Why Choose Nexus AI Over Traditional Consulting?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-red-800 mb-3 sm:mb-4">Traditional Consulting (McKinsey, BCG, Bain)</h3>
              <ul className="space-y-2 sm:space-y-3 text-red-700 text-sm sm:text-base">
                <li className="flex items-center"><span className="text-red-500 mr-2">❌</span> 3-6 months delivery</li>
                <li className="flex items-center"><span className="text-red-500 mr-2">❌</span> $50,000 - $500,000+ cost</li>
                <li className="flex items-center"><span className="text-red-500 mr-2">❌</span> Complex engagement process</li>
                <li className="flex items-center"><span className="text-red-500 mr-2">❌</span> Limited availability</li>
                <li className="flex items-center"><span className="text-red-500 mr-2">❌</span> Human bias & inconsistency</li>
              </ul>
            </div>
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 sm:p-6 md:transform md:scale-105 z-10">
              <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4">Nexus AI Consulting</h3>
              <ul className="space-y-2 sm:space-y-3 text-green-700 text-sm sm:text-base">
                <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> 15 minutes delivery</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> $99 - $999 cost</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> Instant start, no meetings</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> 24/7 availability</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> Data-driven consistency</li>
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 md:col-span-2 lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-3 sm:mb-4">DIY / Internal Teams</h3>
              <ul className="space-y-2 sm:space-y-3 text-yellow-700 text-sm sm:text-base">
                <li className="flex items-center"><span className="text-yellow-500 mr-2">⚠️</span> Weeks to months</li>
                <li className="flex items-center"><span className="text-yellow-500 mr-2">⚠️</span> Hidden opportunity costs</li>
                <li className="flex items-center"><span className="text-yellow-500 mr-2">⚠️</span> Limited expertise</li>
                <li className="flex items-center"><span className="text-yellow-500 mr-2">⚠️</span> Resource constraints</li>
                <li className="flex items-center"><span className="text-yellow-500 mr-2">⚠️</span> Lack of best practices</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI Solutions Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 md:text-4xl">AI-Powered Solutions</h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              Enterprise-grade consulting powered by advanced AI, delivered in minutes
            </p>
          </div>
          <div className="mt-10 sm:mt-12 lg:mt-16 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 border border-purple-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">AI Strategy Generator</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Generate comprehensive business strategies using AI analysis of 10,000+ successful case studies.
              </p>
              <div className="text-xs sm:text-sm text-purple-600 font-semibold">⚡ 15 minutes • $99</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 border border-green-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Market Analysis AI</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Real-time competitive analysis and market sizing using live data from 1000+ sources.
              </p>
              <div className="text-xs sm:text-sm text-green-600 font-semibold">⚡ 10 minutes • $149</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 border border-blue-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Operations Optimizer</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                AI-driven process optimization and cost reduction recommendations with ROI projections.
              </p>
              <div className="text-xs sm:text-sm text-blue-600 font-semibold">⚡ 20 minutes • $199</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 border border-orange-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Financial Modeling AI</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Automated financial projections, valuation models, and investment analysis.
              </p>
              <div className="text-xs sm:text-sm text-orange-600 font-semibold">⚡ 25 minutes • $249</div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-5 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 border border-pink-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Digital Transformation</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                AI-powered digital roadmaps and technology implementation strategies.
              </p>
              <div className="text-xs sm:text-sm text-pink-600 font-semibold">⚡ 30 minutes • $299</div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 border border-teal-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">ESG & Sustainability</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                AI-driven sustainability strategies and ESG compliance frameworks.
              </p>
              <div className="text-xs sm:text-sm text-teal-600 font-semibold">⚡ 20 minutes • $179</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-lg">
              <div className="text-yellow-400 mb-3 sm:mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">"Got better insights in 15 minutes than our previous 6-month McKinsey engagement. Saved us $200K and 5 months."</p>
              <div className="text-sm sm:text-base font-semibold">Sarah Chen, CEO TechStart</div>
            </div>
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-lg">
              <div className="text-yellow-400 mb-3 sm:mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">"The AI analysis was spot-on. Implemented their recommendations and saw 40% efficiency improvement within a month."</p>
              <div className="text-sm sm:text-base font-semibold">Marcus Rodriguez, COO GlobalCorp</div>
            </div>
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-lg">
              <div className="text-yellow-400 mb-3 sm:mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">"Finally, consulting that fits our startup budget and timeline. The quality rivals top-tier firms."</p>
              <div className="text-sm sm:text-base font-semibold">Emily Watson, Founder InnovateLab</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Ready to Disrupt Traditional Consulting?
          </h2>
          <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-purple-100">
            Join 10,000+ companies who chose AI over expensive consultants
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            {isLoaded && user ? (
              <Link href="/dashboard" className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-base sm:text-lg shadow-lg text-center">
                Go to Dashboard
              </Link>
            ) : (
              <Link href="/sign-up" className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-base sm:text-lg shadow-lg text-center">
                Start Free 15-Min Analysis
              </Link>
            )}
            <Link href="/pricing" className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors text-base sm:text-lg text-center">
              View Pricing Plans
            </Link>
          </div>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-purple-200">
            No consultants • No meetings • No BS • Just results
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="mb-6 sm:mb-0">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Nexus AI Consulting</h3>
              <p className="text-sm sm:text-base text-gray-400">
                Revolutionary AI-powered consulting platform delivering enterprise-grade solutions in minutes, not months.
              </p>
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400">
                🚀 15-min delivery • 💰 99% cost savings • 🤖 100% AI-powered
              </div>
            </div>
            <div className="mb-6 sm:mb-0">
              <h4 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">AI Solutions</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Strategy Generator</a></li>
                <li><a href="#" className="hover:text-white">Market Analysis</a></li>
                <li><a href="#" className="hover:text-white">Operations Optimizer</a></li>
                <li><a href="#" className="hover:text-white">Financial Modeling</a></li>
              </ul>
            </div>
            <div className="mb-6 sm:mb-0">
              <h4 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">Industries</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Technology</a></li>
                <li><a href="#" className="hover:text-white">Healthcare</a></li>
                <li><a href="#" className="hover:text-white">Financial Services</a></li>
                <li><a href="#" className="hover:text-white">Manufacturing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">Company</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About AI Technology</a></li>
                <li><a href="#" className="hover:text-white">Case Studies</a></li>
                <li><a href="#" className="hover:text-white">API Documentation</a></li>
                <li><a href="#" className="hover:text-white">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            <p>&copy; 2024 Nexus AI Consulting. Disrupting traditional consulting with AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
