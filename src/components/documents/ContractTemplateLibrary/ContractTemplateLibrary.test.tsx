import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContractTemplateLibrary } from './ContractTemplateLibrary';
describe('ContractTemplateLibrary', () => {
  it('renders template library', () => {
    render(<ContractTemplateLibrary />);
    expect(screen.getByTestId('contract-template-library')).toBeTruthy();
    expect(screen.getByText('Form A — Seller Listing Agreement')).toBeTruthy();
  });
});
