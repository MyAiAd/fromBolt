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

async function checkMNTableStructure() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    
    // Check table structure
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'mightynetworks_affiliates'
      ORDER BY ordinal_position
    `);
    
    console.log('mightynetworks_affiliates table structure:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });
    
    // Check constraints
    const constraints = await client.query(`
      SELECT conname, pg_get_constraintdef(oid) as definition
      FROM pg_constraint 
      WHERE conrelid = 'mightynetworks_affiliates'::regclass
    `);
    
    console.log('\nConstraints:');
    constraints.rows.forEach(row => {
      console.log(`- ${row.conname}: ${row.definition}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkMNTableStructure().catch(console.error); 