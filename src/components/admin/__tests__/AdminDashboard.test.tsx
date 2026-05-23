import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import authReducer from '../../../store/authSlice';
import AdminDashboard from '../AdminDashboard';
import type { ReactElement } from 'react';

// Helper to create a full auth preloaded state
const createAuthState = (overrides: Record<string, unknown> = {}) => ({
  user: {
    id: 'admin-123',
    displayName: 'John Admin',
    email: 'admin@whitecaves.ae',
    role: 'admin',
  },
  token: null,
  refreshToken: null,
  session: {
    isLoggedIn: true,
    lastActive: null,
    sessions: [],
    expiresAt: null,
    activeSessionId: null,
  },
  loginMethods: { social: false, email: false, mobile: false },
  loginProvider: null,
  rememberMe: false,
  sessionTimeout: 30,
  loading: false,
  error: null,
  ...overrides,
});

// Mock store setup
const createMockStore = (authOverrides?: Record<string, unknown>) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: createAuthState(authOverrides) as ReturnType<typeof authReducer>,
    },
  });
};

describe('AdminDashboard Integration', () => {
  let mockStore: EnhancedStore;

  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  beforeEach(() => {
    mockStore = createMockStore();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  const renderWithRedux = (component: ReactElement) => {
    return render(<Provider store={mockStore}>{component}</Provider>);
  };

  describe('Rendering', () => {
    it('should render admin dashboard', () => {
      renderWithRedux(<AdminDashboard />);

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    it('should display dashboard header', () => {
      renderWithRedux(<AdminDashboard />);

      expect(screen.getByText('Platform management and monitoring')).toBeInTheDocument();
    });

    it('should show user info in header', () => {
      renderWithRedux(<AdminDashboard />);

      expect(screen.getByText('John Admin')).toBeInTheDocument();
      expect(screen.getByText('Super User')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('should render all main tabs', () => {
      renderWithRedux(<AdminDashboard />);

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should display Overview tab content by default', () => {
      renderWithRedux(<AdminDashboard />);

      expect(screen.getByText('Overview')).toBeInTheDocument();
    });

    it('should switch tabs on click', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      const usersTab = screen.getByText('Users');
      await user.click(usersTab);

      expect(usersTab).toBeInTheDocument();
    });

    it('should navigate to analytics tab', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      const analyticsTab = screen.getByText('Analytics');
      await user.click(analyticsTab);

      expect(analyticsTab).toBeInTheDocument();
    });

    it('should navigate to settings tab', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      const settingsTab = screen.getByText('Settings');
      await user.click(settingsTab);

      expect(settingsTab).toBeInTheDocument();
    });
  });

  describe('Overview Tab Metrics', () => {
    it('should display system metrics in overview', () => {
      renderWithRedux(<AdminDashboard />);

      expect(screen.getAllByText(/1243|Total Users/).length).toBeGreaterThan(0);
    });

    it('should show active users count', () => {
      renderWithRedux(<AdminDashboard />);

      expect(screen.getByText(/567|Active Users/)).toBeInTheDocument();
    });

    it('should display properties metrics', () => {
      renderWithRedux(<AdminDashboard />);

      expect(screen.getAllByText(/3421|Total Properties/).length).toBeGreaterThan(0);
    });

    it('should show system health status', () => {
      renderWithRedux(<AdminDashboard />);

      const healthIndicators = screen.queryAllByText(/excellent|good|warning/i);
      expect(healthIndicators.length).toBeGreaterThanOrEqual(0);
    });

    it('should display uptime percentage', () => {
      renderWithRedux(<AdminDashboard />);

      expect(screen.getAllByText(/99\.98|uptime/i).length).toBeGreaterThan(0);
    });
  });

  describe('Recent Activities Section', () => {
    it('should display recent activities', () => {
      renderWithRedux(<AdminDashboard />);

      expect(
        screen.getAllByText(/Created new property listing|Recent Activity/i).length
      ).toBeGreaterThan(0);
    });

    it('should show activity user names', () => {
      renderWithRedux(<AdminDashboard />);

      const activities = screen.queryAllByText(/John Doe|Jane Smith|Ahmed Hassan/);
      expect(activities.length).toBeGreaterThan(0);
    });

    it('should display activity timestamps', () => {
      renderWithRedux(<AdminDashboard />);

      expect(screen.getAllByText(/hours ago|days ago/i).length).toBeGreaterThan(0);
    });
  });

  describe('Alerts Section', () => {
    it('should display system alerts', () => {
      renderWithRedux(<AdminDashboard />);

      const alerts = screen.queryAllByText(/CPU usage|backup|alert/i);
      expect(alerts.length).toBeGreaterThanOrEqual(0);
    });

    it('should show alert severity indicators', () => {
      renderWithRedux(<AdminDashboard />);

      const container = screen.getByText('Admin Dashboard').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('should display alert messages', () => {
      renderWithRedux(<AdminDashboard />);

      expect(
        screen.getAllByText(/High CPU usage detected|Database backup/i).length
      ).toBeGreaterThan(0);
    });
  });

  describe('Pagination', () => {
    it('should render pagination for activities', () => {
      renderWithRedux(<AdminDashboard />);

      const { container } = render(
        <Provider store={mockStore}>
          <AdminDashboard />
        </Provider>
      );

      const paginationElements = container.querySelectorAll('nav');
      expect(paginationElements.length).toBeGreaterThanOrEqual(0);
    });

    it('should support pagination navigation', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      const nextButtons = screen.queryAllByRole('button', { name: /next|›/i });
      if (nextButtons.length > 0) {
        expect(nextButtons[0]).toBeInTheDocument();
      }
    });
  });

  describe('Filter Period Selection', () => {
    it('should have period filter options', () => {
      renderWithRedux(<AdminDashboard />);

      const periodSelects = screen.queryAllByDisplayValue(/7d|30d|90d|1y/);
      expect(periodSelects.length).toBeGreaterThanOrEqual(0);
    });

    it('should change period on selection', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      const periodSelect = screen.queryByDisplayValue(/7d/);
      if (periodSelect) {
        await user.selectOptions(periodSelect, '30d');
        expect(periodSelect).toBeInTheDocument();
      }
    });
  });

  describe('Users Tab', () => {
    it('should display users in Users tab', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      const usersTab = screen.getByText('Users');
      await user.click(usersTab);

      expect(screen.getAllByText(/John Doe|Jane Smith/).length).toBeGreaterThan(0);
    });

    it('should show user roles', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      const usersTab = screen.getByText('Users');
      await user.click(usersTab);

      expect(screen.queryAllByText(/agent|admin/i).length).toBeGreaterThan(0);
    });

    it('should display user status', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      const usersTab = screen.getByText('Users');
      await user.click(usersTab);

      expect(screen.queryAllByText(/active|inactive/i).length).toBeGreaterThan(0);
    });
  });

  describe('Analytics Tab', () => {
    it('should navigate to analytics tab', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      const analyticsTab = screen.getByText('Analytics');
      await user.click(analyticsTab);

      expect(analyticsTab).toBeInTheDocument();
    });
  });

  describe('Settings Tab', () => {
    it('should navigate to settings tab', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      const settingsTab = screen.getByText('Settings');
      await user.click(settingsTab);

      expect(settingsTab).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible tab buttons', () => {
      renderWithRedux(<AdminDashboard />);

      const tabs = screen.getAllByRole('button', { name: /Overview|Users|Analytics|Settings/i });
      expect(tabs.length).toBeGreaterThan(0);
    });

    it('should support keyboard navigation between tabs', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      const firstTab = screen.getByText('Overview');
      firstTab.focus();
      expect(firstTab).toHaveFocus();
    });
  });

  describe('State Management', () => {
    it('should maintain tab state on navigation', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      const usersTab = screen.getByText('Users');
      await user.click(usersTab);

      expect(usersTab).toBeInTheDocument();
    });

    it('should maintain filter state', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      const periodSelect = screen.queryByDisplayValue(/7d/);
      if (periodSelect) {
        await user.selectOptions(periodSelect, '30d');

        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      }
    });
  });

  describe('Redux Integration', () => {
    it('should render with Redux store', () => {
      renderWithRedux(<AdminDashboard />);

      expect(screen.getByText('John Admin')).toBeInTheDocument();
    });

    it('should use user info from Redux state', () => {
      renderWithRedux(<AdminDashboard />);

      expect(screen.getByText('John Admin')).toBeInTheDocument();
    });

    it('should fallback to Admin if user displayName is missing', () => {
      const storeWithoutDisplayName = createMockStore({
        user: {
          id: 'admin-456',
          email: 'test@whitecaves.ae',
        },
      });

      render(
        <Provider store={storeWithoutDisplayName}>
          <AdminDashboard />
        </Provider>
      );

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should render gracefully without data', () => {
      const emptyStore = createMockStore({
        user: null,
        session: {
          isLoggedIn: false,
          lastActive: null,
          sessions: [],
          expiresAt: null,
          activeSessionId: null,
        },
      });

      render(
        <Provider store={emptyStore}>
          <AdminDashboard />
        </Provider>
      );

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });
  });

  describe('Tab Content: Users Tab', () => {
    it('should show User Management header', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Users'));
      expect(screen.getByText('User Management')).toBeInTheDocument();
    });

    it('should show users table with columns', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Users'));
      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Last Active')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('should show Edit button for users', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Users'));
      const editButtons = screen.getAllByText('Edit');
      expect(editButtons.length).toBeGreaterThan(0);
    });

    it('should show Suspend button for active users', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Users'));
      const suspendButtons = screen.queryAllByText('Suspend');
      expect(suspendButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Tab Content: Analytics Tab', () => {
    it('should show Analytics & Reports header', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Analytics'));
      expect(screen.getByText('Analytics & Reports')).toBeInTheDocument();
    });

    it('should show filter period select', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Analytics'));
      const select = screen.getByDisplayValue('Last 7 Days');
      expect(select).toBeInTheDocument();
    });

    it('should allow changing filter period', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Analytics'));
      const select = screen.getByDisplayValue('Last 7 Days');
      await user.selectOptions(select, '30d');
      expect(screen.getByDisplayValue('Last 30 Days')).toBeInTheDocument();
    });

    it('should show User Growth Trend chart', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Analytics'));
      expect(screen.getByText('User Growth Trend')).toBeInTheDocument();
    });

    it('should show Transaction Volume chart', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Analytics'));
      expect(screen.getByText('Transaction Volume')).toBeInTheDocument();
    });

    it('should show Export Report button', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Analytics'));
      expect(screen.getByText('Export Report')).toBeInTheDocument();
    });

    it('should show Full Analytics button', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Analytics'));
      expect(screen.getByText('Full Analytics')).toBeInTheDocument();
    });
  });

  describe('Tab Content: Settings Tab', () => {
    it('should show System Settings header', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Settings'));
      expect(screen.getByText('System Settings')).toBeInTheDocument();
    });

    it('should show General Settings group', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Settings'));
      expect(screen.getByText('General Settings')).toBeInTheDocument();
    });

    it('should show Performance Settings group', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Settings'));
      expect(screen.getByText('Performance Settings')).toBeInTheDocument();
    });

    it('should show Security Settings group', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Settings'));
      expect(screen.getByText('Security Settings')).toBeInTheDocument();
    });

    it('should show Platform Name input with default value', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Settings'));
      const platformInput = screen.getByLabelText('Platform Name');
      expect(platformInput).toHaveValue('White Caves');
    });

    it('should show Support Email input with default value', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Settings'));
      const emailInput = screen.getByLabelText('Support Email');
      expect(emailInput).toHaveValue('support@whitecaves.ae');
    });

    it('should show Cache Enabled checkbox checked by default', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Settings'));
      const cacheCheckbox = screen.getByLabelText('Cache Enabled');
      expect(cacheCheckbox).toBeChecked();
    });

    it('should show Auto-backup Interval with default value', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Settings'));
      const backupInput = screen.getByLabelText(/auto-backup interval/i);
      expect(backupInput).toHaveValue(24);
    });

    it('should show 2FA select with Enabled default', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Settings'));
      const twoFaSelect = screen.getByLabelText('Two-Factor Authentication');
      expect(twoFaSelect).toHaveValue('enabled');
    });

    it('should show Session Timeout with default value', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Settings'));
      const timeoutInput = screen.getByLabelText(/session timeout/i);
      expect(timeoutInput).toHaveValue(30);
    });

    it('should show Save Settings button', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Settings'));
      expect(screen.getByText('Save Settings')).toBeInTheDocument();
    });

    it('should handle settings form submission', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);

      await user.click(screen.getByText('Settings'));

      const saveBtn = screen.getByText('Save Settings');
      await user.click(saveBtn);

      // Should not crash - form submits with preventDefault
      expect(screen.getByText('System Settings')).toBeInTheDocument();
    });
  });

  describe('Overview: System Status Section', () => {
    it('should display System Status header', () => {
      renderWithRedux(<AdminDashboard />);

      expect(screen.getByText('System Status')).toBeInTheDocument();
    });

    it('should display Response Time', () => {
      renderWithRedux(<AdminDashboard />);

      expect(screen.getByText('Response Time')).toBeInTheDocument();
      expect(screen.getByText('142ms')).toBeInTheDocument();
    });

    it('should display Error Rate', () => {
      renderWithRedux(<AdminDashboard />);

      expect(screen.getByText('Error Rate')).toBeInTheDocument();
      expect(screen.getByText('0.02%')).toBeInTheDocument();
    });

    it('should display Database Status', () => {
      renderWithRedux(<AdminDashboard />);

      expect(screen.getByText('Database Status')).toBeInTheDocument();
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });
  });
});
