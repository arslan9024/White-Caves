import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { LeadQualificationTagger } from './LeadQualificationTagger';

describe('LeadQualificationTagger Component', () => {
  it('renders lead qualification tagger and client persona tags', () => {
    render(<LeadQualificationTagger />);
    expect(screen.getByTestId('lead-qualification-tagger')).toBeDefined();
    expect(screen.getByText(/Automated AI Lead Qualification & Buyer Persona Tagger/i)).toBeDefined();
    expect(screen.getByText(/NINA AI SCORER/i)).toBeDefined();
    expect(screen.getByText(/Dr. Tariq Al Qasimi/i)).toBeDefined();
    expect(screen.getByText(/Oliver Vandermeer/i)).toBeDefined();
  });
});
