/**
 * PageLoader.test.tsx — Smoke tests for PageLoader component
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import PageLoader from './PageLoader';

describe('PageLoader', () => {
  it('renders with default "Loading..." message', () => {
    render(<PageLoader />);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('renders with custom message', () => {
    render(<PageLoader message="Fetching data..." />);
    expect(screen.getByText('Fetching data...')).toBeTruthy();
  });

  it('renders company logo', () => {
    render(<PageLoader />);
    const img = screen.getByAltText('White Caves');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/company-logo.jpg');
  });
});
