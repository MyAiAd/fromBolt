// Debug script to monitor affiliate data loading and potential overwrites
import { createClient } from '@supabase/supabase-js';

const supabaseConfig = {
  url: 'http://localhost:54321',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
};

const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

async function debugAffiliateLoading() {
  console.log('🔍 Debug: Affiliate Data Loading Patterns\n');
  
  // Test 1: Check current data in database
  console.log('📊 Test 1: Current Database State');
  try {
    const { data: allAffiliates, error: allError } = await supabase
      .from('goaffpro_affiliates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allError) {
      console.error('❌ Error fetching all affiliates:', allError);
    } else {
      console.log(`✅ Total affiliates in DB: ${allAffiliates?.length || 0}`);
      console.log('📋 Data sources breakdown:');
      const sourceCounts = {};
      allAffiliates?.forEach(aff => {
        sourceCounts[aff.data_source] = (sourceCounts[aff.data_source] || 0) + 1;
      });
      console.log(sourceCounts);
    }
  } catch (error) {
    console.error('❌ Exception:', error);
  }
  
  // Test 2: Simulate different data source filters
  console.log('\n📊 Test 2: Data Source Filtering');
  const dataSources = ['all', 'goaffpro', 'test'];
  
  for (const source of dataSources) {
    try {
      let query = supabase.from('goaffpro_affiliates').select('*');
      
      if (source !== 'all') {
        query = query.eq('data_source', source);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.log(`❌ ${source}: Error -`, error.message);
      } else {
        console.log(`✅ ${source}: ${data?.length || 0} affiliates`);
      }
    } catch (error) {
      console.log(`❌ ${source}: Exception -`, error.message);
    }
  }
  
  // Test 3: Check localStorage cache patterns
  console.log('\n📊 Test 3: LocalStorage Cache Check');
  try {
    // Simulate reading from localStorage like the app does
    const CACHE_KEYS = {
      affiliates: 'affiliate_data_affiliates',
      dataSource: 'affiliate_data_source',
      lastUpdated: 'affiliate_data_last_updated'
    };
    
    console.log('Simulating localStorage cache read...');
    console.log('(In real app, this would check browser localStorage)');
    
    // This would be the localStorage check in browser:
    // const cachedAffiliates = localStorage.getItem(CACHE_KEYS.affiliates);
    // const cachedDataSource = localStorage.getItem(CACHE_KEYS.dataSource);
    
  } catch (error) {
    console.error('❌ Cache check error:', error);
  }
  
  // Test 4: Rapid successive queries (simulate auth state changes)
  console.log('\n📊 Test 4: Rapid Successive Queries (Auth State Simulation)');
  console.log('Testing rapid queries within 2 seconds (should be debounced)...');
  
  const startTime = Date.now();
  const queries = [];
  
  // Fire 5 queries rapidly
  for (let i = 0; i < 5; i++) {
    queries.push(
      supabase
        .from('goaffpro_affiliates')
        .select('count')
        .then(({ data, error }) => {
          const elapsed = Date.now() - startTime;
          if (error) {
            console.log(`Query ${i+1} (${elapsed}ms): Error - ${error.message}`);
          } else {
            console.log(`Query ${i+1} (${elapsed}ms): Success - ${data?.[0]?.count || 0} count`);
          }
        })
    );
    
    // Small delay between queries
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  await Promise.all(queries);
  
  // Test 5: Empty result simulation
  console.log('\n📊 Test 5: Empty Result Scenarios');
  try {
    // Query with impossible filter to get empty result
    const { data: emptyData, error: emptyError } = await supabase
      .from('goaffpro_affiliates')
      .select('*')
      .eq('data_source', 'nonexistent_source');
    
    if (emptyError) {
      console.log('❌ Empty query error:', emptyError.message);
    } else {
      console.log(`✅ Empty query success: ${emptyData?.length || 0} results`);
      console.log('📝 This tests how app handles legitimate empty results vs errors');
    }
  } catch (error) {
    console.error('❌ Empty query exception:', error);
  }
  
  console.log('\n🔧 Potential Issues to Investigate:');
  console.log('1. 🔄 Multiple useEffect triggers causing rapid refreshes');
  console.log('2. 🔐 Auth state changes triggering data reloads'); 
  console.log('3. 📱 Browser localStorage corruption or quota issues');
  console.log('4. ⏱️ Race conditions between cached and fresh data');
  console.log('5. 🎯 Data source filter changes clearing data momentarily');
  console.log('6. 🌐 Network interruptions causing partial loads');
}

debugAffiliateLoading().catch(console.error); 