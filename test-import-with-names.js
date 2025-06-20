// Import script to fetch GoAffPro affiliates with proper names and update database
import { createClient } from '@supabase/supabase-js';

// Configuration
const goaffproConfig = {
  accessToken: '0a71cf64925cd446203dc49348a1c95c18ffe5a487505b7ef9b7874c4a9b9f24',
  baseUrl: 'https://api.goaffpro.com/v1'
};

const supabaseConfig = {
  url: 'http://localhost:54321',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
};

const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

async function fetchGoAffProAffiliatesWithNames() {
  console.log('🔍 Fetching GoAffPro affiliates with proper field mapping...\n');
  
  try {
    // Request specific fields including names
    const fields = 'id,email,first_name,last_name,name,status,created_at,total_orders,total_commission,pending_commission,paid_commission,referral_code';
    const response = await fetch(`${goaffproConfig.baseUrl}/admin/affiliates?fields=${fields}`, {
      headers: {
        'X-GOAFFPRO-ACCESS-TOKEN': goaffproConfig.accessToken,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Successfully fetched ${data.total_results} affiliates from GoAffPro`);
    
    return data.affiliates;
  } catch (error) {
    console.error('❌ Error fetching from GoAffPro:', error);
    throw error;
  }
}

async function updateDatabaseWithNames(affiliates) {
  console.log('\n📝 Updating database with proper names...\n');
  
  for (const affiliate of affiliates) {
    try {
      console.log(`Processing: ${affiliate.name} (${affiliate.email})`);
      
      // Map GoAffPro status to our status
      const statusMapping = {
        'approved': 'Active',
        'pending': 'Pending',
        'rejected': 'Inactive',
        'blocked': 'Inactive'
      };
      
      // Only update fields that exist in the table
      const affiliateData = {
        first_name: affiliate.first_name || null,
        last_name: affiliate.last_name || null,
        status: statusMapping[affiliate.status] || 'Pending',
        total_orders: affiliate.total_orders || 0,
        total_earnings: parseFloat(affiliate.total_commission || 0),
        referral_code: affiliate.referral_code || null,
        updated_at: new Date().toISOString(),
        // Update raw_data with the new API response
        raw_data: affiliate
      };
      
      // Update existing record by goaffpro_id
      const { error: updateError } = await supabase
        .from('goaffpro_affiliates')
        .update(affiliateData)
        .eq('goaffpro_id', affiliate.id.toString());
      
      if (updateError) {
        console.error(`❌ Error updating ${affiliate.email}:`, updateError);
      } else {
        console.log(`✅ Updated: ${affiliate.name} - First: ${affiliate.first_name}, Last: ${affiliate.last_name}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${affiliate.email}:`, error);
    }
  }
}

async function verifyUpdatedData() {
  console.log('\n🔍 Verifying updated data...\n');
  
  try {
    const { data, error } = await supabase
      .from('goaffpro_affiliates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching updated data:', error);
      return;
    }
    
    console.log('📊 Updated GoAffPro Affiliates:');
    data.forEach(affiliate => {
      const displayName = affiliate.first_name && affiliate.last_name 
        ? `${affiliate.first_name} ${affiliate.last_name}`
        : affiliate.first_name || affiliate.last_name || 'No Name';
      console.log(`- ${displayName} (${affiliate.email}) - Status: ${affiliate.status}`);
    });
    
    console.log(`\n✅ Total affiliates in database: ${data.length}`);
  } catch (error) {
    console.error('❌ Error verifying data:', error);
  }
}

async function main() {
  try {
    console.log('🚀 Starting GoAffPro affiliate import with proper names...\n');
    
    // Fetch affiliates with names from GoAffPro
    const affiliates = await fetchGoAffProAffiliatesWithNames();
    
    // Update database with proper names
    await updateDatabaseWithNames(affiliates);
    
    // Verify the updated data
    await verifyUpdatedData();
    
    console.log('\n🎉 Import completed successfully!');
    console.log('💡 The affiliate names should now be properly displayed in your app.');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

main(); 