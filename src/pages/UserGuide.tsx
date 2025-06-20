import React from 'react';
import { BookOpen, HelpCircle } from 'lucide-react';

const UserGuide = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <HelpCircle className="h-8 w-8 text-rise-gold" />
          <h1 className="text-2xl font-bold text-gray-900">User Guide</h1>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <BookOpen className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Quick Start:</strong> Not sure which page to use? This guide explains when and how to use each section of the affiliate platform.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">When To Use Which Page</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">📊 Data Import Pages</h3>
              <p className="text-green-700 mb-3 font-medium">JennaZ Data, ReAction Data, MightyNetworks Data</p>
              <p className="text-green-600 mb-4"><strong>Click these when you want to analyze your business performance</strong></p>
              
              <h4 className="font-semibold text-green-700 mb-2">Use these pages when you need to:</h4>
              <ul className="text-sm text-green-600 space-y-1 mb-4">
                <li>• <strong>Daily/Weekly Business Reviews</strong>: Check how your affiliates are performing</li>
                <li>• <strong>Prepare Reports</strong>: Export data for presentations or stakeholder meetings</li>
                <li>• <strong>Analyze Trends</strong>: Look at conversion rates, earnings over time, top performers</li>
                <li>• <strong>Monitor Individual Affiliates</strong>: See specific affiliate metrics and payouts</li>
              </ul>
              
              <h4 className="font-semibold text-green-700 mb-2">Answer Questions Like:</h4>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• "How much did we earn this month?"</li>
                <li>• "Which affiliates are converting best?"</li>
                <li>• "What's our overall conversion rate?"</li>
                <li>• "Who needs to be paid?"</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">⚙️ Data Sync Management Page</h3>
              <p className="text-blue-600 mb-4"><strong>Click this when you need to manage your data infrastructure</strong></p>
              
              <h4 className="font-semibold text-blue-700 mb-2">Use this page when you need to:</h4>
              <ul className="text-sm text-blue-600 space-y-1 mb-4">
                <li>• <strong>Setup Initial Syncing</strong>: Configure automated data imports from GoAffPro/GHL</li>
                <li>• <strong>Troubleshoot Missing Data</strong>: When numbers seem off or data appears stale</li>
                <li>• <strong>Force Immediate Updates</strong>: Manually trigger syncs before important meetings</li>
                <li>• <strong>Monitor System Health</strong>: Check if automated syncs are running properly</li>
              </ul>
              
              <h4 className="font-semibold text-blue-700 mb-2">Answer Questions Like:</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• "Why is my data from yesterday missing?"</li>
                <li>• "When was the last time we synced with GoAffPro?"</li>
                <li>• "Are our automated imports working?"</li>
                <li>• "Can I get fresh data right now?"</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">🎯 Quick Decision Guide</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-900">
              <div className="space-y-2">
                <p><strong>"I want to see how my business is doing"</strong><br/>
                → Go to <span className="text-green-600 font-medium">Data Import Pages</span></p>
                
                <p><strong>"I need to show results to my team/boss"</strong><br/>
                → Go to <span className="text-green-600 font-medium">Data Import Pages</span> (use export features)</p>
                
                <p><strong>"It's Monday morning and I want my weekly review"</strong><br/>
                → Go to <span className="text-green-600 font-medium">Data Import Pages</span></p>
              </div>
              <div className="space-y-2">
                <p><strong>"My data looks wrong or outdated"</strong><br/>
                → Go to <span className="text-blue-600 font-medium">Data Sync Management Page</span></p>
                
                <p><strong>"I'm setting up the system for the first time"</strong><br/>
                → Go to <span className="text-blue-600 font-medium">Data Sync Management Page</span></p>
                
                <p><strong>"The numbers don't match what I see in GoAffPro"</strong><br/>
                → Go to <span className="text-blue-600 font-medium">Data Sync Management Page</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🚀 Typical Workflows</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Daily Business Check (5 minutes)</h4>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Go to <strong>Affiliates Dashboard</strong> for overview</li>
                  <li>Click into <strong>specific data pages</strong> for details</li>
                  <li>Check recent conversions and earnings</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Troubleshooting Missing Data (5 minutes)</h4>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Go to <strong>Data Sync Management</strong> first</li>
                  <li>Check last sync times and error logs</li>
                  <li>Trigger manual sync if needed</li>
                  <li>Return to <strong>Data Import Pages</strong> to verify data</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">💡 Pro Tips</h3>
            <ul className="text-sm text-purple-600 space-y-2">
              <li>• <strong>Start your day with Data Import Pages</strong> - they're your business dashboard</li>
              <li>• <strong>End your week with Data Sync Management</strong> - ensure everything is running smoothly</li>
              <li>• <strong>When in doubt, sync first</strong> - if data looks off, trigger a fresh sync before analyzing</li>
              <li>• <strong>Bookmark your most-used pages</strong> - save time on daily workflows</li>
              <li>• <strong>Use exports for presentations</strong> - Data Import Pages have built-in export features</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide; 