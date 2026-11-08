/**
 * White Caves Real Estate LLC - Document Card Component
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Component)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle,
  Building,
  Handshake,
  Cpu,
  FileCheck2,
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { DocumentItem } from './DocumentManager.types';

interface DocumentCardProps {
  document: DocumentItem;
  onInspect: (doc: DocumentItem) => void;
}

export const DocumentCard: FC<DocumentCardProps> = ({ document: doc, onInspect }) => {
  const { isDark } = useTheme();
  const isVerified = doc.status === 'VERIFIED';

  const typeColorMap: Record<string, { bg: string; text: string; border: string }> = {
    TITLE_DEED: {
      bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
      text: isDark ? '#F87171' : '#DC2626',
      border: isDark ? 'rgba(239, 68, 68, 0.3)' : '#FECACA',
    },
    EMIRATES_ID: {
      bg: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
      text: isDark ? '#60A5FA' : '#2563EB',
      border: isDark ? 'rgba(59, 130, 246, 0.3)' : '#BFDBFE',
    },
    PASSPORT: {
      bg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
      text: isDark ? '#34D399' : '#059669',
      border: isDark ? 'rgba(16, 185, 129, 0.3)' : '#A7F3D0',
    },
    EJARI_CONTRACT: {
      bg: isDark ? 'rgba(168, 85, 247, 0.15)' : '#FAF5FF',
      text: isDark ? '#C084FC' : '#9333EA',
      border: isDark ? 'rgba(168, 85, 247, 0.3)' : '#E9D5FF',
    },
    PAYMENT_RECEIPT: {
      bg: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB',
      text: isDark ? '#FBBF24' : '#D97706',
      border: isDark ? 'rgba(245, 158, 11, 0.3)' : '#FDE68A',
    },
    TRADE_LICENSE: {
      bg: isDark ? 'rgba(14, 165, 233, 0.15)' : '#F0F9FF',
      text: isDark ? '#38BDF8' : '#0284C7',
      border: isDark ? 'rgba(14, 165, 233, 0.3)' : '#BAE6FD',
    },
    MOU_FORM_F: {
      bg: isDark ? 'rgba(236, 72, 153, 0.15)' : '#FDF2F8',
      text: isDark ? '#F472B6' : '#DB2777',
      border: isDark ? 'rgba(236, 72, 153, 0.3)' : '#FBCFE8',
    },
    NOC_CERTIFICATE: {
      bg: isDark ? 'rgba(20, 184, 166, 0.15)' : '#F0FDFA',
      text: isDark ? '#2DD4BF' : '#0D9488',
      border: isDark ? 'rgba(20, 184, 166, 0.3)' : '#99F6E4',
    },
  };

  const typeStyle = typeColorMap[doc.docType] || typeColorMap.TITLE_DEED;

  return (
    <div
      data-testid={`document-card-${doc.id}`}
      style={{
        background: isDark ? 'rgba(15, 23, 42, 0.75)' : '#FFFFFF',
        border: `1px solid ${
          isVerified
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
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.25)' : '0 2px 10px rgba(0,0,0,0.04)',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              background: typeStyle.bg,
              color: typeStyle.text,
              border: `1px solid ${typeStyle.border}`,
            }}
          >
            {doc.docType.replace('_', ' ')}
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isDark ? '#94A3B8' : '#64748B' }}>
            {doc.id} · {doc.docCode}
          </span>
        </div>

        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '999px',
            background: isVerified
              ? isDark
                ? 'rgba(16, 185, 129, 0.15)'
                : '#ECFDF5'
              : isDark
              ? 'rgba(245, 158, 11, 0.15)'
              : '#FFFBEB',
            color: isVerified ? (isDark ? '#34D399' : '#059669') : isDark ? '#FBBF24' : '#D97706',
            border: `1px solid ${
              isVerified
                ? isDark
                  ? 'rgba(16, 185, 129, 0.4)'
                  : '#A7F3D0'
                : isDark
                ? 'rgba(245, 158, 11, 0.4)'
                : '#FDE68A'
            }`,
            textTransform: 'uppercase',
          }}
        >
          {doc.status}
        </span>
      </div>

      {/* Title */}
      <div>
        <h3
          style={{
            fontSize: '0.98rem',
            fontWeight: 800,
            color: isDark ? '#FFFFFF' : '#0F172A',
            margin: '0 0 4px 0',
            lineHeight: 1.3,
          }}
        >
          {doc.title}
        </h3>
        <span
          style={{
            fontSize: '0.78rem',
            color: isDark ? '#CBD5E1' : '#475569',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <ShieldCheck size={12} color={isDark ? '#3B82F6' : '#2563EB'} />
          Entity: {doc.entityName}
        </span>
      </div>

      {/* Linked Relationship Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.72rem' }}>
        {doc.dealId && (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              background: isDark ? 'rgba(168, 85, 247, 0.15)' : '#F3E8FF',
              color: isDark ? '#C084FC' : '#7E22CE',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Handshake size={11} />
            {doc.dealId}
          </span>
        )}
        {doc.propertyId && (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              background: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
              color: isDark ? '#F87171' : '#DC2626',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Building size={11} />
            {doc.propertyId}
          </span>
        )}
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            background: isDark ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7',
            color: isDark ? '#34D399' : '#15803D',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Cpu size={11} />
          {doc.ocrConfidence}% OCR
        </span>
      </div>

      {/* Footer Inspect Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
          paddingTop: '12px',
        }}
      >
        <span style={{ fontSize: '0.72rem', color: isDark ? '#64748B' : '#94A3B8' }}>
          Uploaded: {doc.uploadedAt} · {(doc.fileSizeKB / 1024).toFixed(1)} MB
        </span>

        <button
          onClick={() => onInspect(doc)}
          data-testid={`inspect-doc-${doc.id}`}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            background: isDark ? 'rgba(56, 189, 248, 0.15)' : '#E0F2FE',
            border: isDark ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid #0284C7',
            color: isDark ? '#38BDF8' : '#0284C7',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Inspect Dossier
        </button>
      </div>
    </div>
  );
};
