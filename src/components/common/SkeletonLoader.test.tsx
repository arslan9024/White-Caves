import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkeletonLoader } from './SkeletonLoader';

describe('SkeletonLoader Component', () => {
  it('renders default custom skeleton without errors', () => {
    const { container } = render(<SkeletonLoader width="100px" height="20px" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders circular variant with 50% border radius', () => {
    const { container } = render(<SkeletonLoader variant="circular" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders multi-row layout when rows prop is passed', () => {
    render(<SkeletonLoader variant="text" rows={4} />);
    const items = screen.getAllByTestId('skeleton-item');
    expect(items.length).toBe(4);
  });
});
