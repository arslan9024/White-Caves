/**
 * White Caves Real Estate LLC - Deal Detail Modal Component
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Modal)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { X, Building, UserCheck, Handshake, CheckCircle } from 'lucide-react';
import { DealItem, DealStatus } from './DealManager.types';
import { DealPdcScheduleSection } from './DealPdcScheduleSection';
import { DealStatutoryDocsSection } from './DealStatutoryDocsSection';

interface DealDetailModalProps {
  deal: DealItem;
  onClose: () => void;
  onAdvanceStatus: (dealId: string, status: DealStatus) => void;
  onNavigateToDoc?: (docId: string) => void;
}

export const DealDetailModal: FC<DealDetailModalProps> = ({
  deal,
  onClose,
  onAdvanceStatus,
  onNavigateToDoc,
}) => {
  const allStatuses: DealStatus[] = [
    'INQUIRY',
    'VIEWING',
    'OFFER',
    'CONTRACT',
    'EJARI_DLD',
    'COMPLETED',
    'CANCELLED',
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      data-testid="deal-detail-modal"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          backgroundColor: '#070D18',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  color: '#C084FC',
                  border: '1px solid #C084FC',
                }}
              >
                {deal.dealType}
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38BDF8' }}>
                {deal.id} · {deal.dealNumber}
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              {deal.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            data-testid="close-deal-modal"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              color: '#94A3B8',
              padding: '6px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Status & Financials Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 18px',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase' }}>
                Current Deal Stage
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <select
                  value={deal.status}
                  onChange={e => onAdvanceStatus(deal.id, e.target.value as DealStatus)}
                  data-testid="deal-status-select"
                  style={{
                    background: '#0B132B',
                    border: '1px solid #38BDF8',
                    color: '#FFFFFF',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {allStatuses.map(s => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                {deal.status === 'COMPLETED' && (
                  <span
                    style={{
                      color: '#34D399',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <CheckCircle size={14} /> Revenue Booked
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Transaction Value</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                  AED {deal.valueAED.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                  Gross Commission ({deal.commissionRate}%)
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34D399' }}>
                  AED {deal.commissionAED.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Primary Parties Grid */}
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

          {/* Sequential PDC Cheques Ledger Table */}
          <DealPdcScheduleSection pdcSchedule={deal.pdcSchedule} />

          {/* Linked Statutory Documents */}
          <DealStatutoryDocsSection documents={deal.documents} onNavigateToDoc={onNavigateToDoc} />
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
