/**
 * WhatsAppDashboardPage — Unit Tests
 * Tests: rendering, route protection, tab navigation, stats display,
 * loading/error states, auto-polling, API integration
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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

const mockAuthFetch = vi.fn();
vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

vi.mock('../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  }),
}));

import WhatsAppDashboardPage from './WhatsAppDashboardPage';
import userReducer from '../../store/userSlice';

// ── Helpers ──────────────────────────────────────────────────────

const MOCK_STATS = {
  totalContacts: 1250,
  activeChats: 87,
  messages24h: 342,
  responseTime: '2.4 min',
};

const createMockStore = (userOverrides: Record<string, unknown> = {}) => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState: {
      user: {
        currentUser: { id: 'u1', name: 'Admin', email: 'admin@wc.ae', role: 'owner' },
        loading: false,
        error: null,
        ...userOverrides,
      } as unknown as ReturnType<typeof userReducer>,
    },
  });
};

const renderPage = (userOverrides: Record<string, unknown> = {}) => {
  const store = createMockStore(userOverrides);
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <WhatsAppDashboardPage />
        </MemoryRouter>
      </Provider>,
    ),
  };
};

const mockSuccessfulFetch = () => {
  mockAuthFetch.mockResolvedValue({
    ok: true,
    json: async () => MOCK_STATS,
  });
};

// ── Tests ────────────────────────────────────────────────────────

describe('WhatsAppDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockSuccessfulFetch();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Rendering ────────────────────────────────────────────────

  describe('Rendering', () => {
    it('should render the WhatsApp dashboard container', async () => {
      renderPage();
      await waitFor(() => {
        const container = document.querySelector('.whatsapp-dashboard-page');
        expect(container).toBeTruthy();
      });
    });

    it('should render the WhatsApp header', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('WhatsApp Dashboard')).toBeInTheDocument();
      });
    });

    it('should render stats cards after loading', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('1250')).toBeInTheDocument(); // totalContacts
      });
    });

    it('should render active chats stat', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('87')).toBeInTheDocument();
      });
    });

    it('should render messages in 24h stat', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('342')).toBeInTheDocument();
      });
    });

    it('should render response time stat', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('2.4 min')).toBeInTheDocument();
      });
    });

    it('should render stat labels', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Total Contacts')).toBeInTheDocument();
        expect(screen.getByText('Active Chats')).toBeInTheDocument();
        expect(screen.getByText('Messages (24h)')).toBeInTheDocument();
        expect(screen.getByText('Avg Response')).toBeInTheDocument();
      });
    });
  });

  // ── Route Protection ──────────────────────────────────────────

  describe('Route Protection', () => {
    it('should redirect non-owner users to home', async () => {
      renderPage({
        currentUser: { id: 'u2', name: 'Agent', email: 'agent@wc.ae', role: 'agent' },
      });
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('should redirect client users to home', async () => {
      renderPage({
        currentUser: { id: 'u3', name: 'Client', email: 'client@wc.ae', role: 'client' },
      });
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('should allow owner to view the page', async () => {
      renderPage();
      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    it('should allow admin to view the page', async () => {
      renderPage({
        currentUser: { id: 'u4', name: 'Admin', email: 'admin@wc.ae', role: 'admin' },
      });
      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    it('should redirect when no user is logged in', async () => {
      renderPage({ currentUser: null });
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  // ── Tab Navigation ───────────────────────────────────────────

  describe('Tab Navigation', () => {
    it('should render 4 tabs', async () => {
      renderPage();
      await waitFor(() => {
        const tabs = document.querySelectorAll('.whatsapp-tab');
        expect(tabs.length).toBe(4);
      });
    });

    it('should default to Overview tab', async () => {
      renderPage();
      await waitFor(() => {
        const activeTab = document.querySelector('.whatsapp-tab.active');
        expect(activeTab?.textContent).toContain('Overview');
      });
    });

    it('should switch to Messages tab on click', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Messages')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Messages'));
      const activeTab = document.querySelector('.whatsapp-tab.active');
      expect(activeTab?.textContent).toContain('Messages');
    });

    it('should switch to Contacts tab on click', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Contacts')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Contacts'));
      const activeTab = document.querySelector('.whatsapp-tab.active');
      expect(activeTab?.textContent).toContain('Contacts');
    });

    it('should switch to Broadcasts tab on click', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Broadcasts')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Broadcasts'));
      const activeTab = document.querySelector('.whatsapp-tab.active');
      expect(activeTab?.textContent).toContain('Broadcasts');
    });
  });

  // ── Loading State ────────────────────────────────────────────

  describe('Loading State', () => {
    it('should render stats grid with initial zero values before data loads', () => {
      mockAuthFetch.mockReturnValue(new Promise(() => {})); // never resolves
      renderPage();
      // Stats start at 0 because loading state has no visible indicator
      expect(screen.getByText('Total Contacts')).toBeInTheDocument();
      expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(3);
    });
  });

  // ── Error State ──────────────────────────────────────────────

  describe('Error State', () => {
    it('should keep stats at zero when API rejects (no visible error)', async () => {
      mockAuthFetch.mockRejectedValue(new Error('Network error'));
      renderPage();
      // The component stores error in state but doesn't render it visibly
      await waitFor(() => {
        // Stats remain at initial zero values
        expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(3);
      });
    });

    it('should keep stats at zero when API returns non-ok', async () => {
      mockAuthFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      });
      renderPage();
      await waitFor(() => {
        expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  // ── API Integration ──────────────────────────────────────────

  describe('API Integration', () => {
    it('should call authFetch for stats on mount', async () => {
      renderPage();
      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/whatsapp/stats'),
          expect.any(Object),
        );
      });
    });

    it('should poll for stats every 30 seconds', async () => {
      renderPage();
      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledTimes(1);
      });

      // Advance 30 seconds
      await act(async () => {
        vi.advanceTimersByTime(30000);
      });

      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledTimes(2);
      });
    });
  });
});
