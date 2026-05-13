import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../components/layout/AppLayout', () => ({
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock('../components/Footer', () => ({ default: () => <div>Footer</div> }));
vi.mock('../components/WhatsAppButton', () => ({ default: () => null }));

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
  useSelector: () => [],
}));

import PropertyDetailPage from './PropertyDetailPage';

describe('PropertyDetailPage — alert elimination', () => {
  beforeEach(() => {
    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          id: 'p1',
          title: 'Palm Villa',
          location: 'Palm Jumeirah',
          purpose: 'buy',
          images: ['img1.jpg'],
          address: 'Palm',
          type: 'Villa',
          bedrooms: 4,
          bathrooms: 4,
          sqft: 5000,
          price: 8000000,
          amenities: [],
        },
      }),
    });

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows inline status banner when share fallback copies link', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });

    const { container } = render(
      <MemoryRouter initialEntries={['/property/p1']}>
        <Routes>
          <Route path="/property/:id" element={<PropertyDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByRole('heading', { name: /Palm Villa/i });
    const shareBtn = container.querySelector('.gallery-actions .action-btn:nth-child(2)');
    expect(shareBtn).toBeTruthy();
    fireEvent.click(shareBtn);

    const banner = await screen.findByRole('status');
    expect(banner).toHaveTextContent('Link copied to clipboard!');
    expect(banner).toHaveAttribute('data-testid', 'property-detail-status-banner');
    expect(alertSpy).not.toHaveBeenCalled();
  });
});
