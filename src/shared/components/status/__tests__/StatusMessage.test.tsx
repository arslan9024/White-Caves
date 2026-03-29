import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

// Mock CSS import
vi.mock('../StatusMessage.css', () => ({}));

import StatusMessage, {
  SuccessStatus,
  ErrorStatus,
  PendingStatus,
  WarningStatus,
  InfoStatus,
} from '../StatusMessage';

describe('StatusMessage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('should render message text', () => {
      render(<StatusMessage message="Operation complete" />);
      expect(screen.getByText('Operation complete')).toBeInTheDocument();
    });

    it('should render with title', () => {
      render(<StatusMessage message="Details here" title="Alert" />);
      expect(screen.getByText('Alert')).toBeInTheDocument();
      expect(screen.getByText('Details here')).toBeInTheDocument();
    });

    it('should default to info type', () => {
      const { container } = render(<StatusMessage message="Test" />);
      expect(container.querySelector('.status-info')).toBeInTheDocument();
    });

    it('should have role alert', () => {
      render(<StatusMessage message="Test" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<StatusMessage message="Test" className="my-class" />);
      expect(container.querySelector('.my-class')).toBeInTheDocument();
    });
  });

  describe('Status Types', () => {
    it.each([
      ['success', '✓'],
      ['error', '✕'],
      ['warning', '⚠'],
      ['info', 'ℹ'],
      ['pending', '⏳'],
    ] as const)('should render %s type with icon %s', (type, icon) => {
      const { container } = render(<StatusMessage type={type} message="Test" />);
      expect(container.querySelector(`.status-${type}`)).toBeInTheDocument();
      expect(screen.getByText(icon)).toBeInTheDocument();
    });
  });

  describe('Icon Control', () => {
    it('should show icon by default', () => {
      render(<StatusMessage type="success" message="Test" />);
      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('should hide icon when showIcon is false', () => {
      render(<StatusMessage type="success" message="Test" showIcon={false} />);
      expect(screen.queryByText('✓')).not.toBeInTheDocument();
    });
  });

  describe('Compact Mode', () => {
    it('should apply compact class', () => {
      const { container } = render(<StatusMessage message="Test" compact />);
      expect(container.querySelector('.compact')).toBeInTheDocument();
    });

    it('should not have compact class by default', () => {
      const { container } = render(<StatusMessage message="Test" />);
      expect(container.querySelector('.compact')).not.toBeInTheDocument();
    });
  });

  describe('Dismiss Button', () => {
    it('should show dismiss button when onDismiss provided', () => {
      render(<StatusMessage message="Test" onDismiss={vi.fn()} />);
      expect(screen.getByLabelText('Dismiss message')).toBeInTheDocument();
    });

    it('should not show dismiss button without onDismiss', () => {
      render(<StatusMessage message="Test" />);
      expect(screen.queryByLabelText('Dismiss message')).not.toBeInTheDocument();
    });

    it('should call onDismiss and hide on click', () => {
      const onDismiss = vi.fn();
      render(<StatusMessage message="Test" onDismiss={onDismiss} />);
      fireEvent.click(screen.getByLabelText('Dismiss message'));
      expect(onDismiss).toHaveBeenCalled();
      expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });
  });

  describe('Auto Dismiss', () => {
    it('should auto-dismiss after dismissAfter ms', () => {
      const onDismiss = vi.fn();
      render(
        <StatusMessage
          message="Temporary"
          autoDismiss
          dismissAfter={3000}
          onDismiss={onDismiss}
        />
      );

      expect(screen.getByText('Temporary')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(screen.queryByText('Temporary')).not.toBeInTheDocument();
      expect(onDismiss).toHaveBeenCalled();
    });

    it('should not auto-dismiss when autoDismiss is false', () => {
      render(
        <StatusMessage
          message="Persistent"
          autoDismiss={false}
          dismissAfter={1000}
        />
      );

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(screen.getByText('Persistent')).toBeInTheDocument();
    });

    it('should use default dismissAfter of 10000ms', () => {
      render(<StatusMessage message="Default timer" autoDismiss />);

      act(() => {
        vi.advanceTimersByTime(9999);
      });
      expect(screen.getByText('Default timer')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.queryByText('Default timer')).not.toBeInTheDocument();
    });
  });

  describe('Variant Helpers', () => {
    it('should render SuccessStatus', () => {
      const { container } = render(<SuccessStatus message="Done!" />);
      expect(container.querySelector('.status-success')).toBeInTheDocument();
      expect(screen.getByText('Done!')).toBeInTheDocument();
    });

    it('should render ErrorStatus', () => {
      const { container } = render(<ErrorStatus message="Failed!" />);
      expect(container.querySelector('.status-error')).toBeInTheDocument();
    });

    it('should render PendingStatus', () => {
      const { container } = render(<PendingStatus message="Loading..." />);
      expect(container.querySelector('.status-pending')).toBeInTheDocument();
    });

    it('should render WarningStatus', () => {
      const { container } = render(<WarningStatus message="Careful!" />);
      expect(container.querySelector('.status-warning')).toBeInTheDocument();
    });

    it('should render InfoStatus', () => {
      const { container } = render(<InfoStatus message="FYI" />);
      expect(container.querySelector('.status-info')).toBeInTheDocument();
    });
  });

  describe('CSS Custom Properties', () => {
    it('should set status CSS custom properties', () => {
      render(<StatusMessage type="success" message="Test" />);
      const el = screen.getByRole('alert');
      expect(el.style.getPropertyValue('--status-bg')).toBeTruthy();
    });
  });
});
