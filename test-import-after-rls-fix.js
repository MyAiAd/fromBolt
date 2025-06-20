// Test GHL import after fixing RLS infinite recursion
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 Testing GHL Import After RLS Fix');
console.log(`Supabase URL: ${supabaseUrl}`);

async function testImportAfterFix() {
  try {
    console.log('\n🔑 Step 1: Testing authentication...');
    
    // Use the existing user credentials
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'sage@myai.ad',
      password: 'supabase123'
    });
    
    if (authError) {
      console.error('❌ Auth error:', authError);
      return;
    }
    
    console.log('✅ Authentication successful');
    console.log('User ID:', authData.user.id);
    console.log('User email:', authData.user.email);

    console.log('\n📡 Step 2: Testing GHL API call...');
    
    // Test a single contact fetch from GHL API v1.0
    const ghlResponse = await fetch('https://rest.gohighlevel.com/v1/contacts/?locationId=w01Gc7T4b0tKSDQdKhuN&limit=1', {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI',
        'Content-Type': 'application/json'
      }
    });

    if (!ghlResponse.ok) {
      console.error('❌ GHL API error:', ghlResponse.status, await ghlResponse.text());
      return;
    }

    const ghlData = await ghlResponse.json();
    console.log('✅ GHL API working, fetched', ghlData.contacts?.length || 0, 'contacts');

    if (!ghlData.contacts || ghlData.contacts.length === 0) {
      console.log('⚠️ No contacts returned from GHL API');
      return;
    }

    const testContact = ghlData.contacts[0];
    console.log('Test contact:', {
      id: testContact.id,
      email: testContact.email,
      firstName: testContact.firstName,
      lastName: testContact.lastName
    });

    console.log('\n💾 Step 3: Testing database insert...');

    // Generate a referral code
    const generateReferralCode = (contact) => {
      const baseName = contact.firstName || contact.lastName || contact.email.split('@')[0];
      const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
      return `${cleanName.substr(0, 6)}${randomSuffix}`;
    };

    const affiliateData = {
      email: testContact.email + '.test', // Add .test to avoid conflicts
      first_name: testContact.firstName || null,
      last_name: testContact.lastName || null,
      phone: testContact.phone || null,
      referral_code: generateReferralCode(testContact) + '_TEST',
      primary_source: 'ghl',
      ghl_contact_id: testContact.id,
      status: 'active',
      signup_date: testContact.dateAdded ? new Date(testContact.dateAdded).toISOString() : new Date().toISOString(),
      last_active: testContact.lastActivity ? new Date(testContact.lastActivity).toISOString() : null,
      custom_fields: testContact.customFields ? JSON.stringify(testContact.customFields) : null
    };

    console.log('Inserting test affiliate:', affiliateData.email);

    const { data: insertData, error: insertError } = await supabase
      .from('affiliate_system_users')
      .upsert([affiliateData], { 
        onConflict: 'email',
        ignoreDuplicates: false 
      });

    if (insertError) {
      console.error('❌ Database insert error:', insertError);
      return;
    }

    console.log('✅ Database insert successful!');

    console.log('\n🔍 Step 4: Verifying the record...');

    const { data: verifyData, error: verifyError } = await supabase
      .from('affiliate_system_users')
      .select('*')
      .eq('email', affiliateData.email)
      .single();

    if (verifyError) {
      console.error('❌ Verification error:', verifyError);
      return;
    }

    console.log('✅ Record verified in database:', {
      id: verifyData.id,
      email: verifyData.email,
      referral_code: verifyData.referral_code,
      primary_source: verifyData.primary_source,
      ghl_contact_id: verifyData.ghl_contact_id
    });

    console.log('\n🧹 Step 5: Cleaning up test record...');

    const { error: deleteError } = await supabase
      .from('affiliate_system_users')
      .delete()
      .eq('email', affiliateData.email);

    if (deleteError) {
      console.log('⚠️ Failed to clean up test record:', deleteError);
    } else {
      console.log('✅ Test record cleaned up');
    }

    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✅ Authentication working');
    console.log('✅ GHL API v1.0 working');
    console.log('✅ Database policies fixed (no infinite recursion)');
    console.log('✅ Record insertion working');
    console.log('🚀 GHL import should now work in the web app!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('Error details:', JSON.stringify(error, null, 2));
  }
}

testImportAfterFix().catch(console.error); 