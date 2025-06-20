/*
  # Update Commission Plans for Jennaz's Products
  
  This migration updates the commission_plans table with the exact commission
  structure from Jennaz's requirements table.
  
  Products and Commission Rates:
  - Bae: L1=20%, L2=10%, L3=5%
  - Coaching Packs: L1=20%, L2=10%, L3=5%
  - Online Mastery: L1=20%, L2=10%, L3=5%
  - BRAVO Fitness: L1=20%, L2=10%, L3=5%
  - AI System: L1=20%, L2=10%, L3=5%
  - REACTION CBD: L1=15%, L2=5%, L3=5%
  - EVENTS: L1=5%, L2=2.5%, L3=2.5%
*/

-- Clear existing commission plans
DELETE FROM commission_plans;

-- Insert Jennaz's exact commission plans
INSERT INTO commission_plans (
  product_category,
  product_name,
  level_1_rate,
  level_2_rate,
  level_3_rate,
  is_active,
  notes
) VALUES 
  (
    'bae',
    'Bae',
    20.00, -- Level 1: 20%
    10.00, -- Level 2: 10%
    5.00,  -- Level 3: 5%
    true,
    'Bae product commission structure'
  ),
  (
    'coaching_packs',
    'Coaching Packs',
    20.00, -- Level 1: 20%
    10.00, -- Level 2: 10%
    5.00,  -- Level 3: 5%
    true,
    'Coaching Packs commission structure'
  ),
  (
    'online_mastery',
    'Online Mastery',
    20.00, -- Level 1: 20%
    10.00, -- Level 2: 10%
    5.00,  -- Level 3: 5%
    true,
    'Online Mastery program commission structure'
  ),
  (
    'bravo_fitness',
    'BRAVO Fitness',
    20.00, -- Level 1: 20%
    10.00, -- Level 2: 10%
    5.00,  -- Level 3: 5%
    true,
    'BRAVO Fitness commission structure'
  ),
  (
    'ai_system',
    'AI System',
    20.00, -- Level 1: 20%
    10.00, -- Level 2: 10%
    5.00,  -- Level 3: 5%
    true,
    'AI System commission structure'
  ),
  (
    'reaction_cbd',
    'REACTION CBD',
    15.00, -- Level 1: 15%
    5.00,  -- Level 2: 5%
    5.00,  -- Level 3: 5%
    true,
    'REACTION CBD product commission structure'
  ),
  (
    'events',
    'EVENTS',
    5.00,  -- Level 1: 5%
    2.50,  -- Level 2: 2.5%
    2.50,  -- Level 3: 2.5%
    true,
    'Events commission structure'
  ),
  (
    'default',
    'Default Product',
    15.00, -- Level 1: 15%
    5.00,  -- Level 2: 5%
    2.00,  -- Level 3: 2%
    true,
    'Default commission structure for uncategorized products'
  );

-- Update the commission calculation function to handle the new product categories
CREATE OR REPLACE FUNCTION get_commission_plan_for_product(
  p_product_name TEXT DEFAULT NULL,
  p_product_category TEXT DEFAULT NULL
) RETURNS TABLE (
  id UUID,
  product_category TEXT,
  product_name TEXT,
  level_1_rate DECIMAL(5,2),
  level_2_rate DECIMAL(5,2),
  level_3_rate DECIMAL(5,2)
) AS $$
BEGIN
  -- First try to match by exact product name
  IF p_product_name IS NOT NULL THEN
    RETURN QUERY
    SELECT cp.id, cp.product_category, cp.product_name, cp.level_1_rate, cp.level_2_rate, cp.level_3_rate
    FROM commission_plans cp
    WHERE LOWER(cp.product_name) = LOWER(p_product_name)
      AND cp.is_active = true
      AND (cp.effective_until IS NULL OR cp.effective_until > now())
    ORDER BY cp.effective_from DESC
    LIMIT 1;
    
    IF FOUND THEN
      RETURN;
    END IF;
  END IF;
  
  -- Then try to match by product category
  IF p_product_category IS NOT NULL THEN
    RETURN QUERY
    SELECT cp.id, cp.product_category, cp.product_name, cp.level_1_rate, cp.level_2_rate, cp.level_3_rate
    FROM commission_plans cp
    WHERE cp.product_category = p_product_category
      AND cp.is_active = true
      AND (cp.effective_until IS NULL OR cp.effective_until > now())
    ORDER BY cp.effective_from DESC
    LIMIT 1;
    
    IF FOUND THEN
      RETURN;
    END IF;
  END IF;
  
  -- Finally, fall back to default
  RETURN QUERY
  SELECT cp.id, cp.product_category, cp.product_name, cp.level_1_rate, cp.level_2_rate, cp.level_3_rate
  FROM commission_plans cp
  WHERE cp.product_category = 'default'
    AND cp.is_active = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Add a comment explaining the commission structure
COMMENT ON TABLE commission_plans IS 'Jennaz Multi-Level Commission Plans: Bae, Coaching Packs, Online Mastery, BRAVO Fitness, AI System (20%/10%/5%), REACTION CBD (15%/5%/5%), EVENTS (5%/2.5%/2.5%)'; 