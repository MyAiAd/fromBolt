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

// Load environment variables
loadEnvFile('.env');

console.log('🔗 Using Supabase URL:', process.env.VITE_SUPABASE_URL ? 'Found' : 'Not found');
console.log('🔑 Using Service Role Key:', process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ? 'Found' : 'Not found');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function checkProductionGHLData() {
  console.log('\n🔍 Checking production GHL data for actual referral codes...\n');
  
  // Check ghl_affiliates table for records with referral codes
  const { data: ghlData, error: ghlError } = await supabase
    .from('ghl_affiliates')
    .select('email, referral_code, ghl_contact_id, raw_data')
    .not('referral_code', 'is', null)
    .limit(15);
    
  if (ghlError) {
    console.log('❌ Error checking ghl_affiliates:', ghlError.message);
  } else if (ghlData && ghlData.length > 0) {
    console.log('✅ Found GHL records with referral codes:');
    ghlData.forEach((record, index) => {
      console.log(`${index + 1}. Email: ${record.email}`);
      console.log(`   GHL Referral Code: ${record.referral_code}`);
      console.log(`   GHL Contact ID: ${record.ghl_contact_id}`);
      
      // Check if there's a referral code in raw_data too
      if (record.raw_data) {
        try {
          const rawData = JSON.parse(record.raw_data);
          if (rawData.referralCode && rawData.referralCode !== record.referral_code) {
            console.log(`   Raw Data also has: ${rawData.referralCode}`);
          }
        } catch (e) {
          // ignore parse errors
        }
      }
      console.log('');
    });
  } else {
    console.log('❌ No GHL records with referral codes found');
    
    // Check if we have any GHL records at all
    const { data: anyGHL, error: anyError } = await supabase
      .from('ghl_affiliates')
      .select('email, referral_code, ghl_contact_id')
      .limit(10);
      
    if (anyGHL && anyGHL.length > 0) {
      console.log('\n📊 Sample GHL records (checking for any referral codes):');
      anyGHL.forEach((record, index) => {
        console.log(`${index + 1}. Email: ${record.email}`);
        console.log(`   Referral Code: ${record.referral_code || 'null'}`);
        console.log(`   Contact ID: ${record.ghl_contact_id}`);
        console.log('');
      });
    } else {
      console.log('❌ No GHL records found at all');
    }
  }
  
  // Also check affiliate_system_users to see the comparison
  console.log('\n🔍 Checking affiliate_system_users for GHL source records...\n');
  
  const { data: affiliateData, error: affiliateError } = await supabase
    .from('affiliate_system_users')
    .select('email, referral_code, ghl_contact_id, primary_source')
    .eq('primary_source', 'ghl')
    .not('ghl_contact_id', 'is', null)
    .limit(15);
    
  if (affiliateError) {
    console.log('❌ Error checking affiliate_system_users:', affiliateError.message);
  } else if (affiliateData && affiliateData.length > 0) {
    console.log('✅ Found affiliate_system_users with GHL source:');
    affiliateData.forEach((record, index) => {
      console.log(`${index + 1}. Email: ${record.email}`);
      console.log(`   Our Referral Code: ${record.referral_code}`);
      console.log(`   GHL Contact ID: ${record.ghl_contact_id}`);
      console.log('');
    });
  } else {
    console.log('❌ No affiliate_system_users with GHL source found');
  }
  
  // Check for any GHL source records even without ghl_contact_id
  const { data: anyGHLSource, error: anyGHLError } = await supabase
    .from('affiliate_system_users')
    .select('email, referral_code, ghl_contact_id, primary_source')
    .eq('primary_source', 'ghl')
    .limit(10);
    
  if (anyGHLSource && anyGHLSource.length > 0) {
    console.log('\n📊 All GHL source records in affiliate_system_users:');
    anyGHLSource.forEach((record, index) => {
      console.log(`${index + 1}. Email: ${record.email}`);
      console.log(`   Referral Code: ${record.referral_code}`);
      console.log(`   GHL Contact ID: ${record.ghl_contact_id || 'null'}`);
      console.log('');
    });
  }
}

checkProductionGHLData().catch(console.error); 