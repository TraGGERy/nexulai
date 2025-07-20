"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";

export default function AITools() {
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-white">
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
                <Link href="/ai-tools" className="text-purple-600 px-3 py-2 text-sm font-medium border-b-2 border-purple-600">AI Tools</Link>
                <Link href="/pricing" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">Pricing</Link>
                <Link href="/dashboard" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">Dashboard</Link>
                {!user && (
                  <Link href="/sign-up" className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700">Start Free Analysis</Link>
                )}
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-purple-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link href="/solutions" className="text-gray-900 hover:text-purple-600 block px-3 py-2 text-base font-medium">Solutions</Link>
                <Link href="/ai-tools" className="text-purple-600 block px-3 py-2 text-base font-medium border-l-4 border-purple-600 pl-2">AI Tools</Link>
                <Link href="/pricing" className="text-gray-900 hover:text-purple-600 block px-3 py-2 text-base font-medium">Pricing</Link>
                <Link href="/dashboard" className="text-gray-900 hover:text-purple-600 block px-3 py-2 text-base font-medium">Dashboard</Link>
                {!user && (
                  <Link href="/sign-up" className="bg-purple-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-700 mt-4">Start Free Analysis</Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            Advanced <span className="text-purple-600">AI Tools</span> Suite
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Access the same AI tools that power our consulting platform. Build, analyze, and optimize your business with cutting-edge artificial intelligence.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              🚀 50+ AI Tools • 🎯 Enterprise-Grade • 💡 No-Code Required
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Featured AI Tools</h2>
            <p className="mt-4 text-xl text-gray-600">
              Our most powerful AI tools for business transformation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Strategy AI */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Strategy AI</h3>
                  <p className="text-purple-600 font-semibold">Most Popular</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Generate comprehensive business strategies using AI that analyzes 10,000+ successful case studies and real-time market data.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">15min</div>
                  <div className="text-sm text-gray-600">Analysis Time</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">99%</div>
                  <div className="text-sm text-gray-600">Accuracy Rate</div>
                </div>
              </div>
              {!user ? (
                <Link href="/sign-up" className="block w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center">
                  Sign in to Try Strategy AI
                </Link>
              ) : (
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Try Strategy AI Free
                </button>
              )}
            </div>

            {/* Market Intelligence AI */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Market Intelligence AI</h3>
                  <p className="text-green-600 font-semibold">Real-Time Data</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Access real-time market insights from 1000+ data sources. Track competitors, identify trends, and discover opportunities instantly.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">1000+</div>
                  <div className="text-sm text-gray-600">Data Sources</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">24/7</div>
                  <div className="text-sm text-gray-600">Monitoring</div>
                </div>
              </div>
              {!user ? (
                <Link href="/sign-up" className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center">
                  Sign in to Try Market AI
                </Link>
              ) : (
                <Link href="/market-intelligence" className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center">
                  Try Market AI Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* All Tools Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Complete AI Toolkit</h2>
            <p className="mt-4 text-xl text-gray-600">
              50+ specialized AI tools for every business need
            </p>
          </div>

          {/* Tool Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Strategy & Planning */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m0 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m0 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v0" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Strategy & Planning</h3>
              <p className="text-gray-600 mb-4">AI tools for strategic planning and business model optimization.</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Business Model Canvas AI</span>
                  <span className="text-purple-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• SWOT Analysis Generator</span>
                  <span className="text-purple-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Strategic Roadmap Builder</span>
                  <span className="text-gray-500 font-semibold">Pro</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Competitive Positioning AI</span>
                  <span className="text-gray-500 font-semibold">Pro</span>
                </div>
              </div>
              {!user ? (
                <Link href="/sign-up" className="block w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center">
                  Sign in to Explore
                </Link>
              ) : (
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Explore Tools
                </button>
              )}
            </div>

            {/* Financial Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Financial Analysis</h3>
              <p className="text-gray-600 mb-4">Advanced AI for financial modeling and investment analysis.</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Cash Flow Predictor</span>
                  <span className="text-blue-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Valuation Model Builder</span>
                  <span className="text-gray-500 font-semibold">Pro</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Investment Risk Analyzer</span>
                  <span className="text-gray-500 font-semibold">Pro</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Financial Scenario Planner</span>
                  <span className="text-orange-500 font-semibold">Enterprise</span>
                </div>
              </div>
              {!user ? (
                <Link href="/sign-up" className="block w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center">
                  Sign in to Explore
                </Link>
              ) : (
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Explore Tools
                </button>
              )}
            </div>

            {/* Market Research */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Market Research</h3>
              <p className="text-gray-600 mb-4">Real-time market intelligence and competitive analysis tools.</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Market Size Calculator</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Competitor Tracker</span>
                  <span className="text-gray-500 font-semibold">Pro</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Trend Analyzer</span>
                  <span className="text-gray-500 font-semibold">Pro</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Customer Insights AI</span>
                  <span className="text-orange-500 font-semibold">Enterprise</span>
                </div>
              </div>
              {!user ? (
                <Link href="/sign-up" className="block w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center">
                  Sign in to Explore
                </Link>
              ) : (
                <Link href="/market-intelligence" className="block w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center">
                  Explore Tools
                </Link>
              )}
            </div>

            {/* Operations */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Operations</h3>
              <p className="text-gray-600 mb-4">AI-powered tools for operational efficiency and process optimization.</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Process Mapper</span>
                  <span className="text-orange-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Efficiency Analyzer</span>
                  <span className="text-gray-500 font-semibold">Pro</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Cost Optimizer</span>
                  <span className="text-gray-500 font-semibold">Pro</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Supply Chain AI</span>
                  <span className="text-orange-500 font-semibold">Enterprise</span>
                </div>
              </div>
              {!user ? (
                <Link href="/sign-up" className="block w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-center">
                  Sign in to Explore
                </Link>
              ) : (
                <button className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                  Explore Tools
                </button>
              )}
            </div>

            {/* Customer Experience */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Experience</h3>
              <p className="text-gray-600 mb-4">AI tools for customer journey optimization and experience enhancement.</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Journey Mapper</span>
                  <span className="text-pink-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Sentiment Analyzer</span>
                  <span className="text-gray-500 font-semibold">Pro</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Churn Predictor</span>
                  <span className="text-gray-500 font-semibold">Pro</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Personalization Engine</span>
                  <span className="text-orange-500 font-semibold">Enterprise</span>
                </div>
              </div>
              {!user ? (
                <Link href="/sign-up" className="block w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition-colors text-center">
                  Sign in to Explore
                </Link>
              ) : (
                <button className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                  Explore Tools
                </button>
              )}
            </div>

            {/* Risk & Compliance */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Risk & Compliance</h3>
              <p className="text-gray-600 mb-4">AI-powered risk assessment and compliance monitoring tools.</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Risk Scanner</span>
                  <span className="text-red-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Compliance Checker</span>
                  <span className="text-gray-500 font-semibold">Pro</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Fraud Detector</span>
                  <span className="text-gray-500 font-semibold">Pro</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">• Regulatory Monitor</span>
                  <span className="text-orange-500 font-semibold">Enterprise</span>
                </div>
              </div>
              {!user ? (
                <Link href="/sign-up" className="block w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors text-center">
                  Sign in to Explore
                </Link>
              ) : (
                <button className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                  Explore Tools
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* API & Integration */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Developer Tools & API</h2>
            <p className="mt-4 text-xl text-gray-600">
              Integrate our AI tools into your existing workflows and applications
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-900 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">REST API</h3>
              <p className="text-gray-300 mb-6">
                Access all our AI tools through a simple REST API. Perfect for developers who want to integrate our capabilities into their applications.
              </p>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <code className="text-green-400 text-sm">
                  curl -X POST https://api.nexusai.com/v1/strategy<br/>
                  -H &quot;Authorization: Bearer YOUR_API_KEY&quot;<br/>
                  -H &quot;Content-Type: application/json&quot;<br/>
                  -d &apos;{`{"company": "TechCorp", "challenge": "market expansion"}`}&apos;
                </code>
              </div>
              <div className="flex space-x-4">
                {!user ? (
                  <Link href="/sign-up" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                    Sign in for API Key
                  </Link>
                ) : (
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                    Get API Key
                  </button>
                )}
                <button className="border border-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  View Docs
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">No-Code Integrations</h4>
                <p className="text-gray-600 mb-4">Connect with your favorite tools without writing code.</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-2xl mb-1">📊</div>
                    <div className="text-xs font-semibold">Excel</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-2xl mb-1">📈</div>
                    <div className="text-xs font-semibold">Tableau</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="text-xs font-semibold">Zapier</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Enterprise SDKs</h4>
                <p className="text-gray-600 mb-4">Native SDKs for popular programming languages.</p>
                <div className="flex space-x-3">
                  <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-700">Python</span>
                  <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-700">JavaScript</span>
                  <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-700">Java</span>
                  <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-700">C#</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">White-Label Solutions</h4>
                <p className="text-gray-600 mb-4">Embed our AI tools in your platform with your branding.</p>
                {!user ? (
                  <Link href="/sign-up" className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                    Sign in to Contact Sales
                  </Link>
                ) : (
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                    Contact Sales
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Trusted by Thousands</h2>
            <p className="mt-4 text-xl text-gray-600">
              Our AI tools are used by businesses worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">AI Tools Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">10M+</div>
              <div className="text-gray-600">Analyses Generated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Start Building with AI Today
          </h2>
          <p className="mt-4 text-xl text-purple-100">
            Access our complete AI toolkit with a free account
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <Link href="/sign-up" className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg shadow-lg inline-block">
                Start Free Analysis
              </Link>
            ) : (
              <Link href="/dashboard" className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg shadow-lg inline-block">
                Go to Dashboard
              </Link>
            )}
            {!user ? (
              <Link href="/sign-up" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors text-lg inline-block">
                Sign in to View API Docs
              </Link>
            ) : (
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors text-lg">
                View API Docs
              </button>
            )}
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
              <h4 className="text-sm font-semibold mb-4">AI Tools</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Strategy AI</a></li>
                <li><a href="#" className="hover:text-white">Market Intelligence</a></li>
                <li><a href="#" className="hover:text-white">Financial Modeling</a></li>
                <li><a href="#" className="hover:text-white">Operations AI</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Developers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">API Documentation</a></li>
                <li><a href="#" className="hover:text-white">SDKs</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
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
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Nexus AI Consulting. Disrupting traditional consulting with AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}