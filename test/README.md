# White Caves Testing Guide

## Overview

This directory contains the comprehensive testing infrastructure for the White Caves Real Estate platform. Our testing strategy covers unit tests, integration tests, and end-to-end tests to ensure code quality and reliability.

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

### E2E Tests with UI
```bash
npm run test:e2e:ui
```

### Watch Mode (Development)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Test UI (Interactive)
```bash
npm run test:ui
```

### Run All Tests (Unit + E2E)
```bash
npm run test:all
```

## Test Structure

```
test/
├── unit/                    # Fast, isolated tests for components and functions
│   ├── components/          # React component tests
│   ├── hooks/              # Custom React hooks tests
│   ├── services/           # Service layer tests
│   └── utils/              # Utility function tests
├── integration/            # Tests for API endpoints and service integration
│   ├── api/               # API endpoint tests
│   ├── database/          # Database operation tests
│   └── services/          # Service integration tests
├── e2e/                   # End-to-end user flow tests
│   ├── user-flows/        # User journey tests
│   └── admin/             # Admin functionality tests
├── mocks/                 # Mock data and API handlers
│   ├── data/              # Mock data objects
│   ├── services/          # Mock service implementations
│   ├── handlers.js        # MSW request handlers
│   └── server.js          # MSW server setup
├── utils/                 # Test helpers and utilities
│   ├── testHelpers.js     # Reusable test utilities
│   ├── setupTests.js      # Global test setup
│   └── mockFactories.js   # Mock object factories
├── fixtures/              # Static test data
│   ├── sample-contract.json
│   ├── sample-property.json
│   └── sample-conversation.json
└── setup.js               # Global test configuration
```

## Writing Tests

### Component Tests

Component tests should test behavior, not implementation. Use `renderWithProviders` from test helpers to include Redux and Router context.

```javascript
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/testHelpers';
import PropertyCard from '../../../src/components/PropertyCard';

describe('PropertyCard', () => {
  const mockProperty = {
    _id: '123',
    title: 'Luxury Villa',
    location: 'Dubai Marina',
    price: 5000,
  };

  it('renders property details correctly', () => {
    renderWithProviders(<PropertyCard property={mockProperty} />);
    
    expect(screen.getByText('Luxury Villa')).toBeInTheDocument();
    expect(screen.getByText(/Dubai Marina/i)).toBeInTheDocument();
  });
});
```

### API Tests

Use `supertest` to test Express endpoints without starting a server.

```javascript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../../server/index.js';

describe('Property API Endpoints', () => {
  let server;

  beforeAll(() => {
    server = app.listen(0);
  });

  afterAll(() => {
    server.close();
  });

  it('should return list of properties', async () => {
    const response = await request(server)
      .get('/api/properties')
      .expect(200);

    expect(response.body).toHaveProperty('properties');
    expect(Array.isArray(response.body.properties)).toBe(true);
  });
});
```

### E2E Tests

Use Playwright for browser automation and real user flows.

```javascript
import { test, expect } from '@playwright/test';

test('user can view and filter properties', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  await page.click('text=Properties');
  await expect(page).toHaveURL(/.*properties/);
  
  const propertyCards = page.locator('[data-testid="property-card"]');
  await expect(propertyCards.first()).toBeVisible();
});
```

## Test Utilities

### Mock Data

Pre-built mock data is available in `test/mocks/data/`:
- `properties.mock.js` - Property mock data
- `users.mock.js` - User mock data
- `conversations.mock.js` - Conversation mock data

### Test Helpers

Common test utilities in `test/utils/testHelpers.js`:
- `renderWithProviders()` - Render components with Redux/Router
- `mockFetch()` - Mock fetch API calls
- `waitForAsync()` - Wait for async operations
- `setupLocalStorageMock()` - Mock localStorage

### Fixtures

Static test data files in `test/fixtures/`:
- `sample-property.json` - Complete property example
- `sample-conversation.json` - Complete conversation example
- `sample-contract.json` - Complete contract example

## Best Practices

### 1. Test Behavior, Not Implementation
Focus on what the component does, not how it does it.

```javascript
// ✅ Good - testing behavior
expect(screen.getByText('Submit')).toBeInTheDocument();
await userEvent.click(screen.getByText('Submit'));
expect(mockSubmit).toHaveBeenCalled();

// ❌ Bad - testing implementation
expect(component.state.isSubmitting).toBe(true);
```

### 2. Use Descriptive Test Names
Test names should clearly describe what is being tested.

```javascript
// ✅ Good
it('displays error message when email is invalid', () => {});

// ❌ Bad
it('test email', () => {});
```

### 3. Keep Tests Isolated and Independent
Each test should be able to run independently without affecting others.

```javascript
beforeEach(() => {
  // Reset state before each test
  testDb.clear();
  vi.clearAllMocks();
});
```

### 4. Mock External Dependencies
Always mock external APIs, databases, and services.

```javascript
import { vi } from 'vitest';

vi.mock('../services/api', () => ({
  fetchProperties: vi.fn(() => Promise.resolve(mockProperties)),
}));
```

### 5. Aim for High Coverage
Target at least 80% code coverage for critical paths.

```bash
npm run test:coverage
```

## Debugging Tests

### Debug in VS Code
Add a `.vscode/launch.json` configuration:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test:watch"],
  "console": "integratedTerminal"
}
```

### Debug E2E Tests
Run E2E tests in headed mode to see what's happening:

```bash
npm run test:e2e:headed
```

Or use debug mode:

```bash
npm run test:e2e:debug
```

### View Test UI
Launch the interactive test UI:

```bash
npm run test:ui
```

## Continuous Integration

Tests are automatically run on every push and pull request via GitHub Actions. The CI workflow:

1. Installs dependencies
2. Runs unit tests
3. Runs integration tests
4. Generates coverage report
5. Uploads coverage to Codecov (if configured)

## Troubleshooting

### Tests are slow
- Use `test.concurrent()` for independent tests
- Mock heavy operations
- Use `beforeAll()` instead of `beforeEach()` when possible

### Tests are flaky
- Add proper wait conditions
- Avoid hard-coded timeouts
- Ensure proper cleanup in `afterEach()`

### Coverage is too low
- Identify uncovered code with `npm run test:coverage`
- Add tests for critical paths first
- Consider edge cases and error scenarios

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [MSW (Mock Service Worker)](https://mswjs.io/)

## Contributing

When adding new features:
1. Write tests first (TDD approach recommended)
2. Ensure all tests pass locally
3. Maintain or improve code coverage
4. Follow existing test patterns and conventions
5. Update this README if adding new test categories or utilities

## Questions?

For questions about testing or to report issues with tests, please contact the development team or create an issue in the repository.
