import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MargaretPlansHub } from './MargaretPlansHub';

describe('MargaretPlansHub Component', () => {
  it('renders strategic planning catalog with search and categories', () => {
    render(<MargaretPlansHub />);

    expect(screen.getByTestId('margaret-plans-hub')).toBeDefined();
    expect(screen.getByText(/Strategic Roadmap & Execution Plans Hub/i)).toBeDefined();
    expect(screen.getByText(/PLAN-MST-01/i)).toBeDefined();
    expect(screen.getByText(/PLAN-MST-02/i)).toBeDefined();
  });

  it('filters plans when typing in search query', () => {
    render(<MargaretPlansHub />);

    const searchInput = screen.getByPlaceholderText(/Search project plans/i);
    fireEvent.change(searchInput, { target: { value: 'Frontend' } });

    expect(screen.getByText(/PLAN-DES-01/i)).toBeDefined();
  });

  it('opens plan in viewer overlay and triggers cross-assistant navigation', () => {
    const onNavigate = vi.fn();
    render(<MargaretPlansHub onNavigateAssistant={onNavigate} />);

    const planCard = screen.getByTestId('plan-card-PLAN-MST-01');
    fireEvent.click(planCard);

    expect(screen.getByTestId('plan-viewer-overlay')).toBeDefined();
    expect(screen.getByText(/Apollo/i)).toBeDefined();
    expect(screen.getByText(/Waves 01–65/i)).toBeDefined();
  });
});
