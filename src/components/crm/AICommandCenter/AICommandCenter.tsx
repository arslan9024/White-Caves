/**
 * AICommandCenter.tsx — View Layer (4-Way Component Architecture)
 * Sits at folder root: Pure presentational markup drawing data variables and logic hooks.
 */

import React, { FC } from 'react';
import { Search, Zap, CheckCircle2, Shield, Activity, ArrowUpRight } from 'lucide-react';
import { useAICommandCenterLogic } from './logic/AICommandCenter.logic';
import { COMMAND_CENTER_TEXT } from './data/AICommandCenter.data';
import type { DepartmentDef, AssistantDef } from '../../../data/assistants35Registry.data';
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

      {/* ── STATS SUMMARY BAR ────────────────────────────────────────────── */}
      <StatsGrid>
        <StatCardWrapper $color="#EF4444">
          <div className="stat-info">
            <span className="label">{COMMAND_CENTER_TEXT.stats.activeAgentsLabel}</span>
            <strong className="value">{stats.optimalCount} / {stats.totalAgents}</strong>
          </div>
          <div className="stat-icon"><Zap size={22} /></div>
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
            {COMMAND_CENTER_TEXT.filters.allDepartments} ({stats.totalAgents})
          </DeptPill>
          {departments.map((dept: DepartmentDef) => (
            <DeptPill
              key={dept.id}
              $active={selectedDept === dept.id}
              onClick={() => setSelectedDept(dept.id)}
              data-testid={`dept-pill-${dept.id}`}
            >
              {dept.name}
            </DeptPill>
          ))}
        </DepartmentPills>
      </FilterBar>

      {/* ── 35 AI ASSISTANTS GRID ────────────────────────────────────────── */}
      <AssistantsGrid data-testid="assistants-grid">
        {filteredAssistants.map((agent: AssistantDef) => {
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

              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary, #475569)', lineHeight: 1.45 }}>
                {agent.description}
              </p>

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
