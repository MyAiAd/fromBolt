import React, { useState, useEffect } from 'react';
import { Users, ShoppingCart, Gift, CreditCard, Eye, EyeOff, RefreshCw, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface MightyNetworksAffiliate {
  id: string;
  rewardful_affiliate_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  status?: string;
  signup_date?: string;
  referral_code?: string;
  commission_rate?: number;
  balance: number;
  total_earnings: number;
  total_referrals: number;
  total_commissions: number;
  payout_email?: string;
  data_source: string;
  raw_data?: unknown;
}

interface MightyNetworksReferral {
  id: string;
  rewardful_referral_id: string;
  affiliate_id: string;
  customer_email?: string;
  customer_name?: string;
  referral_date?: string;
  conversion_date?: string;
  status?: string;
  data_source: string;
  raw_data?: unknown;
}

interface MightyNetworksCommission {
  id: string;
  rewardful_commission_id: string;
  affiliate_id: string;
  referral_id?: string;
  commission_amount: number;
  currency?: string;
  date_earned?: string;
  status?: string;
  data_source: string;
  raw_data?: unknown;
}

interface MightyNetworksPayout {
  id: string;
  rewardful_payout_id: string;
  affiliate_id: string;
  amount: number;
  currency?: string;
  payment_date?: string;
  status?: string;
  data_source: string;
  raw_data?: unknown;
}

const MightyNetworksData: React.FC = () => {
  const { supabase, user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('affiliates');
  const [isLoading, setIsLoading] = useState(true);
  const [affiliates, setAffiliates] = useState<MightyNetworksAffiliate[]>([]);
  const [referrals, setReferrals] = useState<MightyNetworksReferral[]>([]);
  const [commissions, setCommissions] = useState<MightyNetworksCommission[]>([]);
  const [payouts, setPayouts] = useState<MightyNetworksPayout[]>([]);

  const tabs = [
    { id: 'affiliates', label: 'Affiliates', icon: Users, count: affiliates.length },
    { id: 'referrals', label: 'Referrals', icon: ShoppingCart, count: referrals.length },
    { id: 'commissions', label: 'Commissions', icon: Gift, count: commissions.length },
    { id: 'payouts', label: 'Payouts', icon: CreditCard, count: payouts.length },
  ];

  useEffect(() => {
    loadData();
  }, [user, isAdmin]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (isAdmin) {
        // Admin: Load all data
        const [affiliatesData, referralsData, commissionsData, payoutsData] = await Promise.all([
          supabase.from('mightynetworks_affiliates').select('*').order('signup_date', { ascending: false }),
          supabase.from('mightynetworks_referrals').select('*').order('referral_date', { ascending: false }),
          supabase.from('mightynetworks_commissions').select('*').order('date_earned', { ascending: false }),
          supabase.from('mightynetworks_payouts').select('*').order('payment_date', { ascending: false })
        ]);

        if (affiliatesData.error) console.error('Error loading affiliates:', affiliatesData.error);
        else setAffiliates(affiliatesData.data || []);

        if (referralsData.error) console.error('Error loading referrals:', referralsData.error);
        else setReferrals(referralsData.data || []);

        if (commissionsData.error) console.error('Error loading commissions:', commissionsData.error);
        else setCommissions(commissionsData.data || []);

        if (payoutsData.error) console.error('Error loading payouts:', payoutsData.error);
        else setPayouts(payoutsData.data || []);

        console.log('✅ MightyNetworks Admin Data loaded');

      } else if (user?.email) {
        // Regular user: Load only their own data
        const [affiliatesData, referralsData, commissionsData, payoutsData] = await Promise.all([
          supabase.from('mightynetworks_affiliates').select('*').eq('email', user.email).order('signup_date', { ascending: false }),
          supabase.from('mightynetworks_referrals').select('*').eq('customer_email', user.email).order('referral_date', { ascending: false }),
          supabase.from('mightynetworks_commissions').select('*').eq('affiliate_id', user.email).order('date_earned', { ascending: false }),
          supabase.from('mightynetworks_payouts').select('*').eq('affiliate_id', user.email).order('payment_date', { ascending: false })
        ]);

        setAffiliates(affiliatesData.data || []);
        setReferrals(referralsData.data || []);
        setCommissions(commissionsData.data || []);
        setPayouts(payoutsData.data || []);

        console.log(`✅ MightyNetworks User Data loaded for ${user.email}`);

      } else {
        // No user or invalid user - clear data
        setAffiliates([]);
        setReferrals([]);
        setCommissions([]);
        setPayouts([]);
      }

    } catch (error) {
      console.error('Error loading Mighty Networks data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getDataSourceBadge = (source: string) => {
    const isTest = source === 'test';
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isTest 
          ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-500/30' 
          : 'bg-purple-900/20 text-purple-400 border border-purple-500/30'
      }`}>
        {isTest ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
        {isTest ? 'Test' : 'Bitcoin is BAE'}
      </span>
    );
  };

  const renderAffiliatesTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Affiliate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Rewardful ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Commission Rate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Balance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Total Earnings
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Total Referrals
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Data Source
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {affiliates.map((affiliate) => {
            // Create display name with fallbacks
            let displayName = 'Unknown';
            if (affiliate.first_name && affiliate.last_name && 
                affiliate.first_name !== 'null' && affiliate.last_name !== 'null') {
              displayName = `${affiliate.first_name} ${affiliate.last_name}`.trim();
            } else if (affiliate.name && affiliate.name !== 'null') {
              displayName = affiliate.name;
            } else if (affiliate.first_name && affiliate.first_name !== 'null') {
              displayName = affiliate.first_name;
            } else if (affiliate.last_name && affiliate.last_name !== 'null') {
              displayName = affiliate.last_name;
            } else if (affiliate.email) {
              displayName = affiliate.email.split('@')[0];
            }

            return (
              <tr key={affiliate.id} className="hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">
                      {displayName}
                    </div>
                    <div className="text-sm text-gray-400">{affiliate.email}</div>
                    {affiliate.referral_code && (
                      <div className="text-xs text-gray-500">Code: {affiliate.referral_code}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{affiliate.rewardful_affiliate_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    affiliate.status === 'approved' || affiliate.status === 'active'
                      ? 'bg-green-900/20 text-green-400' 
                      : affiliate.status === 'pending'
                      ? 'bg-yellow-900/20 text-yellow-400'
                      : 'bg-gray-900/20 text-gray-400'
                  }`}>
                    {affiliate.status || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {affiliate.commission_rate ? `${(affiliate.commission_rate * 100).toFixed(1)}%` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatCurrency(affiliate.balance)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatCurrency(affiliate.total_earnings)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {affiliate.total_referrals || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getDataSourceBadge(affiliate.data_source)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {affiliates.length === 0 && (
        <div className="text-center py-12">
          <Users className="inline-block h-12 w-12 text-gray-600 mb-4" />
          <p className="text-gray-400">No Bitcoin is BAE affiliates found</p>
        </div>
      )}
    </div>
  );

  const renderReferralsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Referral
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Referral Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Conversion Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Data Source
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {referrals.map((referral) => (
            <tr key={referral.id} className="hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-white">
                    {referral.rewardful_referral_id}
                  </div>
                  <div className="text-sm text-gray-400">
                    Affiliate: {referral.affiliate_id}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm text-white">{referral.customer_name || 'N/A'}</div>
                  <div className="text-sm text-gray-400">{referral.customer_email || 'N/A'}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatDate(referral.referral_date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatDate(referral.conversion_date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  referral.status === 'converted'
                    ? 'bg-green-900/20 text-green-400'
                    : referral.status === 'pending'
                    ? 'bg-yellow-900/20 text-yellow-400'
                    : 'bg-gray-900/20 text-gray-400'
                }`}>
                  {referral.status || 'Unknown'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getDataSourceBadge(referral.data_source)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {referrals.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="inline-block h-12 w-12 text-gray-600 mb-4" />
          <p className="text-gray-400">No Bitcoin is BAE referrals found</p>
        </div>
      )}
    </div>
  );

  const renderCommissionsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Commission
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Affiliate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Data Source
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {commissions.map((commission) => (
            <tr key={commission.id} className="hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-white">
                    {commission.rewardful_commission_id}
                  </div>
                  {commission.referral_id && (
                    <div className="text-sm text-gray-400">
                      Referral: {commission.referral_id}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {commission.affiliate_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatCurrency(commission.commission_amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatDate(commission.date_earned)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  commission.status === 'paid'
                    ? 'bg-green-900/20 text-green-400'
                    : commission.status === 'pending'
                    ? 'bg-yellow-900/20 text-yellow-400'
                    : 'bg-gray-900/20 text-gray-400'
                }`}>
                  {commission.status || 'Unknown'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getDataSourceBadge(commission.data_source)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {commissions.length === 0 && (
        <div className="text-center py-12">
          <Gift className="inline-block h-12 w-12 text-gray-600 mb-4" />
          <p className="text-gray-400">No Bitcoin is BAE commissions found</p>
        </div>
      )}
    </div>
  );

  const renderPayoutsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Payout
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Affiliate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Data Source
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {payouts.map((payout) => (
            <tr key={payout.id} className="hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-white">
                  {payout.rewardful_payout_id}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {payout.affiliate_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatCurrency(payout.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatDate(payout.payment_date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  payout.status === 'paid'
                    ? 'bg-green-900/20 text-green-400'
                    : payout.status === 'pending'
                    ? 'bg-yellow-900/20 text-yellow-400'
                    : 'bg-gray-900/20 text-gray-400'
                }`}>
                  {payout.status || 'Unknown'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getDataSourceBadge(payout.data_source)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {payouts.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="inline-block h-12 w-12 text-gray-600 mb-4" />
          <p className="text-gray-400">No Bitcoin is BAE payouts found</p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'affiliates':
        return renderAffiliatesTable();
      case 'referrals':
        return renderReferralsTable();
      case 'commissions':
        return renderCommissionsTable();
      case 'payouts':
        return renderPayoutsTable();
      default:
        return renderAffiliatesTable();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
        <span className="ml-2 text-gray-400">Loading Bitcoin is BAE data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-white flex items-center">
            <Zap className="mr-2 h-6 w-6 text-purple-400" />
            {isAdmin ? 'Mighty Networks Data (Admin)' : 'My Mighty Networks Data'}
          </h1>
          <p className="text-gray-400">
            {isAdmin 
              ? 'View and manage all Bitcoin is BAE (Mighty Networks) affiliate data'
              : 'View your Bitcoin is BAE (Mighty Networks) affiliate performance'
            }
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-400 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
                <span className="ml-2 bg-gray-700 text-gray-300 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-gray-900 rounded-lg shadow">
        {renderContent()}
      </div>
    </div>
  );
};

export default MightyNetworksData; 