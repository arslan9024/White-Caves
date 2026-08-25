import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyLightboxGallery } from './PropertyLightboxGallery';

describe('PropertyLightboxGallery', () => {
  it('renders gallery and handles photo tab selection', () => {
    render(<PropertyLightboxGallery />);

    expect(screen.getByTestId('property-lightbox-gallery')).toBeDefined();
    expect(screen.getByText('Photo 1 of 4', { exact: false })).toBeDefined();

    const photo3Btn = screen.getByText('Photo 3');
    fireEvent.click(photo3Btn);
    expect(screen.getByText('Photo 3 of 4', { exact: false })).toBeDefined();
  });
});
