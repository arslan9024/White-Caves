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
import { DocumentItem } from './DocumentManager.types';

interface DocumentCardProps {
  document: DocumentItem;
  onInspect: (doc: DocumentItem) => void;
}

export const DocumentCard: FC<DocumentCardProps> = ({ document: doc, onInspect }) => {
  const isVerified = doc.status === 'VERIFIED';

  const typeColorMap: Record<string, { bg: string; text: string; border: string }> = {
    TITLE_DEED: {
      bg: 'rgba(239, 68, 68, 0.15)',
      text: '#F87171',
      border: 'rgba(239, 68, 68, 0.3)',
    },
    EMIRATES_ID: {
      bg: 'rgba(59, 130, 246, 0.15)',
      text: '#60A5FA',
      border: 'rgba(59, 130, 246, 0.3)',
    },
    PASSPORT: {
      bg: 'rgba(16, 185, 129, 0.15)',
      text: '#34D399',
      border: 'rgba(16, 185, 129, 0.3)',
    },
    EJARI_CONTRACT: {
      bg: 'rgba(168, 85, 247, 0.15)',
      text: '#C084FC',
      border: 'rgba(168, 85, 247, 0.3)',
    },
    PAYMENT_RECEIPT: {
      bg: 'rgba(245, 158, 11, 0.15)',
      text: '#FBBF24',
      border: 'rgba(245, 158, 11, 0.3)',
    },
    TRADE_LICENSE: {
      bg: 'rgba(14, 165, 233, 0.15)',
      text: '#38BDF8',
      border: 'rgba(14, 165, 233, 0.3)',
    },
    MOU_FORM_F: {
      bg: 'rgba(236, 72, 153, 0.15)',
      text: '#F472B6',
      border: 'rgba(236, 72, 153, 0.3)',
    },
    NOC_CERTIFICATE: {
      bg: 'rgba(20, 184, 166, 0.15)',
      text: '#2DD4BF',
      border: 'rgba(20, 184, 166, 0.3)',
    },
  };

  const typeStyle = typeColorMap[doc.docType] || typeColorMap.TITLE_DEED;

  return (
    <div
      data-testid={`document-card-${doc.id}`}
      style={{
        background: 'rgba(15, 23, 42, 0.75)',
        border: `1px solid ${isVerified ? 'rgba(16, 185, 129, 0.35)' : 'rgba(255, 255, 255, 0.08)'}`,
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
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
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8' }}>
            {doc.id} · {doc.docCode}
          </span>
        </div>

        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '999px',
            background: isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            color: isVerified ? '#34D399' : '#FBBF24',
            border: `1px solid ${isVerified ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
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
            color: '#FFFFFF',
            margin: '0 0 4px 0',
            lineHeight: 1.3,
          }}
        >
          {doc.title}
        </h3>
        <span
          style={{
            fontSize: '0.78rem',
            color: '#CBD5E1',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <ShieldCheck size={12} color="#3B82F6" />
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
              background: 'rgba(168, 85, 247, 0.15)',
              color: '#C084FC',
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
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#F87171',
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
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34D399',
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
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '12px',
        }}
      >
        <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
          Uploaded: {doc.uploadedAt} · {(doc.fileSizeKB / 1024).toFixed(1)} MB
        </span>

        <button
          onClick={() => onInspect(doc)}
          data-testid={`inspect-doc-${doc.id}`}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#38BDF8',
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
