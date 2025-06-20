// Test script to verify name parsing logic
import { createClient } from '@supabase/supabase-js';

const config = {
  accessToken: process.env.VITE_GOAFFPRO_ACCESS_TOKEN,
  publicToken: process.env.VITE_GOAFFPRO_PUBLIC_TOKEN,
  baseUrl: 'https://api.goaffpro.com/v1'
};

const supabaseConfig = {
  url: 'http://localhost:54321',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
};

const supabase = createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey);

async function testNameParsing() {
  try {
    console.log('🧪 Testing name parsing logic...\n');
    
    // Fetch affiliates from GoAffPro
    const response = await fetch(`${config.baseUrl}/admin/affiliates?fields=id,email,first_name,last_name,name,status`, {
      headers: {
        'X-GOAFFPRO-ACCESS-TOKEN': config.accessToken,
        'X-GOAFFPRO-PUBLIC-TOKEN': config.publicToken,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`GoAffPro API error: ${response.status}`);
    }
    
    const data = await response.json();
    const affiliates = data.affiliates || [];
    
    console.log(`📊 Processing ${affiliates.length} affiliates...\n`);
    
    // Clear existing data
    await supabase.from('goaffpro_affiliates').delete().eq('data_source', 'goaffpro');
    console.log('🧹 Cleared existing GoAffPro data\n');
    
    // Process each affiliate with name parsing logic
    for (const affiliate of affiliates) {
      console.log(`Processing: ${affiliate.email}`);
      console.log(`  Raw first_name: "${affiliate.first_name}"`);
      console.log(`  Raw last_name: "${affiliate.last_name}"`);
      console.log(`  Raw name: "${affiliate.name}"`);
      
      // Apply the same name parsing logic as in the import service
      let firstName = affiliate.first_name || null;
      let lastName = affiliate.last_name || null;
      
      // If first_name and last_name are empty but name field exists, parse it
      if ((!firstName || firstName === '') && (!lastName || lastName === '') && affiliate.name) {
        const nameParts = affiliate.name.trim().split(' ');
        if (nameParts.length >= 2) {
          firstName = nameParts[0];
          lastName = nameParts.slice(1).join(' '); // Join remaining parts as last name
        } else if (nameParts.length === 1) {
          firstName = nameParts[0];
          lastName = null;
        }
      }
      
      console.log(`  Parsed first_name: "${firstName}"`);
      console.log(`  Parsed last_name: "${lastName}"`);
      
      // Insert into database
      const affiliateData = {
        goaffpro_id: affiliate.id.toString(),
        email: affiliate.email,
        first_name: firstName,
        last_name: lastName,
        status: affiliate.status,
        raw_data: affiliate,
        data_source: 'goaffpro'
      };
      
      const { error } = await supabase
        .from('goaffpro_affiliates')
        .insert([affiliateData]);
      
      if (error) {
        console.log(`  ❌ Error: ${error.message}`);
      } else {
        console.log(`  ✅ Inserted successfully`);
      }
      
      console.log('');
    }
    
    // Verify the results
    console.log('🔍 Verifying results...\n');
    const { data: results, error } = await supabase
      .from('goaffpro_affiliates')
      .select('*')
      .eq('data_source', 'goaffpro')
      .order('email');
    
    if (error) {
      console.error('❌ Error fetching results:', error);
      return;
    }
    
    console.log('📊 Final Results:');
    results.forEach((affiliate, index) => {
      const displayName = affiliate.first_name && affiliate.last_name 
        ? `${affiliate.first_name} ${affiliate.last_name}`
        : affiliate.first_name || affiliate.last_name || 'No Name';
      console.log(`${index + 1}. ${displayName} (${affiliate.email})`);
    });
    
    console.log('\n🎉 Name parsing test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testNameParsing(); 