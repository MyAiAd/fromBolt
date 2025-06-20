#!/usr/bin/env node

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Production database configuration
const dbConfig = {
  host: 'db.qnruorhzdxkyfhdgtkqp.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'T3sla12e!',
  ssl: { rejectUnauthorized: false }
};

async function applyMigration() {
  console.log('🚀 Applying Production Database Migration');
  console.log('=' .repeat(50));

  const client = new Client(dbConfig);

  try {
    console.log('🔌 Connecting to production database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Apply schema first
    console.log('\n📋 Applying schema migration...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'safe_migration_schema.sql'), 'utf8');
    
    console.log(`📄 Schema file size: ${(schemaSQL.length / 1024).toFixed(1)} KB`);
    
    await client.query(schemaSQL);
    console.log('✅ Schema migration completed!');

    // Apply data migration
    console.log('\n📊 Applying data migration...');
    const dataSQL = fs.readFileSync(path.join(__dirname, 'final_constraint_free_data.sql'), 'utf8');
    
    console.log(`📄 Data file size: ${(dataSQL.length / 1024).toFixed(1)} KB`);
    
    await client.query(dataSQL);
    console.log('✅ Data migration completed!');

    console.log('\n🎉 Migration completed successfully!');
    console.log('✅ Production database is now ready');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    if (error.code) {
      console.error(`📋 Error Code: ${error.code}`);
    }
    
    if (error.position) {
      console.error(`📍 Error Position: ${error.position}`);
    }
    
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the migration
applyMigration().catch(console.error); 