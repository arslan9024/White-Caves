import React, { FC, useState, useEffect, useRef } from 'react';
import { authFetch } from '../../utils/authFetch';
import { createLogger } from '../../utils/logger';
import '../RolePages.css';
import './RentalManagementPage.css';

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

interface OverdueQueueItem {
  id: string;
  chequeNumber: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: 'pending' | 'bounced' | 'presented' | 'cleared';
  daysOverdue: number;
  lease: {
    id: string;
    leaseNumber: string | null;
    property: { id: string; title: string; location: string };
    tenant: { id: string; name: string; email: string; phone: string | null };
  };
}

interface EjariSummary {
  total: number;
  pending: number;
  registered: number;
  expired: number;
  cancelled: number;
  expiringSoon: number;
}

const defaultEjariSummary: EjariSummary = {
  total: 0,
  pending: 0,
  registered: 0,
  expired: 0,
  cancelled: 0,
  expiringSoon: 0,
};

const buildEjariSummaryFromLeases = (rawLeases: Lease[]): EjariSummary => {
  return {
    total: rawLeases.length,
    pending: rawLeases.filter(lease => lease.ejariNumber == null || lease.ejariNumber === '')
      .length,
    registered: rawLeases.filter(lease => lease.ejariNumber != null && lease.ejariNumber !== '')
      .length,
    expired: rawLeases.filter(lease => lease.status.toLowerCase() === 'expired').length,
    cancelled: rawLeases.filter(lease => lease.status.toLowerCase() === 'terminated').length,
    expiringSoon: rawLeases.filter(lease => lease.status.toLowerCase() === 'expiring').length,
  };
};

const RentalManagementPage: FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [queueError, setQueueError] = useState<string | null>(null);
  const [ejariError, setEjariError] = useState<string | null>(null);
  const [overdueQueue, setOverdueQueue] = useState<OverdueQueueItem[]>([]);
  const [ejariSummary, setEjariSummary] = useState<EjariSummary>(defaultEjariSummary);
  const [sendingReminders, setSendingReminders] = useState<Record<string, boolean>>({});
  const [reminderResults, setReminderResults] = useState<Record<string, string>>({});
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const controller = new AbortController();

    const fetchLeases = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        setQueueError(null);
        setEjariError(null);
        let leasesData: Lease[] = [];

        const [leasesRes, queueRes, ejariRes] = await Promise.all([
          authFetch('/api/leases?role=landlord', { signal: controller.signal }),
          authFetch('/api/leases/collections/overdue-queue', { signal: controller.signal }),
          authFetch('/api/leases/ejari/tracking?role=landlord&days=30', {
            signal: controller.signal,
          }),
        ]);

        if (!isMountedRef.current) return;
        if (leasesRes.ok) {
          const json = await leasesRes.json();
          leasesData = json.data || [];
          setLeases(leasesData);
        } else {
          setError('Failed to load leases.');
        }

        if (queueRes.ok) {
          const queueJson = await queueRes.json();
          setOverdueQueue(queueJson.data || []);
        } else {
          setQueueError('Unable to load overdue collection queue.');
        }

        if (ejariRes.ok) {
          const ejariJson = await ejariRes.json();
          const apiSummary = ejariJson.summary as EjariSummary | undefined;
          const fallbackSource = Array.isArray(ejariJson.data)
            ? (ejariJson.data as Lease[])
            : leasesData;
          setEjariSummary(apiSummary ?? buildEjariSummaryFromLeases(fallbackSource || []));
        } else {
          setEjariError('Unable to load Ejari tracking summary.');
          setEjariSummary(buildEjariSummaryFromLeases(leasesData));
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

  const formatCurrency = (amount: number, currency: string): string =>
    `${currency} ${amount.toLocaleString()}`;

  const handleSendCollectionReminder = async (item: OverdueQueueItem): Promise<void> => {
    setSendingReminders(prev => ({ ...prev, [item.id]: true }));
    setReminderResults(prev => ({ ...prev, [item.id]: '' }));

    try {
      const res = await authFetch(`/api/leases/collections/overdue-queue/${item.id}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'whatsapp',
          note: `Reminder for overdue cheque ${item.chequeNumber}`,
        }),
      });

      if (res.ok) {
        setReminderResults(prev => ({
          ...prev,
          [item.id]: 'Reminder logged successfully.',
        }));
      } else {
        setReminderResults(prev => ({
          ...prev,
          [item.id]: 'Failed to log reminder.',
        }));
      }
    } catch (err) {
      log.error('Failed to send collection reminder:', err);
      setReminderResults(prev => ({
        ...prev,
        [item.id]: 'Failed to log reminder.',
      }));
    } finally {
      setSendingReminders(prev => ({ ...prev, [item.id]: false }));
    }
  };

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

        {!loading && overdueQueue.length > 0 && (
          <section aria-label="Overdue rent collection queue" className="rm-overdue-queue">
            <h2 className="rm-overdue-queue__title">Overdue Rent Collection Queue</h2>
            <p className="rm-overdue-queue__subtitle">
              {overdueQueue.length} item(s) require collection follow-up.
            </p>

            {queueError && <p role="alert">{queueError}</p>}

            <div className="rm-overdue-queue__list">
              {overdueQueue.slice(0, 10).map(item => (
                <article key={item.id} className="rm-overdue-item">
                  <div>
                    <strong>{item.lease.property.title}</strong>
                    <div className="rm-overdue-item__meta">
                      {item.lease.tenant.name} • {formatCurrency(item.amount, item.currency)} •{' '}
                      {item.daysOverdue} day(s) overdue • {item.status}
                    </div>
                  </div>

                  <div className="rm-overdue-item__actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleSendCollectionReminder(item)}
                      disabled={Boolean(sendingReminders[item.id])}
                      aria-label={`Send collection reminder for cheque ${item.chequeNumber}`}
                    >
                      {sendingReminders[item.id] ? 'Sending...' : 'Send Reminder'}
                    </button>
                    {reminderResults[item.id] && (
                      <span className="rm-overdue-item__result">{reminderResults[item.id]}</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {!loading && (
          <section aria-label="Ejari compliance summary" className="rm-ejari-summary">
            <h2 className="rm-ejari-summary__title">Ejari Compliance Summary</h2>
            {ejariError && <p role="alert">{ejariError}</p>}
            <div className="rm-ejari-summary__grid">
              <div className="rm-ejari-summary__tile">
                <span className="rm-ejari-summary__label">Total leases</span>
                <strong>{ejariSummary.total}</strong>
              </div>
              <div className="rm-ejari-summary__tile">
                <span className="rm-ejari-summary__label">Registered</span>
                <strong>{ejariSummary.registered}</strong>
              </div>
              <div className="rm-ejari-summary__tile">
                <span className="rm-ejari-summary__label">Pending</span>
                <strong>{ejariSummary.pending}</strong>
              </div>
              <div className="rm-ejari-summary__tile">
                <span className="rm-ejari-summary__label">Expiring soon (30d)</span>
                <strong>{ejariSummary.expiringSoon}</strong>
              </div>
            </div>
          </section>
        )}

        {loading && <div className="loading-state rm-loading-state">Loading leases…</div>}

        {error && <div className="error-state rm-error-state">{error}</div>}

        {!loading && !error && filteredLeases.length === 0 && (
          <div className="empty-state rm-empty-state">
            <div className="rm-empty-state__emoji">🏠</div>
            <h3 className="rm-empty-state__title">No leases found</h3>
            <p className="rm-empty-state__subtitle">
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
