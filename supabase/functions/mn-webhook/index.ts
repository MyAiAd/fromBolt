import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Updated payload structure for Zapier's Member Activity trigger
interface ZapierMemberActivityPayload {
  api_key: string; // Authentication key
  
  // Member information (always present)
  member_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  
  // Activity type information
  activity_type?: string; // 'joined', 'purchased', 'cancelled', 'left', etc.
  action?: string; // Alternative field name for activity type
  
  // Purchase/Sale information (present for purchase events)
  amount?: number;
  currency?: string;
  product_name?: string;
  plan_name?: string;
  order_id?: string;
  transaction_id?: string;
  
  // Referral information (if available)
  referred_by?: string;
  referrer_email?: string;
  referral_code?: string;
  
  // Timestamps
  timestamp?: string;
  created_at?: string;
  
  // Raw data from Zapier
  [key: string]: any;
}

// Legacy payload structure (for backward compatibility)
interface ZapierLegacyPayload {
  type: 'new_affiliate' | 'new_sale';
  api_key: string;
  data: Record<string, any>;
}

interface NewAffiliateData {
  email: string;
  first_name?: string;
  last_name?: string;
  referral_code?: string;
  referred_by_email?: string;
}

interface NewSaleData {
  affiliate_email: string;
  order_id: string;
  order_total: number;
  customer_email?: string;
  product_name?: string;
  commission_amount?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log('📥 Received webhook payload:', JSON.stringify(payload, null, 2));

    // Authenticate the request from Zapier
    const ZAPIER_API_KEY = Deno.env.get('ZAPIER_MIGHTYNETWORKS_KEY');
    const apiKey = payload.api_key || payload.data?.api_key;
    
    if (!ZAPIER_API_KEY || apiKey !== ZAPIER_API_KEY) {
      console.error('❌ Authentication failed');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Determine if this is legacy format or new Member Activity format
    if (payload.type && (payload.type === 'new_affiliate' || payload.type === 'new_sale')) {
      // Legacy format - handle as before
      console.log('🔄 Processing legacy webhook format');
      await handleLegacyWebhook(supabaseClient, payload as ZapierLegacyPayload);
    } else {
      // New Member Activity format - detect event type from payload
      console.log('🔄 Processing Member Activity webhook format');
      await handleMemberActivity(supabaseClient, payload as ZapierMemberActivityPayload);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Webhook processed successfully',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Error in MightyNetworks webhook:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Unknown error';
    let errorDetails = {};
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 5) // First 5 lines of stack trace
      };
    }
    
    console.error('📋 Error details:', errorDetails);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function handleLegacyWebhook(supabase: any, payload: ZapierLegacyPayload) {
  switch (payload.type) {
    case 'new_affiliate':
      await handleNewAffiliate(supabase, payload.data as NewAffiliateData);
      break;
    case 'new_sale':
      await handleNewSale(supabase, payload.data as NewSaleData);
      break;
    default:
      throw new Error(`Unsupported legacy webhook type: ${payload.type}`);
  }
}

async function handleMemberActivity(supabase: any, payload: ZapierMemberActivityPayload) {
  const activityType = payload.activity_type || payload.action || '';
  const hasAmount = payload.amount && payload.amount > 0;
  const hasPurchaseInfo = payload.product_name || payload.plan_name || payload.order_id || payload.transaction_id;
  
  console.log(`🔍 Activity type: ${activityType}, Has amount: ${hasAmount}, Has purchase info: ${hasPurchaseInfo}`);
  
  // Determine event type based on activity and data presence
  if (activityType.toLowerCase().includes('purchase') || 
      activityType.toLowerCase().includes('bought') || 
      activityType.toLowerCase().includes('paid') ||
      (hasAmount && hasPurchaseInfo)) {
    
    console.log('💰 Detected purchase/sale event');
    await handleMemberPurchase(supabase, payload);
    
  } else if (activityType.toLowerCase().includes('join') || 
             activityType.toLowerCase().includes('signup') ||
             activityType.toLowerCase().includes('registered')) {
    
    console.log('👤 Detected new member/affiliate event');
    await handleNewMember(supabase, payload);
    
  } else {
    console.log(`ℹ️  Unhandled activity type: ${activityType} - storing as member activity`);
    await handleNewMember(supabase, payload);
  }
}

async function handleNewMember(supabase: any, payload: ZapierMemberActivityPayload) {
  if (!payload.email) {
    throw new Error('Email is required for new member registration');
  }

  // Generate referral code if not provided
  const generateReferralCode = (): string => {
    const baseName = payload.first_name || payload.last_name || payload.email!.split('@')[0];
    const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `MN-${cleanName.substring(0, 6)}${randomSuffix}`;
  };

  const referralCode = payload.referral_code || generateReferralCode();

  // Check if affiliate already exists
  const { data: existingAffiliate, error: getAffiliateError } = await supabase
    .from('affiliate_system_users')
    .select('id, email')
    .eq('email', payload.email)
    .single();

  if (getAffiliateError && getAffiliateError.code !== 'PGRST116') {
    throw getAffiliateError;
  }

  let affiliateId: string;

  if (!existingAffiliate) {
    // Create new affiliate
    const { data: newUser, error: createUserError } = await supabase
      .from('affiliate_system_users')
      .insert({
        email: payload.email,
        first_name: payload.first_name || null,
        last_name: payload.last_name || null,
        primary_source: 'MN',
        status: 'active',
        signup_date: payload.timestamp || payload.created_at || new Date().toISOString(),
        referral_code: referralCode,
        mn_member_id: payload.member_id || null,
        custom_fields: JSON.stringify({
          activity_type: payload.activity_type,
          zapier_data: payload
        })
      })
      .select('id')
      .single();

    if (createUserError) throw createUserError;
    affiliateId = newUser.id;
    console.log(`✅ Created new affiliate: ${payload.email} (ID: ${affiliateId})`);
  } else {
    affiliateId = existingAffiliate.id;
    console.log(`ℹ️  Affiliate already exists: ${payload.email} (ID: ${affiliateId})`);
  }

  // Handle referral relationship if provided
  if (payload.referred_by || payload.referrer_email) {
    const referrerEmail = payload.referrer_email || payload.referred_by;
    
    const { data: referrer, error: getReferrerError } = await supabase
      .from('affiliate_system_users')
      .select('id')
      .eq('email', referrerEmail)
      .single();

    if (getReferrerError) {
      console.warn(`⚠️  Could not find referrer with email: ${referrerEmail}`);
    } else if (referrer) {
      await supabase.from('referral_relationships').upsert({
        affiliate_id: affiliateId,
        l1_referrer_id: referrer.id,
      }, { onConflict: 'affiliate_id' });
      console.log(`🔗 Created referral relationship: ${payload.email} -> ${referrerEmail}`);
    }
  }

  // Store in Mighty Networks specific table as well
  await supabase.from('mightynetworks_affiliates').upsert({
    rewardful_affiliate_id: payload.member_id || `mn-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    mighty_member_id: payload.member_id,
    email: payload.email,
    first_name: payload.first_name,
    last_name: payload.last_name,
    name: payload.name,
    status: 'active',
    signup_date: payload.timestamp || payload.created_at || new Date().toISOString(),
    referral_code: referralCode,
    raw_data: payload,
    data_source: 'zapier_webhook',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }, { onConflict: 'rewardful_affiliate_id' });
}

async function handleMemberPurchase(supabase: any, payload: ZapierMemberActivityPayload) {
  if (!payload.email) {
    throw new Error('Email is required for purchase processing');
  }

  if (!payload.amount || payload.amount <= 0) {
    throw new Error('Valid purchase amount is required');
  }

  // Find the affiliate who made the purchase
  const { data: affiliate, error: getAffiliateError } = await supabase
    .from('affiliate_system_users')
    .select('id')
    .eq('email', payload.email)
    .single();

  if (getAffiliateError || !affiliate) {
    console.warn(`⚠️  Affiliate not found for purchase: ${payload.email}`);
    // Could create the affiliate here if needed
    throw new Error(`Affiliate not found with email: ${payload.email}`);
  }

  const orderId = payload.order_id || payload.transaction_id || `MN-${Date.now()}`;
  const commissionAmount = payload.amount * 0.1; // 10% commission default

  // Record the commission
  const { error: commissionError } = await supabase
    .from('multi_level_commissions')
    .insert({
      order_id: orderId,
      order_source: 'mightynetworks',
      earning_affiliate_id: affiliate.id,
      commission_level: 1,
      commission_amount: commissionAmount,
      order_total: payload.amount,
      order_date: payload.timestamp || payload.created_at || new Date().toISOString(),
      status: 'pending',
      customer_email: payload.email,
      product_name: payload.product_name || payload.plan_name || 'Mighty Networks Purchase',
      custom_fields: JSON.stringify({
        currency: payload.currency || 'USD',
        activity_type: payload.activity_type,
        zapier_data: payload
      })
    });
  
  if (commissionError) throw commissionError;

  // Store in Mighty Networks referrals table
  await supabase.from('mightynetworks_referrals').upsert({
    mn_member_id: payload.member_id,
    affiliate_id: affiliate.id,
    customer_email: payload.email,
    customer_name: payload.name || `${payload.first_name || ''} ${payload.last_name || ''}`.trim(),
    order_total: payload.amount,
    commission_amount: commissionAmount,
    commission_rate: 0.1,
    status: 'confirmed',
    referral_date: payload.timestamp || payload.created_at || new Date().toISOString(),
    conversion_date: payload.timestamp || payload.created_at || new Date().toISOString(),
    commission_status: 'pending',
    raw_data: payload,
    data_source: 'zapier_webhook',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }, { onConflict: 'mn_member_id' });

  console.log(`💰 Processed purchase: ${payload.email} - $${payload.amount} (Commission: $${commissionAmount})`);
}

// Legacy functions for backward compatibility
async function handleNewAffiliate(supabase: any, data: NewAffiliateData) {
  const { data: affiliateUser, error: getAffiliateError } = await supabase
    .from('affiliate_system_users')
    .select('id, email')
    .eq('email', data.email)
    .single();

  if (getAffiliateError && getAffiliateError.code !== 'PGRST116') {
    throw getAffiliateError;
  }

  if (!affiliateUser) {
    const { data: newUser, error: createUserError } = await supabase
      .from('affiliate_system_users')
      .insert({
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        primary_source: 'MN',
        status: 'active',
        signup_date: new Date().toISOString(),
        referral_code: data.referral_code || `MN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      })
      .select('id')
      .single();

    if (createUserError) throw createUserError;
    affiliateUser.id = newUser.id;
  }
  
  if (data.referred_by_email) {
    const { data: referrer, error: getReferrerError } = await supabase
      .from('affiliate_system_users')
      .select('id')
      .eq('email', data.referred_by_email)
      .single();

    if (getReferrerError) {
      console.warn(`Could not find referrer with email: ${data.referred_by_email}`);
    } else if (referrer) {
      await supabase.from('referral_relationships').upsert({
        affiliate_id: affiliateUser.id,
        l1_referrer_id: referrer.id,
      }, { onConflict: 'affiliate_id' });
    }
  }
}

async function handleNewSale(supabase: any, data: NewSaleData) {
  const { data: affiliate, error: getAffiliateError } = await supabase
    .from('affiliate_system_users')
    .select('id')
    .eq('email', data.affiliate_email)
    .single();

  if (getAffiliateError || !affiliate) {
    throw new Error(`Affiliate not found with email: ${data.affiliate_email}`);
  }

  const commissionAmount = data.commission_amount || (data.order_total * 0.1);

  const { error: commissionError } = await supabase
    .from('multi_level_commissions')
    .insert({
      order_id: data.order_id,
      order_source: 'mightynetworks',
      earning_affiliate_id: affiliate.id,
      commission_level: 1,
      commission_amount: commissionAmount,
      order_total: data.order_total,
      order_date: new Date().toISOString(),
      status: 'pending',
      customer_email: data.customer_email,
      product_name: data.product_name,
    });
  
  if (commissionError) throw commissionError;
} 