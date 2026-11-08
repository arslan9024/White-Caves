/**
 * White Caves Real Estate LLC - Deal Card Component
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Component)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Handshake, UserCheck, Building, CheckCircle2, FileCheck, Wallet } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { DealItem } from './DealManager.types';

interface DealCardProps {
  deal: DealItem;
  onInspect: (deal: DealItem) => void;
}

export const DealCard: FC<DealCardProps> = ({ deal, onInspect }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const isCompleted = deal.status === 'COMPLETED';
  const statusColorMap: Record<string, { bg: string; text: string; border: string }> = {
    INQUIRY: {
      bg: isDark ? 'rgba(100, 116, 139, 0.15)' : '#F1F5F9',
      text: isDark ? '#94A3B8' : '#475569',
      border: isDark ? 'rgba(100, 116, 139, 0.3)' : '#CBD5E1',
    },
    VIEWING: {
      bg: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
      text: isDark ? '#60A5FA' : '#2563EB',
      border: isDark ? 'rgba(59, 130, 246, 0.3)' : '#BFDBFE',
    },
    OFFER: {
      bg: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB',
      text: isDark ? '#FBBF24' : '#D97706',
      border: isDark ? 'rgba(245, 158, 11, 0.3)' : '#FDE68A',
    },
    CONTRACT: {
      bg: isDark ? 'rgba(168, 85, 247, 0.15)' : '#FAF5FF',
      text: isDark ? '#C084FC' : '#9333EA',
      border: isDark ? 'rgba(168, 85, 247, 0.3)' : '#E9D5FF',
    },
    EJARI_DLD: {
      bg: isDark ? 'rgba(236, 72, 153, 0.15)' : '#FDF2F8',
      text: isDark ? '#F472B6' : '#DB2777',
      border: isDark ? 'rgba(236, 72, 153, 0.3)' : '#FBCFE8',
    },
    COMPLETED: {
      bg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
      text: isDark ? '#34D399' : '#059669',
      border: isDark ? 'rgba(16, 185, 129, 0.4)' : '#A7F3D0',
    },
    CANCELLED: {
      bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
      text: isDark ? '#F87171' : '#DC2626',
      border: isDark ? 'rgba(239, 68, 68, 0.3)' : '#FECACA',
    },
  };

  const statusStyle = statusColorMap[deal.status] || statusColorMap.INQUIRY;

  return (
    <div
      data-testid={`deal-card-${deal.id}`}
      style={{
        background: isDark ? 'rgba(15, 23, 42, 0.75)' : '#FFFFFF',
        border: `1px solid ${
          isCompleted
            ? isDark
              ? 'rgba(16, 185, 129, 0.35)'
              : '#10B981'
            : isDark
            ? 'rgba(255, 255, 255, 0.08)'
            : '#E2E8F0'
        }`,
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        position: 'relative',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.25)' : '0 2px 10px rgba(0,0,0,0.04)',
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
                deal.dealType === 'SALES'
                  ? isDark
                    ? 'rgba(56, 189, 248, 0.2)'
                    : '#E0F2FE'
                  : isDark
                  ? 'rgba(168, 85, 247, 0.2)'
                  : '#F3E8FF',
              color:
                deal.dealType === 'SALES'
                  ? isDark
                    ? '#38BDF8'
                    : '#0284C7'
                  : isDark
                  ? '#C084FC'
                  : '#7E22CE',
              border: `1px solid ${deal.dealType === 'SALES' ? (isDark ? '#38BDF8' : '#7DD3FC') : isDark ? '#C084FC' : '#D8B4FE'}`,
            }}
          >
            {deal.dealType}
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isDark ? '#94A3B8' : '#64748B' }}>
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
            color: isDark ? '#FFFFFF' : '#0F172A',
            margin: '0 0 4px 0',
            lineHeight: 1.3,
          }}
        >
          {deal.title}
        </h3>
        <div
          style={{
            fontSize: '0.78rem',
            color: isDark ? '#94A3B8' : '#64748B',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Building size={12} color="#EF4444" />
          <span>{deal.propertyCommunity} · </span>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              navigate(`/dashboard/REproperties/${deal.propertyId}`);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: isDark ? '#38BDF8' : '#0284C7',
              fontWeight: 700,
              textDecoration: 'underline',
            }}
            title={`Open property ${deal.propertyId}`}
          >
            {deal.propertyId}
          </button>
        </div>
      </div>

      {/* Participants */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          padding: '10px 12px',
          background: isDark ? 'rgba(0, 0, 0, 0.25)' : '#F8FAFC',
          borderRadius: '8px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid #E2E8F0',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.65rem',
              color: isDark ? '#64748B' : '#94A3B8',
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
              color: isDark ? '#F1F5F9' : '#1E293B',
              marginTop: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <UserCheck size={12} color="#3B82F6" />
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                navigate(`/dashboard/employees/${deal.agentId || 'EMP-001'}`);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                color: isDark ? '#60A5FA' : '#2563EB',
                fontWeight: 700,
                textDecoration: 'underline',
              }}
              title={`View employee dossier for ${deal.agentName}`}
            >
              {deal.agentName}
            </button>
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '0.65rem',
              color: isDark ? '#64748B' : '#94A3B8',
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
              color: isDark ? '#F1F5F9' : '#1E293B',
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
          borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
          paddingTop: '12px',
        }}
      >
        <div>
          <div style={{ fontSize: '0.68rem', color: isDark ? '#94A3B8' : '#64748B' }}>Transaction Value</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>
            AED{' '}
            {(deal.valueAED / (deal.dealType === 'SALES' ? 1_000_000 : 1_000)).toFixed(
              deal.dealType === 'SALES' ? 1 : 0
            )}
            {deal.dealType === 'SALES' ? 'M' : 'k'}
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              color: isDark ? '#34D399' : '#16A34A',
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
            background: isDark
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(185, 28, 28, 0.4))'
              : '#EF4444',
            border: isDark ? '1px solid rgba(239, 68, 68, 0.5)' : 'none',
            color: '#FFFFFF',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease-in-out',
            boxShadow: isDark ? 'none' : '0 2px 6px rgba(239, 68, 68, 0.25)',
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
          color: isDark ? '#64748B' : '#94A3B8',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <FileCheck size={12} color={isDark ? '#10B981' : '#059669'} />
          {deal.documents.filter(d => d.verified).length}/{deal.documents.length} Docs Verified
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CheckCircle2 size={12} color={isDark ? '#3B82F6' : '#2563EB'} />+{deal.meritXPAwarded} Merit XP
        </span>
      </div>
    </div>
  );
};
