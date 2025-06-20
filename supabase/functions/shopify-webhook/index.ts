import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify Shopify webhook signature
    const hmac = req.headers.get('x-shopify-hmac-sha256');
    const shopDomain = req.headers.get('x-shopify-shop-domain');
    const topic = req.headers.get('x-shopify-topic');

    if (!hmac || !shopDomain || !topic) {
      return new Response('Missing required headers', { status: 400 });
    }

    const payload = await req.json();

    // Store the webhook
    const { data: webhook, error: webhookError } = await supabaseClient
      .from('shopify_webhooks')
      .insert({
        topic,
        shop_domain: shopDomain,
        payload,
      })
      .select()
      .single();

    if (webhookError) {
      throw webhookError;
    }

    // Process the webhook based on topic
    switch (topic) {
      case 'orders/create':
        await processOrder(supabaseClient, payload);
        break;
      case 'products/create':
      case 'products/update':
        await processProduct(supabaseClient, payload);
        break;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function processOrder(supabase, order) {
  // Extract affiliate information from order attributes or URL parameters
  const affiliateInfo = extractAffiliateInfo(order);

  // Create order record
  const { data: orderData, error: orderError } = await supabase
    .from('shopify_orders')
    .insert({
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
      affiliate_id: affiliateInfo.affiliateId,
      referral_code: affiliateInfo.referralCode,
      utm_source: order.utm_source,
      utm_medium: order.utm_medium,
      utm_campaign: order.utm_campaign,
    })
    .select()
    .single();

  if (orderError) {
    throw orderError;
  }

  // Create order items
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
    .insert(orderItems);

  if (itemsError) {
    throw itemsError;
  }
}

async function processProduct(supabase, product) {
  const { error: productError } = await supabase
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

  if (productError) {
    throw productError;
  }
}

function extractAffiliateInfo(order) {
  // Extract affiliate information from order attributes or URL parameters
  // This is a placeholder - implement based on your tracking method
  return {
    affiliateId: null,
    referralCode: null
  };
}