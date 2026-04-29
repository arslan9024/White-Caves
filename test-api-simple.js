#!/usr/bin/env node

/**
 * Relational Sidebar API Test Suite
 * Tests all 6 endpoints against standalone test server
 */

async function runTests() {
  const baseURL = 'http://localhost:4000/api/relational-sidebar';
  const tests = [];

  console.log('\n🧪 RELATIONAL SIDEBAR API TEST SUITE');
  console.log('=====================================\n');

  try {
    // TEST 1: Health Check
    console.log('📍 Test 1: Health Check');
    const healthRes = await fetch(`${baseURL}/health`);
    const health = await healthRes.json();
    console.log(`   ✅ Status: ${healthRes.status}`);
    tests.push({ name: 'Health Check', passed: healthRes.status === 200 });

    // TEST 2: Get All Departments
    console.log('\n📍 Test 2: Get All Departments');
    const deptRes = await fetch(`${baseURL}/departments`);
    const depts = await deptRes.json();
    console.log(`   ✅ Status: ${deptRes.status}`);
    console.log(`   Found ${depts.count} departments`);
    tests.push({ name: 'Get All Departments', passed: deptRes.status === 200 && depts.count > 0 });

    // TEST 3: Get Specific Department
    if (depts.data.length > 0) {
      const deptId = depts.data[0].id;
      console.log(`\n📍 Test 3: Get Department by ID (${deptId})`);
      const specificRes = await fetch(`${baseURL}/departments/${deptId}`);
      console.log(`   ✅ Status: ${specificRes.status}`);
      tests.push({ name: 'Get Department by ID', passed: specificRes.status === 200 });
    }

    // TEST 4: Get All Assistants
    console.log('\n📍 Test 4: Get All Assistants');
    const assistRes = await fetch(`${baseURL}/assistants`);
    const assists = await assistRes.json();
    console.log(`   ✅ Status: ${assistRes.status}`);
    console.log(`   Found ${assists.count} assistants`);
    tests.push({ name: 'Get All Assistants', passed: assistRes.status === 200 });

    // TEST 5: Get Specific Assistant
    if (assists.data.length > 0) {
      const assistId = assists.data[0].id;
      console.log(`\n📍 Test 5: Get Assistant by ID (${assistId})`);
      const specificAssistRes = await fetch(`${baseURL}/assistants/${assistId}`);
      console.log(`   ✅ Status: ${specificAssistRes.status}`);
      tests.push({ name: 'Get Assistant by ID', passed: specificAssistRes.status === 200 });

      // TEST 6: Get Context Data
      console.log(`\n📍 Test 6: Get Context Data for ${assistId}`);
      const contextRes = await fetch(`${baseURL}/assistants/${assistId}/contexts/inventory`);
      console.log(`   ✅ Status: ${contextRes.status}`);
      tests.push({ name: 'Get Context Data', passed: contextRes.status === 200 || contextRes.status === 404 });

      // TEST 7: Send Notification
      console.log(`\n📍 Test 7: Send Notification to ${assistId}`);
      const notifRes = await fetch(`${baseURL}/assistants/${assistId}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Test notification',
          type: 'info',
        }),
      });
      console.log(`   ✅ Status: ${notifRes.status}`);
      tests.push({ name: 'Send Notification', passed: notifRes.status === 201 });
    }

    // TEST 8: Filtered Assistants
    console.log('\n📍 Test 8: Get Assistants with Filters');
    const filteredRes = await fetch(`${baseURL}/assistants?hasPermission=true`);
    console.log(`   ✅ Status: ${filteredRes.status}`);
    tests.push({ name: 'Filtered Assistants', passed: filteredRes.status === 200 });

    // SUMMARY
    console.log('\n\n📊 TEST SUMMARY');
    console.log('=====================================');
    const passedTests = tests.filter((t) => t.passed).length;
    const totalTests = tests.length;
    console.log(`✅ Passed: ${passedTests}/${totalTests}\n`);

    tests.forEach((test, idx) => {
      const icon = test.passed ? '✅' : '❌';
      console.log(`${icon} ${idx + 1}. ${test.name}`);
    });

    console.log('\n✅ API Testing Complete!\n');
    process.exit(passedTests === totalTests ? 0 : 1);
  } catch (error) {
    console.error('❌ Test Error:', error.message);
    process.exit(1);
  }
}

// Run tests
setTimeout(runTests, 1000);
