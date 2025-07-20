'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

interface AnalysisResult {
  executiveSummary: {
    keyFindings: string[];
    criticalDynamics: string[];
    strategicImplications: string[];
  };
  marketOverview: {
    marketSize: {
      current: string;
      projected: string;
      growthRate: string;
      timeframe: string;
    };
    keySegments: Array<{
      name: string;
      size: string;
      growth: string;
    }>;
    geographicDistribution: Array<{
      region: string;
      marketShare: string;
      growth: string;
    }>;
    maturityLevel: string;
  };
  competitiveLandscape: {
    majorPlayers: Array<{
      company: string;
      marketShare: string;
      strengths: string[];
      weaknesses: string[];
      recentMoves: string[];
    }>;
    competitiveIntensity: string;
    barrierToEntry: string;
  };
  industryTrends: {
    emergingTrends: Array<{
      trend: string;
      impact: string;
      timeframe: string;
      description: string;
    }>;
    technologyDisruptions: Array<{
      technology: string;
      disruptionLevel: string;
      adoptionTimeline: string;
      impact: string;
    }>;
    regulatoryChanges: Array<{
      regulation: string;
      impact: string;
      timeline: string;
      description: string;
    }>;
  };
  opportunitiesThreats: {
    opportunities: Array<{
      opportunity: string;
      potential: string;
      timeframe: string;
      requirements: string[];
    }>;
    threats: Array<{
      threat: string;
      severity: string;
      probability: string;
      mitigationStrategies: string[];
    }>;
  };
  customerInsights: {
    targetSegments: Array<{
      segment: string;
      size: string;
      characteristics: string[];
      needs: string[];
      priceSensitivity: string;
    }>;
    buyingBehavior: {
      decisionFactors: string[];
      purchaseProcess: string;
      seasonality: string;
    };
  };
  strategicRecommendations: {
    immediate: Array<{
      action: string;
      priority: string;
      timeline: string;
      resources: string;
      expectedOutcome: string;
    }>;
    shortTerm: Array<{
      action: string;
      priority: string;
      timeline: string;
      resources: string;
      expectedOutcome: string;
    }>;
    longTerm: Array<{
      action: string;
      priority: string;
      timeline: string;
      resources: string;
      expectedOutcome: string;
    }>;
  };
  methodology: {
    dataSources: string[];
    researchMethods: string[];
    limitations: string[];
    confidenceLevel: string;
  };
  metadata: {
    analysisDate: string;
    analyst: string;
    reportType: string;
    version: string;
  };
}

export default function MarketIntelligenceAI() {
  const { isSignedIn } = useAuth();
  const [formData, setFormData] = useState({
    company: '',
    industry: '',
    analysisType: '',
    geographicScope: 'Global',
    timeframe: '12 months',
    specificQuestions: '',
    competitorList: '',
    dataPoints: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const analysisTypes = [
    { id: 'market-size-growth', name: 'Market Size & Growth Analysis' },
    { id: 'competitive-landscape', name: 'Competitive Landscape Assessment' },
    { id: 'industry-trends', name: 'Industry Trend Analysis' },
    { id: 'customer-insights', name: 'Customer Behavior Insights' },
    { id: 'market-entry', name: 'Market Entry Strategy' },
    { id: 'threat-opportunity', name: 'Threat & Opportunity Assessment' },
    { id: 'pricing-analysis', name: 'Pricing Analysis' },
    { id: 'technology-disruption', name: 'Technology Disruption Impact' },
    { id: 'regulatory-environment', name: 'Regulatory Environment Analysis' },
    { id: 'supply-chain', name: 'Supply Chain Intelligence' }
  ];

  const industries = [
    'Technology', 'Healthcare', 'Financial Services', 'Retail & E-commerce',
    'Manufacturing', 'Energy & Utilities', 'Telecommunications', 'Automotive',
    'Real Estate', 'Media & Entertainment', 'Food & Beverage',
    'Transportation & Logistics', 'Education', 'Government', 'Non-profit', 'Other'
  ];

  const geographicScopes = [
    'Global', 'North America', 'Europe', 'Asia-Pacific', 'Latin America',
    'Middle East & Africa', 'United States', 'European Union', 'China', 'India'
  ];

  const timeframes = ['6 months', '12 months', '18 months', '2 years', '3 years', '5 years'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      setError('Please sign in to use Market Intelligence AI');
      return;
    }

    if (!formData.company || !formData.industry || !formData.analysisType) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/market-intelligence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to generate analysis');
      }

      setAnalysisResult(result.data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Market Intelligence AI</h1>
              <p className="mt-2 text-gray-600">
                Generate comprehensive market intelligence reports with real-time data and AI-powered insights
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                🔍 Real-Time Data
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                🤖 AI-Powered
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Analysis Parameters</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter company name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry *
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Analysis Type *
                  </label>
                  <select
                    name="analysisType"
                    value={formData.analysisType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select analysis type</option>
                    {analysisTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Geographic Scope
                  </label>
                  <select
                    name="geographicScope"
                    value={formData.geographicScope}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {geographicScopes.map(scope => (
                      <option key={scope} value={scope}>{scope}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeframe
                  </label>
                  <select
                    name="timeframe"
                    value={formData.timeframe}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {timeframes.map(timeframe => (
                      <option key={timeframe} value={timeframe}>{timeframe}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Questions
                  </label>
                  <textarea
                    name="specificQuestions"
                    value={formData.specificQuestions}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="What specific questions do you want answered?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Competitors
                  </label>
                  <input
                    type="text"
                    name="competitorList"
                    value={formData.competitorList}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Competitor 1, Competitor 2, ..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Data Points
                  </label>
                  <input
                    type="text"
                    name="dataPoints"
                    value={formData.dataPoints}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Market size, growth rate, trends..."
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating Analysis...
                    </div>
                  ) : (
                    'Generate Market Intelligence'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {analysisResult ? (
              <div className="space-y-6">
                {/* Executive Summary */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Executive Summary</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Findings</h3>
                      <ul className="space-y-2">
                        {analysisResult.executiveSummary.keyFindings.map((finding, index) => (
                          <li key={index} className="text-gray-700 text-sm flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Critical Dynamics</h3>
                      <ul className="space-y-2">
                        {analysisResult.executiveSummary.criticalDynamics.map((dynamic, index) => (
                          <li key={index} className="text-gray-700 text-sm flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {dynamic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Strategic Implications</h3>
                      <ul className="space-y-2">
                        {analysisResult.executiveSummary.strategicImplications.map((implication, index) => (
                          <li key={index} className="text-gray-700 text-sm flex items-start">
                            <span className="text-purple-500 mr-2">•</span>
                            {implication}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Market Overview */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Market Overview</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">{analysisResult.marketOverview.marketSize.current}</div>
                      <div className="text-sm text-gray-600">Current Market Size</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">{analysisResult.marketOverview.marketSize.projected}</div>
                      <div className="text-sm text-gray-600">Projected Size</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-600">{analysisResult.marketOverview.marketSize.growthRate}</div>
                      <div className="text-sm text-gray-600">Growth Rate</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-orange-600">{analysisResult.marketOverview.maturityLevel}</div>
                      <div className="text-sm text-gray-600">Market Maturity</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Market Segments</h3>
                      <div className="space-y-3">
                        {analysisResult.marketOverview.keySegments.map((segment, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-900">{segment.name}</span>
                              <span className="text-sm text-green-600 font-semibold">{segment.growth}</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{segment.size}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Geographic Distribution</h3>
                      <div className="space-y-3">
                        {analysisResult.marketOverview.geographicDistribution.map((region, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-900">{region.region}</span>
                              <span className="text-sm text-blue-600 font-semibold">{region.marketShare}</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Growth: {region.growth}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Competitive Landscape */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Competitive Landscape</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="text-lg font-bold text-red-600 capitalize">{analysisResult.competitiveLandscape.competitiveIntensity}</div>
                      <div className="text-sm text-gray-600">Competitive Intensity</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="text-lg font-bold text-yellow-600 capitalize">{analysisResult.competitiveLandscape.barrierToEntry}</div>
                      <div className="text-sm text-gray-600">Barrier to Entry</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {analysisResult.competitiveLandscape.majorPlayers.map((player, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{player.company}</h3>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
                            {player.marketShare}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {player.strengths.map((strength, idx) => (
                                <li key={idx}>• {strength}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-red-700 mb-2">Weaknesses</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {player.weaknesses.map((weakness, idx) => (
                                <li key={idx}>• {weakness}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-blue-700 mb-2">Recent Moves</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {player.recentMoves.map((move, idx) => (
                                <li key={idx}>• {move}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Industry Trends */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Industry Trends</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Emerging Trends</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisResult.industryTrends.emergingTrends.map((trend, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{trend.trend}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${getImpactColor(trend.impact)}`}>
                                {trend.impact} Impact
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{trend.description}</p>
                            <div className="text-xs text-gray-500">Timeline: {trend.timeframe}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Technology Disruptions</h3>
                      <div className="space-y-3">
                        {analysisResult.industryTrends.technologyDisruptions.map((tech, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{tech.technology}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${getImpactColor(tech.disruptionLevel)}`}>
                                {tech.disruptionLevel} Disruption
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{tech.impact}</p>
                            <div className="text-xs text-gray-500">Adoption Timeline: {tech.adoptionTimeline}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Opportunities & Threats */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Opportunities & Threats</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-green-700 mb-3">Opportunities</h3>
                      <div className="space-y-3">
                        {analysisResult.opportunitiesThreats.opportunities.map((opportunity, index) => (
                          <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{opportunity.opportunity}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(opportunity.potential)}`}>
                                {opportunity.potential} Potential
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">Timeline: {opportunity.timeframe}</div>
                            <div className="text-sm text-gray-700">
                              <strong>Requirements:</strong>
                              <ul className="mt-1 ml-4">
                                {opportunity.requirements.map((req, idx) => (
                                  <li key={idx} className="list-disc">{req}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-red-700 mb-3">Threats</h3>
                      <div className="space-y-3">
                        {analysisResult.opportunitiesThreats.threats.map((threat, index) => (
                          <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{threat.threat}</h4>
                              <div className="flex space-x-1">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(threat.severity)}`}>
                                  {threat.severity} Severity
                                </span>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(threat.probability)}`}>
                                  {threat.probability} Probability
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-700">
                              <strong>Mitigation Strategies:</strong>
                              <ul className="mt-1 ml-4">
                                {threat.mitigationStrategies.map((strategy, idx) => (
                                  <li key={idx} className="list-disc">{strategy}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strategic Recommendations */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Strategic Recommendations</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-red-700 mb-3">Immediate Actions</h3>
                      <div className="space-y-3">
                        {analysisResult.strategicRecommendations.immediate.map((action, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{action.action}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(action.priority)}`}>
                                {action.priority} Priority
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div><strong>Timeline:</strong> {action.timeline}</div>
                              <div><strong>Resources:</strong> {action.resources}</div>
                              <div><strong>Expected Outcome:</strong> {action.expectedOutcome}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-yellow-700 mb-3">Short-Term Actions</h3>
                      <div className="space-y-3">
                        {analysisResult.strategicRecommendations.shortTerm.map((action, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{action.action}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(action.priority)}`}>
                                {action.priority} Priority
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div><strong>Timeline:</strong> {action.timeline}</div>
                              <div><strong>Resources:</strong> {action.resources}</div>
                              <div><strong>Expected Outcome:</strong> {action.expectedOutcome}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-blue-700 mb-3">Long-Term Actions</h3>
                      <div className="space-y-3">
                        {analysisResult.strategicRecommendations.longTerm.map((action, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{action.action}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(action.priority)}`}>
                                {action.priority} Priority
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div><strong>Timeline:</strong> {action.timeline}</div>
                              <div><strong>Resources:</strong> {action.resources}</div>
                              <div><strong>Expected Outcome:</strong> {action.expectedOutcome}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Methodology */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Methodology & Sources</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Sources</h3>
                      <ul className="space-y-1">
                        {analysisResult.methodology.dataSources.map((source, index) => (
                          <li key={index} className="text-gray-700 text-sm flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {source}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Research Methods</h3>
                      <ul className="space-y-1">
                        {analysisResult.methodology.researchMethods.map((method, index) => (
                          <li key={index} className="text-gray-700 text-sm flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {method}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">
                          <strong>Confidence Level:</strong> {analysisResult.methodology.confidenceLevel}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Analysis Date:</strong> {new Date(analysisResult.metadata.analysisDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          <strong>Report Type:</strong> {analysisResult.metadata.reportType}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Version:</strong> {analysisResult.metadata.version}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Generate Market Intelligence</h3>
                <p className="text-gray-600 mb-6">
                  Fill out the form on the left to generate a comprehensive market intelligence report with AI-powered insights.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Real-time market data
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Competitive analysis
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Strategic recommendations
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}