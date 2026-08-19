/**
 * HenryTenancyContractJourneyView.tsx
 *
 * 3.19.1 Prepare Tenancy Contract — Main Content Area Journey View.
 * Left: Multi-stage guided workflow (Title Deed & Landlord Passport -> Tenant KYC -> Contract Terms -> Save/Discard)
 * Right: Live Exact Full-Color Dubai Land Department (DLD) Official Contract PDF Preview.
 */

import React, { FC, useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import {
  FileText,
  Building,
  UserCheck,
  CreditCard,
  Printer,
  Sparkles,
  Save,
  RotateCcw,
  Check,
  ZoomIn,
  ZoomOut,
  Trash2,
  Share2,
} from 'lucide-react';
import henryTenancyContractTemplateService, {
  DldTenancyContractData,
} from '../../../services/HenryTenancyContractTemplateService';
import henryTitleDeedScannerService from '../../../services/HenryTitleDeedScannerService';
import henryEmiratesIdScannerService from '../../../services/HenryEmiratesIdScannerService';
import henryPassportScannerService from '../../../services/HenryPassportScannerService';
import HenrySharedDocumentUploader from './HenrySharedDocumentUploader';

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SplitLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: flex-start;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const LeftJourneyCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const RightPreviewCol = styled.div`
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 8rem);
`;

const PreviewToolbar = styled.div`
  background: #0F172A;
  color: #FFFFFF;
  padding: 8px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  .page-tabs {
    display: flex;
    gap: 4px;
  }
  .zoom-box {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const PageTabBtn = styled.button<{ $active: boolean }>`
  background: ${props => (props.$active ? '#EF4444' : 'rgba(255, 255, 255, 0.12)')};
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${props => (props.$active ? '#DC2626' : 'rgba(255, 255, 255, 0.25)')};
  }
`;

const PreviewScrollArea = styled.div`
  padding: 1.25rem;
  background: #CBD5E1;
  overflow-y: auto;
  flex: 1;
  display: flex;
  justify-content: center;
`;

const PreviewScaler = styled.div<{ $zoom: number }>`
  transform: scale(${props => props.$zoom});
  transform-origin: top center;
  transition: transform 0.2s ease;
`;

const StepperNav = styled.div`
  display: flex;
  gap: 6px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 6px;
  overflow-x: auto;
`;

const StepBtn = styled.button<{ $active: boolean; $completed: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background: ${props => {
    if (props.$active) return 'linear-gradient(135deg, #EF4444, #DC2626)';
    if (props.$completed) return 'rgba(16, 185, 129, 0.1)';
    return 'transparent';
  }};
  color: ${props => {
    if (props.$active) return '#FFFFFF';
    if (props.$completed) return '#059669';
    return '#64748B';
  }};
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    background: ${props => (props.$active ? '#DC2626' : '#F1F5F9')};
  }
`;

const FormCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGrid = styled.div<{ $cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$cols || 2}, 1fr);
  gap: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #475569;
    .ar {
      color: #94A3B8;
      font-size: 0.7rem;
      margin-left: 4px;
      direction: rtl;
    }
  }

  input, select, textarea {
    background: #F8FAFC;
    border: 1px solid #CBD5E1;
    border-radius: 6px;
    padding: 7px 10px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #0F172A;
    outline: none;
    transition: border 0.15s ease;

    &:focus {
      border-color: #EF4444;
      background: #FFFFFF;
    }
  }
`;

const BottomActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #E2E8F0;
`;

const PrimaryBtn = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, #EF4444, #DC2626);
        color: #FFFFFF;
        border: none;
        box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
        &:hover { opacity: 0.92; }
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

export const HenryTenancyContractJourneyView: FC = () => {
  const [contractData, setContractData] = useState<DldTenancyContractData>(() =>
    henryTenancyContractTemplateService.loadActiveDraft()
  );
  const [cachedTitleDeed, setCachedTitleDeed] = useState(() => henryTitleDeedScannerService.getCachedTitleDeed());
  const [cachedTenantEid, setCachedTenantEid] = useState(() => henryEmiratesIdScannerService.getCachedEmiratesId());
  const [cachedPassport, setCachedPassport] = useState(() => henryPassportScannerService.getCachedPassport());

  const [activeStage, setActiveStage] = useState<number>(1);
  const [previewPage, setPreviewPage] = useState<number | 'all'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubDeed = henryTitleDeedScannerService.onTitleDeedUpdated((deed) => setCachedTitleDeed(deed));
    const unsubEid = henryEmiratesIdScannerService.onEmiratesIdUpdated((eid) => setCachedTenantEid(eid));
    const unsubPass = henryPassportScannerService.onPassportUpdated((pass) => setCachedPassport(pass));

    return () => {
      unsubDeed();
      unsubEid();
      unsubPass();
    };
  }, []);

  const updateField = (field: keyof DldTenancyContractData, value: any) => {
    setContractData(prev => {
      const next = { ...prev, [field]: value };
      henryTenancyContractTemplateService.saveDraft(next);
      return next;
    });
  };

  const handleUpdateAdditionalTerm = (index: number, val: string) => {
    setContractData(prev => {
      const terms = [...(prev.additionalTerms || [])];
      terms[index] = val;
      const next = { ...prev, additionalTerms: terms };
      henryTenancyContractTemplateService.saveDraft(next);
      return next;
    });
  };

  // Stage 1: Upload Title Deed
  const handleUploadTitleDeed = async (file: File) => {
    setIsProcessing(true);
    setStatusMsg(`Scanning Title Deed "${file.name}"...`);
    try {
      const deedData = await henryTitleDeedScannerService.scanTitleDeed(file);
      setContractData(prev => {
        const next = henryTenancyContractTemplateService.populateFromTitleDeed(prev, deedData);
        henryTenancyContractTemplateService.saveDraft(next);
        return next;
      });
      setStatusMsg(`✓ Title Deed extracted! Unit ${deedData.propertyNumber} in ${deedData.buildingNameEn || 'Property'} (${deedData.ownerNameEn || 'Owner'}).`);
    } catch {
      setStatusMsg('Could not process Title Deed.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  // Stage 1: Upload Landlord Passport / EID
  const handleUploadLandlordPassport = async (file: File) => {
    setIsProcessing(true);
    setStatusMsg(`Scanning Landlord Document "${file.name}"...`);
    try {
      const passportData = await henryPassportScannerService.scanPassport(file);
      setContractData(prev => {
        const next = henryTenancyContractTemplateService.populateFromPassport(prev, passportData, 'landlord');
        henryTenancyContractTemplateService.saveDraft(next);
        return next;
      });
      setStatusMsg(`✓ Landlord document extracted: ${passportData.fullName || 'Owner'}.`);
    } catch {
      setStatusMsg('Could not process Landlord document.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  // Stage 2: Upload Tenant Emirates ID
  const handleUploadTenantEid = async (file: File) => {
    setIsProcessing(true);
    setStatusMsg(`Scanning Tenant Emirates ID "${file.name}"...`);
    try {
      const eidData = await henryEmiratesIdScannerService.scanEmiratesId(file);
      setContractData(prev => {
        const next = henryTenancyContractTemplateService.populateFromEmiratesId(prev, eidData, 'tenant');
        henryTenancyContractTemplateService.saveDraft(next);
        return next;
      });
      setStatusMsg(`✓ Tenant EID extracted: ${eidData.fullNameEn} (${eidData.idNumber}).`);
    } catch {
      setStatusMsg('Could not process Tenant Emirates ID.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  // Stage 2: Upload Tenant Passport
  const handleUploadTenantPassport = async (file: File) => {
    setIsProcessing(true);
    setStatusMsg(`Scanning Tenant Passport "${file.name}"...`);
    try {
      const passportData = await henryPassportScannerService.scanPassport(file);
      setContractData(prev => {
        const next = henryTenancyContractTemplateService.populateFromPassport(prev, passportData, 'tenant');
        henryTenancyContractTemplateService.saveDraft(next);
        return next;
      });
      setStatusMsg(`✓ Tenant Passport extracted: ${passportData.fullName} (${passportData.passportNumber}).`);
    } catch {
      setStatusMsg('Could not process Tenant Passport.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  // Save Draft to Vault
  const handleSaveToVault = () => {
    henryTenancyContractTemplateService.saveContract(contractData);
    setStatusMsg(`✓ Contract ${contractData.contractId} saved to White Caves Vault!`);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Discard Draft
  const handleDiscardDraft = () => {
    if (window.confirm('Are you sure you want to discard this draft and reset to a fresh blank official DLD template?')) {
      const blank = henryTenancyContractTemplateService.resetDraft();
      setContractData(blank);
      setActiveStage(1);
      setStatusMsg('Draft discarded. Reset to official blank DLD template.');
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  // Print / PDF
  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const compiledHtml = henryTenancyContractTemplateService.generateDldTenancyContractHtml(contractData, 'all');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Tenancy Contract — ${contractData.contractId || 'DLD'}</title>
            <style>
              @page { size: A4 portrait; margin: 0; }
              body { margin: 0; padding: 0; background: #FFFFFF; }
              .dld-page { page-break-after: always; }
              .dld-page:last-child { page-break-after: avoid; }
            </style>
          </head>
          <body>
            ${compiledHtml}
            <script>window.onload = function() { window.print(); };</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Compiled PDF HTML
  const compiledPdfHtml = useMemo(() => {
    return henryTenancyContractTemplateService.generateDldTenancyContractHtml(contractData, previewPage);
  }, [contractData, previewPage]);

  return (
    <ViewContainer>
      {/* Feedback Banner */}
      {statusMsg && (
        <div style={{ background: '#0F172A', color: '#38BDF8', padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700 }}>
          ⚡ {statusMsg}
        </div>
      )}

      {/* Stepper Navigation Bar */}
      <StepperNav>
        <StepBtn
          $active={activeStage === 1}
          $completed={Boolean(contractData.propertyNo && contractData.ownerName)}
          onClick={() => setActiveStage(1)}
        >
          <Building size={14} /> 1. Title Deed & Landlord KYC
        </StepBtn>
        <StepBtn
          $active={activeStage === 2}
          $completed={Boolean(contractData.tenantName)}
          onClick={() => setActiveStage(2)}
        >
          <UserCheck size={14} /> 2. Tenant KYC & Documents
        </StepBtn>
        <StepBtn
          $active={activeStage === 3}
          $completed={Boolean(contractData.annualRent > 0)}
          onClick={() => setActiveStage(3)}
        >
          <CreditCard size={14} /> 3. Contract Terms & Financials
        </StepBtn>
        <StepBtn
          $active={activeStage === 4}
          $completed={Boolean(contractData.tenantSignature)}
          onClick={() => setActiveStage(4)}
        >
          <FileText size={14} /> 4. Signatures & Final Actions
        </StepBtn>
      </StepperNav>

      <SplitLayout>
        {/* ══════════ LEFT COLUMN: GUIDED JOURNEY STAGES ══════════ */}
        <LeftJourneyCol>
          {/* STAGE 1: TITLE DEED & LANDLORD KYC */}
          {activeStage === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cachedTitleDeed && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#991B1B' }}>⚡ Active Title Deed In Cache</div>
                    <div style={{ fontSize: '0.74rem', color: '#B91C1C' }}>{cachedTitleDeed.buildingNameEn || 'Building'} Unit {cachedTitleDeed.propertyNumber} ({cachedTitleDeed.ownerNameEn || 'Owner'})</div>
                  </div>
                  <PrimaryBtn
                    $variant="primary"
                    style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                    onClick={() => {
                      setContractData(prev => {
                        const next = henryTenancyContractTemplateService.populateFromTitleDeed(prev, cachedTitleDeed);
                        henryTenancyContractTemplateService.saveDraft(next);
                        return next;
                      });
                      setStatusMsg('✓ Auto-filled Property & Owner from Active Title Deed cache!');
                      setTimeout(() => setStatusMsg(null), 3000);
                    }}
                  >
                    Ingest Title Deed
                  </PrimaryBtn>
                </div>
              )}

              {cachedPassport && (
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#1E40AF' }}>⚡ Active Passport In Cache</div>
                    <div style={{ fontSize: '0.74rem', color: '#2563EB' }}>{cachedPassport.fullName} ({cachedPassport.passportNumber})</div>
                  </div>
                  <PrimaryBtn
                    $variant="primary"
                    style={{ padding: '4px 10px', fontSize: '0.72rem', background: '#2563EB' }}
                    onClick={() => {
                      setContractData(prev => {
                        const next = henryTenancyContractTemplateService.populateFromPassport(prev, cachedPassport, 'landlord');
                        henryTenancyContractTemplateService.saveDraft(next);
                        return next;
                      });
                      setStatusMsg('✓ Auto-filled Landlord from Active Passport cache!');
                      setTimeout(() => setStatusMsg(null), 3000);
                    }}
                  >
                    Ingest as Landlord
                  </PrimaryBtn>
                </div>
              )}

              <HenrySharedDocumentUploader
                docType="title_deed"
                title="1. Upload Official DLD Title Deed / Oqood"
                subtitle="Scans and extracts Building Name, Unit Number, Plot, Makani, DEWA Premise & Area"
                onFileUpload={handleUploadTitleDeed}
                onSampleLoad={() => {
                  const demo = henryTitleDeedScannerService.getDemoExtractedData();
                  setContractData(prev => {
                    const next = henryTenancyContractTemplateService.populateFromTitleDeed(prev, demo);
                    henryTenancyContractTemplateService.saveDraft(next);
                    return next;
                  });
                }}
                isProcessing={isProcessing}
                accentColor="#EF4444"
                extractedSummary={
                  contractData.propertyNo
                    ? {
                        title: 'Extracted Property Specs',
                        fields: [
                          { label: 'Building', value: contractData.buildingName, isHighlight: true },
                          { label: 'Unit No.', value: contractData.propertyNo, isHighlight: true },
                          { label: 'Plot No.', value: contractData.plotNo },
                          { label: 'DEWA Premise', value: contractData.premisesNoDewa },
                          { label: 'Area SqM', value: contractData.propertyAreaSqM },
                          { label: 'Owner', value: contractData.ownerName },
                        ],
                      }
                    : null
                }
              />

              <HenrySharedDocumentUploader
                docType="passport"
                title="2. Upload Landlord Passport / Emirates ID"
                subtitle="Scans and extracts Owner/Lessor Legal Name, Identification Number, and Contact details"
                onFileUpload={handleUploadLandlordPassport}
                onSampleLoad={() => {
                  const demo = henryPassportScannerService.getDemoExtractedData();
                  setContractData(prev => {
                    const next = henryTenancyContractTemplateService.populateFromPassport(prev, demo, 'landlord');
                    henryTenancyContractTemplateService.saveDraft(next);
                    return next;
                  });
                }}
                isProcessing={isProcessing}
                accentColor="#3B82F6"
              />

              <FormCard>
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#1E293B' }}>
                  Property & Landlord Verified Data
                </h4>
                <FormGrid $cols={3}>
                  <FormGroup>
                    <label>Building Name <span className="ar">(اسم المبنى)</span></label>
                    <input
                      type="text"
                      value={contractData.buildingName}
                      onChange={(e) => updateField('buildingName', e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Unit No. <span className="ar">(رقم العقار)</span></label>
                    <input
                      type="text"
                      value={contractData.propertyNo}
                      onChange={(e) => updateField('propertyNo', e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Property Usage <span className="ar">(الاستخدام)</span></label>
                    <select
                      value={contractData.propertyUsage}
                      onChange={(e) => updateField('propertyUsage', e.target.value as any)}
                    >
                      <option value="residential">Residential (سكني)</option>
                      <option value="commercial">Commercial (تجاري)</option>
                      <option value="industrial">Industrial (صناعي)</option>
                    </select>
                  </FormGroup>
                </FormGrid>

                <FormGrid $cols={2}>
                  <FormGroup>
                    <label>Owner Name <span className="ar">(اسم المالك)</span></label>
                    <input
                      type="text"
                      value={contractData.ownerName}
                      onChange={(e) => updateField('ownerName', e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Lessor Emirates ID / Passport <span className="ar">(الهوية/الجواز)</span></label>
                    <input
                      type="text"
                      value={contractData.lessorEmiratesId}
                      onChange={(e) => updateField('lessorEmiratesId', e.target.value)}
                    />
                  </FormGroup>
                </FormGrid>

                <BottomActionBar>
                  <PrimaryBtn $variant="danger" onClick={handleDiscardDraft}>
                    <Trash2 size={13} /> Discard Draft
                  </PrimaryBtn>
                  <PrimaryBtn $variant="primary" onClick={() => setActiveStage(2)}>
                    Next: Tenant KYC →
                  </PrimaryBtn>
                </BottomActionBar>
              </FormCard>
            </div>
          )}

          {/* STAGE 2: TENANT KYC & DOCUMENTS */}
          {activeStage === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cachedTenantEid && (
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#065F46' }}>⚡ Active Emirates ID In Cache</div>
                    <div style={{ fontSize: '0.74rem', color: '#047857' }}>{cachedTenantEid.fullNameEn} ({cachedTenantEid.idNumber})</div>
                  </div>
                  <PrimaryBtn
                    $variant="primary"
                    style={{ padding: '4px 10px', fontSize: '0.72rem', background: '#059669' }}
                    onClick={() => {
                      setContractData(prev => {
                        const next = henryTenancyContractTemplateService.populateFromEmiratesId(prev, cachedTenantEid, 'tenant');
                        henryTenancyContractTemplateService.saveDraft(next);
                        return next;
                      });
                      setStatusMsg('✓ Auto-filled Tenant from Active Emirates ID cache!');
                      setTimeout(() => setStatusMsg(null), 3000);
                    }}
                  >
                    Ingest as Tenant
                  </PrimaryBtn>
                </div>
              )}

              {cachedPassport && (
                <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#5B21B6' }}>⚡ Active Passport In Cache</div>
                    <div style={{ fontSize: '0.74rem', color: '#6D28D9' }}>{cachedPassport.fullName} ({cachedPassport.passportNumber})</div>
                  </div>
                  <PrimaryBtn
                    $variant="primary"
                    style={{ padding: '4px 10px', fontSize: '0.72rem', background: '#7C3AED' }}
                    onClick={() => {
                      setContractData(prev => {
                        const next = henryTenancyContractTemplateService.populateFromPassport(prev, cachedPassport, 'tenant');
                        henryTenancyContractTemplateService.saveDraft(next);
                        return next;
                      });
                      setStatusMsg('✓ Auto-filled Tenant from Active Passport cache!');
                      setTimeout(() => setStatusMsg(null), 3000);
                    }}
                  >
                    Ingest as Tenant
                  </PrimaryBtn>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <HenrySharedDocumentUploader
                  docType="emirates_id"
                  title="Tenant Emirates ID"
                  subtitle="Extracts 15-digit ID & Name"
                  onFileUpload={handleUploadTenantEid}
                  onSampleLoad={() => {
                    const demo = henryEmiratesIdScannerService.getDemoExtractedData();
                    setContractData(prev => {
                      const next = henryTenancyContractTemplateService.populateFromEmiratesId(prev, demo, 'tenant');
                      henryTenancyContractTemplateService.saveDraft(next);
                      return next;
                    });
                  }}
                  isProcessing={isProcessing}
                  accentColor="#10B981"
                />

                <HenrySharedDocumentUploader
                  docType="passport"
                  title="Tenant Passport"
                  subtitle="Extracts MRZ & Passport No"
                  onFileUpload={handleUploadTenantPassport}
                  onSampleLoad={() => {
                    const demo = henryPassportScannerService.getDemoExtractedData();
                    setContractData(prev => {
                      const next = henryTenancyContractTemplateService.populateFromPassport(prev, demo, 'tenant');
                      henryTenancyContractTemplateService.saveDraft(next);
                      return next;
                    });
                  }}
                  isProcessing={isProcessing}
                  accentColor="#8B5CF6"
                />
              </div>

              <FormCard>
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#1E293B' }}>
                  Tenant Contact & Legal Identity
                </h4>
                <FormGrid $cols={2}>
                  <FormGroup>
                    <label>Tenant Full Name <span className="ar">(اسم المستأجر)</span></label>
                    <input
                      type="text"
                      value={contractData.tenantName}
                      onChange={(e) => updateField('tenantName', e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Tenant Emirates ID / Passport <span className="ar">(الهوية/الجواز)</span></label>
                    <input
                      type="text"
                      value={contractData.tenantEmiratesId}
                      onChange={(e) => updateField('tenantEmiratesId', e.target.value)}
                    />
                  </FormGroup>
                </FormGrid>

                <FormGrid $cols={2}>
                  <FormGroup>
                    <label>Tenant Email <span className="ar">(البريد الإلكتروني)</span></label>
                    <input
                      type="email"
                      value={contractData.tenantEmail}
                      onChange={(e) => updateField('tenantEmail', e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Tenant Phone <span className="ar">(رقم الهاتف)</span></label>
                    <input
                      type="text"
                      value={contractData.tenantPhone}
                      onChange={(e) => updateField('tenantPhone', e.target.value)}
                    />
                  </FormGroup>
                </FormGrid>

                <BottomActionBar>
                  <PrimaryBtn $variant="secondary" onClick={() => setActiveStage(1)}>
                    ← Back to Property
                  </PrimaryBtn>
                  <PrimaryBtn $variant="primary" onClick={() => setActiveStage(3)}>
                    Next: Contract Terms →
                  </PrimaryBtn>
                </BottomActionBar>
              </FormCard>
            </div>
          )}

          {/* STAGE 3: CONTRACT TERMS & FINANCIALS */}
          {activeStage === 3 && (
            <FormCard>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#1E293B' }}>
                Stage 3: Lease Financials & Contract Period
              </h4>

              <FormGrid $cols={2}>
                <FormGroup>
                  <label>Contract Period From <span className="ar">(من)</span></label>
                  <input
                    type="text"
                    value={contractData.contractPeriodFrom}
                    onChange={(e) => updateField('contractPeriodFrom', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Contract Period To <span className="ar">(إلى)</span></label>
                  <input
                    type="text"
                    value={contractData.contractPeriodTo}
                    onChange={(e) => updateField('contractPeriodTo', e.target.value)}
                  />
                </FormGroup>
              </FormGrid>

              <FormGrid $cols={3}>
                <FormGroup>
                  <label>Annual Rent (AED) <span className="ar">(الإيجار السنوي)</span></label>
                  <input
                    type="number"
                    value={contractData.annualRent || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      updateField('annualRent', val);
                      updateField('contractValue', val);
                      updateField('securityDepositAmount', Math.round(val * 0.05));
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Contract Value (AED) <span className="ar">(قيمة العقد)</span></label>
                  <input
                    type="number"
                    value={contractData.contractValue || contractData.annualRent || ''}
                    onChange={(e) => updateField('contractValue', parseFloat(e.target.value) || 0)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Security Deposit (AED) <span className="ar">(التأمين)</span></label>
                  <input
                    type="number"
                    value={contractData.securityDepositAmount || ''}
                    onChange={(e) => updateField('securityDepositAmount', parseFloat(e.target.value) || 0)}
                  />
                </FormGroup>
              </FormGrid>

              <FormGroup>
                <label>Mode of Payment <span className="ar">(طريقة الدفع)</span></label>
                <input
                  type="text"
                  value={contractData.modeOfPayment}
                  placeholder="e.g. 4 CHEQUES (PDC)"
                  onChange={(e) => updateField('modeOfPayment', e.target.value)}
                />
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {[
                    { count: 1, label: '1 Cheque (Annual)' },
                    { count: 2, label: '2 Cheques (Semi-Annual)' },
                    { count: 4, label: '4 Cheques (Quarterly)' },
                    { count: 6, label: '6 Cheques (Bi-Monthly)' },
                  ].map(option => (
                    <button
                      key={option.count}
                      type="button"
                      onClick={() => {
                        const rent = contractData.annualRent || 0;
                        const perCheque = option.count > 0 ? Math.round(rent / option.count) : rent;
                        updateField('modeOfPayment', `${option.count} CHEQUES (AED ${perCheque.toLocaleString()} each)`);
                        setStatusMsg(`✓ Calculated payment mode: ${option.count} cheques of AED ${perCheque.toLocaleString()}`);
                        setTimeout(() => setStatusMsg(null), 3000);
                      }}
                      style={{
                        background: contractData.modeOfPayment?.includes(`${option.count} CHEQUE`) ? '#EF4444' : '#F1F5F9',
                        color: contractData.modeOfPayment?.includes(`${option.count} CHEQUE`) ? '#FFFFFF' : '#334155',
                        border: '1px solid #CBD5E1',
                        borderRadius: '4px',
                        padding: '3px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </FormGroup>

              <h5 style={{ margin: '1rem 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>
                Page 3: Additional Terms (شروط إضافية)
              </h5>
              {[0, 1, 2, 3, 4].map(idx => (
                <FormGroup key={idx}>
                  <label style={{ fontSize: '0.72rem' }}>Clause {idx + 1}</label>
                  <input
                    type="text"
                    value={contractData.additionalTerms?.[idx] || ''}
                    placeholder={`Special condition ${idx + 1}...`}
                    onChange={(e) => handleUpdateAdditionalTerm(idx, e.target.value)}
                  />
                </FormGroup>
              ))}

              <BottomActionBar>
                <PrimaryBtn $variant="secondary" onClick={() => setActiveStage(2)}>
                  ← Back to Tenant
                </PrimaryBtn>
                <PrimaryBtn $variant="primary" onClick={() => setActiveStage(4)}>
                  Next: Signatures & Export →
                </PrimaryBtn>
              </BottomActionBar>
            </FormCard>
          )}

          {/* STAGE 4: SIGNATURES & FINAL ACTIONS */}
          {activeStage === 4 && (
            <FormCard>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#1E293B' }}>
                Stage 4: Endorsement Signatures & Vault Persistence
              </h4>

              <FormGrid $cols={2}>
                <FormGroup>
                  <label>Tenant Signature Name <span className="ar">(توقيع المستأجر)</span></label>
                  <input
                    type="text"
                    value={contractData.tenantSignature || ''}
                    placeholder="Type name for digital signature"
                    onChange={(e) => {
                      updateField('tenantSignature', e.target.value);
                      updateField('tenantSignatureDate', new Date().toLocaleDateString('en-GB'));
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Lessor Signature Name <span className="ar">(توقيع المؤجر)</span></label>
                  <input
                    type="text"
                    value={contractData.lessorSignature || ''}
                    placeholder="Type name for digital signature"
                    onChange={(e) => {
                      updateField('lessorSignature', e.target.value);
                      updateField('lessorSignatureDate', new Date().toLocaleDateString('en-GB'));
                    }}
                  />
                </FormGroup>
              </FormGrid>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <PrimaryBtn $variant="secondary" onClick={handlePrintPdf} style={{ flex: 1 }}>
                  <Printer size={14} /> Print / Save PDF
                </PrimaryBtn>
                <PrimaryBtn $variant="primary" onClick={handleSaveToVault} style={{ flex: 1 }}>
                  <Save size={14} /> Save to Henry Vault
                </PrimaryBtn>
              </div>

              <BottomActionBar>
                <PrimaryBtn $variant="danger" onClick={handleDiscardDraft}>
                  <Trash2 size={13} /> Discard & Reset
                </PrimaryBtn>
                <PrimaryBtn $variant="secondary" onClick={() => setActiveStage(3)}>
                  ← Back to Terms
                </PrimaryBtn>
              </BottomActionBar>
            </FormCard>
          )}
        </LeftJourneyCol>

        {/* ══════════ RIGHT COLUMN: LIVE EXACT OFFICIAL DLD PDF PREVIEW ══════════ */}
        <RightPreviewCol>
          <PreviewToolbar>
            <div className="page-tabs">
              <PageTabBtn $active={previewPage === 1} onClick={() => setPreviewPage(1)}>
                Page 1
              </PageTabBtn>
              <PageTabBtn $active={previewPage === 2} onClick={() => setPreviewPage(2)}>
                Page 2 (14 Terms)
              </PageTabBtn>
              <PageTabBtn $active={previewPage === 3} onClick={() => setPreviewPage(3)}>
                Page 3 (Rights)
              </PageTabBtn>
              <PageTabBtn $active={previewPage === 'all'} onClick={() => setPreviewPage('all')}>
                All 3 Pages
              </PageTabBtn>
            </div>

            <div className="zoom-box">
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.5))}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <ZoomOut size={13} />
              </button>
              <span style={{ fontSize: '11px', minWidth: '35px', textAlign: 'center' }}>
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.2))}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <ZoomIn size={13} />
              </button>
            </div>
          </PreviewToolbar>

          <PreviewScrollArea>
            <PreviewScaler $zoom={zoomLevel}>
              <div
                dangerouslySetInnerHTML={{ __html: compiledPdfHtml }}
                style={{ background: '#FFFFFF', boxShadow: '0 8px 30px rgba(0,0,0,0.25)', borderRadius: '4px' }}
              />
            </PreviewScaler>
          </PreviewScrollArea>
        </RightPreviewCol>
      </SplitLayout>
    </ViewContainer>
  );
};

export default HenryTenancyContractJourneyView;
