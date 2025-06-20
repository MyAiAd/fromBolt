import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoAffProAPIResponse {
  data: {
    affiliates?: any[];
    orders?: any[];
    rewards?: any[];
    payments?: any[];
  };
  success: boolean;
  message?: string;
}

interface SyncRequest {
  types?: string[]; // ['affiliates', 'orders', 'rewards', 'payments']
  force?: boolean; // Force sync even if recently synced
  apiKey?: string; // Optional API key override
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get environment variables for GoAffPro API
    const goaffproAccessToken = Deno.env.get('GOAFFPRO_ACCESS_TOKEN') || Deno.env.get('VITE_GOAFFPRO_ACCESS_TOKEN');
    const goaffproPublicToken = Deno.env.get('GOAFFPRO_PUBLIC_TOKEN') || Deno.env.get('VITE_GOAFFPRO_PUBLIC_TOKEN');
    const goaffproBaseUrl = Deno.env.get('GOAFFPRO_BASE_URL') || 'https://api.goaffpro.com/v1';

    if (!goaffproAccessToken || !goaffproPublicToken) {
      throw new Error('GOAFFPRO_ACCESS_TOKEN and GOAFFPRO_PUBLIC_TOKEN environment variables not set');
    }

    // Parse request body
    const body = req.method === 'POST' ? await req.json() : {};
    const { types = ['affiliates', 'orders', 'rewards', 'payments'], force = false, apiKey }: SyncRequest = body;

    console.log(`🔄 Auto-sync started for types: ${types.join(', ')}`);

    // Check if we need to sync (avoid too frequent syncs unless forced)
    if (!force) {
      const { data: lastSync } = await supabaseClient
        .from('data_sync_logs')
        .select('started_at')
        .eq('source', 'goaffpro')
        .eq('sync_type', 'scheduled')
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      if (lastSync && lastSync.started_at) {
        const lastSyncTime = new Date(lastSync.started_at);
        const now = new Date();
        const timeDiff = now.getTime() - lastSyncTime.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff < 2) {
          console.log(`⏰ Skipping sync - last sync was ${Math.round(hoursDiff * 60)} minutes ago`);
          return new Response(
            JSON.stringify({
              success: true,
              message: `Sync skipped - last sync was ${Math.round(hoursDiff * 60)} minutes ago`,
              lastSync: lastSync.started_at
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      }
    }

    // Create sync log entry
    const { data: syncLog, error: logError } = await supabaseClient
      .from('data_sync_logs')
      .insert({
        sync_type: 'scheduled',
        source: 'goaffpro',
        status: 'started',
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (logError) throw logError;
    const logId = syncLog.id;

    let totalProcessed = 0;
    let totalSuccessful = 0;
    let totalFailed = 0;
    const errors: string[] = [];

    // Function to make GoAffPro API calls
    const makeGoAffProRequest = async (endpoint: string) => {
      const response = await fetch(`${goaffproBaseUrl}${endpoint}`, {
        headers: {
          'X-GOAFFPRO-ACCESS-TOKEN': goaffproAccessToken,
          'X-GOAFFPRO-PUBLIC-TOKEN': goaffproPublicToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GoAffPro API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    };

    // Sync each requested type
    for (const type of types) {
      try {
        console.log(`📊 Syncing ${type}...`);
        
        let endpoint = '';
        let tableName = '';
        
        switch (type) {
          case 'affiliates':
            endpoint = '/admin/affiliates?fields=id,email,first_name,last_name,phone,address,status,signup_date,referral_code,commission_rate,balance,total_earnings,total_orders,tags,custom_fields';
            tableName = 'goaffpro_affiliates';
            break;
          case 'orders':
            endpoint = '/admin/orders?fields=id,affiliate_id,order_number,customer_email,customer_name,order_total,commission_amount,commission_rate,status,order_date,commission_status,products';
            tableName = 'goaffpro_orders';
            break;
          case 'rewards':
            endpoint = '/admin/rewards?fields=id,affiliate_id,reward_type,amount,description,status,date_awarded';
            tableName = 'goaffpro_rewards';
            break;
          case 'payments':
            endpoint = '/admin/payments?fields=id,affiliate_id,amount,payment_method,payment_date,status,transaction_id,notes';
            tableName = 'goaffpro_payments';
            break;
          default:
            console.warn(`⚠️ Unknown sync type: ${type}`);
            continue;
        }

        // Fetch data from GoAffPro
        const apiData = await makeGoAffProRequest(endpoint);
        const records = Array.isArray(apiData) ? apiData : apiData.data || [];
        
        console.log(`📥 Fetched ${records.length} ${type} from GoAffPro`);
        totalProcessed += records.length;

        // Process and upsert records
        for (const record of records) {
          try {
            // Transform data based on type
            let transformedRecord;
            
            switch (type) {
              case 'affiliates':
                transformedRecord = {
                  goaffpro_id: String(record.id),
                  email: record.email,
                  first_name: record.first_name,
                  last_name: record.last_name,
                  phone: record.phone,
                  status: record.status,
                  signup_date: record.signup_date ? new Date(record.signup_date).toISOString() : null,
                  referral_code: record.referral_code,
                  commission_rate: record.commission_rate,
                  balance: record.balance || 0,
                  total_earnings: record.total_earnings || 0,
                  total_orders: record.total_orders || 0,
                  raw_data: record,
                  data_source: 'goaffpro',
                  last_synced: new Date().toISOString()
                };
                break;
              
              case 'orders':
                transformedRecord = {
                  goaffpro_id: String(record.id),
                  goaffpro_order_id: record.order_id,
                  goaffpro_affiliate_id: record.affiliate_id,
                  customer_name: record.customer_name,
                  customer_email: record.customer_email,
                  order_value: record.order_value || record.order_total,
                  commission: record.commission || record.commission_amount,
                  status: record.status,
                  order_date: record.order_date ? new Date(record.order_date).toISOString() : null,
                  products: record.products || record.line_items,
                  raw_data: record,
                  data_source: 'goaffpro',
                  last_synced: new Date().toISOString()
                };
                break;
              
              case 'rewards':
                transformedRecord = {
                  goaffpro_id: String(record.id),
                  goaffpro_reward_id: record.reward_id,
                  affiliate_id: record.affiliate_id,
                  reward_amount: record.amount || record.reward_amount,
                  reward_type: record.type || record.reward_type,
                  status: record.status,
                  reward_date: record.date || record.reward_date ? new Date(record.date || record.reward_date).toISOString() : null,
                  description: record.description,
                  raw_data: record,
                  data_source: 'goaffpro',
                  last_synced: new Date().toISOString()
                };
                break;
              
              case 'payments':
                transformedRecord = {
                  goaffpro_id: String(record.id),
                  goaffpro_payment_id: record.payment_id,
                  affiliate_id: record.affiliate_id,
                  payment_amount: record.amount || record.payment_amount,
                  payment_method: record.method || record.payment_method,
                  status: record.status,
                  payment_date: record.date || record.payment_date ? new Date(record.date || record.payment_date).toISOString() : null,
                  raw_data: record,
                  data_source: 'goaffpro',
                  last_synced: new Date().toISOString()
                };
                break;
            }

            if (transformedRecord) {
              const { error: upsertError } = await supabaseClient
                .from(tableName)
                .upsert([transformedRecord], { onConflict: 'goaffpro_id' });

              if (upsertError) {
                console.error(`❌ Upsert error for ${type}:`, upsertError);
                errors.push(`${type} ${record.id}: ${upsertError.message}`);
                totalFailed++;
              } else {
                totalSuccessful++;
              }
            }
          } catch (recordError) {
            console.error(`❌ Processing error for ${type} record:`, recordError);
            errors.push(`${type} ${record.id}: ${recordError.message}`);
            totalFailed++;
          }
        }

        console.log(`✅ Completed syncing ${type}: ${records.length} processed`);
        
      } catch (typeError) {
        console.error(`❌ Error syncing ${type}:`, typeError);
        errors.push(`${type}: ${typeError.message}`);
        totalFailed++;
      }
    }

    // Update sync log
    const syncStatus = errors.length === 0 ? 'completed' : 'failed';
    const { error: updateError } = await supabaseClient
      .from('data_sync_logs')
      .update({
        status: syncStatus,
        completed_at: new Date().toISOString(),
        records_processed: totalProcessed,
        records_successful: totalSuccessful,
        records_failed: totalFailed,
        error_details: errors.length > 0 ? { errors } : null
      })
      .eq('id', logId);

    if (updateError) {
      console.error('❌ Error updating sync log:', updateError);
    }

    console.log(`🎉 Sync completed: ${totalSuccessful} successful, ${totalFailed} failed`);

    return new Response(
      JSON.stringify({
        success: syncStatus === 'completed',
        message: `Sync completed: ${totalSuccessful} successful, ${totalFailed} failed`,
        results: {
          processed: totalProcessed,
          successful: totalSuccessful,
          failed: totalFailed,
          errors: errors.length > 0 ? errors : undefined
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Auto-sync error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Auto-sync failed',
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}); 