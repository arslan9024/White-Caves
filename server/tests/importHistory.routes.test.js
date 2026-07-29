/**
 * importHistory.routes — Unit Tests
 * Tests pure helper functions and validation logic extracted from the route file.
 *
 * Covered:
 *  1. parseStrictInteger  — valid, invalid, boundary
 *  2. buildOwnershipQuery — structure
 *  3. buildSessionLookupQuery — valid ObjectId, invalid ObjectId
 *  4. formatDuration      — seconds, minutes, hours
 *  5. getImportTrend      — produces 7-day array
 *  6. getHourlyActivity   — produces 24-hour array
 *  7. adminOnly middleware — role gating (admin, superadmin, standard user)
 */

// ─── Inline copies of pure helpers (no DB / Express dependency) ──────────────

const MAX_HISTORY_LIMIT = 500;

function parseStrictInteger(value) {
  const raw = String(value ?? '').trim();
  if (!/^\d+$/.test(raw)) return null;
  return Number.parseInt(raw, 10);
}

function buildOwnershipQuery(userId) {
  return { $or: [{ userId }, { importedBy: userId }] };
}

function buildSessionLookupQuery(rawSessionId, userId) {
  // Minimal ObjectId validity check (24-char hex) used in the route
  const isValidObjectId = /^[a-f\d]{24}$/i.test(rawSessionId);
  const conditions = [{ sessionId: rawSessionId }];
  if (isValidObjectId) conditions.push({ _id: rawSessionId });
  return {
    ...buildOwnershipQuery(userId),
    $and: [{ $or: conditions }],
  };
}

function formatDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

function getImportTrend(imports) {
  const trend = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    const count = imports.filter(imp => {
      const impDate = new Date(imp.createdAt);
      return impDate >= date && impDate < nextDate;
    }).length;
    trend.push({ date: date.toLocaleDateString(), count });
  }
  return trend;
}

function getHourlyActivity(imports) {
  const activity = [];
  for (let hour = 0; hour < 24; hour++) {
    const count = imports.filter(imp => {
      const impDate = new Date(imp.createdAt);
      return impDate.getHours() === hour;
    }).length;
    activity.push({ hour: `${hour}:00`, count });
  }
  return activity;
}

// ─── Minimal middleware clone for adminOnly test ──────────────────────────────

function adminOnly(req, res, next) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
    res._status = 403;
    res._body = { success: false, error: 'Admin access required' };
    return;
  }
  next();
}

// ─── Test harness ─────────────────────────────────────────────────────────────

let total = 0;
let passed = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (err) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(a, b, message) {
  if (a !== b) throw new Error(message || `Expected ${JSON.stringify(b)} but got ${JSON.stringify(a)}`);
}

function assertDeepEqual(a, b, message) {
  const as = JSON.stringify(a);
  const bs = JSON.stringify(b);
  if (as !== bs) throw new Error(message || `Expected ${bs} but got ${as}`);
}

// ─── Suite 1: parseStrictInteger ─────────────────────────────────────────────

console.log('\n📦 importHistory.routes — Unit Tests\n');
console.log('  Suite 1: parseStrictInteger');

test('returns integer for valid numeric string "50"', () => {
  assertEqual(parseStrictInteger('50'), 50);
});

test('returns integer for numeric value 100', () => {
  assertEqual(parseStrictInteger(100), 100);
});

test('returns null for empty string', () => {
  assertEqual(parseStrictInteger(''), null);
});

test('returns null for float string "3.14"', () => {
  assertEqual(parseStrictInteger('3.14'), null);
});

test('returns null for negative string "-5"', () => {
  assertEqual(parseStrictInteger('-5'), null);
});

test('returns null for alphabetic string "abc"', () => {
  assertEqual(parseStrictInteger('abc'), null);
});

test('returns null for null input', () => {
  assertEqual(parseStrictInteger(null), null);
});

test('returns null for undefined input', () => {
  assertEqual(parseStrictInteger(undefined), null);
});

test('correctly parses MAX_HISTORY_LIMIT boundary (500)', () => {
  assertEqual(parseStrictInteger(500), 500);
});

test('parses "0" to 0', () => {
  assertEqual(parseStrictInteger('0'), 0);
});

// ─── Suite 2: buildOwnershipQuery ────────────────────────────────────────────

console.log('\n  Suite 2: buildOwnershipQuery');

test('returns $or array with userId and importedBy conditions', () => {
  const q = buildOwnershipQuery('user123');
  assert(Array.isArray(q.$or), '$or should be an array');
  assertEqual(q.$or.length, 2, 'should have 2 conditions');
  assertEqual(q.$or[0].userId, 'user123');
  assertEqual(q.$or[1].importedBy, 'user123');
});

test('works with ObjectId-like userId string', () => {
  const id = '5f43a2b1c0d0e0f000000001';
  const q = buildOwnershipQuery(id);
  assertEqual(q.$or[0].userId, id);
});

// ─── Suite 3: buildSessionLookupQuery ────────────────────────────────────────

console.log('\n  Suite 3: buildSessionLookupQuery');

test('includes _id condition when rawSessionId is valid 24-char hex ObjectId', () => {
  const oid = 'a1b2c3d4e5f6a1b2c3d4e5f6';
  const q = buildSessionLookupQuery(oid, 'userXYZ');
  const orConditions = q.$and[0].$or;
  assert(orConditions.length === 2, 'should include both sessionId and _id conditions');
  assert(orConditions.some(c => c._id === oid), '_id condition should be present');
});

test('excludes _id condition when rawSessionId is a short non-ObjectId string', () => {
  const sid = 'SESS-001';
  const q = buildSessionLookupQuery(sid, 'userXYZ');
  const orConditions = q.$and[0].$or;
  assertEqual(orConditions.length, 1, 'should only include sessionId condition');
  assert(!orConditions.some(c => c._id), '_id should not be present');
});

test('ownership conditions present in result', () => {
  const q = buildSessionLookupQuery('SESS-001', 'u99');
  assert(Array.isArray(q.$or), 'ownership $or should exist');
  assertEqual(q.$or[0].userId, 'u99');
});

// ─── Suite 4: formatDuration ──────────────────────────────────────────────────

console.log('\n  Suite 4: formatDuration');

test('formats 0ms as "0s"', () => {
  assertEqual(formatDuration(0), '0s');
});

test('formats 30000ms (30s) as "30s"', () => {
  assertEqual(formatDuration(30000), '30s');
});

test('formats 59000ms (59s) as "59s"', () => {
  assertEqual(formatDuration(59000), '59s');
});

test('formats 60000ms (1m) as "1m 0s"', () => {
  assertEqual(formatDuration(60000), '1m 0s');
});

test('formats 90000ms (1m 30s) as "1m 30s"', () => {
  assertEqual(formatDuration(90000), '1m 30s');
});

test('formats 3600000ms (1h) as "1h 0m"', () => {
  assertEqual(formatDuration(3600000), '1h 0m');
});

test('formats 5400000ms (1h 30m) as "1h 30m"', () => {
  assertEqual(formatDuration(5400000), '1h 30m');
});

test('formats 7200000ms (2h) as "2h 0m"', () => {
  assertEqual(formatDuration(7200000), '2h 0m');
});

// ─── Suite 5: getImportTrend ──────────────────────────────────────────────────

console.log('\n  Suite 5: getImportTrend');

test('always returns exactly 7 entries', () => {
  assertEqual(getImportTrend([]).length, 7);
});

test('each entry has date and count properties', () => {
  const trend = getImportTrend([]);
  for (const entry of trend) {
    assert(typeof entry.date === 'string', 'date should be a string');
    assert(typeof entry.count === 'number', 'count should be a number');
  }
});

test("counts today's imports in the last entry", () => {
  const now = new Date();
  const imports = [{ createdAt: now.toISOString() }];
  const trend = getImportTrend(imports);
  const todayEntry = trend[trend.length - 1];
  assertEqual(todayEntry.count, 1, "last trend entry should have count 1 for today's import");
});

test('returns all-zero counts for empty imports array', () => {
  const trend = getImportTrend([]);
  const totalCount = trend.reduce((s, e) => s + e.count, 0);
  assertEqual(totalCount, 0);
});

// ─── Suite 6: getHourlyActivity ───────────────────────────────────────────────

console.log('\n  Suite 6: getHourlyActivity');

test('always returns exactly 24 entries', () => {
  assertEqual(getHourlyActivity([]).length, 24);
});

test('entries span hours "0:00" to "23:00"', () => {
  const activity = getHourlyActivity([]);
  assertEqual(activity[0].hour, '0:00');
  assertEqual(activity[23].hour, '23:00');
});

test('each entry has count property as number', () => {
  for (const entry of getHourlyActivity([])) {
    assert(typeof entry.count === 'number', 'count should be a number');
  }
});

test('counts import at specific hour correctly', () => {
  // Create an import at hour 14
  const d = new Date();
  d.setHours(14, 0, 0, 0);
  const activity = getHourlyActivity([{ createdAt: d.toISOString() }]);
  assertEqual(activity[14].count, 1, 'hour 14 should have count 1');
  assertEqual(activity[13].count, 0, 'hour 13 should be 0');
});

// ─── Suite 7: adminOnly middleware ────────────────────────────────────────────

console.log('\n  Suite 7: adminOnly middleware');

test('calls next() for role "admin"', () => {
  let nextCalled = false;
  const req = { user: { role: 'admin' } };
  const res = {};
  adminOnly(req, res, () => { nextCalled = true; });
  assert(nextCalled, 'next() should have been called for admin role');
});

test('calls next() for role "superadmin"', () => {
  let nextCalled = false;
  const req = { user: { role: 'superadmin' } };
  const res = {};
  adminOnly(req, res, () => { nextCalled = true; });
  assert(nextCalled, 'next() should have been called for superadmin role');
});

test('rejects with 403 for role "agent"', () => {
  const req = { user: { role: 'agent' } };
  const res = {};
  let nextCalled = false;
  adminOnly(req, res, () => { nextCalled = true; });
  assert(!nextCalled, 'next() should NOT be called for non-admin');
  assertEqual(res._status, 403);
  assertEqual(res._body.success, false);
});

test('rejects with 403 when req.user is null', () => {
  const req = { user: null };
  const res = {};
  adminOnly(req, res, () => {});
  assertEqual(res._status, 403);
});

test('rejects with 403 when req.user is undefined', () => {
  const req = {};
  const res = {};
  adminOnly(req, res, () => {});
  assertEqual(res._status, 403);
});

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(50)}`);
console.log(`Results: ${passed}/${total} tests passed`);
if (passed === total) {
  console.log('🎉 All tests passed!\n');
} else {
  console.log(`⚠️  ${total - passed} test(s) failed\n`);
  process.exit(1);
}
