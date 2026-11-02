import React, { useState, useMemo } from 'react';
import { INITIAL_DEPARTMENTS, EXECUTIVE_PARTNER, INITIAL_STANDBY_ROSTER } from './data';
import type { DepartmentGroup, VirtualStaffMember } from './types';
import './AICommandCenter.css';

export const AICommandCenterPage: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentGroup[]>(INITIAL_DEPARTMENTS);
  const [standbyRoster, setStandbyRoster] = useState<VirtualStaffMember[]>(INITIAL_STANDBY_ROSTER);
  const [selectedDeptCode, setSelectedDeptCode] = useState<string>(INITIAL_DEPARTMENTS[0]?.deptCode || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'standby' | 'squads'>('hierarchy');

  const selectedDepartment = useMemo(
    () => departments.find(d => d.deptCode === selectedDeptCode) || departments[0],
    [departments, selectedDeptCode]
  );

  const filteredSupervisors = useMemo(() => {
    if (!selectedDepartment) return [];
    if (!searchQuery.trim()) return selectedDepartment.supervisors;
    const q = searchQuery.toLowerCase();
    return selectedDepartment.supervisors.filter(
      s => s.name.toLowerCase().includes(q) || s.title.toLowerCase().includes(q) || s.assignedTasks.some(t => t.toLowerCase().includes(q))
    );
  }, [selectedDepartment, searchQuery]);

  // Zero-Data-Loss handler: Move supervisor to standby safely
  const handleReassignToStandby = (supervisorId: string) => {
    const sup = selectedDepartment?.supervisors.find(s => s.id === supervisorId);
    if (!sup) return;

    // Remove from active department supervisors
    setDepartments(prev =>
      prev.map(d => {
        if (d.deptCode !== selectedDepartment.deptCode) return d;
        return {
          ...d,
          supervisors: d.supervisors.filter(s => s.id !== supervisorId),
        };
      })
    );

    // Safely migrate into Standby Roster
    setStandbyRoster(prev => [
      ...prev,
      {
        ...sup,
        role: 'STANDBY',
        status: 'STANDBY',
        departmentCode: undefined,
        departmentName: undefined,
        supervisorSlot: null,
      },
    ]);
  };

  return (
    <div className="ai-cmd-center-container" data-testid="ai-command-center-production-hub">
      {/* Global Top Banner */}
      <header className="ai-cmd-header">
        <div className="ai-cmd-title-group">
          <span className="ai-cmd-badge">PRODUCTION HUBS</span>
          <h1>White Caves AI Command Center</h1>
          <p className="ai-cmd-subtitle">12 Corporate Departments • 108 Dedicated Supervisors • Persistent Standby Roster</p>
        </div>

        <div className="ai-cmd-exec-card">
          <div className="exec-avatar" style={{ backgroundColor: EXECUTIVE_PARTNER.color }}>
            {EXECUTIVE_PARTNER.name.charAt(0)}
          </div>
          <div className="exec-info">
            <span className="exec-label">AI EXECUTIVE PARTNER</span>
            <div className="exec-name">{EXECUTIVE_PARTNER.name}</div>
            <div className="exec-title">{EXECUTIVE_PARTNER.title}</div>
          </div>
          <span className="exec-status-pill">ACTIVE • GUARD NODE</span>
        </div>
      </header>

      {/* Navigation tabs */}
      <nav className="ai-cmd-nav">
        <button
          className={`ai-cmd-tab ${activeTab === 'hierarchy' ? 'active' : ''}`}
          onClick={() => setActiveTab('hierarchy')}
        >
          🏢 12 Corporate Departments
        </button>
        <button
          className={`ai-cmd-tab ${activeTab === 'standby' ? 'active' : ''}`}
          onClick={() => setActiveTab('standby')}
        >
          ⏳ Unassigned Standby Roster ({standbyRoster.length})
        </button>
      </nav>

      {activeTab === 'hierarchy' && (
        <div className="ai-cmd-main-grid">
          {/* Department Selector Sidebar */}
          <aside className="ai-cmd-dept-list">
            <div className="dept-list-header">DEPARTMENTS</div>
            {departments.map(dept => (
              <button
                key={dept.deptCode}
                className={`dept-selector-btn ${dept.deptCode === selectedDeptCode ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedDeptCode(dept.deptCode);
                  setSearchQuery('');
                }}
              >
                <span className="dept-color-bar" style={{ backgroundColor: dept.color }} />
                <div className="dept-btn-content">
                  <span className="dept-btn-code">{dept.deptCode}</span>
                  <span className="dept-btn-title">{dept.deptName}</span>
                </div>
                <span className="dept-btn-count">{dept.supervisors.length} Sup</span>
              </button>
            ))}
          </aside>

          {/* Department Detail View */}
          <section className="ai-cmd-content">
            {selectedDepartment && (
              <>
                {/* Department Info & Manager Card */}
                <div className="dept-header-card" style={{ borderLeftColor: selectedDepartment.color }}>
                  <div>
                    <span className="dept-code-tag">{selectedDepartment.deptCode}</span>
                    <h2>{selectedDepartment.deptName}</h2>
                  </div>

                  <div className="manager-badge">
                    <div className="manager-avatar" style={{ backgroundColor: selectedDepartment.color }}>
                      {selectedDepartment.manager.name.charAt(0)}
                    </div>
                    <div>
                      <span className="manager-label">DEPARTMENT MANAGER</span>
                      <div className="manager-name">{selectedDepartment.manager.name}</div>
                      <div className="manager-title">{selectedDepartment.manager.title}</div>
                    </div>
                  </div>
                </div>

                {/* Search & Actions Bar */}
                <div className="supervisor-toolbar">
                  <input
                    type="text"
                    className="supervisor-search"
                    placeholder={`Search within ${selectedDepartment.deptCode} supervisors or tasks...`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <span className="supervisor-count-label">
                    Showing {filteredSupervisors.length} of {selectedDepartment.supervisors.length} supervisors
                  </span>
                </div>

                {/* Supervisors 3x3 Grid */}
                <div className="supervisors-grid">
                  {filteredSupervisors.map(sup => (
                    <div key={sup.id} className="supervisor-card">
                      <div className="supervisor-card-top">
                        <span className="slot-badge">Slot {sup.supervisorSlot || '—'}</span>
                        <span className="sla-badge">⚡ {sup.slaResponseTime || '15m SLA'}</span>
                      </div>

                      <div className="supervisor-identity">
                        <div className="sup-avatar" style={{ backgroundColor: sup.color }}>
                          {sup.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="sup-name">{sup.name}</h4>
                          <p className="sup-title">{sup.title}</p>
                        </div>
                      </div>

                      <div className="sup-tasks-label">ASSIGNED WORKFLOWS</div>
                      <ul className="sup-tasks-list">
                        {sup.assignedTasks.map((t, idx) => (
                          <li key={idx} className="sup-task-item">{t}</li>
                        ))}
                      </ul>

                      <button
                        className="btn-standby-reassign"
                        onClick={() => handleReassignToStandby(sup.id)}
                        title="Reassign to Standby (Zero-Data-Loss guarantee)"
                      >
                        Move to Standby Roster
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {/* Standby Roster Tab */}
      {activeTab === 'standby' && (
        <section className="standby-section">
          <div className="standby-intro">
            <h3>Unassigned Standby Roster</h3>
            <p>
              Persistent reserve roster for all virtual staff profiles. Staff members here retain full
              historical prompts, skills, and configuration, ready to be attached to new squads or surge workloads.
            </p>
          </div>

          <div className="standby-grid">
            {standbyRoster.map(staff => (
              <div key={staff.id} className="standby-card">
                <div className="standby-card-header">
                  <span className="standby-badge">STANDBY</span>
                  <span className="staff-id">{staff.id}</span>
                </div>
                <div className="standby-name">{staff.name}</div>
                <div className="standby-title">{staff.title}</div>
                <div className="standby-tasks">
                  {staff.assignedTasks.map((t, i) => (
                    <span key={i} className="task-pill">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AICommandCenterPage;

