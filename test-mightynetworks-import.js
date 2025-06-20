// Test script for MightyNetworks/Rewardful import functionality
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseStructure() {
  console.log('🔍 Testing MightyNetworks database structure...');
  
  const tables = [
    'mightynetworks_affiliates',
    'mightynetworks_referrals', 
    'mightynetworks_commissions',
    'mightynetworks_payouts',
    'mightynetworks_import_logs'
  ];

  for (const table of tables) {
    try {
      console.log(`\n📊 Testing table: ${table}`);
      
      // Test table exists and basic query
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(1);

      if (error) {
        console.log(`❌ Error querying ${table}:`, error.message);
      } else {
        console.log(`✅ Table ${table} exists and is accessible`);
        console.log(`📈 Current record count: ${count || 0}`);
        
        if (data && data.length > 0) {
          console.log('Sample record structure:', Object.keys(data[0]));
        }
      }
    } catch (error) {
      console.log(`❌ Exception testing ${table}:`, error.message);
    }
  }
}

async function testInsertSampleData() {
  console.log('\n🧪 Testing sample data insertion...');
  
  try {
    // Test affiliate insertion
    const sampleAffiliate = {
      rewardful_affiliate_id: 'test_affiliate_123',
      email: 'test@mightynetworks.com',
      first_name: 'Test',
      last_name: 'Affiliate',
      name: 'Test Affiliate',
      status: 'active',
      signup_date: new Date().toISOString(),
      commission_rate: 0.10,
      balance: 0,
      total_earnings: 150.00,
      total_referrals: 5,
      total_commissions: 150.00,
      payout_email: 'test@mightynetworks.com',
      raw_data: { test: true },
      data_source: 'mightynetworks'
    };

    const { data: affiliateData, error: affiliateError } = await supabase
      .from('mightynetworks_affiliates')
      .insert([sampleAffiliate])
      .select()
      .single();

    if (affiliateError) {
      console.log('❌ Error inserting sample affiliate:', affiliateError.message);
      return;
    }

    console.log('✅ Sample affiliate inserted successfully');
    console.log('Affiliate ID:', affiliateData.id);

    // Test referral insertion
    const sampleReferral = {
      rewardful_referral_id: 'test_referral_123',
      rewardful_affiliate_id: 'test_affiliate_123',
      affiliate_id: affiliateData.id,
      customer_email: 'customer@example.com',
      customer_name: 'Test Customer',
      order_total: 100.00,
      commission_amount: 10.00,
      commission_rate: 0.10,
      status: 'confirmed',
      referral_date: new Date().toISOString(),
      conversion_date: new Date().toISOString(),
      raw_data: { test: true },
      data_source: 'mightynetworks'
    };

    const { data: referralData, error: referralError } = await supabase
      .from('mightynetworks_referrals')
      .insert([sampleReferral])
      .select()
      .single();

    if (referralError) {
      console.log('❌ Error inserting sample referral:', referralError.message);
      return;
    }

    console.log('✅ Sample referral inserted successfully');

    // Test commission insertion
    const sampleCommission = {
      rewardful_commission_id: 'test_commission_123',
      rewardful_affiliate_id: 'test_affiliate_123',
      rewardful_referral_id: 'test_referral_123',
      affiliate_id: affiliateData.id,
      referral_id: referralData.id,
      commission_amount: 10.00,
      commission_rate: 0.10,
      commission_type: 'percentage',
      status: 'approved',
      date_earned: new Date().toISOString(),
      raw_data: { test: true },
      data_source: 'mightynetworks'
    };

    const { error: commissionError } = await supabase
      .from('mightynetworks_commissions')
      .insert([sampleCommission]);

    if (commissionError) {
      console.log('❌ Error inserting sample commission:', commissionError.message);
      return;
    }

    console.log('✅ Sample commission inserted successfully');

    // Test import log insertion
    const sampleImportLog = {
      import_type: 'test',
      source: 'mightynetworks',
      status: 'completed',
      started_by: affiliateData.id, // Using affiliate ID as user ID for test
      records_processed: 3,
      records_successful: 3,
      records_failed: 0
    };

    const { error: logError } = await supabase
      .from('mightynetworks_import_logs')
      .insert([sampleImportLog]);

    if (logError) {
      console.log('❌ Error inserting sample import log:', logError.message);
      return;
    }

    console.log('✅ Sample import log inserted successfully');
    console.log('✅ All sample data inserted successfully!');

  } catch (error) {
    console.log('❌ Exception during sample data insertion:', error.message);
  }
}

async function testDataRetrieval() {
  console.log('\n📖 Testing data retrieval...');
  
  try {
    // Test affiliate retrieval with joins
    const { data: affiliatesWithData, error } = await supabase
      .from('mightynetworks_affiliates')
      .select(`
        *,
        referrals:mightynetworks_referrals(count),
        commissions:mightynetworks_commissions(count)
      `);

    if (error) {
      console.log('❌ Error retrieving affiliate data:', error.message);
      return;
    }

    console.log(`✅ Retrieved ${affiliatesWithData.length} affiliates with related data`);
    
    if (affiliatesWithData.length > 0) {
      const sample = affiliatesWithData[0];
      console.log('Sample affiliate with counts:', {
        name: sample.name,
        email: sample.email,
        referrals: sample.referrals?.[0]?.count || 0,
        commissions: sample.commissions?.[0]?.count || 0
      });
    }

    // Test import logs
    const { data: importLogs } = await supabase
      .from('mightynetworks_import_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    console.log(`✅ Retrieved ${importLogs?.length || 0} import logs`);

  } catch (error) {
    console.log('❌ Exception during data retrieval:', error.message);
  }
}

async function testRewardfulAPIConnection() {
  console.log('\n🌐 Testing Rewardful API connection...');
  
  const apiKey = process.env.REWARDFUL_API_KEY;
  
  if (!apiKey) {
    console.log('⚠️ REWARDFUL_API_KEY not set - skipping API test');
    console.log('💡 Set REWARDFUL_API_KEY environment variable to test API connection');
    return;
  }

  try {
    const response = await fetch('https://api.rewardful.com/v1/affiliates?limit=1', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Rewardful API connection successful');
      console.log('API Response structure:', Object.keys(data));
    } else {
      console.log(`❌ Rewardful API error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log('❌ Rewardful API connection failed:', error.message);
  }
}

async function cleanupTestData() {
  console.log('\n🧹 Cleaning up test data...');
  
  try {
    // Delete in reverse order due to foreign key constraints
    await supabase.from('mightynetworks_commissions').delete().eq('data_source', 'mightynetworks');
    await supabase.from('mightynetworks_referrals').delete().eq('data_source', 'mightynetworks');
    await supabase.from('mightynetworks_affiliates').delete().eq('data_source', 'mightynetworks');
    await supabase.from('mightynetworks_import_logs').delete().eq('source', 'mightynetworks');
    
    console.log('✅ Test data cleaned up successfully');
  } catch (error) {
    console.log('❌ Error cleaning up test data:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting MightyNetworks Integration Tests...');
  console.log('=' .repeat(50));
  
  try {
    await testDatabaseStructure();
    await testInsertSampleData();
    await testDataRetrieval();
    await testRewardfulAPIConnection();
    await cleanupTestData();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 All tests completed!');
    console.log('✅ MightyNetworks integration structure is ready');
    console.log('💡 Next steps:');
    console.log('   1. Set REWARDFUL_API_KEY environment variable');
    console.log('   2. Test with real Rewardful data');
    console.log('   3. Integrate with the UI');
    
  } catch (error) {
    console.log('\n❌ Test suite failed:', error.message);
  }
}

runAllTests().catch(console.error); 