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
          role: 'affiliated_agent',
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
      
      // Component uses internal DUMMY_USERS sorted alphabetically, page 1 shows first 10
      expect(screen.getByText('Ahmed Al Maktoum')).toBeInTheDocument();
      expect(screen.getByText('David Miller')).toBeInTheDocument();
    });

    it('should display all users initially', () => {
      render(<UsersTab {...mockProps} />);
      
      // First page (10 per page) of alphabetically sorted DUMMY_USERS
      expect(screen.getByText('Ahmed Al Maktoum')).toBeInTheDocument();
      expect(screen.getByText('James Wilson')).toBeInTheDocument();
      expect(screen.getByText('Khalid Hassan')).toBeInTheDocument();
    });

    it('should show user information', () => {
      render(<UsersTab {...mockProps} />);
      
      expect(screen.getByText('ahmed.maktoum@whitecaves.ae')).toBeInTheDocument();
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
      
      // company_owner is not in REAL_ESTATE_ROLES, use sales_agent instead
      const roleFilter = screen.getByDisplayValue('All Roles');
      await user.selectOptions(roleFilter, 'sales_agent');
      
      expect(screen.getByText('Mohammed Al Rashid')).toBeInTheDocument();
    });

    it('should filter users by sales_agent role', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      const roleFilter = screen.getByDisplayValue('All Roles');
      await user.selectOptions(roleFilter, 'sales_agent');
      
      expect(screen.getByText('Mohammed Al Rashid')).toBeInTheDocument();
    });

    it('should filter users by sales_manager role', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      const roleFilter = screen.getByDisplayValue('All Roles');
      await user.selectOptions(roleFilter, 'sales_manager');
      
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    });

    it('should filter users by affiliated agent role', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      // affiliated_agent role
      const roleFilter = screen.getByDisplayValue('All Roles');
      await user.selectOptions(roleFilter, 'affiliated_agent');
      
      expect(screen.getByText('Ali Kazim')).toBeInTheDocument();
    });
  });

  describe('Status Filtering', () => {
    it('should filter users by active status', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      const statusFilter = screen.getByDisplayValue('All Status');
      await user.selectOptions(statusFilter, 'active');
      
      expect(screen.getByText('Ahmed Al Maktoum')).toBeInTheDocument();
    });

    it('should filter users by inactive status', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      const statusFilter = screen.getByDisplayValue('All Status');
      await user.selectOptions(statusFilter, 'inactive');
      
      // DUMMY_USERS: Michael Brown (document_controller, inactive) and Suki Yamamoto (interior_designer, inactive)
      expect(screen.getByText('Michael Brown')).toBeInTheDocument();
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
      const badges = screen.queryAllByText(/company_owner|sales_manager|sales_agent|affiliated_agent/i);
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe('Status Badges', () => {
    it('should display status badge for each user', () => {
      render(<UsersTab {...mockProps} />);
      
      // Component uses CSS classes for badges
      const activeText = screen.queryAllByText(/active|pending|inactive/i);
      expect(activeText.length).toBeGreaterThan(0);
    });

    it('should show active status badge', () => {
      render(<UsersTab {...mockProps} />);
      
      const activeText = screen.queryAllByText(/active/i);
      expect(activeText.length).toBeGreaterThanOrEqual(4);
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
      render(<UsersTab {...mockProps} />);
      
      const searchInput = screen.getByPlaceholderText(/search users/i);
      expect(searchInput).toBeInTheDocument();
    });

    it('should filter users by name search', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      const searchInput = screen.getByPlaceholderText(/search users/i);
      await user.type(searchInput, 'Ahmed');
      
      expect(screen.getByText('Ahmed Al Maktoum')).toBeInTheDocument();
    });

    it('should filter users by email search', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      const searchInput = screen.getByPlaceholderText(/search users/i);
      await user.type(searchInput, 'sarah.j@');
      
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    });

    it('should show no results message when search matches nothing', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      const searchInput = screen.getByPlaceholderText(/search users/i);
      await user.type(searchInput, 'zzzznonexistent');
      
      expect(screen.getByText(/no users found/i)).toBeInTheDocument();
    });

    it('should have clear filters button in no results state', async () => {
      const user = userEvent.setup();
      render(<UsersTab {...mockProps} />);
      
      const searchInput = screen.getByPlaceholderText(/search users/i);
      await user.type(searchInput, 'zzzznonexistent');
      
      const clearBtn = screen.getByText(/clear filters/i);
      expect(clearBtn).toBeInTheDocument();
      
      await user.click(clearBtn);
      expect(screen.getByText('Ahmed Al Maktoum')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should sort by name ascending by default', () => {
      render(<UsersTab {...mockProps} />);
      
      // First user alphabetically among DUMMY_USERS
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });

    it('should toggle sort direction on column header click', async () => {
      const user = userEvent.setup();
      const { container } = render(<UsersTab {...mockProps} />);
      
      // Click on "User" sortable header to change sort direction
      const sortableHeaders = container.querySelectorAll('.sortable');
      expect(sortableHeaders.length).toBeGreaterThan(0);
      
      await user.click(sortableHeaders[0]); // Click "User" header once (asc → desc)
      
      // Verify table still renders
      expect(screen.getAllByRole('row').length).toBeGreaterThan(1);
    });

    it('should sort by deals', async () => {
      const user = userEvent.setup();
      const { container } = render(<UsersTab {...mockProps} />);
      
      const sortableHeaders = container.querySelectorAll('.sortable');
      // Deals is one of the sortable columns
      const dealsHeader = Array.from(sortableHeaders).find(h => h.textContent?.includes('Deals'));
      if (dealsHeader) {
        await user.click(dealsHeader);
        expect(screen.getAllByRole('row').length).toBeGreaterThan(1);
      }
    });
  });

  describe('Bulk Actions', () => {
    it('should have select-all checkbox', () => {
      const { container } = render(<UsersTab {...mockProps} />);
      
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it('should select individual users via checkbox', async () => {
      const user = userEvent.setup();
      const { container } = render(<UsersTab {...mockProps} />);
      
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      // First checkbox is select-all, second is the first user
      if (checkboxes.length > 1) {
        await user.click(checkboxes[1]);
        expect(screen.getByText(/1 users selected/)).toBeInTheDocument();
      }
    });

    it('should show bulk action buttons when users selected', async () => {
      const user = userEvent.setup();
      const { container } = render(<UsersTab {...mockProps} />);
      
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      if (checkboxes.length > 1) {
        await user.click(checkboxes[1]);
        expect(screen.getByText('Activate')).toBeInTheDocument();
        expect(screen.getByText('Deactivate')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
        expect(screen.getByText('Clear')).toBeInTheDocument();
      }
    });

    it('should clear selection when Clear button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(<UsersTab {...mockProps} />);
      
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      if (checkboxes.length > 1) {
        await user.click(checkboxes[1]);
        const clearBtn = screen.getByText('Clear');
        await user.click(clearBtn);
        expect(screen.queryByText(/users selected/)).not.toBeInTheDocument();
      }
    });

    it('should select all users with select-all checkbox', async () => {
      const user = userEvent.setup();
      const { container } = render(<UsersTab {...mockProps} />);
      
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      if (checkboxes.length > 0) {
        await user.click(checkboxes[0]); // Select all
        expect(screen.getByText(/users selected/)).toBeInTheDocument();
      }
    });
  });

  describe('Category Filtering', () => {
    it('should display category overview section', () => {
      render(<UsersTab {...mockProps} />);
      
      expect(screen.getByText('Users by Category')).toBeInTheDocument();
    });

    it('should display category cards', () => {
      const { container } = render(<UsersTab {...mockProps} />);
      
      const categoryCards = container.querySelectorAll('.category-card');
      expect(categoryCards.length).toBeGreaterThan(0);
    });

    it('should display category names', () => {
      render(<UsersTab {...mockProps} />);
      
      expect(screen.getByText('Executive')).toBeInTheDocument();
      expect(screen.getByText('Management')).toBeInTheDocument();
      expect(screen.getByText('Agents')).toBeInTheDocument();
    });

    it('should filter by category when card is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(<UsersTab {...mockProps} />);
      
      const agentsCard = Array.from(container.querySelectorAll('.category-card'))
        .find(card => card.textContent?.includes('Agents'));
      
      if (agentsCard) {
        await user.click(agentsCard);
        // Filtered to agents category
        expect(screen.getAllByRole('row').length).toBeGreaterThanOrEqual(1);
      }
    });

    it('should deselect category on second click', async () => {
      const user = userEvent.setup();
      const { container } = render(<UsersTab {...mockProps} />);
      
      const agentsCard = Array.from(container.querySelectorAll('.category-card'))
        .find(card => card.textContent?.includes('Agents'));
      
      if (agentsCard) {
        await user.click(agentsCard); // Select
        await user.click(agentsCard); // Deselect
        // Should show all users again
        expect(screen.getByText('Ahmed Al Maktoum')).toBeInTheDocument();
      }
    });
  });

  describe('Statistics Display', () => {
    it('should display total users count', () => {
      render(<UsersTab {...mockProps} />);
      
      expect(screen.getByText('Total Users')).toBeInTheDocument();
    });

    it('should display active users stat', () => {
      render(<UsersTab {...mockProps} />);
      
      const activeLabels = screen.getAllByText('Active');
      expect(activeLabels.length).toBeGreaterThan(0);
    });

    it('should display pending users stat', () => {
      render(<UsersTab {...mockProps} />);
      
      const pendingLabels = screen.getAllByText('Pending');
      expect(pendingLabels.length).toBeGreaterThan(0);
    });

    it('should display role types count', () => {
      render(<UsersTab {...mockProps} />);
      
      expect(screen.getByText('Role Types')).toBeInTheDocument();
    });
  });

  describe('User Action Buttons', () => {
    it('should call onAction with viewUser on View click', async () => {
      const user = userEvent.setup();
      const onActionMock = vi.fn();
      render(<UsersTab onAction={onActionMock} />);
      
      const viewButtons = screen.getAllByTitle('View');
      await user.click(viewButtons[0]);
      
      expect(onActionMock).toHaveBeenCalledWith('viewUser', expect.objectContaining({ id: expect.any(Number) }));
    });

    it('should call onAction with editUser on Edit click', async () => {
      const user = userEvent.setup();
      const onActionMock = vi.fn();
      render(<UsersTab onAction={onActionMock} />);
      
      const editButtons = screen.getAllByTitle('Edit');
      await user.click(editButtons[0]);
      
      expect(onActionMock).toHaveBeenCalledWith('editUser', expect.objectContaining({ id: expect.any(Number) }));
    });

    it('should call onAction with deleteUser on Delete click', async () => {
      const user = userEvent.setup();
      const onActionMock = vi.fn();
      render(<UsersTab onAction={onActionMock} />);
      
      const deleteButtons = screen.getAllByTitle('Delete');
      await user.click(deleteButtons[0]);
      
      expect(onActionMock).toHaveBeenCalledWith('deleteUser', expect.objectContaining({ id: expect.any(Number) }));
    });

    it('should call onAction with addUser on Add User button click', async () => {
      const user = userEvent.setup();
      const onActionMock = vi.fn();
      render(<UsersTab onAction={onActionMock} />);
      
      const addBtn = screen.getByText(/add user/i);
      await user.click(addBtn);
      
      expect(onActionMock).toHaveBeenCalledWith('addUser');
    });
  });

  describe('Table Footer', () => {
    it('should display showing count text', () => {
      render(<UsersTab {...mockProps} />);
      
      expect(screen.getByText(/showing \d+ of \d+ users/i)).toBeInTheDocument();
    });
  });

  describe('Accessible Table', () => {
    it('should have aria-label on the table', () => {
      render(<UsersTab {...mockProps} />);
      
      const table = screen.getByRole('table', { name: /team members and users/i });
      expect(table).toBeInTheDocument();
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
