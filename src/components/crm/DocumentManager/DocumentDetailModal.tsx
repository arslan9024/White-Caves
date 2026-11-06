/**
 * White Caves Real Estate LLC - Document Detail Modal / Inline View Component
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Modal / In-Page View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { X, Download, Cpu, ArrowLeft } from 'lucide-react';
import { DocumentItem } from './DocumentManager.types';
import { DocumentOcrFieldsSection } from './DocumentOcrFieldsSection';
import { DocumentContextNodesGrid } from './DocumentContextNodesGrid';

export interface DocumentDetailModalProps {
  document: DocumentItem;
  onClose: () => void;
  onVerify: (docId: string) => void;
  isInline?: boolean;
}

export const DocumentDetailModal: FC<DocumentDetailModalProps> = ({
  document: doc,
  onClose,
  onVerify,
  isInline = false,
}) => {
  const cardContent = (
    <>
      {/* Top Inline Back Navigation Banner */}
      {isInline && (
        <div
          style={{
            padding: '14px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            data-testid="doc-back-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#38BDF8',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} />
            <span>← Back to Document Vault</span>
          </button>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace' }}>
            Vault Asset · {doc.id}
          </span>
        </div>
      )}

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
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38BDF8',
                border: '1px solid #38BDF8',
              }}
            >
              {doc.docType.replace('_', ' ')}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8' }}>
              {doc.id} · {doc.docCode}
            </span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            {doc.title}
          </h2>
        </div>

        {!isInline && (
          <button
            onClick={onClose}
            data-testid="close-document-modal"
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
        )}
      </div>

      {/* Modal / Inline Body */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Status & Confidence Card */}
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
              Verification Posture
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: doc.status === 'VERIFIED' ? '#34D399' : '#FBBF24',
                  background:
                    doc.status === 'VERIFIED'
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'rgba(245, 158, 11, 0.15)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                }}
              >
                {doc.status}
              </span>
              {doc.status !== 'VERIFIED' && (
                <button
                  onClick={() => onVerify(doc.id)}
                  data-testid="verify-document-btn"
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    background: '#10B981',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Mark Verified
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>OCR Confidence</div>
              <div
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: '#38BDF8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Cpu size={16} />
                {doc.ocrConfidence}%
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Ingestion Date</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>
                {doc.uploadedAt}
              </div>
            </div>
          </div>
        </div>

        {/* Linked Context Nodes */}
        <DocumentContextNodesGrid doc={doc} />

        {/* OCR Extracted Metadata Key-Value Map */}
        <DocumentOcrFieldsSection metadata={doc.metadata} />
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => alert(`Simulating download of ${doc.docCode}`)}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38BDF8',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Download size={14} />
          Download Original PDF
        </button>

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
          {isInline ? 'Close Viewer & Return' : 'Close Viewer'}
        </button>
      </div>
    </>
  );

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: isInline ? '100%' : '780px',
    maxHeight: isInline ? 'none' : '90vh',
    backgroundColor: '#070D18',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    overflowY: isInline ? 'visible' : 'auto',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: isInline ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
  };

  if (isInline) {
    return (
      <div data-testid="document-detail-main-view" style={{ width: '100%', padding: '0 0 24px 0' }}>
        <div data-testid="document-detail-modal" style={cardStyle}>
          {cardContent}
        </div>
      </div>
    );
  }

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
      data-testid="document-detail-modal"
    >
      <div data-testid="document-detail-card" style={cardStyle}>
        {cardContent}
      </div>
    </div>
  );
};
