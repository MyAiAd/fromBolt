// Test script to explore all available fields from GoAffPro API
const config = {
  accessToken: '0a71cf64925cd446203dc49348a1c95c18ffe5a487505b7ef9b7874c4a9b9f24',
  publicToken: 'c633c5f229cf50a8a47f8efd52583295e3818283ab120ed0040994ea14f0903b',
  baseUrl: 'https://api.goaffpro.com/v1'
};

async function exploreAffiliateFields() {
  console.log('🔍 Exploring GoAffPro affiliate fields...\n');
  
  try {
    // First, get affiliates without specifying fields to see all available data
    console.log('=== Getting all affiliate data (no field restrictions) ===');
    const response = await fetch(`${config.baseUrl}/admin/affiliates`, {
      headers: {
        'X-GOAFFPRO-ACCESS-TOKEN': config.accessToken,
        'X-GOAFFPRO-PUBLIC-TOKEN': config.publicToken,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log(`Error: ${response.status} ${response.statusText}`);
      return;
    }

    const data = await response.json();
    console.log(`Found ${data.affiliates?.length || 0} affiliates`);
    
    if (data.affiliates && data.affiliates.length > 0) {
      console.log('\n=== Sample affiliate with all fields ===');
      const sampleAffiliate = data.affiliates[0];
      console.log(JSON.stringify(sampleAffiliate, null, 2));
      
      console.log('\n=== All available fields ===');
      const allFields = Object.keys(sampleAffiliate);
      console.log(allFields.join(', '));
      
      console.log('\n=== Name-related fields ===');
      const nameFields = allFields.filter(field => 
        field.toLowerCase().includes('name') || 
        field.toLowerCase().includes('first') || 
        field.toLowerCase().includes('last') ||
        field.toLowerCase().includes('full') ||
        field.toLowerCase().includes('display')
      );
      console.log('Name fields found:', nameFields);
      
      nameFields.forEach(field => {
        console.log(`  ${field}: "${sampleAffiliate[field]}"`);
      });
      
      // Check all affiliates for name patterns
      console.log('\n=== Checking all affiliates for name data ===');
      data.affiliates.forEach((affiliate, index) => {
        console.log(`\nAffiliate ${index + 1} (${affiliate.email}):`);
        nameFields.forEach(field => {
          if (affiliate[field]) {
            console.log(`  ${field}: "${affiliate[field]}"`);
          }
        });
        
        // Also check for any field that might contain a name
        Object.keys(affiliate).forEach(key => {
          const value = affiliate[key];
          if (typeof value === 'string' && value.length > 0 && 
              (value.includes(' ') || (value.length > 2 && !value.includes('@') && !value.includes('.')))) {
            console.log(`  Possible name in ${key}: "${value}"`);
          }
        });
      });
    }
    
  } catch (error) {
    console.error('Error exploring fields:', error);
  }
}

exploreAffiliateFields().catch(console.error); 