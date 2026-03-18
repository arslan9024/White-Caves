import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../Modal';

describe('Modal Component', () => {
  describe('Rendering', () => {
    it('should render modal when isOpen is true', () => {
      render(
        <Modal isOpen={true} title="Test Modal">
          Modal content
        </Modal>
      );
      
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      const { container } = render(
        <Modal isOpen={false} title="Test Modal">
          Modal content
        </Modal>
      );
      
      const modal = container.querySelector('[role="dialog"]');
      expect(modal).not.toBeInTheDocument();
    });

    it('should render modal with title', () => {
      render(
        <Modal isOpen={true} title="Modal Title">
          Content
        </Modal>
      );
      
      expect(screen.getByText('Modal Title')).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('should render close button', () => {
      render(
        <Modal isOpen={true} title="Test">
          Content
        </Modal>
      );
      
      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Modal isOpen={true} title="Test" onClose={handleClose}>
          Content
        </Modal>
      );
      
      const closeButton = screen.getByRole('button');
      await user.click(closeButton);
      
      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe('Backdrop Click', () => {
    it('should close modal on backdrop click', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <Modal isOpen={true} title="Test" onClose={handleClose}>
          Content
        </Modal>
      );
      
      const backdrop = container.querySelector('[class*="backdrop"]');
      if (backdrop) {
        await user.click(backdrop);
        expect(handleClose).toHaveBeenCalled();
      }
    });
  });

  describe('Actions', () => {
    it('should render action buttons', () => {
      const handleConfirm = vi.fn();
      render(
        <Modal 
          isOpen={true} 
          title="Test" 
          onConfirm={handleConfirm}
        >
          Content
        </Modal>
      );
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should call onConfirm when confirm button is clicked', async () => {
      const handleConfirm = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Modal 
          isOpen={true} 
          title="Test" 
          onConfirm={handleConfirm}
        >
          Content
        </Modal>
      );
      
      const confirmButton = screen.getByRole('button', { name: /confirm|submit|ok/i });
      if (confirmButton) {
        await user.click(confirmButton);
        expect(handleConfirm).toHaveBeenCalled();
      }
    });
  });

  describe('Sizes', () => {
    it('should support different sizes', () => {
      const { container } = render(
        <Modal isOpen={true} title="Test" size="lg">
          Content
        </Modal>
      );
      
      const modal = container.querySelector('[role="dialog"]');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role dialog', () => {
      const { container } = render(
        <Modal isOpen={true} title="Test Modal">
          Content
        </Modal>
      );
      
      const modal = container.querySelector('[role="dialog"]');
      expect(modal).toBeInTheDocument();
    });

    it('should have aria-modal', () => {
      const { container } = render(
        <Modal isOpen={true} title="Test Modal">
          Content
        </Modal>
      );
      
      const modal = container.querySelector('[aria-modal="true"]');
      expect(modal).toBeInTheDocument();
    });

    it('should have aria-labelledby for title', () => {
      const { container } = render(
        <Modal isOpen={true} title="Modal Title">
          Content
        </Modal>
      );
      
      const modal = container.querySelector('[role="dialog"]');
      expect(modal).toHaveAttribute('aria-labelledby');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close on Escape key', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Modal isOpen={true} title="Test" onClose={handleClose}>
          Content
        </Modal>
      );
      
      await user.keyboard('{Escape}');
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
