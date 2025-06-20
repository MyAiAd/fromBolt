// Test script to verify GHL API connection with provided credentials
console.log('🧪 Testing GHL API Connection\n');

const config = {
  apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI',
  locationId: 'w01Gc7T4b0tKSDQdKhuN',
  baseUrl: 'https://services.leadconnectorhq.com'
};

async function testGHLConnection() {
  console.log('📋 Configuration:');
  console.log(`Location ID: ${config.locationId}`);
  console.log(`API Key: ${config.apiKey.substring(0, 20)}...`);
  console.log(`Base URL: ${config.baseUrl}\n`);

  try {
    // Test 1: Fetch contacts
    console.log('🔄 Test 1: Fetching contacts...');
    const contactsUrl = `${config.baseUrl}/contacts/?locationId=${config.locationId}&limit=5`;
    
    const contactsResponse = await fetch(contactsUrl, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    });

    console.log(`Status: ${contactsResponse.status} ${contactsResponse.statusText}`);
    
    if (contactsResponse.ok) {
      const contactsData = await contactsResponse.json();
      console.log(`✅ Success! Found ${contactsData.contacts?.length || 0} contacts`);
      
      if (contactsData.contacts && contactsData.contacts.length > 0) {
        console.log('📊 Sample contact:');
        const sample = contactsData.contacts[0];
        console.log(`  - ID: ${sample.id}`);
        console.log(`  - Email: ${sample.email || 'N/A'}`);
        console.log(`  - Name: ${sample.firstName} ${sample.lastName}`);
        console.log(`  - Phone: ${sample.phone || 'N/A'}`);
        console.log(`  - Date Added: ${sample.dateAdded || 'N/A'}`);
      }
      
      console.log(`🔄 Total available: ${contactsData.meta?.total || 'Unknown'}`);
      if (contactsData.meta?.nextCursor) {
        console.log('📄 Has more pages available');
      }
    } else {
      const errorText = await contactsResponse.text();
      console.log(`❌ Error: ${errorText}`);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Fetch opportunities (orders)
    console.log('🔄 Test 2: Fetching opportunities...');
    const opportunitiesUrl = `${config.baseUrl}/opportunities/?locationId=${config.locationId}&limit=5`;
    
    const opportunitiesResponse = await fetch(opportunitiesUrl, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    });

    console.log(`Status: ${opportunitiesResponse.status} ${opportunitiesResponse.statusText}`);
    
    if (opportunitiesResponse.ok) {
      const opportunitiesData = await opportunitiesResponse.json();
      console.log(`✅ Success! Found ${opportunitiesData.opportunities?.length || 0} opportunities`);
      
      if (opportunitiesData.opportunities && opportunitiesData.opportunities.length > 0) {
        console.log('📊 Sample opportunity:');
        const sample = opportunitiesData.opportunities[0];
        console.log(`  - ID: ${sample.id}`);
        console.log(`  - Name: ${sample.name || 'N/A'}`);
        console.log(`  - Contact ID: ${sample.contactId || 'N/A'}`);
        console.log(`  - Status: ${sample.status || 'N/A'}`);
        console.log(`  - Monetary Value: $${sample.monetaryValue || 0}`);
        console.log(`  - Pipeline: ${sample.pipelineId || 'N/A'}`);
        console.log(`  - Stage: ${sample.stageId || 'N/A'}`);
        console.log(`  - Created: ${sample.dateCreated || 'N/A'}`);
      }
    } else {
      const errorText = await opportunitiesResponse.text();
      console.log(`❌ Error: ${errorText}`);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Fetch pipelines (to understand opportunity structure)
    console.log('🔄 Test 3: Fetching pipelines...');
    const pipelinesUrl = `${config.baseUrl}/opportunities/pipelines?locationId=${config.locationId}`;
    
    const pipelinesResponse = await fetch(pipelinesUrl, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    });

    console.log(`Status: ${pipelinesResponse.status} ${pipelinesResponse.statusText}`);
    
    if (pipelinesResponse.ok) {
      const pipelinesData = await pipelinesResponse.json();
      console.log(`✅ Success! Found ${pipelinesData.pipelines?.length || 0} pipelines`);
      
      if (pipelinesData.pipelines && pipelinesData.pipelines.length > 0) {
        console.log('📊 Available pipelines:');
        pipelinesData.pipelines.forEach((pipeline, index) => {
          console.log(`  ${index + 1}. ${pipeline.name} (ID: ${pipeline.id})`);
          if (pipeline.stages && pipeline.stages.length > 0) {
            console.log(`     Stages: ${pipeline.stages.map(s => s.name).join(', ')}`);
          }
        });
      }
    } else {
      const errorText = await pipelinesResponse.text();
      console.log(`❌ Error: ${errorText}`);
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

console.log('🚀 Starting GHL API connection test...\n');
testGHLConnection()
  .then(() => {
    console.log('\n✅ GHL API connection test completed!');
    console.log('\n📝 Next Steps:');
    console.log('1. If successful, the GHL service is ready for integration');
    console.log('2. The import service can now fetch real data from your GHL account');
    console.log('3. Run the affiliate import to populate your database');
  })
  .catch(error => {
    console.error('\n❌ Test failed:', error);
  }); 