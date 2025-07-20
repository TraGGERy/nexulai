'use client';

import { useState, useCallback, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
// import { getUserSubscriptionStatus } from '@/lib/subscription-utils';

// Function to save report to database
async function saveReportToDatabase(report: AnalysisResult) {
  try {
    // Map report type to valid enum values in the database schema
    let reportType = report.type.toLowerCase();
    
    // Extract the base type from the report type string
    if (reportType.includes('market')) {
      reportType = 'market';
    } else if (reportType.includes('operations')) {
      reportType = 'operations';
    } else if (reportType.includes('financial')) {
      reportType = 'financial';
    } else if (reportType.includes('strategy') || reportType.includes('mckinsey')) {
      reportType = 'strategy';
    } else {
      // Default to strategy if no match
      reportType = 'strategy';
    }
    
    // Log the data being sent to the API for debugging
    const requestData = {
      title: report.title || `${report.type} Report`,
      type: reportType, // Use the mapped type that matches the enum
      content: report,
    };
    console.log('Sending report data to API:', requestData);
    
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Failed to save report: ${response.status}`);
    }

    const result = await response.json();
    console.log('Report saved to database:', result.data);
    return result.data;
  } catch (error) {
    console.error('Error saving report to database:', error);
    throw error;
  }
}

// Types
interface AnalysisResult {
  
  summary?: string;
  recommendations?: {
    title: string;
    description: string;
    impact: string;
    timeline: string;
    priority: number;
  }[];
  insights?: string[];
  metrics?: Record<string, string>;
  implementationRoadmap?: {
    quickWins: {
      title: string;
      description: string;
      timeline: string;
      kpis: string[];
    }[];
    strategicInitiatives: {
      title: string;
      description: string;
      timeline: string;
      kpis: string[];
    }[];
    transformationMilestones: {
      title: string;
      description: string;
      timeline: string;
      kpis: string[];
    }[];
    riskMonitoring: {
      risk: string;
      mitigation: string;
      indicator: string;
    }[];
    governanceStructure?: string;
  };
  timestamp: string;
  data?: Record<string, unknown>;
  results?: string;
  type: string;
  title?: string;
}

interface FormData {
  coreChallenge?: string;
  industry?: string;
  strategicQuestions?: string[];
  decisionTimeline?: string;
  selectedFrameworks?: string[];
  implementationTimeline?: string;
  presentationFormat?: string;
  riskTolerance?: string;
  market?: string;
  department?: string;
  processes?: string;
  period?: string;
  costAreas?: string;
  // Market Analysis Form fields
  company?: string;
  targetMarket?: string;
  competitors?: string;
  geography?: string;
}

type AnalysisType = 'market' | 'operations' | 'financial';

interface UseAnalysisReturn {
  analysisResults: AnalysisResult | null;
  setAnalysisResults: (result: AnalysisResult) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  errorMessage: string;
  clearError: () => void;
  setError: (message: string) => void;
}

// Custom hook for analysis management
function useAnalysis(): UseAnalysisReturn {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const clearError = useCallback(() => {
    setErrorMessage('');
  }, []);

  const setError = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

  return {
    analysisResults,
    setAnalysisResults,
    isAnalyzing,
    setIsAnalyzing,
    errorMessage,
    clearError,
    setError
  };
}

// Utility functions
const generateMockMetrics = (type: AnalysisType): Record<string, string> => {
  const baseMetrics = {
    marketSize: Math.floor(Math.random() * 100),
    cagr: Math.floor(Math.random() * 20),
    efficiency: Math.floor(Math.random() * 30 + 60),
    automationPotential: Math.floor(Math.random() * 40 + 30),
    costReduction: Math.floor(Math.random() * 20 + 10),
    revenueGrowth: Math.floor(Math.random() * 20 + 5),
    marginImprovement: Math.floor(Math.random() * 10 + 2),
    workingCapital: Math.floor(Math.random() * 50 + 10)
  };

  switch (type) {
    case 'market':
      return {
        "Market Attractiveness": "8.5/10",
        "Competitive Intensity": "Medium",
        "Growth Potential": "High"
      };
    case 'operations':
      return {
        "Operational Efficiency": `${baseMetrics.efficiency}%`,
        "Process Maturity": "6.8/10",
        "Automation Readiness": "High"
      };
    case 'financial':
      return {
        "Financial Health Score": "8.1/10",
        "Profitability Trend": "Positive",
        "Cash Flow Strength": "Strong"
      };
    default:
      return {
        "Analysis Completeness": "100%",
        "Strategic Alignment": "High",
        "Implementation Readiness": "Strong"
      };
  }
};

const createFallbackResult = (data: FormData | StrategyFormData): AnalysisResult => {
  // Type guard to check if it's StrategyFormData
  const isStrategyData = 'coreChallenge' in data;
  
  if (isStrategyData) {
    const strategyData = data as StrategyFormData;
    return {
      type: 'McKinsey Strategic Analysis',
      title: `Strategic Analysis Report: ${strategyData.industry || 'Business'} Sector`,
      summary: `Comprehensive strategic analysis completed. Due to technical limitations, this report uses our advanced analytical framework to provide strategic insights and recommendations.`,
      recommendations: [
        {
          title: "Strategic Priority Assessment",
          description: "Comprehensive evaluation of strategic priorities based on market dynamics and organizational capabilities.",
          impact: "High",
          timeline: strategyData.implementationTimeline || "6-12 months",
          priority: 1
        }
      ],
      insights: [
        `Strategic Context: ${strategyData.coreChallenge}`,
        `Market Focus: ${strategyData.industry} sector analysis`,
        `Implementation Timeline: ${strategyData.implementationTimeline}`,
        `Risk Profile: ${strategyData.riskTolerance} tolerance`
      ],
      metrics: {
        "Analysis Completeness": "100%",
        "Strategic Alignment": "High",
        "Implementation Readiness": "Strong"
      },
      timestamp: new Date().toLocaleString()
    };
  } else {
    // Use data directly without creating an unused variable
    return {
      type: 'Analysis Report',
      title: `Analysis Report: Business Analysis`,
      summary: `Comprehensive analysis completed. Due to technical limitations, this report uses our advanced analytical framework to provide insights and recommendations.`,
      recommendations: [
        {
          title: "Strategic Assessment",
          description: "Comprehensive evaluation based on provided data and analytical framework.",
          impact: "High",
          timeline: "6-12 months",
          priority: 1
        }
      ],
      insights: [
        `Analysis Type: General Analysis`,
        `Organization Focus: Target Organization`,
        `Data-driven insights and recommendations provided`
      ],
      metrics: {
        "Analysis Completeness": "100%",
        "Data Quality": "High",
        "Implementation Readiness": "Strong"
      },
      timestamp: new Date().toLocaleString()
    };
  }
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isSubscribed: false,
    plan: 'free',
    status: null,
    renewalDate: null,
    cancelAtPeriodEnd: false,
    dailyReportsCount: 0,
    dailyReportsLimit: 1,
    loading: false,
    error: ''
  });

  const {
    analysisResults,
    setAnalysisResults,
    isAnalyzing,
    setIsAnalyzing,
    errorMessage,
    clearError,
    setError
  } = useAnalysis();
  
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
          dailyReportsLimit: data.dailyReportsLimit || 1,
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
    
    if (isLoaded && user) {
      fetchSubscriptionStatus();
    } else if (isLoaded) {
      setSubscriptionStatus(prev => ({ ...prev, loading: false }));
    }
  }, [user, isLoaded]);

  const handleAnalysis = async (toolType: string, data: FormData | StrategyFormData) => {
    setIsAnalyzing(true);
    clearError(); // Clear any previous errors
    
    try {
      if (toolType === 'mckinsey-strategy') {
        // Call OpenAI API for comprehensive report generation
        const response = await fetch('/api/generate-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();
        
        let reportData;
        if (result.success) {
          reportData = result.report;
          setAnalysisResults(reportData);
        } else {
          // Use fallback report if API fails
          reportData = result.fallbackReport;
          setAnalysisResults(reportData);
          if (result.error) {
            setError(`API Notice: ${result.error}. Using fallback analysis.`);
          }
        }
        
        // Save the report to the database
        try {
          await saveReportToDatabase(reportData);
        } catch (dbError) {
          console.error('Failed to save report to database:', dbError);
          // Don't show this error to the user as it doesn't affect their experience
        }
      } else {
        // Keep existing logic for other analysis types
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        let result: AnalysisResult;
        
        if (toolType === 'market') {
          const marketData = data as FormData;
          result = {
            type: 'Market Analysis',
            title: `Market Intelligence Report: ${marketData.market || 'Target Market'}`,
            summary: `Comprehensive market analysis revealing key trends, opportunities, and competitive dynamics in the ${marketData.market || 'target market'} sector.`,
            recommendations: [
              {
                title: "Market Entry Strategy",
                description: `Recommended approach for entering ${marketData.market || 'target market'} based on competitive analysis and market dynamics.`,
                impact: "High",
                timeline: "6-9 months",
                priority: 1
              },
              {
                title: "Customer Segmentation Optimization",
                description: `Refined customer segmentation strategy targeting high-value segments with tailored value propositions.`,
                impact: "Medium",
                timeline: "3-6 months",
                priority: 2
              }
            ],
            insights: [
              `Market size: $${Math.floor(Math.random() * 100)}B with ${Math.floor(Math.random() * 20)}% CAGR`,
              `Key trends: Digital transformation, sustainability focus, customer experience priority`,
              `Competitive landscape: Fragmented market with consolidation opportunities`
            ],
            metrics: generateMockMetrics('market'),
            timestamp: new Date().toLocaleString()
          };
          
          // Save the report to the database
          try {
            await saveReportToDatabase(result);
          } catch (dbError) {
            console.error('Failed to save report to database:', dbError);
          }
        } else if (toolType === 'operations') {
          const operationsData = data as FormData;
          result = {
            type: 'Operations Analysis',
            title: `Operational Excellence Assessment: ${operationsData.department || 'Operations'}`,
            summary: `Detailed operational analysis identifying efficiency opportunities and process optimization recommendations.`,
            recommendations: [
              {
                title: "Process Automation Initiative",
                description: `Implement automation solutions for ${operationsData.processes || 'key processes'} to improve efficiency and reduce costs.`,
                impact: "High",
                timeline: "4-8 months",
                priority: 1
              },
              {
                title: "Performance Management System",
                description: `Deploy comprehensive KPI framework and performance monitoring system for continuous improvement.`,
                impact: "Medium",
                timeline: "2-4 months",
                priority: 2
              }
            ],
            insights: [
              `Current efficiency: ${Math.floor(Math.random() * 30 + 60)}%`,
              `Automation potential: ${Math.floor(Math.random() * 40 + 30)}% of processes`,
              `Cost reduction opportunity: ${Math.floor(Math.random() * 20 + 10)}%`
            ],
            metrics: generateMockMetrics('operations'),
            timestamp: new Date().toLocaleString()
          };
          
          // Save the report to the database
          try {
            await saveReportToDatabase(result);
          } catch (dbError) {
            console.error('Failed to save report to database:', dbError);
          }
        } else {
          // Financial analysis
          const financialData = data as FormData;
          result = {
            type: 'Financial Analysis',
            title: `Financial Performance Assessment: ${financialData.period || 'Current Period'}`,
            summary: `Comprehensive financial analysis with performance metrics, trend analysis, and strategic financial recommendations.`,
            recommendations: [
              {
                title: "Capital Allocation Optimization",
                description: `Optimize capital allocation across business units based on ROI analysis and strategic priorities.`,
                impact: "High",
                timeline: "3-6 months",
                priority: 1
              },
              {
                title: "Cost Structure Optimization",
                description: `Implement cost management initiatives targeting ${financialData.costAreas || 'key cost areas'} for improved profitability.`,
                impact: "Medium",
                timeline: "2-5 months",
                priority: 2
              }
            ],
            insights: [
              `Revenue growth: ${Math.floor(Math.random() * 20 + 5)}% YoY`,
              `Margin improvement opportunity: ${Math.floor(Math.random() * 10 + 2)}%`,
              `Working capital optimization: $${Math.floor(Math.random() * 50 + 10)}M potential`
            ],
            metrics: generateMockMetrics('financial'),
            timestamp: new Date().toLocaleString()
          };
          
          // Save the report to the database
          try {
            await saveReportToDatabase(result);
          } catch (dbError) {
            console.error('Failed to save report to database:', dbError);
          }
        }
        
        setAnalysisResults(result);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      
      // Set user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          setError('Network error: Please check your internet connection and try again.');
        } else if (error.message.includes('API request failed')) {
          setError('Service temporarily unavailable. Using fallback analysis.');
        } else {
          setError('An unexpected error occurred. Using fallback analysis.');
        }
      } else {
        setError('An unexpected error occurred. Using fallback analysis.');
      }
      
      // Fallback to mock data if API fails
      const fallbackResult = createFallbackResult(data);
      
      setAnalysisResults(fallbackResult);
    } finally {
      setIsAnalyzing(false);
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
              <div className="ml-2 sm:ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                Dashboard
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="/solutions" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">Solutions</Link>
                <Link href="/reports" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">My Reports</Link>
                <a href="/dashboard" className="text-purple-600 px-3 py-2 text-sm font-medium border-b-2 border-purple-600">Dashboard</a>
                <a href="/settings" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">Settings</a>
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
              <Link href="/solutions" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-purple-600 hover:bg-purple-50 rounded-md">Solutions</Link>
              <Link href="/reports" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-purple-600 hover:bg-purple-50 rounded-md">My Reports</Link>
              <a href="/dashboard" className="block px-3 py-2 text-base font-medium text-purple-600 bg-purple-50 rounded-md">Dashboard</a>
              <a href="/settings" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-purple-600 hover:bg-purple-50 rounded-md">Settings</a>
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
        {/* Dashboard Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">AI Analysis Dashboard</h1>
          <p className="mt-2 text-black text-sm sm:text-base">Perform comprehensive business analysis with our AI-powered tools</p>
        </div>

        {/* Subscription Status */}
        {isLoaded && user && (
          <div className="mb-6 sm:mb-8">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
              {subscriptionStatus.loading ? (
                <div className="flex justify-center items-center h-16">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-700"></div>
                </div>
              ) : subscriptionStatus.error ? (
                <div className="text-red-600 text-sm py-2">{subscriptionStatus.error}</div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-black">Your Subscription Plan</h3>
                    <div className="text-sm text-green-600">🚀 You&apos;re all set!</div>
                  </div>
                  <div className="flex items-center mb-3">
                    <div className={`w-3 h-3 rounded-full mr-2 ${subscriptionStatus.isSubscribed ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <span className="font-medium text-black">
                      {subscriptionStatus.plan === 'free' ? 'Free Tier - Basic Access' : 
                       subscriptionStatus.plan === 'monthly' ? 'Professional Plan - Full Access' : 
                       subscriptionStatus.plan === 'yearly' ? 'Enterprise Plan - Premium Access' : 'Plan Status Unknown'}
                    </span>
                    {subscriptionStatus.cancelAtPeriodEnd && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Expires Soon</span>
                    )}
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-black">AI Reports Available Today</span>
                      <span className="font-medium">
                        {subscriptionStatus.plan === 'free' ? 
                          `${Math.max(0, subscriptionStatus.dailyReportsLimit - subscriptionStatus.dailyReportsCount)} remaining of ${subscriptionStatus.dailyReportsLimit}` : 
                          'Unlimited Access'}
                      </span>
                    </div>
                    {subscriptionStatus.plan === 'free' && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(subscriptionStatus.dailyReportsCount / subscriptionStatus.dailyReportsLimit) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                  {subscriptionStatus.renewalDate && (
                    <p className="text-xs text-gray-500">
                      {subscriptionStatus.cancelAtPeriodEnd ? 
                        `Your plan expires on ${new Date(subscriptionStatus.renewalDate).toLocaleDateString()}` : 
                        `Next billing date: ${new Date(subscriptionStatus.renewalDate).toLocaleDateString()}`}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
       
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left Panel - Analysis Tools */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="flex whitespace-nowrap px-4 sm:px-6">
                  {[
                    { id: 'overview', name: 'Overview', icon: '📊' },
                    { id: 'strategy', name: 'Strategy AI', icon: '🎯' },
                    { id: 'market', name: 'Market Analysis', icon: '📈' },
                    { id: 'operations', name: 'Operations', icon: '⚙️' },
                    { id: 'financial', name: 'Financial', icon: '💰' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 sm:py-4 px-2 sm:px-3 mr-2 sm:mr-4 border-b-2 font-medium text-xs sm:text-sm ${
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-1 sm:mr-2">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-3 sm:p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-black mb-2 sm:mb-4">Welcome to Your AI Dashboard</h3>
                    <p className="text-sm sm:text-base text-black mb-4 sm:mb-6">
                      Select an AI tool from the tabs above to start your analysis. Each tool provides specialized insights for different business needs.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                        <h4 className="text-sm sm:text-base font-semibold text-black mb-1 sm:mb-2">🎯 Strategy AI</h4>
                        <p className="text-xs sm:text-sm text-black">Generate comprehensive business strategies and competitive analysis</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                        <h4 className="text-sm sm:text-base font-semibold text-black mb-1 sm:mb-2">📈 Market Analysis</h4>
                        <p className="text-xs sm:text-sm text-black">Real-time market insights and competitor intelligence</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                        <h4 className="text-sm sm:text-base font-semibold text-black mb-1 sm:mb-2">⚙️ Operations</h4>
                        <p className="text-xs sm:text-sm text-black">Process optimization and efficiency improvements</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                        <h4 className="text-sm sm:text-base font-semibold text-black mb-1 sm:mb-2">💰 Financial</h4>
                        <p className="text-xs sm:text-sm text-black">Financial modeling and investment analysis</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'strategy' && (
                  <StrategyAnalysisForm onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />
                )}

                {activeTab === 'market' && (
                  <MarketAnalysisForm onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />
                )}

                {activeTab === 'operations' && (
                  <OperationsAnalysisForm onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />
                )}

                {activeTab === 'financial' && (
                  <FinancialAnalysisForm onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Results & History */}
          <div className="space-y-4 sm:space-y-6">
            {/* Current Analysis */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-black mb-2 sm:mb-4">Current Analysis</h3>
              
              {isAnalyzing ? (
                <div className="text-center py-4 sm:py-8">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-purple-600 mx-auto mb-3 sm:mb-4"></div>
                  <p className="text-sm sm:text-base text-black">AI is analyzing your data...</p>
                  <p className="text-xs sm:text-sm text-black mt-1 sm:mt-2">This usually takes 10-15 minutes</p>
                </div>
              ) : analysisResults ? (
                <div className="space-y-3 sm:space-y-4">
                  {/* Error Message Display */}
                  {errorMessage && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center">
                        <div className="text-yellow-600 mr-2">⚠️</div>
                        <p className="text-yellow-800 text-xs sm:text-sm">{errorMessage}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-black">Analysis Type</span>
                    <span className="text-xs sm:text-sm text-black capitalize">{analysisResults.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-black">Status</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Complete
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-black">Completed</span>
                    <span className="text-xs sm:text-sm text-black">{new Date(analysisResults.timestamp).toLocaleString()}</span>
                  </div>
                  <button className="w-full bg-purple-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-purple-700 transition-colors">
                    View Full Report
                  </button>
                </div>
              ) : (
                <div className="text-center py-4 sm:py-8 text-black">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm sm:text-base">No analysis running</p>
                  <p className="text-xs sm:text-sm mt-1">Start an analysis to see results here</p>
                </div>
              )}
            </div>

            {/* Recent Analyses */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-black mb-2 sm:mb-4">Recent Analyses</h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { type: 'Strategy Analysis', company: 'TechCorp', date: '2 hours ago', status: 'completed' },
                  { type: 'Market Research', company: 'RetailCo', date: '1 day ago', status: 'completed' },
                  { type: 'Financial Model', company: 'StartupX', date: '2 days ago', status: 'completed' },
                  { type: 'Operations Review', company: 'ManufacturingInc', date: '3 days ago', status: 'completed' }
                ].map((analysis, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-black">{analysis.type}</p>
                      <p className="text-xs text-black">{analysis.company} • {analysis.date}</p>
                    </div>
                    <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 sm:mt-4 text-purple-600 text-xs sm:text-sm font-medium hover:text-purple-700">
                View All Analyses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Strategy Analysis Form Component
// Constants for form options
const DECISION_TIMELINES = [
  { value: 'immediate', label: 'Immediate (1-2 weeks)' },
  { value: 'short', label: 'Short-term (1-3 months)' },
  { value: 'medium', label: 'Medium-term (3-6 months)' },
  { value: 'long', label: 'Long-term (6+ months)' }
] as const;

const ANALYSIS_DEPTHS = [
  { value: 'high-level', label: 'High-level overview' },
  { value: 'comprehensive', label: 'Comprehensive analysis' },
  { value: 'deep-dive', label: 'Deep-dive investigation' }
] as const;

const RISK_TOLERANCES = [
  { value: 'conservative', label: 'Conservative' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'aggressive', label: 'Aggressive' }
] as const;

const IMPLEMENTATION_TIMELINES = [
  { value: 'immediate', label: 'Immediate (0-3 months)' },
  { value: 'short', label: 'Short-term (3-6 months)' },
  { value: 'medium', label: 'Medium-term (6-12 months)' },
  { value: 'long', label: 'Long-term (12+ months)' }
] as const;

const PRESENTATION_FORMATS = [
  { value: 'executive-summary', label: 'Executive Summary' },
  { value: 'detailed-report', label: 'Detailed Report' },
  { value: 'presentation-slides', label: 'Presentation Slides' },
  { value: 'dashboard', label: 'Interactive Dashboard' }
] as const;

const STRATEGIC_FRAMEWORKS = [
  'McKinsey 7S Model',
  'Porter\'s Five Forces',
  'BCG Growth-Share Matrix',
  'Value Chain Analysis',
  'SWOT Analysis',
  'Blue Ocean Strategy',
  'Ansoff Matrix',
  'Balanced Scorecard'
] as const;

interface StrategyFormData {
  // Phase 1: Strategic Context Discovery
  coreChallenge: string;
  industry: string;
  strategicQuestions: string[];
  
  // Phase 2: Stakeholder and Success Definition
  keyStakeholders: string;
  successMetrics: string;
  decisionTimeline: string;
  
  // Phase 3: Market Research Scope
  competitiveScope: string;
  customerSegments: string;
  marketGeography: string;
  
  // Phase 4: Framework Preferences
  preferredFrameworks: string[];
  analysisDepth: string;
  
  // Phase 5: Data Sources
  availableData: string;
  dataConstraints: string;
  
  // Phase 6: Strategic Options
  riskTolerance: string;
  resourceConstraints: string;
  
  // Phase 7: Implementation Focus
  implementationTimeline: string;
  organizationalReadiness: string;
  
  // Phase 8: Report Requirements
  reportAudience: string;
  presentationFormat: string;
  
  // Phase 9: Strategic Implementation Roadmap
  quickWinPriorities: string;
  strategicInitiatives: string;
  transformationMilestones: string;
  riskMonitoringApproach: string;
  governanceStructure: string;
}

// Form validation helper
const validatePhase = (phase: number, formData: StrategyFormData, strategicQuestionsText?: string): string[] => {
  const errors: string[] = [];
  
  switch (phase) {
    case 1:
      if (!formData.coreChallenge.trim()) errors.push('Core Business Challenge is required');
      if (!formData.industry.trim()) errors.push('Industry/Market is required');
      if (!strategicQuestionsText?.trim()) errors.push('Strategic Questions are required');
      break;
    case 2:
      if (!formData.decisionTimeline) errors.push('Decision Timeline is required');
      break;
    case 4:
      if (formData.preferredFrameworks.length === 0) errors.push('At least one strategic framework must be selected');
      break;
  }
  
  return errors;
};

function StrategyAnalysisForm({ onAnalyze, isAnalyzing }: { 
  onAnalyze: (type: string, data: StrategyFormData) => void; 
  isAnalyzing: boolean;
}) {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [strategicQuestionsText, setStrategicQuestionsText] = useState(''); // Helper state for textarea
  const [formData, setFormData] = useState<StrategyFormData>({
    // Phase 1: Strategic Context Discovery
    coreChallenge: '',
    industry: '',
    strategicQuestions: [],
    
    // Phase 2: Stakeholder and Success Definition
    keyStakeholders: '',
    successMetrics: '',
    decisionTimeline: '',
    
    // Phase 3: Market Research Scope
    competitiveScope: '',
    customerSegments: '',
    marketGeography: '',
    
    // Phase 4: Framework Preferences
    preferredFrameworks: [] as string[],
    analysisDepth: 'comprehensive',
    
    // Phase 5: Data Sources
    availableData: '',
    dataConstraints: '',
    
    // Phase 6: Strategic Options
    riskTolerance: 'moderate',
    resourceConstraints: '',
    
    // Phase 7: Implementation Focus
    implementationTimeline: '',
    organizationalReadiness: '',
    
    // Phase 8: Report Requirements
    reportAudience: '',
    presentationFormat: 'executive-summary',
    
    // Phase 9: Strategic Implementation Roadmap
    quickWinPriorities: '',
    strategicInitiatives: '',
    transformationMilestones: '',
    riskMonitoringApproach: '',
    governanceStructure: ''
  });

  const phases = [
    {
      id: 1,
      title: "Strategic Context Discovery",
      description: "Establishing the strategic foundation and scope for analysis",
      icon: "🎯"
    },
    {
      id: 2,
      title: "Stakeholder & Success Definition",
      description: "Clarifying decision-makers and success metrics",
      icon: "👥"
    },
    {
      id: 3,
      title: "Market Research Scope",
      description: "Defining comprehensive market and competitive intelligence parameters",
      icon: "📊"
    },
    {
      id: 4,
      title: "Framework Selection",
      description: "Choosing McKinsey methodologies for structured analysis",
      icon: "🔬"
    },
    {
      id: 5,
      title: "Data & Insights",
      description: "Specifying data sources and analytical constraints",
      icon: "📈"
    },
    {
      id: 6,
      title: "Strategic Options",
      description: "Defining risk tolerance and strategic pathways",
      icon: "🚀"
    },
    {
      id: 7,
      title: "Implementation Planning",
      description: "Implementation considerations and organizational readiness",
      icon: "⚙️"
    },
    {
      id: 8,
      title: "Report Configuration",
      description: "Executive report format and delivery preferences",
      icon: "📋"
    },
    {
      id: 9,
      title: "Strategic Implementation Roadmap",
      description: "Creating actionable next steps and monitoring framework",
      icon: "🗺️"
    }
  ];

  const frameworks = STRATEGIC_FRAMEWORKS;

  const handleFrameworkChange = (framework: string) => {
    const current = formData.preferredFrameworks;
    const updated = current.includes(framework)
      ? current.filter(f => f !== framework)
      : [...current, framework];
    setFormData({ ...formData, preferredFrameworks: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert strategic questions text to array by splitting on newlines and filtering empty lines
    const strategicQuestionsArray = strategicQuestionsText
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0);
    
    const submissionData = {
      ...formData,
      strategicQuestions: strategicQuestionsArray
    };
    
    onAnalyze('mckinsey-strategy', submissionData);
  };

  const nextPhase = () => {
    const errors = validatePhase(currentPhase, formData, strategicQuestionsText);
    setValidationErrors(errors);
    
    if (errors.length === 0 && currentPhase < 9) {
      setCurrentPhase(currentPhase + 1);
    }
  };

  const prevPhase = () => {
    setValidationErrors([]);
    if (currentPhase > 1) setCurrentPhase(currentPhase - 1);
  };

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-purple-800 mb-2">McKinsey Senior Partner Analysis</h4>
              <p className="text-purple-700 text-sm">
                I&apos;ll adopt the role of an expert McKinsey Senior Partner with 15+ years of experience leading Fortune 500 transformations. 
                Let&apos;s establish your strategic foundation.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Core Business Challenge or Opportunity *
              </label>
              <textarea
                value={formData.coreChallenge}
                onChange={(e) => setFormData({ ...formData, coreChallenge: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                rows={3}
                placeholder="Describe the primary strategic challenge or opportunity you're analyzing..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Industry/Market *
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                placeholder="e.g., Technology, Healthcare, Financial Services..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Specific Strategic Questions *
              </label>
              <textarea
                value={strategicQuestionsText}
                onChange={(e) => setStrategicQuestionsText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                rows={3}
                placeholder="What specific strategic questions need answering? (e.g., market entry strategy, competitive positioning, growth opportunities...)"
                required
              />
              <p className="text-xs text-black mt-1">Enter each question on a new line</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">Stakeholder Alignment</h4>
              <p className="text-blue-700 text-sm">
                Clarifying decision-makers and success metrics to ensure our recommendations align with organizational priorities.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Key Stakeholders & Decision Makers
              </label>
              <textarea
                value={formData.keyStakeholders}
                onChange={(e) => setFormData({ ...formData, keyStakeholders: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                rows={2}
                placeholder="CEO, Board, Department Heads, Investors..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Success Metrics & KPIs
              </label>
              <textarea
                value={formData.successMetrics}
                onChange={(e) => setFormData({ ...formData, successMetrics: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                rows={2}
                placeholder="Revenue growth, market share, cost reduction, ROI targets..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Decision Timeline
              </label>
              <select
                value={formData.decisionTimeline}
                onChange={(e) => setFormData({ ...formData, decisionTimeline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
              >
                <option value="">Select timeline...</option>
                {DECISION_TIMELINES.map((timeline) => (
                  <option key={timeline.value} value={timeline.value}>
                    {timeline.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-green-800 mb-2">Market Intelligence Scope</h4>
              <p className="text-green-700 text-sm">
                Defining the scope for comprehensive market and competitive analysis using live data from 1000+ sources.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Competitive Landscape Scope
              </label>
              <textarea
                value={formData.competitiveScope}
                onChange={(e) => setFormData({ ...formData, competitiveScope: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                rows={2}
                placeholder="Direct competitors, indirect competitors, potential disruptors..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Customer Segments & Behavior
              </label>
              <textarea
                value={formData.customerSegments}
                onChange={(e) => setFormData({ ...formData, customerSegments: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                rows={2}
                placeholder="Target customer segments, buying behavior, preferences..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Geographic Market Scope
              </label>
              <input
                type="text"
                value={formData.marketGeography}
                onChange={(e) => setFormData({ ...formData, marketGeography: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                placeholder="Global, North America, Europe, Asia-Pacific, specific countries..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-orange-800 mb-2">Strategic Framework Selection</h4>
              <p className="text-orange-700 text-sm">
                Choose the McKinsey methodologies and frameworks most relevant to your strategic analysis.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-3">
                Preferred Strategic Frameworks (select multiple)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {frameworks.map((framework) => (
                  <label key={framework} className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.preferredFrameworks.includes(framework)}
                      onChange={() => handleFrameworkChange(framework)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-black">{framework}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Analysis Depth
              </label>
              <select
                value={formData.analysisDepth}
                onChange={(e) => setFormData({ ...formData, analysisDepth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
              >
                {ANALYSIS_DEPTHS.map((depth) => (
                  <option key={depth.value} value={depth.value}>
                    {depth.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-indigo-800 mb-2">Data & Insights Configuration</h4>
              <p className="text-indigo-700 text-sm">
                Specify available data sources and any constraints for the most accurate analysis.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Available Data Sources
              </label>
              <textarea
                value={formData.availableData}
                onChange={(e) => setFormData({ ...formData, availableData: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                rows={3}
                placeholder="Financial statements, market research, customer data, operational metrics, industry reports..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Data Constraints or Limitations
              </label>
              <textarea
                value={formData.dataConstraints}
                onChange={(e) => setFormData({ ...formData, dataConstraints: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                rows={2}
                placeholder="Confidentiality requirements, data availability issues, regulatory constraints..."
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-red-800 mb-2">Strategic Options Development</h4>
              <p className="text-red-700 text-sm">
                Define risk tolerance and resource constraints to develop appropriate strategic pathways.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Risk Tolerance
              </label>
              <select
                value={formData.riskTolerance}
                onChange={(e) => setFormData({ ...formData, riskTolerance: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
              >
                {RISK_TOLERANCES.map((risk) => (
                  <option key={risk.value} value={risk.value}>
                    {risk.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Resource Constraints
              </label>
              <textarea
                value={formData.resourceConstraints}
                onChange={(e) => setFormData({ ...formData, resourceConstraints: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                rows={2}
                placeholder="Budget limitations, personnel constraints, technology limitations, regulatory restrictions..."
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-teal-800 mb-2">Implementation Planning</h4>
              <p className="text-teal-700 text-sm">
                Implementation considerations and organizational readiness assessment.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Implementation Timeline
              </label>
              <select
                value={formData.implementationTimeline}
                onChange={(e) => setFormData({ ...formData, implementationTimeline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
              >
                <option value="">Select timeline...</option>
                {IMPLEMENTATION_TIMELINES.map((timeline) => (
                  <option key={timeline.value} value={timeline.value}>
                    {timeline.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Organizational Readiness
              </label>
              <textarea
                value={formData.organizationalReadiness}
                onChange={(e) => setFormData({ ...formData, organizationalReadiness: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                rows={3}
                placeholder="Change management capabilities, leadership support, cultural factors, previous transformation experience..."
              />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-purple-800 mb-2">Executive Report Configuration</h4>
              <p className="text-purple-700 text-sm">
                Final configuration for your comprehensive McKinsey-style strategic report.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Primary Report Audience
              </label>
              <input
                type="text"
                value={formData.reportAudience}
                onChange={(e) => setFormData({ ...formData, reportAudience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                placeholder="Board of Directors, C-Suite, Investment Committee..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Presentation Format
              </label>
              <select
                value={formData.presentationFormat}
                onChange={(e) => setFormData({ ...formData, presentationFormat: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
              >
                {PRESENTATION_FORMATS.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">🎯 Ready to Generate Your $500K McKinsey Report</h4>
              <p className="text-yellow-700 text-sm mb-3">
                Your comprehensive strategic analysis will include:
              </p>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Executive summary with key recommendations</li>
                <li>• Market analysis and competitive landscape</li>
                <li>• Strategic framework application and insights</li>
                <li>• Detailed recommendations with implementation plans</li>
                <li>• Risk assessment and mitigation strategies</li>
                <li>• Success metrics and monitoring approach</li>
              </ul>
            </div>
          </div>
        );
        
      case 9:
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">Strategic Implementation Roadmap</h4>
              <p className="text-blue-700 text-sm">
                Creating actionable next steps and monitoring framework for successful execution.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                90-Day Quick Win Priorities
              </label>
              <textarea
                value={formData.quickWinPriorities}
                onChange={(e) => setFormData({ ...formData, quickWinPriorities: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                rows={3}
                placeholder="Immediate actions that can deliver visible results within 90 days..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                6-Month Strategic Initiatives
              </label>
              <textarea
                value={formData.strategicInitiatives}
                onChange={(e) => setFormData({ ...formData, strategicInitiatives: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                rows={3}
                placeholder="Key strategic initiatives to implement within 6 months..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                12-Month Transformation Milestones
              </label>
              <textarea
                value={formData.transformationMilestones}
                onChange={(e) => setFormData({ ...formData, transformationMilestones: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                rows={3}
                placeholder="Major transformation milestones to achieve within 12 months..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Risk Monitoring Approach
              </label>
              <textarea
                value={formData.riskMonitoringApproach}
                onChange={(e) => setFormData({ ...formData, riskMonitoringApproach: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                rows={2}
                placeholder="Approach for monitoring risks and implementing adjustment protocols..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Governance Structure
              </label>
              <textarea
                value={formData.governanceStructure}
                onChange={(e) => setFormData({ ...formData, governanceStructure: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                rows={2}
                placeholder="Governance structure for implementation oversight and decision-making..."
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">🚀 Complete Implementation Framework</h4>
              <p className="text-green-700 text-sm mb-3">
                Your comprehensive McKinsey-quality strategic report is ready for executive action, including:
              </p>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Complete implementation roadmap with timeline</li>
                <li>• Actionable quick wins for immediate impact</li>
                <li>• Strategic initiatives with clear KPIs</li>
                <li>• Risk monitoring and adjustment mechanisms</li>
                <li>• Governance structure for effective execution</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-black">McKinsey Strategic Analysis</h3>
          <p className="text-black text-sm">
            Generate a comprehensive $500K-quality strategic report using McKinsey methodologies
          </p>
        </div>
        <div className="text-sm text-purple-600 font-semibold">
          Phase {currentPhase} of 9
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Strategic Context</span>
          <span>Report Generation</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentPhase / 9) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Phase Navigation */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {phases.map((phase) => (
          <button
            key={phase.id}
            onClick={() => setCurrentPhase(phase.id)}
            className={`p-2 text-xs rounded-lg border transition-all ${
              currentPhase === phase.id
                ? 'bg-purple-100 border-purple-300 text-purple-800'
                : currentPhase > phase.id
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}
          >
            <div className="text-lg mb-1">{phase.icon}</div>
            <div className="font-medium">{phase.title}</div>
          </button>
        ))}
      </div>

      {/* Current Phase Content */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">{phases[currentPhase - 1]?.icon}</span>
            <div>
              <h4 className="font-semibold text-gray-900">{phases[currentPhase - 1]?.title}</h4>
              <p className="text-sm text-black">{phases[currentPhase - 1]?.description}</p>
            </div>
          </div>
          
          {renderPhaseContent()}
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <div className="text-red-600 mr-2">⚠️</div>
              <h4 className="text-red-800 font-medium">Please complete the following fields:</h4>
            </div>
            <ul className="list-disc list-inside text-red-700 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevPhase}
            disabled={currentPhase === 1}
            className={`px-4 py-2 rounded-md font-medium ${
              currentPhase === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ← Previous
          </button>

          {currentPhase < 8 ? (
            <button
              type="button"
              onClick={nextPhase}
              className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700"
            >
              Next →
            </button>
          ) : (
            <button
              type="submit"
              disabled={isAnalyzing}
              className={`px-6 py-2 rounded-md font-medium ${
                isAnalyzing
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isAnalyzing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating McKinsey Report...
                </div>
              ) : (
                '🚀 Generate Strategic Report'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// Market Analysis Form Data Interface
interface MarketAnalysisFormData {
  company: string;
  targetMarket: string;
  competitors: string;
  geography: string;
}

// Market Analysis Form Component
function MarketAnalysisForm({ onAnalyze, isAnalyzing }: { onAnalyze: (type: string, data: MarketAnalysisFormData) => Promise<void>, isAnalyzing: boolean }) {
  const [formData, setFormData] = useState({
    company: '',
    targetMarket: '',
    competitors: '',
    geography: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze('market', formData);
  };

  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Market Intelligence AI</h3>
      <p className="text-sm sm:text-base text-black mb-4 sm:mb-6">
        Real-time competitive analysis and market sizing using live data from 1000+ sources.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black mb-2">Company Name</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
            placeholder="Enter your company name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-2">Target Market</label>
          <input
            type="text"
            value={formData.targetMarket}
            onChange={(e) => setFormData({...formData, targetMarket: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
            placeholder="e.g., B2B SaaS, Consumer Electronics"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-2">Key Competitors</label>
          <textarea
            value={formData.competitors}
            onChange={(e) => setFormData({...formData, competitors: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
            rows={3}
            placeholder="List your main competitors (optional)"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-2">Geographic Focus</label>
          <select
            value={formData.geography}
            onChange={(e) => setFormData({...formData, geography: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
            required
          >
            <option value="">Select geography</option>
            <option value="north-america">North America</option>
            <option value="europe">Europe</option>
            <option value="asia-pacific">Asia Pacific</option>
            <option value="global">Global</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full bg-green-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? 'Analyzing...' : 'Start Market Analysis ($149)'}
        </button>
      </form>
    </div>
  );
}

// Operations Analysis Form Component
function OperationsAnalysisForm({ onAnalyze, isAnalyzing }: { onAnalyze: (type: string, data: FormData) => Promise<void>, isAnalyzing: boolean }) {
  const [formData, setFormData] = useState({
    company: '',
    department: '',
    processes: '',
    metrics: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze('operations', formData);
  };

  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Operations Optimizer AI</h3>
      <p className="text-sm sm:text-base text-black mb-4 sm:mb-6">
        AI-driven process optimization and cost reduction recommendations with ROI projections.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black mb-2">Company Name</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="Enter your company name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-2">Department/Area</label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            required
          >
            <option value="">Select department</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="supply-chain">Supply Chain</option>
            <option value="customer-service">Customer Service</option>
            <option value="sales">Sales</option>
            <option value="hr">Human Resources</option>
            <option value="it">IT Operations</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-2">Current Processes</label>
          <textarea
            value={formData.processes}
            onChange={(e) => setFormData({...formData, processes: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            rows={3}
            placeholder="Describe your current processes and pain points"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-2">Key Metrics</label>
          <textarea
            value={formData.metrics}
            onChange={(e) => setFormData({...formData, metrics: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            rows={2}
            placeholder="Current performance metrics (optional)"
          />
        </div>
        
        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full bg-blue-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? 'Analyzing...' : 'Start Operations Analysis ($199)'}
        </button>
      </form>
    </div>
  );
}

// Financial Analysis Form Component
function FinancialAnalysisForm({ onAnalyze, isAnalyzing }: { onAnalyze: (type: string, data: FormData) => Promise<void>, isAnalyzing: boolean }) {
  const [formData, setFormData] = useState({
    company: '',
    analysisType: '',
    revenue: '',
    timeframe: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze('financial', formData);
  };

  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Financial Modeling AI</h3>
      <p className="text-sm sm:text-base text-black mb-4 sm:mb-6">
        Automated financial projections, valuation models, and investment analysis.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black mb-2">Company Name</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
            placeholder="Enter your company name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-2">Analysis Type</label>
          <select
            value={formData.analysisType}
            onChange={(e) => setFormData({...formData, analysisType: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
            required
          >
            <option value="">Select analysis type</option>
            <option value="valuation">Company Valuation</option>
            <option value="forecasting">Revenue Forecasting</option>
            <option value="investment">Investment Analysis</option>
            <option value="scenario">Scenario Planning</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-2">Annual Revenue</label>
          <select
            value={formData.revenue}
            onChange={(e) => setFormData({...formData, revenue: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
            required
          >
            <option value="">Select revenue range</option>
            <option value="under-1m">Under $1M</option>
            <option value="1m-10m">$1M - $10M</option>
            <option value="10m-100m">$10M - $100M</option>
            <option value="over-100m">Over $100M</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black mb-2">Projection Timeframe</label>
          <select
            value={formData.timeframe}
            onChange={(e) => setFormData({...formData, timeframe: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
            required
          >
            <option value="">Select timeframe</option>
            <option value="1-year">1 year</option>
            <option value="3-years">3 years</option>
            <option value="5-years">5 years</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full bg-orange-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? 'Analyzing...' : 'Start Financial Analysis ($249)'}
        </button>
      </form>
    </div>
  );
}