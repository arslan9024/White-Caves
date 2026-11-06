// FILE: src/components/crm/LandlordManager/LandlordTenanciesWidget.tsx
/**
 * White Caves Real Estate LLC - Landlord Tenancies & Ejari Widget
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { FileCheck } from 'lucide-react';
import { LandlordProperty } from './LandlordManager.types';
import { SectionCard, DataTable, StatusPill } from './LandlordManager.styles';

interface LandlordTenanciesWidgetProps {
  properties: LandlordProperty[];
}

export const LandlordTenanciesWidget: FC<LandlordTenanciesWidgetProps> = ({ properties }) => {
  return (
    <SectionCard data-testid="landlord-tenancies-widget">
      <h2 className="section-title">
        <FileCheck size={18} color="#ef4444" />
        <span>Active Tenancy Contracts & Ejari Certificates</span>
      </h2>
      <DataTable>
        <thead>
          <tr>
            <th>Property / Community</th>
            <th>Unit No.</th>
            <th>Active Tenant</th>
            <th>Annual Rent</th>
            <th>Ejari Number</th>
            <th>Lease Expiry</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {properties.map(p => (
            <tr key={p.id}>
              <td>
                <strong>{p.title}</strong>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{p.community}</div>
              </td>
              <td>{p.unitNumber}</td>
              <td>
                {p.activeTenant ? (
                  <div>
                    <div>{p.activeTenant.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{p.activeTenant.phone}</div>
                  </div>
                ) : (
                  <span style={{ color: '#64748b' }}>— None —</span>
                )}
              </td>
              <td>AED {p.annualRentAed.toLocaleString()}</td>
              <td>
                {p.ejariNumber ? (
                  <span style={{ fontFamily: 'monospace', color: '#60a5fa' }}>{p.ejariNumber}</span>
                ) : (
                  '—'
                )}
              </td>
              <td>{p.leaseEndDate || '—'}</td>
              <td>
                <StatusPill $variant={p.occupancyStatus}>{p.occupancyStatus}</StatusPill>
              </td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </SectionCard>
  );
};
