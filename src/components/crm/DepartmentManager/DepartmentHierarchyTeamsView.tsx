import React from 'react';
import { hierarchyStyles as s } from './DepartmentHierarchy.styles';
import { DepartmentTeam } from './DepartmentHierarchy.types';

interface DepartmentHierarchyTeamsViewProps {
  activeTeams: DepartmentTeam[];
  selectedManagerId: string;
  onOpenEdit: (tier: 'SUPERVISOR', team: DepartmentTeam) => void;
  onDemoteEntity: (tier: 'SUPERVISOR', id: string, deptId?: string, managerId?: string) => void;
}

export const DepartmentHierarchyTeamsView: React.FC<DepartmentHierarchyTeamsViewProps> = ({
  activeTeams,
  selectedManagerId,
  onOpenEdit,
  onDemoteEntity,
}) => {
  return (
    <div className={s.teamsContainer} data-testid="teams-container">
      {activeTeams.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800">
          No operational teams assigned to this division. Drag a unit from the Unassigned Pool
          below.
        </div>
      ) : (
        activeTeams.map(team => (
          <div key={team._id} className={s.teamCard} data-testid={`team-row-${team.teamCode}`}>
            <div className={s.teamIdentity}>
              <div className={s.teamAvatarBadge}>🛡️</div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className={s.teamName}>{team.teamName}</h4>
                  <span className={s.codePill}>{team.teamCode}</span>
                  <span className={`${s.tierBadge} ${s.tierL3}`}>{team.supervisorCode}</span>
                </div>
                <div className={s.teamSupervisor}>
                  Supervisor:{' '}
                  <span className="text-slate-200 font-semibold">{team.supervisorName}</span> (
                  {team.supervisorRole})
                </div>
              </div>
            </div>

            <div className={s.capabilitiesTags}>
              {team.capabilities.map((cap, i) => (
                <span key={i} className={s.capabilityTag}>
                  {cap}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className={s.slaPill}>{team.slaResponseTime}</span>
              <button
                onClick={() => onOpenEdit('SUPERVISOR', team)}
                className={s.iconActionBtn}
                title="Edit Team"
              >
                ✏️
              </button>
              <button
                onClick={() => onDemoteEntity('SUPERVISOR', team._id, undefined, selectedManagerId)}
                className={s.demoteBtn}
                title="Demote to Pool"
                data-testid={`demote-team-${team.teamCode}`}
              >
                ⬇️
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
