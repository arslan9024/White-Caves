// FILE: src/components/crm/EmployeeManager/EmployeeManager.workflow.ts
/**
 * White Caves Real Estate LLC - Employee Management Workflows
 * Standard: AEGIS Canonical 12-Way Architecture Standard (Workflow - Tier 7)
 * Single Purpose File Law: < 350 lines
 */

import type { EmployeeNode } from './EmployeeManager.types';

export interface EmployeeWorkflowResult {
  success: boolean;
  employees: EmployeeNode[];
  message: string;
}

/**
 * Stage 1-4 I-P-O-V: Hire / Register new employee
 */
export function executeHireEmployeeWorkflow(
  employees: EmployeeNode[],
  payload: Omit<EmployeeNode, '_id' | 'employeeCode'>
): EmployeeWorkflowResult {
  // 1. INPUT GUARD
  if (!payload.fullName?.trim() || !payload.email?.trim()) {
    return { success: false, employees, message: 'Full name and email are mandatory.' };
  }

  // 2. PROCESSING
  const nextNum = employees.length + 1;
  const newCode = `EMP-${String(nextNum).padStart(3, '0')}`;
  const newEmployee: EmployeeNode = {
    ...payload,
    _id: `emp-auto-${Date.now()}`,
    employeeCode: newCode,
    status: payload.status || 'onboarding',
    joinedDate: payload.joinedDate || new Date().toISOString().split('T')[0],
  };

  // 3. OUTPUT & 4. VIEW SYNC
  return {
    success: true,
    employees: [newEmployee, ...employees],
    message: `Employee ${newEmployee.fullName} successfully onboarded as ${newEmployee.designation} (${newCode}).`,
  };
}

/**
 * Stage 1-4 I-P-O-V: Update employee record
 */
export function executeUpdateEmployeeWorkflow(
  employees: EmployeeNode[],
  id: string,
  patch: Partial<EmployeeNode>
): EmployeeWorkflowResult {
  if (!id) return { success: false, employees, message: 'Employee ID required for update.' };

  const idx = employees.findIndex(e => e._id === id);
  if (idx === -1) return { success: false, employees, message: 'Employee not found.' };

  const updatedEmployees = [...employees];
  updatedEmployees[idx] = { ...updatedEmployees[idx], ...patch };

  return {
    success: true,
    employees: updatedEmployees,
    message: `Updated profile for ${updatedEmployees[idx].fullName} (${updatedEmployees[idx].employeeCode}).`,
  };
}

/**
 * Stage 1-4 I-P-O-V: Demote/Transfer employee to Standby Reserve Pool (Zero-Delete)
 */
export function executeDemoteEmployeeWorkflow(
  employees: EmployeeNode[],
  id: string,
  reason: string = 'Moved to reserve talent pool'
): EmployeeWorkflowResult {
  if (!id)
    return { success: false, employees, message: 'Employee ID required for status transition.' };

  const target = employees.find(e => e._id === id);
  if (!target) return { success: false, employees, message: 'Employee record not found.' };

  const updated = employees.map(e =>
    e._id === id
      ? { ...e, status: 'standby' as const, designation: `[Standby Reserve] ${e.designation}` }
      : e
  );

  return {
    success: true,
    employees: updated,
    message: `Employee ${target.fullName} shifted to Standby Reserve. Reason: ${reason}.`,
  };
}

/**
 * Stage 1-4 I-P-O-V: Reassign Pillar or Supervisor
 */
export function executeReassignEmployeeWorkflow(
  employees: EmployeeNode[],
  id: string,
  targetPillarId: string,
  targetPillarName: string,
  targetSupervisor: string
): EmployeeWorkflowResult {
  if (!id || !targetPillarId)
    return { success: false, employees, message: 'ID and target pillar required.' };

  const target = employees.find(e => e._id === id);
  if (!target) return { success: false, employees, message: 'Employee not found.' };

  const updated = employees.map(e =>
    e._id === id
      ? {
          ...e,
          pillarId: targetPillarId,
          pillarName: targetPillarName,
          supervisorName: targetSupervisor,
          reportingManager: targetSupervisor,
        }
      : e
  );

  return {
    success: true,
    employees: updated,
    message: `Reassigned ${target.fullName} to ${targetPillarName} under supervisor ${targetSupervisor}.`,
  };
}
