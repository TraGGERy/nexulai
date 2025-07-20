'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Report {
  id: number;
  title: string;
  type: string;
  content: any;
  createdAt: string;
  updatedAt: string;
}

export default function ReportDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${resolvedParams.id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch report: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setReport(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch report');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [resolvedParams.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReportTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'strategy':
        return 'bg-purple-100 text-purple-800';
      case 'market':
        return 'bg-blue-100 text-blue-800';
      case 'financial':
        return 'bg-green-100 text-green-800';
      case 'operations':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/reports/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete report: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        router.push('/reports');
      } else {
        throw new Error(data.message || 'Failed to delete report');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error deleting report:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-purple-600">Nexus AI Consulting</Link>
              <div className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                AI-Powered
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="/solutions" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">Solutions</Link>
                <Link href="/ai-tools" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">AI Tools</Link>
                <Link href="/pricing" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">Pricing</Link>
                <Link href="/dashboard" className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">Dashboard</Link>
                <Link href="/reports" className="text-purple-600 px-3 py-2 text-sm font-medium border-b-2 border-purple-600">Reports</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/reports" className="text-purple-600 hover:text-purple-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Reports
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Report</h2>
            <p className="text-red-600">{error}</p>
            <div className="mt-4">
              <Link href="/reports" className="text-purple-600 hover:text-purple-800 underline">
                Return to Reports List
              </Link>
            </div>
          </div>
        ) : report ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getReportTypeColor(report.type)} mb-2`}>
                    {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Created: {formatDate(report.createdAt)}
                  </p>
                </div>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                >
                  {isDeleting ? (
                    <span>Deleting...</span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete Report
                    </>
                  )}
                </button>
              </div>

              {/* Report Content */}
              <div className="mt-6">
                {report.content.summary && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Executive Summary</h2>
                    <p className="text-gray-700">{report.content.summary}</p>
                  </div>
                )}

                {report.content.insights && report.content.insights.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Key Insights</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {report.content.insights.map((insight: string, index: number) => (
                        <li key={index}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {report.content.recommendations && report.content.recommendations.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Recommendations</h2>
                    <div className="space-y-4">
                      {report.content.recommendations.map((rec: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900">{rec.title}</h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">Priority: {rec.priority}</span>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${rec.impact === 'High' ? 'bg-red-100 text-red-800' : rec.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                {rec.impact} Impact
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-700 mt-2">{rec.description}</p>
                          <p className="text-sm text-gray-600 mt-2">Timeline: {rec.timeline}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {report.content.metrics && Object.keys(report.content.metrics).length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Key Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(report.content.metrics).map(([key, value]: [string, any]) => (
                        <div key={key} className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500">{key}</h3>
                          <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {report.content.implementationRoadmap && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Implementation Roadmap</h2>
                    
                    {report.content.implementationRoadmap.quickWins && report.content.implementationRoadmap.quickWins.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Quick Wins (90 Days)</h3>
                        <div className="space-y-3">
                          {report.content.implementationRoadmap.quickWins.map((item: any, index: number) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium text-gray-900">{item.title}</h4>
                              <p className="text-gray-700 mt-1">{item.description}</p>
                              <p className="text-sm text-gray-600 mt-2">Timeline: {item.timeline}</p>
                              {item.kpis && item.kpis.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-gray-700">KPIs:</p>
                                  <ul className="list-disc list-inside text-sm text-gray-600">
                                    {item.kpis.map((kpi: string, kpiIndex: number) => (
                                      <li key={kpiIndex}>{kpi}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {report.content.implementationRoadmap.strategicInitiatives && report.content.implementationRoadmap.strategicInitiatives.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Strategic Initiatives (6 Months)</h3>
                        <div className="space-y-3">
                          {report.content.implementationRoadmap.strategicInitiatives.map((item: any, index: number) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium text-gray-900">{item.title}</h4>
                              <p className="text-gray-700 mt-1">{item.description}</p>
                              <p className="text-sm text-gray-600 mt-2">Timeline: {item.timeline}</p>
                              {item.kpis && item.kpis.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-gray-700">KPIs:</p>
                                  <ul className="list-disc list-inside text-sm text-gray-600">
                                    {item.kpis.map((kpi: string, kpiIndex: number) => (
                                      <li key={kpiIndex}>{kpi}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {report.content.implementationRoadmap.transformationMilestones && report.content.implementationRoadmap.transformationMilestones.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Transformation Milestones (12 Months)</h3>
                        <div className="space-y-3">
                          {report.content.implementationRoadmap.transformationMilestones.map((item: any, index: number) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium text-gray-900">{item.title}</h4>
                              <p className="text-gray-700 mt-1">{item.description}</p>
                              <p className="text-sm text-gray-600 mt-2">Timeline: {item.timeline}</p>
                              {item.kpis && item.kpis.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-gray-700">KPIs:</p>
                                  <ul className="list-disc list-inside text-sm text-gray-600">
                                    {item.kpis.map((kpi: string, kpiIndex: number) => (
                                      <li key={kpiIndex}>{kpi}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {report.content.implementationRoadmap.riskMonitoring && report.content.implementationRoadmap.riskMonitoring.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Risk Monitoring</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mitigation Strategy</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Early Warning Indicator</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {report.content.implementationRoadmap.riskMonitoring.map((item: any, index: number) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.risk}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.mitigation}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.indicator}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {report.content.implementationRoadmap.governanceStructure && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Governance Structure</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">{report.content.implementationRoadmap.governanceStructure}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-yellow-700 mb-2">Report Not Found</h2>
            <p className="text-yellow-600">The requested report could not be found.</p>
            <div className="mt-4">
              <Link href="/reports" className="text-purple-600 hover:text-purple-800 underline">
                Return to Reports List
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}