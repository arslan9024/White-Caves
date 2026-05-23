import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

interface Lease {
  id: string | number;
  unit: string;
  building?: string;
  tenant: string;
  tenantPhone?: string;
  rent: number;
  endDate: string;
  daysRemaining: number;
  status: string;
  ejariStatus?: 'registered' | 'pending' | 'expired' | null;
  ejariNumber?: string | null;
  pdcCount?: number;
  pdcCleared?: number;
  pdcBounced?: number;
  renewalNotice?: boolean;
}

interface LeasesTabProps {
  leases: Lease[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const FILTER_OPTIONS = ['all', 'active', 'expiring_soon', 'renewal_pending', 'expired'] as const;

const EjariBadge: React.FC<{ status?: 'registered' | 'pending' | 'expired' | null }> = ({
  status,
}) => {
  if (!status) return <span style={{ color: '#64748B', fontSize: '12px' }}>—</span>;
  const config = {
    registered: { dot: '#10B981', label: 'Registered' },
    pending: { dot: '#F59E0B', label: 'Pending' },
    expired: { dot: '#EF4444', label: 'Expired' },
  };
  // eslint-disable-next-line security/detect-object-injection
  const c = config[status];
  return (
    <span
      style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: c.dot }}
    >
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: c.dot,
          display: 'inline-block',
        }}
      />
      {c.label}
    </span>
  );
};

const LeasesTab: React.FC<LeasesTabProps> = ({ leases, searchQuery, onSearchChange }) => {
  const [localFilter, setLocalFilter] = useState<string>('all');

  const displayed = localFilter === 'all' ? leases : leases.filter(l => l.status === localFilter);

  return (
    <div className="leases-view">
      <div className="view-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Active Leases</h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {leases.length} total · {leases.filter(l => l.status === 'active').length} active
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search leases..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            />
          </div>
          <button className="add-btn">
            <Plus size={16} /> New Lease
          </button>
        </div>
      </div>

      <div className="filter-buttons" style={{ marginBottom: '16px' }}>
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt}
            className={`filter-btn${localFilter === opt ? ' active' : ''}`}
            onClick={() => setLocalFilter(opt)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              borderColor: localFilter === opt ? '#14B8A6' : 'var(--color-border-default)',
              background: localFilter === opt ? 'rgba(20,184,166,0.15)' : 'var(--rgba-white-05)',
              color: localFilter === opt ? '#14B8A6' : 'var(--color-text-secondary)',
            }}
          >
            {opt === 'all' ? 'All' : opt.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="leases-table">
        <div className="table-header">
          <span>Unit</span>
          <span>Tenant</span>
          <span>Annual Rent</span>
          <span>End Date</span>
          <span>Days Left</span>
          <span>Ejari</span>
          <span>PDC</span>
          <span>Status</span>
        </div>
        {displayed.map((lease: Lease) => (
          <div key={lease.id} className="table-row">
            <span
              className="unit-name"
              style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
            >
              <strong>{lease.unit}</strong>
              {lease.building && (
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                  {lease.building}
                </span>
              )}
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>{lease.tenant}</span>
              {lease.tenantPhone && (
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                  {lease.tenantPhone}
                </span>
              )}
            </span>
            <span>AED {(lease.rent * 12).toLocaleString()}</span>
            <span>{lease.endDate}</span>
            <span className={lease.daysRemaining < 60 ? 'warning' : ''}>
              {lease.daysRemaining}
              {lease.daysRemaining < 60 && (
                <span style={{ marginLeft: '4px', fontSize: '11px' }}>⚠️</span>
              )}
            </span>
            <span>
              <EjariBadge status={lease.ejariStatus} />
            </span>
            <span>
              {lease.pdcCount !== undefined ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#10B981' }}>
                    {lease.pdcCleared}/{lease.pdcCount}
                  </span>
                  {(lease.pdcBounced ?? 0) > 0 && (
                    <span style={{ color: '#EF4444', fontSize: '11px' }} title="Bounced PDC">
                      🔴
                    </span>
                  )}
                </span>
              ) : (
                <span style={{ color: '#64748B', fontSize: '12px' }}>—</span>
              )}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span className={`status-badge ${lease.status}`}>
                {lease.status.replace(/_/g, ' ')}
              </span>
              {lease.renewalNotice && (
                <button
                  style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid #14B8A6',
                    background: 'rgba(20,184,166,0.1)',
                    color: '#14B8A6',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Renew ↗
                </button>
              )}
            </span>
          </div>
        ))}
        {displayed.length === 0 && (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: 'var(--color-text-secondary)',
              fontSize: '14px',
            }}
          >
            No leases match the current filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default LeasesTab;
