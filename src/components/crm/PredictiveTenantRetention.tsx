import React, { FC, useState } from 'react';
import { ShieldAlert, RefreshCw, PhoneCall, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export interface TenantRetentionItem {
  id: string;
  tenantName: string;
  unitCode: string;
  community: string;
  ejariExpiryDate: string; // YYYY-MM-DD
  daysUntilExpiry: number;
  churnRiskScore: number; // 0 - 100%
  latePaymentsCount: number;
  maintenanceTicketsCount: number;
  currentRentAED: number;
  status: 'PENDING_RETENTION' | 'RETENTION_DISPATCHED' | 'RENEWED' | 'VACATING';
}

const MOCK_RETENTION_DATA: TenantRetentionItem[] = [
  {
    id: 'RET-101',
    tenantName: 'Tariq Al-Mansoor',
    unitCode: 'DAMAC-DH2-V84',
    community: 'DAMAC Hills 2 (Akoya)',
    ejariExpiryDate: '2026-11-04',
    daysUntilExpiry: 95,
    churnRiskScore: 78,
    latePaymentsCount: 2,
    maintenanceTicketsCount: 4,
    currentRentAED: 110000,
    status: 'PENDING_RETENTION',
  },
  {
    id: 'RET-102',
    tenantName: 'Elena Rostova',
    unitCode: 'MARINA-PLAZA-A42',
    community: 'Dubai Marina',
    ejariExpiryDate: '2026-11-12',
    daysUntilExpiry: 103,
    churnRiskScore: 42,
    latePaymentsCount: 0,
    maintenanceTicketsCount: 1,
    currentRentAED: 185000,
    status: 'PENDING_RETENTION',
  },
  {
    id: 'RET-103',
    tenantName: 'Marcus Vance',
    unitCode: 'PALM-VILLA-P12',
    community: 'Palm Jumeirah',
    ejariExpiryDate: '2026-10-28',
    daysUntilExpiry: 88,
    churnRiskScore: 85,
    latePaymentsCount: 3,
    maintenanceTicketsCount: 6,
    currentRentAED: 450000,
    status: 'RETENTION_DISPATCHED',
  },
];

export const PredictiveTenantRetention: FC = () => {
  const [retentionItems, setRetentionItems] = useState<TenantRetentionItem[]>(MOCK_RETENTION_DATA);

  const handleDispatchRetention = (id: string) => {
    setRetentionItems(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'RETENTION_DISPATCHED' } : item))
    );
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--wc-bg-card, #FFFFFF)',
        border: '1px solid var(--wc-border-light, #E2E8F0)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
      }}
      data-testid="predictive-tenant-retention"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--wc-text-primary, #1E293B)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} color="var(--wc-red-primary, #EF4444)" />
            Predictive Tenant Churn & 95-Day Retention Engine
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--wc-text-secondary, #64748B)', margin: '4px 0 0 0' }}>
            AI churn forecasting for expiring Ejari contracts based on payment delays & ticket frequency.
          </p>
        </div>
        <div style={{ fontSize: '12px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--wc-red-primary, #EF4444)' }}>
          {retentionItems.length} High-Risk Expirations
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {retentionItems.map(item => {
          const isHighRisk = item.churnRiskScore >= 70;
          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--wc-border-light, #E2E8F0)',
                borderLeft: `4px solid ${isHighRisk ? 'var(--wc-red-primary, #EF4444)' : 'var(--wc-info, #3B82F6)'}`,
                backgroundColor: 'var(--wc-bg-subtle, #F8FAFC)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--wc-text-primary, #1E293B)' }}>{item.tenantName}</span>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--wc-border-light, #E2E8F0)', color: 'var(--wc-text-muted, #475569)' }}>{item.unitCode}</span>
                  <span style={{ fontSize: '11px', color: 'var(--wc-text-secondary, #64748B)' }}>{item.community}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--wc-text-secondary, #64748B)' }}>
                  <span>Expiry: <strong>{item.ejariExpiryDate} ({item.daysUntilExpiry} days)</strong></span>
                  <span>Late Payments: <strong>{item.latePaymentsCount}</strong></span>
                  <span>Tickets: <strong>{item.maintenanceTicketsCount}</strong></span>
                  <span>Rent: <strong>AED {item.currentRentAED.toLocaleString()}</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--wc-text-secondary, #64748B)' }}>Churn Risk Score</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: isHighRisk ? 'var(--wc-red-primary, #EF4444)' : 'var(--wc-info-dark, #2563EB)' }}>
                    {item.churnRiskScore}%
                  </div>
                </div>

                {item.status === 'RETENTION_DISPATCHED' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 'bold', color: 'var(--wc-success, #16A34A)', backgroundColor: 'var(--wc-success-bg, #DCFCE7)', padding: '8px 12px', borderRadius: '6px' }}>
                    <CheckCircle size={14} />
                    Nadia Call Active
                  </div>
                ) : (
                  <button
                    onClick={() => handleDispatchRetention(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      backgroundColor: 'var(--wc-red-primary, #EF4444)',
                      color: 'var(--wc-text-inverse, #FFFFFF)',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(239, 68, 68, 0.2)',
                    }}
                  >
                    <PhoneCall size={14} />
                    Trigger Nadia Call
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PredictiveTenantRetention;
