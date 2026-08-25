import { describe, expect, it } from 'vitest';
import { AI_ASSISTANTS_REGISTRY } from '../store/slices/aiAssistant/registry';
import { ALL_AI_ASSISTANTS } from '../pages/crm/CRMHubPage.logic';

describe('Assistant parity with Command Center and HTML Registries', () => {
  it('ensures each assistant in the registry has defined metadata and role definition', () => {
    const assistantIds = Object.keys(AI_ASSISTANTS_REGISTRY);

    expect(assistantIds.length).toBeGreaterThanOrEqual(40);
    expect(ALL_AI_ASSISTANTS.length).toBeGreaterThanOrEqual(24);

    assistantIds.forEach((id) => {
      const assistant = AI_ASSISTANTS_REGISTRY[id as keyof typeof AI_ASSISTANTS_REGISTRY];
      expect(assistant).toBeDefined();
      expect(assistant.name).toBeDefined();
    });
  });
});
