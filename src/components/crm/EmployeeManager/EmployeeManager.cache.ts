// FILE: src/components/crm/EmployeeManager/EmployeeManager.cache.ts
/**
 * White Caves Real Estate LLC - EmployeeManager Localized State Persistence & Cache (Tier 11)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import type { EmployeeNode } from './EmployeeManager.types';
import { CANONICAL_EMPLOYEES } from './EmployeeManager.data';

const STORAGE_KEY = 'whitecaves_employees_cache';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minutes TTL

interface CacheEnvelope {
  timestamp: number;
  data: EmployeeNode[];
}

// In-memory O(1) Map Index for instantaneous lookup by Turing ID
const inMemoryIndex = new Map<string, EmployeeNode>();

export function indexEmployeesInMemory(employees: EmployeeNode[]): void {
  inMemoryIndex.clear();
  if (!Array.isArray(employees)) return;
  for (const emp of employees) {
    if (emp && emp._id) {
      inMemoryIndex.set(emp._id.toUpperCase(), emp);
    }
    if (emp && emp.employeeCode) {
      inMemoryIndex.set(emp.employeeCode.toUpperCase(), emp);
    }
  }
}

export function getEmployeeByTuringId(turingId: string): EmployeeNode | null {
  if (!turingId) return null;
  const cleanId = turingId.trim().toUpperCase();
  return inMemoryIndex.get(cleanId) || null;
}

export function loadEmployeesCache(): EmployeeNode[] | null {
  if (typeof window === 'undefined') return CANONICAL_EMPLOYEES;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      indexEmployeesInMemory(CANONICAL_EMPLOYEES);
      return CANONICAL_EMPLOYEES;
    }

    const envelope: CacheEnvelope = JSON.parse(raw);
    const isExpired = Date.now() - envelope.timestamp > CACHE_TTL_MS;

    if (isExpired || !Array.isArray(envelope.data) || envelope.data.length === 0) {
      indexEmployeesInMemory(CANONICAL_EMPLOYEES);
      return CANONICAL_EMPLOYEES;
    }

    indexEmployeesInMemory(envelope.data);
    return envelope.data;
  } catch {
    indexEmployeesInMemory(CANONICAL_EMPLOYEES);
    return CANONICAL_EMPLOYEES;
  }
}

export function saveEmployeesCache(employees: EmployeeNode[]): void {
  if (typeof window === 'undefined') return;

  try {
    const envelope: CacheEnvelope = {
      timestamp: Date.now(),
      data: employees,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    indexEmployeesInMemory(employees);
  } catch {
    // Non-fatal fallback
  }
}
