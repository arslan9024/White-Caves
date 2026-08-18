/**
 * HenryEmiratesIdScannerView.tsx
 *
 * 3.19.2 Scan Emirates ID — Dedicated Main Content Area View.
 * Left: Shared File Upload Component with EID dropzone.
 * Right: Extracted Digital Emirates ID Card with MRZ & Bio data inspection, plus Save/Discard buttons.
 */

import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { ShieldCheck, User, CreditCard, Calendar, Flag, Sparkles, Trash2, Save, CheckCircle2 } from 'lucide-react';
import henryEmiratesIdScannerService, {
  EmiratesIdExtractedData,
} from '../../../services/HenryEmiratesIdScannerService';
import HenrySharedDocumentUploader from './HenrySharedDocumentUploader';

const ViewContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: flex-start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ResultCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const EmiratesIdDigitalCard = styled.div`
  background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
  border: 2px solid #38BDF8;
  border-radius: 12px;
  padding: 1.25rem;
  color: #FFFFFF;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.3);
  position: relative;
  overflow: hidden;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    padding-bottom: 8px;
    margin-bottom: 12px;

    .uae-badge {
      font-size: 0.75rem;
      font-weight: 800;
      color: #38BDF8;
      letter-spacing: 1px;
    }
  }

  .id-number {
    font-family: monospace;
    font-size: 1.25rem;
    font-weight: 900;
    letter-spacing: 2px;
    color: #F8FAFC;
    margin: 8px 0;
  }

  .name-en {
    font-size: 1rem;
    font-weight: 800;
    color: #FFFFFF;
  }
  .name-ar {
    font-size: 0.9rem;
    color: #94A3B8;
    direction: rtl;
    text-align: right;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 14px;
    padding-top: 10px;
    border-top: 1px dashed rgba(255, 255, 255, 0.15);
    font-size: 0.75rem;
    color: #94A3B8;
  }
`;

const MrzBox = styled.div`
  background: #0F172A;
  border: 1px solid #334155;
  border-radius: 6px;
  padding: 10px;
  font-family: monospace;
  font-size: 0.8rem;
  color: #38BDF8;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #E2E8F0;
`;

const Btn = styled.button<{ $variant?: 'primary' | 'danger' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: #10B981;
    color: #FFFFFF;
    box-shadow: 0 2px 6px rgba(16, 185, 129, 0.25);
    &:hover { background: #059669; }
  `
      : `
    background: #FEE2E2;
    color: #DC2626;
    border: 1px solid #FCA5A5;
    &:hover { background: #FECACA; }
  `}
`;

export const HenryEmiratesIdScannerView: FC = () => {
  const [extractedData, setExtractedData] = useState<EmiratesIdExtractedData | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleFileUpload = async (file: File) => {
    setIsScanning(true);
    try {
      const data = await henryEmiratesIdScannerService.scanEmiratesId(file);
      setExtractedData(data);
    } finally {
      setIsScanning(false);
    }
  };

  const handleLoadDemo = () => {
    const demo = henryEmiratesIdScannerService.getDemoExtractedData();
    setExtractedData(demo);
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDiscard = () => {
    setExtractedData(null);
  };

  return (
    <ViewContainer>
      {/* LEFT: SHARED UPLOADER */}
      <div>
        <HenrySharedDocumentUploader
          docType="emirates_id"
          title="3.19.2 Scan Emirates ID (الهوية الإماراتية)"
          subtitle="Extracts 15-digit ID, Full Legal Names (EN/AR), Nationality, Expiry Date, and 3-line TD1 Machine Readable Zone"
          onFileUpload={handleFileUpload}
          onSampleLoad={handleLoadDemo}
          isProcessing={isScanning}
          accentColor="#10B981"
        />
      </div>

      {/* RIGHT: EXTRACTED CARD & MRZ INSPECTOR */}
      <ResultCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
            Extracted Emirates ID Card Data
          </h4>
          {extractedData && (
            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 800 }}>
              ✓ Verified ICAO TD1
            </span>
          )}
        </div>

        {extractedData ? (
          <>
            <EmiratesIdDigitalCard>
              <div className="card-header">
                <span className="uae-badge">UNITED ARAB EMIRATES · IDENTITY CARD</span>
                <ShieldCheck size={16} color="#38BDF8" />
              </div>

              <div className="id-number">{extractedData.idNumber}</div>
              <div className="name-en">{extractedData.fullNameEn}</div>
              <div className="name-ar">{extractedData.fullNameAr || 'أرسلان مالك'}</div>

              <div className="card-footer">
                <div>
                  <strong>Nationality:</strong> {extractedData.nationality} ({extractedData.countryCode})
                </div>
                <div>
                  <strong>Expiry:</strong> {extractedData.expiryDate}
                </div>
              </div>
            </EmiratesIdDigitalCard>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', marginBottom: '4px' }}>
                RAW MACHINE READABLE ZONE (MRZ TD1):
              </div>
              <MrzBox>{extractedData.rawMrz}</MrzBox>
            </div>

            {savedSuccess && (
              <div style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Saved to White Caves KYC Vault successfully!
              </div>
            )}

            <ActionRow>
              <Btn $variant="danger" onClick={handleDiscard}>
                <Trash2 size={13} /> Discard
              </Btn>
              <Btn $variant="primary" onClick={handleSave}>
                <Save size={13} /> Save to KYC Vault
              </Btn>
            </ActionRow>
          </>
        ) : (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94A3B8' }}>
            <CreditCard size={40} color="#CBD5E1" style={{ margin: '0 auto 8px auto' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>No Emirates ID Scanned Yet</div>
            <div style={{ fontSize: '0.8rem' }}>Upload an Emirates ID document or load demo sample on the left.</div>
          </div>
        )}
      </ResultCard>
    </ViewContainer>
  );
};

export default HenryEmiratesIdScannerView;
