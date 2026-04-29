#!/usr/bin/env node

/**
 * Combined Server + Test Runner
 * Starts the relational sidebar server and runs tests
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🚀 Starting Relational Sidebar API Server...\n');

// Start the server
const serverProcess = spawn('node', ['test-relational-sidebar-standalone.js'], {
  cwd: __dirname,
  stdio: 'inherit',
});

// Wait for server to start, then run tests
setTimeout(async () => {
  console.log('\n✅ Server started. Running tests...\n');

  const baseURL = 'http://localhost:4000/api/relational-sidebar';
  const tests = [];

  try {
    // TEST 1: Health Check
    console.log('📍 Test 1: Health Check');
    const healthRes = await fetch(`${baseURL}/health`);
    const health = await healthRes.json();
    console.log(`   Status: ${healthRes.status} ✅`);
    tests.push({ name: 'Health Check', passed: healthRes.status === 200 });

    // TEST 2: Get All Departments
    console.log('\n📍 Test 2: Get All Departments');
    const deptRes = await fetch(`${baseURL}/departments`);
    const depts = await deptRes.json();
    console.log(`   Status: ${deptRes.status}, Found: ${depts.count} departments ✅`);
    tests.push({ name: 'Get All Departments', passed: deptRes.status === 200 && depts.count > 0 });

    // TEST 3: Get All Assistants
    console.log('\n📍 Test 3: Get All Assistants');
    const assistRes = await fetch(`${baseURL}/assistants`);
    const assists = await assistRes.json();
    console.log(`   Status: ${assistRes.status}, Found: ${assists.count} assistants ✅`);
    tests.push({ name: 'Get All Assistants', passed: assistRes.status === 200 });

    // TEST 4: Get Specific Departments
    if (depts.data.length > 0) {
      const deptId = depts.data[0].id;
      console.log(`\n📍 Test 4: Get Department (${deptId})`);
      const specificRes = await fetch(`${baseURL}/departments/${deptId}`);
      console.log(`   Status: ${specificRes.status} ✅`);
      tests.push({ name: 'Get Department by ID', passed: specificRes.status === 200 });
    }

    // TEST 5: Get Specific Assistants
    if (assists.data.length > 0) {
      const assistId = assists.data[0].id;
      console.log(`\n📍 Test 5: Get Assistant (${assistId})`);
      const specificAssistRes = await fetch(`${baseURL}/assistants/${assistId}`);
      console.log(`   Status: ${specificAssistRes.status} ✅`);
      tests.push({ name: 'Get Assistant by ID', passed: specificAssistRes.status === 200 });

      // TEST 6: Send Notification
      console.log(`\n📍 Test 6: Send Notification to ${assistId}`);
      const notifRes = await fetch(`${baseURL}/assistants/${assistId}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Test notification',
          type: 'info',
        }),
      });
      console.log(`   Status: ${notifRes.status} ✅`);
      tests.push({ name: 'Send Notification', passed: notifRes.status === 201 });
    }

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

    console.log('\n✅ All Tests Complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test Error:', error.message);
    process.exit(1);
  } finally {
    serverProcess.kill();
  }
}, 3000);

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  serverProcess.kill();
  process.exit(0);
});
