/**
 * Phase 2B Frontend Redux Integration Test
 * Tests the Redux thunks and Redux slices integration
 */

import fs from 'fs';
import path from 'path';

const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function testPass(testName, message) {
  testResults.passed++;
  testResults.tests.push({
    status: 'PASS',
    testName,
    message
  });
  console.log(`✅ PASS: ${testName}`);
  console.log(`   ${message}\n`);
}

function testFail(testName, message) {
  testResults.failed++;
  testResults.tests.push({
    status: 'FAIL',
    testName,
    message
  });
  console.error(`❌ FAIL: ${testName}`);
  console.error(`   ${message}\n`);
}

const __dirname = path.dirname(new URL(import.meta.url).pathname)
  .replace(/^\/([A-Z]:)/, '$1')  // Handle Windows drive letter
  .replace(/%20/g, ' ');  // Handle URL-encoded spaces

// Test 1: Verify Redux slice exists
try {
  const slicePath = path.join(__dirname, '../src/redux/slices/relationalSidebarSlice.js');
  if (fs.existsSync(slicePath)) {
    const content = fs.readFileSync(slicePath, 'utf-8');
    if (content.includes('selectSelectedDepartment') && content.includes('selectSelectedAssistant')) {
      testPass('Redux Slice Exists', 'relationalSidebarSlice.js found with selectors');
    } else {
      testFail('Redux Slice Exists', 'Selectors not found in slice');
    }
  } else {
    testFail('Redux Slice Exists', `Slice file not found at ${slicePath}`);
  }
} catch (error) {
  testFail('Redux Slice Exists', error.message);
}

// Test 2: Verify Redux thunks exist
try {
  const thunksPath = path.join(__dirname, '../src/store/thunks/relationalSidebarThunks.js');
  if (fs.existsSync(thunksPath)) {
    const content = fs.readFileSync(thunksPath, 'utf-8');
    const requiredThunks = ['fetchDepartments', 'fetchAssistants', 'fetchContextualData', 'sendNotification'];
    const missingThunks = requiredThunks.filter(thunk => !content.includes(`export const ${thunk}`));
    if (missingThunks.length === 0) {
      testPass('Redux Thunks Exist', `All required thunks found: ${requiredThunks.join(', ')}`);
    } else {
      testFail('Redux Thunks Exist', `Missing thunks: ${missingThunks.join(', ')}`);
    }
  } else {
    testFail('Redux Thunks Exist', `Thunks file not found at ${thunksPath}`);
  }
} catch (error) {
  testFail('Redux Thunks Exist', error.message);
}

// Test 3: Verify API service exists
try {
  const apiPath = path.join(__dirname, '../src/services/relationalSidebarAPI.js');
  if (fs.existsSync(apiPath)) {
    const content = fs.readFileSync(apiPath, 'utf-8');
    const requiredFunctions = ['getDepartments', 'getAssistants', 'getContextualData'];
    const missingFunctions = requiredFunctions.filter(fn => !content.includes(`export const ${fn}`));
    if (missingFunctions.length === 0) {
      testPass('API Service Exists', `All required functions found: ${requiredFunctions.join(', ')}`);
    } else {
      testFail('API Service Exists', `Missing functions: ${missingFunctions.join(', ')}`);
    }
  } else {
    testFail('API Service Exists', `API service file not found at ${apiPath}`);
  }
} catch (error) {
  testFail('API Service Exists', error.message);
}

// Test 4: Verify RelationalLeftSidebar component exists and uses Redux
try {
  const compPath = path.join(__dirname, '../src/components/sidebars/RelationalLeftSidebar/RelationalLeftSidebar.tsx');
  if (fs.existsSync(compPath)) {
    const content = fs.readFileSync(compPath, 'utf-8');
    const checks = [
      { pattern: 'useDispatch', name: 'useDispatch hook' },
      { pattern: 'useSelector', name: 'useSelector hook' },
      { pattern: 'fetchDepartments', name: 'fetchDepartments thunk' },
      { pattern: 'setSelectedDepartment', name: 'setSelectedDepartment action' },
      { pattern: 'departmentLoading', name: 'loading state' },
      { pattern: 'departmentError', name: 'error state' }
    ];
    const missingChecks = checks.filter(check => !content.includes(check.pattern));
    if (missingChecks.length === 0) {
      testPass('RelationalLeftSidebar Redux Integration', `All Redux patterns found`);
    } else {
      testFail('RelationalLeftSidebar Redux Integration', `Missing: ${missingChecks.map(c => c.name).join(', ')}`);
    }
  } else {
    testFail('RelationalLeftSidebar Redux Integration', `Component not found at ${compPath}`);
  }
} catch (error) {
  testFail('RelationalLeftSidebar Redux Integration', error.message);
}

// Test 5: Verify RelationalRightSidebar component exists and uses Redux
try {
  const compPath = path.join(__dirname, '../src/components/sidebars/RelationalRightSidebar/RelationalRightSidebar.tsx');
  if (fs.existsSync(compPath)) {
    const content = fs.readFileSync(compPath, 'utf-8');
    const checks = [
      { pattern: 'useDispatch', name: 'useDispatch hook' },
      { pattern: 'useSelector', name: 'useSelector hook' },
      { pattern: 'fetchAssistants', name: 'fetchAssistants thunk' },
      { pattern: 'setSelectedAssistant', name: 'setSelectedAssistant action' },
      { pattern: 'assistantLoading', name: 'loading state' },
      { pattern: 'assistantError', name: 'error state' }
    ];
    const missingChecks = checks.filter(check => !content.includes(check.pattern));
    if (missingChecks.length === 0) {
      testPass('RelationalRightSidebar Redux Integration', `All Redux patterns found`);
    } else {
      testFail('RelationalRightSidebar Redux Integration', `Missing: ${missingChecks.map(c => c.name).join(', ')}`);
    }
  } else {
    testFail('RelationalRightSidebar Redux Integration', `Component not found at ${compPath}`);
  }
} catch (error) {
  testFail('RelationalRightSidebar Redux Integration', error.message);
}

// Test 6: Verify loading states UI exists
try {
  const leftPath = path.join(__dirname, '../src/components/sidebars/RelationalLeftSidebar/RelationalLeftSidebar.tsx');
  const leftContent = fs.readFileSync(leftPath, 'utf-8');
  const rightPath = path.join(__dirname, '../src/components/sidebars/RelationalRightSidebar/RelationalRightSidebar.tsx');
  const rightContent = fs.readFileSync(rightPath, 'utf-8');
  
  const loadingUIChecks = [
    { content: leftContent, name: 'Left Sidebar', pattern: 'SkeletonItem' },
    { content: leftContent, name: 'Left Sidebar', pattern: 'ErrorContainer' },
    { content: leftContent, name: 'Left Sidebar', pattern: 'RetryButton' },
    { content: rightContent, name: 'Right Sidebar', pattern: 'SkeletonItem' },
    { content: rightContent, name: 'Right Sidebar', pattern: 'ErrorContainer' },
    { content: rightContent, name: 'Right Sidebar', pattern: 'RetryButton' }
  ];
  
  const missingUI = loadingUIChecks.filter(check => !check.content.includes(check.pattern));
  if (missingUI.length === 0) {
    testPass('Loading/Error States UI', `All UI components for loading and error states found`);
  } else {
    testFail('Loading/Error States UI', `Missing UI: ${missingUI.map(u => `${u.name} (${u.pattern})`).join(', ')}`);
  }
} catch (error) {
  testFail('Loading/Error States UI', error.message);
}

// Test 7: Verify Redux store configuration
try {
  const storePath = path.join(__dirname, '../src/store/store.js');
  if (fs.existsSync(storePath)) {
    const content = fs.readFileSync(storePath, 'utf-8');
    if (content.includes('relationalSidebarReducer') && content.includes('relational-sidebar')) {
      testPass('Redux Store Configuration', 'relationalSidebarReducer registered in store');
    } else {
      testFail('Redux Store Configuration', 'relationalSidebarReducer not found in store');
    }
  } else {
    testFail('Redux Store Configuration', `Store file not found at ${storePath}`);
  }
} catch (error) {
  testFail('Redux Store Configuration', error.message);
}

// Test 8: Verify backend API routes exist
try {
  const routesPath = path.join(__dirname, '../server/routes/relational-sidebar.js');
  if (fs.existsSync(routesPath)) {
    const content = fs.readFileSync(routesPath, 'utf-8');
    const requiredEndpoints = ['/departments', '/assistants', '/contextual-data'];
    const missingEndpoints = requiredEndpoints.filter(ep => !content.includes(ep));
    if (missingEndpoints.length === 0) {
      testPass('Backend API Routes', `All required endpoints found: ${requiredEndpoints.join(', ')}`);
    } else {
      testFail('Backend API Routes', `Missing endpoints: ${missingEndpoints.join(', ')}`);
    }
  } else {
    testFail('Backend API Routes', `Routes file not found at ${routesPath}`);
  }
} catch (error) {
  testFail('Backend API Routes', error.message);
}

// Print summary
console.log('\n' + '='.repeat(60));
console.log('PHASE 2B FRONTEND REDUX INTEGRATION TEST SUMMARY');
console.log('='.repeat(60));
console.log(`\nTotal Tests: ${testResults.passed + testResults.failed}`);
console.log(`Passed: ${testResults.passed} ✅`);
console.log(`Failed: ${testResults.failed} ❌`);
console.log(`Success Rate: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);
console.log('\n' + '='.repeat(60));

if (testResults.failed > 0) {
  console.log('FAILED TESTS:');
  testResults.tests
    .filter(t => t.status === 'FAIL')
    .forEach(t => {
      console.log(`\n  ❌ ${t.testName}`);
      console.log(`     ${t.message}`);
    });
  process.exit(1);
} else {
  console.log('\n✅ ALL TESTS PASSED! Frontend Redux integration is ready.');
  process.exit(0);
}
