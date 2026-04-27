import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StatCard from '../StatCard';

describe('StatCard', () => {
  // ─── Basic Rendering ──────────────────────────────────────────────

  it('should render label and value', () => {
    render(<StatCard label="Total Leads" value={42} />);
    expect(screen.getByText('Total Leads')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should render string value', () => {
    render(<StatCard label="Revenue" value="AED 1.2M" />);
    expect(screen.getByText('AED 1.2M')).toBeInTheDocument();
  });

  it('should render numeric value of 0', () => {
    render(<StatCard label="Errors" value={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  // ─── Icon Rendering ───────────────────────────────────────────────

  it('should render icon when provided', () => {
    const MockIcon = ({ size }: { size?: number | string }) => (
      <svg data-testid="mock-icon" width={size} height={size} />
    );
    render(<StatCard label="Leads" value={10} icon={MockIcon} />);
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('should not render icon container when no icon', () => {
    const { container } = render(<StatCard label="Leads" value={10} />);
    expect(container.querySelector('.stat-icon')).not.toBeInTheDocument();
  });

  it('should pass size 20 to icon for default size', () => {
    const MockIcon = ({ size }: { size?: number | string }) => (
      <svg data-testid="mock-icon" data-size={size} />
    );
    render(<StatCard label="Leads" value={10} icon={MockIcon} size="default" />);
    expect(screen.getByTestId('mock-icon').getAttribute('data-size')).toBe('20');
  });

  it('should pass size 24 to icon for large size', () => {
    const MockIcon = ({ size }: { size?: number | string }) => (
      <svg data-testid="mock-icon" data-size={size} />
    );
    render(<StatCard label="Leads" value={10} icon={MockIcon} size="large" />);
    expect(screen.getByTestId('mock-icon').getAttribute('data-size')).toBe('24');
  });

  // ─── Change Indicator ─────────────────────────────────────────────

  it('should show positive change with percentage', () => {
    const { container } = render(<StatCard label="Leads" value={50} change={12} />);
    const changeEl = container.querySelector('.stat-change');
    expect(changeEl).toBeInTheDocument();
    expect(changeEl).toHaveClass('positive');
    expect(changeEl).toHaveTextContent('12%');
  });

  it('should show negative change with percentage', () => {
    const { container } = render(<StatCard label="Leads" value={50} change={-8} />);
    const changeEl = container.querySelector('.stat-change');
    expect(changeEl).toBeInTheDocument();
    expect(changeEl).toHaveClass('negative');
    expect(changeEl).toHaveTextContent('8%');
  });

  it('should NOT show change when change is 0', () => {
    const { container } = render(<StatCard label="Leads" value={50} change={0} />);
    expect(container.querySelector('.stat-change')).not.toBeInTheDocument();
  });

  it('should NOT show change when change is undefined', () => {
    const { container } = render(<StatCard label="Leads" value={50} />);
    expect(container.querySelector('.stat-change')).not.toBeInTheDocument();
  });

  it('should NOT show change when change is NaN', () => {
    const { container } = render(<StatCard label="Leads" value={50} change={NaN} />);
    expect(container.querySelector('.stat-change')).not.toBeInTheDocument();
  });

  it('should NOT show change when change is Infinity', () => {
    const { container } = render(<StatCard label="Leads" value={50} change={Infinity} />);
    expect(container.querySelector('.stat-change')).not.toBeInTheDocument();
  });

  // ─── Size Variants ────────────────────────────────────────────────

  it('should apply default size class', () => {
    const { container } = render(<StatCard label="Leads" value={10} />);
    expect(container.firstChild).toHaveClass('stat-card', 'default');
  });

  it('should apply large size class', () => {
    const { container } = render(<StatCard label="Leads" value={10} size="large" />);
    expect(container.firstChild).toHaveClass('stat-card', 'large');
  });

  // ─── Color / CSS Custom Property ──────────────────────────────────

  it('should set --card-accent CSS custom property', () => {
    const { container } = render(<StatCard label="Leads" value={10} color="#FF5733" />);
    const card = container.firstChild as HTMLElement;
    expect(card.style.getPropertyValue('--card-accent')).toBe('#FF5733');
  });

  it('should use default color when not specified', () => {
    const { container } = render(<StatCard label="Leads" value={10} />);
    const card = container.firstChild as HTMLElement;
    expect(card.style.getPropertyValue('--card-accent')).toBe('var(--assistant-color, #0EA5E9)');
  });

  // ─── Click Behavior ───────────────────────────────────────────────

  it('should call onClick when clicked', () => {
    const onClick = vi.fn();
    const { container } = render(<StatCard label="Leads" value={10} onClick={onClick} />);
    fireEvent.click(container.firstChild as HTMLElement);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('should add clickable class when onClick provided', () => {
    const { container } = render(<StatCard label="Leads" value={10} onClick={vi.fn()} />);
    expect(container.firstChild).toHaveClass('clickable');
  });

  it('should NOT have clickable class when no onClick', () => {
    const { container } = render(<StatCard label="Leads" value={10} />);
    expect(container.firstChild).not.toHaveClass('clickable');
  });

  // ─── displayName ──────────────────────────────────────────────────

  it('should have displayName set', () => {
    expect(StatCard.displayName).toBe('StatCard');
  });
});
