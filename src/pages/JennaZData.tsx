import React, { useState, useEffect } from 'react';
import { Users, ShoppingCart, Gift, CreditCard, Eye, EyeOff, RefreshCw, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface JennaZAffiliate {
  id: string;
  jennaz_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  status?: string;
  referral_code?: string;
  commission_rate?: number;
  balance: number;
  total_earnings: number;
  total_orders: number;
  signup_date?: string;
  payout_email?: string;
  data_source: string;
  raw_data?: unknown;
}

interface JennaZOrder {
  id: string;
  jennaz_order_id: string;
  jennaz_affiliate_id?: string;
  contact_id?: string;
  opportunity_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  order_value: number;
  order_total: number;
  commission_amount: number;
  commission_rate?: number;
  commission_status?: string;
  order_status?: string;
  pipeline_id?: string;
  stage_id?: string;
  order_date?: string;
  close_date?: string;
  products?: unknown;
  data_source: string;
  raw_data?: unknown;
}

interface JennaZReward {
  id: string;
  jennaz_reward_id: string;
  jennaz_affiliate_id?: string;
  reward_type?: string;
  description?: string;
  reward_amount: number;
  reward_date?: string;
  status?: string;
  trigger_event?: string;
  data_source: string;
  raw_data?: unknown;
}

interface JennaZPayment {
  id: string;
  jennaz_payment_id: string;
  jennaz_affiliate_id?: string;
  payment_amount: number;
  payment_method?: string;
  payment_status?: string;
  payment_date?: string;
  transaction_id?: string;
  payment_reference?: string;
  currency?: string;
  data_source: string;
  raw_data?: unknown;
}

const JennaZData: React.FC = () => {
  const { supabase, user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('affiliates');
  const [isLoading, setIsLoading] = useState(true);
  const [affiliates, setAffiliates] = useState<JennaZAffiliate[]>([]);
  const [orders, setOrders] = useState<JennaZOrder[]>([]);
  const [rewards, setRewards] = useState<JennaZReward[]>([]);
  const [payments, setPayments] = useState<JennaZPayment[]>([]);

  const tabs = [
    { id: 'affiliates', label: 'Affiliates', icon: Users, count: affiliates.length },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, count: orders.length },
    { id: 'rewards', label: 'Rewards', icon: Gift, count: rewards.length },
    { id: 'payments', label: 'Payments', icon: CreditCard, count: payments.length },
  ];

  useEffect(() => {
    loadData();
  }, [user, isAdmin]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (isAdmin) {
        // Admin: Load all data
        const [affiliatesFromSystemUsers, affiliatesFromLegacy, ordersData, rewardsData, paymentsData] = await Promise.all([
          supabase
            .from('affiliate_system_users')
            .select('*')
            .eq('primary_source', 'ghl')
            .order('signup_date', { ascending: false }),
          supabase
            .from('jennaz_affiliates')
            .select('*')
            .order('signup_date', { ascending: false }),
          supabase.from('jennaz_orders').select('*').order('order_date', { ascending: false }),
          supabase.from('jennaz_rewards').select('*').order('reward_date', { ascending: false }),
          supabase.from('jennaz_payments').select('*').order('payment_date', { ascending: false })
        ]);

        // Transform affiliate_system_users data to match JennaZAffiliate interface
        const transformedSystemUsers = (affiliatesFromSystemUsers.data || []).map(user => ({
          id: `ghl_${user.id}`,
          jennaz_id: user.ghl_contact_id || user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          status: user.status || 'active',
          referral_code: user.referral_code,
          commission_rate: user.commission_rate || 0,
          balance: user.balance || 0,
          total_earnings: user.total_earnings || 0,
          total_orders: user.total_orders || 0,
          signup_date: user.signup_date,
          payout_email: user.payout_email || user.email,
          data_source: 'ghl',
          raw_data: user
        }));

        // Combine all affiliate sources
        const allAffiliates = [
          ...transformedSystemUsers,
          ...(affiliatesFromLegacy.data || [])
        ];

        if (affiliatesFromSystemUsers.error) console.error('Error loading GHL affiliates:', affiliatesFromSystemUsers.error);
        if (affiliatesFromLegacy.error) console.error('Error loading legacy affiliates:', affiliatesFromLegacy.error);
        
        setAffiliates(allAffiliates);

        if (ordersData.error) console.error('Error loading orders:', ordersData.error);
        else setOrders(ordersData.data || []);

        if (rewardsData.error) console.error('Error loading rewards:', rewardsData.error);
        else setRewards(rewardsData.data || []);

        if (paymentsData.error) console.error('Error loading payments:', paymentsData.error);
        else setPayments(paymentsData.data || []);

        console.log(`✅ Google Data loaded: ${transformedSystemUsers.length} GHL affiliates + ${affiliatesFromLegacy.data?.length || 0} legacy affiliates`);

      } else if (user?.email) {
        // Regular user: Load only their own data
        const [affiliatesFromSystemUsers, affiliatesFromLegacy, ordersData, rewardsData, paymentsData] = await Promise.all([
          supabase
            .from('affiliate_system_users')
            .select('*')
            .eq('primary_source', 'ghl')
            .eq('email', user.email)
            .order('signup_date', { ascending: false }),
          supabase
            .from('jennaz_affiliates')
            .select('*')
            .eq('email', user.email)
            .order('signup_date', { ascending: false }),
          supabase.from('jennaz_orders').select('*').eq('customer_email', user.email).order('order_date', { ascending: false }),
          supabase.from('jennaz_rewards').select('*').eq('jennaz_affiliate_id', user.email).order('reward_date', { ascending: false }),
          supabase.from('jennaz_payments').select('*').eq('jennaz_affiliate_id', user.email).order('payment_date', { ascending: false })
        ]);

        // Transform affiliate_system_users data to match JennaZAffiliate interface
        const transformedSystemUsers = (affiliatesFromSystemUsers.data || []).map(user => ({
          id: `ghl_${user.id}`,
          jennaz_id: user.ghl_contact_id || user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          status: user.status || 'active',
          referral_code: user.referral_code,
          commission_rate: user.commission_rate || 0,
          balance: user.balance || 0,
          total_earnings: user.total_earnings || 0,
          total_orders: user.total_orders || 0,
          signup_date: user.signup_date,
          payout_email: user.payout_email || user.email,
          data_source: 'ghl',
          raw_data: user
        }));

        // Combine all affiliate sources
        const allAffiliates = [
          ...transformedSystemUsers,
          ...(affiliatesFromLegacy.data || [])
        ];

        setAffiliates(allAffiliates);
        setOrders(ordersData.data || []);
        setRewards(rewardsData.data || []);
        setPayments(paymentsData.data || []);

        console.log(`✅ Google User Data loaded for ${user.email}: ${allAffiliates.length} affiliates`);
      } else {
        // No user or invalid user - clear data
        setAffiliates([]);
        setOrders([]);
        setRewards([]);
        setPayments([]);
      }

    } catch (error) {
      console.error('Error loading Google data:', error);
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
    switch (source) {
      case 'ghl':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/20 text-blue-400 border border-blue-500/30">
            <Eye className="w-3 h-3 mr-1" />
            Go High Level
          </span>
        );
      case 'test':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900/20 text-yellow-400 border border-yellow-500/30">
            <EyeOff className="w-3 h-3 mr-1" />
            Test
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900/20 text-green-400 border border-green-500/30">
            <Eye className="w-3 h-3 mr-1" />
            Google
          </span>
        );
    }
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
              JennaZ ID
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
              Total Orders
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
                    {affiliate.phone && (
                      <div className="text-xs text-gray-500">{affiliate.phone}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{affiliate.jennaz_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    affiliate.status === 'active' 
                      ? 'bg-green-900/20 text-green-400' 
                      : affiliate.status === 'pending'
                      ? 'bg-yellow-900/20 text-yellow-400'
                      : affiliate.status === 'inactive'
                      ? 'bg-red-900/20 text-red-400'
                      : 'bg-gray-900/20 text-gray-400'
                  }`}>
                    {affiliate.status || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {affiliate.commission_rate ? `${affiliate.commission_rate}%` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatCurrency(affiliate.balance)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatCurrency(affiliate.total_earnings)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {affiliate.total_orders || 0}
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
          <p className="text-gray-400">No JennaZ affiliates found</p>
        </div>
      )}
    </div>
  );

  const renderOrdersTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Order Info
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Order Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Commission
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Pipeline/Stage
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Source
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-white">
                    Order #{order.jennaz_order_id}
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDate(order.order_date)}
                  </div>
                  {order.opportunity_id && (
                    <div className="text-xs text-gray-500">
                      Opportunity: {order.opportunity_id}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-white">
                    {order.customer_name || 'Unknown Customer'}
                  </div>
                  <div className="text-sm text-gray-400">{order.customer_email}</div>
                  {order.customer_phone && (
                    <div className="text-xs text-gray-500">{order.customer_phone}</div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-white">{formatCurrency(order.order_total)}</div>
                {order.order_value !== order.order_total && (
                  <div className="text-xs text-gray-400">Base: {formatCurrency(order.order_value)}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-white">{formatCurrency(order.commission_amount)}</div>
                {order.commission_rate && (
                  <div className="text-xs text-gray-400">{order.commission_rate}%</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  order.order_status === 'won' 
                    ? 'bg-green-900/20 text-green-400' 
                    : order.order_status === 'open'
                    ? 'bg-blue-900/20 text-blue-400'
                    : order.order_status === 'lost'
                    ? 'bg-red-900/20 text-red-400'
                    : 'bg-gray-900/20 text-gray-400'
                }`}>
                  {order.order_status || 'Unknown'}
                </span>
                <div className="text-xs text-gray-400 mt-1">
                  {order.commission_status || 'Pending'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">
                  {order.pipeline_id && (
                    <div>Pipeline: {order.pipeline_id}</div>
                  )}
                  {order.stage_id && (
                    <div className="text-xs text-gray-400">Stage: {order.stage_id}</div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getDataSourceBadge(order.data_source)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {orders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="inline-block h-12 w-12 text-gray-600 mb-4" />
          <p className="text-gray-400">No JennaZ orders found</p>
        </div>
      )}
    </div>
  );

  const renderRewardsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Reward
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Type
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
              Trigger
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Source
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {rewards.map((reward) => (
            <tr key={reward.id} className="hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-white">
                    {reward.jennaz_reward_id}
                  </div>
                  <div className="text-sm text-gray-400">
                    {reward.description || 'No description'}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-900/20 text-purple-400">
                  {reward.reward_type || 'Bonus'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {formatCurrency(reward.reward_amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatDate(reward.reward_date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  reward.status === 'approved' 
                    ? 'bg-green-900/20 text-green-400' 
                    : reward.status === 'pending'
                    ? 'bg-yellow-900/20 text-yellow-400'
                    : reward.status === 'paid'
                    ? 'bg-blue-900/20 text-blue-400'
                    : 'bg-gray-900/20 text-gray-400'
                }`}>
                  {reward.status || 'Pending'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {reward.trigger_event || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getDataSourceBadge(reward.data_source)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {rewards.length === 0 && (
        <div className="text-center py-12">
          <Gift className="inline-block h-12 w-12 text-gray-600 mb-4" />
          <p className="text-gray-400">No JennaZ rewards found</p>
        </div>
      )}
    </div>
  );

  const renderPaymentsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Payment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Method
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Reference
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Source
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-white">
                    {payment.jennaz_payment_id}
                  </div>
                  {payment.transaction_id && (
                    <div className="text-xs text-gray-500">
                      TxID: {payment.transaction_id}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-white">{formatCurrency(payment.payment_amount)}</div>
                <div className="text-xs text-gray-400">{payment.currency || 'USD'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-900/20 text-blue-400">
                  {payment.payment_method || 'Unknown'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  payment.payment_status === 'completed' 
                    ? 'bg-green-900/20 text-green-400' 
                    : payment.payment_status === 'processing'
                    ? 'bg-yellow-900/20 text-yellow-400'
                    : payment.payment_status === 'failed'
                    ? 'bg-red-900/20 text-red-400'
                    : 'bg-gray-900/20 text-gray-400'
                }`}>
                  {payment.payment_status || 'Pending'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatDate(payment.payment_date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {payment.payment_reference || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getDataSourceBadge(payment.data_source)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {payments.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="inline-block h-12 w-12 text-gray-600 mb-4" />
          <p className="text-gray-400">No JennaZ payments found</p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'affiliates':
        return renderAffiliatesTable();
      case 'orders':
        return renderOrdersTable();
      case 'rewards':
        return renderRewardsTable();
      case 'payments':
        return renderPaymentsTable();
      default:
        return renderAffiliatesTable();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-green-400 animate-spin" />
        <span className="ml-2 text-gray-400">Loading JennaZ data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-white flex items-center">
            <Zap className="mr-2 h-6 w-6 text-green-400" />
            {isAdmin ? 'Google Data (Admin)' : 'My Google Data'}
          </h1>
          <p className="text-gray-400">
            {isAdmin 
              ? 'View and manage all Google (Go High Level) affiliate data'
              : 'View your Google (Go High Level) affiliate performance'
            }
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
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
                    ? 'border-green-400 text-green-400'
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

export default JennaZData; 