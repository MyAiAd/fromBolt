import { SupabaseClient, createClient } from '@supabase/supabase-js';

// PayPal API Configuration
const PAYPAL_CONFIG = {
  clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID || 'AX68MUAhhkVZY7xjx13YCIPN-TjRA17LiaUHtP9VqkKbYgFKslOLiAFZharAcEg6ZCOVTDhdyPFwtOCG',
  clientSecret: process.env.REACT_APP_PAYPAL_CLIENT_SECRET || 'EAnfez9ob1zGb1ucOTQsd3QurU3QI_ZPi5XoEGMViEI1uaBXwuiiDxFO6z1-nE0Hoo-Zm3RNQ2OU0mxx',
  environment: process.env.REACT_APP_PAYPAL_ENVIRONMENT || 'sandbox', // 'sandbox' or 'live'
  baseURL: process.env.REACT_APP_PAYPAL_ENVIRONMENT === 'live' 
    ? 'https://api.paypal.com' 
    : 'https://api.sandbox.paypal.com'
};

interface PayoutItem {
  recipient_type: 'EMAIL';
  amount: {
    value: string;
    currency: 'USD';
  };
  receiver: string;
  sender_item_id: string;
  note?: string;
}

interface PayoutRequest {
  sender_batch_header: {
    sender_batch_id: string;
    email_subject?: string;
    email_message?: string;
  };
  items: PayoutItem[];
}

interface PayoutResponse {
  batch_header: {
    payout_batch_id: string;
    batch_status: string;
    sender_batch_header: {
      sender_batch_id: string;
    };
  };
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

interface PayoutStatus {
  batch_header: {
    payout_batch_id: string;
    batch_status: string;
    time_created: string;
    time_completed?: string;
    sender_batch_header: {
      sender_batch_id: string;
      email_subject: string;
    };
    amount: {
      currency: string;
      value: string;
    };
    fees: {
      currency: string;
      value: string;
    };
  };
  items: Array<{
    payout_item_id: string;
    transaction_id?: string;
    transaction_status: string;
    payout_item: {
      recipient_type: string;
      amount: {
        currency: string;
        value: string;
      };
      receiver: string;
      sender_item_id: string;
    };
    payout_item_fee?: {
      currency: string;
      value: string;
    };
    time_processed?: string;
    errors?: any;
  }>;
}

export class PayPalService {
  private supabase: SupabaseClient;
  private serviceRoleClient: SupabaseClient;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    
    // Create a service role client for payment operations that bypass RLS
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

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const auth = btoa(`${PAYPAL_CONFIG.clientId}:${PAYPAL_CONFIG.clientSecret}`);
      
      const response = await fetch(`${PAYPAL_CONFIG.baseURL}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
          'Accept-Language': 'en_US',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        throw new Error(`PayPal authentication failed: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Subtract 1 minute for buffer

      if (!this.accessToken) {
        throw new Error('PayPal did not return an access token');
      }

      return this.accessToken;
    } catch (error) {
      console.error('Error getting PayPal access token:', error);
      throw error;
    }
  }

  async createPayout(affiliateId: string, amount: number, email: string, note?: string): Promise<PayoutResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const batchId = `affiliate_${affiliateId}_${Date.now()}`;

      const payoutRequest: PayoutRequest = {
        sender_batch_header: {
          sender_batch_id: batchId,
          email_subject: 'You have a payout from JennaZ Affiliate Program!',
          email_message: `Congratulations! You've received a commission payout of $${amount.toFixed(2)} from the JennaZ Affiliate Program.`
        },
        items: [{
          recipient_type: 'EMAIL',
          amount: {
            value: amount.toFixed(2),
            currency: 'USD'
          },
          receiver: email,
          sender_item_id: `affiliate_${affiliateId}_${Date.now()}`,
          note: note || `Commission payout for affiliate ${affiliateId}`
        }]
      };

      const response = await fetch(`${PAYPAL_CONFIG.baseURL}/v1/payments/payouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Accept-Language': 'en_US'
        },
        body: JSON.stringify(payoutRequest)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`PayPal payout failed: ${JSON.stringify(errorData)}`);
      }

      const payoutResponse = await response.json();

      // Store payout in database
      await this.recordPayout(affiliateId, amount, email, payoutResponse, batchId);

      return payoutResponse;
    } catch (error) {
      console.error('Error creating PayPal payout:', error);
      throw error;
    }
  }

  async getPayoutStatus(payoutBatchId: string): Promise<PayoutStatus> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${PAYPAL_CONFIG.baseURL}/v1/payments/payouts/${payoutBatchId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`PayPal status check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting PayPal payout status:', error);
      throw error;
    }
  }

  private async recordPayout(
    affiliateId: string, 
    amount: number, 
    email: string, 
    paypalResponse: PayoutResponse,
    batchId: string
  ): Promise<void> {
    try {
      // Extract the actual UUID from the aggregated ID
      const actualUUID = this.extractUUIDFromAggregatedId(affiliateId);
      
      const { error } = await this.serviceRoleClient
        .from('payouts')
        .insert({
          affiliate_id: actualUUID,
          amount: amount,
          commission_ids: [], // This would need to be populated with actual commission IDs
          payment_method: 'paypal',
          payment_email: email,
          payment_details: {
            payout_batch_id: paypalResponse.batch_header.payout_batch_id,
            sender_batch_id: batchId,
            paypal_response: paypalResponse
          },
          status: 'processing',
          transaction_id: paypalResponse.batch_header.payout_batch_id,
          notes: `PayPal payout initiated for ${email}`
        });

      if (error) {
        console.error('Error recording payout in database:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error recording payout:', error);
      throw error;
    }
  }

  async updatePayoutStatus(payoutBatchId: string): Promise<void> {
    try {
      const status = await this.getPayoutStatus(payoutBatchId);
      
      const updateData: any = {
        status: this.mapPayPalStatus(status.batch_header.batch_status),
        payment_gateway_response: status
      };

      if (status.batch_header.time_completed) {
        updateData.completed_date = new Date(status.batch_header.time_completed).toISOString();
      }

      const { error } = await this.serviceRoleClient
        .from('payouts')
        .update(updateData)
        .eq('transaction_id', payoutBatchId);

      if (error) {
        console.error('Error updating payout status:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating payout status:', error);
      throw error;
    }
  }

  private mapPayPalStatus(paypalStatus: string): string {
    switch (paypalStatus.toLowerCase()) {
      case 'pending':
        return 'processing';
      case 'processing':
        return 'processing';
      case 'success':
        return 'completed';
      case 'failed':
        return 'failed';
      case 'canceled':
        return 'cancelled';
      default:
        return 'pending';
    }
  }

  private extractUUIDFromAggregatedId(aggregatedId: string): string {
    // Remove prefixes like 'goaffpro_', 'ghl_', 'mighty_', 'native_'
    const parts = aggregatedId.split('_');
    if (parts.length > 1) {
      return parts.slice(1).join('_'); // Rejoin in case UUID had underscores
    }
    return aggregatedId; // Return as-is if no prefix found
  }

  async getPendingCommissions(affiliateId?: string): Promise<any[]> {
    try {
      let query = this.serviceRoleClient
        .from('multi_level_commissions')
        .select(`
          id,
          earning_affiliate_id,
          commission_amount,
          order_date,
          status,
          affiliate_system_users!multi_level_commissions_earning_affiliate_id_fkey (
            id,
            email,
            first_name,
            last_name
          )
        `)
        .eq('status', 'approved')
        .is('paid_date', null);

      if (affiliateId) {
        // Extract the actual UUID from the aggregated ID
        const actualUUID = this.extractUUIDFromAggregatedId(affiliateId);
        query = query.eq('earning_affiliate_id', actualUUID);
      }

      const { data, error } = await query.order('order_date', { ascending: false });

      if (error) {
        console.error('Error fetching pending commissions:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error getting pending commissions:', error);
      throw error;
    }
  }

  async getPayoutHistory(affiliateId?: string): Promise<any[]> {
    try {
      let query = this.serviceRoleClient
        .from('payouts')
        .select(`
          *,
          affiliate_system_users!payouts_affiliate_id_fkey (
            id,
            email,
            first_name,
            last_name
          )
        `);

      if (affiliateId) {
        // Extract the actual UUID from the aggregated ID
        const actualUUID = this.extractUUIDFromAggregatedId(affiliateId);
        query = query.eq('affiliate_id', actualUUID);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payout history:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error getting payout history:', error);
      throw error;
    }
  }

  async getAffiliateInfo(affiliateId: string): Promise<any> {
    try {
      // Extract the actual UUID from the aggregated ID
      const actualUUID = this.extractUUIDFromAggregatedId(affiliateId);
      
      const { data, error } = await this.serviceRoleClient
        .from('affiliate_system_users')
        .select('id, email, first_name, last_name')
        .eq('id', actualUUID)
        .single();

      if (error) {
        console.error('Error fetching affiliate info:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting affiliate info:', error);
      throw error;
    }
  }
} 