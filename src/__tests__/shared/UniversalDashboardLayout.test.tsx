/**
 * UniversalDashboardLayout.test.tsx — Batch 27
 * Tests for UniversalDashboardLayout component
 * Covers: rendering, title/subtitle, tabs, profile button, weather, role selector, actions, children
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Hoist mock navigate
const mockNavigate = vi.fn();

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock react-redux
vi.mock('react-redux', () => ({
  useSelector: (selector: any) => selector({
    user: {
      currentUser: {
        name: 'Ahmed',
        displayName: 'Ahmed Al Rashid',
        photo: 'https://example.com/avatar.jpg',
      },
    },
  }),
}));

// Mock child components
vi.mock('../../shared/components/dashboard/UserStatusBar', () => ({
  default: (props: any) => <div data-testid="user-status-bar" data-username={props.userName}>StatusBar</div>,
}));

vi.mock('../../shared/components/ui/RoleSelectorDropdown', () => ({
  default: ({ currentRole, onRoleChange, compact, ...rest }: any) => (
    <div data-testid="role-selector" data-role={currentRole}>
      <button onClick={() => onRoleChange({ dashboardPath: '/buyer/dashboard' })} data-testid="role-change-btn">
        Change Role
      </button>
    </div>
  ),
}));

vi.mock('../../shared/components/ui/WeatherWidget', () => ({
  default: (props: any) => <div data-testid="weather-widget">Weather</div>,
}));

vi.mock('../../shared/components/ui/ProfilePanel', () => ({
  default: ({ user, onClose, ...rest }: any) => (
    <div data-testid="profile-panel">
      <span>Profile Panel</span>
      <button onClick={onClose} data-testid="close-profile">Close</button>
    </div>
  ),
}));

vi.mock('../../../config/roles', () => ({
  // Just type export, no runtime usage needed
}));

vi.mock('../../shared/components/dashboard/UniversalDashboardLayout.css', () => ({}));

import UniversalDashboardLayout from '../../shared/components/dashboard/UniversalDashboardLayout';

describe('UniversalDashboardLayout', () => {
  const defaultProps = {
    title: 'Buyer Dashboard',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── RENDERING ─────────────────────────────────────────────
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<UniversalDashboardLayout {...defaultProps} />);
      expect(screen.getByText('Buyer Dashboard')).toBeInTheDocument();
    });

    it('renders title in h1', () => {
      render(<UniversalDashboardLayout {...defaultProps} />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Buyer Dashboard');
    });

    it('renders subtitle when provided', () => {
      render(<UniversalDashboardLayout {...defaultProps} subtitle="Welcome back" />);
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
      render(<UniversalDashboardLayout {...defaultProps} />);
      expect(screen.queryByText('Welcome back')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<UniversalDashboardLayout {...defaultProps} className="custom" />);
      expect(container.firstChild).toHaveClass('universal-dashboard-layout');
      expect(container.firstChild).toHaveClass('custom');
    });

    it('renders children content', () => {
      render(
        <UniversalDashboardLayout {...defaultProps}>
          <div data-testid="child">Dashboard Content</div>
        </UniversalDashboardLayout>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
    });
  });

  // ─── USER STATUS BAR ──────────────────────────────────────
  describe('UserStatusBar', () => {
    it('renders UserStatusBar with user name', () => {
      render(<UniversalDashboardLayout {...defaultProps} />);
      const statusBar = screen.getByTestId('user-status-bar');
      expect(statusBar).toBeInTheDocument();
      expect(statusBar).toHaveAttribute('data-username', 'Ahmed');
    });
  });

  // ─── WEATHER WIDGET ────────────────────────────────────────
  describe('Weather Widget', () => {
    it('renders weather widget by default', () => {
      render(<UniversalDashboardLayout {...defaultProps} />);
      expect(screen.getByTestId('weather-widget')).toBeInTheDocument();
    });

    it('hides weather widget when showWeather=false', () => {
      render(<UniversalDashboardLayout {...defaultProps} showWeather={false} />);
      expect(screen.queryByTestId('weather-widget')).not.toBeInTheDocument();
    });
  });

  // ─── ROLE SELECTOR ─────────────────────────────────────────
  describe('Role Selector', () => {
    it('does not show role selector by default', () => {
      render(<UniversalDashboardLayout {...defaultProps} />);
      expect(screen.queryByTestId('role-selector')).not.toBeInTheDocument();
    });

    it('shows role selector when showRoleSelector=true', () => {
      render(<UniversalDashboardLayout {...defaultProps} showRoleSelector={true} roleId="buyer" />);
      expect(screen.getByTestId('role-selector')).toBeInTheDocument();
    });

    it('navigates to dashboard path on role change', () => {
      render(<UniversalDashboardLayout {...defaultProps} showRoleSelector={true} roleId="buyer" />);
      fireEvent.click(screen.getByTestId('role-change-btn'));
      expect(mockNavigate).toHaveBeenCalledWith('/buyer/dashboard');
    });
  });

  // ─── PROFILE BUTTON ────────────────────────────────────────
  describe('Profile Button', () => {
    it('renders profile button by default', () => {
      render(<UniversalDashboardLayout {...defaultProps} />);
      expect(screen.getByTitle('View Profile')).toBeInTheDocument();
    });

    it('shows user avatar when photo available', () => {
      render(<UniversalDashboardLayout {...defaultProps} />);
      const avatar = screen.getByAltText('Ahmed');
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('hides profile button when showProfileButton=false', () => {
      render(<UniversalDashboardLayout {...defaultProps} showProfileButton={false} />);
      expect(screen.queryByTitle('View Profile')).not.toBeInTheDocument();
    });

    it('opens profile panel on click', () => {
      render(<UniversalDashboardLayout {...defaultProps} />);
      expect(screen.queryByTestId('profile-panel')).not.toBeInTheDocument();
      fireEvent.click(screen.getByTitle('View Profile'));
      expect(screen.getByTestId('profile-panel')).toBeInTheDocument();
    });

    it('closes profile panel', () => {
      render(<UniversalDashboardLayout {...defaultProps} />);
      fireEvent.click(screen.getByTitle('View Profile'));
      expect(screen.getByTestId('profile-panel')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('close-profile'));
      expect(screen.queryByTestId('profile-panel')).not.toBeInTheDocument();
    });
  });

  // ─── TABS ──────────────────────────────────────────────────
  describe('Tabs', () => {
    const tabs = [
      { id: 'overview', label: 'Overview' },
      { id: 'properties', label: 'Properties' },
      { id: 'analytics', label: 'Analytics' },
    ];

    it('does not render tabs nav when no tabs', () => {
      render(<UniversalDashboardLayout {...defaultProps} />);
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('renders tab buttons', () => {
      render(<UniversalDashboardLayout {...defaultProps} tabs={tabs} activeTab="overview" />);
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Properties')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });

    it('marks active tab', () => {
      render(<UniversalDashboardLayout {...defaultProps} tabs={tabs} activeTab="overview" />);
      const overviewBtn = screen.getByText('Overview').closest('button')!;
      expect(overviewBtn).toHaveClass('active');
    });

    it('calls onTabChange when tab clicked', () => {
      const onTabChange = vi.fn();
      render(
        <UniversalDashboardLayout
          {...defaultProps}
          tabs={tabs}
          activeTab="overview"
          onTabChange={onTabChange}
        />
      );
      fireEvent.click(screen.getByText('Properties'));
      expect(onTabChange).toHaveBeenCalledWith('properties');
    });

    it('renders tab icons when provided', () => {
      const tabsWithIcons = [
        { id: 'overview', label: 'Overview', icon: <span data-testid="tab-icon">📊</span> },
      ];
      render(<UniversalDashboardLayout {...defaultProps} tabs={tabsWithIcons} activeTab="overview" />);
      expect(screen.getByTestId('tab-icon')).toBeInTheDocument();
    });

    it('renders tab badges when provided', () => {
      const tabsWithBadges = [
        { id: 'overview', label: 'Overview', badge: <span data-testid="tab-badge">5</span> },
      ];
      render(<UniversalDashboardLayout {...defaultProps} tabs={tabsWithBadges} activeTab="overview" />);
      expect(screen.getByTestId('tab-badge')).toBeInTheDocument();
    });
  });

  // ─── ACTIONS ───────────────────────────────────────────────
  describe('Actions', () => {
    it('does not render actions container when no actions', () => {
      const { container } = render(<UniversalDashboardLayout {...defaultProps} />);
      expect(container.querySelector('.dashboard-header-actions')).not.toBeInTheDocument();
    });

    it('renders actions when provided', () => {
      render(
        <UniversalDashboardLayout
          {...defaultProps}
          actions={<button data-testid="action-btn">Add Property</button>}
        />
      );
      expect(screen.getByTestId('action-btn')).toBeInTheDocument();
    });
  });
});
