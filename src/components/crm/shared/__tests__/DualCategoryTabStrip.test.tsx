import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DualCategoryTabStrip from '../DualCategoryTabStrip';

const mockCategories = [
  { id: 'leads', label: 'Leads' },
  { id: 'clients', label: 'Clients' },
  { id: 'deals', label: 'Deals' },
];

describe('DualCategoryTabStrip', () => {
  // ─── Basic Rendering ──────────────────────────────────────────────

  it('should render all category tabs', () => {
    render(
      <DualCategoryTabStrip categories={mockCategories} onCategoryChange={vi.fn()} />
    );
    expect(screen.getByText('Leads')).toBeInTheDocument();
    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(screen.getByText('Deals')).toBeInTheDocument();
  });

  it('should render empty when no categories provided', () => {
    const { container } = render(
      <DualCategoryTabStrip onCategoryChange={vi.fn()} />
    );
    const strip = container.querySelector('.dual-category-strip');
    expect(strip).toBeInTheDocument();
    expect(strip?.children).toHaveLength(0);
  });

  it('should have displayName set', () => {
    expect(DualCategoryTabStrip.displayName).toBe('DualCategoryTabStrip');
  });

  // ─── Active State ─────────────────────────────────────────────────

  it('should apply active class to active category', () => {
    const { container } = render(
      <DualCategoryTabStrip
        categories={mockCategories}
        activeCategory="clients"
        onCategoryChange={vi.fn()}
      />
    );
    const activeTab = container.querySelector('.category-tab.active');
    expect(activeTab).toBeInTheDocument();
    expect(activeTab).toHaveTextContent('Clients');
  });

  it('should not apply active class when no activeCategory', () => {
    const { container } = render(
      <DualCategoryTabStrip categories={mockCategories} onCategoryChange={vi.fn()} />
    );
    expect(container.querySelector('.category-tab.active')).not.toBeInTheDocument();
  });

  // ─── Click Handling ───────────────────────────────────────────────

  it('should call onCategoryChange with category id on click', () => {
    const onChange = vi.fn();
    render(
      <DualCategoryTabStrip categories={mockCategories} onCategoryChange={onChange} />
    );
    fireEvent.click(screen.getByText('Deals'));
    expect(onChange).toHaveBeenCalledWith('deals');
  });

  it('should call onCategoryChange for each clicked tab', () => {
    const onChange = vi.fn();
    render(
      <DualCategoryTabStrip categories={mockCategories} onCategoryChange={onChange} />
    );
    fireEvent.click(screen.getByText('Leads'));
    fireEvent.click(screen.getByText('Clients'));
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(1, 'leads');
    expect(onChange).toHaveBeenNthCalledWith(2, 'clients');
  });

  // ─── Counts ───────────────────────────────────────────────────────

  it('should show counts when provided', () => {
    render(
      <DualCategoryTabStrip
        categories={mockCategories}
        onCategoryChange={vi.fn()}
        counts={{ leads: 15, clients: 8, deals: 3 }}
      />
    );
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should not show count badge when count is not in map', () => {
    const { container } = render(
      <DualCategoryTabStrip
        categories={mockCategories}
        onCategoryChange={vi.fn()}
        counts={{ leads: 5 }}
      />
    );
    const countBadges = container.querySelectorAll('.tab-count');
    expect(countBadges).toHaveLength(1);
    expect(countBadges[0]).toHaveTextContent('5');
  });

  it('should show count of 0 when explicitly provided', () => {
    render(
      <DualCategoryTabStrip
        categories={mockCategories}
        onCategoryChange={vi.fn()}
        counts={{ leads: 0 }}
      />
    );
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  // ─── Icons ────────────────────────────────────────────────────────

  it('should render icons when provided', () => {
    const MockIcon = ({ size }: { size: number }) => (
      <svg data-testid="mock-icon" width={size} height={size} />
    );
    const categoriesWithIcon = [
      { id: 'leads', label: 'Leads', icon: MockIcon },
      { id: 'clients', label: 'Clients' },
    ];
    render(
      <DualCategoryTabStrip categories={categoriesWithIcon} onCategoryChange={vi.fn()} />
    );
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon').getAttribute('width')).toBe('16');
  });

  it('should not render icon element when no icon provided', () => {
    const { container } = render(
      <DualCategoryTabStrip categories={mockCategories} onCategoryChange={vi.fn()} />
    );
    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });

  // ─── Color Schemes ────────────────────────────────────────────────

  it('should set default color scheme CSS vars', () => {
    const { container } = render(
      <DualCategoryTabStrip categories={mockCategories} onCategoryChange={vi.fn()} />
    );
    const tab = container.querySelector('.category-tab') as HTMLElement;
    expect(tab.style.getPropertyValue('--tab-active-color')).toBe('#3B82F6');
    expect(tab.style.getPropertyValue('--tab-inactive-color')).toBe('#64748B');
  });

  it('should set red color scheme CSS vars', () => {
    const { container } = render(
      <DualCategoryTabStrip
        categories={mockCategories}
        onCategoryChange={vi.fn()}
        colorScheme="red"
      />
    );
    const tab = container.querySelector('.category-tab') as HTMLElement;
    expect(tab.style.getPropertyValue('--tab-active-color')).toBe('#EF4444');
  });

  it('should set green color scheme CSS vars', () => {
    const { container } = render(
      <DualCategoryTabStrip
        categories={mockCategories}
        onCategoryChange={vi.fn()}
        colorScheme="green"
      />
    );
    const tab = container.querySelector('.category-tab') as HTMLElement;
    expect(tab.style.getPropertyValue('--tab-active-color')).toBe('#10B981');
  });

  it('should set amber color scheme CSS vars', () => {
    const { container } = render(
      <DualCategoryTabStrip
        categories={mockCategories}
        onCategoryChange={vi.fn()}
        colorScheme="amber"
      />
    );
    const tab = container.querySelector('.category-tab') as HTMLElement;
    expect(tab.style.getPropertyValue('--tab-active-color')).toBe('#F59E0B');
  });
});
