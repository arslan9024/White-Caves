/**
 * DepartmentHierarchy.workflow.ts
 * 7-Category Architecture: Workflow Engine Layer
 * Universal 4-Stage I-P-O-V (Input, Processing, Output, View Sync) Engine
 */

import type { SupervisorDef } from '../../../data/assistants108Registry.data';
import type {
  DepartmentDirectorNode,
  DivisionManagerNode,
  SupervisorTeamNode,
  Hierarchy3TierState,
  HierarchyTier,
} from './DepartmentHierarchy.types';
import {
  demoteDirectorToPool,
  demoteManagerToPool,
  demoteTeamToPool,
} from './DepartmentHierarchy.data';

export interface WorkflowResult<T = Hierarchy3TierState> {
  success: boolean;
  state: T;
  message: string;
}

/**
 * Stage 1-4 I-P-O-V: Swaps Director positions while locking slot numbers (1..12) and codes (DEPT-01..12)
 */
export function executeSwapDirectorSlotsWorkflow(
  state: Hierarchy3TierState,
  sourceSlot: number,
  targetSlot: number
): WorkflowResult {
  // 1. INPUT GUARD
  if (
    sourceSlot < 1 ||
    sourceSlot > 12 ||
    targetSlot < 1 ||
    targetSlot > 12 ||
    sourceSlot === targetSlot
  ) {
    return { success: false, state, message: 'Invalid Director slot coordinates.' };
  }

  // 2. PROCESSING (Bhakti Protocol Content Swap)
  const directors = [...state.directors];
  const sIdx = directors.findIndex(d => d.slotNumber === sourceSlot);
  const tIdx = directors.findIndex(d => d.slotNumber === targetSlot);

  if (sIdx === -1 || tIdx === -1) {
    return { success: false, state, message: 'One or both Director slots not found.' };
  }

  const sItem = directors[sIdx];
  const tItem = directors[tIdx];

  const targetFixedCode = tItem.fixedCode;
  const sourceFixedCode = sItem.fixedCode;

  directors[sIdx] = { ...tItem, slotNumber: sourceSlot, fixedCode: sourceFixedCode };
  directors[tIdx] = { ...sItem, slotNumber: targetSlot, fixedCode: targetFixedCode };

  // 3. OUTPUT & 4. VIEW SYNC PAYLOAD
  return {
    success: true,
    state: { ...state, directors },
    message: `Swapped Director mandates between Slot #${sourceSlot} (${sourceFixedCode}) and Slot #${targetSlot} (${targetFixedCode}).`,
  };
}

/**
 * Stage 1-4 I-P-O-V: Swaps Division Manager task positions while locking slot numbers (1..9) and codes (MGR-01..09)
 */
export function executeSwapManagerSlotsWorkflow(
  state: Hierarchy3TierState,
  deptId: string,
  sourceSlot: number,
  targetSlot: number
): WorkflowResult {
  // 1. INPUT GUARD
  if (
    sourceSlot < 1 ||
    sourceSlot > 9 ||
    targetSlot < 1 ||
    targetSlot > 9 ||
    sourceSlot === targetSlot
  ) {
    return { success: false, state, message: 'Invalid Division Manager slot coordinates.' };
  }

  const managers = state.managersByDeptId[deptId] ? [...state.managersByDeptId[deptId]] : [];
  const sIdx = managers.findIndex(m => m.slotNumber === sourceSlot);
  const tIdx = managers.findIndex(m => m.slotNumber === targetSlot);

  if (sIdx === -1 || tIdx === -1) {
    return { success: false, state, message: 'Manager slots not found in department.' };
  }

  // 2. PROCESSING
  const sItem = managers[sIdx];
  const tItem = managers[tIdx];
  const sourceFixedCode = sItem.fixedCode;
  const targetFixedCode = tItem.fixedCode;

  managers[sIdx] = { ...tItem, slotNumber: sourceSlot, fixedCode: sourceFixedCode };
  managers[tIdx] = { ...sItem, slotNumber: targetSlot, fixedCode: targetFixedCode };

  // 3. OUTPUT
  return {
    success: true,
    state: {
      ...state,
      managersByDeptId: { ...state.managersByDeptId, [deptId]: managers },
    },
    message: `Swapped Division Manager task domains between Slot #${sourceSlot} and Slot #${targetSlot}.`,
  };
}

/**
 * Stage 1-4 I-P-O-V: Zero-Delete Demotion Workflow
 * Shifts entity into the Unassigned Reserve Pool preserving all metadata.
 */
export function executeDemoteEntityWorkflow(
  state: Hierarchy3TierState,
  tier: HierarchyTier,
  entityId: string,
  parentDeptId?: string,
  parentManagerId?: string
): WorkflowResult {
  // 1. INPUT GUARD
  if (!entityId) return { success: false, state, message: 'Entity ID required for demotion.' };

  // 2. PROCESSING
  if (tier === 'DIRECTOR') {
    const target = state.directors.find(d => d._id === entityId);
    if (!target) return { success: false, state, message: 'Director not found.' };

    const poolUnit = demoteDirectorToPool(target);
    const updatedDirectors = state.directors.map(d =>
      d._id === entityId
        ? {
            ...d,
            title: `[Open Department Slot #${d.slotNumber}]`,
            directorName: 'Unassigned Lead',
            directorRole: 'Awaiting Director Appointment',
            description: 'Slot is open. Drag any unit from the Unassigned Pool to assign.',
          }
        : d
    );

    return {
      success: true,
      state: {
        ...state,
        directors: updatedDirectors,
        unassignedPool: [poolUnit, ...state.unassignedPool],
      },
      message: `Director ${target.directorName} demoted into Unassigned Reserve Pool.`,
    };
  }

  if (tier === 'MANAGER' && parentDeptId) {
    const managers = state.managersByDeptId[parentDeptId] || [];
    const target = managers.find(m => m._id === entityId);
    if (!target) return { success: false, state, message: 'Manager not found.' };

    const poolUnit = demoteManagerToPool(target);
    const updatedManagers = managers.map(m =>
      m._id === entityId
        ? {
            ...m,
            title: `[Open Division Mandate #${m.slotNumber}]`,
            managerName: 'Unassigned Division Manager',
            managerRole: 'Awaiting Assignment',
            description: 'Manager slot open. Drop squad from pool to assign.',
          }
        : m
    );

    return {
      success: true,
      state: {
        ...state,
        managersByDeptId: { ...state.managersByDeptId, [parentDeptId]: updatedManagers },
        unassignedPool: [poolUnit, ...state.unassignedPool],
      },
      message: `Division Manager ${target.managerName} demoted into Unassigned Reserve Pool.`,
    };
  }

  if (tier === 'SUPERVISOR' && parentManagerId) {
    const teams = state.teamsByManagerId[parentManagerId] || [];
    const target = teams.find(t => t._id === entityId);
    if (!target) return { success: false, state, message: 'Team/Supervisor not found.' };

    const poolUnit = demoteTeamToPool(target);
    const updatedTeams = teams.filter(t => t._id !== entityId);

    return {
      success: true,
      state: {
        ...state,
        teamsByManagerId: { ...state.teamsByManagerId, [parentManagerId]: updatedTeams },
        unassignedPool: [poolUnit, ...state.unassignedPool],
      },
      message: `Team ${target.teamName} (${target.supervisorName}) shifted into Unassigned Reserve Pool.`,
    };
  }

  return { success: false, state, message: 'Unhandled demotion tier.' };
}

/**
 * Stage 1-4 I-P-O-V: Promotes/Assigns a pool item into a target tier slot
 */
export function executeAssignPoolItemWorkflow(
  state: Hierarchy3TierState,
  tier: HierarchyTier,
  poolItemId: string,
  targetSlotNumber: number,
  parentDeptId?: string,
  parentManagerId?: string
): WorkflowResult {
  const poolItem = state.unassignedPool.find(p => p.id === poolItemId);
  if (!poolItem) return { success: false, state, message: 'Pool item not found.' };

  const updatedPool = state.unassignedPool.filter(p => p.id !== poolItemId);

  if (tier === 'DIRECTOR') {
    const directors = [...state.directors];
    const targetIdx = directors.findIndex(d => d.slotNumber === targetSlotNumber);
    if (targetIdx === -1)
      return { success: false, state, message: 'Target Director slot not found.' };

    const currentDirector = directors[targetIdx];
    let newPool = updatedPool;
    if (currentDirector.directorName !== 'Unassigned Lead') {
      newPool = [demoteDirectorToPool(currentDirector), ...newPool];
    }

    directors[targetIdx] = {
      ...currentDirector,
      title: poolItem.specialty || poolItem.title,
      directorName: poolItem.name,
      directorRole: poolItem.title,
      description: poolItem.description || currentDirector.description,
    };

    return {
      success: true,
      state: { ...state, directors, unassignedPool: newPool },
      message: `Assigned ${poolItem.name} as Director for Slot #${targetSlotNumber}.`,
    };
  }

  if (tier === 'MANAGER' && parentDeptId) {
    const managers = [...(state.managersByDeptId[parentDeptId] || [])];
    const targetIdx = managers.findIndex(m => m.slotNumber === targetSlotNumber);
    if (targetIdx === -1)
      return { success: false, state, message: 'Target Manager slot not found.' };

    const currentMgr = managers[targetIdx];
    let newPool = updatedPool;
    if (currentMgr.managerName !== 'Unassigned Division Manager') {
      newPool = [demoteManagerToPool(currentMgr), ...newPool];
    }

    managers[targetIdx] = {
      ...currentMgr,
      title: poolItem.specialty || currentMgr.title,
      managerName: poolItem.name,
      managerRole: poolItem.title,
      slaResponseTime: poolItem.slaResponseTime || '< 15 mins',
    };

    return {
      success: true,
      state: {
        ...state,
        managersByDeptId: { ...state.managersByDeptId, [parentDeptId]: managers },
        unassignedPool: newPool,
      },
      message: `Assigned ${poolItem.name} as Division Manager #${targetSlotNumber}.`,
    };
  }

  if (tier === 'SUPERVISOR' && parentDeptId && parentManagerId) {
    const teams = [...(state.teamsByManagerId[parentManagerId] || [])];
    const nextIndex = teams.length + 1;
    const newTeam: SupervisorTeamNode = {
      _id: `team-${parentManagerId}-assigned-${Date.now()}`,
      parentDeptId,
      parentManagerId,
      teamCode: `TEAM-${String(nextIndex).padStart(2, '0')}`,
      supervisorCode: `SUP-${String(nextIndex).padStart(2, '0')}`,
      teamName: poolItem.specialty || `${poolItem.name} Unit`,
      supervisorName: poolItem.name,
      supervisorRole: poolItem.title,
      specialty: poolItem.specialty || 'Operational Execution',
      capabilities: poolItem.capabilities || ['Execution', 'SLA Watch'],
      headcount: 2,
      status: 'optimal',
      slaResponseTime: poolItem.slaResponseTime || '< 15 mins',
      metrics: { accuracyRate: 99.8, tasksCompletedToday: 0 },
    };

    return {
      success: true,
      state: {
        ...state,
        teamsByManagerId: { ...state.teamsByManagerId, [parentManagerId]: [...teams, newTeam] },
        unassignedPool: updatedPool,
      },
      message: `Assigned ${poolItem.name} as Supervisor for ${newTeam.teamName}.`,
    };
  }

  return { success: false, state, message: 'Unhandled assignment tier.' };
}

/**
 * Stage 1-4 I-P-O-V: Reassigns an operational team from one Division Manager to another
 */
export function executeReassignTeamWorkflow(
  state: Hierarchy3TierState,
  teamId: string,
  sourceManagerId: string,
  targetManagerId: string
): WorkflowResult {
  const sourceTeams = state.teamsByManagerId[sourceManagerId] || [];
  const team = sourceTeams.find(t => t._id === teamId);
  if (!team) return { success: false, state, message: 'Team not found under source manager.' };

  const updatedSourceTeams = sourceTeams.filter(t => t._id !== teamId);
  const targetTeams = state.teamsByManagerId[targetManagerId] || [];
  const reassignedTeam: SupervisorTeamNode = { ...team, parentManagerId: targetManagerId };

  return {
    success: true,
    state: {
      ...state,
      teamsByManagerId: {
        ...state.teamsByManagerId,
        [sourceManagerId]: updatedSourceTeams,
        [targetManagerId]: [...targetTeams, reassignedTeam],
      },
    },
    message: `Reassigned ${team.teamName} to new Division Manager.`,
  };
}
