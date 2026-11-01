export interface VirtualStaffMember {
  id: string;
  name: string;
  gender: string;
  title: string;
  role: 'EXECUTIVE' | 'MANAGER' | 'SUPERVISOR' | 'SPECIALIST' | 'STANDBY';
  status: 'ACTIVE' | 'STANDBY' | 'DECOMMISSIONED';
  departmentCode?: string;
  departmentName?: string;
  supervisorSlot?: number | null;
  assignedTasks: string[];
  systemRole?: string;
  reportingTo?: string;
  color?: string;
  slaResponseTime?: string;
}

export interface DepartmentGroup {
  deptCode: string;
  deptName: string;
  color: string;
  manager: VirtualStaffMember;
  supervisors: VirtualStaffMember[];
  subDepartments?: {
    code: string;
    title: string;
    slug: string;
  }[];
}

