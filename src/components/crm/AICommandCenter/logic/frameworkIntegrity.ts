export const EXPECTED_DEPARTMENT_COUNT = 12;
export const EXPECTED_SUPERVISORS_PER_DEPARTMENT = 9;
export const EXPECTED_SUPERVISOR_COUNT =
  EXPECTED_DEPARTMENT_COUNT * EXPECTED_SUPERVISORS_PER_DEPARTMENT;

export interface OpenSupervisorSlot {
  id: string;
  departmentCode: string;
  departmentTitle: string;
}

export interface DepartmentSlotCount {
  code: string;
  title: string;
  count: number;
}

export interface FrameworkIntegrityResult {
  isValid: boolean;
  executivePresent: boolean;
  totalDepartments: number;
  totalSupervisors: number;
  departmentSlotCounts: DepartmentSlotCount[];
  openSlots: OpenSupervisorSlot[];
  status: string;
  errors: string[];
}

type DataRecord = Record<string, unknown>;

function asRecord(value: unknown): DataRecord | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as DataRecord)
    : null;
}

function readText(record: DataRecord | null, key: string, fallback: string): string {
  const value = record?.[key];
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function isOpenStatus(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const normalized = value.trim().replace(/^\[|\]$/g, '').toLowerCase();
  return normalized === 'open' || normalized === 'unassigned';
}

export function auditFrameworkIntegrity(data: unknown): FrameworkIntegrityResult {
  const errors: string[] = [];
  const openSlots: OpenSupervisorSlot[] = [];
  const source = asRecord(data);
  const executive = asRecord(source?.executive);
  const executivePresent = Boolean(readText(executive, 'title', ''));

  if (!executivePresent) {
    errors.push('CRITICAL: Executive level (Tier 1) is missing or unassigned.');
  }

  const departmentValues = Array.isArray(source?.departments) ? source.departments : [];
  const totalDepartments = departmentValues.length;

  if (totalDepartments !== EXPECTED_DEPARTMENT_COUNT) {
    errors.push(
      `HIERARCHY ERROR: Expected exactly ${EXPECTED_DEPARTMENT_COUNT} Core Departments, found ${totalDepartments}.`
    );
  }

  let totalSupervisors = 0;
  const departmentSlotCounts = departmentValues.map((departmentValue, index) => {
    const department = asRecord(departmentValue);
    const code = readText(department, 'code', `Department ${index + 1}`);
    const title = readText(department, 'title', code);
    const slots = Array.isArray(department?.slots) ? department.slots : [];
    const count = slots.length;
    totalSupervisors += count;

    if (count !== EXPECTED_SUPERVISORS_PER_DEPARTMENT) {
      errors.push(
        `SPAN OF CONTROL ERROR: Department ${code} (${title}) contains ${count} supervisor slots instead of ${EXPECTED_SUPERVISORS_PER_DEPARTMENT}.`
      );
    }

    slots.forEach((slotValue, slotIndex) => {
      const slot = asRecord(slotValue);
      if (isOpenStatus(slot?.status)) {
        openSlots.push({
          id: readText(slot, 'id', `Slot ${slotIndex + 1}`),
          departmentCode: code,
          departmentTitle: title,
        });
      }
    });

    return { code, title, count };
  });

  if (totalSupervisors !== EXPECTED_SUPERVISOR_COUNT) {
    errors.push(
      `HIERARCHY ERROR: Expected exactly ${EXPECTED_SUPERVISOR_COUNT} supervisor slots, found ${totalSupervisors}.`
    );
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    executivePresent,
    totalDepartments,
    totalSupervisors,
    departmentSlotCounts,
    openSlots,
    status: isValid
      ? 'COMPLIANT: 1-12-108 Matrix Architecture Secured.'
      : 'FAILED: Structural Deviation Detected.',
    errors,
  };
}
