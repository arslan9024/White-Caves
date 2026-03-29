import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock styled-components
vi.mock('./Button.styles', () => ({
  StyledButton: React.forwardRef(({ children, ...props }: any, ref: any) => {
    const filtered: any = {};
    for (const [k, v] of Object.entries(props)) {
      if (!k.startsWith('$')) filtered[k] = v;
    }
    return React.createElement('button', { ...filtered, ref }, children);
  }),
  IconWrapper: ({ children, ...props }: any) => {
    const { $position, ...rest } = props;
    return React.createElement('span', { ...rest, 'data-position': $position }, children);
  },
  LoadingSpinner: (props: any) => React.createElement('span', { ...props, 'data-testid': 'loading-spinner' }),
}));

import { Button } from './Button';

describe('Button', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // === RENDERING ===
  describe('rendering', () => {
    it('renders button with children text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('renders with default variant (primary)', () => {
      render(<Button>Primary</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders with all variant types', () => {
      const variants = ['primary', 'secondary', 'danger', 'outline', 'ghost', 'success'] as const;
      variants.forEach((variant) => {
        const { unmount } = render(<Button variant={variant}>{variant}</Button>);
        expect(screen.getByRole('button', { name: variant })).toBeInTheDocument();
        unmount();
      });
    });

    it('renders with all size types', () => {
      const sizes = ['sm', 'md', 'lg'] as const;
      sizes.forEach((size) => {
        const { unmount } = render(<Button size={size}>{size}</Button>);
        expect(screen.getByRole('button', { name: size })).toBeInTheDocument();
        unmount();
      });
    });
  });

  // === LOADING STATE ===
  describe('loading state', () => {
    it('shows loading spinner when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('hides icon when loading', () => {
      render(
        <Button isLoading icon={<span data-testid="icon">+</span>}>
          Add
        </Button>
      );
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('disables button when loading', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('sets aria-busy when loading', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('does not trigger onClick when loading', () => {
      const onClick = vi.fn();
      render(<Button isLoading onClick={onClick}>Click</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  // === DISABLED STATE ===
  describe('disabled state', () => {
    it('disables button when isDisabled is true', () => {
      render(<Button isDisabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('disables button when native disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not trigger onClick when disabled', () => {
      const onClick = vi.fn();
      render(<Button isDisabled onClick={onClick}>Click</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  // === ICON ===
  describe('icon', () => {
    it('renders icon on the left by default', () => {
      render(
        <Button icon={<span data-testid="icon">+</span>}>
          Add
        </Button>
      );
      const iconWrapper = screen.getByTestId('icon').parentElement;
      expect(iconWrapper).toHaveAttribute('data-position', 'left');
    });

    it('renders icon on the right when iconPosition is right', () => {
      render(
        <Button icon={<span data-testid="icon">→</span>} iconPosition="right">
          Next
        </Button>
      );
      const iconWrapper = screen.getByTestId('icon').parentElement;
      expect(iconWrapper).toHaveAttribute('data-position', 'right');
    });

    it('renders icon with aria-hidden', () => {
      render(
        <Button icon={<span data-testid="icon">+</span>}>
          Add
        </Button>
      );
      const iconWrapper = screen.getByTestId('icon').parentElement;
      expect(iconWrapper).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // === EVENTS ===
  describe('events', () => {
    it('calls onClick handler when clicked', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('receives the click event object', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  // === FULL WIDTH ===
  describe('fullWidth', () => {
    it('renders in full width mode', () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  // === REF FORWARDING ===
  describe('ref forwarding', () => {
    it('forwards ref to the button element', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Ref Button</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  // === ACCESSIBILITY ===
  describe('accessibility', () => {
    it('supports aria-label', () => {
      render(<Button aria-label="Close dialog">X</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close dialog');
    });

    it('sets aria-busy to false when not loading', () => {
      render(<Button>Ready</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'false');
    });
  });

  // === DISPLAY NAME ===
  describe('displayName', () => {
    it('has correct display name', () => {
      expect(Button.displayName).toBe('Button');
    });
  });

  // === CLASSNAME ===
  describe('className', () => {
    it('passes className to the button element', () => {
      render(<Button className="custom-btn">Styled</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-btn');
    });
  });
});
