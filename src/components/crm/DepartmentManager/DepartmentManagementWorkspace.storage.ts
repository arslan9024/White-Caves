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
export const DEPTS_SYNC_EVENT = 'whitecaves-departments-sync';

export function loadStoredDepartments(): DepartmentNodeItem[] {
  if (typeof window === 'undefined') return FALLBACK_12_DEPARTMENTS;
  try {
    const raw = localStorage.getItem(DEPT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 12);
      }
    }
  } catch {}
  return FALLBACK_12_DEPARTMENTS;
}

export function saveDepartments(depts: DepartmentNodeItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    const capped = depts.slice(0, 12);
    localStorage.setItem(DEPT_STORAGE_KEY, JSON.stringify(capped));
    window.dispatchEvent(new CustomEvent(DEPTS_SYNC_EVENT, { detail: capped }));
  } catch {}
}

export function resetStoredDepartmentsToCanonical(): DepartmentNodeItem[] {
  const canonical = FALLBACK_12_DEPARTMENTS.map((d, idx) => ({
    ...d,
    order: idx + 1,
    code: `DEPT-${String(idx + 1).padStart(2, '0')}`,
  }));
  saveDepartments(canonical);
  return canonical;
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
      (d.directorOrManagerId?.fullName &&
        d.directorOrManagerId.fullName.toLowerCase().includes(term)) ||
      (d.description && d.description.toLowerCase().includes(term))
  );
}
