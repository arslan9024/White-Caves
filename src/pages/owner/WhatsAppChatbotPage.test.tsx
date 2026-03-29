/**
 * WhatsAppChatbotPage — Unit Tests
 * Tests: role-based access, tab switching, add message form, validation,
 * toggle message, loading state, API error handling, AbortController cleanup
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';

// ── Mocks ────────────────────────────────────────────────────────

const mockAuthFetch = vi.fn();
const mockNavigate = vi.fn();
const mockToast = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };

vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

vi.mock('../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
  }),
}));

vi.mock('../../components/Toast', () => ({
  useToast: () => mockToast,
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('./WhatsAppChatbotPage.css', () => ({}));

let mockUser: { role: string } | null = { role: 'owner' };
vi.mock('react-redux', () => ({
  useSelector: (fn: (s: unknown) => unknown) =>
    fn({ user: { currentUser: mockUser } }),
}));

// ── Helpers ──────────────────────────────────────────────────────

function ok(data: Record<string, unknown>) {
  return Promise.resolve({
    ok: true, status: 200,
    json: () => Promise.resolve(data),
  });
}

function fail(status = 500) {
  return Promise.resolve({
    ok: false, status,
    json: () => Promise.resolve({ error: 'Server error' }),
  });
}

import WhatsAppChatbotPage from './WhatsAppChatbotPage';

describe('WhatsAppChatbotPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = { role: 'owner' };
    mockAuthFetch.mockResolvedValue(ok({ messages: [] }).then(r => r));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ────── Role-based Access ──────

  it('redirects non-owner users to home', () => {
    mockUser = { role: 'tenant' };
    render(<WhatsAppChatbotPage />);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('allows owner role to view page', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true, json: () => Promise.resolve({ messages: [] }),
    });
    render(<WhatsAppChatbotPage />);
    expect(screen.getByText('WhatsApp Chatbot Manager')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('allows admin role to view page', async () => {
    mockUser = { role: 'admin' };
    mockAuthFetch.mockResolvedValue({
      ok: true, json: () => Promise.resolve({ messages: [] }),
    });
    render(<WhatsAppChatbotPage />);
    expect(screen.getByText('WhatsApp Chatbot Manager')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('redirects when user is null', () => {
    mockUser = null;
    render(<WhatsAppChatbotPage />);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  // ────── Tab Switching ──────

  it('renders Messages tab by default', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true, json: () => Promise.resolve({ messages: [] }),
    });
    render(<WhatsAppChatbotPage />);
    expect(screen.getByText('Add New Automated Message')).toBeInTheDocument();
  });

  it('switches to Settings tab', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true, json: () => Promise.resolve({ messages: [] }),
    });
    render(<WhatsAppChatbotPage />);
    fireEvent.click(screen.getByText('Settings'));
    expect(screen.getByText('Chatbot Settings')).toBeInTheDocument();
  });

  it('switches back to Messages tab', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true, json: () => Promise.resolve({ messages: [] }),
    });
    render(<WhatsAppChatbotPage />);
    fireEvent.click(screen.getByText('Settings'));
    fireEvent.click(screen.getByText('Messages'));
    expect(screen.getByText('Add New Automated Message')).toBeInTheDocument();
  });

  // ────── Loading State ──────

  it('shows loading indicator while fetching', async () => {
    let resolvePromise: (v: unknown) => void;
    mockAuthFetch.mockReturnValue(
      new Promise(resolve => { resolvePromise = resolve; })
    );
    render(<WhatsAppChatbotPage />);
    expect(screen.getByText('Loading messages...')).toBeInTheDocument();

    await act(async () => {
      resolvePromise!({
        ok: true, json: () => Promise.resolve({ messages: [] }),
      });
    });
  });

  // ────── Messages List ──────

  it('renders fetched messages', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        messages: [
          { id: '1', trigger: 'hello', response: 'Welcome!', enabled: true },
          { id: '2', trigger: 'pricing', response: 'Visit our website', enabled: false },
        ],
      }),
    });

    render(<WhatsAppChatbotPage />);
    await waitFor(() => {
      expect(screen.getByText('hello')).toBeInTheDocument();
      expect(screen.getByText('Welcome!')).toBeInTheDocument();
      expect(screen.getByText('pricing')).toBeInTheDocument();
    });
  });

  it('shows empty state when no messages', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true, json: () => Promise.resolve({ messages: [] }),
    });
    render(<WhatsAppChatbotPage />);
    await waitFor(() => {
      expect(screen.getByText('No messages configured yet')).toBeInTheDocument();
    });
  });

  it('shows active/inactive status for messages', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        messages: [
          { id: '1', trigger: 'test', response: 'resp', enabled: true },
          { id: '2', trigger: 'test2', response: 'resp2', enabled: false },
        ],
      }),
    });
    render(<WhatsAppChatbotPage />);
    await waitFor(() => {
      expect(screen.getByText('✓ Active')).toBeInTheDocument();
      expect(screen.getByText('✗ Inactive')).toBeInTheDocument();
    });
  });

  // ────── Add Message Form ──────

  it('warns when submitting empty trigger', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true, json: () => Promise.resolve({ messages: [] }),
    });
    render(<WhatsAppChatbotPage />);
    await waitFor(() => screen.getByText('No messages configured yet'));

    fireEvent.click(screen.getByText('Add Message'));
    expect(mockToast.warning).toHaveBeenCalledWith('Please fill in both trigger and response');
  });

  it('warns when submitting empty response', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true, json: () => Promise.resolve({ messages: [] }),
    });
    render(<WhatsAppChatbotPage />);
    await waitFor(() => screen.getByText('No messages configured yet'));

    const triggerInput = screen.getByPlaceholderText("e.g., 'hello', 'pricing', 'contact'");
    fireEvent.change(triggerInput, { target: { value: 'hello' } });
    fireEvent.click(screen.getByText('Add Message'));
    expect(mockToast.warning).toHaveBeenCalledWith('Please fill in both trigger and response');
  });

  it('submits new message successfully', async () => {
    // First call: initial fetch. Second call: POST. Third call: refetch
    mockAuthFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ messages: [] }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ messages: [{ id: '1', trigger: 'hello', response: 'Hi there', enabled: true }] }) });

    render(<WhatsAppChatbotPage />);
    await waitFor(() => screen.getByText('No messages configured yet'));

    const triggerInput = screen.getByPlaceholderText("e.g., 'hello', 'pricing', 'contact'");
    const responseInput = screen.getByPlaceholderText('Enter the response message...');

    fireEvent.change(triggerInput, { target: { value: 'hello' } });
    fireEvent.change(responseInput, { target: { value: 'Hi there' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Add Message'));
    });

    expect(mockAuthFetch).toHaveBeenCalledWith(
      '/api/whatsapp/chatbot/messages',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ trigger: 'hello', response: 'Hi there' }),
      })
    );
  });

  it('shows error toast on failed add', async () => {
    mockAuthFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ messages: [] }) })
      .mockResolvedValueOnce({ ok: false, json: () => Promise.resolve({}) });

    render(<WhatsAppChatbotPage />);
    await waitFor(() => screen.getByText('No messages configured yet'));

    fireEvent.change(screen.getByPlaceholderText("e.g., 'hello', 'pricing', 'contact'"), { target: { value: 'test' } });
    fireEvent.change(screen.getByPlaceholderText('Enter the response message...'), { target: { value: 'resp' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Add Message'));
    });

    expect(mockToast.error).toHaveBeenCalledWith('Failed to add chatbot message');
  });

  it('shows error toast on add exception', async () => {
    mockAuthFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ messages: [] }) })
      .mockRejectedValueOnce(new Error('Network error'));

    render(<WhatsAppChatbotPage />);
    await waitFor(() => screen.getByText('No messages configured yet'));

    fireEvent.change(screen.getByPlaceholderText("e.g., 'hello', 'pricing', 'contact'"), { target: { value: 'test' } });
    fireEvent.change(screen.getByPlaceholderText('Enter the response message...'), { target: { value: 'resp' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Add Message'));
    });

    expect(mockToast.error).toHaveBeenCalledWith('Failed to add chatbot message');
  });

  // ────── Toggle Message ──────

  it('toggles message enabled state', async () => {
    mockAuthFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          messages: [{ id: '1', trigger: 'hello', response: 'Hi', enabled: true }],
        }),
      })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          messages: [{ id: '1', trigger: 'hello', response: 'Hi', enabled: false }],
        }),
      });

    render(<WhatsAppChatbotPage />);
    await waitFor(() => screen.getByText('✓ Active'));

    await act(async () => {
      fireEvent.click(screen.getByText('✓ Active'));
    });

    expect(mockAuthFetch).toHaveBeenCalledWith(
      '/api/whatsapp/chatbot/messages/1',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ enabled: false }),
      })
    );
  });

  it('shows error toast on toggle failure', async () => {
    mockAuthFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          messages: [{ id: '1', trigger: 'test', response: 'resp', enabled: true }],
        }),
      })
      .mockRejectedValueOnce(new Error('Network error'));

    render(<WhatsAppChatbotPage />);
    await waitFor(() => screen.getByText('✓ Active'));

    await act(async () => {
      fireEvent.click(screen.getByText('✓ Active'));
    });

    expect(mockToast.error).toHaveBeenCalledWith('Failed to toggle message');
  });

  // ────── Settings Tab ──────

  it('renders all settings controls', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true, json: () => Promise.resolve({ messages: [] }),
    });
    render(<WhatsAppChatbotPage />);
    fireEvent.click(screen.getByText('Settings'));

    expect(screen.getByLabelText(/enable chatbot/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/respond to unknown/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Default response message')).toBeInTheDocument();
    expect(screen.getByText('Save Settings')).toBeInTheDocument();
  });

  // ────── AbortController ──────

  it('ignores AbortError from fetch', async () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    mockAuthFetch.mockRejectedValueOnce(abortError);

    render(<WhatsAppChatbotPage />);

    // Should not throw or show error toast
    await waitFor(() => {
      expect(mockToast.error).not.toHaveBeenCalled();
    });
  });

  // ────── Fetch Error ──────

  it('handles failed initial fetch gracefully', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: false, status: 500,
      json: () => Promise.resolve({ error: 'Server error' }),
    });

    render(<WhatsAppChatbotPage />);
    await waitFor(() => {
      expect(screen.getByText('No messages configured yet')).toBeInTheDocument();
    });
  });
});
