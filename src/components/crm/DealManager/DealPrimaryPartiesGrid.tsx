/**
 * White Caves Real Estate LLC - Deal Primary Parties Grid
 * Standard: AEGIS Canonical 7-Category Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Building, UserCheck, Handshake } from 'lucide-react';
import { DealItem } from './DealManager.types';

export const DealPrimaryPartiesGrid: FC<{ deal: DealItem }> = ({ deal }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
      }}
    >
      {/* Agent */}
      <div
        style={{
          padding: '14px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            fontSize: '0.68rem',
            color: '#64748B',
            fontWeight: 800,
            textTransform: 'uppercase',
          }}
        >
          Internal Executive / Agent
        </div>
        <div
          style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#F1F5F9',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <UserCheck size={14} color="#3B82F6" />
          {deal.agentName}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
          {deal.agentRole} · {deal.agentId}
        </div>
      </div>

      {/* Property */}
      <div
        style={{
          padding: '14px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            fontSize: '0.68rem',
            color: '#64748B',
            fontWeight: 800,
            textTransform: 'uppercase',
          }}
        >
          Target Real Estate Inventory
        </div>
        <div
          style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#F1F5F9',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Building size={14} color="#EF4444" />
          {deal.propertyTitle}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
          {deal.propertyCommunity} · {deal.propertyId}
        </div>
      </div>

      {/* Counterparty */}
      <div
        style={{
          padding: '14px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            fontSize: '0.68rem',
            color: '#64748B',
            fontWeight: 800,
            textTransform: 'uppercase',
          }}
        >
          External {deal.clientRole.toUpperCase()}
        </div>
        <div
          style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#F1F5F9',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Handshake size={14} color="#10B981" />
          {deal.clientName}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
          ID: {deal.clientId} · Owner: {deal.ownerName}
        </div>
      </div>
    </div>
  );
};
