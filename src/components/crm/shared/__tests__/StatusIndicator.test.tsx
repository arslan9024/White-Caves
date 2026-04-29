/**
 * StatusIndicator Component Tests
 * ================================
 * Tests for the CRM status dot — 5 statuses, 3 sizes, label toggle, pulse animation
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusIndicator from '../StatusIndicator';

describe('StatusIndicator', () => {
  // ──────────────────────────────────────────────────────────
  // Defaults
  // ──────────────────────────────────────────────────────────

  it('renders with default props (idle / medium / no label)', () => {
    const { container } = render(<StatusIndicator />);
    const indicator = container.querySelector('.status-indicator');
    expect(indicator).toBeTruthy();
    expect(indicator?.className).toContain('status-md');
    expect(indicator?.getAttribute('title')).toBe('Idle');
    expect(container.querySelector('.status-label')).toBeNull();
  });

  // ──────────────────────────────────────────────────────────
  // Status Variants (color + label text + title)
  // ──────────────────────────────────────────────────────────

  const statuses = [
    { status: 'active' as const, label: 'Active', color: 'rgb(16, 185, 129)' },
    { status: 'idle' as const, label: 'Idle', color: 'rgb(107, 114, 128)' },
    { status: 'busy' as const, label: 'Busy', color: 'rgb(245, 158, 11)' },
    { status: 'offline' as const, label: 'Offline', color: 'rgb(239, 68, 68)' },
    { status: 'online' as const, label: 'Online', color: 'rgb(16, 185, 129)' },
  ];

  it.each(statuses)(
    'renders "$status" with correct color and title',
    ({ status, label, color }) => {
      const { container } = render(
        <StatusIndicator status={status} showLabel />
      );
      const dot = container.querySelector('.status-dot') as HTMLElement;
      expect(dot.style.backgroundColor).toBe(color);
      expect(container.querySelector('.status-indicator')?.getAttribute('title')).toBe(label);
      expect(screen.getByText(label)).toBeTruthy();
    },
  );

  // ──────────────────────────────────────────────────────────
  // Sizes
  // ──────────────────────────────────────────────────────────

  it('applies status-sm class for small size', () => {
    const { container } = render(<StatusIndicator size="small" />);
    expect(container.querySelector('.status-sm')).toBeTruthy();
  });

  it('applies status-md class for medium size', () => {
    const { container } = render(<StatusIndicator size="medium" />);
    expect(container.querySelector('.status-md')).toBeTruthy();
  });

  it('applies status-lg class for large size', () => {
    const { container } = render(<StatusIndicator size="large" />);
    expect(container.querySelector('.status-lg')).toBeTruthy();
  });

  // ──────────────────────────────────────────────────────────
  // Label Toggle
  // ──────────────────────────────────────────────────────────

  it('hides label by default', () => {
    const { container } = render(<StatusIndicator status="active" />);
    expect(container.querySelector('.status-label')).toBeNull();
  });

  it('shows label when showLabel is true', () => {
    render(<StatusIndicator status="busy" showLabel />);
    expect(screen.getByText('Busy')).toBeTruthy();
  });

  // ──────────────────────────────────────────────────────────
  // Pulse Animation
  // ──────────────────────────────────────────────────────────

  it('applies pulse class for "active" status', () => {
    const { container } = render(<StatusIndicator status="active" />);
    expect(container.querySelector('.status-dot.pulse')).toBeTruthy();
  });

  it('applies pulse class for "online" status', () => {
    const { container } = render(<StatusIndicator status="online" />);
    expect(container.querySelector('.status-dot.pulse')).toBeTruthy();
  });

  it('does NOT apply pulse class for "idle" status', () => {
    const { container } = render(<StatusIndicator status="idle" />);
    expect(container.querySelector('.status-dot.pulse')).toBeNull();
  });

  it('does NOT apply pulse class for "busy" status', () => {
    const { container } = render(<StatusIndicator status="busy" />);
    expect(container.querySelector('.status-dot.pulse')).toBeNull();
  });

  it('does NOT apply pulse class for "offline" status', () => {
    const { container } = render(<StatusIndicator status="offline" />);
    expect(container.querySelector('.status-dot.pulse')).toBeNull();
  });

  // ──────────────────────────────────────────────────────────
  // Accessibility
  // ──────────────────────────────────────────────────────────

  it('sets title attribute for tooltip', () => {
    const { container } = render(<StatusIndicator status="online" />);
    expect(container.querySelector('.status-indicator')?.getAttribute('title')).toBe('Online');
  });
});
