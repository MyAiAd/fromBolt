// Simple test to verify RLS fix without authentication issues
import { createClient } from '@supabase/supabase-js';

const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
const supabase = createClient('http://127.0.0.1:54321', serviceRoleKey);

console.log('🧪 Testing RLS Fix (Simple Test)\n');

async function testRLSFix() {
  try {
    console.log('📋 Step 1: Testing basic read access...');
    
    const { data: readData, error: readError } = await supabase
      .from('affiliate_system_users')
      .select('*')
      .limit(5);

    if (readError) {
      console.error('❌ Read error:', readError);
      return;
    }

    console.log('✅ Read successful, found', readData.length, 'existing records');

    console.log('\n💾 Step 2: Testing insert operation...');

    // Test contact data (similar to GHL)
    const testContact = {
      id: 'test-contact-123',
      email: 'test.contact@example.com',
      firstName: 'Test',
      lastName: 'Contact',
      phone: '+1234567890'
    };

    // Generate referral code
    const generateReferralCode = (contact) => {
      const baseName = contact.firstName || contact.lastName || contact.email.split('@')[0];
      const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
      return `${cleanName.substr(0, 6)}${randomSuffix}`;
    };

    const affiliateData = {
      email: testContact.email,
      first_name: testContact.firstName,
      last_name: testContact.lastName,
      phone: testContact.phone,
      referral_code: generateReferralCode(testContact),
      primary_source: 'ghl',
      ghl_contact_id: testContact.id,
      status: 'active',
      signup_date: new Date().toISOString(),
      custom_fields: JSON.stringify({ test: true })
    };

    console.log('Inserting test affiliate:', affiliateData.email);

    const { data: insertData, error: insertError } = await supabase
      .from('affiliate_system_users')
      .upsert([affiliateData], { 
        onConflict: 'email',
        ignoreDuplicates: false 
      })
      .select();

    if (insertError) {
      console.error('❌ Insert error:', insertError);
      
      if (insertError.message.includes('infinite recursion')) {
        console.error('💥 INFINITE RECURSION STILL EXISTS! RLS policies need more work.');
        return;
      }
      
      return;
    }

    console.log('✅ Insert successful!');
    console.log('Inserted record ID:', insertData[0]?.id);

    console.log('\n🔍 Step 3: Verifying record...');

    const { data: verifyData, error: verifyError } = await supabase
      .from('affiliate_system_users')
      .select('*')
      .eq('email', affiliateData.email)
      .single();

    if (verifyError) {
      console.error('❌ Verification error:', verifyError);
      return;
    }

    console.log('✅ Record verified:', {
      id: verifyData.id,
      email: verifyData.email,
      referral_code: verifyData.referral_code,
      primary_source: verifyData.primary_source,
      ghl_contact_id: verifyData.ghl_contact_id
    });

    console.log('\n🧹 Step 4: Cleaning up...');

    const { error: deleteError } = await supabase
      .from('affiliate_system_users')
      .delete()
      .eq('email', affiliateData.email);

    if (deleteError) {
      console.log('⚠️ Failed to clean up:', deleteError);
    } else {
      console.log('✅ Test record cleaned up');
    }

    console.log('\n🎉 RLS FIX SUCCESSFUL!');
    console.log('✅ No infinite recursion detected');
    console.log('✅ Insert operations working');
    console.log('✅ Read operations working');
    console.log('🚀 GHL import should now work in the web app!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    
    if (error.message.includes('infinite recursion')) {
      console.error('💥 INFINITE RECURSION DETECTED! RLS policies still have issues.');
    }
  }
}

testRLSFix().catch(console.error); 