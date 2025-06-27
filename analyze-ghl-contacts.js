#!/usr/bin/env node

// Script to analyze GHL contact data to understand affiliate patterns
// Run with: node analyze-ghl-contacts.js

console.log('🔍 GHL Contact Analysis');
console.log('======================');

async function analyzeContacts() {
  const credentials = {
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI',
    locationId: 'w01Gc7T4b0tKSDQdKhuN'
  };

  try {
    console.log('📡 Fetching sample contacts for analysis...');
    
    const baseUrl = 'https://rest.gohighlevel.com/v1';
    const endpoint = `/contacts/?locationId=${credentials.locationId}&limit=100`;
    
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText);
      return;
    }

    const data = await response.json();
    const contacts = data.contacts || [];
    
    console.log(`📊 Analyzing ${contacts.length} contacts...`);
    console.log(`📈 Total contacts in system: ${data.meta?.total || 'unknown'}`);
    
    // Analyze contact patterns
    const analysis = {
      totalContacts: contacts.length,
      withCustomFields: 0,
      withTags: 0,
      withReferralCode: 0,
      withPhone: 0,
      withFullName: 0,
      customFieldsFrequency: {},
      tagsFrequency: {},
      commonFieldNames: new Set(),
      potentialAffiliateFields: new Set()
    };
    
    console.log('\n🔍 Analyzing contact patterns...');
    
    contacts.forEach((contact, index) => {
      if (index < 10) {
        console.log(`\n📋 Contact ${index + 1}: ${contact.email || 'no-email'}`);
        console.log(`   Name: ${contact.firstName || 'N/A'} ${contact.lastName || 'N/A'}`);
        console.log(`   Phone: ${contact.phone || 'N/A'}`);
        console.log(`   Referral Code: ${contact.referralCode || 'N/A'}`);
        console.log(`   Tags: ${contact.tags?.length || 0} tags - ${contact.tags?.join(', ') || 'none'}`);
        console.log(`   Custom Fields: ${Object.keys(contact.customFields || {}).length} fields`);
        
        if (contact.customFields && Object.keys(contact.customFields).length > 0) {
          console.log(`   Fields: ${Object.keys(contact.customFields).join(', ')}`);
          Object.entries(contact.customFields).forEach(([key, value]) => {
            console.log(`     ${key}: ${value}`);
          });
        }
      }
      
      // Collect statistics
      const customFields = contact.customFields || {};
      
      if (Object.keys(customFields).length > 0) {
        analysis.withCustomFields++;
      }
      
      if (contact.tags && contact.tags.length > 0) {
        analysis.withTags++;
        contact.tags.forEach(tag => {
          analysis.tagsFrequency[tag] = (analysis.tagsFrequency[tag] || 0) + 1;
        });
      }
      
      if (contact.referralCode) {
        analysis.withReferralCode++;
      }
      
      if (contact.phone) {
        analysis.withPhone++;
      }
      
      if (contact.firstName && contact.lastName) {
        analysis.withFullName++;
      }
      
      // Analyze custom field names
      Object.keys(customFields).forEach(fieldName => {
        analysis.commonFieldNames.add(fieldName);
        analysis.customFieldsFrequency[fieldName] = (analysis.customFieldsFrequency[fieldName] || 0) + 1;
        
        // Look for potential affiliate indicators
        const lowerField = fieldName.toLowerCase();
        if (lowerField.includes('affiliate') || 
            lowerField.includes('partner') || 
            lowerField.includes('referral') || 
            lowerField.includes('commission') ||
            lowerField.includes('tier') ||
            lowerField.includes('level') ||
            lowerField.includes('status')) {
          analysis.potentialAffiliateFields.add(fieldName);
        }
      });
    });
    
    console.log('\n📊 ANALYSIS RESULTS:');
    console.log('===================');
    console.log(`Total contacts analyzed: ${analysis.totalContacts}`);
    console.log(`With custom fields: ${analysis.withCustomFields} (${(analysis.withCustomFields/analysis.totalContacts*100).toFixed(1)}%)`);
    console.log(`With tags: ${analysis.withTags} (${(analysis.withTags/analysis.totalContacts*100).toFixed(1)}%)`);
    console.log(`With referral code: ${analysis.withReferralCode} (${(analysis.withReferralCode/analysis.totalContacts*100).toFixed(1)}%)`);
    console.log(`With phone: ${analysis.withPhone} (${(analysis.withPhone/analysis.totalContacts*100).toFixed(1)}%)`);
    console.log(`With full name: ${analysis.withFullName} (${(analysis.withFullName/analysis.totalContacts*100).toFixed(1)}%)`);
    
    console.log('\n🏷️ Most Common Tags:');
    const sortedTags = Object.entries(analysis.tagsFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    sortedTags.forEach(([tag, count]) => {
      console.log(`   ${tag}: ${count} contacts`);
    });
    
    console.log('\n📋 Most Common Custom Fields:');
    const sortedFields = Object.entries(analysis.customFieldsFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15);
    sortedFields.forEach(([field, count]) => {
      console.log(`   ${field}: ${count} contacts`);
    });
    
    if (analysis.potentialAffiliateFields.size > 0) {
      console.log('\n🎯 Potential Affiliate Fields Found:');
      Array.from(analysis.potentialAffiliateFields).forEach(field => {
        console.log(`   ${field}: ${analysis.customFieldsFrequency[field]} contacts`);
      });
    } else {
      console.log('\n❌ No obvious affiliate-specific fields found in sample');
    }
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('==================');
    
    if (analysis.withReferralCode > 0) {
      console.log('✅ Use referral codes as primary affiliate indicator');
    }
    
    if (analysis.potentialAffiliateFields.size > 0) {
      console.log('✅ Use these affiliate-specific fields for filtering');
    }
    
    if (analysis.withTags > 0) {
      console.log('✅ Check tags for affiliate indicators');
    }
    
    const targetPercentage = (481 / 1071) * 100; // ~45%
    console.log(`\n🎯 TARGET: Need to identify ~${targetPercentage.toFixed(1)}% of contacts as affiliates (481 out of 1071)`);
    
    // Estimate what combination might work
    console.log('\n🔧 SUGGESTED FILTERING STRATEGY:');
    if (analysis.withReferralCode > 0) {
      console.log(`1. Include all contacts with referral codes (${analysis.withReferralCode} in sample)`);
    }
    if (analysis.potentialAffiliateFields.size > 0) {
      console.log(`2. Include contacts with affiliate-specific fields`);
    }
    console.log(`3. Include contacts with specific tag patterns`);
    console.log(`4. Include contacts with complete profiles + business indicators`);
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  }
}

analyzeContacts().catch(console.error); 