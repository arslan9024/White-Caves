import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SkeletonUiLoader } from './SkeletonUiLoader';

describe('SkeletonUiLoader Component', () => {
  it('renders shimmer skeleton placeholder cards', () => {
    render(<SkeletonUiLoader />);
    expect(screen.getByTestId('skeleton-ui-loader')).toBeDefined();
  });
});
