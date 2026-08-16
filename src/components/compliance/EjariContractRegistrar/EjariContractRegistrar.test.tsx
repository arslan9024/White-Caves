import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EjariContractRegistrar } from './EjariContractRegistrar';

describe('EjariContractRegistrar Component', () => {
  it('renders Ejari contract registrar and registers tenancy contract on RERA system', () => {
    render(<EjariContractRegistrar />);
    expect(screen.getByTestId('ejari-contract-registrar')).toBeDefined();
    expect(screen.getByText(/Ejari Contract Registrar/i)).toBeDefined();
    expect(screen.getByText(/Reg\. 26\/2010/i)).toBeDefined();
    expect(screen.getByText(/Register on Ejari/i)).toBeDefined();

    // Register contract
    const regBtn = screen.getByRole('button', { name: /Register on Ejari/i });
    fireEvent.click(regBtn);
    expect(screen.getByText(/Ejari Registration Successful/i)).toBeDefined();
  });
});
