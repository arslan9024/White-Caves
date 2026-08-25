import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DocumentShareLinkGenerator } from './DocumentShareLinkGenerator';

describe('DocumentShareLinkGenerator', () => {
  it('renders share link generator', () => {
    render(<DocumentShareLinkGenerator />);
    expect(screen.getByTestId('doc-share-link-generator')).toBeTruthy();
    expect(screen.getByText('Generate Secure Link')).toBeTruthy();
  });
});
