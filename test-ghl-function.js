import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 Testing GHL Import Server Function');
console.log(`Supabase URL: ${supabaseUrl}`);

async function testGHLFunction() {
  try {
    // Use the known user ID directly for testing
    const userId = '1ff88f35-5ad2-4878-bc21-ebc48cd6d118';
    
    console.log('\n🔄 Testing GHL import function...');
    console.log('Using user ID:', userId);
    
    // Create a test JWT token for the function call
    // Since we're testing locally, we can create a simple token
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxOTgzODEyOTk2LCJzdWIiOiIxZmY4OGYzNS01YWQyLTQ4NzgtYmMyMS1lYmM0OGNkNmQxMTgiLCJlbWFpbCI6InNhZ2VAbXlhaS5hZCIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnt9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzMzNTU4MzUzfV0sInNlc3Npb25faWQiOiJhYmNkZWZnaCIsImlzcyI6Imh0dHA6Ly8xMjcuMC4wLjE6NTQzMjEiLCJpYXQiOjE3MzM1NTgzNTN9.placeholder';

    const { data, error } = await supabase.functions.invoke('ghl-import', {
      body: {
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI',
        locationId: 'w01Gc7T4b0tKSDQdKhuN',
        userId: userId
      },
      headers: {
        Authorization: `Bearer ${testToken}`,
      }
    });

    if (error) {
      console.error('❌ Function error:', error);
      console.log('Error details:', JSON.stringify(error, null, 2));
      return;
    }

    console.log('✅ Function response:', data);

    if (data && data.success) {
      console.log(`\n📊 Import Results:`);
      console.log(`  Records Processed: ${data.recordsProcessed}`);
      console.log(`  Records Successful: ${data.recordsSuccessful}`);
      console.log(`  Records Failed: ${data.recordsFailed}`);
      console.log(`  Records Updated: ${data.recordsUpdated}`);
      
      if (data.errors && data.errors.length > 0) {
        console.log(`\n⚠️ Errors:`);
        data.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error}`);
        });
      }
    } else {
      console.log('❌ Import failed:', data?.error || 'Unknown error');
      if (data?.errors) {
        console.log('Errors:', data.errors);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('Error details:', JSON.stringify(error, null, 2));
  }
}

testGHLFunction().catch(console.error); 