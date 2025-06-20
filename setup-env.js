#!/usr/bin/env node

/**
 * Environment Setup Script
 * 
 * This script helps you set up the necessary environment variables for the application.
 * Run this script and follow the prompts to configure your Supabase and GoAffPro settings.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupEnvironment() {
  console.log('🚀 Welcome to the Affiliate Platform Environment Setup!\n');
  
  console.log('This script will help you configure the necessary environment variables.');
  console.log('You can find your Supabase credentials in your Supabase project dashboard.');
  console.log('GoAffPro credentials can be found in your GoAffPro admin panel under API settings.\n');

  // Supabase Configuration
  console.log('📊 Supabase Configuration:');
  const supabaseUrl = await question('Enter your Supabase URL: ');
  const supabaseAnonKey = await question('Enter your Supabase Anon Key: ');

  // GoAffPro Configuration
  console.log('\n🔗 GoAffPro Configuration:');
  console.log('(Leave blank to use test credentials)');
  const goaffproAccessToken = await question('Enter your GoAffPro Access Token (or press Enter for test): ') || '0a71cf64925cd446203dc49348a1c95c18ffe5a487505b7ef9b7874c4a9b9f24';
  const goaffproPublicToken = await question('Enter your GoAffPro Public Token (or press Enter for test): ') || 'c633c5f229cf50a8a47f8efd52583295e3818283ab120ed0040994ea14f0903b';

  // Create .env file content
  const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}

# GoAffPro Configuration
VITE_GOAFFPRO_ACCESS_TOKEN=${goaffproAccessToken}
VITE_GOAFFPRO_PUBLIC_TOKEN=${goaffproPublicToken}
`;

  // Write to .env file
  const envPath = path.join(__dirname, '.env');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Environment variables have been saved to .env file!');
    console.log('\n📝 Next steps:');
    console.log('1. Run "npm run dev" to start the development server');
    console.log('2. Navigate to the application in your browser');
    console.log('3. Test the GoAffPro import functionality');
    console.log('\n🔒 Note: The .env file is gitignored for security.');
  } catch (error) {
    console.error('\n❌ Error writing .env file:', error.message);
    console.log('\n📋 Please manually create a .env file with the following content:');
    console.log('\n' + envContent);
  }

  rl.close();
}

// Check if .env already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      setupEnvironment();
    } else {
      console.log('Setup cancelled. Your existing .env file was not modified.');
      rl.close();
    }
  });
} else {
  setupEnvironment();
} 