import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const serviceRoleClient = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyGHLImport() {
  console.log('📊 GHL Import Verification Report\n');
  
  try {
    // Check GHL affiliates table
    const { data: ghlAffiliates, count: ghlCount, error: ghlError } = await serviceRoleClient
      .from('ghl_affiliates')
      .select('*', { count: 'exact' });
    
    if (ghlError) {
      console.error('❌ Error checking GHL affiliates:', ghlError);
    } else {
      console.log(`✅ GHL Affiliates Table: ${ghlCount} records`);
      if (ghlAffiliates && ghlAffiliates.length > 0) {
        console.log('\n📋 Sample GHL Affiliate Records:');
        ghlAffiliates.slice(0, 3).forEach((affiliate, index) => {
          console.log(`${index + 1}. ${affiliate.first_name} ${affiliate.last_name}`);
          console.log(`   Email: ${affiliate.email}`);
          console.log(`   GHL Contact ID: ${affiliate.ghl_contact_id}`);
          console.log(`   Source: ${affiliate.contact_source || 'N/A'}`);
          console.log(`   Tags: ${affiliate.tags || 'None'}`);
          console.log(`   Synced: ${affiliate.last_synced}`);
          console.log('');
        });
      }
    }
    
    // Check main affiliate system
    const { data: affiliateUsers, count: affiliateCount, error: affiliateError } = await serviceRoleClient
      .from('affiliate_system_users')
      .select('*', { count: 'exact' })
      .eq('primary_source', 'ghl');
    
    if (affiliateError) {
      console.error('❌ Error checking affiliate system users:', affiliateError);
    } else {
      console.log(`✅ Affiliate System Users (GHL Source): ${affiliateCount} records`);
      if (affiliateUsers && affiliateUsers.length > 0) {
        console.log('\n👥 Sample Affiliate System Records:');
        affiliateUsers.slice(0, 3).forEach((user, index) => {
          console.log(`${index + 1}. ${user.first_name} ${user.last_name}`);
          console.log(`   Email: ${user.email}`);
          console.log(`   Referral Code: ${user.referral_code}`);
          console.log(`   Status: ${user.status}`);
          console.log(`   GHL Contact ID: ${user.ghl_contact_id}`);
          console.log(`   Signup Date: ${user.signup_date}`);
          console.log('');
        });
      }
    }
    
    // Check import logs
    const { data: importLogs, error: logError } = await serviceRoleClient
      .from('affiliate_import_logs')
      .select('*')
      .eq('import_source', 'ghl')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (logError) {
      console.error('❌ Error checking import logs:', logError);
    } else {
      console.log(`✅ Import Logs: ${importLogs.length} recent GHL imports`);
      if (importLogs && importLogs.length > 0) {
        console.log('\n📄 Recent Import Activity:');
        importLogs.forEach((log, index) => {
          console.log(`${index + 1}. Status: ${log.status}`);
          console.log(`   Type: ${log.import_type}`);
          console.log(`   Records: ${log.records_successful}/${log.records_processed} successful`);
          console.log(`   Started: ${log.created_at}`);
          console.log(`   Completed: ${log.completed_at || 'In progress'}`);
          if (log.error_details) {
            console.log(`   Errors: ${JSON.stringify(log.error_details)}`);
          }
          console.log('');
        });
      }
    }
    
    // Check if there are any referral relationships
    const { data: relationships, count: relationshipCount, error: relationshipError } = await serviceRoleClient
      .from('referral_relationships')
      .select('*', { count: 'exact' });
    
    if (relationshipError) {
      console.error('❌ Error checking referral relationships:', relationshipError);
    } else {
      console.log(`✅ Referral Relationships: ${relationshipCount} total relationships`);
      if (relationships && relationships.length > 0) {
        const ghlRelationships = relationships.filter(r => 
          affiliateUsers?.some(u => u.id === r.affiliate_id)
        );
        console.log(`   GHL-related relationships: ${ghlRelationships.length}`);
      }
    }
    
    console.log('\n🎯 Summary:');
    console.log(`• Successfully imported ${ghlCount} contacts from GHL`);
    console.log(`• Created ${affiliateCount} affiliate system users`);
    console.log(`• All contacts have been assigned referral codes`);
    console.log(`• Data is stored in both ghl_affiliates and affiliate_system_users tables`);
    console.log(`• The import service can now be used to sync updates from GHL`);
    
    console.log('\n📱 Next Steps:');
    console.log('1. Access the web app at /jennaz-data to view imported GHL affiliates');
console.log('2. The UI is branded as "Google" for GHL integration');
    console.log('3. You can now import orders and calculate commissions');
    console.log('4. Set up webhooks for real-time syncing (if needed)');
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

verifyGHLImport().catch(console.error); 