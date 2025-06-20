import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const SHOPIFY_SHOP_DOMAIN = process.env.SHOPIFY_SHOP_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function fetchShopifyProducts() {
  try {
    const response = await fetch(
      `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/2024-01/products.json`,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const { products } = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    throw error;
  }
}

async function syncProducts(products) {
  for (const product of products) {
    try {
      const { error } = await supabase
        .from('shopify_products')
        .upsert({
          shopify_product_id: product.id.toString(),
          title: product.title,
          handle: product.handle,
          vendor: product.vendor,
          product_type: product.product_type,
          price: product.variants[0]?.price,
          compare_at_price: product.variants[0]?.compare_at_price,
          sku: product.variants[0]?.sku,
          inventory_quantity: product.variants[0]?.inventory_quantity,
          status: product.status,
        }, {
          onConflict: 'shopify_product_id'
        });

      if (error) throw error;
      console.log(`Synced product: ${product.title}`);
    } catch (error) {
      console.error(`Error syncing product ${product.title}:`, error);
    }
  }
}

async function fetchShopifyOrders() {
  try {
    const response = await fetch(
      `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/2024-01/orders.json?status=any`,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    const { orders } = await response.json();
    return orders;
  } catch (error) {
    console.error('Error fetching Shopify orders:', error);
    throw error;
  }
}

async function syncOrders(orders) {
  for (const order of orders) {
    try {
      // Insert order
      const { data: orderData, error: orderError } = await supabase
        .from('shopify_orders')
        .upsert({
          shopify_order_id: order.id.toString(),
          order_number: order.order_number,
          email: order.email,
          total_price: order.total_price,
          subtotal_price: order.subtotal_price,
          total_tax: order.total_tax,
          currency: order.currency,
          financial_status: order.financial_status,
          fulfillment_status: order.fulfillment_status,
          customer_id: order.customer?.id?.toString(),
          first_name: order.customer?.first_name,
          last_name: order.customer?.last_name,
          // Extract affiliate info from order attributes if available
          affiliate_id: null, // This will be updated when we implement affiliate tracking
          referral_code: null,
          utm_source: order.source_name,
          utm_medium: order.source_identifier,
          utm_campaign: order.tags?.find(tag => tag.startsWith('utm_campaign:'))?.split(':')[1],
        }, {
          onConflict: 'shopify_order_id'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = order.line_items.map(item => ({
        order_id: orderData.id,
        shopify_product_id: item.product_id.toString(),
        variant_id: item.variant_id?.toString(),
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        sku: item.sku,
      }));

      const { error: itemsError } = await supabase
        .from('shopify_order_items')
        .upsert(orderItems, {
          onConflict: ['order_id', 'shopify_product_id', 'variant_id']
        });

      if (itemsError) throw itemsError;
      console.log(`Synced order: ${order.order_number}`);
    } catch (error) {
      console.error(`Error syncing order ${order.order_number}:`, error);
    }
  }
}

async function syncAll() {
  console.log('Starting Shopify sync...');
  
  try {
    // Sync products
    console.log('Fetching products...');
    const products = await fetchShopifyProducts();
    console.log(`Found ${products.length} products`);
    await syncProducts(products);
    
    // Sync orders
    console.log('Fetching orders...');
    const orders = await fetchShopifyOrders();
    console.log(`Found ${orders.length} orders`);
    await syncOrders(orders);
    
    console.log('Shopify sync completed successfully');
  } catch (error) {
    console.error('Error during sync:', error);
    process.exit(1);
  }
}

syncAll();