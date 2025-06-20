#!/usr/bin/env node

const { Client } = require('pg');

const dbConfig = {
  host: 'db.qnruorhzdxkyfhdgtkqp.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'T3sla12e!',
  ssl: { rejectUnauthorized: false }
};

async function checkMissingTables() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('🔍 Checking tables needed by webhook...');
    
    const tables = [
      'affiliate_system_users',
      'referral_relationships', 
      'mightynetworks_affiliates',
      'multi_level_commissions',
      'mightynetworks_referrals'
    ];
    
    for (const table of tables) {
      try {
        const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`✅ ${table}: ${result.rows[0].count} records`);
      } catch (error) {
        console.log(`❌ ${table}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkMissingTables().catch(console.error); 