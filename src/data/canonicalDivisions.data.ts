/**
 * canonicalDivisions.data.ts — 🔱 The Canonical 108 Division Architecture
 * White Caves Real Estate LLC — Bhakti 1-12-108 Protocol
 * Standard: AEGIS Canonical Architecture (< 350 lines)
 */

export interface CanonicalDivisionDef {
  code: string; // DIV-01-1 to DIV-12-9
  slot: number; // 1 to 9
  deptCode: string; // DEPT-01 to DEPT-12
  deptName: string;
  floor: string;
  title: string;
  aiManager: string;
  humanRole: string;
  humanStatus: 'ACTIVE_FOUNDER' | 'REQUISITION_OPEN_VACANT';
  desksCount: number; // 12 Desks per Division
}

import CANONICAL_MATRIX from '../../.agents/protocols/CANONICAL_108_DIVISIONS_MATRIX.json';

export const CANONICAL_108_DIVISIONS: CanonicalDivisionDef[] =
  CANONICAL_MATRIX.departments.flatMap(dept =>
    dept.divisions.map(div => ({
      code: div.code,
      slot: div.slot,
      deptCode: dept.deptCode,
      deptName: dept.name,
      floor: dept.floor,
      title: div.title,
      aiManager: div.aiManager,
      humanRole: div.humanRole,
      humanStatus: 'REQUISITION_OPEN_VACANT',
      desksCount: div.desksCount,
    }))
  );

export function getDivisionsForDepartment(deptCode: string): CanonicalDivisionDef[] {
  return CANONICAL_108_DIVISIONS.filter(d => d.deptCode === deptCode);
}
