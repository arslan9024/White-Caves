import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActiveLoginSessionsCard } from './ActiveLoginSessionsCard';

describe('ActiveLoginSessionsCard Component', () => {
  it('renders active login sessions and revokes other device sessions', () => {
    render(<ActiveLoginSessionsCard />);
    expect(screen.getByTestId('active-login-sessions-card')).toBeDefined();
    expect(screen.getByText(/Active Devices & Zero-Trust Session Audits/i)).toBeDefined();
    expect(screen.getByText(/ALL SESSIONS ENCRYPTED/i)).toBeDefined();
    expect(screen.getByText(/MacBook Pro 16" \(Sonoma\)/i)).toBeDefined();
    expect(screen.getByText(/iPhone 15 Pro Max/i)).toBeDefined();

    const revokeBtn = screen.getByRole('button', { name: /Revoke All Other Device Sessions/i });
    fireEvent.click(revokeBtn);
    expect(screen.queryByText(/iPhone 15 Pro Max/i)).toBeNull();
    expect(screen.getByText(/MacBook Pro 16" \(Sonoma\)/i)).toBeDefined();
  });
});
