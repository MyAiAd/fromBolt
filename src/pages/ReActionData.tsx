import React, { useState } from 'react';
import { Users, ShoppingCart, Gift, CreditCard, Filter, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../hooks/useAuth';

const ReActionData: React.FC = () => {
  const { isAdmin } = useAuth();
  const { 
    affiliates, 
    orders, 
    rewards, 
    payments, 
    isLoading, 
    refreshData, 
    setDataSource, 
    dataSource
  } = useData();
  
  const [activeTab, setActiveTab] = useState('affiliates');

  const tabs = [
    { id: 'affiliates', label: 'Affiliates', icon: Users, count: affiliates.length },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, count: orders.length },
    { id: 'rewards', label: 'Rewards', icon: Gift, count: rewards.length },
    { id: 'payments', label: 'Payments', icon: CreditCard, count: payments.length },
  ];

  const formatCurrency = (amount?: number) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  };

  const parseToNumber = (value: string | number | undefined): number | undefined => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || undefined;
    return undefined;
  };

  const getDataSourceBadge = (source: string) => {
    const isTest = source === 'test';
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isTest 
          ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-500/30' 
          : 'bg-green-900/20 text-green-400 border border-green-500/30'
      }`}>
        {isTest ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
        {isTest ? 'Test' : 'Real'}
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
              ReAction ID
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
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{affiliate.goaffpro_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    affiliate.status === 'approved' 
                      ? 'bg-green-900/20 text-green-400' 
                      : affiliate.status === 'pending'
                      ? 'bg-yellow-900/20 text-yellow-400'
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
          <p className="text-gray-400">No ReAction affiliates found</p>
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
              Products Purchased
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
              Source
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {orders.map((order) => {
            // Parse products data from both products and raw_data.line_items
            const products = order.products || order.raw_data?.line_items || [];
            const productCount = Array.isArray(products) ? products.length : 0;
            const totalQuantity = Array.isArray(products) 
              ? products.reduce((sum, product) => sum + (product.quantity || 1), 0)
              : 0;

            // Get commission rate from products or fallback
            const commissionRate = Array.isArray(products) && products.length > 0 
              ? products[0].commission_value || order.commission_rate
              : order.commission_rate;

            // Extract shipping address from raw_data
            const shippingAddress = order.raw_data?.shipping_address;

            return (
              <tr key={order.id} className="hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">
                      #{order.order_number || order.goaffpro_order_id || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatDate(order.order_date || order.created_at)}
                    </div>
                    {order.goaffpro_order_id && (
                      <div className="text-xs text-gray-500">
                        Order ID: {order.goaffpro_order_id}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-white">{order.customer_name || shippingAddress?.name || 'Unknown Customer'}</div>
                    <div className="text-sm text-gray-400">{order.customer_email || 'N/A'}</div>
                    {shippingAddress?.phone && (
                      <div className="text-xs text-gray-500">{shippingAddress.phone}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    {productCount > 0 ? (
                      <div>
                        <div className="text-sm text-white font-medium">
                          {productCount} product{productCount !== 1 ? 's' : ''} ({totalQuantity} item{totalQuantity !== 1 ? 's' : ''})
                        </div>
                        <div className="text-xs text-gray-400 mt-1 space-y-1">
                          {products.slice(0, 2).map((product, idx) => (
                            <div key={idx} className="truncate">
                              <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                  <div className="text-gray-300 truncate">
                                    <span className="font-medium">{product.quantity || 1}x</span> {product.name || product.sku || 'Unknown Product'}
                                  </div>
                                  {product.sku && (
                                    <div className="text-gray-500">SKU: {product.sku}</div>
                                  )}
                                </div>
                                <div className="ml-2 text-right">
                                  <div className="text-gray-300">{formatCurrency(parseToNumber(product.price) || 0)}</div>
                                  <div className="text-xs text-gray-500">
                                    {formatCurrency((parseToNumber(product.commission) || parseToNumber(product.commission_value)) || 0)} comm.
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {productCount > 2 && (
                            <div className="text-gray-500 text-xs">
                              ... and {productCount - 2} more item{productCount - 2 !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">No products found</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">
                      {formatCurrency(parseToNumber(order.order_value) || parseToNumber(order.order_total) || 0)}
                    </div>
                    {productCount > 0 && (
                      <div className="text-xs text-gray-400">
                        Avg: {formatCurrency((parseToNumber(order.order_value) || parseToNumber(order.order_total) || 0) / totalQuantity)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">
                      {formatCurrency(parseToNumber(order.commission) || parseToNumber(order.commission_amount) || 0)}
                    </div>
                    {commissionRate && (
                      <div className="text-xs text-gray-400">
                        {commissionRate}% rate
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'paid' || order.commission_status === 'paid'
                      ? 'bg-green-900/20 text-green-400' 
                      : order.status === 'pending' || order.commission_status === 'pending'
                      ? 'bg-yellow-900/20 text-yellow-400'
                      : 'bg-gray-900/20 text-gray-400'
                  }`}>
                    {order.commission_status || order.status || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getDataSourceBadge(order.data_source)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="inline-block h-12 w-12 text-gray-600 mb-4" />
          <p className="text-gray-400">No ReAction orders found</p>
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
              Reward ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Data Source
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {rewards.map((reward) => (
            <tr key={reward.id} className="hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {reward.goaffpro_reward_id}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-300 max-w-xs truncate">
                  {reward.description || 'No description'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatCurrency(reward.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {reward.reward_type || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-900/20 text-yellow-400">
                  {reward.status || 'Unknown'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatDate(reward.reward_date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getDataSourceBadge(reward.data_source)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPaymentsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Payment ID
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
              Data Source
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {payment.goaffpro_payment_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatCurrency(payment.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {payment.payment_method || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-900/20 text-yellow-400">
                  {payment.status || 'Unknown'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatDate(payment.payment_date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getDataSourceBadge(payment.data_source)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rise-gold mx-auto mb-4"></div>
          <p className="text-gray-400">Loading ReAction data...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'affiliates':
        return affiliates.length > 0 ? renderAffiliatesTable() : (
          <div className="text-center py-8 text-gray-400">No affiliates found</div>
        );
      case 'orders':
        return orders.length > 0 ? renderOrdersTable() : (
          <div className="text-center py-8 text-gray-400">No orders found</div>
        );
      case 'rewards':
        return rewards.length > 0 ? renderRewardsTable() : (
          <div className="text-center py-8 text-gray-400">No rewards found</div>
        );
      case 'payments':
        return payments.length > 0 ? renderPaymentsTable() : (
          <div className="text-center py-8 text-gray-400">No payments found</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-white flex items-center">
            <Users className="mr-2 h-6 w-6 text-rise-gold" />
            {isAdmin ? 'ReAction Data (Admin)' : 'My ReAction Data'}
          </h1>
          <p className="text-gray-400">
            {isAdmin 
              ? 'Raw data imported from ReAction platform - All affiliates'
              : 'Your performance data from ReAction platform'
            }
          </p>
        </div>
        
        {/* Data Source Filter */}
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={dataSource}
            onChange={(e) => setDataSource(e.target.value as 'all' | 'test' | 'goaffpro')}
            className="bg-rise-dark-light border border-gray-600 text-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rise-gold"
          >
            <option value="all">All Data</option>
            <option value="goaffpro">Real Data</option>
            <option value="test">Test Data</option>
          </select>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Affiliates</p>
              <p className="text-2xl font-bold text-white">{affiliates.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{orders.length}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Rewards</p>
              <p className="text-2xl font-bold text-white">{rewards.length}</p>
            </div>
            <Gift className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Payments</p>
              <p className="text-2xl font-bold text-white">{payments.length}</p>
            </div>
            <CreditCard className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
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
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-rise-gold text-rise-gold'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="card">
        {renderContent()}
      </div>
    </div>
  );
};

export default ReActionData; 