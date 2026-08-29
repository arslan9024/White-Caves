import React, { FC, useState } from 'react';
import { Search, Zap, CheckCircle2, Shield, Activity, ArrowUpRight, Crown, Users, LayoutGrid, GitFork } from 'lucide-react';
import { useAICommandCenterLogic } from './logic/AICommandCenter.logic';
import { COMMAND_CENTER_TEXT } from './data/AICommandCenter.data';
import type { DepartmentDef, SupervisorDef } from '../../../data/assistants108Registry.data';
import AIOrganogramTree from '../../dashboard/organogram/AIOrganogramTree';
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
  const [viewMode, setViewMode] = useState<'grid' | 'organogram'>('grid');
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
      {/* ── HEADER BANNER & VIEW TOGGLE ─────────────────────────────────── */}
      <HeaderBanner>
        <div>
          <h1>{COMMAND_CENTER_TEXT.header.title}</h1>
          <p>{COMMAND_CENTER_TEXT.header.subtitle}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* View Mode Toggle Switch */}
          <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '8px', padding: '3px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? '#0F172A' : 'transparent',
                color: viewMode === 'grid' ? '#FFFFFF' : '#475569',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <LayoutGrid size={14} /> Grid Cards
            </button>
            <button
              onClick={() => setViewMode('organogram')}
              style={{
                background: viewMode === 'organogram' ? '#EF4444' : 'transparent',
                color: viewMode === 'organogram' ? '#FFFFFF' : '#475569',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <GitFork size={14} /> 🌳 Organogram Tree
            </button>
          </div>

          <LiveBadge>{COMMAND_CENTER_TEXT.header.badge}</LiveBadge>
        </div>
      </HeaderBanner>

      {/* ── CONDITIONAL ORGANOGRAM TREE VIEW ───────────────────────────────── */}
      {viewMode === 'organogram' ? (
        <div style={{ marginTop: '1rem' }}>
          <AIOrganogramTree
            onSelectAssistant={asst => {
              handleSelectAssistant(asst.id);
              setViewMode('grid');
            }}
          />
        </div>
      ) : (
        <>
          {/* ── LEVEL 0: EXECUTIVE COMMAND (1 MD + 1 ZOE) ────────────────────── */}
          <div style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderLeft: '4px solid #EF4444',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #EF4444',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                fontSize: '1.3rem',
              }}>
                <Crown size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 900, background: '#EF4444', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    Level 0 Sovereign Command
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 800 }}>● Active</span>
                </div>
                <h2 style={{ margin: '2px 0 0', fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF' }}>
                  {executive.managingDirector.name}
                </h2>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#94A3B8' }}>
                  {executive.managingDirector.title} • {executive.managingDirector.clearance}
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '8px 14px',
            }}>
              <img
                src={executive.executiveAi.avatar}
                alt={executive.executiveAi.name}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #EF4444' }}
              />
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
        </>
      )}
    </CommandCenterContainer>
  );
};

export default AICommandCenter;
