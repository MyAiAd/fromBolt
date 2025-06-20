import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log('📥 MN Minimal webhook - payload:', JSON.stringify(payload, null, 2));

    // Check API key
    const ZAPIER_API_KEY = Deno.env.get('ZAPIER_MIGHTYNETWORKS_KEY');
    const apiKey = payload.api_key;
    
    if (!ZAPIER_API_KEY || apiKey !== ZAPIER_API_KEY) {
      console.error('❌ Authentication failed');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Authentication successful');

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔌 Supabase client created');

    // Simple validation
    if (!payload.email) {
      throw new Error('Email is required');
    }

    console.log(`📧 Processing email: ${payload.email}`);

    // Generate simple referral code
    const referralCode = `MN-${Date.now()}`;
    console.log(`🎫 Generated referral code: ${referralCode}`);

    // Check if affiliate exists
    console.log('🔍 Checking if affiliate exists...');
    const { data: existingAffiliate, error: getError } = await supabaseClient
      .from('affiliate_system_users')
      .select('id, email')
      .eq('email', payload.email)
      .single();

    if (getError && getError.code !== 'PGRST116') {
      console.error('❌ Error checking existing affiliate:', getError);
      throw new Error(`Database query error: ${getError.message}`);
    }

    if (existingAffiliate) {
      console.log(`ℹ️ Affiliate already exists: ${existingAffiliate.id}`);
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Affiliate already exists',
        affiliateId: existingAffiliate.id,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Create new affiliate
    console.log('➕ Creating new affiliate...');
    const { data: newAffiliate, error: createError } = await supabaseClient
      .from('affiliate_system_users')
      .insert({
        email: payload.email,
        first_name: payload.first_name || null,
        last_name: payload.last_name || null,
        primary_source: 'mightynetworks',
        status: 'active',
        signup_date: new Date().toISOString(),
        referral_code: referralCode,
      })
      .select('id')
      .single();

    if (createError) {
      console.error('❌ Error creating affiliate:', createError);
      throw new Error(`Database insert error: ${createError.message}`);
    }

    console.log(`✅ Created new affiliate: ${newAffiliate.id}`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Affiliate created successfully',
      affiliateId: newAffiliate.id,
      email: payload.email,
      referralCode,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ MN Minimal webhook error:', error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    console.error('📋 Error details:', { 
      message: errorMessage, 
      name: errorName,
      stack: errorStack?.split('\n').slice(0, 3)
    });
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
        errorName,
        stack: errorStack?.split('\n').slice(0, 3),
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}); 