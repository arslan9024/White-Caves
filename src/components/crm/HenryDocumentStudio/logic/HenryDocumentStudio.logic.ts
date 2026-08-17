/**
 * HenryDocumentStudio.logic.ts — Hook & State Management Layer
 */

import { useState, useMemo, useCallback } from 'react';
import {
  DOCUMENT_TEMPLATES,
  DEMO_TENANCY_PAYLOAD,
  DEMO_EJARI_RECORD,
  DEMO_VIEWING_PAYLOAD,
  DEMO_TAX_RECEIPT,
  DocumentTemplateOption,
} from '../data/HenryDocumentStudio.data';
import henryPdfEngineService, {
  TenancyContractPayload,
  GovernmentEjariRecord,
  ViewingFormPayload,
  TaxReceiptPayload,
  PdfAnnotation,
} from '../../../../services/HenryPdfEngineService';

export function useHenryDocumentStudioLogic() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<DocumentTemplateOption['id']>('tenancy_contract_esign');
  const [tenancyPayload, setTenancyPayload] = useState<TenancyContractPayload>(DEMO_TENANCY_PAYLOAD);
  const [ejariRecord, setEjariRecord] = useState<GovernmentEjariRecord>(DEMO_EJARI_RECORD);
  const [viewingPayload, setViewingPayload] = useState<ViewingFormPayload>(DEMO_VIEWING_PAYLOAD);
  const [taxReceiptPayload, setTaxReceiptPayload] = useState<TaxReceiptPayload>(DEMO_TAX_RECEIPT);
  
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
      case 'tax_receipt_vat':
        return henryPdfEngineService.generateTaxReceiptHtml(taxReceiptPayload);
      default:
        return henryPdfEngineService.generateTenancyContractHtml(tenancyPayload, annotations);
    }
  }, [selectedTemplateId, tenancyPayload, ejariRecord, viewingPayload, taxReceiptPayload, annotations]);

  const handlePrint = useCallback(() => {
    henryPdfEngineService.triggerPrint(compiledHtml);
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
    // 1-Click AI Auto-Fill simulating instant CRM synchronization
    setViewingPayload((prev) => ({
      ...prev,
      clientName: 'Alexander Wright',
      clientPhone: '+971 52 987 6543',
      viewingTime: '18:00 PM',
      feedbackNotes: 'AI AUTO-FILLED: Client requested Form B buyer mandate and draft tenancy lease.',
    }));
  }, []);

  return {
    templates: DOCUMENT_TEMPLATES,
    selectedTemplateId,
    setSelectedTemplateId,
    tenancyPayload,
    setTenancyPayload,
    ejariRecord,
    viewingPayload,
    taxReceiptPayload,
    compiledHtml,
    zoomLevel,
    shareLinkCopied,
    handlePrint,
    handleZoomIn,
    handleZoomOut,
    handleCopyEsignLink,
    handleTriggerAiAutoFill,
  };
}
