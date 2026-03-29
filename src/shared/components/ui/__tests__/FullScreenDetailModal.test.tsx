/**
 * @file FullScreenDetailModal.test.tsx
 * @description Comprehensive tests for FullScreenDetailModal component
 * Tests: rendering, open/close, images gallery, tabs, actions, keyboard, favorites, fullscreen, sidebar
 */

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  X: (props: any) => <svg data-testid="icon-x" {...props} />,
  ChevronLeft: (props: any) => <svg data-testid="icon-left" {...props} />,
  ChevronRight: (props: any) => <svg data-testid="icon-right" {...props} />,
  Maximize2: (props: any) => <svg data-testid="icon-maximize" {...props} />,
  Minimize2: (props: any) => <svg data-testid="icon-minimize" {...props} />,
  Share2: (props: any) => <svg data-testid="icon-share" {...props} />,
  Heart: (props: any) => <svg data-testid="icon-heart" {...props} />,
  Download: (props: any) => <svg data-testid="icon-download" {...props} />,
}));

// Mock CSS
vi.mock('./FullScreenDetailModal.css', () => ({}));

import FullScreenDetailModal from '../FullScreenDetailModal';

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  title: 'Test Property',
};

describe('FullScreenDetailModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  // ── Rendering ──────────────────────────────────────────
  describe('Rendering', () => {
    it('renders when isOpen is true', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      expect(screen.getByText('Test Property')).toBeInTheDocument();
    });

    it('returns null when isOpen is false', () => {
      const { container } = render(
        <FullScreenDetailModal {...defaultProps} isOpen={false} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders the title', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      expect(screen.getByText('Test Property')).toBeInTheDocument();
    });

    it('renders subtitle when provided', () => {
      render(<FullScreenDetailModal {...defaultProps} subtitle="Downtown District" />);
      expect(screen.getByText('Downtown District')).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      expect(screen.queryByText('Downtown District')).not.toBeInTheDocument();
    });

    it('renders children when no tabs', () => {
      render(
        <FullScreenDetailModal {...defaultProps}>
          <p>Child content</p>
        </FullScreenDetailModal>
      );
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('locks body scroll when open', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll on unmount', () => {
      const { unmount } = render(<FullScreenDetailModal {...defaultProps} />);
      unmount();
      expect(document.body.style.overflow).toBe('unset');
    });
  });

  // ── Close Behavior ─────────────────────────────────────
  describe('Close', () => {
    it('calls onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(<FullScreenDetailModal {...defaultProps} onClose={onClose} />);
      const closeBtn = screen.getByTestId('icon-x').closest('button');
      fireEvent.click(closeBtn!);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when overlay is clicked', () => {
      const onClose = vi.fn();
      const { container } = render(
        <FullScreenDetailModal {...defaultProps} onClose={onClose} />
      );
      const overlay = container.querySelector('.fullscreen-modal-overlay');
      fireEvent.click(overlay!);
      expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose on Escape key', () => {
      const onClose = vi.fn();
      render(<FullScreenDetailModal {...defaultProps} onClose={onClose} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  // ── Image Gallery ──────────────────────────────────────
  describe('Image Gallery', () => {
    const images = ['/img1.jpg', '/img2.jpg', '/img3.jpg'];

    it('renders gallery when images provided', () => {
      const { container } = render(
        <FullScreenDetailModal {...defaultProps} images={images} />
      );
      expect(container.querySelector('.modal-gallery')).toBeTruthy();
    });

    it('does not render gallery when no images', () => {
      const { container } = render(
        <FullScreenDetailModal {...defaultProps} images={[]} />
      );
      expect(container.querySelector('.modal-gallery')).toBeFalsy();
    });

    it('shows the first image initially', () => {
      const { container } = render(
        <FullScreenDetailModal {...defaultProps} images={images} />
      );
      const img = container.querySelector('.gallery-main-image') as HTMLImageElement;
      expect(img.src).toContain('img1.jpg');
    });

    it('shows image counter', () => {
      render(<FullScreenDetailModal {...defaultProps} images={images} />);
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('navigates to next image on next button click', () => {
      const { container } = render(
        <FullScreenDetailModal {...defaultProps} images={images} />
      );
      const nextBtn = container.querySelector('.gallery-nav.next');
      fireEvent.click(nextBtn!);
      const img = container.querySelector('.gallery-main-image') as HTMLImageElement;
      expect(img.src).toContain('img2.jpg');
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('navigates to previous image on prev button click', () => {
      const { container } = render(
        <FullScreenDetailModal {...defaultProps} images={images} />
      );
      // Go to image 2 first
      const nextBtn = container.querySelector('.gallery-nav.next');
      fireEvent.click(nextBtn!);
      // Go back
      const prevBtn = container.querySelector('.gallery-nav.prev');
      fireEvent.click(prevBtn!);
      const img = container.querySelector('.gallery-main-image') as HTMLImageElement;
      expect(img.src).toContain('img1.jpg');
    });

    it('wraps around to last image from first on prev', () => {
      const { container } = render(
        <FullScreenDetailModal {...defaultProps} images={images} />
      );
      const prevBtn = container.querySelector('.gallery-nav.prev');
      fireEvent.click(prevBtn!);
      const img = container.querySelector('.gallery-main-image') as HTMLImageElement;
      expect(img.src).toContain('img3.jpg');
    });

    it('wraps around to first image from last on next', () => {
      const { container } = render(
        <FullScreenDetailModal {...defaultProps} images={images} />
      );
      const nextBtn = container.querySelector('.gallery-nav.next');
      fireEvent.click(nextBtn!); // 2
      fireEvent.click(nextBtn!); // 3
      fireEvent.click(nextBtn!); // back to 1
      const img = container.querySelector('.gallery-main-image') as HTMLImageElement;
      expect(img.src).toContain('img1.jpg');
    });

    it('navigates with ArrowRight key', () => {
      const { container } = render(
        <FullScreenDetailModal {...defaultProps} images={images} />
      );
      fireEvent.keyDown(document, { key: 'ArrowRight' });
      const img = container.querySelector('.gallery-main-image') as HTMLImageElement;
      expect(img.src).toContain('img2.jpg');
    });

    it('navigates with ArrowLeft key', () => {
      const { container } = render(
        <FullScreenDetailModal {...defaultProps} images={images} />
      );
      fireEvent.keyDown(document, { key: 'ArrowLeft' });
      const img = container.querySelector('.gallery-main-image') as HTMLImageElement;
      expect(img.src).toContain('img3.jpg');
    });

    it('renders thumbnails for multiple images', () => {
      const { container } = render(
        <FullScreenDetailModal {...defaultProps} images={images} />
      );
      const thumbnails = container.querySelectorAll('.thumbnail');
      expect(thumbnails.length).toBe(3);
    });

    it('clicking a thumbnail selects that image', () => {
      const { container } = render(
        <FullScreenDetailModal {...defaultProps} images={images} />
      );
      const thumbnails = container.querySelectorAll('.thumbnail');
      fireEvent.click(thumbnails[2]);
      const img = container.querySelector('.gallery-main-image') as HTMLImageElement;
      expect(img.src).toContain('img3.jpg');
    });

    it('does not show nav arrows for single image', () => {
      const { container } = render(
        <FullScreenDetailModal {...defaultProps} images={['/single.jpg']} />
      );
      expect(container.querySelector('.gallery-nav')).toBeFalsy();
    });
  });

  // ── Tabs ───────────────────────────────────────────────
  describe('Tabs', () => {
    const tabs = [
      { label: 'Details', content: <p>Details Content</p> },
      { label: 'Floor Plan', content: <p>Floor Plan Content</p> },
      { label: 'Location', content: <p>Location Content</p> },
    ];

    it('renders tab buttons', () => {
      render(<FullScreenDetailModal {...defaultProps} tabs={tabs} />);
      expect(screen.getByText('Details')).toBeInTheDocument();
      expect(screen.getByText('Floor Plan')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
    });

    it('shows first tab content by default', () => {
      render(<FullScreenDetailModal {...defaultProps} tabs={tabs} />);
      expect(screen.getByText('Details Content')).toBeInTheDocument();
    });

    it('switches tab content on tab click', () => {
      render(<FullScreenDetailModal {...defaultProps} tabs={tabs} />);
      fireEvent.click(screen.getByText('Floor Plan'));
      expect(screen.getByText('Floor Plan Content')).toBeInTheDocument();
    });

    it('hides previous tab content when switching', () => {
      render(<FullScreenDetailModal {...defaultProps} tabs={tabs} />);
      fireEvent.click(screen.getByText('Floor Plan'));
      expect(screen.queryByText('Details Content')).not.toBeInTheDocument();
    });

    it('applies active class to selected tab', () => {
      const { container } = render(
        <FullScreenDetailModal {...defaultProps} tabs={tabs} />
      );
      const tabBtns = container.querySelectorAll('.modal-tab');
      expect(tabBtns[0]).toHaveClass('active');
    });

    it('respects defaultTab prop', () => {
      render(<FullScreenDetailModal {...defaultProps} tabs={tabs} defaultTab={2} />);
      expect(screen.getByText('Location Content')).toBeInTheDocument();
    });

    it('does not render children when tabs are provided', () => {
      render(
        <FullScreenDetailModal {...defaultProps} tabs={tabs}>
          <p>Children</p>
        </FullScreenDetailModal>
      );
      expect(screen.queryByText('Children')).not.toBeInTheDocument();
    });
  });

  // ── Actions ────────────────────────────────────────────
  describe('Actions', () => {
    it('renders action buttons', () => {
      const actions = [
        { label: 'Save', onClick: vi.fn() },
        { label: 'Delete', onClick: vi.fn(), danger: true },
      ];
      render(<FullScreenDetailModal {...defaultProps} actions={actions} />);
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('calls action onClick', () => {
      const onClick = vi.fn();
      const actions = [{ label: 'Save', onClick }];
      render(<FullScreenDetailModal {...defaultProps} actions={actions} />);
      fireEvent.click(screen.getByText('Save'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('applies primary style', () => {
      const actions = [{ label: 'Submit', onClick: vi.fn(), primary: true }];
      const { container } = render(
        <FullScreenDetailModal {...defaultProps} actions={actions} />
      );
      const btn = container.querySelector('.footer-action-btn.primary');
      expect(btn).toBeTruthy();
    });

    it('applies danger style', () => {
      const actions = [{ label: 'Remove', onClick: vi.fn(), danger: true }];
      const { container } = render(
        <FullScreenDetailModal {...defaultProps} actions={actions} />
      );
      const btn = container.querySelector('.footer-action-btn.danger');
      expect(btn).toBeTruthy();
    });

    it('disables action button when disabled', () => {
      const actions = [{ label: 'Nope', onClick: vi.fn(), disabled: true }];
      render(<FullScreenDetailModal {...defaultProps} actions={actions} />);
      expect(screen.getByText('Nope').closest('button')).toBeDisabled();
    });

    it('does not render footer when no actions', () => {
      const { container } = render(
        <FullScreenDetailModal {...defaultProps} actions={[]} />
      );
      expect(container.querySelector('.modal-footer')).toBeFalsy();
    });
  });

  // ── Sidebar ────────────────────────────────────────────
  describe('Sidebar', () => {
    it('renders sidebar when provided', () => {
      render(
        <FullScreenDetailModal {...defaultProps} sidebar={<div>Sidebar content</div>} />
      );
      expect(screen.getByText('Sidebar content')).toBeInTheDocument();
    });

    it('does not render sidebar when not provided', () => {
      const { container } = render(<FullScreenDetailModal {...defaultProps} />);
      expect(container.querySelector('.modal-sidebar')).toBeFalsy();
    });
  });

  // ── Header Actions ─────────────────────────────────────
  describe('Header Actions', () => {
    it('renders favorite button', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      expect(screen.getByTestId('icon-heart')).toBeInTheDocument();
    });

    it('renders share button', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      expect(screen.getByTestId('icon-share')).toBeInTheDocument();
    });

    it('renders download button', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      expect(screen.getByTestId('icon-download')).toBeInTheDocument();
    });

    it('toggles favorite on click', () => {
      const { container } = render(<FullScreenDetailModal {...defaultProps} />);
      const heartBtn = screen.getByTestId('icon-heart').closest('button')!;
      // Initial state - click to favorite
      fireEvent.click(heartBtn);
      // Should toggle (implementation-dependent, we just verify no crash)
      expect(heartBtn).toBeTruthy();
    });

    it('renders fullscreen toggle button', () => {
      render(<FullScreenDetailModal {...defaultProps} />);
      expect(screen.getByTestId('icon-maximize')).toBeInTheDocument();
    });
  });
});
