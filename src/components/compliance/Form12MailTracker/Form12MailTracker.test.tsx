import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form12MailTracker } from './Form12MailTracker';

describe('Form12MailTracker Component', () => {
  it('renders statutory 12-month eviction notice tracker and legal basis', () => {
    render(<Form12MailTracker />);
    expect(screen.getByTestId('form-12-mail-tracker')).toBeDefined();
    expect(screen.getByText(/12-Month Eviction Notice Tracker/i)).toBeDefined();
    expect(screen.getByText(/DUBAI LAW 26\/2007/i)).toBeDefined();
    expect(screen.getByText(/Villa 44, Springs 11, Emirates Living/i)).toBeDefined();
  });
});
