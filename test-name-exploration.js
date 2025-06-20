import { createClient } from '@supabase/supabase-js';

const config = {
  accessToken: process.env.VITE_GOAFFPRO_ACCESS_TOKEN,
  publicToken: process.env.VITE_GOAFFPRO_PUBLIC_TOKEN,
  baseUrl: 'https://api.goaffpro.com/v1'
};

async function testAllFields() {
  try {
    console.log('🔍 Testing GoAffPro API with all possible fields...');
    
    // Try without field restrictions first
    const response1 = await fetch(`${config.baseUrl}/admin/affiliates`, {
      headers: {
        'X-GOAFFPRO-ACCESS-TOKEN': config.accessToken,
        'X-GOAFFPRO-PUBLIC-TOKEN': config.publicToken,
        'Content-Type': 'application/json'
      }
    });
    
    if (response1.ok) {
      const data1 = await response1.json();
      console.log('\n=== Without field restrictions ===');
      if (data1.affiliates && data1.affiliates.length > 0) {
        const sample = data1.affiliates[0];
        console.log('Sample affiliate fields:', Object.keys(sample));
        console.log('Sample affiliate data:', JSON.stringify(sample, null, 2));
      }
    }
    
    // Try with name field specifically
    const response2 = await fetch(`${config.baseUrl}/admin/affiliates?fields=id,email,name,first_name,last_name,display_name,full_name`, {
      headers: {
        'X-GOAFFPRO-ACCESS-TOKEN': config.accessToken,
        'X-GOAFFPRO-PUBLIC-TOKEN': config.publicToken,
        'Content-Type': 'application/json'
      }
    });
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log('\n=== With name fields ===');
      if (data2.affiliates && data2.affiliates.length > 0) {
        data2.affiliates.forEach((affiliate, index) => {
          console.log(`Affiliate ${index + 1}:`);
          console.log(`  ID: ${affiliate.id}`);
          console.log(`  Email: ${affiliate.email}`);
          console.log(`  Name: ${affiliate.name}`);
          console.log(`  First Name: ${affiliate.first_name}`);
          console.log(`  Last Name: ${affiliate.last_name}`);
          console.log(`  Display Name: ${affiliate.display_name}`);
          console.log(`  Full Name: ${affiliate.full_name}`);
          console.log('');
        });
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAllFields(); 