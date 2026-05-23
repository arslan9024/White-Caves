/**
 * Test Mock Helpers
 * Centralized mocking setup for API, Redux, localStorage, etc.
 */

import { vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

/**
 * Mock localStorage with in-memory storage
 */
export function setupMockStorage() {
  const store = new Map();

  const mockStorage = {
    getItem: vi.fn((key) => store.get(key) || null),
    setItem: vi.fn((key, value) => store.set(key, String(value))),
    removeItem: vi.fn((key) => store.delete(key)),
    clear: vi.fn(() => store.clear()),
    key: vi.fn((index) => {
      const keys = Array.from(store.keys());
      return keys[index] || null;
    }),
    get length() {
      return store.size;
    },
  };

  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
    writable: true,
  });

  return mockStorage;
}

/**
 * Mock sessionStorage similarly
 */
export function setupMockSessionStorage() {
  const store = new Map();

  const mockStorage = {
    getItem: vi.fn((key) => store.get(key) || null),
    setItem: vi.fn((key, value) => store.set(key, String(value))),
    removeItem: vi.fn((key) => store.delete(key)),
    clear: vi.fn(() => store.clear()),
    key: vi.fn((index) => {
      const keys = Array.from(store.keys());
      return keys[index] || null;
    }),
    get length() {
      return store.size;
    },
  };

  Object.defineProperty(window, 'sessionStorage', {
    value: mockStorage,
    writable: true,
  });

  return mockStorage;
}

/**
 * Mock fetch API
 */
export function setupMockFetch() {
  const mockFetch = vi.fn();

  mockFetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => ({ success: true }),
  });

  global.fetch = mockFetch;
  return mockFetch;
}

/**
 * Create mock API response
 */
export function createMockResponse(data: unknown, options: { ok?: boolean; status?: number; statusText?: string; headers?: Record<string, string> } = {}): Response {
  const response: Partial<Response> = {
    ok: options.ok !== false,
    status: options.status || 200,
    statusText: options.statusText || 'OK',
    headers: new Headers(options.headers || {}),
    json: vi.fn().mockResolvedValue(data),
    text: vi.fn().mockResolvedValue(JSON.stringify(data)),
    blob: vi.fn().mockResolvedValue(new Blob([JSON.stringify(data)])),
    clone: vi.fn(() => createMockResponse(data, options)),
  };
  return response as Response;
}

/**
 * Mock axios/HTTP client
 */
export function setupMockApiClient() {
  return {
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    patch: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
    request: vi.fn().mockResolvedValue({ data: {} }),
  };
}

/**
 * Create mock Redux store with optional preloaded state
 */
export function createMockStore(reducers = {}, preloadedState = {}) {
  return configureStore({
    reducer: reducers,
    preloadedState,
  });
}

/**
 * Mock router with navigation
 */
export function setupMockRouter() {
  const navigate = vi.fn();
  const location = {
    pathname: '/',
    search: '',
    hash: '',
    state: null,
  };

  return {
    navigate,
    location,
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  };
}

/**
 * Mock window.matchMedia (for responsive design tests)
 */
export function setupMockMatchMedia(matches = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

/**
 * Mock IntersectionObserver
 */
export function setupMockIntersectionObserver() {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() {
      return [];
    }
    unobserve() {}
  } as any;
}

/**
 * Mock Firebase service
 */
export function setupMockFirebase() {
  return {
    auth: {
      currentUser: null,
      signInWithEmail: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChanged: vi.fn(),
    },
    firestore: {
      collection: vi.fn(),
      doc: vi.fn(),
      getDoc: vi.fn(),
      setDoc: vi.fn(),
      updateDoc: vi.fn(),
      deleteDoc: vi.fn(),
    },
    storage: {
      ref: vi.fn(),
      uploadBytes: vi.fn(),
      getDownloadURL: vi.fn(),
    },
  };
}

/**
 * Setup all common mocks for unit tests
 */
export function setupAllMocks() {
  setupMockStorage();
  setupMockSessionStorage();
  setupMockFetch();
  setupMockMatchMedia();
  setupMockIntersectionObserver();

  return {
    storage: window.localStorage,
    sessionStorage: window.sessionStorage,
    fetch: global.fetch,
  };
}
