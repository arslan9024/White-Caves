import '@testing-library/jest-dom';
import { vi } from 'vitest';
import * as reselect from 'reselect';

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

vi.mock('../config/firebase', () => ({
  auth: null,
  signInWithGoogle: vi.fn(),
  signInWithFacebook: vi.fn(),
  signInWithApple: vi.fn(),
  signInWithEmail: vi.fn(),
  signUpWithEmail: vi.fn(),
  signInWithPhone: vi.fn(),
  signOut: vi.fn(),
  createRecaptchaVerifier: vi.fn(),
}));

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Silence reselect dev-mode diagnostics in tests.
// These checks are useful during selector authoring, but create noisy output
// in broad CI runs where selectors are intentionally identity-based.
if ('setGlobalDevModeChecks' in reselect) {
  (
    reselect as unknown as {
      setGlobalDevModeChecks: (config: {
        inputStabilityCheck?: 'always' | 'once' | 'never';
        identityFunctionCheck?: 'always' | 'once' | 'never';
      }) => void;
    }
  ).setGlobalDevModeChecks({
    inputStabilityCheck: 'never',
    identityFunctionCheck: 'never',
  });
}
