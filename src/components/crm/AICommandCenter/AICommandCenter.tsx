/**
 * AICommandCenter.tsx — View Layer (4-Way Component Architecture)
 * 1-12-108 Hierarchy Protocol Sovereign Command Grid
 */

import React, { FC } from 'react';
import { Search, Zap, CheckCircle2, Shield, Activity, ArrowUpRight, Crown, Users } from 'lucide-react';
import { useAICommandCenterLogic } from './logic/AICommandCenter.logic';
import { COMMAND_CENTER_TEXT } from './data/AICommandCenter.data';
import type { DepartmentDef, SupervisorDef } from '../../../data/assistants108Registry.data';
import {
  CommandCenterContainer,
  HeaderBanner,
  LiveBadge,
  StatsGrid,
  StatCardWrapper,
  FilterBar,
  SearchInputWrapper,
  DepartmentPills,
  DeptPill,
  AssistantsGrid,
  AssistantCard,
  AssistantHeader,
  TagList,
  CapabilityTag,
  MetricsRow,
  LaunchBtn,
} from './styles/AICommandCenter.style';

export const AICommandCenter: FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
    selectedAssistantId,
    handleSelectAssistant,
    filteredAssistants,
    departments,
    executive,
    stats,
  } = useAICommandCenterLogic();

  return (
    <CommandCenterContainer data-testid="ai-command-center-root">
      {/* ── HEADER BANNER ────────────────────────────────────────────────── */}
      <HeaderBanner>
        <div>
          <h1>{COMMAND_CENTER_TEXT.header.title}</h1>
          <p>{COMMAND_CENTER_TEXT.header.subtitle}</p>
        </div>
        <LiveBadge>{COMMAND_CENTER_TEXT.header.badge}</LiveBadge>
      </HeaderBanner>

      {/* ── LEVEL 0: EXECUTIVE COMMAND (1 MD + 1 ZOE) ────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderLeft: '4px solid #EF4444',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        color: '#FFFFFF'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
            <Crown size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Level 0 · Executive Founder Command
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '2px 0 0', color: '#F8FAFC' }}>
              {executive.managingDirector.name}
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              {executive.managingDirector.title} · DET: {executive.managingDirector.licenseDet} · RERA ORN: {executive.managingDirector.reraOrn}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.65rem 1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <img src={executive.executiveAi.avatar} alt={executive.executiveAi.name} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #EF4444' }} />
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF' }}>{executive.executiveAi.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 700 }}>{executive.executiveAi.title}</div>
          </div>
        </div>
      </div>

      {/* ── STATS SUMMARY BAR ────────────────────────────────────────────── */}
      <StatsGrid>
        <StatCardWrapper $color="#EF4444">
          <div className="stat-info">
            <span className="label">{COMMAND_CENTER_TEXT.stats.activeAgentsLabel}</span>
            <strong className="value">{stats.optimalCount} / {stats.totalAgents}</strong>
          </div>
          <div className="stat-icon"><Users size={22} /></div>
        </StatCardWrapper>

        <StatCardWrapper $color="#10B981">
          <div className="stat-info">
            <span className="label">{COMMAND_CENTER_TEXT.stats.systemHealthLabel}</span>
            <strong className="value">100.0% Optimal</strong>
          </div>
          <div className="stat-icon"><CheckCircle2 size={22} /></div>
        </StatCardWrapper>

        <StatCardWrapper $color="#F59E0B">
          <div className="stat-info">
            <span className="label">{COMMAND_CENTER_TEXT.stats.tasksExecutedLabel}</span>
            <strong className="value">{stats.totalTasksToday}</strong>
          </div>
          <div className="stat-icon"><Activity size={22} /></div>
        </StatCardWrapper>

        <StatCardWrapper $color="#6366F1">
          <div className="stat-info">
            <span className="label">{COMMAND_CENTER_TEXT.stats.slaAdherenceLabel}</span>
            <strong className="value">{stats.slaAdherence}</strong>
          </div>
          <div className="stat-icon"><Shield size={22} /></div>
        </StatCardWrapper>
      </StatsGrid>

      {/* ── FILTER & SEARCH BAR ──────────────────────────────────────────── */}
      <FilterBar>
        <SearchInputWrapper>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder={COMMAND_CENTER_TEXT.filters.searchPlaceholder}
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            data-testid="ai-search-input"
          />
        </SearchInputWrapper>

        <DepartmentPills>
          <DeptPill
            $active={selectedDept === 'all'}
            onClick={() => setSelectedDept('all')}
            data-testid="dept-pill-all"
          >
            {COMMAND_CENTER_TEXT.filters.allDepartments} (108 Supervisors)
          </DeptPill>
          {departments.map((dept: DepartmentDef) => (
            <DeptPill
              key={dept.id}
              $active={selectedDept === dept.id}
              onClick={() => setSelectedDept(dept.id)}
              data-testid={`dept-pill-${dept.id}`}
            >
              {dept.name} ({dept.managerAi.name})
            </DeptPill>
          ))}
        </DepartmentPills>
      </FilterBar>

      {/* ── 108 OPERATIONAL SUPERVISORS GRID ─────────────────────────────── */}
      <AssistantsGrid data-testid="assistants-grid">
        {filteredAssistants.map((agent: SupervisorDef) => {
          const isSelected = selectedAssistantId === agent.id;
          return (
            <AssistantCard
              key={agent.id}
              $active={isSelected}
              data-testid={`agent-card-${agent.id}`}
            >
              <AssistantHeader>
                <img src={agent.avatar} alt={agent.name} />
                <div className="meta">
                  <h3>
                    <span>{agent.name}</span>
                    <span className="code">{agent.code}</span>
                  </h3>
                  <p className="title">{agent.title}</p>
                </div>
              </AssistantHeader>

              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-red, #EF4444)', margin: '0 0 6px' }}>
                📋 Specialty: {agent.specialty}
              </div>

              <div style={{ margin: '0 0 8px', fontSize: '0.75rem', color: 'var(--text-secondary, #475569)', lineHeight: 1.4 }}>
                <strong style={{ display: 'block', color: 'var(--color-1e293b, #1E293B)', marginBottom: '2px' }}>Assigned Tasks:</strong>
                {agent.assignedTasks.map((t, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#10B981', fontWeight: 800 }}>•</span> {t}
                  </div>
                ))}
              </div>

              <TagList>
                {agent.capabilities.slice(0, 3).map((cap: string, i: number) => (
                  <CapabilityTag key={i}>{cap}</CapabilityTag>
                ))}
              </TagList>

              <MetricsRow>
                <div className="metric-item">
                  <span className="label">Accuracy</span>
                  <strong className="val">{agent.metrics.accuracyRate}%</strong>
                </div>
                <div className="metric-item">
                  <span className="label">SLA Speed</span>
                  <strong className="val">{agent.slaResponseTime}</strong>
                </div>
                <div className="metric-item">
                  <span className="label">Tasks Today</span>
                  <strong className="val">{agent.metrics.tasksCompletedToday}</strong>
                </div>
              </MetricsRow>

              <LaunchBtn
                onClick={() => handleSelectAssistant(agent.id)}
                data-testid={`btn-launch-${agent.id}`}
              >
                <span>Launch {agent.name}</span>
                <ArrowUpRight size={16} />
              </LaunchBtn>
            </AssistantCard>
          );
        })}
      </AssistantsGrid>
    </CommandCenterContainer>
  );
};

export default AICommandCenter;
