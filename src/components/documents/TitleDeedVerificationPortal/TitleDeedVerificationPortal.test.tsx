import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TitleDeedVerificationPortal } from './TitleDeedVerificationPortal';

describe('TitleDeedVerificationPortal', () => {
  it('renders DLD verification portal', () => {
    render(<TitleDeedVerificationPortal />);
    expect(screen.getByTestId('title-deed-verification-portal')).toBeTruthy();
    expect(screen.getByText(/DLD Title Deed Verification/i)).toBeTruthy();
  });
});
