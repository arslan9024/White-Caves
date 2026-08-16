import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { PdcDepositReminderCalendar } from './PdcDepositReminderCalendar';
import { apiClient } from '../../../services/apiClient';

vi.mock('../../../services/apiClient', () => ({
  apiClient: {
    post: vi.fn().mockResolvedValue({
      data: {
        postDatedCheques: [
          { id: 'CHQ-001', amount: 30000, dueDate: '2025-12-01', status: 'DEPOSITED' }
        ]
      }
    })
  }
}));

describe('PdcDepositReminderCalendar Component', () => {
  it('renders PDC deposit reminder calendar and displays cheques from API', async () => {
    render(<PdcDepositReminderCalendar />);
    
    expect(screen.getByTestId('pdc-deposit-reminder-calendar')).toBeDefined();
    expect(screen.getByText(/PDC Deposit Reminder Calendar/i)).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText(/CHQ-001/i)).toBeDefined();
    });
    
    expect(screen.getAllByText(/DEPOSITED/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/30,000/i)).toBeDefined();
  });
});
