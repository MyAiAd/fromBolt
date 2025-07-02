import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Users, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Send
} from 'lucide-react';
import { PayPalService } from '../services/paypalService';

interface PendingCommission {
  id: string;
  earning_affiliate_id: string;
  commission_amount: number;
  order_date: string;
  status: string;
  affiliate_system_users: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

interface PayoutItem {
  id: string;
  affiliate_id: string;
  amount: number;
  payment_method: string;
  payment_email: string;
  status: string;
  created_at: string;
  completed_date?: string;
  transaction_id?: string;
  notes?: string;
  affiliate_system_users: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

interface AffiliatePaymentSummary {
  affiliateId: string;
  email: string;
  name: string;
  totalUnpaid: number;
  commissionCount: number;
  commissions: PendingCommission[];
}

export default function PaymentsThreeSection() {
  const { user, isAdmin, supabase } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [paypalService] = useState(() => new PayPalService(supabase));
  
  const affiliateId = new URLSearchParams(location.search).get('affiliate');
  
  // Three distinct states for the three sections
  const [unpaidCommissions, setUnpaidCommissions] = useState<PendingCommission[]>([]);
  const [pendingPayouts, setPendingPayouts] = useState<PayoutItem[]>([]);
  const [completedPayouts, setCompletedPayouts] = useState<PayoutItem[]>([]);
  const [affiliatePaymentSummaries, setAffiliatePaymentSummaries] = useState<AffiliatePaymentSummary[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<Set<string>>(new Set());

  const formatCurrency = (amount: number) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-900/20 text-yellow-400', icon: Clock },
      processing: { color: 'bg-blue-900/20 text-blue-400', icon: RefreshCw },
      completed: { color: 'bg-green-900/20 text-green-400', icon: CheckCircle },
      failed: { color: 'bg-red-900/20 text-red-400', icon: XCircle },
      cancelled: { color: 'bg-gray-900/20 text-gray-400', icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const loadUnpaidCommissions = async () => {
    try {
      const allCommissions = await paypalService.getPendingCommissions(affiliateId || undefined);
      const allPayouts = await paypalService.getPayoutHistory(affiliateId || undefined);
      
      // Get affiliate IDs that have any non-completed payouts
      const affiliatesWithPendingPayouts = new Set(
        allPayouts
          .filter(p => p.status !== 'completed')
          .map(p => p.affiliate_id)
      );
      
      // Filter to only truly unpaid commissions (no pending payouts)
      const unpaidOnly = allCommissions.filter(comm => 
        !affiliatesWithPendingPayouts.has(comm.earning_affiliate_id)
      );
      
      setUnpaidCommissions(unpaidOnly);

      // Group for summary view
      if (!affiliateId) {
        const grouped = unpaidOnly.reduce((acc, commission) => {
          const affId = commission.earning_affiliate_id;
          if (!acc[affId]) {
            acc[affId] = {
              affiliateId: affId,
              email: commission.affiliate_system_users.email,
              name: `${commission.affiliate_system_users.first_name || ''} ${commission.affiliate_system_users.last_name || ''}`.trim() || commission.affiliate_system_users.email,
              totalUnpaid: 0,
              commissionCount: 0,
              commissions: []
            };
          }
          acc[affId].totalUnpaid += commission.commission_amount;
          acc[affId].commissionCount += 1;
          acc[affId].commissions.push(commission);
          return acc;
        }, {} as Record<string, AffiliatePaymentSummary>);

        setAffiliatePaymentSummaries(Object.values(grouped));
      }
    } catch (error) {
      console.error('Error loading unpaid commissions:', error);
    }
  };

  const loadPayouts = async () => {
    try {
      const allPayouts = await paypalService.getPayoutHistory(affiliateId || undefined);
      
      const pending = allPayouts.filter(p => p.status === 'processing' || p.status === 'pending');
      const completed = allPayouts.filter(p => p.status === 'completed');
      
      setPendingPayouts(pending);
      setCompletedPayouts(completed);
    } catch (error) {
      console.error('Error loading payouts:', error);
    }
  };

  const handleSinglePayout = async (affiliateId: string, amount: number, email: string) => {
    if (!isAdmin) {
      alert('Only administrators can process payouts');
      return;
    }

    setProcessing(prev => new Set(prev).add(affiliateId));
    
    try {
      await paypalService.createPayout(affiliateId, amount, email);
      alert(`Payout of ${formatCurrency(amount)} initiated successfully to ${email}`);
      await loadUnpaidCommissions();
      await loadPayouts();
    } catch (error) {
      console.error('Error processing payout:', error);
      alert(`Error processing payout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(prev => {
        const next = new Set(prev);
        next.delete(affiliateId);
        return next;
      });
    }
  };

  // Webhook handler for PayPal status updates
  const checkPayoutStatusUpdates = async () => {
    try {
      // This would be called by a webhook in production
      // For now, we can manually refresh the data
      await loadPayouts();
      await loadUnpaidCommissions();
    } catch (error) {
      console.error('Error checking payout status updates:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        loadUnpaidCommissions(),
        loadPayouts()
      ]);
      setLoading(false);
    };

    loadData();
  }, [affiliateId]);

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
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalUnpaidAmount = affiliateId 
    ? unpaidCommissions.reduce((sum, comm) => sum + comm.commission_amount, 0)
    : affiliatePaymentSummaries.reduce((sum, summary) => sum + summary.totalUnpaid, 0);

  const totalPendingAmount = pendingPayouts.reduce((sum, payout) => sum + payout.amount, 0);
  const totalCompletedAmount = completedPayouts.reduce((sum, payout) => sum + payout.amount, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {affiliateId && (
              <button
                onClick={() => navigate('/affiliates-dashboard')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Affiliates
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold">
                {affiliateId ? 'Affiliate Payment Details' : 'Payment Dashboard'}
              </h1>
              <p className="text-gray-400">
                Three-stage payment processing: Unpaid → Pending → Paid
              </p>
            </div>
          </div>
          
          {isAdmin && (
            <button
              onClick={checkPayoutStatusUpdates}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Status
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Unpaid</p>
                <p className="text-2xl font-bold text-yellow-400">{formatCurrency(totalUnpaidAmount)}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-blue-400">{formatCurrency(totalPendingAmount)}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Paid</p>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(totalCompletedAmount)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Transactions</p>
                <p className="text-2xl font-bold">{unpaidCommissions.length + pendingPayouts.length + completedPayouts.length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Section 1: Unpaid Commissions */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-yellow-400">💰 Unpaid Commissions</h3>
            <span className="text-sm text-gray-400">Ready for payout</span>
          </div>
          
          {!affiliateId ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Affiliate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Commissions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {affiliatePaymentSummaries.map((summary) => (
                    <tr key={summary.affiliateId} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{summary.name}</div>
                          <div className="text-sm text-gray-400">{summary.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {summary.commissionCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {formatCurrency(summary.totalUnpaid)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => navigate(`/payments?affiliate=${summary.affiliateId}`)}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            View
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => handleSinglePayout(summary.affiliateId, summary.totalUnpaid, summary.email)}
                              disabled={processing.has(summary.affiliateId)}
                              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-3 py-1 rounded text-sm font-medium transition-colors flex items-center"
                            >
                              {processing.has(summary.affiliateId) ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                "Pay"
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Commission ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {unpaidCommissions.map((commission) => (
                    <tr key={commission.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {commission.id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {formatCurrency(commission.commission_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(commission.order_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(commission.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {unpaidCommissions.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="inline-block h-12 w-12 text-green-600 mb-4" />
              <p className="text-gray-400">No unpaid commissions</p>
            </div>
          )}
        </div>

        {/* Section 2: Pending Payouts */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-blue-400">⏳ Pending Payouts</h3>
            <span className="text-sm text-gray-400">Processing with PayPal</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Affiliate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {pendingPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {payout.affiliate_system_users.first_name || payout.affiliate_system_users.last_name 
                            ? `${payout.affiliate_system_users.first_name || ''} ${payout.affiliate_system_users.last_name || ''}`.trim()
                            : payout.affiliate_system_users.email}
                        </div>
                        <div className="text-sm text-gray-400">{payout.payment_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {formatCurrency(payout.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payout.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(payout.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {payout.transaction_id?.slice(-8) || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {pendingPayouts.length === 0 && (
            <div className="text-center py-12">
              <Clock className="inline-block h-12 w-12 text-gray-600 mb-4" />
              <p className="text-gray-400">No pending payouts</p>
            </div>
          )}
        </div>

        {/* Section 3: Completed Payouts */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-green-400">✅ Paid</h3>
            <span className="text-sm text-gray-400">Successfully completed</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Affiliate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Completed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {completedPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {payout.affiliate_system_users.first_name || payout.affiliate_system_users.last_name 
                            ? `${payout.affiliate_system_users.first_name || ''} ${payout.affiliate_system_users.last_name || ''}`.trim()
                            : payout.affiliate_system_users.email}
                        </div>
                        <div className="text-sm text-gray-400">{payout.payment_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {formatCurrency(payout.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payout.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {payout.completed_date ? formatDate(payout.completed_date) : formatDate(payout.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {payout.transaction_id?.slice(-8) || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {completedPayouts.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="inline-block h-12 w-12 text-gray-600 mb-4" />
              <p className="text-gray-400">No completed payouts yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 