import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock lucide-react to avoid jsdom SVG hang
vi.mock('lucide-react', () => ({
  AlertTriangle: (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'alert-triangle', ...props }),
  CheckCircle: (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'check-circle', ...props }),
  X: (props: Record<string, unknown>) => React.createElement('svg', { 'data-testid': 'x-icon', ...props }),
}));

import { ConflictResolutionToast } from '../ConflictResolutionToast';

describe('ConflictResolutionToast Component', () => {
  it('renders synced changes message when syncedCount is active', () => {
    render(<ConflictResolutionToast syncedCount={3} autoHideDuration={0} />);

    expect(screen.getByText('Offline Changes Synced')).toBeInTheDocument();
    expect(screen.getByText(/3 offline actions synchronized/)).toBeInTheDocument();
  });

  it('renders conflict reconciliation message when conflicts exist', () => {
    const conflicts = [
      {
        key: 'note',
        localValue: 'local',
        remoteValue: 'remote',
        winningValue: 'local',
        winningClient: 'client-1',
        timestamp: Date.now(),
      },
    ];

    render(<ConflictResolutionToast syncedCount={1} conflicts={conflicts} autoHideDuration={0} />);

    expect(screen.getByText('Offline Edits Reconciled')).toBeInTheDocument();
    expect(screen.getByText(/Auto-resolved 1 concurrent field conflict/)).toBeInTheDocument();
  });

  it('dismisses toast when close button is clicked', () => {
    const onDismiss = vi.fn();
    render(<ConflictResolutionToast syncedCount={1} autoHideDuration={0} onDismiss={onDismiss} />);

    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);

    expect(onDismiss).toHaveBeenCalled();
  });
});
