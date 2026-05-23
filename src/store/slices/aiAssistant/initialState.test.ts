/**
 * AI Assistant Dashboard — Initial State Factory Tests
 * Tests getInitialState factory and exported constants.
 */

import { describe, it, expect } from 'vitest';
import {
  getInitialState,
  MAX_RECENT_ASSISTANTS,
  MAX_ACTIVITY_LOG,
  MAX_AUDIT_LOG,
} from './initialState';

// =====================================================================
// CONSTANTS
// =====================================================================

describe('Exported Constants', () => {
  it('MAX_RECENT_ASSISTANTS is 5', () => {
    expect(MAX_RECENT_ASSISTANTS).toBe(5);
  });

  it('MAX_ACTIVITY_LOG is 50', () => {
    expect(MAX_ACTIVITY_LOG).toBe(50);
  });

  it('MAX_AUDIT_LOG is 100', () => {
    expect(MAX_AUDIT_LOG).toBe(100);
  });
});

// =====================================================================
// FACTORY — BASIC SHAPE
// =====================================================================

describe('getInitialState — Shape', () => {
  it('returns an object with all required top-level keys', () => {
    const state = getInitialState();

    const requiredKeys = [
      'allAssistants',
      'ui',
      'sidebar',
      'notifications',
      'tasks',
      'assistantPerformance',
      'favorites',
      'recent',
      'ownerPreferences',
      'liveUpdates',
      'executiveSuggestions',
      'oliviaAutomation',
      'confidentialVault',
      'leadManagementHub',
      'complianceEngine',
      'initialized',
    ];

    requiredKeys.forEach((key) => {
      expect(state).toHaveProperty(key);
    });
  });

  it('initialized flag is true', () => {
    expect(getInitialState().initialized).toBe(true);
  });
});

// =====================================================================
// FACTORY — IMMUTABILITY
// =====================================================================

describe('getInitialState — Immutability', () => {
  it('returns a new object on each call', () => {
    const a = getInitialState();
    const b = getInitialState();
    expect(a).not.toBe(b);
  });

  it('nested arrays are independent between calls', () => {
    const a = getInitialState();
    const b = getInitialState();
    a.favorites.push('test');
    expect(b.favorites).not.toContain('test');
  });

  it('nested objects are independent between calls', () => {
    const a = getInitialState();
    const b = getInitialState();
    a.ui.selectedAssistant = 'changed';
    expect(b.ui.selectedAssistant).toBe('mary');
  });
});

// =====================================================================
// ALL ASSISTANTS
// =====================================================================

describe('getInitialState — allAssistants', () => {
  it('has byId registry as an object', () => {
    const { allAssistants } = getInitialState();
    expect(typeof allAssistants.byId).toBe('object');
    expect(allAssistants.byId).not.toBeNull();
  });

  it('allIds is an array matching byId keys', () => {
    const { allAssistants } = getInitialState();
    expect(Array.isArray(allAssistants.allIds)).toBe(true);
    expect(allAssistants.allIds.sort()).toEqual(Object.keys(allAssistants.byId).sort());
  });

  it('isLoading is false initially', () => {
    expect(getInitialState().allAssistants.isLoading).toBe(false);
  });

  it('lastFetched is null initially', () => {
    expect(getInitialState().allAssistants.lastFetched).toBeNull();
  });
});

// =====================================================================
// UI STATE
// =====================================================================

describe('getInitialState — ui', () => {
  it('selectedAssistant defaults to mary', () => {
    expect(getInitialState().ui.selectedAssistant).toBe('mary');
  });

  it('viewMode defaults to dashboard', () => {
    expect(getInitialState().ui.viewMode).toBe('dashboard');
  });

  it('layout defaults to grid', () => {
    expect(getInitialState().ui.layout).toBe('grid');
  });

  it('filters have correct defaults', () => {
    const { filters } = getInitialState().ui;
    expect(filters.department).toBe('all');
    expect(filters.status).toBe('all');
    expect(filters.searchQuery).toBe('');
  });

  it('dropdownOpen is false', () => {
    expect(getInitialState().ui.dropdownOpen).toBe(false);
  });
});

// =====================================================================
// SIDEBAR STATE
// =====================================================================

describe('getInitialState — sidebar', () => {
  it('isOpen is true', () => {
    expect(getInitialState().sidebar.isOpen).toBe(true);
  });

  it('isCollapsed is false', () => {
    expect(getInitialState().sidebar.isCollapsed).toBe(false);
  });

  it('activeAssistantId is null', () => {
    expect(getInitialState().sidebar.activeAssistantId).toBeNull();
  });

  it('position is right', () => {
    expect(getInitialState().sidebar.position).toBe('right');
  });
});

// =====================================================================
// NOTIFICATIONS
// =====================================================================

describe('getInitialState — notifications', () => {
  it('byAssistantId is an object', () => {
    expect(typeof getInitialState().notifications.byAssistantId).toBe('object');
  });

  it('globalUnreadCount is 0', () => {
    expect(getInitialState().notifications.globalUnreadCount).toBe(0);
  });

  it('lastFetched is null', () => {
    expect(getInitialState().notifications.lastFetched).toBeNull();
  });
});

// =====================================================================
// TASKS
// =====================================================================

describe('getInitialState — tasks', () => {
  it('byAssistantId is an object', () => {
    expect(typeof getInitialState().tasks.byAssistantId).toBe('object');
  });

  it('activeTasksCount is 0', () => {
    expect(getInitialState().tasks.activeTasksCount).toBe(0);
  });
});

// =====================================================================
// ASSISTANT PERFORMANCE
// =====================================================================

describe('getInitialState — assistantPerformance', () => {
  it('overallHealth is 95', () => {
    expect(getInitialState().assistantPerformance.overallHealth).toBe(95);
  });

  it('activeTasks is 47', () => {
    expect(getInitialState().assistantPerformance.activeTasks).toBe(47);
  });

  it('criticalAlerts is an empty array', () => {
    expect(getInitialState().assistantPerformance.criticalAlerts).toEqual([]);
  });

  it('recentActivity is an array', () => {
    expect(Array.isArray(getInitialState().assistantPerformance.recentActivity)).toBe(true);
  });
});

// =====================================================================
// FAVORITES & RECENT
// =====================================================================

describe('getInitialState — favorites & recent', () => {
  it('favorites includes nadia, mary, clara', () => {
    const fav = getInitialState().favorites;
    expect(fav).toContain('nadia');
    expect(fav).toContain('mary');
    expect(fav).toContain('clara');
  });

  it('recent includes mary and nadia', () => {
    const rec = getInitialState().recent;
    expect(rec).toContain('mary');
    expect(rec).toContain('nadia');
  });
});

// =====================================================================
// OWNER PREFERENCES
// =====================================================================

describe('getInitialState — ownerPreferences', () => {
  it('defaultAssistant is mary', () => {
    expect(getInitialState().ownerPreferences.defaultAssistant).toBe('mary');
  });

  it('dashboardLayout is default', () => {
    expect(getInitialState().ownerPreferences.dashboardLayout).toBe('default');
  });

  it('notification settings default to all true', () => {
    const ns = getInitialState().ownerPreferences.notificationSettings;
    expect(ns.assistantUpdates).toBe(true);
    expect(ns.criticalAlerts).toBe(true);
    expect(ns.performanceReports).toBe(true);
  });
});

// =====================================================================
// LIVE UPDATES
// =====================================================================

describe('getInitialState — liveUpdates', () => {
  it('lastUpdate is null', () => {
    expect(getInitialState().liveUpdates.lastUpdate).toBeNull();
  });

  it('connections is an empty object', () => {
    expect(getInitialState().liveUpdates.connections).toEqual({});
  });

  it('isConnected is false', () => {
    expect(getInitialState().liveUpdates.isConnected).toBe(false);
  });
});

// =====================================================================
// EXECUTIVE SUGGESTIONS
// =====================================================================

describe('getInitialState — executiveSuggestions', () => {
  it('inbox has 4 suggestions', () => {
    expect(getInitialState().executiveSuggestions.inbox).toHaveLength(4);
  });

  it('each suggestion has required fields', () => {
    getInitialState().executiveSuggestions.inbox.forEach((s: any) => {
      expect(s).toHaveProperty('id');
      expect(s).toHaveProperty('fromAssistant');
      expect(s).toHaveProperty('priority');
      expect(s).toHaveProperty('title');
      expect(s).toHaveProperty('status');
    });
  });

  it('filters default to unreviewed', () => {
    const { filters } = getInitialState().executiveSuggestions;
    expect(filters.priority).toBe('all');
    expect(filters.department).toBe('all');
    expect(filters.status).toBe('unreviewed');
  });

  it('lastRefresh is an ISO date string', () => {
    const lr = getInitialState().executiveSuggestions.lastRefresh;
    expect(() => new Date(lr).toISOString()).not.toThrow();
  });
});

// =====================================================================
// OLIVIA AUTOMATION
// =====================================================================

describe('getInitialState — oliviaAutomation', () => {
  it('syncSchedule is 3days', () => {
    expect(getInitialState().oliviaAutomation.syncSchedule).toBe('3days');
  });

  it('activeMonitoring is true', () => {
    expect(getInitialState().oliviaAutomation.activeMonitoring).toBe(true);
  });

  it('insightsData has all metric fields', () => {
    const ins = getInitialState().oliviaAutomation.insightsData;
    expect(ins.priceIndex).toBe(152.3);
    expect(ins.avgRentalYield).toBe(6.8);
    expect(ins.hotspots).toContain('Dubai Hills');
    expect(ins.hotspots).toContain('Palm Jumeirah');
  });

  it('monitoredSites has 3 sites', () => {
    const sites = getInitialState().oliviaAutomation.monitoredSites;
    expect(sites).toHaveLength(3);
    expect(sites.map((s: any) => s.name)).toEqual(['Bayut', 'Property Finder', 'Dubizzle']);
  });

  it('coordination.maryConnected is true', () => {
    expect(getInitialState().oliviaAutomation.coordination.maryConnected).toBe(true);
  });
});

// =====================================================================
// CONFIDENTIAL VAULT
// =====================================================================

describe('getInitialState — confidentialVault', () => {
  it('documents has 3 items', () => {
    expect(getInitialState().confidentialVault.documents).toHaveLength(3);
  });

  it('each document has required fields', () => {
    getInitialState().confidentialVault.documents.forEach((d: any) => {
      expect(d).toHaveProperty('id');
      expect(d).toHaveProperty('name');
      expect(d).toHaveProperty('category');
      expect(d).toHaveProperty('accessLevel');
    });
  });

  it('permissions exist for 5 assistants', () => {
    const perms = getInitialState().confidentialVault.permissions;
    expect(Object.keys(perms)).toHaveLength(5);
    expect(perms).toHaveProperty('zoe');
    expect(perms).toHaveProperty('theodora');
  });

  it('vaultStats has correct structure', () => {
    const stats = getInitialState().confidentialVault.vaultStats;
    expect(stats.totalDocuments).toBe(3);
    expect(stats.pendingRequests).toBe(0);
    expect(stats.recentAccesses).toBe(0);
  });
});

// =====================================================================
// LEAD MANAGEMENT HUB
// =====================================================================

describe('getInitialState — leadManagementHub', () => {
  it('incomingLeads starts empty', () => {
    expect(getInitialState().leadManagementHub.incomingLeads).toEqual([]);
  });

  it('specialistPipelines has sophia and daisy', () => {
    const pipes = getInitialState().leadManagementHub.specialistPipelines;
    expect(pipes).toHaveProperty('sophia');
    expect(pipes).toHaveProperty('daisy');
  });

  it('funnelMetrics has all expected fields', () => {
    const fm = getInitialState().leadManagementHub.funnelMetrics;
    expect(fm.totalIncoming).toBe(156);
    expect(fm.conversionRate).toBe(0.23);
    expect(fm.rentVsSaleRatio).toBe('58:42');
  });

  it('leadScoringRules sum to 1.0', () => {
    const rules = getInitialState().leadManagementHub.leadScoringRules;
    const sum = Object.values(rules).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1.0);
  });
});

// =====================================================================
// COMPLIANCE ENGINE
// =====================================================================

describe('getInitialState — complianceEngine', () => {
  it('kycProfiles starts empty', () => {
    expect(getInitialState().complianceEngine.kycProfiles).toEqual({});
  });

  it('amlMonitor arrays start empty', () => {
    const aml = getInitialState().complianceEngine.amlMonitor;
    expect(aml.flaggedTransactions).toEqual([]);
    expect(aml.watchlistMatches).toEqual([]);
    expect(aml.investigationQueue).toEqual([]);
  });

  it('complianceMetrics has expected values', () => {
    const cm = getInitialState().complianceEngine.complianceMetrics;
    expect(cm.totalProfiles).toBe(89);
    expect(cm.pendingReview).toBe(12);
    expect(cm.approvedThisMonth).toBe(34);
    expect(cm.riskScore).toBe(0.15);
  });
});
