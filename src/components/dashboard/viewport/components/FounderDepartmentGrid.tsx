/**
 * FounderDepartmentGrid.tsx
 * 12 Corporate Departments Live Health Matrix, listing managers, AI leads, and supervisor headcount.
 */

import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { CORPORATE_DEPARTMENTS_DATA, DepartmentStatus } from '../FounderExecutiveDashboard.data';

export interface FounderDepartmentGridProps {
  onNavigateToModule: (moduleId: string) => void;
}

export const FounderDepartmentGrid: FC<FounderDepartmentGridProps> = ({ onNavigateToModule }) => {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        padding: '1.5rem',
        boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
            🏛️ 12 Corporate Departments Operational Status
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748B' }}>
            Each department is managed by a Human Manager paired with an AI Lead and 9 Specialized Supervisors (108 Total).
          </p>
        </div>

        <span
          style={{
            background: '#F1F5F9',
            color: '#475569',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 800,
          }}
        >
          Total Mesh: 121 AI Agents
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {CORPORATE_DEPARTMENTS_DATA.map((dept: DepartmentStatus) => (
          <motion.div
            key={dept.id}
            whileHover={{ y: -2, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}
            onClick={() => onNavigateToModule(dept.moduleId)}
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '1rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.3rem' }}>{dept.icon}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0F172A' }}>{dept.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    👤 {dept.manager} • 🤖 {dept.aiLead}
                  </div>
                </div>
              </div>
              <span
                style={{
                  background: dept.health === 'Optimal' ? '#DCFCE7' : '#DBEAFE',
                  color: dept.health === 'Optimal' ? '#166534' : '#1E40AF',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                {dept.health}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '8px', marginTop: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                👥 <strong>{dept.supervisors}</strong> Supervisors
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#EF4444' }}>
                {dept.metric} ➔
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FounderDepartmentGrid;
