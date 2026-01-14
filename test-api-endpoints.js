/**
 * Test Script: Verify All API Endpoints
 * Run this to confirm Landlord and WhatsApp APIs are working
 */

const baseURL = 'http://localhost:5173'; // Adjust to your dev server URL

const testEndpoints = async () => {
  console.log('\n🧪 Testing White Caves API Endpoints...\n');

  const endpoints = [
    // Landlord APIs
    { method: 'GET', path: '/api/landlord/stats', name: 'Landlord Stats' },
    { method: 'GET', path: '/api/landlord/properties', name: 'Landlord Properties' },
    { method: 'GET', path: '/api/landlord/maintenance', name: 'Landlord Maintenance' },
    { method: 'GET', path: '/api/landlord/finances', name: 'Landlord Finances' },

    // WhatsApp APIs
    { method: 'GET', path: '/api/whatsapp/session', name: 'WhatsApp Session' },
    { method: 'GET', path: '/api/whatsapp/stats', name: 'WhatsApp Stats' },
    { method: 'GET', path: '/api/whatsapp/contacts', name: 'WhatsApp Contacts' },
    { method: 'GET', path: '/api/whatsapp/messages/1', name: 'WhatsApp Messages' },

    // Bot APIs
    { method: 'GET', path: '/api/bots', name: 'Bot List' },
    { method: 'GET', path: '/api/flows', name: 'Flow List' },
    { method: 'GET', path: '/api/sessions', name: 'Session List' },

    // Health Check
    { method: 'GET', path: '/api/health', name: 'Health Check' },
    { method: 'GET', path: '/api/system/health', name: 'System Health' },
  ];

  let passed = 0;
  let failed = 0;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseURL}${endpoint.path}`, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint.name}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Data: ${JSON.stringify(data).substring(0, 100)}...`);
        passed++;
      } else {
        console.log(`❌ ${endpoint.name}`);
        console.log(`   Status: ${response.status}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
    console.log('');
  }

  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);

  if (failed === 0) {
    console.log('✨ All endpoints working correctly!');
  } else {
    console.log('⚠️  Some endpoints failed. Check server logs.');
  }
};

// Run tests
testEndpoints();
