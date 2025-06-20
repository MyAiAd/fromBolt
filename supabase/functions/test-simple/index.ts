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
    console.log('🧪 Simple test webhook called');
    
    const payload = await req.json();
    console.log('📥 Payload received:', JSON.stringify(payload, null, 2));

    // Test Supabase connection
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔌 Testing database connection...');
    
    // Simple query to test connection
    const { data, error } = await supabaseClient
      .from('affiliate_system_users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Database query failed:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('✅ Database connection successful');

    // Test insert operation
    console.log('🧪 Testing insert operation...');
    
    const testEmail = `simple-test-${Date.now()}@example.com`;
    const { data: insertData, error: insertError } = await supabaseClient
      .from('affiliate_system_users')
      .insert({
        email: testEmail,
        first_name: 'Simple',
        last_name: 'Test',
        primary_source: 'mightynetworks',
        status: 'active',
        signup_date: new Date().toISOString(),
        referral_code: `TEST-${Date.now()}`
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('❌ Insert failed:', insertError);
      throw new Error(`Insert error: ${insertError.message}`);
    }

    console.log('✅ Insert successful, ID:', insertData.id);

    // Clean up test record
    await supabaseClient
      .from('affiliate_system_users')
      .delete()
      .eq('id', insertData.id);

    console.log('✅ Test record cleaned up');

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Simple test webhook successful',
      testEmail,
      insertedId: insertData.id,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Simple test webhook error:', error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    console.error('📋 Error details:', { message: errorMessage, stack: errorStack });
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}); 