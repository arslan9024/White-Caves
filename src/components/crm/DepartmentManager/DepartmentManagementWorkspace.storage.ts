/**
 * DepartmentManagementWorkspace.storage.ts
 * White Caves Real Estate LLC - Department Manager Storage & Persistence Sub-Module
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Config / Data Layer)
 * Single Purpose File Law: < 350 lines
 */

import type { DepartmentNodeItem } from './DepartmentManager.types';
import type { SupervisorDef } from '../../../data/assistants108Registry.data';
import { FALLBACK_12_DEPARTMENTS } from './DepartmentManager.data';

export const DEPT_STORAGE_KEY = 'whitecaves_corporate_departments';
export const SUBDEPTS_STORAGE_KEY = 'whitecaves_subdepts_map';

export function loadStoredDepartments(): DepartmentNodeItem[] {
  if (typeof window === 'undefined') return FALLBACK_12_DEPARTMENTS;
  try {
    const raw = localStorage.getItem(DEPT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 12) return parsed;
    }
  } catch {}
  return FALLBACK_12_DEPARTMENTS;
}

export function saveDepartments(depts: DepartmentNodeItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DEPT_STORAGE_KEY, JSON.stringify(depts));
  } catch {}
}

export function loadDeptSquadPriorities(deptKey: string): SupervisorDef[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(`whitecaves_subdepts_${deptKey}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return null;
}

export function saveDeptSquadPriorities(deptKey: string, squads: SupervisorDef[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`whitecaves_subdepts_${deptKey}`, JSON.stringify(squads));
  } catch {}
}

export function computeDepartmentMetrics(departments: DepartmentNodeItem[]) {
  return {
    totalDepartments: departments.length,
    totalSubDepts: departments.reduce((acc, d) => acc + (d.subDeptsCount || 9), 0),
    totalSquads: departments.reduce((acc, d) => acc + (d.squadsCount || 9), 0),
    totalHeadcount: departments.reduce((acc, d) => acc + (d.headcount || 0), 0),
  };
}

export function filterDepartmentsBySearch(
  departments: DepartmentNodeItem[],
  searchTerm: string
): DepartmentNodeItem[] {
  if (!searchTerm.trim()) return departments;
  const term = searchTerm.toLowerCase();
  return departments.filter(
    d =>
      d.title.toLowerCase().includes(term) ||
      d.code.toLowerCase().includes(term) ||
      d.slug.toLowerCase().includes(term) ||
      (d.description && d.description.toLowerCase().includes(term))
  );
}
