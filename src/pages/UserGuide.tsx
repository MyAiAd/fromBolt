import React from 'react';
import { BookOpen, HelpCircle, Trophy, Star, Crown, Zap } from 'lucide-react';

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

          {/* New Referral Program Section */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <div className="flex items-center space-x-3 mb-6">
              <Trophy className="h-8 w-8 text-rise-gold" />
              <h2 className="text-2xl font-bold text-gray-900">Referral Program Structure and Commission Details</h2>
            </div>

            <div className="bg-gradient-to-r from-rise-gold/10 to-rise-purple/10 border border-rise-gold/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Star className="h-6 w-6 text-rise-gold mr-2" />
                Rank System Based on Total Referral Volume
              </h3>
              <p className="text-gray-700 mb-6">
                This program uses a tiered ranking system where participants advance through levels based on their total referral volume (cumulative earnings generated through referrals). Each rank comes with its own identity and represents different levels of achievement and influence within the community.
              </p>

              <h4 className="text-lg font-semibold text-gray-800 mb-4">Rank Progression Structure</h4>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                      <h5 className="font-semibold text-gray-800">Aligned - Entry Level</h5>
                    </div>
                    <p className="text-sm text-gray-600 mb-1"><strong>$0 - $1,000 monthly</strong></p>
                    <p className="text-xs text-gray-500">You've tuned in and taken aligned action</p>
                  </div>

                  <div className="bg-white border border-green-200 rounded-lg p-4 border-l-4 border-l-green-400">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                      <h5 className="font-semibold text-green-800">Activated - Building Momentum</h5>
                    </div>
                    <p className="text-sm text-green-600 mb-1"><strong>$1,000 - $5,000 monthly</strong></p>
                    <p className="text-xs text-green-500">Your energy is moving — you're becoming magnetic</p>
                  </div>

                  <div className="bg-white border border-blue-200 rounded-lg p-4 border-l-4 border-l-blue-400">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                      <h5 className="font-semibold text-blue-800">Ascended - Growing Impact</h5>
                    </div>
                    <p className="text-sm text-blue-600 mb-1"><strong>$5,000 - $10,000 monthly</strong></p>
                    <p className="text-xs text-blue-500">Your impact is rising and your influence expanding</p>
                  </div>

                  <div className="bg-white border border-purple-200 rounded-lg p-4 border-l-4 border-l-purple-400">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
                      <h5 className="font-semibold text-purple-800">Magnetic - Strong Performance</h5>
                    </div>
                    <p className="text-sm text-purple-600 mb-1"><strong>$25,000 - $50,000 monthly</strong></p>
                    <p className="text-xs text-purple-500">You're pulling in abundance through pure alignment</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white border border-yellow-200 rounded-lg p-4 border-l-4 border-l-yellow-400">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                      <h5 className="font-semibold text-yellow-800">Luminary - Community Leader</h5>
                    </div>
                    <p className="text-sm text-yellow-600 mb-1"><strong>$50,000 - $100,000 monthly</strong></p>
                    <p className="text-xs text-yellow-600">You're a beacon of light in the community</p>
                  </div>

                  <div className="bg-white border border-orange-200 rounded-lg p-4 border-l-4 border-l-orange-400">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-orange-400 rounded-full mr-2"></div>
                      <h5 className="font-semibold text-orange-800">Visionary - Leader of Leaders</h5>
                    </div>
                    <p className="text-sm text-orange-600 mb-1"><strong>$100,000+ monthly</strong></p>
                    <p className="text-xs text-orange-600">You've become a leader of leaders with a big vision</p>
                  </div>

                  <div className="bg-white border border-red-200 rounded-lg p-4 border-l-4 border-l-red-400">
                    <div className="flex items-center mb-2">
                      <Zap className="w-4 h-4 text-red-400 mr-1" />
                      <h5 className="font-semibold text-red-800">Oracle - Wisdom and Results</h5>
                    </div>
                    <p className="text-sm text-red-600 mb-1"><strong>$500,000+ monthly</strong></p>
                    <p className="text-xs text-red-600">Wisdom radiates from your results</p>
                  </div>

                  <div className="bg-white border border-rise-gold rounded-lg p-4 border-l-4 border-l-rise-gold">
                    <div className="flex items-center mb-2">
                      <Crown className="w-4 h-4 text-rise-gold mr-1" />
                      <h5 className="font-semibold text-gray-800">Sovereign - Ultimate Mastery</h5>
                    </div>
                    <p className="text-sm text-rise-gold mb-1"><strong>$1,000,000+ monthly</strong></p>
                    <p className="text-xs text-gray-600">You embody mastery, legacy, and divine authority</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Digital Products Commission Structure</h3>
              <p className="text-green-700 mb-6">
                The program offers commissions on various digital products with a three-tier structure (L1, L2, L3). These represent different levels of the referral network, where L1 is direct referrals, L2 is second-level referrals, and L3 is third-level referrals.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-green-300 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3">High-Commission Products</h4>
                  <p className="text-sm text-green-600 mb-3 font-medium">20% / 10% / 5% (L1/L2/L3)</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• <strong>Bae</strong></li>
                    <li>• <strong>Coaching Packs</strong></li>
                    <li>• <strong>Online Mastery</strong></li>
                    <li>• <strong>BRAVO Fitness</strong></li>
                    <li>• <strong>AI System</strong></li>
                  </ul>
                </div>

                <div className="bg-white border border-blue-300 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">Modified Commission</h4>
                  <p className="text-sm text-blue-600 mb-3 font-medium">15% / 5% / 5% (L1/L2/L3)</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>REACTION CBD</strong></li>
                  </ul>
                  <p className="text-xs text-blue-500 mt-2">Slightly lower L1 commission but maintains same L2/L3 rates</p>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Lower Commission</h4>
                  <p className="text-sm text-gray-600 mb-3 font-medium">5% / 2.5% / 2.5% (L1/L2/L3)</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>EVENTS</strong></li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">Significantly lower commission rates across all levels</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Key Program Features</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-purple-700 mb-2">Multi-Level Structure</h4>
                  <p className="text-sm text-purple-600 mb-4">The commission system extends to three levels deep, allowing participants to earn from their direct referrals as well as referrals made by their referrals.</p>
                  
                  <h4 className="font-semibold text-purple-700 mb-2">Rank-Based Identity</h4>
                  <p className="text-sm text-purple-600">Each level has a unique name and philosophical description that creates a sense of progression and achievement beyond just monetary milestones.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-700 mb-2">Product Diversity</h4>
                  <p className="text-sm text-purple-600 mb-4">The program covers various digital products including coaching, fitness, AI systems, CBD products, and events, providing multiple revenue streams.</p>
                  
                  <h4 className="font-semibold text-purple-700 mb-2">Scalable Growth</h4>
                  <p className="text-sm text-purple-600">The structure encourages building a network rather than just individual sales, with the potential for passive income through multi-level commissions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide; 