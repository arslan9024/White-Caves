import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import ContractSigningPage from '../ContractSigningPage';
import { BrowserRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ contractId: 'cnt-123', token: 'token-abc' }),
  };
});

describe('ContractSigningPage Component', () => {
  it('renders contract signing page component without crashing', () => {
    const { container } = render(
      <BrowserRouter>
        <ContractSigningPage />
      </BrowserRouter>
    );
    expect(container).toBeDefined();
  });
});
