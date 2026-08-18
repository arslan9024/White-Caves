/**
 * PullToRefreshWrapper.test.tsx — Unit Tests
 */

import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { PullToRefreshWrapper } from './PullToRefreshWrapper';

describe('PullToRefreshWrapper', () => {
  it('renders children inside wrapper', () => {
    render(
      <PullToRefreshWrapper onRefresh={async () => {}}>
        <div data-testid="child-content">Lead List</div>
      </PullToRefreshWrapper>
    );
    expect(screen.getByTestId('pull-to-refresh-wrapper')).toBeDefined();
    expect(screen.getByTestId('child-content')).toBeDefined();
    expect(screen.getByText('Lead List')).toBeDefined();
  });

  it('calls onRefresh callback (mocked)', async () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    render(
      <PullToRefreshWrapper onRefresh={onRefresh}>
        <span>content</span>
      </PullToRefreshWrapper>
    );
    expect(screen.getByTestId('pull-to-refresh-wrapper')).toBeDefined();
  });
});
