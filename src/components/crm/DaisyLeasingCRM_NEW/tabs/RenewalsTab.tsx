import React, { useState } from 'react';
import { RenewalRecord } from '../data/leasing';

interface RenewalsTabProps {
  renewals: RenewalRecord[];
  onSendNotice?: (id: number) => void;
  onMarkAccepted?: (id: number) => void;
  onMarkRejected?: (id: number) => void;
}

const RESPONSE_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
  accepted: { bg: 'rgba(16,185,129,0.15)', text: '#10B981' },
  negotiating: { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
  rejected: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444' },
};

const RenewalsTab: React.FC<RenewalsTabProps> = ({
  renewals,
  onSendNotice,
  onMarkAccepted,
  onMarkRejected,
}) => {
  const [localRenewals, setLocalRenewals] = useState<RenewalRecord[]>(renewals);

  const dueThisMonth = localRenewals.filter(r => r.daysUntilExpiry <= 30).length;
  const noticeSent = localRenewals.filter(r => r.noticeSent).length;
  const confirmed = localRenewals.filter(r => r.tenantResponse === 'accepted').length;
  const rejected = localRenewals.filter(r => r.tenantResponse === 'rejected').length;
  const negotiating = localRenewals.filter(r => r.tenantResponse === 'negotiating').length;

  const handleSendNotice = (id: number) => {
    setLocalRenewals(prev => prev.map(r => (r.id === id ? { ...r, noticeSent: true } : r)));
    onSendNotice?.(id);
  };
  const handleAccept = (id: number) => {
    setLocalRenewals(prev =>
      prev.map(r => (r.id === id ? { ...r, tenantResponse: 'accepted' } : r))
    );
    onMarkAccepted?.(id);
  };
  const handleReject = (id: number) => {
    setLocalRenewals(prev =>
      prev.map(r => (r.id === id ? { ...r, tenantResponse: 'rejected' } : r))
    );
    onMarkRejected?.(id);
  };

  const getDaysColor = (days: number) => {
    if (days < 30) return '#EF4444';
    if (days < 60) return '#F59E0B';
    return '#10B981';
  };

  return (
    <div className="renewals-view">
      <div className="view-header">
        <div>
          <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Lease Renewals</h3>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Manage upcoming lease renewals and tenant responses
          </p>
        </div>
      </div>

      <div className="renewal-summary" style={{ marginBottom: '24px' }}>
        <div className="renewal-stat">
          <span className="value" style={{ color: 'var(--accent-red, #EF4444)' }}>
            {dueThisMonth}
          </span>
          <span className="label">Due in 30 Days</span>
        </div>
        <div className="renewal-stat">
          <span className="value" style={{ color: 'var(--accent-teal, #14B8A6)' }}>
            {noticeSent}
          </span>
          <span className="label">Notices Sent</span>
        </div>
        <div className="renewal-stat">
          <span className="value" style={{ color: 'var(--accent-green, #10B981)' }}>
            {confirmed}
          </span>
          <span className="label">Confirmed</span>
        </div>
        <div className="renewal-stat">
          <span className="value" style={{ color: 'var(--color-60a5fa, #60A5FA)' }}>
            {negotiating}
          </span>
          <span className="label">Negotiating</span>
        </div>
        <div className="renewal-stat">
          <span className="value" style={{ color: 'var(--accent-red, #EF4444)' }}>
            {rejected}
          </span>
          <span className="label">Rejected</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {localRenewals.map((renewal: RenewalRecord) => {
          const rentIncrease = renewal.proposedRent - renewal.currentRent;
          const rentIncreasePct = ((rentIncrease / renewal.currentRent) * 100).toFixed(1);
          const daysColor = getDaysColor(renewal.daysUntilExpiry);
          const respColor = RESPONSE_COLORS[renewal.tenantResponse] ?? RESPONSE_COLORS.pending;

          return (
            <div
              key={renewal.id}
              style={{
                background: 'var(--rgba-white-05)',
                border: '1px solid var(--rgba-white-10)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--color-text-primary)' }}>
                    {renewal.unit}
                  </h4>
                  <p
                    style={{
                      margin: '3px 0 0',
                      fontSize: '13px',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    Tenant: {renewal.tenant}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      background: respColor.bg,
                      color: respColor.text,
                      border: `1px solid ${respColor.text}44`,
                    }}
                  >
                    {renewal.tenantResponse}
                  </span>
                  {renewal.noticeSent ? (
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        background: 'rgba(16,185,129,0.15)',
                        color: '#10B981',
                      }}
                    >
                      ✓ Notice Sent
                    </span>
                  ) : (
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        background: 'rgba(245,158,11,0.15)',
                        color: '#F59E0B',
                      }}
                    >
                      Notice Pending
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    background: 'var(--rgba-white-05)',
                    borderRadius: '8px',
                    padding: '10px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '4px',
                    }}
                  >
                    Current Rent
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    AED {renewal.currentRent.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                    per year
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(20,184,166,0.08)',
                    borderRadius: '8px',
                    padding: '10px',
                    border: '1px solid rgba(20,184,166,0.2)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '4px',
                    }}
                  >
                    Proposed Rent
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--accent-teal, #14B8A6)' }}>
                    AED {renewal.proposedRent.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--accent-teal, #14B8A6)' }}>
                    +{rentIncreasePct}% increase
                  </div>
                </div>
                <div
                  style={{
                    background: 'var(--rgba-white-05)',
                    borderRadius: '8px',
                    padding: '10px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '4px',
                    }}
                  >
                    Renewal Date
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {renewal.renewalDate}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: daysColor }}>
                    {renewal.daysUntilExpiry} days left
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'flex-end',
                  flexWrap: 'wrap',
                }}
              >
                {!renewal.noticeSent && (
                  <button
                    onClick={() => handleSendNotice(renewal.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: '1px solid #14B8A6',
                      background: 'rgba(20,184,166,0.1)',
                      color: '#14B8A6',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Send Notice
                  </button>
                )}
                {renewal.tenantResponse !== 'accepted' && (
                  <button
                    onClick={() => handleAccept(renewal.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: '1px solid #10B981',
                      background: 'rgba(16,185,129,0.1)',
                      color: '#10B981',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Mark Accepted
                  </button>
                )}
                {renewal.tenantResponse !== 'rejected' && (
                  <button
                    onClick={() => handleReject(renewal.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: '1px solid #EF4444',
                      background: 'rgba(239,68,68,0.1)',
                      color: '#EF4444',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Mark Rejected
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: '24px',
          padding: '14px 18px',
          background: 'rgba(20,184,166,0.08)',
          border: '1px solid rgba(20,184,166,0.2)',
          borderRadius: '10px',
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
        }}
      >
        📊 <strong style={{ color: 'var(--accent-teal, #14B8A6)' }}>Occupancy Forecast:</strong>{' '}
        {localRenewals.filter(r => r.tenantResponse === 'accepted').length} renewals confirmed ·{' '}
        {localRenewals.filter(r => r.tenantResponse === 'rejected').length} units may become vacant
        · Monitor market rates for competitive pricing.
      </div>
    </div>
  );
};

export default RenewalsTab;
