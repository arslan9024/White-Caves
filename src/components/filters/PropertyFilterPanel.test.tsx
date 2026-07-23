/**
 * PropertyFilterPanel tests — W18.1-P0-002
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { PropertyFilterPanel } from './PropertyFilterPanel';
import type { PropertyFilterPanelProps } from './PropertyFilterPanel';
import { DEFAULT_PROPERTY_FILTERS } from '../../redux/slices/propertySlice';
import type { FacetCounts } from '../../hooks/useFacets';

const defaultProps: PropertyFilterPanelProps = {
  filters: { ...DEFAULT_PROPERTY_FILTERS },
  onChange: vi.fn(),
  onReset: vi.fn(),
};

const renderPanel = (props: Partial<PropertyFilterPanelProps> = {}) =>
  render(<PropertyFilterPanel {...defaultProps} {...props} />);

const MOCK_FACETS: FacetCounts = {
  type:   { apartment: 40, villa: 20 },
  status: { available: 50, sold: 10 },
  furnishing: { furnished: 25, unfurnished: 30, all: 55 },
  handoverStage: { all: 55, ready: 30, 'off-plan': 15, 'under-construction': 10 },
  permitStatus:  { all: 55, active: 40, pending: 15 },
  feeBand:       { all: 55, 'no-fee': 5, 'low-fee': 20, 'standard-fee': 30 },
};

describe('PropertyFilterPanel', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders all 4 filter sections as radiogroups', () => {
    renderPanel();
    expect(screen.getByRole('radiogroup', { name: /furnishing/i })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: /handover stage/i })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: /permit status/i })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: /fee band/i })).toBeInTheDocument();
  });

  it('renders Reset Filters button', () => {
    renderPanel();
    expect(screen.getByRole('button', { name: /reset all filters/i })).toBeInTheDocument();
  });

  it('renders Furnishing options: All, Furnished, Unfurnished', () => {
    renderPanel();
    expect(screen.getByLabelText(/furnishing: all/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/furnishing: furnished/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/furnishing: unfurnished/i)).toBeInTheDocument();
  });

  it('renders Fee Band with 4 options', () => {
    renderPanel();
    expect(screen.getByLabelText(/fee band: all/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fee band: no fee/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fee band: low fee/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fee band: standard fee/i)).toBeInTheDocument();
  });

  it('renders Handover Stage with 4 options', () => {
    renderPanel();
    expect(screen.getByLabelText(/handover stage: all/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/handover stage: ready/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/handover stage: off-plan/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/handover stage: under construction/i)).toBeInTheDocument();
  });

  it('calls onChange with { furnishing } when Furnished clicked', () => {
    const onChange = vi.fn();
    renderPanel({ onChange });
    fireEvent.click(screen.getByLabelText(/furnishing: furnished/i));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith({ furnishing: 'furnished' });
  });

  it('calls onChange with { handoverStage: "ready" } when Ready clicked', () => {
    const onChange = vi.fn();
    renderPanel({ onChange });
    fireEvent.click(screen.getByLabelText(/handover stage: ready/i));
    expect(onChange).toHaveBeenCalledWith({ handoverStage: 'ready' });
  });

  it('calls onChange with { permitStatus: "active" } when Active clicked', () => {
    const onChange = vi.fn();
    renderPanel({ onChange });
    fireEvent.click(screen.getByLabelText(/permit status: active/i));
    expect(onChange).toHaveBeenCalledWith({ permitStatus: 'active' });
  });

  it('calls onChange with { feeBand: "no-fee" } when No Fee clicked', () => {
    const onChange = vi.fn();
    renderPanel({ onChange });
    fireEvent.click(screen.getByLabelText(/fee band: no fee/i));
    expect(onChange).toHaveBeenCalledWith({ feeBand: 'no-fee' });
  });

  it('calls onReset when Reset Filters clicked', () => {
    const onReset = vi.fn();
    renderPanel({ onReset });
    fireEvent.click(screen.getByRole('button', { name: /reset all filters/i }));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('shows facet counts when facets provided', () => {
    renderPanel({ facets: MOCK_FACETS });
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('shows permit status counts when facets provided', () => {
    renderPanel({ facets: MOCK_FACETS });
    expect(screen.getByText('40')).toBeInTheDocument();
    // '15' appears in multiple sections (off-plan + pending); check at least one
    expect(screen.getAllByText('15').length).toBeGreaterThanOrEqual(1);
  });

  it('does not crash when facets is null', () => {
    expect(() => renderPanel({ facets: null })).not.toThrow();
  });

  it('does not crash when facets is undefined', () => {
    expect(() => renderPanel({ facets: undefined })).not.toThrow();
  });

  it('all radiogroups have aria-label', () => {
    renderPanel();
    screen.getAllByRole('radiogroup').forEach(g => expect(g).toHaveAttribute('aria-label'));
  });

  it('Reset button has aria-label', () => {
    renderPanel();
    expect(screen.getByRole('button', { name: /reset/i })).toHaveAttribute('aria-label');
  });

  it('all radio inputs have aria-label', () => {
    renderPanel();
    screen.getAllByRole('radio').forEach(r => expect(r).toHaveAttribute('aria-label'));
  });

  it('panel container has aria-label for landmark navigation', () => {
    renderPanel();
    expect(screen.getByRole('complementary', { name: /property filters/i })).toBeInTheDocument();
  });
});
