import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmployeeManagerView } from './EmployeeManagerView';
import {
  executeHireEmployeeWorkflow,
  executeUpdateEmployeeWorkflow,
  executeDemoteEmployeeWorkflow,
} from './EmployeeManager.workflow';
import {
  calculateEmployeeCommissionSplit,
  calculateClientLoyaltyVoucher,
} from './EmployeeManager.logic';
import { INITIAL_EMPLOYEES_SEED } from './EmployeeManager.data';

describe('EmployeeManager 7-Category Suite', () => {
  it('renders employee directory view with header, metrics, and cards', () => {
    render(<EmployeeManagerView />);

    expect(screen.getByTestId('employee-manager-view')).toBeInTheDocument();
    expect(screen.getByTestId('employee-metrics-row')).toBeInTheDocument();
    expect(screen.getByTestId('employee-cards-grid')).toBeInTheDocument();

    // Check first employee card
    expect(screen.getByTestId('employee-card-EMP-001')).toBeInTheDocument();
    expect(screen.getAllByText('Sophia Al-Hashemi').length).toBeGreaterThan(0);
    expect(screen.getByText('Managing Director & Strategic Lead')).toBeInTheDocument();
  });

  it('filters employees dynamically via search input', () => {
    render(<EmployeeManagerView />);

    const searchInput = screen.getByTestId('employee-search-input');
    fireEvent.change(searchInput, { target: { value: 'Elena' } });

    expect(screen.getByTestId('employee-card-EMP-004')).toBeInTheDocument();
    expect(screen.queryByTestId('employee-card-EMP-001')).not.toBeInTheDocument();
  });

  it('filters employees by operational pillar', () => {
    render(<EmployeeManagerView />);

    const pillarSelect = screen.getByTestId('filter-pillar-select');
    fireEvent.change(pillarSelect, { target: { value: 'pillar-1' } });

    // Legal Director Tariq should be visible
    expect(screen.getByTestId('employee-card-EMP-002')).toBeInTheDocument();
    // Sales Director Elena should not be visible
    expect(screen.queryByTestId('employee-card-EMP-004')).not.toBeInTheDocument();
  });

  it('opens create drawer when clicking Onboard New Employee', () => {
    render(<EmployeeManagerView />);

    const addBtn = screen.getByTestId('add-employee-btn');
    fireEvent.click(addBtn);

    expect(screen.getByText('New Hire Registration')).toBeInTheDocument();
    expect(screen.getByText('Complete Onboarding')).toBeInTheDocument();
  });

  it('shifts employee to standby reserve status upon demoting', () => {
    render(<EmployeeManagerView />);

    const demoteBtn = screen.getByTestId('demote-emp-EMP-009');
    fireEvent.click(demoteBtn);

    expect(screen.getByText(/shifted to Standby Reserve/i)).toBeInTheDocument();
  });

  describe('Pure Employee Workflow Engine (I-P-O-V Protocol)', () => {
    it('executeHireEmployeeWorkflow adds employee with auto-generated EMP code', () => {
      const initial = [...INITIAL_EMPLOYEES_SEED];
      const payload = {
        fullName: 'Zack Taylor',
        email: 'zack@whitecaves.ae',
        phone: '+971 4 222 9999',
        roleTier: 'BROKER' as const,
        designation: 'Luxury Off-Plan Consultant',
        pillarId: 'pillar-4',
        pillarName: 'Pillar IV: Sales Operations & Brokerage',
        departmentName: 'Residential Sales & Leasing',
        supervisorName: 'Elena Rostova',
        reportingManager: 'Elena Rostova',
        status: 'active' as const,
        baseSalaryAED: 10000,
        commissionRatePct: 50,
        skills: ['Negotiation', 'Closing'],
        joinedDate: '2026-11-05',
      };

      const result = executeHireEmployeeWorkflow(initial, payload);
      expect(result.success).toBe(true);
      expect(result.employees.length).toBe(initial.length + 1);
      expect(result.employees[0].fullName).toBe('Zack Taylor');
      expect(result.employees[0].employeeCode).toMatch(/^EMP-\d+/);
    });

    it('executeUpdateEmployeeWorkflow updates designated fields correctly', () => {
      const initial = [...INITIAL_EMPLOYEES_SEED];
      const result = executeUpdateEmployeeWorkflow(initial, 'emp-001', {
        designation: 'Executive Managing Director & Chairman',
      });

      expect(result.success).toBe(true);
      const updated = result.employees.find(e => e._id === 'emp-001')!;
      expect(updated.designation).toBe('Executive Managing Director & Chairman');
    });

    it('executeDemoteEmployeeWorkflow shifts status to standby preserving history', () => {
      const initial = [...INITIAL_EMPLOYEES_SEED];
      const result = executeDemoteEmployeeWorkflow(
        initial,
        'emp-002',
        'Transferred to reserve pool'
      );

      expect(result.success).toBe(true);
      const demoted = result.employees.find(e => e._id === 'emp-002')!;
      expect(demoted.status).toBe('standby');
      expect(demoted.designation).toContain('[Standby Reserve]');
    });

    it('calculates employee commission slabs according to Bhakti Protocol (50% to 70%)', () => {
      expect(calculateEmployeeCommissionSplit(15000)).toBe(0.5);
      expect(calculateEmployeeCommissionSplit(25000)).toBe(0.5);
      expect(calculateEmployeeCommissionSplit(35000)).toBe(0.55);
      expect(calculateEmployeeCommissionSplit(65000)).toBe(0.6);
      expect(calculateEmployeeCommissionSplit(85000)).toBe(0.65);
      expect(calculateEmployeeCommissionSplit(120000)).toBe(0.7);
    });

    it('calculates client performance loyalty milestone cashback vouchers (10%)', () => {
      const singleTx = calculateClientLoyaltyVoucher(1, 10000);
      expect(singleTx.eligible).toBe(false);
      expect(singleTx.cashbackAED).toBe(0);

      const repeatTx = calculateClientLoyaltyVoucher(3, 50000);
      expect(repeatTx.eligible).toBe(true);
      expect(repeatTx.cashbackAED).toBe(5000);
      expect(repeatTx.voucherCode).toMatch(/^LOYALTY-10-/);
    });
  });
});
