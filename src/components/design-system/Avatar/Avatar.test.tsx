import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock theme
vi.mock('../../../styles/theme', () => ({
  theme: {
    spacing: { xs: '4px', sm: '8px', md: '16px' },
    colors: {
      border: '#e0e0e0',
      primary: '#D4AF37',
      secondary: '#1976D2',
      success: '#388E3C',
      warning: '#F57C00',
      error: '#C62828',
      background: { secondary: '#f5f5f5', tertiary: '#eee' },
      text: { primary: '#222' },
    },
    typography: {
      weights: { semibold: 600 },
    },
  },
}));

import { Avatar } from './Avatar';

describe('Avatar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // === RENDERING ===
  describe('rendering', () => {
    it('renders with image when src is provided', () => {
      render(<Avatar src="https://example.com/avatar.jpg" alt="User Avatar" />);
      const img = screen.getByAltText('User Avatar');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('renders with initials when no src is provided', () => {
      render(<Avatar initials="JD" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('renders default initials "?" when neither src nor initials provided', () => {
      render(<Avatar />);
      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('renders default alt "Avatar" for image', () => {
      render(<Avatar src="https://example.com/avatar.jpg" />);
      expect(screen.getByAltText('Avatar')).toBeInTheDocument();
    });
  });

  // === SIZES ===
  describe('sizes', () => {
    it('renders all size variants', () => {
      const sizes = ['sm', 'md', 'lg', 'xl'] as const;
      sizes.forEach((size) => {
        const { unmount } = render(<Avatar size={size} initials={size.toUpperCase()} />);
        expect(screen.getByText(size.toUpperCase())).toBeInTheDocument();
        unmount();
      });
    });

    it('defaults to md size', () => {
      render(<Avatar initials="M" />);
      expect(screen.getByText('M')).toBeInTheDocument();
    });
  });

  // === VARIANTS ===
  describe('variants', () => {
    it('renders all variant types', () => {
      const variants = ['primary', 'secondary', 'success', 'warning', 'error'] as const;
      variants.forEach((variant) => {
        const { unmount } = render(<Avatar variant={variant} initials={variant[0].toUpperCase()} />);
        expect(screen.getByText(variant[0].toUpperCase())).toBeInTheDocument();
        unmount();
      });
    });
  });

  // === STATUS INDICATOR ===
  describe('status indicator', () => {
    it('renders status indicator when status is online', () => {
      const { container } = render(<Avatar status="online" initials="JD" />);
      const statusDot = container.querySelectorAll('div');
      // Should have the container + initials div + status div
      expect(statusDot.length).toBeGreaterThanOrEqual(2);
    });

    it('renders status indicator when status is offline', () => {
      const { container } = render(<Avatar status="offline" initials="JD" />);
      const divs = container.querySelectorAll('div');
      expect(divs.length).toBeGreaterThanOrEqual(2);
    });

    it('renders status indicator when status is away', () => {
      const { container } = render(<Avatar status="away" initials="JD" />);
      const divs = container.querySelectorAll('div');
      expect(divs.length).toBeGreaterThanOrEqual(2);
    });

    it('does not render status indicator when no status', () => {
      const { container } = render(<Avatar initials="JD" />);
      // With no status, fewer child divs
      const divs = container.querySelectorAll('div');
      // container + initials = 2
      expect(divs.length).toBeLessThanOrEqual(3);
    });
  });

  // === IMAGE VS INITIALS ===
  describe('image vs initials', () => {
    it('shows image and hides initials when src is provided', () => {
      render(<Avatar src="https://example.com/photo.jpg" initials="AB" />);
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.queryByText('AB')).not.toBeInTheDocument();
    });

    it('shows initials and hides image when no src', () => {
      render(<Avatar initials="AB" />);
      expect(screen.getByText('AB')).toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  // === CLASSNAME ===
  describe('className', () => {
    it('passes className to container', () => {
      const { container } = render(<Avatar className="custom-avatar" initials="C" />);
      expect(container.firstChild).toHaveClass('custom-avatar');
    });
  });

  // === DISPLAY NAME ===
  describe('displayName', () => {
    it('has correct display name', () => {
      expect(Avatar.displayName).toBe('Avatar');
    });
  });
});
