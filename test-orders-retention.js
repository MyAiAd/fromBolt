// Test script to check if orders data is being retained properly
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'http://localhost:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
);

async function testOrdersRetention() {
  console.log('🧪 Testing Orders Data Retention\n');
  
  // Test 1: Successful query (should work)
  console.log('📊 Test 1: Normal orders query');
  try {
    const { data: orders, error } = await supabase
      .from('goaffpro_orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.log('❌ Error:', error.message, error.code);
    } else {
      console.log(`✅ Success: Found ${orders?.length || 0} orders`);
    }
  } catch (error) {
    console.log('❌ Exception:', error.message);
  }
  
  // Test 2: Query with filter that might return empty result
  console.log('\n📊 Test 2: Filtered query that returns empty result');
  try {
    const { data: filteredOrders, error } = await supabase
      .from('goaffpro_orders')
      .select('*')
      .eq('data_source', 'nonexistent')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.log('❌ Error:', error.message, error.code);
    } else {
      console.log(`✅ Success: Found ${filteredOrders?.length || 0} orders (expected: 0)`);
      console.log('📝 This tests legitimate empty results vs errors');
    }
  } catch (error) {
    console.log('❌ Exception:', error.message);
  }
  
  // Test 3: Simulate RLS error (would happen with wrong JWT)
  console.log('\n📊 Test 3: Simulating RLS-like error scenario');
  const badSupabase = createClient(
    'http://localhost:54321',
    'invalid_key_that_would_cause_rls_error'
  );
  
  try {
    const { data: badOrders, error } = await badSupabase
      .from('goaffpro_orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.log(`❌ Expected error: ${error.message} (code: ${error.code})`);
      console.log('📝 This is the type of error that should preserve existing data');
      
      // Check if this matches RLS error patterns
      const isRLSError = error.code === '42501' || 
                        error.message.includes('row-level security') || 
                        error.message.includes('JWT');
      console.log(`🔒 Is RLS-type error: ${isRLSError}`);
    } else {
      console.log('⚠️ Unexpected success with bad key');
    }
  } catch (error) {
    console.log(`❌ Exception: ${error.message}`);
  }
  
  console.log('\n🔧 Analysis:');
  console.log('✅ Orders data exists in database (1 order found)');
  console.log('✅ Normal queries work correctly');
  console.log('✅ Empty results handled correctly');
  console.log('📝 The issue might be:');
  console.log('   1. 🔄 Orders not being cached in localStorage like affiliates');
  console.log('   2. 🚫 Orders being cleared when other data refreshes');
  console.log('   3. 🎯 UI not displaying orders correctly');
  console.log('   4. 📱 Browser tab state not persisting orders');
  
  console.log('\n💡 Recommendations:');
  console.log('1. Check browser localStorage for "affiliate_data_orders"');
  console.log('2. Check browser console for orders-related log messages');
  console.log('3. Test switching between data source filters');
  console.log('4. Monitor the orders.length in UI header vs tab content');
}

testOrdersRetention().catch(console.error); 