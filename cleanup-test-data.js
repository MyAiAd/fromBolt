#!/usr/bin/env node

/**
 * Cleanup script to remove test data from the database
 * Preserves the real user account: Sage@MyAi.ad
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

console.log('🧹 Starting Test Data Cleanup');
console.log('Supabase URL:', supabaseUrl);
console.log('Service Role Key:', serviceRoleKey ? 'Present' : 'Missing');

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

// Use service role client to bypass RLS for cleanup
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const PRESERVE_EMAIL = 'Sage@MyAi.ad';

async function cleanupTestData() {
  try {
    console.log('\n🔍 Identifying test data to clean up...');
    
    // Tables to clean up with their respective conditions
    const cleanupTasks = [
      {
        table: 'goaffpro_affiliates',
        condition: { data_source: 'test' },
        description: 'GoAffPro test affiliates'
      },
      {
        table: 'goaffpro_orders',
        condition: { data_source: 'test' },
        description: 'GoAffPro test orders'
      },
      {
        table: 'goaffpro_rewards',
        condition: { data_source: 'test' },
        description: 'GoAffPro test rewards'
      },
      {
        table: 'goaffpro_payments',
        condition: { data_source: 'test' },
        description: 'GoAffPro test payments'
      },
      {
        table: 'goaffpro_commissions',
        condition: { data_source: 'test' },
        description: 'GoAffPro test commissions'
      },
      {
        table: 'commissions',
        condition: { data_source: 'test' },
        description: 'Test commissions'
      },
      {
        table: 'transactions',
        condition: { data_source: 'test' },
        description: 'Test transactions'
      },
      {
        table: 'clicks',
        condition: { data_source: 'test' },
        description: 'Test clicks'
      },
      {
        table: 'affiliates',
        condition: { data_source: 'test' },
        description: 'Test affiliates'
      },
      {
        table: 'shopify_orders',
        condition: { data_source: 'test' },
        description: 'Test Shopify orders'
      },
      {
        table: 'shopify_products',
        condition: { data_source: 'test' },
        description: 'Test Shopify products'
      }
    ];

    let totalDeleted = 0;

    for (const task of cleanupTasks) {
      try {
        console.log(`\n📊 Cleaning ${task.description}...`);
        
        // First, count how many records will be deleted
        const { count, error: countError } = await supabase
          .from(task.table)
          .select('*', { count: 'exact', head: true })
          .match(task.condition);

        if (countError) {
          console.log(`⚠️ Table ${task.table} might not exist or is inaccessible:`, countError.message);
          continue;
        }

        if (count === 0) {
          console.log(`✅ No test data found in ${task.table}`);
          continue;
        }

        console.log(`🗑️ Found ${count} test records in ${task.table}`);

        // Delete the test data
        const { error: deleteError } = await supabase
          .from(task.table)
          .delete()
          .match(task.condition);

        if (deleteError) {
          console.error(`❌ Error deleting from ${task.table}:`, deleteError);
          continue;
        }

        console.log(`✅ Deleted ${count} records from ${task.table}`);
        totalDeleted += count || 0;

      } catch (error) {
        console.error(`❌ Error processing ${task.table}:`, error.message);
      }
    }

    // Special handling for users table - delete test users but preserve Sage@MyAi.ad
    console.log('\n👤 Cleaning test users (preserving real accounts)...');
    
    try {
      // First check what users exist
      const { data: allUsers, error: usersError } = await supabase
        .from('users')
        .select('id, email, data_source');

      if (usersError) {
        console.log('⚠️ Could not access users table:', usersError.message);
      } else if (allUsers) {
        console.log('📋 Current users in database:');
        allUsers.forEach(user => {
          const isPreserved = user.email?.toLowerCase() === PRESERVE_EMAIL.toLowerCase();
          console.log(`  - ${user.email} (${user.data_source || 'no source'}) ${isPreserved ? '🔒 PRESERVED' : ''}`);
        });

        // Delete test users, but preserve the real account
        const { count: testUserCount, error: testCountError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('data_source', 'test')
          .neq('email', PRESERVE_EMAIL);

        if (!testCountError && testUserCount && testUserCount > 0) {
          const { error: deleteUsersError } = await supabase
            .from('users')
            .delete()
            .eq('data_source', 'test')
            .neq('email', PRESERVE_EMAIL);

          if (deleteUsersError) {
            console.error('❌ Error deleting test users:', deleteUsersError);
          } else {
            console.log(`✅ Deleted ${testUserCount} test users (preserved ${PRESERVE_EMAIL})`);
            totalDeleted += testUserCount;
          }
        } else {
          console.log('✅ No test users to delete');
        }
      }
    } catch (error) {
      console.error('❌ Error handling users table:', error.message);
    }

    console.log('\n📋 Cleanup Summary:');
    console.log('==================');
    console.log(`Total records deleted: ${totalDeleted}`);
    console.log(`Preserved account: ${PRESERVE_EMAIL}`);
    console.log('✅ Cleanup completed successfully!');

    return true;

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Database Cleanup\n');
  
  const success = await cleanupTestData();
  
  if (success) {
    console.log('\n🎉 Database cleanup completed successfully!');
    console.log('💡 Test data has been removed while preserving real user accounts.');
  } else {
    console.log('\n❌ Database cleanup failed. Check the errors above.');
  }
}

main().catch(console.error); 