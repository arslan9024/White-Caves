// FILE: src/components/crm/EmployeeManager/EmployeeManagerView.tsx
/**
 * White Caves Real Estate LLC - Employee Manager View
 * Standard: AEGIS Canonical 12-Way Architecture Standard (View - Tier 1)
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { employeeStyles as s } from './EmployeeManager.styles';
import { useEmployeeManager } from './EmployeeManager.logic';
import { EmployeeEditDrawer } from './EmployeeEditDrawer';
import { EmployeeDetailDossier } from './EmployeeDetailDossier';
import { EmployeeManagerFallback } from './EmployeeManager.fallback';

export interface EmployeeManagerViewProps {
  selectedEmpId?: string;
  onNavigateBack?: () => void;
  onSelectEmployee?: (id: string) => void;
}

export const EmployeeManagerView: React.FC<EmployeeManagerViewProps> = ({
  selectedEmpId,
  onNavigateBack,
  onSelectEmployee,
}) => {
  const {
    filteredEmployees,
    searchQuery,
    setSearchQuery,
    selectedPillar,
    setSelectedPillar,
    selectedRoleTier,
    setSelectedRoleTier,
    selectedStatus,
    setSelectedStatus,
    statusToast,
    error,
    setError,
    isDrawerOpen,
    editingEmployee,
    metrics,
    pillars,
    handleHireEmployee,
    handleUpdateEmployee,
    handleDemoteEmployee,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseDrawer,
  } = useEmployeeManager();

  const targetEmployee = React.useMemo(() => {
    if (!selectedEmpId || filteredEmployees.length === 0) return null;
    const cleanId = selectedEmpId.toUpperCase();
    return (
      filteredEmployees.find(
        e => e._id?.toUpperCase() === cleanId || e.employeeCode?.toUpperCase() === cleanId
      ) || null
    );
  }, [selectedEmpId, filteredEmployees]);

  if (error) {
    return (
      <EmployeeManagerFallback
        error={error}
        onRetry={() => setError(null)}
        onNavigateBack={onNavigateBack}
      />
    );
  }

  const getRoleBadgeClass = (tier: string) => {
    switch (tier) {
      case 'EXECUTIVE':
        return s.roleExecutive;
      case 'DIRECTOR':
        return s.roleDirector;
      case 'MANAGER':
        return s.roleManager;
      case 'SUPERVISOR':
        return s.roleSupervisor;
      case 'BROKER':
        return s.roleBroker;
      default:
        return s.roleSpecialist;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return s.statusActive;
      case 'onboarding':
        return s.statusOnboarding;
      case 'probation':
        return s.statusProbation;
      default:
        return s.statusStandby;
    }
  };

  return (
    <div className={s.container} data-testid="employee-manager-view">
      {selectedEmpId && targetEmployee ? (
        <EmployeeDetailDossier
          employee={targetEmployee}
          onBack={onNavigateBack}
          onEdit={handleOpenEdit}
        />
      ) : (
        <>
          {/* ── 1. Header & Quick Metrics ────────────────────────────────────── */}
          <div className={s.headerWrapper}>
            <div className={s.headerLeft}>
              <div className={s.headerIcon}>👥</div>
              <div>
                <h1 className={s.headerTitle}>
                  Employee Directory & Personnel Management
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    150 Operational Units
                  </span>
                </h1>
                <p className={s.headerSubtitle}>
                  Dedicated human capital management separated from departmental slots · White Caves
                  Real Estate LLC
                </p>
              </div>
            </div>

            <button onClick={handleOpenCreate} className={s.addBtn} data-testid="add-employee-btn">
              <span>+</span>
              <span>Onboard New Employee</span>
            </button>
          </div>

          {/* Metrics Row */}
          <div className={s.metricsRow} data-testid="employee-metrics-row">
            <div className={s.metricCard}>
              <span className={s.metricNumber}>{metrics.total}</span>
              <span className={s.metricLabel}>Total Personnel</span>
            </div>
            <div className={s.metricCard}>
              <span className={`${s.metricNumber} text-emerald-400`}>{metrics.active}</span>
              <span className={s.metricLabel}>Active Deployment</span>
            </div>
            <div className={s.metricCard}>
              <span className={`${s.metricNumber} text-amber-400`}>{metrics.directors}</span>
              <span className={s.metricLabel}>Pillar Directors & C-Suite</span>
            </div>
            <div className={s.metricCard}>
              <span className={`${s.metricNumber} text-purple-400`}>{metrics.brokers}</span>
              <span className={s.metricLabel}>Licensed RERA Brokers</span>
            </div>
          </div>

          {/* ── 2. Controls & Search Filter Bar ──────────────────────────────── */}
          <div className={s.controlsBar}>
            <div className={s.searchBox}>
              <span className={s.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search by name, employee code (EMP-001), designation, RERA card..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={s.searchInput}
                data-testid="employee-search-input"
              />
            </div>

            <div className={s.filterGroup}>
              <select
                value={selectedPillar}
                onChange={e => setSelectedPillar(e.target.value)}
                className={s.filterSelect}
                data-testid="filter-pillar-select"
              >
                {pillars.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedRoleTier}
                onChange={e => setSelectedRoleTier(e.target.value)}
                className={s.filterSelect}
                data-testid="filter-role-select"
              >
                <option value="all">All Role Tiers</option>
                <option value="EXECUTIVE">Executive (L0)</option>
                <option value="DIRECTOR">Director (L1)</option>
                <option value="MANAGER">Division Manager (L2)</option>
                <option value="SUPERVISOR">Supervisor (L3)</option>
                <option value="BROKER">Broker</option>
                <option value="SPECIALIST">Specialist</option>
              </select>

              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className={s.filterSelect}
                data-testid="filter-status-select"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="onboarding">Onboarding</option>
                <option value="probation">Probation</option>
                <option value="standby">Standby</option>
              </select>
            </div>
          </div>

          {statusToast && (
            <div className={s.statusToast} data-testid="employee-status-toast">
              <span>⚡</span>
              <span>{statusToast}</span>
            </div>
          )}

          {/* ── 3. Employee Cards Grid ───────────────────────────────────────── */}
          <div className={s.cardsGrid} data-testid="employee-cards-grid">
            {filteredEmployees.length === 0 ? (
              <div className="col-span-full p-8 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
                No employee records found matching your filters.
              </div>
            ) : (
              filteredEmployees.map(emp => (
                <div
                  key={emp._id}
                  className={s.card}
                  data-testid={`employee-card-${emp.employeeCode}`}
                >
                  <div>
                    <div className={s.cardTop}>
                      <div className={s.cardIdentity}>
                        <div className={s.avatar}>
                          {emp.fullName
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1.5">
                            <span className={s.codePill}>{emp.employeeCode}</span>
                            <span className={`${s.roleBadge} ${getRoleBadgeClass(emp.roleTier)}`}>
                              {emp.roleTier}
                            </span>
                          </div>
                          <h3 className={s.name}>{emp.fullName}</h3>
                          <div className={s.designation}>{emp.designation}</div>
                        </div>
                      </div>
                      <span className={`${s.statusPill} ${getStatusClass(emp.status)}`}>
                        ● {emp.status.toUpperCase()}
                      </span>
                    </div>

                    <div className={s.metaSection}>
                      <div className={s.metaRow}>
                        <span className={s.metaLabel}>Pillar</span>
                        <span className="text-slate-300 font-semibold truncate max-w-[160px]">
                          {emp.pillarName}
                        </span>
                      </div>
                      <div className={s.metaRow}>
                        <span className={s.metaLabel}>Reports To</span>
                        <span className={s.metaValue}>{emp.supervisorName}</span>
                      </div>
                      {emp.reraCardNumber && (
                        <div className={s.metaRow}>
                          <span className={s.metaLabel}>RERA Card</span>
                          <span className="text-amber-400 font-mono font-bold text-[11px]">
                            {emp.reraCardNumber}
                          </span>
                        </div>
                      )}
                      <div className={s.metaRow}>
                        <span className={s.metaLabel}>Compensation</span>
                        <span className="text-emerald-400 font-mono text-[11px]">
                          AED {emp.baseSalaryAED.toLocaleString()} + {emp.commissionRatePct}%
                        </span>
                      </div>
                    </div>

                    <div className={s.skillsRow}>
                      {emp.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className={s.skillTag}>
                          {skill}
                        </span>
                      ))}
                      {emp.skills.length > 3 && (
                        <span className={s.skillTag}>+{emp.skills.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <div className={s.cardFooter}>
                    <button
                      onClick={() => handleOpenEdit(emp)}
                      className={s.editBtn}
                      data-testid={`edit-emp-${emp.employeeCode}`}
                    >
                      <span>✏️</span>
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={() => handleDemoteEmployee(emp._id, 'Moved to Standby Reserve')}
                      className={s.demoteBtn}
                      title="Shift to Standby Pool"
                      data-testid={`demote-emp-${emp.employeeCode}`}
                    >
                      ⬇️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* ── 4. CRUD Drawer ──────────────────────────────────────────────── */}
      <EmployeeEditDrawer
        isOpen={isDrawerOpen}
        employee={editingEmployee}
        onClose={handleCloseDrawer}
        onSave={payload => {
          if (editingEmployee) {
            handleUpdateEmployee(editingEmployee._id, payload);
          } else {
            handleHireEmployee(payload);
          }
        }}
      />
    </div>
  );
};
