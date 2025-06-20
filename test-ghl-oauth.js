import fetch from 'node-fetch';

// Your credentials  
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI';
const locationId = 'w01Gc7T4b0tKSDQdKhuN';

// Try different base URLs and API endpoints
const testEndpoints = [
  {
    name: 'API 2.0 Contacts',
    url: `https://services.leadconnectorhq.com/contacts/`,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28'
    },
    params: `?locationId=${locationId}&limit=5`
  },
  {
    name: 'API 1.0 Contacts',
    url: `https://rest.gohighlevel.com/v1/contacts/`,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    params: `?locationId=${locationId}&limit=5`
  },
  {
    name: 'Alternative Auth Header',
    url: `https://services.leadconnectorhq.com/contacts/`,
    headers: {
      'Authorization': apiKey, // Try without Bearer prefix
      'Content-Type': 'application/json',
      'Version': '2021-07-28'
    },
    params: `?locationId=${locationId}&limit=5`
  }
];

async function testGHLOAuth() {
  console.log('🔄 Testing GHL OAuth and different API endpoints...');
  console.log(`Location ID: ${locationId}`);
  console.log(`API Key: ${apiKey.substring(0, 30)}...`);
  
  for (const endpoint of testEndpoints) {
    try {
      console.log(`\n🔍 Testing: ${endpoint.name}`);
      console.log(`URL: ${endpoint.url}${endpoint.params}`);
      
      const response = await fetch(`${endpoint.url}${endpoint.params}`, {
        method: 'GET',
        headers: endpoint.headers
      });
      
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      // Log response headers to see rate limiting info
      console.log('Response Headers:');
      response.headers.forEach((value, key) => {
        if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('limit')) {
          console.log(`  ${key}: ${value}`);
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Success! Sample response:');
        if (data.contacts && Array.isArray(data.contacts)) {
          console.log(`📥 Found ${data.contacts.length} contacts`);
          if (data.contacts.length > 0) {
            console.log('Sample contact:', JSON.stringify(data.contacts[0], null, 2));
          }
        } else {
          console.log(JSON.stringify(data, null, 2));
        }
        break; // If successful, no need to try other endpoints
      } else {
        const errorText = await response.text();
        console.log('❌ Error response:', errorText);
      }
    } catch (error) {
      console.error('❌ Request failed:', error.message);
    }
  }
}

testGHLOAuth().catch(console.error); 