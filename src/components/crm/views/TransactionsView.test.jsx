import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TransactionsView from './TransactionsView';

const mockAuthFetch = vi.fn();

vi.mock('../../../utils/authFetch', () => ({
  authFetch: (...args) => mockAuthFetch(...args),
}));

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }) => <>{children}</>,
  motion: new Proxy(
    {},
    {
      get: (_, tag) => {
        const Component = ({ children, ...props }) => React.createElement(tag, props, children);
        Component.displayName = `Motion${String(tag)}`;
        return Component;
      },
    }
  ),
}));

function jsonResponse(payload, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(payload),
  });
}

const mockTransactionsPayload = {
  success: true,
  data: [],
  pagination: { page: 1, limit: 25, total: 0, pages: 0 },
};

const mockStatsPayload = {
  success: true,
  stats: {
    totalTransactions: 0,
    totalValue: 0,
    topAreas: [],
    propertyTypes: [],
  },
};

const setupDefaultGets = () => {
  mockAuthFetch.mockImplementation(url => {
    if (String(url).startsWith('/api/transactions?')) {
      return jsonResponse(mockTransactionsPayload);
    }
    if (url === '/api/transactions/stats') {
      return jsonResponse(mockStatsPayload);
    }
    return Promise.reject(new Error(`Unhandled GET ${url}`));
  });
};

describe('TransactionsView — alert elimination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupDefaultGets();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without any status banner initially', async () => {
    render(<TransactionsView />);
    expect(await screen.findByText('DLD Transactions')).toBeInTheDocument();
    await screen.findByText('No Transactions Found');
    expect(screen.queryByTestId('transactions-status-banner')).not.toBeInTheDocument();
  });

  it('shows error banner when saving a transaction fails', async () => {
    mockAuthFetch.mockImplementation((url, options) => {
      if (String(url).startsWith('/api/transactions?'))
        return jsonResponse(mockTransactionsPayload);
      if (url === '/api/transactions/stats') return jsonResponse(mockStatsPayload);
      if (url === '/api/transactions' && options?.method === 'POST') {
        return Promise.reject(new Error('save failed'));
      }
      return Promise.reject(new Error(`Unhandled request ${url}`));
    });

    render(<TransactionsView />);
    await screen.findByText('DLD Transactions');

    fireEvent.click(screen.getByRole('button', { name: /Add Transaction/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Create Transaction/i }));

    const banner = await screen.findByRole('alert');
    expect(banner).toHaveTextContent('Failed to save transaction');
    expect(banner).toHaveAttribute('data-testid', 'transactions-status-banner');
  });

  it('shows success banner when CSV import succeeds', async () => {
    mockAuthFetch.mockImplementation((url, options) => {
      if (String(url).startsWith('/api/transactions?'))
        return jsonResponse(mockTransactionsPayload);
      if (url === '/api/transactions/stats') return jsonResponse(mockStatsPayload);
      if (url === '/api/transactions/import' && options?.method === 'POST') {
        return jsonResponse({ success: true, imported: 12 });
      }
      return Promise.reject(new Error(`Unhandled request ${url}`));
    });

    render(<TransactionsView />);
    await screen.findByText('DLD Transactions');

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['tx'], 'transactions.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const banner = await screen.findByRole('status');
    expect(banner).toHaveTextContent('Successfully imported 12 transactions');
  });

  it('shows error banner when CSV import fails', async () => {
    mockAuthFetch.mockImplementation((url, options) => {
      if (String(url).startsWith('/api/transactions?'))
        return jsonResponse(mockTransactionsPayload);
      if (url === '/api/transactions/stats') return jsonResponse(mockStatsPayload);
      if (url === '/api/transactions/import' && options?.method === 'POST') {
        return Promise.reject(new Error('import failed'));
      }
      return Promise.reject(new Error(`Unhandled request ${url}`));
    });

    render(<TransactionsView />);
    await screen.findByText('DLD Transactions');

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['tx'], 'transactions.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const banner = await screen.findByRole('alert');
    expect(banner).toHaveTextContent('Failed to import file');
  });

  it('never calls window.alert()', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    mockAuthFetch.mockImplementation((url, options) => {
      if (String(url).startsWith('/api/transactions?'))
        return jsonResponse(mockTransactionsPayload);
      if (url === '/api/transactions/stats') return jsonResponse(mockStatsPayload);
      if (url === '/api/transactions/import' && options?.method === 'POST') {
        return Promise.reject(new Error('import failed'));
      }
      return Promise.reject(new Error(`Unhandled request ${url}`));
    });

    render(<TransactionsView />);
    await screen.findByText('DLD Transactions');

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['tx'], 'transactions.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(alertSpy).not.toHaveBeenCalled();
  });
});
