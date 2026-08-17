/**
 * HenryDocumentStudio.logic.ts — Hook & State Management Layer
 */

import { useState, useMemo, useCallback } from 'react';
import { DOCUMENT_TEMPLATES, DEMO_EJARI_PAYLOAD, DocumentTemplateOption } from '../data/HenryDocumentStudio.data';
import henryPdfEngineService, { EjariContractPayload, PdfAnnotation } from '../../../../services/HenryPdfEngineService';

export function useHenryDocumentStudioLogic() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<DocumentTemplateOption['id']>('ejari_form7');
  const [contractPayload, setContractPayload] = useState<EjariContractPayload>(DEMO_EJARI_PAYLOAD);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isWatermarkEnabled, setIsWatermarkEnabled] = useState<boolean>(true);
  const [annotations, setAnnotations] = useState<PdfAnnotation[]>([]);

  // Generate real-time HTML string based on selected template
  const compiledHtml = useMemo(() => {
    switch (selectedTemplateId) {
      case 'ejari_form7':
        return henryPdfEngineService.generateEjariContractHtml(contractPayload, annotations);
      case 'legal_notice_form12':
        return henryPdfEngineService.generateForm12LegalNoticeHtml(
          contractPayload.contractNumber,
          `${contractPayload.unitNumber}, ${contractPayload.community}`,
          contractPayload.landlord.name,
          contractPayload.tenant.name,
          'sale',
          '31/08/2027'
        );
      case 'dld_form_a':
      case 'dld_form_b':
      case 'contractor_work_order':
      default:
        return henryPdfEngineService.generateEjariContractHtml(contractPayload, annotations);
    }
  }, [selectedTemplateId, contractPayload, annotations]);

  const handlePrint = useCallback(() => {
    henryPdfEngineService.triggerPrint(compiledHtml);
  }, [compiledHtml]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 15, 175));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 15, 60));
  }, []);

  const handleAddAnnotation = useCallback((type: PdfAnnotation['type'], content: string) => {
    const newAnnotation: PdfAnnotation = {
      id: `ann-${Date.now()}`,
      pageNumber: 1,
      type,
      content,
      x: 50,
      y: 50,
    };
    setAnnotations((prev) => [...prev, newAnnotation]);
  }, []);

  return {
    templates: DOCUMENT_TEMPLATES,
    selectedTemplateId,
    setSelectedTemplateId,
    contractPayload,
    setContractPayload,
    compiledHtml,
    zoomLevel,
    isWatermarkEnabled,
    setIsWatermarkEnabled,
    handlePrint,
    handleZoomIn,
    handleZoomOut,
    handleAddAnnotation,
  };
}
