/**
 * FILE: .agents/aegis/protocols/leaderboardXpHooks.ts
 * White Caves Real Estate LLC — AEGIS V5.0 Gamified Leaderboard XP & RoleAssignment Hooks
 * Enforces:
 * - AEG-037: +500 XP citable reward on Statutory Gate Clearance to active StaffProfile
 * - AEG-038: Dynamic bonus commission split calculation (60% base -> 70% max ceiling)
 * - AEG-039: Isolated RoleAssignment join table records across 13 corporate floors
 */

export const STATUTORY_GATE_XP_REWARD = 500;
export const BASE_COMMISSION_SPLIT_PCT = 60.0;
export const MAX_COMMISSION_SPLIT_PCT = 70.0;
export const XP_PER_PERCENT_INCREMENT = 1000; // Every 1,000 XP (+2 statutory gates) adds +1% split up to +10% (70% cap)

export interface StaffXPState {
  staffProfileId: string;
  accumulatedXP: number;
  statutoryGatesCleared: number;
  baseCommissionSplitPct: number;
  dynamicBonusSplitPct: number;
}

export interface StatutoryClearanceAwardPayload {
  staffProfileId: string;
  taskRecordId?: string;
  citationReference: string;
  currentXP: number;
  currentGatesCleared: number;
}

export interface StatutoryClearanceMutationResult {
  xpDelta: number;
  previousTotalXP: number;
  newTotalXP: number;
  newStatutoryGatesCleared: number;
  resultingSplitPct: number;
  citationReference: string;
  eventTrigger: 'STATUTORY_GATE_CLEARANCE' | 'XP_THRESHOLD_MILESTONE';
}

/**
 * AEG-038: Maps accumulated experience metric points to dynamic bonus commission split calculations.
 * Scales smoothly in step milestones from a base 60% up to a strict 70% ceiling.
 */
export function calculateDynamicCommissionSplitPct(accumulatedXP: number): number {
  const safeXP = Math.max(0, Math.floor(accumulatedXP));
  const bonusIncrementPct = Math.floor(safeXP / XP_PER_PERCENT_INCREMENT);
  const rawSplit = BASE_COMMISSION_SPLIT_PCT + bonusIncrementPct;
  return Math.min(MAX_COMMISSION_SPLIT_PCT, Math.max(BASE_COMMISSION_SPLIT_PCT, rawSplit));
}

/**
 * AEG-037 & AEG-038: Computes the deterministic ledger mutation when a statutory gate is cleared (+500 XP).
 */
export function buildStatutoryGateXPReward(
  payload: StatutoryClearanceAwardPayload
): StatutoryClearanceMutationResult {
  const previousTotalXP = Math.max(0, payload.currentXP);
  const xpDelta = STATUTORY_GATE_XP_REWARD;
  const newTotalXP = previousTotalXP + xpDelta;
  const previousSplit = calculateDynamicCommissionSplitPct(previousTotalXP);
  const resultingSplitPct = calculateDynamicCommissionSplitPct(newTotalXP);

  const eventTrigger =
    resultingSplitPct > previousSplit ? 'XP_THRESHOLD_MILESTONE' : 'STATUTORY_GATE_CLEARANCE';

  return {
    xpDelta,
    previousTotalXP,
    newTotalXP,
    newStatutoryGatesCleared: payload.currentGatesCleared + 1,
    resultingSplitPct,
    citationReference: payload.citationReference,
    eventTrigger,
  };
}

/**
 * AEG-039: Builds a deterministic RoleAssignment floor-rotation record across the 13 corporate floors.
 */
export function buildFloorRoleAssignmentRecord(params: {
  userId: string;
  staffProfileId: string;
  departmentCode: string;
  roleName: string;
  operationalLevel: number;
  floorNumber: number;
  shiftDateIso: string;
}) {
  const clampedFloor = Math.min(13, Math.max(1, Math.floor(params.floorNumber)));
  const clampedLevel = Math.min(5, Math.max(1, Math.floor(params.operationalLevel)));
  const taskSignatureHash = `SIG-${params.departmentCode}-F${clampedFloor}-L${clampedLevel}-${params.userId}-${params.shiftDateIso}`;

  return {
    userId: params.userId,
    staffProfileId: params.staffProfileId,
    departmentCode: params.departmentCode,
    roleName: params.roleName,
    operationalLevel: clampedLevel,
    floorNumber: clampedFloor,
    shiftDate: new Date(params.shiftDateIso),
    shiftStart: '09:00',
    shiftEnd: '18:00',
    taskSignatureHash,
    isActiveRotation: true,
  };
}
