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

export const DepartmentTaskKanban: FC = () => {
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');

  const moveTask = (taskId: string, targetStage: KanbanTask['stage']) => {
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, stage: targetStage } : t)));
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
            📋 Department Task Pipeline & Collaborative Kanban
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
            Live task routing across 12 departments with 15-minute SLA enforcement.
          </p>
        </div>

        <button
          onClick={() => {
            const newTask: KanbanTask = {
              id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
              title: 'Automated DLD Trakheesi Permit Verification',
              department: 'Legal & AML',
              assignee: 'AI Sofia',
              priority: 'HIGH',
              stage: 'backlog',
              slaMinutes: 10,
            };
            setTasks(prev => [newTask, ...prev]);
          }}
          style={{
            background: '#EF4444',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 14px',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          + Dispatch New Task
        </button>
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
    </div>
  );
};

export default DepartmentTaskKanban;
