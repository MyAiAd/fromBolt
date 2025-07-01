// Simplified Campaign Filter Test
// This version trusts campaign tags as the primary affiliate indicator

const TEST_CONFIG = {
  GHL_API_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI',
  GHL_LOCATION_ID: 'w01Gc7T4b0tKSDQdKhuN',
  BASE_URL: 'https://rest.gohighlevel.com/v1'
};

// Campaign definitions
const CAMPAIGN_TAGS = {
  'rego-rise66': 'The RISE Campaign',
  'jennaz-affiliate': 'JennaZ Affiliate Campaign', 
  'reaction-affiliate': 'ReAction Affiliate Campaign'
};

const CAMPAIGN_SOURCES = {
  'rise signup': 'The RISE Campaign',
  'affiliate signup': 'General Affiliate Campaign',
  'partner signup': 'Partner Campaign'
};

class SimplifiedCampaignAnalyzer {
  constructor() {
    this.config = TEST_CONFIG;
  }

  // Simplified affiliate identification - trust campaign tags first
  isAffiliate(contact) {
    const email = contact.email?.toLowerCase() || '';
    const source = contact.source?.toLowerCase() || '';
    const tags = contact.tags?.map(tag => tag.toLowerCase()) || [];

    // PRIORITY 1: Campaign tags (high confidence)
    const hasCampaignTag = tags.some(tag => Object.keys(CAMPAIGN_TAGS).includes(tag));
    if (hasCampaignTag) {
      return true; // If they have a campaign tag, they're an affiliate
    }

    // PRIORITY 2: Campaign sources (high confidence)  
    const hasCampaignSource = Object.keys(CAMPAIGN_SOURCES).some(campaignSource => 
      source.includes(campaignSource)
    );
    if (hasCampaignSource) {
      return true; // If they came from a campaign source, they're an affiliate
    }

    // PRIORITY 3: General affiliate indicators (medium confidence)
    const hasAffiliateIndicator = 
      tags.some(tag => tag.includes('affiliate') || tag.includes('partner') || tag.includes('referral')) ||
      source.includes('affiliate') || source.includes('partner') || source.includes('referral');
    
    if (hasAffiliateIndicator) {
      return true; // General affiliate indicators
    }

    // PRIORITY 4: Professional profiles (basic validation)
    const hasCompleteProfile = [contact.firstName, contact.lastName, contact.email].filter(Boolean).length === 3;
    const hasBusinessEmail = email.includes('.com') && !email.includes('gmail') && !email.includes('yahoo');
    
    if (hasCompleteProfile && hasBusinessEmail) {
      return true; // Professional profile suggests business/affiliate contact
    }

    return false; // Not an affiliate
  }

  // Get campaigns for a contact
  getCampaignsForContact(contact) {
    const campaigns = [];
    const tags = contact.tags?.map(tag => tag.toLowerCase()) || [];
    const source = contact.source?.toLowerCase() || '';

    // Check campaign tags
    Object.entries(CAMPAIGN_TAGS).forEach(([tag, campaignName]) => {
      if (tags.includes(tag)) {
        campaigns.push(campaignName);
      }
    });

    // Check campaign sources
    Object.entries(CAMPAIGN_SOURCES).forEach(([sourceKeyword, campaignName]) => {
      if (source.includes(sourceKeyword)) {
        campaigns.push(campaignName);
      }
    });

    return [...new Set(campaigns)];
  }

  // Deduplicate contacts by email
  deduplicateByEmail(contacts) {
    const emailMap = new Map();

    contacts.forEach(contact => {
      const email = contact.email.toLowerCase();
      const existing = emailMap.get(email);

      if (!existing) {
        emailMap.set(email, contact);
      } else {
        // Merge campaign information from both records
        const mergedContact = { ...existing };
        mergedContact.tags = [...new Set([...(existing.tags || []), ...(contact.tags || [])])];
        
        // Keep the record with more complete information
        if (contact.firstName || contact.lastName || contact.phone) {
          mergedContact.firstName = mergedContact.firstName || contact.firstName;
          mergedContact.lastName = mergedContact.lastName || contact.lastName;
          mergedContact.phone = mergedContact.phone || contact.phone;
        }
        
        emailMap.set(email, mergedContact);
      }
    });

    return Array.from(emailMap.values());
  }

  // Fetch GHL data
  async fetchGHLContacts() {
    console.log('📥 Fetching GHL contacts with simplified filtering...');
    
    const allContacts = [];
    let skip = 0;
    const limit = 100;
    let hasMore = true;
    
    while (hasMore && allContacts.length < 2000) {
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
          
          hasMore = data.contacts.length === limit;
          skip += limit;
        } else {
          hasMore = false;
        }
        
        // Rate limiting
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
      } catch (error) {
        console.error(`❌ Error fetching contacts at skip ${skip}:`, error);
        break;
      }
    }

    console.log(`✅ Total GHL contacts fetched: ${allContacts.length}`);
    return allContacts;
  }

  // Analyze with simplified filtering
  async analyzeWithSimplifiedFiltering() {
    console.log('🔍 Analyzing with simplified campaign-first filtering...');
    
    const allContacts = await this.fetchGHLContacts();
    
    // Show breakdown by filter priority
    let campaignTagged = 0;
    let campaignSourced = 0;
    let generalAffiliate = 0;
    let professionalProfile = 0;
    
    const affiliateContacts = allContacts.filter(contact => {
      const tags = contact.tags?.map(tag => tag.toLowerCase()) || [];
      const source = contact.source?.toLowerCase() || '';
      const email = contact.email?.toLowerCase() || '';
      
      // Check each priority level
      if (tags.some(tag => Object.keys(CAMPAIGN_TAGS).includes(tag))) {
        campaignTagged++;
        return true;
      }
      
      if (Object.keys(CAMPAIGN_SOURCES).some(campaignSource => source.includes(campaignSource))) {
        campaignSourced++;
        return true;
      }
      
      if (tags.some(tag => tag.includes('affiliate') || tag.includes('partner')) || 
          source.includes('affiliate') || source.includes('partner')) {
        generalAffiliate++;
        return true;
      }
      
      const hasCompleteProfile = [contact.firstName, contact.lastName, contact.email].filter(Boolean).length === 3;
      const hasBusinessEmail = email.includes('.com') && !email.includes('gmail') && !email.includes('yahoo');
      
      if (hasCompleteProfile && hasBusinessEmail) {
        professionalProfile++;
        return true;
      }
      
      return false;
    });
    
    const uniqueAffiliates = this.deduplicateByEmail(affiliateContacts);
    
    // Campaign analysis
    const campaignBreakdown = {};
    affiliateContacts.forEach(contact => {
      const campaigns = this.getCampaignsForContact(contact);
      campaigns.forEach(campaign => {
        campaignBreakdown[campaign] = (campaignBreakdown[campaign] || 0) + 1;
      });
    });

    return {
      totalContacts: allContacts.length,
      affiliateInstances: affiliateContacts.length,
      uniqueAffiliates: uniqueAffiliates.length,
      campaignBreakdown,
      filterBreakdown: {
        campaignTagged,
        campaignSourced,
        generalAffiliate,
        professionalProfile
      }
    };
  }
}

// Main test function  
async function runSimplifiedAnalysis() {
  console.log('🧪 Simplified Campaign Analysis - Trust Campaign Tags');
  console.log('═'.repeat(60));
  
  try {
    const analyzer = new SimplifiedCampaignAnalyzer();
    const analysis = await analyzer.analyzeWithSimplifiedFiltering();
    
    console.log('\n📈 SIMPLIFIED FILTERING RESULTS:');
    console.log(`📱 Total Contacts: ${analysis.totalContacts.toLocaleString()}`);
    console.log(`🎯 Affiliate Instances: ${analysis.affiliateInstances.toLocaleString()}`);
    console.log(`👤 Unique Affiliates: ${analysis.uniqueAffiliates.toLocaleString()}`);
    console.log(`🔄 Campaign Overlap: ${(analysis.affiliateInstances - analysis.uniqueAffiliates).toLocaleString()} duplicates`);
    
    if (analysis.affiliateInstances > 0) {
      const dedupeRate = ((analysis.affiliateInstances - analysis.uniqueAffiliates) / analysis.affiliateInstances * 100);
      console.log(`📊 Deduplication Rate: ${dedupeRate.toFixed(1)}%`);
    }
    
    // Filter breakdown
    console.log('\n🎯 FILTER BREAKDOWN:');
    console.log(`🏷️ Campaign Tagged: ${analysis.filterBreakdown.campaignTagged.toLocaleString()}`);
    console.log(`📍 Campaign Sourced: ${analysis.filterBreakdown.campaignSourced.toLocaleString()}`);
    console.log(`🔗 General Affiliate: ${analysis.filterBreakdown.generalAffiliate.toLocaleString()}`);
    console.log(`💼 Professional Profile: ${analysis.filterBreakdown.professionalProfile.toLocaleString()}`);
    
    // Target comparison
    const targetCount = 481;
    if (analysis.uniqueAffiliates > 0) {
      const achievement = (analysis.uniqueAffiliates / targetCount) * 100;
      const difference = Math.abs(analysis.uniqueAffiliates - targetCount);
      
      console.log('\n🎯 TARGET COMPARISON:');
      console.log(`📋 Expected Affiliates: ${targetCount}`);
      console.log(`✅ Found Unique Affiliates: ${analysis.uniqueAffiliates}`);
      console.log(`📊 Achievement: ${achievement.toFixed(1)}%`);
      console.log(`📏 Difference: ${difference} affiliates`);
      
      if (achievement >= 90 && achievement <= 110) {
        console.log('🎉 EXCELLENT: Within 10% of target!');
      } else if (achievement >= 80 && achievement <= 120) {
        console.log('✅ GOOD: Within 20% of target');
      } else if (achievement >= 50) {
        console.log('🟡 MODERATE: Getting closer to target');
      } else {
        console.log('🔴 LOW: Still needs adjustment');
      }
    }
    
    // Campaign breakdown
    if (Object.keys(analysis.campaignBreakdown).length > 0) {
      console.log('\n🎪 CAMPAIGN BREAKDOWN:');
      Object.entries(analysis.campaignBreakdown).forEach(([campaign, count]) => {
        console.log(`   📋 ${campaign}: ${count.toLocaleString()} participations`);
      });
    }
    
    // Summary
    console.log('\n📋 SUMMARY & RECOMMENDATIONS');
    console.log('═'.repeat(60));
    
    if (analysis.uniqueAffiliates >= 400) {
      console.log('🎉 SUCCESS: Simplified filtering gets close to target!');
      console.log('👉 RECOMMENDATION: Use this simplified approach');
    } else if (analysis.uniqueAffiliates >= 200) {
      console.log('🟡 PROGRESS: Better results with simplified filtering');
      console.log('👉 RECOMMENDATION: Fine-tune professional profile criteria');
    } else {
      console.log('🔴 ISSUE: Even simplified filtering is too restrictive');
      console.log('👉 RECOMMENDATION: Consider campaign-tags-only approach');
    }
    
    console.log(`\n🔄 Next: Compare ${analysis.uniqueAffiliates} vs previous 62 affiliates`);
    console.log(`📈 Improvement: ${Math.round((analysis.uniqueAffiliates / 62) * 100)}% vs restrictive filtering`);
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  }
}

// Add fetch support
if (typeof fetch === 'undefined') {
  global.fetch = (await import('node-fetch')).default;
}

// Run the test
runSimplifiedAnalysis().catch(console.error); 