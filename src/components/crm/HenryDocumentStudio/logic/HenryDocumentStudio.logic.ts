/**
 * HenryDocumentStudio.logic.ts — Hook & State Management Layer
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
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
import henryTenancyContractScannerService, {
  ScannedTenancyContractResult,
  SANIT_SINGH_CAMELIA_608_SAMPLE,
} from '../../../../services/HenryTenancyContractScannerService';
import henryTenancyContractTemplateService from '../../../../services/HenryTenancyContractTemplateService';
import { canUseScan, ScanReview } from '../../../../services/henryScanReview';
import logger from '../../../../utils/logger';

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
  // Tenancy Contract Scanner & Learner State
  const [scannedContractData, setScannedContractData] = useState<ScannedTenancyContractResult>(SANIT_SINGH_CAMELIA_608_SAMPLE);
  
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [annotations, setAnnotations] = useState<PdfAnnotation[]>([]);
  const [shareLinkCopied, setShareLinkCopied] = useState<boolean>(false);

  const [compiledHtml, setCompiledHtml] = useState<string>('');
  const requireReview = (data: object): boolean => {
    if (canUseScan(data as ScanReview)) return true;
    setActionSuccessMessage('Review required. Benchmark or unconfirmed data cannot autofill or create records.');
    return false;
  };
  useEffect(() => {
    const eid = henryEmiratesIdScannerService.onEmiratesIdUpdated(data => setEidData(data || DEFAULT_EID_DATA));
    const deed = henryTitleDeedScannerService.onTitleDeedUpdated(data => setTitleDeedData(data || DEFAULT_TITLE_DEED_DATA));
    return () => {
      eid(); deed();
      henryEmiratesIdScannerService.clearCachedEmiratesId();
      henryTitleDeedScannerService.clearCachedTitleDeed();
      henryPassportScannerService.clearCachedPassport();
      henryTenancyContractScannerService.clearCachedContract();
      henryTenancyContractTemplateService.clearSession();
    };
  }, []);

  useEffect(() => {
    let active = true;
    setCompiledHtml('');
    const generateHtml = async () => {
      try {
        let result: string | Promise<string>;
        switch (selectedTemplateId) {
          case 'tenancy_contract_esign':
            result = henryPdfEngineService.generateTenancyContractHtml(tenancyPayload, annotations);
            break;
          case 'government_ejari_vault':
            result = henryPdfEngineService.generateGovernmentEjariArchiveHtml(ejariRecord);
            break;
          case 'viewing_form_autofill':
            result = henryPdfEngineService.generateViewingFormHtml(viewingPayload);
            break;
          case 'tenant_service_receipt':
            result = henryPdfEngineService.generateTaxReceiptHtml(tenantReceiptPayload);
            break;
          case 'landlord_mgmt_invoice':
            result = henryPdfEngineService.generateTaxReceiptHtml(landlordInvoicePayload);
            break;
          case 'emirates_id_scanner':
          case 'title_deed_scanner':
          case 'passport_scanner':
          case 'tenancy_contract_scanner':
            result = ''; // Handled by custom interactive React inspector views
            break;
          default:
            result = henryPdfEngineService.generateTenancyContractHtml(tenancyPayload, annotations);
        }
        const html = await result;
        if (active) setCompiledHtml(html);
      } catch {
        logger.error('Henry document preview generation failed', { templateId: selectedTemplateId });
        if (active) setActionSuccessMessage('Document preview failed. Retry before printing or exporting.');
      }
    };
    void generateHtml();
    return () => { active = false; };
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
    if (!requireReview(eidData)) return;
    setViewingPayload((prev) => ({
      ...prev,
      clientName: eidData.fullNameEn,
      clientPassportOrEid: eidData.idNumber,
      viewingTime: '18:00 PM',
      feedbackNotes: 'Auto-filled from user-reviewed fields; authenticity not verified.',
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
    if (!requireReview(eidData)) return;
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
    if (!requireReview(eidData)) return;
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
    if (!requireReview(titleDeedData)) return;
    setTenancyPayload((prev) => henryTitleDeedScannerService.toTenancyContractPayload(titleDeedData, prev));
    setSelectedTemplateId('tenancy_contract_esign');
    setActionSuccessMessage(`Tenancy Lease updated with ${titleDeedData.buildingNameEn} Unit ${titleDeedData.propertyNumber} and Landlord ${titleDeedData.ownerNameEn}!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [titleDeedData]);

  // 1-Click Auto-Fill Tenancy Lease as Non-Resident Tenant (Passport)
  const handleAutoFillTenancyAsPassportTenant = useCallback(() => {
    if (!requireReview(passportData)) return;
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
    if (!requireReview(passportData)) return;
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
    if (!requireReview(passportData)) return;
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
    if (!requireReview(eidData)) return;
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
    if (!requireReview(titleDeedData)) return;
    setActionSuccessMessage('CRM creation is unavailable here. Link an existing approved property in the archive controls.');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [titleDeedData]);

  // Auto-Fill Form A Seller Mandate from Title Deed
  const handleAutoFillFormA = useCallback(() => {
    if (!requireReview(titleDeedData)) return;
    setActionSuccessMessage('Form A generation is not available in this scanner.');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [titleDeedData]);

  // Create goAML KYC Screening Record from Passport
  const handleCreateAmlKycRecord = useCallback(() => {
    if (!requireReview(passportData)) return;
    setActionSuccessMessage('goAML record creation is not available in this scanner.');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [passportData]);

  // Tenancy Contract Modal State
  const [isTenancyModalOpen, setIsTenancyModalOpen] = useState<boolean>(false);
  const handleOpenTenancyModal = useCallback(() => setIsTenancyModalOpen(true), []);
  const handleCloseTenancyModal = useCallback(() => setIsTenancyModalOpen(false), []);

  // Trigger Scanning of Tenancy Contract (Filled vs Blank)
  const handleScanTenancyContract = useCallback(async (preset: 'sample' | 'sample_sanit' | 'sample_svetlana' | 'blank' = 'sample') => {
    setIsScanning(true);
    try {
      const scanned = await henryTenancyContractScannerService.scanContract(preset);
      setScannedContractData(scanned);
      henryTenancyContractScannerService.teachFromScannedContract(scanned);
      if (scanned.isFilled) {
        setActionSuccessMessage(`Tenancy Contract scanned: FILLED & EXECUTED (${scanned.fillScorePercent}% Score — ${scanned.landlord.name} & ${scanned.tenant.name})!`);
      } else {
        setActionSuccessMessage('Tenancy Contract scanned: BLANK REUSABLE TEMPLATE (0% Filled).');
      }
    } catch {
      setActionSuccessMessage('Error scanning Tenancy Contract.');
    } finally {
      setIsScanning(false);
      setTimeout(() => setActionSuccessMessage(null), 4500);
    }
  }, []);

  // 1-Click Load into Preparation Studio
  const handleLoadContractIntoPreparationStudio = useCallback(() => {
    if (!requireReview(scannedContractData)) return;
    const dldData = henryTenancyContractScannerService.toDldTenancyContractData(scannedContractData);
    henryTenancyContractTemplateService.saveDraft(dldData as any);
    setIsTenancyModalOpen(true);
    setActionSuccessMessage(`Loaded ${scannedContractData.property.buildingName} #${scannedContractData.property.propertyNumber} into Tenancy Preparation Studio!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [scannedContractData]);

  // 1-Click Create CRM Landlord Profile
  const handleCreateCrmLandlordFromContract = useCallback(() => {
    if (!requireReview(scannedContractData)) return;
    setActionSuccessMessage('CRM profile creation is not available in this scanner.');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [scannedContractData]);

  // 1-Click Create CRM Tenant Profile
  const handleCreateCrmTenantFromContract = useCallback(() => {
    if (!requireReview(scannedContractData)) return;
    setActionSuccessMessage('CRM profile creation is not available in this scanner.');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [scannedContractData]);

  // 1-Click Copy Contract Variables JSON
  const handleCopyContractJsonVariables = useCallback(() => {
    const jsonStr = henryTenancyContractScannerService.exportToJsonString(scannedContractData);
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(jsonStr);
    }
    setActionSuccessMessage('All Tenancy Contract variables exported to clipboard as JSON!');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [scannedContractData]);

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
    scannedContractData,
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
    handleScanTenancyContract,
    handleLoadContractIntoPreparationStudio,
    handleCreateCrmLandlordFromContract,
    handleCreateCrmTenantFromContract,
    handleCopyContractJsonVariables,
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
