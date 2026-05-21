import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

vi.mock('../components/layout/AppLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-layout">{children}</div>
  ),
}));

vi.mock('../components/Footer', () => ({ default: () => null }));
vi.mock('../components/WhatsAppButton', () => ({ default: () => null }));

const mockAuthFetch = vi.fn();
vi.mock('../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

import PropertyDetailPage from './PropertyDetailPage';

describe('PropertyDetailPage loading state', () => {
  it('renders structural skeleton while property data is loading', () => {
    mockAuthFetch.mockImplementation(() => new Promise(() => {}));
    const store = configureStore({
      reducer: {
        dashboard: () => ({ favorites: [] }),
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/property/p1']}>
          <Routes>
            <Route path="/property/:id" element={<PropertyDetailPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('property-detail-loading-skeleton')).toBeInTheDocument();
  });
});
