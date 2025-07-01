// Investigate Recent Changes - What happened to 428 missing affiliates?
// This will look for recently modified, archived, or changed contacts

const TEST_CONFIG = {
  GHL_API_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI',
  GHL_LOCATION_ID: 'w01Gc7T4b0tKSDQdKhuN',
  BASE_URL: 'https://rest.gohighlevel.com/v1'
};

class RecentChangesInvestigator {
  constructor() {
    this.config = TEST_CONFIG;
    this.twoDaysAgo = new Date(Date.now() - (2 * 24 * 60 * 60 * 1000));
  }

  // Fetch all contacts with date information
  async fetchAllContactsWithDates() {
    console.log('🔍 Fetching ALL contacts with date tracking...');
    
    const allContacts = [];
    let skip = 0;
    const limit = 100;
    let hasMore = true;
    
    while (hasMore) {
      try {
        const url = `${this.config.BASE_URL}/contacts/?locationId=${this.config.GHL_LOCATION_ID}&limit=${limit}&skip=${skip}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${this.config.GHL_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`GHL API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.contacts && data.contacts.length > 0) {
          allContacts.push(...data.contacts);
          console.log(`   📥 Batch ${Math.floor(skip/100) + 1}: ${data.contacts.length} contacts (total: ${allContacts.length})`);
          
          hasMore = data.contacts.length === limit;
          skip += limit;
        } else {
          hasMore = false;
        }
        
        // Rate limiting
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
      } catch (error) {
        console.error(`❌ Error fetching contacts at skip ${skip}:`, error);
        break;
      }
    }

    console.log(`✅ Total contacts fetched: ${allContacts.length}`);
    return allContacts;
  }

  // Analyze recent changes
  async investigateRecentChanges() {
    console.log('🕵️ INVESTIGATING RECENT AFFILIATE CHANGES');
    console.log('Looking for what happened in the last 2 days...');
    console.log('═'.repeat(60));
    
    const allContacts = await this.fetchAllContactsWithDates();
    
    // 1. Check for recently modified contacts
    const recentlyModified = allContacts.filter(contact => {
      if (contact.dateUpdated) {
        const updateDate = new Date(contact.dateUpdated);
        return updateDate >= this.twoDaysAgo;
      }
      return false;
    });

    // 2. Check for recently added contacts  
    const recentlyAdded = allContacts.filter(contact => {
      if (contact.dateAdded) {
        const addDate = new Date(contact.dateAdded);
        return addDate >= this.twoDaysAgo;
      }
      return false;
    });

    // 3. Look for contacts with affiliate-related content but no campaign tags
    const potentialMissingAffiliates = allContacts.filter(contact => {
      const email = contact.email?.toLowerCase() || '';
      const source = contact.source?.toLowerCase() || '';
      const tags = contact.tags?.map(tag => tag.toLowerCase()) || [];
      const name = `${contact.firstName || ''} ${contact.lastName || ''}`.toLowerCase();

      // Has affiliate indicators but no campaign tags
      const hasAffiliateIndicators = 
        tags.some(tag => tag.includes('affiliate') || tag.includes('partner') || tag.includes('referral')) ||
        source.includes('affiliate') || source.includes('partner') || source.includes('rise') ||
        email.includes('affiliate') || name.includes('affiliate');

      const hasCampaignTags = tags.some(tag => 
        ['rego-rise66', 'jennaz-affiliate', 'reaction-affiliate'].includes(tag)
      );

      return hasAffiliateIndicators && !hasCampaignTags;
    });

    // 4. Check for any contacts with old affiliate-style tags
    const oldAffiliatePatterns = allContacts.filter(contact => {
      const tags = contact.tags?.map(tag => tag.toLowerCase()) || [];
      return tags.some(tag => 
        tag.includes('aff-') || tag.includes('ref-') || tag.includes('partner-') ||
        tag.includes('promo') || tag.includes('commission') || tag.includes('earn')
      );
    });

    // 5. Look for archived or inactive statuses
    const archivedContacts = allContacts.filter(contact => 
      contact.tags?.some(tag => tag.toLowerCase().includes('archived')) ||
      contact.tags?.some(tag => tag.toLowerCase().includes('inactive')) ||
      contact.tags?.some(tag => tag.toLowerCase().includes('disabled'))
    );

    // 6. Check for bulk tag changes
    const contactsWithLotsOfTags = allContacts.filter(contact => 
      contact.tags && contact.tags.length > 10
    );

    // 7. Look for contacts that might have had tags removed
    const suspiciousContacts = allContacts.filter(contact => {
      const hasBusinessProfile = contact.firstName && contact.lastName && contact.phone;
      const hasBusinessEmail = contact.email?.includes('.com') && !contact.email?.includes('gmail');
      const hasRecentActivity = contact.lastActivity && 
        new Date(contact.lastActivity) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      return hasBusinessProfile && hasBusinessEmail && hasRecentActivity && 
             (!contact.tags || contact.tags.length < 3);
    });

    return {
      totalContacts: allContacts.length,
      recentlyModified: recentlyModified.length,
      recentlyAdded: recentlyAdded.length,
      potentialMissingAffiliates: potentialMissingAffiliates.length,
      oldAffiliatePatterns: oldAffiliatePatterns.length,
      archivedContacts: archivedContacts.length,
      contactsWithLotsOfTags: contactsWithLotsOfTags.length,
      suspiciousContacts: suspiciousContacts.length,
      sampleData: {
        recentlyModified: recentlyModified.slice(0, 5),
        potentialMissing: potentialMissingAffiliates.slice(0, 5),
        suspicious: suspiciousContacts.slice(0, 5)
      }
    };
  }

  // Check for possible bulk operations
  async checkForBulkOperations() {
    console.log('\n🔧 CHECKING FOR BULK OPERATIONS');
    console.log('-'.repeat(40));
    
    // This would require checking GHL activity logs if available
    console.log('📋 Possible bulk operations in last 2 days:');
    console.log('   • Bulk tag removal/modification');
    console.log('   • Contact archiving/deletion');
    console.log('   • Campaign restructuring');
    console.log('   • Import/export operations');
    console.log('   • Integration changes');
    
    console.log('\n💡 To investigate further:');
    console.log('   1. Check GHL activity/audit logs');
    console.log('   2. Ask team about recent campaign changes');
    console.log('   3. Check for any bulk contact operations');
    console.log('   4. Verify if any integrations changed');
  }
}

// Main investigation function
async function runInvestigation() {
  console.log('🚨 URGENT: Missing 428 Affiliates Investigation');
  console.log('═'.repeat(60));
  console.log('Target: Find what happened to 481 → 53 affiliates in 2 days');
  console.log('');
  
  try {
    const investigator = new RecentChangesInvestigator();
    const analysis = await investigator.investigateRecentChanges();
    
    console.log('\n📊 INVESTIGATION RESULTS:');
    console.log(`📱 Total Contacts: ${analysis.totalContacts.toLocaleString()}`);
    console.log(`🔄 Recently Modified (2 days): ${analysis.recentlyModified.toLocaleString()}`);
    console.log(`➕ Recently Added (2 days): ${analysis.recentlyAdded.toLocaleString()}`);
    console.log(`🔍 Potential Missing Affiliates: ${analysis.potentialMissingAffiliates.toLocaleString()}`);
    console.log(`📜 Old Affiliate Patterns: ${analysis.oldAffiliatePatterns.toLocaleString()}`);
    console.log(`📦 Archived Contacts: ${analysis.archivedContacts.toLocaleString()}`);
    console.log(`🚩 Suspicious (missing tags): ${analysis.suspiciousContacts.toLocaleString()}`);
    
    // Show sample data
    if (analysis.sampleData.recentlyModified.length > 0) {
      console.log('\n🔄 RECENTLY MODIFIED SAMPLES:');
      analysis.sampleData.recentlyModified.forEach((contact, i) => {
        console.log(`   ${i+1}. ${contact.firstName} ${contact.lastName} (${contact.email})`);
        console.log(`      Updated: ${contact.dateUpdated}, Tags: ${contact.tags?.join(', ') || 'None'}`);
      });
    }

    if (analysis.sampleData.potentialMissing.length > 0) {
      console.log('\n🔍 POTENTIAL MISSING AFFILIATES:');
      analysis.sampleData.potentialMissing.forEach((contact, i) => {
        console.log(`   ${i+1}. ${contact.firstName} ${contact.lastName} (${contact.email})`);
        console.log(`      Source: ${contact.source}, Tags: ${contact.tags?.join(', ') || 'None'}`);
      });
    }

    if (analysis.sampleData.suspicious.length > 0) {
      console.log('\n🚩 SUSPICIOUS (Business profiles with few tags):');
      analysis.sampleData.suspicious.forEach((contact, i) => {
        console.log(`   ${i+1}. ${contact.firstName} ${contact.lastName} (${contact.email})`);
        console.log(`      Tags: ${contact.tags?.join(', ') || 'None'}, Activity: ${contact.lastActivity}`);
      });
    }

    // Analysis summary
    console.log('\n💡 LIKELY SCENARIOS:');
    console.log('═'.repeat(50));
    
    if (analysis.recentlyModified > 400) {
      console.log('🎯 HIGH PROBABILITY: Bulk tag modification operation');
      console.log('   • 400+ contacts modified recently');
      console.log('   • Campaign tags likely removed/changed');
    } else if (analysis.potentialMissingAffiliates > 300) {
      console.log('🎯 HIGH PROBABILITY: Tag restructuring');
      console.log('   • Many contacts have affiliate indicators but no campaign tags');
      console.log('   • Tags may have been renamed or removed');
    } else if (analysis.suspiciousContacts > 300) {
      console.log('🎯 HIGH PROBABILITY: Mass tag removal');
      console.log('   • Business profiles missing expected tags');
      console.log('   • Bulk operation likely removed affiliate tags');
    } else {
      console.log('🟡 UNCLEAR: May need manual investigation');
      console.log('   • Check GHL activity logs');
      console.log('   • Ask team about recent changes');
    }

    await investigator.checkForBulkOperations();
    
    // Recommendations
    console.log('\n🚀 IMMEDIATE ACTIONS:');
    console.log('═'.repeat(40));
    console.log('1. 🔍 Check GHL activity/audit logs for last 2 days');
    console.log('2. 📞 Ask team about recent campaign/tag changes');
    console.log('3. ✅ Proceed with First Promoter as reliable backup');
    console.log('4. 🔄 Consider restoring from backup if available');
    console.log('5. 📊 Set up monitoring to prevent future data loss');
    
  } catch (error) {
    console.error('❌ Investigation failed:', error.message);
  }
}

// Add fetch support
if (typeof fetch === 'undefined') {
  global.fetch = (await import('node-fetch')).default;
}

// Run the investigation
runInvestigation().catch(console.error); 