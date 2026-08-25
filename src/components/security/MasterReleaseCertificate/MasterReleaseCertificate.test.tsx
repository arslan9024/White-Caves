import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MasterReleaseCertificate } from './MasterReleaseCertificate';

describe('MasterReleaseCertificate', () => {
  it('renders sovereign master release certificate and governance badges', () => {
    render(<MasterReleaseCertificate />);

    expect(screen.getByTestId('master-release-certificate')).toBeDefined();
    expect(screen.getByText(/Sovereign OS System Release Version 3.0/i)).toBeDefined();
    expect(screen.getByText('100 Goals Delivered')).toBeDefined();
    expect(screen.getByText('AEGIS V3 Policy')).toBeDefined();
  });
});
