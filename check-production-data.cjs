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

async function checkProductionData() {
  console.log('🔍 Checking Production Database Data');
  console.log('=' .repeat(40));

  const client = new Client(dbConfig);

  try {
    console.log('🔌 Connecting to production database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Check key tables
    const tables = [
      'users',
      'affiliate_system_users',
      'ghl_affiliates',
      'mightynetworks_affiliates',
      'orders',
      'affiliate_import_logs'
    ];

    for (const table of tables) {
      try {
        const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`📊 ${table}: ${result.rows[0].count} records`);
      } catch (error) {
        console.log(`❌ ${table}: Table not found or error - ${error.message}`);
      }
    }

    // Check if there are any users
    try {
      const users = await client.query(`SELECT id, email FROM users LIMIT 5`);
      console.log('\n👥 Sample users:');
      users.rows.forEach(user => {
        console.log(`  - ${user.email} (${user.id})`);
      });
    } catch (error) {
      console.log('❌ Could not fetch users:', error.message);
    }

  } catch (error) {
    console.error('❌ Check failed:', error.message);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the check
checkProductionData().catch(console.error); 