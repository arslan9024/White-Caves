import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PublicFooter from './PublicFooter';

describe('PublicFooter Component', () => {
  it('renders brand name and RERA license badge', () => {
    render(<PublicFooter />);
    expect(screen.getByText('WHITE CAVES')).toBeDefined();
    expect(screen.getByText('RERA License #108920')).toBeDefined();
  });

  it('renders footer section headers', () => {
    render(<PublicFooter />);
    expect(screen.getByText('Properties')).toBeDefined();
    expect(screen.getByText('Contact Head Office')).toBeDefined();
    expect(screen.getByText('Dubai Market Intelligence')).toBeDefined();
  });
});
