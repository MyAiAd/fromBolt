#!/usr/bin/env node

// Quick test script to debug import issues
// Run with: node test-import-debug.js

console.log('🔍 Import Debug Test');
console.log('==================');

// Test 1: Check GHL API connection
async function testGHLConnection() {
  console.log('\n📡 Testing GHL API Connection...');
  
  const credentials = {
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI',
    locationId: 'w01Gc7T4b0tKSDQdKhuN'
  };

  try {
    const baseUrl = 'https://rest.gohighlevel.com/v1';
    const endpoint = `/contacts/?locationId=${credentials.locationId}&limit=10`;
    
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ GHL API Error:', response.status, response.statusText, errorText);
      return false;
    }

    const data = await response.json();
    console.log('✅ GHL API Working!');
    console.log(`   📊 Sample response: ${data.contacts?.length || 0} contacts`);
    console.log(`   🔄 Has pagination: ${!!data.meta?.nextCursor}`);
    console.log(`   📈 Total available: ${data.meta?.total || 'unknown'}`);
    
    return true;
  } catch (error) {
    console.error('❌ GHL Connection Error:', error.message);
    return false;
  }
}

// Test 2: Check GoAffPro configuration
function testGoAffProConfig() {
  console.log('\n🏪 Testing GoAffPro Configuration...');
  
  const accessToken = process.env.VITE_GOAFFPRO_ACCESS_TOKEN;
  const publicToken = process.env.VITE_GOAFFPRO_PUBLIC_TOKEN;
  
  if (!accessToken || !publicToken) {
    console.log('❌ GoAffPro tokens not found in environment');
    console.log('   📝 Need to set: VITE_GOAFFPRO_ACCESS_TOKEN');
    console.log('   📝 Need to set: VITE_GOAFFPRO_PUBLIC_TOKEN');
    console.log('   📖 See: goaffpro-setup-instructions.md');
    return false;
  }
  
  console.log('✅ GoAffPro tokens found in environment');
  console.log(`   🔑 Access token: ${accessToken.substring(0, 10)}...`);
  console.log(`   🔑 Public token: ${publicToken.substring(0, 10)}...`);
  return true;
}

// Test 3: Estimate import results
async function estimateImportResults() {
  console.log('\n📊 Estimating Import Results...');
  
  // Test with small sample to estimate filtering
  const credentials = {
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI',
    locationId: 'w01Gc7T4b0tKSDQdKhuN'
  };

  try {
    const baseUrl = 'https://rest.gohighlevel.com/v1';
    const endpoint = `/contacts/?locationId=${credentials.locationId}&limit=50`;
    
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log('❌ Cannot estimate - API error');
      return;
    }

    const data = await response.json();
    const contacts = data.contacts || [];
    
    // Apply the new tag-based filtering logic
    let passedFilter = 0;
    for (const contact of contacts) {
      const customFields = contact.customFields || {};
      
      // Same tag-based logic as in the updated component
      let isAffiliate = false;
      
      // 1. PRIMARY: Check for specific affiliate tags
      if (contact.tags && contact.tags.length > 0) {
        const affiliateTags = [
          'jennaz-affiliate',    // Found: 62 contacts
          'reaction-affiliate',  // Found: 62 contacts  
          'bae-affiliate',       // Found: 1 contact
          'affiliate',           // Generic affiliate tag
          'partner',             // Partner tag
          'ambassador',          // Ambassador tag
          'agent'                // Agent tag
        ];
        
        const hasAffiliateTag = contact.tags.some(tag => 
          affiliateTags.some(affiliateTag => 
            String(tag).toLowerCase().includes(affiliateTag.toLowerCase())
          )
        );
        
        if (hasAffiliateTag) {
          isAffiliate = true;
        }
      }
      
      // 2. Check if contact has a referral code
      if (!isAffiliate && contact.referralCode && contact.referralCode.trim() !== '') {
        isAffiliate = true;
      }
      
      // 3. Check for explicit affiliate indicators in custom fields
      if (!isAffiliate) {
        const affiliateFields = [
          'affiliate_status', 'is_affiliate', 'affiliate_id', 'partner_type',
          'referral_code', 'commission_rate', 'affiliate_tier', 'affiliate_level',
          'partner_status', 'ambassador_status', 'agent_status'
        ];
        
        for (const field of affiliateFields) {
          if (customFields[field] && customFields[field] !== '' && customFields[field] !== null) {
            isAffiliate = true;
            break;
          }
        }
      }
      
      // 4. Check custom field values for affiliate keywords
      if (!isAffiliate) {
        for (const [key, value] of Object.entries(customFields)) {
          if (value && typeof value === 'string') {
            const keyLower = key.toLowerCase();
            const valueLower = value.toLowerCase();
            
            const affiliateKeywords = ['affiliate', 'partner', 'referral', 'commission', 'ambassador'];
            
            if (affiliateKeywords.some(keyword => 
              keyLower.includes(keyword) || valueLower.includes(keyword)
            )) {
              isAffiliate = true;
              break;
            }
          }
        }
      }
      
      // 5. Check for commission-related fields
      if (!isAffiliate) {
        const commissionFields = [
          'commission', 'earnings', 'payout', 'balance', 'revenue_share',
          'bonus', 'tier', 'level', 'rank', 'performance'
        ];
        
        for (const field of commissionFields) {
          for (const [key, value] of Object.entries(customFields)) {
            if (key.toLowerCase().includes(field) && value && value !== '') {
              isAffiliate = true;
              break;
            }
          }
          if (isAffiliate) break;
        }
      }
      
      // 6. Complete profile with business indicators
      if (!isAffiliate) {
        const businessFields = ['business_name', 'company', 'website', 'social_media'];
        let businessFieldCount = 0;
        
        for (const field of businessFields) {
          for (const [key, value] of Object.entries(customFields)) {
            if (key.toLowerCase().includes(field) && value && value !== '') {
              businessFieldCount++;
            }
          }
        }
        
        if (businessFieldCount >= 2 && contact.email && contact.firstName && contact.lastName && contact.phone) {
          isAffiliate = true;
        }
      }
      
      if (isAffiliate) {
        passedFilter++;
      }
    }
    
    const filterRate = contacts.length > 0 ? (passedFilter / contacts.length) : 0;
    const estimatedTotal = Math.round(481 * filterRate);
    
    console.log(`   📈 Sample: ${passedFilter}/${contacts.length} contacts pass filter (${(filterRate * 100).toFixed(1)}%)`);
    console.log(`   🎯 Estimated import: ~${estimatedTotal} out of 481 total contacts`);
    
    if (filterRate > 0.8) {
      console.log('   ✅ Filter looks good - should capture most contacts');
    } else if (filterRate > 0.5) {
      console.log('   ⚠️ Filter is moderate - may miss some contacts');
    } else {
      console.log('   ❌ Filter is too restrictive - will miss many contacts');
    }
    
  } catch (error) {
    console.log('❌ Cannot estimate - error:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  const ghlWorking = await testGHLConnection();
  const goaffproConfigured = testGoAffProConfig();
  await estimateImportResults();
  
  console.log('\n📋 Summary:');
  console.log(`   GHL API: ${ghlWorking ? '✅ Working' : '❌ Issues'}`);
  console.log(`   GoAffPro Config: ${goaffproConfigured ? '✅ Configured' : '❌ Missing tokens'}`);
  
  if (ghlWorking && goaffproConfigured) {
    console.log('\n🎉 Both systems should work! Try the import now.');
  } else {
    console.log('\n🔧 Fix the issues above before importing.');
  }
}

runAllTests().catch(console.error); 