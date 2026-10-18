/**
 * HenryTenancyContractScannerView.tsx
 *
 * 3.19.5 Scan Tenancy Contract — Upgraded Split-Screen View.
 * Left Side:
 *   - Shared Document Upload Component (dropzone + file selector)
 *   - Form-Style Variables Extraction (Building, Unit, Landlord Name/Phone, Tenant Name/EID, Annual Rent, Mode of Payment, Dates)
 * Right Side:
 *   - Uploaded Document Live Preview Pane (supports PDF, PNG, JPG, or Live DLD Template Overlay)
 * Bottom:
 *   - Persistent Action Controls (Discard, Copy JSON, Save to Henry Vault)
 */

import React, { FC, useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import {
  FileText,
  Building,
  UserCheck,
  CreditCard,
  Sparkles,
  Trash2,
  Save,
  Printer,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import henryTenancyContractScannerService, {
  DldScannedContractResult,
} from '../../../services/HenryTenancyContractScannerService';
import henryTenancyContractTemplateService, {
  DldTenancyContractData,
} from '../../../services/HenryTenancyContractTemplateService';
import HenrySharedDocumentUploader from './HenrySharedDocumentUploader';
import { assessScanReadiness, canUseScan, type VaultSaveOptions } from '../../../services/henryScanReview';
import HenryCaseLinks from './HenryCaseLinks';
import { markFieldReviewed } from '../../../services/henryDocumentParsing';
import { HenryExtractionEvidence } from './HenryExtractionEvidence';

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SplitGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: flex-start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
    font-size: 0.72rem;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    display: flex;
    justify-content: space-between;

    .ar {
      color: #94A3B8;
      font-size: 0.7rem;
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
      border-color: #DC2626;
      background: #FFFFFF;
    }
  }
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

const PreviewHeader = styled.div`
  background: #0F172A;
  color: #FFFFFF;
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 0.82rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .controls {
    display: flex;
    gap: 6px;
    align-items: center;
  }
`;

const PreviewBody = styled.div`
  padding: 1.25rem;
  background: #CBD5E1;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 420px;
`;

const BottomActionBar = styled.div`
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
`;

const ActionBtn = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
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
        background: linear-gradient(135deg, #EF4444, #DC2626);
        color: #FFFFFF;
        box-shadow: 0 2px 6px rgba(239, 68, 68, 0.25);
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

export const HenryTenancyContractScannerView: FC = () => {
  const [scannedResult, setScannedResult] = useState<DldScannedContractResult | null>(() => {
    return henryTenancyContractScannerService.getCachedContract();
  });
  const [contractData, setContractData] = useState<DldTenancyContractData | null>(() => {
    const cached = henryTenancyContractScannerService.getCachedContract();
    return cached ? henryTenancyContractScannerService.toDldTenancyContractData(cached, true) : null;
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const generation = useRef(0);
  const saving = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [vaultOptions, setVaultOptions] = useState<VaultSaveOptions>({});
  useEffect(() => { setVaultOptions({}); }, [uploadedFile]);
  useEffect(() => () => { generation.current++; }, []);

  useEffect(() => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      setFilePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFilePreviewUrl(null);
    }
  }, [uploadedFile]);

  const handleFileUpload = async (file: File) => {
    const request = ++generation.current;
    setIsSaving(false);
    henryTenancyContractScannerService.clearCachedContract();
    setScannedResult(null);
    setContractData(null);
    setIsScanning(true);
    setUploadedFile(file);
    setStatusMsg(`Reading Tenancy Agreement "${file.name}"...`);

    try {
      const result = await henryTenancyContractScannerService.scanContract(file);
      if (request !== generation.current) return;
      setScannedResult(result);
      const dld = henryTenancyContractScannerService.toDldTenancyContractData(result, true);
      setContractData(dld);
      setStatusMsg(`✓ Extracted agreement: ${result.property.buildingName} #${result.property.propertyNumber} (Rent AED ${result.financials.annualRentAed.toLocaleString()})`);
    } catch {
      if (request !== generation.current) return;
      setStatusMsg('Error processing Tenancy Contract.');
    } finally {
      if (request === generation.current) setIsScanning(false);
    }
  };

  const handleLoadDemo = async () => {
    generation.current++;
    henryTenancyContractScannerService.clearCachedContract();
    setIsScanning(true);
    setUploadedFile(null);
    try {
      const demo = henryTenancyContractScannerService.getDemoExtractedData();
      const dld = henryTenancyContractScannerService.toDldTenancyContractData(demo, true);
      setContractData(dld);
      setScannedResult(demo);
      setStatusMsg('✓ Loaded demo Tenancy Contract (Camelia 608).');
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanCorrection = (path: string, value: string | number) => {
    if (!scannedResult) return;
    const updated = { ...scannedResult, reviewConfirmed: false, missingFields: [],
      diagnostics: markFieldReviewed(scannedResult.diagnostics, path, value) };
    const [group, key] = path.split('.');
    const numeric = ['financials.annualRentAed', 'financials.contractValueAed', 'financials.securityDepositAed', 'property.areaSqM', 'property.areaSqFt'].includes(path);
    const corrected = numeric ? value === '' ? undefined : Number(value) : value;
    if (key && (group === 'landlord' || group === 'tenant' || group === 'property' || group === 'financials'))
      Object.assign(updated, { [group]: { ...updated[group], [key]: corrected } });
    else if (path === 'contractReference' || path === 'contractDate')
      Object.assign(updated, { [path]: value });
    else if (path === 'additionalTerms') updated.additionalTerms = [String(value)];
    else if (path === 'cheques') {
      updated.financials = { ...updated.financials, modeOfPayment: value ? `${value} CHEQUES` : '' };
    }
    updated.isFilled = assessScanReadiness(updated).status !== 'needs_rescan';
    updated.fillScorePercent = Math.round((updated.diagnostics?.coverage || 0) * 100);
    updated.filledFieldsCount = Object.values(updated.diagnostics?.fields || {}).filter(field => field.state === 'extracted').length;
    setScannedResult(updated);
    setContractData(henryTenancyContractScannerService.toDldTenancyContractData(updated, true));
    henryTenancyContractScannerService.clearCachedContract();
  };

  const handleUpdateDldField = (field: keyof DldTenancyContractData, val: string | number) => {
    const paths: Partial<Record<keyof DldTenancyContractData, string>> = {
      buildingName: 'property.buildingName', propertyNo: 'property.propertyNumber', plotNo: 'property.plotNumber',
      ownerName: 'landlord.name', tenantName: 'tenant.name', annualRent: 'financials.annualRentAed',
      contractPeriodFrom: 'financials.periodFrom', contractPeriodTo: 'financials.periodTo',
    };
    const path = paths[field];
    if (path) handleScanCorrection(path, val);
  };

  const handleLoadToJourney = () => {
    if (!scannedResult || !canUseScan(scannedResult)) return;
    henryTenancyContractScannerService.setCachedContract(scannedResult);
    henryTenancyContractTemplateService.saveDraft(
      henryTenancyContractScannerService.toDldTenancyContractData(scannedResult));
    setStatusMsg('Reviewed agreement applied to Preparation Studio.');
  };

  const handleSaveToVault = async () => {
    if (!scannedResult || !canUseScan(scannedResult) || !uploadedFile || saving.current) return;
    saving.current = true;
    setIsSaving(true);
    const request = generation.current;
    const result = await henryTenancyContractScannerService.saveToDatabase(scannedResult, { ...vaultOptions, sources: [uploadedFile] });
    saving.current = false;
    if (request === generation.current) {
      setIsSaving(false);
      setStatusMsg(result.success ? 'Reviewed agreement and original saved to encrypted vault.' : result.error || 'Nothing was saved.');
    }
  };

  const handleDiscard = () => {
    generation.current++;
    setIsScanning(false);
    setIsSaving(false);
    setScannedResult(null);
    setContractData(null);
    setUploadedFile(null);
    henryTenancyContractScannerService.clearCachedContract();
    setStatusMsg('Discarded Tenancy Contract data and cleared session cache.');
  };

  const handleCopyJson = () => {
    if (!contractData) return;
    navigator.clipboard.writeText(JSON.stringify(contractData, null, 2));
    setCopiedJson(true);
    setStatusMsg('Extracted contract variables JSON copied to clipboard!');
    setTimeout(() => {
      setCopiedJson(false);
      setStatusMsg(null);
    }, 3000);
  };

  const compiledDldHtml = useMemo(() => {
    if (!contractData) return '';
    return henryTenancyContractTemplateService.generateDldTenancyContractHtml(contractData, 'all');
  }, [contractData]);

  return (
    <ViewContainer>
      {/* Status Feedback Banner */}
      {statusMsg && (
        <div style={{ background: 'var(--color-0f172a, #0F172A)', color: 'var(--color-38bdf8, #38BDF8)', padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700 }}>
          ⚡ {statusMsg}
        </div>
      )}

      <SplitGrid>
        {/* ══════════ LEFT COLUMN: UPLOADER & FORM-STYLE EXTRACTION ══════════ */}
        <LeftCol>
          <HenrySharedDocumentUploader
            docType="contract"
            title="3.19.5 Scan & Extract Tenancy Agreement (عقد إيجار)"
            subtitle="Upload full Tenancy Agreement PDF or scanned document to extract all 4 DLD contract domains"
            onFileUpload={handleFileUpload}
            onSampleLoad={handleLoadDemo}
            isProcessing={isScanning}
            accentColor="#DC2626"
          />

          {contractData && (
            <FormCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-0f172a, #0F172A)' }}>
                  Extracted Agreement Variables Form
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-green, #059669)', fontWeight: 800 }}>
                  Source review required — not authenticity verification
                </span>
              </div>

              <h5 style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-red, #EF4444)' }}>
                1. Property Specifications
              </h5>
              <FormGrid $cols={3}>
                <FormGroup>
                  <label>Building <span className="ar">المبنى</span></label>
                  <input
                    type="text"
                    value={contractData.buildingName}
                    onChange={(e) => handleUpdateDldField('buildingName', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Unit No. <span className="ar">رقم العقار</span></label>
                  <input
                    type="text"
                    value={contractData.propertyNo}
                    style={{ fontWeight: 800, color: 'var(--accent-red, #EF4444)' }}
                    onChange={(e) => handleUpdateDldField('propertyNo', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Plot No. <span className="ar">رقم الأرض</span></label>
                  <input
                    type="text"
                    value={contractData.plotNo}
                    onChange={(e) => handleUpdateDldField('plotNo', e.target.value)}
                  />
                </FormGroup>
              </FormGrid>

              <h5 style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-blue, #3B82F6)' }}>
                2. Landlord & Tenant Parties
              </h5>
              <FormGrid $cols={2}>
                <FormGroup>
                  <label>Owner / Lessor <span className="ar">اسم المؤجر</span></label>
                  <input
                    type="text"
                    value={contractData.ownerName}
                    onChange={(e) => handleUpdateDldField('ownerName', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Tenant Name <span className="ar">اسم المستأجر</span></label>
                  <input
                    type="text"
                    value={contractData.tenantName}
                    style={{ fontWeight: 700 }}
                    onChange={(e) => handleUpdateDldField('tenantName', e.target.value)}
                  />
                </FormGroup>
              </FormGrid>

              <h5 style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-green, #10B981)' }}>
                3. Financial Schedules & Dates
              </h5>
              <FormGrid $cols={3}>
                <FormGroup>
                  <label>Annual Rent (AED) <span className="ar">الإيجار</span></label>
                  <input
                    type="number"
                    value={contractData.annualRent || ''}
                    style={{ fontWeight: 800, color: 'var(--accent-green, #059669)' }}
                    onChange={(e) => handleUpdateDldField('annualRent', parseFloat(e.target.value) || 0)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Period From <span className="ar">من</span></label>
                  <input
                    type="text"
                    value={contractData.contractPeriodFrom}
                    onChange={(e) => handleUpdateDldField('contractPeriodFrom', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Period To <span className="ar">إلى</span></label>
                  <input
                    type="text"
                    value={contractData.contractPeriodTo}
                    onChange={(e) => handleUpdateDldField('contractPeriodTo', e.target.value)}
                  />
                </FormGroup>
              </FormGrid>
              {scannedResult && <>
                <label>Source contract reference
                  <input aria-label="Source contract reference" value={scannedResult.contractReference || ''}
                    onChange={e => handleScanCorrection('contractReference', e.target.value)} />
                </label>
                <p>Use the reference printed on the agreement. If none is present, leave blank: archival requires a source reference; no reference is invented.</p>
                <details><summary>Additional source corrections</summary>
                  {Object.entries(scannedResult.diagnostics?.fields || {})
                    .filter(([key]) => !['landlord.name', 'tenant.name', 'property.buildingName', 'property.propertyNumber',
                      'property.plotNumber', 'financials.periodFrom', 'financials.periodTo', 'financials.annualRentAed', 'contractReference'].includes(key))
                    .map(([path, evidence]) => {
                      const [group, key] = path.split('.');
                      const fields = group === 'landlord' || group === 'tenant' || group === 'property' || group === 'financials'
                        ? scannedResult[group] : null;
                      const value = fields && key ? (fields as unknown as Record<string, unknown>)[key]
                        : path === 'contractDate' ? scannedResult.contractDate
                        : path === 'additionalTerms' ? scannedResult.additionalTerms.join('; ') : evidence.values[0] || '';
                      return <label key={path} style={{ display: 'block' }}>{path}
                        <input aria-label={path} value={String(value ?? '')}
                          onChange={e => handleScanCorrection(path, typeof value === 'number' ? Number(e.target.value) : e.target.value)} />
                      </label>;
                    })}
                </details>
                <HenryExtractionEvidence diagnostics={scannedResult.diagnostics} />
                {scannedResult.demoOnly ? <p role="alert">Demo only — cannot save or autofill.</p> : <>
                  <p role="status">{assessScanReadiness(scannedResult).reasons.join(' ')}</p>
                  <label><input type="checkbox" checked={scannedResult.reviewConfirmed === true}
                    onChange={e => {
                      const reviewed = { ...scannedResult, reviewConfirmed: e.target.checked };
                      setScannedResult(reviewed);
                      henryTenancyContractScannerService.clearCachedContract();
                      if (canUseScan(reviewed)) henryTenancyContractScannerService.setCachedContract(reviewed);
                    }} />I reviewed all extracted values against the original agreement.</label>
                </>}
              </>}
            </FormCard>
          )}
        </LeftCol>

        {/* ══════════ RIGHT COLUMN: DOCUMENT PREVIEW PANE ══════════ */}
        <RightPreviewCol>
          <PreviewHeader>
            <div className="title">
              <FileText size={15} color="#DC2626" />
              <span>Contract Document Preview</span>
            </div>
            <div className="controls" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
                style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--white, #FFF)', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '0.7rem', cursor: 'pointer' }}
              >
                -
              </button>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-94a3b8, #94A3B8)' }}>{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(180, prev + 15))}
                style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--white, #FFF)', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '0.7rem', cursor: 'pointer' }}
              >
                +
              </button>
              {uploadedFile && (
                <span style={{ fontSize: '0.72rem', color: 'var(--color-94a3b8, #94A3B8)', marginLeft: '6px' }}>
                  {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                </span>
              )}
            </div>
          </PreviewHeader>

          <PreviewBody style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}>
            {uploadedFile && filePreviewUrl ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {uploadedFile.type.startsWith('image/') ? (
                  <img
                    src={filePreviewUrl}
                    alt="Uploaded Contract"
                    style={{ maxWidth: '100%', maxHeight: '480px', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                  />
                ) : (
                  <iframe
                    src={filePreviewUrl}
                    title="Contract Preview"
                    style={{ width: '100%', height: '500px', border: 'none', borderRadius: '8px' }}
                  />
                )}
              </div>
            ) : contractData ? (
              <div
                dangerouslySetInnerHTML={{ __html: compiledDldHtml }}
                style={{ background: 'var(--white, #FFFFFF)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', borderRadius: '4px', maxWidth: '100%' }}
              />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--color-94a3b8, #94A3B8)', padding: '3rem 1rem' }}>
                <FileText size={48} color="var(--text-secondary, #94A3B8)" style={{ margin: '0 auto 12px auto' }} />
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-334155, #334155)' }}>
                  No Contract Uploaded Yet
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                  Drag & drop tenancy agreement on the left to preview and extract variables.
                </div>
              </div>
            )}
          </PreviewBody>
        </RightPreviewCol>
      </SplitGrid>

      {/* ══════════ BOTTOM PERSISTENT ACTION CONTROLS ══════════ */}
      <BottomActionBar>
        <div>
          <ActionBtn $variant="danger" onClick={handleDiscard} disabled={!contractData && !uploadedFile}>
            <Trash2 size={13} /> Discard & Clear
          </ActionBtn>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <ActionBtn $variant="secondary" onClick={handleLoadToJourney} disabled={!canUseScan(scannedResult)}>
            <FileText size={13} color="#10B981" /> Load into 3.19.1 Preparation Studio
          </ActionBtn>
          <ActionBtn $variant="secondary" onClick={handleCopyJson} disabled={!contractData}>
            {copiedJson ? <Check size={13} color="#10B981" /> : <Copy size={13} />} Copy Variables JSON
          </ActionBtn>
          <ActionBtn $variant="primary" onClick={handleSaveToVault} disabled={!canUseScan(scannedResult) || !scannedResult?.contractReference || !uploadedFile || isSaving}>
            <Save size={13} /> Save to encrypted vault
          </ActionBtn>
        </div>
      </BottomActionBar>
      <HenryCaseLinks key={filePreviewUrl || 'empty'} options={vaultOptions} onOptions={setVaultOptions} />
    </ViewContainer>
  );
};

export default HenryTenancyContractScannerView;
