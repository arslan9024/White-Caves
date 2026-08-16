import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { OfficeLeaseSqftComparator } from './OfficeLeaseSqftComparator';

describe('OfficeLeaseSqftComparator Component', () => {
  it('renders commercial office lease comparison and area breakdowns', () => {
    render(<OfficeLeaseSqftComparator />);
    expect(screen.getByTestId('office-lease-sqft-comparator')).toBeDefined();
    expect(screen.getByText(/Commercial Office Lease & SqFt\/SqM Comparator/i)).toBeDefined();
    expect(screen.getByText(/DIFC & DED COMMERCIAL/i)).toBeDefined();
  });
});
