const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
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

async function checkGHLRawData() {
  console.log('🔍 Examining GHL raw_data to see what fields they provide...\n');
  
  const { data: ghlData, error: ghlError } = await supabase
    .from('ghl_affiliates')
    .select('email, referral_code, ghl_contact_id, raw_data')
    .not('raw_data', 'is', null)
    .limit(5);
    
  if (ghlError) {
    console.log('❌ Error:', ghlError.message);
    return;
  }
  
  if (ghlData && ghlData.length > 0) {
    ghlData.forEach((record, index) => {
      console.log(`${index + 1}. Email: ${record.email}`);
      console.log(`   Stored Referral Code: ${record.referral_code}`);
      console.log(`   GHL Contact ID: ${record.ghl_contact_id}`);
      
      if (record.raw_data) {
        try {
          const rawData = JSON.parse(record.raw_data);
          console.log('   Raw Data Fields:', Object.keys(rawData));
          
          // Check for any referral-related fields
          const referralFields = Object.keys(rawData).filter(key => 
            key.toLowerCase().includes('referral') || 
            key.toLowerCase().includes('code') ||
            key.toLowerCase().includes('affiliate')
          );
          
          if (referralFields.length > 0) {
            console.log('   Referral-related fields found:', referralFields);
            referralFields.forEach(field => {
              console.log(`     ${field}: ${rawData[field]}`);
            });
          } else {
            console.log('   No referral-related fields found in raw data');
          }
          
          // Show a sample of the raw data structure
          console.log('   Sample raw data:', JSON.stringify(rawData, null, 2).substring(0, 500) + '...');
          
        } catch (e) {
          console.log('   Error parsing raw_data:', e.message);
        }
      }
      console.log('\n' + '='.repeat(80) + '\n');
    });
  } else {
    console.log('❌ No GHL records with raw_data found');
  }
}

checkGHLRawData().catch(console.error); 