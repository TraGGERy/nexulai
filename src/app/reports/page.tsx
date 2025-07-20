'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Report {
  id: number;
  title: string;
  type: string;
  content: any;
  createdAt: string;
  updatedAt: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Fetch only the 4 most recent reports
        const response = await fetch('/api/reports?limit=4&offset=0');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch reports: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Reports are already sorted by createdAt desc from the API
          setReports(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch reports');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recent Reports</h1>
            <p className="text-gray-600 mt-1">Your 4 most recent reports</p>
          </div>
          <div className="flex space-x-3">
            <Link 
              href="/reports/all" 
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
            >
              View All Reports
            </Link>
            <Link 
              href="/dashboard" 
              className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
            >
              Create New Report
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Reports</h2>
            <p className="text-red-600">{error}</p>
            <div className="mt-4">
              <p className="text-gray-700">
                Please check your database connection and try again. You can visit the 
                <Link href="/db-test" className="text-purple-600 hover:text-purple-800 underline">
                  database test page
                </Link> to verify your connection.
              </p>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">No Reports Found</h2>
            <p className="text-gray-600 mb-6">
              You haven't created any reports yet. Generate your first report from the dashboard.
            </p>
            <Link 
              href="/dashboard" 
              className="bg-purple-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-purple-700"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getReportTypeColor(report.type)} mb-2`}>
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </span>
                      <h2 className="text-xl font-bold text-gray-900 line-clamp-2">{report.title}</h2>
                    </div>
                  </div>
                  
                  {report.content.summary && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{report.content.summary}</p>
                  )}
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      Created: {formatDate(report.createdAt)}
                    </div>
                    <Link 
                      href={`/reports/${report.id}`} 
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}