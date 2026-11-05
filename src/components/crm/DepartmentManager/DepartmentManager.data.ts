import {
  CORPORATE_DEPARTMENTS_12,
  SUPERVISORS_108,
  type SupervisorDef,
} from '../../../data/assistants108Registry.data';
import type { DepartmentNodeItem } from './DepartmentManager.types';
import { RESEARCHED_ORGANIZATION_POOL } from './DepartmentResearchedPool.data';

export interface DepartmentSlotDef {
  slotIndex: number; // 0 to 11
  slotNumber: number; // 1 to 12
  fixedCode: string; // DEPT-01 to DEPT-12
  dept: DepartmentNodeItem | null;
}

export const FALLBACK_12_DEPARTMENTS: DepartmentNodeItem[] = CORPORATE_DEPARTMENTS_12.map(
  (dept, idx) => ({
    _id: `canonical-${dept.id}`,
    code: `DEPT-${String(idx + 1).padStart(2, '0')}`,
    slug: dept.id,
    title: dept.name,
    level: 'DEPARTMENT',
    order: idx + 1,
    color: dept.color,
    icon: dept.icon,
    description: dept.description,
    subDeptsCount: 9,
    squadsCount: 9,
    headcount: 18,
    directorOrManagerId: {
      fullName: dept.managerAi.name,
      role: dept.managerAi.title,
    },
  })
);

/**
 * Builds the canonical 12 department slots.
 * Guarantees exactly 12 fixed slots regardless of how many departments are currently active.
 */
export function buildFixed12Slots(departments: DepartmentNodeItem[]): DepartmentSlotDef[] {
  return Array.from({ length: 12 }, (_, i) => {
    const slotNumber = i + 1;
    const fixedCode = `DEPT-${String(slotNumber).padStart(2, '0')}`;
    const matchedDept = departments[i]
      ? { ...departments[i], order: slotNumber, code: fixedCode }
      : null;

    return {
      slotIndex: i,
      slotNumber,
      fixedCode,
      dept: matchedDept,
    };
  });
}

export function getDepartmentSubItems(deptSlugOrId: string): SupervisorDef[] {
  const normalized = deptSlugOrId.replace(/^canonical-/, '').toLowerCase();
  const matched = SUPERVISORS_108.filter(
    s =>
      s.departmentId.toLowerCase() === normalized ||
      s.departmentName.toLowerCase().includes(normalized)
  );

  if (matched.length > 0) {
    return matched.slice(0, 9).map((sup, idx) => ({
      ...sup,
      code: `SQ-${String(idx + 1).padStart(2, '0')}`,
      supervisorIndex: idx + 1,
    }));
  }

  // Fallback 9 squads generator if customized department
  return Array.from({ length: 9 }, (_, i) => ({
    id: `${normalized}-squad-${i + 1}`,
    name: `Squad ${i + 1} Specialist`,
    code: `SQ-${String(i + 1).padStart(2, '0')}`,
    title: `Level 3 Operational Unit ${i + 1}`,
    departmentId: normalized,
    departmentName: deptSlugOrId,
    supervisorIndex: i + 1,
    icon: 'Shield',
    color: '#EF4444',
    avatar: '',
    status: 'optimal' as const,
    description: `Dedicated statutory squad operating under the 1-12-108 Protocol for ${deptSlugOrId}.`,
    specialty: 'High-Velocity Execution & Verification',
    assignedTasks: [
      'Statutory verification & DLD logging',
      'Escrow compliance check',
      'Autonomous task dispatch',
    ],
    capabilities: ['RERA Audit', 'Transaction Logging', 'SLA Monitoring'],
    slaResponseTime: '< 15 mins',
    metrics: {
      accuracyRate: 99.8,
      tasksCompletedToday: 14 + i * 2,
      systemHealth: 'optimal' as const,
    },
  }));
}

export function getUnassignedSquadPool(): SupervisorDef[] {
  return [
    ...RESEARCHED_ORGANIZATION_POOL,
    {
      id: 'pool-squad-reserve-01',
      name: 'AI Tariq Reserve',
      code: 'RES-01',
      title: 'Floating Escrow Compliance Auditor',
      departmentId: 'unassigned-pool',
      departmentName: 'Unassigned Operational Pool',
      supervisorIndex: 0,
      icon: 'Shield',
      color: '#64748B',
      avatar: '',
      status: 'standby' as const,
      description: 'Reserve compliance specialist available for dynamic departmental reassignment.',
      specialty: 'Cross-Department Escrow & Statutory Audits',
      assignedTasks: ['Unallocated', 'Awaiting Department Deployment'],
      capabilities: ['RERA Compliance', 'Trustee Verification'],
      slaResponseTime: '< 15 mins',
      metrics: { accuracyRate: 99.9, tasksCompletedToday: 0, systemHealth: 'optimal' as const },
    },
    {
      id: 'pool-squad-reserve-02',
      name: 'AI Zainab Reserve',
      code: 'RES-02',
      title: 'Floating High-Net-Worth Deal Matcher',
      departmentId: 'unassigned-pool',
      departmentName: 'Unassigned Operational Pool',
      supervisorIndex: 0,
      icon: 'Briefcase',
      color: '#64748B',
      avatar: '',
      status: 'standby' as const,
      description:
        'Reserve transaction manager on standby for surge deal flow and off-plan launches.',
      specialty: 'High-Velocity Capital Matching',
      assignedTasks: ['Standby Pool', 'Ready for Assignment'],
      capabilities: ['Investor Profiling', 'Contract Fast-Path'],
      slaResponseTime: '< 15 mins',
      metrics: { accuracyRate: 99.7, tasksCompletedToday: 0, systemHealth: 'optimal' as const },
    },
    {
      id: 'pool-squad-reserve-03',
      name: 'AI Faisal Reserve',
      code: 'RES-03',
      title: 'Floating Title Deed & NOC Inspector',
      departmentId: 'unassigned-pool',
      departmentName: 'Unassigned Operational Pool',
      supervisorIndex: 0,
      icon: 'CheckCircle',
      color: '#64748B',
      avatar: '',
      status: 'standby' as const,
      description: 'Reserve conveyancing operator specialized in DLD title transfer validation.',
      specialty: 'DLD Title Deed Screening & NOC QC',
      assignedTasks: ['Standby Pool', 'Available for Transfer'],
      capabilities: ['DLD Systems Integration', 'NOC Verification'],
      slaResponseTime: '< 15 mins',
      metrics: { accuracyRate: 99.8, tasksCompletedToday: 0, systemHealth: 'optimal' as const },
    },
  ];
}

/**
 * Converts a top-level corporate department into a Sub-Department / Operational Squad
 * preserving all content, identity, director, and operational mandate.
 */
export function convertDepartmentToSubDept(dept: DepartmentNodeItem): SupervisorDef {
  const codeSuffix = dept.code.replace(/^DEPT-/, '');
  return {
    id: `sub-from-dept-${dept.slug || dept._id}`,
    name: dept.directorOrManagerId?.fullName || `${dept.title} Director Lead`,
    code: `SUB-${codeSuffix}`,
    title: `${dept.title} Sub-Department`,
    departmentId: 'unassigned-pool',
    departmentName: 'Unassigned Operational Pool',
    supervisorIndex: 0,
    icon: dept.icon || 'Briefcase',
    color: dept.color || '#64748B',
    avatar: '',
    status: 'standby' as const,
    description:
      dept.description || 'Preserved operational unit converted from Corporate Department tier.',
    specialty: dept.title,
    assignedTasks: [
      'Preserved department mandate & operational scope',
      'Standby in unassigned pool for squad-level deployment',
    ],
    capabilities: ['Autonomous Execution', 'Statutory SLA Watch'],
    slaResponseTime: '< 15 mins',
    metrics: {
      accuracyRate: 99.8,
      tasksCompletedToday: 12,
      systemHealth: 'optimal' as const,
    },
  };
}

/**
 * Promotes an unassigned Sub-Department unit into a top-level Corporate Department
 */
export function convertSubDeptToDepartment(
  sub: SupervisorDef,
  slotOrder: number
): DepartmentNodeItem {
  const fixedCode = `DEPT-${String(slotOrder).padStart(2, '0')}`;
  return {
    _id: `dept-promoted-${sub.id}-${Date.now()}`,
    code: fixedCode,
    slug: sub.specialty
      ? sub.specialty
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : `promoted-${sub.id}`,
    title: sub.specialty || sub.title.replace(/ Sub-(Department|Unit)$/, ''),
    level: 'DEPARTMENT',
    order: slotOrder,
    color: sub.color || '#EF4444',
    icon: sub.icon || 'Briefcase',
    description: sub.description,
    subDeptsCount: 9,
    squadsCount: 9,
    headcount: 18,
    directorOrManagerId: {
      fullName: sub.name,
      role: sub.title,
    },
  };
}

/**
 * Enforces exactly 9 active sub-departments per department.
 * Any count beyond 9 is shifted down to the unassigned pool.
 */
export function enforceMaxNineSubDepts(subDepts: SupervisorDef[]): {
  active: SupervisorDef[];
  overflow: SupervisorDef[];
} {
  const active = subDepts.slice(0, 9).map((s, idx) => ({
    ...s,
    code: `SQ-${String(idx + 1).padStart(2, '0')}`,
    supervisorIndex: idx + 1,
  }));
  const overflow = subDepts.slice(9).map(s => ({
    ...s,
    departmentId: 'unassigned-pool',
    departmentName: 'Unassigned Operational Pool',
    status: 'standby' as const,
    supervisorIndex: 0,
  }));

  return { active, overflow };
}
