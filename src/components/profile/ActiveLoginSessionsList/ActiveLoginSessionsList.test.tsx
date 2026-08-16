import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActiveLoginSessionsList } from './ActiveLoginSessionsList';

describe('ActiveLoginSessionsList Component', () => {
  it('renders active login sessions and revokes other devices', () => {
    render(<ActiveLoginSessionsList />);
    expect(screen.getByTestId('active-login-sessions-list')).toBeDefined();
    expect(screen.getByText(/Active Login Sessions/i)).toBeDefined();
    expect(screen.getByText(/Chrome 124 \(Windows 11\)/i)).toBeDefined();
    expect(screen.getByText(/Safari \(iPhone 15 Pro\)/i)).toBeDefined();

    const revokeBtn = screen.getByRole('button', { name: /Revoke All Other Devices/i });
    fireEvent.click(revokeBtn);
    expect(screen.getByText(/Other Devices Revoked/i)).toBeDefined();
    expect(screen.queryByText(/Safari \(iPhone 15 Pro\)/i)).toBeNull();
  });
});
