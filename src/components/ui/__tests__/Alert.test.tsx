import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Alert from '../Alert';

describe('Alert Component', () => {
  describe('Rendering', () => {
    it('should render alert with success type', () => {
      render(<Alert type="success">Success message</Alert>);
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    it('should render alert with error type', () => {
      render(<Alert type="error">Error message</Alert>);
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('should render alert with warning type', () => {
      render(<Alert type="warning">Warning message</Alert>);
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });

    it('should render alert with info type', () => {
      render(<Alert type="info">Info message</Alert>);
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
  });

  describe('Title', () => {
    it('should render title when provided', () => {
      render(
        <Alert type="success" title="Success!">
          Operation completed
        </Alert>
      );
      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText('Operation completed')).toBeInTheDocument();
    });

    it('should work without title', () => {
      render(<Alert type="info">Just message</Alert>);
      expect(screen.getByText('Just message')).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('should render close button when closable is true', () => {
      render(
        <Alert type="success" closable>
          Closable alert
        </Alert>
      );
      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      render(
        <Alert type="success" closable onClose={handleClose}>
          Alert message
        </Alert>
      );
      
      const closeButton = screen.getByRole('button');
      await user.click(closeButton);
      
      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('should apply correct variant classes', () => {
      const { container } = render(
        <Alert type="error">Error alert</Alert>
      );
      const alert = container.firstChild;
      expect(alert).toHaveClass('alert-error');
    });
  });

  describe('Accessibility', () => {
    it('should have role alert', () => {
      const { container } = render(
        <Alert type="warning">Warning message</Alert>
      );
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toBeInTheDocument();
    });
  });
});
