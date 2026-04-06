/**
 * BigTileCard Tests
 * =================
 * Covers rendering, props, variants, interactions, icons, status badges,
 * children slot, value display, actions menu, and accessibility.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BigTileCard from '../BigTileCard';

// Stub icon component matching lucide-react pattern
function StubIcon({ size }: { size: number }) {
  return <svg data-testid="stub-icon" width={size} height={size} />;
}

describe('BigTileCard', () => {
  // ── Basic Rendering ───────────────────────────────────────────────

  it('renders with title only', () => {
    render(<BigTileCard title="Revenue Card" />);
    expect(screen.getByText('Revenue Card')).toBeInTheDocument();
  });

  it('renders title as an h4 element', () => {
    render(<BigTileCard title="Title Tag" />);
    const heading = screen.getByText('Title Tag');
    expect(heading.tagName).toBe('H4');
  });

  it('renders subtitle when provided', () => {
    render(<BigTileCard title="Card" subtitle="Sub text here" />);
    expect(screen.getByText('Sub text here')).toBeInTheDocument();
  });

  it('does not render subtitle element when not provided', () => {
    const { container } = render(<BigTileCard title="Card" />);
    expect(container.querySelector('.tile-subtitle')).toBeNull();
  });

  // ── Value Display ─────────────────────────────────────────────────

  it('renders string value', () => {
    render(<BigTileCard title="Revenue" value="$25,000" />);
    expect(screen.getByText('$25,000')).toBeInTheDocument();
  });

  it('renders numeric value', () => {
    render(<BigTileCard title="Count" value={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders ReactNode value', () => {
    render(
      <BigTileCard
        title="Custom"
        value={<span data-testid="custom-value">Rich</span>}
      />
    );
    expect(screen.getByTestId('custom-value')).toBeInTheDocument();
  });

  it('does not render tile-value when value is undefined', () => {
    const { container } = render(<BigTileCard title="Card" />);
    expect(container.querySelector('.tile-value')).toBeNull();
  });

  it('renders tile-value when value is 0 (falsy but defined)', () => {
    const { container } = render(<BigTileCard title="Card" value={0} />);
    expect(container.querySelector('.tile-value')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  // ── Children Slot ─────────────────────────────────────────────────

  it('renders children in tile-body', () => {
    const { container } = render(
      <BigTileCard title="Card">
        <p data-testid="child">Body content</p>
      </BigTileCard>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(container.querySelector('.tile-body')).toBeInTheDocument();
  });

  it('does not render tile-body when no children', () => {
    const { container } = render(<BigTileCard title="Card" />);
    expect(container.querySelector('.tile-body')).toBeNull();
  });

  // ── Icon ──────────────────────────────────────────────────────────

  it('renders icon when provided', () => {
    render(<BigTileCard title="Card" icon={StubIcon} />);
    expect(screen.getByTestId('stub-icon')).toBeInTheDocument();
  });

  it('passes size=20 to icon component', () => {
    render(<BigTileCard title="Card" icon={StubIcon} />);
    const svg = screen.getByTestId('stub-icon');
    expect(svg.getAttribute('width')).toBe('20');
    expect(svg.getAttribute('height')).toBe('20');
  });

  it('does not render tile-icon wrapper when no icon', () => {
    const { container } = render(<BigTileCard title="Card" />);
    expect(container.querySelector('.tile-icon')).toBeNull();
  });

  it('applies color to icon container background', () => {
    const { container } = render(
      <BigTileCard title="Card" icon={StubIcon} color="#FF5733" />
    );
    const iconDiv = container.querySelector('.tile-icon') as HTMLElement;
    // jsdom normalizes hex+alpha → rgba; check color applied correctly
    expect(iconDiv.style.color).toBe('rgb(255, 87, 51)');
    // Background contains the color with transparency
    expect(iconDiv.style.background).toContain('rgba(255, 87, 51');
  });

  // ── Status Badge ──────────────────────────────────────────────────

  it('renders status badge with text', () => {
    render(<BigTileCard title="Card" status="Active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies statusColor to badge styling', () => {
    render(<BigTileCard title="Card" status="Hot" statusColor="#E74C3C" />);
    const badge = screen.getByText('Hot');
    expect(badge.style.color).toBe('rgb(231, 76, 60)');
  });

  it('falls back to accent color when statusColor is not provided', () => {
    render(<BigTileCard title="Card" status="New" color="#10B981" />);
    const badge = screen.getByText('New');
    expect(badge.style.color).toBe('rgb(16, 185, 129)');
  });

  it('does not render status span when status is not provided', () => {
    const { container } = render(<BigTileCard title="Card" />);
    expect(container.querySelector('.tile-status')).toBeNull();
  });

  // ── Actions Menu ──────────────────────────────────────────────────

  it('renders menu button when actions is true', () => {
    const { container } = render(<BigTileCard title="Card" actions />);
    expect(container.querySelector('.tile-menu-btn')).toBeInTheDocument();
  });

  it('does not render menu button when actions is false/undefined', () => {
    const { container } = render(<BigTileCard title="Card" />);
    expect(container.querySelector('.tile-menu-btn')).toBeNull();
  });

  // ── Click Interaction ─────────────────────────────────────────────

  it('fires onClick when card is clicked', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <BigTileCard title="Card" onClick={handleClick} />
    );
    fireEvent.click(container.querySelector('.big-tile-card')!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('adds clickable class when onClick is provided', () => {
    const { container } = render(
      <BigTileCard title="Card" onClick={() => {}} />
    );
    expect(container.querySelector('.big-tile-card.clickable')).toBeInTheDocument();
  });

  it('does not add clickable class when onClick is not provided', () => {
    const { container } = render(<BigTileCard title="Card" />);
    expect(container.querySelector('.big-tile-card.clickable')).toBeNull();
  });

  it('renders ExternalLink icon when onClick is provided', () => {
    const { container } = render(
      <BigTileCard title="Card" onClick={() => {}} />
    );
    expect(container.querySelector('.tile-link-icon')).toBeInTheDocument();
  });

  it('does not render ExternalLink icon without onClick', () => {
    const { container } = render(<BigTileCard title="Card" />);
    expect(container.querySelector('.tile-link-icon')).toBeNull();
  });

  // ── Variants ──────────────────────────────────────────────────────

  it('uses default variant by default', () => {
    const { container } = render(<BigTileCard title="Card" />);
    const card = container.querySelector('.big-tile-card');
    expect(card?.classList.contains('default')).toBe(true);
  });

  it('applies highlight variant class', () => {
    const { container } = render(
      <BigTileCard title="Card" variant="highlight" />
    );
    const card = container.querySelector('.big-tile-card');
    expect(card?.classList.contains('highlight')).toBe(true);
  });

  it('applies compact variant class', () => {
    const { container } = render(
      <BigTileCard title="Card" variant="compact" />
    );
    const card = container.querySelector('.big-tile-card');
    expect(card?.classList.contains('compact')).toBe(true);
  });

  // ── Color / CSS Variable ──────────────────────────────────────────

  it('sets --tile-accent CSS variable to provided color', () => {
    const { container } = render(
      <BigTileCard title="Card" color="#8B5CF6" />
    );
    const card = container.querySelector('.big-tile-card') as HTMLElement;
    expect(card.style.getPropertyValue('--tile-accent')).toBe('#8B5CF6');
  });

  it('defaults --tile-accent to var(--assistant-color, #0EA5E9)', () => {
    const { container } = render(<BigTileCard title="Card" />);
    const card = container.querySelector('.big-tile-card') as HTMLElement;
    expect(card.style.getPropertyValue('--tile-accent')).toBe(
      'var(--assistant-color, #0EA5E9)'
    );
  });

  // ── DisplayName ───────────────────────────────────────────────────

  it('has displayName set to BigTileCard', () => {
    expect(BigTileCard.displayName).toBe('BigTileCard');
  });

  // ── Combination Rendering ─────────────────────────────────────────

  it('renders all props together correctly', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <BigTileCard
        title="Total Sales"
        subtitle="Q1 2026"
        icon={StubIcon}
        value="$1.2M"
        status="On Track"
        statusColor="#22C55E"
        actions
        onClick={handleClick}
        color="#3B82F6"
        variant="highlight"
      >
        <span data-testid="detail">Detail info</span>
      </BigTileCard>
    );

    expect(screen.getByText('Total Sales')).toBeInTheDocument();
    expect(screen.getByText('Q1 2026')).toBeInTheDocument();
    expect(screen.getByTestId('stub-icon')).toBeInTheDocument();
    expect(screen.getByText('$1.2M')).toBeInTheDocument();
    expect(screen.getByText('On Track')).toBeInTheDocument();
    expect(container.querySelector('.tile-menu-btn')).toBeInTheDocument();
    expect(container.querySelector('.tile-link-icon')).toBeInTheDocument();
    expect(screen.getByTestId('detail')).toBeInTheDocument();

    const card = container.querySelector('.big-tile-card') as HTMLElement;
    expect(card.classList.contains('highlight')).toBe(true);
    expect(card.classList.contains('clickable')).toBe(true);
    expect(card.style.getPropertyValue('--tile-accent')).toBe('#3B82F6');

    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
