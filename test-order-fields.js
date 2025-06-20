const config = {
  accessToken: '0a71cf64925cd446203dc49348a1c95c18ffe5a487505b7ef9b7874c4a9b9f24',
  publicToken: 'c633c5f229cf50a8a47f8efd52583295e3818283ab120ed0040994ea14f0903b',
  baseUrl: 'https://api.goaffpro.com/v1'
};

async function exploreOrderFields() {
  console.log('🔍 Exploring GoAffPro order fields...');
  
  try {
    // Test 1: Get orders without field restrictions
    console.log('=== Getting all order data (no field restrictions) ===');
    const response = await fetch(`${config.baseUrl}/admin/orders?limit=1`, {
      headers: {
        'X-GOAFFPRO-ACCESS-TOKEN': config.accessToken,
        'X-GOAFFPRO-PUBLIC-TOKEN': config.publicToken,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Error: ${response.status} ${response.statusText} - ${errorText}`);
      return;
    }

    const data = await response.json();
    console.log(`Found ${data.orders?.length || 0} orders`);
    
    if (data.orders && data.orders.length > 0) {
      console.log('\n=== Sample order with all fields ===');
      console.log(JSON.stringify(data.orders[0], null, 2));
      
      console.log('\n=== All available order fields ===');
      const allFields = Object.keys(data.orders[0]);
      console.log(allFields.join(', '));
      
      // Test 2: Try to get more orders to see field variations
      console.log('\n=== Getting multiple orders ===');
      const response2 = await fetch(`${config.baseUrl}/admin/orders?limit=5`, {
        headers: {
          'X-GOAFFPRO-ACCESS-TOKEN': config.accessToken,
          'X-GOAFFPRO-PUBLIC-TOKEN': config.publicToken,
          'Content-Type': 'application/json'
        }
      });
      
      if (response2.ok) {
        const data2 = await response2.json();
        console.log(`Retrieved ${data2.orders?.length || 0} orders`);
        
        if (data2.orders && data2.orders.length > 0) {
          // Collect all unique fields across all orders
          const allUniqueFields = new Set();
          data2.orders.forEach(order => {
            Object.keys(order).forEach(field => allUniqueFields.add(field));
          });
          
          console.log('\n=== All unique fields across multiple orders ===');
          console.log([...allUniqueFields].sort().join(', '));
          
          // Show sample values for each field
          console.log('\n=== Sample values for each field ===');
          [...allUniqueFields].sort().forEach(field => {
            const sampleValues = data2.orders
              .map(order => order[field])
              .filter(val => val !== null && val !== undefined)
              .slice(0, 3);
            console.log(`${field}: ${JSON.stringify(sampleValues)}`);
          });
        }
      }
    } else {
      console.log('No orders found');
    }
    
  } catch (error) {
    console.error('Error exploring order fields:', error);
  }
}

exploreOrderFields().catch(console.error); 