// Simple test script to check GoAffPro API connection
const config = {
  accessToken: '0a71cf64925cd446203dc49348a1c95c18ffe5a487505b7ef9b7874c4a9b9f24',
  publicToken: 'c633c5f229cf50a8a47f8efd52583295e3818283ab120ed0040994ea14f0903b',
  baseUrl: 'https://api.goaffpro.com/v1'
};

async function testGoAffProAPI() {
  const endpoints = [
    '/admin/affiliates?fields=id,email,first_name,last_name,phone,address,status,signup_date,referral_code,commission_rate,balance,total_earnings,total_orders,tags,custom_fields',
    '/admin/orders?fields=id,affiliate_id,order_number,customer_email,customer_name,order_total,commission_amount,commission_rate,status,order_date,commission_status,products',
    '/admin/rewards?fields=id,affiliate_id,reward_type,amount,description,status,date_awarded',
    '/admin/payments?fields=id,affiliate_id,amount,payment_method,payment_date,status,transaction_id,notes',
    '/admin/commissions?fields=id,affiliate_id,order_id,commission_amount,commission_rate,status,date_earned,date_paid'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n=== Testing ${endpoint} ===`);
      
      const response = await fetch(`${config.baseUrl}${endpoint}`, {
        headers: {
          'X-GOAFFPRO-ACCESS-TOKEN': config.accessToken,
          'X-GOAFFPRO-PUBLIC-TOKEN': config.publicToken,
          'Content-Type': 'application/json'
        }
      });

      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`Error: ${errorText}`);
        continue;
      }

      const data = await response.json();
      console.log(`Data type: ${Array.isArray(data) ? 'Array' : typeof data}`);
      console.log(`Data keys: ${Object.keys(data || {}).join(', ')}`);
      
      // Check for specific data arrays
      if (data.affiliates) {
        console.log(`Affiliates count: ${data.affiliates.length}`);
        if (data.affiliates.length > 0) {
          console.log('Sample affiliate:', JSON.stringify(data.affiliates[0], null, 2));
        }
      }
      
      if (data.orders) {
        console.log(`Orders count: ${data.orders.length}`);
        if (data.orders.length > 0) {
          console.log('Sample order:', JSON.stringify(data.orders[0], null, 2));
        }
      }
      
      if (data.rewards) {
        console.log(`Rewards count: ${data.rewards.length}`);
        if (data.rewards.length > 0) {
          console.log('Sample reward:', JSON.stringify(data.rewards[0], null, 2));
        }
      }
      
      if (data.payments) {
        console.log(`Payments count: ${data.payments.length}`);
        if (data.payments.length > 0) {
          console.log('Sample payment:', JSON.stringify(data.payments[0], null, 2));
        }
      }
      
      if (data.commissions) {
        console.log(`Commissions count: ${data.commissions.length}`);
        if (data.commissions.length > 0) {
          console.log('Sample commission:', JSON.stringify(data.commissions[0], null, 2));
        }
      }
      
    } catch (error) {
      console.log(`Error testing ${endpoint}:`, error.message);
    }
  }
}

testGoAffProAPI().catch(console.error); 