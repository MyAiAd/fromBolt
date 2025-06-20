// Final verification script to confirm names are working properly
import { createClient } from '@supabase/supabase-js';

const supabaseConfig = {
  url: 'http://localhost:54321',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
};

const supabase = createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey);

async function verifyNamesFix() {
  console.log('🔍 Final verification of names fix...\n');
  
  try {
    // Check database state
    console.log('=== Database State ===');
    const { data: dbData, error: dbError } = await supabase
      .from('goaffpro_affiliates')
      .select('goaffpro_id, email, first_name, last_name, status')
      .order('email');
    
    if (dbError) {
      console.error('❌ Database error:', dbError);
      return;
    }
    
    console.log(`📊 Found ${dbData.length} affiliates in database:`);
    dbData.forEach((affiliate, index) => {
      const displayName = affiliate.first_name && affiliate.last_name 
        ? `${affiliate.first_name} ${affiliate.last_name}`
        : affiliate.first_name || affiliate.last_name || 'No Name';
      console.log(`${index + 1}. ${displayName} (${affiliate.email}) - Status: ${affiliate.status}`);
    });
    
    // Test aggregation service simulation
    console.log('\n=== Aggregation Service Simulation ===');
    const aggregated = dbData.map(affiliate => {
      // Simulate the name fallback logic from the aggregation service
      let displayName = 'Unknown';
      
      if (affiliate.first_name && affiliate.last_name) {
        displayName = `${affiliate.first_name} ${affiliate.last_name}`;
      } else if (affiliate.first_name) {
        displayName = affiliate.first_name;
      } else if (affiliate.last_name) {
        displayName = affiliate.last_name;
      } else {
        // Fallback to email username
        displayName = affiliate.email.split('@')[0];
      }
      
      return {
        id: `goaffpro_${affiliate.goaffpro_id}`,
        name: displayName,
        email: affiliate.email,
        source: 'goaffpro',
        status: affiliate.status === 'approved' ? 'Active' : 'Pending'
      };
    });
    
    console.log('📋 Aggregated results (as they would appear in your app):');
    aggregated.forEach((affiliate, index) => {
      console.log(`${index + 1}. ${affiliate.name} (${affiliate.email}) - ${affiliate.status}`);
    });
    
    // Summary
    console.log('\n=== Summary ===');
    const withNames = dbData.filter(a => a.first_name || a.last_name).length;
    const withoutNames = dbData.length - withNames;
    
    console.log(`✅ Affiliates with proper names: ${withNames}/${dbData.length}`);
    console.log(`⚠️  Affiliates without names: ${withoutNames}/${dbData.length}`);
    
    if (withNames === dbData.length) {
      console.log('🎉 SUCCESS: All affiliates now have proper names!');
      console.log('💡 Your app should now display real names instead of email usernames.');
    } else {
      console.log('⚠️  Some affiliates still missing names. You may need to re-run the import.');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

verifyNamesFix(); 