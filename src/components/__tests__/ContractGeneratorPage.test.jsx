import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import ContractGeneratorPage from '../ContractGeneratorPage';
import { BrowserRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ offerId: 'offer-123' }),
    useNavigate: () => vi.fn(),
  };
});

describe('ContractGeneratorPage Component', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <BrowserRouter>
        <ContractGeneratorPage />
      </BrowserRouter>
    );
    expect(container).toBeDefined();
  });
});
