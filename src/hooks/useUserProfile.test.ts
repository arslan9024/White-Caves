/** @vitest-environment jsdom */
import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { mockDispatch, mockNavigate, mockAuthFetch, mockToast, mockSafeStorage, mockUser } =
  vi.hoisted(() => ({
    mockDispatch: vi.fn(),
    mockNavigate: vi.fn(),
    mockAuthFetch: vi.fn(),
    mockToast: { success: vi.fn(), warning: vi.fn(), error: vi.fn() },
    mockSafeStorage: {
      getJSON: vi.fn(),
      setJSON: vi.fn(),
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
    },
    mockUser: {
      id: 'tenant-1',
      email: 'tenant@example.com',
      role: 'tenant',
      status: 'active',
      name: 'Tenant User',
      phone: '+971500000001',
      profileCompleted: false,
    },
  }));

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: unknown) => unknown) => selector({}),
}));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('../store/selectors/sessionSelectors', () => ({
  selectSessionUser: () => mockUser,
}));
vi.mock('../components/Toast', () => ({ useToast: () => mockToast }));
vi.mock('../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));
vi.mock('../utils/safeStorage', () => ({ safeStorage: mockSafeStorage }));
vi.mock('../services/authService', () => ({ logout: vi.fn().mockResolvedValue(undefined) }));

import { useUserProfile } from './useUserProfile';

const profileResponse = (profileCompleted: boolean) => ({
  success: true,
  data: {
    id: 'tenant-1',
    email: 'tenant@example.com',
    role: 'tenant',
    status: 'active',
    name: 'Tenant User Updated',
    phone: '+971500000001',
    profileCompleted,
    profileCompletion: {
      roleCategory: 'client',
      requiredFields: ['name', 'phone'],
      optionalFields: ['department'],
      missingFields: profileCompleted ? [] : ['phone'],
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(
    MemoryRouter,
    { initialEntries: [{ pathname: '/profile', state: { from: '/crm/leads?tab=mine' } }] },
    children
  );

describe('useUserProfile post-save session synchronization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSafeStorage.getJSON.mockReturnValue(null);
    mockAuthFetch.mockResolvedValue({ ok: true, json: async () => profileResponse(true) });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses server-computed completion and the shared role-safe destination after saving', async () => {
    const { result } = renderHook(() => useUserProfile(), { wrapper });

    await act(async () => {
      await result.current.handleSaveProfile();
    });

    expect(mockAuthFetch).toHaveBeenCalledWith(
      '/api/auth/profile',
      expect.objectContaining({ method: 'PATCH' })
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'user/setUser',
        payload: expect.objectContaining({ profileCompleted: true, profileComplete: true }),
      })
    );
    expect(mockSafeStorage.setJSON).toHaveBeenCalledWith(
      'user',
      expect.objectContaining({ profileCompleted: true, profileComplete: true })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/tenant-portal', { replace: true });
    expect(mockToast.success).toHaveBeenCalled();
  });

  it('keeps incomplete users on Profile instead of trusting client-calculated completeness', async () => {
    mockAuthFetch.mockResolvedValue({ ok: true, json: async () => profileResponse(false) });
    const { result } = renderHook(() => useUserProfile(), { wrapper });

    await act(async () => {
      await result.current.handleSaveProfile();
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'user/setUser',
        payload: expect.objectContaining({ profileCompleted: false }),
      })
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
