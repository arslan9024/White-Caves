import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DldRegressionModeler from './DldRegressionModeler';

describe('DldRegressionModeler Component', () => {
  it('renders without crashing and displays the DLD regression analysis cockpit', () => {
    render(<DldRegressionModeler />);
    expect(screen.getByTestId('dld-regression-modeler')).toBeInTheDocument();
  });
});
