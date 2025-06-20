import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface GoAffProAffiliate {
  id: string;
  goaffpro_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  status?: string;
  referral_code?: string;
  commission_rate?: number;
  balance?: number;
  total_earnings?: number;
  total_orders?: number;
  data_source: string;
  created_at: string;
}

interface GoAffProOrder {
  id: string;
  goaffpro_id: string;
  goaffpro_order_id?: string;
  goaffpro_affiliate_id?: string;
  affiliate_id?: string;
  order_number?: string;
  customer_name?: string;
  customer_email?: string;
  order_id?: string;
  order_value?: number;
  order_total?: number;
  commission?: number;
  commission_amount?: number;
  commission_rate?: number;
  status?: string;
  order_date?: string;
  commission_status?: string;
  products?: Array<{
    id?: number;
    product_id?: number;
    variation_id?: number;
    sku?: string;
    name?: string;
    vendor?: string;
    quantity?: number;
    price?: string;
    total?: number;
    total_price?: number;
    total_tax?: number;
    total_discount?: number;
    commission?: number;
    commission_value?: number;
    commission_type?: string;
    cv?: number;
    exclude_discounts?: boolean;
    gift_card_percentage?: number;
    gift_card_amount_used?: number;
  }>;
  raw_data?: {
    id?: number;
    status?: string;
    created_at?: string;
    updated_at?: string;
    affiliate_id?: number;
    customer_email?: string;
    shipping_address?: {
      zip?: string;
      city?: string;
      name?: string;
      phone?: string;
      state?: string;
      company?: string;
      country?: string;
      address_1?: string;
      address_2?: string;
      first_name?: string;
      last_name?: string;
    };
    line_items?: Array<{
      id?: number;
      product_id?: number;
      variation_id?: number;
      sku?: string;
      name?: string;
      vendor?: string;
      quantity?: number;
      price?: string;
      total?: number;
      total_price?: number;
      total_tax?: number;
      total_discount?: number;
      commission?: number;
      commission_value?: number;
      commission_type?: string;
      cv?: number;
      exclude_discounts?: boolean;
      gift_card_percentage?: number;
      gift_card_amount_used?: number;
    }>;
    [key: string]: unknown;
  };
  data_source: string;
  created_at: string;
  updated_at?: string;
}

interface GoAffProReward {
  id: string;
  goaffpro_id: string;
  goaffpro_reward_id?: string;
  description?: string;
  affiliate_id?: string;
  reward_amount?: number;
  amount?: number;
  reward_type?: string;
  status?: string;
  reward_date?: string;
  date_awarded?: string;
  data_source: string;
  created_at: string;
}

interface GoAffProPayment {
  id: string;
  goaffpro_id: string;
  goaffpro_payment_id?: string;
  affiliate_id?: string;
  payment_amount?: number;
  amount?: number;
  payment_method?: string;
  status?: string;
  payment_date?: string;
  data_source: string;
  created_at: string;
}

interface DataContextType {
  affiliates: GoAffProAffiliate[];
  orders: GoAffProOrder[];
  rewards: GoAffProReward[];
  payments: GoAffProPayment[];
  isLoading: boolean;
  lastUpdated: Date | null;
  refreshData: () => Promise<void>;
  setDataSource: (source: 'all' | 'test' | 'goaffpro') => void;
  dataSource: 'all' | 'test' | 'goaffpro';
  hasDataAccess: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { supabase, user, isAdmin, loading: authLoading } = useAuth();
  const [affiliates, setAffiliates] = useState<GoAffProAffiliate[]>([]);
  const [orders, setOrders] = useState<GoAffProOrder[]>([]);
  const [rewards, setRewards] = useState<GoAffProReward[]>([]);
  const [payments, setPayments] = useState<GoAffProPayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [dataSource, setDataSource] = useState<'all' | 'test' | 'goaffpro'>('all');
  const [hasDataAccess, setHasDataAccess] = useState(true);
  
  // Track last refresh attempt to prevent rapid successive calls
  const [lastRefreshAttempt, setLastRefreshAttempt] = useState<Date | null>(null);

  // Cache keys for localStorage
  const CACHE_KEYS = {
    affiliates: 'affiliate_data_affiliates',
    orders: 'affiliate_data_orders',
    rewards: 'affiliate_data_rewards',
    payments: 'affiliate_data_payments',
    lastUpdated: 'affiliate_data_last_updated',
    dataSource: 'affiliate_data_source'
  };

  // Load cached data from localStorage
  const loadCachedData = () => {
    try {
      const cachedAffiliates = localStorage.getItem(CACHE_KEYS.affiliates);
      const cachedOrders = localStorage.getItem(CACHE_KEYS.orders);
      const cachedRewards = localStorage.getItem(CACHE_KEYS.rewards);
      const cachedPayments = localStorage.getItem(CACHE_KEYS.payments);
      const cachedLastUpdated = localStorage.getItem(CACHE_KEYS.lastUpdated);
      const cachedDataSource = localStorage.getItem(CACHE_KEYS.dataSource);

      if (cachedAffiliates) {
        setAffiliates(JSON.parse(cachedAffiliates));
        console.log('📦 Loaded cached affiliates:', JSON.parse(cachedAffiliates).length);
      }
      if (cachedOrders) {
        setOrders(JSON.parse(cachedOrders));
        console.log('📦 Loaded cached orders:', JSON.parse(cachedOrders).length);
      }
      if (cachedRewards) {
        setRewards(JSON.parse(cachedRewards));
        console.log('📦 Loaded cached rewards:', JSON.parse(cachedRewards).length);
      }
      if (cachedPayments) {
        setPayments(JSON.parse(cachedPayments));
        console.log('📦 Loaded cached payments:', JSON.parse(cachedPayments).length);
      }
      if (cachedLastUpdated) {
        setLastUpdated(new Date(cachedLastUpdated));
      }
      // Handle dataSource - it's stored as a plain string, not JSON
      if (cachedDataSource && cachedDataSource.trim() !== '' && ['all', 'test', 'goaffpro'].includes(cachedDataSource.trim())) {
        console.log('📦 Loaded cached dataSource:', cachedDataSource);
        setDataSource(cachedDataSource.trim() as 'all' | 'test' | 'goaffpro');
      } else {
        console.log('📦 Invalid or empty cached dataSource, using default "all"');
        setDataSource('all');
        // Clear the corrupted cache value
        localStorage.removeItem(CACHE_KEYS.dataSource);
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
      // If there's an error, reset to defaults
      setDataSource('all');
    }
  };

  // Save data to localStorage
  const cacheData = (type: keyof typeof CACHE_KEYS, data: GoAffProAffiliate[] | GoAffProOrder[] | GoAffProReward[] | GoAffProPayment[] | string) => {
    try {
      // For dataSource, don't JSON.stringify since it's already a string
      const valueToStore = type === 'dataSource' ? data as string : JSON.stringify(data);
      localStorage.setItem(CACHE_KEYS[type], valueToStore);
    } catch (error) {
      console.error('Error caching data:', error);
      // If quota exceeded, try to clear some cache and retry once
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.log('🗑️ localStorage quota exceeded, clearing cache and retrying...');
        try {
          // Clear old cache data but keep dataSource
          localStorage.removeItem(CACHE_KEYS.affiliates);
          localStorage.removeItem(CACHE_KEYS.orders);
          localStorage.removeItem(CACHE_KEYS.rewards);
          localStorage.removeItem(CACHE_KEYS.payments);
          localStorage.removeItem(CACHE_KEYS.lastUpdated);
          
          // Retry the operation
          const valueToStore = type === 'dataSource' ? data as string : JSON.stringify(data);
          localStorage.setItem(CACHE_KEYS[type], valueToStore);
          console.log('✅ Successfully cached after clearing old data');
        } catch (retryError) {
          console.error('❌ Failed to cache even after clearing:', retryError);
        }
      }
    }
  };

  const loadAffiliates = async () => {
    const loadId = Math.random().toString(36).substr(2, 9);
    console.log(`🔍 [${loadId}] DataContext: Loading affiliates...`);
    console.log(`🔍 [${loadId}] Auth state - User: ${user?.email || 'not logged in'}, Admin: ${isAdmin}, Auth loading: ${authLoading}`);
    console.log(`🔍 [${loadId}] Current affiliates count: ${affiliates.length}`);
    
    let query = supabase.from('goaffpro_affiliates').select('*');
    
    if (dataSource !== 'all') {
      console.log(`📊 [${loadId}] Filtering by data_source: ${dataSource}`);
      query = query.eq('data_source', dataSource);
    }

    // Add role-based filtering
    if (!isAdmin && user?.email) {
      console.log(`👤 [${loadId}] Non-admin user - filtering by email: ${user.email}`);
      query = query.eq('email', user.email);
    } else if (!isAdmin) {
      console.log(`🚫 [${loadId}] Non-admin user without email - returning empty data`);
      setAffiliates([]);
      setHasDataAccess(false);
      return;
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error(`❌ [${loadId}] Error loading affiliates:`, error);
      console.log(`🔒 [${loadId}] Preserving existing ${affiliates.length} affiliates due to error`);
      // Don't clear existing data if we hit RLS or other errors
      // Only log the error and keep existing data intact
      if (error.code === '42501' || error.message.includes('row-level security')) {
        console.log(`🔒 [${loadId}] RLS policy preventing data access, keeping existing data`);
        setHasDataAccess(false);
      }
      // Return early without setting state to preserve existing data
      return;
    }
    
    const newCount = data?.length || 0;
    console.log(`✅ [${loadId}] Query successful - received ${newCount} affiliates (Admin: ${isAdmin})`);
    
    // Add warning if we're about to replace good data with empty data
    if (affiliates.length > 0 && newCount === 0) {
      console.warn(`⚠️ [${loadId}] WARNING: About to replace ${affiliates.length} existing affiliates with 0 new affiliates!`);
      console.warn(`⚠️ [${loadId}] This might be due to data source filtering. Current source: ${dataSource}`);
      console.warn(`⚠️ [${loadId}] Query data:`, data);
    }
    
    // Only update state if we have successful data (even if empty array is valid result)
    setAffiliates(data || []);
    setHasDataAccess(true);
    cacheData('affiliates', data || []);
    console.log(`💾 [${loadId}] Updated affiliates state: ${affiliates.length} -> ${newCount}`);
  };

  const loadOrders = async () => {
    const loadId = Math.random().toString(36).substr(2, 9);
    console.log(`🔍 [${loadId}] DataContext: Loading orders...`);
    console.log(`🔍 [${loadId}] Auth state - User: ${user?.email || 'not logged in'}, Admin: ${isAdmin}, Auth loading: ${authLoading}`);
    console.log(`🔍 [${loadId}] Current orders count: ${orders.length}`);
    
    let query = supabase.from('goaffpro_orders').select('*');
    
    if (dataSource !== 'all') {
      console.log(`📊 [${loadId}] Filtering by data_source: ${dataSource}`);
      query = query.eq('data_source', dataSource);
    }

    // Add role-based filtering
    if (!isAdmin && user?.email) {
      console.log(`👤 [${loadId}] Non-admin user - filtering by customer email: ${user.email}`);
      query = query.eq('customer_email', user.email);
    } else if (!isAdmin) {
      console.log(`🚫 [${loadId}] Non-admin user without email - returning empty data`);
      setOrders([]);
      setHasDataAccess(false);
      return;
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error(`❌ [${loadId}] Error loading orders:`, error);
      console.log(`🔒 [${loadId}] Preserving existing ${orders.length} orders due to error`);
      // Don't clear existing data if we hit RLS or other errors
      // Only log the error and keep existing data intact
      if (error.code === '42501' || error.message.includes('row-level security') || error.message.includes('JWT')) {
        console.log(`🔒 [${loadId}] RLS/JWT policy preventing orders access, keeping existing data`);
        setHasDataAccess(false);
      }
      // Return early without setting state to preserve existing data
      return;
    }
    
    const newCount = data?.length || 0;
    console.log(`✅ [${loadId}] Query successful - received ${newCount} orders (Admin: ${isAdmin})`);
    
    // Add warning if we're about to replace good data with empty data
    if (orders.length > 0 && newCount === 0) {
      console.warn(`⚠️ [${loadId}] WARNING: About to replace ${orders.length} existing orders with 0 new orders!`);
      console.warn(`⚠️ [${loadId}] This might be due to data source filtering. Current source: ${dataSource}`);
      console.warn(`⚠️ [${loadId}] Query data:`, data);
    }
    
    // Only update state if we have successful data (even if empty array is valid result)
    setOrders(data || []);
    setHasDataAccess(true);
    cacheData('orders', data || []);
    console.log(`💾 [${loadId}] Updated orders state: ${orders.length} -> ${newCount}`);
  };

  const loadRewards = async () => {
    const loadId = Math.random().toString(36).substr(2, 9);
    console.log(`🔍 [${loadId}] DataContext: Loading rewards...`);
    console.log(`🔍 [${loadId}] Current rewards count: ${rewards.length}`);
    
    let query = supabase.from('goaffpro_rewards').select('*');
    
    if (dataSource !== 'all') {
      console.log(`📊 [${loadId}] Filtering by data_source: ${dataSource}`);
      query = query.eq('data_source', dataSource);
    }

    // Add role-based filtering
    if (!isAdmin && user?.email) {
      console.log(`👤 [${loadId}] Non-admin user - filtering by affiliate_id: ${user.email}`);
      query = query.eq('affiliate_id', user.email);
    } else if (!isAdmin) {
      console.log(`🚫 [${loadId}] Non-admin user without email - returning empty data`);
      setRewards([]);
      setHasDataAccess(false);
      return;
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error(`❌ [${loadId}] Error loading rewards:`, error);
      console.log(`🔒 [${loadId}] Preserving existing ${rewards.length} rewards due to error`);
      // Don't clear existing data if we hit RLS or other errors
      if (error.code === '42501' || error.message.includes('row-level security') || error.message.includes('JWT')) {
        console.log(`🔒 [${loadId}] RLS/JWT policy preventing rewards access, keeping existing data`);
        setHasDataAccess(false);
      }
      // Return early without setting state to preserve existing data
      return;
    }
    
    const newCount = data?.length || 0;
    console.log(`✅ [${loadId}] Query successful - received ${newCount} rewards (Admin: ${isAdmin})`);
    
    // Add warning if we're about to replace good data with empty data
    if (rewards.length > 0 && newCount === 0) {
      console.warn(`⚠️ [${loadId}] WARNING: About to replace ${rewards.length} existing rewards with 0 new rewards!`);
      console.warn(`⚠️ [${loadId}] This might be due to data source filtering. Current source: ${dataSource}`);
    }
    
    // Only update state if we have successful data
    setRewards(data || []);
    setHasDataAccess(true);
    cacheData('rewards', data || []);
    console.log(`💾 [${loadId}] Updated rewards state: ${rewards.length} -> ${newCount}`);
  };

  const loadPayments = async () => {
    const loadId = Math.random().toString(36).substr(2, 9);
    console.log(`🔍 [${loadId}] DataContext: Loading payments...`);
    console.log(`🔍 [${loadId}] Current payments count: ${payments.length}`);
    
    let query = supabase.from('goaffpro_payments').select('*');
    
    if (dataSource !== 'all') {
      console.log(`📊 [${loadId}] Filtering by data_source: ${dataSource}`);
      query = query.eq('data_source', dataSource);
    }

    // Add role-based filtering
    if (!isAdmin && user?.email) {
      console.log(`👤 [${loadId}] Non-admin user - filtering by affiliate_id: ${user.email}`);
      query = query.eq('affiliate_id', user.email);
    } else if (!isAdmin) {
      console.log(`🚫 [${loadId}] Non-admin user without email - returning empty data`);
      setPayments([]);
      setHasDataAccess(false);
      return;
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error(`❌ [${loadId}] Error loading payments:`, error);
      console.log(`🔒 [${loadId}] Preserving existing ${payments.length} payments due to error`);
      // Don't clear existing data if we hit RLS or other errors
      if (error.code === '42501' || error.message.includes('row-level security') || error.message.includes('JWT')) {
        console.log(`🔒 [${loadId}] RLS/JWT policy preventing payments access, keeping existing data`);
        setHasDataAccess(false);
      }
      // Return early without setting state to preserve existing data
      return;
    }
    
    const newCount = data?.length || 0;
    console.log(`✅ [${loadId}] Query successful - received ${newCount} payments (Admin: ${isAdmin})`);
    
    // Add warning if we're about to replace good data with empty data
    if (payments.length > 0 && newCount === 0) {
      console.warn(`⚠️ [${loadId}] WARNING: About to replace ${payments.length} existing payments with 0 new payments!`);
      console.warn(`⚠️ [${loadId}] This might be due to data source filtering. Current source: ${dataSource}`);
    }
    
    // Only update state if we have successful data
    setPayments(data || []);
    setHasDataAccess(true);
    cacheData('payments', data || []);
    console.log(`💾 [${loadId}] Updated payments state: ${payments.length} -> ${newCount}`);
  };

  const refreshData = async () => {
    const requestId = Math.random().toString(36).substr(2, 9);
    console.log(`🔄 [${requestId}] DataContext: Refresh request started`);
    
    // Don't load data if auth is still loading
    if (authLoading) {
      console.log(`🔄 [${requestId}] DataContext: Skipping - auth still loading`);
      return;
    }
    
    // Enhanced debouncing - prevent refreshes within 3 seconds AND if already loading
    const now = new Date();
    if (isLoading) {
      console.log(`🔄 [${requestId}] DataContext: Skipping - already loading data`);
      return;
    }
    
    if (lastRefreshAttempt && (now.getTime() - lastRefreshAttempt.getTime()) < 3000) {
      console.log(`🔄 [${requestId}] DataContext: Skipping - too soon after last attempt (${Math.round((now.getTime() - lastRefreshAttempt.getTime()) / 1000)}s ago)`);
      return;
    }
    
    // Update last refresh attempt timestamp
    setLastRefreshAttempt(now);
    
    // Check if we have valid auth for database access
    if (!user?.email) {
      console.log(`🔄 [${requestId}] DataContext: No valid auth, keeping cached data`);
      return;
    }
    
    console.log(`🔄 [${requestId}] DataContext: Starting data refresh...`);
    console.log(`🔄 [${requestId}] Auth user: ${user.email}`);
    console.log(`🔄 [${requestId}] Data source: ${dataSource}`);
    
    setIsLoading(true);
    try {
      await Promise.all([
        loadAffiliates(),
        loadOrders(),
        loadRewards(),
        loadPayments()
      ]);
      const refreshTime = new Date();
      setLastUpdated(refreshTime);
      cacheData('lastUpdated', refreshTime.toISOString());
      console.log(`✅ [${requestId}] DataContext: Data refresh completed successfully`);
    } catch (error) {
      console.error(`❌ [${requestId}] DataContext: Error refreshing data:`, error);
    } finally {
      setIsLoading(false);
      console.log(`🏁 [${requestId}] DataContext: Refresh finished, isLoading set to false`);
    }
  };

  // Load cached data on mount
  useEffect(() => {
    console.log('📦 DataContext: Loading cached data...');
    loadCachedData();
  }, []);

  // Consolidated effect to handle data loading
  useEffect(() => {
    // Always cache the data source when it changes
    cacheData('dataSource', dataSource);
    
    // ENHANCED SAFETY: Only load data if auth is ready AND we have a user
    // This prevents unnecessary RLS error-triggering queries
    if (!authLoading && user?.email) {
      console.log('🔄 DataContext: Auth ready AND user authenticated, refreshing data...');
      console.log('🔄 Current auth state:', { userEmail: user?.email, authLoading });
      console.log('🔄 Current data source:', dataSource);
      refreshData();
    } else if (!authLoading && !user?.email) {
      console.log('🔄 DataContext: Auth ready but NO USER authenticated - skipping data refresh');
      console.log('🔄 This prevents RLS policy errors when not logged in');
      // Clear loading state since we're not going to load data
      setIsLoading(false);
    } else {
      console.log('🔄 DataContext: Auth still loading, deferring data refresh...');
    }
  }, [dataSource, authLoading, user?.email]); // Also depend on user.email

  return (
    <DataContext.Provider
      value={{
        affiliates,
        orders,
        rewards,
        payments,
        isLoading: isLoading || authLoading, // Show loading if either auth or data is loading
        lastUpdated,
        refreshData,
        setDataSource,
        dataSource,
        hasDataAccess: hasDataAccess
      }}
    >
      {children}
    </DataContext.Provider>
  );
}; 