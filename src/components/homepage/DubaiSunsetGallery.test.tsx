import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DubaiSunsetGallery } from './DubaiSunsetGallery';

describe('DubaiSunsetGallery (Target T-0010)', () => {
  it('renders curated sunset photos and opens preview modal on click', () => {
    render(<DubaiSunsetGallery />);

    expect(screen.getByText(/Dubai Marina & Palm Jumeirah Sunset Curation/i)).toBeInTheDocument();
    expect(screen.getByText('Atlantis The Royal Sunset Horizon')).toBeInTheDocument();
    expect(screen.getByText('Dubai Marina Twilight Yacht Promenade')).toBeInTheDocument();

    const palmCard = screen.getByText('Atlantis The Royal Sunset Horizon');
    fireEvent.click(palmCard);

    expect(screen.getByRole('dialog', { name: /Atlantis The Royal Sunset Horizon/i })).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Close photo preview/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
