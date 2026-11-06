// FILE: src/components/crm/BrokerManager/BrokerCommissionWidget.tsx
/**
 * White Caves Real Estate LLC - Broker Commission & Escrow Payout Table Widget
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { DollarSign, CheckCircle } from 'lucide-react';
import { BrokerCommissionDeal, CommissionPayoutStatus } from './BrokerManager.types';
import { SectionCard, DataTable, StatusPill, ActionButton } from './BrokerManager.styles';

interface BrokerCommissionWidgetProps {
  deals: BrokerCommissionDeal[];
  onRequestPayout: (dealId: string) => void;
}

export const BrokerCommissionWidget: FC<BrokerCommissionWidgetProps> = ({
  deals,
  onRequestPayout,
}) => {
  return (
    <SectionCard data-testid="broker-commission-widget">
      <h2 className="section-title">
        <DollarSign size={18} color="#ef4444" />
        <span>Commission Tracking, UAE VAT 5% & Escrow Payout Schedule</span>
      </h2>
      <DataTable>
        <thead>
          <tr>
            <th>Deal No. / Property</th>
            <th>Type</th>
            <th>Deal Value</th>
            <th>Gross Comm (2%)</th>
            <th>VAT 5%</th>
            <th>Broker Net (50%)</th>
            <th>Closing Date</th>
            <th>Payout Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {deals.map(d => (
            <tr key={d.id}>
              <td>
                <div style={{ fontFamily: 'monospace', fontWeight: 700 }}>{d.dealNumber}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{d.propertyTitle}</div>
              </td>
              <td style={{ textTransform: 'capitalize' }}>{d.dealType}</td>
              <td>
                <strong>AED {d.dealValueAed.toLocaleString()}</strong>
              </td>
              <td>AED {d.grossCommissionAed.toLocaleString()}</td>
              <td style={{ color: '#94a3b8' }}>AED {d.vatAmountAed.toLocaleString()}</td>
              <td style={{ color: '#4ade80', fontWeight: 700 }}>
                AED {d.brokerNetCommissionAed.toLocaleString()}
              </td>
              <td>{d.closingDate}</td>
              <td>
                <StatusPill $variant={d.payoutStatus}>
                  {d.payoutStatus.replace('_', ' ')}
                </StatusPill>
              </td>
              <td>
                {d.payoutStatus === 'pending_escrow' && (
                  <ActionButton
                    onClick={() => onRequestPayout(d.id)}
                    data-testid={`btn-request-payout-${d.id}`}
                  >
                    Request Payout
                  </ActionButton>
                )}
                {d.payoutStatus === 'approved' && (
                  <span style={{ fontSize: 11, color: '#60a5fa' }}>Processing DLD Escrow</span>
                )}
                {d.payoutStatus === 'disbursed' && (
                  <span style={{ fontSize: 11, color: '#4ade80' }}>
                    <CheckCircle size={12} style={{ verticalAlign: 'middle', marginRight: 2 }} />
                    Disbursed
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
