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
    const shopifyDomain = Deno.env.get('SHOPIFY_SHOP_DOMAIN');
    const shopifyAccessToken = Deno.env.get('SHOPIFY_ACCESS_TOKEN');

    if (!shopifyDomain || !shopifyAccessToken) {
      throw new Error('Missing Shopify configuration');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch products from Shopify
    const response = await fetch(
      `https://${shopifyDomain}/admin/api/2024-01/products.json`,
      {
        headers: {
          'X-Shopify-Access-Token': shopifyAccessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const { products } = await response.json();

    // Update products in Supabase
    for (const product of products) {
      const { error: productError } = await supabaseClient
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

    return new Response(
      JSON.stringify({ success: true, count: products.length }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error syncing products:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});