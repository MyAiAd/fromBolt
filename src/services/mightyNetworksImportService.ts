import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { rewardfulService } from './rewardfulService';

interface ImportResult {
  success: boolean;
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  errors: string[];
}

class MightyNetworksImportService {
  private supabase: SupabaseClient;
  private serviceRoleClient: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
    
    // Create service role client for bypassing RLS
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';
    
    this.serviceRoleClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  private async createImportLog(logData: {
    import_type: string;
    source: string;
    status: string;
    started_by: string;
  }) {
    const { data, error } = await this.serviceRoleClient
      .from('mightynetworks_import_logs')
      .insert([logData])
      .select('id')
      .single();

    if (error) {
      console.error('Error creating import log:', error);
      throw error;
    }

    return data.id;
  }

  private async updateImportLog(logId: string, updates: {
    status?: string;
    completed_at?: string;
    records_processed?: number;
    records_successful?: number;
    records_failed?: number;
    error_details?: Record<string, unknown>;
  }) {
    const updateData = {
      ...updates,
      completed_at: updates.completed_at || new Date().toISOString()
    };

    const { error } = await this.serviceRoleClient
      .from('mightynetworks_import_logs')
      .update(updateData)
      .eq('id', logId);

    if (error) {
      console.error('Error updating import log:', error);
    }
  }

  async importAffiliates(userId: string): Promise<ImportResult> {
    const logId = await this.createImportLog({
      import_type: 'affiliates',
      source: 'mightynetworks',
      status: 'started',
      started_by: userId
    });

    const result: ImportResult = {
      success: false,
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      errors: []
    };

    try {
      const affiliates = await rewardfulService.getAllAffiliates();
      console.log('Raw affiliates data from Rewardful:', affiliates);
      
      result.recordsProcessed = affiliates.length;

      if (affiliates.length === 0) {
        result.success = true;
        result.errors.push('No affiliates found in Rewardful');
        
        await this.updateImportLog(logId, {
          status: 'completed',
          records_processed: result.recordsProcessed,
          records_successful: result.recordsSuccessful,
          records_failed: result.recordsFailed,
          error_details: result.errors.length > 0 ? { errors: result.errors } : undefined
        });

        return result;
      }

      for (const affiliate of affiliates) {
        try {
          // Skip empty affiliate objects
          if (!affiliate.id && !affiliate.email) {
            console.log('Skipping empty affiliate object:', affiliate);
            result.recordsFailed++;
            result.errors.push('Skipped empty affiliate object');
            continue;
          }

          const affiliateData = {
            rewardful_affiliate_id: affiliate.id ? String(affiliate.id) : `empty_${Date.now()}_${Math.random()}`,
            email: affiliate.email || 'unknown@example.com',
            first_name: affiliate.first_name || null,
            last_name: affiliate.last_name || null,
            name: affiliate.first_name && affiliate.last_name 
              ? `${affiliate.first_name} ${affiliate.last_name}`.trim()
              : affiliate.first_name || affiliate.last_name || null,
            status: affiliate.state || null,
            signup_date: affiliate.created_at ? new Date(affiliate.created_at).toISOString() : null,
            referral_code: affiliate.referral_link || null,
            commission_rate: affiliate.commission_percentage ? affiliate.commission_percentage / 100 : null,
            balance: 0, // Will be calculated from commissions
            total_earnings: affiliate.total_paid_commissions || 0,
            total_referrals: affiliate.total_referrals || 0,
            total_commissions: (affiliate.total_paid_commissions || 0) + (affiliate.total_unpaid_commissions || 0),
            payout_email: affiliate.payout_email || affiliate.email,
            raw_data: affiliate,
            data_source: 'mightynetworks'
          };

          console.log('Inserting affiliate data:', affiliateData);

          const { error } = await this.serviceRoleClient
            .from('mightynetworks_affiliates')
            .upsert([affiliateData], { onConflict: 'rewardful_affiliate_id' });

          if (error) {
            console.error('Database error for affiliate:', error);
            result.errors.push(`Affiliate ${affiliate.id}: ${error.message}`);
            result.recordsFailed++;
          } else {
            result.recordsSuccessful++;
          }
        } catch (error) {
          console.error('Processing error for affiliate:', error);
          result.errors.push(`Affiliate ${affiliate.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.recordsFailed++;
        }
      }

      result.success = result.recordsFailed === 0;

      await this.updateImportLog(logId, {
        status: result.success ? 'completed' : 'failed',
        records_processed: result.recordsProcessed,
        records_successful: result.recordsSuccessful,
        records_failed: result.recordsFailed,
        error_details: result.errors.length > 0 ? { errors: result.errors } : undefined
      });

      return result;
    } catch (error) {
      console.error('Import affiliates error:', error);
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      await this.updateImportLog(logId, {
        status: 'failed',
        error_details: { errors: result.errors }
      });
      throw error;
    }
  }

  async importReferrals(userId: string): Promise<ImportResult> {
    const logId = await this.createImportLog({
      import_type: 'referrals',
      source: 'mightynetworks',
      status: 'started',
      started_by: userId
    });

    const result: ImportResult = {
      success: false,
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      errors: []
    };

    try {
      const referrals = await rewardfulService.getAllReferrals();
      result.recordsProcessed = referrals.length;

      // Get affiliate mapping
      const { data: affiliateMapping } = await this.serviceRoleClient
        .from('mightynetworks_affiliates')
        .select('id, rewardful_affiliate_id');

      const affiliateMap = new Map(
        affiliateMapping?.map(a => [a.rewardful_affiliate_id, a.id]) || []
      );

      for (const referral of referrals) {
        try {
          const referralData = {
            rewardful_referral_id: referral.id ? String(referral.id) : null,
            rewardful_affiliate_id: referral.affiliate_id ? String(referral.affiliate_id) : null,
            affiliate_id: referral.affiliate_id ? affiliateMap.get(String(referral.affiliate_id)) || null : null,
            customer_email: referral.email || null,
            order_total: referral.amount || null,
            commission_amount: referral.commission_amount || null,
            commission_rate: referral.commission_percentage ? referral.commission_percentage / 100 : null,
            status: referral.state || null,
            referral_date: referral.created_at ? new Date(referral.created_at).toISOString() : null,
            conversion_date: referral.confirmed_at ? new Date(referral.confirmed_at).toISOString() : null,
            stripe_charge_id: referral.stripe_charge_id || null,
            stripe_customer_id: referral.stripe_customer_id || null,
            raw_data: referral,
            data_source: 'mightynetworks'
          };

          const { error } = await this.serviceRoleClient
            .from('mightynetworks_referrals')
            .upsert([referralData], { onConflict: 'rewardful_referral_id' });

          if (error) {
            result.errors.push(`Referral ${referral.id}: ${error.message}`);
            result.recordsFailed++;
          } else {
            result.recordsSuccessful++;
          }
        } catch (error) {
          result.errors.push(`Referral ${referral.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.recordsFailed++;
        }
      }

      result.success = result.recordsFailed === 0;

      await this.updateImportLog(logId, {
        status: result.success ? 'completed' : 'failed',
        records_processed: result.recordsProcessed,
        records_successful: result.recordsSuccessful,
        records_failed: result.recordsFailed,
        error_details: result.errors.length > 0 ? { errors: result.errors } : undefined
      });

      return result;
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      await this.updateImportLog(logId, {
        status: 'failed',
        error_details: { errors: result.errors }
      });
      throw error;
    }
  }

  async importCommissions(userId: string): Promise<ImportResult> {
    const logId = await this.createImportLog({
      import_type: 'commissions',
      source: 'mightynetworks',
      status: 'started',
      started_by: userId
    });

    const result: ImportResult = {
      success: false,
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      errors: []
    };

    try {
      const commissions = await rewardfulService.getAllCommissions();
      result.recordsProcessed = commissions.length;

      // Get affiliate and referral mappings
      const { data: affiliateMapping } = await this.serviceRoleClient
        .from('mightynetworks_affiliates')
        .select('id, rewardful_affiliate_id');

      const { data: referralMapping } = await this.serviceRoleClient
        .from('mightynetworks_referrals')
        .select('id, rewardful_referral_id');

      const affiliateMap = new Map(
        affiliateMapping?.map(a => [a.rewardful_affiliate_id, a.id]) || []
      );

      const referralMap = new Map(
        referralMapping?.map(r => [r.rewardful_referral_id, r.id]) || []
      );

      for (const commission of commissions) {
        try {
          const commissionData = {
            rewardful_commission_id: commission.id ? String(commission.id) : null,
            rewardful_affiliate_id: commission.affiliate_id ? String(commission.affiliate_id) : null,
            rewardful_referral_id: commission.referral_id ? String(commission.referral_id) : null,
            affiliate_id: commission.affiliate_id ? affiliateMap.get(String(commission.affiliate_id)) || null : null,
            referral_id: commission.referral_id ? referralMap.get(String(commission.referral_id)) || null : null,
            commission_amount: commission.amount || null,
            commission_rate: commission.percentage ? commission.percentage / 100 : null,
            commission_type: commission.commission_type || 'percentage',
            status: commission.state || null,
            date_earned: commission.created_at ? new Date(commission.created_at).toISOString() : null,
            date_paid: commission.paid_at ? new Date(commission.paid_at).toISOString() : null,
            raw_data: commission,
            data_source: 'mightynetworks'
          };

          const { error } = await this.serviceRoleClient
            .from('mightynetworks_commissions')
            .upsert([commissionData], { onConflict: 'rewardful_commission_id' });

          if (error) {
            result.errors.push(`Commission ${commission.id}: ${error.message}`);
            result.recordsFailed++;
          } else {
            result.recordsSuccessful++;
          }
        } catch (error) {
          result.errors.push(`Commission ${commission.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.recordsFailed++;
        }
      }

      result.success = result.recordsFailed === 0;

      await this.updateImportLog(logId, {
        status: result.success ? 'completed' : 'failed',
        records_processed: result.recordsProcessed,
        records_successful: result.recordsSuccessful,
        records_failed: result.recordsFailed,
        error_details: result.errors.length > 0 ? { errors: result.errors } : undefined
      });

      return result;
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      await this.updateImportLog(logId, {
        status: 'failed',
        error_details: { errors: result.errors }
      });
      throw error;
    }
  }

  async importPayouts(userId: string): Promise<ImportResult> {
    const logId = await this.createImportLog({
      import_type: 'payouts',
      source: 'mightynetworks',
      status: 'started',
      started_by: userId
    });

    const result: ImportResult = {
      success: false,
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      errors: []
    };

    try {
      const payouts = await rewardfulService.getAllPayouts();
      result.recordsProcessed = payouts.length;

      // Get affiliate mapping
      const { data: affiliateMapping } = await this.serviceRoleClient
        .from('mightynetworks_affiliates')
        .select('id, rewardful_affiliate_id');

      const affiliateMap = new Map(
        affiliateMapping?.map(a => [a.rewardful_affiliate_id, a.id]) || []
      );

      for (const payout of payouts) {
        try {
          const payoutData = {
            rewardful_payout_id: payout.id ? String(payout.id) : null,
            rewardful_affiliate_id: payout.affiliate_id ? String(payout.affiliate_id) : null,
            affiliate_id: payout.affiliate_id ? affiliateMap.get(String(payout.affiliate_id)) || null : null,
            amount: payout.amount || null,
            payment_method: payout.payment_method || null,
            payment_date: payout.paid_at ? new Date(payout.paid_at).toISOString() : null,
            status: payout.state || null,
            transaction_id: payout.transaction_id || null,
            commission_ids: payout.commission_ids || null,
            raw_data: payout,
            data_source: 'mightynetworks'
          };

          const { error } = await this.serviceRoleClient
            .from('mightynetworks_payouts')
            .upsert([payoutData], { onConflict: 'rewardful_payout_id' });

          if (error) {
            result.errors.push(`Payout ${payout.id}: ${error.message}`);
            result.recordsFailed++;
          } else {
            result.recordsSuccessful++;
          }
        } catch (error) {
          result.errors.push(`Payout ${payout.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.recordsFailed++;
        }
      }

      result.success = result.recordsFailed === 0;

      await this.updateImportLog(logId, {
        status: result.success ? 'completed' : 'failed',
        records_processed: result.recordsProcessed,
        records_successful: result.recordsSuccessful,
        records_failed: result.recordsFailed,
        error_details: result.errors.length > 0 ? { errors: result.errors } : undefined
      });

      return result;
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      await this.updateImportLog(logId, {
        status: 'failed',
        error_details: { errors: result.errors }
      });
      throw error;
    }
  }

  async importAllData(userId: string): Promise<{
    affiliates: ImportResult;
    referrals: ImportResult;
    commissions: ImportResult;
    payouts: ImportResult;
  }> {
    const results = {
      affiliates: await this.importAffiliates(userId),
      referrals: await this.importReferrals(userId),
      commissions: await this.importCommissions(userId),
      payouts: await this.importPayouts(userId)
    };

    return results;
  }

  // Test connection method
  async testConnection(): Promise<boolean> {
    try {
      return await rewardfulService.testConnection();
    } catch (error) {
      console.error('MightyNetworks import service connection test failed:', error);
      return false;
    }
  }
}

export default MightyNetworksImportService;
export type { ImportResult }; 