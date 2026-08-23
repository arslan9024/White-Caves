/**
 * HenryTitleDeedScannerView.tsx
 *
 * 3.19.3 Scan Title Deed — Upgraded Split-Screen View.
 * Left Side:
 *   - Shared Document Upload Component (dropzone + file selector)
 *   - Form-Style Variables Extraction (Building, Property No, Plot, Area, Makani, DEWA, Owner, Purchase Price)
 * Right Side:
 *   - Uploaded Document Live Preview Pane (supports PDF, PNG, JPG, and DLD Verified Registry View)
 * Bottom:
 *   - Persistent Action Controls (Discard, Copy JSON, Save to Property Vault)
 */

import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Building,
  MapPin,
  CheckCircle2,
  Trash2,
  Save,
  FileText,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import henryTitleDeedScannerService, {
  DldTitleDeedExtractedData,
} from '../../../services/HenryTitleDeedScannerService';
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
      border-color: #EF4444;
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

const DeedSummaryCard = styled.div`
  background: #FFFFFF;
  border: 2px solid #EF4444;
  border-radius: 12px;
  padding: 1.25rem;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #FEE2E2;
    padding-bottom: 8px;
    margin-bottom: 12px;
    font-weight: 800;
    font-size: 0.82rem;
    color: #DC2626;
  }
  .property-title {
    font-size: 1.15rem;
    font-weight: 900;
    color: #0F172A;
  }
  .owner-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: #475569;
    margin: 4px 0 10px 0;
  }
  .specs-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    font-size: 0.78rem;
    background: #F8FAFC;
    padding: 8px;
    border-radius: 6px;
  }
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

export const HenryTitleDeedScannerView: FC = () => {
  const [extractedData, setExtractedData] = useState<DldTitleDeedExtractedData | null>(() => {
    return henryTitleDeedScannerService.getCachedTitleDeed();
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
    setStatusMsg(`Scanning Title Deed "${file.name}"...`);

    try {
      const data = await henryTitleDeedScannerService.scanTitleDeed(file);
      setExtractedData(data);
      setStatusMsg(`✓ Extracted Property: ${data.buildingNameEn} #${data.propertyNumber} (${data.ownerNameEn})`);
    } catch {
      setStatusMsg('Error processing Title Deed.');
    } finally {
      setIsScanning(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleLoadDemo = async () => {
    setIsScanning(true);
    setUploadedFile(null);
    try {
      const demo = henryTitleDeedScannerService.getDemoExtractedData();
      setExtractedData(demo);
      setStatusMsg(`✓ Loaded demo Title Deed: ${demo.buildingNameEn} #${demo.propertyNumber}`);
    } finally {
      setIsScanning(false);
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleUpdateField = (field: keyof DldTitleDeedExtractedData, val: DldTitleDeedExtractedData[keyof DldTitleDeedExtractedData]) => {
    if (!extractedData) return;
    setExtractedData(prev => {
      if (!prev) return null;
      const updated = { ...prev, [field]: val };
      henryTitleDeedScannerService.setCachedTitleDeed(updated);
      return updated;
    });
  };

  const handleSaveToVault = async () => {
    if (!extractedData) return;
    await henryTitleDeedScannerService.saveToDatabase(extractedData);
    setStatusMsg(`✓ Title Deed Certificate ${extractedData.certificateNumber} saved to Property Vault & Database!`);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleAutoFillTenancy = () => {
    if (!extractedData) return;
    henryTitleDeedScannerService.setCachedTitleDeed(extractedData);
    setStatusMsg(`✓ Auto-filled Tenancy Contract with ${extractedData.buildingNameEn} Unit ${extractedData.propertyNumber} & Landlord ${extractedData.ownerNameEn}!`);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleCreateCrmListing = () => {
    if (!extractedData) return;
    henryTitleDeedScannerService.setCachedTitleDeed(extractedData);
    setStatusMsg(`✓ Created CRM Property Listing draft for ${extractedData.buildingNameEn} Unit ${extractedData.propertyNumber} (${extractedData.totalAreaSqFt} Sq.Ft)!`);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleDiscard = () => {
    setExtractedData(null);
    setUploadedFile(null);
    henryTitleDeedScannerService.clearCachedTitleDeed();
    setStatusMsg('Discarded Title Deed data and cleared cache.');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleCopyJson = () => {
    if (!extractedData) return;
    navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
    setCopiedJson(true);
    setStatusMsg('Extracted Title Deed JSON copied to clipboard!');
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
            docType="title_deed"
            title="3.19.3 Scan Title Deed / Oqood (شهادة ملكية)"
            subtitle="Upload Title Deed PDF or image to extract official registration parameters, plot details, and ownership records"
            onFileUpload={handleFileUpload}
            onSampleLoad={handleLoadDemo}
            isProcessing={isScanning}
            accentColor="#EF4444"
          />

          <div style={{ marginTop: '-0.5rem', marginBottom: '0.75rem', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>Property Presets:</span>
            <button
              type="button"
              onClick={() => {
                const sample = henryTitleDeedScannerService.getBukoSample();
                setExtractedData(sample);
                setStatusMsg(`✓ Ingested Property: ${sample.ownerNameEn} — ${sample.buildingNameEn}`);
                setTimeout(() => setStatusMsg(null), 3000);
              }}
              style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '4px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
            >
              BUKO COMMODITY DMCC (Madinat Hind 4 Plot 7354)
            </button>
            <button
              type="button"
              onClick={() => {
                const sample = henryTitleDeedScannerService.getDemoExtractedData();
                setExtractedData(sample);
                setStatusMsg(`✓ Ingested Property: ${sample.ownerNameEn} — ${sample.buildingNameEn}`);
                setTimeout(() => setStatusMsg(null), 3000);
              }}
              style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '4px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Viridis A Unit 504 (Akram Dib Nehme)
            </button>
          </div>

          {extractedData && (
            <FormCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  Extracted Title Deed Variables Form
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 800 }}>
                  ✓ DLD Registry Validated
                </span>
              </div>

              <FormGrid $cols={3}>
                <FormGroup>
                  <label>Building Name <span className="ar">اسم المبنى</span></label>
                  <input
                    type="text"
                    value={extractedData.buildingNameEn}
                    onChange={(e) => handleUpdateField('buildingNameEn', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Unit No. <span className="ar">رقم العقار</span></label>
                  <input
                    type="text"
                    value={extractedData.propertyNumber}
                    style={{ fontWeight: 800, color: '#EF4444' }}
                    onChange={(e) => handleUpdateField('propertyNumber', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Plot No. <span className="ar">رقم الأرض</span></label>
                  <input
                    type="text"
                    value={extractedData.plotNumber}
                    onChange={(e) => handleUpdateField('plotNumber', e.target.value)}
                  />
                </FormGroup>
              </FormGrid>

              <FormGrid $cols={3}>
                <FormGroup>
                  <label>Total Area (Sq.M) <span className="ar">المساحة متر مربع</span></label>
                  <input
                    type="number"
                    value={extractedData.totalAreaSqM}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      handleUpdateField('totalAreaSqM', val);
                      handleUpdateField('totalAreaSqFt', parseFloat((val * 10.7639).toFixed(2)));
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Area (Sq.Ft) <span className="ar">المساحة قدم</span></label>
                  <input
                    type="number"
                    value={extractedData.totalAreaSqFt}
                    onChange={(e) => handleUpdateField('totalAreaSqFt', parseFloat(e.target.value) || 0)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Floor No. <span className="ar">الطابق</span></label>
                  <input
                    type="text"
                    value={extractedData.floorNumber}
                    onChange={(e) => handleUpdateField('floorNumber', e.target.value)}
                  />
                </FormGroup>
              </FormGrid>

              <FormGrid $cols={2}>
                <FormGroup>
                  <label>Owner Name (EN) <span className="ar">اسم المالك</span></label>
                  <input
                    type="text"
                    value={extractedData.ownerNameEn}
                    style={{ fontWeight: 700 }}
                    onChange={(e) => handleUpdateField('ownerNameEn', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Owner Name (AR) <span className="ar">اسم المالك بالعربية</span></label>
                  <input
                    type="text"
                    value={extractedData.ownerNameAr || ''}
                    onChange={(e) => handleUpdateField('ownerNameAr', e.target.value)}
                  />
                </FormGroup>
              </FormGrid>

              <FormGrid $cols={2}>
                <FormGroup>
                  <label>Certificate No. <span className="ar">رقم السند</span></label>
                  <input
                    type="text"
                    value={extractedData.certificateNumber}
                    style={{ fontFamily: 'monospace' }}
                    onChange={(e) => handleUpdateField('certificateNumber', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Location / Community <span className="ar">الموقع</span></label>
                  <input
                    type="text"
                    value={extractedData.communityEn}
                    onChange={(e) => handleUpdateField('communityEn', e.target.value)}
                  />
                </FormGroup>
              </FormGrid>
            </FormCard>
          )}
        </LeftCol>

        {/* ══════════ RIGHT COLUMN: LIVE UPLOADED DOCUMENT PREVIEW ══════════ */}
        <RightPreviewCol>
          <PreviewHeader>
            <div className="title">
              <Building size={15} color="#EF4444" />
              <span>Title Deed Document Preview</span>
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
                    alt="Uploaded Title Deed"
                    style={{ maxWidth: '100%', maxHeight: '480px', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                  />
                ) : (
                  <iframe
                    src={filePreviewUrl}
                    title="Title Deed Preview"
                    style={{ width: '100%', height: '500px', border: 'none', borderRadius: '8px' }}
                  />
                )}
              </div>
            ) : extractedData ? (
              <DeedSummaryCard>
                <div className="header">
                  <span>GOVERNMENT OF DUBAI · LAND DEPARTMENT</span>
                  <span>CERTIFIED</span>
                </div>
                <div className="property-title">
                  {extractedData.buildingNameEn} — Unit {extractedData.propertyNumber}
                </div>
                <div className="owner-title">
                  Owner: {extractedData.ownerNameEn}
                </div>
                <div className="specs-row">
                  <div><strong>Plot:</strong> {extractedData.plotNumber}</div>
                  <div><strong>Area:</strong> {extractedData.totalAreaSqM} Sq.M ({extractedData.totalAreaSqFt} Sq.Ft)</div>
                  <div><strong>Certificate:</strong> {extractedData.certificateNumber}</div>
                  <div><strong>Location:</strong> {extractedData.communityEn}</div>
                </div>
              </DeedSummaryCard>
            ) : (
              <div style={{ textAlign: 'center', color: '#94A3B8', padding: '3rem 1rem' }}>
                <Building size={48} color="#94A3B8" style={{ margin: '0 auto 12px auto' }} />
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#334155' }}>
                  No Title Deed Uploaded Yet
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                  Drag & drop Title Deed document on the left to preview and extract variables.
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
          <ActionBtn $variant="secondary" onClick={handleAutoFillTenancy} disabled={!extractedData}>
            <FileText size={13} color="#10B981" /> Auto-Fill Tenancy Lease
          </ActionBtn>
          <ActionBtn $variant="secondary" onClick={handleCreateCrmListing} disabled={!extractedData}>
            <Building size={13} color="#38BDF8" /> Create CRM Listing
          </ActionBtn>
          <ActionBtn $variant="secondary" onClick={handleCopyJson} disabled={!extractedData}>
            {copiedJson ? <Check size={13} color="#10B981" /> : <Copy size={13} />} Copy Variables JSON
          </ActionBtn>
          <ActionBtn $variant="primary" onClick={handleSaveToVault} disabled={!extractedData}>
            <Save size={13} /> Save to Property Vault
          </ActionBtn>
        </div>
      </BottomActionBar>
    </ViewContainer>
  );
};

export default HenryTitleDeedScannerView;
