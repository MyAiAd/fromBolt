// Rewardful API Configuration
interface RewardfulConfig {
  apiKey: string;
  baseUrl: string;
}

// Rewardful API Response Types
interface RewardfulAffiliate {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  state?: string; // 'active', 'pending', 'suspended'
  created_at: string;
  referral_link?: string;
  commission_type?: string;
  commission_amount?: number;
  commission_percentage?: number;
  total_referrals?: number;
  total_unpaid_commissions?: number;
  total_paid_commissions?: number;
  payout_email?: string;
  [key: string]: unknown;
}

interface RewardfulReferral {
  id: string;
  affiliate_id: string;
  email?: string;
  amount?: number;
  commission_amount?: number;
  commission_percentage?: number;
  state?: string; // 'pending', 'confirmed', 'cancelled'
  created_at: string;
  confirmed_at?: string;
  stripe_charge_id?: string;
  stripe_customer_id?: string;
  [key: string]: unknown;
}

interface RewardfulCommission {
  id: string;
  affiliate_id: string;
  referral_id: string;
  amount: number;
  percentage?: number;
  commission_type?: string;
  state?: string; // 'pending', 'approved', 'paid', 'cancelled'
  created_at: string;
  paid_at?: string;
  [key: string]: unknown;
}

interface RewardfulPayout {
  id: string;
  affiliate_id: string;
  amount: number;
  state?: string; // 'pending', 'processing', 'completed', 'failed'
  created_at: string;
  paid_at?: string;
  payment_method?: string;
  transaction_id?: string;
  commission_ids?: string[];
  [key: string]: unknown;
}

class RewardfulService {
  private config: RewardfulConfig;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_REWARDFUL_API_KEY || '',
      baseUrl: 'https://api.rewardful.com/v1'
    };

    if (!this.config.apiKey) {
      console.warn('⚠️ Rewardful API key not configured. Set VITE_REWARDFUL_API_KEY environment variable.');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<unknown> {
    if (!this.config.apiKey) {
      throw new Error('Rewardful API key not configured. Please set VITE_REWARDFUL_API_KEY in your environment variables.');
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Rewardful API error (${response.status}):`, errorText);
      throw new Error(`Rewardful API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  // Affiliate methods
  async getAffiliates(page = 1, limit = 100): Promise<RewardfulAffiliate[]> {
    console.log(`Fetching affiliates from Rewardful (page ${page}, limit ${limit})...`);
    const result = await this.makeRequest(`/affiliates?page=${page}&limit=${limit}`) as { 
      data?: RewardfulAffiliate[]; 
      affiliates?: RewardfulAffiliate[];
      pagination?: { total: number; pages: number; current_page: number };
    };
    
    // Handle different response formats
    const affiliates = result?.data || result?.affiliates || [];
    console.log(`Retrieved ${affiliates.length} affiliates from Rewardful`);
    return affiliates;
  }

  async getAllAffiliates(): Promise<RewardfulAffiliate[]> {
    console.log('Fetching all affiliates from Rewardful...');
    const allAffiliates: RewardfulAffiliate[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const affiliates = await this.getAffiliates(page, 100);
      allAffiliates.push(...affiliates);
      
      // If we got less than 100, we're done
      hasMore = affiliates.length === 100;
      page++;
      
      // Safety break to avoid infinite loops
      if (page > 100) {
        console.warn('Reached maximum page limit (100) for affiliate fetching');
        break;
      }
    }

    console.log(`Total affiliates fetched: ${allAffiliates.length}`);
    return allAffiliates;
  }

  async getAffiliate(affiliateId: string): Promise<RewardfulAffiliate | null> {
    try {
      const result = await this.makeRequest(`/affiliates/${affiliateId}`) as { 
        data?: RewardfulAffiliate; 
        affiliate?: RewardfulAffiliate;
      };
      return result?.data || result?.affiliate || null;
    } catch (error) {
      console.error(`Error fetching affiliate ${affiliateId}:`, error);
      return null;
    }
  }

  // Referral methods
  async getReferrals(page = 1, limit = 100): Promise<RewardfulReferral[]> {
    console.log(`Fetching referrals from Rewardful (page ${page}, limit ${limit})...`);
    const result = await this.makeRequest(`/referrals?page=${page}&limit=${limit}`) as { 
      data?: RewardfulReferral[]; 
      referrals?: RewardfulReferral[];
    };
    
    const referrals = result?.data || result?.referrals || [];
    console.log(`Retrieved ${referrals.length} referrals from Rewardful`);
    return referrals;
  }

  async getAllReferrals(): Promise<RewardfulReferral[]> {
    console.log('Fetching all referrals from Rewardful...');
    const allReferrals: RewardfulReferral[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const referrals = await this.getReferrals(page, 100);
      allReferrals.push(...referrals);
      
      hasMore = referrals.length === 100;
      page++;
      
      if (page > 100) {
        console.warn('Reached maximum page limit (100) for referral fetching');
        break;
      }
    }

    console.log(`Total referrals fetched: ${allReferrals.length}`);
    return allReferrals;
  }

  // Commission methods
  async getCommissions(page = 1, limit = 100): Promise<RewardfulCommission[]> {
    console.log(`Fetching commissions from Rewardful (page ${page}, limit ${limit})...`);
    const result = await this.makeRequest(`/commissions?page=${page}&limit=${limit}`) as { 
      data?: RewardfulCommission[]; 
      commissions?: RewardfulCommission[];
    };
    
    const commissions = result?.data || result?.commissions || [];
    console.log(`Retrieved ${commissions.length} commissions from Rewardful`);
    return commissions;
  }

  async getAllCommissions(): Promise<RewardfulCommission[]> {
    console.log('Fetching all commissions from Rewardful...');
    const allCommissions: RewardfulCommission[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const commissions = await this.getCommissions(page, 100);
      allCommissions.push(...commissions);
      
      hasMore = commissions.length === 100;
      page++;
      
      if (page > 100) {
        console.warn('Reached maximum page limit (100) for commission fetching');
        break;
      }
    }

    console.log(`Total commissions fetched: ${allCommissions.length}`);
    return allCommissions;
  }

  // Payout methods
  async getPayouts(page = 1, limit = 100): Promise<RewardfulPayout[]> {
    console.log(`Fetching payouts from Rewardful (page ${page}, limit ${limit})...`);
    const result = await this.makeRequest(`/payouts?page=${page}&limit=${limit}`) as { 
      data?: RewardfulPayout[]; 
      payouts?: RewardfulPayout[];
    };
    
    const payouts = result?.data || result?.payouts || [];
    console.log(`Retrieved ${payouts.length} payouts from Rewardful`);
    return payouts;
  }

  async getAllPayouts(): Promise<RewardfulPayout[]> {
    console.log('Fetching all payouts from Rewardful...');
    const allPayouts: RewardfulPayout[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const payouts = await this.getPayouts(page, 100);
      allPayouts.push(...payouts);
      
      hasMore = payouts.length === 100;
      page++;
      
      if (page > 100) {
        console.warn('Reached maximum page limit (100) for payout fetching');
        break;
      }
    }

    console.log(`Total payouts fetched: ${allPayouts.length}`);
    return allPayouts;
  }

  // Bulk data fetch method
  async fetchAllData(): Promise<{
    affiliates: RewardfulAffiliate[];
    referrals: RewardfulReferral[];
    commissions: RewardfulCommission[];
    payouts: RewardfulPayout[];
  }> {
    try {
      console.log('🔄 Fetching all Rewardful data...');
      
      const [affiliates, referrals, commissions, payouts] = await Promise.all([
        this.getAllAffiliates(),
        this.getAllReferrals(),
        this.getAllCommissions(),
        this.getAllPayouts()
      ]);

      console.log('✅ Successfully fetched all Rewardful data:', {
        affiliates: affiliates.length,
        referrals: referrals.length,
        commissions: commissions.length,
        payouts: payouts.length
      });

      return {
        affiliates,
        referrals,
        commissions,
        payouts
      };
    } catch (error) {
      console.error('❌ Error fetching all Rewardful data:', error);
      throw error;
    }
  }

  // Test connection method
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing Rewardful API connection...');
      await this.getAffiliates(1, 1); // Just fetch 1 affiliate to test
      console.log('✅ Rewardful API connection successful');
      return true;
    } catch (error) {
      console.error('❌ Rewardful API connection failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const rewardfulService = new RewardfulService();
export default RewardfulService;

// Export types for use in other files
export type {
  RewardfulAffiliate,
  RewardfulReferral,
  RewardfulCommission,
  RewardfulPayout,
  RewardfulConfig
}; 