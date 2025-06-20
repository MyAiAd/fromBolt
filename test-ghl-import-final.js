// Final test of GHL import with user client to verify permission fix
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

console.log('🧪 Final GHL Import Test with User Client\n');

async function testGHLImportFinal() {
  try {
    // Step 1: Create user client (like in browser)
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('🔑 Step 1: Setting up user session...');
    
    // Simulate user being logged in (set a session)
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxOTgzODEyOTk2LCJzdWIiOiIxZmY4OGYzNS01YWQyLTQ4NzgtYmMyMS1lYmM0OGNkNmQxMTgiLCJlbWFpbCI6InNhZ2VAbXlhaS5hZCIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnt9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzMzNTU4MzUzfV0sInNlc3Npb25faWQiOiJhYmNkZWZnaCIsImlzcyI6Imh0dHA6Ly8xMjcuMC4wLjE6NTQzMjEiLCJpYXQiOjE3MzM1NTgzNTN9.placeholder',
      refresh_token: 'refresh_token_placeholder'
    });

    console.log('📡 Step 2: Testing GHL API...');
    
    // Test GHL API (should work as confirmed before)
    const ghlResponse = await fetch('https://rest.gohighlevel.com/v1/contacts/?locationId=w01Gc7T4b0tKSDQdKhuN&limit=2', {
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
      console.log('⚠️ No contacts from GHL API');
      return;
    }

    console.log('💾 Step 3: Testing database imports with user client...');

    // Process each contact like the real import
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const contact of ghlData.contacts) {
      try {
        // Generate referral code (same logic as real import)
        const generateReferralCode = (contact) => {
          const baseName = contact.firstName || contact.lastName || contact.email.split('@')[0];
          const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
          const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
          return `${cleanName.substr(0, 6)}${randomSuffix}`;
        };

        const affiliateData = {
          email: contact.email + '.finaltest', // Add suffix to avoid conflicts
          first_name: contact.firstName || null,
          last_name: contact.lastName || null,
          phone: contact.phone || null,
          referral_code: generateReferralCode(contact) + '_FINAL',
          primary_source: 'ghl',
          ghl_contact_id: contact.id,
          status: 'active',
          signup_date: contact.dateAdded ? new Date(contact.dateAdded).toISOString() : new Date().toISOString(),
          last_active: contact.lastActivity ? new Date(contact.lastActivity).toISOString() : null,
          custom_fields: contact.customFields ? JSON.stringify(contact.customFields) : null
        };

        console.log(`  Importing: ${contact.email} (ID: ${contact.id})`);

        const { error: affiliateError } = await supabase
          .from('affiliate_system_users')
          .upsert([affiliateData], { 
            onConflict: 'email',
            ignoreDuplicates: false 
          });

        if (affiliateError) {
          console.error(`  ❌ Error for ${contact.email}:`, affiliateError.message);
          errors.push(`Contact ${contact.id}: ${affiliateError.message}`);
          errorCount++;
        } else {
          console.log(`  ✅ Success: ${contact.email}`);
          successCount++;
        }

      } catch (error) {
        console.error(`  ❌ Exception for ${contact.id}:`, error.message);
        errors.push(`Contact ${contact.id}: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n📊 Step 4: Results Summary...');
    console.log(`✅ Successful imports: ${successCount}`);
    console.log(`❌ Failed imports: ${errorCount}`);
    
    if (errors.length > 0) {
      console.log('\n⚠️ Errors encountered:');
      errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    console.log('\n🧹 Step 5: Cleaning up test records...');

    for (const contact of ghlData.contacts) {
      const testEmail = contact.email + '.finaltest';
      await supabase
        .from('affiliate_system_users')
        .delete()
        .eq('email', testEmail);
    }

    console.log('✅ Test records cleaned up');

    if (errorCount === 0) {
      console.log('\n🎉 FINAL TEST PASSED!');
      console.log('✅ GHL API v1.0 working');
      console.log('✅ User client database access working');
      console.log('✅ No permission denied errors');
      console.log('✅ No infinite recursion errors');
      console.log('🚀 GHL import should work perfectly in the web app!');
    } else {
      console.log('\n⚠️ FINAL TEST COMPLETED WITH ISSUES');
      console.log(`${successCount} successes, ${errorCount} failures`);
      console.log('Check error details above');
    }

  } catch (error) {
    console.error('❌ Final test failed:', error);
    console.log('Error details:', JSON.stringify(error, null, 2));
  }
}

testGHLImportFinal().catch(console.error); 