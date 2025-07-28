import React from 'react';
import { useAuth } from '../hooks/useAuth';
import SyncStatusDashboard from '../components/SyncStatusDashboard';
import { Database, RefreshCw, Settings, AlertTriangle } from 'lucide-react';

const DataSyncManagement: React.FC = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-2xl mx-auto text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
          <p className="text-gray-400">Only administrators can access data sync management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Data Sync Management</h1>
          </div>
          <p className="text-gray-400">
            Monitor and manage data synchronization from external platforms like Shopify and Google.
          </p>
        </div>

        {/* Sync Status Dashboard */}
        <SyncStatusDashboard className="mb-8" />

        {/* Data Freshness Guidelines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <RefreshCw className="w-5 h-5 mr-2 text-green-400" />
              Automated Sync Schedule
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-300">Shopify</span>
                <span className="text-blue-400 font-medium">Every 4 hours</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-300">Google Contacts</span>
                <span className="text-green-400 font-medium">Every 6 hours</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-300">Log Cleanup</span>
                <span className="text-purple-400 font-medium">Daily at 2 AM</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-orange-400" />
              Data Freshness Guidelines
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-green-900/20 border border-green-500/30 rounded p-3">
                <div className="font-medium text-green-400 mb-1">✅ Current (0-4 hours)</div>
                <div className="text-gray-300">Data is fresh and up-to-date</div>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-3">
                <div className="font-medium text-yellow-400 mb-1">⚠️ Stale (4-12 hours)</div>
                <div className="text-gray-300">Consider manual refresh</div>
              </div>
              <div className="bg-red-900/20 border border-red-500/30 rounded p-3">
                <div className="font-medium text-red-400 mb-1">❌ Outdated (12+ hours)</div>
                <div className="text-gray-300">Manual sync recommended</div>
              </div>
            </div>
          </div>
        </div>

        {/* API Configuration Status */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">API Configuration Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center">
                Shopify API
                {import.meta.env.VITE_GOAFFPRO_ACCESS_TOKEN && import.meta.env.VITE_GOAFFPRO_PUBLIC_TOKEN ? (
                  <span className="ml-2 w-2 h-2 bg-green-400 rounded-full"></span>
                ) : (
                  <span className="ml-2 w-2 h-2 bg-red-400 rounded-full"></span>
                )}
              </h4>
              <div className="text-sm text-gray-400">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Access Token:</span>
                    {import.meta.env.VITE_GOAFFPRO_ACCESS_TOKEN ? (
                      <span className="text-green-400 flex items-center">
                        ✅ Configured
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center">
                        ❌ Missing
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Public Token:</span>
                    {import.meta.env.VITE_GOAFFPRO_PUBLIC_TOKEN ? (
                      <span className="text-green-400 flex items-center">
                        ✅ Configured
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center">
                        ❌ Missing
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  <p>Environment variables:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li><code>VITE_GOAFFPRO_ACCESS_TOKEN</code></li>
                    <li><code>VITE_GOAFFPRO_PUBLIC_TOKEN</code></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center">
                Google API
                {import.meta.env.VITE_GHL_API_KEY && import.meta.env.VITE_GHL_LOCATION_ID ? (
                  <span className="ml-2 w-2 h-2 bg-green-400 rounded-full"></span>
                ) : (
                  <span className="ml-2 w-2 h-2 bg-red-400 rounded-full"></span>
                )}
              </h4>
              <div className="text-sm text-gray-400">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>API Key:</span>
                    {import.meta.env.VITE_GHL_API_KEY ? (
                      <span className="text-green-400 flex items-center">
                        ✅ Configured
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center">
                        ❌ Missing
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Location ID:</span>
                    {import.meta.env.VITE_GHL_LOCATION_ID ? (
                      <span className="text-green-400 flex items-center">
                        ✅ Configured
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center">
                        ❌ Missing
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  <p>Environment variables:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li><code>VITE_GHL_API_KEY</code></li>
                    <li><code>VITE_GHL_LOCATION_ID</code></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSyncManagement; 