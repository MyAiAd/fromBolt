// Test script to verify Mighty Networks webhook configuration
const fetch = require('node-fetch');

const WEBHOOK_URL = 'http://localhost:54321/functions/v1/mn-webhook';
const API_KEY = 'Pw8Io8duTZqtSm0jQMYYv9KVPRQfJMf99Nrtc1ZyOGA';

async function testWebhook() {
  console.log('🧪 Testing Mighty Networks Webhook...');
  console.log(`📍 URL: ${WEBHOOK_URL}`);
  console.log(`🔑 API Key: ${API_KEY.substring(0, 10)}...`);
  
  const testPayload = {
    api_key: API_KEY,
    member_id: 'test-123',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    activity_type: 'joined',
    timestamp: new Date().toISOString()
  };

  try {
    console.log('\n📤 Sending test payload...');
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    console.log(`📥 Response Status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log('📄 Response Body:', responseText);

    if (response.ok) {
      console.log('✅ Webhook test successful!');
    } else {
      console.log('❌ Webhook test failed');
      
      if (response.status === 401) {
        console.log('🔐 Authentication issue - check API key configuration');
      } else if (response.status === 404) {
        console.log('🔍 Function not found - check URL and deployment');
      }
    }

  } catch (error) {
    console.log('❌ Network error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('🔌 Connection refused - is Supabase running locally?');
      console.log('💡 Try: supabase start');
    }
  }
}

// Run the test
testWebhook().catch(console.error); 