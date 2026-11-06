/**
 * White Caves Real Estate LLC - Document OCR Fields Section
 * Standard: AEGIS Canonical 7-Category Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { FileText } from 'lucide-react';

export interface DocumentOcrFieldsSectionProps {
  metadata: Record<string, any>;
}

export const DocumentOcrFieldsSection: FC<DocumentOcrFieldsSectionProps> = ({ metadata }) => {
  return (
    <div>
      <h4
        style={{
          fontSize: '0.85rem',
          fontWeight: 800,
          color: '#38BDF8',
          margin: '0 0 10px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <FileText size={14} />
        Henry OCR Extracted Fields & Metadata
      </h4>
      <div
        style={{
          background: 'rgba(0,0,0,0.25)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          padding: '12px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '10px',
          }}
        >
          {Object.entries(metadata || {}).map(([key, value]) => (
            <div
              key={key}
              style={{
                padding: '6px 10px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '6px',
              }}
            >
              <div style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase' }}>
                {key}
              </div>
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  marginTop: '2px',
                }}
              >
                {String(value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
