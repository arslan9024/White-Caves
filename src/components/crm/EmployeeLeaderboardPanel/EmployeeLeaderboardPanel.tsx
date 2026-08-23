/**
 * EmployeeLeaderboardPanel.tsx — View Layer (4-Way Component Architecture)
 * Sits at folder root: Pure presentational shell drawing data variables and logic hooks.
 */

import React, { FC } from 'react';
import { useEmployeeLeaderboardPanelLogic } from './logic/EmployeeLeaderboardPanel.logic';
import { LEADERBOARD_TEXT, LEVEL_LABELS, LEVEL_COLORS } from './data/EmployeeLeaderboardPanel.data';
import {
  Container,
  Header,
  Title,
  Subtitle,
  ToggleContainer,
  ToggleBtn,
  DeptSelector,
  DeptPill,
  GridCards,
  PersonnelCard,
  Avatar,
  Details,
  LevelBadge,
} from './styles/EmployeeLeaderboardPanel.style';

export const EmployeeLeaderboardPanel: FC = () => {
  const {
    departments,
    activeDeptId,
    setActiveDeptId,
    viewMode,
    setViewMode,
    manager,
    supervisors,
    juniors,
    interns,
    globalTopManagers,
  } = useEmployeeLeaderboardPanelLogic();

  return (
    <Container data-testid="employee-leaderboard-panel">
      {/* Header */}
      <Header>
        <div>
          <Title>{LEADERBOARD_TEXT.headerTitle}</Title>
          <Subtitle>{LEADERBOARD_TEXT.headerSubtitle}</Subtitle>
        </div>

        {/* View Mode Toggle */}
        <ToggleContainer>
          <ToggleBtn
            $active={viewMode === 'department'}
            onClick={() => setViewMode('department')}
            data-testid="toggle-by-dept"
          >
            {LEADERBOARD_TEXT.byDeptBtn}
          </ToggleBtn>
          <ToggleBtn
            $active={viewMode === 'global'}
            $color="#D4AF37"
            onClick={() => setViewMode('global')}
            data-testid="toggle-by-global"
          >
            {LEADERBOARD_TEXT.globalManagersBtn}
          </ToggleBtn>
        </ToggleContainer>
      </Header>

      {viewMode === 'department' ? (
        <>
          {/* Department Pills */}
          <DeptSelector>
            {departments.map(d => (
              <DeptPill
                key={d.id}
                $active={activeDeptId === d.id}
                onClick={() => setActiveDeptId(d.id)}
                data-testid={`dept-pill-${d.id}`}
              >
                <span>{d.icon}</span> {d.name}
              </DeptPill>
            ))}
          </DeptSelector>

          {/* Department Manager Highlight */}
          {manager && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--accent-red, #EF4444)', fontWeight: 800, margin: '0 0 10px' }}>
                {LEADERBOARD_TEXT.managerTitle}
              </h4>
              <PersonnelCard style={{ border: '2px solid var(--accent-red, #EF4444)', background: 'rgba(239, 68, 68, 0.03)' }}>
                <Avatar $color={LEVEL_COLORS[4]}>
                  {manager.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Details>
                  <h4>{manager.name}</h4>
                  <p>{manager.roleTitle} · {manager.email}</p>
                </Details>
                <LevelBadge $color={LEVEL_COLORS[4]}>{LEVEL_LABELS[4]}</LevelBadge>
              </PersonnelCard>
            </div>
          )}

          {/* Supervisors */}
          {supervisors.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--accent-purple, #7C3AED)', fontWeight: 800, margin: '0 0 10px' }}>
                {LEADERBOARD_TEXT.supervisorTitle} ({supervisors.length})
              </h4>
              <GridCards>
                {supervisors.map(s => (
                  <PersonnelCard key={s.id}>
                    <Avatar $color={LEVEL_COLORS[3]}>
                      {s.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Details>
                      <h4>{s.name}</h4>
                      <p>{s.roleTitle}</p>
                    </Details>
                    <LevelBadge $color={LEVEL_COLORS[3]}>{LEVEL_LABELS[3]}</LevelBadge>
                  </PersonnelCard>
                ))}
              </GridCards>
            </div>
          )}

          {/* Junior Agents */}
          {juniors.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--color-0ea5e9, #0EA5E9)', fontWeight: 800, margin: '0 0 10px' }}>
                {LEADERBOARD_TEXT.juniorsTitle} ({juniors.length})
              </h4>
              <GridCards>
                {juniors.map(j => (
                  <PersonnelCard key={j.id}>
                    <Avatar $color={LEVEL_COLORS[2]}>
                      {j.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Details>
                      <h4>{j.name}</h4>
                      <p>{j.roleTitle}</p>
                    </Details>
                    <LevelBadge $color={LEVEL_COLORS[2]}>{LEVEL_LABELS[2]}</LevelBadge>
                  </PersonnelCard>
                ))}
              </GridCards>
            </div>
          )}

          {/* Interns */}
          {interns.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--color-94a3b8, #94A3B8)', fontWeight: 800, margin: '0 0 10px' }}>
                {LEADERBOARD_TEXT.internsTitle} ({interns.length})
              </h4>
              <GridCards>
                {interns.map(i => (
                  <PersonnelCard key={i.id}>
                    <Avatar $color={LEVEL_COLORS[1]}>
                      {i.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Details>
                      <h4>{i.name}</h4>
                      <p>{i.roleTitle}</p>
                    </Details>
                    <LevelBadge $color={LEVEL_COLORS[1]}>{LEVEL_LABELS[1]}</LevelBadge>
                  </PersonnelCard>
                ))}
              </GridCards>
            </div>
          )}
        </>
      ) : (
        /* Global 12 Department Managers */
        <GridCards data-testid="global-managers-grid">
          {globalTopManagers.map(m => (
            <PersonnelCard key={m.id} style={{ border: '1.5px solid var(--color-d4af37, #D4AF37)' }}>
              <Avatar $color="#D4AF37">
                {m.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Details>
                <h4>{m.name}</h4>
                <p>{m.roleTitle}</p>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-red, #EF4444)', fontWeight: 700 }}>
                  Dept: {m.assignedDepartment.toUpperCase()}
                </span>
              </Details>
              <LevelBadge $color="#D4AF37">L4 MANAGER</LevelBadge>
            </PersonnelCard>
          ))}
        </GridCards>
      )}
    </Container>
  );
};

export default EmployeeLeaderboardPanel;
