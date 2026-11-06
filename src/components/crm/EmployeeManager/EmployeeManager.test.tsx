// FILE: src/components/crm/EmployeeManager/EmployeeManager.test.tsx
/**
 * White Caves Real Estate LLC - Employee Manager Unit Tests
 * Standard: AEGIS 12-Way Co-Location Architecture Standard (Tests - Tier 6)
 * Single Purpose File Law: < 350 lines
 */

import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
import { EmployeeManagerFallback } from './EmployeeManager.fallback';
import { EmployeeTelemetry } from './EmployeeManager.telemetry';
import { getEmployeeI18n } from './EmployeeManager.i18n';
import {
  saveEmployeesCache,
  loadEmployeesCache,
  getEmployeeByTuringId,
  indexEmployeesInMemory,
} from './EmployeeManager.cache';
import { calculateEmployeeCompensationOffThread } from './EmployeeManager.workers';

describe('EmployeeManager 12-Way Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    indexEmployeesInMemory(INITIAL_EMPLOYEES_SEED);
    EmployeeTelemetry.clear();
  });

  // --- Tier 1 & 2: View and Logic Integration ---
  it('renders employee directory view with header, metrics, and cards', () => {
    render(<EmployeeManagerView />);

    expect(screen.getByTestId('employee-manager-view')).toBeInTheDocument();
    expect(screen.getByTestId('employee-metrics-row')).toBeInTheDocument();
    expect(screen.getByTestId('employee-cards-grid')).toBeInTheDocument();

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

    expect(screen.getByTestId('employee-card-EMP-002')).toBeInTheDocument();
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

  // --- Tier 7: Pure Employee Workflow Engine ---
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
    const result = executeDemoteEmployeeWorkflow(initial, 'emp-002', 'Transferred to reserve pool');

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

  // --- Tier 8: Failure Boundary ---
  it('renders EmployeeManagerFallback boundary with errorId and triggers onRetry', () => {
    const onRetry = vi.fn();
    const onNavigateBack = vi.fn();

    render(
      <EmployeeManagerFallback
        error="DLD Broker License Verification Gateway Offline"
        errorId="ERR-EMP-503"
        onRetry={onRetry}
        onNavigateBack={onNavigateBack}
      />
    );

    expect(screen.getByTestId('employee-manager-fallback')).toBeInTheDocument();
    expect(screen.getByText('ERR-EMP-503')).toBeInTheDocument();
    expect(
      screen.getByText(/DLD Broker License Verification Gateway Offline/i)
    ).toBeInTheDocument();

    const retryBtn = screen.getByTestId('employee-fallback-retry-btn');
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);

    const backBtn = screen.getByTestId('employee-fallback-back-btn');
    fireEvent.click(backBtn);
    expect(onNavigateBack).toHaveBeenCalledTimes(1);
  });

  // --- Tier 9: Real-Time State Attestations & Telemetry ---
  it('tracks employee telemetry events and delivers to queue with non-blocking dispatch', () => {
    EmployeeTelemetry.track('ROLE_ROTATION', {
      employeeCode: 'EMP-001',
      actorRole: 'MANAGING_DIRECTOR',
    });

    const events = EmployeeTelemetry.getRecentEvents();
    expect(events.length).toBeGreaterThan(0);
    const lastEvent = events[events.length - 1];
    expect(lastEvent.eventType).toBe('ROLE_ROTATION');
    expect(lastEvent.employeeCode).toBe('EMP-001');
  });

  // --- Tier 10: 4-Language Translation Schemas ---
  it('resolves 4-language i18n schemas with Arabic RTL compliance', () => {
    const arI18n = getEmployeeI18n('ar');
    expect(arI18n.dir).toBe('rtl');
    expect(arI18n.workspaceTitle).toContain('الموظفين');

    const enI18n = getEmployeeI18n('en');
    expect(enI18n.dir).toBe('ltr');
    expect(enI18n.workspaceTitle).toContain('Personnel');

    const esI18n = getEmployeeI18n('es');
    expect(esI18n.workspaceTitle).toContain('Personal');

    const ruI18n = getEmployeeI18n('ru');
    expect(ruI18n.workspaceTitle).toContain('Персонала');
  });

  // --- Tier 11: Localized State Persistence & O(1) Cache Lookup ---
  it('persists employees cache and provides O(1) lookups by Turing ID', () => {
    saveEmployeesCache(INITIAL_EMPLOYEES_SEED);
    const cached = loadEmployeesCache();
    expect(cached).toBeDefined();
    expect(cached?.length).toBe(INITIAL_EMPLOYEES_SEED.length);

    const lookupByCode = getEmployeeByTuringId('EMP-001');
    expect(lookupByCode).toBeDefined();
    expect(lookupByCode?.fullName).toBe('Sophia Al-Hashemi');

    const lookupById = getEmployeeByTuringId('emp-001');
    expect(lookupById?.employeeCode).toBe('EMP-001');
  });

  // --- Tier 12: Off-Thread Multi-Agent Background Computation ---
  it('calculates employee compensation and Law 9 temporal drift token off-thread', async () => {
    const result = await calculateEmployeeCompensationOffThread({
      employeeCode: 'EMP-004',
      dealsClosed: 12,
      totalVolumeAED: 25000000,
      meritXp: 3500,
    });

    expect(result.employeeCode).toBe('EMP-004');
    expect(result.commissionSplitRatio).toBe(0.7);
    expect(result.performanceTier).toBe('SOVEREIGN_PARTNER');
    expect(result.temporalAssignmentToken).toContain('ROLE-DRIFT-EMP-004');
    expect(result.meritBonusXpAwarded).toBe(500);
  });
});
