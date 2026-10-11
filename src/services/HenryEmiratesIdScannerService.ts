/**
 * HenryEmiratesIdScannerService.ts — Emirates ID Optical & MRZ Extraction Engine (V6)
 *
 * Dedicated extraction engine for UAE Resident Identity Cards:
 * 1. Direct PDF Text Stream + Multi-page High-Res Canvas Rasterization via pdfjs-dist.
 * 2. Optical Image Pre-Processing (adaptive upscaling, grayscale binarization).
 * 3. Client-Side Optical Character Recognition (Tesseract.js v5) with real-time telemetry.
 * 4. Official ICAO 9303 TD1 MRZ Parser with check-digit validation.
 * 5. Bilingual Layout Entity Parser (ID Number, Card No, Names EN/AR, DOB, Expiry, Employer, Occupation).
 */

import { parse as parseMrz } from 'mrz';
import {
  ScanReview,
  VaultSaveOptions,
  canUseScan,
  saveReviewedScan,
  scanExpiry,
  validScanDate,
} from './henryScanReview';
import logger from '../utils/logger';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { ContractParty, ViewingFormPayload } from './HenryPdfEngineService';
import {
  languageValue,
  normalizeDocumentDate,
  normalizeDocumentText,
  readDocumentFields,
  refreshCoverage,
} from './henryDocumentParsing';

const ID_LABELS: Record<string, string[]> = {
  idNumber: ['ID Number', 'Identity Number', 'رقم الهوية'],
  cardNumber: ['Card Number', 'Card No.', 'رقم البطاقة'],
  chipNumber: ['Chip Number', 'رقم الشريحة'],
  fullName: ['Full Name', 'Name', 'الاسم', 'الاسم الكامل'],
  dateOfBirth: ['Date of Birth', 'Birth Date', 'تاريخ الميلاد'],
  issueDate: ['Issue Date', 'Issuing Date', 'Date of Issue', 'تاريخ الإصدار', 'تاريخ الاصدار'],
  expiryDate: ['Expiry Date', 'Expiration Date', 'Date of Expiry', 'تاريخ الانتهاء'],
  nationality: ['Nationality', 'الجنسية'],
  gender: ['Gender', 'Sex', 'الجنس'],
  occupation: ['Occupation', 'المهنة'],
  employer: ['Employer', 'جهة العمل', 'صاحب العمل'],
  issuingPlace: ['Issuing Place', 'Place of Issue', 'مكان الإصدار', 'مكان الاصدار'],
};

export interface EmiratesIdExtractedData extends ScanReview {
  // Identity Keys
  idNumber: string; // e.g. "784-1970-7905987-5"
  rawIdNumber: string; // e.g. "784197079059875"
  cardNumber: string; // e.g. "148434411"
  chipNumber?: string;

  // Personal Info (Bilingual)
  fullNameEn: string; // e.g. "Ibrahim Siraj Sulthan Mohamed Kasim Sultan Mohammed"
  fullNameAr: string; // e.g. "ابراهيم سيراج سلطان محمد قاسم سلطان محمد قاسم"
  firstName: string;
  lastName: string;
  dateOfBirth: string; // e.g. "29/01/1970"
  nationalityEn: string; // e.g. "India"
  nationalityAr: string; // e.g. "جمهورية الهند"
  nationalityCode: string; // e.g. "IND"
  gender: 'M' | 'F' | '';

  // Document Validity
  issueDate: string; // e.g. "28/08/2025"
  expiryDate: string; // e.g. "27/08/2027"
  isExpired: boolean;
  daysUntilExpiry: number;

  // Employment & Residency
  occupationEn: string; // e.g. "Accountant General"
  occupationAr: string; // e.g. "محاسب عام"
  employerEn: string; // e.g. "Auto Vision Trading Fzco - Daz"
  employerAr: string; // e.g. "اوتو فيجن للتجارة ش م ح - داز"
  issuingPlaceEn: string; // e.g. "Dubai"
  issuingPlaceAr: string; // e.g. "دبي"

  // Machine Readable Zone (MRZ) Raw Lines
  mrz?: {
    line1: string;
    line2: string;
    line3: string;
  };

  // OCR Telemetry & Diagnostics
  rawOcrText?: string;
  ocrEngine?: string;
  confidenceScore: number;
  detectedFieldsCount: number;
  scannedAt: string;
  scannedSide?: 'front' | 'back' | 'both';
  documentFormat?: string;
}

export const EMPTY_EMIRATES_ID: EmiratesIdExtractedData = {
  idNumber: '',
  rawIdNumber: '',
  cardNumber: '',
  fullNameEn: '',
  fullNameAr: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  nationalityEn: '',
  nationalityAr: '',
  nationalityCode: '',
  gender: '',
  issueDate: '',
  expiryDate: '',
  isExpired: false,
  daysUntilExpiry: 0,
  occupationEn: '',
  occupationAr: '',
  employerEn: '',
  employerAr: '',
  issuingPlaceEn: '',
  issuingPlaceAr: '',
  confidenceScore: 0,
  detectedFieldsCount: 0,
  scannedAt: '',
  reviewConfirmed: false,
  missingFields: ['idNumber', 'fullNameEn', 'expiryDate'],
};

const NATIONALITY_REGISTRY: Record<string, { en: string; ar: string; code: string }> = {
  IND: { en: 'India', ar: 'جمهورية الهند', code: 'IND' },
  INDIA: { en: 'India', ar: 'جمهورية الهند', code: 'IND' },
  INDIAN: { en: 'India', ar: 'جمهورية الهند', code: 'IND' },
  PAK: { en: 'Pakistan', ar: 'باكستان', code: 'PAK' },
  PAKISTAN: { en: 'Pakistan', ar: 'باكستان', code: 'PAK' },
  ARE: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة', code: 'ARE' },
  UAE: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة', code: 'ARE' },
  GBR: { en: 'United Kingdom', ar: 'المملكة المتحدة', code: 'GBR' },
  UK: { en: 'United Kingdom', ar: 'المملكة المتحدة', code: 'GBR' },
  USA: { en: 'United States', ar: 'الولايات المتحدة', code: 'USA' },
  MYS: { en: 'Malaysia', ar: 'ماليزيا', code: 'MYS' },
  RUS: { en: 'Russian Federation', ar: 'روسيا', code: 'RUS' },
  EGY: { en: 'Egypt', ar: 'مصر', code: 'EGY' },
  PHL: { en: 'Philippines', ar: 'الفلبين', code: 'PHL' },
  SAU: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية', code: 'SAU' },
  CAN: { en: 'Canada', ar: 'كندا', code: 'CAN' },
  FRA: { en: 'France', ar: 'فرنسا', code: 'FRA' },
  DEU: { en: 'Germany', ar: 'ألمانيا', code: 'DEU' },
  KEN: { en: 'Kenya', ar: 'جمهورية كينيا', code: 'KEN' },
  KENYA: { en: 'Kenya', ar: 'جمهورية كينيا', code: 'KEN' },
};

export const KHALIF_MOHAMEDNUR_IBRAHIM_EID_SAMPLE: EmiratesIdExtractedData = {
  demoOnly: true,
  reviewConfirmed: false,
  idNumber: '784-1984-5852080-0',
  rawIdNumber: '784198458520800',
  cardNumber: '146532347',
  chipNumber: '2500146532',
  fullNameEn: 'Khalif Mohamednur Ibrahim',
  fullNameAr: 'خليف محمدنور ابراهيم',
  firstName: 'Khalif Mohamednur',
  lastName: 'Ibrahim',
  dateOfBirth: '12/07/1984',
  nationalityEn: 'Kenya',
  nationalityAr: 'جمهورية كينيا',
  nationalityCode: 'KEN',
  gender: 'M',
  issueDate: '16/06/2025',
  expiryDate: '15/06/2027',
  isExpired: false,
  daysUntilExpiry: 300,
  occupationEn: 'Sales Officer',
  occupationAr: 'ضابط مبيعات',
  employerEn: 'Jayeeco General Trading L.L.C',
  employerAr: 'جايكو للتجارة العامة ش.ذ.م.م',
  issuingPlaceEn: 'Dubai / UAE',
  issuingPlaceAr: 'دبي / الإمارات',
  mrz: {
    line1: 'ILARE1465323471784198458520800',
    line2: '8407122M2706155KEN<<<<<<<<<<<1',
    line3: 'IBRAHIM<<KHALIF<MOHAMEDNUR<<<<',
  },
  confidenceScore: 1.0,
  detectedFieldsCount: 16,
  scannedAt: new Date().toISOString(),
};

export const MANSOOR_ALMARZOOQI_SAMPLE_EID: EmiratesIdExtractedData = {
  demoOnly: true,
  reviewConfirmed: false,
  idNumber: '784-1990-7528093-5',
  rawIdNumber: '784199075280935',
  cardNumber: '090195436',
  chipNumber: '2500091845',
  fullNameEn: 'MANSOOR ABDULLA AHMED JABER ALMARZOOQI',
  fullNameAr: 'منصور عبدالله احمد جابر المرزوقي',
  firstName: 'MANSOOR ABDULLA',
  lastName: 'AHMED JABER ALMARZOOQI',
  dateOfBirth: '10/08/1990',
  nationalityEn: 'United Arab Emirates',
  nationalityAr: 'الإمارات العربية المتحدة',
  nationalityCode: 'ARE',
  gender: 'M',
  issueDate: '27/07/2023',
  expiryDate: '26/07/2028',
  isExpired: false,
  daysUntilExpiry: 706,
  occupationEn: 'UAE Citizen / Government Executive',
  occupationAr: 'مواطن إماراتي / مسؤول حكومي',
  employerEn: 'United Arab Emirates Government',
  employerAr: 'حكومة دولة الإمارات العربية المتحدة',
  issuingPlaceEn: 'Abu Dhabi / Dubai',
  issuingPlaceAr: 'أبوظبي / دبي',
  mrz: {
    line1: 'IDARE0901954369784199075280935',
    line2: '9008102M2807269ARE<<<<<<<<<<<9',
    line3: '<<MANSOOR<ABDULLA<AHMED<JABER<',
  },
  confidenceScore: 0.999,
  detectedFieldsCount: 12,
  scannedAt: new Date().toISOString(),
};

export const DEFAULT_VERIFIED_EID: EmiratesIdExtractedData = {
  demoOnly: true,
  reviewConfirmed: false,
  idNumber: '784-1970-7905987-5',
  rawIdNumber: '784197079059875',
  cardNumber: '148434411',
  chipNumber: '2500098412',
  fullNameEn: 'Ibrahim Siraj Sulthan Mohamed Kasim Sultan Mohammed',
  fullNameAr: 'ابراهيم سيراج سلطان محمد قاسم سلطان محمد قاسم',
  firstName: 'Ibrahim Siraj Sulthan',
  lastName: 'Mohamed Kasim Sultan Mohammed',
  dateOfBirth: '29/01/1970',
  nationalityEn: 'India',
  nationalityAr: 'جمهورية الهند',
  nationalityCode: 'IND',
  gender: 'M',
  issueDate: '28/08/2025',
  expiryDate: '27/08/2027',
  isExpired: false,
  daysUntilExpiry: 738,
  occupationEn: 'Accountant General',
  occupationAr: 'محاسب عام',
  employerEn: 'Auto Vision Trading Fzco - Daz',
  employerAr: 'اوتو فيجن للتجارة ش م ح - داز',
  issuingPlaceEn: 'Dubai',
  issuingPlaceAr: 'دبي',
  mrz: {
    line1: 'ILARE1484344110784197079059875',
    line2: '7001291M2708274IND<<<<<<<<<<<2',
    line3: 'MOHAMMED<<IBRAHIM<SIRAJ<SULTHA',
  },
  rawOcrText: `UNITED ARAB EMIRATES\nFEDERAL AUTHORITY FOR IDENTITY & CITIZENSHIP\nResident Identity Card\nID Number / رقم الهوية: 784-1970-7905987-5\nName: Ibrahim Siraj Sulthan Mohamed Kasim Sultan Mohammed\nالاسم: ابراهيم سيراج سلطان محمد قاسم سلطان محمد قاسم\nDate of Birth: 29/01/1970\nNationality: India\nCard Number: 148434411\nOccupation: Accountant General\nEmployer: Auto Vision Trading Fzco - Daz\nIssuing Place: Dubai\nILARE1484344110784197079059875\n7001291M2708274IND<<<<<<<<<<<2\nMOHAMMED<<IBRAHIM<SIRAJ<SULTHA`,
  ocrEngine: 'Tesseract.js v5 Optical Engine + pdfjs-dist',
  confidenceScore: 0.999,
  detectedFieldsCount: 12,
  scannedAt: new Date().toISOString(),
};

export const ARSLAN_MALIK_SAMPLE_EID: EmiratesIdExtractedData = {
  demoOnly: true,
  reviewConfirmed: false,
  idNumber: '784-1993-1805733-0',
  rawIdNumber: '784199318057330',
  cardNumber: '144597571',
  chipNumber: '2500069345',
  fullNameEn: 'Arslan Malik Bashir Ahmad',
  fullNameAr: 'ارسلان مالك بشير احمد',
  firstName: 'Arslan Malik',
  lastName: 'Bashir Ahmad',
  dateOfBirth: '10/02/1993',
  nationalityEn: 'Pakistan',
  nationalityAr: 'باكستان',
  nationalityCode: 'PAK',
  gender: 'M',
  issueDate: '08/04/2025',
  expiryDate: '22/11/2026',
  isExpired: false,
  daysUntilExpiry: 462,
  occupationEn: 'Managing Director',
  occupationAr: 'مدير إدارة',
  employerEn: 'White Caves Real Estate L.L.C',
  employerAr: 'وايت كيفز للعقارات ذ.م.م',
  issuingPlaceEn: 'Dubai',
  issuingPlaceAr: 'دبي',
  mrz: {
    line1: 'ILARE1445975719784199318057330',
    line2: '9302109M2611228PAK<<<<<<<<<<<6',
    line3: 'BASHIR<AHMAD<<ARSLAN<MALIK<<<<',
  },
  confidenceScore: 0.998,
  detectedFieldsCount: 11,
  scannedAt: new Date().toISOString(),
};

export const SANIT_SINGH_SAMPLE_EID: EmiratesIdExtractedData = {
  demoOnly: true,
  reviewConfirmed: false,
  idNumber: '784-1988-1849201-1',
  rawIdNumber: '784198818492011',
  cardNumber: '148201948',
  chipNumber: '2500091823',
  fullNameEn: 'Sanit Singh Nagpal',
  fullNameAr: 'سانيت سينغ ناغبال',
  firstName: 'Sanit Singh',
  lastName: 'Nagpal',
  dateOfBirth: '15/07/1988',
  nationalityEn: 'India',
  nationalityAr: 'جمهورية الهند',
  nationalityCode: 'IND',
  gender: 'M',
  issueDate: '10/01/2024',
  expiryDate: '09/01/2027',
  isExpired: false,
  daysUntilExpiry: 508,
  occupationEn: 'Commercial Director',
  occupationAr: 'مدير تجاري',
  employerEn: 'Commercial Enterprises L.L.C',
  employerAr: 'المشاريع التجارية ذ.م.م',
  issuingPlaceEn: 'Dubai',
  issuingPlaceAr: 'دبي',
  mrz: {
    line1: 'ILARE1482019489784198818492011',
    line2: '8807159M2701098IND<<<<<<<<<<<1',
    line3: 'NAGPAL<<SANIT<SINGH<<<<<<<<<<<',
  },
  confidenceScore: 0.999,
  detectedFieldsCount: 11,
  scannedAt: new Date().toISOString(),
};

class PdfPageLimitError extends Error {
  constructor() {
    super('Scan at most two pages at a time.');
  }
}

class HenryEmiratesIdScannerService {
  private activeSessionCache: EmiratesIdExtractedData | null = null;
  private updateListeners: Set<(data: EmiratesIdExtractedData | null) => void> = new Set();

  /**
   * Updates in-memory and session cache and notifies subscribers
   */
  setCachedEmiratesId(data: EmiratesIdExtractedData): void {
    if (!canUseScan(data)) {
      this.clearCachedEmiratesId();
      return;
    }
    this.activeSessionCache = structuredClone(data);
    this.notifyListeners(this.activeSessionCache);
  }

  /**
   * Retrieves active cached Emirates ID data
   */
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

  /**
   * Clears temporary session cache
   */
  clearCachedEmiratesId(): void {
    this.activeSessionCache = null;
    this.notifyListeners(null);
  }

  /**
   * Subscribe to Emirates ID cache changes
   */
  onEmiratesIdUpdated(listener: (data: EmiratesIdExtractedData | null) => void): () => void {
    this.updateListeners.add(listener);
    return () => this.updateListeners.delete(listener);
  }

  private notifyListeners(data: EmiratesIdExtractedData | null): void {
    this.updateListeners.forEach(fn => {
      try {
        fn(data ? structuredClone(data) : null);
      } catch (err) {
        console.error('Error in onEmiratesIdUpdated listener:', err);
      }
    });
  }

  /**
   * Heuristically determines whether document text represents Front, Back or Both sides
   */
  detectDocumentSide(textOrFileName: string): 'front' | 'back' | 'both' {
    const lower = (textOrFileName || '').toLowerCase();
    const hasMrz =
      /ilare|p<are|[0-9]{7}[a-z][0-9]{7}/i.test(lower) ||
      lower.includes('mrz') ||
      lower.includes('back');
    const hasFront =
      /784-\d{4}-\d{7}-\d|resident identity|united arab emirates|identity card|front/i.test(lower);
    if (hasMrz && hasFront) return 'both';
    if (hasMrz) return 'back';
    if (hasFront) return 'front';
    return 'both';
  }

  formatEmiratesId(rawNumber: string): string {
    const cleaned = (rawNumber || '').replace(/\D/g, '');
    if (cleaned.length === 15) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 14)}-${cleaned.slice(14)}`;
    }
    return rawNumber;
  }

  resolveNationality(input: string): { en: string; ar: string; code: string } {
    if (!input) return { en: '', ar: '', code: '' };
    const cleaned = input.toUpperCase().replace(/[^A-Z]/g, '');

    for (const [key, val] of Object.entries(NATIONALITY_REGISTRY)) {
      if (cleaned === key) {
        return val;
      }
    }
    return { en: input.trim(), ar: '', code: '' };
  }

  parseTD1Mrz(line1: string, line2: string, line3: string): Partial<EmiratesIdExtractedData> {
    const l1 = (line1 || '').trim().toUpperCase().replace(/\s+/g, '');
    const l2 = (line2 || '').trim().toUpperCase().replace(/\s+/g, '');
    const l3 = (line3 || '').trim().toUpperCase().replace(/\s+/g, '');

    try {
      const parsed = parseMrz([l1, l2, l3]);
      if (parsed && parsed.valid && parsed.fields) {
        const docNumber = parsed.fields.documentNumber || l1.slice(5, 14).replace(/</g, '');
        const rawId = l1.slice(15, 30).replace(/</g, '') || parsed.fields.optional1 || '';
        const idNumber = /^784\d{12}$/.test(rawId) ? this.formatEmiratesId(rawId) : '';
        const nat = this.resolveNationality(parsed.fields.nationality || '');

        return {
          idNumber: idNumber || '',
          rawIdNumber: idNumber ? rawId : '',
          cardNumber: docNumber,
          // TD1 dates have no century. Only a matching visible four-digit date resolves them.
          dateOfBirth: '',
          gender: parsed.fields.sex === 'female' ? 'F' : parsed.fields.sex === 'male' ? 'M' : '',
          expiryDate: '',
          nationalityEn: nat.en,
          nationalityAr: nat.ar,
          nationalityCode: nat.code,
          firstName: parsed.fields.firstName || '',
          lastName: parsed.fields.lastName || '',
          fullNameEn:
            `${parsed.fields.firstName || ''} ${parsed.fields.lastName || ''}`.trim() || '',
          mrz: { line1: l1, line2: l2, line3: l3 },
        };
      }
    } catch {
      logger.warn('Henry MRZ rejected: invalid format or check digits');
    }

    return {};
  }

  private async renderPdfToCanvasAndText(
    file: File,
    coverage?: (text: string) => number
  ): Promise<{ canvasDataUrls: string[]; pdfText: string }> {
    if (typeof window === 'undefined') return { canvasDataUrls: [], pdfText: '' };
    let loadingTask: import('pdfjs-dist').PDFDocumentLoadingTask | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const deadline = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        if (loadingTask)
          void loadingTask.destroy().catch(() => logger.warn('Henry timed-out PDF cleanup failed'));
        reject(new Error('PDF reading timed out'));
      }, 30000);
    });
    const bounded = <T>(operation: Promise<T>): Promise<T> => Promise.race([operation, deadline]);
    try {
      const pdfjs = await import('pdfjs-dist');
      if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
      }
      const arrayBuffer = await bounded(file.arrayBuffer());
      loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdfDoc = await bounded(loadingTask.promise);
      if (pdfDoc.numPages > 2) throw new PdfPageLimitError();

      let combinedPdfText = '';
      const canvasDataUrls: string[] = [];

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await bounded(pdfDoc.getPage(i));
        const textContent = await bounded(page.getTextContent());
        const items = textContent.items
          .filter(
            (item): item is import('pdfjs-dist/types/src/display/api').TextItem => 'str' in item
          )
          .sort(
            (a, b) =>
              Math.round(b.transform[5] / 3) - Math.round(a.transform[5] / 3) ||
              a.transform[4] - b.transform[4]
          );
        const pageText = items
          .map((item, index) => {
            const previous = items[index - 1];
            const separator =
              previous && Math.abs(item.transform[5] - previous.transform[5]) >= 3
                ? '\n'
                : previous && item.transform[4] - previous.transform[4] - previous.width > 15
                  ? ' | '
                  : ' ';
            return `${separator}${item.str}`;
          })
          .join('');
        combinedPdfText += `\n--- PAGE ${i} ---\n${pageText}`;

        if (
          coverage
            ? coverage(pageText) < 1
            : pageText.replace(/\s/g, '').length < 150 || (pageText.match(/:/g)?.length || 0) < 4
        ) {
          const base = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({
            scale: Math.min(2, Math.sqrt(4_000_000 / (base.width * base.height))),
          });
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            try {
              await bounded(
                page.render({ canvasContext: ctx, viewport, canvas } as unknown as Parameters<
                  typeof page.render
                >[0]).promise
              );
              canvasDataUrls.push(canvas.toDataURL('image/png'));
            } finally {
              canvas.width = 0;
              canvas.height = 0;
            }
          }
        }
      }

      return { canvasDataUrls, pdfText: combinedPdfText };
    } catch (error) {
      logger.error('Henry PDF extraction failed');
      if (error instanceof PdfPageLimitError) throw error;
      throw new Error('PDF could not be read. Upload at most two readable pages.');
    } finally {
      clearTimeout(timer);
      if (loadingTask) {
        let cleanupTimer: ReturnType<typeof setTimeout> | undefined;
        try {
          await Promise.race([
            loadingTask.destroy(),
            new Promise<never>((_, reject) => {
              cleanupTimer = setTimeout(() => reject(new Error('PDF cleanup timeout')), 3000);
            }),
          ]);
        } catch {
          logger.warn('Henry PDF cleanup failed or timed out');
        } finally {
          clearTimeout(cleanupTimer);
        }
      }
    }
  }

  private async preProcessImageOnCanvas(
    file: File | string,
    rotation = 0,
    enhance = true,
    warnings?: string[]
  ): Promise<string> {
    if (typeof window === 'undefined') return '';
    return new Promise(resolve => {
      const img = new Image();
      const objectUrl = typeof file === 'string' ? file : URL.createObjectURL(file);
      const release = () => {
        if (typeof file !== 'string') URL.revokeObjectURL(objectUrl);
      };
      const timeout = window.setTimeout(() => {
        release();
        img.src = '';
        resolve('');
      }, 15000);
      img.onload = () => {
        window.clearTimeout(timeout);
        release();
        let canvas: HTMLCanvasElement | undefined;
        try {
          canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve('');
            return;
          }

          const width = img.naturalWidth || img.width;
          const height = img.naturalHeight || img.height;
          if (!width || !height || width * height > 40_000_000)
            throw new Error('Image dimensions exceed decoding budget');
          if (warnings && Math.max(width, height) < 1000)
            warnings.push(
              'Small source resolution; enlarging cannot restore missing detail. Rescan if characters are unclear.'
            );
          const scale = Math.min(
            2.5,
            2200 / Math.max(width, height),
            Math.sqrt(4_000_000 / (width * height))
          );
          const sideways = rotation === 90 || rotation === 270;
          canvas.width = (sideways ? height : width) * scale;
          canvas.height = (sideways ? width : height) * scale;

          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.drawImage(
            img,
            (-width * scale) / 2,
            (-height * scale) / 2,
            width * scale,
            height * scale
          );
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const d = imgData.data;
          for (let i = 0; i < d.length; i += 4) {
            const gray = 0.299 * (d[i] ?? 0) + 0.587 * (d[i + 1] ?? 0) + 0.114 * (d[i + 2] ?? 0);
            const enhanced = enhance
              ? gray > 130
                ? Math.min(255, gray * 1.15)
                : Math.max(0, gray * 0.85)
              : gray;
            d[i] = enhanced;
            d[i + 1] = enhanced;
            d[i + 2] = enhanced;
          }
          ctx.putImageData(imgData, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } catch {
          logger.warn('Henry image preprocessing unavailable');
          resolve('');
        } finally {
          if (canvas) {
            canvas.width = 0;
            canvas.height = 0;
          }
          img.onload = null;
          img.onerror = null;
          img.src = '';
        }
      };
      img.onerror = () => {
        window.clearTimeout(timeout);
        release();
        resolve('');
      };
      img.src = objectUrl;
    });
  }

  async extractDocumentText(
    file: File,
    onProgress?: (progress: number) => void,
    coverage?: (text: string) => number
  ): Promise<{ ocrText: string; streamText: string; ocrConfidence?: number; warnings?: string[] }> {
    let streamText = '';
    let worker: import('tesseract.js').Worker | undefined;
    const warnings: string[] = [];
    const texts: string[] = [];
    const confidences: number[] = [];
    const completedResult = () => ({
      ocrText: texts.join('\n'),
      streamText,
      ocrConfidence: confidences.length
        ? confidences.reduce((sum, value) => sum + value, 0) / confidences.length
        : undefined,
      warnings,
    });
    const requiredCoverage =
      coverage ||
      ((text: string) => {
        const parsed = this.parseOcrText(text, '');
        return (
          [!!parsed.idNumber, !!parsed.fullNameEn, validScanDate(parsed.expiryDate || '')].filter(
            Boolean
          ).length / 3
        );
      });
    const deadline = Date.now() + 90000;
    const bounded = async <T>(operation: Promise<T>, passLimit = 30000): Promise<T> => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        return await Promise.race([
          operation,
          new Promise<never>((_, reject) => {
            timer = setTimeout(
              () => reject(new Error('OCR timed out. Rescan a smaller, clearer image.')),
              Math.max(1, Math.min(passLimit, deadline - Date.now()))
            );
          }),
        ]);
      } finally {
        clearTimeout(timer);
      }
    };
    try {
      if (typeof window === 'undefined') return { ocrText: '', streamText: '' };
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

      let ocrInput: File | string = file;
      let pageImages: string[] = [];

      if (isPdf) {
        const { canvasDataUrls, pdfText } = await bounded(
          this.renderPdfToCanvasAndText(file, requiredCoverage)
        );
        pageImages = canvasDataUrls;
        ocrInput = canvasDataUrls[0] || file;
        streamText = pdfText;
      } else if (file.type.startsWith('image/')) {
        const processedUrl = await this.preProcessImageOnCanvas(file, 0, true, warnings);
        if (!processedUrl) throw new Error('Image could not be safely decoded.');
        ocrInput = processedUrl;
      }

      if (onProgress) onProgress(30);
      if (isPdf && !pageImages.length) {
        warnings.push(
          'Native PDF text read without OCR. Check image-only or omitted fields against the original.'
        );
        return { ocrText: '', streamText, warnings };
      }

      const Tesseract = await import('tesseract.js');
      // Language assets run locally in the worker; document pixels are never sent to an OCR API.
      const pendingWorker = Tesseract.createWorker('eng+ara', 1, {
        logger: (m: { status?: string; progress?: number }) => {
          if (m.status === 'recognizing text' && typeof m.progress === 'number')
            onProgress?.(30 + Math.round(m.progress * 60));
        },
      });
      let expired = false;
      pendingWorker.then(
        async created => {
          if (expired) {
            try {
              await created.terminate();
            } catch {
              logger.warn('Henry late worker cleanup failed');
            }
          }
        },
        () => undefined
      );
      try {
        worker = await bounded(pendingWorker);
      } catch (error) {
        expired = true;
        throw error;
      }
      for (const input of pageImages.length ? pageImages : [ocrInput]) {
        const candidates = [await bounded(worker.recognize(input), 20000)];
        const score = (candidate: (typeof candidates)[number]) =>
          requiredCoverage(candidate.data.text || '');
        const confidence = (candidate: (typeof candidates)[number]) =>
          Number.isFinite(candidate.data.confidence) ? candidate.data.confidence : -Infinity;
        let best = candidates[0]!;
        try {
          if (confidence(best) < 60 || score(best) < 1) {
            warnings.push(
              'Low OCR quality or missing required fields. Check focus, lighting and orientation; all fields need source review.'
            );
            // At most five passes per page; clean complete documents use one.
            for (const angle of [0, 90, 180, 270]) {
              const retryInput = await bounded(
                this.preProcessImageOnCanvas(pageImages.length ? input : file, angle, false),
                15000
              );
              if (!retryInput) continue;
              const retry = await bounded(worker.recognize(retryInput), 20000);
              candidates.push(retry);
              if (
                score(retry) > score(best) ||
                (score(retry) === score(best) && confidence(retry) > confidence(best))
              )
                best = retry;
              if (score(best) === 1 && confidence(best) >= 60) break;
            }
          }
        } finally {
          // Keep independent readable candidates even when a later pass fails.
          texts.push(
            [
              ...new Set(
                [best, ...candidates].map(candidate => candidate.data.text || '').filter(Boolean)
              ),
            ].join('\n')
          );
          if (Number.isFinite(best.data.confidence)) confidences.push(best.data.confidence);
          else warnings.push('OCR confidence unavailable; review every field against the source.');
        }
      }

      return completedResult();
    } catch (error) {
      logger.error('Henry OCR extraction failed');
      if (error instanceof PdfPageLimitError) throw error;
      if (!streamText.trim() && !texts.some(text => text.trim()))
        throw new Error('OCR unavailable or timed out. Nothing extracted; rescan or retry.');
      warnings.push(
        'OCR recovery incomplete or timed out; completed candidates retained. Review omitted or image-only fields and compare all source evidence.'
      );
      return completedResult();
    } finally {
      if (worker) {
        try {
          await bounded(worker.terminate(), 3000);
        } catch {
          logger.warn('Henry OCR worker cleanup failed');
        }
      }
    }
  }

  parseOcrText(rawText: string, fileName: string): Partial<EmiratesIdExtractedData> {
    void fileName;
    const text = normalizeDocumentText(rawText);
    const { values, diagnostics } = readDocumentFields(text, ID_LABELS);
    const field = (key: string) => values[key]?.[0] || '';
    const en = (key: string) => languageValue(values[key] || [], 'en');
    const ar = (key: string) => languageValue(values[key] || [], 'ar');
    const visibleIds = [...text.matchAll(/(?<!\d)784[ -]?\d{4}[ -]?\d{7}[ -]?\d(?!\d)/g)].map(
      match => this.formatEmiratesId(match[0])
    );
    values.idNumber = [...new Set(visibleIds)];
    diagnostics.fields.idNumber!.values = values.idNumber;
    diagnostics.fields.idNumber!.state = visibleIds.length ? 'extracted' : 'missing';
    const nationality = this.resolveNationality(en('nationality'));
    const sex = `${field('gender')}`.trim();
    const result: Partial<EmiratesIdExtractedData> = {
      idNumber: values.idNumber[0] || '',
      rawIdNumber: (values.idNumber[0] || '').replace(/\D/g, ''),
      cardNumber: field('cardNumber'),
      chipNumber: field('chipNumber'),
      fullNameEn: en('fullName'),
      fullNameAr: ar('fullName'),
      dateOfBirth: normalizeDocumentDate(field('dateOfBirth')),
      issueDate: normalizeDocumentDate(field('issueDate')),
      expiryDate: normalizeDocumentDate(field('expiryDate')),
      nationalityEn: en('nationality'),
      nationalityAr: ar('nationality'),
      nationalityCode: nationality.code,
      gender: /^(?:M|male|ذكر)(?:\s|$)/i.test(sex)
        ? 'M'
        : /^(?:F|female|أنثى|انثى)(?:\s|$)/i.test(sex)
          ? 'F'
          : '',
      occupationEn: en('occupation'),
      occupationAr: ar('occupation'),
      employerEn: en('employer'),
      employerAr: ar('employer'),
      issuingPlaceEn: en('issuingPlace'),
      issuingPlaceAr: ar('issuingPlace'),
      diagnostics,
    };
    const lines = text
      .toUpperCase()
      .split('\n')
      .map(line => line.replace(/\s/g, ''));
    const mrzSources = lines
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => /^(?:IL|ID)ARE[A-Z0-9<]+$/.test(line))
      .map(({ index }) => ({
        index,
        fields: this.parseTD1Mrz(lines[index]!, lines[index + 1] || '', lines[index + 2] || ''),
      }));
    const mrzSource = mrzSources.find(source => source.fields.mrz) || mrzSources[0];
    const start = mrzSource?.index ?? -1;
    if (start >= 0) {
      const mrz = mrzSource!.fields;
      if (!mrz.mrz)
        diagnostics.warnings.push(
          'MRZ check digits or format invalid; no identity inferred from MRZ.'
        );
      else {
        result.mrz = mrz.mrz;
        result.firstName = mrz.firstName;
        result.lastName = mrz.lastName;
        for (const key of [
          'idNumber',
          'cardNumber',
          'fullNameEn',
          'gender',
          'nationalityCode',
        ] as const) {
          const evidenceKey =
            key === 'fullNameEn' ? 'fullName' : key === 'nationalityCode' ? 'nationality' : key;
          const candidate = mrz[key];
          if (!candidate) continue;
          if (
            result[key] &&
            result[key]!.toUpperCase().replace(/\s+/g, ' ') !==
              candidate.toUpperCase().replace(/\s+/g, ' ')
          ) {
            diagnostics.fields[evidenceKey]!.state = 'conflict';
            diagnostics.fields[evidenceKey]!.values.push(candidate);
            if (evidenceKey !== key) {
              const reviewKey = key === 'nationalityCode' ? 'nationalityEn' : key;
              diagnostics.fields[evidenceKey]!.conflicts = {
                ...diagnostics.fields[evidenceKey]!.conflicts,
                [reviewKey]: [result[key]!, candidate],
              };
            }
            diagnostics.warnings.push(`Visible ${key} conflicts with validated MRZ.`);
          } else if (!result[key]) {
            Object.assign(result, { [key]: candidate });
            diagnostics.fields[evidenceKey] = {
              state: 'extracted',
              source: 'mrz',
              values: [candidate],
            };
          }
        }
        for (const key of [
          'idNumber',
          'cardNumber',
          'fullNameEn',
          'nationalityCode',
          'gender',
        ] as const) {
          const candidates = [
            ...new Set(
              [
                result[key],
                ...mrzSources.filter(source => source.fields.mrz).map(source => source.fields[key]),
              ].filter((value): value is string => !!value)
            ),
          ];
          if (
            new Set(candidates.map(value => value.trim().replace(/\s+/g, ' ').toUpperCase())).size >
            1
          ) {
            const evidenceKey =
              key === 'fullNameEn' ? 'fullName' : key === 'nationalityCode' ? 'nationality' : key;
            const reviewKey = key === 'nationalityCode' ? 'nationalityEn' : key;
            const evidence = diagnostics.fields[evidenceKey]!;
            evidence.state = 'conflict';
            evidence.values = [...new Set([...evidence.values, ...candidates])];
            evidence.conflicts = { ...evidence.conflicts, [reviewKey]: candidates };
            diagnostics.warnings.push(
              `Independent MRZ candidates disagree on ${key}; compare the source.`
            );
          }
        }
        for (const [key, offset] of [
          ['dateOfBirth', 0],
          ['expiryDate', 8],
        ] as const) {
          const shortDates = [
            ...new Set(
              mrzSources
                .filter(source => source.fields.mrz)
                .map(source => lines[source.index + 1]!.slice(offset, offset + 6))
            ),
          ];
          const visibleDates = (values[key] || []).map(normalizeDocumentDate).filter(validScanDate);
          if (!visibleDates.length)
            diagnostics.warnings.push(
              `${key}: MRZ century ambiguous; enter the visible four-digit date.`
            );
          if (
            shortDates.length > 1 ||
            visibleDates.some(date =>
              shortDates.some(
                shortDate =>
                  `${date.slice(8, 10)}${date.slice(3, 5)}${date.slice(0, 2)}` !== shortDate
              )
            )
          ) {
            diagnostics.fields[key]!.state = 'conflict';
            diagnostics.fields[key]!.values = [
              ...new Set([...diagnostics.fields[key]!.values, ...shortDates]),
            ];
            diagnostics.warnings.push(
              `${key}: validated MRZ dates disagree with each other or visible dates; compare the source without inferring a century.`
            );
          }
        }
      }
    }
    for (const key of [
      'idNumber',
      'cardNumber',
      'chipNumber',
      'dateOfBirth',
      'issueDate',
      'expiryDate',
    ]) {
      const candidates = values[key]?.map(value => {
        const date = normalizeDocumentDate(value);
        return key.endsWith('Date') || key === 'dateOfBirth'
          ? validScanDate(date)
            ? date
            : value
          : value;
      });
      if (new Set(candidates).size > 1) {
        diagnostics.fields[key]!.state = 'conflict';
        diagnostics.warnings.push(`Conflicting ${key}; review sources.`);
      }
      for (const key of ['fullName', 'nationality'] as const) {
        const conflicts: Record<string, string[]> = {};
        for (const language of ['en', 'ar'] as const) {
          const candidates = [
            ...new Set(
              (values[key] || []).map(value => languageValue([value], language)).filter(Boolean)
            ),
          ];
          if (new Set(candidates.map(value => value.toUpperCase())).size > 1)
            conflicts[`${key}${language === 'en' ? 'En' : 'Ar'}`] = candidates;
        }
        if (Object.keys(conflicts).length) {
          diagnostics.fields[key]!.state = 'conflict';
          const existing = diagnostics.fields[key]!.conflicts || {};
          diagnostics.fields[key]!.conflicts = Object.fromEntries(
            [...new Set([...Object.keys(existing), ...Object.keys(conflicts)])].map(reviewKey => [
              reviewKey,
              [...new Set([...(existing[reviewKey] || []), ...(conflicts[reviewKey] || [])])],
            ])
          );
          diagnostics.warnings.push(
            `Conflicting ${key}; review independent OCR/source candidates.`
          );
        }
      }
    }
    for (const key of ['dateOfBirth', 'issueDate', 'expiryDate'] as const) {
      if (!validScanDate(result[key] || '')) {
        result[key] = '';
        if (diagnostics.fields[key]!.state !== 'conflict')
          diagnostics.fields[key]!.state = 'missing';
      }
    }
    for (const key of ['cardNumber', 'chipNumber'] as const) {
      if (result[key] && !/^\d{8,16}$/.test(result[key]!)) {
        result[key] = '';
        diagnostics.fields[key]!.state = 'missing';
        diagnostics.warnings.push(`${key}: unreadable numeric identifier; compare the original.`);
      }
    }
    if (!result.gender && diagnostics.fields.gender!.state !== 'conflict')
      diagnostics.fields.gender!.state = 'missing';
    refreshCoverage(diagnostics);
    return result;
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

  /**
   * Alias for scanEmiratesId conforming to standard document ingestion interfaces
   */
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

  /**
   * Ingests dual files (Front side + Back side) and merges attributes into a single validated EmiratesIdExtractedData
   */
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

    if (frontResult.idNumber && backResult.idNumber && frontResult.idNumber !== backResult.idNumber)
      throw new Error('Front/back ID numbers differ. Rescan the same card.');
    if (
      frontResult.cardNumber &&
      backResult.cardNumber &&
      frontResult.cardNumber !== backResult.cardNumber
    )
      throw new Error('Front/back card numbers differ. Rescan the same card.');
    const mergedFields = { ...(frontResult.diagnostics?.fields || {}) };
    for (const [key, evidence] of Object.entries(backResult.diagnostics?.fields || {})) {
      const front = mergedFields[key];
      if (front?.state === 'conflict' || evidence.state === 'conflict') {
        mergedFields[key] = {
          state: 'conflict',
          source: 'text',
          values: [...new Set([...(front?.values || []), ...evidence.values])],
          ...(front?.conflicts || evidence.conflicts
            ? { conflicts: { ...front?.conflicts, ...evidence.conflicts } }
            : {}),
        };
      } else if (front?.state === 'missing' || !front) mergedFields[key] = evidence;
      else if (
        key !== 'fullName' &&
        key !== 'nationality' &&
        evidence.state !== 'missing' &&
        JSON.stringify(front.values) !== JSON.stringify(evidence.values)
      ) {
        const normalize = (value: string) => {
          const date = normalizeDocumentDate(value);
          return (key.endsWith('Date') || key === 'dateOfBirth') && validScanDate(date)
            ? date
            : value;
        };
        if (new Set([...front.values, ...evidence.values].map(normalize)).size > 1)
          mergedFields[key] = {
            state: 'conflict',
            source: 'text',
            values: [...front.values, ...evidence.values],
          };
      }
    }
    for (const key of ['fullNameEn', 'fullNameAr', 'nationalityEn', 'nationalityAr'] as const) {
      const front = frontResult[key].trim().toUpperCase();
      const back = backResult[key].trim().toUpperCase();
      if (front && back && front !== back) {
        const field = key.startsWith('fullName') ? 'fullName' : 'nationality';
        const existing = mergedFields[field];
        mergedFields[field] = {
          state: 'conflict',
          source: 'text',
          values: [...new Set([...(existing?.values || []), frontResult[key], backResult[key]])],
          conflicts: { ...existing?.conflicts, [key]: [frontResult[key], backResult[key]] },
        };
      }
    }
    const merged: EmiratesIdExtractedData = {
      ...frontResult,
      idNumber: frontResult.idNumber || backResult.idNumber,
      rawIdNumber: (frontResult.idNumber || backResult.idNumber).replace(/\D/g, ''),
      fullNameAr: frontResult.fullNameAr || backResult.fullNameAr,
      dateOfBirth: frontResult.dateOfBirth || backResult.dateOfBirth,
      issueDate: frontResult.issueDate || backResult.issueDate,
      nationalityEn: frontResult.nationalityEn || backResult.nationalityEn,
      nationalityAr: frontResult.nationalityAr || backResult.nationalityAr,
      nationalityCode: frontResult.nationalityCode || backResult.nationalityCode,
      gender: frontResult.gender || backResult.gender,
      fullNameEn: frontResult.fullNameEn || backResult.fullNameEn,
      expiryDate: frontResult.expiryDate || backResult.expiryDate,
      cardNumber: backResult.cardNumber || frontResult.cardNumber,
      chipNumber: backResult.chipNumber || frontResult.chipNumber,
      mrz: backResult.mrz || frontResult.mrz,
      occupationEn: backResult.occupationEn || frontResult.occupationEn,
      occupationAr: backResult.occupationAr || frontResult.occupationAr,
      employerEn: backResult.employerEn || frontResult.employerEn,
      employerAr: backResult.employerAr || frontResult.employerAr,
      issuingPlaceEn: backResult.issuingPlaceEn || frontResult.issuingPlaceEn,
      issuingPlaceAr: backResult.issuingPlaceAr || frontResult.issuingPlaceAr,
      confidenceScore: Math.max(frontResult.confidenceScore, backResult.confidenceScore),
      scannedAt: new Date().toISOString(),
      scannedSide: 'both',
      documentFormat: `${frontFile.type || 'image'}, ${backFile.type || 'image'}`,
      reviewConfirmed: false,
      diagnostics: {
        fields: mergedFields,
        coverage: 0,
        warnings: [
          ...(frontResult.diagnostics?.warnings || []),
          ...(backResult.diagnostics?.warnings || []),
        ],
      },
    };

    merged.missingFields = [
      !/^784-\d{4}-\d{7}-\d$/.test(merged.idNumber) && 'idNumber',
      !merged.fullNameEn.trim() && 'fullNameEn',
      !validScanDate(merged.expiryDate) && 'expiryDate',
    ].filter((value): value is string => !!value);
    Object.assign(merged, scanExpiry(merged.expiryDate));
    refreshCoverage(merged.diagnostics!);
    merged.detectedFieldsCount = Object.values(mergedFields).filter(
      field => field.state === 'extracted'
    ).length;
    if (onProgress) onProgress(100);
    return merged;
  }

  getDemoExtractedData(): EmiratesIdExtractedData {
    const demo = {
      ...ARSLAN_MALIK_SAMPLE_EID,
      scannedAt: new Date().toISOString(),
      demoOnly: true,
      reviewConfirmed: false,
    };
    return demo;
  }

  getIndianClientDemoData(): EmiratesIdExtractedData {
    const demo = {
      ...SANIT_SINGH_SAMPLE_EID,
      scannedAt: new Date().toISOString(),
      demoOnly: true,
      reviewConfirmed: false,
    };
    return demo;
  }

  getIbrahimSirajDemoData(): EmiratesIdExtractedData {
    const demo = {
      ...DEFAULT_VERIFIED_EID,
      scannedAt: new Date().toISOString(),
      demoOnly: true,
      reviewConfirmed: false,
    };
    return demo;
  }

  toContractParty(
    extracted: EmiratesIdExtractedData,
    phone: string = '',
    email: string = ''
  ): ContractParty {
    if (!canUseScan(extracted)) throw new Error('Confirm review before autofill.');
    return {
      name: extracted.fullNameEn,
      emiratesIdOrPassport: extracted.idNumber,
      phone,
      email,
    };
  }

  toViewingClientPayload(
    extracted: EmiratesIdExtractedData,
    basePayload: Partial<ViewingFormPayload> = {}
  ): Partial<ViewingFormPayload> {
    if (!canUseScan(extracted)) throw new Error('Confirm review before autofill.');
    return {
      ...basePayload,
      clientName: extracted.fullNameEn,
      clientPassportOrEid: extracted.idNumber,
    };
  }

  exportToJson(extracted?: EmiratesIdExtractedData): Record<string, any> {
    const data = extracted || this.getCachedEmiratesId();
    return JSON.parse(JSON.stringify(data));
  }

  exportToJsonString(extracted?: EmiratesIdExtractedData): string {
    return JSON.stringify(this.exportToJson(extracted), null, 2);
  }

  /**
   * Persists extracted Emirates ID record to database endpoint and local session cache
   */
  async saveToDatabase(
    extracted?: EmiratesIdExtractedData,
    options?: VaultSaveOptions
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    const data = extracted || this.getCachedEmiratesId();
    if (!data) return { success: false, error: 'No reviewed document.' };
    const result = await saveReviewedScan(
      'emirates_id',
      data,
      data.idNumber,
      data.fullNameEn,
      options
    );
    if (result.success) this.setCachedEmiratesId(data);
    return result;
  }
}

export const henryEmiratesIdScannerService = new HenryEmiratesIdScannerService();
export default henryEmiratesIdScannerService;
