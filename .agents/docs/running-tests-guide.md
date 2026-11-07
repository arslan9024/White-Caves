# Running All Tests - Complete Guide

## Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Test Categories

### 1. Unit Tests (Jest)

Run unit tests for hooks, utilities, and services:

```bash
# Run all unit tests
npm test

# Run specific test file
npm test useWhatsAppIntegration

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

**Test Files**:

- `src/__tests__/hooks/*.test.ts`
- `src/__tests__/services/*.test.ts`
- `src/__tests__/utils/*.test.ts`

### 2. Component Tests (React Testing Library)

Component tests ensure UI components render correctly and handle interactions:

```bash
# Run component tests
npm test -- src/__tests__/components

# Run specific component test
npm test AccountLink

# Watch mode
npm run test:watch
```

**Test Files**:

- `src/__tests__/components/*.test.tsx`

### 3. API Tests (Jest with Axios)

Integration tests for API endpoints:

```bash
# Run API tests
npm run test:api

# Ensure API server is running on port 3000
npm run server
```

**Test Files**:

- `src/__tests__/api/*.test.ts`

### 4. End-to-End Tests (Playwright)

Full user journey tests:

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run in headed mode (visible browser)
npm run test:e2e:headed

# Debug mode (step through tests)
npm run test:e2e:debug

# Run specific test file
npx playwright test whatsapp-dashboard.spec.ts

# Run tests matching pattern
npx playwright test --grep "Account"
```

**Requirements**:

- Development server must be running: `npm run dev` or `npm run dev:all`
- Server must be on `http://localhost:5173`

## Complete Testing Workflow

### Local Development Testing

```bash
# Terminal 1: Start development servers
npm run dev:all

# Terminal 2: Run tests in watch mode
npm run test:watch

# Terminal 3 (Optional): View test UI
npm run test:ui
```

### Pre-Commit Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run all tests
npm test

# Run specific test categories
npm run test:api
npm run test:e2e
```

### CI/CD Pipeline Testing

The GitHub Actions pipeline automatically runs:

1. **Code Quality** - ESLint, TypeScript check
2. **Unit Tests** - Full test suite with coverage
3. **E2E Tests** - Playwright tests
4. **Build** - Vite build

View pipeline results in GitHub Actions tab.

## Test Coverage

### Target Coverage

- **Overall**: 80%+
- **Components**: 85%+
- **Hooks**: 90%+
- **Services**: 85%+
- **API Routes**: 80%+

### Check Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open coverage report
# Coverage report is in: coverage/index.html

# View in terminal
npm run test:coverage -- --reporter=text
```

### Improve Coverage

1. Identify untested code: Check `coverage/` directory
2. Write tests for uncovered lines
3. Focus on critical paths first
4. Use `npm run test:coverage` to verify improvement

## Debugging Tests

### Unit/Component Tests

```bash
# Debug in Node inspector
node --inspect-brk node_modules/vitest/vitest.mjs run --inspect-brk

# Or use VS Code debugger with launch.json:
{
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["run"],
  "console": "integratedTerminal"
}
```

### E2E Tests

```bash
# Debug mode - opens Playwright Inspector
npm run test:e2e:debug

# Headed mode - visible browser
npm run test:e2e:headed

# Trace mode - record test execution
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

## Docker Testing

### Run Tests in Docker

```bash
# Run tests in development Docker container
npm run docker:test

# Or manually
docker-compose -f docker-compose.dev.yml run app npm test

# Run specific tests
docker-compose -f docker-compose.dev.yml run app npm test -- --grep "Account"
```

### Run Services for API Testing

```bash
# Start all services (MongoDB, Redis, API, Frontend)
npm run docker:dev:build

# Run API tests
npm run test:api

# Stop services
npm run docker:down
```

## Troubleshooting

### Tests Won't Run

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear vitest cache
npm test -- --clearCache

# Restart dev server
npm run dev:all
```

### E2E Tests Fail

```bash
# Ensure dev server is running
npm run dev

# Update Playwright browsers
npx playwright install

# Run with more verbose output
npm run test:e2e -- --verbose

# Run single test
npx playwright test whatsapp-dashboard.spec.ts:50
```

### Memory Issues

```bash
# Run tests with more memory
node --max-old-space-size=4096 node_modules/vitest/vitest.mjs run

# Run E2E tests serially (slower but less memory)
npx playwright test --workers=1
```

### Timeout Issues

```bash
# Increase timeout in vitest.config.js
test: {
  testTimeout: 30000 // 30 seconds
}

# Or for E2E tests
npx playwright test --timeout=30000
```

## Test Reports

### Generate Reports

```bash
# HTML Coverage Report
npm run test:coverage

# JUnit XML Report (for CI/CD)
npm test -- --reporter=junit --outputFile=test-results.xml

# JSON Report
npm test -- --reporter=json --outputFile=test-results.json

# Playwright HTML Report
npx playwright test --reporter=html
npx playwright show-report
```

### View Reports

- **Coverage**: `coverage/index.html`
- **Playwright**: `playwright-report/index.html`

## Performance Testing

### Profile Tests

```bash
# Run tests with profiler
npm test -- --reporter=verbose

# Run with timing information
npm test -- --reporter=verbose --run
```

### Benchmark Critical Paths

```bash
# Add to test file
import { bench } from 'vitest'

bench('useWhatsAppIntegration initialization', () => {
  // benchmark code
})

# Run benchmarks
npm test -- --bench
```

## Continuous Testing

### Watch Mode Configuration

```bash
# Run only changed tests
npm run test:watch

# Run all tests on file change
npm run test:watch -- --run

# Run with UI
npm run test:ui
```

### Test File Changes Only

```bash
# Vitest watches automatically
npm run test:watch

# Run only tests matching pattern
npm run test:watch -- --grep="WhatsApp"
```

## Integration with IDE

### VS Code Setup

**Install Extensions**:

- Vitest (vitest.explorer)
- Playwright Test for VSCode
- ES7+ React/Redux/React-Native snippets

**.vscode/launch.json**:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Vitest",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "test:watch"],
      "console": "integratedTerminal"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Playwright",
      "runtimeExecutable": "npx",
      "runtimeArgs": ["playwright", "test", "--debug"],
      "console": "integratedTerminal"
    }
  ]
}
```

## Best Practices

1. **Write tests first** - TDD approach
2. **Keep tests isolated** - No shared state
3. **Use meaningful names** - `describe` and `it` should be clear
4. **Mock external dependencies** - Don't call real APIs
5. **Test user behavior** - Not implementation details
6. **Maintain fast tests** - Unit tests < 100ms
7. **Keep coverage high** - Aim for 80%+
8. **Review coverage reports** - Focus on critical paths

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
