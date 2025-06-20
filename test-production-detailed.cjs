#!/usr/bin/env node

const { Client } = require('pg');

// Production database configuration
const dbConfig = {
  host: 'db.qnruorhzdxkyfhdgtkqp.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'T3sla12e!',
  ssl: { rejectUnauthorized: false }
};

const PRODUCTION_WEBHOOK_URL = 'https://qnruorhzdxkyfhdgtkqp.supabase.co/functions/v1/mn-webhook';
const API_KEY = 'Pw8Io8duTZqtSm0jQMYYv9KVPRQfJMf99Nrtc1ZyOGA';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucnVvcmh6ZHhreWZoZGd0a3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDU1MTAsImV4cCI6MjA2MzU4MTUxMH0.d42EFmjURUJ2aLFeAyFQsWwFmbnL7L_ObfAIlpv8McM';

async function testProductionSetup() {
  console.log('🔍 Detailed Production Test');
  console.log('=' .repeat(40));

  // 1. Test database connection and required tables
  console.log('\n1️⃣ Testing Database Connection...');
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('✅ Database connected successfully');

    // Check required tables for webhook
    const requiredTables = [
      'affiliate_system_users',
      'mightynetworks_affiliates',
      'referral_relationships'
    ];

    for (const table of requiredTables) {
      try {
        const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`✅ ${table}: ${result.rows[0].count} records`);
      } catch (error) {
        console.log(`❌ ${table}: ${error.message}`);
      }
    }

    // Test if we can insert a test record
    console.log('\n2️⃣ Testing Database Write Access...');
    const testEmail = `test-${Date.now()}@example.com`;
    
    try {
      const insertResult = await client.query(`
        INSERT INTO affiliate_system_users (email, first_name, primary_source, status, signup_date, referral_code)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `, [testEmail, 'Test', 'test', 'active', new Date().toISOString(), `TEST-${Date.now()}`]);
      
      console.log(`✅ Database write test successful - ID: ${insertResult.rows[0].id}`);
      
      // Clean up test record
      await client.query('DELETE FROM affiliate_system_users WHERE email = $1', [testEmail]);
      console.log('✅ Test record cleaned up');
      
    } catch (error) {
      console.log(`❌ Database write test failed: ${error.message}`);
    }

  } catch (error) {
    console.log(`❌ Database connection failed: ${error.message}`);
  } finally {
    await client.end();
  }

  // 2. Test webhook with minimal payload
  console.log('\n3️⃣ Testing Webhook with Minimal Payload...');
  
  const minimalPayload = {
    api_key: API_KEY,
    email: `webhook-test-${Date.now()}@example.com`,
    activity_type: 'joined'
  };

  try {
    const response = await fetch(PRODUCTION_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(minimalPayload)
    });

    console.log(`📥 Response Status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log('📄 Response Body:', responseText);

    if (response.ok) {
      console.log('✅ Webhook test successful!');
    } else {
      console.log('❌ Webhook test failed');
    }

  } catch (error) {
    console.log('❌ Webhook request failed:', error.message);
  }

  // 3. Test webhook with purchase payload
  console.log('\n4️⃣ Testing Webhook with Purchase Payload...');
  
  const purchasePayload = {
    api_key: API_KEY,
    email: `purchase-test-${Date.now()}@example.com`,
    first_name: 'Purchase',
    last_name: 'Test',
    activity_type: 'purchased',
    amount: 99.99,
    product_name: 'Test Product',
    order_id: `ORDER-${Date.now()}`
  };

  try {
    const response = await fetch(PRODUCTION_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(purchasePayload)
    });

    console.log(`📥 Response Status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log('📄 Response Body:', responseText);

    if (response.ok) {
      console.log('✅ Purchase webhook test successful!');
    } else {
      console.log('❌ Purchase webhook test failed');
    }

  } catch (error) {
    console.log('❌ Purchase webhook request failed:', error.message);
  }
}

// Run the test
testProductionSetup().catch(console.error); 