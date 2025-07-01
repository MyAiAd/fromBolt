import { SupabaseClient } from '@supabase/supabase-js';

// First Promoter API Response Types
interface FirstPromoterAffiliate {
  id: number;
  status: 'active' | 'pending' | 'suspended' | 'approved';
  cust_id?: string;
  email: string;
  created_at: string;
  temp_password?: string;
  default_promotion_id?: number;
  pref?: string;
  default_ref_id?: string;
  note?: string;
  parent_promoter_id?: number;
  earnings_balance: {
    cash?: number;
    credits?: number;
    discount_per?: number;
  };
  current_balance: {
    cash?: number;
    credits?: number;
    discount_per?: number;
  };
  paid_balance: {
    cash?: number;
    credits?: number;
    discount_per?: number;
  };
  auth_token: string;
  profile: {
    first_name?: string;
    last_name?: string;
    website?: string;
    company_name?: string;
    phone_number?: string;
    address?: string;
    country?: string;
    paypal_email?: string;
    avatar_url?: string;
    description?: string;
  };
  promotions?: Array<{
    id: number;
    status: string;
    ref_id: string;
    referral_link: string;
    visitors_count: number;
    leads_count: number;
    customers_count: number;
    sales_count: number;
    sales_total: number;
  }>;
}

interface FirstPromoterCommission {
  id: number;
  promoter_id: number;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  order_id?: string;
  order_total?: number;
  customer_email?: string;
}

interface ImportResult {
  success: boolean;
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  recordsUpdated: number;
  errors: string[];
  warnings: string[];
}

export interface FirstPromoterConfig {
  apiKey: string;
  baseUrl?: string; // defaults to 'https://firstpromoter.com/api/v1'
}

export class FirstPromoterService {
  private config: FirstPromoterConfig;
  private supabase: SupabaseClient;
  private serviceRoleClient: SupabaseClient;

  constructor(
    supabase: SupabaseClient,
    serviceRoleClient: SupabaseClient,
    config: FirstPromoterConfig
  ) {
    this.supabase = supabase;
    this.serviceRoleClient = serviceRoleClient;
    this.config = {
      baseUrl: 'https://firstpromoter.com/api/v1',
      ...config
    };
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-API-KEY': this.config.apiKey,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`First Promoter API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing First Promoter API connection...');
      await this.getPromoters(1, 1); // Just fetch 1 promoter to test
      console.log('✅ First Promoter API connection successful');
      return true;
    } catch (error) {
      console.error('❌ First Promoter API connection failed:', error);
      return false;
    }
  }

  // Get promoters with pagination
  async getPromoters(page = 1, limit = 100): Promise<FirstPromoterAffiliate[]> {
    console.log(`📥 Fetching promoters from First Promoter (page ${page}, limit ${limit})...`);
    
    const result = await this.makeRequest(`/promoters?page=${page}&limit=${limit}`);
    
    // Handle different response formats
    const promoters = result?.data || result?.promoters || result || [];
    console.log(`✅ Retrieved ${promoters.length} promoters from First Promoter`);
    return promoters;
  }

  // Get all promoters
  async getAllPromoters(): Promise<FirstPromoterAffiliate[]> {
    console.log('🔄 Fetching ALL promoters from First Promoter...');
    const allPromoters: FirstPromoterAffiliate[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const promoters = await this.getPromoters(page, 100);
        allPromoters.push(...promoters);
        
        hasMore = promoters.length === 100;
        page++;
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Safety break
        if (page > 50) {
          console.log('🛑 Safety break at page 50');
          break;
        }
        
      } catch (error) {
        console.error(`❌ Error fetching page ${page}:`, error);
        break;
      }
    }

    console.log(`✅ Total promoters fetched: ${allPromoters.length}`);
    return allPromoters;
  }

  // Get commissions
  async getCommissions(page = 1, limit = 100): Promise<FirstPromoterCommission[]> {
    console.log(`📥 Fetching commissions from First Promoter (page ${page}, limit ${limit})...`);
    
    const result = await this.makeRequest(`/rewards?page=${page}&limit=${limit}`);
    
    const commissions = result?.data || result?.rewards || result || [];
    console.log(`✅ Retrieved ${commissions.length} commissions from First Promoter`);
    return commissions;
  }

  // Create import log
  private async createImportLog(data: any): Promise<string> {
    const { data: log, error } = await this.serviceRoleClient
      .from('affiliate_import_logs')
      .insert({
        ...data,
        status: 'started'
      })
      .select()
      .single();

    if (error) throw error;
    return log.id;
  }

  // Update import log
  private async updateImportLog(logId: string, data: any): Promise<void> {
    const { error } = await this.serviceRoleClient
      .from('affiliate_import_logs')
      .update({
        ...data,
        completed_at: data.completed_at || new Date().toISOString()
      })
      .eq('id', logId);

    if (error) throw error;
  }

  // Main import method for affiliates
  async importAffiliates(userId: string): Promise<ImportResult> {
    console.log('🚀 Starting First Promoter affiliate import...');
    
    const result: ImportResult = {
      success: false,
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      recordsUpdated: 0,
      errors: [],
      warnings: []
    };

    try {
      // Fetch all promoters
      const promoters = await this.getAllPromoters();
      result.recordsProcessed = promoters.length;

      console.log(`🔄 Processing ${promoters.length} First Promoter affiliates...`);

      // Process each promoter
      for (const promoter of promoters) {
        try {
          // Generate referral code
          const referralCode = promoter.default_ref_id || this.generateReferralCode(promoter);

          // Import into main affiliate system
          const affiliateData = {
            email: promoter.email,
            first_name: promoter.profile?.first_name || null,
            last_name: promoter.profile?.last_name || null,
            phone: promoter.profile?.phone_number || null,
            referral_code: referralCode,
            primary_source: 'first_promoter',
            first_promoter_id: promoter.id.toString(),
            status: promoter.status === 'approved' || promoter.status === 'active' ? 'active' : 'pending',
            signup_date: promoter.created_at ? new Date(promoter.created_at).toISOString() : new Date().toISOString(),
            total_earnings: promoter.earnings_balance?.cash || 0,
            balance: promoter.current_balance?.cash || 0,
            custom_fields: JSON.stringify({
              website: promoter.profile?.website,
              company_name: promoter.profile?.company_name,
              address: promoter.profile?.address,
              country: promoter.profile?.country,
              paypal_email: promoter.profile?.paypal_email,
              note: promoter.note
            })
          };

          const { error: affiliateError } = await this.serviceRoleClient
            .from('affiliate_system_users')
            .upsert([affiliateData], { 
              onConflict: 'email',
              ignoreDuplicates: false 
            });

          if (affiliateError) {
            result.errors.push(`Affiliate system - Promoter ${promoter.id}: ${affiliateError.message}`);
            result.recordsFailed++;
          } else {
            result.recordsSuccessful++;
          }

        } catch (error) {
          result.errors.push(`Promoter ${promoter.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.recordsFailed++;
        }
      }

      result.success = result.recordsFailed === 0;

      console.log('✅ First Promoter affiliate import completed');
      console.log(`📊 Results: ${result.recordsSuccessful}/${result.recordsProcessed} successful`);

      return result;

    } catch (error) {
      result.errors.push(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    }
  }

  // Import commissions
  async importCommissions(userId: string): Promise<ImportResult> {
    console.log('🚀 Starting First Promoter commission import...');
    
    const result: ImportResult = {
      success: false,
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      recordsUpdated: 0,
      errors: [],
      warnings: []
    };

    try {
      // Fetch all commissions
      const commissions = await this.getAllCommissions();
      result.recordsProcessed = commissions.length;

      console.log(`🔄 Processing ${commissions.length} First Promoter commissions...`);

      // Process each commission (implementation depends on your commission structure)
      // This is a placeholder - you'd implement based on your specific needs

      result.success = true;
      return result;

    } catch (error) {
      result.errors.push(`Commission import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    }
  }

  private async getAllCommissions(): Promise<FirstPromoterCommission[]> {
    const allCommissions: FirstPromoterCommission[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const commissions = await this.getCommissions(page, 100);
        allCommissions.push(...commissions);
        
        hasMore = commissions.length === 100;
        page++;
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        if (page > 50) break;
        
      } catch (error) {
        console.error(`Error fetching commissions page ${page}:`, error);
        break;
      }
    }

    return allCommissions;
  }

  private generateReferralCode(promoter: FirstPromoterAffiliate): string {
    // Generate a referral code if none exists
    const name = `${promoter.profile?.first_name || ''}${promoter.profile?.last_name || ''}`.replace(/\s+/g, '');
    const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${name.substr(0, 6).toUpperCase()}${randomSuffix}`;
  }
}

export default FirstPromoterService; 