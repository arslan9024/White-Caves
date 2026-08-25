import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuickViewPropertyDrawer } from './QuickViewPropertyDrawer';

describe('QuickViewPropertyDrawer', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<QuickViewPropertyDrawer isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders drawer when open and handles close action', () => {
    const onClose = vi.fn();
    render(<QuickViewPropertyDrawer isOpen={true} onClose={onClose} />);

    expect(screen.getByTestId('quick-view-property-drawer')).toBeDefined();
    expect(screen.getByText('Signature Beachfront Villa 14B')).toBeDefined();
    expect(screen.getByText('AED 65,000,000')).toBeDefined();

    const closeBtn = screen.getByText('✕');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
