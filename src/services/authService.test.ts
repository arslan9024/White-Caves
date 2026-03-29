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

// ── Mocks ───────────────────────────────────────────────────────────────
vi.mock('../utils/apiClient', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
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

import { apiClient } from '../utils/apiClient';
import { safeStorage } from '../utils/safeStorage';

const mApiPost = apiClient.post as ReturnType<typeof vi.fn>;
const mApiGet = apiClient.get as ReturnType<typeof vi.fn>;
const mApiSetToken = apiClient.setAuthToken as ReturnType<typeof vi.fn>;
const mStorageGet = safeStorage.get as ReturnType<typeof vi.fn>;
const mStorageSet = safeStorage.set as ReturnType<typeof vi.fn>;
const mStorageRemove = safeStorage.remove as ReturnType<typeof vi.fn>;

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
      await expect(loginWithEmail('a@b.com', 'pass')).rejects.toThrow(
        /no authentication token/i,
      );
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

    it('throws when success=true but no token', async () => {
      mApiPost.mockResolvedValue({ success: true, data: {} });
      await expect(registerWithEmail('a@b.com', 'pass')).rejects.toThrow(
        /no authentication token/i,
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
    };

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
      await expect(syncFirebaseUser(fbUser)).rejects.toThrow(
        /no authentication token/i,
      );
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
    it('calls POST /auth/change-password', async () => {
      mApiPost.mockResolvedValue({ success: true });
      const result = await changePassword('old', 'new');
      expect(mApiPost).toHaveBeenCalledWith('/auth/change-password', {
        currentPassword: 'old',
        newPassword: 'new',
      });
      expect(result.success).toBe(true);
    });
  });

  // ── logout ────────────────────────────────────────────────────────
  describe('logout', () => {
    it('clears token and userRole from storage', () => {
      logout();
      expect(mStorageRemove).toHaveBeenCalledWith('token');
      expect(mStorageRemove).toHaveBeenCalledWith('userRole');
      expect(mApiSetToken).toHaveBeenCalledWith(null);
    });
  });
});
