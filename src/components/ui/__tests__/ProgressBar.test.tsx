import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProgressBar from '../ProgressBar';

describe('ProgressBar Component', () => {
  describe('Rendering', () => {
    it('should render progress bar', () => {
      const { container } = render(<ProgressBar value={50} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('should display percentage', () => {
      render(<ProgressBar value={75} showLabel />);
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<ProgressBar value={60} label="Download progress" />);
      expect(screen.getByText('Download progress')).toBeInTheDocument();
    });
  });

  describe('Values', () => {
    it('should handle 0% progress', () => {
      const { container } = render(<ProgressBar value={0} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    });

    it('should handle 100% progress', () => {
      const { container } = render(<ProgressBar value={100} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    });

    it('should clamp values between 0 and 100', () => {
      const { container: minContainer } = render(<ProgressBar value={-10} />);
      const minBar = minContainer.querySelector('[role="progressbar"]');
      expect(minBar?.getAttribute('aria-valuenow')).toBe('0');

      const { container: maxContainer } = render(<ProgressBar value={150} />);
      const maxBar = maxContainer.querySelector('[role="progressbar"]');
      expect(maxBar?.getAttribute('aria-valuenow')).toBe('100');
    });
  });

  describe('Colors', () => {
    it('should support different colors', () => {
      const { container: successContainer } = render(
        <ProgressBar value={50} color="success" />
      );
      expect(successContainer.firstChild).toBeInTheDocument();

      const { container: warningContainer } = render(
        <ProgressBar value={50} color="warning" />
      );
      expect(warningContainer.firstChild).toBeInTheDocument();

      const { container: dangerContainer } = render(
        <ProgressBar value={50} color="danger" />
      );
      expect(dangerContainer.firstChild).toBeInTheDocument();
    });
  });

  describe('Animations', () => {
    it('should support animated variant', () => {
      const { container } = render(
        <ProgressBar value={50} animated />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should support striped variant', () => {
      const { container } = render(
        <ProgressBar value={50} striped />
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role progressbar', () => {
      const { container } = render(<ProgressBar value={50} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('role', 'progressbar');
    });

    it('should have aria-valuenow', () => {
      const { container } = render(<ProgressBar value={65} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuenow', '65');
    });

    it('should have aria-valuemin and aria-valuemax', () => {
      const { container } = render(<ProgressBar value={50} />);
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });

    it('should have aria-label', () => {
      const { container } = render(
        <ProgressBar value={50} aria-label="Upload progress" />
      );
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveAttribute('aria-label', 'Upload progress');
    });
  });

  describe('Height', () => {
    it('should support different heights', () => {
      const { container } = render(
        <ProgressBar value={50} height="lg" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
