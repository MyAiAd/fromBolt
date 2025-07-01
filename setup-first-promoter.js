// First Promoter Setup Helper
// This helps you configure and test your First Promoter API key

import dotenv from 'dotenv';
dotenv.config();

class FirstPromoterSetup {
  constructor() {
    this.apiKey = process.env.FIRST_PROMOTER_API_KEY || 'YOUR_API_KEY_HERE';
    this.baseUrl = 'https://firstpromoter.com/api/v1';
  }

  async testConnection() {
    console.log('🔧 FIRST PROMOTER SETUP');
    console.log('═'.repeat(50));
    
    // Check if API key is configured
    if (this.apiKey === 'YOUR_API_KEY_HERE' || !this.apiKey) {
      console.log('❌ API Key not configured');
      console.log('\n📋 SETUP INSTRUCTIONS:');
      console.log('1. Go to your First Promoter dashboard');
      console.log('2. Navigate to Settings → API Keys');
      console.log('3. Copy your API key');
      console.log('4. Add to your .env file:');
      console.log('   FIRST_PROMOTER_API_KEY=fp_live_xxxxxxxxxxxxx');
      console.log('5. Run this script again');
      return false;
    }

    console.log(`🔑 API Key: ${this.apiKey.substring(0, 8)}...`);
    console.log('🌐 Testing connection...');

    try {
      // Test with a simple API call
      const response = await fetch(`${this.baseUrl}/promoters?limit=1`, {
        headers: {
          'X-API-KEY': this.apiKey
        }
      });

      if (!response.ok) {
        console.log(`❌ API Error: ${response.status} ${response.statusText}`);
        
        if (response.status === 401) {
          console.log('💡 Issue: Invalid API key');
          console.log('   • Check your API key is correct');
          console.log('   • Ensure you have API access enabled');
        } else if (response.status === 404) {
          console.log('💡 Issue: API endpoint not found');
          console.log('   • Check your First Promoter subscription includes API access');
        }
        return false;
      }

      const data = await response.json();
      console.log('✅ Connection successful!');
      console.log(`📊 Sample response: ${JSON.stringify(data, null, 2).substring(0, 200)}...`);
      
      return true;

    } catch (error) {
      console.log(`❌ Connection failed: ${error.message}`);
      console.log('💡 Check your internet connection and API key');
      return false;
    }
  }

  async getAffiliateCount() {
    try {
      const response = await fetch(`${this.baseUrl}/promoters?limit=1`, {
        headers: {
          'X-API-KEY': this.apiKey
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Get total count from pagination
        const totalResponse = await fetch(`${this.baseUrl}/promoters?limit=100`, {
          headers: {
            'X-API-KEY': this.apiKey
          }
        });
        
        if (totalResponse.ok) {
          const totalData = await totalResponse.json();
          const total = totalData.length || 0;
          
          console.log(`\n📊 FIRST PROMOTER AFFILIATE COUNT: ${total}`);
          console.log(`🎯 This is likely your accurate affiliate number!`);
          
          if (total > 400) {
            console.log('🎉 EXCELLENT: This matches your expected ~481 affiliates!');
          } else if (total > 200) {
            console.log('✅ GOOD: Substantial affiliate base found');
          } else {
            console.log('🟡 MODERATE: Some affiliates found, may need to check settings');
          }
          
          return total;
        }
      }
      
    } catch (error) {
      console.log(`❌ Error getting count: ${error.message}`);
    }
    
    return 0;
  }

  async showSetupSummary(affiliateCount = 0) {
    console.log('\n🚀 NEXT STEPS');
    console.log('═'.repeat(30));
    
    if (affiliateCount > 0) {
      console.log('✅ First Promoter is configured and working!');
      console.log(`📊 Found ${affiliateCount} affiliates in First Promoter`);
      console.log('\n📋 Ready to proceed:');
      console.log('1. ✅ Apply First Promoter database schema');
      console.log('2. 🔄 Run First Promoter import');
      console.log('3. 📊 Compare with GHL data (53 vs ' + affiliateCount + ')');
      console.log('4. 🎯 Use First Promoter as primary affiliate source');
      
      if (affiliateCount > 400) {
        console.log('\n🎉 RECOMMENDATION: First Promoter likely has your complete affiliate data!');
        console.log('   Use this as your primary source and GHL as supplementary.');
      }
    } else {
      console.log('🟡 First Promoter connection needs configuration');
      console.log('📋 Complete setup first, then run affiliate import');
    }
  }
}

// Main setup function
async function setupFirstPromoter() {
  console.log('🎯 FIRST PROMOTER SETUP & TEST');
  console.log('Setting up your reliable affiliate data source');
  console.log('═'.repeat(60));
  
  const setup = new FirstPromoterSetup();
  
  const connectionOk = await setup.testConnection();
  
  if (connectionOk) {
    const affiliateCount = await setup.getAffiliateCount();
    await setup.showSetupSummary(affiliateCount);
  } else {
    await setup.showSetupSummary(0);
  }
}

// Add fetch support
if (typeof fetch === 'undefined') {
  global.fetch = (await import('node-fetch')).default;
}

// Run setup
setupFirstPromoter().catch(console.error); 