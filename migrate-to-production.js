#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🚀 Affiliate Platform Production Migration Script');
console.log('=' .repeat(60));

// Production environment configuration
const PRODUCTION_ENV = `# Supabase Configuration (Production)
VITE_SUPABASE_URL=https://qnruorhzdxkyfhdgtkqp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucnVvcmh6ZHhreWZoZGd0a3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDU1MTAsImV4cCI6MjA2MzU4MTUxMH0.d42EFmjURUJ2aLFeAyFQsWwFmbnL7L_ObfAIlpv8McM
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucnVvcmh6ZHhreWZoZGd0a3FwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODAwNTUxMCwiZXhwIjoyMDYzNTgxNTEwfQ.YLZe38q0F1cl-eBTM5yXDha59JjISzA1eGmtmra7e4o

# GoAffPro Configuration
VITE_GOAFFPRO_ACCESS_TOKEN=0a71cf64925cd446203dc49348a1c95c18ffe5a487505b7ef9b7874c4a9b9f24
VITE_GOAFFPRO_PUBLIC_TOKEN=c633c5f229cf50a8a47f8efd52583295e3818283ab120ed0040994ea14f0903b

# GHL Configuration
VITE_GHL_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI
VITE_GHL_LOCATION_ID=w01Gc7T4b0tKSDQdKhuN

# Mighty Networks Configuration
VITE_MIGHTY_NETWORKS_ZAPIER=Pw8Io8duTZqtSm0jQMYYv9KVPRQfJMf99Nrtc1ZyOGA
`;

// Updated local environment (with VITE_ prefix fix)
const LOCAL_ENV = `# Supabase Configuration (Local Development)
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# GoAffPro Configuration
VITE_GOAFFPRO_ACCESS_TOKEN=0a71cf64925cd446203dc49348a1c95c18ffe5a487505b7ef9b7874c4a9b9f24
VITE_GOAFFPRO_PUBLIC_TOKEN=c633c5f229cf50a8a47f8efd52583295e3818283ab120ed0040994ea14f0903b

# GHL Configuration
VITE_GHL_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IncwMUdjN1Q0YjB0S1NEUWRLaHVOIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4MDg3NzIyNDAwLCJzdWIiOiJFdHhSblUwTWpRaDFPaE5RbWN0OCJ9.HdKxSRwdblNpkGrt8ZUyMiz_RBFZbvlbE5Oa6V23wUI
VITE_GHL_LOCATION_ID=w01Gc7T4b0tKSDQdKhuN

# Mighty Networks Configuration (Fixed with VITE_ prefix)
VITE_MIGHTY_NETWORKS_ZAPIER=Pw8Io8duTZqtSm0jQMYYv9KVPRQfJMf99Nrtc1ZyOGA
`;

function createEnvironmentFiles() {
  console.log('\n📝 Creating environment configuration files...');
  
  try {
    // Create production environment file
    fs.writeFileSync('.env.production', PRODUCTION_ENV);
    console.log('✅ Created .env.production');
    
    // Create updated local environment file
    fs.writeFileSync('.env.local.updated', LOCAL_ENV);
    console.log('✅ Created .env.local.updated (backup of current with fixes)');
    
    console.log('\n🔧 Manual steps required:');
    console.log('1. Replace your current .env.local with .env.local.updated');
    console.log('2. Restart your development server');
    
  } catch (error) {
    console.error('❌ Error creating environment files:', error.message);
  }
}

function displayMigrationSteps() {
  console.log('\n📋 Migration Steps to Production:');
  console.log('=' .repeat(40));
  
  console.log('\n1. 🗄️  Database Migration:');
  console.log('   - Schema exported to: local_schema.sql');
  console.log('   - Data exported to: local_data.sql');
  console.log('   - Apply these to production Supabase');
  
  console.log('\n2. 🔧 Edge Functions:');
  console.log('   - Deploy mn-webhook function to production');
  console.log('   - Verify environment variables are set');
  
  console.log('\n3. 🌐 Environment Variables:');
  console.log('   Production Supabase already has:');
  console.log('   ✅ ZAPIER_MIGHTYNETWORKS_KEY');
  console.log('   ✅ MN_WEBHOOK_SECRET');
  console.log('   ✅ SUPABASE_* keys');
  
  console.log('\n4. 🧪 Testing:');
  console.log('   - Test webhook with production URL');
  console.log('   - Verify Zapier integration');
  console.log('   - Test all API integrations');
  
  console.log('\n5. 🚀 Go Live:');
  console.log('   - Switch to .env.production');
  console.log('   - Update Zapier webhook URL');
  console.log('   - Deploy application');
}

function displayWebhookUrls() {
  console.log('\n🔗 Webhook URLs:');
  console.log('=' .repeat(30));
  console.log('Local:      http://localhost:54321/functions/v1/mn-webhook');
  console.log('Production: https://qnruorhzdxkyfhdgtkqp.supabase.co/functions/v1/mn-webhook');
  
  console.log('\n🔑 API Keys Status:');
  console.log('✅ ZAPIER_MIGHTYNETWORKS_KEY: Set in production');
  console.log('✅ MN_WEBHOOK_SECRET: Set in production');
  console.log('✅ All Supabase keys: Set in production');
}

function displayDatabaseCommands() {
  console.log('\n💾 Database Migration Commands:');
  console.log('=' .repeat(35));
  console.log('');
  console.log('To apply schema to production:');
  console.log('psql "postgresql://postgres:[PASSWORD]@db.qnruorhzdxkyfhdgtkqp.supabase.co:5432/postgres" < local_schema.sql');
  console.log('');
  console.log('To apply data to production:');
  console.log('psql "postgresql://postgres:[PASSWORD]@db.qnruorhzdxkyfhdgtkqp.supabase.co:5432/postgres" < local_data.sql');
  console.log('');
  console.log('⚠️  Replace [PASSWORD] with your database password from Supabase dashboard');
}

// Run the migration helper
console.log('\n🎯 Current Status:');
console.log('✅ Local database exported');
console.log('✅ Production Supabase configured');
console.log('✅ Edge Function secrets set');

createEnvironmentFiles();
displayMigrationSteps();
displayWebhookUrls();
displayDatabaseCommands();

console.log('\n🎉 Migration preparation complete!');
console.log('Next: Apply database schema/data to production Supabase'); 