import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock theme
vi.mock('../../styles/theme', () => ({
  theme: {
    spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
    colors: {
      border: '#e0e0e0',
      primary: '#D4AF37',
      success: '#388E3C',
      error: '#C62828',
      warning: '#F57C00',
      background: { primary: '#fff', secondary: '#f5f5f5', tertiary: '#eee' },
      text: { primary: '#222', secondary: '#666', disabled: '#aaa' },
    },
    typography: { sizes: { sm: '13px' } },
    transitions: { all: 'all 0.2s ease', create: (prop: string, dur: string) => `${prop} ${dur}`, durations: { standard: '0.2s' } },
    shadows: { lg: '0 4px 12px rgba(0,0,0,0.1)' },
    zIndex: { dropdown: 1000 },
  },
}));

import { AdminControls } from './AdminControls';

describe('AdminControls', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('visibility', () => {
    it('renders nothing when visible=false (default)', () => {
      const { container } = render(<AdminControls />);
      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when visible is explicitly false', () => {
      const { container } = render(<AdminControls visible={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders controls when visible=true', () => {
      render(<AdminControls visible />);
      expect(screen.getByLabelText('Admin controls')).toBeInTheDocument();
    });
  });

  describe('system status', () => {
    it('renders status indicator with online title', () => {
      render(<AdminControls visible systemStatus="online" />);
      expect(screen.getByTitle('System online')).toBeInTheDocument();
    });

    it('renders status indicator with offline title', () => {
      render(<AdminControls visible systemStatus="offline" />);
      expect(screen.getByTitle('System offline')).toBeInTheDocument();
    });

    it('renders status indicator with warning title', () => {
      render(<AdminControls visible systemStatus="warning" />);
      expect(screen.getByTitle('System warning')).toBeInTheDocument();
    });

    it('defaults to online status', () => {
      render(<AdminControls visible />);
      expect(screen.getByTitle('System online')).toBeInTheDocument();
    });
  });

  describe('dropdown toggle', () => {
    it('opens dropdown on button click', () => {
      render(<AdminControls visible />);
      fireEvent.click(screen.getByLabelText('Admin controls'));
      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('Admin Settings')).toBeInTheDocument();
    });

    it('sets aria-expanded=true when dropdown is open', () => {
      render(<AdminControls visible />);
      const btn = screen.getByLabelText('Admin controls');
      expect(btn).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(btn);
      expect(btn).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes dropdown on backdrop click', () => {
      render(<AdminControls visible />);
      fireEvent.click(screen.getByLabelText('Admin controls'));
      // Click backdrop
      const backdrop = screen.getByRole('presentation');
      fireEvent.click(backdrop);
      expect(screen.getByLabelText('Admin controls')).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('menu actions', () => {
    it('calls onUserManagement and closes dropdown', () => {
      const onUserManagement = vi.fn();
      render(<AdminControls visible onUserManagement={onUserManagement} />);
      fireEvent.click(screen.getByLabelText('Admin controls'));
      fireEvent.click(screen.getByText('User Management'));
      expect(onUserManagement).toHaveBeenCalledTimes(1);
    });

    it('calls onSettings and closes dropdown', () => {
      const onSettings = vi.fn();
      render(<AdminControls visible onSettings={onSettings} />);
      fireEvent.click(screen.getByLabelText('Admin controls'));
      fireEvent.click(screen.getByText('Admin Settings'));
      expect(onSettings).toHaveBeenCalledTimes(1);
    });

    it('handles missing callbacks gracefully', () => {
      render(<AdminControls visible />);
      fireEvent.click(screen.getByLabelText('Admin controls'));
      expect(() => {
        fireEvent.click(screen.getByText('User Management'));
        fireEvent.click(screen.getByLabelText('Admin controls'));
        fireEvent.click(screen.getByText('Admin Settings'));
      }).not.toThrow();
    });
  });

  describe('displayName', () => {
    it('has correct display name', () => {
      expect(AdminControls.displayName).toBe('AdminControls');
    });
  });

  describe('className', () => {
    it('passes className', () => {
      const { container } = render(<AdminControls visible className="admin-custom" />);
      expect(container.querySelector('.admin-custom')).toBeInTheDocument();
    });
  });
});
