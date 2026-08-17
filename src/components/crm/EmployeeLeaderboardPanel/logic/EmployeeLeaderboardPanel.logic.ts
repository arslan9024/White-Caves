/**
 * EmployeeLeaderboardPanel.logic.ts — Hook & Logic Layer
 */

import { useState, useMemo } from 'react';
import companyLedger from '../../../../mocks/companyMasterLedger.json';

export type LedgerPersonnel = {
  id: string;
  name: string;
  email: string;
  roleTitle: string;
  assignedDepartment: string;
  accessLevel: number;
  commissionRule?: { agentSplit: number; companySplit: number };
};

export type LedgerDepartment = {
  id: string;
  num: string;
  name: string;
  icon: string;
  monthlyRevenueAED?: number;
  activeLeads?: number;
};

export function useEmployeeLeaderboardPanelLogic() {
  const departments = ((companyLedger as any).departments || []) as LedgerDepartment[];
  const personnel = ((companyLedger as any).personnel || []) as LedgerPersonnel[];

  const [activeDeptId, setActiveDeptId] = useState<string>(departments[0]?.id || 'sales');
  const [viewMode, setViewMode] = useState<'department' | 'global'>('department');

  const activeDept = useMemo(
    () => departments.find(d => d.id === activeDeptId),
    [departments, activeDeptId]
  );

  const deptStaff = useMemo(
    () =>
      personnel
        .filter(p => p.assignedDepartment === activeDeptId)
        .sort((a, b) => b.accessLevel - a.accessLevel),
    [personnel, activeDeptId]
  );

  const manager = useMemo(() => deptStaff.find(p => p.accessLevel === 4), [deptStaff]);
  const supervisors = useMemo(() => deptStaff.filter(p => p.accessLevel === 3), [deptStaff]);
  const juniors = useMemo(() => deptStaff.filter(p => p.accessLevel === 2), [deptStaff]);
  const interns = useMemo(() => deptStaff.filter(p => p.accessLevel === 1), [deptStaff]);

  const globalTopManagers = useMemo(
    () => personnel.filter(p => p.accessLevel === 4).slice(0, 12),
    [personnel]
  );

  return {
    departments,
    personnel,
    activeDeptId,
    setActiveDeptId,
    viewMode,
    setViewMode,
    activeDept,
    deptStaff,
    manager,
    supervisors,
    juniors,
    interns,
    globalTopManagers,
  };
}
