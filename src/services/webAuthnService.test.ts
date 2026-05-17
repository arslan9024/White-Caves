/**
 * webAuthnService — Comprehensive Tests
 * Tests for WebAuthn/biometric authentication: support detection, base64url encoding,
 * credential storage, session management, registration & authentication flows
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock safeStorage before importing the module
// Use vi.hoisted to allow referencing in vi.mock factory
const { mockSafeStorage } = vi.hoisted(() => ({
  mockSafeStorage: {
    get: vi.fn(),
    getJSON: vi.fn(),
    setJSON: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock('../utils/safeStorage', () => ({
  safeStorage: mockSafeStorage,
}));

vi.mock('../utils/logger', () => ({
  createLogger: () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() }),
}));

// Import after mocks
import {
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
  hasBiometricCredentials,
  getBiometricCredentials,
  saveBiometricSession,
  getBiometricSession,
  clearBiometricSession,
  removeCredential,
  registerBiometric,
  authenticateWithBiometric,
} from './webAuthnService';

// ─── Helpers ────────────────────────────────────────────────────────────

function setupWebAuthnSupport(supported = true, platformAuthAvailable = true) {
  if (supported) {
    Object.defineProperty(window, 'PublicKeyCredential', {
      value: Object.assign(function () {}, {
        isUserVerifyingPlatformAuthenticatorAvailable: vi
          .fn()
          .mockResolvedValue(platformAuthAvailable),
      }),
      writable: true,
      configurable: true,
    });
  } else {
    Object.defineProperty(window, 'PublicKeyCredential', {
      value: undefined,
      writable: true,
      configurable: true,
    });
  }
}

function removeWebAuthnSupport() {
  Object.defineProperty(window, 'PublicKeyCredential', {
    value: undefined,
    writable: true,
    configurable: true,
  });
}

// ─── Tests ──────────────────────────────────────────────────────────────

describe('webAuthnService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSafeStorage.get.mockReturnValue(null);
    mockSafeStorage.getJSON.mockReturnValue([]);
  });

  afterEach(() => {
    removeWebAuthnSupport();
  });

  // ═══ SUPPORT DETECTION ════════════════════════════════════════════════

  describe('isWebAuthnSupported', () => {
    it('returns true when PublicKeyCredential is available', () => {
      setupWebAuthnSupport(true);
      expect(isWebAuthnSupported()).toBe(true);
    });

    it('returns false when PublicKeyCredential is unavailable', () => {
      removeWebAuthnSupport();
      expect(isWebAuthnSupported()).toBe(false);
    });
  });

  describe('isPlatformAuthenticatorAvailable', () => {
    it('returns true when platform authenticator is available', async () => {
      setupWebAuthnSupport(true, true);
      expect(await isPlatformAuthenticatorAvailable()).toBe(true);
    });

    it('returns false when platform authenticator is unavailable', async () => {
      setupWebAuthnSupport(true, false);
      expect(await isPlatformAuthenticatorAvailable()).toBe(false);
    });

    it('returns false when WebAuthn is not supported', async () => {
      removeWebAuthnSupport();
      expect(await isPlatformAuthenticatorAvailable()).toBe(false);
    });

    it('returns false on exception', async () => {
      Object.defineProperty(window, 'PublicKeyCredential', {
        value: Object.assign(function () {}, {
          isUserVerifyingPlatformAuthenticatorAvailable: vi
            .fn()
            .mockRejectedValue(new Error('Fail')),
        }),
        writable: true,
        configurable: true,
      });
      expect(await isPlatformAuthenticatorAvailable()).toBe(false);
    });
  });

  // ═══ CREDENTIAL STORAGE ═══════════════════════════════════════════════

  describe('hasBiometricCredentials', () => {
    it('returns false when no credentials are stored', () => {
      mockSafeStorage.getJSON.mockReturnValue([]);
      expect(hasBiometricCredentials()).toBe(false);
    });

    it('returns true when credentials exist', () => {
      mockSafeStorage.getJSON.mockReturnValue([
        { id: 'cred1', rawId: 'raw1', userId: 'u1', createdAt: '2026-01-01', lastUsed: null },
      ]);
      expect(hasBiometricCredentials()).toBe(true);
    });

    it('returns false when getJSON returns null', () => {
      mockSafeStorage.getJSON.mockReturnValue(null);
      expect(hasBiometricCredentials()).toBe(false);
    });
  });

  describe('getBiometricCredentials', () => {
    it('returns stored credentials', () => {
      const creds = [
        { id: 'cred1', rawId: 'raw1', userId: 'u1', createdAt: '2026-01-01', lastUsed: null },
        {
          id: 'cred2',
          rawId: 'raw2',
          userId: 'u2',
          createdAt: '2026-02-01',
          lastUsed: '2026-02-15',
        },
      ];
      mockSafeStorage.getJSON.mockReturnValue(creds);
      expect(getBiometricCredentials()).toEqual(creds);
    });

    it('returns empty array when nothing is stored', () => {
      mockSafeStorage.getJSON.mockReturnValue([]);
      expect(getBiometricCredentials()).toEqual([]);
    });
  });

  describe('removeCredential', () => {
    it('removes credential from local storage and calls server', async () => {
      const creds = [
        { id: 'cred1', rawId: 'raw1', userId: 'u1', createdAt: '2026-01-01', lastUsed: null },
        { id: 'cred2', rawId: 'raw2', userId: 'u1', createdAt: '2026-02-01', lastUsed: null },
      ];
      mockSafeStorage.getJSON.mockReturnValue(creds);

      const mockFetch = vi.fn().mockResolvedValue({ ok: true });
      vi.stubGlobal('fetch', mockFetch);

      await removeCredential('cred1', 'u1');

      // Should save only the remaining credential
      expect(mockSafeStorage.setJSON).toHaveBeenCalledWith('webauthn_credentials', [
        { id: 'cred2', rawId: 'raw2', userId: 'u1', createdAt: '2026-02-01', lastUsed: null },
      ]);

      // Should call DELETE endpoint
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/webauthn/credentials/'),
        expect.objectContaining({ method: 'DELETE' })
      );

      vi.unstubAllGlobals();
    });

    it('still saves locally when server call fails', async () => {
      mockSafeStorage.getJSON.mockReturnValue([
        { id: 'cred1', rawId: 'raw1', userId: 'u1', createdAt: '2026-01-01', lastUsed: null },
      ]);

      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      vi.stubGlobal('fetch', mockFetch);

      await removeCredential('cred1', 'u1');

      expect(mockSafeStorage.setJSON).toHaveBeenCalledWith('webauthn_credentials', []);
      vi.unstubAllGlobals();
    });
  });

  // ═══ SESSION MANAGEMENT ═══════════════════════════════════════════════

  describe('saveBiometricSession', () => {
    it('stores user data and token in safeStorage', () => {
      const userData = { id: 'user1', email: 'test@test.com', name: 'Test User' };
      saveBiometricSession(userData, 'test-jwt-token');

      expect(mockSafeStorage.setJSON).toHaveBeenCalledWith(
        'biometric_session',
        expect.objectContaining({
          user: userData,
          token: 'test-jwt-token',
          savedAt: expect.any(String),
        })
      );
    });
  });

  describe('getBiometricSession', () => {
    it('returns session from storage', () => {
      const session = {
        user: { id: 'user1', email: 'test@test.com' },
        token: 'jwt-token',
        savedAt: '2026-01-01T00:00:00.000Z',
      };
      mockSafeStorage.getJSON.mockReturnValue(session);
      expect(getBiometricSession()).toEqual(session);
    });

    it('returns null when no session exists', () => {
      mockSafeStorage.getJSON.mockReturnValue(null);
      expect(getBiometricSession()).toBeNull();
    });

    it('returns null when getJSON returns undefined', () => {
      mockSafeStorage.getJSON.mockReturnValue(undefined);
      expect(getBiometricSession()).toBeNull();
    });
  });

  describe('clearBiometricSession', () => {
    it('removes the biometric_session key', () => {
      clearBiometricSession();
      expect(mockSafeStorage.remove).toHaveBeenCalledWith('biometric_session');
    });
  });

  // ═══ REGISTRATION ════════════════════════════════════════════════════

  describe('registerBiometric', () => {
    it('throws when platform authenticator is not available', async () => {
      removeWebAuthnSupport();
      await expect(registerBiometric('user1', 'user@test.com', 'Test User')).rejects.toThrow(
        'Biometric authentication is not available on this device'
      );
    });

    it('throws on failed options response', async () => {
      setupWebAuthnSupport(true, true);
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
        })
      );

      await expect(registerBiometric('user1', 'user@test.com', 'Test User')).rejects.toThrow(
        'Server error (500) — please try again later'
      );

      vi.unstubAllGlobals();
    });

    it('throws on invalid JSON response', async () => {
      setupWebAuthnSupport(true, true);
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
        })
      );

      await expect(registerBiometric('user1', 'user@test.com', 'Test User')).rejects.toThrow(
        'Server returned invalid JSON for registration options'
      );

      vi.unstubAllGlobals();
    });

    it('throws when server returns success: false', async () => {
      setupWebAuthnSupport(true, true);
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({ success: false, message: 'Server busy' }),
        })
      );

      await expect(registerBiometric('user1', 'user@test.com', 'Test User')).rejects.toThrow(
        'Server busy'
      );

      vi.unstubAllGlobals();
    });

    it('throws when server returns no options', async () => {
      setupWebAuthnSupport(true, true);
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({ success: true }),
        })
      );

      await expect(registerBiometric('user1', 'user@test.com', 'Test User')).rejects.toThrow(
        'Server returned no registration options'
      );

      vi.unstubAllGlobals();
    });
  });

  // ═══ AUTHENTICATION ═══════════════════════════════════════════════════

  describe('authenticateWithBiometric', () => {
    it('throws when platform authenticator is not available', async () => {
      removeWebAuthnSupport();
      await expect(authenticateWithBiometric('user1')).rejects.toThrow(
        'Biometric authentication is not available on this device'
      );
    });

    it('throws when no credentials are registered', async () => {
      setupWebAuthnSupport(true, true);
      mockSafeStorage.getJSON.mockReturnValue([]);

      await expect(authenticateWithBiometric('user1')).rejects.toThrow(
        'No biometric credentials registered'
      );
    });

    it('throws on failed authentication options response', async () => {
      setupWebAuthnSupport(true, true);
      mockSafeStorage.getJSON.mockReturnValue([
        { id: 'cred1', rawId: 'raw1', userId: 'u1', createdAt: '2026-01-01', lastUsed: null },
      ]);

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 403,
        })
      );

      await expect(authenticateWithBiometric('user1')).rejects.toThrow(
        'Access denied — insufficient permissions'
      );

      vi.unstubAllGlobals();
    });

    it('throws on invalid JSON from authentication options', async () => {
      setupWebAuthnSupport(true, true);
      mockSafeStorage.getJSON.mockReturnValue([
        { id: 'cred1', rawId: 'raw1', userId: 'u1', createdAt: '2026-01-01', lastUsed: null },
      ]);

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockRejectedValue(new Error('Parse error')),
        })
      );

      await expect(authenticateWithBiometric('user1')).rejects.toThrow(
        'Server returned invalid JSON for authentication options'
      );

      vi.unstubAllGlobals();
    });

    it('throws when authentication options returns success: false', async () => {
      setupWebAuthnSupport(true, true);
      mockSafeStorage.getJSON.mockReturnValue([
        { id: 'cred1', rawId: 'raw1', userId: 'u1', createdAt: '2026-01-01', lastUsed: null },
      ]);

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({ success: false, message: 'Not allowed' }),
        })
      );

      await expect(authenticateWithBiometric('user1')).rejects.toThrow('Not allowed');

      vi.unstubAllGlobals();
    });

    it('handles null userId parameter', async () => {
      setupWebAuthnSupport(true, true);
      mockSafeStorage.getJSON.mockReturnValue([
        { id: 'cred1', rawId: 'raw1', userId: 'u1', createdAt: '2026-01-01', lastUsed: null },
      ]);

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({ success: false, message: 'Auth failed' }),
        })
      );

      await expect(authenticateWithBiometric(null)).rejects.toThrow('Auth failed');

      vi.unstubAllGlobals();
    });
  });

  // ═══ EDGE CASES ═══════════════════════════════════════════════════════

  describe('edge cases', () => {
    it('getJSON returning null falls back to empty array for credentials', () => {
      mockSafeStorage.getJSON.mockReturnValue(null);
      expect(hasBiometricCredentials()).toBe(false);
    });

    it('session with extra user fields is preserved', () => {
      const userData = { id: 'u1', email: 'a@b.com', name: 'Test', customField: 42 };
      saveBiometricSession(userData, 'token');
      expect(mockSafeStorage.setJSON).toHaveBeenCalledWith(
        'biometric_session',
        expect.objectContaining({ user: userData })
      );
    });
  });
});
