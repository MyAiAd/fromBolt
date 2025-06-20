import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkData() {
  console.log('Checking GoAffPro affiliates in database...');
  
  const { data, error } = await supabase
    .from('goaffpro_affiliates')
    .select('*')
    .limit(5);
    
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Found', data?.length || 0, 'records');
  if (data && data.length > 0) {
    console.log('Sample record:');
    console.log(JSON.stringify(data[0], null, 2));
    
    console.log('\nAll records summary:');
    data.forEach((record, index) => {
      console.log(`Record ${index + 1}:`);
      console.log(`  ID: ${record.id}`);
      console.log(`  GoAffPro ID: ${record.goaffpro_id}`);
      console.log(`  Email: ${record.email}`);
      console.log(`  Name: ${record.first_name} ${record.last_name}`);
      console.log(`  Status: ${record.status}`);
      console.log(`  Data Source: ${record.data_source}`);
      console.log('---');
    });
  }
}

checkData().catch(console.error); 