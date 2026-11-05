import React, { FC } from 'react';
import { Building2, Layers, Shield, Users } from 'lucide-react';
import { StatsDeck, StatCard } from './DepartmentManagementWorkspace.styles';

export interface DepartmentStatsDeckProps {
  metrics: {
    totalDepartments: number;
    totalSubDepts: number;
    totalSquads: number;
    totalHeadcount: number;
  };
}

export const DepartmentStatsDeck: FC<DepartmentStatsDeckProps> = ({ metrics }) => {
  return (
    <StatsDeck>
      <StatCard $accent="#EF4444">
        <div className="stat-icon">
          <Building2 size={20} />
        </div>
        <div className="stat-meta">
          <span className="num">{metrics.totalDepartments || 12}</span>
          <span className="label">Departments</span>
        </div>
      </StatCard>

      <StatCard $accent="#3B82F6">
        <div className="stat-icon">
          <Layers size={20} />
        </div>
        <div className="stat-meta">
          <span className="num">{metrics.totalSubDepts || 108}</span>
          <span className="label">Sub-Departments</span>
        </div>
      </StatCard>

      <StatCard $accent="#10B981">
        <div className="stat-icon">
          <Shield size={20} />
        </div>
        <div className="stat-meta">
          <span className="num">{metrics.totalSquads || 108}</span>
          <span className="label">Operational Squads</span>
        </div>
      </StatCard>

      <StatCard $accent="#F59E0B">
        <div className="stat-icon">
          <Users size={20} />
        </div>
        <div className="stat-meta">
          <span className="num">{metrics.totalHeadcount || 121}</span>
          <span className="label">Assigned Personnel</span>
        </div>
      </StatCard>
    </StatsDeck>
  );
};
