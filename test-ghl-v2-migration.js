// Test script to compare GHL v1 vs v2 API performance and capabilities
import fetch from 'node-fetch';

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI';
const locationId = 'w01Gc7T4b0tKSDQdKhuN';

async function testV1API() {
  console.log('\n🧪 Testing GHL API v1...');
  
  const startTime = new Date();
  let allContacts = [];
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore && allContacts.length < 500) { // Limit for testing
      console.log(`📥 v1 - Fetching page ${page}...`);
      
      const response = await fetch(`https://rest.gohighlevel.com/v1/contacts/?locationId=${locationId}&limit=100`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log(`❌ v1 Error: ${response.status} - ${errorText}`);
        break;
      }

      const data = await response.json();
      
      if (data.contacts && data.contacts.length > 0) {
        allContacts.push(...data.contacts);
        console.log(`✅ v1 - Page ${page}: ${data.contacts.length} contacts (total: ${allContacts.length})`);
        
        // v1 doesn't have cursor pagination, so we check if we got less than limit
        hasMore = data.contacts.length === 100;
        page++;
      } else {
        hasMore = false;
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 250));
    }

    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;

    console.log(`\n📊 v1 Results:`);
    console.log(`✅ Total contacts: ${allContacts.length}`);
    console.log(`⏱️ Time taken: ${duration}s`);
    console.log(`🔄 Requests made: ${page - 1}`);
    console.log(`⚡ Avg contacts per second: ${(allContacts.length / duration).toFixed(2)}`);

    return {
      version: 'v1',
      contacts: allContacts.length,
      duration,
      requests: page - 1,
      contactsPerSecond: allContacts.length / duration
    };

  } catch (error) {
    console.error('❌ v1 Error:', error.message);
    return null;
  }
}

async function testV2API() {
  console.log('\n🧪 Testing GHL API v2...');
  
  const startTime = new Date();
  let allContacts = [];
  let cursor = null;
  let page = 1;

  try {
    do {
      console.log(`📥 v2 - Fetching page ${page}...`);
      
      let url = `https://services.leadconnectorhq.com/contacts/?locationId=${locationId}&limit=100`;
      if (cursor) {
        url += `&cursor=${cursor}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log(`❌ v2 Error: ${response.status} - ${errorText}`);
        break;
      }

      const data = await response.json();
      
      if (data.contacts && data.contacts.length > 0) {
        allContacts.push(...data.contacts);
        console.log(`✅ v2 - Page ${page}: ${data.contacts.length} contacts (total: ${allContacts.length})`);
      }

      cursor = data.meta?.nextCursor || null;
      page++;

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 250));
      
    } while (cursor && allContacts.length < 500); // Limit for testing

    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;

    console.log(`\n📊 v2 Results:`);
    console.log(`✅ Total contacts: ${allContacts.length}`);
    console.log(`⏱️ Time taken: ${duration}s`);
    console.log(`🔄 Requests made: ${page - 1}`);
    console.log(`⚡ Avg contacts per second: ${(allContacts.length / duration).toFixed(2)}`);

    return {
      version: 'v2',
      contacts: allContacts.length,
      duration,
      requests: page - 1,
      contactsPerSecond: allContacts.length / duration
    };

  } catch (error) {
    console.error('❌ v2 Error:', error.message);
    return null;
  }
}

async function compareAPIs() {
  console.log('🚀 GHL API v1 vs v2 Comparison Test');
  console.log('=' .repeat(50));

  const v1Results = await testV1API();
  const v2Results = await testV2API();

  console.log('\n📈 Comparison Summary:');
  console.log('=' .repeat(50));

  if (v1Results && v2Results) {
    console.log(`📊 Contacts Retrieved:`);
    console.log(`   v1: ${v1Results.contacts} contacts`);
    console.log(`   v2: ${v2Results.contacts} contacts`);
    
    console.log(`⏱️ Performance:`);
    console.log(`   v1: ${v1Results.duration.toFixed(2)}s (${v1Results.contactsPerSecond.toFixed(2)} contacts/sec)`);
    console.log(`   v2: ${v2Results.duration.toFixed(2)}s (${v2Results.contactsPerSecond.toFixed(2)} contacts/sec)`);
    
    console.log(`🔄 API Efficiency:`);
    console.log(`   v1: ${v1Results.requests} requests`);
    console.log(`   v2: ${v2Results.requests} requests`);

    if (v2Results.contacts > v1Results.contacts) {
      console.log(`\n✅ v2 API retrieved ${v2Results.contacts - v1Results.contacts} more contacts!`);
    } else if (v1Results.contacts > v2Results.contacts) {
      console.log(`\n⚠️ v1 API retrieved ${v1Results.contacts - v2Results.contacts} more contacts`);
    } else {
      console.log(`\n🤝 Both APIs retrieved the same number of contacts`);
    }

    // Recommendation
    console.log(`\n💡 Recommendation for your 300-400 affiliates:`);
    if (v2Results.contacts > 100 || v2Results.contactsPerSecond > v1Results.contactsPerSecond) {
      console.log(`🎯 Switch to v2 API - it shows better handling of larger datasets`);
      console.log(`🔧 Migration complexity: LOW-MEDIUM (mainly authentication changes)`);
      console.log(`⚡ Expected improvement: Better pagination, potentially higher throughput`);
    } else {
      console.log(`🤔 v1 API seems sufficient, but v2 has better long-term support`);
      console.log(`📚 Consider v2 migration for future-proofing`);
    }

  } else {
    if (!v1Results) console.log('❌ v1 API test failed');
    if (!v2Results) console.log('❌ v2 API test failed');
  }

  console.log(`\n🔧 Next Steps:`);
  console.log(`1. If v2 works: Update your import service configuration`);
  console.log(`2. Test with your actual import flow`);
  console.log(`3. Monitor for any authentication token issues`);
  console.log(`4. Consider implementing OAuth 2.0 for production use`);
}

compareAPIs().catch(console.error); 