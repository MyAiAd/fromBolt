interface GoAffProConfig {
  accessToken: string;
  publicToken: string;
  baseUrl: string;
}

interface GoAffProAffiliate {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  phone?: string;
  address?: Record<string, unknown>;
  status?: string;
  signup_date?: string;
  referral_code?: string;
  commission_rate?: number;
  balance?: number;
  total_earnings?: number;
  total_orders?: number;
  tags?: unknown[];
  custom_fields?: Record<string, unknown>;
  [key: string]: unknown;
}

interface GoAffProOrder {
  id: string;
  affiliate_id?: string;
  order_number?: string;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: Record<string, unknown>;
  order_total?: number;
  commission_amount?: number;
  commission_rate?: number;
  status?: string;
  order_date?: string;
  commission_status?: string;
  products?: unknown[];
  shipping_cost?: number;
  shipping_address?: Record<string, unknown>;
  discount_amount?: number;
  tax_amount?: number;
  payment_method?: string;
  currency?: string;
  order_source?: string;
  order_notes?: string;
  tracking_id?: string;
  fulfillment_status?: string;
  customer_id?: string;
  first_time_customer?: boolean;
  coupon_code?: string;
  referral_source?: string;
  [key: string]: unknown;
}

interface GoAffProReward {
  id: string;
  affiliate_id?: string;
  reward_type?: string;
  amount?: number;
  description?: string;
  status?: string;
  date_awarded?: string;
  [key: string]: unknown;
}

interface GoAffProPayment {
  id: string;
  affiliate_id?: string;
  amount?: number;
  payment_method?: string;
  payment_date?: string;
  status?: string;
  transaction_id?: string;
  notes?: string;
  [key: string]: unknown;
}

interface GoAffProCommission {
  id: string;
  affiliate_id?: string;
  order_id?: string;
  commission_amount?: number;
  commission_rate?: number;
  status?: string;
  date_earned?: string;
  date_paid?: string;
  [key: string]: unknown;
}

class GoAffProService {
  private config: GoAffProConfig;

  constructor() {
    this.config = {
      accessToken: import.meta.env.VITE_GOAFFPRO_ACCESS_TOKEN || '',
      publicToken: import.meta.env.VITE_GOAFFPRO_PUBLIC_TOKEN || '',
      baseUrl: 'https://api.goaffpro.com/v1'
    };

    if (!this.config.accessToken || !this.config.publicToken) {
      console.warn('GoAffPro tokens not found in environment variables. Please check your .env file.');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<unknown> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'X-GOAFFPRO-ACCESS-TOKEN': this.config.accessToken,
      'X-GOAFFPRO-PUBLIC-TOKEN': this.config.publicToken,
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    };

    console.log('GoAffPro API Request:', { url, headers: { ...headers, 'X-GOAFFPRO-ACCESS-TOKEN': '[REDACTED]', 'X-GOAFFPRO-PUBLIC-TOKEN': '[REDACTED]' } });

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      console.log('GoAffPro API Response Status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('GoAffPro API Error Response:', errorText);
        throw new Error(`GoAffPro API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: unknown = await response.json();
      console.log('GoAffPro API Response Data:', data);
      return data;
    } catch (error) {
      console.error('GoAffPro API request failed:', error);
      throw error;
    }
  }

  // Affiliate methods
  async getAffiliates(): Promise<GoAffProAffiliate[]> {
    console.log('Fetching affiliates from GoAffPro...');
    const result = await this.makeRequest('/admin/affiliates?fields=id,email,first_name,last_name,name,phone,address,status,signup_date,referral_code,commission_rate,balance,total_earnings,total_orders,tags,custom_fields') as { affiliates?: GoAffProAffiliate[]; total_results?: number };
    return result?.affiliates || [];
  }

  async getAffiliate(id: string): Promise<GoAffProAffiliate> {
    return this.makeRequest(`/admin/affiliates/${id}?fields=id,email,first_name,last_name,name,phone,address,status,signup_date,referral_code,commission_rate,balance,total_earnings,total_orders,tags,custom_fields`) as Promise<GoAffProAffiliate>;
  }

  async searchAffiliates(query: string): Promise<GoAffProAffiliate[]> {
    const result = await this.makeRequest(`/admin/affiliates/search?q=${encodeURIComponent(query)}&fields=id,email,first_name,last_name,name,phone,address,status,signup_date,referral_code,commission_rate,balance,total_earnings,total_orders,tags,custom_fields`) as { affiliates?: GoAffProAffiliate[] };
    return result?.affiliates || [];
  }

  async getAffiliateCommissions(affiliateId: string): Promise<GoAffProCommission[]> {
    const result = await this.makeRequest(`/admin/affiliates/${affiliateId}/commissions?fields=id,affiliate_id,order_id,commission_amount,commission_rate,status,date_earned,date_paid`) as { commissions?: GoAffProCommission[] };
    return result?.commissions || [];
  }

  // Order methods
  async getOrders(): Promise<GoAffProOrder[]> {
    console.log('Fetching orders from GoAffPro...');
    // Include comprehensive field list to capture all available order data
    // Based on GoAffPro documentation and common e-commerce order fields
    const fields = [
      'id', 'affiliate_id', 'order_number', 'customer_email', 'customer_name', 'customer_phone',
      'customer_address', 'customer_id', 'order_total', 'commission_amount', 'commission_rate',
      'status', 'order_date', 'commission_status', 'products', 'shipping_cost', 'shipping_address',
      'discount_amount', 'tax_amount', 'payment_method', 'currency', 'order_source', 'order_notes',
      'tracking_id', 'fulfillment_status', 'first_time_customer', 'coupon_code', 'referral_source',
      'created_at', 'updated_at', 'merchant_id', 'store_id', 'order_tags', 'line_items',
      'billing_address', 'financial_status', 'cancelled_at', 'gateway', 'landing_site',
      'referring_site', 'source_name', 'total_discounts', 'total_line_items_price', 'total_price',
      'total_tax', 'total_weight', 'order_value', 'commission_earned', 'commission_pending'
    ].join(',');
    
    const result = await this.makeRequest(`/admin/orders?fields=${fields}`) as { orders?: GoAffProOrder[] };
    return result?.orders || [];
  }

  async getOrder(id: string): Promise<GoAffProOrder> {
    return this.makeRequest(`/admin/orders/${id}`) as Promise<GoAffProOrder>;
  }

  async getSystemOrders(): Promise<string[]> {
    const result = await this.makeRequest('/admin/orders/system') as { orders?: string[] };
    return result?.orders || [];
  }

  // Reward methods
  async getRewards(): Promise<GoAffProReward[]> {
    console.log('Fetching rewards from GoAffPro...');
    const result = await this.makeRequest('/admin/rewards?fields=id,affiliate_id,reward_type,amount,description,status,date_awarded') as { rewards?: GoAffProReward[] };
    return result?.rewards || [];
  }

  // Payment methods
  async getPayments(): Promise<GoAffProPayment[]> {
    console.log('Fetching payments from GoAffPro...');
    const result = await this.makeRequest('/admin/payments?fields=id,affiliate_id,amount,payment_method,payment_date,status,transaction_id,notes') as { payments?: GoAffProPayment[] };
    return result?.payments || [];
  }

  async getPendingPayments(): Promise<GoAffProPayment[]> {
    const result = await this.makeRequest('/admin/payments/pending?fields=id,affiliate_id,amount,payment_method,payment_date,status,transaction_id,notes') as { payments?: GoAffProPayment[] };
    return result?.payments || [];
  }

  async getPaymentRequests(): Promise<GoAffProPayment[]> {
    const result = await this.makeRequest('/admin/payments/requests?fields=id,affiliate_id,amount,payment_method,payment_date,status,transaction_id,notes') as { payments?: GoAffProPayment[] };
    return result?.payments || [];
  }

  // Commission methods
  async getCommissions(): Promise<GoAffProCommission[]> {
    console.log('Fetching commissions from GoAffPro...');
    const result = await this.makeRequest('/admin/commissions?fields=id,affiliate_id,order_id,commission_amount,commission_rate,status,date_earned,date_paid') as { commissions?: GoAffProCommission[] };
    return result?.commissions || [];
  }

  // Traffic methods
  async getTraffic(): Promise<unknown[]> {
    console.log('Fetching traffic from GoAffPro...');
    const result = await this.makeRequest('/admin/traffic') as { traffic?: unknown[] };
    return result?.traffic || [];
  }

  // Store config methods
  async getStoreConfig(): Promise<unknown> {
    return this.makeRequest('/admin/store/config');
  }

  // Bulk data fetch method
  async fetchAllData(): Promise<{
    affiliates: GoAffProAffiliate[];
    orders: GoAffProOrder[];
    rewards: GoAffProReward[];
    payments: GoAffProPayment[];
    commissions: GoAffProCommission[];
    traffic: unknown[];
  }> {
    try {
      const [affiliates, orders, rewards, payments, commissions, traffic] = await Promise.all([
        this.getAffiliates(),
        this.getOrders(),
        this.getRewards(),
        this.getPayments(),
        this.getCommissions(),
        this.getTraffic()
      ]);

      return {
        affiliates,
        orders,
        rewards,
        payments,
        commissions,
        traffic
      };
    } catch (error) {
      console.error('Error fetching all GoAffPro data:', error);
      throw error;
    }
  }
}

export const goaffproService = new GoAffProService();
export type { 
  GoAffProAffiliate, 
  GoAffProOrder, 
  GoAffProReward, 
  GoAffProPayment, 
  GoAffProCommission 
};