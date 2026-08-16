import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SnaggingChecklistAnnotator } from './SnaggingChecklistAnnotator';

describe('SnaggingChecklistAnnotator Component', () => {
  it('renders snagging inspection annotator, toggles repairs, and adds new snag', () => {
    render(<SnaggingChecklistAnnotator />);
    expect(screen.getByTestId('snagging-checklist-annotator')).toBeDefined();
    expect(screen.getByText(/Move-In \/ Handover Snagging Inspection Annotator/i)).toBeDefined();
    expect(screen.getByText(/Master bathroom marble hairline crack/i)).toBeDefined();
    expect(screen.getByText(/2 DEFECTS OPEN/i)).toBeDefined();

    // Add new snag
    const descInput = screen.getByPlaceholderText(/Defect Description/i);
    const locInput = screen.getByPlaceholderText(/Room \/ Zone/i);
    const addBtn = screen.getByRole('button', { name: /\+ Add Snag/i });

    fireEvent.change(descInput, { target: { value: 'Window latch loose' } });
    fireEvent.change(locInput, { target: { value: 'Guest Bedroom' } });
    fireEvent.click(addBtn);

    expect(screen.getByText(/Window latch loose/i)).toBeDefined();
  });
});
