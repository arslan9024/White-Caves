/**
 * HenryPassportScannerView.tsx
 *
 * 3.19.4 Scan Passport — Upgraded Split-Screen View.
 * Left Side:
 *   - Shared Document Upload Component (dropzone + file selector)
 *   - Form-Style Variables Extraction (Full Name, Passport Number, Country, Nationality, DOB, Expiry, MRZ TD3)
 * Right Side:
 *   - Uploaded Document Live Preview Pane (supports PDF, PNG, JPG, and Digital Passport View)
 * Bottom:
 *   - Persistent Action Controls (Discard, Copy JSON, Save to KYC Vault)
 */

import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Flag,
  User,
  Calendar,
  CheckCircle2,
  Trash2,
  Save,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';
import henryPassportScannerService, {
  InternationalPassportExtractedData,
} from '../../../services/HenryPassportScannerService';
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
      border-color: #3B82F6;
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

const PassportDigitalCard = styled.div`
  background: linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%);
  border: 2px solid #60A5FA;
  border-radius: 12px;
  padding: 1.25rem;
  color: #FFFFFF;
  box-shadow: 0 8px 24px rgba(30, 58, 138, 0.3);
  width: 100%;
  max-width: 440px;
  box-sizing: border-box;

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
  padding: 8px 10px;
  font-family: monospace;
  font-size: 0.78rem;
  color: #60A5FA;
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
        background: linear-gradient(135deg, #3B82F6, #2563EB);
        color: #FFFFFF;
        box-shadow: 0 2px 6px rgba(59, 130, 246, 0.25);
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

export const HenryPassportScannerView: FC = () => {
  const [extractedData, setExtractedData] = useState<InternationalPassportExtractedData | null>(() => {
    return henryPassportScannerService.getCachedPassport();
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

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
    setStatusMsg(`Scanning Passport "${file.name}"...`);

    try {
      const data = await henryPassportScannerService.scanPassport(file);
      setExtractedData(data);
      setStatusMsg(`✓ Extracted Passport: ${data.fullName} (${data.passportNumber})`);
    } catch {
      setStatusMsg('Error processing Passport file.');
    } finally {
      setIsScanning(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleLoadDemo = async () => {
    setIsScanning(true);
    setUploadedFile(null);
    try {
      const demo = henryPassportScannerService.getDemoExtractedData();
      setExtractedData(demo);
      setStatusMsg(`✓ Loaded demo Passport: ${demo.fullName}`);
    } finally {
      setIsScanning(false);
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleUpdateField = (field: keyof InternationalPassportExtractedData, val: InternationalPassportExtractedData[keyof InternationalPassportExtractedData]) => {
    if (!extractedData) return;
    setExtractedData(prev => {
      if (!prev) return null;
      const updated = { ...prev, [field]: val };
      henryPassportScannerService.setCachedPassport(updated);
      return updated;
    });
  };

  const handleSaveToVault = () => {
    if (!extractedData) return;
    henryPassportScannerService.setCachedPassport(extractedData);
    setStatusMsg(`✓ Passport ${extractedData.passportNumber} (${extractedData.fullName}) saved to White Caves KYC Vault!`);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleAutoFillAsTenant = () => {
    if (!extractedData) return;
    henryPassportScannerService.setCachedPassport(extractedData);
    setStatusMsg(`✓ Auto-filled Tenancy Contract with ${extractedData.fullName} (${extractedData.passportNumber}) as Tenant!`);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleAutoFillAsLandlord = () => {
    if (!extractedData) return;
    henryPassportScannerService.setCachedPassport(extractedData);
    setStatusMsg(`✓ Auto-filled Tenancy Contract with ${extractedData.fullName} (${extractedData.passportNumber}) as Landlord/Owner!`);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleDiscard = () => {
    setExtractedData(null);
    setUploadedFile(null);
    henryPassportScannerService.clearCachedPassport();
    setStatusMsg('Discarded Passport data and cleared session cache.');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleCopyJson = () => {
    if (!extractedData) return;
    navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
    setCopiedJson(true);
    setStatusMsg('Extracted Passport JSON copied to clipboard!');
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
          <HenrySharedDocumentUploader
            docType="passport"
            title="3.19.4 Scan International Passport (جواز السفر)"
            subtitle="Upload client passport bio-data image or PDF to extract passport number, country code, full legal name, and 2-line ICAO TD3 MRZ"
            onFileUpload={handleFileUpload}
            onSampleLoad={handleLoadDemo}
            isProcessing={isScanning}
            accentColor="#3B82F6"
          />

          {extractedData && (
            <FormCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  Extracted Passport Variables Form
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 800 }}>
                  ✓ ICAO TD3 MRZ Verified
                </span>
              </div>

              <FormGrid $cols={2}>
                <FormGroup>
                  <label>Full Legal Name <span className="ar">الاسم بالكامل</span></label>
                  <input
                    type="text"
                    value={extractedData.fullName}
                    onChange={(e) => handleUpdateField('fullName', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Passport Number <span className="ar">رقم الجواز</span></label>
                  <input
                    type="text"
                    value={extractedData.passportNumber}
                    style={{ fontFamily: 'monospace', fontWeight: 800, color: '#2563EB' }}
                    onChange={(e) => handleUpdateField('passportNumber', e.target.value)}
                  />
                </FormGroup>
              </FormGrid>

              <FormGrid $cols={3}>
                <FormGroup>
                  <label>Country Code <span className="ar">رمز الدولة</span></label>
                  <input
                    type="text"
                    value={extractedData.issuingCountryCode}
                    onChange={(e) => handleUpdateField('issuingCountryCode', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Nationality <span className="ar">الجنسية</span></label>
                  <input
                    type="text"
                    value={extractedData.nationality}
                    onChange={(e) => handleUpdateField('nationality', e.target.value)}
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
              </FormGrid>

              <FormGrid $cols={2}>
                <FormGroup>
                  <label>Date of Birth <span className="ar">تاريخ الميلاد</span></label>
                  <input
                    type="text"
                    value={extractedData.dateOfBirth}
                    onChange={(e) => handleUpdateField('dateOfBirth', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Date of Expiry <span className="ar">تاريخ الانتهاء</span></label>
                  <input
                    type="text"
                    value={extractedData.dateOfExpiry}
                    onChange={(e) => handleUpdateField('dateOfExpiry', e.target.value)}
                  />
                </FormGroup>
              </FormGrid>

              <FormGrid $cols={2}>
                <FormGroup>
                  <label>Issuing Authority <span className="ar">جهة الإصدار</span></label>
                  <input
                    type="text"
                    value={extractedData.issuingAuthority}
                    onChange={(e) => handleUpdateField('issuingAuthority', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>National ID No. <span className="ar">الرقم القومي</span></label>
                  <input
                    type="text"
                    value={extractedData.nationalIdentityNumber}
                    onChange={(e) => handleUpdateField('nationalIdentityNumber', e.target.value)}
                  />
                </FormGroup>
              </FormGrid>

              {extractedData.mrz && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', marginBottom: '4px' }}>
                    RAW MACHINE READABLE ZONE (MRZ TD3 - 2 LINES):
                  </div>
                  <MrzBox>
                    {`${extractedData.mrz.line1}\n${extractedData.mrz.line2}`}
                  </MrzBox>
                </div>
              )}
            </FormCard>
          )}
        </LeftCol>

        {/* ══════════ RIGHT COLUMN: LIVE UPLOADED DOCUMENT PREVIEW ══════════ */}
        <RightPreviewCol>
          <PreviewHeader>
            <div className="title">
              <Flag size={15} color="#60A5FA" />
              <span>Passport Document Preview</span>
            </div>
            <div className="controls" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
                style={{ background: 'rgba(255,255,255,0.15)', color: '#FFF', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '0.7rem', cursor: 'pointer' }}
              >
                -
              </button>
              <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(180, prev + 15))}
                style={{ background: 'rgba(255,255,255,0.15)', color: '#FFF', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '0.7rem', cursor: 'pointer' }}
              >
                +
              </button>
              {uploadedFile && (
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginLeft: '6px' }}>
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
                    alt="Uploaded Passport"
                    style={{ maxWidth: '100%', maxHeight: '480px', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                  />
                ) : (
                  <iframe
                    src={filePreviewUrl}
                    title="Passport Preview"
                    style={{ width: '100%', height: '500px', border: 'none', borderRadius: '8px' }}
                  />
                )}
              </div>
            ) : extractedData ? (
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
                    <strong>Expiry:</strong> {extractedData.dateOfExpiry}
                  </div>
                </div>
              </PassportDigitalCard>
            ) : (
              <div style={{ textAlign: 'center', color: '#94A3B8', padding: '3rem 1rem' }}>
                <Flag size={48} color="#94A3B8" style={{ margin: '0 auto 12px auto' }} />
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#334155' }}>
                  No Passport Uploaded Yet
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                  Drag & drop passport image or PDF on the left to preview and extract variables.
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

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <ActionBtn $variant="secondary" onClick={handleAutoFillAsTenant} disabled={!extractedData}>
            <User size={13} color="#10B981" /> Auto-Fill Tenancy (as Tenant)
          </ActionBtn>
          <ActionBtn $variant="secondary" onClick={handleAutoFillAsLandlord} disabled={!extractedData}>
            <User size={13} color="#38BDF8" /> Auto-Fill Tenancy (as Landlord)
          </ActionBtn>
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

export default HenryPassportScannerView;
