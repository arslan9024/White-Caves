/**
 * FounderDepartmentGrid.tsx
 * 12 Corporate Departments Live Health Matrix with direct 1-click modal expander (Target T-0104).
 */

import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CORPORATE_DEPARTMENTS_DATA, DepartmentStatus } from '../FounderExecutiveDashboard.data';

export interface FounderDepartmentGridProps {
  onNavigateToModule: (moduleId: string) => void;
}

export const FounderDepartmentGrid: FC<FounderDepartmentGridProps> = ({ onNavigateToModule }) => {
  const [expandedDept, setExpandedDept] = useState<DepartmentStatus | null>(null);

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
            role="button"
            tabIndex={0}
            data-testid={`dept-card-${dept.id}`}
            whileHover={{ y: -2, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}
            onClick={() => setExpandedDept(dept)}
            onKeyDown={e => e.key === 'Enter' && setExpandedDept(dept)}
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
                {dept.metric} 🔍
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Target T-0104: 1-Click Department Detail Expander Modal */}
      <AnimatePresence>
        {expandedDept && (
          <div
            role="dialog"
            aria-labelledby="expanded-dept-title"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9999,
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
            onClick={() => setExpandedDept(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '520px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  padding: '1.25rem 1.5rem',
                  color: '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{expandedDept.icon}</span>
                  <div>
                    <h3 id="expanded-dept-title" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                      {expandedDept.name}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                      Module ID: {expandedDept.moduleId}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close modal"
                  onClick={() => setExpandedDept(null)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Director / Lead:</span>
                  <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>👤 {expandedDept.manager}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>AI Autonomous Copilot:</span>
                  <strong style={{ fontSize: '0.85rem', color: '#059669' }}>🤖 {expandedDept.aiLead}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Specialized AI Supervisors:</span>
                  <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>{expandedDept.supervisors} Active Nodes</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Key Operational Metric:</span>
                  <strong style={{ fontSize: '0.85rem', color: '#EF4444' }}>{expandedDept.metric}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const mod = expandedDept.moduleId;
                    setExpandedDept(null);
                    onNavigateToModule(mod);
                  }}
                  style={{
                    marginTop: '8px',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                  }}
                >
                  Open Dedicated Department Console ➔
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FounderDepartmentGrid;
