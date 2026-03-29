/**
 * @file RoleSelectorDropdown.test.tsx
 * @description Comprehensive tests for RoleSelectorDropdown component
 * Tests: rendering, dropdown open/close, role selection, navigation, compact mode, accessibility
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ChevronDown: (props: any) => <svg data-testid="icon-chevron" {...props} />,
  Check: (props: any) => <svg data-testid="icon-check" {...props} />,
  Crown: (props: any) => <svg data-testid="icon-crown" {...props} />,
  Building2: (props: any) => <svg data-testid="icon-building" {...props} />,
  Users: (props: any) => <svg data-testid="icon-users" {...props} />,
  Shield: (props: any) => <svg data-testid="icon-shield" {...props} />,
  UserCheck: (props: any) => <svg data-testid="icon-usercheck" {...props} />,
  Home: (props: any) => <svg data-testid="icon-home" {...props} />,
  Key: (props: any) => <svg data-testid="icon-key" {...props} />,
  Briefcase: (props: any) => <svg data-testid="icon-briefcase" {...props} />,
  Gavel: (props: any) => <svg data-testid="icon-gavel" {...props} />,
  ClipboardList: (props: any) => <svg data-testid="icon-clipboard" {...props} />,
  Wallet: (props: any) => <svg data-testid="icon-wallet" {...props} />,
  User: (props: any) => <svg data-testid="icon-user" {...props} />,
  HeartHandshake: (props: any) => <svg data-testid="icon-handshake" {...props} />,
  Scale: (props: any) => <svg data-testid="icon-scale" {...props} />,
  FileCheck: (props: any) => <svg data-testid="icon-filecheck" {...props} />,
  Landmark: (props: any) => <svg data-testid="icon-landmark" {...props} />,
  HardHat: (props: any) => <svg data-testid="icon-hardhat" {...props} />,
  Calculator: (props: any) => <svg data-testid="icon-calculator" {...props} />,
  BadgeCheck: (props: any) => <svg data-testid="icon-badgecheck" {...props} />,
  TrendingUp: (props: any) => <svg data-testid="icon-trendingup" {...props} />,
  Handshake: (props: any) => <svg data-testid="icon-handshake2" {...props} />,
  Eye: (props: any) => <svg data-testid="icon-eye" {...props} />,
  Building: (props: any) => <svg data-testid="icon-building2" {...props} />,
  Truck: (props: any) => <svg data-testid="icon-truck" {...props} />,
}));

// Mock CSS
vi.mock('./RoleSelectorDropdown.css', () => ({}));

import RoleSelectorDropdown from '../RoleSelectorDropdown';

describe('RoleSelectorDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────
  describe('Rendering', () => {
    it('renders the dropdown trigger', () => {
      render(<RoleSelectorDropdown />);
      const btn = screen.getByRole('button', { expanded: false });
      expect(btn).toBeInTheDocument();
    });

    it('defaults to Managing Director', () => {
      render(<RoleSelectorDropdown />);
      expect(screen.getByText('Managing Director')).toBeInTheDocument();
    });

    it('shows role description by default', () => {
      render(<RoleSelectorDropdown />);
      expect(screen.getByText(/Full access to all features/)).toBeInTheDocument();
    });

    it('renders with custom currentRole', () => {
      render(<RoleSelectorDropdown currentRole="super_admin" />);
      expect(screen.getByText('Super Admin')).toBeInTheDocument();
    });
  });

  // ── Compact Mode ───────────────────────────────────────
  describe('Compact Mode', () => {
    it('hides role name in compact mode', () => {
      render(<RoleSelectorDropdown compact={true} />);
      // In compact mode, name and description are hidden
      expect(screen.queryByText('Managing Director')).not.toBeInTheDocument();
    });

    it('adds compact class', () => {
      const { container } = render(<RoleSelectorDropdown compact={true} />);
      expect(container.firstChild).toHaveClass('compact');
    });
  });

  // ── Dropdown Open/Close ────────────────────────────────
  describe('Dropdown Toggle', () => {
    it('opens dropdown on trigger click', () => {
      render(<RoleSelectorDropdown />);
      const trigger = screen.getByRole('button', { expanded: false });
      fireEvent.click(trigger);
      expect(screen.getByText('Switch Dashboard View')).toBeInTheDocument();
    });

    it('sets aria-expanded to true when open', () => {
      render(<RoleSelectorDropdown />);
      const trigger = screen.getByRole('button', { expanded: false });
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes dropdown on backdrop click', () => {
      const { container } = render(<RoleSelectorDropdown />);
      const trigger = screen.getByRole('button', { expanded: false });
      fireEvent.click(trigger);
      expect(screen.getByText('Switch Dashboard View')).toBeInTheDocument();
      
      // Backdrop has aria-hidden="true", so use querySelector instead of getByRole
      const backdrop = container.querySelector('.role-selector-backdrop');
      expect(backdrop).toBeTruthy();
      fireEvent.click(backdrop!);
      expect(screen.queryByText('Switch Dashboard View')).not.toBeInTheDocument();
    });

    it('toggles dropdown on repeated trigger click', () => {
      render(<RoleSelectorDropdown />);
      const trigger = screen.getByRole('button', { expanded: false });
      fireEvent.click(trigger);
      expect(screen.getByText('Switch Dashboard View')).toBeInTheDocument();
      
      fireEvent.click(trigger);
      expect(screen.queryByText('Switch Dashboard View')).not.toBeInTheDocument();
    });
  });

  // ── Role List ──────────────────────────────────────────
  describe('Role List', () => {
    it('displays role count in header', () => {
      render(<RoleSelectorDropdown />);
      fireEvent.click(screen.getByRole('button', { expanded: false }));
      expect(screen.getByText(/roles/)).toBeInTheDocument();
    });

    it('shows all available roles when open', () => {
      render(<RoleSelectorDropdown />);
      fireEvent.click(screen.getByRole('button', { expanded: false }));
      // Should see at least some of the known roles
      expect(screen.getByText('Super Admin')).toBeInTheDocument();
      expect(screen.getByText('Branch Manager')).toBeInTheDocument();
    });

    it('highlights the currently selected role', () => {
      render(<RoleSelectorDropdown />);
      fireEvent.click(screen.getByRole('button', { expanded: false }));
      // Managing Director is selected by default - look for check icon
      const allChecks = screen.getAllByTestId('icon-check');
      expect(allChecks.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── Role Selection ─────────────────────────────────────
  describe('Role Selection', () => {
    it('calls onRoleChange when a role is selected', () => {
      const onRoleChange = vi.fn();
      render(<RoleSelectorDropdown onRoleChange={onRoleChange} />);
      fireEvent.click(screen.getByRole('button', { expanded: false }));
      fireEvent.click(screen.getByText('Super Admin'));
      expect(onRoleChange).toHaveBeenCalledTimes(1);
      expect(onRoleChange).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'super_admin', name: 'Super Admin' })
      );
    });

    it('navigates to dashboard path on role select', () => {
      render(<RoleSelectorDropdown />);
      fireEvent.click(screen.getByRole('button', { expanded: false }));
      fireEvent.click(screen.getByText('Super Admin'));
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
    });

    it('closes dropdown after selection', () => {
      render(<RoleSelectorDropdown />);
      fireEvent.click(screen.getByRole('button', { expanded: false }));
      fireEvent.click(screen.getByText('Super Admin'));
      expect(screen.queryByText('Switch Dashboard View')).not.toBeInTheDocument();
    });

    it('updates the displayed role after selection', () => {
      render(<RoleSelectorDropdown />);
      fireEvent.click(screen.getByRole('button', { expanded: false }));
      fireEvent.click(screen.getByText('Super Admin'));
      expect(screen.getByText('Super Admin')).toBeInTheDocument();
    });
  });

  // ── Role Normalization ─────────────────────────────────
  describe('Role Normalization', () => {
    it('handles hyphenated role keys', () => {
      render(<RoleSelectorDropdown currentRole="managing-director" />);
      expect(screen.getByText('Managing Director')).toBeInTheDocument();
    });

    it('falls back to first role for unknown keys', () => {
      render(<RoleSelectorDropdown currentRole="unknown-role" />);
      // Should fall back to REAL_ESTATE_ROLES[0]
      expect(screen.getByText('Managing Director')).toBeInTheDocument();
    });
  });

  // ── Without onRoleChange ───────────────────────────────
  describe('Without onRoleChange', () => {
    it('works without onRoleChange callback', () => {
      render(<RoleSelectorDropdown />);
      fireEvent.click(screen.getByRole('button', { expanded: false }));
      expect(() => {
        fireEvent.click(screen.getByText('Super Admin'));
      }).not.toThrow();
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  // ── CurrentRole Prop Change ────────────────────────────
  describe('Prop Change', () => {
    it('updates selected role when currentRole prop changes', () => {
      const { rerender } = render(<RoleSelectorDropdown currentRole="managing_director" />);
      expect(screen.getByText('Managing Director')).toBeInTheDocument();
      
      rerender(<RoleSelectorDropdown currentRole="super_admin" />);
      expect(screen.getByText('Super Admin')).toBeInTheDocument();
    });
  });
});
