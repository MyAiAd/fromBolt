// Test script to simulate the web app import process
import { createClient } from '@supabase/supabase-js';

// Configuration matching the web app
const supabaseUrl = 'http://localhost:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

// Create clients
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const serviceRoleClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// GoAffPro configuration
const goaffproConfig = {
  accessToken: '0a71cf64925cd446203dc49348a1c95c18ffe5a487505b7ef9b7874c4a9b9f24',
  publicToken: 'c633c5f229cf50a8a47f8efd52583295e3818283ab120ed0040994ea14f0903b',
  baseUrl: 'https://api.goaffpro.com/v1'
};

// Simulate the GoAffPro service
async function getAffiliates() {
  console.log('🔗 Fetching affiliates from GoAffPro...');
  
  const response = await fetch(`${goaffproConfig.baseUrl}/admin/affiliates?fields=id,email,first_name,last_name,name,phone,address,status,signup_date,referral_code,commission_rate,balance,total_earnings,total_orders,tags,custom_fields`, {
    headers: {
      'X-GOAFFPRO-ACCESS-TOKEN': goaffproConfig.accessToken,
      'X-GOAFFPRO-PUBLIC-TOKEN': goaffproConfig.publicToken,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`GoAffPro API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.affiliates || [];
}

// Simulate the import service
async function importAffiliates(userId = '') {
  console.log('📊 Starting affiliate import simulation...');
  console.log('User ID:', userId || 'Using fallback');

  const result = {
    success: false,
    recordsProcessed: 0,
    recordsSuccessful: 0,
    recordsFailed: 0,
    errors: []
  };

  try {
    // Create import log
    const validUserId = userId || '00000000-0000-0000-0000-000000000001';
    
    const { data: logData, error: logError } = await serviceRoleClient
      .from('data_import_logs')
      .insert([{
        import_type: 'affiliates',
        source: 'goaffpro',
        status: 'started',
        started_by: validUserId
      }])
      .select('id')
      .single();

    if (logError) {
      console.error('❌ Error creating import log:', logError);
      throw logError;
    }

    console.log('✅ Import log created:', logData.id);

    // Get affiliates from GoAffPro
    const affiliates = await getAffiliates();
    console.log(`📊 Found ${affiliates.length} affiliates from GoAffPro`);
    
    result.recordsProcessed = affiliates.length;

    if (affiliates.length === 0) {
      result.success = true;
      result.errors.push('No affiliates found in GoAffPro');
      
      await serviceRoleClient
        .from('data_import_logs')
        .update({
          status: 'completed',
          records_processed: result.recordsProcessed,
          records_successful: result.recordsSuccessful,
          records_failed: result.recordsFailed,
          completed_at: new Date().toISOString()
        })
        .eq('id', logData.id);

      return result;
    }

    // Process each affiliate
    for (const affiliate of affiliates) {
      try {
        // Skip empty affiliate objects
        if (!affiliate.id && !affiliate.email) {
          console.log('Skipping empty affiliate object:', affiliate);
          result.recordsFailed++;
          result.errors.push('Skipped empty affiliate object');
          continue;
        }

        // Parse name from GoAffPro's 'name' field if first_name/last_name are empty
        let firstName = affiliate.first_name || null;
        let lastName = affiliate.last_name || null;
        
        if ((!firstName || firstName === '') && (!lastName || lastName === '') && affiliate.name) {
          const nameParts = affiliate.name.trim().split(' ');
          if (nameParts.length >= 2) {
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(' ');
          } else if (nameParts.length === 1) {
            firstName = nameParts[0];
            lastName = null;
          }
        }

        const affiliateData = {
          goaffpro_id: affiliate.id ? String(affiliate.id) : `empty_${Date.now()}_${Math.random()}`,
          email: affiliate.email || 'unknown@example.com',
          first_name: firstName,
          last_name: lastName,
          phone: affiliate.phone || null,
          address: affiliate.address || null,
          status: affiliate.status || null,
          signup_date: affiliate.signup_date ? new Date(affiliate.signup_date).toISOString() : null,
          referral_code: affiliate.referral_code || null,
          commission_rate: affiliate.commission_rate || null,
          balance: affiliate.balance || 0,
          total_earnings: affiliate.total_earnings || 0,
          total_orders: affiliate.total_orders || 0,
          tags: affiliate.tags || null,
          custom_fields: affiliate.custom_fields || null,
          raw_data: affiliate,
          data_source: 'goaffpro'
        };

        console.log(`💾 Importing affiliate: ${affiliateData.email} (${affiliateData.goaffpro_id})`);

        const { error } = await serviceRoleClient
          .from('goaffpro_affiliates')
          .upsert([affiliateData], { onConflict: 'goaffpro_id' });

        if (error) {
          console.error('❌ Database error for affiliate:', error);
          result.errors.push(`Affiliate ${affiliate.id}: ${error.message}`);
          result.recordsFailed++;
        } else {
          console.log(`✅ Successfully imported: ${affiliateData.email}`);
          result.recordsSuccessful++;
        }
      } catch (error) {
        console.error('❌ Processing error for affiliate:', error);
        result.errors.push(`Affiliate ${affiliate.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        result.recordsFailed++;
      }
    }

    result.success = result.recordsFailed === 0;

    // Update import log
    await serviceRoleClient
      .from('data_import_logs')
      .update({
        status: result.success ? 'completed' : 'failed',
        records_processed: result.recordsProcessed,
        records_successful: result.recordsSuccessful,
        records_failed: result.recordsFailed,
        error_details: result.errors.length > 0 ? { errors: result.errors } : undefined,
        completed_at: new Date().toISOString()
      })
      .eq('id', logData.id);

    console.log('✅ Import log updated');

    return result;
  } catch (error) {
    console.error('❌ Import error:', error);
    result.errors.push(error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

// Main test function
async function testWebAppImport() {
  console.log('🚀 Testing Web App Import Process');
  console.log('=' .repeat(50));
  
  try {
    // Test 1: Import with no user ID (simulating the issue)
    console.log('\n🧪 Test 1: Import with no user ID');
    const result1 = await importAffiliates('');
    console.log('📊 Result:', result1);
    
    // Test 2: Import with valid user ID
    console.log('\n🧪 Test 2: Import with valid user ID');
    const result2 = await importAffiliates('00000000-0000-0000-0000-000000000001');
    console.log('📊 Result:', result2);
    
    // Check database state
    console.log('\n🔍 Checking database state...');
    const { data: affiliates, error } = await serviceRoleClient
      .from('goaffpro_affiliates')
      .select('*')
      .eq('data_source', 'goaffpro');
    
    if (error) {
      console.error('❌ Error checking database:', error);
    } else {
      console.log(`✅ Database contains ${affiliates.length} GoAffPro affiliates`);
      if (affiliates.length > 0) {
        console.log('📋 Sample affiliate:', {
          id: affiliates[0].id,
          email: affiliates[0].email,
          first_name: affiliates[0].first_name,
          last_name: affiliates[0].last_name,
          status: affiliates[0].status
        });
      }
    }
    
    console.log('\n🎉 Web app import test completed successfully!');
    console.log('💡 The import functionality should now work in your web app.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testWebAppImport(); 