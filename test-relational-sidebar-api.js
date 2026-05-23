#!/usr/bin/env node

/**
 * API Test Suite for Relational Sidebar
 * Tests all 6 endpoints with various scenarios
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
    console.log(`   Response:`, JSON.stringify(health, null, 2));
    tests.push({ name: 'Health Check', passed: healthRes.status === 200 });

    // TEST 2: Get All Departments
    console.log('\n📍 Test 2: Get All Departments');
    const deptRes = await fetch(`${baseURL}/departments`);
    const depts = await deptRes.json();
    console.log(`   ✅ Status: ${deptRes.status}`);
    console.log(`   Found ${depts.count} departments`);
    console.log(`   Data:`, JSON.stringify(depts.data, null, 2));
    tests.push({ name: 'Get All Departments', passed: deptRes.status === 200 && depts.count > 0 });

    // TEST 3: Get Specific Department
    if (depts.data.length > 0) {
      const deptId = depts.data[0].id;
      console.log(`\n📍 Test 3: Get Department by ID (${deptId})`);
      const specificRes = await fetch(`${baseURL}/departments/${deptId}`);
      const specific = await specificRes.json();
      console.log(`   ✅ Status: ${specificRes.status}`);
      console.log(`   Data:`, JSON.stringify(specific.data, null, 2));
      tests.push({ name: 'Get Department by ID', passed: specificRes.status === 200 });
    }

    // TEST 4: Get All Assistants
    console.log('\n📍 Test 4: Get All Assistants');
    const assistRes = await fetch(`${baseURL}/assistants`);
    const assists = await assistRes.json();
    console.log(`   ✅ Status: ${assistRes.status}`);
    console.log(`   Found ${assists.count} assistants`);
    console.log(`   Data:`, JSON.stringify(assists.data, null, 2));
    tests.push({ name: 'Get All Assistants', passed: assistRes.status === 200 });

    // TEST 5: Get Specific Assistant
    if (assists.data.length > 0) {
      const assistId = assists.data[0].id;
      console.log(`\n📍 Test 5: Get Assistant by ID (${assistId})`);
      const specificAssistRes = await fetch(`${baseURL}/assistants/${assistId}`);
      const specificAssist = await specificAssistRes.json();
      console.log(`   ✅ Status: ${specificAssistRes.status}`);
      console.log(`   Data:`, JSON.stringify(specificAssist.data, null, 2));
      tests.push({ name: 'Get Assistant by ID', passed: specificAssistRes.status === 200 });

      // TEST 6: Get Context Data
      console.log(`\n📍 Test 6: Get Context Data for ${assistId}`);
      const contextRes = await fetch(`${baseURL}/assistants/${assistId}/contexts/inventory`);
      const context = await contextRes.json();
      console.log(`   ✅ Status: ${contextRes.status}`);
      if (contextRes.status === 200) {
        console.log(`   Data:`, JSON.stringify(context.data, null, 2));
        tests.push({ name: 'Get Context Data', passed: true });
      } else {
        console.log(`   Note: No context data (expected for some assistants)`);
        tests.push({ name: 'Get Context Data', passed: contextRes.status === 404 });
      }

      // TEST 7: Send Notification
      console.log(`\n📍 Test 7: Send Notification to ${assistId}`);
      const notifRes = await fetch(`${baseURL}/assistants/${assistId}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Test notification from API suite',
          type: 'info',
        }),
      });
      const notif = await notifRes.json();
      console.log(`   ✅ Status: ${notifRes.status}`);
      console.log(`   Data:`, JSON.stringify(notif.data, null, 2));
      tests.push({ name: 'Send Notification', passed: notifRes.status === 201 });
    }

    // TEST 8: Filtered Assistants Query
    console.log('\n📍 Test 8: Get Assistants with Filters');
    const filteredRes = await fetch(`${baseURL}/assistants?hasPermission=true`);
    const filtered = await filteredRes.json();
    console.log(`   ✅ Status: ${filteredRes.status}`);
    console.log(`   Found ${filtered.count} assistants with permission`);
    tests.push({ name: 'Filtered Assistants', passed: filteredRes.status === 200 });

    // SUMMARY
    console.log('\n\n📊 TEST SUMMARY');
    console.log('=====================================');
    const passedTests = tests.filter((t) => t.passed).length;
    const totalTests = tests.length;
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log('');

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

// Run tests after short delay to ensure server is ready
setTimeout(runTests, 1000);
            headers: res.headers,
            body: parsed,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function logTest(name, passed, details = '') {
  const status = passed ? `${COLORS.green}✅ PASS${COLORS.reset}` : `${COLORS.red}❌ FAIL${COLORS.reset}`;
  console.log(`${status} | ${name}`);
  if (details) {
    console.log(`   └─ ${details}`);
  }
  if (passed) {
    testsPassed++;
  } else {
    testsFailed++;
  }
  results.push({ name, passed, details });
}

async function runTests() {
  console.log(`\n${COLORS.cyan}════════════════════════════════════════════════════════════${COLORS.reset}`);
  console.log(`${COLORS.cyan}      PHASE 2: RELATIONAL SIDEBAR API TESTING${COLORS.reset}`);
  console.log(`${COLORS.cyan}════════════════════════════════════════════════════════════${COLORS.reset}\n`);

  try {
    // Test 1: Health Check
    console.log(`${COLORS.blue}Test Group 1: Health Check${COLORS.reset}`);
    try {
      const healthRes = await makeRequest('GET', '/health');
      logTest('Health endpoint responds', healthRes.status === 200);
    } catch (e) {
      logTest('Health endpoint responds', false, `Error: ${e.message}`);
      console.log(`\n${COLORS.red}ERROR: Cannot connect to backend at ${BASE_URL}${COLORS.reset}`);
      console.log(`${COLORS.yellow}Start backend with: npm run dev${COLORS.reset}\n`);
      return;
    }

    // Test 2: GET /departments
    console.log(`\n${COLORS.blue}Test Group 2: GET /departments${COLORS.reset}`);
    const deptRes = await makeRequest('GET', '/departments');
    logTest('Returns 200 status', deptRes.status === 200);
    logTest('Returns success flag', deptRes.body.success === true);
    logTest('Returns departments array', Array.isArray(deptRes.body.data));
    logTest('Has correct count field', typeof deptRes.body.count === 'number');
    if (deptRes.body.data && deptRes.body.data.length > 0) {
      logTest('First department has id', !!deptRes.body.data[0].id);
      logTest('First department has name', !!deptRes.body.data[0].name);
      logTest('First department has services', Array.isArray(deptRes.body.data[0].services));
    }

    // Test 3: GET /departments/:id
    console.log(`\n${COLORS.blue}Test Group 3: GET /departments/:id${COLORS.reset}`);
    const deptByIdRes = await makeRequest('GET', '/departments/OPERATIONS');
    logTest('Returns 200 status', deptByIdRes.status === 200);
    logTest('Returns success flag', deptByIdRes.body.success === true);
    logTest('Returns single department object', typeof deptByIdRes.body.data === 'object');
    logTest('Department has correct ID', deptByIdRes.body.data?.id === 'OPERATIONS');

    // Test invalid department
    const invalidDeptRes = await makeRequest('GET', '/departments/INVALID_DEPT');
    logTest('Invalid department returns 404', invalidDeptRes.status === 404);

    // Test 4: GET /assistants
    console.log(`\n${COLORS.blue}Test Group 4: GET /assistants${COLORS.reset}`);
    const assistRes = await makeRequest('GET', '/assistants');
    logTest('Returns 200 status', assistRes.status === 200);
    logTest('Returns success flag', assistRes.body.success === true);
    logTest('Returns assistants array', Array.isArray(assistRes.body.data));
    logTest('Has correct count field', typeof assistRes.body.count === 'number');
    if (assistRes.body.data && assistRes.body.data.length > 0) {
      logTest('First assistant has id', !!assistRes.body.data[0].id);
      logTest('First assistant has name', !!assistRes.body.data[0].name);
      logTest('First assistant has department', !!assistRes.body.data[0].department);
    }

    // Test 5: GET /assistants with filters
    console.log(`\n${COLORS.blue}Test Group 5: GET /assistants (with filters)${COLORS.reset}`);
    const filteredRes = await makeRequest('GET', '/assistants?department=OPERATIONS');
    logTest('Returns 200 status', filteredRes.status === 200);
    logTest('Filters by department', 
      filteredRes.body.data?.every(a => a.department === 'OPERATIONS') || 
      filteredRes.body.data?.length === 0
    );

    // Test 6: GET /assistants/:id
    console.log(`\n${COLORS.blue}Test Group 6: GET /assistants/:id${COLORS.reset}`);
    const assistByIdRes = await makeRequest('GET', '/assistants/mary_001');
    logTest('Returns 200 status', assistByIdRes.status === 200);
    logTest('Returns success flag', assistByIdRes.body.success === true);
    logTest('Returns single assistant object', typeof assistByIdRes.body.data === 'object');
    logTest('Assistant has correct ID', assistByIdRes.body.data?.id === 'mary_001');

    // Test invalid assistant
    const invalidAssistRes = await makeRequest('GET', '/assistants/invalid_assistant');
    logTest('Invalid assistant returns 404', invalidAssistRes.status === 404);

    // Test 7: GET /assistants/:id/contexts/:context
    console.log(`\n${COLORS.blue}Test Group 7: GET /assistants/:id/contexts/:context${COLORS.reset}`);
    const contextRes = await makeRequest('GET', '/assistants/mary_001/contexts/inventory');
    logTest('Returns 200 status', contextRes.status === 200);
    logTest('Returns success flag', contextRes.body.success === true);
    logTest('Returns context data object', typeof contextRes.body.data === 'object');
    logTest('Context data has assistantId', contextRes.body.data?.assistantId === 'mary_001');
    logTest('Context data has context name', contextRes.body.data?.context === 'inventory');
    logTest('Context data has items array', Array.isArray(contextRes.body.data?.items));

    // Test invalid context
    const invalidContextRes = await makeRequest('GET', '/assistants/mary_001/contexts/invalid_context');
    logTest('Invalid context returns 400', invalidContextRes.status === 400);

    // Test 8: POST /assistants/:id/notifications
    console.log(`\n${COLORS.blue}Test Group 8: POST /assistants/:id/notifications${COLORS.reset}`);
    const notifRes = await makeRequest('POST', '/assistants/mary_001/notifications', {
      message: 'Test notification from automated test',
      type: 'info',
    });
    logTest('Returns 201 status', notifRes.status === 201);
    logTest('Returns success flag', notifRes.body.success === true);
    logTest('Returns notification object', typeof notifRes.body.data === 'object');
    logTest('Notification has id', !!notifRes.body.data?.id);
    logTest('Notification has message', !!notifRes.body.data?.message);

    // Test different notification types
    const warningRes = await makeRequest('POST', '/assistants/nina_001/notifications', {
      message: 'Warning notification',
      type: 'warning',
    });
    logTest('Warning notification type works', warningRes.status === 201);

    const successRes = await makeRequest('POST', '/assistants/linda_001/notifications', {
      message: 'Success notification',
      type: 'success',
    });
    logTest('Success notification type works', successRes.status === 201);

    const errorRes = await makeRequest('POST', '/assistants/agent_001/notifications', {
      message: 'Error notification',
      type: 'error',
    });
    logTest('Error notification type works', errorRes.status === 201);

    // Test missing message
    const missingMsgRes = await makeRequest('POST', '/assistants/mary_001/notifications', {
      type: 'info',
    });
    logTest('Missing message returns error', missingMsgRes.status === 400);

  } catch (error) {
    console.error(`${COLORS.red}Unexpected error during testing:${COLORS.reset}`, error);
  }

  // Print summary
  console.log(`\n${COLORS.cyan}════════════════════════════════════════════════════════════${COLORS.reset}`);
  console.log(`${COLORS.cyan}TESTING SUMMARY${COLORS.reset}`);
  console.log(`${COLORS.cyan}════════════════════════════════════════════════════════════${COLORS.reset}\n`);

  console.log(`${COLORS.green}Passed: ${testsPassed}${COLORS.reset}`);
  console.log(`${COLORS.red}Failed: ${testsFailed}${COLORS.reset}`);
  console.log(`Total:  ${testsPassed + testsFailed}\n`);

  if (testsFailed === 0) {
    console.log(`${COLORS.green}✅ ALL TESTS PASSED!${COLORS.reset}\n`);
    console.log(`${COLORS.cyan}Next Steps:${COLORS.reset}`);
    console.log(`  1. Review API responses in test output`);
    console.log(`  2. Begin Phase 2: Redux Integration`);
    console.log(`  3. Connect components to Redux thunks`);
    console.log(`  4. Test complete data flow\n`);
  } else {
    console.log(`${COLORS.red}❌ SOME TESTS FAILED${COLORS.reset}\n`);
    console.log(`${COLORS.yellow}Failed Tests:${COLORS.reset}`);
    results
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`  • ${r.name}${r.details ? ` - ${r.details}` : ''}`);
      });
    console.log();
  }
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
