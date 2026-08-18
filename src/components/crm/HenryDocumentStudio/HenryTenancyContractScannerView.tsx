/**
 * HenryTenancyContractScannerView.tsx
 *
 * 3.19.5 Scan Tenancy Contract — Dedicated Main Content Area View.
 * Left: Shared File Upload Component for Existing Tenancy Agreements (PDF/Image).
 * Right: Extracted 4-Domain Agreement Schema + Live DLD PDF preview with Save/Discard.
 */

import React, { FC, useState, useMemo } from 'react';
import styled from 'styled-components';
import { FileText, Building, UserCheck, CreditCard, Sparkles, Trash2, Save, Printer, CheckCircle2 } from 'lucide-react';
import henryTenancyContractScannerService, {
  DldScannedContractResult,
} from '../../../services/HenryTenancyContractScannerService';
import henryTenancyContractTemplateService, {
  DldTenancyContractData,
} from '../../../services/HenryTenancyContractTemplateService';
import HenrySharedDocumentUploader from './HenrySharedDocumentUploader';

const ViewContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: flex-start;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ResultCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DomainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

const DomainCard = styled.div<{ $borderColor?: string }>`
  background: #F8FAFC;
  border-left: 4px solid ${props => props.$borderColor || '#3B82F6'};
  border-top: 1px solid #E2E8F0;
  border-right: 1px solid #E2E8F0;
  border-bottom: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 10px;

  .domain-title {
    font-size: 0.75rem;
    font-weight: 800;
    color: #475569;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .domain-val {
    font-size: 0.85rem;
    font-weight: 700;
    color: #0F172A;
  }
  .domain-sub {
    font-size: 0.75rem;
    color: #64748B;
  }
`;

const RightPreviewCol = styled.div`
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 8rem);
  display: flex;
  flex-direction: column;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #E2E8F0;
`;

const Btn = styled.button<{ $variant?: 'primary' | 'danger' | 'secondary' }>`
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

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: #EF4444;
        color: #FFFFFF;
        box-shadow: 0 2px 6px rgba(239, 68, 68, 0.25);
        &:hover { background: #DC2626; }
      `;
    }
    if (props.$variant === 'danger') {
      return `
        background: #FEE2E2;
        color: #DC2626;
        border: 1px solid #FCA5A5;
        &:hover { background: #FECACA; }
      `;
    }
    return `
      background: #FFFFFF;
      color: #334155;
      border: 1px solid #CBD5E1;
      &:hover { background: #F8FAFC; border-color: #94A3B8; }
    `;
  }}
`;

export const HenryTenancyContractScannerView: FC = () => {
  const [scannedResult, setScannedResult] = useState<DldScannedContractResult | null>(null);
  const [contractData, setContractData] = useState<DldTenancyContractData | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleFileUpload = async (file: File) => {
    setIsScanning(true);
    try {
      const result = await henryTenancyContractScannerService.scanContract(file);
      setScannedResult(result);
      const dld = henryTenancyContractScannerService.toDldTenancyContractData(result);
      setContractData(dld);
    } finally {
      setIsScanning(false);
    }
  };

  const handleLoadCameliaDemo = () => {
    const demo = henryTenancyContractScannerService.getDemoExtractedData();
    const dld = henryTenancyContractScannerService.toDldTenancyContractData(demo);
    setContractData(dld);
    setScannedResult({
      property: {
        buildingName: demo.property.buildingName,
        propertyNo: demo.property.propertyNumber,
        plotNo: demo.property.plotNumber,
        location: demo.property.location,
      },
      landlord: {
        ownerName: demo.landlord.name,
        lessorPhone: demo.landlord.phone,
        lessorEmail: demo.landlord.email,
      },
      tenant: {
        tenantName: demo.tenant.name,
        tenantEmiratesId: demo.tenant.emiratesId,
        tenantPhone: demo.tenant.phone,
      },
      financials: {
        annualRentAed: demo.financials.annualRentAed,
        modeOfPayment: demo.financials.modeOfPayment,
        contractPeriodFrom: demo.financials.periodFrom,
        contractPeriodTo: demo.financials.periodTo,
      },
      ocrConfidence: 98,
    });
  };

  const handleSave = () => {
    if (contractData) {
      henryTenancyContractTemplateService.saveContract(contractData);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDiscard = () => {
    setScannedResult(null);
    setContractData(null);
  };

  const previewHtml = useMemo(() => {
    if (!contractData) return '';
    return henryTenancyContractTemplateService.generateDldTenancyContractHtml(contractData, 'all');
  }, [contractData]);

  return (
    <ViewContainer>
      {/* LEFT COLUMN: UPLOADER & STRUCTURED SUMMARY */}
      <LeftCol>
        <HenrySharedDocumentUploader
          docType="contract"
          title="3.19.5 Scan & Extract Tenancy Agreement (عقد إيجار)"
          subtitle="Extracts all 4 DLD contract domains: Property specs, Landlord KYC, Tenant KYC, and Financial schedules"
          onFileUpload={handleFileUpload}
          onSampleLoad={handleLoadCameliaDemo}
          isProcessing={isScanning}
          accentColor="#DC2626"
        />

        {scannedResult && (
          <ResultCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                Extracted Agreement Domains
              </h4>
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 800 }}>
                ✓ {scannedResult.ocrConfidence}% OCR Match
              </span>
            </div>

            <DomainGrid>
              <DomainCard $borderColor="#EF4444">
                <div className="domain-title">1. Property Specifications</div>
                <div className="domain-val">{scannedResult.property.buildingName} #{scannedResult.property.propertyNo}</div>
                <div className="domain-sub">Plot {scannedResult.property.plotNo} · {scannedResult.property.location}</div>
              </DomainCard>

              <DomainCard $borderColor="#3B82F6">
                <div className="domain-title">2. Landlord / Lessor</div>
                <div className="domain-val">{scannedResult.landlord.ownerName}</div>
                <div className="domain-sub">{scannedResult.landlord.lessorPhone || scannedResult.landlord.lessorEmail}</div>
              </DomainCard>

              <DomainCard $borderColor="#10B981">
                <div className="domain-title">3. Tenant Identity</div>
                <div className="domain-val">{scannedResult.tenant.tenantName}</div>
                <div className="domain-sub">{scannedResult.tenant.tenantEmiratesId || scannedResult.tenant.tenantPhone}</div>
              </DomainCard>

              <DomainCard $borderColor="#F59E0B">
                <div className="domain-title">4. Financial Terms</div>
                <div className="domain-val">AED {scannedResult.financials.annualRentAed.toLocaleString()}</div>
                <div className="domain-sub">{scannedResult.financials.modeOfPayment} · {scannedResult.financials.contractPeriodFrom} to {scannedResult.financials.contractPeriodTo}</div>
              </DomainCard>
            </DomainGrid>

            {savedSuccess && (
              <div style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Saved and archived to Henry Vault successfully!
              </div>
            )}

            <ActionRow>
              <Btn $variant="danger" onClick={handleDiscard}>
                <Trash2 size={13} /> Discard
              </Btn>
              <Btn $variant="primary" onClick={handleSave}>
                <Save size={13} /> Save to Henry Vault
              </Btn>
            </ActionRow>
          </ResultCard>
        )}
      </LeftCol>

      {/* RIGHT COLUMN: 1:1 LIVE DLD OFFICIAL PREVIEW */}
      <RightPreviewCol>
        <div style={{ background: '#0F172A', color: '#FFFFFF', padding: '10px 14px', fontSize: '0.85rem', fontWeight: 800 }}>
          🏛️ DLD Official Contract Overlay Preview
        </div>
        <div style={{ padding: '1.25rem', background: '#CBD5E1', overflowY: 'auto', flex: 1 }}>
          {contractData ? (
            <div
              dangerouslySetInnerHTML={{ __html: previewHtml }}
              style={{ background: '#FFFFFF', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', borderRadius: '4px' }}
            />
          ) : (
            <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748B' }}>
              <FileText size={40} color="#94A3B8" style={{ margin: '0 auto 8px auto' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>No Contract Scanned</div>
              <div style={{ fontSize: '0.8rem' }}>Upload a contract or load demo benchmark on the left.</div>
            </div>
          )}
        </div>
      </RightPreviewCol>
    </ViewContainer>
  );
};

export default HenryTenancyContractScannerView;
