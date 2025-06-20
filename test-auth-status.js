import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://localhost:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const serviceRoleClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testAuthStatus() {
  console.log('🔍 Testing Authentication Status');
  console.log('=' .repeat(50));
  
  try {
    // Test 1: Check current session
    console.log('\n🧪 Test 1: Check current session');
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
    } else {
      console.log('📊 Session:', session.session ? 'Active' : 'None');
      if (session.session) {
        console.log('👤 User:', session.session.user.email);
        console.log('🔑 User ID:', session.session.user.id);
        console.log('📋 User metadata:', session.session.user.user_metadata);
      }
    }
    
    // Test 2: Try to access data without authentication
    console.log('\n🧪 Test 2: Access data without authentication');
    const { data: unauthData, error: unauthError } = await supabase
      .from('goaffpro_affiliates')
      .select('*')
      .limit(1);
    
    if (unauthError) {
      console.error('❌ Unauthenticated access error:', unauthError.message);
    } else {
      console.log('✅ Unauthenticated access successful:', unauthData?.length || 0, 'records');
    }
    
    // Test 3: Check if there are any users in the system
    console.log('\n🧪 Test 3: Check existing users');
    const { data: users, error: usersError } = await serviceRoleClient
      .from('users')
      .select('*');
    
    if (usersError) {
      console.error('❌ Users query error:', usersError);
    } else {
      console.log('👥 Users in system:', users?.length || 0);
      if (users && users.length > 0) {
        users.forEach(user => {
          console.log(`  - ${user.email} (ID: ${user.id}, Admin: ${user.is_admin || false})`);
        });
      }
    }
    
    // Test 4: Check auth.users table
    console.log('\n🧪 Test 4: Check auth.users table');
    const { data: authUsers, error: authUsersError } = await serviceRoleClient
      .from('auth.users')
      .select('id, email, raw_user_meta_data')
      .limit(5);
    
    if (authUsersError) {
      console.error('❌ Auth users query error:', authUsersError);
    } else {
      console.log('🔐 Auth users:', authUsers?.length || 0);
      if (authUsers && authUsers.length > 0) {
        authUsers.forEach(user => {
          console.log(`  - ${user.email} (ID: ${user.id})`);
          console.log(`    Metadata:`, user.raw_user_meta_data);
        });
      }
    }
    
    // Test 5: Try to create a test user
    console.log('\n🧪 Test 5: Create test user');
    const testEmail = 'admin@bitcoinisbae.com';
    const testPassword = 'testpassword123';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          is_admin: true,
          name: 'Test Admin'
        }
      }
    });
    
    if (signUpError) {
      console.error('❌ Sign up error:', signUpError.message);
    } else {
      console.log('✅ Test user created:', signUpData.user?.email);
      console.log('🔑 User ID:', signUpData.user?.id);
      
      // Test 6: Try to access data with authenticated user
      console.log('\n🧪 Test 6: Access data with authenticated user');
      const { data: authData, error: authError } = await supabase
        .from('goaffpro_affiliates')
        .select('*')
        .limit(3);
      
      if (authError) {
        console.error('❌ Authenticated access error:', authError.message);
      } else {
        console.log('✅ Authenticated access successful:', authData?.length || 0, 'records');
        if (authData && authData.length > 0) {
          console.log('📋 Sample data:', {
            email: authData[0].email,
            status: authData[0].status,
            first_name: authData[0].first_name,
            last_name: authData[0].last_name
          });
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testAuthStatus(); 