import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Users: (props: any) => <svg data-testid="icon-users" {...props} />,
  Phone: (props: any) => <svg data-testid="icon-phone" {...props} />,
  Building2: (props: any) => <svg data-testid="icon-building" {...props} />,
  AlertTriangle: (props: any) => <svg data-testid="icon-alert" {...props} />,
  CheckCircle: (props: any) => <svg data-testid="icon-check" {...props} />,
}));

// Mock styled components
vi.mock('../DataQualityIndicators.styles', () => ({
  DataQualityIndicatorsContainer: ({ children, ...props }: any) => <div data-testid="dq-container" {...props}>{children}</div>,
  IndicatorsHeader: ({ children, ...props }: any) => <div data-testid="dq-header" {...props}>{children}</div>,
  IndicatorsGrid: ({ children, ...props }: any) => <div data-testid="dq-grid" {...props}>{children}</div>,
  IndicatorCard: ({ children, onClick, ...props }: any) => <button data-testid="indicator-card" onClick={onClick} {...props}>{children}</button>,
  IndicatorIcon: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  IndicatorContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  IndicatorValue: ({ children, ...props }: any) => <span data-testid="indicator-value" {...props}>{children}</span>,
  IndicatorLabel: ({ children, ...props }: any) => <span data-testid="indicator-label" {...props}>{children}</span>,
  IndicatorDesc: ({ children, ...props }: any) => <span data-testid="indicator-desc" {...props}>{children}</span>,
}));

// Mock the Redux selectors
const mockSelectInventoryStats = vi.fn();
const mockSelectMultiOwnerProperties = vi.fn();
const mockSelectOwnersWithMultipleProperties = vi.fn();
const mockSelectOwnersWithMultiplePhones = vi.fn();

vi.mock('../../../../store/slices/inventorySlice', () => ({
  selectInventoryStats: (state: any) => mockSelectInventoryStats(state),
  selectMultiOwnerProperties: (state: any) => mockSelectMultiOwnerProperties(state),
  selectOwnersWithMultipleProperties: (state: any) => mockSelectOwnersWithMultipleProperties(state),
  selectOwnersWithMultiplePhones: (state: any) => mockSelectOwnersWithMultiplePhones(state),
}));

import DataQualityIndicators from '../DataQualityIndicators';

// A simple store to satisfy <Provider>
const createTestStore = () =>
  configureStore({
    reducer: {
      inventory: (state = {}) => state,
    },
  });

const renderWithStore = (props: { onFilterClick?: (key: string) => void } = {}) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <DataQualityIndicators {...props} />
    </Provider>
  );
};

describe('DataQualityIndicators', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelectInventoryStats.mockReturnValue({
      multiOwnerProperties: 5,
      ownersWithMultipleProperties: 10,
      ownersWithMultiplePhones: 3,
    });
    mockSelectMultiOwnerProperties.mockReturnValue([
      { pNumber: 'P001', owners: ['A', 'B'] },
      { pNumber: 'P002', owners: ['C', 'D'] },
    ]);
    mockSelectOwnersWithMultipleProperties.mockReturnValue([
      { id: 'O1', name: 'Owner 1', properties: ['P1', 'P2'] },
      { id: 'O2', name: 'Owner 2', properties: ['P3', 'P4'] },
      { id: 'O3', name: 'Owner 3', properties: ['P5', 'P6'] },
    ]);
    mockSelectOwnersWithMultiplePhones.mockReturnValue([
      { id: 'O1', name: 'Owner 1' },
    ]);
  });

  it('should render Data Quality Insights heading', () => {
    renderWithStore();
    expect(screen.getByText('Data Quality Insights')).toBeInTheDocument();
  });

  it('should render 3 indicator cards', () => {
    renderWithStore();
    const cards = screen.getAllByTestId('indicator-card');
    expect(cards).toHaveLength(3);
  });

  it('should render indicator labels', () => {
    renderWithStore();
    expect(screen.getByText('Multi-Owner Properties')).toBeInTheDocument();
    expect(screen.getByText('Owners with Multiple Properties')).toBeInTheDocument();
    expect(screen.getByText('Owners with Multiple Phones')).toBeInTheDocument();
  });

  it('should render indicator descriptions', () => {
    renderWithStore();
    expect(screen.getByText('Properties with 2+ owners')).toBeInTheDocument();
    expect(screen.getByText('Owners with 2+ properties')).toBeInTheDocument();
    expect(screen.getByText('Owners with 2+ phone numbers')).toBeInTheDocument();
  });

  it('should show values from selector arrays (array.length takes priority)', () => {
    renderWithStore();
    const values = screen.getAllByTestId('indicator-value');
    // multiOwnerProps.length = 2 (takes priority over stats.multiOwnerProperties = 5)
    expect(values[0].textContent).toBe('2');
    // multiPropertyOwners.length = 3 (takes priority over stats.ownersWithMultipleProperties = 10)
    expect(values[1].textContent).toBe('3');
    // multiPhoneOwners.length = 1 (takes priority over stats.ownersWithMultiplePhones = 3)
    expect(values[2].textContent).toBe('1');
  });

  it('should fall back to stats when arrays are empty', () => {
    mockSelectMultiOwnerProperties.mockReturnValue([]);
    mockSelectOwnersWithMultipleProperties.mockReturnValue([]);
    mockSelectOwnersWithMultiplePhones.mockReturnValue([]);

    renderWithStore();
    const values = screen.getAllByTestId('indicator-value');
    // Falls back to stats values
    expect(values[0].textContent).toBe('5');
    expect(values[1].textContent).toBe('10');
    expect(values[2].textContent).toBe('3');
  });

  it('should show 0 when both array and stats are empty/zero', () => {
    mockSelectMultiOwnerProperties.mockReturnValue([]);
    mockSelectOwnersWithMultipleProperties.mockReturnValue([]);
    mockSelectOwnersWithMultiplePhones.mockReturnValue([]);
    mockSelectInventoryStats.mockReturnValue({});

    renderWithStore();
    const values = screen.getAllByTestId('indicator-value');
    expect(values[0].textContent).toBe('0');
    expect(values[1].textContent).toBe('0');
    expect(values[2].textContent).toBe('0');
  });

  it('should call onFilterClick with correct filterKey', () => {
    const onFilterClick = vi.fn();
    renderWithStore({ onFilterClick });

    const cards = screen.getAllByTestId('indicator-card');
    fireEvent.click(cards[0]);
    expect(onFilterClick).toHaveBeenCalledWith('showMultiOwner');

    fireEvent.click(cards[1]);
    expect(onFilterClick).toHaveBeenCalledWith('showMultiProperty');

    fireEvent.click(cards[2]);
    expect(onFilterClick).toHaveBeenCalledWith('showMultiPhone');
  });

  it('should not crash when onFilterClick is not provided', () => {
    renderWithStore();
    const cards = screen.getAllByTestId('indicator-card');
    // Should not throw
    expect(() => fireEvent.click(cards[0])).not.toThrow();
  });

  it('should render alert triangle icon in header', () => {
    renderWithStore();
    expect(screen.getByTestId('icon-alert')).toBeInTheDocument();
  });
});
