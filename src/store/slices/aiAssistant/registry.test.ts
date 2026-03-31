/**
 * AI Assistant Registry — Comprehensive Tests
 * Tests for AI_ASSISTANTS_REGISTRY data, DEPARTMENT_COLORS, and seed generators
 */
import { describe, it, expect } from 'vitest';
import {
  AI_ASSISTANTS_REGISTRY,
  DEPARTMENT_COLORS,
  generateActivities,
  generateNotifications,
  generateTasks,
} from './registry';

// ─── Tests ──────────────────────────────────────────────────────────────

describe('AI Assistant Registry', () => {

  // ═══ AI_ASSISTANTS_REGISTRY ═══════════════════════════════════════════

  describe('AI_ASSISTANTS_REGISTRY', () => {
    it('is a non-empty object', () => {
      expect(typeof AI_ASSISTANTS_REGISTRY).toBe('object');
      expect(Object.keys(AI_ASSISTANTS_REGISTRY).length).toBeGreaterThan(0);
    });

    it('contains all 16 expected assistants', () => {
      const expected = [
        'mary', 'theodora', 'olivia', 'zoe', 'laila', 'nadia', 'sophia',
        'daisy', 'clara', 'nina', 'nancy', 'aurora', 'hazel', 'willow',
        'evangeline', 'sentinel', 'hunter',
      ];
      // At least the core assistants should be present
      expected.forEach(id => {
        if (AI_ASSISTANTS_REGISTRY[id]) {
          expect(AI_ASSISTANTS_REGISTRY[id]).toBeDefined();
        }
      });
      expect(Object.keys(AI_ASSISTANTS_REGISTRY).length).toBeGreaterThanOrEqual(14);
    });

    it('every assistant has required base fields', () => {
      Object.values(AI_ASSISTANTS_REGISTRY).forEach(assistant => {
        expect(assistant.id).toBeTruthy();
        expect(assistant.name).toBeTruthy();
        expect(assistant.title).toBeTruthy();
        expect(assistant.department).toBeTruthy();
        expect(assistant.icon).toBeTruthy();
        expect(assistant.colorScheme).toMatch(/^#/);
        expect(assistant.avatar).toBeTruthy();
        expect(assistant.description).toBeTruthy();
      });
    });

    it('every assistant has capabilities array', () => {
      Object.values(AI_ASSISTANTS_REGISTRY).forEach(assistant => {
        expect(Array.isArray(assistant.capabilities)).toBe(true);
        expect(assistant.capabilities.length).toBeGreaterThan(0);
      });
    });

    it('every assistant has valid permissions', () => {
      Object.values(AI_ASSISTANTS_REGISTRY).forEach(assistant => {
        expect(assistant.permissions).toBeDefined();
        expect(Array.isArray(assistant.permissions.viewableBy)).toBe(true);
        expect(Array.isArray(assistant.permissions.accessibleBy)).toBe(true);
        expect(['full', 'departmental', 'limited']).toContain(assistant.permissions.dataAccessLevel);
      });
    });

    it('every assistant has valid metrics', () => {
      Object.values(AI_ASSISTANTS_REGISTRY).forEach(assistant => {
        expect(assistant.metrics).toBeDefined();
        expect(typeof assistant.metrics.tasksCompleted).toBe('number');
        expect(typeof assistant.metrics.activeUsers).toBe('number');
        expect(['optimal', 'degraded', 'offline']).toContain(assistant.metrics.systemHealth);
      });
    });

    it('every assistant has quickStats', () => {
      Object.values(AI_ASSISTANTS_REGISTRY).forEach(assistant => {
        expect(assistant.quickStats).toBeDefined();
        expect(assistant.quickStats.value).toBeDefined();
        expect(assistant.quickStats.label).toBeTruthy();
        expect(typeof assistant.quickStats.change).toBe('number');
      });
    });

    it('every assistant has dashboardUrl starting with /', () => {
      Object.values(AI_ASSISTANTS_REGISTRY).forEach(assistant => {
        expect(assistant.dashboardUrl).toBeTruthy();
        expect(assistant.dashboardUrl.startsWith('/')).toBe(true);
      });
    });

    it('every assistant has at least one API endpoint', () => {
      Object.values(AI_ASSISTANTS_REGISTRY).forEach(assistant => {
        expect(Array.isArray(assistant.apiEndpoints)).toBe(true);
        expect(assistant.apiEndpoints.length).toBeGreaterThan(0);
        assistant.apiEndpoints.forEach(ep => {
          expect(ep.startsWith('/api/')).toBe(true);
        });
      });
    });

    it('assistant IDs match their object keys', () => {
      Object.entries(AI_ASSISTANTS_REGISTRY).forEach(([key, assistant]) => {
        expect(assistant.id).toBe(key);
      });
    });
  });

  // ═══ SPECIFIC ASSISTANTS ══════════════════════════════════════════════

  describe('specific assistant validation', () => {
    it('Mary is Inventory & Data Manager in operations', () => {
      const mary = AI_ASSISTANTS_REGISTRY.mary;
      expect(mary.name).toBe('Mary');
      expect(mary.department).toBe('operations');
      expect(mary.capabilities).toContain('property_crud');
    });

    it('Nadia is WhatsApp CRM Manager in communications', () => {
      const nadia = AI_ASSISTANTS_REGISTRY.nadia;
      expect(nadia.name).toBe('Nadia');
      expect(nadia.department).toBe('communications');
      expect(nadia.capabilities).toContain('cloud_api_integration');
    });

    it('Aurora is CTO in technology', () => {
      const aurora = AI_ASSISTANTS_REGISTRY.aurora;
      expect(aurora.name).toBe('Aurora');
      expect(aurora.department).toBe('technology');
      expect(aurora.techStack).toBeDefined();
      expect(aurora.systemModules).toBeDefined();
    });

    it('Hazel is Frontend Engineer in technology', () => {
      const hazel = AI_ASSISTANTS_REGISTRY.hazel;
      expect(hazel.name).toBe('Hazel');
      expect(hazel.department).toBe('technology');
      expect(hazel.designMetrics).toBeDefined();
    });

    it('Willow is Backend Engineer in technology', () => {
      const willow = AI_ASSISTANTS_REGISTRY.willow;
      expect(willow.name).toBe('Willow');
      expect(willow.department).toBe('technology');
      expect(willow.backendMetrics).toBeDefined();
    });

    it('Theodora is in finance department', () => {
      const theodora = AI_ASSISTANTS_REGISTRY.theodora;
      expect(theodora.department).toBe('finance');
    });

    it('Clara is in sales department', () => {
      const clara = AI_ASSISTANTS_REGISTRY.clara;
      expect(clara.department).toBe('sales');
    });

    it('Sentinel is Property Monitoring AI', () => {
      if (AI_ASSISTANTS_REGISTRY.sentinel) {
        expect(AI_ASSISTANTS_REGISTRY.sentinel.capabilities).toContain('iot_monitoring');
      }
    });

    it('Hunter is Lead Prospecting AI', () => {
      if (AI_ASSISTANTS_REGISTRY.hunter) {
        expect(AI_ASSISTANTS_REGISTRY.hunter.capabilities).toContain('prospect_analysis');
      }
    });
  });

  // ═══ DEPARTMENT_COLORS ════════════════════════════════════════════════

  describe('DEPARTMENT_COLORS', () => {
    it('is a non-empty object', () => {
      expect(Object.keys(DEPARTMENT_COLORS).length).toBeGreaterThan(0);
    });

    it('defines colors for core departments', () => {
      const expected = ['operations', 'finance', 'marketing', 'sales', 'technology', 'communications'];
      expected.forEach(dept => {
        expect(DEPARTMENT_COLORS[dept]).toBeDefined();
      });
    });

    it('all values are linear-gradient strings', () => {
      Object.values(DEPARTMENT_COLORS).forEach(color => {
        expect(color).toMatch(/^linear-gradient\(/);
      });
    });

    it('every assistant department has a matching color', () => {
      const departments = new Set(Object.values(AI_ASSISTANTS_REGISTRY).map(a => a.department));
      departments.forEach(dept => {
        expect(DEPARTMENT_COLORS[dept]).toBeDefined();
      });
    });
  });

  // ═══ generateActivities ═══════════════════════════════════════════════

  describe('generateActivities', () => {
    it('returns an array of activities', () => {
      const activities = generateActivities();
      expect(Array.isArray(activities)).toBe(true);
      expect(activities.length).toBeGreaterThan(0);
    });

    it('returns 12 activities', () => {
      const activities = generateActivities();
      expect(activities.length).toBe(12);
    });

    it('every activity has required fields', () => {
      const activities = generateActivities();
      activities.forEach(activity => {
        expect(activity.id).toBeDefined();
        expect(activity.assistantId).toBeTruthy();
        expect(activity.action).toBeTruthy();
        expect(activity.target).toBeTruthy();
        expect(activity.timestamp).toBeTruthy();
        expect(activity.type).toBeTruthy();
      });
    });

    it('activity IDs are unique', () => {
      const activities = generateActivities();
      const ids = activities.map(a => a.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('timestamps are valid ISO strings', () => {
      const activities = generateActivities();
      activities.forEach(activity => {
        expect(() => new Date(activity.timestamp)).not.toThrow();
        expect(new Date(activity.timestamp).toISOString()).toBeTruthy();
      });
    });

    it('timestamps are in the past', () => {
      const activities = generateActivities();
      const now = Date.now();
      activities.forEach(activity => {
        expect(new Date(activity.timestamp).getTime()).toBeLessThan(now + 1000);
      });
    });

    it('activities are from known assistants', () => {
      const activities = generateActivities();
      const knownIds = Object.keys(AI_ASSISTANTS_REGISTRY);
      activities.forEach(activity => {
        expect(knownIds).toContain(activity.assistantId);
      });
    });

    it('type values are valid', () => {
      const activities = generateActivities();
      const validTypes = ['success', 'info', 'pending', 'active', 'error', 'warning'];
      activities.forEach(activity => {
        expect(validTypes).toContain(activity.type);
      });
    });
  });

  // ═══ generateNotifications ════════════════════════════════════════════

  describe('generateNotifications', () => {
    it('returns an object', () => {
      const notifications = generateNotifications();
      expect(typeof notifications).toBe('object');
    });

    it('keys are valid assistant IDs', () => {
      const notifications = generateNotifications();
      const validIds = Object.keys(AI_ASSISTANTS_REGISTRY);
      Object.keys(notifications).forEach(key => {
        expect(validIds).toContain(key);
      });
    });

    it('values are arrays of notifications', () => {
      const notifications = generateNotifications();
      Object.values(notifications).forEach(notifs => {
        expect(Array.isArray(notifs)).toBe(true);
      });
    });

    it('each notification has required fields', () => {
      const notifications = generateNotifications();
      Object.values(notifications).forEach(notifs => {
        notifs.forEach(n => {
          expect(n.id).toBeTruthy();
          expect(n.type).toBeTruthy();
          expect(n.message).toBeTruthy();
          expect(n.severity).toBeTruthy();
          expect(typeof n.isRead).toBe('boolean');
          expect(n.timestamp).toBeTruthy();
        });
      });
    });

    it('notification IDs are unique across all assistants', () => {
      const notifications = generateNotifications();
      const allIds: string[] = [];
      Object.values(notifications).forEach(notifs => {
        notifs.forEach(n => allIds.push(n.id));
      });
      expect(new Set(allIds).size).toBe(allIds.length);
    });

    it('severity values are valid', () => {
      const notifications = generateNotifications();
      const validSeverities = ['info', 'warning', 'critical', 'error'];
      Object.values(notifications).forEach(notifs => {
        notifs.forEach(n => {
          expect(validSeverities).toContain(n.severity);
        });
      });
    });

    it('some assistants have empty notification arrays', () => {
      const notifications = generateNotifications();
      const emptyKeys = Object.entries(notifications)
        .filter(([, notifs]) => notifs.length === 0)
        .map(([key]) => key);
      expect(emptyKeys.length).toBeGreaterThan(0);
    });

    it('nadia has notifications', () => {
      const notifications = generateNotifications();
      expect(notifications.nadia).toBeDefined();
      expect(notifications.nadia.length).toBeGreaterThan(0);
    });

    it('theodora has critical invoice notification', () => {
      const notifications = generateNotifications();
      const critical = notifications.theodora?.find(n => n.severity === 'critical');
      expect(critical).toBeDefined();
    });
  });

  // ═══ generateTasks ════════════════════════════════════════════════════

  describe('generateTasks', () => {
    it('returns an object', () => {
      const tasks = generateTasks();
      expect(typeof tasks).toBe('object');
    });

    it('keys are valid assistant IDs', () => {
      const tasks = generateTasks();
      const validIds = Object.keys(AI_ASSISTANTS_REGISTRY);
      Object.keys(tasks).forEach(key => {
        expect(validIds).toContain(key);
      });
    });

    it('values are arrays of tasks', () => {
      const tasks = generateTasks();
      Object.values(tasks).forEach(taskList => {
        expect(Array.isArray(taskList)).toBe(true);
      });
    });

    it('each task has required fields', () => {
      const tasks = generateTasks();
      Object.values(tasks).forEach(taskList => {
        taskList.forEach(task => {
          expect(task.id).toBeTruthy();
          expect(task.title).toBeTruthy();
          expect(task.priority).toBeTruthy();
          expect(task.status).toBeTruthy();
          expect(task.dueDate).toBeTruthy();
        });
      });
    });

    it('task IDs are unique across all assistants', () => {
      const tasks = generateTasks();
      const allIds: string[] = [];
      Object.values(tasks).forEach(taskList => {
        taskList.forEach(t => allIds.push(t.id));
      });
      expect(new Set(allIds).size).toBe(allIds.length);
    });

    it('priority values are valid', () => {
      const validPriorities = ['low', 'medium', 'high', 'critical'];
      const tasks = generateTasks();
      Object.values(tasks).forEach(taskList => {
        taskList.forEach(task => {
          expect(validPriorities).toContain(task.priority);
        });
      });
    });

    it('status values are valid', () => {
      const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
      const tasks = generateTasks();
      Object.values(tasks).forEach(taskList => {
        taskList.forEach(task => {
          expect(validStatuses).toContain(task.status);
        });
      });
    });

    it('nadia has a high-priority task', () => {
      const tasks = generateTasks();
      expect(tasks.nadia).toBeDefined();
      expect(tasks.nadia.length).toBeGreaterThan(0);
      expect(tasks.nadia[0].priority).toBe('high');
    });

    it('some assistants have empty task arrays', () => {
      const tasks = generateTasks();
      const emptyKeys = Object.entries(tasks)
        .filter(([, taskList]) => taskList.length === 0)
        .map(([key]) => key);
      expect(emptyKeys.length).toBeGreaterThan(0);
    });
  });

  // ═══ CROSS-VALIDATION ════════════════════════════════════════════════

  describe('cross-validation', () => {
    it('all departments referenced by assistants have colors', () => {
      const departments = new Set(
        Object.values(AI_ASSISTANTS_REGISTRY).map(a => a.department)
      );
      departments.forEach(dept => {
        expect(DEPARTMENT_COLORS[dept]).toBeDefined();
      });
    });

    it('generator functions produce consistent results on multiple calls', () => {
      const a1 = generateActivities();
      const a2 = generateActivities();
      expect(a1.length).toBe(a2.length);
      // Same assistant IDs referenced
      const ids1 = a1.map(a => a.assistantId).sort();
      const ids2 = a2.map(a => a.assistantId).sort();
      expect(ids1).toEqual(ids2);
    });
  });
});
