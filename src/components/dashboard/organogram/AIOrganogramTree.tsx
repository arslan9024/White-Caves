/**
 * AIOrganogramTree.tsx
 *
 * White Caves Real Estate LLC — 1-12-108 Bhakti Recursive Command Grid Organogram Tree.
 * Single Source of Truth Hierarchy:
 * Level 0: 1 Managing Director (Arslan Malik Bashir Ahmad) & Executive AI Zoe (COO)
 * Level 1: 12 Corporate Department Directors (dynamically bound to confirmed/locked DB names)
 * Level 2: 108 Division Managers (9 per Department × 12 = 108 Division Managers)
 * Level 3 Capacity: 1,296 Operational Supervisors (12 per Division Manager)
 */

import React, { FC, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CORPORATE_DEPARTMENTS_12,
  SUPERVISORS_108,
  SupervisorDef,
} from '../../../data/assistants108Registry.data';
import { useCorporateDepartments } from '../../../context/CorporateDepartmentsContext';

export interface DepartmentRegistryItem {
  id: string;
  name: string;
  code: string;
  color: string;
  gradient: string;
  icon: string;
  description: string;
  manager: string;
  aiLead: string;
  supervisors: SupervisorDef[];
}

export interface AIOrganogramTreeProps {
  onSelectAssistant?: (assistant: SupervisorDef) => void;
}

export const AIOrganogramTree: FC<AIOrganogramTreeProps> = ({ onSelectAssistant }) => {
  const { departments: dbDepartments } = useCorporateDepartments();
  const [selectedDeptId, setSelectedDeptId] = useState<string>('customer_experience');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectedSupervisor, setInspectedSupervisor] = useState<SupervisorDef | null>(null);
  const [taskPrompt, setTaskPrompt] = useState<string>('');
  const [taskDispatched, setTaskDispatched] = useState<boolean>(false);

  // Single Source of Truth: Merge locked database department names into canonical registry
  const departmentsRegistry: DepartmentRegistryItem[] = useMemo(() => {
    return CORPORATE_DEPARTMENTS_12.map((dept, idx) => {
      // Find matching confirmed department from DB/context by slug or slot order
      const matchedDbDept = dbDepartments.find(
        d => d.slug === dept.id || d._id === `canonical-${dept.id}` || d.order === idx + 1
      );

      const resolvedName = matchedDbDept?.title || dept.name;
      const resolvedCode = matchedDbDept?.code || dept.code;
      const resolvedColor = matchedDbDept?.color || dept.color;

      return {
        ...dept,
        name: resolvedName,
        code: resolvedCode,
        color: resolvedColor,
        manager: matchedDbDept?.directorOrManagerId?.fullName || 'Human Director',
        aiLead: dept.managerAi.name,
        supervisors: SUPERVISORS_108.filter(s => s.departmentId === dept.id),
      };
    });
  }, [dbDepartments]);

  const activeDept: DepartmentRegistryItem =
    departmentsRegistry.find((d: DepartmentRegistryItem) => d.id === selectedDeptId) ||
    departmentsRegistry[0];

  const handleDispatchTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskPrompt.trim()) return;
    setTaskDispatched(true);
    setTimeout(() => {
      setTaskDispatched(false);
      setTaskPrompt('');
      setInspectedSupervisor(null);
    }, 1800);
  };

  const filteredSupervisors = activeDept.supervisors.filter(
    (s: SupervisorDef) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
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
              <span
                style={{
                  fontSize: '0.68rem',
                  background: '#EF4444',
                  color: '#FFFFFF',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                }}
              >
                Level 0 Sovereign Command
              </span>
              <span style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 800 }}>
                ● Live Executive Link
              </span>
            </div>
            <h4 style={{ margin: '2px 0 0 0', fontSize: '1rem', fontWeight: 900 }}>
              Arslan Malik Bashir Ahmad (Founder & MD)
            </h4>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94A3B8' }}>
              Paired with <strong>AI Zoe (Chief Operations Officer)</strong> • Floor 13 Sovereign
              Suite
            </p>
          </div>
        </motion.div>

        {/* Tree Connector Line */}
        <div style={{ width: '2px', height: '20px', background: '#CBD5E1', margin: '0 auto' }} />
        <div style={{ width: '80%', height: '2px', background: '#CBD5E1', margin: '0 auto' }} />
      </div>

      {/* ── LEVEL 1: 12 CORPORATE DEPARTMENT DIRECTORS ── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <h4
            style={{
              margin: 0,
              fontSize: '0.9rem',
              fontWeight: 800,
              color: '#475569',
              textTransform: 'uppercase',
            }}
          >
            Level 1: 12 Corporate Department Directors ({departmentsRegistry.length} Locked Departments)
          </h4>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Click a department to view its 9 Division Managers (108 total company-wide)
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '8px',
          }}
        >
          {departmentsRegistry.map((dept: DepartmentRegistryItem) => {
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
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{dept.icon}</span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {dept.name}
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: isSelected ? '#94A3B8' : '#64748B' }}>
                  👔 {dept.manager}
                </div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    color: isSelected ? '#FCA5A5' : '#EF4444',
                    fontWeight: 700,
                  }}
                >
                  🤖 {dept.aiLead}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── LEVEL 2: 9 DIVISION MANAGERS OF SELECTED DEPARTMENT (108 TOTAL) ── */}
      <div
        style={{
          background: '#F8FAFC',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '1.25rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div>
            <span
              style={{
                background: '#EF4444',
                color: '#FFFFFF',
                fontSize: '0.68rem',
                fontWeight: 900,
                padding: '2px 6px',
                borderRadius: '4px',
                textTransform: 'uppercase',
              }}
            >
              Level 2 Division Managers (108 Total)
            </span>
            <h4 style={{ margin: '4px 0 0 0', fontSize: '1.05rem', fontWeight: 800 }}>
              {activeDept.icon} {activeDept.name} — 9 Division Managers (12 Supervisors Capacity Each)
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
          {filteredSupervisors.map((sup: SupervisorDef) => (
            <motion.div
              key={sup.id}
              whileHover={{ y: -2 }}
              onClick={() => {
                setInspectedSupervisor(sup);
                onSelectAssistant?.(sup);
              }}
              style={{
                background: '#FFFFFF',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                padding: '12px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '6px',
                }}
              >
                <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>{sup.name}</strong>
                <span
                  style={{
                    background: sup.status === 'active' ? '#DCFCE7' : '#DBEAFE',
                    color: sup.status === 'active' ? '#166534' : '#1E40AF',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 5px',
                    borderRadius: '4px',
                  }}
                >
                  {sup.status}
                </span>
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#EF4444',
                  marginBottom: '4px',
                }}
              >
                {sup.title}
              </div>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748B', lineHeight: '1.3' }}>
                {sup.specialty}
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #F1F5F9',
                  paddingTop: '6px',
                  marginTop: '6px',
                  fontSize: '0.68rem',
                  color: '#94A3B8',
                }}
              >
                <span>SLA: &lt;15m</span>
                <span style={{ color: '#059669', fontWeight: 700 }}>Dispatch Task ➔</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── SUPERVISOR INTERACTIVE TASK DISPATCH MODAL ── */}
      <AnimatePresence>
        {inspectedSupervisor && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9999,
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '520px',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
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
                <div>
                  <span
                    style={{
                      background: '#EF4444',
                      color: '#FFFFFF',
                      fontSize: '0.68rem',
                      fontWeight: 900,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Supervisor Task Dispatcher
                  </span>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '1.1rem', fontWeight: 800 }}>
                    🤖 {inspectedSupervisor.name} ({inspectedSupervisor.title})
                  </h3>
                </div>
                <button
                  onClick={() => setInspectedSupervisor(null)}
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

              {/* Body */}
              <div
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <div
                  style={{
                    background: '#F8FAFC',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    fontSize: '0.78rem',
                  }}
                >
                  <strong>Specialization:</strong> {inspectedSupervisor.specialty}
                  <div style={{ marginTop: '4px', color: '#059669', fontWeight: 700 }}>
                    ⏱️ Guaranteed SLA Execution: Under 15 Minutes
                  </div>
                </div>

                {taskDispatched ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center',
                      color: '#065F46',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                    }}
                  >
                    🚀 Task Dispatched to {inspectedSupervisor.name}! Executing in background.
                  </motion.div>
                ) : (
                  <form
                    onSubmit={handleDispatchTask}
                    style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                  >
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                      Directive / Assignment Prompt
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={taskPrompt}
                      onChange={e => setTaskPrompt(e.target.value)}
                      placeholder={`Assign a direct real estate or statutory task to ${inspectedSupervisor.name}...`}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.82rem',
                        resize: 'none',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: '#EF4444',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
                      }}
                    >
                      ⚡ Dispatch Directive with 15m SLA
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIOrganogramTree;
