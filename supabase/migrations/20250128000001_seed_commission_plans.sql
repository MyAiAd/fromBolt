/*
  # Seed Commission Plans
  
  This migration populates the commission_plans table with the exact commission
  structure from the provided image/requirements.
  
  Products and Commission Rates (Updated to match Jennaz's requirements):
  - Bae: L1=20%, L2=10%, L3=5%
  - Coaching Packs: L1=20%, L2=10%, L3=5%
  - Online Mastery: L1=20%, L2=10%, L3=5%
  - BRAVO Fitness: L1=20%, L2=10%, L3=5%
  - AI System: L1=20%, L2=10%, L3=5%
  - REACTION CBD: L1=15%, L2=5%, L3=5%
  - EVENTS: L1=5%, L2=2.5%, L3=2.5%
*/

-- Clear existing commission plans first
DELETE FROM commission_plans;

-- Insert commission plans based on Jennaz's exact commission structure
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

-- Create a function to automatically calculate commissions for new orders
CREATE OR REPLACE FUNCTION calculate_multi_level_commissions(
  p_order_source TEXT,
  p_order_id TEXT,
  p_customer_email TEXT,
  p_customer_name TEXT,
  p_order_total DECIMAL(10,2),
  p_order_date TIMESTAMPTZ,
  p_product_category TEXT DEFAULT 'default',
  p_product_name TEXT DEFAULT 'Product',
  p_product_id TEXT DEFAULT NULL,
  p_purchasing_affiliate_email TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  affiliate_record RECORD;
  referral_record RECORD;
  commission_plan RECORD;
  l1_commission DECIMAL(10,2);
  l2_commission DECIMAL(10,2);
  l3_commission DECIMAL(10,2);
  commissions_created JSONB := '[]'::JSONB;
  commission_id UUID;
BEGIN
  -- Get the commission plan for this product
  SELECT * INTO commission_plan
  FROM commission_plans
  WHERE product_category = p_product_category
    AND is_active = true
    AND (effective_until IS NULL OR effective_until > p_order_date)
  ORDER BY effective_from DESC
  LIMIT 1;
  
  -- If no specific plan found, use default
  IF commission_plan IS NULL THEN
    SELECT * INTO commission_plan
    FROM commission_plans
    WHERE product_category = 'default'
      AND is_active = true
    LIMIT 1;
  END IF;
  
  -- If still no plan found, exit
  IF commission_plan IS NULL THEN
    RETURN '{"error": "No commission plan found"}'::JSONB;
  END IF;
  
  -- Find the purchasing affiliate (if provided)
  IF p_purchasing_affiliate_email IS NOT NULL THEN
    SELECT * INTO affiliate_record
    FROM affiliate_system_users
    WHERE email = p_purchasing_affiliate_email
      AND status = 'active';
    
    -- If affiliate found, get their referral relationships
    IF affiliate_record IS NOT NULL THEN
      SELECT * INTO referral_record
      FROM referral_relationships
      WHERE affiliate_id = affiliate_record.id;
      
      -- Calculate commission amounts
      l1_commission := p_order_total * (commission_plan.level_1_rate / 100);
      l2_commission := p_order_total * (commission_plan.level_2_rate / 100);
      l3_commission := p_order_total * (commission_plan.level_3_rate / 100);
      
      -- Create Level 1 Commission (direct referrer)
      IF referral_record.l1_referrer_id IS NOT NULL THEN
        INSERT INTO multi_level_commissions (
          order_source, order_id, customer_email, customer_name,
          order_total, order_date, product_category, product_name, product_id,
          purchasing_affiliate_id, commission_level, earning_affiliate_id,
          commission_rate, commission_amount, status
        ) VALUES (
          p_order_source, p_order_id, p_customer_email, p_customer_name,
          p_order_total, p_order_date, p_product_category, p_product_name, p_product_id,
          affiliate_record.id, 1, referral_record.l1_referrer_id,
          commission_plan.level_1_rate, l1_commission, 'pending'
        ) RETURNING id INTO commission_id;
        
        commissions_created := commissions_created || jsonb_build_object(
          'level', 1,
          'commission_id', commission_id,
          'earning_affiliate_id', referral_record.l1_referrer_id,
          'amount', l1_commission
        );
      END IF;
      
      -- Create Level 2 Commission (indirect referrer)
      IF referral_record.l2_referrer_id IS NOT NULL THEN
        INSERT INTO multi_level_commissions (
          order_source, order_id, customer_email, customer_name,
          order_total, order_date, product_category, product_name, product_id,
          purchasing_affiliate_id, commission_level, earning_affiliate_id,
          commission_rate, commission_amount, status
        ) VALUES (
          p_order_source, p_order_id, p_customer_email, p_customer_name,
          p_order_total, p_order_date, p_product_category, p_product_name, p_product_id,
          affiliate_record.id, 2, referral_record.l2_referrer_id,
          commission_plan.level_2_rate, l2_commission, 'pending'
        ) RETURNING id INTO commission_id;
        
        commissions_created := commissions_created || jsonb_build_object(
          'level', 2,
          'commission_id', commission_id,
          'earning_affiliate_id', referral_record.l2_referrer_id,
          'amount', l2_commission
        );
      END IF;
      
      -- Create Level 3 Commission (grand referrer)
      IF referral_record.l3_referrer_id IS NOT NULL THEN
        INSERT INTO multi_level_commissions (
          order_source, order_id, customer_email, customer_name,
          order_total, order_date, product_category, product_name, product_id,
          purchasing_affiliate_id, commission_level, earning_affiliate_id,
          commission_rate, commission_amount, status
        ) VALUES (
          p_order_source, p_order_id, p_customer_email, p_customer_name,
          p_order_total, p_order_date, p_product_category, p_product_name, p_product_id,
          affiliate_record.id, 3, referral_record.l3_referrer_id,
          commission_plan.level_3_rate, l3_commission, 'pending'
        ) RETURNING id INTO commission_id;
        
        commissions_created := commissions_created || jsonb_build_object(
          'level', 3,
          'commission_id', commission_id,
          'earning_affiliate_id', referral_record.l3_referrer_id,
          'amount', l3_commission
        );
      END IF;
    END IF;
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'commissions_created', commissions_created,
    'commission_plan_used', row_to_json(commission_plan)
  );
END;
$$ LANGUAGE plpgsql;

-- Create a function to update team statistics
CREATE OR REPLACE FUNCTION update_team_statistics(p_affiliate_id UUID) RETURNS VOID AS $$
DECLARE
  stats_record RECORD;
BEGIN
  -- Calculate team statistics for the given affiliate
  WITH team_stats AS (
    SELECT 
      COUNT(CASE WHEN rr.l1_referrer_id = p_affiliate_id THEN 1 END) as l1_count,
      COUNT(CASE WHEN rr.l2_referrer_id = p_affiliate_id THEN 1 END) as l2_count,
      COUNT(CASE WHEN rr.l3_referrer_id = p_affiliate_id THEN 1 END) as l3_count,
      COUNT(*) as total_team
    FROM referral_relationships rr
    WHERE rr.l1_referrer_id = p_affiliate_id 
       OR rr.l2_referrer_id = p_affiliate_id 
       OR rr.l3_referrer_id = p_affiliate_id
  ),
  commission_stats AS (
    SELECT 
      COALESCE(SUM(CASE WHEN commission_level = 1 THEN commission_amount END), 0) as l1_earnings,
      COALESCE(SUM(CASE WHEN commission_level = 2 THEN commission_amount END), 0) as l2_earnings,
      COALESCE(SUM(CASE WHEN commission_level = 3 THEN commission_amount END), 0) as l3_earnings,
      COALESCE(SUM(commission_amount), 0) as total_earnings
    FROM multi_level_commissions
    WHERE earning_affiliate_id = p_affiliate_id
      AND status IN ('pending', 'approved', 'paid')
  )
  SELECT 
    ts.l1_count, ts.l2_count, ts.l3_count, ts.total_team,
    cs.l1_earnings, cs.l2_earnings, cs.l3_earnings, cs.total_earnings
  INTO stats_record
  FROM team_stats ts, commission_stats cs;
  
  -- Update the affiliate's cached statistics
  UPDATE affiliate_system_users
  SET 
    total_l1_affiliates = stats_record.l1_count,
    total_l2_affiliates = stats_record.l2_count,
    total_l3_affiliates = stats_record.l3_count,
    total_team_size = stats_record.total_team,
    total_l1_earnings = stats_record.l1_earnings,
    total_l2_earnings = stats_record.l2_earnings,
    total_l3_earnings = stats_record.l3_earnings,
    total_earnings = stats_record.total_earnings,
    updated_at = now()
  WHERE id = p_affiliate_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update team statistics when referral relationships change
CREATE OR REPLACE FUNCTION trigger_update_team_statistics() RETURNS TRIGGER AS $$
BEGIN
  -- Update statistics for all affected referrers
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.l1_referrer_id IS NOT NULL THEN
      PERFORM update_team_statistics(NEW.l1_referrer_id);
    END IF;
    IF NEW.l2_referrer_id IS NOT NULL THEN
      PERFORM update_team_statistics(NEW.l2_referrer_id);
    END IF;
    IF NEW.l3_referrer_id IS NOT NULL THEN
      PERFORM update_team_statistics(NEW.l3_referrer_id);
    END IF;
  END IF;
  
  IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
    IF OLD.l1_referrer_id IS NOT NULL THEN
      PERFORM update_team_statistics(OLD.l1_referrer_id);
    END IF;
    IF OLD.l2_referrer_id IS NOT NULL THEN
      PERFORM update_team_statistics(OLD.l2_referrer_id);
    END IF;
    IF OLD.l3_referrer_id IS NOT NULL THEN
      PERFORM update_team_statistics(OLD.l3_referrer_id);
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_referral_relationships_team_stats
  AFTER INSERT OR UPDATE OR DELETE ON referral_relationships
  FOR EACH ROW EXECUTE FUNCTION trigger_update_team_statistics();

-- Create trigger to update team statistics when commissions change
CREATE OR REPLACE FUNCTION trigger_commission_team_statistics() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    PERFORM update_team_statistics(NEW.earning_affiliate_id);
  END IF;
  
  IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
    PERFORM update_team_statistics(OLD.earning_affiliate_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_commissions_team_stats
  AFTER INSERT OR UPDATE OR DELETE ON multi_level_commissions
  FOR EACH ROW EXECUTE FUNCTION trigger_commission_team_statistics(); 