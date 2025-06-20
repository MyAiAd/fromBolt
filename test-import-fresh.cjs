// Test script to import fresh GoAffPro data with proper field mapping
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const config = {
  accessToken: process.env.VITE_GOAFFPRO_ACCESS_TOKEN,
  publicToken: process.env.VITE_GOAFFPRO_PUBLIC_TOKEN,
  baseUrl: 'https://api.goaffpro.com/v1'
};

async function importFreshGoAffProData() {
  console.log('🚀 Starting fresh GoAffPro data import...');
  
  try {
    // Fetch affiliates with all available fields
    console.log('📊 Fetching affiliates from GoAffPro...');
    const response = await fetch(`${config.baseUrl}/admin/affiliates?fields=id,email,first_name,last_name,name,phone,address,status,signup_date,referral_code,commission_rate,balance,total_earnings,total_orders,tags,custom_fields`, {
      headers: {
        'X-GOAFFPRO-ACCESS-TOKEN': config.accessToken,
        'X-GOAFFPRO-PUBLIC-TOKEN': config.publicToken,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`GoAffPro API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.affiliates?.length || 0} affiliates from GoAffPro`);

    if (!data.affiliates || data.affiliates.length === 0) {
      console.log('ℹ️ No affiliates found in GoAffPro');
      return;
    }

    // Clear existing GoAffPro data
    console.log('🧹 Clearing existing GoAffPro data...');
    const { error: deleteError } = await supabase
      .from('goaffpro_affiliates')
      .delete()
      .eq('data_source', 'goaffpro');

    if (deleteError) {
      console.error('❌ Error clearing existing data:', deleteError);
    } else {
      console.log('✅ Cleared existing GoAffPro data');
    }

    // Insert fresh data
    console.log('💾 Inserting fresh affiliate data...');
    const affiliatesToInsert = data.affiliates.map(affiliate => ({
      goaffpro_id: affiliate.id.toString(),
      email: affiliate.email,
      first_name: affiliate.first_name || null,
      last_name: affiliate.last_name || null,
      phone: affiliate.phone || null,
      address: affiliate.address || null,
      status: affiliate.status || 'pending',
      signup_date: affiliate.signup_date || null,
      referral_code: affiliate.referral_code || null,
      commission_rate: affiliate.commission_rate || null,
      balance: affiliate.balance || 0,
      total_earnings: affiliate.total_earnings || 0,
      total_orders: affiliate.total_orders || 0,
      tags: affiliate.tags || [],
      custom_fields: affiliate.custom_fields || {},
      data_source: 'goaffpro'
    }));

    const { data: insertedData, error: insertError } = await supabase
      .from('goaffpro_affiliates')
      .insert(affiliatesToInsert)
      .select();

    if (insertError) {
      console.error('❌ Error inserting affiliate data:', insertError);
      return;
    }

    console.log(`✅ Successfully inserted ${insertedData.length} affiliates`);
    
    // Show sample of inserted data
    if (insertedData.length > 0) {
      console.log('\n📋 Sample inserted affiliate:');
      const sample = insertedData[0];
      console.log(`  ID: ${sample.id}`);
      console.log(`  GoAffPro ID: ${sample.goaffpro_id}`);
      console.log(`  Email: ${sample.email}`);
      console.log(`  Name: ${sample.first_name} ${sample.last_name}`);
      console.log(`  Status: ${sample.status}`);
      console.log(`  Total Earnings: $${sample.total_earnings || 0}`);
      console.log(`  Total Orders: ${sample.total_orders || 0}`);
    }

    console.log('\n🎉 Fresh GoAffPro data import completed successfully!');

  } catch (error) {
    console.error('❌ Error importing GoAffPro data:', error);
  }
}

importFreshGoAffProData().catch(console.error); 