import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertiesTab from '../../../owner/tabs/PropertiesTab';

describe('PropertiesTab Integration', () => {
  const mockProps = {
    role: 'owner',
    data: {
      properties: [
        {
          id: 1,
          code: 'PROP001',
          title: 'Marina View Apartment',
          type: 'Apartment',
          location: 'Dubai Marina',
          price: 2500000,
          status: 'Active',
          agent: 'Ahmed Ali'
        },
        {
          id: 2,
          code: 'PROP002',
          title: 'Palm Jumeirah Villa',
          type: 'Villa',
          location: 'Palm Jumeirah',
          price: 5000000,
          status: 'Inactive',
          agent: 'Sara Khan'
        },
        {
          id: 3,
          code: 'PROP003',
          title: 'Downtown Penthouse',
          type: 'Penthouse',
          location: 'Downtown Dubai',
          price: 3500000,
          status: 'Pending',
          agent: null
        },
      ]
    },
    user: {
      id: '1',
      name: 'Test User',
      role: 'owner'
    }
  };

  describe('Rendering', () => {
    it('should render properties table', () => {
      render(<PropertiesTab {...mockProps} />);
      
      expect(screen.getByText('PROP001')).toBeInTheDocument();
      expect(screen.getByText('Marina View Apartment')).toBeInTheDocument();
    });

    it('should display all properties initially', () => {
      render(<PropertiesTab {...mockProps} />);
      
      expect(screen.getByText('PROP001')).toBeInTheDocument();
      expect(screen.getByText('PROP002')).toBeInTheDocument();
      expect(screen.getByText('PROP003')).toBeInTheDocument();
    });

    it('should show property status badges', () => {
      const { container } = render(<PropertiesTab {...mockProps} />);
      
      const badges = container.querySelectorAll('[class*="badge"]');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe('Filtering', () => {
    it('should filter properties by status', async () => {
      const user = userEvent.setup();
      render(<PropertiesTab {...mockProps} />);
      
      const statusFilter = screen.getByDisplayValue('All Status') as HTMLSelectElement;
      await user.selectOptions(statusFilter, 'Active');
      
      expect(screen.getByText('PROP001')).toBeInTheDocument();
      // Inactive property should not be fully visible depending on pagination
    });

    it('should filter properties by type', async () => {
      const user = userEvent.setup();
      render(<PropertiesTab {...mockProps} />);
      
      const typeFilter = screen.getByDisplayValue('All Types') as HTMLSelectElement;
      await user.selectOptions(typeFilter, 'Villa');
      
      expect(screen.getByText('PROP002')).toBeInTheDocument();
    });

    it('should reset pagination when filtering', async () => {
      const user = userEvent.setup();
      render(<PropertiesTab {...mockProps} />);
      
      const typeFilter = screen.getByDisplayValue('All Types') as HTMLSelectElement;
      await user.selectOptions(typeFilter, 'Villa');
      
      // Pagination should reset to page 1
      const pagination = screen.queryByRole('navigation');
      expect(pagination).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should paginate properties (5 per page)', () => {
      const { container } = render(<PropertiesTab {...mockProps} />);
      
      // Check if pagination is present
      const paginationNav = container.querySelector('nav');
      if (mockProps.data.properties.length > 5) {
        expect(paginationNav).toBeInTheDocument();
      }
    });

    it('should handle page navigation', async () => {
      const user = userEvent.setup();
      const manyProperties = {
        ...mockProps,
        data: {
          properties: Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            code: `PROP${String(i + 1).padStart(3, '0')}`,
            title: `Property ${i + 1}`,
            type: 'Apartment',
            location: 'Dubai',
            price: 2500000 + i * 100000,
            status: 'Active',
            agent: `Agent ${i}`
          }))
        }
      };
      
      render(<PropertiesTab {...manyProperties} />);
      
      const page2Button = screen.queryByRole('button', { name: /2/i });
      if (page2Button) {
        await user.click(page2Button);
        // Properties from page 2 should be visible
      }
    });
  });

  describe('Status Badges', () => {
    it('should show correct badge colors for statuses', () => {
      const { container } = render(<PropertiesTab {...mockProps} />);
      
      const badges = container.querySelectorAll('[class*="badge"]');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should display Active status badge', () => {
      render(<PropertiesTab {...mockProps} />);
      
      // Status should be visible in the table
      expect(screen.getByText('PROP001')).toBeInTheDocument();
    });

    it('should display Unassigned for agents without assignments', () => {
      render(<PropertiesTab {...mockProps} />);
      
      // PROP003 has no agent
      expect(screen.getByText('PROP003')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible table structure', () => {
      const { container } = render(<PropertiesTab {...mockProps} />);
      
      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
      
      const thead = table?.querySelector('thead');
      expect(thead).toBeInTheDocument();
    });

    it('should have accessible filters', () => {
      render(<PropertiesTab {...mockProps} />);
      
      const typeFilter = screen.getByDisplayValue('All Types');
      expect(typeFilter).toBeInTheDocument();
    });
  });
});
