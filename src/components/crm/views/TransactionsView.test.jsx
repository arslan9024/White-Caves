import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TransactionsView from './TransactionsView';

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

const jsonResponse = (payload, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => payload,
});

const routeDefaultGets = (url, init = {}) => {
  const method = (init.method || 'GET').toUpperCase();
  if (method === 'GET' && String(url).startsWith('/api/transactions?')) {
    return Promise.resolve(jsonResponse(mockTransactionsPayload));
  }
  if (method === 'GET' && url === '/api/transactions/stats') {
    return Promise.resolve(jsonResponse(mockStatsPayload));
  }
  return Promise.reject(new Error(`Unhandled ${method} ${url}`));
};

let fetchMock;

const setupDefaultGets = () => {
  fetchMock = vi.fn(routeDefaultGets);
  vi.stubGlobal('fetch', fetchMock);
};

const mockPost = handler => {
  fetchMock.mockImplementation((url, init = {}) => {
    const method = (init.method || 'GET').toUpperCase();
    if (method === 'POST') {
      return handler(url, init);
    }
    return routeDefaultGets(url, init);
  });
};

describe('TransactionsView — alert elimination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupDefaultGets();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders without any status banner initially', async () => {
    render(<TransactionsView />);
    expect(await screen.findByText('DLD Transactions')).toBeInTheDocument();
    await screen.findByText('No Transactions Found');
    expect(screen.queryByTestId('transactions-status-banner')).not.toBeInTheDocument();
  });

  it('shows error banner when saving a transaction fails', async () => {
    mockPost(url => {
      if (url === '/api/transactions') {
        return Promise.reject(new Error('save failed'));
      }
      return Promise.reject(new Error(`Unhandled POST ${url}`));
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
    mockPost(url => {
      if (url === '/api/transactions/import') {
        return Promise.resolve(jsonResponse({ success: true, imported: 12 }));
      }
      return Promise.reject(new Error(`Unhandled POST ${url}`));
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
    mockPost(url => {
      if (url === '/api/transactions/import') {
        return Promise.reject(new Error('import failed'));
      }
      return Promise.reject(new Error(`Unhandled POST ${url}`));
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
    mockPost(url => {
      if (url === '/api/transactions/import') {
        return Promise.reject(new Error('import failed'));
      }
      return Promise.reject(new Error(`Unhandled POST ${url}`));
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
