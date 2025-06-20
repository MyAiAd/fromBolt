#!/usr/bin/env node

/**
 * Test script to verify database connection and insertion
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing Database Connection');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  try {
    console.log('\n📊 Testing basic connection...');
    
    // Test basic connection
    const { data: tables, error: tablesError } = await supabase
      .from('goaffpro_affiliates')
      .select('count', { count: 'exact', head: true });
    
    if (tablesError) {
      console.error('❌ Table access error:', tablesError);
      return false;
    }
    
    console.log('✅ Connection successful');
    console.log('📊 Current affiliate count:', tables?.length || 0);
    
    // Test inserting a record
    console.log('\n🧪 Testing record insertion...');
    
    const testAffiliate = {
      goaffpro_id: 'test_' + Date.now(),
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      status: 'approved',
      data_source: 'goaffpro',
      raw_data: { test: true }
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('goaffpro_affiliates')
      .insert([testAffiliate])
      .select();
    
    if (insertError) {
      console.error('❌ Insert error:', insertError);
      return false;
    }
    
    console.log('✅ Insert successful:', insertData);
    
    // Test reading the record back
    console.log('\n📖 Testing record retrieval...');
    
    const { data: readData, error: readError } = await supabase
      .from('goaffpro_affiliates')
      .select('*')
      .eq('goaffpro_id', testAffiliate.goaffpro_id);
    
    if (readError) {
      console.error('❌ Read error:', readError);
      return false;
    }
    
    console.log('✅ Read successful:', readData);
    
    // Clean up test record
    console.log('\n🧹 Cleaning up test record...');
    
    const { error: deleteError } = await supabase
      .from('goaffpro_affiliates')
      .delete()
      .eq('goaffpro_id', testAffiliate.goaffpro_id);
    
    if (deleteError) {
      console.error('⚠️ Delete error:', deleteError);
    } else {
      console.log('✅ Cleanup successful');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

async function testGoAffProImport() {
  try {
    console.log('\n🔗 Testing GoAffPro API + Database Import...');
    
    // Import the GoAffPro service
    const { goaffproService } = await import('./src/services/goaffproService.js');
    
    // Get affiliates from GoAffPro
    const affiliates = await goaffproService.getAffiliates();
    console.log(`📊 Retrieved ${affiliates.length} affiliates from GoAffPro`);
    
    if (affiliates.length === 0) {
      console.log('⚠️ No affiliates to import');
      return true;
    }
    
    // Try to import the first affiliate
    const affiliate = affiliates[0];
    console.log('🧪 Testing import of first affiliate:', affiliate);
    
    const affiliateData = {
      goaffpro_id: affiliate.id ? String(affiliate.id) : `test_${Date.now()}`,
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
    
    console.log('📝 Prepared affiliate data:', affiliateData);
    
    const { data: insertData, error: insertError } = await supabase
      .from('goaffpro_affiliates')
      .upsert([affiliateData], { onConflict: 'goaffpro_id' })
      .select();
    
    if (insertError) {
      console.error('❌ GoAffPro import error:', insertError);
      return false;
    }
    
    console.log('✅ GoAffPro import successful:', insertData);
    
    return true;
    
  } catch (error) {
    console.error('❌ GoAffPro import test error:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Database Connection Tests\n');
  
  const basicTest = await testDatabaseConnection();
  const importTest = await testGoAffProImport();
  
  console.log('\n📋 Test Results:');
  console.log('================');
  console.log(`Basic Connection: ${basicTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`GoAffPro Import: ${importTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (basicTest && importTest) {
    console.log('\n🎉 All tests passed! Database connection and import should work.');
  } else {
    console.log('\n❌ Some tests failed. Check the errors above.');
  }
}

main().catch(console.error); 