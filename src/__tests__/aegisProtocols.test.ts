import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  AEGIS_PROTOCOL_FILES,
  turingOrchestrator,
} from '../../.agents/aegis/core-loop/turingOrchestrator';
import {
  buildFloorRoleAssignmentRecord,
  buildStatutoryGateXPReward,
  calculateDynamicCommissionSplitPct,
} from '../../.agents/aegis/protocols/leaderboardXpHooks';

describe('AEGIS V5.0 5-File Protocol Matrices & Leaderboard XP Hooks (.agents/aegis)', () => {
  it('verifies all 5 protocol CSV files exist in .agents/aegis/protocols with standardized line-1 file headers and AEG-001..AEG-042 rules', () => {
    const foundRuleIds: string[] = [];

    for (const relPath of AEGIS_PROTOCOL_FILES) {
      const fullPath = path.resolve(process.cwd(), relPath);
      expect(fs.existsSync(fullPath)).toBe(true);

      const content = fs.readFileSync(fullPath, 'utf-8').trim();
      const lines = content.split(/\r?\n/);

      expect(lines[0]).toBe(`// FILE: ${relPath}`);
      expect(lines[1]).toBe(
        'Rule_ID,Department_Code,Orchestration_Domain,Rule_Definition,Execution_Trigger,Validation_Criteria,Verification_File'
      );

      for (let i = 2; i < lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols[0]?.startsWith('AEG-')) {
          foundRuleIds.push(cols[0]);
        }
      }
    }

    expect(foundRuleIds).toHaveLength(42);
    expect(foundRuleIds[0]).toBe('AEG-001');
    expect(foundRuleIds[41]).toBe('AEG-042');
  });

  it('enforces AEG-012 idempotent submission tracking and drops duplicate submissions', () => {
    const first = turingOrchestrator.registerIdempotentSubmission('EJARI', 'LEASE-9001', {
      contractNumber: 'EJ-2026-9001',
    });
    expect(first.accepted).toBe(true);
    expect(first.envelope.idempotencyKey).toBe('AEG-EJARI-LEASE-9001');

    const duplicate = turingOrchestrator.registerIdempotentSubmission('EJARI', 'LEASE-9001', {
      contractNumber: 'EJ-2026-9001',
    });
    expect(duplicate.accepted).toBe(false);
  });

  it('enforces AEG-003 & AEG-041 Context Triad boundaries', () => {
    const validTriad = turingOrchestrator.validateContextTriad([
      'ThemeContext',
      'LanguageContext',
      'CurrencyContext',
    ]);
    expect(validTriad.valid).toBe(true);

    const invalidContext = turingOrchestrator.validateContextTriad([
      'ThemeContext',
      'DealsTransactionContext',
    ]);
    expect(invalidContext.valid).toBe(false);
    expect(invalidContext.unauthorized).toContain('DealsTransactionContext');
  });

  it('calculates AEG-037 (+500 XP) and AEG-038 (60% to 70% dynamic split) accurately', () => {
    expect(calculateDynamicCommissionSplitPct(0)).toBe(60);
    expect(calculateDynamicCommissionSplitPct(500)).toBe(60);
    expect(calculateDynamicCommissionSplitPct(1000)).toBe(61);
    expect(calculateDynamicCommissionSplitPct(5000)).toBe(65);
    expect(calculateDynamicCommissionSplitPct(10000)).toBe(70);
    expect(calculateDynamicCommissionSplitPct(25000)).toBe(70); // hard cap at 70%

    const reward = buildStatutoryGateXPReward({
      staffProfileId: 'staff-001',
      citationReference: 'AEG-037-DLD-CLEARANCE',
      currentXP: 500,
      currentGatesCleared: 1,
    });

    expect(reward.xpDelta).toBe(500);
    expect(reward.newTotalXP).toBe(1000);
    expect(reward.resultingSplitPct).toBe(61);
    expect(reward.eventTrigger).toBe('XP_THRESHOLD_MILESTONE');
  });

  it('builds AEG-039 RoleAssignment records with floor bounds (1..13) and signature hashes', () => {
    const record = buildFloorRoleAssignmentRecord({
      userId: 'user-123',
      staffProfileId: 'staff-123',
      departmentCode: 'WC-OPS',
      roleName: 'Floor Supervisor',
      operationalLevel: 5,
      floorNumber: 13,
      shiftDateIso: '2026-11-06T09:00:00.000Z',
    });

    expect(record.floorNumber).toBe(13);
    expect(record.operationalLevel).toBe(5);
    expect(record.taskSignatureHash).toContain('SIG-WC-OPS-F13-L5-user-123');
  });
});
