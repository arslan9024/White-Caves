import { useState, useEffect, useRef } from 'react';
import henryEmiratesIdScannerService, {
  EmiratesIdExtractedData,
  EMPTY_EMIRATES_ID,
} from '../../../../services/HenryEmiratesIdScannerService';
import {
  assessScanReadiness,
  canUseScan,
  scanExpiry,
  validScanDate,
  VaultSaveOptions,
} from '../../../../services/henryScanReview';
import { markFieldReviewed } from '../../../../services/henryDocumentParsing';
import { snapshotBenchmarkValues, type BenchmarkValues } from '../../../../services/henryBenchmark';
import type { DriveImport } from '../../../../services/henryDrive';
import { useDriveScannerIntake } from './useDriveScannerIntake';

export function useHenryEmiratesIdScannerLogic(importedSource?: DriveImport) {
  const [uploaderReset, setUploaderReset] = useState(0);
  const [archiveReset, setArchiveReset] = useState(0);
  const [scannerValues, setScannerValues] = useState<Readonly<BenchmarkValues>>();
  const [extractedData, setExtractedData] = useState<EmiratesIdExtractedData>(() => {
    return henryEmiratesIdScannerService.getCachedEmiratesId() || EMPTY_EMIRATES_ID;
  });
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const scanGeneration = useRef<number>(0);
  const scanInputs = useRef<{ front?: File; back?: File }>({});
  useEffect(() => {
    if (!frontFile) delete scanInputs.current.front;
    if (!backFile) delete scanInputs.current.back;
  }, [frontFile, backFile]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [activeSideView, setActiveSideView] = useState<'front' | 'back'>('front');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  useEffect(() => {
    if (!canUseScan(extractedData)) henryEmiratesIdScannerService.clearCachedEmiratesId();
  }, [extractedData]);

  useEffect(() => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      setFilePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFilePreviewUrl(null);
    }
  }, [uploadedFile]);

  const handleFileUpload = async (file: File, original: File = file) => {
    const generation = ++scanGeneration.current;
    setVaultOptions({});
    setArchiveReset(previous => previous + 1);
    setIsScanning(true);
    setScannerValues(undefined);
    setExtractedData(EMPTY_EMIRATES_ID);
    henryEmiratesIdScannerService.clearCachedEmiratesId();
    setUploadedFile(original);
    setStatusMsg(`⚡ Henry AI reading "${file.name}" in real-time...`);

    try {
      const front =
        activeSideView === 'front'
          ? file
          : frontFile
            ? scanInputs.current.front || frontFile
            : null;
      const back =
        activeSideView === 'back' ? file : backFile ? scanInputs.current.back || backFile : null;
      scanInputs.current[activeSideView] = file;
      if (activeSideView === 'front') setFrontFile(original);
      else setBackFile(original);
      const data =
        front && back
          ? await henryEmiratesIdScannerService.scanDualSide(front, back)
          : await henryEmiratesIdScannerService.scanEmiratesId(file);
      if (generation !== scanGeneration.current) return;
      setScannerValues(snapshotBenchmarkValues(data));
      setExtractedData(data);
      if (data.scannedSide === 'back') {
        setActiveSideView('back');
      }
      setStatusMsg(`✓ Extracted candidate fields for review from "${file.name}"!`);
    } catch (error) {
      if (generation === scanGeneration.current)
        setStatusMsg(error instanceof Error ? error.message : 'Error processing Emirates ID scan.');
    } finally {
      if (generation === scanGeneration.current) {
        setIsScanning(false);
        setTimeout(() => {
          if (generation === scanGeneration.current) setStatusMsg(null);
        }, 4000);
      }
    }
  };

  useDriveScannerIntake(importedSource, handleFileUpload);

  const handleLoadDemo = () => {
    setVaultOptions({});
    setArchiveReset(previous => previous + 1);
    setUploaderReset(previous => previous + 1);
    setScannerValues(undefined);
    scanGeneration.current++;
    setIsScanning(false);
    henryEmiratesIdScannerService.clearCachedEmiratesId();
    setFrontFile(null);
    setBackFile(null);
    setUploadedFile(null);
    const demo = henryEmiratesIdScannerService.getDemoExtractedData();
    setExtractedData(demo);
    setStatusMsg(`✓ Loaded benchmark Emirates ID: ${demo.fullNameEn}`);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleUpdateField = (
    field: keyof EmiratesIdExtractedData,
    val: EmiratesIdExtractedData[keyof EmiratesIdExtractedData]
  ) => {
    henryEmiratesIdScannerService.clearCachedEmiratesId();
    setExtractedData(prev => {
      const updated = { ...prev, [field]: val, reviewConfirmed: false };
      updated.diagnostics = markFieldReviewed(prev.diagnostics, field, val);
      updated.missingFields = [
        !/^784-\d{4}-\d{7}-\d$/.test(updated.idNumber) && 'idNumber',
        !updated.fullNameEn.trim() && 'fullNameEn',
        !validScanDate(updated.expiryDate) && 'expiryDate',
      ].filter((value): value is string => !!value);
      Object.assign(updated, scanExpiry(updated.expiryDate));

      return updated;
    });
  };

  const handleSaveToVault = async () => {
    if (!canUseScan(extractedData) || isScanning) return;
    const generation = scanGeneration.current;
    const sources = [frontFile, backFile].filter((file): file is File => !!file);
    if (!sources.length) {
      setStatusMsg('Upload an original before archival. Suggestions alone cannot be archived.');
      return;
    }
    const result = await henryEmiratesIdScannerService.saveToDatabase(extractedData, {
      ...vaultOptions,
      ...(importedSource && sources.includes(importedSource.file)
        ? { driveOrigin: importedSource.driveOrigin }
        : {}),
      sources,
    });
    if (generation !== scanGeneration.current) return;
    if (result.success) setVaultOptions(previous => ({ ...previous, replacesId: undefined }));
    setStatusMsg(
      result.success ? 'Reviewed record saved to encrypted vault.' : result.error || 'Save failed.'
    );
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleAutoFillAsTenant = () => {
    if (!canUseScan(extractedData) || isScanning) return;
    henryEmiratesIdScannerService.setCachedEmiratesId(extractedData);
    setStatusMsg(
      `Reviewed fields available to Tenancy Contract: ${extractedData.fullNameEn} (${extractedData.idNumber}) as Tenant!`
    );
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleAutoFillAsLandlord = () => {
    if (!canUseScan(extractedData) || isScanning) return;
    henryEmiratesIdScannerService.setCachedEmiratesId(extractedData);
    setStatusMsg(
      `Reviewed fields available to Tenancy Contract: ${extractedData.fullNameEn} (${extractedData.idNumber}) as Landlord/Owner!`
    );
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleDiscard = () => {
    setVaultOptions({});
    setArchiveReset(previous => previous + 1);
    setUploaderReset(previous => previous + 1);
    setScannerValues(undefined);
    scanGeneration.current++;
    setIsScanning(false);
    setFrontFile(null);
    setBackFile(null);
    setUploadedFile(null);
    henryEmiratesIdScannerService.clearCachedEmiratesId();
    setExtractedData(EMPTY_EMIRATES_ID);
    setStatusMsg('Scan a document to begin.');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
    setCopiedJson(true);
    setStatusMsg('Copied all extracted variables JSON to clipboard!');
    setTimeout(() => {
      setCopiedJson(false);
      setStatusMsg(null);
    }, 2500);
  };

  const [vaultOptions, setVaultOptions] = useState<VaultSaveOptions>({});
  const readiness = assessScanReadiness(extractedData);

  return {
    uploaderReset,
    setUploaderReset,
    archiveReset,
    setArchiveReset,
    scannerValues,
    setScannerValues,
    extractedData,
    setExtractedData,
    frontFile,
    setFrontFile,
    backFile,
    setBackFile,
    uploadedFile,
    setUploadedFile,
    filePreviewUrl,
    setFilePreviewUrl,
    activeSideView,
    setActiveSideView,
    isScanning,
    setIsScanning,
    zoomLevel,
    setZoomLevel,
    statusMsg,
    setStatusMsg,
    copiedJson,
    setCopiedJson,
    scanGeneration,
    vaultOptions,
    setVaultOptions,
    readiness,
    handleFileUpload,
    handleLoadDemo,
    handleUpdateField,
    handleSaveToVault,
    handleAutoFillAsTenant,
    handleAutoFillAsLandlord,
    handleDiscard,
    handleCopyJson,
  };
}

export type HenryEmiratesIdScannerLogicReturn = ReturnType<typeof useHenryEmiratesIdScannerLogic>;
