/**
 * AICommandCenter.logic.ts — Hook & Logic Layer
 * Manages search filtering, department grouping, active assistant selection, and metrics calculation.
 */

import { useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ASSISTANTS_DATA, DEPARTMENTS_DATA, EXECUTIVE_DATA } from '../data/AICommandCenter.data';
import type { SupervisorDef, DepartmentDef } from '../../../../data/assistants108Registry.data';
import { selectAssistant } from '../../../../store/slices/aiAssistantDashboardSlice';

export function useAICommandCenterLogic() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedAssistantId, setSelectedAssistantId] = useState<string>(ASSISTANTS_DATA[0]?.id || 'sup_luxury_sales_1');

  const filteredAssistants = useMemo(() => {
    return ASSISTANTS_DATA.filter((agent: SupervisorDef) => {
      const matchesDept = selectedDept === 'all' || agent.departmentId === selectedDept;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        agent.name.toLowerCase().includes(term) ||
        agent.code.toLowerCase().includes(term) ||
        agent.title.toLowerCase().includes(term) ||
        agent.description.toLowerCase().includes(term) ||
        agent.assignedTasks.some((t: string) => t.toLowerCase().includes(term)) ||
        agent.capabilities.some((c: string) => c.toLowerCase().includes(term));

      return matchesDept && matchesSearch;
    });
  }, [searchTerm, selectedDept]);

  const activeAssistant = useMemo(() => {
    return (
      ASSISTANTS_DATA.find((a: SupervisorDef) => a.id === selectedAssistantId) ||
      ASSISTANTS_DATA[0]
    );
  }, [selectedAssistantId]);

  const stats = useMemo(() => {
    const total = ASSISTANTS_DATA.length;
    const optimalCount = ASSISTANTS_DATA.filter((a: SupervisorDef) => a.metrics.systemHealth === 'optimal').length;
    const totalTasks = ASSISTANTS_DATA.reduce((acc: number, a: SupervisorDef) => acc + a.metrics.tasksCompletedToday, 0);

    return {
      totalAgents: total,
      optimalCount,
      totalTasksToday: totalTasks.toLocaleString(),
      avgAccuracy: '99.8%',
      slaAdherence: '99.8%',
    };
  }, []);

  const handleSelectAssistant = useCallback((id: string) => {
    setSelectedAssistantId(id);
    dispatch(selectAssistant(id));
  }, [dispatch]);

  return {
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
    selectedAssistantId,
    handleSelectAssistant,
    activeAssistant,
    filteredAssistants,
    departments: DEPARTMENTS_DATA,
    executive: EXECUTIVE_DATA,
    stats,
  };
}

