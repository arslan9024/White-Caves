import { describe, it, expect } from 'vitest';
import {
  AI_ASSISTANTS,
  DEPARTMENTS,
  ASSISTANT_IDS,
  DEPARTMENT_IDS,
  getAssistantById,
  getAssistantsByDepartment,
  getAllAssistants,
  getAllDepartments,
  getDepartmentById,
  getAssistantCount,
  getDepartmentCount,
  getDepartmentOrder,
  getNavigationStructure,
  getDataFlowsForAssistant,
  type AssistantId,
  type DepartmentId,
} from './assistantRegistry';

// ═══════════════════════════════════════════════════════════════════════
describe('config/assistantRegistry', () => {
  // ── DEPARTMENTS ───────────────────────────────────────────────────
  describe('DEPARTMENTS', () => {
    it('has 12 departments', () => {
      expect(Object.keys(DEPARTMENTS).length).toBe(12);
    });

    it.each([
      'communications',
      'operations',
      'sales',
      'finance',
      'marketing',
      'executive',
      'compliance',
      'technology',
      'legal',
      'intelligence',
      'customer_experience',
      'data_and_ai',
    ] as DepartmentId[])('has department "%s"', deptId => {
      // eslint-disable-next-line security/detect-object-injection
      expect(DEPARTMENTS[deptId]).toBeDefined();
    });

    it('every department has id, label, color, gradient, icon', () => {
      for (const dept of Object.values(DEPARTMENTS)) {
        expect(typeof dept.id).toBe('string');
        expect(typeof dept.label).toBe('string');
        expect(typeof dept.color).toBe('string');
        expect(typeof dept.gradient).toBe('string');
        expect(typeof dept.icon).toBe('string');
      }
    });
  });

  // ── AI_ASSISTANTS ─────────────────────────────────────────────────
  describe('AI_ASSISTANTS', () => {
    it('has 40 assistants', () => {
      expect(Object.keys(AI_ASSISTANTS).length).toBe(40);
    });

    it.each([
      'nadia',
      'nina',
      'mary',
      'nancy',
      'daisy',
      'clara',
      'sophia',
      'theodora',
      'olivia',
      'zoe',
      'laila',
      'aurora',
      'hazel',
      'willow',
      'evangeline',
      'sentinel',
      'hunter',
      'henry',
      'cipher',
      'atlas',
      'vesta',
      'juno',
      'kairos',
      'maven',
      'linda',
      'archer',
      'prism',
      'sage',
      'echo',
      'mira',
      'rex',
      'iris',
      'apex',
      'halo',
      'oracle',
      'flux',
      'nova',
      'quill',
      'lumen',
      'crest',
    ] as AssistantId[])('has assistant "%s"', id => {
      // eslint-disable-next-line security/detect-object-injection
      expect(AI_ASSISTANTS[id]).toBeDefined();
    });

    it('every assistant has required fields', () => {
      for (const assistant of Object.values(AI_ASSISTANTS)) {
        expect(typeof assistant.id).toBe('string');
        expect(typeof assistant.name).toBe('string');
        expect(typeof assistant.title).toBe('string');
        expect(typeof assistant.department).toBe('string');
        expect(typeof assistant.icon).toBe('string');
        expect(typeof assistant.color).toBe('string');
        expect(typeof assistant.avatar).toBe('string');
        expect(typeof assistant.description).toBe('string');
        expect(Array.isArray(assistant.capabilities)).toBe(true);
        expect(assistant.capabilities.length).toBeGreaterThan(0);
        expect(assistant.permissions).toHaveProperty('viewableBy');
        expect(assistant.permissions).toHaveProperty('accessibleBy');
        expect(assistant.permissions).toHaveProperty('dataAccessLevel');
        expect(Array.isArray(assistant.apiEndpoints)).toBe(true);
      }
    });

    it('every assistant references a valid department', () => {
      for (const assistant of Object.values(AI_ASSISTANTS)) {
        expect(DEPARTMENTS[assistant.department as DepartmentId]).toBeDefined();
      }
    });
  });

  // ── ASSISTANT_IDS & DEPARTMENT_IDS ────────────────────────────────
  describe('ID arrays', () => {
    it('ASSISTANT_IDS has 40 entries', () => {
      expect(ASSISTANT_IDS).toHaveLength(40);
    });

    it('DEPARTMENT_IDS has 12 entries', () => {
      expect(DEPARTMENT_IDS).toHaveLength(12);
    });
  });

  // ── getAssistantById ──────────────────────────────────────────────
  describe('getAssistantById', () => {
    it('returns assistant for valid ID', () => {
      const nadia = getAssistantById('nadia');
      expect(nadia).not.toBeNull();
      expect(nadia!.name).toBe('Nadia');
    });

    it('returns null for unknown ID', () => {
      expect(getAssistantById('unknown' as AssistantId)).toBeNull();
    });
  });

  // ── getAssistantsByDepartment ─────────────────────────────────────
  describe('getAssistantsByDepartment', () => {
    it('returns assistants for a valid department', () => {
      const ops = getAssistantsByDepartment('operations');
      expect(ops.length).toBeGreaterThan(0);
      for (const a of ops) {
        expect(a.department).toBe('operations');
      }
    });

    it('returns empty array for unknown department', () => {
      expect(getAssistantsByDepartment('fake' as DepartmentId)).toEqual([]);
    });

    it('all assistants are covered across departments', () => {
      const allCounted = DEPARTMENT_IDS.reduce(
        (sum, deptId) => sum + getAssistantsByDepartment(deptId).length,
        0
      );
      expect(allCounted).toBe(40);
    });
  });

  // ── getAllAssistants & getAllDepartments ────────────────────────────
  describe('getAll functions', () => {
    it('getAllAssistants returns 40', () => {
      expect(getAllAssistants()).toHaveLength(40);
    });

    it('getAllDepartments returns 12', () => {
      expect(getAllDepartments()).toHaveLength(12);
    });
  });

  // ── getDepartmentById ─────────────────────────────────────────────
  describe('getDepartmentById', () => {
    it('returns department for valid ID', () => {
      const dept = getDepartmentById('sales');
      expect(dept).not.toBeNull();
      expect(dept!.id).toBe('sales');
    });

    it('returns null for unknown ID', () => {
      expect(getDepartmentById('fake' as DepartmentId)).toBeNull();
    });
  });

  // ── Counts ────────────────────────────────────────────────────────
  describe('count functions', () => {
    it('getAssistantCount returns 40', () => {
      expect(getAssistantCount()).toBe(40);
    });

    it('getDepartmentCount returns 12', () => {
      expect(getDepartmentCount()).toBe(12);
    });
  });

  // ── getDepartmentOrder ────────────────────────────────────────────
  describe('getDepartmentOrder', () => {
    it('returns exactly 12 departments', () => {
      expect(getDepartmentOrder()).toHaveLength(12);
    });

    it('starts with communications', () => {
      expect(getDepartmentOrder()[0]).toBe('communications');
    });

    it('contains all department IDs', () => {
      const order = getDepartmentOrder();
      for (const deptId of DEPARTMENT_IDS) {
        expect(order).toContain(deptId);
      }
    });
  });

  // ── getNavigationStructure ────────────────────────────────────────
  describe('getNavigationStructure', () => {
    it('returns array with 12 items', () => {
      expect(getNavigationStructure()).toHaveLength(12);
    });

    it('each item has department info and assistants array', () => {
      for (const navItem of getNavigationStructure()) {
        expect(navItem).toHaveProperty('id');
        expect(navItem).toHaveProperty('label');
        expect(navItem).toHaveProperty('assistants');
        expect(Array.isArray(navItem.assistants)).toBe(true);
      }
    });
  });

  // ── getDataFlowsForAssistant ──────────────────────────────────────
  describe('getDataFlowsForAssistant', () => {
    it('returns inputs and outputs for nadia', () => {
      const flows = getDataFlowsForAssistant('nadia');
      expect(flows).toHaveProperty('inputs');
      expect(flows).toHaveProperty('outputs');
      expect(Array.isArray(flows.inputs)).toBe(true);
      expect(Array.isArray(flows.outputs)).toBe(true);
    });

    it('returns empty arrays for assistant without data flows', () => {
      // Some assistants might not have dataFlows
      const flows = getDataFlowsForAssistant('maven');
      expect(Array.isArray(flows.inputs)).toBe(true);
      expect(Array.isArray(flows.outputs)).toBe(true);
    });
  });
});
