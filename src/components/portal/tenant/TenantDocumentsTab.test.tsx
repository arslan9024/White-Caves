/**
 * TenantDocumentsTab.test.tsx
 * Tests for Phase 2.11
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import TenantDocumentsTab from './TenantDocumentsTab';
import userReducer from '../../../store/userSlice';
import type { RootState } from '../../../store/store';

const mockTenant = {
  id: 'tenant-1',
  email: 'tenant@test.ae',
  name: 'Fatima Al-Mansoori',
  role: 'tenant',
  status: 'active',
  photoUrl: null,
};

const createMockStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: { user: userReducer },
    preloadedState: {
      user: {
        currentUser: mockTenant,
        isLoading: false,
        error: null,
      },
      ...preloadedState,
    },
  });

const renderWithStore = (
  component: React.ReactElement,
  preloadedState?: PreloadedState<RootState>
) => {
  const store = createMockStore(preloadedState);
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('TenantDocumentsTab', () => {
  it('renders all document rows by default', () => {
    renderWithStore(<TenantDocumentsTab />);

    expect(screen.getByTestId('tenant-document-row-td-001')).toBeInTheDocument();
    expect(screen.getByTestId('tenant-document-row-td-002')).toBeInTheDocument();
    expect(screen.getByTestId('tenant-document-row-td-003')).toBeInTheDocument();
  });

  it('filters by type', async () => {
    renderWithStore(<TenantDocumentsTab />);

    fireEvent.change(screen.getByTestId('tenant-document-type-filter'), {
      target: { value: 'ejari' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('tenant-document-row-td-002')).toBeInTheDocument();
      expect(screen.queryByTestId('tenant-document-row-td-001')).not.toBeInTheDocument();
    });
  });

  it('filters by search', async () => {
    renderWithStore(<TenantDocumentsTab />);

    fireEvent.change(screen.getByTestId('tenant-document-search'), {
      target: { value: 'Deposit' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('tenant-document-row-td-003')).toBeInTheDocument();
      expect(screen.queryByTestId('tenant-document-row-td-001')).not.toBeInTheDocument();
    });
  });

  it('shows empty state on unmatched filter', async () => {
    renderWithStore(<TenantDocumentsTab />);

    fireEvent.change(screen.getByTestId('tenant-document-search'), {
      target: { value: 'NoDoc' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('tenant-documents-empty-state')).toBeInTheDocument();
    });
  });

  it('renders download links', () => {
    renderWithStore(<TenantDocumentsTab />);

    expect(screen.getByTestId('tenant-document-download-td-001')).toHaveAttribute(
      'href',
      'https://example.com/docs/td-001.pdf'
    );
  });

  it('shows login-required state when unauthenticated', () => {
    renderWithStore(<TenantDocumentsTab />, {
      user: {
        currentUser: null,
        isLoading: false,
        error: null,
      },
    });

    expect(screen.getByText(/You must be logged in to view your documents/i)).toBeInTheDocument();
  });
});
