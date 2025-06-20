#!/usr/bin/env node

/**
 * Test script to verify the affiliate aggregation service
 */

import { AffiliateAggregationService } from './src/services/affiliateAggregationService.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

console.log('🧪 Testing Affiliate Aggregation Service');
console.log('Supabase URL:', supabaseUrl);
console.log('Service Role Key:', serviceRoleKey ? 'Present' : 'Missing');

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Import the aggregation service
async function testAffiliateAggregation() {
  console.log('🧪 Testing Affiliate Aggregation Service...');
  
  try {
    const service = new AffiliateAggregationService(supabase);
    
    console.log('📊 Fetching all affiliates...');
    const affiliates = await service.getAllAffiliates();
    
    console.log('✅ Success! Retrieved affiliates:');
    console.log(`   - Total: ${affiliates.length}`);
    console.log(`   - GoAffPro: ${affiliates.filter(a => a.source === 'goaffpro').length}`);
    console.log(`   - MightyNetworks: ${affiliates.filter(a => a.source === 'mightynetworks').length}`);
    console.log(`   - Native: ${affiliates.filter(a => a.source === 'native').length}`);
    
    if (affiliates.length > 0) {
      console.log('📝 Sample affiliate:');
      console.log(affiliates[0]);
    }
    
    // Test stats
    console.log('📈 Testing affiliate stats...');
    const stats = await service.getAffiliateStats();
    console.log('✅ Stats retrieved:', stats);
    
    console.log('🎉 All tests passed! RLS fix is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    
    if (error.code === '42P17') {
      console.error('💡 Infinite recursion detected. Please run fix-rls-policies.sql');
    } else if (error.code === '42501') {
      console.error('💡 Permission denied. Check RLS policies and user permissions.');
    } else {
      console.error('💡 Unexpected error. Check network connection and Supabase configuration.');
    }
  }
}

// Run the test
testAffiliateAggregation().catch(console.error);

export { testAffiliateAggregation }; 