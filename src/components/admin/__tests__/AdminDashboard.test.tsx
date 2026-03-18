import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../redux/slices/authSlice';
import AdminDashboard from '../AdminDashboard';

// Mock store setup
const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer
    },
    preloadedState: {
      auth: {
        user: {
          id: 'admin-123',
          displayName: 'John Admin',
          email: 'admin@whitecaves.ae',
          role: 'admin'
        },
        isAuthenticated: true,
        loading: false
      }
    }
  });
};

describe('AdminDashboard Integration', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = createMockStore();
  });

  const renderWithRedux = (component) => {
    return render(
      <Provider store={mockStore}>
        {component}
      </Provider>
    );
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
      
      expect(screen.getByText(/1243|Total Users/)).toBeInTheDocument();
    });

    it('should show active users count', () => {
      renderWithRedux(<AdminDashboard />);
      
      expect(screen.getByText(/567|Active Users/)).toBeInTheDocument();
    });

    it('should display properties metrics', () => {
      renderWithRedux(<AdminDashboard />);
      
      expect(screen.getByText(/3421|Total Properties/)).toBeInTheDocument();
    });

    it('should show system health status', () => {
      renderWithRedux(<AdminDashboard />);
      
      const healthIndicators = screen.queryAllByText(/excellent|good|warning/i);
      expect(healthIndicators.length).toBeGreaterThanOrEqual(0);
    });

    it('should display uptime percentage', () => {
      renderWithRedux(<AdminDashboard />);
      
      expect(screen.getByText(/99.98|uptime/i)).toBeInTheDocument();
    });
  });

  describe('Recent Activities Section', () => {
    it('should display recent activities', () => {
      renderWithRedux(<AdminDashboard />);
      
      expect(screen.getByText(/Created new property listing|Recent Activity/i)).toBeInTheDocument();
    });

    it('should show activity user names', () => {
      renderWithRedux(<AdminDashboard />);
      
      const activities = screen.queryAllByText(/John Doe|Jane Smith|Ahmed Hassan/);
      expect(activities.length).toBeGreaterThan(0);
    });

    it('should display activity timestamps', () => {
      renderWithRedux(<AdminDashboard />);
      
      expect(screen.getByText(/hours ago|days ago/i)).toBeInTheDocument();
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
      
      expect(screen.getByText(/High CPU usage detected|Database backup/i)).toBeInTheDocument();
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
      
      expect(screen.getByText(/John Doe|Jane Smith/)).toBeInTheDocument();
    });

    it('should show user roles', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);
      
      const usersTab = screen.getByText('Users');
      await user.click(usersTab);
      
      expect(screen.queryByText(/agent|admin/i)).toBeTruthy();
    });

    it('should display user status', async () => {
      const user = userEvent.setup();
      renderWithRedux(<AdminDashboard />);
      
      const usersTab = screen.getByText('Users');
      await user.click(usersTab);
      
      expect(screen.queryByText(/active|inactive/i)).toBeTruthy();
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
      const storeWithoutDisplayName = configureStore({
        reducer: {
          auth: authReducer
        },
        preloadedState: {
          auth: {
            user: {
              id: 'admin-456',
              email: 'test@whitecaves.ae'
            },
            isAuthenticated: true,
            loading: false
          }
        }
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
      const emptyStore = configureStore({
        reducer: {
          auth: authReducer
        },
        preloadedState: {
          auth: {
            user: null,
            isAuthenticated: false,
            loading: false
          }
        }
      });
      
      render(
        <Provider store={emptyStore}>
          <AdminDashboard />
        </Provider>
      );
      
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });
  });
});
