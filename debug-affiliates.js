import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function debugAffiliateAggregation() {
  console.log('🔍 Debugging Affiliate Aggregation Service...');
  console.log('Supabase URL:', process.env.VITE_SUPABASE_URL);
  
  try {
    // Test 1: Direct query to goaffpro_affiliates table
    console.log('\n📊 Test 1: Direct query to goaffpro_affiliates...');
    const { data: directData, error: directError } = await supabase
      .from('goaffpro_affiliates')
      .select('*');
      
    if (directError) {
      console.error('❌ Direct query error:', directError);
    } else {
      console.log('✅ Direct query successful');
      console.log(`Found ${directData?.length || 0} total records`);
      if (directData && directData.length > 0) {
        console.log('Sample record:', JSON.stringify(directData[0], null, 2));
      }
    }
    
    // Test 2: Query with data_source filter (like the aggregation service does)
    console.log('\n📊 Test 2: Query with data_source=goaffpro filter...');
    const { data: filteredData, error: filteredError } = await supabase
      .from('goaffpro_affiliates')
      .select('*')
      .eq('data_source', 'goaffpro');
      
    if (filteredError) {
      console.error('❌ Filtered query error:', filteredError);
    } else {
      console.log('✅ Filtered query successful');
      console.log(`Found ${filteredData?.length || 0} records with data_source=goaffpro`);
      if (filteredData && filteredData.length > 0) {
        console.log('Sample filtered record:', JSON.stringify(filteredData[0], null, 2));
      }
    }
    
    // Test 3: Check all data_source values
    console.log('\n📊 Test 3: Check all data_source values...');
    const { data: allData, error: allError } = await supabase
      .from('goaffpro_affiliates')
      .select('data_source, count(*)', { count: 'exact' });
      
    if (allError) {
      console.error('❌ Data source query error:', allError);
    } else {
      console.log('✅ Data source query successful');
      
      // Get unique data sources
      const { data: uniqueData, error: uniqueError } = await supabase
        .from('goaffpro_affiliates')
        .select('data_source');
        
      if (!uniqueError && uniqueData) {
        const sources = [...new Set(uniqueData.map(d => d.data_source))];
        console.log('Unique data_source values:', sources);
        
        for (const source of sources) {
          const { count } = await supabase
            .from('goaffpro_affiliates')
            .select('*', { count: 'exact', head: true })
            .eq('data_source', source);
          console.log(`  ${source}: ${count} records`);
        }
      }
    }
    
    // Test 4: Simulate the aggregation service logic
    console.log('\n📊 Test 4: Simulate aggregation service logic...');
    const { data: goaffproData, error: goaffproError } = await supabase
      .from('goaffpro_affiliates')
      .select('*')
      .eq('data_source', 'goaffpro');

    if (goaffproError) {
      console.error('❌ Aggregation simulation error:', goaffproError);
    } else {
      console.log('✅ Aggregation simulation successful');
      console.log(`Processing ${goaffproData?.length || 0} GoAffPro records...`);
      
      const aggregated = (goaffproData || []).map(affiliate => ({
        id: `goaffpro_${affiliate.id}`,
        name: `${affiliate.first_name || ''} ${affiliate.last_name || ''}`.trim() || 'Unknown',
        email: affiliate.email,
        source: 'goaffpro',
        level: 'GoAffPro',
        referrals: affiliate.total_orders || 0,
        commission: `$${(affiliate.total_earnings || 0).toFixed(2)}`,
        dateJoined: affiliate.signup_date ? new Date(affiliate.signup_date).toISOString().split('T')[0] : new Date(affiliate.created_at).toISOString().split('T')[0],
        status: mapGoAffProStatus(affiliate.status),
        originalData: affiliate
      }));
      
      console.log(`Aggregated ${aggregated.length} affiliates`);
      if (aggregated.length > 0) {
        console.log('Sample aggregated affiliate:', JSON.stringify(aggregated[0], null, 2));
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

function mapGoAffProStatus(status) {
  switch (status?.toLowerCase()) {
    case 'approved':
    case 'active':
      return 'Active';
    case 'pending':
    case 'review':
      return 'Pending';
    case 'rejected':
    case 'inactive':
    case 'suspended':
      return 'Inactive';
    default:
      return 'Pending';
  }
}

debugAffiliateAggregation().catch(console.error); 