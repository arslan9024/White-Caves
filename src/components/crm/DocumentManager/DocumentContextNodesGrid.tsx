/**
 * White Caves Real Estate LLC - Document Context Nodes Grid
 * Standard: AEGIS Canonical 7-Category Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { ShieldCheck, Building, Handshake } from 'lucide-react';
import { DocumentItem } from './DocumentManager.types';

export const DocumentContextNodesGrid: FC<{ doc: DocumentItem }> = ({ doc }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
      }}
    >
      <div
        style={{
          padding: '12px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            fontSize: '0.65rem',
            color: '#64748B',
            fontWeight: 800,
            textTransform: 'uppercase',
          }}
        >
          Counterparty Entity
        </div>
        <div
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#F1F5F9',
            marginTop: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <ShieldCheck size={14} color="#3B82F6" />
          {doc.entityName}
        </div>
        <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>ID: {doc.entityId}</div>
      </div>

      <div
        style={{
          padding: '12px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            fontSize: '0.65rem',
            color: '#64748B',
            fontWeight: 800,
            textTransform: 'uppercase',
          }}
        >
          Linked Transaction / Deal
        </div>
        <div
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#F1F5F9',
            marginTop: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Handshake size={14} color="#C084FC" />
          {doc.dealId || 'N/A (General Inventory)'}
        </div>
      </div>

      <div
        style={{
          padding: '12px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            fontSize: '0.65rem',
            color: '#64748B',
            fontWeight: 800,
            textTransform: 'uppercase',
          }}
        >
          Target Real Estate Inventory
        </div>
        <div
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#F1F5F9',
            marginTop: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Building size={14} color="#EF4444" />
          {doc.propertyId || 'N/A'}
        </div>
      </div>
    </div>
  );
};
