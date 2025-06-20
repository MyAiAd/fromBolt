import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function checkData() {
  console.log('🔍 Checking current affiliate data in database...');
  
  const { data, error, count } = await supabase
    .from('goaffpro_affiliates')
    .select('*', { count: 'exact' });
  
  if (error) {
    console.error('❌ Database error:', error);
  } else {
    console.log(`✅ Found ${count} total affiliates in database`);
    if (data && data.length > 0) {
      console.log('📋 Sample affiliate:');
      console.log(`  Name: ${data[0].first_name} ${data[0].last_name}`);
      console.log(`  Email: ${data[0].email}`);
      console.log(`  Data Source: ${data[0].data_source}`);
    }
  }

  // Also check orders
  const { data: orders, error: ordersError, count: ordersCount } = await supabase
    .from('goaffpro_orders')
    .select('*', { count: 'exact' });
  
  if (ordersError) {
    console.error('❌ Orders error:', ordersError);
  } else {
    console.log(`✅ Found ${ordersCount} total orders in database`);
    if (orders && orders.length > 0) {
      console.log('📋 Sample order:');
      console.log(`  Customer: ${orders[0].customer_name}`);
      console.log(`  Total: $${orders[0].order_total}`);
      console.log(`  Data Source: ${orders[0].data_source}`);
    }
  }
}

checkData(); 