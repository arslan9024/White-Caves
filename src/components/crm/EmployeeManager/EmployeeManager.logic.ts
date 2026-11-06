// FILE: src/components/crm/EmployeeManager/EmployeeManager.logic.ts
/**
 * White Caves Real Estate LLC - Employee Management Logic
 * Standard: AEGIS Canonical 12-Way Architecture Standard (Logic - Tier 2)
 * Single Purpose File Law: < 350 lines
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { EmployeeNode } from './EmployeeManager.types';
import { INITIAL_EMPLOYEES_SEED, PILLARS_7 } from './EmployeeManager.data';
import { EmployeeTelemetry } from './EmployeeManager.telemetry';
import { loadEmployeesCache, saveEmployeesCache } from './EmployeeManager.cache';
import {
  executeHireEmployeeWorkflow,
  executeUpdateEmployeeWorkflow,
  executeDemoteEmployeeWorkflow,
  executeReassignEmployeeWorkflow,
} from './EmployeeManager.workflow';

export function useEmployeeManager() {
  const [employees, setEmployees] = useState<EmployeeNode[]>(() => {
    const cached = loadEmployeesCache();
    return cached && cached.length > 0 ? cached : INITIAL_EMPLOYEES_SEED;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [selectedRoleTier, setSelectedRoleTier] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [statusToast, setStatusToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    EmployeeTelemetry.track('MOUNT', { initialCount: employees.length });
  }, []);

  // Drawer / modal states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeNode | null>(null);

  const showStatus = useCallback((msg: string) => {
    setStatusToast(msg);
    setTimeout(() => setStatusToast(null), 4000);
  }, []);

  // CRUD Workflows dispatch
  const handleHireEmployee = useCallback(
    (payload: Omit<EmployeeNode, '_id' | 'employeeCode'>) => {
      setEmployees(prev => {
        const res = executeHireEmployeeWorkflow(prev, payload);
        showStatus(res.message);
        if (res.success) {
          saveEmployeesCache(res.employees);
          EmployeeTelemetry.track('HIRE', { meta: { fullName: payload.fullName } });
          return res.employees;
        }
        return prev;
      });
      setIsDrawerOpen(false);
    },
    [showStatus]
  );

  const handleUpdateEmployee = useCallback(
    (id: string, patch: Partial<EmployeeNode>) => {
      setEmployees(prev => {
        const res = executeUpdateEmployeeWorkflow(prev, id, patch);
        showStatus(res.message);
        if (res.success) {
          saveEmployeesCache(res.employees);
          EmployeeTelemetry.track('UPDATE', { meta: { id } });
          return res.employees;
        }
        return prev;
      });
      setIsDrawerOpen(false);
    },
    [showStatus]
  );

  const handleDemoteEmployee = useCallback(
    (id: string, reason?: string) => {
      setEmployees(prev => {
        const res = executeDemoteEmployeeWorkflow(prev, id, reason);
        showStatus(res.message);
        if (res.success) {
          saveEmployeesCache(res.employees);
          EmployeeTelemetry.track('ROLE_ROTATION', { meta: { id, reason } });
          return res.employees;
        }
        return prev;
      });
    },
    [showStatus]
  );

  const handleReassignEmployee = useCallback(
    (id: string, targetPillarId: string, targetPillarName: string, targetSupervisor: string) => {
      setEmployees(prev => {
        const res = executeReassignEmployeeWorkflow(
          prev,
          id,
          targetPillarId,
          targetPillarName,
          targetSupervisor
        );
        showStatus(res.message);
        if (res.success) {
          saveEmployeesCache(res.employees);
          EmployeeTelemetry.track('ROLE_ROTATION', { meta: { id, targetPillarId } });
          return res.employees;
        }
        return prev;
      });
    },
    [showStatus]
  );

  const handleOpenCreate = useCallback(() => {
    setEditingEmployee(null);
    setIsDrawerOpen(true);
  }, []);

  const handleOpenEdit = useCallback((employee: EmployeeNode) => {
    setEditingEmployee(employee);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setEditingEmployee(null);
  }, []);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      if (selectedPillar !== 'all' && emp.pillarId !== selectedPillar) return false;
      if (selectedRoleTier !== 'all' && emp.roleTier !== selectedRoleTier) return false;
      if (selectedStatus !== 'all' && emp.status !== selectedStatus) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        emp.fullName.toLowerCase().includes(q) ||
        emp.employeeCode.toLowerCase().includes(q) ||
        emp.designation.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        (emp.reraCardNumber && emp.reraCardNumber.toLowerCase().includes(q))
      );
    });
  }, [employees, searchQuery, selectedPillar, selectedRoleTier, selectedStatus]);

  // Key metrics
  const metrics = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(e => e.status === 'active').length;
    const directors = employees.filter(
      e => e.roleTier === 'DIRECTOR' || e.roleTier === 'EXECUTIVE'
    ).length;
    const brokers = employees.filter(e => e.roleTier === 'BROKER').length;
    return { total, active, directors, brokers };
  }, [employees]);

  return {
    employees,
    filteredEmployees,
    searchQuery,
    setSearchQuery,
    selectedPillar,
    setSelectedPillar,
    selectedRoleTier,
    setSelectedRoleTier,
    selectedStatus,
    setSelectedStatus,
    statusToast,
    error,
    setError,
    isDrawerOpen,
    editingEmployee,
    metrics,
    pillars: PILLARS_7,
    handleHireEmployee,
    handleUpdateEmployee,
    handleDemoteEmployee,
    handleReassignEmployee,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseDrawer,
  };
}

/**
 * Progressive Employee Commission Slab Formula (Bhakti Protocol)
 * AED 1 - 25,000       = 50%
 * AED 25,001 - 50,000  = 55%
 * AED 50,001 - 75,000  = 60%
 * AED 75,001 - 100,000 = 65%
 * AED 100,001+         = 70%
 */
export function calculateEmployeeCommissionSplit(grossCommissionAED: number): number {
  if (grossCommissionAED > 100000) return 0.7;
  if (grossCommissionAED > 75000) return 0.65;
  if (grossCommissionAED > 50000) return 0.6;
  if (grossCommissionAED > 25000) return 0.55;
  return 0.5;
}

/**
 * Client Performance Loyalty Milestone
 * Repeat clients (e.g. 3rd lease renewal or 2nd purchase) unlock 10% cashback voucher
 */
export function calculateClientLoyaltyVoucher(
  completedTransactions: number,
  serviceChargeOrCommissionAED: number
): { eligible: boolean; cashbackAED: number; voucherCode?: string } {
  if (completedTransactions >= 2) {
    return {
      eligible: true,
      cashbackAED: Math.round(serviceChargeOrCommissionAED * 0.1),
      voucherCode: `LOYALTY-10-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    };
  }
  return { eligible: false, cashbackAED: 0 };
}
