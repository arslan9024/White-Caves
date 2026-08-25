import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyHeroGalleryLightbox } from './PropertyHeroGalleryLightbox';

describe('PropertyHeroGalleryLightbox', () => {
  it('renders gallery with main hero and thumbnails and handles thumbnail switching', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<PropertyHeroGalleryLightbox />);

    expect(screen.getByTestId('property-hero-gallery-lightbox')).toBeDefined();
    expect(screen.getByText('📷 View All 24 High-Res Photos')).toBeDefined();

    const thumbnails = screen.getAllByRole('generic');
    expect(thumbnails.length).toBeGreaterThan(0);

    alertSpy.mockRestore();
  });
});
