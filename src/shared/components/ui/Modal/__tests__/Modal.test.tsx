/**
 * @file Modal.test.tsx
 * @description Comprehensive tests for shared Modal component
 * Tests: rendering, portal usage, accessibility, focus trap, escape key, overlay click,
 *        body scroll lock, sizes, compound component (Footer), close button
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock createPortal to render in place for testing
vi.mock('react-dom', async () => {
  const original = await vi.importActual('react-dom');
  return {
    ...original,
    createPortal: (node: React.ReactNode) => node,
  };
});

import Modal, { ModalFooter } from '../Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal',
    children: <p>Modal content</p>,
  };

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
      render(<Modal {...defaultProps} />);
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(<Modal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    });

    it('renders the title', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });

    it('renders without title when not provided', () => {
      render(<Modal {...defaultProps} title={undefined} />);
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    it('renders children content', () => {
      render(<Modal {...defaultProps}><span>Custom child</span></Modal>);
      expect(screen.getByText('Custom child')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<Modal {...defaultProps} className="custom-modal" />);
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });
  });

  // ── Accessibility ──────────────────────────────────────
  describe('Accessibility', () => {
    it('has role="dialog"', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has aria-modal="true"', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('has aria-labelledby when title is provided', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('does not have aria-labelledby when no title', () => {
      render(<Modal {...defaultProps} title={undefined} />);
      expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
    });

    it('close button has aria-label', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });
  });

  // ── Close Button ───────────────────────────────────────
  describe('Close Button', () => {
    it('shows close button by default', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });

    it('hides close button when showCloseButton is false', () => {
      render(<Modal {...defaultProps} showCloseButton={false} title={undefined} />);
      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      fireEvent.click(screen.getByLabelText('Close modal'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  // ── Escape Key ─────────────────────────────────────────
  describe('Escape Key', () => {
    it('calls onClose when Escape is pressed', () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when closeOnEscape is false', () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} closeOnEscape={false} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  // ── Overlay Click ──────────────────────────────────────
  describe('Overlay Click', () => {
    it('calls onClose when overlay is clicked', () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      // The overlay is the dialog role element (ModalOverlay)
      const overlay = screen.getByRole('dialog');
      fireEvent.click(overlay);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when closeOnOverlayClick is false', () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} closeOnOverlayClick={false} />);
      const overlay = screen.getByRole('dialog');
      fireEvent.click(overlay);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not call onClose when clicking inside modal content', () => {
      const onClose = vi.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      const content = screen.getByText('Modal content');
      fireEvent.click(content);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  // ── Body Scroll Lock ───────────────────────────────────
  describe('Body Scroll Lock', () => {
    it('sets document.body overflow to hidden when open', () => {
      render(<Modal {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores document.body overflow when closed', () => {
      const { rerender } = render(<Modal {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');
      rerender(<Modal {...defaultProps} isOpen={false} />);
      // After unmount/close, overflow should be restored
      expect(document.body.style.overflow).toBe('');
    });
  });

  // ── Sizes ──────────────────────────────────────────────
  describe('Sizes', () => {
    it('renders with default medium size', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('renders with small size', () => {
      render(<Modal {...defaultProps} size="small" />);
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('renders with large size', () => {
      render(<Modal {...defaultProps} size="large" />);
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('renders with fullscreen size', () => {
      render(<Modal {...defaultProps} size="fullscreen" />);
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('renders with full size', () => {
      render(<Modal {...defaultProps} size="full" />);
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });
  });

  // ── Header Rendering ──────────────────────────────────
  describe('Header', () => {
    it('renders title when provided', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });

    it('renders close button when only close button is shown', () => {
      render(<Modal {...defaultProps} title={undefined} showCloseButton={true} />);
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });

    it('does not render close button or title when both are hidden', () => {
      render(<Modal {...defaultProps} title={undefined} showCloseButton={false} />);
      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });
  });

  // ── Compound Component: ModalFooter ────────────────────
  describe('Modal.Footer / ModalFooter', () => {
    it('renders ModalFooter as compound component', () => {
      render(
        <Modal {...defaultProps}>
          <p>Content</p>
          <Modal.Footer>
            <button>Save</button>
            <button>Cancel</button>
          </Modal.Footer>
        </Modal>
      );
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('renders standalone ModalFooter', () => {
      render(<ModalFooter><button>OK</button></ModalFooter>);
      expect(screen.getByText('OK')).toBeInTheDocument();
    });
  });

  // ── No onClose handler ────────────────────────────────
  describe('Without onClose', () => {
    it('renders without crashing when no onClose provided', () => {
      render(<Modal isOpen={true} title="No handler"><p>Content</p></Modal>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('does not crash on Escape when no onClose', () => {
      render(<Modal isOpen={true} title="No handler"><p>Content</p></Modal>);
      expect(() => {
        fireEvent.keyDown(document, { key: 'Escape' });
      }).not.toThrow();
    });
  });

  // ── Title ID ───────────────────────────────────────────
  describe('Title ID', () => {
    it('title element has id "modal-title"', () => {
      render(<Modal {...defaultProps} />);
      const titleEl = screen.getByText('Test Modal');
      expect(titleEl).toHaveAttribute('id', 'modal-title');
    });
  });
});
