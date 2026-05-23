import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock styled-components
vi.mock('./SuspenseLoader.styles', () => {
  const c = (tag: string) => ({ children, ...props }: any) => React.createElement(tag, props, children);
  return {
    SuspenseLoaderContainer: c('div'),
    SuspenseLoaderOverlay: c('div'),
    SuspenseLoaderSpinner: c('div'),
    SpinnerCircle: () => React.createElement('div', { 'data-testid': 'spinner-circle' }),
    SpinnerText: ({ children }: any) => React.createElement('span', { 'data-testid': 'spinner-text' }, children),
  };
});

import SuspenseLoader from './SuspenseLoader';

describe('SuspenseLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<SuspenseLoader />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('displays loading text', () => {
    render(<SuspenseLoader />);
    expect(screen.getByText('Loading page...')).toBeInTheDocument();
  });

  it('renders the spinner circle', () => {
    render(<SuspenseLoader />);
    expect(screen.getByTestId('spinner-circle')).toBeInTheDocument();
  });

  it('renders the spinner text element', () => {
    render(<SuspenseLoader />);
    expect(screen.getByTestId('spinner-text')).toBeInTheDocument();
  });

  it('returns a ReactElement', () => {
    const element = SuspenseLoader();
    expect(element).toBeTruthy();
    expect(element.type).toBeDefined();
  });

  it('renders nested structure (container > overlay > spinner)', () => {
    const { container } = render(<SuspenseLoader />);
    // Should have a layered wrapper structure
    const outerDiv = container.firstChild;
    expect(outerDiv).toBeTruthy();
    expect(outerDiv!.firstChild).toBeTruthy();
  });
});
