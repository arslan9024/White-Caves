import type { AIAssistant } from '../../types';
import { coreAssistants } from './coreAssistants.data';
import { growthAssistants } from './growthAssistants.data';
import { intelligenceAssistants } from './intelligenceAssistants.data';
import { marketAssistants } from './marketAssistants.data';
import { advancedAssistants } from './advancedAssistants.data';

export const AI_ASSISTANTS_REGISTRY: Record<string, AIAssistant> = {
  ...coreAssistants,
  ...growthAssistants,
  ...intelligenceAssistants,
  ...marketAssistants,
  ...advancedAssistants,
};

// URL normalizer for CRM unified routing
Object.values(AI_ASSISTANTS_REGISTRY).forEach(assistant => {
  if (
    assistant &&
    typeof assistant.dashboardUrl === 'string' &&
    assistant.dashboardUrl.startsWith('/owner/dashboard?tab=')
  ) {
    assistant.dashboardUrl = assistant.dashboardUrl.replace('/owner/dashboard', '/crm');
  }
});
