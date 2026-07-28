import React, { FC, useState } from 'react';
import companyLedger from '../../mocks/companyMasterLedger.json';

const RED = '#EF4444';
const WHITE = '#FFFFFF';
const SLATE = '#1E293B';
const GOLD = '#D4AF37';
const LIGHT_RED = 'rgba(239, 68, 68, 0.08)';

type LedgerPersonnel = {
  id: string;
  name: string;
  email: string;
  roleTitle: string;
  assignedDepartment: string;
  accessLevel: number;
  commissionRule?: { agentSplit: number; companySplit: number };
};

type LedgerDepartment = {
  id: string;
  num: string;
  name: string;
  icon: string;
  monthlyRevenueAED?: number;
  activeLeads?: number;
};

const LEVEL_LABELS: Record<number, string> = {
  5: 'MANAGING DIRECTOR',
  4: 'DEPARTMENT MANAGER',
  3: 'SUPERVISOR',
  2: 'JUNIOR',
  1: 'INTERN',
};

const LEVEL_COLORS: Record<number, string> = {
  5: '#D4AF37',
  4: RED,
  3: '#7C3AED',
  2: '#0EA5E9',
  1: '#94A3B8',
};

export const EmployeeLeaderboardPanel: FC = () => {
  const departments = (companyLedger as any).departments as LedgerDepartment[];
  const personnel = (companyLedger as any).personnel as LedgerPersonnel[];

  const [activeDeptId, setActiveDeptId] = useState<string>(departments[0]?.id || 'sales');
  const [viewMode, setViewMode] = useState<'department' | 'global'>('department');

  const activeDept = departments.find(d => d.id === activeDeptId);
  const deptStaff = personnel
    .filter(p => p.assignedDepartment === activeDeptId)
    .sort((a, b) => b.accessLevel - a.accessLevel);

  const manager = deptStaff.find(p => p.accessLevel === 4);
  const supervisors = deptStaff.filter(p => p.accessLevel === 3);
  const juniors = deptStaff.filter(p => p.accessLevel === 2);
  const interns = deptStaff.filter(p => p.accessLevel === 1);

  const globalTopManagers = personnel
    .filter(p => p.accessLevel === 4)
    .slice(0, 12);

  return (
    <div style={{ padding: '24px', background: '#F8FAFC', borderRadius: '16px', border: `1px solid ${LIGHT_RED}` }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: SLATE, margin: 0, fontFamily: 'Outfit, sans-serif' }}>
            🏆 1-12-108 Hierarchy Leaderboard
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '4px 0 0 0' }}>
            1 Managing Director · 12 Department Managers · 108 Supervisors
          </p>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', background: '#E2E8F0', padding: '4px', borderRadius: '12px', gap: '4px' }}>
          <button
            onClick={() => setViewMode('department')}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer',
              background: viewMode === 'department' ? RED : 'transparent',
              color: viewMode === 'department' ? WHITE : SLATE,
              transition: 'all 200ms ease', fontSize: '0.8rem',
            }}
          >
            🏢 By Department
          </button>
          <button
            onClick={() => setViewMode('global')}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer',
              background: viewMode === 'global' ? GOLD : 'transparent',
              color: viewMode === 'global' ? WHITE : SLATE,
              transition: 'all 200ms ease', fontSize: '0.8rem',
            }}
          >
            🌐 All 12 Managers
          </button>
        </div>
      </div>

      {viewMode === 'global' ? (
        /* ── GLOBAL: All 12 Department Managers ── */
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.5px', marginBottom: '12px' }}>
            LEVEL 4 DEPARTMENT HEADS — 12 MANAGERS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {departments.map((dept, idx) => {
              const mgr = personnel.find(p => p.assignedDepartment === dept.id && p.accessLevel === 4);
              const supervisorCount = personnel.filter(p => p.assignedDepartment === dept.id && p.accessLevel === 3).length;
              return (
                <div
                  key={dept.id}
                  onClick={() => { setActiveDeptId(dept.id); setViewMode('department'); }}
                  style={{
                    background: WHITE, borderRadius: '12px', padding: '16px',
                    border: `1px solid rgba(239, 68, 68, 0.15)`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = RED)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.15)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{dept.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: RED }}>{dept.num} / 12</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: SLATE }}>{dept.name}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: RED }}>Manager: </span>{mgr?.name || 'Unassigned'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    {supervisorCount} of 9 Supervisors Filled · Click to view
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── DEPARTMENT VIEW ── */
        <div>
          {/* Department Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {departments.map(dept => (
              <button
                key={dept.id}
                onClick={() => setActiveDeptId(dept.id)}
                style={{
                  padding: '6px 14px', borderRadius: '8px', border: `1px solid ${activeDeptId === dept.id ? RED : '#E2E8F0'}`,
                  background: activeDeptId === dept.id ? RED : WHITE,
                  color: activeDeptId === dept.id ? WHITE : SLATE,
                  fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'all 180ms ease',
                }}
              >
                {dept.icon} {dept.num}. {dept.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Active Department Banner */}
          <div style={{
            background: `linear-gradient(135deg, ${SLATE} 0%, #2D3A4A 100%)`,
            borderRadius: '12px', padding: '16px 20px', marginBottom: '20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            border: `1px solid ${RED}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '2rem' }}>{activeDept?.icon}</span>
              <div>
                <div style={{ fontSize: '0.7rem', color: RED, fontWeight: 800, letterSpacing: '0.5px' }}>
                  DEPARTMENT {activeDept?.num} / 12
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: WHITE }}>{activeDept?.name}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600 }}>MANAGERS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: RED }}>{manager ? 1 : 0}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600 }}>SUPERVISORS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#A78BFA' }}>{supervisors.length}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600 }}>JUNIORS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38BDF8' }}>{juniors.length}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600 }}>INTERNS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#94A3B8' }}>{interns.length}</div>
              </div>
            </div>
          </div>

          {/* Hierarchy Table */}
          <div style={{ background: WHITE, borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead style={{ background: SLATE, color: WHITE }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Rank</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Title</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Clearance Level</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Commission Split</th>
                </tr>
              </thead>
              <tbody>
                {deptStaff.map((person, idx) => (
                  <tr
                    key={person.id}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      background: person.accessLevel === 4
                        ? 'rgba(239, 68, 68, 0.06)'
                        : idx % 2 === 0 ? WHITE : '#F8FAFC',
                    }}
                  >
                    <td style={{ padding: '11px 16px', fontWeight: 700, color: person.accessLevel === 4 ? RED : SLATE }}>
                      {person.accessLevel === 4 ? '★' : `#${idx + 1}`}
                    </td>
                    <td style={{ padding: '11px 16px', fontWeight: person.accessLevel >= 3 ? 700 : 500, color: SLATE }}>
                      {person.name}
                    </td>
                    <td style={{ padding: '11px 16px', color: '#64748B', fontSize: '0.8rem' }}>
                      {person.roleTitle}
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700,
                        background: `${LEVEL_COLORS[person.accessLevel]}22`,
                        color: LEVEL_COLORS[person.accessLevel],
                        border: `1px solid ${LEVEL_COLORS[person.accessLevel]}44`,
                      }}>
                        L{person.accessLevel} · {LEVEL_LABELS[person.accessLevel] || 'STAFF'}
                      </span>
                    </td>
                    <td style={{ padding: '11px 16px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                      {person.commissionRule
                        ? `${Math.round(person.commissionRule.agentSplit * 100)}% / ${Math.round(person.commissionRule.companySplit * 100)}%`
                        : '—'}
                    </td>
                  </tr>
                ))}
                {deptStaff.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#94A3B8' }}>
                      No personnel assigned to this department yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
