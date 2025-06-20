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

async function checkConstraints() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    
    // Check constraints on affiliate_system_users (updated query for PostgreSQL 12+)
    const result = await client.query(`
      SELECT conname, pg_get_constraintdef(oid) as definition
      FROM pg_constraint 
      WHERE conrelid = 'affiliate_system_users'::regclass 
      AND contype = 'c'
    `);
    
    console.log('Check constraints on affiliate_system_users:');
    result.rows.forEach(row => {
      console.log(`- ${row.conname}: ${row.definition}`);
    });
    
    // Also check what values currently exist
    const valuesResult = await client.query(`
      SELECT DISTINCT primary_source, COUNT(*) 
      FROM affiliate_system_users 
      GROUP BY primary_source
    `);
    
    console.log('\nCurrent primary_source values:');
    valuesResult.rows.forEach(row => {
      console.log(`- ${row.primary_source}: ${row.count} records`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkConstraints().catch(console.error); 