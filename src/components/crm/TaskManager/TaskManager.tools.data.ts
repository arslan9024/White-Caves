/**
 * TaskManager.tools.data.ts
 * White Caves Real Estate LLC - Operational Tool Tasks Catalog
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Data Layer)
 * Single Purpose File Law: < 350 lines
 * Lineage: [DEPT-xx] -> [SUB-xx] -> [SQD-xx] -> [SUP-xx] -> [TEAM-xx]
 * Protocol: Rational Unified Process (RUP) Use Case Specifications
 */

import type { TaskNode } from './TaskManager.types';
import { BASE_OPERATIONAL_TASKS } from './TaskManager.base.data';
import { RUP_OPERATIONAL_TASKS } from './TaskManager.rup.data';

export const ALL_RAW_OPERATIONAL_TASKS = [...BASE_OPERATIONAL_TASKS, ...RUP_OPERATIONAL_TASKS];

import { CORPORATE_DEPARTMENTS_12 } from '../../../data/assistants108Registry.data';

export const OPERATIONAL_TOOL_TASKS: TaskNode[] = ALL_RAW_OPERATIONAL_TASKS.map((t, idx) => {
  const deptNum = (idx % 12) + 1;
  const canonicalDept = CORPORATE_DEPARTMENTS_12[deptNum - 1];
  const subDeptNum = (idx % 9) + 1;
  const squadNum = (idx % 12) + 1;
  const supNum = (idx % 12) + 1;

  return {
    ...t,
    actor: 'Managing Director Arslan Malik Bashir Ahmad (EMP-001)',
    action: `Execute automated tool pipeline: ${t.title}`,
    results: `Verified output artifact and telemetry log generated for ${t.taskCode}`,
    lineage: {
      deptId: canonicalDept?.code || `DEPT-${String(deptNum).padStart(2, '0')}`,
      deptName: canonicalDept?.name || `Department ${deptNum}`,
      directorId: `DIR-${String(deptNum).padStart(2, '0')}`,
      directorName: canonicalDept?.managerAi?.name || t.reportingChain.directorName,
      subDeptId: `SUB-${String(subDeptNum).padStart(2, '0')}`,
      subDeptName: `Sub-Department ${subDeptNum}`,
      managerId: `MGR-${String(subDeptNum).padStart(2, '0')}`,
      managerName: t.reportingChain.managerName,
      squadId: `SQD-${String(squadNum).padStart(2, '0')}`,
      squadName: `Squad ${squadNum}`,
      supervisorId: `SUP-${String(supNum).padStart(2, '0')}`,
      supervisorName: t.reportingChain.supervisorName,
      teamId: `TEAM-${String((idx % 4) + 1).padStart(2, '0')}`,
      teamName: `Team ${(idx % 4) + 1}`,
      isUnassignedPool: false,
    },
    useCase: {
      useCaseId: `UC-${t.taskCode}`,
      primaryActor: 'Managing Director Arslan Malik Bashir Ahmad (EMP-001)',
      secondaryActors: [t.statutoryAuthority || 'Dubai Land Department (DLD)'],
      preconditions: [
        'Actor authenticated with L0/Managing Director authority',
        `Required payload credentials initialized for ${t.taskCode}`,
      ],
      trigger: `Direct execution trigger from Executive Explorer for ${t.title}`,
      mainSuccessScenario: {
        input: `Collected parameters and verified credentials for ${t.taskCode}`,
        processing: `Executed statutory validation and verified signature for ${t.title}`,
        output: `Generated output document and cryptographic compliance receipt`,
        persistence: `Persisted state to master company ledger and awarded merit XP`,
      },
      postconditions: [
        `Task status transitioned to COMPLETED`,
        `Telemetry emitted to live right-sidebar feed`,
      ],
      statutoryMandate: t.statutoryAuthority || 'White Caves Real Estate LLC Standard SOP',
    },
  };
});
