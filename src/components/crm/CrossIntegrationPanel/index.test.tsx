import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

const { mockAuthFetch, mockLoggerError } = vi.hoisted(() => ({
  mockAuthFetch: vi.fn(),
  mockLoggerError: vi.fn(),
}));

vi.mock('../../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

vi.mock('../../../utils/logger', () => ({
  createLogger: () => ({ error: mockLoggerError }),
}));

import CrossIntegrationPanel from './index';

const statusResponse = {
  success: true,
  data: {
    handlerCount: { 'linda:message_received': 2 },
    registeredAssistants: ['zoe', 'linda', 'future-assistant'],
    totalEventsEmitted: 1,
    ringBufferSize: 1,
    uptime: 10,
  },
};

const eventsResponse = {
  success: true,
  data: {
    count: 1,
    events: [
      {
        id: 'event-1',
        event: 'linda:message_received',
        payload: { message: 'private message body' },
        timestamp: '2026-10-21T10:00:00.000Z',
      },
    ],
  },
};

function createResponse(body: unknown): Response {
  return {
    ok: true,
    json: async () => body,
  } as Response;
}

describe('CrossIntegrationPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthFetch.mockImplementation((url: string) =>
      Promise.resolve(
        createResponse(url.includes('/status') ? statusResponse : eventsResponse)
      )
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('loads registered runtime integrations without rendering event payloads', async () => {
    render(<CrossIntegrationPanel />);

    expect(await screen.findByText('future-assistant')).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: 'Zoe — registered' })).toBeInTheDocument();
    expect(screen.getByText('2 handlers')).toBeInTheDocument();
    expect(screen.getByText('Event recorded')).toBeInTheDocument();
    expect(screen.queryByText('private message body')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledWith('/api/orchestrator/status');
      expect(mockAuthFetch).toHaveBeenCalledWith('/api/orchestrator/events?limit=5');
    });
  });

  it('shows an access-safe error when oversight status cannot be loaded', async () => {
    mockAuthFetch.mockRejectedValue(new Error('request failed'));
    render(<CrossIntegrationPanel />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Live oversight status is unavailable.'
    );
    expect(screen.queryByText('No integration events have been recorded')).not.toBeInTheDocument();
    expect(mockLoggerError).toHaveBeenCalledWith('Unable to load orchestrator oversight status.');
  });
});
