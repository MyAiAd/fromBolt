// Test script to try requesting specific fields from GoAffPro API
const config = {
  accessToken: '0a71cf64925cd446203dc49348a1c95c18ffe5a487505b7ef9b7874c4a9b9f24',
  baseUrl: 'https://api.goaffpro.com/v1'
};

async function testWithFields() {
  console.log('🔍 Testing GoAffPro API with specific field requests...\n');
  
  // Test 1: Try with fields parameter
  console.log('=== Test 1: With fields parameter ===');
  try {
    const fields = 'id,email,first_name,last_name,name,status,created_at,total_orders,total_commission';
    const response1 = await fetch(`${config.baseUrl}/admin/affiliates?fields=${fields}`, {
      headers: {
        'X-GOAFFPRO-ACCESS-TOKEN': config.accessToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response1.status);
    const data1 = await response1.json();
    console.log('Response:', JSON.stringify(data1, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Test 2: Try with different field names
  console.log('\n=== Test 2: With different field names ===');
  try {
    const fields2 = 'affiliate_id,email,firstname,lastname,full_name,status,signup_date';
    const response2 = await fetch(`${config.baseUrl}/admin/affiliates?fields=${fields2}`, {
      headers: {
        'X-GOAFFPRO-ACCESS-TOKEN': config.accessToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response2.status);
    const data2 = await response2.json();
    console.log('Response:', JSON.stringify(data2, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Test 3: Try with limit parameter
  console.log('\n=== Test 3: With limit parameter ===');
  try {
    const response3 = await fetch(`${config.baseUrl}/admin/affiliates?limit=1`, {
      headers: {
        'X-GOAFFPRO-ACCESS-TOKEN': config.accessToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response3.status);
    const data3 = await response3.json();
    console.log('Response:', JSON.stringify(data3, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Test 4: Try GET request with all common affiliate fields
  console.log('\n=== Test 4: With comprehensive field list ===');
  try {
    const allFields = [
      'id', 'affiliate_id', 'email', 'first_name', 'last_name', 'name', 'full_name',
      'status', 'created_at', 'signup_date', 'total_orders', 'total_commission',
      'pending_commission', 'paid_commission', 'referral_code', 'phone', 'address'
    ].join(',');
    
    const response4 = await fetch(`${config.baseUrl}/admin/affiliates?fields=${allFields}&limit=2`, {
      headers: {
        'X-GOAFFPRO-ACCESS-TOKEN': config.accessToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response4.status);
    const data4 = await response4.json();
    console.log('Response:', JSON.stringify(data4, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Test 5: Try to get a single affiliate by ID
  console.log('\n=== Test 5: Try to get single affiliate ===');
  try {
    const response5 = await fetch(`${config.baseUrl}/admin/affiliates/1`, {
      headers: {
        'X-GOAFFPRO-ACCESS-TOKEN': config.accessToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response5.status);
    const data5 = await response5.json();
    console.log('Response:', JSON.stringify(data5, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testWithFields().catch(console.error); 