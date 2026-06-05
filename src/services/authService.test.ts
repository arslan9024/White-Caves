import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  restoreAuthToken,
  loginWithEmail,
  registerWithEmail,
  syncFirebaseUser,
  fetchProfile,
  changePassword,
  logout,
} from './authService';
import { HttpError } from '../utils/HttpError';

// ── Mocks ───────────────────────────────────────────────────────────────
vi.mock('../utils/apiClient', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    setAuthToken: vi.fn(),
  },
}));

vi.mock('../utils/safeStorage', () => ({
  safeStorage: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock('../utils/authFetch', () => ({
  authFetch: vi.fn().mockResolvedValue({ ok: true }),
}));

import { apiClient } from '../utils/apiClient';
import { safeStorage } from '../utils/safeStorage';
import { authFetch } from '../utils/authFetch';

const mApiPost = apiClient.post as ReturnType<typeof vi.fn>;
const mApiGet = apiClient.get as ReturnType<typeof vi.fn>;
const mApiSetToken = apiClient.setAuthToken as ReturnType<typeof vi.fn>;
const mStorageGet = safeStorage.get as ReturnType<typeof vi.fn>;
const mStorageSet = safeStorage.set as ReturnType<typeof vi.fn>;
const mStorageRemove = safeStorage.remove as ReturnType<typeof vi.fn>;
const mAuthFetch = authFetch as ReturnType<typeof vi.fn>;

const testUser = {
  id: 'u1',
  email: 'a@b.com',
  name: 'Test',
  role: 'buyer',
};

// ═══════════════════════════════════════════════════════════════════════
describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mAuthFetch.mockResolvedValue({ ok: true });
  });

  // ── restoreAuthToken ──────────────────────────────────────────────
  describe('restoreAuthToken', () => {
    it('returns token from storage and sets it on apiClient', () => {
      mStorageGet.mockReturnValue('jwt-123');
      const result = restoreAuthToken();
      expect(result).toBe('jwt-123');
      expect(mApiSetToken).toHaveBeenCalledWith('jwt-123');
    });

    it('returns null when no token in storage', () => {
      mStorageGet.mockReturnValue(null);
      const result = restoreAuthToken();
      expect(result).toBeNull();
      expect(mApiSetToken).not.toHaveBeenCalled();
    });
  });

  // ── loginWithEmail ────────────────────────────────────────────────
  describe('loginWithEmail', () => {
    it('calls apiClient.post with credentials', async () => {
      mApiPost.mockResolvedValue({
        success: true,
        data: { token: 'tok-1', user: testUser },
      });
      await loginWithEmail('a@b.com', 'pass');
      expect(mApiPost).toHaveBeenCalledWith('/auth/login', {
        email: 'a@b.com',
        password: 'pass',
      });
    });

    it('persists token on success', async () => {
      mApiPost.mockResolvedValue({
        success: true,
        data: { token: 'tok-1', user: testUser },
      });
      await loginWithEmail('a@b.com', 'pass');
      expect(mStorageSet).toHaveBeenCalledWith('token', 'tok-1');
      expect(mApiSetToken).toHaveBeenCalledWith('tok-1');
    });

    it('returns the response', async () => {
      const resp = {
        success: true,
        data: { token: 'tok-1', user: testUser },
      };
      mApiPost.mockResolvedValue(resp);
      const result = await loginWithEmail('a@b.com', 'pass');
      expect(result).toEqual(resp);
    });

    it('does NOT persist token when success=false', async () => {
      mApiPost.mockResolvedValue({ success: false, data: null });
      await loginWithEmail('a@b.com', 'bad');
      expect(mStorageSet).not.toHaveBeenCalled();
    });

    it('throws when success=true but no token', async () => {
      mApiPost.mockResolvedValue({ success: true, data: {} });
      await expect(loginWithEmail('a@b.com', 'pass')).rejects.toThrow(/no authentication token/i);
    });

    it('propagates API errors', async () => {
      mApiPost.mockRejectedValue(new Error('Network'));
      await expect(loginWithEmail('a@b.com', 'pass')).rejects.toThrow('Network');
    });
  });

  // ── registerWithEmail ─────────────────────────────────────────────
  describe('registerWithEmail', () => {
    it('sends all fields to API', async () => {
      mApiPost.mockResolvedValue({
        success: true,
        data: { token: 'tok-2', user: testUser },
      });
      await registerWithEmail('a@b.com', 'pass', 'Name', '+971', 'Sales');
      expect(mApiPost).toHaveBeenCalledWith('/auth/register', {
        email: 'a@b.com',
        password: 'pass',
        name: 'Name',
        phone: '+971',
        department: 'Sales',
        category: undefined,
        role: undefined,
      });
    });

    it('persists token on success', async () => {
      mApiPost.mockResolvedValue({
        success: true,
        data: { token: 'tok-2', user: testUser },
      });
      await registerWithEmail('a@b.com', 'pass');
      expect(mStorageSet).toHaveBeenCalledWith('token', 'tok-2');
    });

    it('sends category and role when provided', async () => {
      mApiPost.mockResolvedValue({
        success: true,
        data: { token: 'tok-2', user: testUser },
      });

      await registerWithEmail(
        'landlord@test.com',
        'pass1234',
        'Landlord',
        undefined,
        undefined,
        'client',
        'landlord'
      );

      expect(mApiPost).toHaveBeenCalledWith('/auth/register', {
        email: 'landlord@test.com',
        password: 'pass1234',
        name: 'Landlord',
        phone: undefined,
        department: undefined,
        category: 'client',
        role: 'landlord',
      });
    });

    it('throws when success=true but no token', async () => {
      mApiPost.mockResolvedValue({ success: true, data: {} });
      await expect(registerWithEmail('a@b.com', 'pass')).rejects.toThrow(
        /no authentication token/i
      );
    });
  });

  // ── syncFirebaseUser ──────────────────────────────────────────────
  describe('syncFirebaseUser', () => {
    const fbUser = {
      uid: 'fb-1',
      email: 'fb@x.com',
      displayName: 'FB User',
      photoURL: 'http://pic.com/a.jpg',
      getIdToken: vi.fn().mockResolvedValue('firebase-id-token-1'),
    };

    beforeEach(() => {
      fbUser.getIdToken.mockResolvedValue('firebase-id-token-1');
    });

    it('maps firebase fields to API fields', async () => {
      mApiPost.mockResolvedValue({
        success: true,
        data: { token: 'tok-3', user: testUser },
      });
      await syncFirebaseUser(fbUser);
      expect(mApiPost).toHaveBeenCalledWith('/auth/firebase-sync', {
        firebaseUid: 'fb-1',
        email: 'fb@x.com',
        name: 'FB User',
        photoUrl: 'http://pic.com/a.jpg',
        firebaseToken: 'firebase-id-token-1',
      });
    });

    it('persists token on success', async () => {
      mApiPost.mockResolvedValue({
        success: true,
        data: { token: 'tok-3', user: testUser },
      });
      await syncFirebaseUser(fbUser);
      expect(mStorageSet).toHaveBeenCalledWith('token', 'tok-3');
    });

    it('throws when success=true but no token', async () => {
      mApiPost.mockResolvedValue({ success: true, data: {} });
      await expect(syncFirebaseUser(fbUser)).rejects.toThrow(/no authentication token/i);
    });

    it('surfaces backend sync payload error when provided', async () => {
      mApiPost.mockRejectedValue(
        new HttpError('', 503, 'Service Unavailable', {
          error: 'Firebase Admin is not configured on the server.',
        })
      );

      await expect(syncFirebaseUser(fbUser)).rejects.toThrow(
        /Firebase Admin is not configured on the server/i
      );
    });

    it('normalizes legacy login-lock payload message for firebase sync', async () => {
      mApiPost.mockRejectedValue(
        new HttpError('', 429, 'Too Many Requests', {
          message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
        })
      );

      await expect(syncFirebaseUser(fbUser)).rejects.toThrow(/temporarily rate-limited/i);
    });

    it('normalizes generic 429 firebase sync throttling errors', async () => {
      mApiPost.mockRejectedValue(new HttpError('', 429, 'Too Many Requests', null));

      await expect(syncFirebaseUser(fbUser)).rejects.toThrow(/temporarily rate-limited/i);
    });
  });

  // ── fetchProfile ──────────────────────────────────────────────────
  describe('fetchProfile', () => {
    it('calls GET /auth/profile', async () => {
      mApiGet.mockResolvedValue({ success: true, data: testUser });
      const result = await fetchProfile();
      expect(mApiGet).toHaveBeenCalledWith('/auth/profile');
      expect(result.data).toEqual(testUser);
    });
  });

  // ── changePassword ────────────────────────────────────────────────
  describe('changePassword', () => {
    it('calls PUT /auth/password', async () => {
      const mApiPut = apiClient.put as ReturnType<typeof vi.fn>;
      mApiPut.mockResolvedValue({ success: true });
      const result = await changePassword('old', 'new');
      expect(mApiPut).toHaveBeenCalledWith('/auth/password', {
        currentPassword: 'old',
        newPassword: 'new',
      });
      expect(result.success).toBe(true);
    });
  });

  // ── logout ────────────────────────────────────────────────────────
  describe('logout', () => {
    it('clears token and userRole from storage', async () => {
      await logout();
      expect(mStorageRemove).toHaveBeenCalledWith('token');
      expect(mStorageRemove).toHaveBeenCalledWith('userRole');
      expect(mApiSetToken).toHaveBeenCalledWith(null);
    });
  });
});
