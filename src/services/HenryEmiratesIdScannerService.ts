/**
 * HenryEmiratesIdScannerService.ts — Emirates ID Optical & MRZ Extraction Engine (V6)
 *
 * Modular Architecture (< 350 lines per file per AEGIS V4.1 Law):
 * - types.ts: Type definitions, interfaces, and dictionaries
 * - samples.data.ts: Benchmark and sample datasets
 * - parser.logic.ts: ICAO TD1 MRZ & OCR text entity parser
 * - ocrEngine.logic.ts: Multi-page PDF rasterization & Tesseract OCR pipeline
 * - merger.logic.ts: Dual-side card merging & party/viewing converters
 */

import {
  ScanReview,
  VaultSaveOptions,
  canUseScan,
  saveReviewedScan,
  scanExpiry,
  validScanDate,
} from './henryScanReview';
import { ContractParty, ViewingFormPayload } from './HenryPdfEngineService';
import {
  EmiratesIdExtractedData,
  ID_LABELS,
  NATIONALITY_REGISTRY,
  PdfPageLimitError,
} from './emiratesId/types';
import {
  EMPTY_EMIRATES_ID,
  KHALIF_MOHAMEDNUR_IBRAHIM_EID_SAMPLE,
  MANSOOR_ALMARZOOQI_SAMPLE_EID,
  DEFAULT_VERIFIED_EID,
  ARSLAN_MALIK_SAMPLE_EID,
  SANIT_SINGH_SAMPLE_EID,
} from './emiratesId/samples.data';
import {
  detectDocumentSide,
  formatEmiratesId,
  resolveNationality,
  parseTD1Mrz,
  parseOcrText,
} from './emiratesId/parser.logic';
import { extractDocumentText } from './emiratesId/ocrEngine.logic';
import {
  mergeDualSideResults,
  toContractParty,
  toViewingClientPayload,
  exportToJson,
  exportToJsonString,
} from './emiratesId/merger.logic';

// Re-export all types and sample constants for 100% backward compatibility
export type { EmiratesIdExtractedData };
export {
  EMPTY_EMIRATES_ID,
  KHALIF_MOHAMEDNUR_IBRAHIM_EID_SAMPLE,
  MANSOOR_ALMARZOOQI_SAMPLE_EID,
  DEFAULT_VERIFIED_EID,
  ARSLAN_MALIK_SAMPLE_EID,
  SANIT_SINGH_SAMPLE_EID,
  ID_LABELS,
  NATIONALITY_REGISTRY,
  PdfPageLimitError,
};

export class HenryEmiratesIdScannerService {
  private cacheRevision = 0;
  private activeSessionCache: EmiratesIdExtractedData | null = null;
  private updateListeners: Set<(data: EmiratesIdExtractedData | null) => void> = new Set();

  setCachedEmiratesId(data: EmiratesIdExtractedData): void {
    if (!canUseScan(data)) {
      this.clearCachedEmiratesId();
      return;
    }
    this.cacheRevision += 1;
    this.activeSessionCache = structuredClone(data);
    this.notifyListeners(this.activeSessionCache);
  }

  getCachedEmiratesId(): EmiratesIdExtractedData | null {
    if (this.activeSessionCache) {
      if (!canUseScan(this.activeSessionCache)) {
        this.clearCachedEmiratesId();
        return null;
      }
      return {
        ...structuredClone(this.activeSessionCache),
        ...scanExpiry(this.activeSessionCache.expiryDate),
      };
    }
    return null;
  }

  clearCachedEmiratesId(): void {
    this.cacheRevision += 1;
    this.activeSessionCache = null;
    this.notifyListeners(null);
  }

  onEmiratesIdUpdated(listener: (data: EmiratesIdExtractedData | null) => void): () => void {
    this.updateListeners.add(listener);
    return () => this.updateListeners.delete(listener);
  }

  private notifyListeners(data: EmiratesIdExtractedData | null): void {
    for (const fn of this.updateListeners) {
      try {
        fn(data ? structuredClone(data) : null);
      } catch {}
    }
  }

  detectDocumentSide(textOrFileName: string): 'front' | 'back' | 'both' {
    return detectDocumentSide(textOrFileName);
  }

  formatEmiratesId(rawNumber: string): string {
    return formatEmiratesId(rawNumber);
  }

  resolveNationality(input: string): { en: string; ar: string; code: string } {
    return resolveNationality(input);
  }

  parseTD1Mrz(line1: string, line2: string, line3: string): Partial<EmiratesIdExtractedData> {
    return parseTD1Mrz(line1, line2, line3);
  }

  async extractDocumentText(
    file: File,
    onProgress?: (progress: number) => void,
    coverage?: (text: string) => number
  ): Promise<{ ocrText: string; streamText: string; ocrConfidence?: number; warnings?: string[] }> {
    return extractDocumentText(file, onProgress, coverage);
  }

  parseOcrText(rawText: string, fileName: string): Partial<EmiratesIdExtractedData> {
    return parseOcrText(rawText, fileName);
  }

  async scanEmiratesId(
    fileOrPreset?:
      | File
      | 'sample'
      | 'sample_khalif'
      | 'sample_mansoor'
      | 'sample_arslan'
      | 'sample_sanit',
    onProgress?: (progress: number) => void
  ): Promise<EmiratesIdExtractedData> {
    if (!fileOrPreset) throw new Error('Upload a document to scan.');
    if (typeof fileOrPreset === 'string') {
      const sample =
        fileOrPreset === 'sample_khalif'
          ? KHALIF_MOHAMEDNUR_IBRAHIM_EID_SAMPLE
          : fileOrPreset === 'sample_mansoor'
            ? MANSOOR_ALMARZOOQI_SAMPLE_EID
            : fileOrPreset === 'sample_sanit'
              ? SANIT_SINGH_SAMPLE_EID
              : ARSLAN_MALIK_SAMPLE_EID;
      return { ...sample, demoOnly: true, reviewConfirmed: false };
    }
    const file = fileOrPreset as File;
    if (
      !['image/png', 'image/jpeg', 'application/pdf'].includes(file.type) ||
      file.size > 10 * 1024 * 1024 ||
      !file.size
    )
      throw new Error('Use a PNG, JPEG or PDF under 10 MB.');

    const { ocrText, streamText, ocrConfidence, warnings } = await this.extractDocumentText(
      file,
      onProgress
    );
    const combinedRawText = `${ocrText}\n${streamText}`;
    if (!combinedRawText.trim())
      throw new Error(
        'No readable text. Rescan with good lighting and all document edges visible.'
      );
    const parsed = this.parseOcrText(combinedRawText, '');
    if (parsed.diagnostics) {
      parsed.diagnostics.ocrConfidence = ocrConfidence;
      parsed.diagnostics.warnings.push(...(warnings || []));
    }
    const missingFields = [
      !/^784-\d{4}-\d{7}-\d$/.test(parsed.idNumber || '') && 'idNumber',
      !parsed.fullNameEn?.trim() && 'fullNameEn',
      !validScanDate(parsed.expiryDate || '') && 'expiryDate',
    ].filter((value): value is string => !!value);
    const result: EmiratesIdExtractedData = {
      ...EMPTY_EMIRATES_ID,
      ...parsed,
      rawIdNumber: (parsed.idNumber || '').replace(/\D/g, ''),
      ...scanExpiry(parsed.expiryDate || ''),
      rawOcrText: combinedRawText,
      ocrEngine: 'Tesseract + PDF text',
      confidenceScore: 0,
      detectedFieldsCount: Object.values(parsed.diagnostics?.fields || {}).filter(
        field => field.state === 'extracted'
      ).length,
      missingFields,
      reviewConfirmed: false,
      demoOnly: false,
      scannedAt: new Date().toISOString(),
      scannedSide: this.detectDocumentSide(combinedRawText),
      documentFormat: file.type,
    };
    if (onProgress) onProgress(100);
    return result;
  }

  async scanDocument(
    fileOrPreset?:
      | File
      | 'sample'
      | 'sample_khalif'
      | 'sample_mansoor'
      | 'sample_arslan'
      | 'sample_sanit',
    onProgress?: (progress: number) => void
  ): Promise<EmiratesIdExtractedData> {
    return this.scanEmiratesId(fileOrPreset, onProgress);
  }

  async scanDualSide(
    frontFile: File,
    backFile: File,
    onProgress?: (progress: number) => void
  ): Promise<EmiratesIdExtractedData> {
    if (onProgress) onProgress(15);
    const [frontResult, backResult] = await Promise.all([
      this.scanEmiratesId(frontFile, p => onProgress && onProgress(Math.round(p * 0.45))),
      this.scanEmiratesId(backFile, p => onProgress && onProgress(Math.round(45 + p * 0.45))),
    ]);
    const merged = mergeDualSideResults(frontResult, backResult, frontFile, backFile);
    if (onProgress) onProgress(100);
    return merged;
  }

  getDemoExtractedData(): EmiratesIdExtractedData {
    return {
      ...ARSLAN_MALIK_SAMPLE_EID,
      scannedAt: new Date().toISOString(),
      demoOnly: true,
      reviewConfirmed: false,
    };
  }

  getIndianClientDemoData(): EmiratesIdExtractedData {
    return {
      ...SANIT_SINGH_SAMPLE_EID,
      scannedAt: new Date().toISOString(),
      demoOnly: true,
      reviewConfirmed: false,
    };
  }

  getIbrahimSirajDemoData(): EmiratesIdExtractedData {
    return {
      ...DEFAULT_VERIFIED_EID,
      scannedAt: new Date().toISOString(),
      demoOnly: true,
      reviewConfirmed: false,
    };
  }

  toContractParty(extracted: EmiratesIdExtractedData, phone = '', email = ''): ContractParty {
    return toContractParty(extracted, phone, email);
  }

  toViewingClientPayload(
    extracted: EmiratesIdExtractedData,
    base: Partial<ViewingFormPayload> = {}
  ): Partial<ViewingFormPayload> {
    return toViewingClientPayload(extracted, base);
  }

  exportToJson(extracted?: EmiratesIdExtractedData): Record<string, any> {
    const target = extracted || this.getCachedEmiratesId() || EMPTY_EMIRATES_ID;
    return exportToJson(target);
  }

  exportToJsonString(extracted?: EmiratesIdExtractedData): string {
    const target = extracted || this.getCachedEmiratesId() || EMPTY_EMIRATES_ID;
    return exportToJsonString(target);
  }

  async saveToDatabase(
    extracted?: EmiratesIdExtractedData,
    options?: VaultSaveOptions
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    const data = extracted || this.getCachedEmiratesId();
    if (!data) return { success: false, error: 'No reviewed document.' };
    const revision = this.cacheRevision;
    const result = await saveReviewedScan(
      'emirates_id',
      data,
      data.idNumber,
      data.fullNameEn,
      options
    );
    if (result.success && revision === this.cacheRevision) this.setCachedEmiratesId(data);
    return result;
  }
}

export const henryEmiratesIdScannerService = new HenryEmiratesIdScannerService();
export default henryEmiratesIdScannerService;
