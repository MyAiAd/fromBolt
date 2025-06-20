import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'http://localhost:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
);

async function checkOrders() {
  console.log('🔍 Checking detailed order data...\n');
  
  const { data: orders, error } = await supabase
    .from('goaffpro_orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log(`📊 Found ${orders?.length || 0} orders`);
  
  if (orders && orders.length > 0) {
    console.log('\n📋 Order details:');
    orders.forEach((order, idx) => {
      console.log(`\n📦 Order ${idx + 1}:`);
      console.log(`   ID: ${order.id}`);
      console.log(`   GoAffPro Order ID: ${order.goaffpro_order_id || 'N/A'}`);
      console.log(`   Order Number: ${order.order_number || 'N/A'}`);
      console.log(`   Customer: ${order.customer_name || 'N/A'} (${order.customer_email || 'N/A'})`);
      console.log(`   Order Total: ${order.order_total || order.order_value || 'N/A'}`);
      console.log(`   Commission: ${order.commission_amount || order.commission || 'N/A'}`);
      console.log(`   Status: ${order.status || 'N/A'}`);
      console.log(`   Data Source: ${order.data_source}`);
      console.log(`   Products: ${Array.isArray(order.products) ? order.products.length : 'N/A'} items`);
      console.log(`   Raw Data Line Items: ${order.raw_data?.line_items ? order.raw_data.line_items.length : 'N/A'} items`);
      console.log(`   Created: ${order.created_at}`);
      
      // Show shipping address details if available
      if (order.raw_data?.shipping_address) {
        const addr = order.raw_data.shipping_address;
        console.log(`   Shipping: ${addr.name || 'N/A'} - ${addr.address_1 || 'N/A'}, ${addr.city || 'N/A'}, ${addr.state || 'N/A'} ${addr.zip || 'N/A'}`);
      }
      
      // Show product details if available
      if (Array.isArray(order.products) && order.products.length > 0) {
        console.log(`   Product Details:`);
        order.products.forEach((product, pidx) => {
          console.log(`     ${pidx + 1}. ${product.name || product.sku || 'Unknown'} - Qty: ${product.quantity || 1} - Price: ${product.price || product.total_price || 'N/A'}`);
        });
      } else if (order.raw_data?.line_items && Array.isArray(order.raw_data.line_items)) {
        console.log(`   Line Items Details:`);
        order.raw_data.line_items.forEach((item, lidx) => {
          console.log(`     ${lidx + 1}. ${item.name || item.sku || 'Unknown'} - Qty: ${item.quantity || 1} - Price: ${item.price || item.total_price || 'N/A'}`);
        });
      }
    });
  }
}

checkOrders().catch(console.error); 