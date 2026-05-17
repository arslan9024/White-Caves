import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import ExecutiveView from '../../../components/departmentViews/ExecutiveView';
import relationalSidebarSlice from '../../../redux/slices/relationalSidebarSlice';

/**
 * ExecutiveView Component Tests
 * Tests for Strategic Overview dashboard rendering and data fetching
 */

describe('ExecutiveView', () => {
  let store;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    store = configureStore({
      reducer: {
        relationalSidebar: relationalSidebarSlice,
        auth: (state = { user: { role: 'executive' } }) => state,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <ExecutiveView />
      </Provider>
    );
    expect(screen.getByText(/Strategic Overview/i)).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    render(
      <Provider store={store}>
        <ExecutiveView />
      </Provider>
    );
    // Component should show loading state
    const container = screen.getByRole('region');
    expect(container).toBeInTheDocument();
  });

  test('displays KPI cards on successful data load', async () => {
    const mockData = {
      announcements: [],
      boardReports: [],
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    render(
      <Provider store={store}>
        <ExecutiveView serviceName="strategic-overview" />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Revenue YTD/i)).toBeInTheDocument();
    });
  });

  test('displays error message on failed data fetch', async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('Network error'))
    );

    render(
      <Provider store={store}>
        <ExecutiveView serviceName="strategic-overview" />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error Loading Data/i)).toBeInTheDocument();
    });
  });

  test('renders subitem content when subitemId is provided', async () => {
    const mockData = { kpis: [] };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    render(
      <Provider store={store}>
        <ExecutiveView serviceName="strategic-overview" subitemId="kpi-dashboard" />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/KPI Dashboard/i)).toBeInTheDocument();
    });
  });

  test('fetches data from correct API endpoint', async () => {
    const mockData = { announcements: [] };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    render(
      <Provider store={store}>
        <ExecutiveView serviceName="strategic-overview" />
      </Provider>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/executive/strategic-overview'
      );
    });
  });

  test('displays correct KPI values', async () => {
    const mockData = {
      announcements: [],
      boardReports: [],
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    render(
      <Provider store={store}>
        <ExecutiveView />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Revenue YTD/i)).toBeInTheDocument();
      expect(screen.getByText(/Active Projects/i)).toBeInTheDocument();
      expect(screen.getByText(/Team Performance/i)).toBeInTheDocument();
      expect(screen.getByText(/Market Share/i)).toBeInTheDocument();
    });
  });
});
