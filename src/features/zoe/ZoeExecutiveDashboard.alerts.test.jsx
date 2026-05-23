import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import ZoeExecutiveDashboard from './ZoeExecutiveDashboard';

const createStore = state => ({
  getState: () => state,
  subscribe: () => () => {},
  dispatch: vi.fn(),
});

describe('ZoeExecutiveDashboard — alert elimination', () => {
  it('shows inline status banner on escalation approve and never calls window.alert', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const store = createStore({
      wednesday: {
        business: { metrics: {}, requirementsMatrix: [], approvedChanges: [] },
        escalations: {
          active: [
            {
              id: 'esc-001',
              severity: 'high',
              service: 'api-gateway',
              message: 'API latency threshold exceeded',
              timestamp: new Date().toISOString(),
            },
          ],
        },
        timeline: {
          morning: { complete: true, tasks: [] },
          afternoon: { complete: false, tasks: [] },
          evening: { complete: false, tasks: [] },
        },
      },
    });

    render(
      <Provider store={store}>
        <ZoeExecutiveDashboard />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Escalations/i }));
    fireEvent.click(screen.getByRole('button', { name: /Approve & Continue/i }));

    const banner = screen.getByTestId('zoe-escalation-status-banner');
    expect(banner).toHaveTextContent('Approved: esc-001');
    expect(alertSpy).not.toHaveBeenCalled();
  });
});
