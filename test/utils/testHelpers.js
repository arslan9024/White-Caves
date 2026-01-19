import React from 'react';
import { render as rtlRender, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Custom render function that wraps components with necessary providers
 * Useful for testing components that depend on context, routing, or other providers
 */
export function render(ui, options = {}) {
  return rtlRender(ui, { ...options });
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
export { screen, waitFor, userEvent };

/**
 * Helper function to wait for async operations
 */
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Mock fetch function with JSON response
 */
export const mockFetch = (data, status = 200) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    })
  );
};

/**
 * Create mock file for upload testing
 */
export const createMockFile = (content = '', fileName = 'test.xlsx', type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') => {
  const blob = new Blob([content], { type });
  blob.name = fileName;
  return blob;
};

/**
 * Create mock FormData with file
 */
export const createMockFormData = (file, fieldName = 'file') => {
  const formData = new FormData();
  formData.append(fieldName, file);
  return formData;
};

/**
 * Wait for element to appear with custom timeout
 */
export const waitForElement = async (callback, timeout = 3000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      return callback();
    } catch (error) {
      await waitForAsync();
    }
  }
  throw new Error('Element not found within timeout');
};

/**
 * Mock localStorage
 */
export const setupLocalStorageMock = () => {
  const store = {};
  global.localStorage = {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => {
        delete store[key];
      });
    }),
  };
};

/**
 * Reset all mocks
 */
export const resetAllMocks = () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
};
