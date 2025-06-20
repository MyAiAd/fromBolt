-- Insert sample data for testing

-- Create auth users first
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@example.com', '{"name": "Admin User", "is_admin": true}'::jsonb),
  ('00000000-0000-0000-0000-000000000002', 'user1@example.com', '{"name": "Test User 1"}'::jsonb),
  ('00000000-0000-0000-0000-000000000003', 'user2@example.com', '{"name": "Test User 2"}'::jsonb);

-- Sample users
INSERT INTO users (id, email, name, referral_code, is_admin)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'Admin User', 'ADMIN001', true),
  ('00000000-0000-0000-0000-000000000002', 'user1@example.com', 'Test User 1', 'USER001', false),
  ('00000000-0000-0000-0000-000000000003', 'user2@example.com', 'Test User 2', 'USER002', false);

-- Sample affiliates
INSERT INTO affiliates (referrer_id, affiliate_id, level, commission_rate, status)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 1, 10.00, 'active'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 1, 10.00, 'active');

-- Sample transactions
INSERT INTO transactions (transaction_ref, affiliate_id, customer_email, amount, product_name, status)
VALUES 
  ('TRX001', '00000000-0000-0000-0000-000000000002', 'customer1@example.com', 100.00, 'Product 1', 'completed'),
  ('TRX002', '00000000-0000-0000-0000-000000000002', 'customer2@example.com', 150.00, 'Product 2', 'completed'),
  ('TRX003', '00000000-0000-0000-0000-000000000003', 'customer3@example.com', 200.00, 'Product 3', 'completed');

-- Sample commissions
INSERT INTO commissions (transaction_id, affiliate_id, referrer_id, level, amount, rate_applied, status)
VALUES 
  ((SELECT id FROM transactions WHERE transaction_ref = 'TRX001'), 
   '00000000-0000-0000-0000-000000000002', 
   '00000000-0000-0000-0000-000000000001', 
   1, 10.00, 10.00, 'paid'),
  ((SELECT id FROM transactions WHERE transaction_ref = 'TRX002'), 
   '00000000-0000-0000-0000-000000000002', 
   '00000000-0000-0000-0000-000000000001', 
   1, 15.00, 10.00, 'paid'),
  ((SELECT id FROM transactions WHERE transaction_ref = 'TRX003'), 
   '00000000-0000-0000-0000-000000000003', 
   '00000000-0000-0000-0000-000000000001', 
   1, 20.00, 10.00, 'paid');

-- Sample clicks
INSERT INTO clicks (affiliate_id, referral_code, ip_address, user_agent, conversion_status)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'USER001', '192.168.1.1', 'Mozilla/5.0', 'clicked'),
  ('00000000-0000-0000-0000-000000000002', 'USER001', '192.168.1.2', 'Mozilla/5.0', 'converted'),
  ('00000000-0000-0000-0000-000000000003', 'USER002', '192.168.1.3', 'Mozilla/5.0', 'clicked'); 