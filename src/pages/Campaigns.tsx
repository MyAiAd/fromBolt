import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Edit2, 
  Save, 
  X, 
  Eye, 
  Users, 
  DollarSign, 
  TrendingUp,
  ExternalLink,
  Settings,
  Plus,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Campaign {
  id: string;
  name: string;
  url: string;
  status: 'Live' | 'Paused';
  clicks: number;
  leads: number;
  customers: number;
  commission: number;
  commissionRate: string;
  description: string;
  customReferralId?: string;
}

interface UserCampaignData {
  referralCode: string;
  campaigns: Campaign[];
}

interface RealCampaignMetrics {
  [campaignId: string]: {
    clicks: number;
    commissions: number;
    totalEarnings: number;
  };
}

const Campaigns = () => {
  const { user, supabase, isAdmin } = useAuth();
  const [userData, setUserData] = useState<UserCampaignData | null>(null);
  const [editingReferralCode, setEditingReferralCode] = useState(false);
  const [newReferralCode, setNewReferralCode] = useState('');
  const [editingCampaign, setEditingCampaign] = useState<string | null>(null);
  const [customReferralIds, setCustomReferralIds] = useState<{ [key: string]: string }>({});
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [realMetrics, setRealMetrics] = useState<RealCampaignMetrics>({});

  // Campaign templates - structure with real data populated
  const campaignTemplates: Omit<Campaign, 'clicks' | 'commission' | 'leads' | 'customers'>[] = [
    {
      id: 'reaction-affiliate',
      name: 'Reaction Affiliate',
      url: 'https://jennazwagil.com/reaction-production',
      status: 'Live',
      commissionRate: '15% default commission',
      description: 'Rewards plan(1) • Payout(Net-15)'
    },
    {
      id: 'jennaz-affiliate',
      name: 'JennaZ.co Affiliate',
      url: 'https://jennaz.co/rise',
      status: 'Live',
      commissionRate: '20% default commission',
      description: 'No rewards plan • Payout(Net-15)'
    },
    {
      id: 'rise-campaign',
      name: 'The RISE Campaign',
      url: 'https://jennazwagil.com/rise',
      status: 'Paused',
      commissionRate: 'No default commission setup',
      description: 'Custom campaign for The RISE community'
    }
  ];

  const loadRealCampaignData = async (userReferralCode: string, isAdminUser: boolean) => {
    if (!user?.email) return {};

    try {
      const metrics: RealCampaignMetrics = {};

      let clicksData: any[] = [];
      let commissionsData: any[] = [];

      if (isAdminUser) {
        console.log('🔍 ADMIN DEBUG: Attempting to fetch ALL clicks data...');
        
        // Admin: Get ALL clicks and commissions across all affiliates
        const { data: allClicksData, error: clicksError } = await supabase
          .from('clicks')
          .select('referral_code, conversion_status, created_at, affiliate_id');

        if (clicksError) {
          console.error('❌ CLICKS ERROR:', {
            message: clicksError.message,
            details: clicksError.details,
            hint: clicksError.hint,
            code: clicksError.code
          });
        } else {
          clicksData = allClicksData || [];
          console.log('✅ CLICKS SUCCESS: Retrieved', clicksData.length, 'click records');
        }

        // Get ALL commission data for admin view
        const { data: allCommissionsData, error: commissionsError } = await supabase
          .from('multi_level_commissions')
          .select('commission_amount, order_source, status, order_date, earning_affiliate_id');

        if (commissionsError) {
          console.error('Error fetching all commissions:', commissionsError);
        } else {
          commissionsData = allCommissionsData || [];
        }
      } else {
        // Regular user: Get only their own clicks and commissions
        const { data: userClicksData, error: clicksError } = await supabase
          .from('clicks')
          .select('referral_code, conversion_status, created_at')
          .eq('referral_code', userReferralCode);

        if (clicksError) {
          console.error('Error fetching user clicks:', clicksError);
        } else {
          clicksData = userClicksData || [];
        }

        // Get commission data for the specific user
        const { data: userCommissionsData, error: commissionsError } = await supabase
          .from('multi_level_commissions')
          .select('commission_amount, order_source, status, order_date')
          .eq('earning_affiliate_id', user.id);

        if (commissionsError) {
          console.error('Error fetching user commissions:', commissionsError);
        } else {
          commissionsData = userCommissionsData || [];
        }
      }

      // Organize data by campaign
      for (const template of campaignTemplates) {
        const campaignMetrics = {
          clicks: 0,
          commissions: 0,
          totalEarnings: 0
        };

        // Count clicks for this campaign
        if (clicksData) {
          if (isAdminUser) {
            // For admin, count all clicks
            campaignMetrics.clicks = clicksData.length;
            campaignMetrics.commissions = clicksData.filter(
              click => click.conversion_status === 'converted'
            ).length;
          } else {
            // For regular user, filter by their referral code
            const userClicks = clicksData.filter(click => click.referral_code === userReferralCode);
            campaignMetrics.clicks = userClicks.length;
            campaignMetrics.commissions = userClicks.filter(
              click => click.conversion_status === 'converted'
            ).length;
          }
        }

        // Calculate earnings from commissions
        if (commissionsData) {
          const campaignCommissions = commissionsData.filter(commission => {
            // Map order sources to campaigns
            switch (template.id) {
              case 'reaction-affiliate':
                return commission.order_source === 'goaffpro';
              case 'jennaz-affiliate':
                return commission.order_source === 'shopify' || commission.order_source === 'native';
              case 'rise-campaign':
                return commission.order_source === 'mightynetworks';
              default:
                return false;
            }
          });

          campaignMetrics.totalEarnings = campaignCommissions.reduce(
            (sum, commission) => sum + parseFloat(commission.commission_amount || '0'), 0
          );
          
          // Count approved commissions as customers
          campaignMetrics.commissions = campaignCommissions.filter(
            commission => commission.status === 'approved' || commission.status === 'paid'
          ).length;
        }

        metrics[template.id] = campaignMetrics;
      }

      return metrics;
    } catch (error) {
      console.error('Error loading campaign metrics:', error);
      return {};
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.email) return;

      try {
        // Get user's referral code from affiliate_system_users
        const { data: userData, error: userError } = await supabase
          .from('affiliate_system_users')
          .select('referral_code')
          .eq('email', user.email)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error('Error fetching user data:', userError);
        }

        const referralCode = userData?.referral_code || 'DEFAULTCODE';
        setNewReferralCode(referralCode);

                 // Load real campaign metrics
         const metrics = await loadRealCampaignData(referralCode, isAdmin);
         setRealMetrics(metrics);

        // Create campaigns with real data
        const campaignsWithData: Campaign[] = campaignTemplates.map(template => ({
          ...template,
          clicks: metrics[template.id]?.clicks || 0,
          leads: Math.floor((metrics[template.id]?.clicks || 0) * 0.3), // Estimate leads as 30% of clicks
          customers: metrics[template.id]?.commissions || 0,
          commission: Math.round(metrics[template.id]?.totalEarnings || 0)
        }));

        setUserData({
          referralCode,
          campaigns: campaignsWithData
        });

        // Initialize custom referral IDs
        const initialCustomIds: { [key: string]: string } = {};
        campaignTemplates.forEach(campaign => {
          initialCustomIds[campaign.id] = referralCode;
        });
        setCustomReferralIds(initialCustomIds);

      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, supabase]);

  const copyLink = async (campaignId: string, customId?: string) => {
    if (!userData) return;

    const campaign = userData.campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    const referralId = customId || customReferralIds[campaignId] || userData.referralCode;
    
    let link = '';
    switch (campaignId) {
      case 'reaction-affiliate':
        link = `${campaign.url}?ref=${referralId}`;
        break;
      case 'jennaz-affiliate':
        link = `${campaign.url}?ref=${referralId}`;
        break;
      case 'rise-campaign':
        link = `${campaign.url}?ref=${referralId}`;
        break;
      default:
        link = `${campaign.url}?ref=${referralId}`;
    }

    try {
      await navigator.clipboard.writeText(link);
      setCopiedStates(prev => ({ ...prev, [campaignId]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [campaignId]: false }));
      }, 2000);
      
      // Track the copy action as a potential click/engagement
      if (user?.id && userData.referralCode) {
        const { error } = await supabase
          .from('clicks')
          .insert({
            affiliate_id: user.id,
            referral_code: referralId,
            conversion_status: 'clicked',
            ip_address: 'dashboard-copy', // Special marker for dashboard copies
            user_agent: 'campaign-dashboard'
          });
        
        if (error) console.log('Could not track copy action:', error);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const saveReferralCode = async () => {
    if (!user?.email || !newReferralCode.trim()) return;

    try {
      const { error } = await supabase
        .from('affiliate_system_users')
        .update({ referral_code: newReferralCode.trim().toUpperCase() })
        .eq('email', user.email);

      if (!error && userData) {
        const updatedReferralCode = newReferralCode.trim().toUpperCase();
        setUserData({
          ...userData,
          referralCode: updatedReferralCode
        });
        
        // Update all custom referral IDs to use the new default
        const updatedCustomIds: { [key: string]: string } = {};
        Object.keys(customReferralIds).forEach(campaignId => {
          updatedCustomIds[campaignId] = updatedReferralCode;
        });
        setCustomReferralIds(updatedCustomIds);
        
        setEditingReferralCode(false);
      }
    } catch (error) {
      console.error('Error updating referral code:', error);
    }
  };

  const updateCustomReferralId = (campaignId: string, newId: string) => {
    setCustomReferralIds(prev => ({
      ...prev,
      [campaignId]: newId.trim().toUpperCase()
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 100,
        damping: 15
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rise-gold"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Campaigns Not Available</h2>
        <p className="text-gray-400 mb-4">Please ensure your affiliate profile is set up correctly.</p>
        <div className="bg-rise-dark-light p-6 rounded-lg max-w-md mx-auto">
          <p className="text-sm text-gray-300">
            If you continue to see this message, please contact support at{' '}
            <a href="mailto:support@jennaz.co" className="text-rise-gold hover:underline">
              support@jennaz.co
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pb-12"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Campaigns</h1>
          <p className="text-gray-400">
            {isAdmin 
              ? 'Monitor all affiliate campaigns and network performance'
              : 'Manage your affiliate campaigns and track performance'
            }
          </p>
        </div>
        <div className="text-right text-sm text-gray-400">
          {isAdmin ? 'Network Campaigns' : 'All Campaigns'} ({userData.campaigns.length})
        </div>
      </motion.div>

      {/* Referral Code Management */}
      <motion.div variants={itemVariants} className="card mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {isAdmin ? 'Admin Referral Code' : 'Your Referral Code'}
          </h2>
          {!editingReferralCode && (
            <button
              onClick={() => setEditingReferralCode(true)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
        </div>
        
        {editingReferralCode ? (
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={newReferralCode}
              onChange={(e) => setNewReferralCode(e.target.value)}
              className="input-field flex-1"
              placeholder="Enter your referral code"
              maxLength={20}
            />
            <button
              onClick={saveReferralCode}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={() => {
                setEditingReferralCode(false);
                setNewReferralCode(userData.referralCode);
              }}
              className="btn btn-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="bg-rise-dark-light p-4 rounded-lg">
            <code className="text-rise-gold font-mono text-xl">{userData.referralCode}</code>
            <p className="text-gray-400 text-sm mt-2">
              {isAdmin 
                ? 'This is your admin referral code. Campaign metrics above show network-wide data for all affiliates.'
                : 'This is your default referral code. You can customize it for each campaign below.'
              }
            </p>
          </div>
        )}
      </motion.div>

      {/* Campaigns Grid */}
      <div className="space-y-6">
        {userData.campaigns.map((campaign) => (
          <motion.div
            key={campaign.id}
            variants={itemVariants}
            className="card bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700"
          >
            {/* Campaign Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-semibold text-white">{campaign.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  campaign.status === 'Live' 
                    ? 'bg-green-900/20 text-green-400' 
                    : 'bg-yellow-900/20 text-yellow-400'
                }`}>
                  {campaign.status}
                </span>
              </div>
              <Link
                to="/performance"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
              </Link>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{campaign.clicks}</div>
                <div className="text-sm text-gray-400">Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{campaign.leads}</div>
                <div className="text-sm text-gray-400">Leads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{campaign.customers}</div>
                <div className="text-sm text-gray-400">Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">${campaign.commission}</div>
                <div className="text-sm text-gray-400">Commission</div>
              </div>
            </div>

            {/* Commission Info */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Commissions</span>
                <span className="text-white">{campaign.commissionRate}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-400">Others</span>
                <span className="text-gray-400">{campaign.description}</span>
              </div>
            </div>

            {/* Campaign URL and Actions */}
            <div className="bg-rise-dark-light p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-400 mb-1">Campaign URL:</p>
                  <p className="text-white font-mono text-sm truncate">
                    {campaign.url}?ref={customReferralIds[campaign.id] || userData.referralCode}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => copyLink(campaign.id)}
                    className="btn btn-secondary flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedStates[campaign.id] ? 'Copied!' : 'Copy link'}</span>
                  </button>
                  <button
                    onClick={() => setEditingCampaign(editingCampaign === campaign.id ? null : campaign.id)}
                    className="btn btn-secondary flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Customize Referral ID</span>
                  </button>
                </div>
              </div>
              
              {editingCampaign === campaign.id && (
                <div className="mt-4 p-4 bg-rise-dark rounded-lg border border-gray-600">
                  <label className="block text-sm text-gray-400 mb-2">
                    Custom Referral ID for {campaign.name}:
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={customReferralIds[campaign.id] || ''}
                      onChange={(e) => updateCustomReferralId(campaign.id, e.target.value)}
                      className="input-field flex-1"
                      placeholder={userData.referralCode}
                      maxLength={20}
                    />
                    <button
                      onClick={() => setEditingCampaign(null)}
                      className="btn btn-primary"
                    >
                      Done
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Leave empty to use your default referral code
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/performance" className="card hover:bg-rise-dark-light transition-colors">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-white font-semibold">Performance</h3>
                <p className="text-gray-400 text-sm">View detailed analytics</p>
              </div>
            </div>
          </Link>
          
          <Link to="/team" className="card hover:bg-rise-dark-light transition-colors">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-white font-semibold">Team</h3>
                <p className="text-gray-400 text-sm">Manage your network</p>
              </div>
            </div>
          </Link>
          
          <Link to="/training" className="card hover:bg-rise-dark-light transition-colors">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-white font-semibold">Training</h3>
                <p className="text-gray-400 text-sm">Learn marketing strategies</p>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Campaigns;