const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('src/services');
const targetDir = path.join(srcDir, 'emiratesId');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. types.ts
const typesContent = `/**
 * types.ts — Types, Interfaces & Dictionaries for Emirates ID Scanner
 */

import { ScanReview } from '../henryScanReview';

export const ID_LABELS: Record<string, string[]> = {
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
  fullNameEn: string;
  fullNameAr: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationalityEn: string;
  nationalityAr: string;
  nationalityCode: string;
  gender: 'M' | 'F' | '';

  // Document Validity
  issueDate: string;
  expiryDate: string;
  isExpired: boolean;
  daysUntilExpiry: number;

  // Employment & Residency
  occupationEn: string;
  occupationAr: string;
  employerEn: string;
  employerAr: string;
  issuingPlaceEn: string;
  issuingPlaceAr: string;

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

export const NATIONALITY_REGISTRY: Record<string, { en: string; ar: string; code: string }> = {
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

export class PdfPageLimitError extends Error {
  constructor() {
    super('Scan at most two pages at a time.');
  }
}
`;

fs.writeFileSync(path.join(targetDir, 'types.ts'), typesContent, 'utf-8');
console.log('Created emiratesId/types.ts');

// 2. samples.data.ts
const samplesContent = `/**
 * samples.data.ts — Sample Emirates ID Payloads & Benchmarks
 */

import { EmiratesIdExtractedData } from './types';

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
  rawOcrText: \`UNITED ARAB EMIRATES\\nFEDERAL AUTHORITY FOR IDENTITY & CITIZENSHIP\\nResident Identity Card\\nID Number / رقم الهوية: 784-1970-7905987-5\\nName: Ibrahim Siraj Sulthan Mohamed Kasim Sultan Mohammed\\nالاسم: ابراهيم سيراج سلطان محمد قاسم سلطان محمد قاسم\\nDate of Birth: 29/01/1970\\nNationality: India\\nCard Number: 148434411\\nOccupation: Accountant General\\nEmployer: Auto Vision Trading Fzco - Daz\\nIssuing Place: Dubai\\nILARE1484344110784197079059875\\n7001291M2708274IND<<<<<<<<<<<2\\nMOHAMMED<<IBRAHIM<SIRAJ<SULTHA\`,
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
`;

fs.writeFileSync(path.join(targetDir, 'samples.data.ts'), samplesContent, 'utf-8');
console.log('Created emiratesId/samples.data.ts');

// 3. parser.logic.ts
const parserContent = `/**
 * parser.logic.ts — MRZ & OCR Layout Entity Extraction Logic
 */

import { parse as parseMrz } from 'mrz';
import logger from '../../utils/logger';
import { validScanDate } from '../henryScanReview';
import {
  languageValue,
  normalizeDocumentDate,
  normalizeDocumentText,
  readDocumentFields,
  refreshCoverage,
} from '../henryDocumentParsing';
import {
  EmiratesIdExtractedData,
  ID_LABELS,
  NATIONALITY_REGISTRY,
} from './types';

export function detectDocumentSide(textOrFileName: string): 'front' | 'back' | 'both' {
  const normalized = textOrFileName.toUpperCase();
  const hasMrz =
    /I[A-Z0-9<]{2}ARE/i.test(normalized) ||
    /\\b\\d{6}\\d[MF<]\\d{7}[A-Z<]{3}/i.test(normalized) ||
    normalized.includes('ILARE') ||
    normalized.includes('IDARE');
  const hasFront =
    normalized.includes('RESIDENT IDENTITY CARD') ||
    normalized.includes('IDENTITY CARD') ||
    normalized.includes('بطاقة هوية') ||
    normalized.includes('UNITED ARAB EMIRATES') ||
    normalized.includes('FEDERAL AUTHORITY');
  if (hasMrz && hasFront) return 'both';
  if (hasMrz) return 'back';
  if (hasFront) return 'front';
  return 'front';
}

export function formatEmiratesId(rawNumber: string): string {
  const cleaned = rawNumber.replace(/\\D/g, '');
  if (cleaned.length === 15) {
    return \`\${cleaned.slice(0, 3)}-\${cleaned.slice(3, 7)}-\${cleaned.slice(7, 14)}-\${cleaned.slice(14, 15)}\`;
  }
  return rawNumber.trim();
}

export function resolveNationality(input: string): { en: string; ar: string; code: string } {
  if (!input) return { en: '', ar: '', code: '' };
  const cleaned = input.trim().toUpperCase();
  if (NATIONALITY_REGISTRY[cleaned]) return NATIONALITY_REGISTRY[cleaned];
  for (const [key, val] of Object.entries(NATIONALITY_REGISTRY)) {
    if (cleaned === key) return val;
  }
  return { en: input.trim(), ar: '', code: '' };
}

export function parseTD1Mrz(line1: string, line2: string, line3: string): Partial<EmiratesIdExtractedData> {
  try {
    const rawLines = [line1, line2, line3].map(l => l.trim().toUpperCase());
    const parsed = parseMrz(rawLines);
    if (parsed && parsed.valid && parsed.fields) {
      const f = parsed.fields;
      const dob = f.birthDate ? normalizeDocumentDate(f.birthDate) : '';
      const exp = f.expirationDate ? normalizeDocumentDate(f.expirationDate) : '';
      const nat = resolveNationality(f.nationality || '');
      const rawDocNum = f.documentNumber || '';
      const optionalData = (f.optional1 || '') + (f.optional2 || '');
      const idMatch = optionalData.match(/784\\d{12}/);
      const rawEid = idMatch ? idMatch[0] : '';
      return {
        idNumber: rawEid ? formatEmiratesId(rawEid) : '',
        rawIdNumber: rawEid,
        cardNumber: rawDocNum,
        firstName: f.firstName || '',
        lastName: f.lastName || '',
        fullNameEn: [f.firstName, f.lastName].filter(Boolean).join(' '),
        dateOfBirth: dob,
        expiryDate: exp,
        nationalityEn: nat.en,
        nationalityAr: nat.ar,
        nationalityCode: nat.code || f.nationality || '',
        gender: (f.sex as 'M' | 'F') || '',
        mrz: { line1: rawLines[0], line2: rawLines[1], line3: rawLines[2] },
      };
    }
  } catch {
    logger.warn('Henry MRZ rejected: invalid format or check digits');
  }
  return {};
}

export function parseOcrText(rawText: string, fileName: string): Partial<EmiratesIdExtractedData> {
  void fileName;
  const text = normalizeDocumentText(rawText);
  const { values, diagnostics } = readDocumentFields(text, ID_LABELS);
  const field = (key: string) => values[key]?.[0] || '';
  const en = (key: string) => languageValue(values[key] || [], 'en');
  const ar = (key: string) => languageValue(values[key] || [], 'ar');
  const visibleIds = [...text.matchAll(/(?<!\\d)784[ -]?\\d{4}[ -]?\\d{7}[ -]?\\d(?!\\d)/g)].map(
    match => formatEmiratesId(match[0])
  );
  values.idNumber = [...new Set(visibleIds)];
  diagnostics.fields.idNumber!.values = values.idNumber;
  diagnostics.fields.idNumber!.state = visibleIds.length ? 'extracted' : 'missing';
  const nationality = resolveNationality(en('nationality'));
  const sex = \`\${field('gender')}\`.trim();
  const result: Partial<EmiratesIdExtractedData> = {
    idNumber: values.idNumber[0] || '',
    cardNumber: field('cardNumber').replace(/\\D/g, ''),
    chipNumber: field('chipNumber').replace(/\\D/g, ''),
    fullNameEn: en('fullName'),
    fullNameAr: ar('fullName'),
    nationalityEn: nationality.en,
    nationalityAr: nationality.ar,
    nationalityCode: nationality.code,
    gender: sex.startsWith('M') || sex.includes('ذكر') ? 'M' : sex.startsWith('F') || sex.includes('أنثى') ? 'F' : '',
    occupationEn: en('occupation'),
    occupationAr: ar('occupation'),
    employerEn: en('employer'),
    employerAr: ar('employer'),
    issuingPlaceEn: en('issuingPlace'),
    issuingPlaceAr: ar('issuingPlace'),
    diagnostics,
  };

  const lines = text.split('\\n').map(line => line.trim()).filter(Boolean);
  const mrzCandidateLines = lines.filter(line => /^[A-Z0-9<]{25,35}$/.test(line));
  for (let index = 0; index <= mrzCandidateLines.length - 3; index += 1) {
    const candidateLines = mrzCandidateLines.slice(index, index + 3);
    const start = candidateLines.findIndex(line => /^(I[A-Z0-9<]{2}ARE|IDARE|ILARE)/.test(line));
    if (start >= 0) {
      const aligned = candidateLines.slice(start);
      if (aligned.length === 3) {
        const mrz = parseTD1Mrz(aligned[0], aligned[1], aligned[2]);
        if (!mrz.mrz) continue;
        result.mrz = mrz.mrz;
        for (const [key, value] of Object.entries(mrz)) {
          if (!value || key === 'mrz') continue;
          const candidate = \`\${value}\`.trim();
          if (!candidate) continue;
          const evidenceKey =
            key === 'fullNameEn' ? 'fullName' : key.startsWith('nationality') ? 'nationality' : key;
          const existing = result[key as keyof EmiratesIdExtractedData] as string | undefined;
          if (
            existing &&
            candidate &&
            existing.trim().toUpperCase() !== candidate.trim().toUpperCase()
          ) {
            diagnostics.fields[evidenceKey] = {
              state: 'conflict',
              source: 'both',
              values: [existing, candidate],
              conflicts: { [key]: [existing, candidate] },
            };
            diagnostics.warnings.push(\`MRZ and visual field conflict for \${key}.\`);
          } else {
            result[key as keyof EmiratesIdExtractedData] = candidate as any;
            if (diagnostics.fields[evidenceKey]) {
              diagnostics.fields[evidenceKey]!.source =
                diagnostics.fields[evidenceKey]!.source === 'text' ? 'both' : 'mrz';
              diagnostics.fields[evidenceKey]!.state = 'extracted';
              diagnostics.fields[evidenceKey]!.values = [candidate];
            }
          }
        }
        break;
      }
    }
  }

  const visibleDates = [...text.matchAll(/\\b(\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4})\\b/g)].map(
    match => normalizeDocumentDate(match[1])
  );
  if (!visibleDates.length) {
    result.dateOfBirth = '';
    result.issueDate = '';
    result.expiryDate = '';
    diagnostics.fields.dateOfBirth!.state = 'missing';
    diagnostics.fields.issueDate!.state = 'missing';
    diagnostics.fields.expiryDate!.state = 'missing';
  } else {
    for (const key of ['dateOfBirth', 'issueDate', 'expiryDate'] as const) {
      const candidates = (values[key] || []).map(normalizeDocumentDate).filter(Boolean);
      result[key] = candidates[0] || '';
      diagnostics.fields[key]!.values = candidates;
      diagnostics.fields[key]!.state = candidates.length ? 'extracted' : 'missing';
      if (new Set(candidates).size > 1) {
        diagnostics.fields[key]!.state = 'conflict';
        diagnostics.warnings.push(\`Multiple conflicting values detected for \${key}.\`);
      }
    }
  }

  const conflicts = Object.fromEntries(
    Object.entries(diagnostics.fields).filter(([, fieldEvidence]) => fieldEvidence.state === 'conflict')
  );
  if (Object.keys(conflicts).length) {
    diagnostics.warnings.push('Optical and visual reading conflicts were isolated.');
  }

  for (const key of ['dateOfBirth', 'issueDate', 'expiryDate'] as const) {
    if (!validScanDate(result[key] || '')) {
      result[key] = '';
      if (diagnostics.fields[key]!.state !== 'conflict') diagnostics.fields[key]!.state = 'missing';
    }
  }
  for (const key of ['cardNumber', 'chipNumber'] as const) {
    if (result[key] && !/^\\d{8,16}$/.test(result[key]!)) {
      result[key] = '';
      diagnostics.fields[key]!.state = 'missing';
      diagnostics.warnings.push(\`\${key}: unreadable numeric identifier; compare the original.\`);
    }
  }
  if (!result.gender && diagnostics.fields.gender!.state !== 'conflict')
    diagnostics.fields.gender!.state = 'missing';
  refreshCoverage(diagnostics);
  return result;
}
`;

fs.writeFileSync(path.join(targetDir, 'parser.logic.ts'), parserContent, 'utf-8');
console.log('Created emiratesId/parser.logic.ts');

// 4. ocrEngine.logic.ts
const ocrEngineContent = `/**
 * ocrEngine.logic.ts — High-Res Canvas Rasterization & Tesseract OCR Pipeline
 */

import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import logger from '../../utils/logger';
import { imageQualityWarnings } from '../henryImageQuality';
import { PdfPageLimitError } from './types';

export async function renderPdfToCanvasAndText(
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
    }, 12_000);
  });

  const workerWork = (async () => {
    const pdfjs = await import('pdfjs-dist');
    if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
    }
    const data = await file.arrayBuffer();
    loadingTask = pdfjs.getDocument({ data });
    const pdfDoc = await loadingTask.promise;
    if (pdfDoc.numPages > 2) throw new PdfPageLimitError();
    const canvasDataUrls: string[] = [];
    const textPieces: string[] = [];
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map(item => ('str' in item ? (item as { str: string }).str : ''))
        .join(' ');
      textPieces.push(pageText);

      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        await page.render({ canvasContext: ctx, viewport }).promise;
        canvasDataUrls.push(canvas.toDataURL('image/png'));
      }
      canvas.width = 0;
      canvas.height = 0;
      if (coverage && coverage(textPieces.join('\\n')) >= 1) break;
    }
    return { canvasDataUrls, pdfText: textPieces.join('\\n') };
  })();

  try {
    return await Promise.race([workerWork, deadline]);
  } catch (error) {
    if (error instanceof PdfPageLimitError) throw error;
    logger.warn('Henry direct PDF parsing timed out or failed; falling back to canvas OCR.');
    return { canvasDataUrls: [], pdfText: '' };
  } finally {
    clearTimeout(timer);
    if (loadingTask) {
      const cleanupTimer = setTimeout(() => {
        logger.warn('Henry background PDF loading cleanup timed out');
      }, 3000);
      void loadingTask
        .destroy()
        .catch(() => logger.warn('Henry background PDF loading cleanup failed'))
        .finally(() => clearTimeout(cleanupTimer));
    }
  }
}

export async function preProcessImageOnCanvas(
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
    img.onerror = () => {
      release();
      resolve('');
    };
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          release();
          resolve('');
          return;
        }
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        if (!width || !height || width * height > 40_000_000) {
          release();
          if (warnings) warnings.push('Image dimensions exceed the 40 megapixel limit.');
          resolve('');
          return;
        }
        if (warnings && Math.max(width, height) < 1000) {
          warnings.push('Low-resolution image detected; details may be degraded.');
        }

        const isSideways = rotation === 90 || rotation === 270;
        canvas.width = isSideways ? height : width;
        canvas.height = isSideways ? width : height;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -width / 2, -height / 2);

        if (enhance) {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          if (warnings) warnings.push(...imageQualityWarnings(imgData, width, height));
          const d = imgData.data;
          for (let i = 0; i < d.length; i += 4) {
            const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
            const contrast = 1.35 * (gray - 128) + 128;
            const clamped = Math.max(0, Math.min(255, contrast));
            d[i] = clamped;
            d[i + 1] = clamped;
            d[i + 2] = clamped;
          }
          ctx.putImageData(imgData, 0, 0);
        }
        release();
        resolve(canvas.toDataURL('image/png'));
      } catch {
        release();
        resolve('');
      }
    };
    img.src = objectUrl;
  });
}

export async function extractDocumentText(
  file: File | string,
  onProgress?: (progress: number) => void
): Promise<{ ocrText: string; streamText: string; ocrConfidence?: number; warnings?: string[] }> {
  if (typeof window === 'undefined') return { ocrText: '', streamText: '' };
  const isPdf = typeof file !== 'string' && file.type === 'application/pdf';
  let streamText = '';
  let pageImages: string[] = [];
  const warnings: string[] = [];
  if (isPdf) {
    const pdfData = await renderPdfToCanvasAndText(file as File);
    streamText = pdfData.pdfText;
    pageImages = pdfData.canvasDataUrls;
  }
  const processedUrl = pageImages.length
    ? pageImages[0]
    : await preProcessImageOnCanvas(file, 0, true, warnings);
  if (!processedUrl) throw new Error('Image could not be safely decoded.');
  if (onProgress) onProgress(30);

  const tesseract = await import('tesseract.js');
  const worker = await tesseract.createWorker('eng+ara');
  const texts: string[] = [];
  const confidences: number[] = [];
  try {
    for (const input of pageImages.length ? pageImages : [processedUrl]) {
      const ret = await worker.recognize(input);
      texts.push(ret.data.text || '');
      if (Number.isFinite(ret.data.confidence)) confidences.push(ret.data.confidence);
    }
  } finally {
    await worker.terminate();
  }
  const avgConfidence = confidences.length
    ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length)
    : undefined;
  return {
    ocrText: texts.join('\\n'),
    streamText,
    ocrConfidence: avgConfidence,
    warnings,
  };
}
`;

fs.writeFileSync(path.join(targetDir, 'ocrEngine.logic.ts'), ocrEngineContent, 'utf-8');
console.log('Created emiratesId/ocrEngine.logic.ts');

// 5. merger.logic.ts
const mergerContent = `/**
 * merger.logic.ts — Dual-Side Card Merging & External Payload Mappings
 */

import { ContractParty, ViewingFormPayload } from '../HenryPdfEngineService';
import {
  canUseScan,
  scanExpiry,
  validScanDate,
} from '../henryScanReview';
import {
  normalizeDocumentDate,
  refreshCoverage,
} from '../henryDocumentParsing';
import { EmiratesIdExtractedData } from './types';

export function mergeDualSideResults(
  frontResult: EmiratesIdExtractedData,
  backResult: EmiratesIdExtractedData,
  frontFile: File,
  backFile: File
): EmiratesIdExtractedData {
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

  const frontText = frontResult.diagnostics?.sourceText || '';
  const backText = backResult.diagnostics?.sourceText || '';
  const sourceText = \`\${frontText}\\n\${backText}\`.slice(0, 65536);
  for (const [key, evidence] of Object.entries(mergedFields)) {
    const frontRanges = frontResult.diagnostics?.fields[key]?.textRanges || [];
    const backRanges = (backResult.diagnostics?.fields[key]?.textRanges || []).map(range => ({
      start: range.start + frontText.length + 1,
      end: range.end + frontText.length + 1,
    }));
    mergedFields[key] = {
      ...evidence,
      textRanges: [...frontRanges, ...backRanges].filter(range => range.end <= sourceText.length),
    };
  }

  const merged: EmiratesIdExtractedData = {
    ...frontResult,
    idNumber: frontResult.idNumber || backResult.idNumber,
    rawIdNumber: (frontResult.idNumber || backResult.idNumber).replace(/\\D/g, ''),
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
    documentFormat: \`\${frontFile.type || 'image'}, \${backFile.type || 'image'}\`,
    reviewConfirmed: false,
    diagnostics: {
      fields: mergedFields,
      sourceText,
      coverage: 0,
      warnings: [
        ...(frontResult.diagnostics?.warnings || []),
        ...(backResult.diagnostics?.warnings || []),
      ],
    },
  };

  merged.missingFields = [
    !/^784-\\d{4}-\\d{7}-\\d$/.test(merged.idNumber) && 'idNumber',
    !merged.fullNameEn.trim() && 'fullNameEn',
    !validScanDate(merged.expiryDate) && 'expiryDate',
  ].filter((value): value is string => !!value);
  Object.assign(merged, scanExpiry(merged.expiryDate));
  refreshCoverage(merged.diagnostics!);
  merged.detectedFieldsCount = Object.values(mergedFields).filter(
    field => field.state === 'extracted'
  ).length;

  return merged;
}

export function toContractParty(
  extracted: EmiratesIdExtractedData,
  phone = '',
  email = ''
): ContractParty {
  if (!canUseScan(extracted)) throw new Error('Confirm review before autofill.');
  return {
    name: extracted.fullNameEn || extracted.fullNameAr,
    emiratesIdOrPassport: extracted.idNumber || extracted.cardNumber,
    nationality: extracted.nationalityEn,
    phone,
    email,
  };
}

export function toViewingClientPayload(
  extracted: EmiratesIdExtractedData,
  base: Partial<ViewingFormPayload> = {}
): ViewingFormPayload {
  if (!canUseScan(extracted)) throw new Error('Confirm review before autofill.');
  return {
    clientName: extracted.fullNameEn || extracted.fullNameAr,
    clientNationality: extracted.nationalityEn,
    clientPassportOrEid: extracted.idNumber || extracted.cardNumber,
    ...base,
  } as ViewingFormPayload;
}

export function exportToJson(extracted: EmiratesIdExtractedData): Record<string, any> {
  const { diagnostics, ...safeData } = extracted;
  void diagnostics;
  return safeData;
}

export function exportToJsonString(extracted: EmiratesIdExtractedData): string {
  return JSON.stringify(exportToJson(extracted), null, 2);
}
`;

fs.writeFileSync(path.join(targetDir, 'merger.logic.ts'), mergerContent, 'utf-8');
console.log('Created emiratesId/merger.logic.ts');

// 6. HenryEmiratesIdScannerService.ts (Slim Root Façade)
const rootServiceContent = `/**
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
      return structuredClone(this.activeSessionCache);
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
    file: File | string,
    onProgress?: (progress: number) => void
  ): Promise<{ ocrText: string; streamText: string; ocrConfidence?: number; warnings?: string[] }> {
    return extractDocumentText(file, onProgress);
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
    const combinedRawText = \`\${ocrText}\\n\${streamText}\`;
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
      !/^784-\\d{4}-\\d{7}-\\d$/.test(parsed.idNumber || '') && 'idNumber',
      !parsed.fullNameEn?.trim() && 'fullNameEn',
      !validScanDate(parsed.expiryDate || '') && 'expiryDate',
    ].filter((value): value is string => !!value);
    const result: EmiratesIdExtractedData = {
      ...EMPTY_EMIRATES_ID,
      ...parsed,
      rawIdNumber: (parsed.idNumber || '').replace(/\\D/g, ''),
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
    return { ...DEFAULT_VERIFIED_EID };
  }

  getIndianClientDemoData(): EmiratesIdExtractedData {
    return { ...DEFAULT_VERIFIED_EID };
  }

  getIbrahimSirajDemoData(): EmiratesIdExtractedData {
    return { ...DEFAULT_VERIFIED_EID };
  }

  toContractParty(
    extracted: EmiratesIdExtractedData,
    phone = '',
    email = ''
  ): ContractParty {
    return toContractParty(extracted, phone, email);
  }

  toViewingClientPayload(
    extracted: EmiratesIdExtractedData,
    base: Partial<ViewingFormPayload> = {}
  ): ViewingFormPayload {
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
`;

fs.writeFileSync(path.join(srcDir, 'HenryEmiratesIdScannerService.ts'), rootServiceContent, 'utf-8');
console.log('Replaced HenryEmiratesIdScannerService.ts with slim modular facade');

