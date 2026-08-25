/**
 * HenryTenancyContractModal.tsx
 *
 * High-Fidelity Split-Pane Interactive Modal for preparing official Dubai Land Department (DLD)
 * Unified Tenancy Contracts with live 3-page bilingual preview and multi-OCR document ingestion.
 */

import React, { FC, useState, useRef } from 'react';
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
  Check,
  ZoomIn,
  ZoomOut,
  Home,
  Save,
  Share2,
  AlertCircle,
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
    handleFileUpload,
  } = useHenryTenancyContractModalLogic({ isOpen, onClose, initialData });

  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Hidden File Inputs for Each Stage
  const masterFileInputRef = useRef<HTMLInputElement>(null);
  const deedFileInputRef = useRef<HTMLInputElement>(null);
  const landlordFileInputRef = useRef<HTMLInputElement>(null);
  const tenantEidFileInputRef = useRef<HTMLInputElement>(null);
  const tenantPassportFileInputRef = useRef<HTMLInputElement>(null);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>, docType: 'auto' | 'contract' | 'title_deed' | 'emirates_id_tenant' | 'emirates_id_landlord' | 'passport_tenant' | 'passport_landlord' = 'auto') => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, docType);
      e.target.value = ''; // Reset input
    }
  };

  const handleAttemptClose = () => {
    setShowExitConfirm(true);
  };

  const handleConfirmClose = () => {
    setShowExitConfirm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.stopPropagation()} /* Prevent accidental closing on backdrop click */
      >
        {/* Hidden Stage-Specific File Inputs */}
        <input
          type="file"
          ref={masterFileInputRef}
          onChange={(e) => onFileSelect(e, 'contract')}
          accept=".pdf,image/*,.doc,.docx"
          style={{ display: 'none' }}
        />
        <input
          type="file"
          ref={deedFileInputRef}
          onChange={(e) => onFileSelect(e, 'title_deed')}
          accept=".pdf,image/*"
          style={{ display: 'none' }}
        />
        <input
          type="file"
          ref={landlordFileInputRef}
          onChange={(e) => onFileSelect(e, 'emirates_id_landlord')}
          accept=".pdf,image/*"
          style={{ display: 'none' }}
        />
        <input
          type="file"
          ref={tenantEidFileInputRef}
          onChange={(e) => onFileSelect(e, 'emirates_id_tenant')}
          accept=".pdf,image/*"
          style={{ display: 'none' }}
        />
        <input
          type="file"
          ref={tenantPassportFileInputRef}
          onChange={(e) => onFileSelect(e, 'passport_tenant')}
          accept=".pdf,image/*"
          style={{ display: 'none' }}
        />

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
              <span style={{ fontSize: '1.8rem' }}>🏛️</span>
              <div>
                <h3 className="header-title">
                  Prepare New Tenancy Contract <span style={{ color: 'var(--accent-red, #EF4444)' }}>· Official DLD Unified Template</span>
                </h3>
                <p className="header-subtitle">
                  Government of Dubai / Land Department Bilingual Form (عقد إيجار) · Guided 6-Stage Preparation & Auto-Fill
                </p>
              </div>
            </div>

            <div className="header-actions">
              <HeaderBtn
                $variant="primary"
                onClick={() => masterFileInputRef.current?.click()}
                title="Upload full tenancy contract to auto-fill all fields at once"
                style={{ background: 'linear-gradient(135deg, var(--accent-red, #EF4444), var(--accent-red, #DC2626))', color: 'var(--white, #FFF)' }}
              >
                <UploadCloud size={14} /> Upload Contract & Auto-Fill
              </HeaderBtn>
              <HeaderBtn onClick={handleResetToBlank} title="Reset to fresh blank official DLD template">
                <RotateCcw size={14} /> Blank Template
              </HeaderBtn>
              <HeaderBtn onClick={handleLoadCameliaSample} title="Load benchmark sample: Camelia 608">
                <Sparkles size={14} color="#F59E0B" /> Camelia 608
              </HeaderBtn>
              <HeaderBtn onClick={handleLoadJanusiaSample} title="Load benchmark sample: Janusia XH2858B">
                <Sparkles size={14} color="#38BDF8" /> Janusia XH2858B
              </HeaderBtn>
              <HeaderBtn $variant="secondary" onClick={handlePrint}>
                <Printer size={14} /> Print / PDF
              </HeaderBtn>
              <HeaderBtn $variant="danger" onClick={handleAttemptClose} title="Close / Exit Wizard">
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
            {/* ══════════ LEFT PANE: LIVE DLD OFFICIAL PREVIEW ══════════ */}
            <LeftPreviewPane>
              <PreviewToolbar>
                <div className="page-switcher">
                  <PageSwitchBtn
                    $active={activePreviewPage === 1}
                    onClick={() => setActivePreviewPage(1)}
                  >
                    Page 1 (Contract & Parties)
                  </PageSwitchBtn>
                  <PageSwitchBtn
                    $active={activePreviewPage === 2}
                    onClick={() => setActivePreviewPage(2)}
                  >
                    Page 2 (14 Legal Terms)
                  </PageSwitchBtn>
                  <PageSwitchBtn
                    $active={activePreviewPage === 3}
                    onClick={() => setActivePreviewPage(3)}
                  >
                    Page 3 (Addendum & Rights)
                  </PageSwitchBtn>
                  <PageSwitchBtn
                    $active={activePreviewPage === 'all'}
                    onClick={() => setActivePreviewPage('all')}
                  >
                    All 3 Pages
                  </PageSwitchBtn>
                </div>

                <div className="zoom-controls">
                  <button onClick={handleZoomOut}><ZoomOut size={12} /></button>
                  <span style={{ fontSize: '11px', color: 'var(--color-94a3b8, #94A3B8)', minWidth: '35px', textAlign: 'center' }}>
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button onClick={handleZoomIn}><ZoomIn size={12} /></button>
                </div>
              </PreviewToolbar>

              <PreviewScrollArea>
                <PreviewCanvasWrapper $zoom={zoomLevel}>
                  <div
                    dangerouslySetInnerHTML={{ __html: compiledPreviewHtml }}
                    style={{ background: 'var(--white, #FFFFFF)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', borderRadius: '4px' }}
                  />
                </PreviewCanvasWrapper>
              </PreviewScrollArea>
            </LeftPreviewPane>

            {/* ══════════ RIGHT PANE: 6-STAGE GUIDED STEPPER ══════════ */}
            <RightFormPane>
              {/* Stepper Navigation */}
              <StepperHeader>
                <StepTabBtn
                  $active={activeStep === 1}
                  $completed={Boolean(contractData.buildingName && contractData.propertyNo)}
                  onClick={() => setActiveStep(1)}
                >
                  <Home size={14} /> 1. Title Deed & Unit
                </StepTabBtn>
                <StepTabBtn
                  $active={activeStep === 2}
                  $completed={Boolean(contractData.ownerName)}
                  onClick={() => setActiveStep(2)}
                >
                  <Building size={14} /> 2. Landlord KYC
                </StepTabBtn>
                <StepTabBtn
                  $active={activeStep === 3}
                  $completed={Boolean(contractData.tenantName)}
                  onClick={() => setActiveStep(3)}
                >
                  <UserCheck size={14} /> 3. Tenant Docs
                </StepTabBtn>
                <StepTabBtn
                  $active={activeStep === 4}
                  $completed={Boolean(contractData.annualRent > 0)}
                  onClick={() => setActiveStep(4)}
                >
                  <CreditCard size={14} /> 4. Financials
                </StepTabBtn>
                <StepTabBtn
                  $active={activeStep === 5}
                  $completed={Boolean(contractData.additionalTerms?.length > 0)}
                  onClick={() => setActiveStep(5)}
                >
                  <FileText size={14} /> 5. Special Terms
                </StepTabBtn>
                <StepTabBtn
                  $active={activeStep === 6}
                  $completed={contractData.status === 'ready_for_signature'}
                  onClick={() => setActiveStep(6)}
                >
                  <ShieldCheck size={14} /> 6. Review & Export
                </StepTabBtn>
              </StepperHeader>

              <FormScrollArea>
                {/* ── STAGE 1: TITLE DEED & PROPERTY SPECS ── */}
                {activeStep === 1 && (
                  <div>
                    <OcrDropzone onClick={() => deedFileInputRef.current?.click()}>
                      <UploadCloud size={28} color="var(--accent-red, #EF4444)" style={{ margin: '0 auto 8px auto' }} />
                      <div className="dropzone-title">Upload & Scan Official DLD Title Deed / Oqood</div>
                      <div className="dropzone-desc">
                        Drag and drop official Title Deed PDF or image to automatically extract Building Name, Unit Number, Plot Number, Makani, DEWA Number, Area SqM, and Owner.
                      </div>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '10px' }}>
                        <HeaderBtn
                          $variant="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            deedFileInputRef.current?.click();
                          }}
                          disabled={isProcessingOcr}
                        >
                          <UploadCloud size={14} /> Browse Title Deed File
                        </HeaderBtn>
                        <HeaderBtn
                          $variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScanTitleDeed();
                          }}
                          disabled={isProcessingOcr}
                        >
                          <Sparkles size={14} /> 1-Click Sample Ingestion
                        </HeaderBtn>
                      </div>
                    </OcrDropzone>

                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--accent-red, #EF4444)', fontSize: '0.95rem', fontWeight: 800 }}>
                      Stage 1: Property Specifications (معلومات العقار)
                    </h4>

                    <FormGrid $cols={3}>
                      <FormGroup>
                        <label>Building / Tower Name <span className="label-arabic">(اسم المبنى)</span></label>
                        <InputField
                          type="text"
                          value={contractData.buildingName}
                          placeholder="e.g. CAMELIA / Janusia"
                          onChange={(e) => handleFieldChange('buildingName', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Unit / Property No. <span className="label-arabic">(رقم العقار)</span></label>
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
                          placeholder="e.g. 3 Bedroom Townhouse"
                          onChange={(e) => handleFieldChange('propertyType', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Area Sq.M <span className="label-arabic">(مساحة العقار متر مربع)</span></label>
                        <InputField
                          type="number"
                          value={contractData.propertyAreaSqM || ''}
                          placeholder="e.g. 198.50"
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
                        <label>Premises No. DEWA <span className="label-arabic">(رقم المبنى ديوا)</span></label>
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
                          placeholder="e.g. DAMAC Hills 2, Dubai"
                          onChange={(e) => handleFieldChange('location', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>
                  </div>
                )}

                {/* ── STAGE 2: LANDLORD / OWNER KYC ── */}
                {activeStep === 2 && (
                  <div>
                    <OcrDropzone onClick={() => landlordFileInputRef.current?.click()} style={{ marginBottom: '1.25rem' }}>
                      <UploadCloud size={24} color="#EF4444" style={{ margin: '0 auto 6px auto' }} />
                      <div className="dropzone-title">Upload Landlord Emirates ID / Passport / Agreement</div>
                      <div className="dropzone-desc">
                        Upload landlord identity document to extract Owner Name, Emirates ID, Mobile, and Email automatically.
                      </div>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
                        <HeaderBtn
                          $variant="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            landlordFileInputRef.current?.click();
                          }}
                          disabled={isProcessingOcr}
                        >
                          <UploadCloud size={14} /> Browse Landlord Document
                        </HeaderBtn>
                      </div>
                    </OcrDropzone>

                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--accent-red, #EF4444)', fontSize: '0.95rem', fontWeight: 800 }}>
                      Stage 2: Owner & Lessor Information (معلومات المالك / المؤجر)
                    </h4>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>
                          Owner's Full Name <span className="label-arabic">(اسم المالك)</span>
                        </label>
                        <InputField
                          type="text"
                          value={contractData.ownerName}
                          placeholder="e.g. Arslan Malik / SANIT SINGH NAGPAL"
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
                          placeholder="e.g. Arslan Malik / SANIT SINGH NAGPAL"
                          onChange={(e) => handleFieldChange('lessorName', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>
                          Lessor's Emirates ID / Passport <span className="label-arabic">(الهوية الإماراتية للمؤجر)</span>
                        </label>
                        <InputField
                          type="text"
                          value={contractData.lessorEmiratesId}
                          placeholder="784-1988-1234567-1"
                          onChange={(e) => handleFieldChange('lessorEmiratesId', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>
                          Lessor's Phone Number <span className="label-arabic">(رقم هاتف المؤجر)</span>
                        </label>
                        <InputField
                          type="text"
                          value={contractData.lessorPhone}
                          placeholder="+971 50 123 4567"
                          onChange={(e) => handleFieldChange('lessorPhone', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>
                          Lessor's Email Address <span className="label-arabic">(البريد الإلكتروني للمؤجر)</span>
                        </label>
                        <InputField
                          type="email"
                          value={contractData.lessorEmail}
                          placeholder="arslan.malik@whitecaves.ae"
                          onChange={(e) => handleFieldChange('lessorEmail', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>
                          License No. <span className="label-arabic">(رقم الرخصة في حال كانت شركة)</span>
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

                {/* ── STAGE 3: TENANT DOCUMENTS & KYC ── */}
                {activeStep === 3 && (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.25rem' }}>
                      <OcrDropzone onClick={() => tenantEidFileInputRef.current?.click()}>
                        <UploadCloud size={24} color="#38BDF8" style={{ margin: '0 auto 6px auto' }} />
                        <div className="dropzone-title" style={{ fontSize: '0.85rem' }}>Upload Tenant Emirates ID</div>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '6px' }}>
                          <HeaderBtn
                            $variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              tenantEidFileInputRef.current?.click();
                            }}
                            disabled={isProcessingOcr}
                            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                          >
                            <UploadCloud size={12} /> Browse EID
                          </HeaderBtn>
                          <HeaderBtn
                            $variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleScanTenantEmiratesId();
                            }}
                            disabled={isProcessingOcr}
                            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                          >
                            <Sparkles size={12} /> Sample EID
                          </HeaderBtn>
                        </div>
                      </OcrDropzone>

                      <OcrDropzone onClick={() => tenantPassportFileInputRef.current?.click()}>
                        <UploadCloud size={24} color="#10B981" style={{ margin: '0 auto 6px auto' }} />
                        <div className="dropzone-title" style={{ fontSize: '0.85rem' }}>Upload Tenant Passport</div>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '6px' }}>
                          <HeaderBtn
                            $variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              tenantPassportFileInputRef.current?.click();
                            }}
                            disabled={isProcessingOcr}
                            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                          >
                            <UploadCloud size={12} /> Browse Passport
                          </HeaderBtn>
                          <HeaderBtn
                            $variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleScanTenantPassport();
                            }}
                            disabled={isProcessingOcr}
                            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                          >
                            <Sparkles size={12} /> Sample Passport
                          </HeaderBtn>
                        </div>
                      </OcrDropzone>
                    </div>

                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-38bdf8, #38BDF8)', fontSize: '0.95rem', fontWeight: 800 }}>
                      Stage 3: Tenant Information & KYC (معلومات المستأجر)
                    </h4>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>Tenant's Full Name <span className="label-arabic">(اسم المستأجر)</span></label>
                        <InputField
                          type="text"
                          value={contractData.tenantName}
                          placeholder="e.g. Sarah Jenkins / KESHIVANI MAYADEVAN"
                          onChange={(e) => handleFieldChange('tenantName', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Tenant's Emirates ID / Passport <span className="label-arabic">(الهوية الإماراتية للمستأجر)</span></label>
                        <InputField
                          type="text"
                          value={contractData.tenantEmiratesId}
                          placeholder="784-1992-7654321-2"
                          onChange={(e) => handleFieldChange('tenantEmiratesId', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>Tenant's Phone Number <span className="label-arabic">(رقم هاتف المستأجر)</span></label>
                        <InputField
                          type="text"
                          value={contractData.tenantPhone}
                          placeholder="+971 52 987 6543"
                          onChange={(e) => handleFieldChange('tenantPhone', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Tenant's Email Address <span className="label-arabic">(البريد الإلكتروني للمستأجر)</span></label>
                        <InputField
                          type="email"
                          value={contractData.tenantEmail}
                          placeholder="sarah.jenkins@example.com"
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
                      <h4 style={{ margin: 0, color: 'var(--accent-green, #10B981)', fontSize: '0.95rem', fontWeight: 800 }}>
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
                          placeholder="01-09-2026"
                          onChange={(e) => handleFieldChange('contractPeriodFrom', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Contract Period To <span className="label-arabic">(فترة العقد إلى)</span></label>
                        <InputField
                          type="text"
                          value={contractData.contractPeriodTo}
                          placeholder="31-08-2027"
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
                          placeholder="95000"
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            handleFieldChange('annualRent', val);
                            handleFieldChange('contractValue', val);
                            handleFieldChange('securityDepositAmount', Math.round(val * 0.05));
                          }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Contract Value (AED) <span className="label-arabic">(قيمة العقد)</span></label>
                        <InputField
                          type="number"
                          value={contractData.contractValue || contractData.annualRent || ''}
                          placeholder="95000"
                          onChange={(e) => handleFieldChange('contractValue', parseFloat(e.target.value) || 0)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Security Deposit (AED) <span className="label-arabic">(مبلغ التأمين)</span></label>
                        <InputField
                          type="number"
                          value={contractData.securityDepositAmount || ''}
                          placeholder="4750"
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
                          placeholder="2 CHEQUES / 4 CHEQUES"
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
                  </div>
                )}

                {/* ── STAGE 5: SPECIAL TERMS & ADDENDUM (PAGE 3) ── */}
                {activeStep === 5 && (
                  <div>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--accent-gold, #F59E0B)', fontSize: '0.95rem', fontWeight: 800 }}>
                      Stage 5: Additional Terms & Special Addenda (شروط إضافية — الصفحة 3)
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-94a3b8, #94A3B8)', margin: '0 0 12px 0' }}>
                      Add up to 5 custom statutory or property-specific special conditions to appear on Page 3 of the official DLD agreement:
                    </p>

                    {[0, 1, 2, 3, 4].map((index) => (
                      <FormGroup key={index} style={{ marginBottom: '10px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                          Clause {index + 1} <span className="label-arabic">(الشرط {index + 1})</span>
                        </label>
                        <InputField
                          type="text"
                          value={(contractData.additionalTerms && contractData.additionalTerms[index]) || ''}
                          placeholder={`Enter custom clause ${index + 1}...`}
                          onChange={(e) => handleUpdateAdditionalTerm(index, e.target.value)}
                        />
                      </FormGroup>
                    ))}
                  </div>
                )}

                {/* ── STAGE 6: REVIEW, ENDORSEMENT & EXPORT ── */}
                {activeStep === 6 && (
                  <div>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-38bdf8, #38BDF8)', fontSize: '0.95rem', fontWeight: 800 }}>
                      Stage 6: Final Review & Document Export (مراجعة واعتماد العقد)
                    </h4>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>Tenant Endorsement Signature <span className="label-arabic">(توقيع المستأجر)</span></label>
                        <InputField
                          type="text"
                          value={contractData.tenantSignature || ''}
                          placeholder="Enter Tenant Name for Digital Signature"
                          onChange={(e) => {
                            handleFieldChange('tenantSignature', e.target.value);
                            handleFieldChange('tenantSignatureDate', new Date().toLocaleDateString('en-GB'));
                          }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Lessor Endorsement Signature <span className="label-arabic">(توقيع المؤجر)</span></label>
                        <InputField
                          type="text"
                          value={contractData.lessorSignature || ''}
                          placeholder="Enter Lessor Name for Digital Signature"
                          onChange={(e) => {
                            handleFieldChange('lessorSignature', e.target.value);
                            handleFieldChange('lessorSignatureDate', new Date().toLocaleDateString('en-GB'));
                          }}
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
                      <div style={{ fontWeight: 800, color: 'var(--color-38bdf8, #38BDF8)', fontSize: '0.9rem', marginBottom: '6px' }}>
                        🔒 Digital E-Signature Dispatch
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-94a3b8, #94A3B8)', margin: '0 0 12px 0' }}>
                        Generate a cryptographically secured E-Signature link to dispatch directly to Tenant and Landlord for instant mobile signing.
                      </p>
                      <HeaderBtn $variant="primary" onClick={handleGenerateEsignLink}>
                        <Share2 size={14} /> {esignLinkCopied ? 'Link Copied to Clipboard!' : 'Generate E-Signature Link'}
                      </HeaderBtn>
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
                      <HeaderBtn $variant="secondary" onClick={handlePrint} style={{ flex: 1 }}>
                        <Printer size={14} /> Print / Save Full 3-Page Contract PDF
                      </HeaderBtn>
                      <HeaderBtn $variant="primary" onClick={handleSaveAndArchive} style={{ flex: 1 }}>
                        <Save size={14} /> Save to Henry Vault
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
                  {activeStep < 6 ? (
                    <HeaderBtn $variant="primary" onClick={() => setActiveStep(prev => prev + 1)}>
                      Next Stage →
                    </HeaderBtn>
                  ) : (
                    <HeaderBtn $variant="primary" onClick={handleSaveAndArchive}>
                      <Save size={14} /> Complete & Save Contract
                    </HeaderBtn>
                  )}
                </div>
              </FormFooterActions>
            </RightFormPane>
          </SplitPaneBody>
        </ModalContainer>

        {/* ── Confirmation Modal on Exit ── */}
        {showExitConfirm && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '420px',
                width: '90%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                color: '#F8FAFC',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '10px', borderRadius: '12px', color: 'var(--accent-red, #EF4444)' }}>
                  <AlertCircle size={24} />
                </div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Exit Tenancy Preparation?</h4>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--color-94a3b8, #94A3B8)', lineHeight: 1.5, margin: '0 0 20px 0' }}>
                Your current progress is automatically saved to your draft vault. Do you want to continue editing or close the wizard?
              </p>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <HeaderBtn $variant="secondary" onClick={() => setShowExitConfirm(false)}>
                  Continue Editing
                </HeaderBtn>
                <HeaderBtn $variant="danger" onClick={handleConfirmClose}>
                  Save & Exit
                </HeaderBtn>
              </div>
            </div>
          </div>
        )}
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default HenryTenancyContractModal;
