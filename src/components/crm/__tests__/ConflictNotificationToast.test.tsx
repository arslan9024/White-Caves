import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConflictNotificationToast } from '../ConflictNotificationToast';
import { ConflictResolution } from '../../utils/offlineCRDT';

describe('ConflictNotificationToast Component', () => {
  it('does not render when conflicts array is empty', () => {
    const { container } = render(<ConflictNotificationToast conflicts={[]} onDismiss={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders conflict details and winner information when conflicts exist', () => {
    const sampleConflicts: ConflictResolution[] = [
      {
        key: 'noteText',
        localValue: 'Local draft',
        remoteValue: 'Remote note',
        winningValue: 'Remote note',
        winningClient: 'broker-remote-01',
        timestamp: 1770000000000,
      },
    ];

    render(<ConflictNotificationToast conflicts={sampleConflicts} onDismiss={vi.fn()} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/CRDT Offline Conflict Resolved/i)).toBeInTheDocument();
    expect(screen.getByText(/Field: noteText/i)).toBeInTheDocument();
    expect(screen.getByText(/Remote note/i)).toBeInTheDocument();
  });

  it('calls onDismiss when close button or Acknowledge button is clicked', () => {
    const onDismiss = vi.fn();
    const sampleConflicts: ConflictResolution[] = [
      {
        key: 'rating',
        localValue: 3,
        remoteValue: 5,
        winningValue: 5,
        winningClient: 'broker-remote-02',
        timestamp: 1770000000000,
      },
    ];

    render(<ConflictNotificationToast conflicts={sampleConflicts} onDismiss={onDismiss} />);

    const ackButton = screen.getByText(/Acknowledge Resolution/i);
    fireEvent.click(ackButton);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
