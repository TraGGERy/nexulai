'use client';

import { useState, useEffect } from 'react';

export default function DbTest() {
  const [status, setStatus] = useState<{
    loading: boolean;
    success?: boolean;
    message?: string;
    error?: string;
    data?: any;
  }>({ loading: true });

  useEffect(() => {
    const testDbConnection = async () => {
      try {
        const response = await fetch('/api/db-test');
        const result = await response.json();
        
        setStatus({
          loading: false,
          success: result.success,
          message: result.message,
          error: result.error,
          data: result.data
        });
      } catch (error) {
        setStatus({
          loading: false,
          success: false,
          message: 'Failed to test database connection',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    };

    testDbConnection();
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Connection Test</h1>
        
        {status.loading ? (
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-blue-700">Testing database connection...</p>
          </div>
        ) : status.success ? (
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-green-700 mb-2">Connection Successful</h2>
            <p className="text-green-600 mb-4">{status.message}</p>
            
            {status.data && status.data.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Data Preview:</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
                  {JSON.stringify(status.data, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-gray-600">No data found in the reports table.</p>
            )}
            
            <div className="mt-6">
              <p className="text-gray-700">
                Your database is properly configured and connected to the application.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Connection Failed</h2>
            <p className="text-red-600 mb-4">{status.message}</p>
            
            {status.error && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Details:</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60 text-red-500">
                  {status.error}
                </pre>
              </div>
            )}
            
            <div className="mt-6">
              <p className="text-gray-700">
                Please check your database configuration in the .env.local file and ensure your Neon database is properly set up.
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                <li>Verify that the DB environment variable is correctly set</li>
                <li>Ensure your Neon database is running and accessible</li>
                <li>Check that the database credentials are correct</li>
                <li>Verify that the database schema has been properly migrated</li>
              </ul>
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Run database migrations: <code className="bg-gray-100 px-2 py-1 rounded">npx tsx db/migrate.ts</code></li>
            <li>Generate new migrations: <code className="bg-gray-100 px-2 py-1 rounded">npx drizzle-kit generate:pg</code></li>
            <li>View your database schema: <code className="bg-gray-100 px-2 py-1 rounded">npx drizzle-kit studio</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}