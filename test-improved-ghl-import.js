// Test script for improved GHL affiliate import
// This script analyzes GoHighLevel contacts with campaign awareness and deduplication
import { createClient } from '@supabase/supabase-js';
import { ImprovedGHLImportService } from './src/services/improvedGhlImportService.ts';

// Test configuration
const TEST_CONFIG = {
  // Test GHL API credentials (replace with real values)
  GHL_API_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI',
  GHL_LOCATION_ID: 'w01Gc7T4b0tKSDQdKhuN',
  
  // Supabase configuration (replace with real values)
  SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  
  // Test user ID
  TEST_USER_ID: 'test-user-123'
};

// Mock GHL API response for testing
const MOCK_GHL_CONTACTS = [
  // RISE Campaign affiliates
  {
    id: 'contact_1',
    email: 'sarah.johnson@email.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '+1-555-0101',
    source: 'rise signup',
    tags: ['rego-rise66', 'active'],
    dateAdded: '2024-01-15',
    lastActivity: '2024-01-20'
  },
  {
    id: 'contact_2',
    email: 'mike.chen@business.com',
    firstName: 'Mike',
    lastName: 'Chen',
    phone: '+1-555-0102',
    source: 'website',
    tags: ['rego-rise66', 'verified'],
    dateAdded: '2024-01-16',
    lastActivity: '2024-01-22'
  },
  
  // JennaZ Campaign affiliates
  {
    id: 'contact_3',
    email: 'lisa.martinez@company.com',
    firstName: 'Lisa',
    lastName: 'Martinez',
    phone: '+1-555-0103',
    source: 'affiliate signup',
    tags: ['jennaz-affiliate', 'premium'],
    dateAdded: '2024-01-17',
    lastActivity: '2024-01-25'
  },
  {
    id: 'contact_4',
    email: 'david.wilson@corp.com',
    firstName: 'David',
    lastName: 'Wilson',
    phone: '+1-555-0104',
    source: 'partner signup',
    tags: ['jennaz-affiliate', 'gold'],
    dateAdded: '2024-01-18',
    lastActivity: '2024-01-26'
  },
  
  // ReAction Campaign affiliates
  {
    id: 'contact_5',
    email: 'amanda.brown@agency.com',
    firstName: 'Amanda',
    lastName: 'Brown',
    phone: '+1-555-0105',
    source: 'website',
    tags: ['reaction-affiliate', 'active'],
    dateAdded: '2024-01-19',
    lastActivity: '2024-01-27'
  },
  
  // Multi-campaign affiliate (shows overlap)
  {
    id: 'contact_6',
    email: 'john.smith@marketing.com',
    firstName: 'John',
    lastName: 'Smith',
    phone: '+1-555-0106',
    source: 'rise signup',
    tags: ['rego-rise66', 'jennaz-affiliate', 'top-performer'],
    dateAdded: '2024-01-20',
    lastActivity: '2024-01-28'
  },
  {
    id: 'contact_6_duplicate',
    email: 'john.smith@marketing.com', // Same email - should be deduplicated
    firstName: 'John',
    lastName: 'Smith',
    phone: '+1-555-0106',
    source: 'affiliate signup',
    tags: ['reaction-affiliate', 'verified'],
    dateAdded: '2024-01-21',
    lastActivity: '2024-01-29'
  },
  
  // Non-affiliate contacts
  {
    id: 'contact_7',
    email: 'regular.customer@gmail.com',
    firstName: 'Regular',
    lastName: 'Customer',
    phone: '+1-555-0107',
    source: 'google ads',
    tags: ['customer', 'interested'],
    dateAdded: '2024-01-22',
    lastActivity: '2024-01-30'
  },
  {
    id: 'contact_8',
    email: 'another.lead@yahoo.com',
    firstName: 'Another',
    lastName: 'Lead',
    phone: '+1-555-0108',
    source: 'facebook',
    tags: ['lead', 'cold'],
    dateAdded: '2024-01-23',
    lastActivity: '2024-01-31'
  }
];

// Create mock service for testing
class MockGHLImportService extends ImprovedGHLImportService {
  async fetchAllContacts() {
    console.log('📱 Using mock GHL contacts for testing...');
    
    // Simulate realistic proportions based on user's data
    const mockContacts = [];
    
    // Add base mock contacts
    mockContacts.push(...MOCK_GHL_CONTACTS);
    
    // Add scaled mock data to simulate real numbers
    // rego-rise66: ~552 contacts
    for (let i = 0; i < 552; i++) {
      mockContacts.push({
        id: `rise_${i}`,
        email: `rise_affiliate_${i}@email.com`,
        firstName: `Rise${i}`,
        lastName: 'Affiliate',
        phone: `+1-555-${String(i).padStart(4, '0')}`,
        source: 'rise signup',
        tags: ['rego-rise66'],
        dateAdded: '2024-01-15',
        lastActivity: '2024-01-20'
      });
    }
    
    // jennaz-affiliate: ~624 contacts  
    for (let i = 0; i < 624; i++) {
      mockContacts.push({
        id: `jennaz_${i}`,
        email: `jennaz_affiliate_${i}@email.com`,
        firstName: `Jennaz${i}`,
        lastName: 'Affiliate',
        phone: `+1-555-${String(i + 1000).padStart(4, '0')}`,
        source: 'affiliate signup',
        tags: ['jennaz-affiliate'],
        dateAdded: '2024-01-16',
        lastActivity: '2024-01-21'
      });
    }
    
    // reaction-affiliate: ~624 contacts
    for (let i = 0; i < 624; i++) {
      mockContacts.push({
        id: `reaction_${i}`,
        email: `reaction_affiliate_${i}@email.com`,
        firstName: `Reaction${i}`,
        lastName: 'Affiliate',
        phone: `+1-555-${String(i + 2000).padStart(4, '0')}`,
        source: 'website',
        tags: ['reaction-affiliate'],
        dateAdded: '2024-01-17',
        lastActivity: '2024-01-22'
      });
    }
    
    // Add campaign overlaps (affiliates in multiple campaigns)
    // This simulates the real scenario where some affiliates participate in multiple campaigns
    const overlapCount = 350; // Realistic overlap
    
    for (let i = 0; i < overlapCount; i++) {
      // Create affiliates that are in 2-3 campaigns
      const campaigns = ['rego-rise66', 'jennaz-affiliate', 'reaction-affiliate'];
      const numCampaigns = Math.floor(Math.random() * 2) + 2; // 2 or 3 campaigns
      const selectedCampaigns = campaigns.slice(0, numCampaigns);
      
      mockContacts.push({
        id: `overlap_${i}`,
        email: `overlap_affiliate_${i}@email.com`, // Unique email
        firstName: `Overlap${i}`,
        lastName: 'Affiliate',
        phone: `+1-555-${String(i + 3000).padStart(4, '0')}`,
        source: 'rise signup',
        tags: selectedCampaigns,
        dateAdded: '2024-01-18',
        lastActivity: '2024-01-23'
      });
    }
    
    // Add non-affiliate contacts to simulate real database
    for (let i = 0; i < 200; i++) {
      mockContacts.push({
        id: `customer_${i}`,
        email: `customer_${i}@gmail.com`,
        firstName: `Customer${i}`,
        lastName: 'Regular',
        phone: `+1-555-${String(i + 4000).padStart(4, '0')}`,
        source: 'google ads',
        tags: ['customer', 'lead'],
        dateAdded: '2024-01-19',
        lastActivity: '2024-01-24'
      });
    }
    
    console.log(`📊 Generated ${mockContacts.length} mock contacts for testing`);
    return mockContacts;
  }
}

async function runTest() {
  console.log('🧪 Starting GHL Campaign-Aware Import Test');
  console.log('═'.repeat(60));
  
  try {
    // Initialize Supabase clients
    console.log('🔧 Initializing services...');
    const supabase = createClient(TEST_CONFIG.SUPABASE_URL, TEST_CONFIG.SUPABASE_ANON_KEY);
    const serviceRoleClient = createClient(TEST_CONFIG.SUPABASE_URL, TEST_CONFIG.SUPABASE_SERVICE_KEY);
    
    // Create improved import service
    const importService = new MockGHLImportService(
      supabase,
      serviceRoleClient,
      {
        apiKey: TEST_CONFIG.GHL_API_KEY,
        locationId: TEST_CONFIG.GHL_LOCATION_ID
      }
    );
    
    console.log('✅ Services initialized successfully');
    console.log('');
    
    // Test 1: Analyze contact patterns with campaign awareness
    console.log('📊 TEST 1: Campaign-Aware Contact Analysis');
    console.log('-'.repeat(50));
    
    const analysis = await importService.analyzeContactPatterns();
    
    console.log('📈 ANALYSIS RESULTS:');
    console.log(`📱 Total Contacts: ${analysis.totalContacts.toLocaleString()}`);
    console.log(`🎯 Affiliate Instances: ${analysis.affiliateInstances.toLocaleString()}`);
    console.log(`👤 Unique Affiliates: ${analysis.uniqueAffiliates.toLocaleString()}`);
    console.log(`🔄 Campaign Overlap: ${(analysis.affiliateInstances - analysis.uniqueAffiliates).toLocaleString()} duplicates`);
    console.log(`📊 Deduplication Rate: ${(((analysis.affiliateInstances - analysis.uniqueAffiliates) / analysis.affiliateInstances) * 100).toFixed(1)}%`);
    console.log('');
    
    // Target comparison
    const targetCount = 481;
    const achievement = (analysis.uniqueAffiliates / targetCount) * 100;
    const difference = Math.abs(analysis.uniqueAffiliates - targetCount);
    
    console.log('🎯 TARGET COMPARISON:');
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
    console.log('');
    
    // Campaign breakdown
    console.log('🎪 CAMPAIGN BREAKDOWN:');
    Object.entries(analysis.campaignBreakdown).forEach(([campaign, count]) => {
      console.log(`   📋 ${campaign}: ${count.toLocaleString()} participations`);
    });
    console.log('');
    
    // Key campaign tags analysis
    console.log('🏷️ KEY CAMPAIGN TAGS:');
    const campaignTags = ['rego-rise66', 'jennaz-affiliate', 'reaction-affiliate'];
    campaignTags.forEach(tag => {
      const count = analysis.tagAnalysis[tag] || 0;
      console.log(`   🏷️ ${tag}: ${count.toLocaleString()} contacts`);
    });
    console.log('');
    
    // Test 2: Data Quality Assessment
    console.log('🔍 TEST 2: Data Quality Assessment');
    console.log('-'.repeat(50));
    
    const duplicateRate = ((analysis.affiliateInstances - analysis.uniqueAffiliates) / analysis.affiliateInstances) * 100;
    const affiliateRate = (analysis.uniqueAffiliates / analysis.totalContacts) * 100;
    
    console.log('📊 QUALITY METRICS:');
    console.log(`🔄 Duplicate Rate: ${duplicateRate.toFixed(1)}% (${analysis.affiliateInstances - analysis.uniqueAffiliates} overlaps)`);
    console.log(`🎯 Affiliate Rate: ${affiliateRate.toFixed(1)}% of total contacts`);
    console.log(`📈 Data Efficiency: ${analysis.uniqueAffiliates} unique from ${analysis.affiliateInstances} instances`);
    console.log(''); 
    
    // Test 3: Campaign Strategy Insights
    console.log('💡 TEST 3: Campaign Strategy Insights');
    console.log('-'.repeat(50));
    
    const avgParticipation = analysis.affiliateInstances / analysis.uniqueAffiliates;
    
    console.log('🎪 CAMPAIGN INSIGHTS:');
    console.log(`📊 Average Campaigns per Affiliate: ${avgParticipation.toFixed(2)}`);
    console.log(`🔄 Multi-Campaign Affiliates: ${analysis.affiliateInstances - analysis.uniqueAffiliates}`);
    console.log(`👤 Single-Campaign Affiliates: ${analysis.uniqueAffiliates - (analysis.affiliateInstances - analysis.uniqueAffiliates)}`);
    console.log('');
    
    if (avgParticipation > 1.5) {
      console.log('✅ HIGH ENGAGEMENT: Affiliates participate in multiple campaigns');
    } else if (avgParticipation > 1.2) {
      console.log('🟡 MODERATE ENGAGEMENT: Some multi-campaign participation');
    } else {
      console.log('🔵 LOW OVERLAP: Most affiliates in single campaigns');
    }
    console.log('');
    
    // Test 4: Implementation Recommendations
    console.log('🎯 TEST 4: Implementation Recommendations');
    console.log('-'.repeat(50));
    
    console.log('📋 RECOMMENDATIONS:');
    
    if (achievement >= 90 && achievement <= 110) {
      console.log('✅ READY TO IMPLEMENT: Data quality looks excellent');
      console.log('   👉 Proceed with improved GHL import');
      console.log('   👉 Enable campaign tracking');
      console.log('   👉 Set up deduplication process');
    } else if (achievement >= 80) {
      console.log('🟡 NEEDS MINOR ADJUSTMENT: Close to target');
      console.log('   👉 Review filtering criteria');
      console.log('   👉 Check for missing campaign tags');
      console.log('   👉 Validate date ranges');
    } else {
      console.log('🔄 NEEDS MAJOR ADJUSTMENT: Significant deviation');
      console.log('   👉 Review campaign definitions');
      console.log('   👉 Adjust filtering thresholds');
      console.log('   👉 Consider additional data sources');
    }
    console.log('');
    
    // Summary
    console.log('📋 SUMMARY');
    console.log('═'.repeat(60));
    console.log(`🎯 Target: ${targetCount} unique affiliates`);
    console.log(`✅ Found: ${analysis.uniqueAffiliates} unique affiliates (${achievement.toFixed(1)}%)`);
    console.log(`🔄 Instances: ${analysis.affiliateInstances} total participations`);
    console.log(`📊 Campaigns: ${Object.keys(analysis.campaignBreakdown).length} active campaigns`);
    console.log(`💡 Strategy: ${duplicateRate.toFixed(1)}% affiliate overlap across campaigns`);
    console.log('');
    
    const status = achievement >= 90 && achievement <= 110 ? 'SUCCESS' : 
                   achievement >= 80 ? 'GOOD' : 'NEEDS_WORK';
    
    console.log(`🏁 TEST RESULT: ${status}`);
    console.log('✅ Campaign-aware analysis completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    if (error.message.includes('API')) {
      console.log('💡 Note: This is expected if using test API credentials');
    }
  }
}

// Run the test
runTest().catch(console.error); 