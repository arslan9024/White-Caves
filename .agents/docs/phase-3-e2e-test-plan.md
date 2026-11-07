# PHASE 3 E2E TEST PLAN - COMMISSION FEATURE

## 📋 E2E Test Strategy

### Test Framework: Playwright

### File: `e2e/commission-workflow.spec.ts`

### Total Test Scenarios: 12+ tests

---

## 🎯 Test Coverage Map

### 1. Commission List & Navigation (2 tests)

```typescript
✅ Test 1.1: Display commission list with pagination
   - Navigate to commission tab
   - Verify list appears
   - Verify pagination controls
   - Verify page indicator

✅ Test 1.2: Filter commissions by status
   - View all commissions initially
   - Select status filter
   - Verify list updates
   - Verify only filtered items shown
```

### 2. Commission Creation (3 tests)

```typescript
✅ Test 2.1: Create new commission successfully
   - Click "New Commission" button
   - Fill form fields:
     - Select freelancer
     - Enter amount (500)
     - Enter commission rate (10%)
     - Select due date
   - Submit form
   - Verify success message
   - Verify new commission in list

✅ Test 2.2: Commission form validation
   - Open create form
   - Leave required fields empty
   - Attempt submit
   - Verify error messages
   - Verify form prevents submission

✅ Test 2.3: Real-time calculation preview
   - Open create form
   - Enter amount (500)
   - Enter rate (10%)
   - Verify calculation preview shows 50 AED
   - Change rate to 20%
   - Verify preview updates to 100 AED
```

### 3. Commission Viewing (2 tests)

```typescript
✅ Test 3.1: View commission details
   - Click commission from list
   - Verify detail modal opens
   - Verify all fields display correctly:
     - Freelancer name
     - Amount
     - Commission rate
     - Status
     - Due date
   - Verify Edit button present
   - Verify Delete button present (if authorized)

✅ Test 3.2: Statistics display
   - Verify commission stats visible:
     - Total commissions
     - Pending amount
     - Completed amount
     - Average amount
     - Highest amount
- Verify stats update after create/update/delete
```

### 4. Commission Editing (2 tests)

```typescript
✅ Test 4.1: Edit commission successfully
   - Click Edit button on commission
   - Form opens in edit mode
   - Modify commission rate: 10% → 15%
   - Submit form
   - Verify success message
   - Verify list updates with new value
   - Verify stats update

✅ Test 4.2: Edit form validation
   - Open edit form
   - Clear amount field
   - Attempt submit
   - Verify error displayed
   - Cannot submit with validation errors
```

### 5. Commission Deletion (2 tests)

```typescript
✅ Test 5.1: Delete commission
   - Click Delete button on commission
   - Confirm deletion dialog
   - Click "Yes, delete"
   - Verify success message
   - Verify commission removed from list
   - Verify count updated

✅ Test 5.2: Cancel deletion
   - Click Delete button
   - See confirmation dialog
   - Click "Cancel"
   - Commission remains in list
   - Dialog closes cleanly
```

### 6. Pagination & Sorting (2 tests)

```typescript
✅ Test 6.1: Pagination navigation
   - View page 1 commissions
   - Click "next page" button
   - Verify page 2 loads
   - Verify different commissions displayed
   - Click "previous page"
   - Verify page 1 reloads
   - Verify original commissions shown

✅ Test 6.2: Sorting commissions
   - Click "Sort by Amount"
   - Verify list sorted ascending
   - Click again
   - Verify list sorted descending
   - Click "Sort by Date"
   - Verify list re-sorted by date
```

### 7. Error Handling (2 tests)

```typescript
✅ Test 7.1: API error handling
   - Mock API to return 500 error
   - Try to fetch commissions
   - Verify error message displayed
   - Verify retry option available
   - Click retry
   - Verify successful recovery

✅ Test 7.2: Network failure handling
   - Go offline (simulate)
   - Try to create commission
   - Verify error message
   - Go back online
   - Retry
   - Verify successful operation
```

### 8. Role-Based Access Control (2 tests)

```typescript
✅ Test 8.1: Admin access (full CRUD)
   - Login as admin
   - Navigate to commission tab
   - Verify all buttons visible:
     - New Commission
     - Edit buttons
     - Delete buttons
   - Verify all operations work

✅ Test 8.2: Freelancer access (read-only)
   - Login as freelancer
   - Navigate to commission tab
   - Verify list displays
   - Verify New/Edit/Delete buttons hidden
   - Verify cannot perform CRUD operations
   - See "read-only" indicator
```

### 9. Success Messaging (2 tests)

```typescript
✅ Test 9.1: Create commission messaging
   - Create new commission
   - Verify green success banner
   - Verify message text: "Commission created successfully"
   - Auto-dismiss after 3 seconds
   - Manual dismiss button works

✅ Test 9.2: Error message handling
   - Trigger validation error
   - Verify red error banner
   - Verify error text displayed
   - Manual dismiss works
   - Try again button available
```

---

## 🔄 Test Workflow Example

```typescript
describe('Commission Feature E2E', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000/dashboard?tab=commission');
    await page.waitForLoadState('networkidle');
  });

  // Test 1: Display list
  test('should display commission list with pagination', async ({ page }) => {
    const list = page.locator('[data-testid="commission-list"]');
    await expect(list).toBeVisible();

    const rows = page.locator('[data-testid="commission-row"]');
    expect(await rows.count()).toBeGreaterThan(0);

    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).toBeVisible();
  });

  // Test 2: Create commission
  test('should create new commission', async ({ page }) => {
    // Click new button
    await page.click('button:has-text("New Commission")');

    // Fill form
    await page.fill('[name="freelancerId"]', 'freelancer-1');
    await page.fill('[name="amount"]', '500');
    await page.fill('[name="commissionRate"]', '10');
    await page.fill('[name="dueDate"]', '2026-04-17');

    // Submit
    await page.click('button:has-text("Create")');

    // Verify success
    const success = page.locator('[role="alert"]:has-text("created successfully")');
    await expect(success).toBeVisible();

    // Verify in list
    const newItem = page.locator('text=500');
    await expect(newItem).toBeVisible();
  });

  // Test 3: Edit commission
  test('should edit existing commission', async ({ page }) => {
    // Click first commission edit
    const editBtn = page.locator('[data-testid="edit-commission"]').first();
    await editBtn.click();

    // Change amount
    await page.fill('[name="commissionRate"]', '15');

    // Submit
    await page.click('button:has-text("Update")');

    // Verify success
    const success = page.locator('[role="alert"]:has-text("updated successfully")');
    await expect(success).toBeVisible();
  });

  // Test 4: Delete commission
  test('should delete commission', async ({ page }) => {
    // Get initial count
    const initialCount = await page.locator('[data-testid="commission-row"]').count();

    // Click delete
    const deleteBtn = page.locator('[data-testid="delete-commission"]').first();
    await deleteBtn.click();

    // Confirm
    await page.click('button:has-text("Yes, delete")');

    // Verify removed
    await page.waitForTimeout(500);
    const newCount = await page.locator('[data-testid="commission-row"]').count();
    expect(newCount).toBe(initialCount - 1);
  });

  // Test 5: Filter by status
  test('should filter commissions by status', async ({ page }) => {
    // Open filter
    await page.click('[data-testid="filter-btn"]');

    // Select status
    await page.selectOption('[name="status"]', 'paid');

    // Apply
    await page.click('button:has-text("Apply")');

    // Verify only paid shown
    const rows = page.locator('[data-testid="commission-row"]');
    const badges = rows.locator('[data-testid="status-badge"]');

    for (let i = 0; i < (await badges.count()); i++) {
      const badge = badges.nth(i);
      const text = await badge.textContent();
      expect(text).toContain('paid');
    }
  });
});
```

---

## 📊 Test Data Setup

### Test Fixtures:

```typescript
const testCommission = {
  freelancerId: 'freelancer-test-1',
  freelancerName: 'Test Freelancer',
  projectId: 'project-test-1',
  projectName: 'Test Project',
  amount: 500,
  commissionRate: 10,
  dueDate: '2026-04-17',
  status: 'pending',
  paymentMethod: 'bank_transfer',
  notes: 'Test commission',
};

const testData = {
  users: {
    admin: { email: 'admin@test.com', password: 'AdminPass123!' },
    freelancer: { email: 'freelancer@test.com', password: 'FreePass123!' },
  },
  commissions: [
    { ...testCommission, amount: 500 },
    { ...testCommission, amount: 750, status: 'paid' },
    { ...testCommission, amount: 1000, status: 'pending' },
  ],
};
```

---

## 🎯 Test Success Criteria

```
✅ All 12+ tests passing
✅ 0 flaky tests
✅ Execution time < 2 minutes
✅ 100% coverage of user workflows
✅ All role-based scenarios tested
✅ Error paths tested
✅ Edge cases handled
✅ Cross-browser compatible
```

---

## 🚀 Running Tests

```bash
# Run all commission E2E tests
npx playwright test e2e/commission-workflow.spec.ts

# Run specific test
npx playwright test -g "should create new commission"

# Run with UI
npx playwright test --ui

# Run in headed mode
npx playwright test --headed

# Generate report
npx playwright show-report
```

---

## ⏭️ Test Implementation Order

1. **Day 1** (1-2 hours)
   - Setup test scaffolding
   - Implement tests 1-3 (list, filter, create)

2. **Day 2** (1-2 hours)
   - Implement tests 4-6 (view, edit, delete)

3. **Day 3** (1 hour)
   - Implement tests 7-9 (errors, access, messaging)
   - Run full suite
   - Fix any issues

---

**Estimated Total E2E Test Time: 4-6 hours**
**Ready to start anytime after this session**

---

_Prepared: March 17, 2026 - Session 10_
