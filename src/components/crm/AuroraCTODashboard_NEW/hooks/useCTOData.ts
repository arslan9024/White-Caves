import { useState, useCallback, useMemo } from 'react';
import { AI_ASSISTANTS_REGISTRY, AIAssistant } from '../data/assistants';
import { PLATFORM_MODULES } from '../data/modules';
import { TECH_STACK, SYSTEM_COMPONENTS } from '../data/architecture';
import { CTO_FEATURES } from '../data/features';

export const useCTOData = () => {
  const [systemStatus, setSystemStatus] = useState<string>('operational');
  const [selectedAssistant, setSelectedAssistant] = useState<AIAssistant | null>(null);

  const stats = useMemo(() => ({
    totalAssistants: AI_ASSISTANTS_REGISTRY.length,
    activeAssistants: AI_ASSISTANTS_REGISTRY.filter(a => a.status === 'active').length,
    totalModules: PLATFORM_MODULES.reduce((sum, cat) => sum + cat.modules.length, 0),
    productionModules: PLATFORM_MODULES.reduce((sum, cat) => sum + cat.modules.filter(m => m.status === 'production').length, 0),
    systemHealth: SYSTEM_COMPONENTS.filter(c => c.status === 'healthy').length / SYSTEM_COMPONENTS.length * 100
  }), []);

  const departments = useMemo(() => {
    const depts: Record<string, AIAssistant[]> = {};
    AI_ASSISTANTS_REGISTRY.forEach(a => {
      if (!depts[a.department]) depts[a.department] = [];
      depts[a.department].push(a);
    });
    return depts;
  }, []);

  const handleSelectAssistant = useCallback((assistant: AIAssistant) => {
    setSelectedAssistant(assistant);
  }, []);

  return {
    stats,
    assistants: AI_ASSISTANTS_REGISTRY,
    departments,
    selectedAssistant,
    onSelectAssistant: handleSelectAssistant,
    modules: PLATFORM_MODULES,
    techStack: TECH_STACK,
    systemComponents: SYSTEM_COMPONENTS,
    systemStatus,
    features: CTO_FEATURES
  };
};
