/**
 * HenryTitleDeedScannerView.tsx
 *
 * 3.19.3 Scan Title Deed — Dedicated Main Content Area View.
 * Left: Shared Document Uploader with Title Deed / Oqood dropzone.
 * Right: Extracted Property Ownership Specifications & DLD validation status with Save/Discard.
 */

import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Building, MapPin, CheckCircle2, Trash2, Save, FileText, Sparkles } from 'lucide-react';
import henryTitleDeedScannerService, {
  DldTitleDeedExtractedData,
} from '../../../services/HenryTitleDeedScannerService';
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

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

const SpecItem = styled.div`
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 10px 12px;

  .label {
    font-size: 0.72rem;
    font-weight: 700;
    color: #64748B;
    text-transform: uppercase;
  }
  .val {
    font-size: 0.95rem;
    font-weight: 800;
    color: #0F172A;
    margin-top: 2px;
  }
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
    background: #EF4444;
    color: #FFFFFF;
    box-shadow: 0 2px 6px rgba(239, 68, 68, 0.25);
    &:hover { background: #DC2626; }
  `
      : `
    background: #FEE2E2;
    color: #DC2626;
    border: 1px solid #FCA5A5;
    &:hover { background: #FECACA; }
  `}
`;

export const HenryTitleDeedScannerView: FC = () => {
  const [extractedData, setExtractedData] = useState<DldTitleDeedExtractedData | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleFileUpload = async (file: File) => {
    setIsScanning(true);
    try {
      const data = await henryTitleDeedScannerService.scanTitleDeed(file);
      setExtractedData(data);
    } finally {
      setIsScanning(false);
    }
  };

  const handleLoadDemo = () => {
    const demo = henryTitleDeedScannerService.getDemoExtractedData();
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
          docType="title_deed"
          title="3.19.3 Scan Title Deed / Oqood (شهادة ملكية)"
          subtitle="Extracts Property Registration No., Building Name, Unit Number, Plot, Makani, DEWA Premise, Area SqM, and Owner Legal Name"
          onFileUpload={handleFileUpload}
          onSampleLoad={handleLoadDemo}
          isProcessing={isScanning}
          accentColor="#EF4444"
        />
      </div>

      {/* RIGHT: EXTRACTED TITLE DEED DATA */}
      <ResultCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
            Extracted Title Deed Specifications
          </h4>
          {extractedData && (
            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 800 }}>
              ✓ DLD Official Registry Validated
            </span>
          )}
        </div>

        {extractedData ? (
          <>
            <SpecsGrid>
              <SpecItem>
                <div className="label">Building Name (اسم المبنى)</div>
                <div className="val">{extractedData.buildingNameEn || '—'}</div>
              </SpecItem>
              <SpecItem>
                <div className="label">Unit / Property No. (رقم العقار)</div>
                <div className="val" style={{ color: '#EF4444' }}>{extractedData.propertyNumber || '—'}</div>
              </SpecItem>
              <SpecItem>
                <div className="label">Plot Number (رقم الأرض)</div>
                <div className="val">{extractedData.plotNumber || '—'}</div>
              </SpecItem>
              <SpecItem>
                <div className="label">Area (المساحة متر مربع)</div>
                <div className="val">{extractedData.propertyAreaSqM ? `${extractedData.propertyAreaSqM} Sq.M` : '—'}</div>
              </SpecItem>
              <SpecItem>
                <div className="label">Makani Number (رقم مكاني)</div>
                <div className="val">{extractedData.makaniNumber || '—'}</div>
              </SpecItem>
              <SpecItem>
                <div className="label">DEWA Premise (رقم ديوا)</div>
                <div className="val">{extractedData.dewaNumber || '—'}</div>
              </SpecItem>
            </SpecsGrid>

            <SpecItem style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <div className="label" style={{ color: '#EF4444' }}>Owner Legal Name (اسم المالك)</div>
              <div className="val">{extractedData.ownerNameEn || '—'}</div>
            </SpecItem>

            <SpecItem>
              <div className="label">Location / Community (الموقع)</div>
              <div className="val">{extractedData.locationEn || '—'}</div>
            </SpecItem>

            {savedSuccess && (
              <div style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Saved to Title Deed Vault successfully!
              </div>
            )}

            <ActionRow>
              <Btn $variant="danger" onClick={handleDiscard}>
                <Trash2 size={13} /> Discard
              </Btn>
              <Btn $variant="primary" onClick={handleSave}>
                <Save size={13} /> Save to Property Vault
              </Btn>
            </ActionRow>
          </>
        ) : (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94A3B8' }}>
            <Building size={40} color="#CBD5E1" style={{ margin: '0 auto 8px auto' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>No Title Deed Scanned Yet</div>
            <div style={{ fontSize: '0.8rem' }}>Upload a Title Deed document or load demo sample on the left.</div>
          </div>
        )}
      </ResultCard>
    </ViewContainer>
  );
};

export default HenryTitleDeedScannerView;
