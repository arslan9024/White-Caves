/**
 * RequirePermission — Comprehensive Unit Tests
 *
 * Covers: permission gating, role-based access, owner-only, feature gates,
 * requireAll vs requireAny, fallback rendering, OwnerOnly/RoleOnly/AgentOnly/
 * FeatureGate convenience wrappers, withPermission HOC
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// ── Mock state ──────────────────────────────────────────────────

let mockActiveRole = 'owner';

vi.mock('react-redux', () => ({
  useSelector: (selector: (s: unknown) => unknown) =>
    selector({ navigation: { activeRole: mockActiveRole } }),
}));

vi.mock('../../utils/permissions', () => ({
  hasPermission: (role: string, perm: string) => {
    const perms: Record<string, string[]> = {
      owner: ['manage-agents', 'view-reports', 'manage-properties', 'manage-leads'],
      'leasing-agent': ['manage-leads', 'view-reports'],
      'secondary-sales-agent': ['manage-leads'],
    };
    return (perms[role] || []).includes(perm);
  },
  hasAnyPermission: (role: string, perms: string[]) => {
    const rolePerms: Record<string, string[]> = {
      owner: ['manage-agents', 'view-reports', 'manage-properties', 'manage-leads'],
      'leasing-agent': ['manage-leads', 'view-reports'],
      'secondary-sales-agent': ['manage-leads'],
    };
    return perms.some(p => (rolePerms[role] || []).includes(p));
  },
  hasAllPermissions: (role: string, perms: string[]) => {
    const rolePerms: Record<string, string[]> = {
      owner: ['manage-agents', 'view-reports', 'manage-properties', 'manage-leads'],
      'leasing-agent': ['manage-leads', 'view-reports'],
      'secondary-sales-agent': ['manage-leads'],
    };
    return perms.every(p => (rolePerms[role] || []).includes(p));
  },
  canAccessFeature: (role: string, featureId: string) => {
    const features: Record<string, string[]> = {
      owner: ['ai-command-center', 'analytics-dashboard', 'agent-management'],
      'leasing-agent': ['analytics-dashboard'],
    };
    return (features[role] || []).includes(featureId);
  },
  isOwner: (role: string) => role === 'owner',
}));

import {
  RequirePermission,
  OwnerOnly,
  RoleOnly,
  AgentOnly,
  FeatureGate,
  withPermission,
} from './RequirePermission';

// ── Helpers ─────────────────────────────────────────────────────

const Secret = () => <div>Secret Content</div>;
const Fallback = () => <div>Access Denied</div>;

describe('RequirePermission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockActiveRole = 'owner';
  });

  // ────── Basic Permission Check ──────

  describe('single permission', () => {
    it('renders children when user has the permission', () => {
      render(
        <RequirePermission permission="manage-agents">
          <Secret />
        </RequirePermission>
      );
      expect(screen.getByText('Secret Content')).toBeInTheDocument();
    });

    it('renders fallback when user lacks the permission', () => {
      mockActiveRole = 'secondary-sales-agent';
      render(
        <RequirePermission permission="manage-agents" fallback={<Fallback />}>
          <Secret />
        </RequirePermission>
      );
      expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });

    it('renders null by default when access denied', () => {
      mockActiveRole = 'secondary-sales-agent';
      const { container } = render(
        <RequirePermission permission="manage-agents">
          <Secret />
        </RequirePermission>
      );
      expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
      expect(container.innerHTML).toBe('');
    });
  });

  // ────── Multiple Permissions (any) ──────

  describe('multiple permissions (requireAll = false)', () => {
    it('renders when user has at least one permission', () => {
      mockActiveRole = 'leasing-agent';
      render(
        <RequirePermission permissions={['manage-agents', 'view-reports']}>
          <Secret />
        </RequirePermission>
      );
      expect(screen.getByText('Secret Content')).toBeInTheDocument();
    });

    it('renders fallback when user has none of the permissions', () => {
      mockActiveRole = 'secondary-sales-agent';
      render(
        <RequirePermission permissions={['manage-agents', 'manage-properties']} fallback={<Fallback />}>
          <Secret />
        </RequirePermission>
      );
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });
  });

  // ────── Multiple Permissions (all) ──────

  describe('multiple permissions (requireAll = true)', () => {
    it('renders when user has all permissions', () => {
      mockActiveRole = 'owner';
      render(
        <RequirePermission permissions={['manage-agents', 'view-reports']} requireAll>
          <Secret />
        </RequirePermission>
      );
      expect(screen.getByText('Secret Content')).toBeInTheDocument();
    });

    it('renders fallback when user is missing one', () => {
      mockActiveRole = 'leasing-agent';
      render(
        <RequirePermission permissions={['manage-agents', 'view-reports']} requireAll fallback={<Fallback />}>
          <Secret />
        </RequirePermission>
      );
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });
  });

  // ────── Owner Only ──────

  describe('ownerOnly prop', () => {
    it('renders children for owner role', () => {
      mockActiveRole = 'owner';
      render(
        <RequirePermission ownerOnly>
          <Secret />
        </RequirePermission>
      );
      expect(screen.getByText('Secret Content')).toBeInTheDocument();
    });

    it('renders fallback for non-owner role', () => {
      mockActiveRole = 'leasing-agent';
      render(
        <RequirePermission ownerOnly fallback={<Fallback />}>
          <Secret />
        </RequirePermission>
      );
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });
  });

  // ────── Roles ──────

  describe('roles prop', () => {
    it('renders when user role matches', () => {
      mockActiveRole = 'leasing-agent';
      render(
        <RequirePermission roles={['leasing-agent', 'owner']}>
          <Secret />
        </RequirePermission>
      );
      expect(screen.getByText('Secret Content')).toBeInTheDocument();
    });

    it('renders fallback when role not in list', () => {
      mockActiveRole = 'secondary-sales-agent';
      render(
        <RequirePermission roles={['owner', 'leasing-agent']} fallback={<Fallback />}>
          <Secret />
        </RequirePermission>
      );
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });
  });

  // ────── Feature Gate ──────

  describe('featureId prop', () => {
    it('renders when user can access feature', () => {
      mockActiveRole = 'owner';
      render(
        <RequirePermission featureId="ai-command-center">
          <Secret />
        </RequirePermission>
      );
      expect(screen.getByText('Secret Content')).toBeInTheDocument();
    });

    it('renders fallback for unallowed feature', () => {
      mockActiveRole = 'leasing-agent';
      render(
        <RequirePermission featureId="ai-command-center" fallback={<Fallback />}>
          <Secret />
        </RequirePermission>
      );
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });
  });
});

// ────── Convenience Wrappers ──────

describe('OwnerOnly', () => {
  beforeEach(() => {
    mockActiveRole = 'owner';
  });

  it('renders children for owner', () => {
    render(<OwnerOnly><Secret /></OwnerOnly>);
    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });

  it('hides children for non-owner', () => {
    mockActiveRole = 'leasing-agent';
    render(<OwnerOnly><Secret /></OwnerOnly>);
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });

  it('renders fallback for non-owner', () => {
    mockActiveRole = 'leasing-agent';
    render(<OwnerOnly fallback={<Fallback />}><Secret /></OwnerOnly>);
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });
});

describe('RoleOnly', () => {
  it('renders for matching role', () => {
    mockActiveRole = 'leasing-agent';
    render(<RoleOnly roles={['leasing-agent']}><Secret /></RoleOnly>);
    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });

  it('hides for non-matching role', () => {
    mockActiveRole = 'owner';
    render(<RoleOnly roles={['leasing-agent']}><Secret /></RoleOnly>);
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });
});

describe('AgentOnly', () => {
  it('renders for leasing-agent', () => {
    mockActiveRole = 'leasing-agent';
    render(<AgentOnly><Secret /></AgentOnly>);
    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });

  it('renders for secondary-sales-agent', () => {
    mockActiveRole = 'secondary-sales-agent';
    render(<AgentOnly><Secret /></AgentOnly>);
    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });

  it('hides content from owner', () => {
    mockActiveRole = 'owner';
    render(<AgentOnly><Secret /></AgentOnly>);
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });
});

describe('FeatureGate', () => {
  it('renders for allowed feature', () => {
    mockActiveRole = 'owner';
    render(<FeatureGate featureId="analytics-dashboard"><Secret /></FeatureGate>);
    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });

  it('hides for disallowed feature', () => {
    mockActiveRole = 'secondary-sales-agent';
    render(<FeatureGate featureId="analytics-dashboard"><Secret /></FeatureGate>);
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });
});

describe('withPermission HOC', () => {
  const Dashboard = () => <div>Dashboard Loaded</div>;

  it('renders wrapped component when permission met', () => {
    mockActiveRole = 'owner';
    const ProtectedDashboard = withPermission(Dashboard, { permission: 'view-reports' });
    render(<ProtectedDashboard />);
    expect(screen.getByText('Dashboard Loaded')).toBeInTheDocument();
  });

  it('renders nothing when permission denied', () => {
    mockActiveRole = 'secondary-sales-agent';
    const ProtectedDashboard = withPermission(Dashboard, { permission: 'manage-agents' });
    const { container } = render(<ProtectedDashboard />);
    expect(screen.queryByText('Dashboard Loaded')).not.toBeInTheDocument();
    expect(container.innerHTML).toBe('');
  });

  it('renders with ownerOnly option', () => {
    mockActiveRole = 'owner';
    const OwnerDashboard = withPermission(Dashboard, { ownerOnly: true });
    render(<OwnerDashboard />);
    expect(screen.getByText('Dashboard Loaded')).toBeInTheDocument();
  });
});
