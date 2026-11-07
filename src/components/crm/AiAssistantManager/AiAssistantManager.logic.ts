// FILE: src/components/crm/AiAssistantManager/AiAssistantManager.logic.ts
/**
 * White Caves Real Estate LLC - AI Assistants Management System (AIAMS) Logic Hook
 * Standard: AEGIS Canonical 12-Way Architecture Standard (Logic & State)
 * Single Purpose File Law: < 350 lines
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  INITIAL_AI_AGENTS_SEED,
  AI_DEPARTMENTS_OPTIONS,
  AIAMS_SYNC_EVENT,
  loadAiAgentsFromStorage,
  saveAiAgentsToStorage,
} from './AiAssistantManager.data';
import type {
  AiAgentRecord,
  AiAgentFormPayload,
  AiAgentStatus,
  AiAssistantManagerMetrics,
} from './AiAssistantManager.types';

export function useAiAssistantManager(initialTierFilter = 'all') {
  const [agents, setAgents] = useState<AiAgentRecord[]>(() => loadAiAgentsFromStorage());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>(initialTierFilter);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [statusToast, setStatusToast] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [editingAgent, setEditingAgent] = useState<AiAgentRecord | null>(null);

  useEffect(() => {
    setSelectedTier(initialTierFilter);
  }, [initialTierFilter]);

  useEffect(() => {
    const handleStorageSync = (e: Event) => {
      const customEvent = e as CustomEvent<AiAgentRecord[]>;
      if (Array.isArray(customEvent.detail)) {
        setAgents(customEvent.detail);
      } else {
        setAgents(loadAiAgentsFromStorage());
      }
    };
    window.addEventListener(AIAMS_SYNC_EVENT, handleStorageSync);
    return () => window.removeEventListener(AIAMS_SYNC_EVENT, handleStorageSync);
  }, []);

  const showToast = useCallback((msg: string) => {
    setStatusToast(msg);
  }, []);

  const persistAgents = useCallback((nextAgents: AiAgentRecord[]) => {
    setAgents(nextAgents);
    saveAiAgentsToStorage(nextAgents);
  }, []);

  const handleCreateAgent = useCallback(
    async (payload: AiAgentFormPayload) => {
      const cleanId =
        (payload.agentId || payload.name)
          .toLowerCase()
          .replace(/[^a-z0-9_-]+/g, '_')
          .replace(/^_|_$/g, '') || `ai_agent_${Date.now()}`;

      const deptMatch = AI_DEPARTMENTS_OPTIONS.find(
        d => d.id === payload.departmentId || d.name === payload.department
      );

      const newAgent: AiAgentRecord = {
        id: `ai-${Date.now()}`,
        agentId: cleanId,
        code: payload.code?.trim() || `AI-${cleanId.slice(0, 6).toUpperCase()}`,
        name: payload.name.trim(),
        role: payload.role.trim(),
        departmentId: payload.departmentId || deptMatch?.id || 'luxury_sales',
        department: payload.department || deptMatch?.name || 'Luxury Sales & Brokerage',
        tier: payload.tier || 'SUPERVISOR',
        status: payload.status || 'ACTIVE',
        model: payload.model || 'gemini-1.5-flash',
        specialty: payload.specialty?.trim() || payload.role.trim(),
        systemPrompt:
          payload.systemPrompt?.trim() ||
          `Autonomous AI agent specialized in ${payload.role.trim()}.`,
        capabilities:
          payload.capabilities && payload.capabilities.length > 0
            ? payload.capabilities
            : ['Autonomous Execution', '15-Min SLA', 'Bilingual EN/AR'],
        assignedTasks:
          payload.assignedTasks && payload.assignedTasks.length > 0
            ? payload.assignedTasks
            : [`Execute ${payload.role.trim()} workflows`],
        slaResponseTime: payload.slaResponseTime || '< 4s',
        accuracyRate: payload.accuracyRate ?? 99.8,
        activeWorkload: payload.activeWorkload ?? 0,
      };

      const updated = [newAgent, ...agents.filter(a => a.agentId !== newAgent.agentId)];
      persistAgents(updated);
      setIsDrawerOpen(false);
      setEditingAgent(null);
      showToast(`Registered AI Agent "${newAgent.name}" (${newAgent.code})`);

      try {
        await fetch('/api/v1/ai-assistants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAgent),
        });
      } catch {
        // Local persistence remains authoritative in offline/dev mode
      }
    },
    [agents, persistAgents, showToast]
  );

  const handleUpdateAgent = useCallback(
    async (targetAgentId: string, payload: Partial<AiAgentFormPayload>) => {
      const updated = agents.map(agent => {
        if (agent.agentId !== targetAgentId && agent.id !== targetAgentId) return agent;
        return {
          ...agent,
          ...payload,
          name: payload.name !== undefined ? payload.name : agent.name,
          role: payload.role !== undefined ? payload.role : agent.role,
          department: payload.department !== undefined ? payload.department : agent.department,
          departmentId:
            payload.departmentId !== undefined ? payload.departmentId : agent.departmentId,
          tier: payload.tier !== undefined ? payload.tier : agent.tier,
          status: payload.status !== undefined ? payload.status : agent.status,
          model: payload.model !== undefined ? payload.model : agent.model,
          specialty: payload.specialty !== undefined ? payload.specialty : agent.specialty,
          systemPrompt:
            payload.systemPrompt !== undefined ? payload.systemPrompt : agent.systemPrompt,
          capabilities:
            payload.capabilities !== undefined ? payload.capabilities : agent.capabilities,
        };
      });

      persistAgents(updated);
      setIsDrawerOpen(false);
      setEditingAgent(null);
      showToast(`Updated AI Agent "${payload.name || targetAgentId}"`);

      try {
        await fetch(`/api/v1/ai-assistants/${encodeURIComponent(targetAgentId)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {
        // Local persistence remains authoritative
      }
    },
    [agents, persistAgents, showToast]
  );

  const handleDeleteAgent = useCallback(
    async (targetAgentId: string) => {
      const target = agents.find(a => a.agentId === targetAgentId || a.id === targetAgentId);
      const updated = agents.filter(a => a.agentId !== targetAgentId && a.id !== targetAgentId);
      persistAgents(updated);
      showToast(`Removed AI Agent "${target?.name || targetAgentId}" from active mesh`);

      try {
        await fetch(`/api/v1/ai-assistants/${encodeURIComponent(targetAgentId)}`, {
          method: 'DELETE',
        });
      } catch {
        // Local persistence remains authoritative
      }
    },
    [agents, persistAgents, showToast]
  );

  const handleToggleStatus = useCallback(
    (targetAgentId: string) => {
      const order: AiAgentStatus[] = ['OPTIMAL', 'ACTIVE', 'BUSY', 'STANDBY'];
      const updated = agents.map(agent => {
        if (agent.agentId !== targetAgentId && agent.id !== targetAgentId) return agent;
        const nextStatus = order[(order.indexOf(agent.status) + 1) % order.length];
        return { ...agent, status: nextStatus };
      });
      persistAgents(updated);
    },
    [agents, persistAgents]
  );

  const handleResetDefaults = useCallback(() => {
    persistAgents(INITIAL_AI_AGENTS_SEED);
    showToast('Restored all canonical 1-12-108 AI Assistants (122 Agents)');
  }, [persistAgents, showToast]);

  const handleOpenCreate = useCallback(() => {
    setEditingAgent(null);
    setIsDrawerOpen(true);
  }, []);

  const handleOpenEdit = useCallback((agent: AiAgentRecord) => {
    setEditingAgent(agent);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setEditingAgent(null);
  }, []);

  const filteredAgents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return agents.filter(agent => {
      const matchesDept =
        selectedDepartment === 'all' ||
        agent.departmentId === selectedDepartment ||
        agent.department.toLowerCase().includes(selectedDepartment.toLowerCase());
      const matchesTier =
        selectedTier === 'all' ||
        (selectedTier === 'MANAGERS'
          ? agent.tier === 'EXECUTIVE' || agent.tier === 'MANAGER'
          : agent.tier === selectedTier);
      const matchesStatus =
        selectedStatus === 'all' || agent.status.toLowerCase() === selectedStatus.toLowerCase();
      const matchesSearch =
        !q ||
        agent.name.toLowerCase().includes(q) ||
        agent.agentId.toLowerCase().includes(q) ||
        agent.code.toLowerCase().includes(q) ||
        agent.role.toLowerCase().includes(q) ||
        agent.department.toLowerCase().includes(q) ||
        agent.specialty.toLowerCase().includes(q) ||
        agent.model.toLowerCase().includes(q) ||
        agent.capabilities.some(c => c.toLowerCase().includes(q));

      return matchesDept && matchesTier && matchesStatus && matchesSearch;
    });
  }, [agents, searchQuery, selectedDepartment, selectedTier, selectedStatus]);

  const metrics: AiAssistantManagerMetrics = useMemo(() => {
    const total = agents.length;
    const activeCount = agents.filter(a => a.status === 'ACTIVE' || a.status === 'OPTIMAL').length;
    const executivesAndManagers = agents.filter(
      a => a.tier === 'EXECUTIVE' || a.tier === 'MANAGER'
    ).length;
    const supervisors = agents.filter(a => a.tier === 'SUPERVISOR').length;
    const totalWorkload = agents.reduce((sum, a) => sum + (a.activeWorkload || 0), 0);
    return { total, activeCount, executivesAndManagers, supervisors, totalWorkload };
  }, [agents]);

  return {
    agents,
    filteredAgents,
    searchQuery,
    setSearchQuery,
    selectedDepartment,
    setSelectedDepartment,
    selectedTier,
    setSelectedTier,
    selectedStatus,
    setSelectedStatus,
    statusToast,
    setStatusToast,
    isDrawerOpen,
    editingAgent,
    metrics,
    departmentsOptions: AI_DEPARTMENTS_OPTIONS,
    handleCreateAgent,
    handleUpdateAgent,
    handleDeleteAgent,
    handleToggleStatus,
    handleResetDefaults,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseDrawer,
  };
}
