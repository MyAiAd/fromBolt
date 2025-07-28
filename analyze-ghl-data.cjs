const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnvFile(filename) {
  try {
    const envPath = path.join(__dirname, filename);
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          process.env[key] = value;
        }
      }
    }
  } catch (error) {
    console.log(`Could not load ${filename}:`, error.message);
  }
}

loadEnvFile('.env');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function analyzeGHLData() {
  console.log('🔍 Analyzing ALL GHL affiliate data...\n');
  
  const { data: ghlData, error: ghlError } = await supabase
    .from('ghl_affiliates')
    .select('*')
    .limit(20);
    
  if (ghlError) {
    console.log('❌ Error:', ghlError.message);
    return;
  }
  
  if (ghlData && ghlData.length > 0) {
    console.log(`✅ Found ${ghlData.length} GHL records`);
    console.log('📊 All table columns:', Object.keys(ghlData[0]));
    
    ghlData.forEach((record, index) => {
      if (index >= 3) return; // Show only first 3 records
      
      console.log(`\n${index + 1}. Email: ${record.email}`);
      console.log(`   First Name: ${record.first_name}`);
      console.log(`   Last Name: ${record.last_name}`);
      console.log(`   Phone: ${record.phone}`);
      console.log(`   GHL Contact ID: ${record.ghl_contact_id}`);
      console.log(`   Referral Code: ${record.referral_code}`);
      console.log(`   Referred By: ${record.referred_by_contact_id}`);
      console.log(`   Contact Source: ${record.contact_source}`);
      console.log(`   Tags: ${record.tags}`);
      console.log(`   Custom Fields: ${record.custom_fields}`);
      console.log(`   Status: ${record.status}`);
      console.log(`   Date Added: ${record.date_added}`);
      console.log(`   Last Activity: ${record.last_activity}`);
      console.log(`   Sync Status: ${record.sync_status}`);
      console.log(`   Raw Data: ${record.raw_data ? 'EXISTS' : 'NULL'}`);
      
      if (record.raw_data) {
        try {
          const rawData = JSON.parse(record.raw_data);
          console.log('   Raw Data Keys:', Object.keys(rawData));
        } catch (e) {
          console.log('   Raw Data Parse Error:', e.message);
        }
      }
    });
    
    console.log('\n... showing first 3 records only');
  } else {
    console.log('❌ No GHL records found');
  }
}

analyzeGHLData().catch(console.error); 