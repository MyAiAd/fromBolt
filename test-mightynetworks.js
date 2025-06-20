// Simple test script to check MightyNetworks/Rewardful API connection
const config = {
  apiKey: process.env.REWARDFUL_API_KEY || '',
  baseUrl: 'https://api.rewardful.com/v1'
};

async function testRewardfulAPI() {
  if (!config.apiKey) {
    console.log('❌ REWARDFUL_API_KEY environment variable not set');
    console.log('Please set your Rewardful API key in the environment variables');
    return;
  }

  const endpoints = [
    '/affiliates',
    '/referrals', 
    '/commissions',
    '/payouts'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n=== Testing ${endpoint} ===`);
      
      const response = await fetch(`${config.baseUrl}${endpoint}?limit=5`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`Error: ${errorText}`);
        continue;
      }

      const data = await response.json();
      console.log(`Response type: ${Array.isArray(data) ? 'Array' : typeof data}`);
      console.log(`Response keys: ${Object.keys(data || {}).join(', ')}`);
      
      // Check for data arrays in different response formats
      if (data.data && Array.isArray(data.data)) {
        console.log(`Data count: ${data.data.length}`);
        if (data.data.length > 0) {
          console.log('Sample record:', JSON.stringify(data.data[0], null, 2));
        }
      } else if (Array.isArray(data)) {
        console.log(`Data count: ${data.length}`);
        if (data.length > 0) {
          console.log('Sample record:', JSON.stringify(data[0], null, 2));
        }
      } else if (data.affiliates && Array.isArray(data.affiliates)) {
        console.log(`Affiliates count: ${data.affiliates.length}`);
        if (data.affiliates.length > 0) {
          console.log('Sample affiliate:', JSON.stringify(data.affiliates[0], null, 2));
        }
      } else if (data.referrals && Array.isArray(data.referrals)) {
        console.log(`Referrals count: ${data.referrals.length}`);
        if (data.referrals.length > 0) {
          console.log('Sample referral:', JSON.stringify(data.referrals[0], null, 2));
        }
      } else if (data.commissions && Array.isArray(data.commissions)) {
        console.log(`Commissions count: ${data.commissions.length}`);
        if (data.commissions.length > 0) {
          console.log('Sample commission:', JSON.stringify(data.commissions[0], null, 2));
        }
      } else if (data.payouts && Array.isArray(data.payouts)) {
        console.log(`Payouts count: ${data.payouts.length}`);
        if (data.payouts.length > 0) {
          console.log('Sample payout:', JSON.stringify(data.payouts[0], null, 2));
        }
      } else {
        console.log('Full response:', JSON.stringify(data, null, 2));
      }

      // Check for pagination info
      if (data.pagination) {
        console.log('Pagination info:', data.pagination);
      }
      
    } catch (error) {
      console.log(`Error testing ${endpoint}:`, error.message);
    }
  }

  console.log('\n=== Connection Test Summary ===');
  console.log('✅ Test completed');
  console.log('💡 If you see data above, the Rewardful API connection is working');
  console.log('💡 If you see errors, check your API key and network connection');
}

// Test individual endpoint with more details
async function testSpecificEndpoint(endpoint = '/affiliates') {
  if (!config.apiKey) {
    console.log('❌ REWARDFUL_API_KEY environment variable not set');
    return;
  }

  try {
    console.log(`\n=== Detailed Test for ${endpoint} ===`);
    
    const response = await fetch(`${config.baseUrl}${endpoint}?limit=10&page=1`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Error Response: ${errorText}`);
      return;
    }

    const data = await response.json();
    console.log('Full Response Structure:');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.log(`Detailed test error:`, error);
  }
}

// Run the tests
console.log('🔍 Testing MightyNetworks/Rewardful API Connection...');
console.log('API Base URL:', config.baseUrl);
console.log('API Key configured:', config.apiKey ? 'Yes' : 'No');

testRewardfulAPI()
  .then(() => {
    console.log('\n🔍 Running detailed test for affiliates endpoint...');
    return testSpecificEndpoint('/affiliates');
  })
  .catch(console.error); 