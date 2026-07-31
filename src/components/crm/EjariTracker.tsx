import React, { useEffect, useState } from 'react';
import { authFetch } from '../../utils/authFetch';

// ─── Types ────────────────────────────────────────────────────────────────

export type EjariStatus = 'pending' | 'registered' | 'expired' | 'cancelled';

export interface EjariLease {
  id: string;
  tenantName: string;
  propertyAddress: string;
  ejariNumber: string | null;
  ejariStatus: EjariStatus;
  ejariRegistrationDate: string | null;
  ejariExpiryDate: string | null;
}

interface UpdateEjariPayload {
  ejariNumber?: string;
  ejariStatus?: EjariStatus;
  ejariRegistrationDate?: string;
  ejariExpiryDate?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<EjariStatus, string> = {
  pending: 'Pending',
  registered: 'Registered',
  expired: 'Expired',
  cancelled: 'Cancelled',
};

const STATUS_COLOR: Record<EjariStatus, string> = {
  pending: '#f59e0b',
  registered: '#22c55e',
  expired: '#ef4444',
  cancelled: '#6b7280',
};

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function isExpiringSoon(dateStr: string | null, thresholdDays = 30): boolean {
  const days = daysUntil(dateStr);
  return days !== null && days >= 0 && days <= thresholdDays;
}

// ─── Component ────────────────────────────────────────────────────────────

interface EjariTrackerProps {
  leases?: EjariLease[];
}

const EjariTracker: React.FC<EjariTrackerProps> = ({ leases: initialLeases }) => {
  const [leases, setLeases] = useState<EjariLease[]>(initialLeases ?? []);
  const [loading, setLoading] = useState(!initialLeases);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if (initialLeases) return;
    setLoading(true);
    authFetch('/api/compliance/leases?ejari=true')
      .then((res) => res.json())
      .then((data) => {
        setLeases(data.data ?? []);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message || 'Failed to load Ejari data');
        setLoading(false);
      });
  }, [initialLeases]);

  async function handleUpdate(leaseId: string, payload: UpdateEjariPayload) {
    setUpdatingId(leaseId);
    setUpdateError(null);
    try {
      const res = await authFetch(`/api/compliance/ejari/${leaseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Update failed');
      setLeases((prev) =>
        prev.map((l) => (l.id === leaseId ? { ...l, ...payload } : l))
      );
    } catch (err: unknown) {
      setUpdateError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return <div role="status" aria-label="Loading Ejari data">Loading Ejari data…</div>;
  }

  if (error) {
    return <div role="alert" aria-label="Ejari load error">{error}</div>;
  }

  if (leases.length === 0) {
    return (
      <div aria-label="No leases">
        <p>No leases found.</p>
      </div>
    );
  }

  return (
    <div aria-label="Ejari Tracker">
      {updateError && (
        <div role="alert" aria-label="Update error" style={{ color: 'var(--accent-red, #ef4444)', marginBottom: 8 }}>
          {updateError}
        </div>
      )}

      <table aria-label="Ejari lease table">
        <thead>
          <tr>
            <th>Tenant</th>
            <th>Property</th>
            <th>Ejari Number</th>
            <th>Status</th>
            <th>Expiry</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leases.map((lease) => {
            const expiring = isExpiringSoon(lease.ejariExpiryDate);
            const days = daysUntil(lease.ejariExpiryDate);

            return (
              <tr
                key={lease.id}
                aria-label={`Lease row ${lease.id}`}
                data-expiring={expiring ? 'true' : 'false'}
              >
                <td>{lease.tenantName}</td>
                <td>{lease.propertyAddress}</td>
                <td>{lease.ejariNumber ?? '—'}</td>
                <td>
                  <span
                    style={{
                      color: STATUS_COLOR[lease.ejariStatus] ?? '#6b7280',
                      fontWeight: 600,
                    }}
                    aria-label={`Ejari status: ${STATUS_LABEL[lease.ejariStatus]}`}
                  >
                    {STATUS_LABEL[lease.ejariStatus] ?? lease.ejariStatus}
                  </span>
                </td>
                <td>
                  {lease.ejariExpiryDate ? (
                    <span
                      style={{ color: expiring ? 'var(--accent-red, #ef4444)' : 'inherit' }}
                      aria-label={expiring ? `Expiring in ${days} days` : undefined}
                    >
                      {new Date(lease.ejariExpiryDate).toLocaleDateString('en-AE')}
                      {expiring && ` (${days}d)`}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <button
                    aria-label={`Mark ${lease.id} as registered`}
                    disabled={updatingId === lease.id || lease.ejariStatus === 'registered'}
                    onClick={() => handleUpdate(lease.id, { ejariStatus: 'registered' })}
                  >
                    Mark Registered
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EjariTracker;
