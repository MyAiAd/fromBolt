// Setup script for MightyNetworks/Rewardful integration
import fs from 'fs';
import path from 'path';

function updateEnvFile(apiKey) {
  const envPath = '.env.local';
  let envContent = '';
  
  // Read existing .env.local file if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Check if REWARDFUL_API_KEY already exists
  const rewardfulKeyRegex = /^REWARDFUL_API_KEY=.*$/m;
  
  if (rewardfulKeyRegex.test(envContent)) {
    // Update existing key
    envContent = envContent.replace(rewardfulKeyRegex, `REWARDFUL_API_KEY=${apiKey}`);
    console.log('✅ Updated existing REWARDFUL_API_KEY in .env.local');
  } else {
    // Add new key
    if (envContent && !envContent.endsWith('\n')) {
      envContent += '\n';
    }
    envContent += `REWARDFUL_API_KEY=${apiKey}\n`;
    console.log('✅ Added REWARDFUL_API_KEY to .env.local');
  }
  
  // Write back to file
  fs.writeFileSync(envPath, envContent);
}

function displaySetupInstructions() {
  console.log('🚀 The RISE/Rewardful Integration Setup');
  console.log('=' .repeat(50));
  console.log('');
  console.log('📋 Setup Instructions:');
  console.log('');
  console.log('1. 🔑 Get your Rewardful API Key:');
  console.log('   - Log into your Rewardful dashboard');
  console.log('   - Go to Settings > API');
  console.log('   - Copy your API key');
  console.log('');
  console.log('2. 🔧 Configure the API key:');
  console.log('   - Run: node setup-mightynetworks.js YOUR_API_KEY');
  console.log('   - Or manually add to .env.local: REWARDFUL_API_KEY=your_key_here');
  console.log('');
  console.log('3. 🧪 Test the connection:');
  console.log('   - Run: node test-mightynetworks.js');
  console.log('');
  console.log('4. 📊 Import data:');
  console.log('   - Use the import service in your application');
  console.log('   - Or run a manual import script');
  console.log('');
  console.log('🔗 Integration Details:');
  console.log('   - Platform: The RISE');
  console.log('   - API Provider: Rewardful');
  console.log('   - Database Tables: 5 tables created');
  console.log('   - Data Types: Affiliates, Referrals, Commissions, Payouts');
  console.log('');
  console.log('💡 Next Steps:');
  console.log('   - Set up your Rewardful API key');
  console.log('   - Test the API connection');
  console.log('   - Import your affiliate data');
  console.log('   - View data in the affiliate dashboard');
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  displaySetupInstructions();
} else if (args.length === 1) {
  const apiKey = args[0];
  
  if (!apiKey || apiKey.length < 10) {
    console.log('❌ Invalid API key provided');
    console.log('💡 API key should be a long string from Rewardful');
    process.exit(1);
  }
  
  try {
    updateEnvFile(apiKey);
    console.log('');
    console.log('🎉 Setup completed successfully!');
    console.log('');
    console.log('🧪 Test your setup:');
    console.log('   node test-mightynetworks.js');
    console.log('');
    console.log('📊 Check database structure:');
    console.log('   node test-mightynetworks-import.js');
    
  } catch (error) {
    console.log('❌ Error updating environment file:', error.message);
    process.exit(1);
  }
} else {
  console.log('❌ Too many arguments provided');
  console.log('💡 Usage: node setup-mightynetworks.js [API_KEY]');
  process.exit(1);
} 