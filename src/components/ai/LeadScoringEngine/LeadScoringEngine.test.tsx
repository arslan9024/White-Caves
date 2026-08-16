import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeadScoringEngine from './LeadScoringEngine';

describe('LeadScoringEngine Component', () => {
  it('renders without crashing and displays the lead scoring cockpit', () => {
    render(<LeadScoringEngine />);
    expect(screen.getByTestId('lead-scoring-engine')).toBeDefined();
  });
});
