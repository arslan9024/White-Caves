import React, { FC, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import '../../../pages/RolePages.css';

// ── Per-tenant demo data ─────────────────────────────────────────────────────

interface PaymentRecord {
  id: string;
  month: string;
  amount: number;
  paidDate: string | null;
  status: 'paid' | 'pending' | 'overdue';
}

interface MaintenanceRecord {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  submitted: string;
  status: 'open' | 'in-progress' | 'closed';
}

const TENANT_PAYMENTS: Record<string, PaymentRecord[]> = {
  'tenant-1': [
    { id: 'p1-1', month: 'Apr 2026', amount: 8000, paidDate: null, status: 'overdue' },
    { id: 'p1-2', month: 'Mar 2026', amount: 8000, paidDate: '2026-03-02', status: 'paid' },
    { id: 'p1-3', month: 'Feb 2026', amount: 8000, paidDate: '2026-02-01', status: 'paid' },
  ],
  'tenant-2': [
    { id: 'p2-1', month: 'Jun 2024', amount: 5000, paidDate: '2024-06-05', status: 'paid' },
    { id: 'p2-2', month: 'May 2024', amount: 5000, paidDate: '2024-05-03', status: 'paid' },
  ],
  'tenant-3': [
    { id: 'p3-1', month: 'Apr 2026', amount: 7500, paidDate: '2026-04-02', status: 'paid' },
    { id: 'p3-2', month: 'Mar 2026', amount: 7500, paidDate: null, status: 'pending' },
  ],
  'tenant-4': [
    { id: 'p4-1', month: 'Aug 2024', amount: 4800, paidDate: '2024-08-01', status: 'paid' },
  ],
};

const TENANT_MAINTENANCE: Record<string, MaintenanceRecord[]> = {
  'tenant-1': [
    { id: 'm1-1', title: 'AC not cooling', priority: 'high', submitted: '2026-04-10', status: 'open' },
    { id: 'm1-2', title: 'Kitchen tap dripping', priority: 'low', submitted: '2026-03-15', status: 'closed' },
  ],
  'tenant-2': [],
  'tenant-3': [
    { id: 'm3-1', title: 'Balcony door misaligned', priority: 'medium', submitted: '2026-04-05', status: 'in-progress' },
  ],
  'tenant-4': [],
};

interface TenantData {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  leaseStart: string;
  leaseEnd: string;
  status: 'active' | 'expired';
  unitNumber?: string;
  rentAmount?: number;
}

const LandlordTenantsTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [selectedTenant, setSelectedTenant] = useState<TenantData | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const mockTenants: TenantData[] = useMemo(
    () => [
      {
        id: 'tenant-1',
        name: 'Ahmed Al-Rashid',
        email: 'ahmed.rashid@email.ae',
        phone: '+971-50-123-4567',
        property: 'Marina View 2BR Apartment',
        leaseStart: 'Jan 1, 2024',
        leaseEnd: 'Dec 31, 2024',
        status: 'active',
        unitNumber: 'ART-1205',
        rentAmount: 8000,
      },
      {
        id: 'tenant-2',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+971-50-234-5678',
        property: 'Downtown Studio',
        leaseStart: 'Jul 1, 2023',
        leaseEnd: 'Jun 30, 2024',
        status: 'expired',
        unitNumber: 'DTS-0805',
        rentAmount: 5000,
      },
      {
        id: 'tenant-3',
        name: 'Fatima Al-Mansoori',
        email: 'fatima.al@email.ae',
        phone: '+971-50-345-6789',
        property: 'Marina View 2BR Apartment',
        leaseStart: 'Feb 1, 2024',
        leaseEnd: 'Jan 31, 2025',
        status: 'active',
        unitNumber: 'ART-1102',
        rentAmount: 7500,
      },
      {
        id: 'tenant-4',
        name: 'Mohammed Hassan',
        email: 'hassan.m@email.ae',
        phone: '+971-50-456-7890',
        property: 'Downtown Studio',
        leaseStart: 'Sep 1, 2023',
        leaseEnd: 'Aug 31, 2024',
        status: 'expired',
        unitNumber: 'DTS-1202',
        rentAmount: 4800,
      },
    ],
    []
  );

  const filteredTenants = useMemo(() => {
    return mockTenants.filter(tenant => {
      const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
      const normalizedSearch = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        tenant.name.toLowerCase().includes(normalizedSearch) ||
        tenant.email.toLowerCase().includes(normalizedSearch) ||
        tenant.property.toLowerCase().includes(normalizedSearch);
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, searchQuery, mockTenants]);

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view your tenants.</p>
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
              key={tenant.id}
              className="tenant-card"
              data-testid={`tenant-row-${tenant.id}`}
              onClick={() => setSelectedTenant(tenant)}
              role="button"
              tabIndex={0}
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
        <TenantDetailModal
          tenant={selectedTenant}
          onClose={() => setSelectedTenant(null)}
        />
      )}
    </div>
  );
};

// ── Tenant Detail Modal ───────────────────────────────────────────────────────

type DetailTab = 'info' | 'payments' | 'maintenance';

interface TenantDetailModalProps {
  tenant: TenantData;
  onClose: () => void;
}

const TenantDetailModal: FC<TenantDetailModalProps> = ({ tenant, onClose }) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('info');
  const payments = TENANT_PAYMENTS[tenant.id] ?? [];
  const maintenance = TENANT_MAINTENANCE[tenant.id] ?? [];

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
          {tenant.property} &middot; Unit {tenant.unitNumber ?? 'N/A'}
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
                  ? `Payments (${payments.length})`
                  : `Maintenance (${maintenance.length})`}
            </button>
          ))}
        </div>

        {/* Info tab */}
        {activeTab === 'info' && (
          <div className="detail-section" data-testid="tenant-detail-info">
            <div className="detail-grid">
              <div><strong>Email</strong><p>{tenant.email}</p></div>
              <div><strong>Phone</strong><p>{tenant.phone}</p></div>
              <div><strong>Lease Start</strong><p>{tenant.leaseStart}</p></div>
              <div><strong>Lease End</strong><p>{tenant.leaseEnd}</p></div>
              <div>
                <strong>Monthly Rent</strong>
                <p>AED {(tenant.rentAmount ?? 0).toLocaleString()}</p>
              </div>
              <div>
                <strong>Status</strong>
                <p>
                  <span className={`status-badge status-${tenant.status}`}>
                    {tenant.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payments tab */}
        {activeTab === 'payments' && (
          <div className="detail-section" data-testid="tenant-detail-payments">
            {payments.length === 0 ? (
              <p className="empty-state-text">No payment records for this tenant.</p>
            ) : (
              <div className="payments-list">
                {payments.map(p => (
                  <div key={p.id} className="payment-row" data-testid={`modal-payment-${p.id}`}>
                    <div>
                      <strong>{p.month}</strong>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.id}</p>
                    </div>
                    <div>
                      <p>AED {p.amount.toLocaleString()}</p>
                      <p style={{ fontSize: '0.8rem' }}>Paid: {p.paidDate ?? 'Not paid'}</p>
                    </div>
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
            {maintenance.length === 0 ? (
              <p className="empty-state-text">No maintenance requests from this tenant.</p>
            ) : (
              <div className="maintenance-list">
                {maintenance.map(m => (
                  <div key={m.id} className="maintenance-row" data-testid={`modal-maint-${m.id}`}>
                    <div>
                      <strong>{m.title}</strong>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Submitted: {m.submitted}
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

export default LandlordTenantsTab;
