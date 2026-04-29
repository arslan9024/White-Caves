/**
 * @file WhatsAppSettingsPage.test.tsx
 * @description Comprehensive tests for the WhatsApp Business Integration settings page.
 * Covers: auth guard, tabs, connection status, QR code, messages, queue, business settings,
 * WebSocket lifecycle, API calls (authFetch), and Redux integration.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import WhatsAppSettingsPage from './WhatsAppSettingsPage';
import userReducer from '../../store/userSlice';
import whatsappReducer from '../../store/slices/whatsappSlice';

// ─── Mocks ──────────────────────────────────────────────────────
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
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

// Mock WebSocket
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  readyState = MockWebSocket.OPEN;
  onopen: ((ev: Event) => void) | null = null;
  onclose: ((ev: CloseEvent) => void) | null = null;
  onmessage: ((ev: MessageEvent) => void) | null = null;
  onerror: ((ev: Event) => void) | null = null;
  close = vi.fn();
  send = vi.fn();
  constructor() {
    setTimeout(() => this.onopen?.(new Event('open')), 0);
  }
}

// ─── Helpers ────────────────────────────────────────────────────
type WhatsAppState = ReturnType<typeof whatsappReducer>;

const defaultWhatsAppState: WhatsAppState = {
  session: null,
  messages: [],
  queue: { size: 0, maxSize: 100, processing: 0, messages: [] },
  health: { activeSessions: 0, authenticatedSessions: 0, uptime: 0, status: 'offline' },
  loading: { connecting: false, disconnecting: false, sending: false, fetchingHistory: false },
  error: null,
  success: null,
  qrCode: null,
  showModal: false,
  modalType: null,
};

const createStore = (
  userOverrides: Record<string, unknown> = {},
  whatsappOverrides: Partial<WhatsAppState> = {},
) =>
  configureStore({
    reducer: { user: userReducer, whatsapp: whatsappReducer },
    preloadedState: {
      user: {
        currentUser: { id: 'u1', name: 'Owner', email: 'owner@wc.ae', role: 'owner' },
        loading: false,
        error: null,
        ...userOverrides,
      } as unknown as ReturnType<typeof userReducer>,
      whatsapp: { ...defaultWhatsAppState, ...whatsappOverrides } as WhatsAppState,
    },
  });

const renderPage = (
  userOverrides: Record<string, unknown> = {},
  waOverrides: Partial<WhatsAppState> = {},
) => {
  const store = createStore(userOverrides, waOverrides);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <WhatsAppSettingsPage />
      </MemoryRouter>
    </Provider>,
  );
};

// ─── Setup ──────────────────────────────────────────────────────
beforeEach(() => {
  vi.clearAllMocks();
  mockAuthFetch.mockResolvedValue({ ok: true, json: async () => ({}) });
  vi.stubGlobal('WebSocket', MockWebSocket);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// ─── Tests ──────────────────────────────────────────────────────
describe('WhatsAppSettingsPage', () => {
  // === Auth Guard ===
  describe('Authorization', () => {
    it('redirects non-owner users to home', () => {
      renderPage({ currentUser: { id: 'u2', name: 'Agent', email: 'a@wc.ae', role: 'agent' } });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('redirects when no user is present', () => {
      renderPage({ currentUser: null });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('allows admin users', () => {
      renderPage({ currentUser: { id: 'u3', name: 'Admin', email: 'adm@wc.ae', role: 'admin' } });
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(screen.getByText('WhatsApp Business Integration')).toBeInTheDocument();
    });

    it('allows owner users', () => {
      renderPage();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(screen.getByText('WhatsApp Business Integration')).toBeInTheDocument();
    });
  });

  // === Header & Layout ===
  describe('Header & Layout', () => {
    it('renders the page header', () => {
      renderPage();
      expect(screen.getByText('WhatsApp Business Integration')).toBeInTheDocument();
      expect(screen.getByText(/Manage your WhatsApp connection/i)).toBeInTheDocument();
    });

    it('renders all navigation tabs', () => {
      renderPage();
      const tabs = screen.getAllByRole('button').filter(btn => btn.classList.contains('settings-tab'));
      expect(tabs.length).toBe(5);
      expect(screen.getAllByText(/Status/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/QR Code/)).toBeInTheDocument();
      expect(screen.getAllByText(/Messages/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Queue/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Business Settings/)).toBeInTheDocument();
    });
  });

  // === Status Tab (default) ===
  describe('Status Tab', () => {
    it('shows disconnected status by default', () => {
      renderPage();
      expect(screen.getByText('Connection Status:')).toBeInTheDocument();
      expect(screen.getByText('Disconnected')).toBeInTheDocument();
    });

    it('shows Initialize Connection button when disconnected', () => {
      renderPage();
      expect(screen.getByRole('button', { name: /Initialize Connection/i })).toBeInTheDocument();
    });

    it('shows Disconnect button when connected', () => {
      renderPage({}, {
        session: {
          sessionId: 's1',
          ownerEmail: 'o@wc.ae',
          phoneNumber: '+971561234567',
          businessName: 'WC',
          connectionStatus: 'authenticated',
          messageCount: 5,
          autoReplyEnabled: false,
          chatbotEnabled: false,
        },
      });
      expect(screen.getByRole('button', { name: /Disconnect/i })).toBeInTheDocument();
    });

    it('shows phone number when connected', () => {
      renderPage({}, {
        session: {
          sessionId: 's1', ownerEmail: 'o@wc.ae', phoneNumber: '+971561234567',
          connectionStatus: 'authenticated', messageCount: 0,
          autoReplyEnabled: false, chatbotEnabled: false,
        },
      });
      expect(screen.getByText('+971561234567')).toBeInTheDocument();
    });

    it('shows error messages from Redux state', () => {
      renderPage({}, { error: 'Connection failed' });
      expect(screen.getByText('Connection failed')).toBeInTheDocument();
    });

    it('shows success messages from Redux state', () => {
      renderPage({}, { success: 'Connected successfully' });
      expect(screen.getByText('Connected successfully')).toBeInTheDocument();
    });

    it('shows queue stats', () => {
      renderPage({}, { queue: { size: 5, maxSize: 100, processing: 2, messages: [] } });
      // Queue size shown as "5 / 100" split across text nodes
      const queueLabel = screen.getByText('Queue Size:');
      expect(queueLabel).toBeInTheDocument();
    });

    it('disables Initialize button while connecting', () => {
      renderPage({}, { loading: { connecting: true, disconnecting: false, sending: false, fetchingHistory: false } });
      const btn = screen.getByRole('button', { name: /Initializing/i });
      expect(btn).toBeDisabled();
    });
  });

  // === Tab Switching ===
  describe('Tab Navigation', () => {
    it('switches to QR Code tab', () => {
      renderPage();
      const tabs = screen.getAllByRole('button').filter(btn => btn.classList.contains('settings-tab'));
      fireEvent.click(tabs[1]); // QR Code is second tab
      expect(screen.getByText('QR Code Scanner')).toBeInTheDocument();
    });

    it('switches to Messages tab', () => {
      renderPage();
      const tabs = screen.getAllByRole('button').filter(btn => btn.classList.contains('settings-tab'));
      fireEvent.click(tabs[2]); // Messages is third tab
      expect(screen.getByText('Test Message')).toBeInTheDocument();
    });

    it('switches to Queue tab', () => {
      renderPage();
      const tabs = screen.getAllByRole('button').filter(btn => btn.classList.contains('settings-tab'));
      fireEvent.click(tabs[3]); // Queue is fourth tab
      expect(screen.getByText('Message Queue')).toBeInTheDocument();
    });

    it('switches to Business Settings tab', () => {
      renderPage();
      fireEvent.click(screen.getByText(/Business Settings/));
      expect(screen.getByText('Business Information')).toBeInTheDocument();
    });
  });

  // === QR Code Tab ===
  describe('QR Code Tab', () => {
    it('shows placeholder when no QR code', () => {
      renderPage();
      const tabs = screen.getAllByRole('button').filter(btn => btn.classList.contains('settings-tab'));
      fireEvent.click(tabs[1]); // QR Code tab
      expect(screen.getByText(/No QR code available/i)).toBeInTheDocument();
    });

    it('shows QR image when available', () => {
      renderPage({}, { qrCode: 'data:image/png;base64,abc123' });
      const tabs = screen.getAllByRole('button').filter(btn => btn.classList.contains('settings-tab'));
      fireEvent.click(tabs[1]); // QR Code tab
      const img = screen.getByAltText('WhatsApp QR Code');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'data:image/png;base64,abc123');
    });
  });

  // === Messages Tab ===
  describe('Messages Tab', () => {
    const authedSession = {
      sessionId: 's1', ownerEmail: 'o@wc.ae', phoneNumber: '+971561234567',
      connectionStatus: 'authenticated' as const, messageCount: 0,
      autoReplyEnabled: false, chatbotEnabled: false,
    };

    const clickMessagesTab = () => {
      const tabs = screen.getAllByRole('button').filter(btn => btn.classList.contains('settings-tab'));
      fireEvent.click(tabs[2]); // Messages tab
    };

    it('disables inputs when not authenticated', () => {
      renderPage();
      clickMessagesTab();
      const phoneInput = screen.getByLabelText(/Recipient Phone/i);
      expect(phoneInput).toBeDisabled();
    });

    it('enables inputs when authenticated', () => {
      renderPage({}, { session: authedSession });
      clickMessagesTab();
      const phoneInput = screen.getByLabelText(/Recipient Phone/i);
      expect(phoneInput).not.toBeDisabled();
    });

    it('shows warning when not authenticated', () => {
      renderPage();
      clickMessagesTab();
      expect(screen.getByText(/Connect WhatsApp first/i)).toBeInTheDocument();
    });

    it('shows recent messages when available', () => {
      const msgs = [{
        id: 'm1', phoneNumber: '+971500000000', body: 'Hello', type: 'text' as const,
        direction: 'sent' as const, timestamp: new Date(), status: 'sent' as const,
      }];
      renderPage({}, { session: authedSession, messages: msgs });
      clickMessagesTab();
      expect(screen.getByText('Recent Messages')).toBeInTheDocument();
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });

  // === Queue Tab ===
  describe('Queue Tab', () => {
    const clickQueueTab = () => {
      const tabs = screen.getAllByRole('button').filter(btn => btn.classList.contains('settings-tab'));
      fireEvent.click(tabs[3]); // Queue tab
    };

    it('shows empty queue message', () => {
      renderPage();
      clickQueueTab();
      expect(screen.getByText('No messages in queue')).toBeInTheDocument();
    });

    it('shows queue stats', () => {
      renderPage({}, {
        queue: {
          size: 3, maxSize: 100, processing: 1,
          messages: [
            { id: 'q1', phoneNumber: '+971500000001', body: 'Msg one', type: 'text', direction: 'sent', timestamp: new Date(), status: 'pending', priority: 'high' },
            { id: 'q2', phoneNumber: '+971500000002', body: 'Msg two', type: 'text', direction: 'sent', timestamp: new Date(), status: 'pending', priority: 'normal' },
          ],
        },
      });
      clickQueueTab();
      expect(screen.getByText('Pending Messages')).toBeInTheDocument();
      expect(screen.getByText('+971500000001')).toBeInTheDocument();
    });
  });

  // === Business Settings Tab ===
  describe('Business Settings Tab', () => {
    it('renders all form fields', () => {
      renderPage();
      fireEvent.click(screen.getByText(/Business Settings/));
      expect(screen.getByLabelText('Business Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Business Phone')).toBeInTheDocument();
      expect(screen.getByLabelText('Business Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Profile Image URL')).toBeInTheDocument();
      expect(screen.getByLabelText('Webhook URL')).toBeInTheDocument();
      expect(screen.getByLabelText('API Token')).toBeInTheDocument();
    });

    it('allows editing business name', () => {
      renderPage();
      fireEvent.click(screen.getByText(/Business Settings/));
      const input = screen.getByLabelText('Business Name') as HTMLInputElement;
      fireEvent.change(input, { target: { name: 'businessName', value: 'White Caves' } });
      expect(input.value).toBe('White Caves');
    });

    it('saves settings on button click', async () => {
      mockAuthFetch.mockResolvedValue({ ok: true, json: async () => ({}) });
      renderPage();
      fireEvent.click(screen.getByText(/Business Settings/));
      const saveBtn = screen.getByRole('button', { name: /Save Business Settings/i });
      fireEvent.click(saveBtn);
      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledWith(
          '/api/whatsapp/settings',
          expect.objectContaining({ method: 'PUT' }),
        );
      });
    });

    it('shows success message after save', async () => {
      mockAuthFetch.mockResolvedValue({ ok: true, json: async () => ({}) });
      renderPage();
      fireEvent.click(screen.getByText(/Business Settings/));
      fireEvent.click(screen.getByRole('button', { name: /Save Business Settings/i }));
      await waitFor(() => {
        expect(screen.getByText('Settings saved successfully!')).toBeInTheDocument();
      });
    });

    it('shows error message on save failure', async () => {
      mockAuthFetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) // initial fetch
        .mockResolvedValueOnce({ ok: false, status: 500 }); // save failure
      renderPage();
      fireEvent.click(screen.getByText(/Business Settings/));
      fireEvent.click(screen.getByRole('button', { name: /Save Business Settings/i }));
      await waitFor(() => {
        expect(screen.getByText('Error saving settings')).toBeInTheDocument();
      });
    });

    it('shows Saving... text while saving', async () => {
      mockAuthFetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) // initial fetch
        .mockReturnValueOnce(new Promise(() => {})); // never-resolving save
      renderPage();
      fireEvent.click(screen.getByText(/Business Settings/));
      fireEvent.click(screen.getByRole('button', { name: /Save Business Settings/i }));
      expect(screen.getByRole('button', { name: /Saving.../i })).toBeDisabled();
    });
  });

  // === API Integration ===
  describe('API Integration', () => {
    it('fetches settings on mount', async () => {
      renderPage();
      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledWith(
          '/api/whatsapp/settings',
          expect.objectContaining({ signal: expect.any(AbortSignal) }),
        );
      });
    });

    it('calls initialize connection API', async () => {
      mockAuthFetch.mockResolvedValue({ ok: true, json: async () => ({}) });
      renderPage();
      fireEvent.click(screen.getByRole('button', { name: /Initialize Connection/i }));
      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledWith(
          '/api/whatsapp/init',
          expect.objectContaining({ method: 'POST' }),
        );
      });
    });

    it('calls disconnect API', async () => {
      mockAuthFetch.mockResolvedValue({ ok: true, json: async () => ({}) });
      renderPage({}, {
        session: {
          sessionId: 's1', ownerEmail: 'o@wc.ae',
          connectionStatus: 'authenticated', messageCount: 0,
          autoReplyEnabled: false, chatbotEnabled: false,
        },
      });
      fireEvent.click(screen.getByRole('button', { name: /Disconnect/i }));
      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledWith(
          '/api/whatsapp/disconnect',
          expect.objectContaining({ method: 'POST' }),
        );
      });
    });
  });

  // === Error & Edge Cases ===
  describe('Error & Edge Cases', () => {
    it('handles settings fetch failure gracefully', async () => {
      mockAuthFetch.mockResolvedValue({ ok: false, status: 500 });
      renderPage();
      // Should still render the page without crashing
      expect(screen.getByText('WhatsApp Business Integration')).toBeInTheDocument();
    });

    it('handles network error on fetch', async () => {
      mockAuthFetch.mockRejectedValue(new Error('Network error'));
      renderPage();
      // Should still render the page without crashing
      expect(screen.getByText('WhatsApp Business Integration')).toBeInTheDocument();
    });

    it('handles abort error gracefully', async () => {
      const abortErr = new DOMException('Aborted', 'AbortError');
      mockAuthFetch.mockRejectedValue(abortErr);
      renderPage();
      expect(screen.getByText('WhatsApp Business Integration')).toBeInTheDocument();
    });
  });
});
