/**
 * DepartmentTaskKanban.tsx
 *
 * White Caves Real Estate LLC — Department Task Kanban Board (4-Stage Pipeline).
 * Stages:
 * 1. Backlog (Intake & AI Decomposition)
 * 2. In Progress (Supervisor Execution)
 * 3. Manager / Legal Review (Compliance Verification)
 * 4. Founder Approved (Arslan Malik Sovereign Seal)
 */

import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface KanbanTask {
  id: string;
  title: string;
  department: string;
  assignee: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  stage: 'backlog' | 'in_progress' | 'review' | 'approved';
  slaMinutes: number;
}

const INITIAL_TASKS: KanbanTask[] = [
  { id: 'TSK-101', title: 'DAMAC Hills 2 Amazonia Villa Tenancy Renewal', department: 'Tenancy & Ejari', assignee: 'AI Victoria (Lead)', priority: 'HIGH', stage: 'approved', slaMinutes: 5 },
  { id: 'TSK-102', title: 'CBUAE goAML Screening on AED 3.2M Deal', department: 'Legal & AML', assignee: 'AI Sofia (Lead)', priority: 'CRITICAL', stage: 'approved', slaMinutes: 2 },
  { id: 'TSK-103', title: 'Q2 FTA Form 201 VAT Reconciliation Output', department: 'Finance & VAT', assignee: 'AI Theodora', priority: 'HIGH', stage: 'review', slaMinutes: 12 },
  { id: 'TSK-104', title: 'Palm Jumeirah Penthouse 3D VR Matterport Sync', department: 'Technology', assignee: 'AI Aurora (CTO)', priority: 'MEDIUM', stage: 'in_progress', slaMinutes: 8 },
  { id: 'TSK-105', title: 'VIP Maybach Chauffeur Booking for European Family Office', department: 'Concierge', assignee: 'AI Corinne', priority: 'HIGH', stage: 'in_progress', slaMinutes: 4 },
  { id: 'TSK-106', title: 'Off-Plan DAMAC Victoria Inventory Audit (148 Units)', department: 'Off-Plan Sales', assignee: 'AI Clara', priority: 'MEDIUM', stage: 'backlog', slaMinutes: 15 },
];

const ALL_DEPARTMENTS = [
  'all',
  'Tenancy & Ejari',
  'Legal & AML',
  'Finance & VAT',
  'Technology',
  'Concierge',
  'Off-Plan Sales',
  'Secondary Resales',
  'Property Management',
  'Marketing & PR',
  'HR & Talent',
  'Investments & Family Office',
  'Executive Strategy',
];

export const DepartmentTaskKanban: FC = () => {
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDept, setNewTaskDept] = useState('Legal & AML');
  const [newTaskAssignee, setNewTaskAssignee] = useState('AI Sofia');
  const [newTaskPriority, setNewTaskPriority] = useState<KanbanTask['priority']>('HIGH');
  const [newTaskSla, setNewTaskSla] = useState<number>(10);

  const moveTask = (taskId: string, targetStage: KanbanTask['stage']) => {
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, stage: targetStage } : t)));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: KanbanTask = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      title: newTaskTitle.trim(),
      department: newTaskDept,
      assignee: newTaskAssignee,
      priority: newTaskPriority,
      stage: 'backlog',
      slaMinutes: newTaskSla,
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setIsCreateModalOpen(false);
  };

  const stages: { id: KanbanTask['stage']; title: string; color: string; icon: string }[] = [
    { id: 'backlog', title: 'Task Backlog', color: '#64748B', icon: '📥' },
    { id: 'in_progress', title: 'In Progress (AI Supervisor)', color: '#3B82F6', icon: '⚡' },
    { id: 'review', title: 'Manager / Legal Review', color: '#F59E0B', icon: '🔍' },
    { id: 'approved', title: 'Founder Approved 👑', color: '#10B981', icon: '✅' },
  ];

  const filteredTasks = selectedDeptFilter === 'all'
    ? tasks
    : tasks.filter(t => t.department === selectedDeptFilter);

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
      data-testid="department-task-kanban"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
            📋 Department Task Pipeline & Collaborative Kanban
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
            Live task routing across 12 departments with 15-minute SLA enforcement.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          style={{
            background: '#EF4444',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 14px',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
          }}
        >
          + Create Executive Directive
        </button>
      </div>

      {/* 12-Department Filter Pills */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '1.25rem' }}>
        {ALL_DEPARTMENTS.map(dept => (
          <button
            key={dept}
            onClick={() => setSelectedDeptFilter(dept)}
            style={{
              padding: '4px 10px',
              borderRadius: '20px',
              border: selectedDeptFilter === dept ? '1px solid #EF4444' : '1px solid #E2E8F0',
              background: selectedDeptFilter === dept ? '#EF4444' : '#F8FAFC',
              color: selectedDeptFilter === dept ? '#FFFFFF' : '#475569',
              fontSize: '0.72rem',
              fontWeight: selectedDeptFilter === dept ? 800 : 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {dept === 'all' ? `All Departments (${tasks.length})` : dept}
          </button>
        ))}
      </div>

      {/* Kanban Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          alignItems: 'flex-start',
        }}
      >
        {stages.map(stage => {
          const stageTasks = filteredTasks.filter(t => t.stage === stage.id);
          return (
            <div
              key={stage.id}
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '1rem',
                minHeight: '260px',
              }}
            >
              {/* Column Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{stage.icon}</span>
                  <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>{stage.title}</strong>
                </div>
                <span
                  style={{
                    background: stage.color,
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                  }}
                >
                  {stageTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {stageTasks.map(task => (
                  <motion.div
                    key={task.id}
                    layout
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      padding: '10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748B' }}>{task.id}</span>
                      <span
                        style={{
                          background: task.priority === 'CRITICAL' ? '#FEE2E2' : '#EFF6FF',
                          color: task.priority === 'CRITICAL' ? '#991B1B' : '#1E40AF',
                          fontSize: '0.62rem',
                          fontWeight: 900,
                          padding: '1px 5px',
                          borderRadius: '4px',
                        }}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px', lineHeight: '1.3' }}>
                      {task.title}
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>👤 {task.assignee}</span>
                      <span style={{ color: '#059669', fontWeight: 700 }}>⏱️ {task.slaMinutes}m left</span>
                    </div>

                    {/* Quick Stage Transition Buttons */}
                    <div style={{ display: 'flex', gap: '4px', borderTop: '1px solid #F1F5F9', paddingTop: '6px' }}>
                      {stage.id !== 'backlog' && (
                        <button
                          onClick={() => {
                            const prev = stage.id === 'approved' ? 'review' : stage.id === 'review' ? 'in_progress' : 'backlog';
                            moveTask(task.id, prev);
                          }}
                          style={{
                            flex: 1,
                            background: '#F1F5F9',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '3px',
                            cursor: 'pointer',
                          }}
                        >
                          ◀ Back
                        </button>
                      )}
                      {stage.id !== 'approved' && (
                        <button
                          onClick={() => {
                            const next = stage.id === 'backlog' ? 'in_progress' : stage.id === 'in_progress' ? 'review' : 'approved';
                            moveTask(task.id, next);
                          }}
                          style={{
                            flex: 1,
                            background: '#0F172A',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '3px',
                            cursor: 'pointer',
                          }}
                        >
                          {stage.id === 'review' ? '👑 Approve' : 'Advance ▶'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CREATE EXECUTIVE DIRECTIVE MODAL ── */}
      <AnimatePresence>
        {isCreateModalOpen && (
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
                  <span style={{ background: '#EF4444', color: '#FFFFFF', fontSize: '0.68rem', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    Level 7 Executive Suite
                  </span>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '1.1rem', fontWeight: 800 }}>
                    👑 Create Department Executive Directive
                  </h3>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
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

              {/* Form */}
              <form onSubmit={handleCreateTask} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Task / Directive Title
                  </label>
                  <input
                    required
                    type="text"
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    placeholder="e.g., DAMAC Hills 2 Title Deed Registration & PDC Vault Audit"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.82rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Corporate Department
                    </label>
                    <select
                      value={newTaskDept}
                      onChange={e => setNewTaskDept(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.82rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    >
                      {ALL_DEPARTMENTS.filter(d => d !== 'all').map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Assignee Lead / Supervisor
                    </label>
                    <input
                      required
                      type="text"
                      value={newTaskAssignee}
                      onChange={e => setNewTaskAssignee(e.target.value)}
                      placeholder="e.g., AI Victoria (Lead)"
                      style={{
                        width: '100%',
                        padding: '9px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.82rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Priority Level
                    </label>
                    <select
                      value={newTaskPriority}
                      onChange={e => setNewTaskPriority(e.target.value as KanbanTask['priority'])}
                      style={{
                        width: '100%',
                        padding: '9px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.82rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="CRITICAL">🔴 CRITICAL (Immediate)</option>
                      <option value="HIGH">🟠 HIGH</option>
                      <option value="MEDIUM">🔵 MEDIUM</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Max SLA (Minutes)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={newTaskSla}
                      onChange={e => setNewTaskSla(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '9px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.82rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '8px',
                    background: '#EF4444',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
                  }}
                >
                  🚀 Dispatch to Department Backlog
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentTaskKanban;
