import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotificationBadge from '../NotificationBadge';

describe('NotificationBadge', () => {
  // ─── Rendering & Count Display ────────────────────────────────────

  it('should render count', () => {
    render(<NotificationBadge count={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should return null when count is 0 and showZero is false', () => {
    const { container } = render(<NotificationBadge count={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render 0 when showZero is true', () => {
    render(<NotificationBadge count={0} showZero />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should display maxCount+ when count exceeds maxCount', () => {
    render(<NotificationBadge count={150} maxCount={99} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('should display exact count when equal to maxCount', () => {
    render(<NotificationBadge count={99} maxCount={99} />);
    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('should use custom maxCount', () => {
    render(<NotificationBadge count={15} maxCount={10} />);
    expect(screen.getByText('10+')).toBeInTheDocument();
  });

  // ─── Severity Classes ─────────────────────────────────────────────

  it('should apply badge-default class by default', () => {
    render(<NotificationBadge count={1} />);
    const badge = screen.getByText('1');
    expect(badge.className).toContain('badge-default');
  });

  it('should apply badge-info class', () => {
    render(<NotificationBadge count={1} severity="info" />);
    const badge = screen.getByText('1');
    expect(badge.className).toContain('badge-info');
  });

  it('should apply badge-warning class', () => {
    render(<NotificationBadge count={1} severity="warning" />);
    const badge = screen.getByText('1');
    expect(badge.className).toContain('badge-warning');
  });

  it('should apply badge-critical class', () => {
    render(<NotificationBadge count={1} severity="critical" />);
    const badge = screen.getByText('1');
    expect(badge.className).toContain('badge-critical');
  });

  it('should apply badge-success class', () => {
    render(<NotificationBadge count={1} severity="success" />);
    const badge = screen.getByText('1');
    expect(badge.className).toContain('badge-success');
  });

  // ─── Size Classes ─────────────────────────────────────────────────

  it('should apply badge-md class by default', () => {
    render(<NotificationBadge count={1} />);
    const badge = screen.getByText('1');
    expect(badge.className).toContain('badge-md');
  });

  it('should apply badge-sm class for small size', () => {
    render(<NotificationBadge count={1} size="small" />);
    const badge = screen.getByText('1');
    expect(badge.className).toContain('badge-sm');
  });

  it('should apply badge-lg class for large size', () => {
    render(<NotificationBadge count={1} size="large" />);
    const badge = screen.getByText('1');
    expect(badge.className).toContain('badge-lg');
  });

  // ─── Pulse Animation ──────────────────────────────────────────────

  it('should apply pulse class when pulse is true', () => {
    render(<NotificationBadge count={1} pulse />);
    const badge = screen.getByText('1');
    expect(badge.className).toContain('pulse');
  });

  it('should NOT apply pulse class by default', () => {
    render(<NotificationBadge count={1} />);
    const badge = screen.getByText('1');
    expect(badge.className).not.toMatch(/\bpulse\b/);
  });

  // ─── Accessibility ────────────────────────────────────────────────

  it('should have aria-label with notification count', () => {
    render(<NotificationBadge count={7} />);
    const badge = screen.getByLabelText('7 notifications');
    expect(badge).toBeInTheDocument();
  });

  it('should show actual count in aria-label even when display is maxCount+', () => {
    render(<NotificationBadge count={150} maxCount={99} />);
    const badge = screen.getByLabelText('150 notifications');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('99+');
  });

  // ─── displayName ──────────────────────────────────────────────────

  it('should have displayName set', () => {
    expect(NotificationBadge.displayName).toBe('NotificationBadge');
  });

  // ─── Base Class ───────────────────────────────────────────────────

  it('should always include notification-badge base class', () => {
    render(<NotificationBadge count={3} />);
    const badge = screen.getByText('3');
    expect(badge.className).toContain('notification-badge');
  });
});
