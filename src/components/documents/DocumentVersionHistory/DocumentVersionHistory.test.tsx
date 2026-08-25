import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DocumentVersionHistory } from './DocumentVersionHistory';

describe('DocumentVersionHistory', () => {
  it('renders version history panel', () => {
    render(<DocumentVersionHistory />);
    expect(screen.getByTestId('document-version-history')).toBeTruthy();
    expect(screen.getByText('v4.0')).toBeTruthy();
  });
});
