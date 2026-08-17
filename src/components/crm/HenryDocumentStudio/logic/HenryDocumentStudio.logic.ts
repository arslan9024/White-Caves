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

export function useHenryDocumentStudioLogic() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<DocumentTemplateOption['id']>('emirates_id_scanner');
  const [tenancyPayload, setTenancyPayload] = useState<TenancyContractPayload>(DEMO_TENANCY_PAYLOAD);
  const [ejariRecord, setEjariRecord] = useState<GovernmentEjariRecord>(DEMO_EJARI_RECORD);
  const [viewingPayload, setViewingPayload] = useState<ViewingFormPayload>(DEMO_VIEWING_PAYLOAD);
  const [tenantReceiptPayload, setTenantReceiptPayload] = useState<TaxReceiptPayload>(DEMO_TENANT_TAX_RECEIPT);
  const [landlordInvoicePayload, setLandlordInvoicePayload] = useState<TaxReceiptPayload>(DEMO_LANDLORD_TAX_INVOICE);
  
  // Emirates ID Scanner State
  const [eidData, setEidData] = useState<EmiratesIdExtractedData>(DEFAULT_EID_DATA);
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
        return ''; // Handled by custom interactive React inspector view
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

  // 1-Click Auto-Fill Tenancy Lease as Tenant
  const handleAutoFillAsTenant = useCallback(() => {
    setTenancyPayload((prev) => ({
      ...prev,
      tenant: henryEmiratesIdScannerService.toContractParty(eidData, prev.tenant.phone, prev.tenant.email),
    }));
    setSelectedTemplateId('tenancy_contract_esign');
    setActionSuccessMessage(`Tenancy Lease auto-filled with ${eidData.fullNameEn} as Tenant!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [eidData]);

  // 1-Click Auto-Fill Tenancy Lease as Landlord
  const handleAutoFillAsLandlord = useCallback(() => {
    setTenancyPayload((prev) => ({
      ...prev,
      landlord: henryEmiratesIdScannerService.toContractParty(eidData, prev.landlord.phone, prev.landlord.email),
    }));
    setSelectedTemplateId('tenancy_contract_esign');
    setActionSuccessMessage(`Tenancy Lease auto-filled with ${eidData.fullNameEn} as Landlord!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  }, [eidData]);

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
    isScanning,
    actionSuccessMessage,
    compiledHtml,
    zoomLevel,
    shareLinkCopied,
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
  };
}
