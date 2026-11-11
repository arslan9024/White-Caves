import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SuggestionsTab from '../SuggestionsTab';

describe('SuggestionsTab', () => {
  const mockSuggestions = [
    {
      id: 'sug-1',
      title: 'Automate Ejari Expiry Notifications',
      description: 'Send automated WhatsApp alerts 90/60/30 days before tenancy lease expiry.',
      type: 'process_improvement',
      priority: 'high',
    },
  ];

  it('renders suggestions list and handles delegation modal interaction', () => {
    const onStatusChange = vi.fn();
    const onDelegateToDept = vi.fn();

    render(
      <SuggestionsTab
        suggestions={mockSuggestions}
        unreviewedCount={1}
        criticalCount={1}
        onStatusChange={onStatusChange}
        onDelegateToDept={onDelegateToDept}
      />
    );

    expect(screen.getByText('Automate Ejari Expiry Notifications')).toBeInTheDocument();

    // Click Delegate button to open modal
    const delegateBtn = screen.getByTestId('delegate-btn-sug-1');
    fireEvent.click(delegateBtn);

    expect(screen.getByTestId('zoe-delegation-modal')).toBeInTheDocument();
    expect(screen.getByText('Zoe Executive Delegation')).toBeInTheDocument();

    // Select target department and confirm
    const deptSelect = screen.getByTestId('delegation-dept-select');
    fireEvent.change(deptSelect, { target: { value: 'DEPT-11' } });

    const confirmBtn = screen.getByTestId('confirm-delegation-btn');
    fireEvent.click(confirmBtn);

    expect(onDelegateToDept).toHaveBeenCalledWith(
      'sug-1',
      'DEPT-11',
      expect.stringContaining('Automate Ejari Expiry Notifications')
    );
    expect(onStatusChange).toHaveBeenCalledWith('sug-1', 'reviewed');
  });
});
