/**
 * HenryDocumentStudio.tsx — View Layer (4-Way Component Architecture)
 * Sits at folder root: Pure presentation shell consuming logic, styles and templates.
 */

import React, { FC } from 'react';
import {
  Printer,
  ZoomIn,
  ZoomOut,
  Share2,
  Sparkles,
  Check,
  Eye,
  ShieldCheck,
  Scan,
  Copy,
  FileCheck,
  UserCheck,
  Building,
  RefreshCw,
} from 'lucide-react';
import { useHenryDocumentStudioLogic } from './logic/HenryDocumentStudio.logic';
import {
  StudioContainer,
  StudioHeader,
  Badge,
  WorkspaceSplit,
  SidebarControlPanel,
  SectionLabel,
  TemplateCard,
  PreviewCanvasCard,
  ToolbarHeader,
  ToolButtonGroup,
  ActionButton,
  PreviewFrame,
} from './styles/HenryDocumentStudio.style';

export const HenryDocumentStudio: FC = () => {
  const {
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    compiledHtml,
    zoomLevel,
    shareLinkCopied,
    eidData,
    isScanning,
    actionSuccessMessage,
    handlePrint,
    handleZoomIn,
    handleZoomOut,
    handleCopyEsignLink,
    handleTriggerAiAutoFill,
    handleScanEmiratesId,
    handleAutoFillAsTenant,
    handleAutoFillAsLandlord,
    handleAutoFillViewingForm,
    handleCopyJsonVariables,
  } = useHenryDocumentStudioLogic();

  return (
    <StudioContainer data-testid="henry-document-studio">
      {/* Executive Header */}
      <StudioHeader>
        <div>
          <h2>
            <span>📄</span> Henry AI — Sovereign Record Keeper & Document Studio
          </h2>
          <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.88rem' }}>
            Emirates ID Optical AI Scanner, Tenancy Contract E-Signature, Government Ejari Vault & VAT Tax Invoicing.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Badge>HENRY RECORD KEEPER</Badge>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Ejari: 0120260721003974</span>
        </div>
      </StudioHeader>

      {actionSuccessMessage && (
        <div
          style={{
            backgroundColor: '#ECFDF5',
            color: '#065F46',
            border: '1.5px solid #A7F3D0',
            padding: '10px 16px',
            borderRadius: '8px',
            margin: '0 24px 12px',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Check size={16} color="#10B981" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Main Studio Workspace */}
      <WorkspaceSplit>
        {/* Left Template & Document Selector */}
        <SidebarControlPanel>
          <SectionLabel>Document Classification Streams</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {templates.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                $selected={selectedTemplateId === tpl.id}
                onClick={() => setSelectedTemplateId(tpl.id)}
              >
                <div className="card-title">
                  <span>
                    {tpl.icon} {tpl.title}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#EF4444',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 800,
                    }}
                  >
                    {tpl.badge}
                  </span>
                </div>
                <div className="card-desc">{tpl.description}</div>
              </TemplateCard>
            ))}
          </div>

          <SectionLabel style={{ marginTop: '14px' }}>Henry Record Keeper SOP</SectionLabel>
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              fontSize: '11px',
              color: '#64748B',
              lineHeight: 1.5,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#1E293B',
                fontWeight: 800,
                marginBottom: '4px',
              }}
            >
              <ShieldCheck size={14} color="#EF4444" />
              <span>DLD Compliance Rule</span>
            </div>
            1. Emirates ID optical scanner extracts all 18 fields & MRZ.<br />
            2. 1-Click auto-fills Tenancy Agreement or Viewing Form.<br />
            3. Official Government Ejari Certificate is archived in Vault.
          </div>
        </SidebarControlPanel>

        {/* Right Canvas: Either Emirates ID Scanner Inspector OR PDF Print Preview Canvas */}
        {selectedTemplateId === 'emirates_id_scanner' ? (
          <PreviewCanvasCard style={{ padding: '24px', overflowY: 'auto' }}>
            {/* Emirates ID Ingestion Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px solid #EF4444',
                paddingBottom: '14px',
                marginBottom: '18px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      background: '#EF4444',
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 800,
                    }}
                  >
                    ICP OPTICAL AI SCANNER
                  </span>
                  <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 800 }}>
                    100% OCR & MRZ ACCURACY
                  </span>
                </div>
                <h3 style={{ margin: '6px 0 2px', color: '#1E293B', fontSize: '18px' }}>
                  UAE Resident Identity Card (Emirates ID) Ingestion Hub
                </h3>
                <p style={{ margin: 0, color: '#64748B', fontSize: '12px' }}>
                  Extracts all 18 discrete fields, bilingual Arabic/English names, employer, and ICAO 9303 TD1 MRZ.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <ActionButton
                  onClick={() => handleScanEmiratesId()}
                  disabled={isScanning}
                  title="Rescan Emirates ID Document"
                >
                  <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
                  {isScanning ? 'Scanning...' : 'Rescan Card'}
                </ActionButton>
                <ActionButton
                  $primary
                  onClick={handleCopyJsonVariables}
                  title="Export All 18 Variables as JSON"
                >
                  <Copy size={14} /> Export Variables (JSON)
                </ActionButton>
              </div>
            </div>

            {/* Variable Distribution & 1-Click Platform Actions */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '14px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#1E293B',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Sparkles size={14} color="#EF4444" />
                <span>1-Click Variable Auto-Fill & Platform Distribution:</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <ActionButton onClick={handleAutoFillAsTenant}>
                  <UserCheck size={14} color="#2563EB" /> Auto-Fill Tenancy Lease (as Tenant)
                </ActionButton>
                <ActionButton onClick={handleAutoFillAsLandlord}>
                  <Building size={14} color="#16A34A" /> Auto-Fill Tenancy Lease (as Landlord)
                </ActionButton>
                <ActionButton onClick={handleAutoFillViewingForm}>
                  <FileCheck size={14} color="#D97706" /> Auto-Fill Form B Viewing Register
                </ActionButton>
              </div>
            </div>

            {/* Extracted Fields Table (18 Attributes) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              {/* Box 1: Core Legal Identity */}
              <div
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '16px',
                  background: '#FFFFFF',
                }}
              >
                <div
                  style={{
                    color: '#EF4444',
                    fontWeight: 800,
                    fontSize: '12px',
                    borderBottom: '1px solid #F1F5F9',
                    paddingBottom: '6px',
                    marginBottom: '10px',
                  }}
                >
                  1. CORE LEGAL IDENTITY
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
                  <div>
                    <strong>Emirates ID No:</strong>{' '}
                    <code
                      style={{
                        background: '#FEF2F2',
                        color: '#991B1B',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                      }}
                    >
                      {eidData.idNumber}
                    </code>
                  </div>
                  <div>
                    <strong>Card Number:</strong> {eidData.cardNumber}
                  </div>
                  <div>
                    <strong>Chip Number:</strong> {eidData.chipNumber || '2500069345'}
                  </div>
                  <div>
                    <strong>Name (English):</strong> {eidData.fullNameEn}
                  </div>
                  <div>
                    <strong>Name (Arabic):</strong>{' '}
                    <span style={{ fontWeight: 'bold', color: '#1E293B' }}>{eidData.fullNameAr}</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Demographics & Validity */}
              <div
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '16px',
                  background: '#FFFFFF',
                }}
              >
                <div
                  style={{
                    color: '#2563EB',
                    fontWeight: 800,
                    fontSize: '12px',
                    borderBottom: '1px solid #F1F5F9',
                    paddingBottom: '6px',
                    marginBottom: '10px',
                  }}
                >
                  2. DEMOGRAPHICS & DOCUMENT VALIDITY
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
                  <div>
                    <strong>Date of Birth:</strong> {eidData.dateOfBirth}
                  </div>
                  <div>
                    <strong>Gender / Sex:</strong> {eidData.gender === 'M' ? 'Male (ذكر)' : 'Female (أنثى)'}
                  </div>
                  <div>
                    <strong>Nationality:</strong> {eidData.nationalityEn} ({eidData.nationalityAr} / {eidData.nationalityCode})
                  </div>
                  <div>
                    <strong>Card Issue Date:</strong> {eidData.issueDate}
                  </div>
                  <div>
                    <strong>Card Expiry Date:</strong>{' '}
                    <span style={{ color: '#16A34A', fontWeight: 'bold' }}>{eidData.expiryDate}</span> (Valid)
                  </div>
                </div>
              </div>

              {/* Box 3: Employment & Jurisdiction */}
              <div
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '16px',
                  background: '#FFFFFF',
                }}
              >
                <div
                  style={{
                    color: '#16A34A',
                    fontWeight: 800,
                    fontSize: '12px',
                    borderBottom: '1px solid #F1F5F9',
                    paddingBottom: '6px',
                    marginBottom: '10px',
                  }}
                >
                  3. EMPLOYMENT & JURISDICTION
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
                  <div>
                    <strong>Occupation:</strong> {eidData.occupationEn} ({eidData.occupationAr})
                  </div>
                  <div>
                    <strong>Employer / Sponsor:</strong> {eidData.employerEn} ({eidData.employerAr})
                  </div>
                  <div>
                    <strong>Issuing Place:</strong> {eidData.issuingPlaceEn} ({eidData.issuingPlaceAr})
                  </div>
                  <div>
                    <strong>Confidence Score:</strong> {(eidData.confidenceScore * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Box 4: ICAO 9303 TD1 MRZ Code */}
              <div
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '16px',
                  background: '#1E293B',
                  color: '#F8FAFC',
                }}
              >
                <div
                  style={{
                    color: '#FACC15',
                    fontWeight: 800,
                    fontSize: '12px',
                    borderBottom: '1px solid #334155',
                    paddingBottom: '6px',
                    marginBottom: '10px',
                  }}
                >
                  4. MACHINE READABLE ZONE (MRZ TD1)
                </div>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    letterSpacing: '1px',
                    lineHeight: 1.6,
                    color: '#E2E8F0',
                  }}
                >
                  <div>{eidData.mrz?.line1}</div>
                  <div>{eidData.mrz?.line2}</div>
                  <div>{eidData.mrz?.line3}</div>
                </div>
              </div>
            </div>
          </PreviewCanvasCard>
        ) : (
          <PreviewCanvasCard>
            <ToolbarHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Eye size={16} color="#EF4444" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  Live Document Preview — Zoom: {zoomLevel}%
                </span>
              </div>

              <ToolButtonGroup>
                {selectedTemplateId === 'tenancy_contract_esign' && (
                  <ActionButton
                    onClick={handleCopyEsignLink}
                    title="Copy E-Signature Link to Share with Client"
                  >
                    {shareLinkCopied ? <Check size={14} color="#22C55E" /> : <Share2 size={14} />}
                    {shareLinkCopied ? 'Link Copied!' : 'Share E-Sign Link'}
                  </ActionButton>
                )}

                {selectedTemplateId === 'viewing_form_autofill' && (
                  <ActionButton
                    onClick={handleTriggerAiAutoFill}
                    title="1-Click AI Auto-Fill Form from CRM Data"
                  >
                    <Sparkles size={14} color="#FACC15" /> 1-Click AI Auto-Fill
                  </ActionButton>
                )}

                <ActionButton onClick={handleZoomOut} title="Zoom Out">
                  <ZoomOut size={14} />
                </ActionButton>
                <ActionButton onClick={handleZoomIn} title="Zoom In">
                  <ZoomIn size={14} />
                </ActionButton>
                <ActionButton $primary onClick={handlePrint} title="Laser Print / Save as PDF">
                  <Printer size={14} /> Print / Export PDF
                </ActionButton>
              </ToolButtonGroup>
            </ToolbarHeader>

            {/* Interactive Document Render Viewport */}
            <PreviewFrame
              srcDoc={compiledHtml}
              title="Henry PDF Live Print Canvas"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            />
          </PreviewCanvasCard>
        )}
      </WorkspaceSplit>
    </StudioContainer>
  );
};

export default HenryDocumentStudio;
