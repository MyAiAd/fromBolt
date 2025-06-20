// Simple test to update one record directly
import { createClient } from '@supabase/supabase-js';

const supabaseConfig = {
  url: 'http://localhost:54321',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
};

const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

async function testDirectUpdate() {
  console.log('🧪 Testing direct update of one record...\n');
  
  try {
    // First, get one record
    const { data: records, error: selectError } = await supabase
      .from('goaffpro_affiliates')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.error('❌ Error selecting record:', selectError);
      return;
    }
    
    if (!records || records.length === 0) {
      console.log('❌ No records found');
      return;
    }
    
    const record = records[0];
    console.log('📋 Original record:');
    console.log(`- ID: ${record.id}`);
    console.log(`- GoAffPro ID: ${record.goaffpro_id}`);
    console.log(`- Email: ${record.email}`);
    console.log(`- First Name: ${record.first_name}`);
    console.log(`- Last Name: ${record.last_name}`);
    console.log(`- Status: ${record.status}`);
    
    // Try to update this record
    console.log('\n🔄 Attempting to update first_name and last_name...');
    
    const { data: updateData, error: updateError } = await supabase
      .from('goaffpro_affiliates')
      .update({
        first_name: 'Test First',
        last_name: 'Test Last',
        updated_at: new Date().toISOString()
      })
      .eq('id', record.id)
      .select();
    
    if (updateError) {
      console.error('❌ Update error:', updateError);
    } else {
      console.log('✅ Update successful!');
      console.log('📋 Updated data:', updateData);
    }
    
    // Verify the update
    console.log('\n🔍 Verifying update...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('goaffpro_affiliates')
      .select('*')
      .eq('id', record.id)
      .single();
    
    if (verifyError) {
      console.error('❌ Verify error:', verifyError);
    } else {
      console.log('📋 Verified record:');
      console.log(`- First Name: ${verifyData.first_name}`);
      console.log(`- Last Name: ${verifyData.last_name}`);
      console.log(`- Updated At: ${verifyData.updated_at}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDirectUpdate(); 