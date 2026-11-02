import type { Assistant, AssistantId } from '../types';
import { coreAssistants } from './coreAssistants.data';
import { growthAssistants } from './growthAssistants.data';
import { intelligenceAssistants } from './intelligenceAssistants.data';
import { marketAssistants } from './marketAssistants.data';
import { advancedAssistants } from './advancedAssistants.data';

export const AI_ASSISTANTS: Record<AssistantId, Assistant> = {
  ...coreAssistants,
  ...growthAssistants,
  ...intelligenceAssistants,
  ...marketAssistants,
  ...advancedAssistants,
} as Record<AssistantId, Assistant>;
