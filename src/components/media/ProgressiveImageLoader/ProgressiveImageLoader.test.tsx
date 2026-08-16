import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgressiveImageLoader } from './ProgressiveImageLoader';

describe('ProgressiveImageLoader Component', () => {
  it('renders progressive image loader gallery and thumbnail items', () => {
    render(<ProgressiveImageLoader />);
    expect(screen.getByTestId('progressive-image-loader')).toBeDefined();
    expect(screen.getByText(/Aerial Dubai Marina View/i)).toBeDefined();
  });
});
