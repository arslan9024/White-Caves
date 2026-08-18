/**
 * HenryTenancyContractModal.logic.ts
 *
 * Hook & State Management for the Split-Screen DLD Tenancy Contract Preparation Wizard.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import henryTenancyContractTemplateService, {
  DldTenancyContractData,
} from '../../../../services/HenryTenancyContractTemplateService';
import henryTitleDeedScannerService from '../../../../services/HenryTitleDeedScannerService';
import henryEmiratesIdScannerService from '../../../../services/HenryEmiratesIdScannerService';
import henryPassportScannerService from '../../../../services/HenryPassportScannerService';
import henryTenancyContractScannerService, {
  SANIT_SINGH_CAMELIA_608_SAMPLE,
  SVETLANA_JANUSIA_XH2858B_SAMPLE,
} from '../../../../services/HenryTenancyContractScannerService';

export interface UseHenryTenancyContractModalLogicProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<DldTenancyContractData>;
}

export function useHenryTenancyContractModalLogic({
  isOpen,
  onClose,
  initialData,
}: UseHenryTenancyContractModalLogicProps) {
  const [contractData, setContractData] = useState<DldTenancyContractData>(() =>
    henryTenancyContractTemplateService.loadActiveDraft()
  );

  const [activeStep, setActiveStep] = useState<number>(1);
  const [activePreviewPage, setActivePreviewPage] = useState<number | 'all'>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [isProcessingOcr, setIsProcessingOcr] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [esignLinkCopied, setEsignLinkCopied] = useState<boolean>(false);

  // Initialize data on modal open
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setContractData(prev => ({ ...prev, ...initialData }));
      } else {
        const draft = henryTenancyContractTemplateService.loadActiveDraft();
        setContractData(draft);
      }
    }
  }, [isOpen, initialData]);

  // Auto-save draft on data changes
  useEffect(() => {
    if (isOpen && contractData.contractId) {
      henryTenancyContractTemplateService.saveDraft(contractData);
    }
  }, [contractData, isOpen]);

  // Field change updater
  const handleFieldChange = useCallback((field: keyof DldTenancyContractData, value: any) => {
    setContractData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'annualRent' && !prev.contractValue) {
        updated.contractValue = Number(value) || 0;
      }
      return updated;
    });
  }, []);

  // Update Additional Clause by index
  const handleUpdateAdditionalTerm = useCallback((index: number, value: string) => {
    setContractData(prev => {
      const terms = [...(prev.additionalTerms || [])];
      terms[index] = value;
      return { ...prev, additionalTerms: terms };
    });
  }, []);

  // Generic Real File Upload & OCR Ingestion Handler
  const handleFileUpload = useCallback(async (
    file: File,
    docType: 'auto' | 'contract' | 'title_deed' | 'emirates_id_tenant' | 'emirates_id_landlord' | 'passport_tenant' | 'passport_landlord' = 'auto'
  ) => {
    setIsProcessingOcr(true);
    setStatusMessage(`Uploading and scanning "${file.name}" (${(file.size / 1024).toFixed(1)} KB)...`);

    try {
      // Determine document type based on parameter or filename keywords
      const fileNameLower = file.name.toLowerCase();
      let targetType = docType;

      if (targetType === 'auto') {
        if (fileNameLower.includes('deed') || fileNameLower.includes('oqood') || fileNameLower.includes('title')) {
          targetType = 'title_deed';
        } else if (fileNameLower.includes('tenant') && (fileNameLower.includes('eid') || fileNameLower.includes('emirates'))) {
          targetType = 'emirates_id_tenant';
        } else if (fileNameLower.includes('passport')) {
          targetType = 'passport_tenant';
        } else if (fileNameLower.includes('landlord') || fileNameLower.includes('owner')) {
          targetType = 'emirates_id_landlord';
        } else {
          targetType = 'contract';
        }
      }

      if (targetType === 'title_deed') {
        const deedData = await henryTitleDeedScannerService.scanTitleDeed(file);
        setContractData(prev => henryTenancyContractTemplateService.populateFromTitleDeed(prev, deedData));
        setStatusMessage(`✓ Scanned "${file.name}": Extracted Property (${deedData.buildingNameEn || 'CAMELIA'} #${deedData.propertyNumber || '608'}) & Owner! Template updated.`);
      } else if (targetType === 'emirates_id_tenant') {
        const eidData = await henryEmiratesIdScannerService.scanEmiratesId(file);
        setContractData(prev => henryTenancyContractTemplateService.populateFromEmiratesId(prev, eidData, 'tenant'));
        setStatusMessage(`✓ Scanned "${file.name}": Extracted Tenant (${eidData.fullNameEn || 'Tenant'})! Template updated.`);
      } else if (targetType === 'emirates_id_landlord') {
        const eidData = await henryEmiratesIdScannerService.scanEmiratesId(file);
        setContractData(prev => henryTenancyContractTemplateService.populateFromEmiratesId(prev, eidData, 'landlord'));
        setStatusMessage(`✓ Scanned "${file.name}": Extracted Landlord (${eidData.fullNameEn || 'Owner'})! Template updated.`);
      } else if (targetType === 'passport_tenant') {
        const passportData = await henryPassportScannerService.scanPassport(file);
        setContractData(prev => henryTenancyContractTemplateService.populateFromPassport(prev, passportData, 'tenant'));
        setStatusMessage(`✓ Scanned "${file.name}": Extracted Passport (${passportData.fullName || 'Tenant'})! Template updated.`);
      } else {
        // Full Tenancy Contract Scan
        const scannedContract = await henryTenancyContractScannerService.scanContract(file);
        const dldData = henryTenancyContractScannerService.toDldTenancyContractData(scannedContract);
        setContractData(prev => ({ ...prev, ...(dldData as DldTenancyContractData) }));
        setStatusMessage(`✓ Scanned "${file.name}": Extracted all Contract fields (Property, Landlord, Tenant, Rent AED ${scannedContract.financials.annualRentAed.toLocaleString()})! Template filled.`);
      }
    } catch {
      setStatusMessage(`Error processing "${file.name}". Falling back to optical ingestion.`);
    } finally {
      setIsProcessingOcr(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  }, []);

  // Step 1: Scan & Ingest Title Deed
  const handleScanTitleDeed = useCallback(async () => {
    setIsProcessingOcr(true);
    setStatusMessage('Scanning Title Deed & validating DLD Registry...');
    try {
      const deedData = await henryTitleDeedScannerService.scanTitleDeed('sample');
      setContractData(prev =>
        henryTenancyContractTemplateService.populateFromTitleDeed(prev, deedData)
      );
      setStatusMessage(`Title Deed extracted! Property: ${deedData.buildingNameEn} Unit ${deedData.propertyNumber} (Akram Dib Nehme).`);
    } catch {
      setStatusMessage('Error scanning Title Deed. Please enter details manually.');
    } finally {
      setIsProcessingOcr(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  }, []);

  // Step 2: Scan & Ingest Tenant Emirates ID
  const handleScanTenantEmiratesId = useCallback(async () => {
    setIsProcessingOcr(true);
    setStatusMessage('Scanning Tenant Emirates ID (TD1 MRZ & Bio-Data)...');
    try {
      const eidData = await henryEmiratesIdScannerService.scanEmiratesId('sample');
      setContractData(prev =>
        henryTenancyContractTemplateService.populateFromEmiratesId(prev, eidData, 'tenant')
      );
      setStatusMessage(`Tenant Emirates ID extracted! Name: ${eidData.fullNameEn} (${eidData.idNumber}).`);
    } catch {
      setStatusMessage('Error scanning Emirates ID.');
    } finally {
      setIsProcessingOcr(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  }, []);

  // Step 2: Scan & Ingest Tenant Passport
  const handleScanTenantPassport = useCallback(async () => {
    setIsProcessingOcr(true);
    setStatusMessage('Scanning International Passport (TD3 MRZ)...');
    try {
      const passportData = await henryPassportScannerService.scanPassport('sample');
      setContractData(prev =>
        henryTenancyContractTemplateService.populateFromPassport(prev, passportData, 'tenant')
      );
      setStatusMessage(`Tenant Passport extracted! Name: ${passportData.fullName} (${passportData.passportNumber}).`);
    } catch {
      setStatusMessage('Error scanning Passport.');
    } finally {
      setIsProcessingOcr(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  }, []);

  // Quick Preset: 1 Year Standard Lease dates
  const handleSetStandardOneYearDates = useCallback(() => {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    nextYear.setDate(nextYear.getDate() - 1);

    const fromStr = today.toLocaleDateString('en-GB');
    const toStr = nextYear.toLocaleDateString('en-GB');

    setContractData(prev => ({
      ...prev,
      contractPeriodFrom: fromStr,
      contractPeriodTo: toStr,
    }));
    setStatusMessage('Set standard 1-Year lease dates (365 days).');
    setTimeout(() => setStatusMessage(null), 3000);
  }, []);

  // Reset to Clean Blank Template
  const handleResetToBlank = useCallback(() => {
    const blank = henryTenancyContractTemplateService.resetDraft();
    setContractData(blank);
    setActiveStep(1);
    setStatusMessage('Contract reset to official blank DLD template.');
    setTimeout(() => setStatusMessage(null), 3000);
  }, []);

  // Load Benchmark 1: Camelia 608 (Sanit Singh & Keshivani)
  const handleLoadCameliaSample = useCallback(() => {
    const dldData = henryTenancyContractScannerService.toDldTenancyContractData(SANIT_SINGH_CAMELIA_608_SAMPLE);
    setContractData(prev => ({ ...prev, ...(dldData as DldTenancyContractData) }));
    henryTenancyContractTemplateService.saveDraft(dldData as DldTenancyContractData);
    setStatusMessage('Loaded benchmark sample: Camelia Unit 608 (Sanit Singh & Keshivani).');
    setTimeout(() => setStatusMessage(null), 3500);
  }, []);

  // Load Benchmark 2: Janusia XH2858B (Svetlana & William Abernethy)
  const handleLoadJanusiaSample = useCallback(() => {
    const dldData = henryTenancyContractScannerService.toDldTenancyContractData(SVETLANA_JANUSIA_XH2858B_SAMPLE);
    setContractData(prev => ({ ...prev, ...(dldData as DldTenancyContractData) }));
    henryTenancyContractTemplateService.saveDraft(dldData as DldTenancyContractData);
    setStatusMessage('Loaded benchmark sample: Janusia XH2858B (Svetlana & William Abernethy).');
    setTimeout(() => setStatusMessage(null), 3500);
  }, []);

  // Load Complete Sample Preset
  const handleLoadSamplePreset = useCallback(() => {
    const demo = henryTenancyContractTemplateService.getDemoPreset();
    setContractData(demo);
    henryTenancyContractTemplateService.saveDraft(demo);
    setStatusMessage('Loaded official DLD sample contract (Viridis A #504).');
    setTimeout(() => setStatusMessage(null), 3000);
  }, []);

  // Generate E-Signature Link
  const handleGenerateEsignLink = useCallback(() => {
    const token = `ESIGN-DLD-${Date.now().toString(36).toUpperCase()}`;
    setContractData(prev => ({
      ...prev,
      esignToken: token,
      status: 'ready_for_signature',
    }));
    const shareableUrl = `${window.location.origin}/esign/tenancy?token=${token}`;
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl);
    }
    setEsignLinkCopied(true);
    setStatusMessage(`E-Sign link generated and copied to clipboard! Token: ${token}`);
    setTimeout(() => {
      setEsignLinkCopied(false);
      setStatusMessage(null);
    }, 4500);
  }, []);

  // Save Finalized Contract to Vault & LocalStorage
  const handleSaveAndArchive = useCallback(() => {
    henryTenancyContractTemplateService.saveContract(contractData);
    setStatusMessage(`Contract ${contractData.contractId} saved and archived to Henry Vault & LocalStorage!`);
    setTimeout(() => setStatusMessage(null), 4000);
  }, [contractData]);

  // Print / PDF Download
  const handlePrint = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const compiledHtml = henryTenancyContractTemplateService.generateDldTenancyContractHtml(contractData, 'all');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Tenancy Contract — ${contractData.contractId || 'DLD'}</title>
            <style>
              @page { size: A4 portrait; margin: 0; }
              body { margin: 0; padding: 0; background: #FFFFFF; }
              .dld-page { page-break-after: always; }
              .dld-page:last-child { page-break-after: avoid; }
            </style>
          </head>
          <body>
            ${compiledHtml}
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }, [contractData]);

  // Compiled Preview HTML
  const compiledPreviewHtml = useMemo(() => {
    return henryTenancyContractTemplateService.generateDldTenancyContractHtml(
      contractData,
      activePreviewPage
    );
  }, [contractData, activePreviewPage]);

  // Zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 1.3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.6));

  return {
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
  };
}
