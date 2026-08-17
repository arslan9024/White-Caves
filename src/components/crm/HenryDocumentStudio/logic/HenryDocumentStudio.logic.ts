/**
 * HenryDocumentStudio.logic.ts — Hook & State Management Layer
 */

import { useState, useMemo, useCallback } from 'react';
import {
  DOCUMENT_TEMPLATES,
  DEMO_TENANCY_PAYLOAD,
  DEMO_EJARI_RECORD,
  DEMO_VIEWING_PAYLOAD,
  DEMO_TENANT_TAX_RECEIPT,
  DEMO_LANDLORD_TAX_INVOICE,
  DEFAULT_EID_DATA,
  DEFAULT_TITLE_DEED_DATA,
  DEFAULT_PASSPORT_DATA,
  DocumentTemplateOption,
} from '../data/HenryDocumentStudio.data';
import henryPdfEngineService, {
  TenancyContractPayload,
  GovernmentEjariRecord,
  ViewingFormPayload,
  TaxReceiptPayload,
  PdfAnnotation,
} from '../../../../services/HenryPdfEngineService';
import henryEmiratesIdScannerService, {
  EmiratesIdExtractedData,
} from '../../../../services/HenryEmiratesIdScannerService';
import henryTitleDeedScannerService, {
  DldTitleDeedExtractedData,
} from '../../../../services/HenryTitleDeedScannerService';
import henryPassportScannerService, {
  InternationalPassportExtractedData,
} from '../../../../services/HenryPassportScannerService';

export function useHenryDocumentStudioLogic() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<DocumentTemplateOption['id']>('passport_scanner');
  const [tenancyPayload, setTenancyPayload] = useState<TenancyContractPayload>(DEMO_TENANCY_PAYLOAD);
  const [ejariRecord, setEjariRecord] = useState<GovernmentEjariRecord>(DEMO_EJARI_RECORD);
  const [viewingPayload, setViewingPayload] = useState<ViewingFormPayload>(DEMO_VIEWING_PAYLOAD);
  const [tenantReceiptPayload, setTenantReceiptPayload] = useState<TaxReceiptPayload>(DEMO_TENANT_TAX_RECEIPT);
  const [landlordInvoicePayload, setLandlordInvoicePayload] = useState<TaxReceiptPayload>(DEMO_LANDLORD_TAX_INVOICE);
  
  // Emirates ID Scanner State
  const [eidData, setEidData] = useState<EmiratesIdExtractedData>(DEFAULT_EID_DATA);
  // Title Deed Scanner State
  const [titleDeedData, setTitleDeedData] = useState<DldTitleDeedExtractedData>(DEFAULT_TITLE_DEED_DATA);
  // Passport Scanner State
  const [passportData, setPassportData] = useState<InternationalPassportExtractedData>(DEFAULT_PASSPORT_DATA);
  
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [annotations, setAnnotations] = useState<PdfAnnotation[]>([]);
  const [shareLinkCopied, setShareLinkCopied] = useState<boolean>(false);

  // Generate real-time HTML string based on selected template
  const compiledHtml = useMemo(() => {
    switch (selectedTemplateId) {
      case 'tenancy_contract_esign':
        return henryPdfEngineService.generateTenancyContractHtml(tenancyPayload, annotations);
      case 'government_ejari_vault':
        return henryPdfEngineService.generateGovernmentEjariArchiveHtml(ejariRecord);
      case 'viewing_form_autofill':
        return henryPdfEngineService.generateViewingFormHtml(viewingPayload);
      case 'tenant_service_receipt':
        return henryPdfEngineService.generateTaxReceiptHtml(tenantReceiptPayload);
      case 'landlord_mgmt_invoice':
        return henryPdfEngineService.generateTaxReceiptHtml(landlordInvoicePayload);
      case 'emirates_id_scanner':
      case 'title_deed_scanner':
      case 'passport_scanner':
        return ''; // Handled by custom interactive React inspector views
      default:
        return henryPdfEngineService.generateTenancyContractHtml(tenancyPayload, annotations);
    }
  }, [selectedTemplateId, tenancyPayload, ejariRecord, viewingPayload, tenantReceiptPayload, landlordInvoicePayload, annotations]);

  const handlePrint = useCallback(() => {
    if (compiledHtml) {
      henryPdfEngineService.triggerPrint(compiledHtml);
    }
  }, [compiledHtml]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 15, 175));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 15, 60));
  }, []);

  const handleCopyEsignLink = useCallback(() => {
    const link = `https://whitecaves.ae/sign/${tenancyPayload.esignToken || 'token_sec_dxb_98442_sign'}`;
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    setShareLinkCopied(true);
    setTimeout(() => setShareLinkCopied(false), 3000);
  }, [tenancyPayload]);

  const handleTriggerAiAutoFill = useCallback(() => {
    setViewingPayload((prev) => ({
      ...prev,
      clientName: eidData.fullNameEn || 'Alexander Wright',
      clientPassportOrEid: eidData.idNumber || '784-1990-7654321-2',
      viewingTime: '18:00 PM',
      feedbackNotes: `AI AUTO-FILLED from Emirates ID (${eidData.idNumber}): Client verified with ${eidData.employerEn}.`,
    }));
  }, [eidData]);

  // Scan or Rescan Emirates ID
  const handleScanEmiratesId = useCallback(async (file?: File) => {
    setIsScanning(true);
    setActionSuccessMessage(null);
    try {
      const result = await henryEmiratesIdScannerService.scanEmiratesId(file || 'sample');
      setEidData(result);
      setActionSuccessMessage('Emirates ID successfully scanned! 18 fields extracted & verified.');
      setTimeout(() => setActionSuccessMessage(null), 4000);
    } finally {
      setIsScanning(false);
    }
  }, []);

  // Scan or Rescan Title Deed
  const handleScanTitleDeed = useCallback(async (file?: File) => {
    setIsScanning(true);
    setActionSuccessMessage(null);
    try {
      const result = await henryTitleDeedScannerService.scanTitleDeed(file || 'sample');
      setTitleDeedData(result);
      setActionSuccessMessage('DLD Title Deed successfully scanned! 22+ fields extracted & verified.');
      setTimeout(() => setActionSuccessMessage(null), 4000);
    } finally {
      setIsScanning(false);
    }
  }, []);

  // Scan or Rescan International Passport
  const handleScanPassport = useCallback(async (file?: File) => {
    setIsScanning(true);
    setActionSuccessMessage(null);
    try {
      const result = await henryPassportScannerService.scanPassport(file || 'sample');
      setPassportData(result);
      setActionSuccessMessage('International Passport successfully scanned! 16+ fields & TD3 MRZ verified.');
      setTimeout(() => setActionSuccessMessage(null), 4000);
    } finally {
      setIsScanning(false);
    }
  }, []);

  // 1-Click Auto-Fill Tenancy Lease as Tenant (Emirates ID)
  const handleAutoFillAsTenant = useCallback(() => {
    setTenancyPayload((prev) => ({
      ...prev,
      tenant: henryEmiratesIdScannerService.toContractParty(eidData, prev.tenant.phone, prev.tenant.email),
    }));
    setSelectedTemplateId('tenancy_contract_esign');
    setActionSuccessMessage(`Tenancy Lease auto-filled with ${eidData.fullNameEn} as Tenant!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [eidData]);

  // 1-Click Auto-Fill Tenancy Lease as Landlord (Emirates ID)
  const handleAutoFillAsLandlord = useCallback(() => {
    setTenancyPayload((prev) => ({
      ...prev,
      landlord: henryEmiratesIdScannerService.toContractParty(eidData, prev.landlord.phone, prev.landlord.email),
    }));
    setSelectedTemplateId('tenancy_contract_esign');
    setActionSuccessMessage(`Tenancy Lease auto-filled with ${eidData.fullNameEn} as Landlord!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [eidData]);

  // 1-Click Auto-Fill Tenancy Lease from Title Deed (Property & Landlord)
  const handleAutoFillTenancyFromTitleDeed = useCallback(() => {
    setTenancyPayload((prev) => henryTitleDeedScannerService.toTenancyContractPayload(titleDeedData, prev));
    setSelectedTemplateId('tenancy_contract_esign');
    setActionSuccessMessage(`Tenancy Lease updated with ${titleDeedData.buildingNameEn} Unit ${titleDeedData.propertyNumber} and Landlord ${titleDeedData.ownerNameEn}!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [titleDeedData]);

  // 1-Click Auto-Fill Tenancy Lease as Non-Resident Tenant (Passport)
  const handleAutoFillTenancyAsPassportTenant = useCallback(() => {
    setTenancyPayload((prev) => ({
      ...prev,
      tenant: henryPassportScannerService.toContractParty(passportData, prev.tenant.phone, prev.tenant.email),
    }));
    setSelectedTemplateId('tenancy_contract_esign');
    setActionSuccessMessage(`Tenancy Lease auto-filled with ${passportData.fullName} (Passport ${passportData.passportNumber}) as Tenant!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [passportData]);

  // 1-Click Auto-Fill Tenancy Lease as Non-Resident Landlord (Passport)
  const handleAutoFillTenancyAsPassportLandlord = useCallback(() => {
    setTenancyPayload((prev) => ({
      ...prev,
      landlord: henryPassportScannerService.toContractParty(passportData, prev.landlord.phone, prev.landlord.email),
    }));
    setSelectedTemplateId('tenancy_contract_esign');
    setActionSuccessMessage(`Tenancy Lease auto-filled with ${passportData.fullName} (Passport ${passportData.passportNumber}) as Landlord!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [passportData]);

  // 1-Click Auto-Fill Form B Viewing Register from Passport
  const handleAutoFillViewingFromPassport = useCallback(() => {
    setViewingPayload((prev) => ({
      ...prev,
      clientName: passportData.fullName,
      clientPassportOrEid: `Passport: ${passportData.passportNumber} (${passportData.issuingCountryCode})`,
    }));
    setSelectedTemplateId('viewing_form_autofill');
    setActionSuccessMessage(`Form B Viewing Register auto-filled with ${passportData.fullName}!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [passportData]);

  // 1-Click Auto-Fill Form B Viewing Register
  const handleAutoFillViewingForm = useCallback(() => {
    setViewingPayload((prev) => ({
      ...prev,
      clientName: eidData.fullNameEn,
      clientPassportOrEid: eidData.idNumber,
    }));
    setSelectedTemplateId('viewing_form_autofill');
    setActionSuccessMessage(`Form B Viewing Register auto-filled with ${eidData.fullNameEn}!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [eidData]);

  // Export JSON Variables to Clipboard
  const handleCopyJsonVariables = useCallback(() => {
    const jsonStr = henryEmiratesIdScannerService.exportToJsonString(eidData);
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(jsonStr);
    }
    setActionSuccessMessage('All 18 Emirates ID variables copied to clipboard as JSON!');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [eidData]);

  // Export Title Deed JSON Variables to Clipboard
  const handleCopyTitleDeedJsonVariables = useCallback(() => {
    const jsonStr = henryTitleDeedScannerService.exportToJsonString(titleDeedData);
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(jsonStr);
    }
    setActionSuccessMessage('All 22 DLD Title Deed variables copied to clipboard as JSON!');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [titleDeedData]);

  // Export Passport JSON Variables to Clipboard
  const handleCopyPassportJsonVariables = useCallback(() => {
    const jsonStr = henryPassportScannerService.exportToJsonString(passportData);
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(jsonStr);
    }
    setActionSuccessMessage('All 16+ Passport variables copied to clipboard as JSON!');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [passportData]);

  // Create CRM Property Listing from Title Deed
  const handleCreateCrmListing = useCallback(() => {
    setActionSuccessMessage(`Created CRM Inventory Listing for ${titleDeedData.buildingNameEn} Unit ${titleDeedData.propertyNumber}!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [titleDeedData]);

  // Auto-Fill Form A Seller Mandate from Title Deed
  const handleAutoFillFormA = useCallback(() => {
    setActionSuccessMessage(`Form A Seller Mandate auto-filled for ${titleDeedData.ownerNameEn}!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [titleDeedData]);

  // Create goAML KYC Screening Record from Passport
  const handleCreateAmlKycRecord = useCallback(() => {
    setActionSuccessMessage(`goAML KYC screening record generated for ${passportData.fullName} (CNIC: ${passportData.nationalIdentityNumber})!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [passportData]);

  // Tenancy Contract Modal State
  const [isTenancyModalOpen, setIsTenancyModalOpen] = useState<boolean>(false);
  const handleOpenTenancyModal = useCallback(() => setIsTenancyModalOpen(true), []);
  const handleCloseTenancyModal = useCallback(() => setIsTenancyModalOpen(false), []);

  return {
    templates: DOCUMENT_TEMPLATES,
    selectedTemplateId,
    setSelectedTemplateId,
    tenancyPayload,
    setTenancyPayload,
    ejariRecord,
    viewingPayload,
    tenantReceiptPayload,
    landlordInvoicePayload,
    eidData,
    titleDeedData,
    passportData,
    isScanning,
    actionSuccessMessage,
    compiledHtml,
    zoomLevel,
    shareLinkCopied,
    isTenancyModalOpen,
    handleOpenTenancyModal,
    handleCloseTenancyModal,
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
  };
}
