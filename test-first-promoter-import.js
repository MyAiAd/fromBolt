// Test First Promoter Integration
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

class FirstPromoterTester {
  constructor() {
    // IMPORTANT: You need to get these from your First Promoter dashboard
    this.config = {
      apiKey: process.env.FIRST_PROMOTER_API_KEY || 'YOUR_FIRST_PROMOTER_API_KEY_HERE',
      baseUrl: 'https://firstpromoter.com/api/v1'
    };

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    this.supabase = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY);
    this.serviceRoleClient = createClient(supabaseUrl, serviceRoleKey);
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-API-KEY': this.config.apiKey,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`First Promoter API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async testConnection() {
    console.log('🔍 Testing First Promoter API connection...');
    console.log(`🔧 Using API key: ${this.config.apiKey.substring(0, 10)}...`);
    console.log(`🌐 Base URL: ${this.config.baseUrl}`);
    console.log('');

    try {
      const result = await this.makeRequest('/promoters?page=1&limit=1');
      console.log('✅ First Promoter API connection successful!');
      console.log('📋 Sample response structure:', Object.keys(result));
      return true;
    } catch (error) {
      console.error('❌ First Promoter API connection failed:', error.message);
      console.log('');
      console.log('🔧 Setup Instructions:');
      console.log('1. Log into your First Promoter dashboard');
      console.log('2. Go to Settings > API');
      console.log('3. Copy your API key');
      console.log('4. Add it to your .env file: FIRST_PROMOTER_API_KEY=your_key_here');
      console.log('5. Or update the config in this test file');
      return false;
    }
  }

  async fetchPromotesSample() {
    console.log('📥 Fetching sample promoters...');
    
    try {
      const result = await this.makeRequest('/promoters?page=1&limit=10');
      
      // Handle different response formats
      const promoters = result?.data || result?.promoters || result || [];
      
      console.log(`✅ Found ${promoters.length} promoters`);
      
      if (promoters.length > 0) {
        console.log('\n👥 Sample Promoter Data:');
        promoters.slice(0, 3).forEach((promoter, index) => {
          console.log(`${index + 1}. ID: ${promoter.id}`);
          console.log(`   Email: ${promoter.email}`);
          console.log(`   Status: ${promoter.status}`);
          console.log(`   Name: ${promoter.profile?.first_name || 'N/A'} ${promoter.profile?.last_name || 'N/A'}`);
          console.log(`   Referral ID: ${promoter.default_ref_id || 'N/A'}`);
          console.log(`   Earnings: $${promoter.earnings_balance?.cash || 0}`);
          console.log(`   Created: ${promoter.created_at}`);
          console.log('');
        });
      }
      
      return promoters;
    } catch (error) {
      console.error('❌ Error fetching promoters:', error.message);
      return [];
    }
  }

  async getAllPromoters() {
    console.log('🔄 Fetching ALL promoters from First Promoter...');
    const allPromoters = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 20) { // Safety limit
      try {
        console.log(`📥 Page ${page}...`);
        const result = await this.makeRequest(`/promoters?page=${page}&limit=100`);
        
        const promoters = result?.data || result?.promoters || result || [];
        allPromoters.push(...promoters);
        
        console.log(`   ✅ ${promoters.length} promoters (total: ${allPromoters.length})`);
        
        hasMore = promoters.length === 100;
        page++;
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`❌ Error fetching page ${page}:`, error.message);
        break;
      }
    }

    console.log(`✅ Total promoters fetched: ${allPromoters.length}`);
    return allPromoters;
  }

  async testDatabaseSetup() {
    console.log('🗄️ Testing database setup for First Promoter...');
    
    try {
      // Check if tables exist
      const { data: tables, error: tablesError } = await this.serviceRoleClient
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .in('table_name', ['first_promoter_affiliates', 'first_promoter_commissions']);

      if (tablesError) {
        console.error('❌ Error checking database tables:', tablesError);
        return false;
      }

      const tableNames = tables?.map(t => t.table_name) || [];
      
      if (tableNames.includes('first_promoter_affiliates')) {
        console.log('✅ first_promoter_affiliates table exists');
      } else {
        console.log('❌ first_promoter_affiliates table missing');
        console.log('   Run the first_promoter_schema.sql script to create it');
      }

      if (tableNames.includes('first_promoter_commissions')) {
        console.log('✅ first_promoter_commissions table exists');
      } else {
        console.log('❌ first_promoter_commissions table missing');
        console.log('   Run the first_promoter_schema.sql script to create it');
      }

      // Check if affiliate_system_users has First Promoter columns
      const { data: columns, error: columnsError } = await this.serviceRoleClient
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'affiliate_system_users')
        .in('column_name', ['first_promoter_id', 'first_promoter_referral_id']);

      if (columnsError) {
        console.error('❌ Error checking affiliate_system_users columns:', columnsError);
        return false;
      }

      const columnNames = columns?.map(c => c.column_name) || [];
      
      if (columnNames.includes('first_promoter_id')) {
        console.log('✅ affiliate_system_users.first_promoter_id column exists');
      } else {
        console.log('❌ affiliate_system_users.first_promoter_id column missing');
      }

      return tableNames.length === 2 && columnNames.length === 2;

    } catch (error) {
      console.error('❌ Database setup test failed:', error.message);
      return false;
    }
  }

  async testImportPreview() {
    console.log('🔍 Testing import preview (first 5 promoters)...');
    
    try {
      const promoters = await this.fetchPromotesSample();
      
      if (promoters.length === 0) {
        console.log('❌ No promoters found to preview');
        return;
      }

      console.log('\n📋 Import Preview:');
      console.log('='.repeat(50));
      
      promoters.slice(0, 5).forEach(promoter => {
        const affiliateData = {
          email: promoter.email,
          first_name: promoter.profile?.first_name || null,
          last_name: promoter.profile?.last_name || null,
          phone: promoter.profile?.phone_number || null,
          referral_code: promoter.default_ref_id || this.generateReferralCode(promoter),
          primary_source: 'first_promoter',
          first_promoter_id: promoter.id.toString(),
          status: promoter.status === 'approved' || promoter.status === 'active' ? 'active' : 'pending',
          signup_date: promoter.created_at ? new Date(promoter.created_at).toISOString() : new Date().toISOString(),
          total_earnings: promoter.earnings_balance?.cash || 0,
          balance: promoter.current_balance?.cash || 0
        };

        console.log(`👤 ${affiliateData.first_name} ${affiliateData.last_name}`);
        console.log(`   📧 ${affiliateData.email}`);
        console.log(`   🔗 ${affiliateData.referral_code}`);
        console.log(`   💰 Earnings: $${affiliateData.total_earnings}`);
        console.log(`   📊 Status: ${affiliateData.status}`);
        console.log('');
      });

      console.log(`✅ Ready to import ${promoters.length} promoters`);
      
    } catch (error) {
      console.error('❌ Import preview failed:', error.message);
    }
  }

  generateReferralCode(promoter) {
    const name = `${promoter.profile?.first_name || ''}${promoter.profile?.last_name || ''}`.replace(/\s+/g, '');
    const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${name.substr(0, 6).toUpperCase()}${randomSuffix}`;
  }

  async run() {
    console.log('🚀 FIRST PROMOTER INTEGRATION TEST');
    console.log('='.repeat(50));
    console.log('');

    // Test 1: API Connection
    const connectionTest = await this.testConnection();
    if (!connectionTest) {
      console.log('⚠️ Fix API connection before proceeding');
      return;
    }
    console.log('');

    // Test 2: Database Setup
    const dbTest = await this.testDatabaseSetup();
    if (!dbTest) {
      console.log('⚠️ Fix database setup before proceeding');
      console.log('   Run: psql -f first_promoter_schema.sql');
      return;
    }
    console.log('');

    // Test 3: Fetch Sample Data
    await this.fetchPromotesSample();
    console.log('');

    // Test 4: Count All Promoters
    const allPromoters = await this.getAllPromoters();
    console.log('');

    // Test 5: Import Preview
    await this.testImportPreview();
    console.log('');

    // Summary
    console.log('📊 INTEGRATION SUMMARY:');
    console.log('='.repeat(50));
    console.log(`✅ API Connection: ${connectionTest ? 'Working' : 'Failed'}`);
    console.log(`✅ Database Setup: ${dbTest ? 'Ready' : 'Needs Setup'}`);
    console.log(`📊 Total Promoters Available: ${allPromoters.length}`);
    console.log(`🎯 Expected vs Found: 481 vs ${allPromoters.length}`);
    
    if (allPromoters.length > 0) {
      console.log('');
      console.log('🎉 READY TO IMPORT!');
      console.log('Next steps:');
      console.log('1. Add FIRST_PROMOTER_API_KEY to your .env file');
      console.log('2. Run the database schema: first_promoter_schema.sql');
      console.log('3. Use the FirstPromoterService in your app');
      console.log('4. Test with: await firstPromoterService.importAffiliates(userId)');
    }
  }
}

// Run the test
const tester = new FirstPromoterTester();
tester.run().catch(console.error); 