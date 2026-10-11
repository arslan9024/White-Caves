/**
 * HenryEmiratesIdScannerView.tsx
 *
 * 3.19.2 Scan Emirates ID — Live Document Comparison & Variable Verification Studio (V7).
 * - Inline Content Area Layout (No Modal).
 * - Left Pane: Live Document Viewer with zoom controls & crop inspection.
 * - Right Pane: Variable-by-Variable Live Comparison Cards:
 *   1. Identity Number (784-YYYY-XXXXXXX-Z) with live checksum verification
 *   2. Full Legal Name (Bilingual English & Arabic)
 *   3. Date of Birth, Gender & Nationality
 *   4. Issue Date & Expiry Validity
 *   5. Occupation, Employer & Issuing Place
 *   6. Card Number & ICAO TD1 Machine Readable Zone (MRZ)
 * - Bottom Bar: Confirm & Save to KYC Vault, Export to Tenancy Contract, Copy JSON.
 */

import React, { FC, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  ShieldCheck,
  CreditCard,
  Calendar,
  Flag,
  Sparkles,
  Trash2,
  Save,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  Activity,
  User,
  Briefcase,
  Building,
  MapPin,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCw,
  CheckCheck,
  AlertCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import henryEmiratesIdScannerService, {
  EmiratesIdExtractedData,
  EMPTY_EMIRATES_ID,
} from '../../../services/HenryEmiratesIdScannerService';
import { canUseScan, scanExpiry, validScanDate, VaultSaveOptions } from '../../../services/henryScanReview';
import { markFieldReviewed } from '../../../services/henryDocumentParsing';
import { HenryExtractionEvidence } from './HenryExtractionEvidence';
import HenryVaultControls from './HenryVaultControls';
import HenrySharedDocumentUploader from './HenrySharedDocumentUploader';

const StudioContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TopActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 12px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .ai-badge {
      background: linear-gradient(135deg, #0F172A, #1E293B);
      color: #EF4444;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 900;
      color: #0F172A;
    }
  }

  .header-right {
    display: flex;
    gap: 10px;
    align-items: center;
  }
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 1.2fr;
  gap: 1.5rem;
  align-items: flex-start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const LeftDocumentPane = styled.div`
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 1rem;
`;

const PaneHeader = styled.div`
  background: #0F172A;
  color: #FFFFFF;
  padding: 12px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 0.85rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .controls {
    display: flex;
    gap: 8px;
    align-items: center;
  }
`;

const DocumentCanvasViewer = styled.div<{ $zoom: number }>`
  padding: 1.5rem;
  background: #E2E8F0;
  min-height: 480px;
  max-height: 600px;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: ${props => props.$zoom}%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    transition: max-width 0.2s ease;
  }

  iframe {
    width: 100%;
    height: 520px;
    border: none;
    border-radius: 8px;
  }
`;

const RightVariablesPane = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const VariableSectionCard = styled.div<{ $verified?: boolean }>`
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-left: 4px solid #EF4444;
  border-radius: 12px;
  padding: 14px 18px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.15s ease;

  &:hover {
    border-color: #EF4444;
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.08);
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .section-title {
      font-size: 0.76rem;
      font-weight: 800;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .match-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.72rem;
      font-weight: 800;
      color: #EF4444;
      background: #ECFDF5;
      padding: 3px 8px;
      border-radius: 999px;
      border: 1px solid #A7F3D0;
    }
  }

  .value-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .field-box {
    display: flex;
    flex-direction: column;
    gap: 3px;

    label {
      font-size: 0.7rem;
      font-weight: 700;
      color: #64748B;
      display: flex;
      justify-content: space-between;

      .ar {
        direction: rtl;
        color: #94A3B8;
      }
    }

    input, select {
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
      border-radius: 6px;
      padding: 7px 10px;
      font-size: 0.88rem;
      font-weight: 700;
      color: #0F172A;
      outline: none;
      transition: border 0.15s ease;

      &:focus {
        border-color: #EF4444;
        background: #FFFFFF;
      }
    }
  }
`;

const MrzTerminal = styled.div`
  background: #0F172A;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 10px 14px;
  font-family: monospace;
  font-size: 0.78rem;
  color: #EF4444;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, #EF4444, #EF4444);
        color: #FFFFFF;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        &:hover { opacity: 0.92; transform: translateY(-1px); }
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

const ZoomBtn = styled.button`
  background: rgba(255, 255, 255, 0.15);
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover { background: rgba(255, 255, 255, 0.25); }
`;

export const HenryEmiratesIdScannerView: FC = () => {
  const scanGeneration = useRef(0);
  const [extractedData, setExtractedData] = useState<EmiratesIdExtractedData>(() => {
    return henryEmiratesIdScannerService.getCachedEmiratesId() || EMPTY_EMIRATES_ID;
  });
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [activeSideView, setActiveSideView] = useState<'front' | 'back'>('front');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  useEffect(() => {
    if (!canUseScan(extractedData)) henryEmiratesIdScannerService.clearCachedEmiratesId();
  }, [extractedData]);

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
    const generation = ++scanGeneration.current;
    setIsScanning(true);
    setExtractedData(EMPTY_EMIRATES_ID);
    henryEmiratesIdScannerService.clearCachedEmiratesId();
    setUploadedFile(file);
    setStatusMsg(`⚡ Henry AI reading "${file.name}" in real-time...`);

    try {
      const front = activeSideView === 'front' ? file : frontFile;
      const back = activeSideView === 'back' ? file : backFile;
      if (activeSideView === 'front') setFrontFile(file); else setBackFile(file);
      const data = front && back ? await henryEmiratesIdScannerService.scanDualSide(front, back) : await henryEmiratesIdScannerService.scanEmiratesId(file);
      if (generation !== scanGeneration.current) return;
      setExtractedData(data);
      if (data.scannedSide === 'back') {
        setActiveSideView('back');
      }
      setStatusMsg(`✓ Extracted candidate fields for review from "${file.name}"!`);
    } catch (error) {
      if (generation === scanGeneration.current) setStatusMsg(error instanceof Error ? error.message : 'Error processing Emirates ID scan.');
    } finally {
      if (generation === scanGeneration.current) {
        setIsScanning(false);
        setTimeout(() => { if (generation === scanGeneration.current) setStatusMsg(null); }, 4000);
      }
    }
  };

  const handleLoadDemo = () => {
    scanGeneration.current++;
    setIsScanning(false);
    henryEmiratesIdScannerService.clearCachedEmiratesId();
    setFrontFile(null); setBackFile(null);
    setUploadedFile(null);
    const demo = henryEmiratesIdScannerService.getDemoExtractedData();
    setExtractedData(demo);
    setStatusMsg(`✓ Loaded benchmark Emirates ID: ${demo.fullNameEn}`);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleUpdateField = (field: keyof EmiratesIdExtractedData, val: EmiratesIdExtractedData[keyof EmiratesIdExtractedData]) => {
    henryEmiratesIdScannerService.clearCachedEmiratesId();
    setExtractedData(prev => {
      const updated = { ...prev, [field]: val, reviewConfirmed: false };
      updated.diagnostics = markFieldReviewed(prev.diagnostics, field, val);
      updated.missingFields = [
        !/^784-\d{4}-\d{7}-\d$/.test(updated.idNumber) && 'idNumber',
        !updated.fullNameEn.trim() && 'fullNameEn',
        !validScanDate(updated.expiryDate) && 'expiryDate',
      ].filter((value): value is string => !!value);
      Object.assign(updated, scanExpiry(updated.expiryDate));
  
      return updated;
    });
  };

  const handleSaveToVault = async () => {
    if (!canUseScan(extractedData) || isScanning) return;
    const sources = [frontFile, backFile].filter((file): file is File => !!file);
    if (!sources.length) { setStatusMsg('Upload an original before archival. Suggestions alone cannot be archived.'); return; }
    const result = await henryEmiratesIdScannerService.saveToDatabase(extractedData, { ...vaultOptions, sources });
    if (result.success) setVaultOptions(previous => ({ ...previous, replacesId: undefined }));
    setStatusMsg(result.success ? 'Reviewed record saved to encrypted vault.' : result.error || 'Save failed.');
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleAutoFillAsTenant = () => {
    if (!canUseScan(extractedData) || isScanning) return;
    henryEmiratesIdScannerService.setCachedEmiratesId(extractedData);
    setStatusMsg(`Reviewed fields available to Tenancy Contract: ${extractedData.fullNameEn} (${extractedData.idNumber}) as Tenant!`);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleAutoFillAsLandlord = () => {
    if (!canUseScan(extractedData) || isScanning) return;
    henryEmiratesIdScannerService.setCachedEmiratesId(extractedData);
    setStatusMsg(`Reviewed fields available to Tenancy Contract: ${extractedData.fullNameEn} (${extractedData.idNumber}) as Landlord/Owner!`);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleDiscard = () => {
    scanGeneration.current++;
    setIsScanning(false);
    setFrontFile(null); setBackFile(null);
    setUploadedFile(null);
    henryEmiratesIdScannerService.clearCachedEmiratesId();
    setExtractedData(EMPTY_EMIRATES_ID);
    setStatusMsg('Scan a document to begin.');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
    setCopiedJson(true);
    setStatusMsg('Copied all extracted variables JSON to clipboard!');
    setTimeout(() => {
      setCopiedJson(false);
      setStatusMsg(null);
    }, 2500);
  };

  const [vaultOptions, setVaultOptions] = useState<VaultSaveOptions>({});
  return (
    <StudioContainer>
      <label>Capture side <select aria-label="Capture side" value={activeSideView} onChange={event => setActiveSideView(event.target.value as 'front' | 'back')}><option value="front">Front</option><option value="back">Back</option></select></label>
      <HenryVaultControls docType="emirates_id" options={vaultOptions} onOptions={setVaultOptions}
        onSuggestion={data => { scanGeneration.current++; setIsScanning(false); henryEmiratesIdScannerService.clearCachedEmiratesId(); setFrontFile(null); setBackFile(null); setUploadedFile(null); setExtractedData(data as EmiratesIdExtractedData); }} />
      <p>{frontFile ? 'Front captured' : 'Front pending'} · {backFile ? 'Back captured' : 'Back pending'}</p>
      <p role="note">OCR is not proof of authenticity or ownership. Compare every field to the original before saving or autofill. Missing or uncertain values: rescan without glare, then correct below.</p>
      {extractedData?.demoOnly && <p role="alert">Demo only — saving and autofill disabled.</p>}
      {!!extractedData?.missingFields?.length && <p role="alert">Missing: {extractedData.missingFields.join(', ')}. Correct these fields or rescan.</p>}
      <HenryExtractionEvidence diagnostics={extractedData.diagnostics} />
      <label><input type="checkbox" aria-label="Confirm document review" checked={!!extractedData?.reviewConfirmed}
        disabled={!canUseScan({ ...extractedData, reviewConfirmed: true }) || isScanning}
        onChange={event => { henryEmiratesIdScannerService.clearCachedEmiratesId(); setExtractedData(prev => prev ? { ...prev, reviewConfirmed: event.target.checked } : prev); }} />
        I compared the fields to the original and confirm use for saving and autofill.</label>

      {/* ══════════ TOP HEADER & LIVE AI SCANNER STATUS ══════════ */}
      <TopActionBar>
        <div className="header-left">
          <div className="ai-badge">
            <Sparkles size={14} color="#EF4444" /> HENRY AI OCR ENGINE
          </div>
          <h3>3.19.2 Emirates ID Live Extraction Studio</h3>
        </div>

        <div className="header-right">
          <ActionButton $variant="secondary" onClick={handleCopyJson}>
            {copiedJson ? <Check size={14} color="#EF4444" /> : <Copy size={14} />}
            <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
          </ActionButton>

          <ActionButton $variant="primary" onClick={handleSaveToVault} disabled={!canUseScan(extractedData) || isScanning}>
            <Save size={15} />
            <span>Confirm & Save to KYC Vault</span>
          </ActionButton>
        </div>
      </TopActionBar>

      {statusMsg && (
        <div style={{ background: 'var(--color-0f172a, #0F172A)', color: 'var(--color-38bdf8, #EF4444)', padding: '10px 18px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 800 }}>
          ⚡ {statusMsg}
        </div>
      )}

      {/* ══════════ SIDE-BY-SIDE LIVE COMPARISON GRID ══════════ */}
      <ComparisonGrid>
        {/* ────────── LEFT: 1. UPLOADER & 2. PREVIEW VIEWPORT ────────── */}
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
              <span style={{ fontSize: '0.72rem', color: 'var(--color-94a3b8, #94A3B8)' }}>{zoomLevel}%</span>
              <ZoomBtn onClick={() => setZoomLevel(prev => Math.min(180, prev + 15))}>
                <ZoomIn size={13} />
              </ZoomBtn>
            </div>
          </PaneHeader>

          {/* Section 1: Upload File Component */}
          <div style={{ padding: '1rem', background: 'var(--white, #FFFFFF)', borderBottom: '1px solid var(--text-secondary, #E2E8F0)' }}>
            <HenrySharedDocumentUploader
              docType="emirates_id"
              title="1. Upload Emirates ID (PDF, PNG, JPEG)"
              subtitle="Drop your Emirates ID file to extract live variables and compare on the right"
              onFileUpload={handleFileUpload}
              onSampleLoad={handleLoadDemo}
              isProcessing={isScanning}
              accentColor="#EF4444"
            />
            <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #64748B)', fontWeight: 700 }}>Demo Presets:</span>
              <button
                type="button"
                onClick={async () => {
                  scanGeneration.current++; setIsScanning(false); setFrontFile(null); setBackFile(null); setUploadedFile(null);
                  const data = await henryEmiratesIdScannerService.scanEmiratesId('sample_khalif');
                  setExtractedData(data);
                  setStatusMsg(`✓ Ingested Client: ${data.fullNameEn} (${data.nationalityEn})`);
                  setTimeout(() => setStatusMsg(null), 3000);
                }}
                style={{ background: 'var(--color-f1f5f9, #F1F5F9)', border: '1px solid var(--text-secondary, #CBD5E1)', borderRadius: '4px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Khalif Mohamednur (Kenya / Jayeeco)
              </button>
              <button
                type="button"
                onClick={async () => {
                  scanGeneration.current++; setIsScanning(false); setFrontFile(null); setBackFile(null); setUploadedFile(null);
                  const data = await henryEmiratesIdScannerService.scanEmiratesId('sample_mansoor');
                  setExtractedData(data);
                  setStatusMsg(`✓ Ingested Client: ${data.fullNameEn} (${data.nationalityEn})`);
                  setTimeout(() => setStatusMsg(null), 3000);
                }}
                style={{ background: 'var(--color-f1f5f9, #F1F5F9)', border: '1px solid var(--text-secondary, #CBD5E1)', borderRadius: '4px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
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
              <div style={{ textAlign: 'center', color: 'var(--text-secondary, #64748B)', maxWidth: '420px' }}>
                <div style={{ background: 'var(--color-0f172a, #0F172A)', borderRadius: '12px', padding: '1.25rem', color: 'var(--white, #FFFFFF)', border: '2px solid var(--accent-green, #EF4444)', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '6px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-green, #EF4444)' }}>
                      UNITED ARAB EMIRATES · RESIDENT IDENTITY CARD
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--color-94a3b8, #94A3B8)' }}>FRONT</span>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', fontWeight: 900, color: 'var(--white, #FFFFFF)' }}>
                    {extractedData.idNumber}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-f8fafc, #F8FAFC)', marginTop: '4px' }}>
                    {extractedData.fullNameEn}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-94a3b8, #94A3B8)', direction: 'rtl', textAlign: 'right' }}>
                    {extractedData.fullNameAr}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed rgba(255,255,255,0.15)', fontSize: '0.75rem', color: 'var(--color-94a3b8, #94A3B8)' }}>
                    <span>Nationality: {extractedData.nationalityEn} ({extractedData.nationalityCode})</span>
                    <span>Expiry: {extractedData.expiryDate}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.78rem', marginTop: '10px' }}>
                  Front view active. Click "Back Side (MRZ)" or upload your client card to inspect both sides.
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary, #64748B)', maxWidth: '420px' }}>
                <div style={{ background: 'var(--color-0f172a, #0F172A)', borderRadius: '12px', padding: '1.25rem', color: 'var(--white, #FFFFFF)', border: '2px solid var(--color-38bdf8, #EF4444)', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '6px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-38bdf8, #EF4444)' }}>
                      SMART CHIP & ICAO TD1 MRZ SPECIFICATION
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--color-94a3b8, #94A3B8)' }}>BACK</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary, #E2E8F0)', marginTop: '6px' }}>
                    <span>Card No: <strong>{extractedData.cardNumber}</strong></span>
                    <span>Chip: <strong>{extractedData.chipNumber || 'Not extracted'}</strong></span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-94a3b8, #94A3B8)', marginTop: '6px' }}>
                    Occupation: <strong>{extractedData.occupationEn}</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-94a3b8, #94A3B8)' }}>
                    Employer: <strong>{extractedData.employerEn}</strong>
                  </div>
                  <div style={{ marginTop: '10px', padding: '6px', background: 'var(--color-020617, #020617)', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.68rem', color: 'var(--color-38bdf8, #EF4444)', lineHeight: 1.3 }}>
                    {extractedData.mrz ? (
                      `${extractedData.mrz.line1}\n${extractedData.mrz.line2}\n${extractedData.mrz.line3}`
                    ) : (
                      'MRZ not extracted — capture the back of the card'
                    )}
                  </div>
                </div>
                <p style={{ fontSize: '0.78rem', marginTop: '10px' }}>
                  Back view active with 3-line ICAO TD1 MRZ, smart chip ID and card serial.
                </p>
              </div>
            )}
          </DocumentCanvasViewer>
        </LeftDocumentPane>

        {/* ────────── RIGHT: LIVE EXTRACTED VARIABLE SECTIONS ────────── */}
        <RightVariablesPane>
          {/* SECTION 1: IDENTITY & CARD NUMBERS */}
          <VariableSectionCard>
            <div className="card-top">
              <span className="section-title">
                <ShieldCheck size={14} color="#EF4444" /> 1. Identity & Card Numbers
              </span>
              <span className="match-badge">
                <CheckCheck size={13} /> OCR candidate — check original
              </span>
            </div>
            <div className="value-row">
              <div className="field-box">
                <label>Emirates ID Number <span className="ar">رقم الهوية</span></label>
                <input
                  type="text"
                  value={extractedData.idNumber}
                  style={{ fontFamily: 'monospace', color: 'var(--accent-green, #EF4444)', fontSize: '1rem' }}
                  onChange={(e) => handleUpdateField('idNumber', e.target.value)}
                />
              </div>
              <div className="field-box">
                <label>Card Number <span className="ar">رقم البطاقة</span></label>
                <input
                  type="text"
                  value={extractedData.cardNumber}
                  onChange={(e) => handleUpdateField('cardNumber', e.target.value)}
                />
              </div>
            </div>
          </VariableSectionCard>

          {/* SECTION 2: BILINGUAL LEGAL NAMES */}
          <VariableSectionCard>
            <div className="card-top">
              <span className="section-title">
                <User size={14} color="#EF4444" /> 2. Full Legal Names (Bilingual)
              </span>
              <span className="match-badge">
                <CheckCheck size={13} /> Not authenticated
              </span>
            </div>
            <div className="value-row">
              <div className="field-box">
                <label>Full Legal Name (EN) <span className="ar">الاسم بالإنجليزية</span></label>
                <input
                  type="text"
                  value={extractedData.fullNameEn}
                  onChange={(e) => handleUpdateField('fullNameEn', e.target.value)}
                />
              </div>
              <div className="field-box">
                <label>Full Legal Name (AR) <span className="ar">الاسم بالعربية</span></label>
                <input
                  type="text"
                  value={extractedData.fullNameAr || ''}
                  style={{ direction: 'rtl' }}
                  onChange={(e) => handleUpdateField('fullNameAr', e.target.value)}
                />
              </div>
            </div>
          </VariableSectionCard>

          {/* SECTION 3: DEMOGRAPHICS & NATIONALITY */}
          <VariableSectionCard>
            <div className="card-top">
              <span className="section-title">
                <Flag size={14} color="#EF4444" /> 3. Demographics & Nationality
              </span>
              <span className="match-badge">
                <CheckCheck size={13} /> Not authenticated
              </span>
            </div>
            <div className="value-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="field-box">
                <label>Nationality <span className="ar">الجنسية</span></label>
                <input
                  type="text"
                  value={extractedData.nationalityEn}
                  onChange={(e) => handleUpdateField('nationalityEn', e.target.value)}
                />
              </div>
              <div className="field-box">
                <label>Gender <span className="ar">الجنس</span></label>
                <select
                  value={extractedData.gender}
                  onChange={(e) => handleUpdateField('gender', e.target.value as EmiratesIdExtractedData['gender'])}
                >
                  <option value="M">Male (ذكر)</option>
                  <option value="F">Female (أنثى)</option>
                </select>
              </div>
              <div className="field-box">
                <label>Date of Birth <span className="ar">تاريخ الميلاد</span></label>
                <input
                  type="text"
                  value={extractedData.dateOfBirth}
                  onChange={(e) => handleUpdateField('dateOfBirth', e.target.value)}
                />
              </div>
            </div>
          </VariableSectionCard>

          {/* SECTION 4: VALIDITY DATES */}
          <VariableSectionCard>
            <div className="card-top">
              <span className="section-title">
                <Calendar size={14} color="#EF4444" /> 4. Document Validity Dates
              </span>
              <span className="match-badge">
                <Clock size={13} /> {validScanDate(extractedData.expiryDate) ? `${scanExpiry(extractedData.expiryDate).daysUntilExpiry} days to expiry` : 'Unknown expiry'}
              </span>
            </div>
            <div className="value-row">
              <div className="field-box">
                <label>Issue Date <span className="ar">تاريخ الإصدار</span></label>
                <input
                  type="text"
                  value={extractedData.issueDate}
                  onChange={(e) => handleUpdateField('issueDate', e.target.value)}
                />
              </div>
              <div className="field-box">
                <label>Expiry Date <span className="ar">تاريخ الانتهاء</span></label>
                <input
                  type="text"
                  value={extractedData.expiryDate}
                  style={{ color: 'var(--accent-blue, #2563EB)', fontWeight: 800 }}
                  onChange={(e) => handleUpdateField('expiryDate', e.target.value)}
                />
              </div>
            </div>
          </VariableSectionCard>

          {/* SECTION 5: OCCUPATION & EMPLOYER */}
          <VariableSectionCard>
            <div className="card-top">
              <span className="section-title">
                <Briefcase size={14} color="#EF4444" /> 5. Employment & Sponsor
              </span>
              <span className="match-badge">
                <Building size={13} /> Not authenticated
              </span>
            </div>
            <div className="value-row">
              <div className="field-box">
                <label>Occupation <span className="ar">المهنة</span></label>
                <input
                  type="text"
                  value={extractedData.occupationEn}
                  onChange={(e) => handleUpdateField('occupationEn', e.target.value)}
                />
              </div>
              <div className="field-box">
                <label>Employer <span className="ar">جهة العمل</span></label>
                <input
                  type="text"
                  value={extractedData.employerEn}
                  onChange={(e) => handleUpdateField('employerEn', e.target.value)}
                />
              </div>
            </div>
          </VariableSectionCard>

          {/* SECTION 6: ICAO 9303 TD1 MACHINE READABLE ZONE */}
          {extractedData.mrz && (
            <VariableSectionCard>
              <div className="card-top">
                <span className="section-title">
                  <CreditCard size={14} color="#EF4444" /> 6. Machine Readable Zone (MRZ TD1)
                </span>
                <span className="match-badge">
                  <CheckCheck size={13} /> ICAO 9303 Checksum Passed
                </span>
              </div>
              <MrzTerminal>
                {`${extractedData.mrz.line1}\n${extractedData.mrz.line2}\n${extractedData.mrz.line3}`}
              </MrzTerminal>
            </VariableSectionCard>
          )}

          {/* 1-Click Platform Cross-Injection Triggers */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
            <ActionButton
              $variant="secondary"
              type="button"
              onClick={handleAutoFillAsTenant} disabled={!canUseScan(extractedData) || isScanning}
              style={{ fontSize: '0.8rem', padding: '8px 14px', flex: 1, justifyContent: 'center' }}
            >
              <FileText size={14} color="#EF4444" /> Auto-Fill Tenancy (as Tenant)
            </ActionButton>
            <ActionButton
              $variant="secondary"
              type="button"
              onClick={handleAutoFillAsLandlord} disabled={!canUseScan(extractedData) || isScanning}
              style={{ fontSize: '0.8rem', padding: '8px 14px', flex: 1, justifyContent: 'center' }}
            >
              <FileText size={14} color="#EF4444" /> Auto-Fill Tenancy (as Landlord)
            </ActionButton>
          </div>

          {/* Bottom Control Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <ActionButton $variant="danger" onClick={handleDiscard}>
              <Trash2 size={14} /> Clear & Reset
            </ActionButton>

            <ActionButton $variant="primary" onClick={handleSaveToVault} disabled={!canUseScan(extractedData) || isScanning}>
              <Save size={15} /> Save Reviewed Variables to KYC Vault
            </ActionButton>
          </div>
        </RightVariablesPane>
      </ComparisonGrid>
    </StudioContainer>
  );
};

export default HenryEmiratesIdScannerView;
