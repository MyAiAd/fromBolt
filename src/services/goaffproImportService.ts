import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { goaffproService } from './goaffproService';

interface ImportResult {
  success: boolean;
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  errors: string[];
}

interface ImportLog {
  import_type: string;
  source: string;
  status: 'started' | 'completed' | 'failed';
  records_processed: number;
  records_successful: number;
  records_failed: number;
  error_details?: Record<string, unknown>;
  started_by: string;
}

class GoAffProImportService {
  private supabase: SupabaseClient;
  private serviceRoleClient: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    
    // Create a service role client for import operations that bypass RLS
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
    
    this.serviceRoleClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  private async createImportLog(log: Partial<ImportLog>): Promise<string> {
    // Ensure we have a valid user ID, fallback to admin user if needed
    let validUserId = log.started_by;
    
    if (!validUserId) {
      console.warn('No user ID provided for import log, using admin fallback');
      validUserId = '00000000-0000-0000-0000-000000000001'; // admin user
    } else {
      // Verify the user exists in the database
      const { data: userExists } = await this.serviceRoleClient
        .from('users')
        .select('id')
        .eq('id', validUserId)
        .single();
      
      if (!userExists) {
        console.warn(`User ID ${validUserId} not found in database, using admin fallback`);
        validUserId = '00000000-0000-0000-0000-000000000001'; // admin user
      }
    }

    const { data, error } = await this.serviceRoleClient
      .from('data_import_logs')
      .insert([{ ...log, started_by: validUserId }])
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  private async updateImportLog(id: string, updates: Partial<ImportLog>): Promise<void> {
    const { error } = await this.serviceRoleClient
      .from('data_import_logs')
      .update({ ...updates, completed_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }

  async importAffiliates(userId: string): Promise<ImportResult> {
    const logId = await this.createImportLog({
      import_type: 'affiliates',
      source: 'goaffpro',
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
      const affiliates = await goaffproService.getAffiliates();
      console.log('Raw affiliates data:', affiliates);
      
      result.recordsProcessed = affiliates.length;

      if (affiliates.length === 0) {
        result.success = true;
        result.errors.push('No affiliates found in GoAffPro');
        
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

          // Parse name from GoAffPro's 'name' field if first_name/last_name are empty
          let firstName = affiliate.first_name || null;
          let lastName = affiliate.last_name || null;
          
          // If first_name and last_name are empty but name field exists, parse it
          if ((!firstName || firstName === '') && (!lastName || lastName === '') && affiliate.name) {
            const nameParts = affiliate.name.trim().split(' ');
            if (nameParts.length >= 2) {
              firstName = nameParts[0];
              lastName = nameParts.slice(1).join(' '); // Join remaining parts as last name
            } else if (nameParts.length === 1) {
              firstName = nameParts[0];
              lastName = null;
            }
          }

          const affiliateData = {
            goaffpro_id: affiliate.id ? String(affiliate.id) : `empty_${Date.now()}_${Math.random()}`,
            email: affiliate.email || 'unknown@example.com',
            first_name: firstName,
            last_name: lastName,
            phone: affiliate.phone || null,
            address: affiliate.address || null,
            status: affiliate.status || null,
            signup_date: affiliate.signup_date ? new Date(affiliate.signup_date).toISOString() : null,
            referral_code: affiliate.referral_code || null,
            commission_rate: affiliate.commission_rate || null,
            balance: affiliate.balance || 0,
            total_earnings: affiliate.total_earnings || 0,
            total_orders: affiliate.total_orders || 0,
            tags: affiliate.tags || null,
            custom_fields: affiliate.custom_fields || null,
            raw_data: affiliate,
            data_source: 'goaffpro'
          };

          console.log('Inserting affiliate data:', affiliateData);

          const { error } = await this.serviceRoleClient
            .from('goaffpro_affiliates')
            .upsert([affiliateData], { onConflict: 'goaffpro_id' });

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
      
      // Provide helpful error messages for common issues
      let errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        errorMessage = 'GoAffPro API access denied. Please check your API tokens or contact support.';
      } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        errorMessage = 'GoAffPro API authentication failed. Please verify your API tokens.';
      } else if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
        errorMessage = 'GoAffPro API rate limit exceeded. Please try again later.';
      } else if (errorMessage.includes('timeout') || errorMessage.includes('ECONNRESET')) {
        errorMessage = 'GoAffPro API timeout. Please check your internet connection and try again.';
      }
      
      result.errors.push(errorMessage);
      await this.updateImportLog(logId, {
        status: 'failed',
        records_processed: result.recordsProcessed,
        records_successful: result.recordsSuccessful,
        records_failed: result.recordsFailed,
        error_details: { errors: result.errors }
      });
      
      // Don't throw the error, return the result with error details
      return result;
    }
  }

  async importOrders(userId: string): Promise<ImportResult> {
    const logId = await this.createImportLog({
      import_type: 'orders',
      source: 'goaffpro',
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
      const orders = await goaffproService.getOrders();
      result.recordsProcessed = orders.length;

      // Get affiliate mapping
      const { data: affiliateMapping } = await this.serviceRoleClient
        .from('goaffpro_affiliates')
        .select('id, goaffpro_id');

      const affiliateMap = new Map(
        affiliateMapping?.map(a => [a.goaffpro_id, a.id]) || []
      );

      for (const order of orders) {
        try {
          // Extract customer name from multiple sources with fallbacks
          let customerName = order.customer_name || null;
          if (!customerName && order.shipping_address && typeof order.shipping_address === 'object') {
            const shippingAddr = order.shipping_address as Record<string, unknown>;
            if (typeof shippingAddr.name === 'string') {
              customerName = shippingAddr.name;
            } else {
              const firstName = typeof shippingAddr.first_name === 'string' ? shippingAddr.first_name : '';
              const lastName = typeof shippingAddr.last_name === 'string' ? shippingAddr.last_name : '';
              if (firstName || lastName) {
                customerName = `${firstName} ${lastName}`.trim();
              }
            }
          }

          // Calculate order total from line_items if not directly available
          let orderTotal = order.order_total || null;
          if (!orderTotal && order.line_items && Array.isArray(order.line_items)) {
            orderTotal = order.line_items.reduce((total, item) => {
              const itemTotal = parseFloat(item.total_price || item.price || 0);
              return total + itemTotal;
            }, 0);
          }

          // Extract commission from line_items if not directly available
          let commissionAmount = order.commission_amount || null;
          if (!commissionAmount && order.line_items && Array.isArray(order.line_items)) {
            commissionAmount = order.line_items.reduce((total, item) => {
              const itemCommission = parseFloat(item.commission || 0);
              return total + itemCommission;
            }, 0);
          }

          const orderData = {
            goaffpro_order_id: order.id ? String(order.id) : null,
            goaffpro_affiliate_id: order.affiliate_id ? String(order.affiliate_id) : null,
            affiliate_id: order.affiliate_id ? affiliateMap.get(String(order.affiliate_id)) || null : null,
            order_number: order.order_number || null,
            customer_email: order.customer_email || null,
            customer_name: customerName,
            order_total: orderTotal,
            commission_amount: commissionAmount,
            commission_rate: order.commission_rate || null,
            status: order.status || null,
            order_date: order.order_date ? new Date(order.order_date).toISOString() : null,
            commission_status: order.commission_status || null,
            products: order.products || order.line_items || null,
            raw_data: order,
            data_source: 'goaffpro'
          };

          const { error } = await this.serviceRoleClient
            .from('goaffpro_orders')
            .upsert([orderData], { onConflict: 'goaffpro_order_id' });

          if (error) {
            result.errors.push(`Order ${order.id}: ${error.message}`);
            result.recordsFailed++;
          } else {
            result.recordsSuccessful++;
          }
        } catch (error) {
          result.errors.push(`Order ${order.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  async importRewards(userId: string): Promise<ImportResult> {
    const logId = await this.createImportLog({
      import_type: 'rewards',
      source: 'goaffpro',
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
      const rewards = await goaffproService.getRewards();
      result.recordsProcessed = rewards.length;

      // Get affiliate mapping
      const { data: affiliateMapping } = await this.serviceRoleClient
        .from('goaffpro_affiliates')
        .select('id, goaffpro_id');

      const affiliateMap = new Map(
        affiliateMapping?.map(a => [a.goaffpro_id, a.id]) || []
      );

      for (const reward of rewards) {
        try {
          const rewardData = {
            goaffpro_reward_id: reward.id ? String(reward.id) : null,
            goaffpro_affiliate_id: reward.affiliate_id ? String(reward.affiliate_id) : null,
            affiliate_id: reward.affiliate_id ? affiliateMap.get(String(reward.affiliate_id)) || null : null,
            reward_type: reward.reward_type || null,
            amount: reward.amount || null,
            description: reward.description || null,
            status: reward.status || null,
            date_awarded: reward.date_awarded ? new Date(reward.date_awarded).toISOString() : null,
            raw_data: reward,
            data_source: 'goaffpro'
          };

          const { error } = await this.serviceRoleClient
            .from('goaffpro_rewards')
            .upsert([rewardData], { onConflict: 'goaffpro_reward_id' });

          if (error) {
            result.errors.push(`Reward ${reward.id}: ${error.message}`);
            result.recordsFailed++;
          } else {
            result.recordsSuccessful++;
          }
        } catch (error) {
          result.errors.push(`Reward ${reward.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  async importPayments(userId: string): Promise<ImportResult> {
    const logId = await this.createImportLog({
      import_type: 'payments',
      source: 'goaffpro',
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
      const payments = await goaffproService.getPayments();
      result.recordsProcessed = payments.length;

      // Get affiliate mapping
      const { data: affiliateMapping } = await this.serviceRoleClient
        .from('goaffpro_affiliates')
        .select('id, goaffpro_id');

      const affiliateMap = new Map(
        affiliateMapping?.map(a => [a.goaffpro_id, a.id]) || []
      );

      for (const payment of payments) {
        try {
          const paymentData = {
            goaffpro_payment_id: payment.id ? String(payment.id) : null,
            goaffpro_affiliate_id: payment.affiliate_id ? String(payment.affiliate_id) : null,
            affiliate_id: payment.affiliate_id ? affiliateMap.get(String(payment.affiliate_id)) || null : null,
            amount: payment.amount || null,
            payment_method: payment.payment_method || null,
            payment_date: payment.payment_date ? new Date(payment.payment_date).toISOString() : null,
            status: payment.status || null,
            transaction_id: payment.transaction_id || null,
            notes: payment.notes || null,
            raw_data: payment,
            data_source: 'goaffpro'
          };

          const { error } = await this.serviceRoleClient
            .from('goaffpro_payments')
            .upsert([paymentData], { onConflict: 'goaffpro_payment_id' });

          if (error) {
            result.errors.push(`Payment ${payment.id}: ${error.message}`);
            result.recordsFailed++;
          } else {
            result.recordsSuccessful++;
          }
        } catch (error) {
          result.errors.push(`Payment ${payment.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    orders: ImportResult;
    rewards: ImportResult;
    payments: ImportResult;
  }> {
    const results = {
      affiliates: await this.importAffiliates(userId),
      orders: await this.importOrders(userId),
      rewards: await this.importRewards(userId),
      payments: await this.importPayments(userId)
    };

    return results;
  }

  async getImportLogs(): Promise<ImportLog[]> {
    const { data, error } = await this.supabase
      .from('data_import_logs')
      .select('*')
      .order('started_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async deleteTestData(): Promise<void> {
    const tables = [
      'users',
      'affiliates', 
      'transactions',
      'commissions',
      'clicks',
      'shopify_orders',
      'shopify_products'
    ];

    for (const table of tables) {
      const { error } = await this.supabase
        .from(table)
        .delete()
        .eq('data_source', 'test');

      if (error) {
        console.error(`Error deleting test data from ${table}:`, error);
        throw error;
      }
    }
  }
}

export { GoAffProImportService };
export type { ImportResult, ImportLog }; 