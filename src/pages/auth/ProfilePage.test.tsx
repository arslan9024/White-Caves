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
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
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

import ProfilePage from './ProfilePage.tsx';
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
  type MockUserState = { currentUser: Record<string, unknown> | null };
  type MockAction = { type?: string; payload?: Record<string, unknown> | null };

  return configureStore({
    reducer: {
      user: (state: MockUserState = { currentUser: user }, action: MockAction) => {
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

function clickTab(label: string) {
  const tabButton = screen
    .getAllByRole('tab')
    .find(btn => (btn.textContent || '').toLowerCase().includes(label.toLowerCase()));
  expect(tabButton).toBeDefined();
  fireEvent.click(tabButton!);
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
    expect(screen.queryByRole('img', { name: /Ahmed Al-Rashid/i })).not.toBeInTheDocument();
    expect(screen.getAllByText('A').length).toBeGreaterThan(0);
  });

  it('renders user avatar with photo when available', () => {
    renderPage({ ...MOCK_USER, photo: 'https://example.com/photo.jpg' });
    const img = screen.getByRole('img', { name: /Ahmed Al-Rashid/i }) as HTMLImageElement;
    expect(img.src).toContain('photo.jpg');
  });

  it('shows role badge', () => {
    renderPage();
    // Role label may appear in both badge and overview section
    expect(screen.getAllByText('Buyer').length).toBeGreaterThan(0);
  });

  // ── Navigation Tabs ────────────────────────────────────────────
  it('renders all navigation tabs', () => {
    renderPage();
    expect(screen.getByText(/overview/i)).toBeDefined();
    expect(screen.getByText(/settings/i)).toBeDefined();
    expect(screen.getByText(/security/i)).toBeDefined();
  });

  it('shows overview tab by default', () => {
    renderPage();
    expect(screen.getByText(/Account Information/i)).toBeDefined();
  });

  // ── Overview Tab ──────────────────────────────────────────────
  it('shows account information', () => {
    renderPage();
    expect(screen.getByText(/Account Information/i)).toBeDefined();
    expect(screen.getAllByText(/Full Name/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Email/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Phone/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Role/i).length).toBeGreaterThan(0);
  });

  it('displays user details in overview', () => {
    renderPage();
    expect(screen.getAllByText('Ahmed Al-Rashid').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ahmed@whitecaves.ae').length).toBeGreaterThan(0);
    expect(screen.getByText('+971501234567')).toBeDefined();
  });

  it('shows Quick Stats section', () => {
    renderPage();
    expect(screen.getByText('Saved Properties')).toBeDefined();
    expect(screen.getByText('Viewings')).toBeDefined();
    expect(screen.getByText('Inquiries')).toBeDefined();
    expect(screen.getByText('2FA Status')).toBeDefined();
  });

  it('shows Connected Accounts section', () => {
    renderPage();
    expect(screen.getByText(/Connected Accounts/i)).toBeDefined();
    expect(screen.getByText('Google')).toBeDefined();
    expect(screen.getByText('Facebook')).toBeDefined();
    expect(screen.getByText('Apple')).toBeDefined();
    expect(screen.getByText('Connected')).toBeDefined();
  });

  // ── Settings Tab ──────────────────────────────────────────────
  it('switches to Settings tab', () => {
    renderPage();
    clickTab('settings');
    expect(screen.getByText(/Profile Settings/i)).toBeDefined();
    expect(screen.getByText('Email cannot be changed')).toBeDefined();
  });

  it('pre-fills form with user data', () => {
    renderPage();
    clickTab('settings');

    const nameInput = screen.getByLabelText('Full Name') as HTMLInputElement;
    expect(nameInput.value).toBe('Ahmed Al-Rashid');

    const phoneInput = screen.getByLabelText('Phone Number') as HTMLInputElement;
    expect(phoneInput.value).toBe('+971501234567');
  });

  it('shows email as disabled', () => {
    renderPage();
    clickTab('settings');

    const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
    expect(emailInput.disabled).toBe(true);
    expect(screen.getByText('Email cannot be changed')).toBeDefined();
  });

  it('shows language selector', () => {
    renderPage();
    clickTab('settings');

    const langSelect = screen.getByLabelText('Preferred Language') as HTMLSelectElement;
    expect(langSelect.value).toBe('en');
  });

  it('updates form fields correctly', () => {
    renderPage();
    clickTab('settings');

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
    clickTab('settings');

    const saveButton = screen.getByText(/save changes/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledWith(
        '/api/auth/profile',
        expect.objectContaining({
          method: 'PATCH',
        })
      );
      expect(mockToast.success).toHaveBeenCalledWith('Profile updated successfully.');
    });
  });

  it('shows warning when saving empty name', async () => {
    renderPage();
    clickTab('settings');

    const nameInput = screen.getByLabelText('Full Name') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: '' } });

    const saveButton = screen.getByText(/save changes/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockToast.warning).toHaveBeenCalledWith('Name cannot be empty.');
    });
    expect(mockAuthFetch).not.toHaveBeenCalledWith(
      '/api/auth/profile',
      expect.objectContaining({ method: 'PATCH' })
    );
  });

  it('shows error toast on save failure', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, data: { twoFactorEnabled: false } }),
    });
    mockAuthFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Server error' }),
    });

    renderPage();
    clickTab('settings');

    fireEvent.click(screen.getByText(/save changes/i));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalled();
    });
  });

  it('shows error toast on network error', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, data: { twoFactorEnabled: false } }),
    });
    mockAuthFetch.mockRejectedValueOnce(new Error('Network fail'));

    renderPage();
    clickTab('settings');

    fireEvent.click(screen.getByText(/save changes/i));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalled();
    });
  });

  // ── Security Tab ──────────────────────────────────────────────
  it('switches to Security tab', () => {
    renderPage();
    clickTab('security');
    expect(screen.getByTestId('biometric-setup')).toBeDefined();
  });

  // ── Logout ────────────────────────────────────────────────────
  it('logs out successfully', async () => {
    renderPage();
    fireEvent.click(screen.getByText('Sign Out'));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(safeStorage.remove).toHaveBeenCalledWith('token');
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

  it('shows founder controls and CRM dashboard link for lion role', () => {
    (safeStorage.getJSON as ReturnType<typeof vi.fn>).mockReturnValue({ role: 'lion' });
    renderPage();

    expect(screen.getAllByText(/Founder & Creator/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Founder Panel/i)).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: /^Dashboard$/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/crm?tab=overview&cockpit=md');
  });

  it('shows operations cockpit actions for managing_director and opens MD cockpit route', () => {
    (safeStorage.getJSON as ReturnType<typeof vi.fn>).mockReturnValue({ role: 'managing_director' });
    renderPage();

    expect(screen.getAllByText(/Operations Cockpit/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Executive Operations Cockpit/i)).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: /Open Operations Cockpit/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/crm?tab=overview&cockpit=md');
  });

  it('opens executive KPI workspace for managing_director', () => {
    (safeStorage.getJSON as ReturnType<typeof vi.fn>).mockReturnValue({ role: 'managing_director' });
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: /Review Executive KPIs/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/crm?tab=analytics&cockpit=md');
  });

  it('shows correct role label for leasing-agent', () => {
    (safeStorage.getJSON as ReturnType<typeof vi.fn>).mockReturnValue({ role: 'leasing-agent' });
    renderPage();
    expect(screen.getAllByText('Leasing Agent').length).toBeGreaterThan(0);
  });

  // ── Dashboard Link ─────────────────────────────────────────────
  it('shows Dashboard link', () => {
    renderPage();
    expect(screen.getByText('Dashboard')).toBeDefined();
  });

  it('continues to standard dashboard from profile onboarding for regular users', () => {
    localStorage.removeItem('wc-profile-onboarding-seen');
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /Continue to Dashboard/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/crm');
  });

  it('continues to md cockpit dashboard from profile onboarding for managing_director', () => {
    localStorage.removeItem('wc-profile-onboarding-seen');
    (safeStorage.getJSON as ReturnType<typeof vi.fn>).mockReturnValue({ role: 'managing_director' });
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /Continue to (Company )?Dashboard/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/crm?tab=overview&cockpit=md');
  });

  it('normalizes lion dashboard link to CRM', () => {
    (safeStorage.getJSON as ReturnType<typeof vi.fn>).mockReturnValue({ role: 'lion' });
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /^Dashboard$/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/crm?tab=overview&cockpit=md');
  });

  it('shows Back button', () => {
    renderPage();
    expect(screen.getByText('Back')).toBeDefined();
  });

  // ── Tab Switching Round-trip ───────────────────────────────────
  it('switches between all tabs correctly', () => {
    renderPage();

    // Default is overview
    expect(screen.getByText(/Account Information/i)).toBeDefined();

    // Switch to settings
    clickTab('settings');
    expect(screen.getByText(/Profile Settings/i)).toBeDefined();

    // Switch to security
    clickTab('security');
    expect(screen.getByTestId('biometric-setup')).toBeDefined();

    // Switch back to overview
    clickTab('overview');
    expect(screen.getByText(/Account Information/i)).toBeDefined();
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
    expect(screen.getAllByText('No role').length).toBeGreaterThan(0);
  });
});
