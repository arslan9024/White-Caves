import React, { FC } from 'react';
import { CreditCard, ZoomIn, ZoomOut } from 'lucide-react';
import {
  LeftDocumentPane,
  PaneHeader,
  ZoomBtn,
  DocumentCanvasViewer,
} from '../styles/HenryEmiratesIdScannerView.style';
import { HenrySharedDocumentUploader } from '../HenrySharedDocumentUploader';
import { EmiratesIdExtractedData } from '../../../../services/HenryEmiratesIdScannerService';

export interface HenryEmiratesIdLeftPaneProps {
  activeSideView: 'front' | 'back';
  setActiveSideView: (side: 'front' | 'back') => void;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  uploaderReset: number;
  isScanning: boolean;
  uploadedFile: File | null;
  filePreviewUrl: string | null;
  extractedData: EmiratesIdExtractedData;
  handleFileUpload: (file: File, original?: File) => Promise<void>;
  handleLoadDemo: () => void;
  onLoadMansoorDemo: () => void;
}

export const HenryEmiratesIdLeftPane: FC<HenryEmiratesIdLeftPaneProps> = ({
  activeSideView,
  setActiveSideView,
  zoomLevel,
  setZoomLevel,
  uploaderReset,
  isScanning,
  uploadedFile,
  filePreviewUrl,
  extractedData,
  handleFileUpload,
  handleLoadDemo,
  onLoadMansoorDemo,
}) => {
  return (
    <LeftDocumentPane>
      <PaneHeader>
        <div className="title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CreditCard size={16} color="#EF4444" />
          <span>Emirates ID Document Viewer</span>
          <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
            <button
              type="button"
              onClick={() => setActiveSideView('front')}
              style={{
                background: activeSideView === 'front' ? '#EF4444' : 'rgba(255,255,255,0.12)',
                color: '#FFF',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Front Side
            </button>
            <button
              type="button"
              onClick={() => setActiveSideView('back')}
              style={{
                background: activeSideView === 'back' ? '#EF4444' : 'rgba(255,255,255,0.12)',
                color: '#FFF',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Back Side (MRZ)
            </button>
          </div>
        </div>
        <div className="controls">
          <ZoomBtn onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}>
            <ZoomOut size={13} />
          </ZoomBtn>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-94a3b8, #94A3B8)' }}>
            {zoomLevel}%
          </span>
          <ZoomBtn onClick={() => setZoomLevel(prev => Math.min(180, prev + 15))}>
            <ZoomIn size={13} />
          </ZoomBtn>
        </div>
      </PaneHeader>

      {/* Section 1: Upload File Component */}
      <div
        style={{
          padding: '1rem',
          background: 'var(--white, #FFFFFF)',
          borderBottom: '1px solid var(--text-secondary, #E2E8F0)',
        }}
      >
        <HenrySharedDocumentUploader
          key={activeSideView}
          resetSignal={uploaderReset}
          docType="emirates_id"
          title="1. Upload Emirates ID (PDF, PNG, JPEG)"
          subtitle="Drop your Emirates ID file to extract live variables and compare on the right"
          onFileUpload={handleFileUpload}
          onSampleLoad={handleLoadDemo}
          isProcessing={isScanning}
          accentColor="#EF4444"
        />
        <div
          style={{
            marginTop: '8px',
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-secondary, #64748B)',
              fontWeight: 700,
            }}
          >
            Demo Presets:
          </span>
          <button
            type="button"
            onClick={handleLoadDemo}
            style={{
              background: 'var(--color-f1f5f9, #F1F5F9)',
              border: '1px solid var(--text-secondary, #CBD5E1)',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Khalif Mohamednur (Kenya / Jayeeco)
          </button>
          <button
            type="button"
            onClick={onLoadMansoorDemo}
            style={{
              background: 'var(--color-f1f5f9, #F1F5F9)',
              border: '1px solid var(--text-secondary, #CBD5E1)',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Mansoor Almarzooqi (UAE / Gov)
          </button>
        </div>
      </div>

      {/* Section 2: Visual Document Preview Viewer */}
      <DocumentCanvasViewer $zoom={zoomLevel}>
        {uploadedFile && filePreviewUrl ? (
          uploadedFile.type.startsWith('image/') ? (
            <img src={filePreviewUrl} alt="Uploaded Emirates ID" />
          ) : (
            <iframe src={filePreviewUrl} title="Emirates ID PDF Preview" />
          )
        ) : activeSideView === 'front' ? (
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
        ) : (
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
                <span style={{ fontSize: '0.68rem', color: 'var(--color-94a3b8, #94A3B8)' }}>
                  BACK
                </span>
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
        )}
      </DocumentCanvasViewer>
    </LeftDocumentPane>
  );
};
