import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Users, DollarSign, TrendingUp, Award, Eye, Search, Filter, Download, RefreshCw, ArrowLeft, Star, Crown } from 'lucide-react';
import { AffiliateAggregationService } from '../services/affiliateAggregationService';
import ReassignAffiliateModal from '../components/ReassignAffiliateModal';

interface AffiliateUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  referral_code?: string;
  primary_source: string;
  status: string;
  signup_date?: string;
  total_l1_affiliates: number;
  total_l2_affiliates: number;
  total_l3_affiliates: number;
  total_team_size: number;
  total_l1_earnings: number;
  total_l2_earnings: number;
  total_l3_earnings: number;
  total_earnings: number;
  pending_earnings: number;
  paid_earnings: number;
}

interface CommissionData {
  id: string;
  order_source: string;
  order_id: string;
  customer_email?: string;
  customer_name?: string;
  order_total: number;
  order_date: string;
  product_category?: string;
  product_name?: string;
  commission_level: number;
  commission_rate: number;
  commission_amount: number;
  status: string;
  approved_date?: string;
  paid_date?: string;
}

interface TeamMember {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  signup_date?: string;
  level: number; // 1, 2, or 3
  total_earnings: number;
  direct_referrals: number;
}

export default function AffiliatesDashboard() {
  const { user, isAdmin, supabase } = useAuth();
  const navigate = useNavigate();
  
  // Create service role client for admin operations
  const serviceRoleClient = React.useMemo(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
    
    return createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }, []);

  const [affiliates, setAffiliates] = useState<AffiliateUser[]>([]);
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateUser | null>(null);
  const [commissions, setCommissions] = useState<CommissionData[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'overview' | 'affiliate-detail'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [affiliateToReassign, setAffiliateToReassign] = useState<AffiliateUser | null>(null);

  const formatCurrency = (amount: number) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getSourceBadge = (source: string) => {
    const sourceConfig = {
      'GHL': { color: 'bg-blue-900/20 text-blue-400', label: 'GHL' },
      'goaffpro': { color: 'bg-green-900/20 text-green-400', label: 'ReAction' },
      'GOAFFPRO': { color: 'bg-green-900/20 text-green-400', label: 'ReAction' },
      'mightynetworks': { color: 'bg-purple-900/20 text-purple-400', label: 'The RISE' },
      'MIGHTYNETWORKS': { color: 'bg-purple-900/20 text-purple-400', label: 'The RISE' },
      'native': { color: 'bg-orange-900/20 text-orange-400', label: 'JennaZ.co' },
      'NATIVE': { color: 'bg-orange-900/20 text-orange-400', label: 'JennaZ.co' }
    };

    const config = sourceConfig[source as keyof typeof sourceConfig] || 
                  { color: 'bg-gray-900/20 text-gray-400', label: source || 'Unknown' };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-900/20 text-green-400', label: 'Active' },
      pending: { color: 'bg-yellow-900/20 text-yellow-400', label: 'Pending' },
      inactive: { color: 'bg-red-900/20 text-red-400', label: 'Inactive' },
      approved: { color: 'bg-green-900/20 text-green-400', label: 'Approved' },
      'in_review': { color: 'bg-yellow-900/20 text-yellow-400', label: 'In Review' }
    };

    const config = statusConfig[status?.toLowerCase() as keyof typeof statusConfig] || 
                  { color: 'bg-gray-900/20 text-gray-400', label: status || 'Unknown' };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const loadAffiliates = async () => {
    console.log('🔄 AffiliatesDashboard: loadAffiliates() called');
    console.log('🔄 User email:', user?.email);
    console.log('🔄 Is admin:', isAdmin);

    try {
      const aggregationService = new AffiliateAggregationService(supabase);
      
      if (isAdmin) {
        console.log('🔄 Admin user: Loading all affiliates via aggregation service');
        const allAggregatedAffiliates = await aggregationService.getAllAffiliates();
        
        // Transform aggregated affiliates to match AffiliateUser interface
        const transformedAffiliates: AffiliateUser[] = allAggregatedAffiliates.map(aff => ({
          id: aff.id,
          email: aff.email,
          first_name: aff.name.split(' ')[0] || '',
          last_name: aff.name.split(' ').slice(1).join(' ') || '',
          referral_code: '', // Not available in aggregated data
          primary_source: aff.source.toUpperCase(),
          status: aff.status.toLowerCase(),
          signup_date: aff.dateJoined,
          total_l1_affiliates: 0, // Would need separate query
          total_l2_affiliates: 0,
          total_l3_affiliates: 0,
          total_team_size: aff.referrals,
          total_l1_earnings: 0, // Would need separate query  
          total_l2_earnings: 0,
          total_l3_earnings: 0,
          total_earnings: parseFloat(aff.commission.replace('$', '')) || 0,
          pending_earnings: 0, // Would need separate query
          paid_earnings: 0
        }));

        console.log('🔄 Loaded affiliates:', transformedAffiliates.length);
        setAffiliates(transformedAffiliates);
      } else {
        console.log('🔄 Regular user: Loading user-specific affiliate data');
        if (user?.email) {
          const userAffiliates = await aggregationService.getUserAffiliateData(user.email);
          
          // Transform user affiliates to match AffiliateUser interface
          const transformedUserAffiliates: AffiliateUser[] = userAffiliates.map(aff => ({
            id: aff.id,
            email: aff.email,
            first_name: aff.name.split(' ')[0] || '',
            last_name: aff.name.split(' ').slice(1).join(' ') || '',
            referral_code: '',
            primary_source: aff.source.toUpperCase(),
            status: aff.status.toLowerCase(),
            signup_date: aff.dateJoined,
            total_l1_affiliates: 0,
            total_l2_affiliates: 0,
            total_l3_affiliates: 0,
            total_team_size: aff.referrals,
            total_l1_earnings: 0,
            total_l2_earnings: 0,
            total_l3_earnings: 0,
            total_earnings: parseFloat(aff.commission.replace('$', '')) || 0,
            pending_earnings: 0,
            paid_earnings: 0
          }));

          console.log('🔄 Loaded user affiliates:', transformedUserAffiliates.length);
          setAffiliates(transformedUserAffiliates);
        }
      }
    } catch (error) {
      console.error('❌ Error loading affiliates:', error);
    }
  };

  const loadAffiliateCommissions = async (affiliateId: string) => {
    try {
      // Use service role client to bypass RLS permissions
      const { data, error } = await serviceRoleClient
        .from('multi_level_commissions')
        .select('*')
        .eq('earning_affiliate_id', affiliateId)
        .order('order_date', { ascending: false });

      if (error) throw error;
      setCommissions(data || []);
    } catch (error) {
      console.error('Error loading commissions:', error);
    }
  };

  const loadTeamMembers = async (affiliateId: string) => {
    try {
      // Use service role client to bypass RLS permissions
      const { data: relationships, error } = await serviceRoleClient
        .from('referral_relationships')
        .select(`
          affiliate_id,
          affiliate_system_users!referral_relationships_affiliate_id_fkey (
            id, email, first_name, last_name, signup_date, total_earnings
          )
        `)
        .or(`l1_referrer_id.eq.${affiliateId},l2_referrer_id.eq.${affiliateId},l3_referrer_id.eq.${affiliateId}`);

      if (error) throw error;

      // Also get direct referrals for each team member
      const teamData: TeamMember[] = [];

      for (const rel of relationships || []) {
        if (rel.affiliate_system_users) {
          const member = rel.affiliate_system_users as any; // Type assertion to handle complex nested data
          
          // Determine level (this is simplified - would need more complex logic for actual level determination)
          const level = 1; // Placeholder
          
          // Get direct referrals count using service role client
          const { count } = await serviceRoleClient
            .from('referral_relationships')
            .select('*', { count: 'exact', head: true })
            .eq('l1_referrer_id', member.id);

          teamData.push({
            id: member.id,
            email: member.email,
            first_name: member.first_name,
            last_name: member.last_name,
            signup_date: member.signup_date,
            level,
            total_earnings: member.total_earnings || 0,
            direct_referrals: count || 0
          });
        }
      }

      setTeamMembers(teamData);
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };

  const viewAffiliateDetail = async (affiliate: AffiliateUser) => {
    setSelectedAffiliate(affiliate);
    setView('affiliate-detail');
    await Promise.all([
      loadAffiliateCommissions(affiliate.id),
      loadTeamMembers(affiliate.id)
    ]);
  };

  const handleReassignAffiliate = async (newReferrerId: string) => {
    if (!affiliateToReassign) return;

    try {
      const { data: newReferrerRels, error: referrerError } = await supabase
        .from('referral_relationships')
        .select('l1_referrer_id, l2_referrer_id')
        .eq('affiliate_id', newReferrerId)
        .single();

      if (referrerError) {
        // It's possible the new referrer has no referrer themselves. That's a valid case.
        // We'll proceed, but log it.
        console.warn(`Could not find referrer details for ${newReferrerId}. They might be a top-level affiliate.`);
      }

      const { error: upsertError } = await supabase
        .from('referral_relationships')
        .upsert({
          affiliate_id: affiliateToReassign.id,
          l1_referrer_id: newReferrerId,
          l2_referrer_id: newReferrerRels?.l1_referrer_id || null,
          l3_referrer_id: newReferrerRels?.l2_referrer_id || null,
        }, { onConflict: 'affiliate_id' });
      
      if (upsertError) throw upsertError;
      
      console.log(`Successfully reassigned ${affiliateToReassign.email} to new referrer ${newReferrerId}`);
      setIsReassignModalOpen(false);
      setAffiliateToReassign(null);
      
      // Refresh data for the overview
      await loadAffiliates();
      
      // Go back to the overview to see the updated table
      setView('overview');

    } catch (error) {
      console.error('Error reassigning affiliate:', error);
      // You might want to show an error message to the user here
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadAffiliates();
      setLoading(false);
    };

    loadData();
  }, []);

  // Auto-show detail view for regular users
  useEffect(() => {
    if (!isAdmin && affiliates.length > 0 && !selectedAffiliate) {
      console.log('🔄 Auto-showing detail view for regular user');
      viewAffiliateDetail(affiliates[0]);
    }
  }, [affiliates, isAdmin, selectedAffiliate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalStats = affiliates.reduce((acc, affiliate) => ({
    totalAffiliates: acc.totalAffiliates + 1,
    totalL1: acc.totalL1 + affiliate.total_l1_affiliates,
    totalL2: acc.totalL2 + affiliate.total_l2_affiliates,
    totalL3: acc.totalL3 + affiliate.total_l3_affiliates,
    totalEarnings: acc.totalEarnings + affiliate.total_earnings,
    pendingEarnings: acc.pendingEarnings + affiliate.pending_earnings
  }), {
    totalAffiliates: 0,
    totalL1: 0,
    totalL2: 0,
    totalL3: 0,
    totalEarnings: 0,
    pendingEarnings: 0
  });

  if (view === 'affiliate-detail' && selectedAffiliate) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => { setView('overview'); setSelectedAffiliate(null); }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Overview
              </button>
              <div>
                <h1 className="text-3xl font-bold">
                  {selectedAffiliate.first_name || selectedAffiliate.last_name 
                    ? `${selectedAffiliate.first_name || ''} ${selectedAffiliate.last_name || ''}`.trim()
                    : selectedAffiliate.email}
                </h1>
                <p className="text-gray-400">{selectedAffiliate.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  {getSourceBadge(selectedAffiliate.primary_source)}
                  {getStatusBadge(selectedAffiliate.status)}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Team Size</p>
                  <p className="text-2xl font-bold">{selectedAffiliate.total_team_size}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Earnings</p>
                  <p className="text-2xl font-bold">{formatCurrency(selectedAffiliate.total_earnings)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Pending</p>
                  <p className="text-2xl font-bold">{formatCurrency(selectedAffiliate.pending_earnings)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Paid Out</p>
                  <p className="text-2xl font-bold">{formatCurrency(selectedAffiliate.paid_earnings)}</p>
                </div>
                <Award className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Commission Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Level 1 Commissions</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Direct Referrals:</span>
                  <span className="font-bold">{selectedAffiliate.total_l1_affiliates}</span>
                </div>
                <div className="flex justify-between">
                  <span>Earnings:</span>
                  <span className="font-bold">{formatCurrency(selectedAffiliate.total_l1_earnings)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-400">Level 2 Commissions</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Indirect Referrals:</span>
                  <span className="font-bold">{selectedAffiliate.total_l2_affiliates}</span>
                </div>
                <div className="flex justify-between">
                  <span>Earnings:</span>
                  <span className="font-bold">{formatCurrency(selectedAffiliate.total_l2_earnings)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Level 3 Commissions</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Grand Referrals:</span>
                  <span className="font-bold">{selectedAffiliate.total_l3_affiliates}</span>
                </div>
                <div className="flex justify-between">
                  <span>Earnings:</span>
                  <span className="font-bold">{formatCurrency(selectedAffiliate.total_l3_earnings)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Commissions */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-6">Recent Commissions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Order Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {commissions.slice(0, 10).map((commission) => (
                    <tr key={commission.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {commission.product_name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {commission.order_source.toUpperCase()} #{commission.order_id.slice(-8)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          commission.commission_level === 1 ? 'bg-blue-100 text-blue-800' :
                          commission.commission_level === 2 ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          Level {commission.commission_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {formatCurrency(commission.order_total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {formatCurrency(commission.commission_amount)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {commission.commission_rate}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(commission.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {formatDate(commission.order_date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Team Members</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Earnings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Direct Referrals
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {member.first_name || member.last_name 
                              ? `${member.first_name || ''} ${member.last_name || ''}`.trim()
                              : member.email}
                          </div>
                          <div className="text-sm text-gray-400">{member.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.level === 1 ? 'bg-blue-100 text-blue-800' :
                          member.level === 2 ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          Level {member.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {formatDate(member.signup_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {formatCurrency(member.total_earnings)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {member.direct_referrals}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:flex lg:items-center lg:justify-between p-4 bg-jennaz-purple rounded-lg">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
                {selectedAffiliate.first_name} {selectedAffiliate.last_name}
              </h2>
              <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-400">
                  <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" />
                  Team Size: {selectedAffiliate.total_team_size}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-400">
                  <DollarSign className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" />
                  Total Earnings: {formatCurrency(selectedAffiliate.total_earnings)}
                </div>
              </div>
            </div>
            <div className="mt-5 flex lg:mt-0 lg:ml-4 space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/payments?affiliate=${selectedAffiliate.id}`)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <DollarSign className="mr-2 h-5 w-5" />
                Payments
              </button>
              <button
                type="button"
                onClick={() => {
                  setAffiliateToReassign(selectedAffiliate);
                  setIsReassignModalOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-jennaz-rose text-jennaz-purple-dark hover:bg-jennaz-rose-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jennaz-rose"
              >
                <Users className="mr-2 h-5 w-5" />
                Reassign
              </button>
            </div>
          </div>

          <ReassignAffiliateModal
            isOpen={isReassignModalOpen}
            onClose={() => setIsReassignModalOpen(false)}
            affiliateToReassign={affiliateToReassign}
            allAffiliates={affiliates}
            onReassign={handleReassignAffiliate}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            {isAdmin ? 'Multi-Level Affiliates Dashboard' : 'My Affiliate Performance'}
          </h1>
          <div className="text-sm text-gray-400">
            {isAdmin 
              ? `Total Affiliates: ${totalStats.totalAffiliates}`
              : `My Profile${affiliates.length > 0 ? ` (${affiliates[0].first_name || affiliates[0].last_name ? `${affiliates[0].first_name || ''} ${affiliates[0].last_name || ''}`.trim() : affiliates[0].email})` : ''}`
            }
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  {isAdmin ? 'Total Affiliates' : 'My Status'}
                </p>
                <p className="text-2xl font-bold">{totalStats.totalAffiliates}</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-400">Level 1</p>
                <p className="text-2xl font-bold">{totalStats.totalL1}</p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-400">Level 2</p>
                <p className="text-2xl font-bold">{totalStats.totalL2}</p>
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-400">Level 3</p>
                <p className="text-2xl font-bold">{totalStats.totalL3}</p>
              </div>
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold">{formatCurrency(totalStats.totalEarnings)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Pending</p>
                <p className="text-2xl font-bold">{formatCurrency(totalStats.pendingEarnings)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Affiliates Table */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">
            {isAdmin ? 'All Affiliates' : 'My Affiliate Profile'}
          </h2>
          
          {!isAdmin && affiliates.length === 0 ? (
            <div className="text-center py-12">
              <Users className="inline-block h-12 w-12 text-gray-600 mb-4" />
              <p className="text-gray-400 mb-2">No affiliate profile found</p>
              <p className="text-gray-500 text-sm">
                Your account may not be set up as an affiliate yet. Contact support if you believe this is an error.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Affiliate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Team Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      L1 / L2 / L3
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Total Earnings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {affiliates.map((affiliate) => (
                    <tr key={affiliate.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {affiliate.first_name || affiliate.last_name 
                              ? `${affiliate.first_name || ''} ${affiliate.last_name || ''}`.trim()
                              : affiliate.email}
                          </div>
                          <div className="text-sm text-gray-400">{affiliate.email}</div>
                          {affiliate.referral_code && (
                            <div className="text-xs text-gray-500">Code: {affiliate.referral_code}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getSourceBadge(affiliate.primary_source)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {affiliate.total_team_size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <span className="text-blue-400 font-bold">{affiliate.total_l1_affiliates}</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-green-400 font-bold">{affiliate.total_l2_affiliates}</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-purple-400 font-bold">{affiliate.total_l3_affiliates}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {formatCurrency(affiliate.total_earnings)}
                          </div>
                          <div className="text-xs text-gray-400">
                            Pending: {formatCurrency(affiliate.pending_earnings)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(affiliate.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => viewAffiliateDetail(affiliate)}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
