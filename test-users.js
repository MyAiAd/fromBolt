#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

console.log('🔍 Checking users in database...');

client.from('users').select('*').then(({ data, error }) => {
  if (error) {
    console.log('❌ Error checking users:', error.message);
  } else {
    console.log(`✅ Found ${data.length} users in database`);
    if (data.length > 0) {
      console.log('📊 Users:', data.map(u => ({ id: u.id, email: u.email })));
    } else {
      console.log('💡 No users found. This is why import logs fail.');
    }
  }
}).catch(console.error); 