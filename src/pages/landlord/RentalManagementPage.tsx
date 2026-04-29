import React, { FC, useState, useEffect, useRef } from 'react';
import { authFetch } from '../../utils/authFetch';
import { createLogger } from '../../utils/logger';
import '../RolePages.css';

const log = createLogger('RentalManagement');

interface LeaseProperty {
  id: string;
  title: string;
  location: string;
  type: string;
}

interface LeaseTenant {
  id: string;
  name: string;
  phone: string | null;
}

interface Lease {
  id: string;
  property: LeaseProperty;
  tenant: LeaseTenant;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  status: string;
  ejariNumber: string | null;
  nextPaymentDue: string | null;
}

const RentalManagementPage: FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const controller = new AbortController();

    const fetchLeases = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const res = await authFetch('/api/leases?role=landlord', { signal: controller.signal });
        if (!isMountedRef.current) return;
        if (res.ok) {
          const json = await res.json();
          setLeases(json.data || []);
        } else {
          setError('Failed to load leases.');
        }
      } catch (err) {
        if (!isMountedRef.current) return;
        if (err instanceof DOMException && err.name === 'AbortError') return;
        log.error('Error fetching leases:', err);
        setError('Unable to connect to the server.');
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    };

    fetchLeases();
    return () => {
      isMountedRef.current = false;
      controller.abort();
    };
  }, []);

  const isOccupied = (lease: Lease) => ['active', 'expiring'].includes(lease.status.toLowerCase());

  const filteredLeases = leases.filter(l => {
    if (filter === 'all') return true;
    if (filter === 'occupied') return isOccupied(l);
    if (filter === 'available') return !isOccupied(l);
    return true;
  });

  const formatDate = (iso: string): string =>
    new Date(iso).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatRent = (monthly: number): string => `AED ${(monthly * 12).toLocaleString()}/yr`;

  const handleFilterChange = (newFilter: string): void => {
    setFilter(newFilter);
  };

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <h1>Rental Management</h1>
          <p>Manage your rental properties and tenants</p>
        </div>

        <div className="filter-bar">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All Properties
          </button>
          <button
            className={`filter-btn ${filter === 'occupied' ? 'active' : ''}`}
            onClick={() => handleFilterChange('occupied')}
          >
            Occupied
          </button>
          <button
            className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
            onClick={() => handleFilterChange('available')}
          >
            Available
          </button>
        </div>

        {loading && (
          <div
            className="loading-state"
            style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}
          >
            Loading leases…
          </div>
        )}

        {error && (
          <div
            className="error-state"
            style={{
              padding: '1rem',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              color: '#B91C1C',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && filteredLeases.length === 0 && (
          <div
            className="empty-state"
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              border: '2px dashed var(--border-color, #e5e7eb)',
              borderRadius: '12px',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No leases found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {filter === 'all' ? 'You have no leases yet.' : `No ${filter} properties found.`}
            </p>
          </div>
        )}

        <div className="properties-grid">
          {filteredLeases.map(lease => {
            const occupied = isOccupied(lease);
            const statusLabel = occupied
              ? 'Occupied'
              : lease.status.charAt(0).toUpperCase() + lease.status.slice(1);
            return (
              <div
                key={lease.id}
                className={`property-card ${occupied ? 'occupied' : 'available'}`}
              >
                <div className="property-card-header">
                  <h3>{lease.property.title}</h3>
                  <span className={`status-badge ${occupied ? 'occupied' : 'available'}`}>
                    {statusLabel}
                  </span>
                </div>

                <div className="property-details">
                  <div className="detail-row">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{lease.property.location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Type</span>
                    <span className="detail-value">{lease.property.type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Annual Rent</span>
                    <span className="detail-value">{formatRent(lease.monthlyRent)}</span>
                  </div>
                  {lease.tenant && (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">Tenant</span>
                        <span className="detail-value">{lease.tenant.name}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Lease End</span>
                        <span className="detail-value">{formatDate(lease.endDate)}</span>
                      </div>
                    </>
                  )}
                  {lease.ejariNumber && (
                    <div className="detail-row">
                      <span className="detail-label">Ejari</span>
                      <span className="detail-value">{lease.ejariNumber}</span>
                    </div>
                  )}
                </div>

                <div className="property-actions">
                  {lease.tenant?.phone && (
                    <a href={`tel:${lease.tenant.phone}`} className="btn-secondary">
                      Call Tenant
                    </a>
                  )}
                  <button className="btn-outline" disabled title="Feature coming soon">
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RentalManagementPage;
