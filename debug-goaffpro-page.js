// Debug script to test GoAffPro Data page queries
import { createClient } from '@supabase/supabase-js';

const supabaseConfig = {
  url: 'http://localhost:54321',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
};

const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

async function debugGoAffProDataPage() {
  console.log('🔍 Debugging GoAffPro Data Page Queries...\n');
  
  // Test different data source filters
  const dataSources = ['all', 'goaffpro', 'test'];
  
  for (const dataSource of dataSources) {
    console.log(`\n📊 Testing dataSource: "${dataSource}"`);
    console.log('='.repeat(40));
    
    try {
      // Test affiliates query (same as DataContext)
      let affiliatesQuery = supabase.from('goaffpro_affiliates').select('*');
      
      if (dataSource !== 'all') {
        console.log(`🔍 Adding filter: data_source = "${dataSource}"`);
        affiliatesQuery = affiliatesQuery.eq('data_source', dataSource);
      }
      
      const { data: affiliates, error: affiliatesError } = await affiliatesQuery.order('created_at', { ascending: false });
      
      if (affiliatesError) {
        console.error('❌ Affiliates error:', affiliatesError);
      } else {
        console.log(`✅ Affiliates found: ${affiliates?.length || 0}`);
        if (affiliates && affiliates.length > 0) {
          console.log('📋 Sample affiliate:');
          console.log(`   - ID: ${affiliates[0].id}`);
          console.log(`   - Email: ${affiliates[0].email}`);
          console.log(`   - Name: ${affiliates[0].first_name} ${affiliates[0].last_name}`);
          console.log(`   - Data Source: ${affiliates[0].data_source}`);
          console.log(`   - Status: ${affiliates[0].status}`);
        }
      }
      
      // Test orders query
      let ordersQuery = supabase.from('goaffpro_orders').select('*');
      if (dataSource !== 'all') {
        ordersQuery = ordersQuery.eq('data_source', dataSource);
      }
      const { data: orders, error: ordersError } = await ordersQuery.order('created_at', { ascending: false });
      
      if (ordersError) {
        console.error('❌ Orders error:', ordersError);
      } else {
        console.log(`✅ Orders found: ${orders?.length || 0}`);
      }
      
      // Test rewards query
      let rewardsQuery = supabase.from('goaffpro_rewards').select('*');
      if (dataSource !== 'all') {
        rewardsQuery = rewardsQuery.eq('data_source', dataSource);
      }
      const { data: rewards, error: rewardsError } = await rewardsQuery.order('created_at', { ascending: false });
      
      if (rewardsError) {
        console.error('❌ Rewards error:', rewardsError);
      } else {
        console.log(`✅ Rewards found: ${rewards?.length || 0}`);
      }
      
      // Test payments query
      let paymentsQuery = supabase.from('goaffpro_payments').select('*');
      if (dataSource !== 'all') {
        paymentsQuery = paymentsQuery.eq('data_source', dataSource);
      }
      const { data: payments, error: paymentsError } = await paymentsQuery.order('created_at', { ascending: false });
      
      if (paymentsError) {
        console.error('❌ Payments error:', paymentsError);
      } else {
        console.log(`✅ Payments found: ${payments?.length || 0}`);
      }
      
    } catch (error) {
      console.error(`❌ Error testing dataSource "${dataSource}":`, error);
    }
  }
  
  // Test localStorage cache
  console.log('\n🗄️ Checking localStorage cache...');
  console.log('='.repeat(40));
  
  try {
    // Check if we're in a browser environment
    if (typeof localStorage !== 'undefined') {
      const cacheKeys = [
        'affiliate_data_affiliates',
        'affiliate_data_orders', 
        'affiliate_data_rewards',
        'affiliate_data_payments',
        'affiliate_data_last_updated',
        'affiliate_data_source'
      ];
      
      for (const key of cacheKeys) {
        const cached = localStorage.getItem(key);
        if (cached) {
          if (key === 'affiliate_data_source' || key === 'affiliate_data_last_updated') {
            console.log(`📦 ${key}: ${cached}`);
          } else {
            try {
              const parsed = JSON.parse(cached);
              console.log(`📦 ${key}: ${Array.isArray(parsed) ? parsed.length : 'not array'} items`);
            } catch (e) {
              console.log(`📦 ${key}: invalid JSON`);
            }
          }
        } else {
          console.log(`📦 ${key}: not found`);
        }
      }
    } else {
      console.log('⚠️ localStorage not available (not in browser)');
    }
  } catch (error) {
    console.error('❌ Error checking localStorage:', error);
  }
}

debugGoAffProDataPage().catch(console.error); 