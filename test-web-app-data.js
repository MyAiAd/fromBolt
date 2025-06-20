import { createClient } from '@supabase/supabase-js';

// Use the same configuration as the web app
const supabaseConfig = {
  url: 'http://localhost:54321',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNx_kzKJHfqcwEBpgfS_yk5PTthU'
};

const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

async function testWebAppDataAccess() {
  try {
    console.log('🧪 Testing Web App Data Access...\n');
    
    // Test 1: Direct database query (same as aggregation service)
    console.log('📊 Testing direct database access...');
    const { data: goaffproData, error } = await supabase
      .from('goaffpro_affiliates')
      .select('*')
      .eq('data_source', 'goaffpro');

    if (error) {
      console.error('❌ Database access error:', error);
      return;
    }

    console.log(`✅ Found ${goaffproData?.length || 0} GoAffPro affiliates`);
    
    if (goaffproData && goaffproData.length > 0) {
      console.log('\n📋 Sample affiliate data:');
      const sample = goaffproData[0];
      console.log(`  ID: ${sample.id}`);
      console.log(`  GoAffPro ID: ${sample.goaffpro_id}`);
      console.log(`  Email: ${sample.email}`);
      console.log(`  First Name: ${sample.first_name}`);
      console.log(`  Last Name: ${sample.last_name}`);
      console.log(`  Status: ${sample.status}`);
      console.log(`  Raw Data Name: ${sample.raw_data?.name || 'N/A'}`);
    }
    
    // Test 2: Simulate aggregation service logic
    console.log('\n🔄 Testing aggregation logic...');
    const processedAffiliates = (goaffproData || []).map(affiliate => {
      // Same logic as in affiliateAggregationService.ts
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

      return {
        id: `goaffpro_${affiliate.id}`,
        name: displayName,
        email: affiliate.email,
        source: 'goaffpro',
        level: 'ReAction',
        referrals: affiliate.total_orders || 0,
        commission: `$${(affiliate.total_earnings || 0).toFixed(2)}`,
        status: affiliate.status === 'approved' ? 'Active' : 'Pending'
      };
    });
    
    console.log('\n📋 Processed affiliates for display:');
    processedAffiliates.forEach((affiliate, index) => {
      console.log(`${index + 1}. ${affiliate.name} (${affiliate.email})`);
      console.log(`   Source: ${affiliate.source} | Level: ${affiliate.level}`);
      console.log(`   Status: ${affiliate.status} | Commission: ${affiliate.commission}`);
      console.log('');
    });
    
    console.log('🎉 Web app data access test completed successfully!');
    console.log('💡 The names should be displaying correctly in the web app.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testWebAppDataAccess(); 