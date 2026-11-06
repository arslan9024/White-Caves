// FILE: src/components/crm/TenantManager/TenantLeaseWidget.tsx
/**
 * White Caves Real Estate LLC - Tenant Lease & Ejari Signing Widget
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { FileCheck, Download, CheckCircle, PenTool } from 'lucide-react';
import { TenantLease } from './TenantManager.types';
import { SectionCard, ActionButton } from './TenantManager.styles';

interface TenantLeaseWidgetProps {
  lease: TenantLease;
  onSignLease: () => void;
}

export const TenantLeaseWidget: FC<TenantLeaseWidgetProps> = ({ lease, onSignLease }) => {
  return (
    <SectionCard data-testid="tenant-lease-widget">
      <h2 className="section-title">
        <FileCheck size={18} color="#ef4444" />
        <span>Official DLD Ejari Tenancy Contract Details</span>
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        <div
          style={{
            background: '#1e293b',
            padding: 18,
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
            {lease.propertyTitle}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            {lease.community} — {lease.unitNumber}
          </div>
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              fontSize: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Ejari Registration:</span>
              <span style={{ fontFamily: 'monospace', color: '#60a5fa' }}>{lease.ejariNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Contract Period:</span>
              <span>
                {lease.startDate} to {lease.endDate}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Payment Schedule:</span>
              <span>{lease.paymentFrequency}</span>
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#1e293b',
            padding: 18,
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
              Digital Signature & Landlord Verification
            </div>
            <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5 }}>
              Lessor: <strong>{lease.landlordName}</strong> ({lease.landlordPhone})<br />
              Status:{' '}
              {lease.isSignedDigitally ? (
                <span style={{ color: '#4ade80', fontWeight: 700 }}>
                  <CheckCircle size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Digitally Executed via UAE PASS
                </span>
              ) : (
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>Signature Pending</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            {!lease.isSignedDigitally ? (
              <ActionButton $variant="primary" onClick={onSignLease} data-testid="btn-sign-lease">
                <PenTool size={13} /> Sign Tenancy Agreement
              </ActionButton>
            ) : (
              <ActionButton
                onClick={() => alert('Downloading official DLD attested Ejari certificate...')}
                data-testid="btn-download-ejari"
              >
                <Download size={13} /> Download Attested Ejari PDF
              </ActionButton>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  );
};
