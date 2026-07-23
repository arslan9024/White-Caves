import { describe, expect, it } from 'vitest';
import { AI_ASSISTANTS_REGISTRY } from '../store/slices/aiAssistant/registry';
import { CRM_MODULE_REGISTRY } from './crmModuleRegistry';
import { getTabsForRole } from './ROLE_TAB_MAPPING';

describe('Assistant rollout parity', () => {
  it('maps every assistant registry id to a CRM module', () => {
    const assistantIds = Object.keys(AI_ASSISTANTS_REGISTRY);
    const missingModuleIds = assistantIds.filter(id => !CRM_MODULE_REGISTRY[id]);

    expect(missingModuleIds).toEqual([]);
  });

  it('includes every assistant as a tab for executive roles without duplicates', () => {
    const assistantIds = new Set(Object.keys(AI_ASSISTANTS_REGISTRY));
    const executiveRoles = ['lion', 'owner', 'managing_director'];

    for (const role of executiveRoles) {
      const tabs = getTabsForRole(role);
      const tabIds = tabs.map(tab => tab.id);
      const assistantTabs = tabIds.filter(id => assistantIds.has(id));

      expect(new Set(tabIds).size).toBe(tabIds.length);
      expect(new Set(assistantTabs)).toEqual(assistantIds);
    }
  });
});
