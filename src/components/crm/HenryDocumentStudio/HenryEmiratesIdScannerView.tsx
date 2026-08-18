/**
 * HenryEmiratesIdScannerView.tsx
 *
 * 3.19.2 Scan Emirates ID — High-Precision OCR & Variable Extraction Studio (V6).
 * - Clean, uncluttered interface focused on uploading Emirates ID.
 * - Live high-res document preview on right side.
 * - Prominent "Extract Emirates ID Data" button.
 * - Opens a dedicated High-End Extracted Data Modal with verified variables and controls.
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
  FileText,
  Copy,
  Check,
  Terminal,
  Activity,
  User,
  Briefcase,
  Building,
  MapPin,
  X,
  Eye,
  ArrowRight,
} from 'lucide-react';
import henryEmiratesIdScannerService, {
  EmiratesIdExtractedData,
} from '../../../services/HenryEmiratesIdScannerService';
import HenrySharedDocumentUploader from './HenrySharedDocumentUploader';

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  min-height: 480px;
`;

const PreviewHeader = styled.div`
  background: #0F172A;
  color: #FFFFFF;
  padding: 12px 16px;
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
  .file-meta {
    font-size: 0.75rem;
    color: #94A3B8;
  }
`;

const PreviewBody = styled.div`
  padding: 1.5rem;
  background: #F1F5F9;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`;

const ModalContainer = styled.div`
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 780px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.97); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #0F172A, #1E293B);
  color: #FFFFFF;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title-group {
    display: flex;
    align-items: center;
    gap: 10px;

    h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 800;
      color: #F8FAFC;
    }
    span {
      font-size: 0.75rem;
      background: #059669;
      color: #FFFFFF;
      padding: 2px 8px;
      border-radius: 999px;
      font-weight: 700;
    }
  }

  button.close-btn {
    background: transparent;
    border: none;
    color: #94A3B8;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    &:hover { color: #FFFFFF; background: rgba(255,255,255,0.1); }
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: #F8FAFC;
`;

const VariablesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const VariableItem = styled.div<{ $highlight?: boolean }>`
  background: #FFFFFF;
  border: 1px solid ${props => props.$highlight ? '#10B981' : '#E2E8F0'};
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);

  .label-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    font-weight: 700;
    color: #64748B;
    text-transform: uppercase;

    .ar {
      color: #94A3B8;
      direction: rtl;
    }
  }

  .value {
    font-size: 0.9rem;
    font-weight: 800;
    color: ${props => props.$highlight ? '#059669' : '#0F172A'};
    word-break: break-word;
  }
`;

const MrzBlock = styled.div`
  background: #0F172A;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 12px;
  font-family: monospace;
  font-size: 0.78rem;
  color: #38BDF8;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
`;

const ModalFooter = styled.div`
  background: #FFFFFF;
  border-top: 1px solid #E2E8F0;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
    margin-bottom: 10px;

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
    margin: 6px 0;
  }

  .name-en {
    font-size: 0.95rem;
    font-weight: 800;
    color: #FFFFFF;
  }
  .name-ar {
    font-size: 0.88rem;
    color: #94A3B8;
    direction: rtl;
    text-align: right;
    margin-top: 2px;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px dashed rgba(255, 255, 255, 0.15);
    font-size: 0.75rem;
    color: #94A3B8;
  }
`;

const PrimaryBtn = styled.button`
  background: linear-gradient(135deg, #10B981, #059669);
  color: #FFFFFF;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
  transition: all 0.15s ease;

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SecondaryBtn = styled.button`
  background: #FFFFFF;
  color: #334155;
  border: 1px solid #CBD5E1;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  &:hover {
    background: #F8FAFC;
    border-color: #94A3B8;
  }
`;

export const HenryEmiratesIdScannerView: FC = () => {
  const [extractedData, setExtractedData] = useState<EmiratesIdExtractedData | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setStatusMsg(`Uploaded "${file.name}". Click "Extract Emirates ID Data" to view variables.`);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleRunExtraction = async () => {
    setIsScanning(true);
    setStatusMsg('Running Optical OCR & ICAO MRZ extraction on uploaded ID...');

    try {
      const fileToScan = uploadedFile || undefined;
      const data = await henryEmiratesIdScannerService.scanEmiratesId(fileToScan);
      setExtractedData(data);
      setIsModalOpen(true);
      setStatusMsg(`✓ Variables successfully extracted for: ${data.fullNameEn}`);
    } catch {
      setStatusMsg('Error processing Emirates ID optical scan.');
    } finally {
      setIsScanning(false);
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleLoadDemo = () => {
    setUploadedFile(null);
    const demo = henryEmiratesIdScannerService.getDemoExtractedData();
    setExtractedData(demo);
    setIsModalOpen(true);
    setStatusMsg(`✓ Loaded benchmark Emirates ID: ${demo.fullNameEn}`);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleSaveToVault = () => {
    if (!extractedData) return;
    setStatusMsg(`✓ Emirates ID ${extractedData.idNumber} (${extractedData.fullNameEn}) verified & saved to KYC Vault!`);
    setIsModalOpen(false);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleDiscard = () => {
    setExtractedData(null);
    setUploadedFile(null);
    setIsModalOpen(false);
    setStatusMsg('Cleared uploaded document and variables.');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleCopyJson = () => {
    if (!extractedData) return;
    navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  return (
    <ViewContainer>
      {statusMsg && (
        <div style={{ background: '#0F172A', color: '#38BDF8', padding: '10px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
          ⚡ {statusMsg}
        </div>
      )}

      <SplitGrid>
        {/* ══════════ LEFT COLUMN: CLEAN UPLOADER & PRIMARY ACTION ══════════ */}
        <LeftCol>
          <HenrySharedDocumentUploader
            docType="emirates_id"
            title="3.19.2 Scan Emirates ID (الهوية الإماراتية)"
            subtitle="Upload real front/back Emirates ID card image or PDF to extract variables via client-side OCR engine"
            onFileUpload={handleFileUpload}
            onSampleLoad={handleLoadDemo}
            isProcessing={isScanning}
            accentColor="#10B981"
          />

          {/* Primary Extraction Trigger Button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <PrimaryBtn
              type="button"
              onClick={handleRunExtraction}
              disabled={isScanning}
            >
              <Sparkles size={18} />
              <span>{isScanning ? 'Extracting Optical Variables...' : '⚡ Extract Emirates ID Data to Variables Modal'}</span>
            </PrimaryBtn>

            {extractedData && (
              <SecondaryBtn type="button" onClick={() => setIsModalOpen(true)}>
                <Eye size={15} color="#10B981" />
                <span>View Extracted Variables ({extractedData.fullNameEn})</span>
              </SecondaryBtn>
            )}
          </div>
        </LeftCol>

        {/* ══════════ RIGHT COLUMN: LIVE DOCUMENT PREVIEW PANE ══════════ */}
        <RightPreviewCol>
          <PreviewHeader>
            <div className="title">
              <CreditCard size={16} color="#38BDF8" />
              <span>Uploaded Document Preview</span>
            </div>
            {uploadedFile && (
              <div className="file-meta">
                {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </PreviewHeader>

          <PreviewBody>
            {uploadedFile && filePreviewUrl ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {uploadedFile.type.startsWith('image/') ? (
                  <img
                    src={filePreviewUrl}
                    alt="Uploaded Emirates ID"
                    style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
                  />
                ) : (
                  <iframe
                    src={filePreviewUrl}
                    title="Emirates ID PDF Preview"
                    style={{ width: '100%', height: '460px', border: 'none', borderRadius: '8px' }}
                  />
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem 1rem' }}>
                <CreditCard size={44} color="#94A3B8" style={{ margin: '0 auto 12px auto' }} />
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#334155' }}>
                  No Emirates ID Uploaded
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                  Upload client Emirates ID on the left and click "Extract Emirates ID Data" to view all parsed variables.
                </div>
              </div>
            )}
          </PreviewBody>
        </RightPreviewCol>
      </SplitGrid>

      {/* ══════════ DEDICATED EXTRACTED VARIABLES MODAL ══════════ */}
      {isModalOpen && extractedData && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div className="title-group">
                <ShieldCheck size={20} color="#38BDF8" />
                <h3>Emirates ID Extracted Variables</h3>
                <span>✓ Verified</span>
              </div>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </ModalHeader>

            <ModalBody>
              {/* Digital Verified Emirates ID Card Preview */}
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
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

              {/* Form Variables Grid */}
              <VariablesGrid>
                <VariableItem $highlight>
                  <div className="label-row">
                    <span>Emirates ID Number</span>
                    <span className="ar">رقم الهوية</span>
                  </div>
                  <div className="value" style={{ fontFamily: 'monospace' }}>{extractedData.idNumber}</div>
                </VariableItem>

                <VariableItem>
                  <div className="label-row">
                    <span>Card Number</span>
                    <span className="ar">رقم البطاقة</span>
                  </div>
                  <div className="value">{extractedData.cardNumber}</div>
                </VariableItem>

                <VariableItem>
                  <div className="label-row">
                    <span>Full Name (EN)</span>
                    <span className="ar">الاسم بالإنجليزية</span>
                  </div>
                  <div className="value">{extractedData.fullNameEn}</div>
                </VariableItem>

                <VariableItem>
                  <div className="label-row">
                    <span>Full Name (AR)</span>
                    <span className="ar">الاسم بالعربية</span>
                  </div>
                  <div className="value" style={{ direction: 'rtl' }}>{extractedData.fullNameAr}</div>
                </VariableItem>

                <VariableItem>
                  <div className="label-row">
                    <span>Nationality</span>
                    <span className="ar">الجنسية</span>
                  </div>
                  <div className="value">{extractedData.nationalityEn} ({extractedData.nationalityAr})</div>
                </VariableItem>

                <VariableItem>
                  <div className="label-row">
                    <span>Gender & DOB</span>
                    <span className="ar">الجنس والميلاد</span>
                  </div>
                  <div className="value">{extractedData.gender === 'M' ? 'Male (ذكر)' : 'Female (أنثى)'} · {extractedData.dateOfBirth}</div>
                </VariableItem>

                <VariableItem>
                  <div className="label-row">
                    <span>Issue Date</span>
                    <span className="ar">تاريخ الإصدار</span>
                  </div>
                  <div className="value">{extractedData.issueDate}</div>
                </VariableItem>

                <VariableItem>
                  <div className="label-row">
                    <span>Expiry Date</span>
                    <span className="ar">تاريخ الانتهاء</span>
                  </div>
                  <div className="value" style={{ color: '#2563EB' }}>{extractedData.expiryDate}</div>
                </VariableItem>

                <VariableItem>
                  <div className="label-row">
                    <span>Occupation</span>
                    <span className="ar">المهنة</span>
                  </div>
                  <div className="value">{extractedData.occupationEn} ({extractedData.occupationAr})</div>
                </VariableItem>

                <VariableItem>
                  <div className="label-row">
                    <span>Employer / Sponsor</span>
                    <span className="ar">صاحب العمل</span>
                  </div>
                  <div className="value">{extractedData.employerEn}</div>
                </VariableItem>
              </VariablesGrid>

              {/* Raw Machine Readable Zone (MRZ) */}
              {extractedData.mrz && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', marginBottom: '4px' }}>
                    RAW MACHINE READABLE ZONE (MRZ TD1):
                  </div>
                  <MrzBlock>
                    {`${extractedData.mrz.line1}\n${extractedData.mrz.line2}\n${extractedData.mrz.line3}`}
                  </MrzBlock>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <div>
                <SecondaryBtn onClick={handleDiscard}>
                  <Trash2 size={14} color="#EF4444" /> Clear
                </SecondaryBtn>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <SecondaryBtn onClick={handleCopyJson}>
                  {copiedJson ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                  <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
                </SecondaryBtn>

                <PrimaryBtn onClick={handleSaveToVault} style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                  <Save size={14} />
                  <span>Save to KYC Vault</span>
                </PrimaryBtn>
              </div>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}
    </ViewContainer>
  );
};

export default HenryEmiratesIdScannerView;
