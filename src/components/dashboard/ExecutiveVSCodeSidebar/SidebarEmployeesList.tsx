import React, { FC } from 'react';
import { Users, UserPlus, Shield } from 'lucide-react';
import { INITIAL_EMPLOYEES_SEED } from '../../crm/EmployeeManager/EmployeeManager.data';
import { SidebarListWrapper } from './SidebarDepartmentsList.styles';

interface SidebarEmployeesListProps {
  filterQuery?: string;
  selectedEmployeeId?: string | null;
  onSelectEmployee?: (id: string, name: string) => void;
  onOpenCreate?: () => void;
}

export const SidebarEmployeesList: FC<SidebarEmployeesListProps> = ({
  filterQuery = '',
  selectedEmployeeId,
  onSelectEmployee,
  onOpenCreate,
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

      {visibleEmployees.map(emp => {
        const isSelected = selectedEmployeeId === emp._id;
        return (
          <div
            key={emp._id}
            onClick={() => onSelectEmployee?.(emp._id, emp.fullName)}
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
                    fontWeight: 800,
                    color: '#60A5FA',
                    background: 'rgba(59, 130, 246, 0.12)',
                    padding: '1px 5px',
                    borderRadius: '4px',
                  }}
                >
                  {emp.employeeCode}
                </span>
                <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600 }}>
                  {emp.roleTier}
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.65rem',
                  color: emp.status === 'active' ? '#10B981' : '#F59E0B',
                  fontWeight: 700,
                }}
              >
                ● {emp.status}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#60A5FA',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Users size={14} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {emp.fullName}
                </div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    color: '#94A3B8',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {emp.designation}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.65rem',
                color: '#64748B',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: '4px',
              }}
            >
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '140px',
                }}
              >
                {emp.pillarName}
              </span>
              {emp.reraCardNumber && (
                <span
                  style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#F59E0B' }}
                >
                  <Shield size={10} /> {emp.reraCardNumber}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </SidebarListWrapper>
  );
};
