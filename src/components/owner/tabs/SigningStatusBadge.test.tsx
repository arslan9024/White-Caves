import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SigningStatusBadge, { type SignatureStatus } from './SigningStatusBadge';

describe('SigningStatusBadge', () => {
  const statuses: SignatureStatus[] = ['pending', 'sent', 'opened', 'signed', 'rejected', 'expired'];

  it.each(statuses)('renders label for status "%s"', (status) => {
    render(<SigningStatusBadge status={status} />);
    const capitalized = status.charAt(0).toUpperCase() + status.slice(1);
    expect(screen.getByText(capitalized)).toBeTruthy();
  });

  it.each(statuses)('applies CSS class for status "%s"', (status) => {
    const { container } = render(<SigningStatusBadge status={status} />);
    const badge = container.querySelector('.signature-badge') as HTMLElement;
    expect(badge).toBeTruthy();
    expect(badge.className).toContain(`signature-badge--${status}`);
  });

  it.each(statuses)('sets aria-label for status "%s"', (status) => {
    render(<SigningStatusBadge status={status} />);
    const capitalized = status.charAt(0).toUpperCase() + status.slice(1);
    const badge = screen.getByRole('generic', { name: `Signature status: ${capitalized}` });
    expect(badge).toBeTruthy();
  });

  it('defaults to "pending" when no status prop is given', () => {
    render(<SigningStatusBadge />);
    expect(screen.getByText('Pending')).toBeTruthy();
  });

  it('renders a span element with base class', () => {
    const { container } = render(<SigningStatusBadge status="signed" />);
    const badge = container.querySelector('span.signature-badge');
    expect(badge).toBeTruthy();
  });
});
