import React, { FC, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import '../../../pages/RolePages.css';

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
        <div
          className="modal-overlay"
          onClick={() => setSelectedTenant(null)}
          data-testid="tenant-detail-modal"
        >
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedTenant(null)}>
              ×
            </button>
            <h2>{selectedTenant.name}</h2>
            <p>
              <strong>Email:</strong> {selectedTenant.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedTenant.phone}
            </p>
            <p>
              <strong>Property:</strong> {selectedTenant.property}
            </p>
            <p>
              <strong>Unit:</strong> {selectedTenant.unitNumber || 'N/A'}
            </p>
            <p>
              <strong>Lease:</strong> {selectedTenant.leaseStart} - {selectedTenant.leaseEnd}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span className={`status-badge status-${selectedTenant.status}`}>
                {selectedTenant.status === 'active' ? 'Active' : 'Expired'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordTenantsTab;
