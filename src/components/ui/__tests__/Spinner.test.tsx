import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Spinner from '../Spinner';

describe('Spinner Component', () => {
  describe('Rendering', () => {
    it('should render spinner', () => {
      const { container } = render(<Spinner />);
      const spinner = container.querySelector('[role="status"]');
      expect(spinner).toBeInTheDocument();
    });

    it('should render with isLoading prop', () => {
      const { container } = render(<Spinner isLoading={true} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should not render when isLoading is false', () => {
      const { container } = render(<Spinner isLoading={false} />);
      const spinner = container.querySelector('[role="status"]');
      expect(spinner).not.toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should support different sizes', () => {
      const { container: smallContainer } = render(<Spinner size="sm" />);
      expect(smallContainer.firstChild).toBeInTheDocument();

      const { container: largeContainer } = render(<Spinner size="lg" />);
      expect(largeContainer.firstChild).toBeInTheDocument();
    });
  });

  describe('Colors', () => {
    it('should support different colors', () => {
      const { container: primaryContainer } = render(<Spinner color="primary" />);
      expect(primaryContainer.firstChild).toBeInTheDocument();

      const { container: secondaryContainer } = render(<Spinner color="secondary" />);
      expect(secondaryContainer.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role status', () => {
      const { container } = render(<Spinner />);
      const spinner = container.querySelector('[role="status"]');
      expect(spinner).toHaveAttribute('role', 'status');
    });

    it('should have aria-live', () => {
      const { container } = render(<Spinner />);
      const spinner = container.querySelector('[role="status"]');
      expect(spinner).toHaveAttribute('aria-live', 'polite');
    });

    it('should have aria-label', () => {
      const { container } = render(<Spinner aria-label="Loading content" />);
      const spinner = container.querySelector('[role="status"]');
      expect(spinner).toHaveAttribute('aria-label', 'Loading content');
    });
  });

  describe('Display', () => {
    it('should render with text label', () => {
      const { container } = render(<Spinner label="Loading..." />);
      expect(container.textContent).toContain('Loading...');
    });

    it('should show overlay variant', () => {
      const { container } = render(<Spinner variant="overlay" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
