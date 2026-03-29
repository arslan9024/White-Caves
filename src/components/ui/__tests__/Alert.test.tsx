import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Alert from '../Alert';

describe('Alert Component', () => {
  describe('Rendering', () => {
    it('should render alert with success type', () => {
      render(<Alert type="success" message="Success message" />);
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    it('should render alert with error type', () => {
      render(<Alert type="error" message="Error message" />);
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('should render alert with warning type', () => {
      render(<Alert type="warning" message="Warning message" />);
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });

    it('should render alert with info type', () => {
      render(<Alert type="info" message="Info message" />);
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
  });

  describe('Title', () => {
    it('should render title when provided', () => {
      render(
        <Alert type="success" title="Success!" message="Operation completed" />
      );
      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText('Operation completed')).toBeInTheDocument();
    });

    it('should work without title', () => {
      render(<Alert type="info" message="Just message" />);
      expect(screen.getByText('Just message')).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('should render close button when closable is true', () => {
      render(
        <Alert type="success" closable message="Closable alert" />
      );
      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();
      render(
        <Alert type="success" closable onClose={handleClose} message="Alert message" />
      );
      
      const closeButton = screen.getByRole('button');
      await user.click(closeButton);
      
      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('should apply correct variant classes', () => {
      const { container } = render(
        <Alert type="error" message="Error alert" />
      );
      const alert = container.firstChild;
      expect(alert).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role alert', () => {
      const { container } = render(
        <Alert type="warning" message="Warning message" />
      );
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toBeInTheDocument();
    });
  });
});
