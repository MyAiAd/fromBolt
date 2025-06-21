// Investigate why GHL import stops at 112 when there should be 300-400 contacts
import fetch from 'node-fetch';

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI';
const locationId = 'w01Gc7T4b0tKSDQdKhuN';

async function investigateFullImport() {
  console.log('🔍 Investigating GHL Import Gap: 112 vs 300-400 Expected');
  console.log('=' .repeat(60));
  console.log('');

  let allContacts = [];
  let page = 1;
  let consecutiveEmpty = 0;
  let lastResponseSize = 100;

  try {
    // Test different pagination methods
    console.log('📋 Testing pagination methods...');
    
    while (allContacts.length < 500 && consecutiveEmpty < 3 && page <= 50) {
      console.log(`📥 Page ${page}: Fetching contacts ${(page-1)*100 + 1}-${page*100}...`);
      
      // Method 1: Using skip parameter
      const url = `https://rest.gohighlevel.com/v1/contacts/?locationId=${locationId}&limit=100&skip=${(page - 1) * 100}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`❌ API Error on page ${page}:`);
        console.error(`   Status: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error(`   Details: ${errorText.substring(0, 200)}...`);
        break;
      }

      const data = await response.json();
      const contactCount = data.contacts?.length || 0;
      
      console.log(`   📊 Response: ${contactCount} contacts`);
      if (data.meta) {
        console.log(`   🔍 Meta: ${JSON.stringify(data.meta)}`);
      }
      
      if (contactCount > 0) {
        // Check for duplicates before adding
        const newContacts = data.contacts.filter(contact => 
          !allContacts.some(existing => existing.id === contact.id)
        );
        
        allContacts.push(...newContacts);
        console.log(`   ✅ Added ${newContacts.length} new (${contactCount - newContacts.length} duplicates)`);
        console.log(`   📈 Total unique: ${allContacts.length}`);
        
        consecutiveEmpty = 0;
        lastResponseSize = contactCount;
        
        // If we got less than 100, we might be at the end
        if (contactCount < 100) {
          console.log(`   🏁 Received ${contactCount} < 100, likely at end`);
          break;
        }
      } else {
        consecutiveEmpty++;
        console.log(`   ⚠️ Empty response ${consecutiveEmpty}/3`);
      }
      
      page++;
      
      // Rate limiting - be conservative
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL INVESTIGATION RESULTS:');
    console.log('='.repeat(60));
    console.log(`✅ Total unique contacts fetched: ${allContacts.length}`);
    console.log(`🎯 Expected contacts in GHL: 300-400`);
    console.log(`❌ Shortfall: ${Math.max(0, 300 - allContacts.length)} to ${Math.max(0, 400 - allContacts.length)} contacts`);
    console.log(`📊 Coverage: ${((allContacts.length / 350) * 100).toFixed(1)}% (assuming 350 total)`);
    
    if (allContacts.length < 250) {
      console.log('\n🔧 LIKELY ISSUES:');
      console.log('1. ❌ Skip parameter may not work with GHL v1 API');
      console.log('2. ❌ API may have different pagination mechanism'); 
      console.log('3. ❌ Some contacts filtered by location/status');
      console.log('4. ❌ Need to use different pagination approach');
      
      console.log('\n💡 NEXT STEPS:');
      console.log('1. Try cursor-based pagination if available');
      console.log('2. Check API documentation for correct pagination');
      console.log('3. Test with date filters or other parameters');
      console.log('4. Consider batch imports with different criteria');
    } else {
      console.log('\n✅ Import looks healthy - may be close to actual total');
    }
    
    // Show sample of what we got
    if (allContacts.length > 0) {
      console.log('\n📋 Sample contacts retrieved:');
      allContacts.slice(0, 3).forEach((contact, i) => {
        console.log(`   ${i+1}. ${contact.firstName || ''} ${contact.lastName || ''} (${contact.email})`);
      });
      
      console.log('\n📋 Last few contacts:');
      allContacts.slice(-3).forEach((contact, i) => {
        console.log(`   ${allContacts.length - 2 + i}. ${contact.firstName || ''} ${contact.lastName || ''} (${contact.email})`);
      });
    }

  } catch (error) {
    console.error('❌ Investigation failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

investigateFullImport().catch(console.error); 