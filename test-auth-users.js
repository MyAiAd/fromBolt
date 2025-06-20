import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuthUsers() {
  console.log('Testing auth users...');
  
  try {
    // Try to create a test user
    console.log('Creating test user...');
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'test123456',
      options: {
        data: { name: 'Test User' }
      }
    });
    
    if (error) {
      console.error('❌ Signup failed:', error.message);
      
      // Try to login with existing credentials
      console.log('Trying to login with test credentials...');
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'test123456'
      });
      
      if (loginError) {
        console.error('❌ Login also failed:', loginError.message);
        
        // Try with admin credentials
        console.log('Trying admin credentials...');
        const { data: adminData, error: adminError } = await supabase.auth.signInWithPassword({
          email: 'admin@example.com',
          password: 'admin123'
        });
        
        if (adminError) {
          console.error('❌ Admin login failed:', adminError.message);
          return;
        } else {
          console.log('✅ Admin login successful');
          console.log('  User:', adminData.user.email);
        }
      } else {
        console.log('✅ Test user login successful');
        console.log('  User:', loginData.user.email);
      }
    } else {
      console.log('✅ Test user created successfully');
      console.log('  User:', data.user.email);
    }
    
    // Now test logout
    console.log('\nTesting logout...');
    const { error: logoutError } = await supabase.auth.signOut();
    
    if (logoutError) {
      console.error('❌ Logout failed:', logoutError);
    } else {
      console.log('✅ Logout successful');
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testAuthUsers(); 