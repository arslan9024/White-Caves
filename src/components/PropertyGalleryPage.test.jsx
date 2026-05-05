import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PropertyGalleryPage from './PropertyGalleryPage';

vi.mock('./PropertyGalleryPage.css', () => ({}));

describe('PropertyGalleryPage — alert elimination', () => {
  beforeEach(() => {
    vi.spyOn(window, 'fetch').mockImplementation(url => {
      if (String(url).startsWith('/api/crud/properties/')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            title: 'Palm Villa',
            gallery: ['img1.jpg', 'img2.jpg'],
            description: 'Luxury listing',
            area: 'Palm Jumeirah',
            price: 8000000,
          }),
        });
      }
      if (String(url).startsWith('/api/properties/')) {
        return Promise.resolve({ ok: true, json: async () => [] });
      }
      return Promise.reject(new Error(`Unhandled fetch: ${url}`));
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

    render(
      <MemoryRouter initialEntries={['/gallery/p1']}>
        <Routes>
          <Route path="/gallery/:propertyId" element={<PropertyGalleryPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByTitle('Share'));

    const banner = await screen.findByRole('status');
    expect(banner).toHaveTextContent('Link copied to clipboard!');
    expect(banner).toHaveAttribute('data-testid', 'property-gallery-status-banner');
    expect(alertSpy).not.toHaveBeenCalled();
  });
});
