import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Users, DollarSign, TrendingUp, Award, Target, Share2, Crown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserAffiliateData {
  email: string;
  first_name: string;
  last_name: string;
  referral_code: string;
  total_team_size: number;
  total_l1_affiliates: number;
  total_l2_affiliates: number;
  total_l3_affiliates: number;
  total_earnings: number;
  total_l1_earnings: number;
  total_l2_earnings: number;
  total_l3_earnings: number;
  pending_earnings: number;
  paid_earnings: number;
  monthly_referral_volume?: number;
  status: string;
  signup_date: string;
}

const UserDashboard = () => {
  const { user, supabase } = useAuth();
  const [userData, setUserData] = useState<UserAffiliateData | null>(null);
  const [loading, setLoading] = useState(true);

  // Calculate rank based on monthly referral volume
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

  // Calculate progress to next rank
  const calculateNextRankProgress = (monthlyReferralVolume: number) => {
    if (monthlyReferralVolume >= 1000000) return 100; // Already at highest rank
    if (monthlyReferralVolume >= 500000) return ((monthlyReferralVolume - 500000) / 500000) * 100; // Progress to Sovereign
    if (monthlyReferralVolume >= 100000) return ((monthlyReferralVolume - 100000) / 400000) * 100; // Progress to Oracle
    if (monthlyReferralVolume >= 50000) return ((monthlyReferralVolume - 50000) / 50000) * 100; // Progress to Visionary
    if (monthlyReferralVolume >= 25000) return ((monthlyReferralVolume - 25000) / 25000) * 100; // Progress to Luminary
    if (monthlyReferralVolume >= 5000) return ((monthlyReferralVolume - 5000) / 20000) * 100; // Progress to Magnetic
    if (monthlyReferralVolume >= 1000) return ((monthlyReferralVolume - 1000) / 4000) * 100; // Progress to Ascended
    return (monthlyReferralVolume / 1000) * 100; // Progress from Aligned to Activated
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
      case 'Aligned': return '🎯';
      default: return '⭐';
    }
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

  // Calculate monthly referral volume from existing earnings data if not available
  const calculateMonthlyReferralVolume = (userData: UserAffiliateData) => {
    // If monthly_referral_volume is available, use it
    if (userData.monthly_referral_volume !== undefined) {
      return userData.monthly_referral_volume;
    }
    
    // Otherwise, estimate based on current total earnings (this is a temporary fallback)
    // In a real implementation, you'd query the database for current month's commission earnings
    const estimatedMonthlyVolume = userData.total_earnings * 0.1; // Rough estimate
    return estimatedMonthlyVolume;
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.email) return;

      try {
        const { data, error } = await supabase
          .from('affiliate_system_users')
          .select('*')
          .eq('email', user.email)
          .single();

        if (error) {
          console.error('Error loading user data:', error);
        } else {
          setUserData(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, supabase]);

  const copyAffiliateCode = async () => {
    if (userData?.referral_code) {
      const affiliateLink = `https://jennaz.co?ref=${userData.referral_code}`;
      await navigator.clipboard.writeText(affiliateLink);
      // You might want to add a toast notification here
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
        <h2 className="text-2xl font-bold text-white mb-4">Welcome to JennaZ Affiliate!</h2>
        <p className="text-gray-400 mb-6">Your affiliate profile is being set up. Please check back soon.</p>
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

  const rank = calculateRank(userData ? calculateMonthlyReferralVolume(userData) : 0);
  const nextRankProgress = calculateNextRankProgress(userData ? calculateMonthlyReferralVolume(userData) : 0);
  const nextRank = getNextRankName(rank);
  const monthlyVolume = userData ? calculateMonthlyReferralVolume(userData) : 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pb-12"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-serif font-semibold text-white mb-2">
          Welcome back, {userData.first_name}! 👋
        </h1>
        <p className="text-gray-400">
          Here's your affiliate performance overview
        </p>
      </motion.div>

      {/* Current Rank & Progress */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Current Rank */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm">Current Rank</h3>
            <Crown className="h-5 w-5 text-rise-gold" />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{getRankIcon(rank)}</span>
            <div>
              <p className="text-2xl font-bold text-white">{rank}</p>
              <p className="text-sm text-gray-400">Monthly Volume: ${monthlyVolume.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Progress to Next Rank */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm">Progress to {nextRank}</h3>
            <Star className="h-5 w-5 text-rise-gold" />
          </div>
          <p className="text-2xl font-bold text-white mb-2">{Math.round(nextRankProgress)}%</p>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-rise-gold h-2 rounded-full transition-all duration-500" 
              style={{ width: `${nextRankProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400">Next: {nextRank}</p>
        </div>
      </motion.div>

      {/* Earnings Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Earnings */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm">Total Earnings</h3>
            <DollarSign className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">${userData.total_earnings.toFixed(2)}</p>
          <p className="text-sm text-gray-400">All time</p>
        </div>

        {/* Pending Earnings */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm">Pending</h3>
            <TrendingUp className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">${userData.pending_earnings.toFixed(2)}</p>
          <p className="text-sm text-gray-400">Next payout</p>
        </div>

        {/* Paid Earnings */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm">Paid Out</h3>
            <Award className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">${userData.paid_earnings.toFixed(2)}</p>
          <p className="text-sm text-gray-400">Received</p>
        </div>
      </motion.div>

      {/* Team Structure */}
      <motion.div variants={itemVariants} className="card mb-8">
        <h3 className="text-xl font-semibold text-white mb-6">Your Team Structure</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Level 1 */}
          <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center justify-center mb-3">
              <Users className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-400">{userData.total_l1_affiliates}</p>
            <p className="text-sm text-gray-400 mb-2">Direct Referrals</p>
            <p className="text-lg font-semibold text-white">${userData.total_l1_earnings.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Level 1 Earnings</p>
          </div>

          {/* Level 2 */}
          <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center justify-center mb-3">
              <Users className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">{userData.total_l2_affiliates}</p>
            <p className="text-sm text-gray-400 mb-2">Second Level</p>
            <p className="text-lg font-semibold text-white">${userData.total_l2_earnings.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Level 2 Earnings</p>
          </div>

          {/* Level 3 */}
          <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <div className="flex items-center justify-center mb-3">
              <Users className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-purple-400">{userData.total_l3_affiliates}</p>
            <p className="text-sm text-gray-400 mb-2">Third Level</p>
            <p className="text-lg font-semibold text-white">${userData.total_l3_earnings.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Level 3 Earnings</p>
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

      {/* Referral Code CTA */}
      <motion.div variants={itemVariants} className="card bg-gradient-to-r from-rise-gold/10 to-rise-purple/10 border-rise-gold/20">
        <div className="text-center">
          <h3 className="text-xl font-serif text-white mb-2">Ready to Stack More Sats?</h3>
          <p className="text-gray-400 mb-4">Share The RISE with your network and earn commissions in the orange revolution!</p>
          <div className="bg-rise-dark-light p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-400 mb-2">Your Referral Code:</p>
            <p className="text-lg font-mono text-rise-gold">{userData.referral_code}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/campaigns" 
              className="btn btn-primary flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Manage Campaigns</span>
            </Link>
            <Link to="/training" className="btn btn-secondary flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Learn Bitcoin Marketing</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard; 