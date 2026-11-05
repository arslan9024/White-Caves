import React, { FC } from 'react';
import { EmiratesIdExtractedData } from '../../../../services/HenryEmiratesIdScannerService';

export interface HenryEmiratesIdCardMockupProps {
  activeSideView: 'front' | 'back';
  extractedData: EmiratesIdExtractedData;
}

export const HenryEmiratesIdCardMockup: FC<HenryEmiratesIdCardMockupProps> = ({
  activeSideView,
  extractedData,
}) => {
  if (activeSideView === 'front') {
    return (
      <div
        style={{
          textAlign: 'center',
          color: 'var(--text-secondary, #64748B)',
          maxWidth: '420px',
        }}
      >
        <div
          style={{
            background: 'var(--color-0f172a, #0F172A)',
            borderRadius: '12px',
            padding: '1.25rem',
            color: 'var(--white, #FFFFFF)',
            border: '2px solid var(--accent-green, #EF4444)',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.15)',
              paddingBottom: '6px',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--accent-green, #EF4444)',
              }}
            >
              UNITED ARAB EMIRATES · RESIDENT IDENTITY CARD
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--color-94a3b8, #94A3B8)' }}>
              FRONT
            </span>
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '1.15rem',
              fontWeight: 900,
              color: 'var(--white, #FFFFFF)',
            }}
          >
            {extractedData.idNumber}
          </div>
          <div
            style={{
              fontSize: '0.9rem',
              fontWeight: 800,
              color: 'var(--color-f8fafc, #F8FAFC)',
              marginTop: '4px',
            }}
          >
            {extractedData.fullNameEn}
          </div>
          <div
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-94a3b8, #94A3B8)',
              direction: 'rtl',
              textAlign: 'right',
            }}
          >
            {extractedData.fullNameAr}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '12px',
              paddingTop: '8px',
              borderTop: '1px dashed rgba(255,255,255,0.15)',
              fontSize: '0.75rem',
              color: 'var(--color-94a3b8, #94A3B8)',
            }}
          >
            <span>
              Nationality: {extractedData.nationalityEn} ({extractedData.nationalityCode})
            </span>
            <span>Expiry: {extractedData.expiryDate}</span>
          </div>
        </div>
        <p style={{ fontSize: '0.78rem', marginTop: '10px' }}>
          Front view active. Click "Back Side (MRZ)" or upload your client card to inspect both
          sides.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        textAlign: 'center',
        color: 'var(--text-secondary, #64748B)',
        maxWidth: '420px',
      }}
    >
      <div
        style={{
          background: 'var(--color-0f172a, #0F172A)',
          borderRadius: '12px',
          padding: '1.25rem',
          color: 'var(--white, #FFFFFF)',
          border: '2px solid var(--color-38bdf8, #EF4444)',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
            paddingBottom: '6px',
            marginBottom: '8px',
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--color-38bdf8, #EF4444)',
            }}
          >
            SMART CHIP & ICAO TD1 MRZ SPECIFICATION
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--color-94a3b8, #94A3B8)' }}>BACK</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-secondary, #E2E8F0)',
            marginTop: '6px',
          }}
        >
          <span>
            Card No: <strong>{extractedData.cardNumber}</strong>
          </span>
          <span>
            Chip: <strong>{extractedData.chipNumber || 'Not extracted'}</strong>
          </span>
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-94a3b8, #94A3B8)',
            marginTop: '6px',
          }}
        >
          Occupation: <strong>{extractedData.occupationEn}</strong>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-94a3b8, #94A3B8)' }}>
          Employer: <strong>{extractedData.employerEn}</strong>
        </div>
        <div
          style={{
            marginTop: '10px',
            padding: '6px',
            background: 'var(--color-020617, #020617)',
            borderRadius: '6px',
            fontFamily: 'monospace',
            fontSize: '0.68rem',
            color: 'var(--color-38bdf8, #EF4444)',
            lineHeight: 1.3,
          }}
        >
          {extractedData.mrz
            ? `${extractedData.mrz.line1}\n${extractedData.mrz.line2}\n${extractedData.mrz.line3}`
            : 'MRZ not extracted — capture the back of the card'}
        </div>
      </div>
      <p style={{ fontSize: '0.78rem', marginTop: '10px' }}>
        Back view active with 3-line ICAO TD1 MRZ, smart chip ID and card serial.
      </p>
    </div>
  );
};
