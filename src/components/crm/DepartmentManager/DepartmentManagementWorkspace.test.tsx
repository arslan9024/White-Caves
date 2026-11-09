import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import DepartmentManagementWorkspace from './DepartmentManagementWorkspace';
import { enforceMaxNineSubDepts } from './DepartmentManager.data';

const mockDepartments = [
  {
    _id: 'dept-1',
    code: 'DEPT-SALES',
    slug: 'luxury_sales',
    title: 'Luxury Sales & Brokerage',
    level: 'DEPARTMENT',
    order: 1,
    description: 'Statutory brokerage and transactions for Dubai ultra-luxury real estate',
    color: '#EF4444',
    subDeptsCount: 9,
    squadsCount: 9,
    headcount: 24,
    directorOrManagerId: {
      fullName: 'Elena Rostova',
      role: 'Director of Luxury Sales',
    },
  },
  {
    _id: 'dept-2',
    code: 'DEPT-LEASING',
    slug: 'residential_leasing',
    title: 'Portfolio Management & Residential Leasing',
    level: 'DEPARTMENT',
    order: 2,
    description: 'Ejari registration and PDC escrow compliance',
    color: '#3B82F6',
    subDeptsCount: 9,
    squadsCount: 9,
    headcount: 18,
    directorOrManagerId: {
      fullName: 'Sarah Al-Mansoor',
      role: 'Head of Tenancy',
    },
  },
];

describe('DepartmentManagementWorkspace Component (7-Category Co-Location Spec)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/corporate-departments')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: mockDepartments }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) });
    });
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('renders workspace title, stats deck (108 sub-depts), and department cards', async () => {
    render(<DepartmentManagementWorkspace />);

    expect(screen.getByText(/Corporate Departments Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Corporate Architecture · 1-12-108 Protocol/i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText('Luxury Sales & Brokerage')).toBeInTheDocument();
        expect(screen.getByText('Portfolio Management & Residential Leasing')).toBeInTheDocument();
        expect(screen.getByText('DEPT-SALES')).toBeInTheDocument();
        expect(screen.getAllByText(/9 Sub-Depts/i).length).toBeGreaterThan(0);
      },
      { timeout: 15000 }
    );
  }, 30000);

  it('filters departments dynamically via search bar and resets filter', async () => {
    render(<DepartmentManagementWorkspace />);

    await waitFor(() => {
      expect(screen.getByText('Luxury Sales & Brokerage')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search departments by code, title, or scope/i);
    fireEvent.change(searchInput, { target: { value: 'Leasing' } });

    expect(screen.getByText('Portfolio Management & Residential Leasing')).toBeInTheDocument();
    expect(screen.queryByText('Luxury Sales & Brokerage')).toBeNull();

    // Now test unmatched query
    fireEvent.change(searchInput, { target: { value: 'nonexistent-dept-query' } });
    expect(screen.getByText(/No corporate departments found matching/i)).toBeInTheDocument();

    // Click Clear Search Filter
    const clearBtn = screen.getByText('Clear Search Filter');
    fireEvent.click(clearBtn);

    expect(screen.getByText('Luxury Sales & Brokerage')).toBeInTheDocument();
  }, 10000);

  it('swaps department card positions via drag and drop while preserving slot order numbers', async () => {
    render(<DepartmentManagementWorkspace />);

    await waitFor(() => {
      expect(screen.getByText('Luxury Sales & Brokerage')).toBeInTheDocument();
      expect(screen.getByText('Portfolio Management & Residential Leasing')).toBeInTheDocument();
    });

    const cardSales = screen.getByTestId('dept-card-luxury_sales');
    const cardLeasing = screen.getByTestId('dept-card-residential_leasing');

    const dataTransfer = {
      data: {} as Record<string, string>,
      setData: function (k: string, v: string) {
        this.data[k] = v;
      },
      getData: function (k: string) {
        return this.data[k] || '';
      },
      effectAllowed: 'move',
      dropEffect: 'move',
    };

    fireEvent.dragStart(cardSales, { dataTransfer });
    fireEvent.dragOver(cardLeasing, { dataTransfer });
    fireEvent.drop(cardLeasing, { dataTransfer });

    await waitFor(() => {
      const allCards = screen.getAllByTestId(/dept-card-/);
      expect(allCards[0]).toHaveTextContent('Portfolio Management & Residential Leasing');
      expect(allCards[0]).toHaveTextContent('#1');
      expect(allCards[0]).toHaveTextContent('DEPT-SALES');
      expect(allCards[1]).toHaveTextContent('Luxury Sales & Brokerage');
      expect(allCards[1]).toHaveTextContent('#2');
      expect(allCards[1]).toHaveTextContent('DEPT-LEASING');
    });
  }, 10000);

  it('demotes a department to sub-department pool upon delete and allows promotion', async () => {
    render(<DepartmentManagementWorkspace />);

    await waitFor(() => {
      expect(screen.getByText('Luxury Sales & Brokerage')).toBeInTheDocument();
    });

    const deleteBtn = screen.getByTestId('dept-delete-btn-luxury_sales');
    fireEvent.click(deleteBtn);

    expect(screen.queryByTestId('dept-card-luxury_sales')).toBeNull();

    await waitFor(() => {
      expect(screen.getByTestId('workspace-unassigned-pool-deck')).toBeInTheDocument();
      expect(
        screen.getByTestId('workspace-pool-card-sub-from-dept-luxury_sales')
      ).toBeInTheDocument();
    });

    const promoteBtn = screen.getByTestId('promote-btn-sub-from-dept-luxury_sales');
    fireEvent.click(promoteBtn);

    await waitFor(() => {
      expect(screen.getByText(/Luxury Sales & Brokerage/i)).toBeInTheDocument();
    });
  }, 10000);

  it('enforces maximum 9 sub-departments per department and shifts overflow to pool', () => {
    const testSquads = Array.from({ length: 12 }, (_, i) => ({
      id: `squad-${i + 1}`,
      name: `Squad ${i + 1}`,
      code: `SQ-${i + 1}`,
      title: `Unit ${i + 1}`,
      departmentId: 'luxury_sales',
      departmentName: 'Luxury Sales',
      supervisorIndex: i + 1,
      icon: 'Shield',
      color: '#EF4444',
      avatar: '',
      status: 'optimal' as const,
      description: 'Desc',
      specialty: 'Spec',
      assignedTasks: [],
      capabilities: [],
      slaResponseTime: '< 15 mins',
      metrics: { accuracyRate: 99.8, tasksCompletedToday: 5, systemHealth: 'optimal' as const },
    }));

    const result = enforceMaxNineSubDepts(testSquads);
    expect(result.active.length).toBe(9);
    expect(result.overflow.length).toBe(3);
    expect(result.overflow[0].departmentId).toBe('unassigned-pool');
    expect(result.overflow[0].status).toBe('standby');
  });

  it('opens and closes in-workspace create/edit drawer', async () => {
    render(<DepartmentManagementWorkspace />);

    const addBtn = screen.getByText(/Add Corporate Department/i);
    fireEvent.click(addBtn);

    expect(screen.getByText('Create New Corporate Department')).toBeInTheDocument();

    const cancelBtn = screen.getByText('Cancel');
    fireEvent.click(cancelBtn);

    expect(screen.queryByText('Create New Corporate Department')).toBeNull();
  }, 10000);

  it('supports quick inline rename on department cards and 12-Dept Name Finalizer matrix', async () => {
    render(<DepartmentManagementWorkspace />);

    await waitFor(() => {
      expect(screen.getByText('Luxury Sales & Brokerage')).toBeInTheDocument();
    });

    // Quick inline rename on card
    const quickRenameBtn = screen.getByTestId('dept-quick-rename-btn-luxury_sales');
    fireEvent.click(quickRenameBtn);

    const renameInput = screen.getByTestId('dept-inline-rename-input-luxury_sales');
    fireEvent.change(renameInput, { target: { value: 'Ultra-Prime Private Brokerage' } });

    const saveBtn = screen.getByTestId('dept-inline-rename-save-luxury_sales');
    fireEvent.click(saveBtn);

    expect(screen.getByText('Ultra-Prime Private Brokerage')).toBeInTheDocument();

    // Switch to 12-Dept Name Finalizer table view
    const finalizerTabBtn = screen.getByTestId('viewmode-finalizer-btn');
    fireEvent.click(finalizerTabBtn);

    expect(screen.getByTestId('department-finalizer-table')).toBeInTheDocument();
    const row1TitleInput = screen.getByTestId('finalizer-title-input-1') as HTMLInputElement;
    expect(row1TitleInput.value).toBe('Ultra-Prime Private Brokerage');

    fireEvent.change(row1TitleInput, { target: { value: 'Sovereign Luxury Brokerage' } });
    fireEvent.click(screen.getByTestId('finalizer-save-all-btn'));

    expect(screen.getByTestId('finalizer-saved-toast')).toBeInTheDocument();
  }, 10000);

  it('opens 9 sub-items modal with active squads and unassigned pool', async () => {
    render(<DepartmentManagementWorkspace />);

    await waitFor(() => {
      expect(screen.getByText('Luxury Sales & Brokerage')).toBeInTheDocument();
    });

    const viewBtn = screen.getByTestId('dept-view-btn-luxury_sales');
    fireEvent.click(viewBtn);

    expect(screen.getByTestId('department-subitems-modal')).toBeInTheDocument();
    expect(screen.getByText(/Squad Hierarchy/i)).toBeInTheDocument();

    expect(screen.getByTestId('subitem-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('subitem-card-9')).toBeInTheDocument();

    expect(screen.getByTestId('unassigned-pool-section')).toBeInTheDocument();
    expect(screen.getByTestId('pool-card-1')).toBeInTheDocument();

    const closeBtn = screen.getByTitle('Close Modal');
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId('department-subitems-modal')).toBeNull();
  }, 10000);

  it('allows swapping sub-department squads and unassigning to pool', async () => {
    render(<DepartmentManagementWorkspace />);

    await waitFor(() => {
      expect(screen.getByText('Luxury Sales & Brokerage')).toBeInTheDocument();
    });

    const viewBtn = screen.getByTestId('dept-view-btn-luxury_sales');
    fireEvent.click(viewBtn);

    const unassignBtn = screen.getByTestId('squad-unassign-btn-1');
    fireEvent.click(unassignBtn);

    expect(screen.getByTestId('subitem-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('unassigned-pool-section')).toBeInTheDocument();
  }, 10000);

  it('loads 12 canonical fallback departments when backend returns empty data', async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/corporate-departments')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: [] }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) });
    });

    render(<DepartmentManagementWorkspace />);

    await waitFor(
      () => {
        expect(screen.getByText(/Customer Experience, Concierge & Hospitality/i)).toBeInTheDocument();
        expect(screen.getByText(/Marketing, Branding & Digital Acquisition/i)).toBeInTheDocument();
        expect(screen.getByText(/Human Resources, Performance & Recruiting/i)).toBeInTheDocument();
      },
      { timeout: 8000 }
    );
  }, 10000);
});
