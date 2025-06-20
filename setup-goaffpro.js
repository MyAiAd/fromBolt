#!/usr/bin/env node

/**
 * Setup script for GoAffPro integration
 */

import fs from 'fs';
import path from 'path';

function updateEnvFile(accessToken, publicToken) {
  const envPath = '.env.local';
  let envContent = '';
  
  // Read existing .env.local file if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Check if tokens already exist
  const accessTokenRegex = /^VITE_GOAFFPRO_ACCESS_TOKEN=.*$/m;
  const publicTokenRegex = /^VITE_GOAFFPRO_PUBLIC_TOKEN=.*$/m;
  
  if (accessTokenRegex.test(envContent)) {
    envContent = envContent.replace(accessTokenRegex, `VITE_GOAFFPRO_ACCESS_TOKEN=${accessToken}`);
    console.log('✅ Updated existing VITE_GOAFFPRO_ACCESS_TOKEN in .env.local');
  } else {
    if (envContent && !envContent.endsWith('\n')) {
      envContent += '\n';
    }
    envContent += `VITE_GOAFFPRO_ACCESS_TOKEN=${accessToken}\n`;
    console.log('✅ Added VITE_GOAFFPRO_ACCESS_TOKEN to .env.local');
  }
  
  if (publicTokenRegex.test(envContent)) {
    envContent = envContent.replace(publicTokenRegex, `VITE_GOAFFPRO_PUBLIC_TOKEN=${publicToken}`);
    console.log('✅ Updated existing VITE_GOAFFPRO_PUBLIC_TOKEN in .env.local');
  } else {
    if (envContent && !envContent.endsWith('\n')) {
      envContent += '\n';
    }
    envContent += `VITE_GOAFFPRO_PUBLIC_TOKEN=${publicToken}\n`;
    console.log('✅ Added VITE_GOAFFPRO_PUBLIC_TOKEN to .env.local');
  }
  
  // Write back to file
  fs.writeFileSync(envPath, envContent);
}

function displaySetupInstructions() {
  console.log('🚀 The RISE/GoAffPro Integration Setup');
  console.log('=' .repeat(50));
  console.log('');
  console.log('📋 Setup Instructions:');
  console.log('');
  console.log('1. 🔑 Get your GoAffPro API Tokens:');
  console.log('   - Log into your GoAffPro dashboard');
  console.log('   - Go to Settings > API');
  console.log('   - Copy your Access Token and Public Token');
  console.log('');
  console.log('2. 🔧 Configure the API tokens:');
  console.log('   - Run: node setup-goaffpro.js ACCESS_TOKEN PUBLIC_TOKEN');
  console.log('   - Or manually add to .env.local:');
  console.log('     VITE_GOAFFPRO_ACCESS_TOKEN=your_access_token');
  console.log('     VITE_GOAFFPRO_PUBLIC_TOKEN=your_public_token');
  console.log('');
  console.log('3. 🧪 Test the connection:');
  console.log('   - Run: node test-import-simple.js');
  console.log('');
  console.log('4. 📊 Import data:');
  console.log('   - Use the import service in your application (Settings page)');
  console.log('   - Or run: npm run dev and go to Settings > GoAffPro Import');
  console.log('');
  console.log('🔗 Integration Details:');
  console.log('   - Platform: The RISE');
  console.log('   - API Provider: GoAffPro');
  console.log('   - Database Tables: 4 tables (affiliates, orders, rewards, payments)');
  console.log('   - Data Types: Affiliates, Orders, Rewards, Payments');
  console.log('');
  console.log('💡 Next Steps:');
  console.log('   - Set up your GoAffPro API tokens');
  console.log('   - Test the API connection');
  console.log('   - Import your affiliate data');
  console.log('   - View data in the affiliate dashboard');
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  displaySetupInstructions();
} else if (args.length === 2) {
  const [accessToken, publicToken] = args;
  
  if (!accessToken || accessToken.length < 10) {
    console.log('❌ Invalid access token provided');
    console.log('💡 Access token should be a long string from GoAffPro');
    process.exit(1);
  }
  
  if (!publicToken || publicToken.length < 10) {
    console.log('❌ Invalid public token provided');
    console.log('💡 Public token should be a long string from GoAffPro');
    process.exit(1);
  }
  
  try {
    updateEnvFile(accessToken, publicToken);
    console.log('');
    console.log('🎉 Setup completed successfully!');
    console.log('');
    console.log('🧪 Test your setup:');
    console.log('   node test-import-simple.js');
    console.log('');
    console.log('📊 Start the app and import data:');
    console.log('   npm run dev');
    console.log('   Go to Settings > GoAffPro Import');
    
  } catch (error) {
    console.log('❌ Error updating environment file:', error.message);
    process.exit(1);
  }
} else {
  console.log('❌ Invalid number of arguments provided');
  console.log('💡 Usage: node setup-goaffpro.js ACCESS_TOKEN PUBLIC_TOKEN');
  process.exit(1);
} 