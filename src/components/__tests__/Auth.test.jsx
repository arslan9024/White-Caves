import { describe, it, expect } from 'vitest';
import { getAuthToken, setAuthToken, removeAuthToken } from '../Auth';

describe('Auth Utilities', () => {
  it('manages auth tokens in local storage correctly', () => {
    setAuthToken('test-jwt-token-123');
    expect(getAuthToken()).toBe('test-jwt-token-123');
    removeAuthToken();
    expect(getAuthToken()).toBeNull();
  });
});
