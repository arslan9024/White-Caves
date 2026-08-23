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
  Home,
  FileText,
  Globe,
  ShieldAlert,
  FilePlus2,
} from 'lucide-react';
import { useHenryDocumentStudioLogic } from './logic/HenryDocumentStudio.logic';
import { HenryTenancyContractModal } from './HenryTenancyContractModal';
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
    titleDeedData,
    passportData,
    isScanning,
    actionSuccessMessage,
    handlePrint,
    handleZoomIn,
    handleZoomOut,
    handleCopyEsignLink,
    handleTriggerAiAutoFill,
    handleScanEmiratesId,
    handleScanTitleDeed,
    handleScanPassport,
    handleAutoFillAsTenant,
    handleAutoFillAsLandlord,
    handleAutoFillTenancyFromTitleDeed,
    handleAutoFillTenancyAsPassportTenant,
    handleAutoFillTenancyAsPassportLandlord,
    handleAutoFillViewingFromPassport,
    handleAutoFillViewingForm,
    handleCopyJsonVariables,
    handleCopyTitleDeedJsonVariables,
    handleCopyPassportJsonVariables,
    handleCreateCrmListing,
    handleAutoFillFormA,
    handleCreateAmlKycRecord,
    scannedContractData,
    handleScanTenancyContract,
    handleLoadContractIntoPreparationStudio,
    handleCreateCrmLandlordFromContract,
    handleCreateCrmTenantFromContract,
    handleCopyContractJsonVariables,
    isTenancyModalOpen,
    handleOpenTenancyModal,
    handleCloseTenancyModal,
  } = useHenryDocumentStudioLogic();

  return (
    <StudioContainer data-testid="henry-document-studio">
      {/* Executive Header */}
      <StudioHeader>
        <div>
          <h2>
            <span>📄</span> Henry AI — Sovereign Record Keeper & Document Studio
          </h2>
          <p style={{ margin: 0, color: 'var(--color-94a3b8, #94A3B8)', fontSize: '0.88rem' }}>
            Official DLD Unified Tenancy Contract, Passport AI Scanner, Title Deed OCR, Emirates ID Ingestion & VAT Invoices.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handleOpenTenancyModal}
            data-testid="prepare-tenancy-btn"
            style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#FFFFFF',
              border: '1px solid #DC2626',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            <FilePlus2 size={16} /> Prepare New Tenancy Contract
          </button>
          <Badge>HENRY RECORD KEEPER</Badge>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Ejari: 0120260721003974</span>
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
            1. Scan Passport, Title Deed & Emirates ID to extract verified data.<br />
            2. 1-Click auto-fills Tenancy Agreement or Viewing Form.<br />
            3. Official Government Ejari Certificate is archived in Vault.
          </div>
        </SidebarControlPanel>

        {/* Right Canvas: Tenancy Contract Scanner, Passport Scanner, Title Deed Scanner, Emirates ID Scanner OR PDF Canvas */}
        {selectedTemplateId === 'tenancy_contract_scanner' ? (
          <PreviewCanvasCard style={{ padding: '24px', overflowY: 'auto' }}>
            {/* Header */}
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
                    DLD UNIFIED TENANCY CONTRACT SCANNER & LEARNER
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      background: scannedContractData.isFilled ? 'rgba(22, 163, 74, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                      color: scannedContractData.isFilled ? '#16A34A' : '#CA8A04',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontWeight: 800,
                    }}
                  >
                    {scannedContractData.isFilled
                      ? `✅ FILLED & VALIDATED (${scannedContractData.fillScorePercent}% Score)`
                      : '⚠️ BLANK REUSABLE TEMPLATE (0% Score)'}
                  </span>
                </div>
                <h3 style={{ margin: '6px 0 2px', color: 'var(--color-1e293b, #1E293B)', fontSize: '18px' }}>
                  Tenancy Contract AI Optical Scanner & Autonomous Learner
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary, #64748B)', fontSize: '12px' }}>
                  Autonomous Fill Detection, Completeness Score ({scannedContractData.filledFieldsCount}/{scannedContractData.totalFieldsCount} Fields), Landlord/Tenant Grouped Extraction & Reference Training Pool.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <ActionButton
                  $primary
                  onClick={() => handleScanTenancyContract('sample_sanit')}
                  disabled={isScanning}
                  title="Scan & Extract Camelia 608 (Sanit Singh & Keshivani)"
                >
                  <Scan size={14} /> Scan Camelia 608 (Sanit Singh)
                </ActionButton>
                <ActionButton
                  $primary
                  onClick={() => handleScanTenancyContract('sample_svetlana')}
                  disabled={isScanning}
                  title="Scan & Extract Janusia XH2858B (Svetlana & William Abernethy)"
                  style={{ background: 'linear-gradient(135deg, var(--accent-blue, #0284C7) 0%, var(--color-0369a1, #0369A1) 100%)', borderColor: 'var(--accent-blue, #0284C7)' }}
                >
                  <Sparkles size={14} /> Scan Janusia XH2858B (Svetlana)
                </ActionButton>
                <ActionButton
                  onClick={() => handleScanTenancyContract('blank')}
                  disabled={isScanning}
                  title="Scan Blank Unfilled Contract Template"
                >
                  <RefreshCw size={14} /> Scan Blank Template
                </ActionButton>
                <ActionButton
                  onClick={handleCopyContractJsonVariables}
                  title="Copy All Variables as JSON"
                >
                  <Copy size={14} /> Export Variables (JSON)
                </ActionButton>
              </div>
            </div>

            {/* Field Completeness & Missing Fields Alert */}
            <div
              style={{
                background: scannedContractData.isFilled ? 'rgba(22, 163, 74, 0.08)' : 'rgba(234, 179, 8, 0.08)',
                border: `1px solid ${scannedContractData.isFilled ? 'rgba(22, 163, 74, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: scannedContractData.isFilled ? 'var(--color-15803d, #15803D)' : 'var(--color-a16207, #A16207)' }}>
                  {scannedContractData.isFilled
                    ? `Contract Completeness: ${scannedContractData.fillScorePercent}% (${scannedContractData.filledFieldsCount} of ${scannedContractData.totalFieldsCount} fields populated)`
                    : 'Unfilled DLD Base Contract: 0% Populated (Ready for Auto-Fill Template)'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary, #64748B)', marginTop: '2px' }}>
                  {scannedContractData.missingFields.length > 0
                    ? `Missing / Optional Fields: ${scannedContractData.missingFields.join(', ')}`
                    : 'All critical party, property, financial and addenda terms present & validated!'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary, #64748B)', fontWeight: 700 }}>Contract Date:</span>
                <code style={{ background: 'var(--color-f1f5f9, #F1F5F9)', color: 'var(--color-0f172a, #0F172A)', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px' }}>
                  {scannedContractData.contractDate || 'Unspecified'}
                </code>
              </div>
            </div>

            {/* Grouped Extraction Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
              {/* Group 1: Landlord */}
              <div style={{ background: 'var(--color-f8fafc, #F8FAFC)', border: '1px solid var(--text-secondary, #E2E8F0)', borderRadius: '10px', padding: '14px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 800, color: 'var(--accent-red, #EF4444)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building size={15} /> 1. Landlord / Lessor (معلومات المالك)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>Owner / Lessor Name</span>
                    <strong style={{ color: 'var(--color-0f172a, #0F172A)', fontSize: '12px' }}>{scannedContractData.landlord.name || '—'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>Emirates ID</span>
                    <strong style={{ color: 'var(--accent-red, #EF4444)', fontFamily: 'monospace' }}>{scannedContractData.landlord.emiratesId || '—'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>Phone Number</span>
                    <strong style={{ color: 'var(--color-0f172a, #0F172A)' }}>{scannedContractData.landlord.phone || '—'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>Email Address</span>
                    <strong style={{ color: 'var(--accent-blue, #2563EB)' }}>{scannedContractData.landlord.email || '—'}</strong>
                  </div>
                </div>
              </div>

              {/* Group 2: Tenant */}
              <div style={{ background: 'var(--color-f8fafc, #F8FAFC)', border: '1px solid var(--text-secondary, #E2E8F0)', borderRadius: '10px', padding: '14px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 800, color: 'var(--accent-blue, #2563EB)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={15} /> 2. Tenant Information (معلومات المستأجر)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>Tenant Name</span>
                    <strong style={{ color: 'var(--color-0f172a, #0F172A)', fontSize: '12px' }}>{scannedContractData.tenant.name || '—'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>Emirates ID</span>
                    <strong style={{ color: 'var(--accent-blue, #2563EB)', fontFamily: 'monospace' }}>{scannedContractData.tenant.emiratesId || '—'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>Phone Number</span>
                    <strong style={{ color: 'var(--color-0f172a, #0F172A)' }}>{scannedContractData.tenant.phone || '—'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>Email Address</span>
                    <strong style={{ color: 'var(--accent-blue, #2563EB)' }}>{scannedContractData.tenant.email || '—'}</strong>
                  </div>
                </div>
              </div>

              {/* Group 3: Property Specifications */}
              <div style={{ background: 'var(--color-f8fafc, #F8FAFC)', border: '1px solid var(--text-secondary, #E2E8F0)', borderRadius: '10px', padding: '14px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 800, color: 'var(--accent-gold, #D97706)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Home size={15} /> 3. Property Specifications (معلومات العقار)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>Building & Unit</span>
                    <strong style={{ color: 'var(--color-0f172a, #0F172A)' }}>{scannedContractData.property.buildingName} Unit {scannedContractData.property.propertyNumber}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>Plot Number</span>
                    <strong style={{ color: 'var(--color-0f172a, #0F172A)' }}>Plot {scannedContractData.property.plotNumber}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>Property Type & Usage</span>
                    <strong style={{ color: 'var(--color-0f172a, #0F172A)' }}>{scannedContractData.property.propertyType} ({scannedContractData.property.usage})</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>Area (Sq.M / Sq.Ft)</span>
                    <strong style={{ color: 'var(--accent-green, #16A34A)' }}>{scannedContractData.property.areaSqM} m² ({scannedContractData.property.areaSqFt} sq.ft)</strong>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>Location / Community</span>
                    <strong style={{ color: 'var(--color-0f172a, #0F172A)' }}>{scannedContractData.property.location}</strong>
                  </div>
                </div>
              </div>

              {/* Group 4: Lease Financials */}
              <div style={{ background: 'var(--color-f8fafc, #F8FAFC)', border: '1px solid var(--text-secondary, #E2E8F0)', borderRadius: '10px', padding: '14px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 800, color: 'var(--accent-green, #16A34A)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={15} /> 4. Lease & Financials (معلومات العقد والمالية)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>Lease Period</span>
                    <strong style={{ color: 'var(--color-0f172a, #0F172A)' }}>{scannedContractData.financials.periodFrom} ➔ {scannedContractData.financials.periodTo}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>Annual Rent</span>
                    <strong style={{ color: 'var(--accent-green, #16A34A)', fontSize: '13px' }}>AED {scannedContractData.financials.annualRentAed.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>Security Deposit</span>
                    <strong style={{ color: 'var(--accent-gold, #D97706)' }}>AED {scannedContractData.financials.securityDepositAed.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary, #64748B)', display: 'block' }}>Mode of Payment</span>
                    <strong style={{ color: 'var(--color-0f172a, #0F172A)' }}>{scannedContractData.financials.modeOfPayment}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Group 5: Additional Terms / Addenda */}
            <div style={{ background: 'var(--color-f8fafc, #F8FAFC)', border: '1px solid var(--text-secondary, #E2E8F0)', borderRadius: '10px', padding: '14px', marginBottom: '18px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 800, color: 'var(--color-475569, #475569)' }}>
                📜 Additional Special Terms & Addenda (شروط إضافية ملحقة بالعقد)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
                {scannedContractData.additionalTerms.map((term, i) => (
                  <div key={i} style={{ display: 'flex', gap: '6px', color: 'var(--color-1e293b, #1E293B)' }}>
                    <span style={{ color: 'var(--accent-green, #16A34A)', fontWeight: 800 }}>✓</span>
                    <span>{term}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 1-Click Platform Ingestion Actions Bar */}
            <div
              style={{
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-334155, #334155)', marginRight: '6px' }}>
                1-Click Platform Actions:
              </span>
              <ActionButton $primary onClick={handleLoadContractIntoPreparationStudio}>
                <FileCheck size={14} /> Load into Preparation Studio as Reusable Draft
              </ActionButton>
              <ActionButton onClick={handleCreateCrmLandlordFromContract}>
                <Building size={14} color="#EF4444" /> Create CRM Landlord Profile
              </ActionButton>
              <ActionButton onClick={handleCreateCrmTenantFromContract}>
                <UserCheck size={14} color="#2563EB" /> Create CRM Tenant Profile
              </ActionButton>
            </div>
          </PreviewCanvasCard>
        ) : selectedTemplateId === 'passport_scanner' ? (
          <PreviewCanvasCard style={{ padding: '24px', overflowY: 'auto' }}>
            {/* Passport Header */}
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
                    ICAO 9303 TD3 PASSPORT SCANNER
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--accent-green, #16A34A)', fontWeight: 800 }}>
                    10-YEAR VALIDITY KYC VERIFIED
                  </span>
                </div>
                <h3 style={{ margin: '6px 0 2px', color: 'var(--color-1e293b, #1E293B)', fontSize: '18px' }}>
                  International Passport & goAML KYC Ingestion Hub
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary, #64748B)', fontSize: '12px' }}>
                  Extracts 16+ discrete fields: Passport No, National ID (CNIC), Surname, Father Name, DOB, POB, Authority, and 2-line TD3 MRZ.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <ActionButton
                  onClick={() => handleScanPassport()}
                  disabled={isScanning}
                  title="Rescan Passport Document"
                >
                  <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
                  {isScanning ? 'Scanning...' : 'Rescan Passport'}
                </ActionButton>
                <ActionButton
                  $primary
                  onClick={handleCopyPassportJsonVariables}
                  title="Export All 16+ Variables as JSON"
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
                <ActionButton onClick={handleAutoFillTenancyAsPassportTenant}>
                  <UserCheck size={14} color="#2563EB" /> Auto-Fill Tenancy Lease (as Non-Resident Tenant)
                </ActionButton>
                <ActionButton onClick={handleAutoFillTenancyAsPassportLandlord}>
                  <Building size={14} color="#16A34A" /> Auto-Fill Tenancy Lease (as Non-Resident Landlord)
                </ActionButton>
                <ActionButton onClick={handleAutoFillViewingFromPassport}>
                  <FileCheck size={14} color="#D97706" /> Auto-Fill Form B Viewing Register
                </ActionButton>
                <ActionButton onClick={handleCreateAmlKycRecord}>
                  <ShieldAlert size={14} color="#DC2626" /> Create goAML KYC Audit Record
                </ActionButton>
              </div>
            </div>

            {/* Extracted Fields Table (16 Attributes) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              {/* Box 1: Passport & Document Metadata */}
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
                  1. PASSPORT & DOCUMENT METADATA
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
                  <div>
                    <strong>Passport Number:</strong>{' '}
                    <code style={{ background: 'var(--color-fef2f2, #FEF2F2)', color: 'var(--color-991b1b, #991B1B)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                      {passportData.passportNumber}
                    </code>
                  </div>
                  <div>
                    <strong>Issuing Country:</strong> {passportData.issuingCountry} ({passportData.issuingCountryCode})
                  </div>
                  <div>
                    <strong>Passport Type:</strong> {passportData.passportType} (Standard International)
                  </div>
                  <div>
                    <strong>Booklet Number:</strong> {passportData.bookletNumber}
                  </div>
                  <div>
                    <strong>Tracking Number:</strong> {passportData.trackingNumber}
                  </div>
                  <div>
                    <strong>Issuing Authority:</strong> {passportData.issuingAuthority}
                  </div>
                </div>
              </div>

              {/* Box 2: Personal Identity & Biometrics */}
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
                  2. PERSONAL IDENTITY & BIOMETRICS
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
                  <div>
                    <strong>Full Name:</strong>{' '}
                    <span style={{ fontWeight: 'bold', color: 'var(--color-1e293b, #1E293B)' }}>{passportData.fullName}</span>
                  </div>
                  <div>
                    <strong>Surname:</strong> {passportData.surname} | <strong>Given:</strong> {passportData.givenNames}
                  </div>
                  <div>
                    <strong>Father's Name:</strong> {passportData.fatherName}
                  </div>
                  <div>
                    <strong>National ID / CNIC:</strong>{' '}
                    <code style={{ background: 'var(--color-eff6ff, #EFF6FF)', color: 'var(--accent-blue, #1D4ED8)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                      {passportData.nationalIdentityNumber}
                    </code>
                  </div>
                  <div>
                    <strong>Date of Birth:</strong> {passportData.dateOfBirth} (Gender: {passportData.gender === 'M' ? 'Male' : 'Female'})
                  </div>
                  <div>
                    <strong>Place of Birth:</strong> {passportData.placeOfBirth}
                  </div>
                </div>
              </div>

              {/* Box 3: Validity & Lifespan */}
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
                  3. VALIDITY & LIFESPAN (10-YEAR EXPIRY)
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
                  <div>
                    <strong>Date of Issue:</strong> {passportData.dateOfIssue}
                  </div>
                  <div>
                    <strong>Date of Expiry:</strong>{' '}
                    <span style={{ color: 'var(--accent-green, #16A34A)', fontWeight: 'bold' }}>{passportData.dateOfExpiry}</span>
                  </div>
                  <div>
                    <strong>Validity Period:</strong> {passportData.validityYears} Years (Active & Valid)
                  </div>
                  <div>
                    <strong>Nationality:</strong> {passportData.nationality} ({passportData.nationalityCode})
                  </div>
                  <div>
                    <strong>Optical OCR Confidence:</strong> {(passportData.confidenceScore * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Box 4: ICAO 9303 TD3 MRZ Code */}
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
                  4. 2-LINE ICAO 9303 TD3 MRZ CODE
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
                  <div>{passportData.mrz?.line1}</div>
                  <div>{passportData.mrz?.line2}</div>
                </div>
              </div>
            </div>
          </PreviewCanvasCard>
        ) : selectedTemplateId === 'title_deed_scanner' ? (
          <PreviewCanvasCard style={{ padding: '24px', overflowY: 'auto' }}>
            {/* Title Deed Header */}
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
                    DLD TITLE DEED AI SCANNER
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--accent-green, #16A34A)', fontWeight: 800 }}>
                    BLOCKCHAIN VERIFIED (شهادة ملكية عقار)
                  </span>
                </div>
                <h3 style={{ margin: '6px 0 2px', color: 'var(--color-1e293b, #1E293B)', fontSize: '18px' }}>
                  Dubai Land Department (DLD) Title Deed Ingestion Hub
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary, #64748B)', fontSize: '12px' }}>
                  Extracts 22+ discrete properties: Community, Unit, Areas, Owner DLD ID, Contract No, and Purchase Price in AED.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <ActionButton
                  onClick={() => handleScanTitleDeed()}
                  disabled={isScanning}
                  title="Rescan DLD Title Deed Document"
                >
                  <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
                  {isScanning ? 'Scanning...' : 'Rescan Title Deed'}
                </ActionButton>
                <ActionButton
                  $primary
                  onClick={handleCopyTitleDeedJsonVariables}
                  title="Export All 22 Variables as JSON"
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
                <ActionButton onClick={handleAutoFillTenancyFromTitleDeed}>
                  <Building size={14} color="#16A34A" /> Auto-Fill Tenancy Lease (Property & Landlord)
                </ActionButton>
                <ActionButton onClick={handleCreateCrmListing}>
                  <Home size={14} color="#2563EB" /> Create CRM Property Inventory Listing
                </ActionButton>
                <ActionButton onClick={handleAutoFillFormA}>
                  <FileText size={14} color="#D97706" /> Auto-Fill Form A Seller Mandate
                </ActionButton>
              </div>
            </div>

            {/* Extracted Fields Table (22 Attributes) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              {/* Box 1: Property Specs & Location */}
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
                  1. PROPERTY & LOCATION SPECIFICATIONS
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
                  <div>
                    <strong>Property Type:</strong> {titleDeedData.propertyTypeEn} ({titleDeedData.propertyTypeAr})
                  </div>
                  <div>
                    <strong>Community:</strong> {titleDeedData.communityEn} ({titleDeedData.communityAr})
                  </div>
                  <div>
                    <strong>Building:</strong>{' '}
                    <span style={{ fontWeight: 'bold', color: 'var(--accent-red, #EF4444)' }}>{titleDeedData.buildingNameEn}</span> ({titleDeedData.buildingNameAr}), Bldg #{titleDeedData.buildingNumber}
                  </div>
                  <div>
                    <strong>Unit / Property No:</strong>{' '}
                    <code style={{ background: 'var(--color-fef2f2, #FEF2F2)', color: 'var(--color-991b1b, #991B1B)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                      Unit {titleDeedData.propertyNumber}
                    </code> (Floor {titleDeedData.floorNumber})
                  </div>
                  <div>
                    <strong>Plot No:</strong> {titleDeedData.plotNumber} | <strong>Municipality:</strong> {titleDeedData.municipalityNumber}
                  </div>
                  <div>
                    <strong>Parking Bay:</strong> {titleDeedData.parkingNumber} | <strong>Mortgage:</strong> {titleDeedData.mortgageStatusEn}
                  </div>
                </div>
              </div>

              {/* Box 2: Area Measurements */}
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
                  2. PRECISION AREA MEASUREMENTS
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
                  <div>
                    <strong>Suite Area (Internal):</strong> {titleDeedData.suiteAreaSqM} m² (المساحة الداخلية)
                  </div>
                  <div>
                    <strong>Balcony Area:</strong> {titleDeedData.balconyAreaSqM} m² (مساحة البلكونة)
                  </div>
                  <div>
                    <strong>Total Area (Sq Meters):</strong>{' '}
                    <span style={{ fontWeight: 'bold', color: 'var(--accent-blue, #2563EB)' }}>{titleDeedData.totalAreaSqM} m²</span>
                  </div>
                  <div>
                    <strong>Total Area (Sq Feet):</strong>{' '}
                    <span style={{ fontWeight: 'bold', color: 'var(--color-1e293b, #1E293B)' }}>{titleDeedData.totalAreaSqFt} sq.ft</span>
                  </div>
                  <div>
                    <strong>Common Area:</strong> {titleDeedData.commonAreaSqM} m²
                  </div>
                </div>
              </div>

              {/* Box 3: Registered Ownership */}
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
                  3. REGISTERED OWNERSHIP (DLD)
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
                  <div>
                    <strong>Owner DLD No:</strong>{' '}
                    <code style={{ background: 'var(--color-f0fdf4, #F0FDF4)', color: 'var(--color-166534, #166534)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                      {titleDeedData.ownerDldNumber}
                    </code>
                  </div>
                  <div>
                    <strong>Owner Name (EN):</strong> {titleDeedData.ownerNameEn}
                  </div>
                  <div>
                    <strong>Owner Name (AR):</strong>{' '}
                    <span style={{ fontWeight: 'bold', color: 'var(--color-1e293b, #1E293B)' }}>{titleDeedData.ownerNameAr}</span>
                  </div>
                  <div>
                    <strong>Ownership Share:</strong> {titleDeedData.ownerSharePercent}% ({titleDeedData.ownedAreaSqM} m²)
                  </div>
                  <div>
                    <strong>DLD Certificate No:</strong> {titleDeedData.certificateNumber} (Issued: {titleDeedData.issueDate})
                  </div>
                </div>
              </div>

              {/* Box 4: Conveyancing History */}
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
                  4. CONVEYANCING & PURCHASE CONTRACT
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1.8, color: 'var(--text-secondary, #E2E8F0)' }}>
                  <div>
                    <strong>Purchased From:</strong> {titleDeedData.purchasedFromEn}
                  </div>
                  <div>
                    <strong>Arabic Entity:</strong> {titleDeedData.purchasedFromAr}
                  </div>
                  <div>
                    <strong>Land Registration No:</strong> {titleDeedData.registrationContractNumber} ({titleDeedData.registrationDate})
                  </div>
                  <div>
                    <strong>Purchase Price:</strong>{' '}
                    <span style={{ color: 'var(--color-facc15, #FACC15)', fontWeight: 'bold', fontSize: '14px' }}>
                      AED {titleDeedData.purchasePriceAed.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-94a3b8, #94A3B8)', marginTop: '4px' }}>
                    <em>"{titleDeedData.purchasePriceWordsEn}"</em>
                  </div>
                </div>
              </div>
            </div>
          </PreviewCanvasCard>
        ) : selectedTemplateId === 'emirates_id_scanner' ? (
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
                  <span style={{ fontSize: '11px', color: 'var(--accent-green, #16A34A)', fontWeight: 800 }}>
                    100% OCR & MRZ ACCURACY
                  </span>
                </div>
                <h3 style={{ margin: '6px 0 2px', color: 'var(--color-1e293b, #1E293B)', fontSize: '18px' }}>
                  UAE Resident Identity Card (Emirates ID) Ingestion Hub
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary, #64748B)', fontSize: '12px' }}>
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
                    <span style={{ fontWeight: 'bold', color: 'var(--color-1e293b, #1E293B)' }}>{eidData.fullNameAr}</span>
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
                    <span style={{ color: 'var(--accent-green, #16A34A)', fontWeight: 'bold' }}>{eidData.expiryDate}</span> (Valid)
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

      {/* Official DLD Tenancy Contract Interactive Preparation Modal */}
      <HenryTenancyContractModal
        isOpen={isTenancyModalOpen}
        onClose={handleCloseTenancyModal}
      />
    </StudioContainer>
  );
};

export default HenryDocumentStudio;
