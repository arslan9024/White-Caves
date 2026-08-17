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
                  Bilingual Dubai Land Department Tenancy Contract Form · Interactive 2-Pane Preparation & Vault Storage
                </p>
              </div>
            </div>

            <div className="header-actions">
              <HeaderBtn onClick={handleResetToBlank} title="Reset to empty official blank template">
                <RotateCcw size={14} /> Official Blank Template
              </HeaderBtn>
              <HeaderBtn onClick={handleLoadSamplePreset} title="Load sample contract data with Title Deed + EID">
                <Sparkles size={14} color="#F59E0B" /> Load Sample Preset
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
                    Page 1: Contract Details
                  </PageSwitchBtn>
                  <PageSwitchBtn
                    $active={activePreviewPage === 2}
                    onClick={() => setActivePreviewPage(2)}
                  >
                    Page 2: Standard Terms (14)
                  </PageSwitchBtn>
                  <PageSwitchBtn
                    $active={activePreviewPage === 3}
                    onClick={() => setActivePreviewPage(3)}
                  >
                    Page 3: Addenda & Rights
                  </PageSwitchBtn>
                  <PageSwitchBtn
                    $active={activePreviewPage === 'all'}
                    onClick={() => setActivePreviewPage('all')}
                  >
                    All 3 Pages
                  </PageSwitchBtn>
                </div>

                <div className="zoom-controls">
                  <button
                    onClick={handleZoomOut}
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#FFF',
                      padding: '4px 8px',
                      cursor: 'pointer',
                    }}
                  >
                    <ZoomOut size={12} />
                  </button>
                  <span style={{ fontSize: '11px', color: '#94A3B8', minWidth: '35px', textAlign: 'center' }}>
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#FFF',
                      padding: '4px 8px',
                      cursor: 'pointer',
                    }}
                  >
                    <ZoomIn size={12} />
                  </button>
                </div>
              </PreviewToolbar>

              <PreviewScrollArea>
                <PreviewCanvasWrapper $zoom={zoomLevel}>
                  <div
                    dangerouslySetInnerHTML={{ __html: compiledPreviewHtml }}
                    style={{ background: '#FFFFFF' }}
                  />
                </PreviewCanvasWrapper>
              </PreviewScrollArea>
            </LeftPreviewPane>

            {/* ══════════ RIGHT PANE: 4-STEP PREPARATION WIZARD ══════════ */}
            <RightFormPane>
              {/* Stepper Navigation */}
              <StepperHeader>
                <StepTabBtn
                  $active={activeStep === 1}
                  $completed={Boolean(contractData.buildingName && contractData.ownerName)}
                  onClick={() => setActiveStep(1)}
                >
                  <Building size={14} /> 1. Property & Owner
                </StepTabBtn>
                <StepTabBtn
                  $active={activeStep === 2}
                  $completed={Boolean(contractData.tenantName)}
                  onClick={() => setActiveStep(2)}
                >
                  <UserCheck size={14} /> 2. Tenant KYC
                </StepTabBtn>
                <StepTabBtn
                  $active={activeStep === 3}
                  $completed={Boolean(contractData.annualRent > 0)}
                  onClick={() => setActiveStep(3)}
                >
                  <CreditCard size={14} /> 3. Lease & Terms
                </StepTabBtn>
                <StepTabBtn
                  $active={activeStep === 4}
                  $completed={contractData.status === 'ready_for_signature'}
                  onClick={() => setActiveStep(4)}
                >
                  <ShieldCheck size={14} /> 4. Sign & Finalize
                </StepTabBtn>
              </StepperHeader>

              <FormScrollArea>
                {/* ── STEP 1: PROPERTY & LANDLORD DETAILS ── */}
                {activeStep === 1 && (
                  <div>
                    <OcrDropzone onClick={handleScanTitleDeed}>
                      <UploadCloud size={28} color="#EF4444" style={{ margin: '0 auto 8px auto' }} />
                      <div className="dropzone-title">Upload & Ingest DLD Title Deed</div>
                      <div className="dropzone-desc">
                        Drag and drop official Title Deed PDF/image or click to extract Landlord, Building, Unit #, Area SqM & Plot automatically.
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
                      Owner / Lessor Credentials (معلومات المالك / المؤجر)
                    </h4>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>
                          Owner's Full Name <span className="label-arabic">(اسم المالك)</span>
                        </label>
                        <InputField
                          type="text"
                          value={contractData.ownerName}
                          placeholder="e.g. AKRAM DIB NEHME"
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
                          placeholder="e.g. AKRAM DIB NEHME"
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
                          placeholder="784-XXXX-XXXXXXX-X"
                          onChange={(e) => handleFieldChange('lessorEmiratesId', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>
                          Lessor's Phone & Email <span className="label-arabic">(الهاتف والبريد)</span>
                        </label>
                        <InputField
                          type="text"
                          value={contractData.lessorPhone}
                          placeholder="+971 50 XXX XXXX"
                          onChange={(e) => handleFieldChange('lessorPhone', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>

                    <h4 style={{ margin: '1.25rem 0 1rem 0', color: '#EF4444', fontSize: '0.95rem', fontWeight: 800 }}>
                      Property Specifications (معلومات العقار)
                    </h4>

                    <FormGrid $cols={3}>
                      <FormGroup>
                        <label>Building / Tower Name <span className="label-arabic">(المبنى)</span></label>
                        <InputField
                          type="text"
                          value={contractData.buildingName}
                          placeholder="e.g. VIRIDIS A"
                          onChange={(e) => handleFieldChange('buildingName', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Unit / Property No. <span className="label-arabic">(رقم الوحدة)</span></label>
                        <InputField
                          type="text"
                          value={contractData.propertyNo}
                          placeholder="e.g. 504"
                          onChange={(e) => handleFieldChange('propertyNo', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Plot Number <span className="label-arabic">(رقم الأرض)</span></label>
                        <InputField
                          type="text"
                          value={contractData.plotNo}
                          placeholder="e.g. 5120"
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
                        <label>Area Sq.M <span className="label-arabic">(مساحة متر مربع)</span></label>
                        <InputField
                          type="number"
                          value={contractData.propertyAreaSqM || ''}
                          placeholder="e.g. 38.76"
                          onChange={(e) => handleFieldChange('propertyAreaSqM', parseFloat(e.target.value) || 0)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Makani Number <span className="label-arabic">(رقم مكاني)</span></label>
                        <InputField
                          type="text"
                          value={contractData.makaniNo}
                          placeholder="e.g. 24185 62940"
                          onChange={(e) => handleFieldChange('makaniNo', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>
                  </div>
                )}

                {/* ── STEP 2: TENANT KYC INGESTION ── */}
                {activeStep === 2 && (
                  <div>
                    <OcrDropzone>
                      <UploadCloud size={28} color="#2563EB" style={{ margin: '0 auto 8px auto' }} />
                      <div className="dropzone-title" style={{ color: '#38BDF8' }}>
                        Upload & Ingest Tenant Emirates ID or Passport
                      </div>
                      <div className="dropzone-desc">
                        Scan UAE Resident Identity Card (TD1 MRZ) or International Passport (TD3 MRZ) to populate KYC fields automatically.
                      </div>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <HeaderBtn
                          $variant="primary"
                          onClick={handleScanTenantEmiratesId}
                          disabled={isProcessingOcr}
                        >
                          <Sparkles size={14} /> Scan Emirates ID
                        </HeaderBtn>
                        <HeaderBtn
                          $variant="secondary"
                          onClick={handleScanTenantPassport}
                          disabled={isProcessingOcr}
                        >
                          <FileText size={14} /> Scan Passport (Non-Resident)
                        </HeaderBtn>
                      </div>
                    </OcrDropzone>

                    <h4 style={{ margin: '0 0 1rem 0', color: '#38BDF8', fontSize: '0.95rem', fontWeight: 800 }}>
                      Tenant Identification Credentials (معلومات المستأجر)
                    </h4>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>Tenant's Full Name <span className="label-arabic">(اسم المستأجر)</span></label>
                        <InputField
                          type="text"
                          value={contractData.tenantName}
                          placeholder="e.g. Arslan Malik Bashir Ahmad"
                          onChange={(e) => handleFieldChange('tenantName', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Emirates ID / Passport No. <span className="label-arabic">(الهوية / جواز السفر)</span></label>
                        <InputField
                          type="text"
                          value={contractData.tenantEmiratesId}
                          placeholder="784-1993-1805733-0 or DR0760143"
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
                          placeholder="+971 56 361 6136"
                          onChange={(e) => handleFieldChange('tenantPhone', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Tenant's Email Address <span className="label-arabic">(البريد الإلكتروني)</span></label>
                        <InputField
                          type="email"
                          value={contractData.tenantEmail}
                          placeholder="tenant@email.com"
                          onChange={(e) => handleFieldChange('tenantEmail', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>Trade License No. (If Corporate) <span className="label-arabic">(رقم الرخصة)</span></label>
                        <InputField
                          type="text"
                          value={contractData.tenantLicenseNo}
                          placeholder="Optional"
                          onChange={(e) => handleFieldChange('tenantLicenseNo', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Licensing Authority <span className="label-arabic">(سلطة الترخيص)</span></label>
                        <InputField
                          type="text"
                          value={contractData.tenantLicensingAuthority}
                          placeholder="e.g. DET Dubai / DED"
                          onChange={(e) => handleFieldChange('tenantLicensingAuthority', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>
                  </div>
                )}

                {/* ── STEP 3: FINANCIAL & LEASE TERMS ── */}
                {activeStep === 3 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 style={{ margin: 0, color: '#10B981', fontSize: '0.95rem', fontWeight: 800 }}>
                        Lease Period & Financial Configuration (معلومات العقد والمالية)
                      </h4>
                      <HeaderBtn $variant="secondary" onClick={handleSetStandardOneYearDates}>
                        ⚡ Set 1-Year Standard Lease
                      </HeaderBtn>
                    </div>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>Lease Start Date <span className="label-arabic">(فترة العقد من)</span></label>
                        <InputField
                          type="text"
                          value={contractData.contractPeriodFrom}
                          placeholder="DD/MM/YYYY"
                          onChange={(e) => handleFieldChange('contractPeriodFrom', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Lease End Date <span className="label-arabic">(فترة العقد إلى)</span></label>
                        <InputField
                          type="text"
                          value={contractData.contractPeriodTo}
                          placeholder="DD/MM/YYYY"
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
                          placeholder="e.g. 48000"
                          onChange={(e) => handleFieldChange('annualRent', parseFloat(e.target.value) || 0)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Security Deposit (AED) <span className="label-arabic">(مبلغ التأمين)</span></label>
                        <InputField
                          type="number"
                          value={contractData.securityDepositAmount || ''}
                          placeholder="e.g. 4800"
                          onChange={(e) => handleFieldChange('securityDepositAmount', parseFloat(e.target.value) || 0)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Mode of Payment <span className="label-arabic">(طريقة الدفع)</span></label>
                        <InputField
                          type="text"
                          value={contractData.modeOfPayment}
                          placeholder="e.g. 4 Cheques (PDC)"
                          onChange={(e) => handleFieldChange('modeOfPayment', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>DEWA Premise Number <span className="label-arabic">(رقم المبنى ديوا)</span></label>
                        <InputField
                          type="text"
                          value={contractData.premisesNoDewa}
                          placeholder="e.g. 204918273"
                          onChange={(e) => handleFieldChange('premisesNoDewa', e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Location / Community <span className="label-arabic">(الموقع)</span></label>
                        <InputField
                          type="text"
                          value={contractData.location}
                          placeholder="e.g. Madinat Hind 4, Dubai"
                          onChange={(e) => handleFieldChange('location', e.target.value)}
                        />
                      </FormGroup>
                    </FormGrid>

                    <h4 style={{ margin: '1.25rem 0 0.75rem 0', color: '#F59E0B', fontSize: '0.9rem', fontWeight: 800 }}>
                      Additional Terms & Special Addenda (شروط إضافية ملحقة)
                    </h4>
                    {(contractData.additionalTerms || []).map((term, index) => (
                      <FormGroup key={index} style={{ marginBottom: '8px' }}>
                        <InputField
                          type="text"
                          value={term}
                          onChange={(e) => handleUpdateAdditionalTerm(index, e.target.value)}
                        />
                      </FormGroup>
                    ))}
                  </div>
                )}

                {/* ── STEP 4: SIGN, FINALIZE & DISTRIBUTE ── */}
                {activeStep === 4 && (
                  <div>
                    <h4 style={{ margin: '0 0 1rem 0', color: '#8B5CF6', fontSize: '0.95rem', fontWeight: 800 }}>
                      Legal Endorsement & Signatures (التوقيعات والاعتماد)
                    </h4>

                    <FormGrid $cols={2}>
                      <FormGroup>
                        <label>Tenant Signature / Name <span className="label-arabic">(توقيع المستأجر)</span></label>
                        <InputField
                          type="text"
                          value={contractData.tenantSignature || ''}
                          placeholder="Type Tenant Name for E-Sign"
                          onChange={(e) => {
                            handleFieldChange('tenantSignature', e.target.value);
                            handleFieldChange('tenantSignatureDate', new Date().toLocaleDateString('en-GB'));
                          }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Lessor Signature / Name <span className="label-arabic">(توقيع المؤجر)</span></label>
                        <InputField
                          type="text"
                          value={contractData.lessorSignature || ''}
                          placeholder="Type Lessor Name for E-Sign"
                          onChange={(e) => {
                            handleFieldChange('lessorSignature', e.target.value);
                            handleFieldChange('lessorSignatureDate', new Date().toLocaleDateString('en-GB'));
                          }}
                        />
                      </FormGroup>
                    </FormGrid>

                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        marginTop: '1.5rem',
                      }}
                    >
                      <h5 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#F8FAFC' }}>
                        🚀 Live Production Actions & Distribution
                      </h5>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <HeaderBtn $variant="primary" onClick={handleGenerateEsignLink} style={{ justifyContent: 'center' }}>
                          {esignLinkCopied ? <Check size={14} /> : <Copy size={14} />}
                          {esignLinkCopied ? 'Link Copied to Clipboard!' : 'Generate E-Signature Link'}
                        </HeaderBtn>

                        <HeaderBtn $variant="success" onClick={handleSaveAndArchive} style={{ justifyContent: 'center' }}>
                          <ShieldCheck size={14} /> Save to Henry Vault & LocalStorage
                        </HeaderBtn>
                      </div>
                    </div>
                  </div>
                )}
              </FormScrollArea>

              {/* Form Navigation Footer */}
              <FormFooterActions>
                <div>
                  {activeStep > 1 && (
                    <HeaderBtn onClick={() => setActiveStep((prev) => Math.max(prev - 1, 1))}>
                      <ChevronLeft size={14} /> Previous Step
                    </HeaderBtn>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {activeStep < 4 ? (
                    <HeaderBtn $variant="primary" onClick={() => setActiveStep((prev) => Math.min(prev + 1, 4))}>
                      Next Step <ChevronRight size={14} />
                    </HeaderBtn>
                  ) : (
                    <HeaderBtn $variant="success" onClick={handleSaveAndArchive}>
                      <Check size={14} /> Complete & Save Contract
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
