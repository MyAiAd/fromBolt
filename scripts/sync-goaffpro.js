import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const GOAFFPRO_ACCESS_TOKEN = process.env.GOAFFPRO_ACCESS_TOKEN;
const GOAFFPRO_PUBLIC_TOKEN = process.env.GOAFFPRO_PUBLIC_TOKEN;

const headers = {
  'X-GOAFFPRO-ACCESS-TOKEN': GOAFFPRO_ACCESS_TOKEN,
  'X-GOAFFPRO-PUBLIC-TOKEN': GOAFFPRO_PUBLIC_TOKEN,
  'Content-Type': 'application/json'
};

async function syncAffiliates() {
  try {
    const response = await fetch('https://api.goaffpro.com/v1/affiliates', {
      headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch affiliates: ${response.statusText}`);
    }

    const affiliates = await response.json();

    // Process each affiliate
    for (const affiliate of affiliates) {
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', affiliate.email)
        .maybeSingle();

      if (userError) {
        console.error('Error checking existing user:', userError);
        continue;
      }

      if (!existingUser) {
        // Create new user if they don't exist
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            email: affiliate.email,
            name: `${affiliate.first_name} ${affiliate.last_name}`.trim(),
            referral_code: affiliate.referral_code
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
          continue;
        }

        console.log('Created new user:', newUser.email);
      }
    }

    console.log('Successfully synced affiliates');
  } catch (error) {
    console.error('Error syncing affiliates:', error);
  }
}

async function syncTransactions() {
  try {
    const response = await fetch('https://api.goaffpro.com/v1/transactions', {
      headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }

    const transactions = await response.json();

    // Process each transaction
    for (const transaction of transactions) {
      const { data: existingTransaction, error: transError } = await supabase
        .from('transactions')
        .select('id')
        .eq('transaction_ref', transaction.id)
        .maybeSingle();

      if (transError) {
        console.error('Error checking existing transaction:', transError);
        continue;
      }

      if (!existingTransaction) {
        // Get affiliate user ID
        const { data: affiliate } = await supabase
          .from('users')
          .select('id')
          .eq('referral_code', transaction.referral_code)
          .single();

        if (!affiliate) {
          console.error('Affiliate not found for transaction:', transaction.id);
          continue;
        }

        // Create new transaction
        const { error: createError } = await supabase
          .from('transactions')
          .insert({
            transaction_ref: transaction.id,
            affiliate_id: affiliate.id,
            customer_email: transaction.customer_email,
            amount: transaction.amount,
            product_name: transaction.product_name,
            product_id: transaction.product_id,
            status: transaction.status
          });

        if (createError) {
          console.error('Error creating transaction:', createError);
          continue;
        }
      }
    }

    console.log('Successfully synced transactions');
  } catch (error) {
    console.error('Error syncing transactions:', error);
  }
}

async function syncCommissions() {
  try {
    const response = await fetch('https://api.goaffpro.com/v1/commissions', {
      headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch commissions: ${response.statusText}`);
    }

    const commissions = await response.json();

    // Process each commission
    for (const commission of commissions) {
      const { data: existingCommission, error: commError } = await supabase
        .from('commissions')
        .select('id')
        .eq('transaction_id', commission.transaction_id)
        .maybeSingle();

      if (commError) {
        console.error('Error checking existing commission:', commError);
        continue;
      }

      if (!existingCommission) {
        // Create new commission
        const { error: createError } = await supabase
          .from('commissions')
          .insert({
            transaction_id: commission.transaction_id,
            affiliate_id: commission.affiliate_id,
            referrer_id: commission.referrer_id,
            amount: commission.amount,
            rate_applied: commission.rate,
            status: commission.status,
            level: commission.level
          });

        if (createError) {
          console.error('Error creating commission:', createError);
          continue;
        }
      }
    }

    console.log('Successfully synced commissions');
  } catch (error) {
    console.error('Error syncing commissions:', error);
  }
}

// Run all sync functions
async function syncAll() {
  console.log('Starting GOAFFPRO sync...');
  await syncAffiliates();
  await syncTransactions();
  await syncCommissions();
  console.log('GOAFFPRO sync completed');
}

syncAll();