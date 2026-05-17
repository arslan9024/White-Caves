/**
 * TenantMaintenanceTab.test.tsx
 * Tests for Phase 2.10
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import TenantMaintenanceTab from './TenantMaintenanceTab';
import userReducer from '../../../store/userSlice';
import type { RootState } from '../../../store/store';

const baseRequests = [
  {
    id: 'tm-001',
    title: 'AC making noise',
    description: 'Outdoor unit rattling',
    priority: 'medium',
    status: 'open',
    createdAt: '2026-05-10T08:00:00.000Z',
  },
  {
    id: 'tm-002',
    title: 'Kitchen sink leakage',
    description: 'Water under sink cabinet',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2026-05-09T09:00:00.000Z',
  },
  {
    id: 'tm-003',
    title: 'Lobby light replacement',
    description: 'Light already fixed',
    priority: 'low',
    status: 'resolved',
    createdAt: '2026-05-08T10:00:00.000Z',
  },
];

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

describe('TenantMaintenanceTab', () => {
  beforeEach(() => {
    const requests = [...baseRequests];

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === 'string' ? input : input.toString();
        const method = init?.method ?? 'GET';

        if (url.includes('/api/leases?role=tenant&pageSize=1')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: [{ id: 'lease-1', propertyId: 'prop-123' }],
            }),
          } as Response;
        }

        if (url.includes('/api/maintenance?pageSize=50')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ success: true, data: requests }),
          } as Response;
        }

        if (url.includes('/api/maintenance') && method === 'POST') {
          const body = JSON.parse((init?.body as string) ?? '{}');
          const created = {
            id: 'tm-999',
            title: body.title,
            description: body.description ?? '',
            priority: body.priority ?? 'medium',
            status: 'open',
            createdAt: '2026-05-12T12:00:00.000Z',
          };
          return {
            ok: true,
            status: 200,
            json: async () => ({ success: true, data: created }),
          } as Response;
        }

        return {
          ok: false,
          status: 404,
          json: async () => ({ success: false, message: 'Not found' }),
        } as Response;
      })
    );
  });

  it('renders request form fields', () => {
    renderWithStore(<TenantMaintenanceTab />);

    expect(screen.getByTestId('tenant-maintenance-title-input')).toBeInTheDocument();
    expect(screen.getByTestId('tenant-maintenance-description-input')).toBeInTheDocument();
    expect(screen.getByTestId('tenant-maintenance-submit-btn')).toBeInTheDocument();
  });

  it('shows validation error when submitting without title', async () => {
    renderWithStore(<TenantMaintenanceTab />);

    await waitFor(() => {
      expect(screen.queryByTestId('tenant-maintenance-loading')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('tenant-maintenance-submit-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('tenant-maintenance-error')).toHaveTextContent(
        'Please enter an issue title.'
      );
    });
  });

  it('adds new request to list on submit (optimistic update)', async () => {
    renderWithStore(<TenantMaintenanceTab />);

    await waitFor(() => {
      expect(screen.queryByTestId('tenant-maintenance-loading')).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('tenant-maintenance-title-input'), {
      target: { value: 'Shower pressure issue' },
    });
    fireEvent.change(screen.getByTestId('tenant-maintenance-description-input'), {
      target: { value: 'Water pressure is too low.' },
    });
    fireEvent.click(screen.getByTestId('tenant-maintenance-submit-btn'));

    await waitFor(() => {
      expect(screen.getByText('Shower pressure issue')).toBeInTheDocument();
    });

    // Input fields should be cleared
    expect(screen.getByTestId('tenant-maintenance-title-input')).toHaveValue('');
    expect(screen.getByTestId('tenant-maintenance-description-input')).toHaveValue('');
  });

  it('shows newly created request row with status badge', async () => {
    renderWithStore(<TenantMaintenanceTab />);

    await waitFor(() => {
      expect(screen.queryByTestId('tenant-maintenance-loading')).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('tenant-maintenance-title-input'), {
      target: { value: 'Broken window latch' },
    });
    fireEvent.click(screen.getByTestId('tenant-maintenance-submit-btn'));

    await waitFor(() => {
      const row = screen.getByTestId('tenant-maintenance-row-tm-999');
      expect(row).toBeInTheDocument();
      expect(within(row).getByText('open')).toBeInTheDocument();
    });
  });

  it('allows typing in form inputs', () => {
    renderWithStore(<TenantMaintenanceTab />);

    fireEvent.change(screen.getByTestId('tenant-maintenance-title-input'), {
      target: { value: 'Shower pressure issue' },
    });
    fireEvent.change(screen.getByTestId('tenant-maintenance-description-input'), {
      target: { value: 'Water pressure is too low in the master shower.' },
    });

    expect(screen.getByDisplayValue('Shower pressure issue')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Water pressure is too low in the master shower.')
    ).toBeInTheDocument();
  });

  it('filters list by status', async () => {
    renderWithStore(<TenantMaintenanceTab />);

    await waitFor(() => {
      expect(screen.queryByTestId('tenant-maintenance-loading')).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('tenant-maintenance-status-filter'), {
      target: { value: 'closed' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('tenant-maintenance-row-tm-003')).toBeInTheDocument();
      expect(screen.queryByTestId('tenant-maintenance-row-tm-001')).not.toBeInTheDocument();
    });
  });

  it('filters list by search query', async () => {
    renderWithStore(<TenantMaintenanceTab />);

    await waitFor(() => {
      expect(screen.queryByTestId('tenant-maintenance-loading')).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('tenant-maintenance-search'), {
      target: { value: 'Kitchen sink leakage' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('tenant-maintenance-row-tm-002')).toBeInTheDocument();
      expect(screen.queryByTestId('tenant-maintenance-row-tm-001')).not.toBeInTheDocument();
    });
  });

  it('shows empty state for unmatched filter/search', async () => {
    renderWithStore(<TenantMaintenanceTab />);

    await waitFor(() => {
      expect(screen.queryByTestId('tenant-maintenance-loading')).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('tenant-maintenance-search'), {
      target: { value: 'NoMatchIssue' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('tenant-maintenance-empty-state')).toBeInTheDocument();
    });
  });

  it('shows login-required state when unauthenticated', () => {
    renderWithStore(<TenantMaintenanceTab />, {
      user: {
        currentUser: null,
        isLoading: false,
        error: null,
      },
    });

    expect(
      screen.getByText(/You must be logged in to view and submit maintenance requests/i)
    ).toBeInTheDocument();
  });
});
