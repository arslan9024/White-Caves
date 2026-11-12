import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BackendStatusBanner } from './BackendStatusBanner';
import { useBackendStatus } from '../../../hooks/useBackendStatus';

vi.mock('../../../hooks/useBackendStatus', () => ({ useBackendStatus: vi.fn() }));
const statusMock = vi.mocked(useBackendStatus);

beforeEach(() => vi.clearAllMocks());

describe('BackendStatusBanner', () => {
  it('shows checking state and hides after recovery', () => {
    statusMock.mockReturnValue({ status: 'checking', lastChecked: null });
    const { rerender } = render(<BackendStatusBanner />);
    expect(screen.getByRole('status')).toHaveTextContent('Checking server connection');
    statusMock.mockReturnValue({ status: 'online', lastChecked: new Date() });
    rerender(<BackendStatusBanner />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  it('can dismiss an outage and resurfaces a different failure', () => {
    statusMock.mockReturnValue({ status: 'offline', lastChecked: new Date() });
    const { rerender } = render(<BackendStatusBanner />);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss server status banner' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    statusMock.mockReturnValue({ status: 'degraded', lastChecked: new Date() });
    rerender(<BackendStatusBanner />);
    expect(screen.getByRole('status')).toHaveTextContent('Reconnecting');
  });
  it('resurfaces the same outage after a successful recovery', () => {
    statusMock.mockReturnValue({ status: 'offline', lastChecked: new Date() });
    const { rerender } = render(<BackendStatusBanner />);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss server status banner' }));
    statusMock.mockReturnValue({ status: 'online', lastChecked: new Date() });
    rerender(<BackendStatusBanner />);
    statusMock.mockReturnValue({ status: 'offline', lastChecked: new Date() });
    rerender(<BackendStatusBanner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
