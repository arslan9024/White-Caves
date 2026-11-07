// FILE: src/components/crm/AiAssistantManager/AiAssistantManagerView.tsx
/**
 * White Caves Real Estate LLC - AI Assistants Management System (AIAMS) Main View
 * Standard: AEGIS Canonical 12-Way Architecture Standard (View Layer)
 * Single Purpose File Law: < 350 lines
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Bot, Plus, RotateCcw, Search, GitFork, MessageSquare } from 'lucide-react';
import { aiamsStyles as s } from './AiAssistantManager.styles';
import { useAiAssistantManager } from './AiAssistantManager.logic';
import { AiAssistantEditDrawer } from './AiAssistantEditDrawer';
import { AiAssistantDetailDossier } from './AiAssistantDetailDossier';
import { AiAssistantCardsGrid } from './AiAssistantCardsGrid';
import AIOrganogramTree from '../../dashboard/organogram/AIOrganogramTree';
import LindaWhatsAppCRM from '../LindaWhatsAppCRM';

export interface AiAssistantManagerViewProps {
  selectedSubRoute?: string | null;
  isReadOnly?: boolean;
  onNavigate?: (route: string) => void;
}

const RESERVED_SUBROUTES = new Set([
  'agents',
  'crud',
  'managers',
  'supervisors',
  'organogram',
  'linda',
  'create',
]);

export const AiAssistantManagerView: React.FC<AiAssistantManagerViewProps> = ({
  selectedSubRoute = null,
  isReadOnly = false,
  onNavigate,
}) => {
  const initialTier =
    selectedSubRoute === 'managers'
      ? 'MANAGERS'
      : selectedSubRoute === 'supervisors'
        ? 'SUPERVISOR'
        : 'all';

  const [viewMode, setViewMode] = useState<'crud' | 'organogram' | 'linda'>(() => {
    if (selectedSubRoute === 'organogram') return 'organogram';
    if (selectedSubRoute === 'linda') return 'linda';
    return 'crud';
  });

  const {
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
    departmentsOptions,
    handleCreateAgent,
    handleUpdateAgent,
    handleDeleteAgent,
    handleToggleStatus,
    handleResetDefaults,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseDrawer,
  } = useAiAssistantManager(initialTier);

  useEffect(() => {
    if (selectedSubRoute === 'organogram') {
      setViewMode('organogram');
    } else if (selectedSubRoute === 'linda') {
      setViewMode('linda');
    } else if (selectedSubRoute === 'managers') {
      setViewMode('crud');
      setSelectedTier('MANAGERS');
    } else if (selectedSubRoute === 'supervisors') {
      setViewMode('crud');
      setSelectedTier('SUPERVISOR');
    } else if (selectedSubRoute === 'create') {
      setViewMode('crud');
      handleOpenCreate();
    } else {
      setViewMode('crud');
      if (selectedSubRoute === 'agents' || !selectedSubRoute) {
        setSelectedTier('all');
      }
    }
  }, [selectedSubRoute, setSelectedTier, handleOpenCreate]);

  const targetAgent = useMemo(() => {
    if (!selectedSubRoute || RESERVED_SUBROUTES.has(selectedSubRoute)) return null;
    const clean = selectedSubRoute.toLowerCase();
    return (
      agents.find(
        a =>
          a.agentId.toLowerCase() === clean ||
          a.id.toLowerCase() === clean ||
          a.code.toLowerCase() === clean
      ) || null
    );
  }, [selectedSubRoute, agents]);

  return (
    <div className={s.container} data-testid="aiams-manager-view">
      {targetAgent ? (
        <AiAssistantDetailDossier
          agent={targetAgent}
          onBack={() => onNavigate?.('/dashboard/aiams')}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteAgent}
          onToggleStatus={handleToggleStatus}
        />
      ) : (
        <>
          {/* ── 1. Sovereign Header & Actions ──────────────────────────────── */}
          <div className={s.headerWrapper}>
            <div className={s.headerLeft}>
              <div className={s.headerIcon}>
                <Bot size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 text-red-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-0.5">
                  System #11 · AI Assistants Management System (AIAMS)
                </div>
                <h1 className={s.headerTitle}>
                  Autonomous AI Workforce & 1-12-108 Agent CRUD Hub
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30">
                    {metrics.total} AI Agents Active
                  </span>
                </h1>
                <p className={s.headerSubtitle}>
                  Create, inspect, configure, and manage all AI Assistants across Executive Command
                  (AI Zoe), 12 Department Directors, and 108 Operational Supervisors.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setViewMode('crud')}
                  data-testid="aiams-tab-crud"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'crud'
                      ? 'bg-red-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bot size={13} />
                  <span>AI Agents CRUD</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('organogram')}
                  data-testid="aiams-tab-organogram"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'organogram'
                      ? 'bg-red-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <GitFork size={13} />
                  <span>1-12-108 Organogram</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('linda')}
                  data-testid="aiams-tab-linda"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'linda'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare size={13} />
                  <span>AI Linda CRM</span>
                </button>
              </div>

              {!isReadOnly && (
                <>
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    data-testid="aiams-reset-defaults-btn"
                    className={s.secondaryBtn}
                  >
                    <RotateCcw size={13} />
                    <span>Reset 1-12-108</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenCreate}
                    data-testid="aiams-add-agent-btn"
                    className={s.addBtn}
                  >
                    <Plus size={14} />
                    <span>Register AI Agent</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── 2. Real-Time Telemetry Row ─────────────────────────────────── */}
          <div className={s.metricsRow} data-testid="aiams-metrics-row">
            <div className={s.metricCard}>
              <span className={`${s.metricNumber} text-red-400`}>{metrics.total}</span>
              <span className={s.metricLabel}>Total Registered AI Agents</span>
            </div>
            <div className={s.metricCard}>
              <span className={`${s.metricNumber} text-amber-400`}>
                {metrics.executivesAndManagers}
              </span>
              <span className={s.metricLabel}>Executive & 12 Dept Directors</span>
            </div>
            <div className={s.metricCard}>
              <span className={`${s.metricNumber} text-sky-400`}>{metrics.supervisors}</span>
              <span className={s.metricLabel}>Operational Squad Supervisors</span>
            </div>
            <div className={s.metricCard}>
              <span className={`${s.metricNumber} text-emerald-400`}>
                {metrics.totalWorkload.toLocaleString()}
              </span>
              <span className={s.metricLabel}>Autonomous Tasks Executed Today</span>
            </div>
          </div>

          {statusToast && (
            <div className={s.statusToast} data-testid="aiams-status-toast">
              <span>⚡ {statusToast}</span>
              <button
                type="button"
                onClick={() => setStatusToast(null)}
                className="text-xs text-red-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {viewMode === 'organogram' ? (
            <AIOrganogramTree
              onSelectAssistant={asst => {
                onNavigate?.(`/dashboard/aiams/${asst.id}`);
              }}
            />
          ) : viewMode === 'linda' ? (
            <LindaWhatsAppCRM />
          ) : (
            <>
              {/* ── 3. Search & Filter Bar ───────────────────────────────────── */}
              <div className={s.controlsBar}>
                <div className={s.searchBox}>
                  <Search size={14} className={s.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search AI agents by name, code, role, department, model, capability..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={s.searchInput}
                    data-testid="aiams-search-input"
                  />
                </div>

                <div className={s.filterGroup}>
                  <select
                    value={selectedDepartment}
                    onChange={e => setSelectedDepartment(e.target.value)}
                    className={s.filterSelect}
                    data-testid="aiams-filter-department"
                  >
                    {departmentsOptions.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedTier}
                    onChange={e => setSelectedTier(e.target.value)}
                    className={s.filterSelect}
                    data-testid="aiams-filter-tier"
                  >
                    <option value="all">All Hierarchy Tiers</option>
                    <option value="MANAGERS">Executive & Directors (L0–L1)</option>
                    <option value="EXECUTIVE">Executive Only (AI Zoe)</option>
                    <option value="MANAGER">12 Dept Managers (L1)</option>
                    <option value="SUPERVISOR">108 Squad Supervisors (L2)</option>
                    <option value="SPECIALIST">Autonomous Specialists</option>
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                    className={s.filterSelect}
                    data-testid="aiams-filter-status"
                  >
                    <option value="all">All Statuses</option>
                    <option value="OPTIMAL">Optimal</option>
                    <option value="ACTIVE">Active</option>
                    <option value="BUSY">Busy</option>
                    <option value="STANDBY">Standby</option>
                  </select>
                </div>
              </div>

              {/* ── 4. AI Assistants CRUD Grid ───────────────────────────────── */}
              <AiAssistantCardsGrid
                agents={filteredAgents}
                onInspect={agentId => onNavigate?.(`/dashboard/aiams/${agentId}`)}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteAgent}
                onToggleStatus={handleToggleStatus}
              />
            </>
          )}
        </>
      )}

      {/* ── 5. Create / Edit Modal Drawer ────────────────────────────────── */}
      <AiAssistantEditDrawer
        isOpen={isDrawerOpen}
        agent={editingAgent}
        onClose={handleCloseDrawer}
        onSave={payload => {
          if (editingAgent) {
            handleUpdateAgent(editingAgent.agentId, payload);
          } else {
            handleCreateAgent(payload);
          }
        }}
      />
    </div>
  );
};

export default AiAssistantManagerView;
