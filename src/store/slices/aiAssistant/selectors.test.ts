import { describe, it, expect } from 'vitest';
import {
  selectAllAssistantsArray,
  selectAssistantById,
  selectCurrentAssistant,
  selectUI,
  selectFavorites,
  selectRecent,
  selectFilteredAssistants,
  selectAssistantsByDepartment,
  selectActiveAssistantsCount,
  selectSidebar,
  selectNotifications,
  selectNotificationsByAssistant,
  selectUnreadCountByAssistant,
  selectGlobalUnreadCount,
  selectAllUnreadCounts,
  selectTasks,
  selectTasksByAssistant,
  selectOliviaAutomation,
  selectExecutiveSuggestions,
  selectFilteredSuggestions,
  selectUnreviewedSuggestionsCount,
  selectCriticalSuggestions,
  selectAssistantStatus,
  selectConfidentialVault,
  selectVaultPendingRequests,
  selectLeadManagementHub,
  selectLeadFunnelMetrics,
  selectComplianceEngine,
  selectComplianceMetrics,
} from './selectors';

// ── Helper to create minimal mock RootState ─────────────────────────
const createMockAssistant = (id: string, overrides = {}) => ({
  id,
  name: id.charAt(0).toUpperCase() + id.slice(1),
  title: `${id} title`,
  department: 'operations',
  icon: 'FileText',
  colorScheme: '#3B82F6',
  avatar: '👤',
  description: `${id} desc`,
  capabilities: ['cap1'],
  permissions: { viewableBy: ['owner'], accessibleBy: ['owner'], dataAccessLevel: 'full' },
  metrics: { lastActive: null, tasksCompleted: 10, activeUsers: 1, systemHealth: 'optimal' },
  quickStats: { value: 100, label: 'Items', change: 0 },
  dashboardUrl: `/dashboard/${id}`,
  apiEndpoints: [`/api/${id}`],
  ...overrides,
});

const createMockState = (overrides: Record<string, unknown> = {}) => {
  const byId: Record<string, ReturnType<typeof createMockAssistant>> = {
    mary: createMockAssistant('mary'),
    nadia: createMockAssistant('nadia', { department: 'communications' }),
    clara: createMockAssistant('clara', { department: 'sales', metrics: { lastActive: null, tasksCompleted: 5, activeUsers: 0, systemHealth: 'degraded' } }),
  };
  return {
    aiAssistantDashboard: {
      allAssistants: {
        byId,
        allIds: ['mary', 'nadia', 'clara'],
        isLoading: false,
        lastFetched: null,
      },
      ui: {
        selectedAssistant: 'mary',
        viewMode: 'grid',
        layout: 'grid' as const,
        filters: { department: 'all', status: 'all', searchQuery: '' },
        dropdownOpen: false,
      },
      favorites: ['mary'],
      recent: ['nadia'],
      sidebar: { isOpen: true, isCollapsed: false, activeAssistantId: null, position: 'right' },
      notifications: {
        byAssistantId: {
          mary: [
            { id: 'n1', type: 'info', message: 'Test', severity: 'info', isRead: false, timestamp: '2025-01-01' },
            { id: 'n2', type: 'info', message: 'Done', severity: 'info', isRead: true, timestamp: '2025-01-02' },
          ],
          nadia: [],
        },
        globalUnreadCount: 1,
        lastFetched: null,
      },
      tasks: {
        byAssistantId: {
          mary: [
            { id: 't1', title: 'Task 1', priority: 'high', status: 'in_progress', assignedTo: null },
            { id: 't2', title: 'Task 2', priority: 'low', status: 'completed', assignedTo: null },
          ],
        },
      },
      assistantPerformance: { recentActivity: [{ type: 'action', timestamp: '2025-01-01' }] },
      ownerPreferences: { theme: 'dark' },
      oliviaAutomation: { campaigns: [] },
      executiveSuggestions: {
        inbox: [
          { id: 's1', priority: 'critical', assistantDepartment: 'ops', status: 'unreviewed' },
          { id: 's2', priority: 'low', assistantDepartment: 'sales', status: 'approved' },
          { id: 's3', priority: 'critical', assistantDepartment: 'ops', status: 'approved' },
        ],
        filters: {},
      },
      confidentialVault: {
        documents: [{ id: 'd1' }],
        accessRequests: [
          { id: 'r1', status: 'pending' },
          { id: 'r2', status: 'approved' },
        ],
        permissions: {},
        vaultStats: {},
      },
      leadManagementHub: {
        incomingLeads: [],
        processedLeads: {},
        funnelMetrics: { total: 100 },
      },
      complianceEngine: {
        kycProfiles: {},
        amlMonitor: {},
        auditLog: [],
        complianceMetrics: { score: 95 },
      },
      ...overrides,
    },
  } as never; // Cast to satisfy RootState
};

// ═══════════════════════════════════════════════════════════════════════
describe('aiAssistant/selectors', () => {
  const state = createMockState();

  // ── Core assistants ───────────────────────────────────────────────
  describe('core assistant selectors', () => {
    it('selectAllAssistantsArray returns all 3 assistants', () => {
      expect(selectAllAssistantsArray(state)).toHaveLength(3);
    });

    it('selectAssistantById returns assistant for valid ID', () => {
      expect(selectAssistantById('mary')(state)).toBeDefined();
      expect(selectAssistantById('mary')(state)!.name).toBe('Mary');
    });

    it('selectAssistantById returns undefined for unknown ID', () => {
      expect(selectAssistantById('unknown')(state)).toBeUndefined();
    });

    it('selectCurrentAssistant returns selected assistant', () => {
      expect(selectCurrentAssistant(state)!.id).toBe('mary');
    });
  });

  // ── UI & Preferences ─────────────────────────────────────────────
  describe('UI & preference selectors', () => {
    it('selectUI returns UI state', () => {
      expect(selectUI(state)!.selectedAssistant).toBe('mary');
      expect(selectUI(state)!.viewMode).toBe('grid');
    });

    it('selectFavorites returns favorites array', () => {
      expect(selectFavorites(state)).toEqual(['mary']);
    });

    it('selectRecent returns recent array', () => {
      expect(selectRecent(state)).toEqual(['nadia']);
    });
  });

  // ── Filtered / Grouped ────────────────────────────────────────────
  describe('filtered & grouped selectors', () => {
    it('selectFilteredAssistants returns all when no filters', () => {
      expect(selectFilteredAssistants(state)).toHaveLength(3);
    });

    it('selectFilteredAssistants filters by department', () => {
      const filtered = createMockState({
        ui: {
          selectedAssistant: 'mary',
          viewMode: 'grid',
          layout: 'grid',
          filters: { department: 'operations', status: 'all', searchQuery: '' },
          dropdownOpen: false,
        },
      });
      expect(selectFilteredAssistants(filtered)).toHaveLength(1);
      expect(selectFilteredAssistants(filtered)[0].id).toBe('mary');
    });

    it('selectFilteredAssistants filters by searchQuery', () => {
      const filtered = createMockState({
        ui: {
          selectedAssistant: 'mary',
          viewMode: 'grid',
          layout: 'grid',
          filters: { department: 'all', status: 'all', searchQuery: 'nadia' },
          dropdownOpen: false,
        },
      });
      expect(selectFilteredAssistants(filtered)).toHaveLength(1);
    });

    it('selectAssistantsByDepartment groups correctly', () => {
      const grouped = selectAssistantsByDepartment(state);
      expect(grouped['operations']).toHaveLength(1);
      expect(grouped['communications']).toHaveLength(1);
      expect(grouped['sales']).toHaveLength(1);
    });

    it('selectActiveAssistantsCount counts optimal-health assistants', () => {
      // mary and nadia are 'optimal', clara is 'degraded'
      expect(selectActiveAssistantsCount(state)).toBe(2);
    });
  });

  // ── Sidebar ───────────────────────────────────────────────────────
  describe('sidebar selector', () => {
    it('selectSidebar returns sidebar state', () => {
      expect(selectSidebar(state)!.isOpen).toBe(true);
    });
  });

  // ── Notifications ─────────────────────────────────────────────────
  describe('notification selectors', () => {
    it('selectNotifications returns notifications state', () => {
      expect(selectNotifications(state)!.globalUnreadCount).toBe(1);
    });

    it('selectNotificationsByAssistant returns notifications for mary', () => {
      expect(selectNotificationsByAssistant('mary')(state)).toHaveLength(2);
    });

    it('selectNotificationsByAssistant returns empty for unknown ID', () => {
      expect(selectNotificationsByAssistant('unknown')(state)).toHaveLength(0);
    });

    it('selectUnreadCountByAssistant counts unread for mary', () => {
      expect(selectUnreadCountByAssistant('mary')(state)).toBe(1);
    });

    it('selectGlobalUnreadCount returns global count', () => {
      expect(selectGlobalUnreadCount(state)).toBe(1);
    });

    it('selectAllUnreadCounts returns counts per assistant', () => {
      const counts = selectAllUnreadCounts(state);
      expect(counts['mary']).toBe(1);
      expect(counts['nadia']).toBe(0);
    });
  });

  // ── Tasks ─────────────────────────────────────────────────────────
  describe('task selectors', () => {
    it('selectTasks returns tasks state', () => {
      expect(selectTasks(state)).toBeDefined();
    });

    it('selectTasksByAssistant returns tasks for mary', () => {
      expect(selectTasksByAssistant('mary')(state)).toHaveLength(2);
    });

    it('selectTasksByAssistant returns empty for unknown', () => {
      expect(selectTasksByAssistant('unknown')(state)).toHaveLength(0);
    });
  });

  // ── Olivia Automation ─────────────────────────────────────────────
  describe('olivia automation selector', () => {
    it('selectOliviaAutomation returns automation state', () => {
      expect(selectOliviaAutomation(state)).toHaveProperty('campaigns');
    });
  });

  // ── Executive Suggestions ─────────────────────────────────────────
  describe('executive suggestions selectors', () => {
    it('selectExecutiveSuggestions returns suggestions', () => {
      expect(selectExecutiveSuggestions(state).inbox).toHaveLength(3);
    });

    it('selectFilteredSuggestions returns all when no filters', () => {
      expect(selectFilteredSuggestions(state)).toHaveLength(3);
    });

    it('selectUnreviewedSuggestionsCount returns 1', () => {
      expect(selectUnreviewedSuggestionsCount(state)).toBe(1);
    });

    it('selectCriticalSuggestions returns only critical+unreviewed', () => {
      const critical = selectCriticalSuggestions(state);
      expect(critical).toHaveLength(1);
      expect(critical[0].id).toBe('s1');
    });
  });

  // ── Assistant Status ──────────────────────────────────────────────
  describe('selectAssistantStatus', () => {
    it('returns "busy" when assistant has active tasks', () => {
      expect(selectAssistantStatus('mary')(state)).toBe('busy');
    });

    it('returns "active" when optimal and no active tasks', () => {
      expect(selectAssistantStatus('nadia')(state)).toBe('active');
    });

    it('returns "idle" when not optimal and no active tasks', () => {
      expect(selectAssistantStatus('clara')(state)).toBe('idle');
    });

    it('returns "offline" for unknown assistant', () => {
      expect(selectAssistantStatus('unknown')(state)).toBe('offline');
    });
  });

  // ── Confidential Vault ────────────────────────────────────────────
  describe('vault selectors', () => {
    it('selectConfidentialVault returns vault state', () => {
      expect(selectConfidentialVault(state).documents).toHaveLength(1);
    });

    it('selectVaultPendingRequests returns only pending', () => {
      expect(selectVaultPendingRequests(state)).toHaveLength(1);
      expect(selectVaultPendingRequests(state)[0].id).toBe('r1');
    });
  });

  // ── Lead Management ───────────────────────────────────────────────
  describe('lead management selectors', () => {
    it('selectLeadManagementHub returns hub state', () => {
      expect(selectLeadManagementHub(state)).toHaveProperty('incomingLeads');
    });

    it('selectLeadFunnelMetrics returns funnel metrics', () => {
      expect(selectLeadFunnelMetrics(state)).toEqual({ total: 100 });
    });
  });

  // ── Compliance ────────────────────────────────────────────────────
  describe('compliance selectors', () => {
    it('selectComplianceEngine returns compliance state', () => {
      expect(selectComplianceEngine(state)).toHaveProperty('kycProfiles');
    });

    it('selectComplianceMetrics returns metrics', () => {
      expect(selectComplianceMetrics(state)).toEqual({ score: 95 });
    });
  });

  // ── Empty / missing state handling ────────────────────────────────
  describe('empty state handling', () => {
    const emptyState = { aiAssistantDashboard: undefined } as never;

    it('selectAllAssistantsArray handles undefined state', () => {
      expect(selectAllAssistantsArray(emptyState)).toEqual([]);
    });

    it('selectFavorites handles undefined state', () => {
      expect(selectFavorites(emptyState)).toEqual([]);
    });

    it('selectRecent handles undefined state', () => {
      expect(selectRecent(emptyState)).toEqual([]);
    });

    it('selectGlobalUnreadCount handles undefined state', () => {
      expect(selectGlobalUnreadCount(emptyState)).toBe(0);
    });

    it('selectNotificationsByAssistant handles undefined state', () => {
      expect(selectNotificationsByAssistant('test')(emptyState)).toEqual([]);
    });

    it('selectTasksByAssistant handles undefined state', () => {
      expect(selectTasksByAssistant('test')(emptyState)).toEqual([]);
    });
  });
});
