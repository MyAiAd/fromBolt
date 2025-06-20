#!/usr/bin/env node

/**
 * Test import with a valid user ID
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const validUserId = '00000000-0000-0000-0000-000000000001'; // admin user

async function testImportWithValidUser() {
  try {
    const serviceRoleClient = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('🧪 Testing import with valid user ID:', validUserId);

    // Test GoAffPro API
    const config = {
      accessToken: process.env.VITE_GOAFFPRO_ACCESS_TOKEN,
      publicToken: process.env.VITE_GOAFFPRO_PUBLIC_TOKEN,
      baseUrl: 'https://api.goaffpro.com/v1'
    };

    console.log('\n🔗 Fetching affiliates from GoAffPro...');
    const response = await fetch(`${config.baseUrl}/admin/affiliates?fields=id,email,first_name,last_name,phone,address,status,signup_date,referral_code,commission_rate,balance,total_earnings,total_orders,tags,custom_fields`, {
      headers: {
        'X-GOAFFPRO-ACCESS-TOKEN': config.accessToken,
        'X-GOAFFPRO-PUBLIC-TOKEN': config.publicToken,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const affiliates = data.affiliates || [];
    
    console.log(`✅ Found ${affiliates.length} affiliates from GoAffPro`);

    // Create import log with valid user ID
    console.log('\n📝 Creating import log with valid user ID...');
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

    // Import one affiliate as test
    if (affiliates.length > 0) {
      const affiliate = affiliates[0];
      const affiliateData = {
        goaffpro_id: `test_valid_user_${Date.now()}`,
        email: affiliate.email || 'test@example.com',
        first_name: affiliate.first_name || null,
        last_name: affiliate.last_name || null,
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

      console.log('\n💾 Importing test affiliate...');
      const { error: insertError } = await serviceRoleClient
        .from('goaffpro_affiliates')
        .upsert([affiliateData], { onConflict: 'goaffpro_id' });

      if (insertError) {
        console.error('❌ Failed to import affiliate:', insertError);
        return false;
      }

      console.log('✅ Affiliate imported successfully');

      // Update import log
      const { error: updateError } = await serviceRoleClient
        .from('data_import_logs')
        .update({
          status: 'completed',
          records_processed: 1,
          records_successful: 1,
          records_failed: 0,
          completed_at: new Date().toISOString()
        })
        .eq('id', logData.id);

      if (updateError) {
        console.error('❌ Failed to update import log:', updateError);
      } else {
        console.log('✅ Import log updated successfully');
      }

      // Clean up test data
      const { error: deleteError } = await serviceRoleClient
        .from('goaffpro_affiliates')
        .delete()
        .eq('goaffpro_id', affiliateData.goaffpro_id);

      if (deleteError) {
        console.error('⚠️ Cleanup error:', deleteError);
      } else {
        console.log('✅ Test data cleaned up');
      }
    }

    return true;

  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

testImportWithValidUser().then(success => {
  console.log('\n📋 Test Results:');
  console.log('================');
  console.log(`Import with Valid User: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
  
  if (success) {
    console.log('\n🎉 Import works with valid user ID!');
    console.log('💡 The issue is that the app needs to pass a valid user ID');
  } else {
    console.log('\n❌ Import still has issues. Check the errors above.');
  }
}).catch(console.error); 