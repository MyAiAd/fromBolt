import { useEffect, useState } from 'react';
import { Users, DollarSign, TrendingUp, Eye, Copy, Crown, Trophy, Target, Calendar, Share2, UserPlus, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AffiliateAggregationService } from '../services/affiliateAggregationService';
import { AffiliateCodeService } from '../services/affiliateCodeService';

interface UserData {
  full_name?: string;
  email?: string;
}

interface TopPerformer {
  name: string;
  earnings: string;
  referrals: number;
  rank: string;
}

interface ActivityItem {
  type: string;
  message: string;
  time: string;
  icon: LucideIcon;
}

const Dashboard = () => {
  const { supabase, user, isAdmin } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState({
    totalTeamMembers: 0,
    totalCommission: 0,
    totalClicks: 0,
    conversionRate: 0,
    monthlyEarnings: 0,
    rank: 'Bronze',
    nextRankProgress: 65
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [affiliateCode, setAffiliateCode] = useState('');
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [copied, setCopied] = useState(false);

  const getCapitalizedFirstName = () => {
    const firstName = userData?.full_name?.split(' ')[0] || 
                     user?.user_metadata?.full_name?.split(' ')[0] || 
                     user?.email?.split('@')[0] || 
                     'Partner';
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  };

  const getNextRankName = (rank: string) => {
    switch (rank) {
      case 'Aligned': return 'Activated';
      case 'Activated': return 'Ascended';
      case 'Ascended': return 'Magnetic';
      case 'Magnetic': return 'Luminary';
      case 'Luminary': return 'Visionary';
      case 'Visionary': return 'Oracle';
      case 'Oracle': return 'Sovereign';
      default: return 'Max Rank';
    }
  };

  const mockTopPerformers: TopPerformer[] = [
    {
      name: 'Sarah Johnson',
      earnings: '$15,420',
      referrals: 47,
      rank: 'Sovereign',
    },
    {
      name: 'Mike Chen', 
      earnings: '$9,680',
      referrals: 32,
      rank: 'Oracle',
    },
    {
      name: 'Emma Rodriguez',
      earnings: '$7,340', 
      referrals: 28,
      rank: 'Visionary',
    }
  ];

  const mockRecentActivity: ActivityItem[] = [
    {
      type: 'referral',
      message: 'New referral from Sarah Johnson',
      time: '2 hours ago',
      icon: UserPlus,
    },
    {
      type: 'commission',
      message: 'Commission earned: $250',
      time: '4 hours ago',
      icon: DollarSign,
    },
    {
      type: 'rank_up',
      message: 'Rank updated to Magnetic!',
      time: '1 day ago',
      icon: TrendingUp,
    },
    {
      type: 'team_growth',
      message: 'Team member promoted to Activated',
      time: '2 days ago',
      icon: Users,
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setError('Please log in to view your dashboard');
        setIsLoading(false);
        return;
      }

      // Add a small delay to ensure auth state is fully loaded
      if (!user.email) {
        console.log('⏳ Waiting for complete user data...');
        setTimeout(() => {
          if (user?.email) {
            fetchData();
          }
        }, 500);
        return;
      }

      try {
        console.log('🚀 Starting dashboard data fetch for:', user.email);
        
        // Create services
        const aggregationService = new AffiliateAggregationService(supabase);
        const affiliateCodeService = new AffiliateCodeService(supabase);
        
        // Get or create affiliate code from database
        const code = await affiliateCodeService.getOrCreateAffiliateCode(
          user.email || '', 
          user.id, 
          user.user_metadata
        );
        setAffiliateCode(code);

        // Sync code across platforms
        if (user.email && !code.startsWith('TEMP')) {
          await affiliateCodeService.syncAffiliateCodeAcrossPlatforms(user.email, code);
        }

        // Try to fetch user data, but don't fail if it doesn't exist
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          setUserData(userData || { 
            full_name: user.email?.split('@')[0] || 'Partner',
            email: user.email 
          });
        } catch {
          console.log('User data not found, using defaults');
          setUserData({ 
            full_name: user.email?.split('@')[0] || 'Partner',
            email: user.email 
          });
        }

        // Get real affiliate stats
        try {
          const affiliateStats = await aggregationService.getAffiliateStats();
          const allAffiliates = await aggregationService.getAllAffiliates();
          
          // Calculate real commission total from affiliates
          const totalCommission = allAffiliates.reduce((sum, affiliate) => {
            const commission = parseFloat(affiliate.commission.replace('$', '').replace(',', '')) || 0;
            return sum + commission;
          }, 0);

          // Calculate average commission as monthly earnings estimate
          const monthlyEarnings = allAffiliates.length > 0 ? Math.round(totalCommission / Math.max(allAffiliates.length, 1)) : 0;
          
          // For rank calculation, use monthly earnings as referral volume estimate
          // But for admin users, always set to Sovereign rank
          const estimatedMonthlyVolume = monthlyEarnings;
          const userRank = isAdmin ? 'Sovereign' : calculateRank(estimatedMonthlyVolume);
          const userProgress = isAdmin ? 100 : calculateNextRankProgress(estimatedMonthlyVolume);
          
          const realStats = {
            totalTeamMembers: affiliateStats.total || 0,
            totalCommission: Math.round(totalCommission),
            totalClicks: allAffiliates.reduce((sum, affiliate) => sum + affiliate.referrals, 0) * 10, // Estimate clicks as 10x referrals
            conversionRate: allAffiliates.length > 0 ? 
              (allAffiliates.filter(a => a.referrals > 0).length / allAffiliates.length * 100) : 0,
            monthlyEarnings: monthlyEarnings,
            rank: userRank,
            nextRankProgress: userProgress
          };
          
          setStats(realStats);
          
          // Set top performers from real data
          const topAffiliates = allAffiliates
            .filter(affiliate => affiliate.referrals > 0 || parseFloat(affiliate.commission.replace('$', '').replace(',', '')) > 0)
            .sort((a, b) => {
              const aCommission = parseFloat(a.commission.replace('$', '').replace(',', '')) || 0;
              const bCommission = parseFloat(b.commission.replace('$', '').replace(',', '')) || 0;
              return bCommission - aCommission;
            })
            .slice(0, 5)
            .map(affiliate => ({
              name: affiliate.name,
              earnings: affiliate.commission,
              referrals: affiliate.referrals,
              rank: getAffiliateRank(parseFloat(affiliate.commission.replace('$', '').replace(',', '')) || 0)
            }));

          // Add current user if they have activity
          const userStats = {
            name: 'You',
            earnings: `$${realStats.monthlyEarnings}`,
            referrals: Math.floor(realStats.totalTeamMembers / 5), // Estimate user's direct referrals
            rank: realStats.rank
          };

          const combinedPerformers = [...topAffiliates, userStats]
            .sort((a, b) => {
              const aEarnings = parseFloat(a.earnings.replace('$', '').replace(',', '')) || 0;
              const bEarnings = parseFloat(b.earnings.replace('$', '').replace(',', '')) || 0;
              return bEarnings - aEarnings;
            })
            .slice(0, 5);

          setTopPerformers(combinedPerformers);
          
        } catch (error) {
          console.log('Error fetching affiliate stats:', error);
          setStats({
            totalTeamMembers: 0,
            totalCommission: 0,
            totalClicks: 0,
            conversionRate: 0,
            monthlyEarnings: 0,
            rank: isAdmin ? 'Sovereign' : 'Aligned',
            nextRankProgress: isAdmin ? 100 : 0
          });
          setTopPerformers([]);
        }

        // Generate activity based on real data
        const recentActivityItems: ActivityItem[] = [];
        
        try {
          const recentAffiliates = await aggregationService.getAllAffiliates();
          const recentAffiliatesCount = recentAffiliates.filter(a => {
            const joinedDate = new Date(a.dateJoined);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return joinedDate > weekAgo;
          }).length;

          if (recentAffiliatesCount > 0) {
            recentActivityItems.push({
              type: 'referral',
              message: `${recentAffiliatesCount} new team member${recentAffiliatesCount === 1 ? '' : 's'} joined`,
              time: '2 hours ago',
              icon: UserPlus
            });
          }

          const activeAffiliates = recentAffiliates.filter(a => a.status === 'Active').length;
          if (activeAffiliates > 0) {
            recentActivityItems.push({
              type: 'commission',
              message: `${activeAffiliates} active affiliate${activeAffiliates === 1 ? '' : 's'} in your network`,
              time: '5 hours ago',
              icon: DollarSign
            });
          }

          recentActivityItems.push({
            type: 'rank',
            message: 'Rank progress updated',
            time: '1 day ago',
            icon: Trophy
          });

          const totalReferrals = recentAffiliates.reduce((sum, a) => sum + a.referrals, 0);
          if (totalReferrals > 0) {
            recentActivityItems.push({
              type: 'click',
              message: `${totalReferrals} total referrals in your network`,
              time: '2 days ago',
              icon: Eye
            });
          }

        } catch (error) {
          console.log('Error generating activity:', error);
        }

        setRecentActivity(recentActivityItems);
        setError(null);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]); // Only depend on user.id, not the entire user object or supabase

  const calculateRank = (monthlyReferralVolume: number) => {
    if (monthlyReferralVolume >= 1000000) return 'Sovereign';
    if (monthlyReferralVolume >= 500000) return 'Oracle';
    if (monthlyReferralVolume >= 100000) return 'Visionary';
    if (monthlyReferralVolume >= 50000) return 'Luminary';
    if (monthlyReferralVolume >= 25000) return 'Magnetic';
    if (monthlyReferralVolume >= 5000) return 'Ascended';
    if (monthlyReferralVolume >= 1000) return 'Activated';
    return 'Aligned';
  };

  const calculateNextRankProgress = (monthlyReferralVolume: number) => {
    if (monthlyReferralVolume >= 1000000) return 100; // Already at top rank
    if (monthlyReferralVolume >= 500000) return Math.min(100, ((monthlyReferralVolume - 500000) / 500000) * 100); // Progress to Sovereign
    if (monthlyReferralVolume >= 100000) return Math.min(100, ((monthlyReferralVolume - 100000) / 400000) * 100); // Progress to Oracle
    if (monthlyReferralVolume >= 50000) return Math.min(100, ((monthlyReferralVolume - 50000) / 50000) * 100); // Progress to Visionary
    if (monthlyReferralVolume >= 25000) return Math.min(100, ((monthlyReferralVolume - 25000) / 25000) * 100); // Progress to Luminary
    if (monthlyReferralVolume >= 5000) return Math.min(100, ((monthlyReferralVolume - 5000) / 20000) * 100); // Progress to Magnetic
    if (monthlyReferralVolume >= 1000) return Math.min(100, ((monthlyReferralVolume - 1000) / 4000) * 100); // Progress to Ascended
    return Math.min(100, (monthlyReferralVolume / 1000) * 100); // Progress from Aligned to Activated
  };

  const getAffiliateRank = (monthlyReferralVolume: number) => {
    if (monthlyReferralVolume >= 1000000) return 'Sovereign';
    if (monthlyReferralVolume >= 500000) return 'Oracle';
    if (monthlyReferralVolume >= 100000) return 'Visionary';
    if (monthlyReferralVolume >= 50000) return 'Luminary';
    if (monthlyReferralVolume >= 25000) return 'Magnetic';
    if (monthlyReferralVolume >= 5000) return 'Ascended';
    if (monthlyReferralVolume >= 1000) return 'Activated';
    return 'Aligned';
  };

  const copyAffiliateCode = async () => {
    try {
      const affiliateCodeService = new AffiliateCodeService(supabase);
      const affiliateLink = affiliateCodeService.generateAffiliateLink(affiliateCode);
      await navigator.clipboard.writeText(affiliateLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };



  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Sovereign': return 'text-purple-400';
      case 'Oracle': return 'text-indigo-400';
      case 'Visionary': return 'text-blue-400';
      case 'Luminary': return 'text-cyan-400';
      case 'Magnetic': return 'text-green-400';
      case 'Ascended': return 'text-yellow-400';
      case 'Activated': return 'text-orange-400';
      default: return 'text-gray-400'; // Aligned
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'Sovereign': return '👑';
      case 'Oracle': return '🔮';
      case 'Visionary': return '✨';
      case 'Luminary': return '💫';
      case 'Magnetic': return '🧲';
      case 'Ascended': return '🚀';
      case 'Activated': return '⚡';
      default: return '🎯'; // Aligned
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rise-gold mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading your data...</p>
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
      {error && (
        <motion.div variants={itemVariants} className="mb-6 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-white mb-2">
            Welcome Back, {getCapitalizedFirstName()}!
          </h1>
                          <p className="text-gray-400">Your journey with The Corps continues. Let's get after it!</p>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-500">Current Rank:</span>
            <span className={`ml-2 font-semibold ${getRankColor(stats.rank)}`}>{stats.rank}</span>
          </div>
        </div>
        
        {/* Affiliate Code Card */}
        <div className="mt-6 lg:mt-0 bg-rise-dark-light rounded-lg p-4 border border-rise-gold/20">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Your Affiliate Code</p>
            <div className="flex items-center justify-center space-x-2 mb-3">
              <code className="bg-rise-dark px-3 py-2 rounded text-rise-gold font-mono text-lg">
                {affiliateCode}
              </code>
              <button
                onClick={copyAffiliateCode}
                className="btn btn-secondary p-2"
                title="Copy affiliate link"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            
            <Link 
              to="/campaigns" 
              className="btn btn-primary w-full mt-2 flex items-center justify-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Manage Campaigns</span>
            </Link>
            
            {copied && <p className="text-green-400 text-xs mt-2">Affiliate link copied!</p>}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/team" className="card hover:bg-rise-dark-light transition-colors">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-400" />
            <div>
              <h3 className="text-white font-semibold">Manage Team</h3>
              <p className="text-gray-400 text-sm">View and support your downline</p>
            </div>
          </div>
        </Link>
        
        <Link to="/training" className="card hover:bg-rise-dark-light transition-colors">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-green-400" />
            <div>
              <h3 className="text-white font-semibold">Training Center</h3>
              <p className="text-gray-400 text-sm">Learn and grow your skills</p>
            </div>
          </div>
        </Link>
        
        <button 
          onClick={copyAffiliateCode}
          className="card hover:bg-rise-dark-light transition-colors text-left"
        >
          <div className="flex items-center space-x-3">
            <Share2 className="w-8 h-8 text-purple-400" />
            <div>
              <h3 className="text-white font-semibold">Share & Earn</h3>
              <p className="text-gray-400 text-sm">Copy your affiliate link</p>
            </div>
          </div>
        </button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div variants={itemVariants} className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm">Team Members</h3>
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">{stats.totalTeamMembers}</p>
          <div className="text-xs flex items-center text-green-400">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>Growing strong!</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm">Monthly Earnings</h3>
            <DollarSign className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">${stats.monthlyEarnings.toLocaleString()}</p>
          <div className="text-xs flex items-center text-green-400">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+15% this month</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm">Total Earnings</h3>
            <Trophy className="h-5 w-5 text-rise-gold" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">${stats.totalCommission.toLocaleString()}</p>
          <div className="text-xs flex items-center text-green-400">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>All time high!</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm">Rank Progress</h3>
            <Crown className="h-5 w-5 text-purple-400" />
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progress to Next Rank</span>
            <span className="text-sm text-gray-400">{Math.round(stats.nextRankProgress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-rise-gold h-2 rounded-full transition-all duration-500" 
              style={{ width: `${stats.nextRankProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400">
            Next: {getNextRankName(stats.rank)}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Leaderboard */}
        <motion.div variants={itemVariants} className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-xl text-white flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-rise-gold" />
              Team Leaderboard
            </h2>
            <Link to="/leaderboard" className="text-rise-gold hover:underline text-sm">
              View Full Leaderboard
            </Link>
          </div>

          <div className="space-y-3">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-rise-dark-light rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500 text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-amber-600 text-black' :
                    'bg-rise-gold text-black'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{performer.name}</p>
                    <p className="text-gray-400 text-sm">{performer.referrals} referrals</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-rise-gold font-semibold">{performer.earnings}</p>
                  <p className={`text-xs ${getRankColor(performer.rank)}`}>{performer.rank}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-xl text-white flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-400" />
              Recent Activity
            </h2>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-center space-x-3 p-3 bg-rise-dark-light rounded-lg">
                  <Icon className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.message}</p>
                    <p className="text-gray-500 text-xs">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div variants={itemVariants} className="card bg-gradient-to-r from-rise-gold/10 to-rise-purple/10 border-rise-gold/20">
        <div className="text-center">
          <h3 className="text-xl font-serif text-white mb-2">Ready to Stack More Sats?</h3>
          <p className="text-gray-400 mb-6">Share The RISE with your network and earn commissions in the orange revolution!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={copyAffiliateCode}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Copy Affiliate Link</span>
            </button>
            <Link to="/training" className="btn btn-secondary flex items-center space-x-2">
              <Target className="w-4 h-4" />
                              <span>Learn Facebook Marketing</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;