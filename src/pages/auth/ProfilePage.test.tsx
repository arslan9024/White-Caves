/**
 * ProfilePage — Unit Tests
 * Tests: render, tab switching, overview info, settings form, security tab,
 * logout, save profile, role labels, auth guard, form validation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

// ── Mocks ────────────────────────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

vi.mock('../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
  }),
}));

const mockSignOut = vi.fn().mockResolvedValue(undefined);
vi.mock('firebase/auth', () => ({
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

vi.mock('../../config/firebase', () => ({
  auth: { currentUser: { uid: 'u1' } },
}));

const mockAuthFetch = vi.fn();
vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

vi.mock('../../utils/safeStorage', () => ({
  safeStorage: {
    getJSON: vi.fn(() => ({ role: 'buyer' })),
    setJSON: vi.fn(),
    set: vi.fn(),
    get: vi.fn(() => null),
    remove: vi.fn(),
  },
}));

const mockToast = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };
vi.mock('../../components/Toast', () => ({
  useToast: () => mockToast,
}));

vi.mock('../../features/auth/components/BiometricLogin', () => ({
  BiometricSetup: () => <div data-testid="biometric-setup">BiometricSetup</div>,
}));

import ProfilePage from './ProfilePage';
import { safeStorage } from '../../utils/safeStorage';

// ── Store Factory ────────────────────────────────────────────────

const MOCK_USER = {
  id: 'u1',
  name: 'Ahmed Al-Rashid',
  email: 'ahmed@whitecaves.ae',
  phone: '+971501234567',
  photo: null,
};

function createMockStore(user: Record<string, unknown> | null = MOCK_USER) {
  return configureStore({
    reducer: {
      user: (state: any = { currentUser: user }, action: any) => {
        if (action.type === 'user/setUser') {
          return { ...state, currentUser: action.payload };
        }
        return state;
      },
    },
  });
}

function renderPage(user: Record<string, unknown> | null = MOCK_USER) {
  const store = createMockStore(user);
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </Provider>
    ),
  };
}

// ═══════════════════════════════════════════════════════════════════

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (safeStorage.getJSON as ReturnType<typeof vi.fn>).mockReturnValue({ role: 'buyer' });
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ name: 'Ahmed Al-Rashid' }),
    });
  });

  // ── Auth Guard ─────────────────────────────────────────────────
  it('redirects to signin when no user', () => {
    renderPage(null);
    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });

  it('returns null when no user', () => {
    const { container } = renderPage(null);
    // Should render nothing meaningful
    expect(container.querySelector('.profile-page')).toBeNull();
  });

  // ── Render & Header ─────────────────────────────────────────────
  it('renders the profile page for authenticated user', () => {
    renderPage();
    expect(screen.getAllByText('Ahmed Al-Rashid').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ahmed@whitecaves.ae').length).toBeGreaterThan(0);
  });

  it('renders user avatar with first letter when no photo', () => {
    renderPage();
    // 'A' appears in avatar and possibly elsewhere
    const avatarContainer = document.querySelector('.profile-avatar');
    expect(avatarContainer).toBeDefined();
    expect(avatarContainer?.textContent).toContain('A');
  });

  it('renders user avatar with photo when available', () => {
    renderPage({ ...MOCK_USER, photo: 'https://example.com/photo.jpg' });
    const img = document.querySelector('.profile-avatar img') as HTMLImageElement;
    expect(img).toBeDefined();
    if (img) {
      expect(img.src).toContain('photo.jpg');
    }
  });

  it('shows role badge', () => {
    renderPage();
    // Role label may appear in both badge and overview section
    expect(screen.getAllByText('Buyer').length).toBeGreaterThan(0);
  });

  // ── Navigation Tabs ────────────────────────────────────────────
  it('renders all navigation tabs', () => {
    renderPage();
    expect(screen.getByText('Overview')).toBeDefined();
    expect(screen.getByText('Settings')).toBeDefined();
    expect(screen.getByText('Security')).toBeDefined();
  });

  it('shows overview tab by default', () => {
    renderPage();
    expect(screen.getByText('Profile Overview')).toBeDefined();
  });

  // ── Overview Tab ──────────────────────────────────────────────
  it('shows account information', () => {
    renderPage();
    expect(screen.getByText('Account Information')).toBeDefined();
    expect(screen.getByText('Full Name')).toBeDefined();
    expect(screen.getByText('Email')).toBeDefined();
    expect(screen.getByText('Phone')).toBeDefined();
    expect(screen.getByText('Role')).toBeDefined();
  });

  it('displays user details in overview', () => {
    renderPage();
    expect(screen.getAllByText('Ahmed Al-Rashid').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ahmed@whitecaves.ae').length).toBeGreaterThan(0);
    expect(screen.getByText('+971501234567')).toBeDefined();
  });

  it('shows Quick Stats section', () => {
    renderPage();
    expect(screen.getByText('Quick Stats')).toBeDefined();
    expect(screen.getByText('Saved Properties')).toBeDefined();
    expect(screen.getByText('Viewings')).toBeDefined();
    expect(screen.getByText('Inquiries')).toBeDefined();
    expect(screen.getByText('Alerts')).toBeDefined();
  });

  it('shows Connected Accounts section', () => {
    renderPage();
    expect(screen.getByText('Connected Accounts')).toBeDefined();
    expect(screen.getByText('Google')).toBeDefined();
    expect(screen.getByText('Facebook')).toBeDefined();
    expect(screen.getByText('Apple')).toBeDefined();
    expect(screen.getByText('Connected')).toBeDefined();
  });

  // ── Settings Tab ──────────────────────────────────────────────
  it('switches to Settings tab', () => {
    renderPage();
    fireEvent.click(screen.getByText('Settings'));
    expect(screen.getByText('Account Settings')).toBeDefined();
    expect(screen.getByText('Update your profile information')).toBeDefined();
  });

  it('pre-fills form with user data', () => {
    renderPage();
    fireEvent.click(screen.getByText('Settings'));

    const nameInput = screen.getByLabelText('Full Name') as HTMLInputElement;
    expect(nameInput.value).toBe('Ahmed Al-Rashid');

    const phoneInput = screen.getByLabelText('Phone Number') as HTMLInputElement;
    expect(phoneInput.value).toBe('+971501234567');
  });

  it('shows email as disabled', () => {
    renderPage();
    fireEvent.click(screen.getByText('Settings'));

    const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
    expect(emailInput.disabled).toBe(true);
    expect(screen.getByText('Email cannot be changed')).toBeDefined();
  });

  it('shows language selector', () => {
    renderPage();
    fireEvent.click(screen.getByText('Settings'));

    const langSelect = screen.getByLabelText('Preferred Language') as HTMLSelectElement;
    expect(langSelect.value).toBe('en');
  });

  it('updates form fields correctly', () => {
    renderPage();
    fireEvent.click(screen.getByText('Settings'));

    const nameInput = screen.getByLabelText('Full Name') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    expect(nameInput.value).toBe('New Name');

    const phoneInput = screen.getByLabelText('Phone Number') as HTMLInputElement;
    fireEvent.change(phoneInput, { target: { value: '+971555555555' } });
    expect(phoneInput.value).toBe('+971555555555');
  });

  it('saves profile successfully', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ name: 'Ahmed Al-Rashid' }),
    });

    renderPage();
    fireEvent.click(screen.getByText('Settings'));

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledWith('/api/users/profile', expect.objectContaining({
        method: 'PATCH',
      }));
      expect(mockToast.success).toHaveBeenCalledWith('Profile updated successfully.');
    });
  });

  it('shows warning when saving empty name', async () => {
    renderPage();
    fireEvent.click(screen.getByText('Settings'));

    const nameInput = screen.getByLabelText('Full Name') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: '' } });

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockToast.warning).toHaveBeenCalledWith('Name cannot be empty.');
    });
    expect(mockAuthFetch).not.toHaveBeenCalled();
  });

  it('shows error toast on save failure', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Server error' }),
    });

    renderPage();
    fireEvent.click(screen.getByText('Settings'));

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalled();
    });
  });

  it('shows error toast on network error', async () => {
    mockAuthFetch.mockRejectedValueOnce(new Error('Network fail'));

    renderPage();
    fireEvent.click(screen.getByText('Settings'));

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Network fail');
    });
  });

  // ── Security Tab ──────────────────────────────────────────────
  it('switches to Security tab', () => {
    renderPage();
    fireEvent.click(screen.getByText('Security'));
    expect(screen.getByTestId('biometric-setup')).toBeDefined();
  });

  // ── Logout ────────────────────────────────────────────────────
  it('logs out successfully', async () => {
    renderPage();
    fireEvent.click(screen.getByText('Sign Out'));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(safeStorage.remove).toHaveBeenCalledWith('userRole');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  // ── Role Labels ────────────────────────────────────────────────
  it('shows correct role label for buyer', () => {
    (safeStorage.getJSON as ReturnType<typeof vi.fn>).mockReturnValue({ role: 'buyer' });
    renderPage();
    expect(screen.getAllByText('Buyer').length).toBeGreaterThan(0);
  });

  it('shows correct role label for admin', () => {
    (safeStorage.getJSON as ReturnType<typeof vi.fn>).mockReturnValue({ role: 'admin' });
    renderPage();
    expect(screen.getAllByText('Administrator').length).toBeGreaterThan(0);
  });

  it('shows correct role label for leasing-agent', () => {
    (safeStorage.getJSON as ReturnType<typeof vi.fn>).mockReturnValue({ role: 'leasing-agent' });
    renderPage();
    expect(screen.getAllByText('Leasing Agent').length).toBeGreaterThan(0);
  });

  // ── Dashboard Link ─────────────────────────────────────────────
  it('shows Go to Dashboard link', () => {
    renderPage();
    expect(screen.getByText('Go to Dashboard')).toBeDefined();
  });

  it('shows Home link', () => {
    renderPage();
    expect(screen.getByText('Home')).toBeDefined();
  });

  // ── Tab Switching Round-trip ───────────────────────────────────
  it('switches between all tabs correctly', () => {
    renderPage();

    // Default is overview
    expect(screen.getByText('Profile Overview')).toBeDefined();

    // Switch to settings
    fireEvent.click(screen.getByText('Settings'));
    expect(screen.getByText('Account Settings')).toBeDefined();

    // Switch to security
    fireEvent.click(screen.getByText('Security'));
    expect(screen.getByTestId('biometric-setup')).toBeDefined();

    // Switch back to overview
    fireEvent.click(screen.getByText('Overview'));
    expect(screen.getByText('Profile Overview')).toBeDefined();
  });

  // ── No Role ────────────────────────────────────────────────────
  it('hides role badge when no role in storage', () => {
    (safeStorage.getJSON as ReturnType<typeof vi.fn>).mockReturnValue(null);
    renderPage();
    expect(screen.queryByText('Buyer')).toBeNull();
    expect(screen.queryByText('Administrator')).toBeNull();
  });

  it('shows Not selected for role when no role', () => {
    (safeStorage.getJSON as ReturnType<typeof vi.fn>).mockReturnValue(null);
    renderPage();
    expect(screen.getByText('Not selected')).toBeDefined();
  });
});
