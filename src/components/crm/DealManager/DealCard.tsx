/**
 * White Caves Real Estate LLC - Deal Card Component
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Component)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Handshake, UserCheck, Building, CheckCircle2, FileCheck, Wallet } from 'lucide-react';
import { DealItem } from './DealManager.types';

interface DealCardProps {
  deal: DealItem;
  onInspect: (deal: DealItem) => void;
}

export const DealCard: FC<DealCardProps> = ({ deal, onInspect }) => {
  const isCompleted = deal.status === 'COMPLETED';
  const statusColorMap: Record<string, { bg: string; text: string; border: string }> = {
    INQUIRY: {
      bg: 'rgba(100, 116, 139, 0.15)',
      text: '#94A3B8',
      border: 'rgba(100, 116, 139, 0.3)',
    },
    VIEWING: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60A5FA', border: 'rgba(59, 130, 246, 0.3)' },
    OFFER: { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.3)' },
    CONTRACT: {
      bg: 'rgba(168, 85, 247, 0.15)',
      text: '#C084FC',
      border: 'rgba(168, 85, 247, 0.3)',
    },
    EJARI_DLD: {
      bg: 'rgba(236, 72, 153, 0.15)',
      text: '#F472B6',
      border: 'rgba(236, 72, 153, 0.3)',
    },
    COMPLETED: {
      bg: 'rgba(16, 185, 129, 0.15)',
      text: '#34D399',
      border: 'rgba(16, 185, 129, 0.4)',
    },
    CANCELLED: { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' },
  };

  const statusStyle = statusColorMap[deal.status] || statusColorMap.INQUIRY;

  return (
    <div
      data-testid={`deal-card-${deal.id}`}
      style={{
        background: 'rgba(15, 23, 42, 0.75)',
        border: `1px solid ${isCompleted ? 'rgba(16, 185, 129, 0.35)' : 'rgba(255, 255, 255, 0.08)'}`,
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              background:
                deal.dealType === 'SALES' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(168, 85, 247, 0.2)',
              color: deal.dealType === 'SALES' ? '#38BDF8' : '#C084FC',
              border: `1px solid ${deal.dealType === 'SALES' ? '#38BDF8' : '#C084FC'}`,
            }}
          >
            {deal.dealType}
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8' }}>
            {deal.id} · {deal.dealNumber}
          </span>
        </div>

        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '999px',
            background: statusStyle.bg,
            color: statusStyle.text,
            border: `1px solid ${statusStyle.border}`,
            textTransform: 'uppercase',
          }}
        >
          {deal.status.replace('_', ' ')}
        </span>
      </div>

      {/* Title & Community */}
      <div>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 4px 0',
            lineHeight: 1.3,
          }}
        >
          {deal.title}
        </h3>
        <span
          style={{
            fontSize: '0.78rem',
            color: '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Building size={12} color="#EF4444" />
          {deal.propertyCommunity} · {deal.propertyId}
        </span>
      </div>

      {/* Participants */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          padding: '10px 12px',
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.65rem',
              color: '#64748B',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            Lead Agent
          </div>
          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#F1F5F9',
              marginTop: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <UserCheck size={12} color="#3B82F6" />
            {deal.agentName}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '0.65rem',
              color: '#64748B',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            {deal.clientRole.toUpperCase()}
          </div>
          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#F1F5F9',
              marginTop: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Handshake size={12} color="#10B981" />
            {deal.clientName}
          </div>
        </div>
      </div>

      {/* Financials & PDCs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '12px',
        }}
      >
        <div>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Transaction Value</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
            AED{' '}
            {(deal.valueAED / (deal.dealType === 'SALES' ? 1_000_000 : 1_000)).toFixed(
              deal.dealType === 'SALES' ? 1 : 0
            )}
            {deal.dealType === 'SALES' ? 'M' : 'k'}
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              color: '#34D399',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '2px',
            }}
          >
            <Wallet size={11} />
            Comm: AED {deal.commissionAED.toLocaleString()} ({deal.commissionRate}%)
          </div>
        </div>

        <button
          onClick={() => onInspect(deal)}
          data-testid={`inspect-deal-${deal.id}`}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(185, 28, 28, 0.4))',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            color: '#FFFFFF',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease-in-out',
          }}
        >
          Inspect Deal
        </button>
      </div>

      {/* Bottom Checklist Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.7rem',
          color: '#64748B',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <FileCheck size={12} color="#10B981" />
          {deal.documents.filter(d => d.verified).length}/{deal.documents.length} Docs Verified
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CheckCircle2 size={12} color="#3B82F6" />+{deal.meritXPAwarded} Merit XP
        </span>
      </div>
    </div>
  );
};
