// Test GHL API credentials to diagnose authentication issues
console.log('🧪 Testing GHL API Credentials\n');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI';
const LOCATION_ID = 'w01Gc7T4b0tKSDQdKhuN';

async function testCredentials() {
  console.log('📋 Token Analysis:');
  
  // Decode JWT payload (without verification)
  try {
    const payloadBase64 = API_KEY.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    console.log('Token payload:', JSON.stringify(payload, null, 2));
    
    if (payload.iat) {
      const issuedAt = new Date(payload.iat * 1000);
      const now = new Date();
      const ageHours = (now - issuedAt) / (1000 * 60 * 60);
      console.log(`Token issued: ${issuedAt.toISOString()}`);
      console.log(`Token age: ${ageHours.toFixed(1)} hours`);
      
      if (ageHours > 24) {
        console.log('⚠️ Token is likely expired (>24 hours old)');
      }
    }
    
    if (payload.version) {
      console.log(`Token version: ${payload.version}`);
      if (payload.version === 1) {
        console.log('⚠️ This appears to be a v1.0 token, might need v2.0');
      }
    }
  } catch (error) {
    console.log('❌ Failed to decode token:', error.message);
  }

  console.log('\n🔌 Testing API Endpoints:');
  
  // Test different endpoint combinations
  const tests = [
    {
      name: 'GHL API v2.0 (current)',
      url: `https://services.leadconnectorhq.com/contacts/?locationId=${LOCATION_ID}&limit=1`,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    },
    {
      name: 'GHL API v1.0 (legacy)',
      url: `https://rest.gohighlevel.com/v1/contacts/?locationId=${LOCATION_ID}&limit=1`,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  ];

  for (const test of tests) {
    console.log(`\n🧪 Testing: ${test.name}`);
    console.log(`URL: ${test.url}`);
    
    try {
      const response = await fetch(test.url, {
        method: 'GET',
        headers: test.headers
      });

      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Success! Sample response:');
        console.log(JSON.stringify(data, null, 2).substring(0, 500) + '...');
        return; // Stop on first success
      } else {
        const errorText = await response.text();
        console.log(`❌ Error: ${errorText}`);
      }
      
    } catch (error) {
      console.log(`❌ Network error: ${error.message}`);
    }
  }

  console.log('\n💡 Recommendations:');
  console.log('1. Generate a fresh API token from GHL Settings → Integrations');
  console.log('2. Ensure the token is for API v2.0 (not v1.0)');
  console.log('3. Verify the token has "Contacts" read permissions');
  console.log('4. Check that your GHL subscription includes API access');
  console.log('5. Try using a Private Integration instead of a public API key');
}

testCredentials().catch(console.error); 