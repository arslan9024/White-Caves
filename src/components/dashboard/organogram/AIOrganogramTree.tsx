/**
 * AIOrganogramTree.tsx
 *
 * White Caves Real Estate LLC — 1-12-108 Autonomous Command Grid Organogram Tree.
 * Hierarchical tree visualization:
 * Level 0: 1 Managing Director (Arslan Malik Bashir Ahmad) & AI Zoe (COO)
 * Level 1: 12 Corporate Department Managers & AI Leads
 * Level 2: 108 Department Supervisors (9 per department × 12 = 108) with live status badges.
 */

import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ASSISTANTS_108_REGISTRY, SupervisorAssistant } from '../../../data/assistants108Registry.data';

export interface AIOrganogramTreeProps {
  onSelectAssistant?: (assistant: SupervisorAssistant) => void;
}

export const AIOrganogramTree: FC<AIOrganogramTreeProps> = ({ onSelectAssistant }) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>('dept-01');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeDept = ASSISTANTS_108_REGISTRY.find(d => d.id === selectedDeptId) || ASSISTANTS_108_REGISTRY[0];

  const filteredSupervisors = activeDept.supervisors.filter(
    s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        padding: '1.5rem',
        color: '#0F172A',
        fontFamily: 'inherit',
      }}
      data-testid="ai-organogram-tree"
    >
      {/* ── LEVEL 0: MANAGING DIRECTOR & AI ZOE SOVEREIGN NODE ── */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
          }}
        >
          <span style={{ fontSize: '1.8rem' }}>👑</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.68rem', background: '#EF4444', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', fontWeight: 900, textTransform: 'uppercase' }}>
                Level 0 Sovereign Command
              </span>
              <span style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 800 }}>● Live Executive Link</span>
            </div>
            <h4 style={{ margin: '2px 0 0 0', fontSize: '1rem', fontWeight: 900 }}>
              Arslan Malik Bashir Ahmad (Founder & MD)
            </h4>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94A3B8' }}>
              Paired with <strong>AI Zoe (Chief Operations Officer)</strong> • Floor 13 Sovereign Suite
            </p>
          </div>
        </motion.div>

        {/* Tree Connector Line */}
        <div style={{ width: '2px', height: '20px', background: '#CBD5E1', margin: '0 auto' }} />
        <div style={{ width: '80%', height: '2px', background: '#CBD5E1', margin: '0 auto' }} />
      </div>

      {/* ── LEVEL 1: 12 CORPORATE DEPARTMENT MANAGERS ── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
            Level 1: 12 Corporate Department Leads ({ASSISTANTS_108_REGISTRY.length} Departments)
          </h4>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Click a department to expand its 9 supervisors</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '8px',
          }}
        >
          {ASSISTANTS_108_REGISTRY.map(dept => {
            const isSelected = dept.id === selectedDeptId;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDeptId(dept.id)}
                style={{
                  background: isSelected ? '#0F172A' : '#F8FAFC',
                  color: isSelected ? '#FFFFFF' : '#334155',
                  border: isSelected ? '2px solid #EF4444' : '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '10px 8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1.1rem' }}>{dept.icon}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {dept.name}
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: isSelected ? '#94A3B8' : '#64748B' }}>
                  👤 {dept.manager}
                </div>
                <div style={{ fontSize: '0.68rem', color: isSelected ? '#FCA5A5' : '#EF4444', fontWeight: 700 }}>
                  🤖 {dept.aiLead}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── LEVEL 2: 9 SUPERVISORS OF SELECTED DEPARTMENT ── */}
      <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{ background: '#EF4444', color: '#FFFFFF', fontSize: '0.68rem', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
              Level 2 Supervisors
            </span>
            <h4 style={{ margin: '4px 0 0 0', fontSize: '1.05rem', fontWeight: 800 }}>
              {activeDept.icon} {activeDept.name} — 9 Specialized Supervisors
            </h4>
          </div>

          <input
            type="text"
            placeholder="Search supervisors by role..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '0.8rem',
              width: '220px',
              outline: 'none',
            }}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '10px',
          }}
        >
          {filteredSupervisors.map(sup => (
            <motion.div
              key={sup.id}
              whileHover={{ y: -2 }}
              onClick={() => onSelectAssistant?.(sup)}
              style={{
                background: '#FFFFFF',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                padding: '12px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>{sup.name}</strong>
                <span
                  style={{
                    background: sup.status === 'Active' ? '#DCFCE7' : '#DBEAFE',
                    color: sup.status === 'Active' ? '#166534' : '#1E40AF',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 5px',
                    borderRadius: '4px',
                  }}
                >
                  {sup.status}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EF4444', marginBottom: '4px' }}>
                {sup.role}
              </div>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748B', lineHeight: '1.3' }}>
                {sup.specialization}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '6px', marginTop: '6px', fontSize: '0.68rem', color: '#94A3B8' }}>
                <span>SLA: &lt;15m</span>
                <span style={{ color: '#059669', fontWeight: 700 }}>Task Queue: 0 Pending</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIOrganogramTree;
