// FILE: src/components/crm/BrokerManager/BrokerLeadsWidget.tsx
/**
 * White Caves Real Estate LLC - Broker Lead Assignment Widget
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Users, Phone, MessageSquare } from 'lucide-react';
import { AssignedLead } from './BrokerManager.types';
import { SectionCard, DataTable, StatusPill, ActionButton } from './BrokerManager.styles';

interface BrokerLeadsWidgetProps {
  leads: AssignedLead[];
  onContactLead: (leadId: string) => void;
}

export const BrokerLeadsWidget: FC<BrokerLeadsWidgetProps> = ({ leads, onContactLead }) => {
  return (
    <SectionCard data-testid="broker-leads-widget">
      <h2 className="section-title">
        <Users size={18} color="#ef4444" />
        <span>Assigned High-Net-Worth Client Leads & 15-Minute SLA</span>
      </h2>
      <DataTable>
        <thead>
          <tr>
            <th>Lead ID</th>
            <th>Client Name</th>
            <th>Target Community</th>
            <th>Budget</th>
            <th>Channel</th>
            <th>SLA Countdown</th>
            <th>Status</th>
            <th>Quick Action</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id}>
              <td style={{ fontFamily: 'monospace' }}>{lead.leadCode}</td>
              <td>
                <strong>{lead.clientName}</strong>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{lead.clientPhone}</div>
              </td>
              <td>{lead.targetCommunity}</td>
              <td>
                <strong>AED {lead.budgetAed.toLocaleString()}</strong>
              </td>
              <td>{lead.channel}</td>
              <td>
                <StatusPill $variant={lead.slaStatus}>
                  {lead.slaMinutesRemaining > 0
                    ? `${lead.slaMinutesRemaining}m remaining`
                    : 'SLA Target Met'}
                </StatusPill>
              </td>
              <td>
                <StatusPill $variant={lead.status}>{lead.status.replace('_', ' ')}</StatusPill>
              </td>
              <td>
                {lead.status === 'new' && (
                  <ActionButton
                    onClick={() => onContactLead(lead.id)}
                    data-testid={`btn-contact-${lead.id}`}
                  >
                    <Phone size={11} style={{ marginRight: 4 }} />
                    Contact Lead
                  </ActionButton>
                )}
                {lead.status !== 'new' && (
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>
                    <MessageSquare size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    In Conversation
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
