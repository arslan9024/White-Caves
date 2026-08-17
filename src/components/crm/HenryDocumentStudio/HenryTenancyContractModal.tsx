/**
 * HenryTenancyContractModal.tsx
 *
 * High-Fidelity Split-Pane Interactive Modal for preparing Dubai Land Department (DLD)
 * Unified Tenancy Contracts with live 3-page bilingual preview and multi-OCR ingestion.
 */

import React, { FC } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  X,
  Printer,
  RotateCcw,
  Sparkles,
  FileText,
  Building,
  UserCheck,
  CreditCard,
  ShieldCheck,
  UploadCloud,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  ChevronLeft,
  Home,
  Save,
  Share2,
} from 'lucide-react';
import {
  useHenryTenancyContractModalLogic,
  UseHenryTenancyContractModalLogicProps,
} from './logic/HenryTenancyContractModal.logic';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  HeaderBtn,
  SplitPaneBody,
  LeftPreviewPane,
  PreviewToolbar,
  PageSwitchBtn,
  PreviewScrollArea,
  PreviewCanvasWrapper,
  RightFormPane,
  StepperHeader,
  StepTabBtn,
  FormScrollArea,
  FormGroup,
  InputField,
  SelectField,
  FormGrid,
  OcrDropzone,
  FormFooterActions,
} from './styles/HenryTenancyContractModal.style';

export interface HenryTenancyContractModalProps extends UseHenryTenancyContractModalLogicProps {}

export const HenryTenancyContractModal: FC<HenryTenancyContractModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const {
    contractData,
    activeStep,
    setActiveStep,
    activePreviewPage,
    setActivePreviewPage,
    zoomLevel,
    isProcessingOcr,
    statusMessage,
    esignLinkCopied,
    compiledPreviewHtml,
    handleFieldChange,
    handleUpdateAdditionalTerm,
    handleScanTitleDeed,
    handleScanTenantEmiratesId,
    handleScanTenantPassport,
    handleSetStandardOneYearDates,
    handleResetToBlank,
    handleLoadSamplePreset,
    handleLoadCameliaSample,
    handleLoadJanusiaSample,
    handleGenerateEsignLink,
    handleSaveAndArchive,
    handlePrint,
    handleZoomIn,
    handleZoomOut,
  } = useHenryTenancyContractModalLogic({ isOpen, onClose, initialData });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContainer
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          data-testid="henry-tenancy-modal"
        >
          {/* ── Modal Header ── */}
          <ModalHeader>
            <div className="header-left">
              <span style={{ fontSize: '1.8rem' }}>📄</span>
              <div>
                <h3 className="header-title">
                  Prepare New Tenancy Contract <span style={{ color: '#EF4444' }}>· DLD Unified Form</span>
                </h3>
                <p className="header-subtitle">
                  Bilingual Dubai Land Department Tenancy Contract Form · Interactive 5-Stage Preparation & Vault Storage
                </p>
              </div>
            </div>

            <div className="header-actions">
              <HeaderBtn onClick={handleResetToBlank} title="Reset to empty official blank template">
                <RotateCcw size={14} /> Blank Template
              </HeaderBtn>
              <HeaderBtn onClick={handleLoadCameliaSample} title="Load Camelia 608 (Sanit Singh & Keshivani)">
                <Sparkles size={14} color="#F59E0B" /> Camelia 608 Sample
              </HeaderBtn>
              <HeaderBtn onClick={handleLoadJanusiaSample} title="Load Janusia XH2858B (Svetlana & William Abernethy)">
                <Sparkles size={14} color="#38BDF8" /> Janusia XH2858B Sample
              </HeaderBtn>
              <HeaderBtn $variant="secondary" onClick={handlePrint}>
                <Printer size={14} /> Print / PDF
              </HeaderBtn>
              <HeaderBtn $variant="danger" onClick={onClose}>
                <X size={16} />
              </HeaderBtn>
            </div>
          </ModalHeader>

          {/* Status Feedback Banner */}
          {statusMessage && (
            <div
              style={{
                background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15), rgba(15, 23, 42, 0.9))',
                borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '6px 1.75rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#38BDF8',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>⚡</span> {statusMessage}
            </div>
          )}

          {/* ── Split Screen Body (50% Preview | 50% Form) ── */}
          <SplitPaneBody>
            {/* ══════════ LEFT PANE: LIVE DLD PREVIEW ══════════ */}
            <LeftPreviewPane>
              <PreviewToolbar>
                <div className="page-switcher">
                  <PageSwitchBtn
                    $active={activePreviewPage === 1}
                    onClick={() => setActivePreviewPage(1)}
                  >
                    Page 1
                  </PageSwitchBtn>
                  <PageSwitchBtn
                    $active={activePreviewPage === 2}
                    onClick={() => setActivePreviewPage(2)}
                  >
                    Page 2
                  </PageSwitchBtn>
                  <PageSwitchBtn
                    $active={activePreviewPage === 3}
                    onClick={() => setActivePreviewPage(3)}
                  >
                    Page 3
                  </PageSwitchBtn>
                </div>

                <div className="zoom-controls">
                  <button onClick={handleZoomOut}><ZoomOut size={12} /></button>
                  <span style={{ fontSize: '11px', color: '#94A3B8', minWidth: '35px', textAlign: 'center' }}>
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button onClick={handleZoomIn}><ZoomIn size={12} /></button>
                </div>
              </PreviewToolbar>

              <PreviewScrollArea>
                <PreviewCanvasWrapper $zoom={zoomLevel}>
                  <div
                    dangerouslySetInnerHTML={{ __html: compiledPreviewHtml }}
                    style={{ background: '#FFFFFF', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', borderRadius: '4px' }}
                  />
                </PreviewCanvasWrapper>
              </PreviewScrollArea>
            </LeftPreviewPane>

            {/* ══════════ RIGHT PANE: 5-STAGE GUIDED STEPPER ══════════ */}
            <RightFormPane>
              {/* Stepper Navigation */}
              <StepperHeader>
                <StepTabBtn
                  $active={activeStep === 1}
                  $completed={Boolean(contractData.buildingName && contractData.propertyNo)}
                  onClick={() => setActiveStep(1)}
                >
                  <Home size={14} /> 1. Property Specs
                </StepTabBtn>
                <StepTabBtn
                  $active={activeStep === 2}
                  $completed={Boolean(contractData.ownerName)}
                  onClick={() => setActiveStep(2)}
                >
                  <Building size={14} /> 2. Property Owner
                </StepTabBtn>
                <StepTabBtn
                  $active={activeStep === 3}
                  $completed={Boolean(contractData.tenantName)}
                  onClick={() => setActiveStep(3)}
                >
                  <UserCheck size={14} /> 3. Tenant KYC
                </StepTabBtn>
                <StepTabBtn
                  $active={activeStep === 4}
                  $completed={Boolean(contractData.annualRent > 0)}
                  onClick={() => setActiveStep(4)}
                >
                  <CreditCard size={14} /> 4. Lease & Financials
                </StepTabBtn>
                <StepTabBtn
                  $active={activeStep === 5}
                  $completed={contractData.status === 'ready_for_signature'}
                  onClick={() => setActiveStep(5)}
                >
                  <ShieldCheck size={14} /> 5. Sign & Finalize
                </StepTabBtn>
              </StepperHeader>

              <FormScrollArea>
                {/* ── STAGE 1: PROPERTY SPECIFICATIONS ── */}
                {activeStep === 1 && (
                  <div>
                    <OcrDropzone onClick={handleScanTitleDeed}>
                      <UploadCloud size={28} color="#EF4444" style={{ margin: '0 auto 8px auto' }} />
                      <div className="dropzone-title">Upload & Ingest DLD Title Deed</div>
                      <div className="dropzone-desc">
                        Drag and drop official Title Deed PDF/image or click to extract Building, Unit #, Area SqM, Plot & DEWA premise automatically.
                      </div>
                      <HeaderBtn
                        $variant="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScanTitleDeed();
                        }}
                        disabled={isProcessingOcr}
                        style={{ margin: '0 auto' }}
                      >
                        <Sparkles size={14} /> {isProcessingOcr ? 'Scanning Title Deed...' : '1-Click Scan & Extract Title Deed'}
                      </HeaderBtn>
                    </OcrDropzone>

                    <h4 style={{ margin: '0 0 1rem 0', color: '#EF4444', fontSize: '0.95rem', fontWeight: 800 }}>
                      Stage 1: Property Specifications (معلومات العقار)
                    </h4>

                    <FormGrid $cols={3}>
                      <FormGroup>
                        <label>Building / Tower Name <span className="label-arabic">(المبنى)</span></label>
                        <InputField
                          type="text"
                          value={contractData.buildingName}
                          placeholder="e.g. CAMELIA / Janusia"
                          onChange={(e) => handleFieldChange('buildingName', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Unit / Property No. <span className="label-arabic">(رقم الوحدة)</span></label>
                        <InputField
                          type="text"
                          value={contractData.propertyNo}
                          placeholder="e.g. 608 / XH2858B"
                          onChange={(e) => handleFieldChange('propertyNo', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Plot Number <span className="label-arabic">(رقم الأرض)</span></label>
                        <InputField
                          type="text"
                          value={contractData.plotNo}
                          placeholder="e.g. 176 / 6340"
                          onChange={(e) => handleFieldChange('plotNo', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>

                    <FormGrid $cols={3}>
                      <FormGroup>
                        <label>Property Usage <span className="label-arabic">(استخدام العقار)</span></label>
                        <SelectField
                          value={contractData.propertyUsage}
                          onChange={(e) => handleFieldChange('propertyUsage', e.target.value as any)}
                        >
                          <option value="residential">Residential (سكني)</option>
                          <option value="commercial">Commercial (تجاري)</option>
                          <option value="industrial">Industrial (صناعي)</option>
                        </SelectField>
                      </FormGroup>
                      <FormGroup>
                        <label>Property Type <span className="label-arabic">(نوع الوحدة)</span></label>
                        <InputField
                          type="text"
                          value={contractData.propertyType}
                          placeholder="e.g. 3 BHK + Maid Room / LAND"
                          onChange={(e) => handleFieldChange('propertyType', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Area Sq.M <span className="label-arabic">(مساحة متر مربع)</span></label>
                        <InputField
                          type="number"
                          value={contractData.propertyAreaSqM || ''}
                          placeholder="e.g. 112.24 / 198.98"
                          onChange={(e) => handleFieldChange('propertyAreaSqM', parseFloat(e.target.value) || 0)}
                        />
                      </FormGroup>
                    </FormGrid>

                    <FormGrid $cols={3}>
                      <FormGroup>
                        <label>Makani Number <span className="label-arabic">(رقم مكاني)</span></label>
                        <InputField
                          type="text"
                          value={contractData.makaniNo}
                          placeholder="e.g. 257"
                          onChange={(e) => handleFieldChange('makaniNo', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Premises No. DEWA <span className="label-arabic">(ديوا)</span></label>
                        <InputField
                          type="text"
                          value={contractData.premisesNoDewa}
                          placeholder="e.g. 918014964"
                          onChange={(e) => handleFieldChange('premisesNoDewa', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Location / Community <span className="label-arabic">(الموقع)</span></label>
                        <InputField
                          type="text"
                          value={contractData.location}
                          placeholder="e.g. DAMAC HILLS 2"
                          onChange={(e) => handleFieldChange('location', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>
                  </div>
                )}

                {/* ── STAGE 2: PROPERTY OWNER / LESSOR DETAILS ── */}
                {activeStep === 2 && (
                  <div>
                    <h4 style={{ margin: '0 0 1rem 0', color: '#EF4444', fontSize: '0.95rem', fontWeight: 800 }}>
                      Stage 2: Property Owner & Lessor Contacts (معلومات المالك / المؤجر)
                    </h4>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>
                          Owner's Full Name <span className="label-arabic">(اسم المالك)</span>
                        </label>
                        <InputField
                          type="text"
                          value={contractData.ownerName}
                          placeholder="e.g. SANIT SINGH NAGPAL / SVETLANA LEVITSKAYA"
                          onChange={(e) => handleFieldChange('ownerName', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>
                          Lessor's Name <span className="label-arabic">(اسم المؤجر)</span>
                        </label>
                        <InputField
                          type="text"
                          value={contractData.lessorName}
                          placeholder="e.g. SANIT SINGH NAGPAL / SVETLANA LEVITSKAYA"
                          onChange={(e) => handleFieldChange('lessorName', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>
                          Lessor's Emirates ID / Passport <span className="label-arabic">(الهوية)</span>
                        </label>
                        <InputField
                          type="text"
                          value={contractData.lessorEmiratesId}
                          placeholder="784-1999-5371408-8 / Passport No"
                          onChange={(e) => handleFieldChange('lessorEmiratesId', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>
                          Lessor's Phone Number <span className="label-arabic">(هاتف المؤجر)</span>
                        </label>
                        <InputField
                          type="text"
                          value={contractData.lessorPhone}
                          placeholder="0504458097 / +974 5550 1054"
                          onChange={(e) => handleFieldChange('lessorPhone', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>
                          Lessor's Email Address <span className="label-arabic">(البريد الإلكتروني)</span>
                        </label>
                        <InputField
                          type="email"
                          value={contractData.lessorEmail}
                          placeholder="nagpalsanit@gmail.com / svetlanaln@hotmail.com"
                          onChange={(e) => handleFieldChange('lessorEmail', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>
                          License No. (In case of Company) <span className="label-arabic">(رقم الرخصة)</span>
                        </label>
                        <InputField
                          type="text"
                          value={contractData.lessorLicenseNo}
                          placeholder="Optional (e.g. 1388443)"
                          onChange={(e) => handleFieldChange('lessorLicenseNo', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>
                  </div>
                )}

                {/* ── STAGE 3: TENANT KYC & IDENTITY ── */}
                {activeStep === 3 && (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.25rem' }}>
                      <OcrDropzone onClick={handleScanTenantEmiratesId}>
                        <UploadCloud size={24} color="#38BDF8" style={{ margin: '0 auto 6px auto' }} />
                        <div className="dropzone-title" style={{ fontSize: '0.85rem' }}>Scan Tenant Emirates ID</div>
                        <HeaderBtn
                          $variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScanTenantEmiratesId();
                          }}
                          disabled={isProcessingOcr}
                          style={{ margin: '6px auto 0 auto', fontSize: '0.75rem', padding: '4px 10px' }}
                        >
                          <Sparkles size={12} /> Scan EID
                        </HeaderBtn>
                      </OcrDropzone>

                      <OcrDropzone onClick={handleScanTenantPassport}>
                        <UploadCloud size={24} color="#F59E0B" style={{ margin: '0 auto 6px auto' }} />
                        <div className="dropzone-title" style={{ fontSize: '0.85rem' }}>Scan Tenant Passport</div>
                        <HeaderBtn
                          $variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScanTenantPassport();
                          }}
                          disabled={isProcessingOcr}
                          style={{ margin: '6px auto 0 auto', fontSize: '0.75rem', padding: '4px 10px' }}
                        >
                          <Sparkles size={12} /> Scan Passport
                        </HeaderBtn>
                      </OcrDropzone>
                    </div>

                    <h4 style={{ margin: '0 0 1rem 0', color: '#38BDF8', fontSize: '0.95rem', fontWeight: 800 }}>
                      Stage 3: Tenant Information & KYC (معلومات المستأجر)
                    </h4>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>Tenant's Full Name <span className="label-arabic">(اسم المستأجر)</span></label>
                        <InputField
                          type="text"
                          value={contractData.tenantName}
                          placeholder="e.g. KESHIVANI MAYADEVAN / WILLIAM MICHAEL ABERNETHY"
                          onChange={(e) => handleFieldChange('tenantName', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Tenant's Emirates ID / Passport <span className="label-arabic">(الهوية)</span></label>
                        <InputField
                          type="text"
                          value={contractData.tenantEmiratesId}
                          placeholder="784-1984-7391875-7 / 784197927183794"
                          onChange={(e) => handleFieldChange('tenantEmiratesId', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>Tenant's Phone Number <span className="label-arabic">(هاتف المستأجر)</span></label>
                        <InputField
                          type="text"
                          value={contractData.tenantPhone}
                          placeholder="050 7915250 / 0585969529"
                          onChange={(e) => handleFieldChange('tenantPhone', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Tenant's Email Address <span className="label-arabic">(البريد الإلكتروني)</span></label>
                        <InputField
                          type="email"
                          value={contractData.tenantEmail}
                          placeholder="shivanimayadevan9@gmail.com / wmabernethy@gmail.com"
                          onChange={(e) => handleFieldChange('tenantEmail', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>
                  </div>
                )}

                {/* ── STAGE 4: LEASE FINANCIALS & CONTRACT DETAILS ── */}
                {activeStep === 4 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 style={{ margin: 0, color: '#10B981', fontSize: '0.95rem', fontWeight: 800 }}>
                        Stage 4: Contract Period & Financial Schedules (معلومات العقد والمالية)
                      </h4>
                      <HeaderBtn $variant="secondary" onClick={handleSetStandardOneYearDates} style={{ fontSize: '0.75rem' }}>
                        ⚡ Set 1-Year Standard Lease
                      </HeaderBtn>
                    </div>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>Contract Period From <span className="label-arabic">(فترة العقد من)</span></label>
                        <InputField
                          type="text"
                          value={contractData.contractPeriodFrom}
                          placeholder="e.g. 13-07-2026 / 27-01-2026"
                          onChange={(e) => handleFieldChange('contractPeriodFrom', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Contract Period To <span className="label-arabic">(فترة العقد إلى)</span></label>
                        <InputField
                          type="text"
                          value={contractData.contractPeriodTo}
                          placeholder="e.g. 12-07-2027 / 26-01-2027"
                          onChange={(e) => handleFieldChange('contractPeriodTo', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>

                    <FormGrid $cols={3}>
                      <FormGroup>
                        <label>Annual Rent (AED) <span className="label-arabic">(الايجار السنوي)</span></label>
                        <InputField
                          type="number"
                          value={contractData.annualRent || ''}
                          placeholder="112000 / 120000"
                          onChange={(e) => handleFieldChange('annualRent', parseFloat(e.target.value) || 0)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Contract Value (AED) <span className="label-arabic">(قيمة العقد)</span></label>
                        <InputField
                          type="number"
                          value={contractData.contractValue || ''}
                          placeholder="112000 / 120000"
                          onChange={(e) => handleFieldChange('contractValue', parseFloat(e.target.value) || 0)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Security Deposit (AED) <span className="label-arabic">(مبلغ التأمين)</span></label>
                        <InputField
                          type="number"
                          value={contractData.securityDepositAmount || ''}
                          placeholder="5600 / 6000"
                          onChange={(e) => handleFieldChange('securityDepositAmount', parseFloat(e.target.value) || 0)}
                        />
                      </FormGroup>
                    </FormGrid>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>Mode of Payment <span className="label-arabic">(طريقة الدفع)</span></label>
                        <InputField
                          type="text"
                          value={contractData.modeOfPayment}
                          placeholder="3 CHEQUES / 4 CHEQUES"
                          onChange={(e) => handleFieldChange('modeOfPayment', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Contract Reference ID <span className="label-arabic">(رقم العقد)</span></label>
                        <InputField
                          type="text"
                          value={contractData.contractId}
                          readOnly
                          style={{ opacity: 0.8, fontFamily: 'monospace' }}
                        />
                      </FormGroup>
                    </FormGrid>

                    <h4 style={{ margin: '1.25rem 0 0.75rem 0', color: '#94A3B8', fontSize: '0.88rem', fontWeight: 800 }}>
                      Additional Special Terms & Addenda (Page 3)
                    </h4>
                    {(contractData.additionalTerms || []).map((term, index) => (
                      <FormGroup key={index} style={{ marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.75rem' }}>Clause {index + 1}</label>
                        <InputField
                          type="text"
                          value={term}
                          onChange={(e) => handleUpdateAdditionalTerm(index, e.target.value)}
                        />
                      </FormGroup>
                    ))}
                  </div>
                )}

                {/* ── STAGE 5: SIGNATURES & FINALIZATION ── */}
                {activeStep === 5 && (
                  <div>
                    <h4 style={{ margin: '0 0 1rem 0', color: '#38BDF8', fontSize: '0.95rem', fontWeight: 800 }}>
                      Stage 5: Digital Endorsements & E-Sign Finalization (التوقيعات واعتماد العقد)
                    </h4>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>Tenant Endorsement Signature <span className="label-arabic">(توقيع المستأجر)</span></label>
                        <InputField
                          type="text"
                          value={contractData.tenantSignature || ''}
                          placeholder="Enter Tenant Name for Digital Signature"
                          onChange={(e) => handleFieldChange('tenantSignature', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Lessor Endorsement Signature <span className="label-arabic">(توقيع المؤجر)</span></label>
                        <InputField
                          type="text"
                          value={contractData.lessorSignature || ''}
                          placeholder="Enter Lessor Name for Digital Signature"
                          onChange={(e) => handleFieldChange('lessorSignature', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>

                    <div
                      style={{
                        background: 'rgba(56, 189, 248, 0.08)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        borderRadius: '10px',
                        padding: '16px',
                        marginTop: '1.25rem',
                      }}
                    >
                      <div style={{ fontWeight: 800, color: '#38BDF8', fontSize: '0.9rem', marginBottom: '6px' }}>
                        🔒 Digital E-Signature Dispatch
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0 0 12px 0' }}>
                        Generate a cryptographically secured E-Signature link to dispatch directly to Tenant and Landlord for instant mobile signing.
                      </p>
                      <HeaderBtn $variant="primary" onClick={handleGenerateEsignLink}>
                        <Share2 size={14} /> {esignLinkCopied ? 'Link Copied to Clipboard!' : 'Generate E-Signature Link'}
                      </HeaderBtn>
                    </div>
                  </div>
                )}
              </FormScrollArea>

              {/* Form Navigation Footer */}
              <FormFooterActions>
                <div>
                  {activeStep > 1 && (
                    <HeaderBtn $variant="secondary" onClick={() => setActiveStep(prev => prev - 1)}>
                      ← Previous Stage
                    </HeaderBtn>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {activeStep < 5 ? (
                    <HeaderBtn $variant="primary" onClick={() => setActiveStep(prev => prev + 1)}>
                      Next Stage →
                    </HeaderBtn>
                  ) : (
                    <HeaderBtn $variant="primary" onClick={handleSaveAndArchive}>
                      <Save size={14} /> Save to Henry Vault & Archive
                    </HeaderBtn>
                  )}
                </div>
              </FormFooterActions>
            </RightFormPane>
          </SplitPaneBody>
        </ModalContainer>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default HenryTenancyContractModal;
