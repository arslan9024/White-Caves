/**
 * @component DataImportWizard
 * @agent @Mira (Lead Full-Stack Developer)
 * @milestone MILESTONE-IMPORT
 *
 * Component for importing property data from Excel/CSV files.
 */

import React from 'react';
import type { FeatureComponentProps } from '../../layout/DashboardWorkspace/FeatureRegistry';

type DataImportWizardProps = FeatureComponentProps & {
  onComplete?: (data: unknown[]) => void;
  onCancel?: () => void;
};

export const DataImportWizard: React.FC<DataImportWizardProps> = ({ onComplete, onCancel }) => {
  return (
    <div
      role="region"
      aria-label="Data Import Wizard"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        gap: '1rem',
        minHeight: '400px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(196,30,58,0.2)',
        borderRadius: '12px',
        color: '#FAFAFA',
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: '3rem' }} aria-hidden="true">
        📥
      </span>
      <h2
        style={{ fontSize: '1.5rem', fontFamily: "'Cormorant Garamond', serif", color: 'var(--color-fafafa, #FAFAFA)' }}
      >
        Data Import Wizard
      </h2>
      <p style={{ color: 'rgba(250,250,250,0.6)', maxWidth: '400px', lineHeight: 1.6 }}>
        Import property data from Excel or CSV files. This feature is under active development.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button
          onClick={() => onComplete?.([])}
          style={{
            padding: '0.625rem 1.5rem',
            background: '#C41E3A',
            color: '#FAFAFA',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.875rem',
          }}
          aria-label="Start import process"
        >
          Start Import
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              padding: '0.625rem 1.5rem',
              background: 'transparent',
              color: 'rgba(250,250,250,0.7)',
              border: '1px solid rgba(250,250,250,0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem',
            }}
            aria-label="Cancel import"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default DataImportWizard;
