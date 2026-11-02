/**
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
