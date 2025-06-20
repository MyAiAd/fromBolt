#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('🧪 Testing App Import Simulation');
console.log('================================');

async function testImport() {
  try {
    const serviceRoleClient = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Test with empty user ID (like when user is not authenticated)
    console.log('\n🔍 Testing with empty user ID...');
    
    let validUserId = '';
    
    if (!validUserId) {
      console.warn('No user ID provided, using admin fallback');
      validUserId = '00000000-0000-0000-0000-000000000001';
    }

    // Create import log
    const { data: logData, error: logError } = await serviceRoleClient
      .from('data_import_logs')
      .insert([{
        import_type: 'affiliates',
        source: 'goaffpro',
        status: 'started',
        started_by: validUserId
      }])
      .select('id')
      .single();

    if (logError) {
      console.error('❌ Failed to create import log:', logError);
      return false;
    }

    console.log('✅ Import log created successfully:', logData.id);

    // Test GoAffPro API
    const config = {
      accessToken: process.env.VITE_GOAFFPRO_ACCESS_TOKEN,
      publicToken: process.env.VITE_GOAFFPRO_PUBLIC_TOKEN,
      baseUrl: 'https://api.goaffpro.com/v1'
    };

    const response = await fetch(`${config.baseUrl}/admin/affiliates?fields=id,email,first_name,last_name,phone,address,status,signup_date,referral_code,commission_rate,balance,total_earnings,total_orders,tags,custom_fields`, {
      headers: {
        'X-GOAFFPRO-ACCESS-TOKEN': config.accessToken,
        'X-GOAFFPRO-PUBLIC-TOKEN': config.publicToken,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    const affiliates = data.affiliates || [];
    
    console.log(`✅ Found ${affiliates.length} affiliates from GoAffPro`);

    // Import one affiliate as test
    if (affiliates.length > 0) {
      const affiliate = affiliates[0];
      const affiliateData = {
        goaffpro_id: `test_final_${Date.now()}`,
        email: affiliate.email || 'test@example.com',
        first_name: affiliate.first_name || null,
        last_name: affiliate.last_name || null,
        raw_data: affiliate,
        data_source: 'goaffpro'
      };

      const { error: insertError } = await serviceRoleClient
        .from('goaffpro_affiliates')
        .upsert([affiliateData], { onConflict: 'goaffpro_id' });

      if (insertError) {
        console.error('❌ Failed to import affiliate:', insertError);
        return false;
      }

      console.log('✅ Affiliate imported successfully');

      // Update import log
      await serviceRoleClient
        .from('data_import_logs')
        .update({
          status: 'completed',
          records_processed: 1,
          records_successful: 1,
          records_failed: 0,
          completed_at: new Date().toISOString()
        })
        .eq('id', logData.id);

      console.log('✅ Import log updated');

      // Check database
      const { data: importedData } = await serviceRoleClient
        .from('goaffpro_affiliates')
        .select('*')
        .eq('data_source', 'goaffpro');

      console.log(`✅ Database now has ${importedData.length} affiliates`);

      // Clean up test data
      await serviceRoleClient
        .from('goaffpro_affiliates')
        .delete()
        .eq('goaffpro_id', affiliateData.goaffpro_id);

      console.log('✅ Test data cleaned up');
    }

    return true;

  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

testImport().then(success => {
  console.log('\n📋 Results:');
  console.log(`Import Test: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
  
  if (success) {
    console.log('\n🎉 Import should work in the app now!');
    console.log('🌐 Try http://localhost:5173 → Settings → Import All Data');
  }
}).catch(console.error); 