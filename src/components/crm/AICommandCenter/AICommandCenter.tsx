import React, { FC, useState } from 'react';
import { Search, CheckCircle2, Shield, ArrowUpRight, Crown, Users, LayoutGrid, GitFork, AlertTriangle } from 'lucide-react';
import { useAICommandCenterLogic } from './logic/AICommandCenter.logic';
import {
  COMMAND_CENTER_TEXT,
  MOCK_STAFFING_ASSIGNMENTS,
} from './data/AICommandCenter.data';
import type { DepartmentDef, SupervisorDef } from '../../../data/assistants108Registry.data';
import AIOrganogramTree from '../../dashboard/organogram/AIOrganogramTree';
import {
  CommandCenterContainer,
  HeaderBanner,
  RegistryBadge,
  IntegrityPanel,
  MockAssignments,
  MockAssignmentList,
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
    structureAudit,
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
              type="button"
              aria-pressed={viewMode === 'grid'}
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
              type="button"
              aria-pressed={viewMode === 'organogram'}
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

          <RegistryBadge>{COMMAND_CENTER_TEXT.header.badge}</RegistryBadge>
        </div>
      </HeaderBanner>

      <IntegrityPanel data-testid="framework-integrity">
        <div className="integrity-header">
          <div>
            <h2>{COMMAND_CENTER_TEXT.audit.title}</h2>
            <p>{COMMAND_CENTER_TEXT.audit.description}</p>
          </div>
          <RegistryBadge role="status" data-testid="framework-integrity-status">
            {structureAudit.isValid ? 'COMPLIANT' : 'REVIEW REQUIRED'}
          </RegistryBadge>
        </div>
        <ul>
          <li>Executive profile: {structureAudit.executivePresent ? '1 / 1' : '0 / 1'}</li>
          <li>Departments: {structureAudit.totalDepartments} / 12</li>
          <li>Supervisor slots: {structureAudit.totalSupervisors} / 108</li>
          <li>Open allocations in registry: {structureAudit.openSlots.length}</li>
        </ul>
        {structureAudit.errors.length > 0 && (
          <ul role="alert" aria-label="Structural validation errors">
            {structureAudit.errors.map(error => <li key={error}>{error}</li>)}
          </ul>
        )}
        {structureAudit.openSlots.length > 0 && (
          <ul aria-label="Open supervisor allocations">
            {structureAudit.openSlots.map(slot => (
              <li key={`${slot.departmentCode}-${slot.id}`}>
                {slot.departmentCode} · {slot.departmentTitle} · {slot.id} is unassigned.
              </li>
            ))}
          </ul>
        )}
        {structureAudit.isValid && <p>{COMMAND_CENTER_TEXT.audit.success}</p>}
        <MockAssignments>
          <summary>{COMMAND_CENTER_TEXT.audit.mockAssignmentsTitle}</summary>
          <p>{COMMAND_CENTER_TEXT.audit.mockAssignmentsDescription}</p>
          <MockAssignmentList>
            {MOCK_STAFFING_ASSIGNMENTS.map(assignment => (
              <li key={assignment.slotId}>
                <strong>{assignment.employeeName}</strong>
                <span>{assignment.roleTitle} · {assignment.departmentCode}</span>
                <span>{assignment.departmentName}</span>
                <span>{assignment.slotId} · {assignment.slotStatus}</span>
                <span>{assignment.assignmentStatus} · fictional preview</span>
              </li>
            ))}
          </MockAssignmentList>
        </MockAssignments>
      </IntegrityPanel>

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
            background: 'linear-gradient(135deg, #1E293B 0%, #1E293B 100%)',
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
                  <span style={{ fontSize: '0.72rem', color: '#EF4444', fontWeight: 800 }}>
                    Configured profile
                  </span>
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
                <span className="label">{COMMAND_CENTER_TEXT.stats.departmentsLabel}</span>
                <strong className="value">{stats.totalDepartments} / 12</strong>
              </div>
              <div className="stat-icon"><Users size={22} /></div>
            </StatCardWrapper>

            <StatCardWrapper $color="#1E293B">
              <div className="stat-info">
                <span className="label">{COMMAND_CENTER_TEXT.stats.supervisorsLabel}</span>
                <strong className="value">{stats.totalSupervisors} / 108</strong>
              </div>
              <div className="stat-icon"><Shield size={22} /></div>
            </StatCardWrapper>

            <StatCardWrapper $color="#1E293B">
              <div className="stat-info">
                <span className="label">{COMMAND_CENTER_TEXT.stats.openSlotsLabel}</span>
                <strong className="value">{stats.openSlots}</strong>
              </div>
              <div className="stat-icon"><AlertTriangle size={22} /></div>
            </StatCardWrapper>

            <StatCardWrapper $color="#EF4444">
              <div className="stat-info">
                <span className="label">{COMMAND_CENTER_TEXT.stats.integrityLabel}</span>
                <strong className="value">{stats.structureValid ? 'PASS' : 'REVIEW'}</strong>
              </div>
              <div className="stat-icon"><CheckCircle2 size={22} /></div>
            </StatCardWrapper>
          </StatsGrid>

          {/* ── FILTER & SEARCH BAR ──────────────────────────────────────────── */}
          <FilterBar>
            <SearchInputWrapper>
              <Search size={18} className="search-icon" />
              <input
                type="text"
                aria-label="Search configured supervisor profiles"
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
                type="button"
                aria-pressed={selectedDept === 'all'}
                data-testid="dept-pill-all"
              >
                {COMMAND_CENTER_TEXT.filters.allDepartments} ({stats.totalSupervisors} configured)
              </DeptPill>
              {departments.map((dept: DepartmentDef) => (
                <DeptPill
                  key={dept.id}
                  $active={selectedDept === dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  type="button"
                  aria-pressed={selectedDept === dept.id}
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
                    Specialty: {agent.specialty}
                  </div>

                  <div style={{ margin: '0 0 8px', fontSize: '0.75rem', color: 'var(--text-secondary, #475569)', lineHeight: 1.4 }}>
                    <strong style={{ display: 'block', color: 'var(--color-1e293b, #1E293B)', marginBottom: '2px' }}>Configured responsibilities:</strong>
                    {agent.assignedTasks.map((t, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: '#1E293B', fontWeight: 800 }}>•</span> {t}
                      </div>
                    ))}
                  </div>

                  <TagList>
                    {agent.capabilities.slice(0, 3).map((cap: string, i: number) => (
                      <CapabilityTag key={i}>{cap}</CapabilityTag>
                    ))}
                  </TagList>

                  <LaunchBtn
                    onClick={() => handleSelectAssistant(agent.id)}
                    type="button"
                    aria-label={`Select ${agent.name} profile`}
                    data-testid={`btn-launch-${agent.id}`}
                  >
                    <span>Select {agent.name}</span>
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
