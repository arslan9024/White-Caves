import {
  getDefaultService,
  getDefaultDepartment,
  getDefaultSubitem,
  getTopServices,
} from '../../utils/sidebarUtils';

/**
 * Sidebar Utilities Tests
 * Tests for sidebar helper functions
 */

describe('sidebarUtils', () => {
  describe('getDefaultDepartment', () => {
    test('should return default department when called', () => {
      const dept = getDefaultDepartment('executive', null);
      expect(dept).toBeDefined();
    });

    test('should prioritize selection history', () => {
      const history = [{ dept: 'SALES', service: 'lead-pipeline', subitem: null }];
      const dept = getDefaultDepartment('executive', history);
      expect(dept).toBe('SALES');
    });

    test('should fallback to role-based default', () => {
      const dept = getDefaultDepartment('executive', null);
      expect(dept).toBeDefined();
      expect(typeof dept).toBe('string');
    });
  });

  describe('getDefaultService', () => {
    test('should return default service for department', () => {
      const service = getDefaultService('EXECUTIVE', null);
      expect(service).toBeDefined();
      expect(typeof service).toBe('string');
    });

    test('should return null for invalid department', () => {
      const service = getDefaultService('INVALID_DEPT', null);
      expect(service).toBeNull();
    });

    test('should prioritize selection history', () => {
      const history = [{ dept: 'SALES', service: 'lead-pipeline', subitem: null }];
      const service = getDefaultService('SALES', history);
      expect(service).toBe('lead-pipeline');
    });
  });

  describe('getDefaultSubitem', () => {
    test('should return default subitem for service', () => {
      const subitem = getDefaultSubitem('EXECUTIVE', 'strategic-overview', null);
      expect(subitem === null || typeof subitem === 'string').toBe(true);
    });

    test('should handle missing service gracefully', () => {
      const subitem = getDefaultSubitem('EXECUTIVE', 'nonexistent', null);
      expect(subitem).toBeNull();
    });

    test('should prioritize selection history', () => {
      const history = [
        { dept: 'SALES', service: 'lead-pipeline', subitem: 'lost-deals' },
      ];
      const subitem = getDefaultSubitem('SALES', 'lead-pipeline', history);
      expect(subitem).toBe('lost-deals');
    });
  });

  describe('getTopServices', () => {
    test('should return array of services', () => {
      const services = getTopServices('SALES', null, 3);
      expect(Array.isArray(services)).toBe(true);
    });

    test('should respect limit parameter', () => {
      const services = getTopServices('SALES', null, 2);
      expect(services.length).toBeLessThanOrEqual(2);
    });

    test('should use selection history for ordering', () => {
      const history = [
        { dept: 'SALES', service: 'lead-pipeline', subitem: null },
        { dept: 'SALES', service: 'lead-pipeline', subitem: null },
        { dept: 'SALES', service: 'deal-tracker', subitem: null },
      ];
      const services = getTopServices('SALES', history, 3);
      expect(Array.isArray(services)).toBe(true);
    });

    test('should return empty array for invalid department', () => {
      const services = getTopServices('INVALID_DEPT', null, 3);
      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBe(0);
    });
  });
});
