import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkeletonText, SkeletonCard, SkeletonTable } from './SkeletonLoaders';

describe('SkeletonLoaders Components', () => {
  it('renders SkeletonText without error', () => {
    const { container } = render(<SkeletonText width="50%" height="20px" />);
    expect(container.firstChild).toBeDefined();
  });

  it('renders SkeletonCard without error', () => {
    const { container } = render(<SkeletonCard rows={4} />);
    expect(container.firstChild).toBeDefined();
  });

  it('renders SkeletonTable without error', () => {
    const { container } = render(<SkeletonTable columns={4} rows={3} />);
    expect(container.firstChild).toBeDefined();
  });
});
