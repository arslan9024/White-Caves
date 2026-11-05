/**
 * SidebarEmployeesList.tsx
 * White Caves Real Estate LLC - Employees Left Sidebar Drawer
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Double-Layer Routing
 */

import React, { FC } from 'react';
import { Users, UserPlus, Shield, ArrowRight, Award } from 'lucide-react';
import { INITIAL_EMPLOYEES_SEED } from '../../crm/EmployeeManager/EmployeeManager.data';
import { SidebarListWrapper } from './SidebarDepartmentsList.styles';

export interface SidebarEmployeesListProps {
  filterQuery?: string;
  selectedEmployeeId?: string | null;
  onSelectEmployee?: (id: string, name: string) => void;
  onOpenCreate?: () => void;
  onNavigateToView?: (route: string) => void;
}

export const SidebarEmployeesList: FC<SidebarEmployeesListProps> = ({
  filterQuery = '',
  selectedEmployeeId,
  onSelectEmployee,
  onOpenCreate,
  onNavigateToView,
}) => {
  const query = filterQuery.trim().toLowerCase();

  const visibleEmployees = INITIAL_EMPLOYEES_SEED.filter(emp => {
    if (!query) return true;
    return (
      emp.fullName.toLowerCase().includes(query) ||
      emp.employeeCode.toLowerCase().includes(query) ||
      emp.designation.toLowerCase().includes(query) ||
      emp.pillarName.toLowerCase().includes(query)
    );
  });

  return (
    <SidebarListWrapper data-testid="sidebar-employees-list">
      {/* ── Level 1 Category Portals ─────────────────────────────────── */}
      <div style={{ marginBottom: '8px' }}>
        <div
          onClick={() => onNavigateToView?.('/dashboard/employees/roster')}
          style={{
            fontSize: '0.68rem',
            color: '#60A5FA',
            padding: '4px 8px',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '6px',
            marginBottom: '4px',
          }}
          data-testid="link-all-emp-roster"
        >
          👥 Open Personnel Roster Table (CRUD) <ArrowRight size={11} />
        </div>
        <div
          onClick={() => onNavigateToView?.('/dashboard/employees/supervisors')}
          style={{
            fontSize: '0.68rem',
            color: '#34D399',
            padding: '4px 8px',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '6px',
            marginBottom: '8px',
          }}
          data-testid="link-emp-supervisors"
        >
          🛡️ 108 Squad Supervisors <ArrowRight size={11} />
        </div>
      </div>

      {/* Header bar with Count and Onboard action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px 10px 8px',
        }}
      >
        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            color: '#3B82F6',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Personnel Roster ({visibleEmployees.length})
        </span>
        {onOpenCreate && (
          <button
            onClick={onOpenCreate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#60A5FA',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <UserPlus size={12} />
            <span>Onboard</span>
          </button>
        )}
      </div>

      {/* ── Level 2 Sub-Items: Employees with Turing IDs ─────────────── */}
      {visibleEmployees.map(emp => {
        const isSelected = selectedEmployeeId === emp._id;
        return (
          <div
            key={emp._id}
            onClick={() => {
              onSelectEmployee?.(emp._id, emp.fullName);
              onNavigateToView?.(`/dashboard/employees/${emp._id}`);
            }}
            data-testid={`sidebar-emp-${emp.employeeCode}`}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: isSelected ? 'rgba(59, 130, 246, 0.15)' : '#070D18',
              border: isSelected ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.05)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              marginBottom: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontFamily: 'monospace',
                    color: '#60A5FA',
                    background: 'rgba(59, 130, 246, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 700,
                  }}
                >
                  {emp.employeeCode}
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: '#94A3B8',
                  }}
                >
                  {emp.roleTier}
                </span>
              </div>
              <span style={{ fontSize: '0.65rem', color: '#F59E0B', fontWeight: 700 }}>
                {emp.merit_xp_count || 0} XP
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F8FAFC' }}>
              {emp.fullName}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
                color: '#64748B',
              }}
            >
              <span>{emp.designation}</span>
              <span style={{ color: '#38BDF8' }}>{emp.pillarName}</span>
            </div>
          </div>
        );
      })}
    </SidebarListWrapper>
  );
};

export default SidebarEmployeesList;
