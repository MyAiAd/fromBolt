// Test script to verify pages can load data correctly
import { createClient } from '@supabase/supabase-js';

const supabaseConfig = {
  url: 'http://localhost:54321',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
};

const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

// Test GoAffPro Data page loading
async function testGoAffProDataPage() {
  console.log('\n🧪 Testing GoAffPro Data Page Loading...');
  
  try {
    const startTime = Date.now();
    
    // Simulate what GoAffPro Data page does
    const [affiliatesResult, ordersResult, rewardsResult, paymentsResult] = await Promise.all([
      supabase.from('goaffpro_affiliates').select('*').order('created_at', { ascending: false }),
      supabase.from('goaffpro_orders').select('*').order('created_at', { ascending: false }),
      supabase.from('goaffpro_rewards').select('*').order('created_at', { ascending: false }),
      supabase.from('goaffpro_payments').select('*').order('created_at', { ascending: false })
    ]);
    
    const loadTime = Date.now() - startTime;
    
    console.log(`✅ GoAffPro Data Page loaded in ${loadTime}ms`);
    console.log(`📊 Data counts:`);
    console.log(`   - Affiliates: ${affiliatesResult.data?.length || 0}`);
    console.log(`   - Orders: ${ordersResult.data?.length || 0}`);
    console.log(`   - Rewards: ${rewardsResult.data?.length || 0}`);
    console.log(`   - Payments: ${paymentsResult.data?.length || 0}`);
    
    if (affiliatesResult.error) console.error('❌ Affiliates error:', affiliatesResult.error);
    if (ordersResult.error) console.error('❌ Orders error:', ordersResult.error);
    if (rewardsResult.error) console.error('❌ Rewards error:', rewardsResult.error);
    if (paymentsResult.error) console.error('❌ Payments error:', paymentsResult.error);
    
    return {
      success: !affiliatesResult.error && !ordersResult.error && !rewardsResult.error && !paymentsResult.error,
      loadTime,
      data: {
        affiliates: affiliatesResult.data?.length || 0,
        orders: ordersResult.data?.length || 0,
        rewards: rewardsResult.data?.length || 0,
        payments: paymentsResult.data?.length || 0
      }
    };
  } catch (error) {
    console.error('❌ GoAffPro Data Page test failed:', error);
    return { success: false, error };
  }
}

// Test import logs loading (what might be causing hanging)
async function testImportLogsLoading() {
  console.log('\n🧪 Testing Import Logs Loading...');
  
  try {
    const startTime = Date.now();
    
    const { data, error } = await supabase
      .from('data_import_logs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(50);
    
    const loadTime = Date.now() - startTime;
    
    console.log(`✅ Import Logs loaded in ${loadTime}ms`);
    console.log(`📊 Found ${data?.length || 0} import logs`);
    
    if (error) {
      console.error('❌ Import Logs error:', error);
      return { success: false, error, loadTime };
    }
    
    return { success: true, loadTime, data: data?.length || 0 };
  } catch (error) {
    console.error('❌ Import Logs test failed:', error);
    return { success: false, error };
  }
}

// Test Affiliates page loading (using AggregationService logic)
async function testAffiliatesPage() {
  console.log('\n🧪 Testing Affiliates Page Loading...');
  
  try {
    const startTime = Date.now();
    
    // Simulate AffiliateAggregationService.getAllAffiliates()
    const [goaffproResult, mightyResult, nativeResult] = await Promise.all([
      supabase.from('goaffpro_affiliates').select('*').eq('data_source', 'goaffpro'),
      supabase.from('mightynetworks_affiliates').select('*').then(result => {
        // Handle missing table gracefully
        if (result.error && result.error.code === '42P01') {
          return { data: [], error: null };
        }
        return result;
      }),
      supabase.from('affiliates').select('*')
    ]);
    
    const loadTime = Date.now() - startTime;
    
    console.log(`✅ Affiliates Page loaded in ${loadTime}ms`);
    console.log(`📊 Data counts:`);
    console.log(`   - GoAffPro: ${goaffproResult.data?.length || 0}`);
    console.log(`   - MightyNetworks: ${mightyResult.data?.length || 0}`);
    console.log(`   - Native: ${nativeResult.data?.length || 0}`);
    
    if (goaffproResult.error) console.error('❌ GoAffPro error:', goaffproResult.error);
    if (mightyResult.error) console.error('❌ MightyNetworks error:', mightyResult.error);
    if (nativeResult.error) console.error('❌ Native error:', nativeResult.error);
    
    // Process GoAffPro affiliates (simulate aggregation logic)
    const processedAffiliates = [];
    if (goaffproResult.data) {
      for (const affiliate of goaffproResult.data) {
        let displayName = 'Unknown';
        if (affiliate.first_name && affiliate.last_name && 
            affiliate.first_name !== 'null' && affiliate.last_name !== 'null') {
          displayName = `${affiliate.first_name} ${affiliate.last_name}`.trim();
        } else if (affiliate.first_name && affiliate.first_name !== 'null') {
          displayName = affiliate.first_name;
        } else if (affiliate.last_name && affiliate.last_name !== 'null') {
          displayName = affiliate.last_name;
        } else if (affiliate.email) {
          displayName = affiliate.email.split('@')[0];
        }
        
        processedAffiliates.push({
          id: affiliate.id,
          name: displayName,
          email: affiliate.email,
          status: affiliate.status === 'approved' ? 'Active' : affiliate.status || 'Unknown',
          source: 'goaffpro',
          level: 'GoAffPro',
          commission: '$0.00',
          referrals: affiliate.total_orders || 0,
          dateJoined: affiliate.created_at
        });
      }
    }
    
    console.log(`🔄 Processed ${processedAffiliates.length} aggregated affiliates`);
    if (processedAffiliates.length > 0) {
      console.log('Sample processed affiliate:', processedAffiliates[0]);
    }
    
    return {
      success: !goaffproResult.error && !mightyResult.error && !nativeResult.error,
      loadTime,
      data: {
        goaffpro: goaffproResult.data?.length || 0,
        mightynetworks: mightyResult.data?.length || 0,
        native: nativeResult.data?.length || 0,
        processed: processedAffiliates.length
      }
    };
  } catch (error) {
    console.error('❌ Affiliates Page test failed:', error);
    return { success: false, error };
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Page Loading Tests...');
  
  const results = {
    goaffproData: await testGoAffProDataPage(),
    affiliates: await testAffiliatesPage(),
    importLogs: await testImportLogsLoading()
  };
  
  console.log('\n📋 Test Summary:');
  console.log('================');
  console.log(`GoAffPro Data Page: ${results.goaffproData.success ? '✅ PASS' : '❌ FAIL'} (${results.goaffproData.loadTime || 'N/A'}ms)`);
  console.log(`Affiliates Page: ${results.affiliates.success ? '✅ PASS' : '❌ FAIL'} (${results.affiliates.loadTime || 'N/A'}ms)`);
  console.log(`Import Logs: ${results.importLogs.success ? '✅ PASS' : '❌ FAIL'} (${results.importLogs.loadTime || 'N/A'}ms)`);
  
  if (results.goaffproData.success && results.affiliates.success && results.importLogs.success) {
    console.log('\n🎉 All tests passed! Pages should load correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check errors above.');
  }
  
  return results;
}

runAllTests().catch(console.error); 