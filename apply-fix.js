import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

async function applyFix() {
  try {
    console.log('🔧 Applying RLS policy fix...');
    
    // Read the SQL file
    const sql = readFileSync('fix-rls-policies.sql', 'utf8');
    
    // Split into individual statements and execute them
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        
        const { error } = await supabase.rpc('exec', { sql: statement });
        
        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error);
          // Continue with other statements
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      }
    }
    
    console.log('\n🎉 RLS policy fix applied!');
    
    // Test the fix
    console.log('\n🧪 Testing anonymous access...');
    const anonSupabase = createClient(
      'http://127.0.0.1:54321',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
    );
    
    const { data: testData, error: testError } = await anonSupabase
      .from('goaffpro_affiliates')
      .select('*')
      .limit(1);
      
    if (testError) {
      console.error('❌ Test failed:', testError);
    } else {
      console.log('✅ Anonymous access test successful!');
      console.log(`Found ${testData?.length || 0} records`);
      if (testData && testData.length > 0) {
        console.log('Sample record:', {
          id: testData[0].id,
          email: testData[0].email,
          status: testData[0].status
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

applyFix(); 