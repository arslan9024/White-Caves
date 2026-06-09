import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach } from 'vitest';

// jsdom environments can vary across runners; ensure matchMedia exists.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

let localStorageState = {};

const localStorageMock = {
  getItem: vi.fn(key => (key in localStorageState ? localStorageState[key] : null)),
  setItem: vi.fn((key, value) => {
    localStorageState[key] = String(value);
  }),
  removeItem: vi.fn(key => {
    delete localStorageState[key];
  }),
  clear: vi.fn(() => {
    localStorageState = {};
  }),
  key: vi.fn(index => Object.keys(localStorageState)[index] ?? null),
  get length() {
    return Object.keys(localStorageState).length;
  },
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  localStorageMock.clear();
});
