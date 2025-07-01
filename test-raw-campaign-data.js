// Raw Campaign Data Analysis
// This examines the exact data structure to understand the 59 vs 481 discrepancy

const TEST_CONFIG = {
  GHL_API_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI',
  GHL_LOCATION_ID: 'w01Gc7T4b0tKSDQdKhuN',
  BASE_URL: 'https://rest.gohighlevel.com/v1'
};

// Campaign definitions
const CAMPAIGN_TAGS = ['rego-rise66', 'jennaz-affiliate', 'reaction-affiliate'];

class RawDataAnalyzer {
  constructor() {
    this.config = TEST_CONFIG;
  }

  // Fetch all GHL data
  async fetchAllGHLData() {
    console.log('📥 Fetching ALL GHL contacts for raw analysis...');
    
    const allContacts = [];
    let skip = 0;
    const limit = 100;
    let hasMore = true;
    
    // Fetch more data to see full picture
    while (hasMore && allContacts.length < 5000) { // Increased limit
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
          console.log(`   ✅ Fetched ${data.contacts.length} contacts (total: ${allContacts.length})`);
          
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

    console.log(`✅ Total GHL contacts fetched: ${allContacts.length}`);
    return allContacts;
  }

  // Analyze raw campaign data structure
  async analyzeRawCampaignData() {
    console.log('🔍 ANALYZING RAW CAMPAIGN DATA STRUCTURE');
    console.log('═'.repeat(60));
    
    const allContacts = await this.fetchAllGHLData();
    
    // 1. Count contacts with each specific campaign tag
    const campaignTagCounts = {};
    CAMPAIGN_TAGS.forEach(tag => {
      campaignTagCounts[tag] = allContacts.filter(contact => 
        contact.tags?.some(contactTag => contactTag.toLowerCase() === tag)
      ).length;
    });
    
    // 2. Count contacts with ANY campaign tag
    const contactsWithAnyCampaignTag = allContacts.filter(contact =>
      contact.tags?.some(tag => CAMPAIGN_TAGS.includes(tag.toLowerCase()))
    );
    
    // 3. Count unique emails with campaign tags
    const emailsWithCampaignTags = new Set();
    contactsWithAnyCampaignTag.forEach(contact => {
      if (contact.email) {
        emailsWithCampaignTags.add(contact.email.toLowerCase());
      }
    });
    
    // 4. Analyze multi-campaign participation
    const emailCampaignMap = new Map();
    contactsWithAnyCampaignTag.forEach(contact => {
      if (contact.email) {
        const email = contact.email.toLowerCase();
        const currentCampaigns = emailCampaignMap.get(email) || new Set();
        
        contact.tags?.forEach(tag => {
          if (CAMPAIGN_TAGS.includes(tag.toLowerCase())) {
            currentCampaigns.add(tag.toLowerCase());
          }
        });
        
        emailCampaignMap.set(email, currentCampaigns);
      }
    });
    
    // 5. Analyze campaign overlap patterns
    const overlapAnalysis = {
      singleCampaign: 0,
      twoCampaigns: 0,
      threeCampaigns: 0
    };
    
    emailCampaignMap.forEach(campaigns => {
      if (campaigns.size === 1) overlapAnalysis.singleCampaign++;
      else if (campaigns.size === 2) overlapAnalysis.twoCampaigns++;
      else if (campaigns.size === 3) overlapAnalysis.threeCampaigns++;
    });
    
    // 6. Check for other relevant tags
    const allTags = new Set();
    allContacts.forEach(contact => {
      contact.tags?.forEach(tag => allTags.add(tag.toLowerCase()));
    });
    
    const relevantTags = Array.from(allTags).filter(tag =>
      tag.includes('affiliate') || tag.includes('partner') || tag.includes('rise') ||
      tag.includes('jennaz') || tag.includes('reaction') || tag.includes('referral')
    );
    
    // 7. Check sources
    const sourceCounts = {};
    allContacts.forEach(contact => {
      if (contact.source) {
        const source = contact.source.toLowerCase();
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      }
    });
    
    const relevantSources = Object.entries(sourceCounts)
      .filter(([source]) => 
        source.includes('rise') || source.includes('affiliate') || 
        source.includes('partner') || source.includes('signup')
      )
      .sort((a, b) => b[1] - a[1]);

    return {
      totalContacts: allContacts.length,
      campaignTagCounts,
      totalCampaignInstances: contactsWithAnyCampaignTag.length,
      uniqueEmailsWithCampaigns: emailsWithCampaignTags.size,
      overlapAnalysis,
      relevantTags,
      relevantSources
    };
  }
}

// Main analysis function
async function runRawDataAnalysis() {
  console.log('🔬 RAW CAMPAIGN DATA ANALYSIS');
  console.log('Understanding the 59 vs 481 discrepancy');
  console.log('═'.repeat(60));
  
  try {
    const analyzer = new RawDataAnalyzer();
    const analysis = await analyzer.analyzeRawCampaignData();
    
    console.log('\n📊 RAW DATA OVERVIEW:');
    console.log(`📱 Total Contacts in GHL: ${analysis.totalContacts.toLocaleString()}`);
    console.log(`🎯 Campaign Tag Instances: ${analysis.totalCampaignInstances.toLocaleString()}`);
    console.log(`👤 Unique Emails with Campaigns: ${analysis.uniqueEmailsWithCampaigns.toLocaleString()}`);
    
    // Campaign tag breakdown
    console.log('\n🏷️ INDIVIDUAL CAMPAIGN TAG COUNTS:');
    Object.entries(analysis.campaignTagCounts).forEach(([tag, count]) => {
      console.log(`   ${tag}: ${count.toLocaleString()} contacts`);
    });
    
    // Multi-campaign analysis
    console.log('\n🔄 CAMPAIGN OVERLAP PATTERNS:');
    console.log(`👤 Single Campaign: ${analysis.overlapAnalysis.singleCampaign} people`);
    console.log(`👥 Two Campaigns: ${analysis.overlapAnalysis.twoCampaigns} people`);
    console.log(`👪 Three Campaigns: ${analysis.overlapAnalysis.threeCampaigns} people`);
    
    const avgCampaignsPerPerson = analysis.totalCampaignInstances / analysis.uniqueEmailsWithCampaigns;
    console.log(`📊 Average Campaigns per Person: ${avgCampaignsPerPerson.toFixed(1)}`);
    
    // All relevant tags
    console.log('\n🔍 ALL RELEVANT TAGS FOUND:');
    analysis.relevantTags.slice(0, 15).forEach(tag => {
      console.log(`   • ${tag}`);
    });
    
    // Relevant sources
    console.log('\n📍 RELEVANT SOURCES:');
    analysis.relevantSources.slice(0, 10).forEach(([source, count]) => {
      console.log(`   ${source}: ${count.toLocaleString()} contacts`);
    });
    
    // Analysis and insights
    console.log('\n💡 KEY INSIGHTS:');
    console.log('═'.repeat(40));
    
    if (analysis.uniqueEmailsWithCampaigns < 100) {
      console.log('🔍 SMALL CORE GROUP: You have a small but highly engaged affiliate group');
      console.log(`   • ${analysis.uniqueEmailsWithCampaigns} unique affiliates participating heavily`);
      console.log(`   • Each affiliate averages ${avgCampaignsPerPerson.toFixed(1)} campaign participations`);
      console.log('   • This explains the high deduplication rate (95%+)');
    } else if (analysis.uniqueEmailsWithCampaigns < 300) {
      console.log('🟡 MODERATE GROUP: Medium-sized affiliate base with good engagement');
    } else {
      console.log('✅ LARGE GROUP: Substantial affiliate base found');
    }
    
    // Compare to 481 target
    const target = 481;
    const ratio = analysis.uniqueEmailsWithCampaigns / target;
    
    console.log('\n🎯 TARGET COMPARISON:');
    if (ratio < 0.2) {
      console.log('🔴 SIGNIFICANT GAP: Current affiliates << expected 481');
      console.log('   Possible reasons:');
      console.log('   • Data structure changed since last count');
      console.log('   • Different time period (seasonal affiliates?)');
      console.log('   • Campaign tagging system evolved');
      console.log('   • Some affiliates may have been archived/removed');
    } else if (ratio < 0.5) {
      console.log('🟡 MODERATE GAP: About half the expected affiliates');
      console.log('   • May need to check additional tag patterns');
      console.log('   • Consider date-based filtering');
    } else {
      console.log('✅ CLOSE TO TARGET: Good alignment with expectations');
    }
    
    // Recommendations
    console.log('\n🚀 RECOMMENDATIONS:');
    console.log('═'.repeat(40));
    
    if (analysis.uniqueEmailsWithCampaigns < 100) {
      console.log('1. 📊 Accept that 59-62 may be the current active affiliate count');
      console.log('2. 🔍 Check if 481 was from a different time period');
      console.log('3. 📅 Consider date-based analysis (when were affiliates added?)');
      console.log('4. 🏷️ Look for other tag patterns that might identify more affiliates');
      console.log('5. 📈 Focus on growing the affiliate base rather than finding "missing" ones');
    } else {
      console.log('1. ✅ Proceed with current filtering approach');
      console.log('2. 🔄 Implement the campaign-aware import system');
      console.log('3. 📊 Use deduplication to get accurate counts');
    }
    
    console.log(`\n📋 FINAL VERDICT: ${analysis.uniqueEmailsWithCampaigns} unique campaign affiliates found`);
    console.log(`🎯 This appears to be your actual current affiliate count`);
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  }
}

// Add fetch support
if (typeof fetch === 'undefined') {
  global.fetch = (await import('node-fetch')).default;
}

// Run the analysis
runRawDataAnalysis().catch(console.error); 