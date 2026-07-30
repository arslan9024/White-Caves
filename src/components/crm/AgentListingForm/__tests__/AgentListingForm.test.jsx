import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import AgentListingForm from '../AgentListingForm';
import { BrowserRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

describe('AgentListingForm Component', () => {
  it('renders agent listing form without crashing', () => {
    const { container } = render(
      <BrowserRouter>
        <AgentListingForm />
      </BrowserRouter>
    );
    expect(container).toBeDefined();
  });
});
