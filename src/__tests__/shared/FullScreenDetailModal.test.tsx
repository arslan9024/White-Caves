/**
 * FullScreenDetailModal.test.tsx — Batch 27
 * Tests for FullScreenDetailModal component
 * Covers: rendering, open/close, image gallery, tabs, actions, keyboard nav, favorites, fullscreen
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

vi.mock('../../shared/components/ui/FullScreenDetailModal.css', () => ({}));

import FullScreenDetailModal from '../../shared/components/ui/FullScreenDetailModal';

describe('FullScreenDetailModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Luxury Villa',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
    // Mock fullscreen API
    document.documentElement.requestFullscreen = vi.fn().mockResolvedValue(undefined);
    document.exitFullscreen = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      value: null,
    });
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  // ─── RENDERING ─────────────────────────────────────────────
  describe('Rendering', () => {
    it('renders nothing when isOpen=false', () => {
      const { container } = render(<FullScreenDetailModal {...defaultProps} isOpen={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders modal when isOpen=true', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('renders title', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      expect(screen.getByText('Luxury Villa')).toBeInTheDocument();
    });

    it('renders subtitle when provided', () => {
      render(<FullScreenDetailModal {...defaultProps} subtitle="Dubai Marina" />);
      expect(screen.getByText('Dubai Marina')).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      expect(screen.queryByText('Dubai Marina')).not.toBeInTheDocument();
    });

    it('renders children content', () => {
      render(
        <FullScreenDetailModal {...defaultProps}>
          <p>Property description here</p>
        </FullScreenDetailModal>
      );
      expect(screen.getByText('Property description here')).toBeInTheDocument();
    });

    it('renders sidebar when provided', () => {
      render(
        <FullScreenDetailModal {...defaultProps} sidebar={<div>Sidebar Content</div>} />
      );
      expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
    });

    it('has proper ARIA attributes', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-label', 'Luxury Villa');
    });
  });

  // ─── CLOSE BEHAVIOR ────────────────────────────────────────
  describe('Close Behavior', () => {
    it('calls onClose when close button clicked', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      fireEvent.click(screen.getByLabelText('Close modal'));
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('calls onClose when overlay clicked', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      fireEvent.click(screen.getByRole('dialog'));
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('does not close when modal content clicked', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      const modal = screen.getByRole('dialog').querySelector('.fullscreen-modal')!;
      fireEvent.click(modal);
      // onClose should only trigger from overlay, not from stopPropagation content
      expect(defaultProps.onClose).toHaveBeenCalledTimes(0);
    });

    it('calls onClose when Escape key pressed', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  // ─── BODY OVERFLOW ─────────────────────────────────────────
  describe('Body Overflow', () => {
    it('sets body overflow to hidden when open', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body overflow on unmount', () => {
      const { unmount } = render(<FullScreenDetailModal {...defaultProps} />);
      unmount();
      expect(document.body.style.overflow).toBe('unset');
    });
  });

  // ─── IMAGE GALLERY ─────────────────────────────────────────
  describe('Image Gallery', () => {
    const images = ['/img1.jpg', '/img2.jpg', '/img3.jpg'];

    it('renders image gallery when images provided', () => {
      render(<FullScreenDetailModal {...defaultProps} images={images} />);
      const img = screen.getByAltText('Luxury Villa — image 1 of 3');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/img1.jpg');
    });

    it('does not render gallery when no images', () => {
      render(<FullScreenDetailModal {...defaultProps} images={[]} />);
      expect(screen.queryByAltText(/image \d+ of \d+/)).not.toBeInTheDocument();
    });

    it('shows navigation buttons when multiple images', () => {
      render(<FullScreenDetailModal {...defaultProps} images={images} />);
      expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
      expect(screen.getByLabelText('Next image')).toBeInTheDocument();
    });

    it('does not show nav buttons for single image', () => {
      render(<FullScreenDetailModal {...defaultProps} images={['/img1.jpg']} />);
      expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
    });

    it('navigates to next image', () => {
      render(<FullScreenDetailModal {...defaultProps} images={images} />);
      fireEvent.click(screen.getByLabelText('Next image'));
      expect(screen.getByAltText('Luxury Villa — image 2 of 3')).toBeInTheDocument();
    });

    it('navigates to previous image (wraps around)', () => {
      render(<FullScreenDetailModal {...defaultProps} images={images} />);
      fireEvent.click(screen.getByLabelText('Previous image'));
      expect(screen.getByAltText('Luxury Villa — image 3 of 3')).toBeInTheDocument();
    });

    it('shows image counter', () => {
      render(<FullScreenDetailModal {...defaultProps} images={images} />);
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('renders thumbnails for multiple images', () => {
      render(<FullScreenDetailModal {...defaultProps} images={images} />);
      const thumbnails = screen.getAllByAltText(/thumbnail/);
      expect(thumbnails).toHaveLength(3);
    });

    it('changes image on thumbnail click', () => {
      render(<FullScreenDetailModal {...defaultProps} images={images} />);
      const thumbnails = screen.getAllByAltText(/thumbnail/);
      fireEvent.click(thumbnails[1].closest('button')!);
      expect(screen.getByAltText('Luxury Villa — image 2 of 3')).toBeInTheDocument();
    });

    it('navigates images with arrow keys', () => {
      render(<FullScreenDetailModal {...defaultProps} images={images} />);
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(screen.getByAltText('Luxury Villa — image 2 of 3')).toBeInTheDocument();
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(screen.getByAltText('Luxury Villa — image 1 of 3')).toBeInTheDocument();
    });
  });

  // ─── TABS ──────────────────────────────────────────────────
  describe('Tabs', () => {
    const tabs = [
      { label: 'Details', content: <div>Details content</div> },
      { label: 'Floor Plan', content: <div>Floor plan content</div> },
      { label: 'Location', content: <div>Location content</div> },
    ];

    it('renders tab buttons', () => {
      render(<FullScreenDetailModal {...defaultProps} tabs={tabs} />);
      expect(screen.getByText('Details')).toBeInTheDocument();
      expect(screen.getByText('Floor Plan')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
    });

    it('shows first tab content by default', () => {
      render(<FullScreenDetailModal {...defaultProps} tabs={tabs} />);
      expect(screen.getByText('Details content')).toBeInTheDocument();
    });

    it('switches tab content on click', () => {
      render(<FullScreenDetailModal {...defaultProps} tabs={tabs} />);
      fireEvent.click(screen.getByText('Floor Plan'));
      expect(screen.getByText('Floor plan content')).toBeInTheDocument();
      expect(screen.queryByText('Details content')).not.toBeInTheDocument();
    });

    it('respects defaultTab prop', () => {
      render(<FullScreenDetailModal {...defaultProps} tabs={tabs} defaultTab={2} />);
      expect(screen.getByText('Location content')).toBeInTheDocument();
    });

    it('shows children when no tabs provided', () => {
      render(
        <FullScreenDetailModal {...defaultProps}>
          <p>Children content</p>
        </FullScreenDetailModal>
      );
      expect(screen.getByText('Children content')).toBeInTheDocument();
    });
  });

  // ─── ACTIONS ───────────────────────────────────────────────
  describe('Actions', () => {
    it('renders action buttons', () => {
      const actions = [
        { label: 'Schedule Viewing', onClick: vi.fn(), primary: true },
        { label: 'Delete', onClick: vi.fn(), danger: true },
      ];
      render(<FullScreenDetailModal {...defaultProps} actions={actions} />);
      expect(screen.getByText('Schedule Viewing')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('calls action onClick', () => {
      const onClick = vi.fn();
      const actions = [{ label: 'Book Now', onClick }];
      render(<FullScreenDetailModal {...defaultProps} actions={actions} />);
      fireEvent.click(screen.getByText('Book Now'));
      expect(onClick).toHaveBeenCalled();
    });

    it('supports disabled actions', () => {
      const actions = [{ label: 'Disabled Action', onClick: vi.fn(), disabled: true }];
      render(<FullScreenDetailModal {...defaultProps} actions={actions} />);
      expect(screen.getByText('Disabled Action').closest('button')).toBeDisabled();
    });

    it('does not show footer when no actions', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      expect(screen.queryByText('Schedule Viewing')).not.toBeInTheDocument();
    });

    it('applies primary and danger classes', () => {
      const actions = [
        { label: 'Primary', onClick: vi.fn(), primary: true },
        { label: 'Danger', onClick: vi.fn(), danger: true },
      ];
      render(<FullScreenDetailModal {...defaultProps} actions={actions} />);
      expect(screen.getByText('Primary').closest('button')).toHaveClass('primary');
      expect(screen.getByText('Danger').closest('button')).toHaveClass('danger');
    });
  });

  // ─── FAVORITES ─────────────────────────────────────────────
  describe('Favorites', () => {
    it('renders favorite button', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      expect(screen.getByLabelText('Add to favorites')).toBeInTheDocument();
    });

    it('toggles favorite state', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      const favBtn = screen.getByLabelText('Add to favorites');
      fireEvent.click(favBtn);
      expect(screen.getByLabelText('Remove from favorites')).toBeInTheDocument();
      fireEvent.click(screen.getByLabelText('Remove from favorites'));
      expect(screen.getByLabelText('Add to favorites')).toBeInTheDocument();
    });
  });

  // ─── HEADER BUTTONS ────────────────────────────────────────
  describe('Header Buttons', () => {
    it('renders share button', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      expect(screen.getByLabelText('Share')).toBeInTheDocument();
    });

    it('renders download button', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      expect(screen.getByLabelText('Download')).toBeInTheDocument();
    });

    it('renders fullscreen toggle button', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      expect(screen.getByLabelText('Enter fullscreen')).toBeInTheDocument();
    });

    it('toggles fullscreen state', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      fireEvent.click(screen.getByLabelText('Enter fullscreen'));
      expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
    });
  });
});
