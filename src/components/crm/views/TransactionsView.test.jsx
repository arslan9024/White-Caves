import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import TransactionsView from './TransactionsView';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
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

const mockTransactionsResponse = {
  data: {
    success: true,
    data: [],
    pagination: { page: 1, limit: 25, total: 0, pages: 0 },
  },
};

const mockStatsResponse = {
  data: {
    success: true,
    stats: {
      totalTransactions: 0,
      totalValue: 0,
      topAreas: [],
      propertyTypes: [],
    },
  },
};

const setupDefaultGets = () => {
  axios.get.mockImplementation(url => {
    if (String(url).startsWith('/api/transactions?')) {
      return Promise.resolve(mockTransactionsResponse);
    }
    if (url === '/api/transactions/stats') {
      return Promise.resolve(mockStatsResponse);
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
    axios.post.mockRejectedValueOnce(new Error('save failed'));

    render(<TransactionsView />);
    await screen.findByText('DLD Transactions');

    fireEvent.click(screen.getByRole('button', { name: /Add Transaction/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Create Transaction/i }));

    const banner = await screen.findByRole('alert');
    expect(banner).toHaveTextContent('Failed to save transaction');
    expect(banner).toHaveAttribute('data-testid', 'transactions-status-banner');
  });

  it('shows success banner when CSV import succeeds', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true, imported: 12 } });

    render(<TransactionsView />);
    await screen.findByText('DLD Transactions');

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['tx'], 'transactions.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const banner = await screen.findByRole('status');
    expect(banner).toHaveTextContent('Successfully imported 12 transactions');
  });

  it('shows error banner when CSV import fails', async () => {
    axios.post.mockRejectedValueOnce(new Error('import failed'));

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
    axios.post.mockRejectedValueOnce(new Error('import failed'));

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
