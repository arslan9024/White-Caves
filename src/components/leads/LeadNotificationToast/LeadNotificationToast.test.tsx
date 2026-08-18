import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LeadNotificationToast } from './LeadNotificationToast';
describe('LeadNotificationToast', () => {
  it('renders toast container', () => {
    render(<LeadNotificationToast />);
    expect(screen.getByTestId('lead-notification-toast')).toBeTruthy();
  });
});
