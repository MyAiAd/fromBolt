// Simple test script to try different GoAffPro API authentication methods
const config = {
  accessToken: '0a71cf64925cd446203dc49348a1c95c18ffe5a487505b7ef9b7874c4a9b9f24',
  publicToken: 'c633c5f229cf50a8a47f8efd52583295e3818283ab120ed0040994ea14f0903b',
  baseUrl: 'https://api.goaffpro.com/v1'
};

async function testDifferentAuthMethods() {
  console.log('🧪 Testing different GoAffPro API authentication methods...\n');
  
  // Method 1: Only Access Token (as suggested by Make.com docs)
  console.log('=== Method 1: Only X-GOAFFPRO-ACCESS-TOKEN ===');
  try {
    const response1 = await fetch(`${config.baseUrl}/admin/affiliates`, {
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
  
  console.log('\n=== Method 2: Both tokens ===');
  try {
    const response2 = await fetch(`${config.baseUrl}/admin/affiliates`, {
      headers: {
        'X-GOAFFPRO-ACCESS-TOKEN': config.accessToken,
        'X-GOAFFPRO-PUBLIC-TOKEN': config.publicToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response2.status);
    const data2 = await response2.json();
    console.log('Response:', JSON.stringify(data2, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  console.log('\n=== Method 3: Authorization Bearer ===');
  try {
    const response3 = await fetch(`${config.baseUrl}/admin/affiliates`, {
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response3.status);
    const data3 = await response3.json();
    console.log('Response:', JSON.stringify(data3, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  console.log('\n=== Method 4: Try different endpoint ===');
  try {
    const response4 = await fetch(`${config.baseUrl}/affiliates`, {
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
}

testDifferentAuthMethods().catch(console.error); 