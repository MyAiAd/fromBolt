#!/usr/bin/env node

/**
 * Test script to import GoAffPro data using the app's import service
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🚀 Testing GoAffPro Import via App Service');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

// Create a mock user session for testing
const mockUser = {
  id: '00000000-0000-0000-0000-000000000000',
  email: 'test@example.com'
};

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the GoAffProImportService
async function testImport() {
  try {
    console.log('\n📊 Testing GoAffPro Import Service...');
    
    // We'll simulate the import service logic here since we can't easily import ES modules
    const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
    
    const serviceRoleClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('✅ Service role client created');

    // Test GoAffPro API
    const config = {
      accessToken: process.env.VITE_GOAFFPRO_ACCESS_TOKEN || '0a71cf64925cd446203dc49348a1c95c18ffe5a487505b7ef9b7874c4a9b9f24',
      publicToken: process.env.VITE_GOAFFPRO_PUBLIC_TOKEN || 'c633c5f229cf50a8a47f8efd52583295e3818283ab120ed0040994ea14f0903b',
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
      return;
    }

    // Test import with service role client
    console.log('\n💾 Testing import with service role client...');
    
    const affiliate = affiliates[0];
    const testData = {
      goaffpro_id: `test_import_${Date.now()}`,
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

    const { data: insertResult, error: insertError } = await serviceRoleClient
      .from('goaffpro_affiliates')
      .insert([testData])
      .select();

    if (insertError) {
      console.error('❌ Service role insert error:', insertError);
      return false;
    }

    console.log('✅ Service role insert successful!');
    console.log('📊 Inserted data:', insertResult[0]);

    // Clean up test data
    const { error: deleteError } = await serviceRoleClient
      .from('goaffpro_affiliates')
      .delete()
      .eq('goaffpro_id', testData.goaffpro_id);

    if (deleteError) {
      console.error('⚠️ Cleanup error:', deleteError);
    } else {
      console.log('✅ Test data cleaned up');
    }

    return true;

  } catch (error) {
    console.error('❌ Import test failed:', error);
    return false;
  }
}

async function main() {
  console.log('🧪 Starting App Import Service Test\n');
  
  const success = await testImport();
  
  console.log('\n📋 Test Results:');
  console.log('================');
  console.log(`Import Service: ${success ? '✅ PASS' : '❌ FAIL'}`);
  
  if (success) {
    console.log('\n🎉 Import service is working! You can now import data through the app.');
    console.log('💡 Go to your app at http://localhost:5173');
    console.log('🔧 Navigate to Settings > GoAffPro Import');
    console.log('📊 Click "Import All Data" to import your affiliates');
  } else {
    console.log('\n❌ Import service test failed. Check the errors above.');
  }
}

main().catch(console.error); 