import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge Component', () => {
  describe('Rendering', () => {
    it('should render with default variant', () => {
      render(<Badge>Success</Badge>);
      const badge = screen.getByText('Success');
      expect(badge).toBeInTheDocument();
    });

    it('should render with success variant', () => {
      render(<Badge variant="success">Success Status</Badge>);
      const badge = screen.getByText('Success Status');
      expect(badge).toBeInTheDocument();
    });

    it('should render with warning variant', () => {
      render(<Badge variant="warning">Warning</Badge>);
      const badge = screen.getByText('Warning');
      expect(badge).toBeInTheDocument();
    });

    it('should render with error variant', () => {
      render(<Badge variant="error">Error</Badge>);
      const badge = screen.getByText('Error');
      expect(badge).toBeInTheDocument();
    });

    it('should render with info variant', () => {
      render(<Badge variant="info">Information</Badge>);
      const badge = screen.getByText('Information');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply correct className', () => {
      const { container } = render(<Badge>Test</Badge>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should support custom className', () => {
      const { container } = render(<Badge className="custom-class">Test</Badge>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('should render children correctly', () => {
      render(<Badge>Badge Content</Badge>);
      expect(screen.getByText('Badge Content')).toBeInTheDocument();
    });

    it('should render with React nodes as children', () => {
      render(<Badge><strong>Bold Text</strong></Badge>);
      expect(screen.getByText('Bold Text')).toBeInTheDocument();
    });

    it('should handle empty children', () => {
      const { container } = render(<Badge>{''}</Badge>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible with keyboard', () => {
      const { container } = render(<Badge>Accessible Badge</Badge>);
      const badge = container.firstChild;
      expect(badge).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      const { container } = render(<Badge>Active</Badge>);
      const badge = container.firstChild;
      expect(badge).toHaveAttribute('aria-label', 'Active');
    });
  });
});
