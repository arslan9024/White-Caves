/**
 * LandlordTenantsTab — Phase 29: Live API integration
 *
 * Tenant list derived from active leases.
 * Tenant details modal shows per-tenant PDC schedule (payments) and maintenance.
 *
 * @component
 */

import React, { FC, useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { authFetch } from '../../../utils/authFetch';
import '../../../pages/RolePages.css';

// ── API shapes ────────────────────────────────────────────────────────────────

interface ApiLease {
  id: string;
  propertyId: string;
  tenantId: string;
  monthlyRent: number;
  depositAmount: number;
  startDate: string;
  endDate: string;
  status: string;
  ejariNumber?: string | null;
  nextPaymentDue?: string | null;
  tenant: { id: string; name: string; email: string; phone: string } | null;
  property: { id: string; title: string; location: string; type: string } | null;
}

interface ApiPdc {
  id: string;
  chequeNumber?: string | null;
  amount: number;
  dueDate: string;
  status: string; // pending | cleared | bounced | cancelled
}

interface ApiMaintenance {
  id: string;
  title: string;
  priority: string;
  status: string;
  createdAt: string;
  property: { id: string; title: string } | null;
}

// ── Internal view models ──────────────────────────────────────────────────────

interface TenantData {
  id: string;
  leaseId: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  propertyId: string;
  leaseStart: string;
  leaseEnd: string;
  status: 'active' | 'expired';
  unitNumber?: string;
  rentAmount: number;
}

type DetailTab = 'info' | 'payments' | 'maintenance';

// ── Tenant Detail Modal ───────────────────────────────────────────────────────

interface TenantDetailModalProps {
  tenant: TenantData;
  onClose: () => void;
}

const TenantDetailModal: FC<TenantDetailModalProps> = ({ tenant, onClose }) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('info');
  const [pdcList, setPdcList] = useState<ApiPdc[]>([]);
  const [pdcLoading, setPdcLoading] = useState(false);
  const [maintenance, setMaintenance] = useState<ApiMaintenance[]>([]);
  const [maintLoading, setMaintLoading] = useState(false);

  // Fetch PDC schedule when payments tab is opened
  useEffect(() => {
    if (activeTab !== 'payments') return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPdcLoading(true);
    authFetch(`/api/leases/${tenant.leaseId}/pdc`)
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          setPdcList(data.data ?? []);
          setPdcLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setPdcLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab, tenant.leaseId]);

  // Fetch maintenance for the property when that tab is opened
  useEffect(() => {
    if (activeTab !== 'maintenance') return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMaintLoading(true);
    authFetch(`/api/maintenance?propertyId=${tenant.propertyId}&pageSize=20`)
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          setMaintenance(data.data ?? []);
          setMaintLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setMaintLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab, tenant.propertyId]);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      data-testid="tenant-detail-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${tenant.name}`}
    >
      <div className="modal-content modal-content--wide" onClick={e => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close tenant details"
          type="button"
        >
          &times;
        </button>

        <h2 className="modal-title">{tenant.name}</h2>
        <p className="modal-subtitle">
          {tenant.property} &middot; {tenant.status === 'active' ? '🟢 Active' : '⚫ Expired'}
        </p>

        {/* Detail tabs */}
        <div
          className="portal-tab-navigation modal-tabs"
          role="tablist"
          aria-label="Tenant detail sections"
          style={{ marginTop: '1rem' }}
        >
          {(['info', 'payments', 'maintenance'] as DetailTab[]).map(tab => (
            <button
              key={tab}
              role="tab"
              type="button"
              aria-selected={activeTab === tab}
              className={`portal-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
              data-testid={`tenant-detail-tab-${tab}`}
            >
              {tab === 'info'
                ? 'Contact Info'
                : tab === 'payments'
                  ? 'PDC / Payments'
                  : 'Maintenance'}
            </button>
          ))}
        </div>

        {/* Info tab */}
        {activeTab === 'info' && (
          <div className="detail-section" data-testid="tenant-detail-info">
            <div className="detail-grid">
              <div>
                <strong>Email</strong>
                <p>{tenant.email || '—'}</p>
              </div>
              <div>
                <strong>Phone</strong>
                <p>{tenant.phone || '—'}</p>
              </div>
              <div>
                <strong>Lease Start</strong>
                <p>{tenant.leaseStart}</p>
              </div>
              <div>
                <strong>Lease End</strong>
                <p>{tenant.leaseEnd}</p>
              </div>
              <div>
                <strong>Monthly Rent</strong>
                <p>AED {tenant.rentAmount.toLocaleString()}</p>
              </div>
              <div>
                <strong>Status</strong>
                <p>
                  <span className={`status-badge status-${tenant.status}`}>{tenant.status}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payments / PDC tab */}
        {activeTab === 'payments' && (
          <div className="detail-section" data-testid="tenant-detail-payments">
            {pdcLoading ? (
              <p className="empty-state-text">⏳ Loading payment schedule…</p>
            ) : pdcList.length === 0 ? (
              <p className="empty-state-text">No PDC cheques recorded for this lease.</p>
            ) : (
              <div className="payments-list">
                {pdcList.map(p => (
                  <div key={p.id} className="payment-row" data-testid={`modal-payment-${p.id}`}>
                    <div>
                      <strong>
                        {new Date(p.dueDate).toLocaleDateString('en-AE', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </strong>
                      {p.chequeNumber && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Cheque #{p.chequeNumber}
                        </p>
                      )}
                    </div>
                    <p>AED {p.amount.toLocaleString()}</p>
                    <span className={`status-badge status-${p.status}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Maintenance tab */}
        {activeTab === 'maintenance' && (
          <div className="detail-section" data-testid="tenant-detail-maintenance">
            {maintLoading ? (
              <p className="empty-state-text">⏳ Loading maintenance requests…</p>
            ) : maintenance.length === 0 ? (
              <p className="empty-state-text">No maintenance requests for this property.</p>
            ) : (
              <div className="maintenance-list">
                {maintenance.map(m => (
                  <div key={m.id} className="maintenance-row" data-testid={`modal-maint-${m.id}`}>
                    <div>
                      <strong>{m.title}</strong>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Submitted: {new Date(m.createdAt).toLocaleDateString('en-AE')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className={`priority-badge priority-${m.priority}`}>{m.priority}</span>
                      <span className={`status-badge status-${m.status}`}>{m.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const LandlordTenantsTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [selectedTenant, setSelectedTenant] = useState<TenantData | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [leases, setLeases] = useState<ApiLease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;

    authFetch('/api/leases?role=landlord&pageSize=100')
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          setLeases(data.data ?? []);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError((err as Error).message || 'Failed to load tenants');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  /** Map leases → TenantData view models */
  const tenants: TenantData[] = useMemo(
    () =>
      leases.map(lease => ({
        id: lease.tenantId,
        leaseId: lease.id,
        name: lease.tenant?.name ?? 'Unknown Tenant',
        email: lease.tenant?.email ?? '',
        phone: lease.tenant?.phone ?? '',
        property: lease.property?.title ?? 'Unknown Property',
        propertyId: lease.propertyId,
        leaseStart: new Date(lease.startDate).toLocaleDateString('en-AE', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        leaseEnd: new Date(lease.endDate).toLocaleDateString('en-AE', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        status: lease.status === 'active' || lease.status === 'expiring' ? 'active' : 'expired',
        rentAmount: lease.monthlyRent,
      })),
    [leases]
  );

  const filteredTenants = useMemo(() => {
    return tenants.filter(tenant => {
      const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
      const normalizedSearch = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        tenant.name.toLowerCase().includes(normalizedSearch) ||
        tenant.email.toLowerCase().includes(normalizedSearch) ||
        tenant.property.toLowerCase().includes(normalizedSearch);
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, searchQuery, tenants]);

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view your tenants.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="empty-state" data-testid="tenants-loading">
        <p>⏳ Loading your tenants…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state" data-testid="tenants-error">
        <p>⚠️ {error}</p>
        <button className="btn-secondary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="landlord-tenants-tab">
      <div className="tab-header">
        <h3>Manage Tenants</h3>
        <p>View all current and past tenants across your properties</p>
      </div>

      <div className="tab-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, or property..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            data-testid="tenant-search"
          />
        </div>

        <div className="filter-controls">
          <label>Filter by status:</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'all' | 'active' | 'expired')}
            data-testid="status-filter"
          >
            <option value="all">All Tenants</option>
            <option value="active">Active Leases</option>
            <option value="expired">Expired Leases</option>
          </select>
        </div>
      </div>

      {filteredTenants.length === 0 ? (
        <div className="empty-state" data-testid="empty-state">
          <p>{searchQuery ? 'No tenants match your search.' : 'No tenants found.'}</p>
        </div>
      ) : (
        <div className="tenants-list">
          {filteredTenants.map(tenant => (
            <div
              key={`${tenant.id}-${tenant.leaseId}`}
              className="tenant-card"
              data-testid={`tenant-row-${tenant.id}`}
              onClick={() => setSelectedTenant(tenant)}
              role="button"
              tabIndex={0}
              onKeyPress={e => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedTenant(tenant);
              }}
            >
              <h4>{tenant.name}</h4>
              <p className="email">{tenant.email}</p>
              <p className="phone">{tenant.phone}</p>
              <p className="property">{tenant.property}</p>
              <span className={`status-badge status-${tenant.status}`}>
                {tenant.status === 'active' ? 'Active' : 'Expired'}
              </span>
            </div>
          ))}
        </div>
      )}

      {selectedTenant && (
        <TenantDetailModal tenant={selectedTenant} onClose={() => setSelectedTenant(null)} />
      )}
    </div>
  );
};

export default LandlordTenantsTab;
