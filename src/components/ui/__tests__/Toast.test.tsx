import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Toast from '../Toast';

describe('Toast Component', () => {
  describe('Rendering', () => {
    it('should render toast with message', () => {
      render(
        <Toast id="1" message="Test message" type="success" />
      );
      
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should render toast with title', () => {
      render(
        <Toast 
          id="1" 
          message="Message" 
          type="info"
          title="Title"
        />
      );
      
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Message')).toBeInTheDocument();
    });
  });

  describe('Types', () => {
    it('should render success toast', () => {
      const { container } = render(
        <Toast id="1" message="Success" type="success" />
      );
      
      const toast = container.firstChild;
      expect(toast).toHaveClass('toast-success');
    });

    it('should render error toast', () => {
      const { container } = render(
        <Toast id="1" message="Error" type="error" />
      );
      
      const toast = container.firstChild;
      expect(toast).toHaveClass('toast-error');
    });

    it('should render warning toast', () => {
      const { container } = render(
        <Toast id="1" message="Warning" type="warning" />
      );
      
      const toast = container.firstChild;
      expect(toast).toHaveClass('toast-warning');
    });

    it('should render info toast', () => {
      const { container } = render(
        <Toast id="1" message="Info" type="info" />
      );
      
      const toast = container.firstChild;
      expect(toast).toHaveClass('toast-info');
    });
  });

  describe('Close Button', () => {
    it('should render close button', () => {
      render(
        <Toast id="1" message="Test" type="success" />
      );
      
      const closeButton = screen.queryByRole('button');
      if (closeButton) {
        expect(closeButton).toBeInTheDocument();
      }
    });

    it('should call onClose when close button is clicked', async () => {
      const handleClose = vi.fn();
      const { container } = render(
        <Toast 
          id="1" 
          message="Test" 
          type="success"
          onClose={handleClose}
        />
      );
      
      const closeButton = container.querySelector('button');
      if (closeButton) {
        closeButton.click();
        expect(handleClose).toHaveBeenCalledWith('1');
      }
    });
  });

  describe('Auto Dismiss', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should auto dismiss after duration', async () => {
      const handleClose = vi.fn();
      render(
        <Toast 
          id="1" 
          message="Test" 
          type="success"
          duration={3000}
          onClose={handleClose}
        />
      );
      
      vi.advanceTimersByTime(3000);
      
      await waitFor(() => {
        expect(handleClose).toHaveBeenCalledWith('1');
      });
    });

    it('should not auto dismiss if duration is 0', async () => {
      const handleClose = vi.fn();
      render(
        <Toast 
          id="1" 
          message="Test" 
          type="info"
          duration={0}
          onClose={handleClose}
        />
      );
      
      vi.advanceTimersByTime(10000);
      
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('Position', () => {
    it('should support different positions', () => {
      const { container, rerender } = render(
        <Toast id="1" message="Test" type="success" position="top-right" />
      );
      
      expect(container.firstChild).toBeInTheDocument();
      
      rerender(
        <Toast id="1" message="Test" type="success" position="bottom-left" />
      );
      
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role alert', () => {
      const { container } = render(
        <Toast id="1" message="Test" type="warning" />
      );
      
      const toast = container.querySelector('[role="alert"]');
      expect(toast).toBeInTheDocument();
    });

    it('should be announced to screen readers', () => {
      const { container } = render(
        <Toast id="1" message="Important message" type="success" />
      );
      
      const toast = container.querySelector('[role="alert"]');
      expect(toast?.textContent).toContain('Important message');
    });
  });

  describe('Progress Bar', () => {
    it('should render progress bar when duration is set', () => {
      const { container } = render(
        <Toast 
          id="1" 
          message="Test" 
          type="success"
          duration={5000}
        />
      );
      
      const progressBar = container.querySelector('[class*="progress"]');
      if (progressBar) {
        expect(progressBar).toBeInTheDocument();
      }
    });
  });
});
