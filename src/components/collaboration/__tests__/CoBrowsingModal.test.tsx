import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { CoBrowsingModal } from '../CoBrowsingModal';

describe('CoBrowsingModal Component', () => {
  it('renders null when isOpen is false', () => {
    const { container } = render(<CoBrowsingModal isOpen={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal content when isOpen is true', () => {
    render(<CoBrowsingModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('DAMAC Hills 2 Villa - Master Suite Floorplan')).toBeDefined();
  });
});
