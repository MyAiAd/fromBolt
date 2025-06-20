#!/usr/bin/env node

const PRODUCTION_GHL_URL = 'https://qnruorhzdxkyfhdgtkqp.supabase.co/functions/v1/ghl-import';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucnVvcmh6ZHhreWZoZGd0a3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDU1MTAsImV4cCI6MjA2MzU4MTUxMH0.d42EFmjURUJ2aLFeAyFQsWwFmbnL7L_ObfAIlpv8McM';

// Test user credentials (from .env.production)
const GHL_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI';
const GHL_LOCATION_ID = 'w01Gc7T4b0tKSDQdKhuN';
const TEST_USER_ID = '92130a87-34d1-4eed-9f06-1b224a6690ae'; // sage@myai.ad from production

async function testGHLImport() {
  console.log('🧪 Testing Production GHL Import');
  console.log('=' .repeat(40));
  console.log(`📍 URL: ${PRODUCTION_GHL_URL}`);
  console.log(`🏢 Location ID: ${GHL_LOCATION_ID}`);
  console.log(`👤 Test User: ${TEST_USER_ID}`);
  
  const payload = {
    apiKey: GHL_API_KEY,
    locationId: GHL_LOCATION_ID,
    userId: TEST_USER_ID
  };

  try {
    console.log('\n📤 Sending GHL import request...');
    const response = await fetch(PRODUCTION_GHL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(payload)
    });

    console.log(`📥 Response Status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log('📄 Response Body:', responseText);

    if (response.ok) {
      const result = JSON.parse(responseText);
      console.log('\n✅ GHL Import Test Results:');
      console.log(`📊 Records Processed: ${result.recordsProcessed || 0}`);
      console.log(`✅ Records Successful: ${result.recordsSuccessful || 0}`);
      console.log(`❌ Records Failed: ${result.recordsFailed || 0}`);
      console.log(`🔄 Records Updated: ${result.recordsUpdated || 0}`);
      
      if (result.errors && result.errors.length > 0) {
        console.log('\n⚠️  Errors encountered:');
        result.errors.slice(0, 3).forEach((error, index) => {
          console.log(`${index + 1}. ${error}`);
        });
      }
      
      console.log('\n🎉 GHL import function is working!');
    } else {
      console.log('\n❌ GHL import test failed');
      
      if (response.status === 401) {
        console.log('🔐 Authentication issue - check user token or API key');
      } else if (response.status === 404) {
        console.log('🔍 Function not found - may not be deployed');
      } else if (response.status === 500) {
        console.log('🐛 Server error - check function logs');
      }
    }

  } catch (error) {
    console.log('\n❌ Network error:', error.message);
  }
}

// Run the test
testGHLImport().catch(console.error); 