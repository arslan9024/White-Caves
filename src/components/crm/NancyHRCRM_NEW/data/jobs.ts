/**
 * jobs.ts
 * White Caves Real Estate LLC — 1-12-108 Bhakti Protocol Open Job Postings
 * Standard: 12 Open Director Positions + 108 Open Manager Positions (120 Openings)
 * Single Purpose File Law: < 350 lines
 */

import { CORPORATE_DEPARTMENTS_12, SUPERVISORS_108 } from '../../../../data/assistants108Registry.data';

export interface Job {
  id: string;
  title: string;
  department: string;
  departmentCode: string;
  tier: 'DIRECTOR' | 'MANAGER';
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
}

/**
 * Generates the canonical 12 Director Open Positions across all 12 corporate floors.
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
  }));
}

/**
 * Generates the canonical 108 Manager Open Positions (9 per department).
 */
function buildManagerJobs(): Job[] {
  return SUPERVISORS_108.map((sup, idx) => {
    const deptSlot = CORPORATE_DEPARTMENTS_12.find(d => d.id === sup.departmentId);
    const deptCode = deptSlot?.code || 'DEPT-00';
    return {
      id: `JOB-MGR-${deptCode}-${String(sup.supervisorIndex).padStart(2, '0')}`,
      title: `${sup.title} (Manager)`,
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
    };
  });
}

export const OPEN_DIRECTOR_JOBS: Job[] = buildDirectorJobs();
export const OPEN_MANAGER_JOBS: Job[] = buildManagerJobs();

export const DUMMY_JOBS: Job[] = [
  ...OPEN_DIRECTOR_JOBS,
  ...OPEN_MANAGER_JOBS,
];

export const TOTAL_OPEN_HEADCOUNT = {
  directors: OPEN_DIRECTOR_JOBS.length, // 12
  managers: OPEN_MANAGER_JOBS.length,   // 108
  total: OPEN_DIRECTOR_JOBS.length + OPEN_MANAGER_JOBS.length, // 120
};
