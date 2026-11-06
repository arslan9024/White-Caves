// FILE: src/components/crm/LandlordManager/LandlordPdcWidget.tsx
/**
 * White Caves Real Estate LLC - Landlord PDC Cheque Tracking Widget
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { CreditCard, CheckCircle } from 'lucide-react';
import { PdcCheque, ChequeStatus } from './LandlordManager.types';
import { SectionCard, DataTable, StatusPill, ActionButton } from './LandlordManager.styles';

interface LandlordPdcWidgetProps {
  cheques: PdcCheque[];
  onUpdateChequeStatus: (id: string, status: ChequeStatus) => void;
}

export const LandlordPdcWidget: FC<LandlordPdcWidgetProps> = ({
  cheques,
  onUpdateChequeStatus,
}) => {
  return (
    <SectionCard data-testid="landlord-pdc-widget">
      <h2 className="section-title">
        <CreditCard size={18} color="#ef4444" />
        <span>Post-Dated Cheque (PDC) Schedule & Escrow Tracking</span>
      </h2>
      <DataTable>
        <thead>
          <tr>
            <th>Cheque Number</th>
            <th>Bank</th>
            <th>Drawer / Tenant</th>
            <th>Unit</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Clearing Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cheques.map(c => (
            <tr key={c.id}>
              <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{c.chequeNumber}</td>
              <td>{c.bankName}</td>
              <td>{c.drawerName}</td>
              <td>{c.unitNumber}</td>
              <td>
                <strong>AED {c.amountAed.toLocaleString()}</strong>
              </td>
              <td>{c.dueDate}</td>
              <td>
                <StatusPill $variant={c.status}>{c.status.replace('_', ' ')}</StatusPill>
              </td>
              <td>
                {c.status === 'pending' && (
                  <ActionButton
                    onClick={() => onUpdateChequeStatus(c.id, 'cleared')}
                    data-testid={`btn-clear-${c.id}`}
                  >
                    Mark Cleared
                  </ActionButton>
                )}
                {c.status === 'bounced' && (
                  <ActionButton
                    onClick={() => onUpdateChequeStatus(c.id, 'cleared')}
                    style={{ color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.4)' }}
                  >
                    Resolve Notice
                  </ActionButton>
                )}
                {c.status === 'cleared' && (
                  <span style={{ fontSize: 11, color: '#4ade80' }}>
                    <CheckCircle size={12} style={{ verticalAlign: 'middle', marginRight: 2 }} />
                    Settled
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </SectionCard>
  );
};
