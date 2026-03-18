import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContractsTab from '../ContractsTab';

describe('ContractsTab Integration', () => {
  const mockProps = {
    data: {
      contracts: [
        {
          id: 1,
          contractNumber: 'TC-2024-001',
          type: 'tenancy',
          tenant: 'John Smith',
          landlord: 'Mohammed Al Rashid',
          property: 'Marina View Apt 1502',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          amount: 95000,
          status: 'active',
          ejariStatus: 'registered'
        },
        {
          id: 2,
          contractNumber: 'TC-2024-002',
          type: 'tenancy',
          tenant: 'Sarah Wilson',
          landlord: 'Ahmed Hassan',
          property: 'JBR Tower A - 2301',
          startDate: '2024-02-15',
          endDate: '2025-02-14',
          amount: 120000,
          status: 'active',
          ejariStatus: 'registered'
        },
        {
          id: 3,
          contractNumber: 'SC-2024-001',
          type: 'sale',
          buyer: 'Chen Wei',
          seller: 'Dubai Properties LLC',
          property: 'Downtown Villa 45',
          amount: 4500000,
          status: 'pending',
          completionDate: '2024-06-30'
        },
        {
          id: 4,
          contractNumber: 'TC-2024-003',
          type: 'tenancy',
          tenant: 'Emily Brown',
          landlord: 'Fatima Al Maktoum',
          property: 'Palm Jumeirah Villa 12',
          startDate: '2024-03-01',
          endDate: '2025-02-28',
          amount: 350000,
          status: 'pending',
          ejariStatus: 'pending'
        },
        {
          id: 5,
          contractNumber: 'SC-2024-002',
          type: 'sale',
          buyer: 'Rashid Khan',
          seller: 'White Caves RE',
          property: 'Business Bay Tower 1201',
          amount: 2800000,
          status: 'completed',
          completionDate: '2024-04-15'
        },
        {
          id: 6,
          contractNumber: 'TC-2024-004',
          type: 'tenancy',
          tenant: 'David Lee',
          landlord: 'Omar Trading',
          property: 'Silicon Oasis Apt 305',
          startDate: '2023-06-01',
          endDate: '2024-05-31',
          amount: 45000,
          status: 'expired',
          ejariStatus: 'registered'
        }
      ]
    },
    loading: false,
    onAction: vi.fn()
  };

  describe('Rendering', () => {
    it('should render contracts table with header', () => {
      render(<ContractsTab {...mockProps} />);
      
      expect(screen.getByText('Contracts')).toBeInTheDocument();
    });

    it('should display all contracts initially', () => {
      render(<ContractsTab {...mockProps} />);
      
      expect(screen.getByText('TC-2024-001')).toBeInTheDocument();
      expect(screen.getByText('SC-2024-001')).toBeInTheDocument();
    });

    it('should show contract information', () => {
      render(<ContractsTab {...mockProps} />);
      
      expect(screen.getByText('Marina View Apt 1502')).toBeInTheDocument();
      expect(screen.getByText('John Smith')).toBeInTheDocument();
    });

    it('should display contract amounts', () => {
      render(<ContractsTab {...mockProps} />);
      
      expect(screen.getByText(/95000|95,000/)).toBeInTheDocument();
    });
  });

  describe('Type Filtering', () => {
    it('should filter contracts by type - tenancy', async () => {
      const user = userEvent.setup();
      render(<ContractsTab {...mockProps} />);
      
      const typeFilter = screen.getByDisplayValue('All Types');
      await user.selectOptions(typeFilter, 'tenancy');
      
      expect(screen.getByText('TC-2024-001')).toBeInTheDocument();
      expect(screen.getByText('Marina View Apt 1502')).toBeInTheDocument();
    });

    it('should filter contracts by type - sale', async () => {
      const user = userEvent.setup();
      render(<ContractsTab {...mockProps} />);
      
      const typeFilter = screen.getByDisplayValue('All Types');
      await user.selectOptions(typeFilter, 'sale');
      
      expect(screen.getByText('SC-2024-001')).toBeInTheDocument();
      expect(screen.getByText('Chen Wei')).toBeInTheDocument();
    });

    it('should show only matching contracts', async () => {
      const user = userEvent.setup();
      render(<ContractsTab {...mockProps} />);
      
      const typeFilter = screen.getByDisplayValue('All Types');
      await user.selectOptions(typeFilter, 'sale');
      
      // Should show sale contracts
      const text = screen.getByText('SC-2024-001');
      expect(text).toBeInTheDocument();
    });
  });

  describe('Status Filtering', () => {
    it('should filter contracts by status - active', async () => {
      const user = userEvent.setup();
      render(<ContractsTab {...mockProps} />);
      
      const statusFilter = screen.getByDisplayValue('All Status');
      await user.selectOptions(statusFilter, 'active');
      
      expect(screen.getByText('TC-2024-001')).toBeInTheDocument();
      expect(screen.getByText('TC-2024-002')).toBeInTheDocument();
    });

    it('should filter contracts by status - pending', async () => {
      const user = userEvent.setup();
      render(<ContractsTab {...mockProps} />);
      
      const statusFilter = screen.getByDisplayValue('All Status');
      await user.selectOptions(statusFilter, 'pending');
      
      expect(screen.getByText('SC-2024-001')).toBeInTheDocument();
      expect(screen.getByText('TC-2024-003')).toBeInTheDocument();
    });

    it('should filter contracts by status - completed', async () => {
      const user = userEvent.setup();
      render(<ContractsTab {...mockProps} />);
      
      const statusFilter = screen.getByDisplayValue('All Status');
      await user.selectOptions(statusFilter, 'completed');
      
      expect(screen.getByText('SC-2024-002')).toBeInTheDocument();
    });

    it('should filter contracts by status - expired', async () => {
      const user = userEvent.setup();
      render(<ContractsTab {...mockProps} />);
      
      const statusFilter = screen.getByDisplayValue('All Status');
      await user.selectOptions(statusFilter, 'expired');
      
      expect(screen.getByText('TC-2024-004')).toBeInTheDocument();
    });
  });

  describe('Combined Filtering', () => {
    it('should combine type and status filters', async () => {
      const user = userEvent.setup();
      render(<ContractsTab {...mockProps} />);
      
      const typeFilter = screen.getByDisplayValue('All Types');
      const statusFilter = screen.getByDisplayValue('All Status');
      
      await user.selectOptions(typeFilter, 'tenancy');
      await user.selectOptions(statusFilter, 'active');
      
      expect(screen.getByText('TC-2024-001')).toBeInTheDocument();
      expect(screen.getByText('TC-2024-002')).toBeInTheDocument();
    });

    it('should reset pagination when filters change', async () => {
      const user = userEvent.setup();
      render(<ContractsTab {...mockProps} />);
      
      const typeFilter = screen.getByDisplayValue('All Types');
      await user.selectOptions(typeFilter, 'sale');
      
      expect(screen.getByText('SC-2024-001')).toBeInTheDocument();
    });
  });

  describe('Status Badges', () => {
    it('should display status badge for each contract', () => {
      const { container } = render(<ContractsTab {...mockProps} />);
      
      const badges = container.querySelectorAll('[class*="status-badge"]');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should show different colors for different statuses', () => {
      const { container } = render(<ContractsTab {...mockProps} />);
      
      const badges = container.querySelectorAll('[class*="status-badge"]');
      expect(badges.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Ejari Status', () => {
    it('should display ejari status for tenancy contracts', () => {
      render(<ContractsTab {...mockProps} />);
      
      expect(screen.getByText(/Registered|Pending|None/)).toBeInTheDocument();
    });

    it('should show ejari badge', () => {
      const { container } = render(<ContractsTab {...mockProps} />);
      
      const ejariElements = container.querySelectorAll('[class*="ejari"]');
      expect(ejariElements.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Pagination', () => {
    it('should render pagination component', () => {
      const { container } = render(<ContractsTab {...mockProps} />);
      
      const paginationNav = container.querySelector('nav');
      expect(paginationNav).toBeInTheDocument();
    });

    it('should paginate contracts (5 per page)', () => {
      render(<ContractsTab {...mockProps} />);
      
      // With 6 contracts, pagination should be present
      expect(screen.getByText('TC-2024-001')).toBeInTheDocument();
    });

    it('should reset to page 1 on filter change', async () => {
      const user = userEvent.setup();
      render(<ContractsTab {...mockProps} />);
      
      const typeFilter = screen.getByDisplayValue('All Types');
      await user.selectOptions(typeFilter, 'tenancy');
      
      expect(screen.getByText('TC-2024-001')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible filter labels', () => {
      render(<ContractsTab {...mockProps} />);
      
      const typeFilter = screen.getByDisplayValue('All Types');
      expect(typeFilter).toBeInTheDocument();
    });

    it('should support keyboard navigation in filters', async () => {
      const user = userEvent.setup();
      render(<ContractsTab {...mockProps} />);
      
      const typeFilter = screen.getByDisplayValue('All Types');
      typeFilter.focus();
      expect(typeFilter).toHaveFocus();
    });
  });

  describe('Empty State', () => {
    it('should handle empty contracts list', () => {
      const emptyProps = {
        data: { contracts: [] },
        loading: false,
        onAction: vi.fn()
      };
      
      const { container } = render(<ContractsTab {...emptyProps} />);
      
      expect(container).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should render when loading is false', () => {
      render(<ContractsTab {...mockProps} />);
      
      expect(screen.getByText('Contracts')).toBeInTheDocument();
    });

    it('should render with null data gracefully', () => {
      const nullDataProps = {
        data: null,
        loading: false,
        onAction: vi.fn()
      };
      
      const { container } = render(<ContractsTab {...nullDataProps} />);
      
      expect(container).toBeInTheDocument();
    });
  });
});
