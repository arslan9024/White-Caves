/**
 * Test Utilities & Helpers
 * Common utilities for async testing, DOM queries, Redux helpers, etc.
 */

import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { vi } from 'vitest';

/**
 * Wait for async operations with timeout
 */
export async function waitForAsync(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Flush all pending promises
 */
export async function flushPromises() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

/**
 * Wait for condition with timeout
 */
export async function waitFor(
  condition: () => boolean,
  options: { timeout?: number; interval?: number } = {}
) {
  const { timeout = 5000, interval = 50 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (condition()) {
      return true;
    }
    await waitForAsync(interval);
  }

  throw new Error(`Timeout waiting for condition after ${timeout}ms`);
}

/**
 * Mock date for consistent testing
 */
export function mockDate(date = new Date('2024-01-01')) {
  vi.useFakeTimers();
  vi.setSystemTime(date);
  return () => vi.useRealTimers();
}

/**
 * Create mock function with call tracking
 */
export function createSpyFunction<T extends (...args: unknown[]) => unknown>(
  implementation?: T
) {
  const fn = vi.fn(implementation);
  return {
    fn,
    calls: () => fn.mock.calls,
    callCount: () => fn.mock.calls.length,
    lastCall: () => fn.mock.calls[fn.mock.calls.length - 1],
    args: () => fn.mock.calls.map((call) => call[0]),
    wasCalled: () => fn.mock.calls.length > 0,
    wasCalledWith: (...args: unknown[]) =>
      fn.mock.calls.some((call) => JSON.stringify(call) === JSON.stringify(args)),
    reset: () => fn.mockClear(),
  };
}

/**
 * Render component with Redux store
 */
export function renderWithRedux(
  component: ReactElement,
  { store, ...renderOptions }: { store?: Record<string, unknown> } & Omit<RenderOptions, 'wrapper'> = {}
) {
  const mockStore =
    store ||
    {
      getState: vi.fn(),
      dispatch: vi.fn(),
      subscribe: vi.fn(),
    };

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={mockStore}>{children}</Provider>
  );

  return {
    ...rtlRender(component, { wrapper: Wrapper, ...renderOptions }),
    store: mockStore,
  };
}

/**
 * Render component with router
 */
export function renderWithRouter(
  component: ReactElement,
  { initialRoute = '/', ...renderOptions } = {}
) {
  window.history.pushState({}, 'Test page', initialRoute);

  return rtlRender(component, renderOptions);
}

/**
 * Render with all providers
 */
export function renderWithProviders(
  component: ReactElement,
  { store, ...renderOptions }: { store?: Record<string, unknown> } & Omit<RenderOptions, 'wrapper'> = {}
) {
  const mockStore =
    store ||
    {
      getState: vi.fn(),
      dispatch: vi.fn(),
      subscribe: vi.fn(),
    };

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={mockStore}>{children}</Provider>
  );

  return {
    ...rtlRender(component, { wrapper: Wrapper, ...renderOptions }),
    store: mockStore,
  };
}

/**
 * Get Redux state
 */
export function getReduxState(store: any) {
  return store?.getState?.() || {};
}

/**
 * Dispatch Redux action
 */
export function dispatchAction(store: any, action: any) {
  return store?.dispatch(action);
}

/**
 * Select from Redux store
 */
export function selectFromStore(store: any, selector: (state: any) => any) {
  const state = getReduxState(store);
  return selector(state);
}

/**
 * Create test props object
 */
export function createTestProps(overrides = {}) {
  return {
    ...overrides,
  };
}

/**
 * Wait for element to appear in DOM
 */
export async function waitForElement(
  selector: string,
  options: { timeout?: number } = {}
) {
  const { timeout = 5000 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector);
    if (element) {
      return element;
    }
    await waitForAsync(50);
  }

  throw new Error(`Element with selector "${selector}" not found after ${timeout}ms`);
}

/**
 * Wait for loading to disappear
 */
export async function waitForLoadingToFinish(options: { timeout?: number } = {}) {
  const { timeout = 5000 } = options;

  return waitFor(
    () => {
      const loadingElements = document.querySelectorAll(
        '[role="progressbar"], .loading, .spinner'
      );
      return loadingElements.length === 0;
    },
    { timeout }
  );
}

/**
 * Setup test data context
 */
export function createTestContext(initialData = {}) {
  return {
    data: initialData,
    update: vi.fn((data) => ({ ...initialData, ...data })),
    reset: vi.fn(() => initialData),
  };
}

/**
 * Create test error
 */
export function createTestError(
  message = 'Test error',
  statusCode = 500,
  details = {}
) {
  const error: any = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

/**
 * Assert function was called with arguments
 */
export function assertCalledWith(fn: any, expectedArgs: any[]) {
  const calls = fn.mock.calls;
  const found = calls.some((call: unknown[]) =>
    JSON.stringify(call) === JSON.stringify(expectedArgs)
  );

  if (!found) {
    throw new Error(
      `Function was not called with expected arguments.\n` +
      `Expected: ${JSON.stringify(expectedArgs)}\n` +
      `Actual calls: ${JSON.stringify(calls)}`
    );
  }
}

/**
 * Mock console methods to prevent noise in tests
 */
export function mockConsole(methods = ['log', 'warn', 'error']) {
  const mocks: any = {};

  methods.forEach((method) => {
    mocks[method] = vi.spyOn(console, method as any).mockImplementation(() => {});
  });

  return {
    mocks,
    restore: () => Object.values(mocks).forEach((m: any) => m.mockRestore()),
  };
}

/**
 * Create test file
 */
export function createTestFile(
  content = 'test content',
  name = 'test.txt',
  type = 'text/plain'
) {
  return new File([content], name, { type });
}

/**
 * Create test FormData
 */
export function createTestFormData(data: Record<string, any> = {}) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => formData.append(`${key}[${i}]`, v));
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
}
