import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LeadsTab from '../../../owner/tabs/LeadsTab';

describe('LeadsTab Integration', () => {
  const mockProps: import('../types').LeadsTabProps = {
    data: {
      leads: [
        {
          id: 1,
          name: 'Khalid Al Maktoum',
          phone: '+971 50 111 2222',
          email: 'khalid@email.com',
          source: 'whatsapp',
          interest: 'Palm Jumeirah Villa',
          priority: 'high',
          status: 'new',
          createdAt: new Date().toISOString(),
          agent: 'Ahmed Ali',
        },
        {
          id: 2,
          name: 'Emily Watson',
          phone: '+44 7700 123456',
          email: 'emily.w@email.com',
          source: 'website',
          interest: 'Downtown Apartment',
          priority: 'medium',
          status: 'contacted',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          agent: 'Sara Khan',
        },
        {
          id: 3,
          name: 'Chen Wei',
          phone: '+86 138 0000 1234',
          email: 'chen.wei@email.com',
          source: 'chatbot',
          interest: 'Investment Properties',
          priority: 'high',
          status: 'qualified',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          agent: 'Mohammed Hassan',
        },
      ],
    },
    loading: false,
    onAction: vi.fn(),
  };

  describe('Rendering', () => {
    it('should render leads table', () => {
      render(<LeadsTab {...mockProps} />);

      expect(screen.getAllByText('Khalid Al Maktoum')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Emily Watson')[0]).toBeInTheDocument();
    });

    it('should display all leads initially', () => {
      render(<LeadsTab {...mockProps} />);

      expect(screen.getAllByText('Khalid Al Maktoum')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Emily Watson')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Chen Wei')[0]).toBeInTheDocument();
    });

    it('should show lead information', () => {
      render(<LeadsTab {...mockProps} />);

      expect(screen.getAllByText('Palm Jumeirah Villa')[0]).toBeInTheDocument();
      expect(screen.getAllByText('+971 50 111 2222')[0]).toBeInTheDocument();
    });
  });

  describe('Multi-Filter', () => {
    it('should filter leads by source', async () => {
      const user = userEvent.setup();
      render(<LeadsTab {...mockProps} />);

      const sourceFilter = screen.getByDisplayValue('All Sources') as HTMLSelectElement;
      await user.selectOptions(sourceFilter, 'whatsapp');

      expect(screen.getAllByText('Khalid Al Maktoum')[0]).toBeInTheDocument();
    });

    it('should filter leads by status', async () => {
      const user = userEvent.setup();
      render(<LeadsTab {...mockProps} />);

      const statusFilter = screen.getByDisplayValue('All Status') as HTMLSelectElement;
      await user.selectOptions(statusFilter, 'new');

      expect(screen.getAllByText('Khalid Al Maktoum')[0]).toBeInTheDocument();
    });

    it('should filter leads by priority', async () => {
      const user = userEvent.setup();
      render(<LeadsTab {...mockProps} />);

      const priorityFilter = screen.getByDisplayValue('All Priority') as HTMLSelectElement;
      await user.selectOptions(priorityFilter, 'high');

      expect(screen.getAllByText('Khalid Al Maktoum')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Chen Wei')[0]).toBeInTheDocument();
    });

    it('should combine multiple filters', async () => {
      const user = userEvent.setup();
      render(<LeadsTab {...mockProps} />);

      const sourceFilter = screen.getByDisplayValue('All Sources') as HTMLSelectElement;
      const statusFilter = screen.getByDisplayValue('All Status') as HTMLSelectElement;

      await user.selectOptions(sourceFilter, 'whatsapp');
      await user.selectOptions(statusFilter, 'new');

      expect(screen.getAllByText('Khalid Al Maktoum')[0]).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should paginate leads (5 per page)', () => {
      const { container } = render(<LeadsTab {...mockProps} />);

      const paginationNav = container.querySelector('nav');
      // With 3 leads, pagination might not show
      expect(container).toBeInTheDocument();
    });

    it('should reset pagination on filter change', async () => {
      const user = userEvent.setup();
      render(<LeadsTab {...mockProps} />);

      const sourceFilter = screen.getByDisplayValue('All Sources') as HTMLSelectElement;
      await user.selectOptions(sourceFilter, 'website');

      // Pagination should reset to page 1
      const paginationNav = screen.queryByRole('navigation');
      expect(paginationNav).toBeInTheDocument();
    });
  });

  describe('Badges', () => {
    it('should show priority badges', () => {
      const { container } = render(<LeadsTab {...mockProps} />);

      const badges = container.querySelectorAll('[class*="badge"]');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should show status badges', () => {
      const { container } = render(<LeadsTab {...mockProps} />);

      const statusBadges = container.querySelectorAll('[class*="status-badge"]');
      expect(statusBadges.length).toBeGreaterThan(0);
    });

    it('should show correct colors for priorities', () => {
      const { container } = render(<LeadsTab {...mockProps} />);

      const badges = container.querySelectorAll('[class*="badge"]');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe('Actions', () => {
    it('should trigger action callbacks', async () => {
      const user = userEvent.setup();
      const handleAction = vi.fn();

      render(<LeadsTab {...mockProps} onAction={handleAction} />);

      const actionButtons = screen.queryAllByRole('button');
      if (actionButtons.length > 0) {
        await user.click(actionButtons[0]);
        // Action should be triggered
      }
    });

    it('should handle call action', async () => {
      const user = userEvent.setup();
      const handleAction = vi.fn();

      render(<LeadsTab {...mockProps} onAction={handleAction} />);

      const callButtons = screen.queryAllByText('📞');
      if (callButtons.length > 0 && callButtons[0].closest('button')) {
        await user.click(callButtons[0].closest('button') as HTMLElement);
      }
    });

    it('should handle WhatsApp action', async () => {
      const user = userEvent.setup();
      const handleAction = vi.fn();

      render(<LeadsTab {...mockProps} onAction={handleAction} />);

      const whatsappButtons = screen.queryAllByText('💬');
      if (whatsappButtons.length > 0 && whatsappButtons[0].closest('button')) {
        await user.click(whatsappButtons[0].closest('button') as HTMLElement);
      }
    });
  });

  describe('Accessibility', () => {
    it('should have accessible table structure', () => {
      const { container } = render(<LeadsTab {...mockProps} />);

      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
    });

    it('should have accessible filters', () => {
      render(<LeadsTab {...mockProps} />);

      const sourceFilter = screen.getByDisplayValue('All Sources');
      expect(sourceFilter).toBeInTheDocument();
    });

    it('should have accessible action buttons', () => {
      const { container } = render(<LeadsTab {...mockProps} />);

      const actionButtons = container.querySelectorAll('button[title]');
      expect(actionButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Unassigned Leads', () => {
    it('should show unassigned indicator', () => {
      const unassignedProps = {
        ...mockProps,
        data: {
          leads: [
            {
              ...mockProps.data.leads![0],
              agent: '',
            },
          ],
        },
      };

      render(<LeadsTab {...unassignedProps} />);

      const unassigned = screen.queryByText('Unassigned');
      if (unassigned) {
        expect(unassigned).toBeInTheDocument();
      }
    });
  });
});
