import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const serviceRoleClient = createClient(supabaseUrl, serviceRoleKey);

console.log('🔍 Testing Database Table Access Permissions');
console.log(`Supabase URL: ${supabaseUrl}`);
console.log(`Service Role Key: ${serviceRoleKey ? 'Available' : 'Missing'}`);

async function testTableAccess() {
  const tables = [
    'affiliate_system_users',
    'ghl_affiliates', 
    'users',
    'affiliate_import_logs',
    'auth.users'
  ];

  for (const table of tables) {
    try {
      console.log(`\n🔍 Testing ${table}...`);
      const { data, error, count } = await serviceRoleClient
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
        console.log(`   Error code: ${error.code}`);
        console.log(`   Error details: ${error.details}`);
      } else {
        console.log(`✅ ${table}: SUCCESS (${count} records)`);
      }
    } catch (e) {
      console.log(`❌ ${table}: Exception - ${e.message}`);
    }
  }

  // Test creating a record in affiliate_system_users
  console.log(`\n🔍 Testing INSERT into affiliate_system_users...`);
  try {
    const { data, error } = await serviceRoleClient
      .from('affiliate_system_users')
      .insert({
        email: 'test-ghl-permissions@test.com',
        first_name: 'Test',
        last_name: 'User',
        referral_code: 'test-perm-123',
        primary_source: 'ghl',
        status: 'active'
      })
      .select();
    
    if (error) {
      console.log(`❌ INSERT test failed: ${error.message}`);
      console.log(`   Error code: ${error.code}`);
    } else {
      console.log(`✅ INSERT test: SUCCESS`);
      
      // Clean up test record
      await serviceRoleClient
        .from('affiliate_system_users')
        .delete()
        .eq('email', 'test-ghl-permissions@test.com');
      console.log(`🧹 Cleaned up test record`);
    }
  } catch (e) {
    console.log(`❌ INSERT test: Exception - ${e.message}`);
  }
}

testTableAccess().catch(console.error); 