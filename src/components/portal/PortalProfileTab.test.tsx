import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PortalProfileTab from './PortalProfileTab';
import userReducer from '../../store/userSlice';

const mockAuthFetch = vi.fn();

vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

const mockUser = {
  id: 'user-1',
  email: 'portal.user@test.ae',
  name: 'Portal User',
  role: 'tenant',
  phone: '+971500000001',
  photoURL: 'https://example.com/avatar.jpg',
};

const createMockStore = () =>
  configureStore({
    reducer: { user: userReducer },
    preloadedState: {
      user: {
        currentUser: mockUser,
        isLoading: false,
        error: null,
      },
    },
  });

const renderWithStore = () => {
  const store = createMockStore();
  return {
    store,
    ...render(
      <Provider store={store}>
        <PortalProfileTab />
      </Provider>
    ),
  };
};

describe('PortalProfileTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls canonical /api/auth/profile endpoint with strict payload mapping', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: {
            id: 'user-1',
            email: 'portal.user@test.ae',
            role: 'tenant',
            name: 'Updated Name',
            phone: '+971511111111',
            photoUrl: 'https://example.com/updated-avatar.jpg',
          },
        }),
    });

    renderWithStore();

    fireEvent.change(screen.getByTestId('profile-name-input'), {
      target: { value: 'Updated Name' },
    });
    fireEvent.change(screen.getByTestId('profile-phone-input'), {
      target: { value: '+971511111111' },
    });
    fireEvent.change(screen.getByTestId('profile-photo-input'), {
      target: { value: 'https://example.com/updated-avatar.jpg' },
    });

    fireEvent.click(screen.getByTestId('profile-save-btn'));

    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledWith('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Updated Name',
          phone: '+971511111111',
          photoUrl: 'https://example.com/updated-avatar.jpg',
        }),
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('profile-success')).toHaveTextContent(
        'Profile updated successfully.'
      );
    });
  });

  it('shows API error and does not show success when profile save fails', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Profile save rejected' }),
    });

    renderWithStore();

    fireEvent.click(screen.getByTestId('profile-save-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('profile-error')).toHaveTextContent('Profile save rejected');
    });

    expect(screen.queryByTestId('profile-success')).not.toBeInTheDocument();
  });

  it('shows fallback error on network failure', async () => {
    mockAuthFetch.mockRejectedValueOnce(new Error('Network down'));

    renderWithStore();

    fireEvent.click(screen.getByTestId('profile-save-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('profile-error')).toHaveTextContent('Network down');
    });

    expect(screen.queryByTestId('profile-success')).not.toBeInTheDocument();
  });
});
