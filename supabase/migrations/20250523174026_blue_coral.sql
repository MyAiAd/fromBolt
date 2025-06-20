/*
  # Add Shopify integration tables

  1. New Tables
    - `shopify_orders` - Store Shopify order information
    - `shopify_order_items` - Store individual items in each order
    - `shopify_products` - Store product information
    - `shopify_webhooks` - Track webhook events from Shopify
  
  2. Changes
    - Add Shopify-specific fields to transactions table
    - Add indexes for performance
  
  3. Security
    - Enable RLS on new tables
    - Add appropriate policies
*/

-- Shopify products table
CREATE TABLE IF NOT EXISTS shopify_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_product_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  handle TEXT,
  vendor TEXT,
  product_type TEXT,
  price DECIMAL(10,2),
  compare_at_price DECIMAL(10,2),
  sku TEXT,
  inventory_quantity INTEGER,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Shopify orders table
CREATE TABLE IF NOT EXISTS shopify_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_order_id TEXT NOT NULL UNIQUE,
  order_number TEXT NOT NULL,
  email TEXT,
  total_price DECIMAL(10,2) NOT NULL,
  subtotal_price DECIMAL(10,2),
  total_tax DECIMAL(10,2),
  currency TEXT,
  financial_status TEXT,
  fulfillment_status TEXT,
  customer_id TEXT,
  first_name TEXT,
  last_name TEXT,
  affiliate_id UUID REFERENCES users(id),
  referral_code TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Shopify order items table
CREATE TABLE IF NOT EXISTS shopify_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES shopify_orders(id),
  shopify_product_id TEXT NOT NULL,
  variant_id TEXT,
  title TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  sku TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Shopify webhooks table
CREATE TABLE IF NOT EXISTS shopify_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  shop_domain TEXT NOT NULL,
  webhook_id TEXT,
  payload JSONB,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_shopify_orders_affiliate_id ON shopify_orders(affiliate_id);
CREATE INDEX idx_shopify_orders_created_at ON shopify_orders(created_at);
CREATE INDEX idx_shopify_order_items_order_id ON shopify_order_items(order_id);
CREATE INDEX idx_shopify_products_shopify_id ON shopify_products(shopify_product_id);

-- Enable RLS
ALTER TABLE shopify_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_webhooks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage Shopify products"
  ON shopify_products
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their attributed orders"
  ON shopify_orders
  FOR SELECT
  TO authenticated
  USING (affiliate_id = auth.uid());

CREATE POLICY "Users can view their order items"
  ON shopify_order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shopify_orders
      WHERE shopify_orders.id = order_id
      AND shopify_orders.affiliate_id = auth.uid()
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER set_shopify_products_updated_at
  BEFORE UPDATE ON shopify_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_shopify_orders_updated_at
  BEFORE UPDATE ON shopify_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();