#!/usr/bin/env node

/**
 * Test script that simulates the full import process as it happens in the app
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🚀 Testing Full Import Process (App Simulation)');
console.log('================================================');

// Mock user
const mockUser = {
  id: '00000000-0000-0000-0000-000000000000',
  email: 'test@example.com'
};

async function testFullImport() {
  try {
    // Create clients like the app does
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );

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

    console.log('✅ Clients created');

    // Test GoAffPro API (like goaffproService.getAffiliates())
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

    if (affiliates.length === 0) {
      console.log('⚠️ No affiliates to import');
      return false;
    }

    // Create import log (like the service does)
    console.log('\n📝 Creating import log...');
    const { data: logData, error: logError } = await serviceRoleClient
      .from('data_import_logs')
      .insert([{
        import_type: 'affiliates',
        source: 'goaffpro',
        status: 'started',
        started_by: mockUser.id
      }])
      .select('id')
      .single();

    if (logError) {
      console.error('❌ Failed to create import log:', logError);
      return false;
    }

    console.log('✅ Import log created:', logData.id);

    // Import affiliates
    console.log('\n💾 Importing affiliates...');
    let successful = 0;
    let failed = 0;
    const errors = [];

    for (const affiliate of affiliates) {
      try {
        const affiliateData = {
          goaffpro_id: affiliate.id ? String(affiliate.id) : `empty_${Date.now()}_${Math.random()}`,
          email: affiliate.email || 'unknown@example.com',
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

        console.log(`  📊 Importing affiliate ${affiliate.id} (${affiliate.email})`);

        const { error } = await serviceRoleClient
          .from('goaffpro_affiliates')
          .upsert([affiliateData], { onConflict: 'goaffpro_id' });

        if (error) {
          console.error(`  ❌ Error for affiliate ${affiliate.id}:`, error.message);
          errors.push(`Affiliate ${affiliate.id}: ${error.message}`);
          failed++;
        } else {
          console.log(`  ✅ Successfully imported affiliate ${affiliate.id}`);
          successful++;
        }
      } catch (error) {
        console.error(`  ❌ Processing error for affiliate ${affiliate.id}:`, error);
        errors.push(`Affiliate ${affiliate.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        failed++;
      }
    }

    // Update import log
    console.log('\n📝 Updating import log...');
    const { error: updateError } = await serviceRoleClient
      .from('data_import_logs')
      .update({
        status: failed === 0 ? 'completed' : 'failed',
        records_processed: affiliates.length,
        records_successful: successful,
        records_failed: failed,
        error_details: errors.length > 0 ? { errors } : undefined,
        completed_at: new Date().toISOString()
      })
      .eq('id', logData.id);

    if (updateError) {
      console.error('❌ Failed to update import log:', updateError);
    } else {
      console.log('✅ Import log updated');
    }

    // Check final results
    console.log('\n🔍 Checking imported data...');
    const { data: importedData, error: checkError } = await serviceRoleClient
      .from('goaffpro_affiliates')
      .select('*')
      .eq('data_source', 'goaffpro');

    if (checkError) {
      console.error('❌ Error checking imported data:', checkError);
    } else {
      console.log(`✅ Found ${importedData.length} affiliates in database`);
      if (importedData.length > 0) {
        console.log('📊 Sample imported affiliate:', {
          id: importedData[0].id,
          goaffpro_id: importedData[0].goaffpro_id,
          email: importedData[0].email,
          status: importedData[0].status
        });
      }
    }

    return successful > 0;

  } catch (error) {
    console.error('❌ Full import test failed:', error);
    return false;
  }
}

testFullImport().then(success => {
  console.log('\n📋 Final Results:');
  console.log('==================');
  console.log(`Full Import Process: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
  
  if (success) {
    console.log('\n🎉 Import process is working correctly!');
    console.log('💡 The app should be able to import data successfully');
    console.log('🌐 Try using the web interface at http://localhost:5173');
  } else {
    console.log('\n❌ Import process has issues. Check the errors above.');
  }
}).catch(console.error); 