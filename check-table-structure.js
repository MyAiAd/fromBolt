// Script to check the structure of goaffpro_affiliates table
import { createClient } from '@supabase/supabase-js';

const supabaseConfig = {
  url: 'http://localhost:54321',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
};

const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

async function checkTableStructure() {
  console.log('🔍 Checking goaffpro_affiliates table structure...\n');
  
  try {
    // Get one record to see the structure
    const { data, error } = await supabase
      .from('goaffpro_affiliates')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('📊 Table columns:');
      Object.keys(data[0]).forEach(column => {
        console.log(`- ${column}: ${typeof data[0][column]} (${data[0][column]})`);
      });
      
      console.log('\n📋 Sample record:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('❌ No data found in table');
    }
    
  } catch (error) {
    console.error('❌ Error checking table structure:', error);
  }
}

async function checkAllRecords() {
  console.log('\n🔍 Checking all records...\n');
  
  try {
    const { data, error } = await supabase
      .from('goaffpro_affiliates')
      .select('*');
    
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    console.log(`📊 Found ${data.length} records:`);
    data.forEach((record, index) => {
      console.log(`${index + 1}. Email: ${record.email}, First: ${record.first_name}, Last: ${record.last_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking records:', error);
  }
}

async function main() {
  await checkTableStructure();
  await checkAllRecords();
}

main(); 