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
  Search,
  Filter,
  Download,
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

interface PayoutHistoryItem {
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
  totalPending: number;
  commissionCount: number;
  commissions: PendingCommission[];
}

export default function Payments() {
  const { user, isAdmin, supabase } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [paypalService] = useState(() => new PayPalService(supabase));
  
  // Check if we're viewing payments for a specific affiliate
  const affiliateId = new URLSearchParams(location.search).get('affiliate');
  
  const [pendingCommissions, setPendingCommissions] = useState<PendingCommission[]>([]);
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistoryItem[]>([]);
  const [affiliatePaymentSummaries, setAffiliatePaymentSummaries] = useState<AffiliatePaymentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCommissions, setSelectedCommissions] = useState<Set<string>>(new Set());
  const [bulkPaymentMode, setBulkPaymentMode] = useState(false);

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

  const loadPendingCommissions = async () => {
    try {
      const commissions = await paypalService.getPendingCommissions(affiliateId || undefined);
      setPendingCommissions(commissions);

      // Group commissions by affiliate for bulk payment view
      if (!affiliateId) {
        const grouped = commissions.reduce((acc, commission) => {
          const affiliateId = commission.earning_affiliate_id;
          if (!acc[affiliateId]) {
            acc[affiliateId] = {
              affiliateId,
              email: commission.affiliate_system_users.email,
              name: `${commission.affiliate_system_users.first_name || ''} ${commission.affiliate_system_users.last_name || ''}`.trim() || commission.affiliate_system_users.email,
              totalPending: 0,
              commissionCount: 0,
              commissions: []
            };
          }
          acc[affiliateId].totalPending += commission.commission_amount;
          acc[affiliateId].commissionCount += 1;
          acc[affiliateId].commissions.push(commission);
          return acc;
        }, {} as Record<string, AffiliatePaymentSummary>);

        setAffiliatePaymentSummaries(Object.values(grouped));
      }
    } catch (error) {
      console.error('Error loading pending commissions:', error);
    }
  };

  const loadPayoutHistory = async () => {
    try {
      const history = await paypalService.getPayoutHistory(affiliateId || undefined);
      setPayoutHistory(history);
    } catch (error) {
      console.error('Error loading payout history:', error);
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
      await loadPendingCommissions();
      await loadPayoutHistory();
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

  const handleBulkPayout = async () => {
    if (!isAdmin) {
      alert('Only administrators can process payouts');
      return;
    }

    const selectedPayments = affiliatePaymentSummaries.filter(summary => 
      selectedCommissions.has(summary.affiliateId)
    );

    if (selectedPayments.length === 0) {
      alert('Please select at least one affiliate for payout');
      return;
    }

    setProcessing(prev => new Set([...prev, ...selectedPayments.map(p => p.affiliateId)]));

    try {
      const promises = selectedPayments.map(payment => 
        paypalService.createPayout(payment.affiliateId, payment.totalPending, payment.email)
      );

      await Promise.all(promises);
      alert(`Bulk payout completed for ${selectedPayments.length} affiliates`);
      setSelectedCommissions(new Set());
      await loadPendingCommissions();
      await loadPayoutHistory();
    } catch (error) {
      console.error('Error processing bulk payout:', error);
      alert(`Error processing bulk payout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(new Set());
    }
  };

  const toggleCommissionSelection = (affiliateId: string) => {
    setSelectedCommissions(prev => {
      const next = new Set(prev);
      if (next.has(affiliateId)) {
        next.delete(affiliateId);
      } else {
        next.add(affiliateId);
      }
      return next;
    });
  };

  const selectAllCommissions = () => {
    setSelectedCommissions(new Set(affiliatePaymentSummaries.map(s => s.affiliateId)));
  };

  const clearAllSelections = () => {
    setSelectedCommissions(new Set());
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        loadPendingCommissions(),
        loadPayoutHistory()
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
            <div className="h-96 bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalPendingAmount = affiliateId 
    ? pendingCommissions.reduce((sum, comm) => sum + comm.commission_amount, 0)
    : affiliatePaymentSummaries.reduce((sum, summary) => sum + summary.totalPending, 0);

  const totalSelectedAmount = Array.from(selectedCommissions).reduce((sum, affiliateId) => {
    const summary = affiliatePaymentSummaries.find(s => s.affiliateId === affiliateId);
    return sum + (summary?.totalPending || 0);
  }, 0);

  const selectedAffiliate = affiliateId ? pendingCommissions[0]?.affiliate_system_users : null;

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
                {affiliateId 
                  ? `Payments for ${selectedAffiliate?.first_name || selectedAffiliate?.last_name 
                      ? `${selectedAffiliate.first_name || ''} ${selectedAffiliate.last_name || ''}`.trim()
                      : selectedAffiliate?.email || 'Affiliate'}`
                  : 'Payment Dashboard'
                }
              </h1>
              <p className="text-gray-400">
                {affiliateId 
                  ? `Manage payments for ${selectedAffiliate?.email}`
                  : 'Manage affiliate payments and disbursements via PayPal'
                }
              </p>
            </div>
          </div>
          
          {isAdmin && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setBulkPaymentMode(!bulkPaymentMode)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  bulkPaymentMode 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {bulkPaymentMode ? 'Exit Bulk Mode' : 'Bulk Payment Mode'}
              </button>
              
              {bulkPaymentMode && (
                <>
                  <button
                    onClick={selectAllCommissions}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearAllSelections}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleBulkPayout}
                    disabled={selectedCommissions.size === 0 || processing.size > 0}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Pay Selected ({selectedCommissions.size})
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Pending</p>
                <p className="text-2xl font-bold">{formatCurrency(totalPendingAmount)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  {affiliateId ? 'Pending Commissions' : 'Affiliates with Pending'}
                </p>
                <p className="text-2xl font-bold">
                  {affiliateId ? pendingCommissions.length : affiliatePaymentSummaries.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Recent Payouts</p>
                <p className="text-2xl font-bold">{payoutHistory.length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-400" />
            </div>
          </div>

          {bulkPaymentMode && (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Selected Amount</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalSelectedAmount)}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          )}
        </div>

        {/* Pending Payments */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6">Pending Payments</h3>
          
          {(!affiliateId && !bulkPaymentMode) ? (
            // Affiliate summary view
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Affiliate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Commissions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Total Pending
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
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
                        {summary.commissionCount} commissions
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {formatCurrency(summary.totalPending)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => navigate(`/payments?affiliate=${summary.affiliateId}`)}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          View Details
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleSinglePayout(summary.affiliateId, summary.totalPending, summary.email)}
                            disabled={processing.has(summary.affiliateId)}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-3 py-1 rounded text-sm font-medium transition-colors flex items-center"
                          >
                            {processing.has(summary.affiliateId) ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-1" />
                                Pay Now
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : bulkPaymentMode ? (
            // Bulk payment selection view
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedCommissions.size === affiliatePaymentSummaries.length && affiliatePaymentSummaries.length > 0}
                        onChange={() => selectedCommissions.size === affiliatePaymentSummaries.length ? clearAllSelections() : selectAllCommissions()}
                        className="rounded border-gray-600 text-blue-600 bg-gray-700"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Affiliate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Commissions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {affiliatePaymentSummaries.map((summary) => (
                    <tr 
                      key={summary.affiliateId} 
                      className={`hover:bg-gray-700 ${selectedCommissions.has(summary.affiliateId) ? 'bg-blue-900/20' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedCommissions.has(summary.affiliateId)}
                          onChange={() => toggleCommissionSelection(summary.affiliateId)}
                          className="rounded border-gray-600 text-blue-600 bg-gray-700"
                        />
                      </td>
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
                        {formatCurrency(summary.totalPending)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Individual commission details view
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Commission ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Order Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {pendingCommissions.map((commission) => (
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
              
              {affiliateId && isAdmin && pendingCommissions.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      const affiliate = pendingCommissions[0]?.affiliate_system_users;
                      if (affiliate) {
                        handleSinglePayout(affiliate.id, totalPendingAmount, affiliate.email);
                      }
                    }}
                    disabled={processing.has(affiliateId) || totalPendingAmount === 0}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-6 py-2 rounded text-sm font-medium transition-colors flex items-center"
                  >
                    {processing.has(affiliateId) ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Pay Total {formatCurrency(totalPendingAmount)}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Payout History */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Payment History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Affiliate
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
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {payoutHistory.map((payout) => (
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
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-900/20 text-blue-400">
                        {payout.payment_method.toUpperCase()}
                      </span>
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
            
            {payoutHistory.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="inline-block h-12 w-12 text-gray-600 mb-4" />
                <p className="text-gray-400">No payment history found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 