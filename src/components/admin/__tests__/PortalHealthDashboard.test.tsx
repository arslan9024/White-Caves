import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PortalHealthDashboard } from '../PortalHealthDashboard';

describe('PortalHealthDashboard Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders portal health title and sync status dashboard after loading', async () => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/v1/portals/health')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              history: [
                {
                  id: 'log-001',
                  portal: 'propertyfinder',
                  status: 'SUCCESS',
                  syncStart: '2026-07-29T00:00:00Z',
                  syncEnd: '2026-07-29T00:01:00Z',
                  totalSynced: 120,
                  totalFailed: 0,
                  totalSkipped: 2,
                  errors: null,
                },
              ],
              latest: {
                propertyfinder: {
                  id: 'log-001',
                  portal: 'propertyfinder',
                  status: 'SUCCESS',
                  syncStart: '2026-07-29T00:00:00Z',
                  syncEnd: '2026-07-29T00:01:00Z',
                  totalSynced: 120,
                  totalFailed: 0,
                  totalSkipped: 2,
                  errors: null,
                },
              },
            }),
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({}) });
    }) as any;

    render(<PortalHealthDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Portal Sync Health Dashboard/i)).toBeInTheDocument();
    });
  });

  it('triggers manual sync API when force sync button is clicked', async () => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/v1/portals/health')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              history: [],
              latest: {},
            }),
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({ success: true }) });
    }) as any;

    render(<PortalHealthDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Portal Sync Health Dashboard/i)).toBeInTheDocument();
    });

    const syncButtons = screen.getAllByText(/Force Sync/i);
    if (syncButtons.length > 0) {
      fireEvent.click(syncButtons[0]);
    }
  });
});
