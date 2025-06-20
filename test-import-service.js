import { createClient } from '@supabase/supabase-js';

// Configuration
const supabaseConfig = {
  url: 'http://localhost:54321',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
};

// Create Supabase client with service role key
const supabase = createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey);

async function testImportService() {
  try {
    console.log('🧪 Testing updated import service...\n');
    
    // Import the GoAffPro import service
    const { GoAffProImportService } = await import('./src/services/goaffproImportService.js');
    
    // Create import service instance
    const importService = new GoAffProImportService(supabase);
    
    // Create a mock user for the import
    const mockUserId = 'test-user-123';
    
    console.log('📊 Starting affiliate import...');
    const result = await importService.importAffiliates(mockUserId);
    
    console.log('\n📋 Import Results:');
    console.log(`✅ Success: ${result.success}`);
    console.log(`📊 Records Processed: ${result.recordsProcessed}`);
    console.log(`✅ Records Successful: ${result.recordsSuccessful}`);
    console.log(`❌ Records Failed: ${result.recordsFailed}`);
    
    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    // Check the database to see the imported data
    console.log('\n🔍 Checking imported data...');
    const { data: affiliates, error } = await supabase
      .from('goaffpro_affiliates')
      .select('*')
      .eq('data_source', 'goaffpro')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching data:', error);
      return;
    }
    
    console.log(`\n📊 Found ${affiliates.length} affiliates in database:`);
    affiliates.forEach((affiliate, index) => {
      const displayName = affiliate.first_name && affiliate.last_name 
        ? `${affiliate.first_name} ${affiliate.last_name}`
        : affiliate.first_name || affiliate.last_name || 'No Name';
      console.log(`${index + 1}. ${displayName} (${affiliate.email})`);
      console.log(`   GoAffPro ID: ${affiliate.goaffpro_id}`);
      console.log(`   Status: ${affiliate.status}`);
      console.log(`   Raw name from API: ${affiliate.raw_data?.name || 'N/A'}`);
      console.log('');
    });
    
    console.log('🎉 Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testImportService(); 