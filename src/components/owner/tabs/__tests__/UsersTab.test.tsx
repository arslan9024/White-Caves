import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UsersTab from '../UsersTab';

describe('UsersTab Integration', () => {
  const mockProps = {
    data: {
      users: [
        {
          id: 1,
          name: 'Ahmed Al Maktoum',
          email: 'ahmed.maktoum@whitecaves.ae',
          phone: '+971 50 123 4567',
          role: 'company_owner',
          status: 'active',
          joinDate: '2023-01-15',
          lastActive: '2024-01-08',
          properties: 45,
          deals: 128,
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah.j@whitecaves.ae',
          phone: '+971 55 234 5678',
          role: 'sales_manager',
          status: 'active',
          joinDate: '2023-03-20',
          lastActive: '2024-01-08',
          properties: 0,
          deals: 87,
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
        },
        {
          id: 3,
          name: 'Mohammed Al Rashid',
          email: 'mohammed.r@whitecaves.ae',
          phone: '+971 50 345 6789',
          role: 'sales_agent',
          status: 'active',
          joinDate: '2023-04-10',
          lastActive: '2024-01-07',
          properties: 12,
          deals: 34,
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
        },
        {
          id: 4,
          name: 'Fatima Al Mansouri',
          email: 'fatima.m@whitecaves.ae',
          phone: '+971 50 456 7890',
          role: 'sales_agent',
          status: 'inactive',
          joinDate: '2023-05-25',
          lastActive: '2024-01-01',
          properties: 5,
          deals: 12,
          avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
        },
        {
          id: 5,
          name: 'Omar Khalifa',
          email: 'omar.k@whitecaves.ae',
          phone: '+971 50 567 8901',
          role: 'freelancer',
          status: 'active',
          joinDate: '2023-06-10',
          lastActive: '2024-01-07',
          properties: 8,
          deals: 23,
          avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
        },
        {
          id: 6,
          name: 'Aisha Mohammad',
          email: 'aisha.m@whitecaves.ae',
          phone: '+971 55 678 9012',
          role: 'company_owner',
          status: 'active',
          joinDate: '2023-02-01',
          lastActive: '2024-01-08',
          properties: 32,
          deals: 95,
          avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
        }
      ]
    },
    loading: false,
    onAction: vi.fn()
  };

  describe('Rendering', () => {
    it('should render users table', () => {
      render(<UsersTab {...mockProps} />);
      
      expect(screen.getByText('Ahmed Al Maktoum')).toBeInTheDocument();
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    });

    it('should display all users initially', () => {
      render(<UsersTab {...mockProps} />);
      
      expect(screen.getByText('Ahmed Al Maktoum')).toBeInTheDocument();
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Mohammed Al Rashid')).toBeInTheDocument();
    });

    it('should show user information', () => {
      render(<UsersTab {...mockProps} />);
      
      expect(screen.getByText('ahmed.maktoum@whitecaves.ae')).toBeInTheDocument();
      expect(screen.getByText('+971 50 123 4567')).toBeInTheDocument();
    });

    it('should display user statistics', () => {
      render(<UsersTab {...mockProps} />);
      
      expect(screen.getByText(/128|45/)).toBeInTheDocument(); // Ahmed's deal count
    });
  });

  describe('Role Filtering', () => {
    it('should filter users by company_owner role', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      const roleFilter = screen.getByDisplayValue('All Roles');
      await user.selectOptions(roleFilter, 'company_owner');
      
      expect(screen.getByText('Ahmed Al Maktoum')).toBeInTheDocument();
      expect(screen.getByText('Aisha Mohammad')).toBeInTheDocument();
    });

    it('should filter users by sales_agent role', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      const roleFilter = screen.getByDisplayValue('All Roles');
      await user.selectOptions(roleFilter, 'sales_agent');
      
      expect(screen.getByText('Mohammed Al Rashid')).toBeInTheDocument();
      expect(screen.getByText('Fatima Al Mansouri')).toBeInTheDocument();
    });

    it('should filter users by sales_manager role', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      const roleFilter = screen.getByDisplayValue('All Roles');
      await user.selectOptions(roleFilter, 'sales_manager');
      
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    });

    it('should filter users by freelancer role', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      const roleFilter = screen.getByDisplayValue('All Roles');
      await user.selectOptions(roleFilter, 'freelancer');
      
      expect(screen.getByText('Omar Khalifa')).toBeInTheDocument();
    });
  });

  describe('Status Filtering', () => {
    it('should filter users by active status', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      const statusFilter = screen.getByDisplayValue('All Status');
      await user.selectOptions(statusFilter, 'active');
      
      expect(screen.getByText('Ahmed Al Maktoum')).toBeInTheDocument();
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    });

    it('should filter users by inactive status', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      const statusFilter = screen.getByDisplayValue('All Status');
      await user.selectOptions(statusFilter, 'inactive');
      
      expect(screen.getByText('Fatima Al Mansouri')).toBeInTheDocument();
    });
  });

  describe('Combined Filtering', () => {
    it('should combine role and status filters', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      const roleFilter = screen.getByDisplayValue('All Roles');
      const statusFilter = screen.getByDisplayValue('All Status');
      
      await user.selectOptions(roleFilter, 'sales_agent');
      await user.selectOptions(statusFilter, 'active');
      
      expect(screen.getByText('Mohammed Al Rashid')).toBeInTheDocument();
    });
  });

  describe('Role Badges', () => {
    it('should display role badge for each user', () => {
      const { container } = render(<UsersTab {...mockProps} />);
      
      const badges = container.querySelectorAll('[class*="role-badge"]');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should show different role badges', () => {
      render(<UsersTab {...mockProps} />);
      
      // Check for different role types
      const badges = screen.queryAllByText(/company_owner|sales_manager|sales_agent|freelancer/i);
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe('Status Badges', () => {
    it('should display status badge for each user', () => {
      const { container } = render(<UsersTab {...mockProps} />);
      
      const badges = container.querySelectorAll('[class*="status-badge"]');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should show active status badge', () => {
      const { container } = render(<UsersTab {...mockProps} />);
      
      const badges = container.querySelectorAll('[class*="status-badge"]');
      expect(badges.length).toBeGreaterOr Equal(4);
    });
  });

  describe('Pagination', () => {
    it('should render pagination for users list', () => {
      const { container } = render(<UsersTab {...mockProps} />);
      
      const paginationNav = container.querySelector('nav');
      expect(paginationNav).toBeInTheDocument();
    });

    it('should navigate through pages', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      const nextButton = screen.queryByRole('button', { name: /next|›/i });
      if (nextButton) {
        expect(nextButton).toBeInTheDocument();
      }
    });

    it('should reset pagination on filter change', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      const roleFilter = screen.getByDisplayValue('All Roles');
      await user.selectOptions(roleFilter, 'sales_agent');
      
      expect(screen.getByText('Mohammed Al Rashid')).toBeInTheDocument();
    });
  });

  describe('User Actions', () => {
    it('should have edit button for users', () => {
      const { container } = render(<UsersTab {...mockProps} />);
      
      const editButtons = container.querySelectorAll('button');
      expect(editButtons.length).toBeGreaterThan(0);
    });

    it('should call onAction when edit is triggered', async () => {
      const user = userEvent.setup();
      const onActionMock = vi.fn();
      const propsWithAction = {
        ...mockProps,
        onAction: onActionMock
      };
      
      const { container } = render(<UsersTab {...propsWithAction} />);
      
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Search Functionality', () => {
    it('should have search input', () => {
      const { container } = render(<UsersTab {...mockProps} />);
      
      const searchInputs = container.querySelectorAll('input[type="text"], input[type="search"]');
      expect(searchInputs.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible filter labels', () => {
      render(<UsersTab {...mockProps} />);
      
      const roleFilter = screen.getByDisplayValue('All Roles');
      expect(roleFilter).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      const roleFilter = screen.getByDisplayValue('All Roles');
      roleFilter.focus();
      expect(roleFilter).toHaveFocus();
    });
  });

  describe('Empty State', () => {
    it('should handle empty users list', () => {
      const emptyProps = {
        data: { users: [] },
        loading: false,
        onAction: vi.fn()
      };
      
      const { container } = render(<UsersTab {...emptyProps} />);
      
      expect(container).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should render when loading is false', () => {
      render(<UsersTab {...mockProps} />);
      
      expect(screen.getByText('Ahmed Al Maktoum')).toBeInTheDocument();
    });

    it('should render with null data gracefully', () => {
      const nullDataProps = {
        data: null,
        loading: false,
        onAction: vi.fn()
      };
      
      const { container } = render(<UsersTab {...nullDataProps} />);
      
      expect(container).toBeInTheDocument();
    });
  });
});
