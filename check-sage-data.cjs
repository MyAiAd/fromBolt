const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findSageEmails() {
  console.log('🔍 Searching for emails containing "sage" or "myai"...\n');
  
  // Search affiliate_system_users table
  const { data: affiliateData, error: affiliateError } = await supabase
    .from('affiliate_system_users')
    .select('email, referral_code, primary_source, ghl_contact_id')
    .or('email.ilike.%sage%,email.ilike.%myai%');
    
  if (affiliateError) {
    console.log('❌ Error checking affiliate_system_users:', affiliateError.message);
  } else {
    console.log('📊 affiliate_system_users matches:');
    if (affiliateData && affiliateData.length > 0) {
      affiliateData.forEach(user => {
        console.log('- Email:', user.email);
        console.log('  Referral Code:', user.referral_code);
        console.log('  Primary Source:', user.primary_source);
        console.log('  GHL Contact ID:', user.ghl_contact_id);
        console.log('');
      });
    } else {
      console.log('  No matches found');
    }
  }
  
  console.log('\n');
  
  // Search ghl_affiliates table
  const { data: ghlData, error: ghlError } = await supabase
    .from('ghl_affiliates')
    .select('email, referral_code, ghl_contact_id')
    .or('email.ilike.%sage%,email.ilike.%myai%');
    
  if (ghlError) {
    console.log('❌ Error checking ghl_affiliates:', ghlError.message);
  } else {
    console.log('📊 ghl_affiliates matches:');
    if (ghlData && ghlData.length > 0) {
      ghlData.forEach(user => {
        console.log('- Email:', user.email);
        console.log('  GHL Referral Code:', user.referral_code);
        console.log('  GHL Contact ID:', user.ghl_contact_id);
        console.log('');
      });
    } else {
      console.log('  No matches found');
    }
  }
  
  // Let's also try exact case search
  console.log('\n🔍 Searching for exact "Sage@MyAi.ad"...');
  
  const { data: exactData, error: exactError } = await supabase
    .from('affiliate_system_users')
    .select('*')
    .eq('email', 'Sage@MyAi.ad');
    
  if (exactData && exactData.length > 0) {
    console.log('✅ Found exact match in affiliate_system_users');
    console.log(exactData[0]);
  } else {
    console.log('❌ No exact match found');
  }
  
  // Let's check what emails are actually in the database
  console.log('\n🔍 Showing first 10 emails in affiliate_system_users...');
  
  const { data: sampleData, error: sampleError } = await supabase
    .from('affiliate_system_users')
    .select('email, referral_code')
    .limit(10);
    
  if (sampleData && sampleData.length > 0) {
    sampleData.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} -> ${user.referral_code}`);
    });
  } else {
    console.log('No data found in affiliate_system_users table');
  }
}

findSageEmails().catch(console.error); 