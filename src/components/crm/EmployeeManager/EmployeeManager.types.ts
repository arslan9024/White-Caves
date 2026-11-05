/**
 * EmployeeManager.types.ts
 * 7-Category Architecture: Config & Types Layer
 * Employee Management contracts separated from departmental slots
 */

export type RoleTier =
  | 'EXECUTIVE'
  | 'DIRECTOR'
  | 'MANAGER'
  | 'SUPERVISOR'
  | 'SPECIALIST'
  | 'BROKER';
export type EmployeeStatus = 'active' | 'onboarding' | 'probation' | 'leave' | 'standby';

export interface EmployeeNode {
  _id: string;
  employeeCode: string; // e.g. EMP-001
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  roleTier: RoleTier;
  designation: string;
  pillarId: string; // e.g. 'pillar-sales', 'pillar-legal'
  pillarName: string;
  departmentName: string;
  supervisorName: string;
  reportingManager: string;
  reraCardNumber?: string;
  reraExpiry?: string;
  status: EmployeeStatus;
  baseSalaryAED: number;
  commissionRatePct: number;
  skills: string[];
  joinedDate: string;
  dealsClosed?: number;
}

export interface EmployeeFilterState {
  searchQuery: string;
  selectedPillar: string;
  selectedRoleTier: string;
  selectedStatus: string;
}

export type EmployeeCrudAction =
  | { type: 'HIRE_EMPLOYEE'; payload: Omit<EmployeeNode, '_id' | 'employeeCode'> }
  | { type: 'UPDATE_EMPLOYEE'; id: string; payload: Partial<EmployeeNode> }
  | { type: 'DEMOTE_EMPLOYEE'; id: string; reason?: string }
  | { type: 'REASSIGN_EMPLOYEE'; id: string; targetPillarId: string; targetSupervisor: string };
