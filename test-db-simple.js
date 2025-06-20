import { createClient } from '@supabase/supabase-js';

// Use the service role key for testing (more permissions)
const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test 1: Count all records
    const { count: totalCount, error: countError } = await supabase
      .from('goaffpro_affiliates')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('❌ Count error:', countError);
      return;
    }
    
    console.log(`📊 Total records in goaffpro_affiliates: ${totalCount}`);
    
    // Test 2: Get all records
    const { data: allData, error: allError } = await supabase
      .from('goaffpro_affiliates')
      .select('*');
      
    if (allError) {
      console.error('❌ Select error:', allError);
      return;
    }
    
    console.log(`✅ Retrieved ${allData?.length || 0} records`);
    
    if (allData && allData.length > 0) {
      console.log('\n📋 Sample records:');
      allData.slice(0, 3).forEach((record, index) => {
        console.log(`Record ${index + 1}:`);
        console.log(`  ID: ${record.id}`);
        console.log(`  GoAffPro ID: ${record.goaffpro_id}`);
        console.log(`  Email: ${record.email}`);
        console.log(`  Name: ${record.first_name} ${record.last_name}`);
        console.log(`  Status: ${record.status}`);
        console.log(`  Data Source: ${record.data_source}`);
        console.log('---');
      });
      
      // Test 3: Check data sources
      const sources = [...new Set(allData.map(d => d.data_source))];
      console.log('\n📊 Data sources found:', sources);
      
      for (const source of sources) {
        const count = allData.filter(d => d.data_source === source).length;
        console.log(`  ${source}: ${count} records`);
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testDatabase(); 