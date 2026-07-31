import React, { useState } from 'react';
import { MaintenanceRequest, MaintenancePriority, MaintenanceStatus } from '../data/leasing';

interface MaintenanceTabProps {
  requests: MaintenanceRequest[];
  onUpdateStatus?: (id: number, status: MaintenanceStatus) => void;
}

const PRIORITY_ORDER: MaintenancePriority[] = ['critical', 'high', 'medium', 'low'];

const PRIORITY_COLORS: Record<MaintenancePriority, { bg: string; text: string }> = {
  critical: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444' },
  high: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
  medium: { bg: 'rgba(99,102,241,0.15)', text: '#818CF8' },
  low: { bg: 'rgba(100,116,139,0.15)', text: '#94A3B8' },
};

const STATUS_COLORS: Record<MaintenanceStatus, { bg: string; text: string }> = {
  pending: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
  in_progress: { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
  scheduled: { bg: 'rgba(99,102,241,0.15)', text: '#818CF8' },
  completed: { bg: 'rgba(16,185,129,0.15)', text: '#10B981' },
  cancelled: { bg: 'rgba(100,116,139,0.15)', text: '#64748B' },
};

const CATEGORY_COLORS: Record<string, string> = {
  HVAC: '#14B8A6',
  Plumbing: '#3B82F6',
  Electrical: '#F59E0B',
  Structural: '#EF4444',
  Landscaping: '#10B981',
};

type FilterPriority = MaintenancePriority | 'all';
type FilterStatus = MaintenanceStatus | 'all';

const MaintenanceTab: React.FC<MaintenanceTabProps> = ({ requests, onUpdateStatus }) => {
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  const filtered = requests
    .filter(r => filterPriority === 'all' || r.priority === filterPriority)
    .filter(r => filterStatus === 'all' || r.status === filterStatus)
    .sort((a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority));

  return (
    <div className="maintenance-view">
      <div className="view-header">
        <div>
          <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Maintenance Requests</h3>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {stats.total} total · {stats.pending} pending · {stats.in_progress} in progress ·{' '}
            {stats.completed} completed
          </p>
        </div>
        <button
          className="add-btn"
          style={{ background: 'linear-gradient(135deg, var(--accent-teal, #14B8A6) 0%, var(--accent-green, #10B981) 100%)' }}
        >
          + New Request
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <div>
          <span
            style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginRight: '8px' }}
          >
            Priority:
          </span>
          <div className="filter-buttons" style={{ display: 'inline-flex', gap: '6px' }}>
            {(['all', ...PRIORITY_ORDER] as FilterPriority[]).map(p => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1px solid',
                  fontSize: '12px',
                  cursor: 'pointer',
                  borderColor: filterPriority === p ? '#14B8A6' : 'var(--color-border-default)',
                  background:
                    filterPriority === p ? 'rgba(20,184,166,0.15)' : 'var(--rgba-white-05)',
                  color: filterPriority === p ? '#14B8A6' : 'var(--color-text-secondary)',
                }}
              >
                {p === 'all' ? 'All' : p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span
            style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginRight: '8px' }}
          >
            Status:
          </span>
          <div className="filter-buttons" style={{ display: 'inline-flex', gap: '6px' }}>
            {(
              [
                'all',
                'pending',
                'in_progress',
                'scheduled',
                'completed',
                'cancelled',
              ] as FilterStatus[]
            ).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1px solid',
                  fontSize: '12px',
                  cursor: 'pointer',
                  borderColor: filterStatus === s ? '#14B8A6' : 'var(--color-border-default)',
                  background: filterStatus === s ? 'rgba(20,184,166,0.15)' : 'var(--rgba-white-05)',
                  color: filterStatus === s ? '#14B8A6' : 'var(--color-text-secondary)',
                }}
              >
                {s === 'all' ? 'All' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="maintenance-list">
        {filtered.length === 0 && (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: 'var(--color-text-secondary)',
              fontSize: '14px',
              background: 'var(--rgba-white-05)',
              borderRadius: '12px',
            }}
          >
            No maintenance requests match the current filters.
          </div>
        )}
        {filtered.map((req: MaintenanceRequest) => {
          const pCol = PRIORITY_COLORS[req.priority];
          const sCol = STATUS_COLORS[req.status];
          const catCol = CATEGORY_COLORS[req.category] ?? '#64748B';

          return (
            <div
              key={req.id}
              className={`maintenance-card ${req.priority}`}
              style={{
                flexDirection: 'column',
                alignItems: 'stretch',
                borderLeft: `3px solid ${pCol.text}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '2px',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: '14px',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {req.unit}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                      — {req.building}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    {req.tenant}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: `${catCol}22`,
                      color: catCol,
                      border: `1px solid ${catCol}44`,
                    }}
                  >
                    {req.category}
                  </span>
                  <span
                    className={`priority-badge ${req.priority}`}
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: pCol.bg,
                      color: pCol.text,
                    }}
                  >
                    {req.priority}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: sCol.bg,
                      color: sCol.text,
                    }}
                  >
                    {req.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <p
                className="issue"
                style={{
                  margin: '0 0 10px',
                  fontSize: '13px',
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.5,
                }}
              >
                {req.issue}
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '8px',
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '10px',
                }}
              >
                <span>📅 Created: {req.created}</span>
                {req.scheduledDate && <span>🗓 Scheduled: {req.scheduledDate}</span>}
                {req.completedDate && <span>✅ Completed: {req.completedDate}</span>}
                {req.estimatedCost !== null && (
                  <span>💰 Est: AED {req.estimatedCost.toLocaleString()}</span>
                )}
                {req.actualCost !== null && (
                  <span>💳 Actual: AED {req.actualCost.toLocaleString()}</span>
                )}
              </div>

              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ fontSize: '12px', color: req.assignedTo ? 'var(--accent-teal, #14B8A6)' : 'var(--accent-gold, #F59E0B)' }}>
                  {req.assignedTo ? `👷 ${req.assignedTo}` : '⚠️ Unassigned'}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {req.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onUpdateStatus?.(req.id, 'in_progress')}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid #3B82F6',
                          background: 'rgba(59,130,246,0.1)',
                          color: '#60A5FA',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Mark In Progress
                      </button>
                      <button
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid #14B8A6',
                          background: 'rgba(20,184,166,0.1)',
                          color: '#14B8A6',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Assign
                      </button>
                    </>
                  )}
                  {req.status === 'in_progress' && (
                    <button
                      onClick={() => onUpdateStatus?.(req.id, 'completed')}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: '1px solid #10B981',
                        background: 'rgba(16,185,129,0.1)',
                        color: '#10B981',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Mark Complete
                    </button>
                  )}
                  {req.status === 'scheduled' && (
                    <button
                      onClick={() => onUpdateStatus?.(req.id, 'in_progress')}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: '1px solid #3B82F6',
                        background: 'rgba(59,130,246,0.1)',
                        color: '#60A5FA',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Start Work
                    </button>
                  )}
                  {req.status !== 'completed' && req.status !== 'cancelled' && (
                    <button
                      onClick={() => onUpdateStatus?.(req.id, 'cancelled')}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: '1px solid #EF4444',
                        background: 'rgba(239,68,68,0.1)',
                        color: '#EF4444',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MaintenanceTab;
