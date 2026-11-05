/**
 * White Caves Real Estate LLC - Deal Statutory Documents Section
 * Standard: AEGIS Canonical 7-Category Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { FileText, ShieldCheck } from 'lucide-react';
import { DealDocumentItem } from './DealManager.types';

interface DealStatutoryDocsSectionProps {
  documents: DealDocumentItem[];
  onNavigateToDoc?: (docId: string) => void;
}

export const DealStatutoryDocsSection: FC<DealStatutoryDocsSectionProps> = ({
  documents,
  onNavigateToDoc,
}) => {
  return (
    <div>
      <h4
        style={{
          fontSize: '0.85rem',
          fontWeight: 800,
          color: '#C084FC',
          margin: '0 0 10px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <FileText size={14} />
        Required Statutory Documents ({documents.length} Files)
      </h4>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '8px',
        }}
      >
        {documents.map((doc, idx) => (
          <div
            key={idx}
            onClick={() => onNavigateToDoc?.(doc.docId)}
            style={{
              padding: '8px 12px',
              background: 'rgba(0,0,0,0.25)',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: onNavigateToDoc ? 'pointer' : 'default',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF' }}>
                {doc.title}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748B' }}>
                {doc.type} · {doc.docId}
              </div>
            </div>
            <span style={{ color: doc.verified ? '#34D399' : '#F87171' }}>
              <ShieldCheck size={14} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
