import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import ContractPreview from '../ContractPreview';

describe('ContractPreview Component', () => {
  it('renders contract preview component without crashing', () => {
    const mockContract = { id: 'cnt-1', title: 'Tenancy Agreement' };
    const { container } = render(<ContractPreview contract={mockContract} />);
    expect(container).toBeDefined();
  });
});
