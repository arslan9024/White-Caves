import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SigningStatusBadge from '../SigningStatusBadge';

describe('SigningStatusBadge', () => {
  it('renders pending status by default', () => {
    render(<SigningStatusBadge />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders signed status label', () => {
    render(<SigningStatusBadge status="signed" />);
    expect(screen.getByText('Signed')).toBeInTheDocument();
  });

  it('has accessible status label', () => {
    render(<SigningStatusBadge status="opened" />);
    expect(screen.getByLabelText('Signature status: Opened')).toBeInTheDocument();
  });
});
