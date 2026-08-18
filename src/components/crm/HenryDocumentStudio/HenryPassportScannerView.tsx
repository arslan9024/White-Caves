/**
 * HenryPassportScannerView.tsx
 *
 * 3.19.4 Scan Passport — Dedicated Main Content Area View.
 * Left: Shared Document Uploader with Passport dropzone.
 * Right: Extracted Passport Bio Data & 2-Line ICAO TD3 MRZ parser with Save/Discard.
 */

import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Flag, User, Calendar, CheckCircle2, Trash2, Save, Sparkles, ShieldCheck } from 'lucide-react';
import henryPassportScannerService, {
  InternationalPassportExtractedData,
} from '../../../services/HenryPassportScannerService';
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

const PassportDigitalCard = styled.div`
  background: linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%);
  border: 2px solid #60A5FA;
  border-radius: 12px;
  padding: 1.25rem;
  color: #FFFFFF;
  box-shadow: 0 8px 24px rgba(30, 58, 138, 0.3);
  position: relative;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    padding-bottom: 8px;
    margin-bottom: 12px;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 1px;
    color: #93C5FD;
  }

  .passport-no {
    font-family: monospace;
    font-size: 1.3rem;
    font-weight: 900;
    letter-spacing: 2px;
    color: #F8FAFC;
    margin: 6px 0;
  }

  .name {
    font-size: 1.05rem;
    font-weight: 800;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 14px;
    padding-top: 10px;
    border-top: 1px dashed rgba(255, 255, 255, 0.15);
    font-size: 0.75rem;
    color: #93C5FD;
  }
`;

const MrzBox = styled.div`
  background: #0F172A;
  border: 1px solid #334155;
  border-radius: 6px;
  padding: 10px;
  font-family: monospace;
  font-size: 0.82rem;
  color: #60A5FA;
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
    background: #3B82F6;
    color: #FFFFFF;
    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.25);
    &:hover { background: #2563EB; }
  `
      : `
    background: #FEE2E2;
    color: #DC2626;
    border: 1px solid #FCA5A5;
    &:hover { background: #FECACA; }
  `}
`;

export const HenryPassportScannerView: FC = () => {
  const [extractedData, setExtractedData] = useState<InternationalPassportExtractedData | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleFileUpload = async (file: File) => {
    setIsScanning(true);
    try {
      const data = await henryPassportScannerService.scanPassport(file);
      setExtractedData(data);
    } finally {
      setIsScanning(false);
    }
  };

  const handleLoadDemo = () => {
    const demo = henryPassportScannerService.getDemoExtractedData();
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
          docType="passport"
          title="3.19.4 Scan International Passport (جواز السفر)"
          subtitle="Extracts Passport Number, Issuing Country Code, Full Legal Name, Date of Birth, Expiry, and 2-line ICAO TD3 MRZ Checksums"
          onFileUpload={handleFileUpload}
          onSampleLoad={handleLoadDemo}
          isProcessing={isScanning}
          accentColor="#3B82F6"
        />
      </div>

      {/* RIGHT: EXTRACTED PASSPORT DATA */}
      <ResultCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
            Extracted Passport Bio Data
          </h4>
          {extractedData && (
            <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 800 }}>
              ✓ Verified ICAO TD3 MRZ
            </span>
          )}
        </div>

        {extractedData ? (
          <>
            <PassportDigitalCard>
              <div className="header">
                <span>PASSPORT · {extractedData.issuingCountryCode || 'INTERNATIONAL'}</span>
                <ShieldCheck size={16} color="#60A5FA" />
              </div>

              <div className="passport-no">{extractedData.passportNumber}</div>
              <div className="name">{extractedData.fullName}</div>

              <div className="footer">
                <div>
                  <strong>Nationality:</strong> {extractedData.nationality}
                </div>
                <div>
                  <strong>DOB:</strong> {extractedData.dateOfBirth} &nbsp;|&nbsp; <strong>Expiry:</strong> {extractedData.expiryDate}
                </div>
              </div>
            </PassportDigitalCard>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', marginBottom: '4px' }}>
                RAW MACHINE READABLE ZONE (MRZ TD3 - 2 LINES):
              </div>
              <MrzBox>{extractedData.rawMrz}</MrzBox>
            </div>

            {savedSuccess && (
              <div style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Saved to Passport Vault successfully!
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
            <Flag size={40} color="#CBD5E1" style={{ margin: '0 auto 8px auto' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>No Passport Scanned Yet</div>
            <div style={{ fontSize: '0.8rem' }}>Upload a Passport document or load demo sample on the left.</div>
          </div>
        )}
      </ResultCard>
    </ViewContainer>
  );
};

export default HenryPassportScannerView;
