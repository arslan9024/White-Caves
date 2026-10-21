import { describe, expect, it } from 'vitest';
import {
  auditFrameworkIntegrity,
  EXPECTED_DEPARTMENT_COUNT,
  EXPECTED_SUPERVISORS_PER_DEPARTMENT,
  EXPECTED_SUPERVISOR_COUNT,
} from './frameworkIntegrity.js';

function createValidFramework() {
  return {
    executive: { title: 'Managing Director' },
    departments: Array.from({ length: EXPECTED_DEPARTMENT_COUNT }, (_, departmentIndex) => ({
      code: `DEPT-${departmentIndex + 1}`,
      title: `Department ${departmentIndex + 1}`,
      slots: Array.from({ length: EXPECTED_SUPERVISORS_PER_DEPARTMENT }, (_, slotIndex) => ({
        id: `slot-${departmentIndex + 1}-${slotIndex + 1}`,
        status: 'assigned',
      })),
    })),
  };
}

describe('auditFrameworkIntegrity', () => {
  it('accepts the complete 1-12-108 structure', () => {
    const result = auditFrameworkIntegrity(createValidFramework());

    expect(result.isValid).toBe(true);
    expect(result.totalDepartments).toBe(EXPECTED_DEPARTMENT_COUNT);
    expect(result.totalSupervisors).toBe(EXPECTED_SUPERVISOR_COUNT);
    expect(result.openSlots).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
  });

  it('reports a missing executive, department count mismatch, and slot count mismatch', () => {
    const framework = createValidFramework();
    framework.executive.title = '';
    framework.departments.pop();
    framework.departments[0].slots.pop();

    const result = auditFrameworkIntegrity(framework);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'CRITICAL: Executive level (Tier 1) is missing or unassigned.'
    );
    expect(result.errors.some(error => error.includes('Expected exactly 12 Core Departments'))).toBe(
      true
    );
    expect(result.errors.some(error => error.includes('instead of 9'))).toBe(true);
  });

  it('tracks open and unassigned slots without treating them as structural errors', () => {
    const framework = createValidFramework();
    framework.departments[0].slots[0].status = '[Open]';
    framework.departments[1].slots[0].status = 'unassigned';

    const result = auditFrameworkIntegrity(framework);

    expect(result.isValid).toBe(true);
    expect(result.openSlots).toEqual([
      {
        id: 'slot-1-1',
        departmentCode: 'DEPT-1',
        departmentTitle: 'Department 1',
      },
      {
        id: 'slot-2-1',
        departmentCode: 'DEPT-2',
        departmentTitle: 'Department 2',
      },
    ]);
  });

  it('handles malformed inputs without throwing', () => {
    expect(() => auditFrameworkIntegrity(null)).not.toThrow();
    const result = auditFrameworkIntegrity({ departments: [{ code: 'DEPT-01', slots: null }] });

    expect(result.isValid).toBe(false);
    expect(result.totalSupervisors).toBe(0);
    expect(result.executivePresent).toBe(false);
  });
});
