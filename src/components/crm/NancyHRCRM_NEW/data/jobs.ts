/**
 * jobs.ts
 * White Caves Real Estate LLC — 1-12-108 Bhakti Recursive Engine Job Matrix
 * Protocol: Leader (1 MD) -> 12 Tier 1 Directors -> 108 Tier 2 Managers (9/Dir)
 * -> 1,296 Tier 3 Supervisors (12/Mgr) -> 11,664 Tier 4 Team Leaders (9/Sup)
 * Single Purpose File Law: < 350 lines
 */

import { CORPORATE_DEPARTMENTS_12, SUPERVISORS_108 } from '../../../../data/assistants108Registry.data.ts';

export type JobTier = 'DIRECTOR' | 'MANAGER' | 'SUPERVISOR' | 'TEAM_LEADER' | 'SPECIALIST';

export interface Job {
  id: string;
  title: string;
  department: string;
  departmentCode: string;
  tier: JobTier;
  location: string;
  type: string;
  salary: string;
  status: string;
  applicants: number;
  shortlisted: number;
  interviewed: number;
  posted: string;
  deadline: string;
  requirements: string[];
  openSlotsQuota: number;
}

/**
 * 12 Tier 1 Corporate Director Open Requisitions
 */
function buildDirectorJobs(): Job[] {
  return CORPORATE_DEPARTMENTS_12.map((dept, idx) => ({
    id: `JOB-DIR-${dept.code}`,
    title: `Director of ${dept.name}`,
    department: dept.name,
    departmentCode: dept.code,
    tier: 'DIRECTOR',
    location: `Headquarters Floor ${String(idx + 1).padStart(2, '0')}, Dubai`,
    type: 'Full-time',
    salary: '45,000 - 65,000 AED + Executive Bonus',
    status: 'open',
    applicants: 12 + ((idx * 3) % 19),
    shortlisted: 3,
    interviewed: 1,
    posted: '2026-11-01',
    deadline: '2026-12-31',
    requirements: [
      '10+ years executive leadership in Dubai Real Estate / Corporate Enterprise',
      'Proven track record leading 9 operational squad managers',
      'Full statutory compliance with DLD, RERA and UAE corporate governance',
      'Bhakti 1-12-108 Protocol fluency and high-velocity management',
    ],
    openSlotsQuota: 1,
  }));
}

/**
 * 108 Tier 2 Division Manager Open Requisitions (9 per department)
 */
function buildManagerJobs(): Job[] {
  return SUPERVISORS_108.map((sup, idx) => {
    const deptSlot = CORPORATE_DEPARTMENTS_12.find(d => d.id === sup.departmentId);
    const deptCode = deptSlot?.code || 'DEPT-00';
    return {
      id: `JOB-MGR-${deptCode}-${String(sup.supervisorIndex).padStart(2, '0')}`,
      title: `${sup.title} (Division Manager)`,
      department: sup.departmentName,
      departmentCode: deptCode,
      tier: 'MANAGER',
      location: 'Dubai Headquarters / Hybrid',
      type: 'Full-time',
      salary: '22,000 - 35,000 AED + Commission Overrides',
      status: 'open',
      applicants: 18 + ((idx * 5) % 31),
      shortlisted: 4,
      interviewed: 2,
      posted: '2026-11-05',
      deadline: '2026-12-31',
      requirements: [
        `5+ years proven domain expertise in ${sup.specialty}`,
        'Active UAE driving license and verified RERA / professional accreditation',
        'Direct supervision and execution with < 15-minute SLA responsiveness',
        `Autonomous mastery of core division responsibilities: ${sup.assignedTasks.slice(0, 2).join(', ')}`,
      ],
      openSlotsQuota: 1,
    };
  });
}

/**
 * Tier 3 Operational Supervisor Requisitions (12 per Manager = 1,296 Capacity)
 */
function buildSupervisorRequisitions(): Job[] {
  return CORPORATE_DEPARTMENTS_12.map(dept => ({
    id: `JOB-REQ-SUP-${dept.code}`,
    title: `${dept.name} — Operational Squad Supervisor`,
    department: dept.name,
    departmentCode: dept.code,
    tier: 'SUPERVISOR',
    location: 'Dubai Operational Floor & Site Hubs',
    type: 'Full-time',
    salary: '14,000 - 20,000 AED',
    status: 'open',
    applicants: 144,
    shortlisted: 28,
    interviewed: 12,
    posted: '2026-11-08',
    deadline: '2026-12-31',
    requirements: [
      '3+ years hands-on real estate operational or technical domain experience',
      'Reporting directly to Division Manager within the 1-12-108 Bhakti framework',
      'Rigorous execution of daily inspection, escrow, lead, or compliance work orders',
    ],
    openSlotsQuota: 108, // 108 per department = 1,296 company-wide
  }));
}

/**
 * Tier 4 Team Leader Requisitions (9 per Supervisor = 11,664 Capacity)
 */
function buildTeamLeaderRequisitions(): Job[] {
  return CORPORATE_DEPARTMENTS_12.map(dept => ({
    id: `JOB-REQ-TL-${dept.code}`,
    title: `${dept.name} — Frontline Team Leader`,
    department: dept.name,
    departmentCode: dept.code,
    tier: 'TEAM_LEADER',
    location: 'Dubai Operations & Field Teams',
    type: 'Full-time',
    salary: '9,000 - 13,000 AED + Performance Bonus',
    status: 'open',
    applicants: 420,
    shortlisted: 85,
    interviewed: 30,
    posted: '2026-11-08',
    deadline: '2026-12-31',
    requirements: [
      'Demonstrated leadership in field operations, client servicing, or technical workflows',
      'Daily squad velocity monitoring and junior personnel coaching',
    ],
    openSlotsQuota: 972, // 972 per department = 11,664 company-wide
  }));
}

export const OPEN_DIRECTOR_JOBS: Job[] = buildDirectorJobs();
export const OPEN_MANAGER_JOBS: Job[] = buildManagerJobs();
export const OPEN_SUPERVISOR_JOBS: Job[] = buildSupervisorRequisitions();
export const OPEN_TEAM_LEADER_JOBS: Job[] = buildTeamLeaderRequisitions();

export const DUMMY_JOBS: Job[] = [
  ...OPEN_DIRECTOR_JOBS,
  ...OPEN_MANAGER_JOBS,
  ...OPEN_SUPERVISOR_JOBS,
  ...OPEN_TEAM_LEADER_JOBS,
];

export const BHAKTI_RECURSIVE_CAPACITY = {
  tier0_MD: { label: 'Managing Director (Penthouse)', count: 1, multiplier: 1 },
  tier1_Directors: { label: 'Department Directors', count: 12, multiplier: 12 },
  tier2_Managers: { label: 'Division Managers (9 per Dir)', count: 108, multiplier: 9 },
  tier3_Supervisors: { label: 'Operational Supervisors (12 per Mgr)', count: 1296, multiplier: 12 },
  tier4_TeamLeaders: { label: 'Frontline Team Leaders (9 per Sup)', count: 11664, multiplier: 9 },
  totalActiveRequisitions: DUMMY_JOBS.length, // 12 + 108 + 12 + 12 = 144 master requisitions
  totalAuthorizedSlots: 1 + 12 + 108 + 1296 + 11664, // 13,081 total enterprise seats
};
