// Standalone Campaign Analysis Test (JavaScript)
// This analyzes the 3-campaign structure and shows deduplication results

// Test configuration using your real GHL credentials
const TEST_CONFIG = {
  GHL_API_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI',
  GHL_LOCATION_ID: 'w01Gc7T4b0tKSDQdKhuN',
  BASE_URL: 'https://rest.gohighlevel.com/v1'
};

// Campaign definitions (based on your setup)
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

class CampaignAnalyzer {
  constructor() {
    this.config = TEST_CONFIG;
  }

  // Check if contact is an affiliate using campaign-aware logic
  isAffiliate(contact) {
    const email = contact.email?.toLowerCase() || '';
    const source = contact.source?.toLowerCase() || '';
    const tags = contact.tags?.map(tag => tag.toLowerCase()) || [];
    const customFields = contact.customFields || {};

    // Campaign-specific strong indicators
    const campaignIndicators = [
      // Known campaign tags
      tags.some(tag => Object.keys(CAMPAIGN_TAGS).includes(tag)),
      
      // Known campaign sources  
      Object.keys(CAMPAIGN_SOURCES).some(campaignSource => 
        source.includes(campaignSource)
      )
    ];

    // General affiliate indicators
    const strongIndicators = [
      ...campaignIndicators,
      
      // General affiliate tags
      tags.some(tag => 
        tag.includes('affiliate') ||
        tag.includes('partner') ||
        tag.includes('referral') ||
        tag.includes('promoter')
      ),
      
      // General affiliate sources
      source.includes('affiliate') ||
      source.includes('partner') ||
      source.includes('referral'),
      
      // Custom field indicators
      Object.keys(customFields).some(key => {
        const fieldKey = key.toLowerCase();
        const fieldValue = String(customFields[key]).toLowerCase();
        return fieldKey.includes('affiliate') ||
               fieldKey.includes('partner') ||
               fieldValue.includes('affiliate') ||
               fieldValue.includes('partner');
      })
    ];

    // Moderate indicators
    const moderateIndicators = [
      !!contact.referralCode,
      contact.phone?.includes('+1') && contact.phone.length > 12,
      contact.dateAdded ? this.isRecentSignup(contact.dateAdded) : false
    ];

    // Weak indicators
    const weakIndicators = [
      [contact.firstName, contact.lastName, contact.phone, contact.email].filter(Boolean).length >= 3,
      contact.lastActivity ? this.isRecentActivity(contact.lastActivity) : false,
      email.includes('.com') && !email.includes('gmail') && !email.includes('yahoo') && !email.includes('hotmail')
    ];

    // Scoring system
    const strongScore = strongIndicators.filter(Boolean).length * 3;
    const moderateScore = moderateIndicators.filter(Boolean).length * 2;
    const weakScore = weakIndicators.filter(Boolean).length * 1;
    const totalScore = strongScore + moderateScore + weakScore;

    return strongScore > 0 || totalScore >= 4;
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

    return [...new Set(campaigns)]; // Remove duplicates
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
        // Keep the contact with more complete information
        const currentScore = this.getCompletenessScore(contact);
        const existingScore = this.getCompletenessScore(existing);
        
        if (currentScore > existingScore) {
          // Merge campaign information
          const mergedContact = { ...contact };
          mergedContact.tags = [...new Set([...(existing.tags || []), ...(contact.tags || [])])];
          emailMap.set(email, mergedContact);
        } else {
          // Merge tags into existing contact
          const mergedContact = { ...existing };
          mergedContact.tags = [...new Set([...(existing.tags || []), ...(contact.tags || [])])];
          emailMap.set(email, mergedContact);
        }
      }
    });

    return Array.from(emailMap.values());
  }

  getCompletenessScore(contact) {
    let score = 0;
    if (contact.firstName) score++;
    if (contact.lastName) score++;
    if (contact.phone) score++;
    if (contact.dateAdded) score++;
    if (contact.lastActivity) score++;
    if (contact.referralCode) score++;
    if (contact.tags && contact.tags.length > 0) score++;
    if (contact.customFields && Object.keys(contact.customFields).length > 0) score++;
    return score;
  }

  isRecentSignup(dateAdded) {
    const signupDate = new Date(dateAdded);
    const now = new Date();
    const daysDiff = (now.getTime() - signupDate.getTime()) / (1000 * 3600 * 24);
    return daysDiff < 365;
  }

  isRecentActivity(lastActivity) {
    const activityDate = new Date(lastActivity);
    const now = new Date();
    const daysDiff = (now.getTime() - activityDate.getTime()) / (1000 * 3600 * 24);
    return daysDiff < 90;
  }

  // Fetch real GHL data
  async fetchGHLContacts() {
    console.log('📥 Fetching real GHL contacts...');
    
    const allContacts = [];
    let skip = 0;
    const limit = 100;
    let hasMore = true;
    
    while (hasMore && allContacts.length < 2000) { // Safety limit
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

  // Analyze campaign patterns
  async analyzeContactPatterns() {
    console.log('🔍 Analyzing GHL contact patterns with campaign awareness...');
    
    const allContacts = await this.fetchGHLContacts();
    const affiliateContacts = allContacts.filter(contact => this.isAffiliate(contact));
    const uniqueAffiliates = this.deduplicateByEmail(affiliateContacts);
    
    // Campaign analysis
    const campaignBreakdown = {};
    affiliateContacts.forEach(contact => {
      const campaigns = this.getCampaignsForContact(contact);
      campaigns.forEach(campaign => {
        campaignBreakdown[campaign] = (campaignBreakdown[campaign] || 0) + 1;
      });
    });

    // Tag and source analysis
    const tagCounts = {};
    const sourceCounts = {};
    
    allContacts.forEach(contact => {
      contact.tags?.forEach(tag => {
        const normalizedTag = tag.toLowerCase().trim();
        tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
      });
      
      if (contact.source) {
        const normalizedSource = contact.source.toLowerCase().trim();
        sourceCounts[normalizedSource] = (sourceCounts[normalizedSource] || 0) + 1;
      }
    });

    return {
      totalContacts: allContacts.length,
      affiliateInstances: affiliateContacts.length,
      uniqueAffiliates: uniqueAffiliates.length,
      campaignBreakdown,
      tagAnalysis: tagCounts,
      sourceAnalysis: sourceCounts
    };
  }
}

// Main test function
async function runCampaignAnalysis() {
  console.log('🧪 GHL Campaign Analysis - Real Data Test');
  console.log('═'.repeat(60));
  
  try {
    const analyzer = new CampaignAnalyzer();
    const analysis = await analyzer.analyzeContactPatterns();
    
    console.log('\n📈 REAL DATA ANALYSIS RESULTS:');
    console.log(`📱 Total Contacts: ${analysis.totalContacts.toLocaleString()}`);
    console.log(`🎯 Affiliate Instances: ${analysis.affiliateInstances.toLocaleString()}`);
    console.log(`👤 Unique Affiliates: ${analysis.uniqueAffiliates.toLocaleString()}`);
    console.log(`🔄 Campaign Overlap: ${(analysis.affiliateInstances - analysis.uniqueAffiliates).toLocaleString()} duplicates`);
    
    if (analysis.affiliateInstances > 0) {
      console.log(`📊 Deduplication Rate: ${(((analysis.affiliateInstances - analysis.uniqueAffiliates) / analysis.affiliateInstances) * 100).toFixed(1)}%`);
    }
    
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
      } else {
        console.log('🟡 FAIR: Outside 20% range, may need adjustment');
      }
    }
    
    // Campaign breakdown
    if (Object.keys(analysis.campaignBreakdown).length > 0) {
      console.log('\n🎪 CAMPAIGN BREAKDOWN:');
      Object.entries(analysis.campaignBreakdown).forEach(([campaign, count]) => {
        console.log(`   📋 ${campaign}: ${count.toLocaleString()} participations`);
      });
    }
    
    // Key campaign tags analysis
    console.log('\n🏷️ KEY CAMPAIGN TAGS:');
    const campaignTags = ['rego-rise66', 'jennaz-affiliate', 'reaction-affiliate'];
    campaignTags.forEach(tag => {
      const count = analysis.tagAnalysis[tag] || 0;
      console.log(`   🏷️ ${tag}: ${count.toLocaleString()} contacts`);
    });
    
    // Key sources analysis
    console.log('\n📍 KEY SOURCES:');
    const keySources = ['rise signup', 'affiliate signup', 'partner signup', 'website'];
    keySources.forEach(source => {
      const count = analysis.sourceAnalysis[source] || 0;
      if (count > 0) {
        console.log(`   📍 ${source}: ${count.toLocaleString()} contacts`);
      }
    });
    
    // Summary and next steps
    console.log('\n📋 SUMMARY');
    console.log('═'.repeat(60));
    
    if (analysis.uniqueAffiliates > 0) {
      console.log(`🎯 Campaign-aware system would import: ${analysis.uniqueAffiliates} unique affiliates`);
      console.log(`🔄 From ${analysis.affiliateInstances} total campaign participations`);
      console.log(`📊 Deduplication removes ${analysis.affiliateInstances - analysis.uniqueAffiliates} overlaps`);
      
      const improvement = analysis.uniqueAffiliates > 60 ? 
        `${Math.round(analysis.uniqueAffiliates / 60 * 100)}% improvement over current 50-60` : 
        'Needs filtering adjustment';
      
      console.log(`📈 Expected improvement: ${improvement}`);
      
      console.log('\n🚀 READY TO IMPLEMENT:');
      console.log('1. ✅ Apply campaign schema (already done)');
      console.log('2. 🔄 Run real import with campaign awareness');
      console.log('3. 📊 Verify deduplication worked correctly');
    } else {
      console.log('🟡 No affiliates found - may need to adjust filtering criteria');
      console.log('💡 Consider checking API credentials or campaign tag definitions');
    }
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    if (error.message.includes('fetch')) {
      console.log('💡 Note: Make sure you have internet connection and valid GHL API key');
    }
  }
}

// Add fetch if not available (for Node.js)
if (typeof fetch === 'undefined') {
  global.fetch = (await import('node-fetch')).default;
}

// Run the analysis
runCampaignAnalysis().catch(console.error); 