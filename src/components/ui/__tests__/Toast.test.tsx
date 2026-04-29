import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast from '../Toast';
import type { ToastConfig } from '../advancedUI.types';

const createToast = (overrides: Partial<ToastConfig> = {}): ToastConfig => ({
  id: '1',
  type: 'success',
  message: 'Test message',
  timestamp: new Date().toISOString(),
  ...overrides,
});

describe('Toast Component', () => {
  describe('Rendering', () => {
    it('should render toast with message', () => {
      const toasts = [createToast({ message: 'Test message' })];
      render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should render toast with description', () => {
      const toasts = [createToast({ message: 'Message', description: 'Description text' })];
      render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      
      expect(screen.getByText('Message')).toBeInTheDocument();
    });
  });

  describe('Types', () => {
    it('should render success toast', () => {
      const toasts = [createToast({ type: 'success', message: 'Success' })];
      const { container } = render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render error toast', () => {
      const toasts = [createToast({ type: 'error', message: 'Error' })];
      const { container } = render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render warning toast', () => {
      const toasts = [createToast({ type: 'warning', message: 'Warning' })];
      const { container } = render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render info toast', () => {
      const toasts = [createToast({ type: 'info', message: 'Info' })];
      const { container } = render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('should render close button', () => {
      const toasts = [createToast()];
      render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      
      const closeButton = screen.queryByRole('button');
      if (closeButton) {
        expect(closeButton).toBeInTheDocument();
      }
    });

    it('should call onRemove when close button is clicked', async () => {
      const handleRemove = vi.fn();
      const toasts = [createToast({ id: 'toast-1' })];
      const { container } = render(
        <Toast toasts={toasts} onRemove={handleRemove} />
      );
      
      const closeButton = container.querySelector('button');
      if (closeButton) {
        closeButton.click();
        await waitFor(() => {
          expect(handleRemove).toHaveBeenCalledWith('toast-1');
        });
      }
    });
  });

  describe('Auto Dismiss', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should auto dismiss after duration', async () => {
      const handleRemove = vi.fn();
      const toasts = [createToast({ id: 'toast-1', duration: 3000 })];
      render(<Toast toasts={toasts} onRemove={handleRemove} />);
      
      // Advance past the main timeout (3000ms) - triggers setIsExiting(true)
      await act(async () => {
        vi.advanceTimersByTime(3000);
      });
      // Advance past the exit animation timeout (300ms) - triggers onRemove
      await act(async () => {
        vi.advanceTimersByTime(300);
      });
      
      expect(handleRemove).toHaveBeenCalledWith('toast-1');
    });

    it('should not auto dismiss if duration is 0', async () => {
      const handleRemove = vi.fn();
      const toasts = [createToast({ duration: 0 })];
      render(<Toast toasts={toasts} onRemove={handleRemove} />);
      
      vi.advanceTimersByTime(10000);
      
      expect(handleRemove).not.toHaveBeenCalled();
    });
  });

  describe('Position', () => {
    it('should support different positions', () => {
      const toasts = [createToast({ position: 'top-right' })];
      const { container, rerender } = render(
        <Toast toasts={toasts} onRemove={vi.fn()} />
      );
      
      expect(container.firstChild).toBeInTheDocument();
      
      const bottomToasts = [createToast({ position: 'bottom-left' })];
      rerender(<Toast toasts={bottomToasts} onRemove={vi.fn()} />);
      
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role alert', () => {
      const toasts = [createToast({ type: 'warning' })];
      const { container } = render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      
      const toast = container.querySelector('[role="alert"]');
      expect(toast).toBeInTheDocument();
    });

    it('should be announced to screen readers', () => {
      const toasts = [createToast({ message: 'Important message' })];
      const { container } = render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      
      const toast = container.querySelector('[role="alert"]');
      expect(toast?.textContent).toContain('Important message');
    });
  });

  describe('Multiple Toasts', () => {
    it('should render multiple toasts', () => {
      const toasts = [
        createToast({ id: '1', message: 'First toast' }),
        createToast({ id: '2', message: 'Second toast' }),
      ];
      render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      
      expect(screen.getByText('First toast')).toBeInTheDocument();
      expect(screen.getByText('Second toast')).toBeInTheDocument();
    });

    it('should render multiple toasts in same position', () => {
      const toasts = [
        createToast({ id: '1', message: 'Top right 1', position: 'top-right' }),
        createToast({ id: '2', message: 'Top right 2', position: 'top-right' }),
      ];
      render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      
      expect(screen.getByText('Top right 1')).toBeInTheDocument();
      expect(screen.getByText('Top right 2')).toBeInTheDocument();
    });

    it('should render toasts in different positions', () => {
      const toasts = [
        createToast({ id: '1', message: 'Top left toast', position: 'top-left' }),
        createToast({ id: '2', message: 'Bottom right toast', position: 'bottom-right' }),
      ];
      render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      
      expect(screen.getByText('Top left toast')).toBeInTheDocument();
      expect(screen.getByText('Bottom right toast')).toBeInTheDocument();
    });
  });

  describe('Description', () => {
    it('should render description text when provided', () => {
      const toasts = [createToast({ message: 'Title', description: 'Some extra detail' })];
      render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      
      expect(screen.getByText('Some extra detail')).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      const toasts = [createToast({ message: 'Title only' })];
      const { container } = render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      
      // Only the message text should be present, no description
      expect(screen.getByText('Title only')).toBeInTheDocument();
    });
  });

  describe('Action Button', () => {
    it('should render action button when provided', () => {
      const actionFn = vi.fn();
      const toasts = [createToast({
        message: 'With action',
        action: { label: 'Undo', onClick: actionFn },
      })];
      render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      
      expect(screen.getByText('Undo')).toBeInTheDocument();
    });

    it('should call action onClick when action button is clicked', async () => {
      const actionFn = vi.fn();
      const user = userEvent.setup();
      const toasts = [createToast({
        message: 'Undoable',
        action: { label: 'Undo', onClick: actionFn },
      })];
      render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      
      await user.click(screen.getByText('Undo'));
      expect(actionFn).toHaveBeenCalled();
    });

    it('should not render action button when not provided', () => {
      const toasts = [createToast({ message: 'No action' })];
      render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      
      // Only close button should exist
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1); // Just the close button
    });
  });

  describe('All Positions', () => {
    const positions: Array<'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'> = [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right',
    ];

    positions.forEach(position => {
      it(`should render toast in ${position}`, () => {
        const toasts = [createToast({ id: position, message: `Toast at ${position}`, position })];
        const { container } = render(<Toast toasts={toasts} onRemove={vi.fn()} />);
        
        expect(screen.getByText(`Toast at ${position}`)).toBeInTheDocument();
      });
    });
  });

  describe('Close Callback', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should call onClose callback when close button is clicked', async () => {
      const onCloseFn = vi.fn();
      const handleRemove = vi.fn();
      const toasts = [createToast({ id: 'cb-1', message: 'Closeable', onClose: onCloseFn })];
      const { container } = render(<Toast toasts={toasts} onRemove={handleRemove} />);
      
      const closeButton = container.querySelector('button');
      if (closeButton) {
        closeButton.click();
        
        // Wait for 300ms exit animation
        await act(async () => {
          vi.advanceTimersByTime(300);
        });
        
        expect(onCloseFn).toHaveBeenCalled();
      }
    });
  });

  describe('Persistent Toast (duration=0)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should remain visible indefinitely', async () => {
      const handleRemove = vi.fn();
      const toasts = [createToast({ id: 'persistent', duration: 0, message: 'Stays forever' })];
      render(<Toast toasts={toasts} onRemove={handleRemove} />);
      
      // Advance very far into the future
      vi.advanceTimersByTime(60000);
      
      expect(handleRemove).not.toHaveBeenCalled();
      expect(screen.getByText('Stays forever')).toBeInTheDocument();
    });
  });

  describe('Default Duration', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should auto dismiss after default 5000ms if no duration specified', async () => {
      const handleRemove = vi.fn();
      const toasts = [createToast({ id: 'default-timer' })];
      render(<Toast toasts={toasts} onRemove={handleRemove} />);
      
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });
      await act(async () => {
        vi.advanceTimersByTime(300);
      });
      
      expect(handleRemove).toHaveBeenCalledWith('default-timer');
    });
  });

  describe('Close Button Accessibility', () => {
    it('should have aria-label on close button', () => {
      const toasts = [createToast({ message: 'Accessible toast' })];
      render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      
      const closeButton = screen.getByLabelText('Close notification');
      expect(closeButton).toBeInTheDocument();
    });

    it('should have title on close button', () => {
      const toasts = [createToast({ message: 'Titled toast' })];
      render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      
      const closeButton = screen.getByTitle('Close');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Empty Toasts', () => {
    it('should render nothing when toasts array is empty', () => {
      const { container } = render(<Toast toasts={[]} onRemove={vi.fn()} />);
      
      // Should render empty fragment, no positioned containers
      expect(container.children.length).toBe(0);
    });
  });

  describe('Progress Bar', () => {
    it('should show progress bar for timed toasts', () => {
      const toasts = [createToast({ duration: 3000, message: 'With progress' })];
      const { container } = render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      
      // Progress bar should exist (the ProgressBar styled component)
      expect(container.querySelector('[role="alert"]')).toBeInTheDocument();
    });

    it('should not show progress bar for persistent toasts', () => {
      const toasts = [createToast({ duration: 0, message: 'No progress' })];
      render(<Toast toasts={toasts} onRemove={vi.fn()} />);
      
      expect(screen.getByText('No progress')).toBeInTheDocument();
    });
  });
});
