import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileBottomSheetDrawer } from './MobileBottomSheetDrawer';

describe('MobileBottomSheetDrawer Component', () => {
  it('renders nothing when closed, and renders sheet with children when open', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <MobileBottomSheetDrawer isOpen={false} onClose={onClose}>
        <div>Filter Contents</div>
      </MobileBottomSheetDrawer>
    );
    expect(screen.queryByTestId('mobile-bottom-sheet-drawer')).toBeNull();

    rerender(
      <MobileBottomSheetDrawer isOpen={true} title="Ultra-Luxury Filters" onClose={onClose}>
        <div>Filter Contents</div>
      </MobileBottomSheetDrawer>
    );
    expect(screen.getByTestId('mobile-bottom-sheet-drawer')).toBeDefined();
    expect(screen.getByText('Ultra-Luxury Filters')).toBeDefined();
    expect(screen.getByText('Filter Contents')).toBeDefined();

    // Trigger close
    const closeBtn = screen.getByText('✕');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
