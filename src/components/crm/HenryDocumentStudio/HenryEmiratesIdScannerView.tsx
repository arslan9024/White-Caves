/**
 * HenryEmiratesIdScannerView.tsx
 *
 * 3.19.2 Scan Emirates ID — Upgraded Split-Screen View.
 * Left Side:
 *   - Shared Document Upload Component (dropzone + file selector)
 *   - Form-Style Variables Extraction (Full Name EN/AR, ID Number, Card No, Nationality, DOB, Expiry, Employer, MRZ)
 * Right Side:
 *   - Uploaded Document Live Preview Pane (supports PDF, PNG, JPG, and Digital Card Preview)
 * Bottom:
 *   - Persistent Action Controls (Discard, Reset, Copy JSON, Save to KYC Vault)
 */

import React, { FC, useState, useEffect } from 'react';
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
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import henryEmiratesIdScannerService, {
  EmiratesIdExtractedData,
} from '../../../services/HenryEmiratesIdScannerService';
import HenrySharedDocumentUploader from './HenrySharedDocumentUploader';

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
      border-color: #10B981;
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
  background: #E2E8F0;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 420px;
`;

const EmiratesIdDigitalCard = styled.div`
  background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
  border: 2px solid #38BDF8;
  border-radius: 12px;
  padding: 1.25rem;
  color: #FFFFFF;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.3);
  width: 100%;
  max-width: 440px;
  box-sizing: border-box;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    padding-bottom: 8px;
    margin-bottom: 12px;

    .uae-badge {
      font-size: 0.72rem;
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
  padding: 8px 10px;
  font-family: monospace;
  font-size: 0.78rem;
  color: #38BDF8;
  line-height: 1.35;
  white-space: pre-wrap;
  word-break: break-all;
  width: 100%;
  box-sizing: border-box;
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
        background: linear-gradient(135deg, #10B981, #059669);
        color: #FFFFFF;
        box-shadow: 0 2px 6px rgba(16, 185, 129, 0.25);
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

export const HenryEmiratesIdScannerView: FC = () => {
  const [extractedData, setExtractedData] = useState<EmiratesIdExtractedData | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // Manage Object URL lifecycle
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
    setIsScanning(true);
    setUploadedFile(file);
    setStatusMsg(`Scanning and extracting variables from "${file.name}"...`);

    try {
      const data = await henryEmiratesIdScannerService.scanEmiratesId(file);
      setExtractedData(data);
      setStatusMsg(`✓ Successfully extracted variables for: ${data.fullNameEn} (${data.idNumber})`);
    } catch {
      setStatusMsg('Error processing Emirates ID file.');
    } finally {
      setIsScanning(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleLoadDemo = async () => {
    setIsScanning(true);
    setUploadedFile(null);
    try {
      const demo = henryEmiratesIdScannerService.getDemoExtractedData();
      setExtractedData(demo);
      setStatusMsg(`✓ Loaded benchmark Emirates ID: ${demo.fullNameEn} (${demo.nationalityEn})`);
    } finally {
      setIsScanning(false);
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleLoadIndianDemo = async () => {
    setIsScanning(true);
    setUploadedFile(null);
    try {
      const demo = henryEmiratesIdScannerService.getIndianClientDemoData();
      setExtractedData(demo);
      setStatusMsg(`✓ Loaded Indian client benchmark: ${demo.fullNameEn} (${demo.nationalityEn})`);
    } finally {
      setIsScanning(false);
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleUpdateField = (field: keyof EmiratesIdExtractedData, val: any) => {
    if (!extractedData) return;
    setExtractedData(prev => (prev ? { ...prev, [field]: val } : null));
  };

  const handleSaveToVault = () => {
    if (!extractedData) return;
    setStatusMsg(`✓ Emirates ID ${extractedData.idNumber} saved to White Caves KYC Vault!`);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleDiscard = () => {
    setExtractedData(null);
    setUploadedFile(null);
    setStatusMsg('Discarded extracted data and cleared upload.');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleCopyJson = () => {
    if (!extractedData) return;
    navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
    setCopiedJson(true);
    setStatusMsg('Extracted variables JSON copied to clipboard!');
    setTimeout(() => {
      setCopiedJson(false);
      setStatusMsg(null);
    }, 3000);
  };

  return (
    <ViewContainer>
      {/* Status Feedback Banner */}
      {statusMsg && (
        <div style={{ background: '#0F172A', color: '#38BDF8', padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700 }}>
          ⚡ {statusMsg}
        </div>
      )}

      <SplitGrid>
        {/* ══════════ LEFT COLUMN: UPLOADER & FORM-STYLE EXTRACTION ══════════ */}
        <LeftCol>
          {/* Uploader Dropzone */}
          <HenrySharedDocumentUploader
            docType="emirates_id"
            title="3.19.2 Scan Emirates ID (الهوية الإماراتية)"
            subtitle="Upload front/back ID document or PDF to extract variables and parse 3-line TD1 Machine Readable Zone"
            onFileUpload={handleFileUpload}
            onSampleLoad={handleLoadDemo}
            isProcessing={isScanning}
            accentColor="#10B981"
          />

          {/* Quick Profile Switchers */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', padding: '2px 0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B' }}>Quick Benchmark Samples:</span>
            <button
              type="button"
              onClick={handleLoadIndianDemo}
              style={{
                background: '#FEF3C7',
                color: '#92400E',
                border: '1px solid #FCD34D',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              🇮🇳 Sanit Singh Nagpal (IND)
            </button>
            <button
              type="button"
              onClick={handleLoadDemo}
              style={{
                background: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              🇵🇰 Arslan Malik (PAK)
            </button>
          </div>

          {/* Form Style Variables Extraction */}
          {extractedData && (
            <FormCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  Extracted Variables Form
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 800 }}>
                  ✓ {Math.round(extractedData.confidenceScore * 100)}% Confidence Match
                </span>
              </div>

              <FormGrid $cols={2}>
                <FormGroup>
                  <label>Full Legal Name (EN) <span className="ar">الاسم بالإنجليزية</span></label>
                  <input
                    type="text"
                    value={extractedData.fullNameEn}
                    onChange={(e) => handleUpdateField('fullNameEn', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Full Legal Name (AR) <span className="ar">الاسم بالعربية</span></label>
                  <input
                    type="text"
                    value={extractedData.fullNameAr || ''}
                    onChange={(e) => handleUpdateField('fullNameAr', e.target.value)}
                  />
                </FormGroup>
              </FormGrid>

              <FormGrid $cols={2}>
                <FormGroup>
                  <label>Emirates ID Number <span className="ar">رقم الهوية</span></label>
                  <input
                    type="text"
                    value={extractedData.idNumber}
                    style={{ fontFamily: 'monospace', fontWeight: 700, color: '#059669' }}
                    onChange={(e) => handleUpdateField('idNumber', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Card Number <span className="ar">رقم البطاقة</span></label>
                  <input
                    type="text"
                    value={extractedData.cardNumber}
                    onChange={(e) => handleUpdateField('cardNumber', e.target.value)}
                  />
                </FormGroup>
              </FormGrid>

              <FormGrid $cols={3}>
                <FormGroup>
                  <label>Nationality <span className="ar">الجنسية</span></label>
                  <input
                    type="text"
                    value={extractedData.nationalityEn}
                    onChange={(e) => handleUpdateField('nationalityEn', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Gender <span className="ar">الجنس</span></label>
                  <select
                    value={extractedData.gender}
                    onChange={(e) => handleUpdateField('gender', e.target.value as any)}
                  >
                    <option value="M">Male (ذكر)</option>
                    <option value="F">Female (أنثى)</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <label>Date of Birth <span className="ar">تاريخ الميلاد</span></label>
                  <input
                    type="text"
                    value={extractedData.dateOfBirth}
                    onChange={(e) => handleUpdateField('dateOfBirth', e.target.value)}
                  />
                </FormGroup>
              </FormGrid>

              <FormGrid $cols={2}>
                <FormGroup>
                  <label>Issue Date <span className="ar">تاريخ الإصدار</span></label>
                  <input
                    type="text"
                    value={extractedData.issueDate}
                    onChange={(e) => handleUpdateField('issueDate', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Expiry Date <span className="ar">تاريخ الانتهاء</span></label>
                  <input
                    type="text"
                    value={extractedData.expiryDate}
                    style={{ fontWeight: 700, color: '#2563EB' }}
                    onChange={(e) => handleUpdateField('expiryDate', e.target.value)}
                  />
                </FormGroup>
              </FormGrid>

              <FormGrid $cols={2}>
                <FormGroup>
                  <label>Occupation <span className="ar">المهنة</span></label>
                  <input
                    type="text"
                    value={extractedData.occupationEn}
                    onChange={(e) => handleUpdateField('occupationEn', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Employer <span className="ar">جهة العمل</span></label>
                  <input
                    type="text"
                    value={extractedData.employerEn}
                    onChange={(e) => handleUpdateField('employerEn', e.target.value)}
                  />
                </FormGroup>
              </FormGrid>

              {extractedData.mrz && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', marginBottom: '4px' }}>
                    RAW MACHINE READABLE ZONE (MRZ TD1):
                  </div>
                  <MrzBox>
                    {`${extractedData.mrz.line1}\n${extractedData.mrz.line2}\n${extractedData.mrz.line3}`}
                  </MrzBox>
                </div>
              )}
            </FormCard>
          )}
        </LeftCol>

        {/* ══════════ RIGHT COLUMN: UPLOADED DOCUMENT LIVE PREVIEW PANE ══════════ */}
        <RightPreviewCol>
          <PreviewHeader>
            <div className="title">
              <CreditCard size={15} color="#38BDF8" />
              <span>Document Preview Pane</span>
            </div>
            <div className="controls">
              {uploadedFile && (
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                </span>
              )}
            </div>
          </PreviewHeader>

          <PreviewBody>
            {uploadedFile && filePreviewUrl ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {uploadedFile.type.startsWith('image/') ? (
                  <img
                    src={filePreviewUrl}
                    alt="Uploaded Emirates ID"
                    style={{ maxWidth: '100%', maxHeight: '480px', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                  />
                ) : (
                  <iframe
                    src={filePreviewUrl}
                    title="Emirates ID Preview"
                    style={{ width: '100%', height: '500px', border: 'none', borderRadius: '8px' }}
                  />
                )}
              </div>
            ) : extractedData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center' }}>
                <EmiratesIdDigitalCard>
                  <div className="card-header">
                    <span className="uae-badge">UNITED ARAB EMIRATES · IDENTITY CARD</span>
                    <ShieldCheck size={16} color="#38BDF8" />
                  </div>

                  <div className="id-number">{extractedData.idNumber}</div>
                  <div className="name-en">{extractedData.fullNameEn}</div>
                  <div className="name-ar">{extractedData.fullNameAr || 'عميل وايت كيفز'}</div>

                  <div className="card-footer">
                    <div>
                      <strong>Nationality:</strong> {extractedData.nationalityEn} ({extractedData.nationalityCode})
                    </div>
                    <div>
                      <strong>Expiry:</strong> {extractedData.expiryDate}
                    </div>
                  </div>
                </EmiratesIdDigitalCard>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#94A3B8', padding: '3rem 1rem' }}>
                <CreditCard size={48} color="#94A3B8" style={{ margin: '0 auto 12px auto' }} />
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#334155' }}>
                  No Document Uploaded Yet
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                  Drag & drop client Emirates ID on the left to preview the document and extract variables.
                </div>
              </div>
            )}
          </PreviewBody>
        </RightPreviewCol>
      </SplitGrid>

      {/* ══════════ BOTTOM PERSISTENT ACTION CONTROLS ══════════ */}
      <BottomActionBar>
        <div>
          <ActionBtn $variant="danger" onClick={handleDiscard} disabled={!extractedData && !uploadedFile}>
            <Trash2 size={13} /> Discard & Clear
          </ActionBtn>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <ActionBtn $variant="secondary" onClick={handleCopyJson} disabled={!extractedData}>
            {copiedJson ? <Check size={13} color="#10B981" /> : <Copy size={13} />} Copy Variables JSON
          </ActionBtn>
          <ActionBtn $variant="primary" onClick={handleSaveToVault} disabled={!extractedData}>
            <Save size={13} /> Save to KYC Vault
          </ActionBtn>
        </div>
      </BottomActionBar>
    </ViewContainer>
  );
};

export default HenryEmiratesIdScannerView;
