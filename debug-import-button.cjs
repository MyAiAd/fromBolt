const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Production environment test
async function debugImportButton() {
  console.log('🔍 Debugging Import Button Functionality');
  console.log('=====================================\n');

  // Check environment variables
  console.log('1️⃣ Environment Variables Check:');
  console.log('- VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '[PRESENT]' : '[MISSING]');
  console.log('- VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '[PRESENT]' : '[MISSING]');
  console.log('- VITE_GOAFFPRO_ACCESS_TOKEN:', process.env.VITE_GOAFFPRO_ACCESS_TOKEN ? '[PRESENT]' : '[MISSING]');
  console.log('- VITE_GOAFFPRO_PUBLIC_TOKEN:', process.env.VITE_GOAFFPRO_PUBLIC_TOKEN ? '[PRESENT]' : '[MISSING]');
  
  if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
    console.log('❌ Missing Supabase credentials - cannot proceed with database tests\n');
    return;
  }

  // Test database connection
  console.log('\n2️⃣ Database Connection Test:');
  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase.from('data_import_logs').select('id').limit(1);
    if (error) {
      console.log('❌ Database connection failed:', error.message);
    } else {
      console.log('✅ Database connection successful');
    }
  } catch (error) {
    console.log('❌ Database connection error:', error.message);
  }

  // Test GoAffPro API
  console.log('\n3️⃣ GoAffPro API Test:');
  try {
    const response = await fetch('https://api.goaffpro.com/v1/admin/affiliates?limit=1', {
      headers: {
        'X-GOAFFPRO-ACCESS-TOKEN': process.env.VITE_GOAFFPRO_ACCESS_TOKEN,
        'X-GOAFFPRO-PUBLIC-TOKEN': process.env.VITE_GOAFFPRO_PUBLIC_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ GoAffPro API connection successful');
      console.log(`- Total affiliates available: ${data.total_results || 'unknown'}`);
    } else {
      console.log('❌ GoAffPro API failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ GoAffPro API error:', error.message);
  }

  // Recommendations
  console.log('\n4️⃣ Import Button Troubleshooting Guide:');
  console.log('==========================================');
  console.log('If the import button is not working on https://jenna-two.vercel.app/affiliates:\n');
  
  console.log('🔧 IMMEDIATE FIXES TO TRY:');
  console.log('1. Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)');
  console.log('2. Clear browser cache and cookies for the site');
  console.log('3. Try in an incognito/private browser window');
  console.log('4. Check if you are logged in as an admin user\n');
  
  console.log('🔍 DEBUGGING STEPS:');
  console.log('1. Open browser developer tools (F12)');
  console.log('2. Go to Console tab');
  console.log('3. Click the Import Data button');
  console.log('4. Look for any red error messages');
  console.log('5. Go to Network tab and check for failed requests\n');
  
  console.log('⚙️ COMMON ISSUES & SOLUTIONS:');
  console.log('');
  console.log('❌ "Import Data" button not visible:');
  console.log('   → Make sure you are logged in as an admin user');
  console.log('   → Only admin users can see the import functionality');
  console.log('');
  console.log('❌ Button shows but nothing happens when clicked:');
  console.log('   → Check browser console for JavaScript errors');
  console.log('   → Verify environment variables are set in Vercel');
  console.log('   → Database connection may be failing');
  console.log('');
  console.log('❌ Import starts but fails with errors:');
  console.log('   → GoAffPro API tokens may have expired');
  console.log('   → GHL API tokens may need refresh');
  console.log('   → Database permission issues (RLS policies)');
  console.log('');
  console.log('❌ Import appears to work but no data shows:');
  console.log('   → Check affiliate filtering logic may be too restrictive');
  console.log('   → Data may be imported but not displayed properly');
  console.log('   → Clear cache and refresh the page');
  
  console.log('\n📊 Expected Import Results:');
  console.log('- GoAffPro: ~69 affiliates (confirmed working in tests)');
  console.log('- GHL: ~481 affiliates (depends on filtering logic)');
  console.log('- Total: ~550 affiliate records should be imported');
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Run this test: node debug-import-button.cjs');
  console.log('2. Try the import button on the live site');
  console.log('3. Check browser developer tools for errors');
  console.log('4. If issues persist, check Vercel deployment logs');
}

debugImportButton().catch(console.error); 