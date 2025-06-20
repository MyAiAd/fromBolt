/*
  # Clear sample data from all tables
  
  This migration removes all sample data from the database before importing real data from GOAFFPRO
*/

-- Clear existing data
TRUNCATE TABLE commissions CASCADE;
TRUNCATE TABLE transactions CASCADE;
TRUNCATE TABLE clicks CASCADE;
TRUNCATE TABLE affiliates CASCADE;
TRUNCATE TABLE users CASCADE;

-- Reset sequences
ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS affiliates_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS transactions_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS commissions_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS clicks_id_seq RESTART WITH 1;