/**
 * HenryTitleDeedScannerService.ts — Dubai Land Department (DLD) Title Deed OCR & Extraction Engine
 *
 * Provides comprehensive algorithmic parsing of official DLD Title Deeds (شهادة ملكية عقار):
 * 1. Bilingual property specifications (Community, Building, Unit, Floor, Plot, Municipality, Parking).
 * 2. Precision area metrics (Suite, Balcony, Total SqM, Total SqFt, Common Area).
 * 3. Registered ownership details (DLD Party ID, English/Arabic names, Ownership shares).
 * 4. Conveyancing history & purchase contract records (Registration No, Seller, Amount in AED & words).
 * 5. 1-Click variable mapping for Tenancy Contracts, Ejari, CRM Listings, and Form A Mandates.
 */

import { TenancyContractPayload, ContractParty } from './HenryPdfEngineService';
import henryEmiratesIdScannerService from './HenryEmiratesIdScannerService';
import {
  ScanReview,
  VaultSaveOptions,
  canUseScan,
  saveReviewedScan,
  validScanDate,
} from './henryScanReview';
import {
  languageValue,
  normalizeDocumentDate,
  normalizeDocumentText,
  parseDocumentNumber,
  readDocumentFields,
  refreshCoverage,
} from './henryDocumentParsing';

const DEED_LABELS: Record<string, string[]> = {
  certificateNumber: [
    'Certificate Number',
    'Certificate No.',
    'Certificate No',
    'Title Deed Number',
    'Title Deed No.',
    'Title Deed No',
    'رقم الشهادة',
    'رقم سند الملكية',
  ],
  issueDate: ['Issue Date', 'Date of Issue', 'تاريخ الإصدار', 'تاريخ الاصدار'],
  issuingAuthority: ['Issuing Authority', 'جهة الإصدار'],
  propertyType: ['Property Type', 'نوع العقار'],
  community: ['Community', 'Area Name', 'المنطقة', 'اسم المنطقة'],
  plotNumber: ['Plot Number', 'Plot No.', 'Land Number', 'رقم الأرض', 'رقم الارض'],
  municipalityNumber: ['Municipality Number', 'Municipality No.', 'رقم البلدية'],
  buildingNumber: ['Building Number', 'Building No.', 'رقم المبنى'],
  buildingName: ['Building Name', 'اسم المبنى'],
  propertyNumber: ['Property Number', 'Unit Number', 'Unit No.', 'رقم العقار', 'رقم الوحدة'],
  floorNumber: ['Floor Number', 'Floor', 'رقم الطابق', 'الطابق'],
  parkingNumber: ['Parking Number', 'Parking No.', 'رقم الموقف'],
  mortgageStatus: ['Mortgage Status', 'حالة الرهن'],
  suiteAreaSqM: ['Suite Area', 'مساحة الوحدة'],
  balconyAreaSqM: ['Balcony Area', 'مساحة الشرفة'],
  totalAreaSqM: ['Total Area', 'Area SqM', 'المساحة الإجمالية', 'المساحة الاجمالية', 'المساحة'],
  totalAreaSqFt: ['Total Area SqFt', 'Area SqFt', 'المساحة بالقدم المربع'],
  commonAreaSqM: ['Common Area', 'المساحة المشتركة'],
  ownerDldNumber: [
    'Owner DLD Number',
    'Owner Number',
    'Owner No.',
    'Party Number',
    'رقم المالك',
    'رقم الطرف',
  ],
  ownerName: ['Owner Name', 'Owner', 'اسم المالك'],
  ownerSharePercent: ['Ownership Share', 'Owner Share', 'Share Percent', 'نسبة الملكية', 'الحصة'],
  ownedAreaSqM: ['Owned Area', 'المساحة المملوكة'],
  purchasedFrom: ['Purchased From', 'Seller Name', 'اسم البائع', 'تم الشراء من'],
  registrationContractNumber: [
    'Registration Contract Number',
    'Transaction Number',
    'Contract Number',
    'رقم العقد',
    'رقم المعاملة',
  ],
  registrationDate: ['Registration Date', 'Transaction Date', 'تاريخ التسجيل', 'تاريخ المعاملة'],
  purchasePriceAed: [
    'Purchase Price',
    'Purchase Value',
    'Transaction Value',
    'قيمة الشراء',
    'قيمة المعاملة',
  ],
  purchasePriceWordsEn: ['Purchase Price in Words', 'Amount in Words', 'القيمة كتابة'],
};

export interface DeedOwner {
  dldNumber: string;
  nameEn: string;
  nameAr: string;
  sharePercent?: number;
  ownedAreaSqM?: number;
}

export interface DldTitleDeedExtractedData extends ScanReview {
  owners?: DeedOwner[];
  mortgageState?: 'mortgaged' | 'not_mortgaged' | 'unknown';
  // Document Meta
  certificateNumber: string; // e.g. "140764/2023"
  issueDate: string; // e.g. "18/07/2023"
  issuingAuthorityEn: string; // "Government of Dubai - Land Department"
  issuingAuthorityAr: string; // "حكومة دبي - دائرة الأراضي والأملاك"
  isBlockchainVerified: boolean;
  documentFormat?: string;

  // Property Details
  propertyTypeEn: string; // "Hotel Apartment"
  propertyTypeAr: string; // "شقة فندقية"
  communityEn: string; // "Madinat Hind 4" (DAMAC Hills 2)
  communityAr: string; // "مدينة هند 4"
  plotNumber: string; // "5120"
  municipalityNumber: string; // "914 - 18558"
  buildingNumber: string; // "1"
  buildingNameEn: string; // "VIRIDIS A"
  buildingNameAr: string; // "فريديس ايه A"
  propertyNumber: string; // "504" (Unit)
  floorNumber: string; // "5"
  parkingNumber: string; // "P2-56"
  mortgageStatusEn: string; // "Not mortgaged"
  mortgageStatusAr: string; // "غير مرهونة"
  isMortgaged: boolean;

  // Area Measurements
  suiteAreaSqM: number; // 32.48
  balconyAreaSqM: number; // 6.28
  totalAreaSqM: number; // 38.76
  totalAreaSqFt: number; // 417.21
  commonAreaSqM: number; // 12.65

  // Ownership Details
  ownerDldNumber: string; // "6108481"
  ownerNameEn: string; // "AKRAM DIB NEHME"
  ownerNameAr: string; // "أكرم ديب نعمة"
  ownerSharePercent: number; // 100
  ownedAreaSqM: number; // 38.76

  // Conveyancing & Transaction History
  purchasedFromEn: string; // "FRONT LINE INVESTMENT MANAGEMENT L.L.C"
  purchasedFromAr: string; // "شركة الخط الأمامي لإدارة الاستثمار ش.ذ.م.م"
  registrationContractNumber: string; // "131762/2023"
  registrationDate: string; // "18/07/2023"
  purchasePriceAed: number; // 353000
  purchasePriceWordsEn: string; // "Three Hundred Fifty Three Thousand UAE Dirhams only"

  // Extraction Telemetry
  confidenceScore: number; // 0.999
  scannedAt: string; // ISO timestamp
}

export const VIRIDIS_504_SAMPLE_TITLE_DEED: DldTitleDeedExtractedData = {
  demoOnly: true,
  reviewConfirmed: false,
  certificateNumber: '140764/2023',
  issueDate: '18/07/2023',
  issuingAuthorityEn: 'Government of Dubai — Land Department',
  issuingAuthorityAr: 'حكومة دبي — دائرة الأراضي والأملاك',
  isBlockchainVerified: false,

  propertyTypeEn: 'Hotel Apartment',
  propertyTypeAr: 'شقة فندقية',
  communityEn: 'Madinat Hind 4 (DAMAC Hills 2)',
  communityAr: 'مدينة هند 4',
  plotNumber: '5120',
  municipalityNumber: '914 - 18558',
  buildingNumber: '1',
  buildingNameEn: 'VIRIDIS A',
  buildingNameAr: 'فريديس ايه A',
  propertyNumber: '504',
  floorNumber: '5',
  parkingNumber: 'P2-56',
  mortgageStatusEn: 'Not mortgaged',
  mortgageStatusAr: 'غير مرهونة',
  isMortgaged: false,

  suiteAreaSqM: 32.48,
  balconyAreaSqM: 6.28,
  totalAreaSqM: 38.76,
  totalAreaSqFt: 417.21,
  commonAreaSqM: 12.65,

  ownerDldNumber: '6108481',
  ownerNameEn: 'AKRAM DIB NEHME',
  ownerNameAr: 'أكرم ديب نعمة',
  ownerSharePercent: 100,
  ownedAreaSqM: 38.76,

  purchasedFromEn: 'FRONT LINE INVESTMENT MANAGEMENT L.L.C',
  purchasedFromAr: 'شركة الخط الأمامي لإدارة الاستثمار ش.ذ.م.م',
  registrationContractNumber: '131762/2023',
  registrationDate: '18/07/2023',
  purchasePriceAed: 353000,
  purchasePriceWordsEn: 'Three Hundred Fifty Three Thousand UAE Dirhams only',

  confidenceScore: 0.999,
  scannedAt: new Date().toISOString(),
};

export const BUKO_COMMODITY_MADINAT_HIND_TITLE_DEED_SAMPLE: DldTitleDeedExtractedData = {
  demoOnly: true,
  reviewConfirmed: false,
  certificateNumber: '93757/2025',
  issueDate: '13/10/2025',
  issuingAuthorityEn: 'Government of Dubai — Land Department',
  issuingAuthorityAr: 'دائرة الأراضي والأملاك',
  isBlockchainVerified: false,

  propertyTypeEn: 'Land',
  propertyTypeAr: 'ارض',
  communityEn: 'Madinat Hind 4',
  communityAr: 'مدينة هند 4',
  plotNumber: '7354',
  municipalityNumber: '914 - 20879',
  buildingNumber: '',
  buildingNameEn: 'Plot 7354 Madinat Hind 4',
  buildingNameAr: 'أرض 7354 مدينة هند 4',
  propertyNumber: '7354',
  floorNumber: 'Ground',
  parkingNumber: 'N/A',
  mortgageStatusEn: 'Not mortgaged',
  mortgageStatusAr: 'غير مرهونة',
  isMortgaged: false,

  suiteAreaSqM: 192.49,
  balconyAreaSqM: 0,
  totalAreaSqM: 192.49,
  totalAreaSqFt: 2071.95,
  commonAreaSqM: 0,

  ownerDldNumber: '5124391',
  ownerNameEn: 'BUKO COMMODITY DMCC',
  ownerNameAr: 'بوكو كوموديتي م د م س',
  ownerSharePercent: 100,
  ownedAreaSqM: 192.49,

  purchasedFromEn: 'FRONT LINE INVESTMENT MANAGEMENT L.L.C',
  purchasedFromAr: 'شركة الخط الامامي لادارة الاستثمار ش.ذ.م.م',
  registrationContractNumber: '22855/2023',
  registrationDate: '13/10/2025',
  purchasePriceAed: 1717600,
  purchasePriceWordsEn: 'One Million Seven Hundred Seventeen Thousand Six Hundred UAE Dirhams only',

  confidenceScore: 1.0,
  scannedAt: new Date().toISOString(),
};

class HenryTitleDeedScannerService {
  private cacheRevision = 0;
  private inMemoryCache: DldTitleDeedExtractedData | null = null;
  private listeners: Set<(data: DldTitleDeedExtractedData | null) => void> = new Set();

  /**
   * Keeps reviewed Title Deed data in session memory only
   */
  setCachedTitleDeed(data: DldTitleDeedExtractedData): void {
    this.cacheRevision++;
    if (!canUseScan(data)) {
      this.clearCachedTitleDeed();
      return;
    }
    this.inMemoryCache = structuredClone(data);
    this.notifyListeners(this.inMemoryCache);
  }

  /**
   * Retrieves active Title Deed from temporary session cache
   */
  getCachedTitleDeed(): DldTitleDeedExtractedData | null {
    if (this.inMemoryCache) return structuredClone(this.inMemoryCache);
    return null;
  }

  /**
   * Clears the active Title Deed session cache
   */
  clearCachedTitleDeed(): void {
    this.cacheRevision++;
    this.inMemoryCache = null;
    this.notifyListeners(null);
  }

  /**
   * Registers a subscriber listener to receive active Title Deed cache mutations
   */
  onTitleDeedUpdated(listener: (data: DldTitleDeedExtractedData | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Returns benchmark reference sample 2 (BUKO COMMODITY DMCC - Plot 7354 Madinat Hind 4)
   */
  getBukoSample(): DldTitleDeedExtractedData {
    const sample = {
      ...BUKO_COMMODITY_MADINAT_HIND_TITLE_DEED_SAMPLE,
      scannedAt: new Date().toISOString(),
      demoOnly: true,
      reviewConfirmed: false,
      isBlockchainVerified: false,
    };
    return sample;
  }

  private notifyListeners(data: DldTitleDeedExtractedData | null): void {
    this.listeners.forEach(listener => {
      try {
        listener(data ? structuredClone(data) : null);
      } catch (err) {
        console.error('Error notifying Henry Title Deed cache listener:', err);
      }
    });
  }
  /**
   * Scans an uploaded Title Deed PDF / image or returns reference sample
   */
  async scanTitleDeed(
    fileOrPreset?: File | 'sample' | 'sample_viridis' | 'sample_buko'
  ): Promise<DldTitleDeedExtractedData> {
    if (!fileOrPreset) throw new Error('Upload a title deed to scan.');
    if (typeof fileOrPreset === 'string')
      return fileOrPreset === 'sample_buko' ? this.getBukoSample() : this.getDemoExtractedData();
    const file = fileOrPreset;
    if (
      !['image/png', 'image/jpeg', 'application/pdf'].includes(file.type) ||
      !file.size ||
      file.size > 10 * 1024 * 1024
    )
      throw new Error('Use a PNG, JPEG or PDF under 10 MB.');
    const { ocrText, streamText, ocrConfidence, warnings } =
      await henryEmiratesIdScannerService.extractDocumentText(file, undefined, text => {
        const parsed = this.parseDocumentText(text);
        return (
          [
            !!parsed.certificateNumber,
            !!parsed.ownerNameEn || !!parsed.owners?.length,
            !!(parsed.propertyNumber || parsed.plotNumber),
          ].filter(Boolean).length / 3
        );
      });
    const text = `${ocrText}\n${streamText}`;
    if (!text.trim())
      throw new Error('No readable text. Rescan in good lighting with all deed edges visible.');
    const result = this.parseDocumentText(text);
    if (result.diagnostics) {
      result.diagnostics.ocrConfidence = ocrConfidence;
      result.diagnostics.warnings.push(...(warnings || []));
    }
    return { ...result, documentFormat: file.type };
  }

  parseDocumentText(text: string): DldTitleDeedExtractedData {
    const { values, diagnostics } = readDocumentFields(text, DEED_LABELS);
    const field = (key: string) => values[key]?.[0] || '';
    const en = (key: string) => languageValue(values[key] || [], 'en');
    const ar = (key: string) => languageValue(values[key] || [], 'ar');
    const squareFeet = (value: string) => /\bsq\.? ?ft\b|ft[²2]|قدم/i.test(value);
    const normalizedNumber = (key: string, raw: string): number | undefined => {
      const value = parseDocumentNumber(raw);
      if (value === undefined) return undefined;
      if (key.endsWith('SqM') && squareFeet(raw)) return value / 10.7639104167;
      if (key.endsWith('SqFt') && /\bsq\.? ?m\b|m[²2]|متر|م[²2]/i.test(raw))
        return value * 10.7639104167;
      return value;
    };
    const numericDisagreement = (key: string, rawValues: string[]) => {
      const candidates = rawValues
        .map(raw => ({
          value: normalizedNumber(key, raw),
          converted: key.endsWith('SqM')
            ? squareFeet(raw)
            : key.endsWith('SqFt') && /\bsq\.? ?m\b|m[²2]|متر|م[²2]/i.test(raw),
        }))
        .filter(
          (candidate): candidate is { value: number; converted: boolean } =>
            candidate.value !== undefined
        );
      // Conversion allows only the rounding of printed two-decimal areas, not a percentage discrepancy.
      return candidates.some((candidate, index) =>
        candidates
          .slice(index + 1)
          .some(
            other =>
              Math.abs(candidate.value - other.value) >
              (candidate.converted || other.converted
                ? key.endsWith('SqFt')
                  ? 0.12
                  : 0.011
                : 0.000001)
          )
      );
    };
    const numeric = (key: string) => {
      let value = normalizedNumber(key, field(key));
      if (value === undefined) diagnostics.fields[key]!.state = 'missing';
      else if (value !== parseDocumentNumber(field(key))) {
        value = Number(value.toFixed(2));
        diagnostics.fields[key] = { state: 'derived', source: 'conversion', values: [field(key)] };
      }
      return value ?? 0; // Legacy payload uses zero; evidence explicitly distinguishes absent from visible zero.
    };
    const certificateNumber = field('certificateNumber');
    let ownerNameEn = en('ownerName');
    let ownerNameAr = ar('ownerName');
    const propertyNumber = field('propertyNumber');
    const plotNumber = field('plotNumber');
    let totalAreaSqM = parseDocumentNumber(field('totalAreaSqM')) ?? 0;
    if (!field('totalAreaSqM') || parseDocumentNumber(field('totalAreaSqM')) === undefined)
      diagnostics.fields.totalAreaSqM!.state = 'missing';
    let totalAreaSqFt = numeric('totalAreaSqFt');
    if (/\b(?:sq\.? ?ft|ft2|ft²)\b|قدم/i.test(field('totalAreaSqM'))) {
      totalAreaSqFt = totalAreaSqM;
      diagnostics.fields.totalAreaSqFt = {
        ...diagnostics.fields.totalAreaSqM!,
        state: 'extracted',
      };
      diagnostics.fields.totalAreaSqM!.state = 'missing';
    }
    if (
      diagnostics.fields.totalAreaSqM!.state === 'missing' &&
      diagnostics.fields.totalAreaSqFt!.state === 'extracted'
    ) {
      totalAreaSqM = Number((totalAreaSqFt / 10.7639104167).toFixed(2));
      diagnostics.fields.totalAreaSqM = {
        state: 'derived',
        source: 'conversion',
        values: ['totalAreaSqFt / 10.7639104167'],
      };
    } else if (
      diagnostics.fields.totalAreaSqFt!.state === 'missing' &&
      diagnostics.fields.totalAreaSqM!.state === 'extracted'
    ) {
      totalAreaSqFt = Number((totalAreaSqM * 10.7639104167).toFixed(2));
      diagnostics.fields.totalAreaSqFt = {
        state: 'derived',
        source: 'conversion',
        values: ['totalAreaSqM * 10.7639104167'],
      };
    }
    const owners: DeedOwner[] = [];
    const ownerEvidence = new WeakMap<DeedOwner, Record<string, string[]>>();
    let ambiguousOwner = false;
    const normalizedName = (name: string) => normalizeDocumentText(name).trim().toLowerCase();
    const addOwner = (parsed: Record<string, string[]>) => {
      if (!parsed.ownerDldNumber?.[0] || !parsed.ownerName?.length) return;
      if (!/^\d+$/.test(parsed.ownerDldNumber[0])) return;
      const ambiguousKeys = ['ownerDldNumber', 'ownerSharePercent', 'ownedAreaSqM'].filter(key =>
        key === 'ownerDldNumber'
          ? (parsed[key]?.length || 0) > 1
          : numericDisagreement(key, parsed[key] || [])
      );
      if (
        ['en', 'ar'].some(
          language =>
            new Set(
              parsed
                .ownerName!.map(value =>
                  normalizedName(languageValue([value], language as 'en' | 'ar'))
                )
                .filter(Boolean)
            ).size > 1
        )
      )
        ambiguousKeys.push('ownerName');
      if (ambiguousKeys.length) {
        ambiguousOwner = true;
        for (const key of ambiguousKeys) diagnostics.fields[key]!.state = 'conflict';
        return;
      }
      const owner: DeedOwner = {
        dldNumber: parsed.ownerDldNumber[0],
        nameEn: languageValue(parsed.ownerName, 'en'),
        nameAr: languageValue(parsed.ownerName, 'ar'),
        sharePercent: normalizedNumber('ownerSharePercent', parsed.ownerSharePercent?.[0] || ''),
        ownedAreaSqM: normalizedNumber('ownedAreaSqM', parsed.ownedAreaSqM?.[0] || ''),
      };
      const sameName = (item: DeedOwner) =>
        (['nameEn', 'nameAr'] as const).every(
          key =>
            !item[key] || !owner[key] || normalizedName(item[key]) === normalizedName(owner[key])
        );
      const existing =
        owners.find(item => item.dldNumber === owner.dldNumber && sameName(item)) ||
        owners.find(item => item.dldNumber === owner.dldNumber);
      if (!existing) {
        owners.push(owner);
        ownerEvidence.set(owner, parsed);
        return;
      }
      const conflicting = [
        ...(['nameEn', 'nameAr'] as const)
          .filter(
            key =>
              existing[key] &&
              owner[key] &&
              normalizedName(existing[key]) !== normalizedName(owner[key])
          )
          .map(() => 'ownerName'),
        ...(['sharePercent', 'ownedAreaSqM'] as const)
          .filter(
            key =>
              existing[key] !== undefined &&
              owner[key] !== undefined &&
              numericDisagreement(key === 'sharePercent' ? 'ownerSharePercent' : key, [
                ...(ownerEvidence.get(existing)?.[
                  key === 'sharePercent' ? 'ownerSharePercent' : key
                ] || []),
                ...(parsed[key === 'sharePercent' ? 'ownerSharePercent' : key] || []),
              ])
          )
          .map(key => (key === 'sharePercent' ? 'ownerSharePercent' : key)),
      ];
      if (conflicting.length) {
        ambiguousOwner = true;
        for (const key of conflicting) {
          diagnostics.fields[key]!.state = 'conflict';
          const candidates =
            key === 'ownerName'
              ? [existing.nameEn, existing.nameAr, owner.nameEn, owner.nameAr]
              : key === 'ownerSharePercent'
                ? [existing.sharePercent, owner.sharePercent]
                : [existing.ownedAreaSqM, owner.ownedAreaSqM];
          diagnostics.fields[key]!.values = [
            ...new Set([
              ...diagnostics.fields[key]!.values,
              ...candidates.filter(value => value !== undefined && value !== '').map(String),
            ]),
          ];
        }
        if (!sameName(existing)) owners.push(owner);
        return;
      }
      existing.nameEn ||= owner.nameEn;
      existing.nameAr ||= owner.nameAr;
      existing.sharePercent ??= owner.sharePercent;
      existing.ownedAreaSqM ??= owner.ownedAreaSqM;
      const previous = ownerEvidence.get(existing) || {};
      ownerEvidence.set(
        existing,
        Object.fromEntries(
          Object.keys(parsed).map(key => [
            key,
            [...new Set([...(previous[key] || []), ...(parsed[key] || [])])],
          ])
        )
      );
    };
    // Table rows and labelled blocks use the same association checks.
    const ownerAliases = DEED_LABELS.ownerDldNumber!.map(label =>
      normalizeDocumentText(label)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/ /g, '[ \\t]+')
    );
    const blocks = normalizeDocumentText(text).split(
      new RegExp(`(?=(?<![\\p{L}\\p{N}])(?:${ownerAliases.join('|')})(?![\\p{L}\\p{N}]))`, 'giu')
    );
    for (const block of blocks) addOwner(readDocumentFields(block, DEED_LABELS).values);
    const lines = normalizeDocumentText(text).split('\n');
    const ownerKeys = ['ownerDldNumber', 'ownerName', 'ownerSharePercent', 'ownedAreaSqM'];
    for (let i = 0; i < lines.length; i++) {
      const headers = lines[i]!.split(/\s*\|\s*/);
      const columns = headers.map(header =>
        ownerKeys.find(key =>
          DEED_LABELS[key]!.some(label => header.trim().toLowerCase() === label.toLowerCase())
        )
      );
      if (!columns.includes('ownerDldNumber') || !columns.includes('ownerName')) continue;
      for (let j = i + 1; j < lines.length; j++) {
        const cells = lines[j]!.split(/\s*\|\s*/);
        if (
          cells.length !== headers.length ||
          !/^\d+$/.test(cells[columns.indexOf('ownerDldNumber')] || '')
        )
          {
            if (cells.length === headers.length && cells.some(cell => cell.trim())) {
              ambiguousOwner = true;
              diagnostics.fields.ownerDldNumber!.state = 'conflict';
              diagnostics.warnings.push('Unassociated owner table row; compare identifiers and cell boundaries manually.');
            }
            break;
          }
        // Only attach continuation rows with empty identifiers and numeric cells.
        // Non-empty identifiers always begin a new owner, never an inferred association.
        while (j + 1 < lines.length) {
          const continuation = lines[j + 1]!.split(/\s*\|\s*/);
          if (continuation.length !== headers.length ||
            continuation.some((cell, index) => columns[index] !== 'ownerName' && cell.trim()) ||
            !continuation.some((cell, index) => columns[index] === 'ownerName' && cell.trim())) break;
          continuation.forEach((cell, index) => {
            if (columns[index] === 'ownerName' && cell.trim()) cells[index] += ` ${cell.trim()}`;
          });
          j++;
        }
        const parsed = Object.fromEntries(
          ownerKeys.map(key => [
            key,
            [
              ...new Set(
                cells
                  .filter((_, index) => columns[index] === key)
                  .map(value => value.trim())
                  .filter(Boolean)
              ),
            ],
          ])
        );
        addOwner(parsed);
      }
    }
    const shares = owners.map(owner => owner.sharePercent);
    if (shares.some(share => share !== undefined && (share < 0 || share > 100)) ||
      owners.length > 1 && shares.every(share => share !== undefined) &&
      Math.abs(shares.reduce<number>((sum, share) => sum + (share ?? 0), 0) - 100) > 0.01) {
      ambiguousOwner = true;
      diagnostics.fields.ownerSharePercent!.state = 'conflict';
      diagnostics.warnings.push('Owner share percentages are out of range or do not total 100%; verify the complete table without guessing.');
    }
    if (owners.length === 1 && !ambiguousOwner) {
      ownerNameEn = owners[0]!.nameEn;
      ownerNameAr = owners[0]!.nameAr;
      for (const [key, value] of Object.entries({
        ownerDldNumber: owners[0]!.dldNumber,
        ownerName: `${ownerNameEn} ${ownerNameAr}`.trim(),
        ownerSharePercent: owners[0]!.sharePercent,
        ownedAreaSqM: owners[0]!.ownedAreaSqM,
      })) {
        if (value !== undefined && value !== '')
          diagnostics.fields[key] = { state: 'extracted', source: 'text', values: [String(value)] };
      }
    }
    if (owners.length > 1 || ambiguousOwner) {
      ownerNameEn = '';
      ownerNameAr = '';
      diagnostics.fields.ownerName!.state = 'conflict';
      diagnostics.warnings.push(
        'Multiple owners detected. Select the authorized landlord during review; do not assume sole ownership.'
      );
    }
    const status = `${en('mortgageStatus')} ${ar('mortgageStatus')}`.trim();
    const mortgageState = /^(?:not mortgaged|unmortgaged|غير مرهون[ة]?)(?:\s|$)/i.test(status)
      ? 'not_mortgaged'
      : /^(?:mortgaged|مرهون[ة]?)(?:\s|$)/i.test(status)
        ? 'mortgaged'
        : 'unknown';
    for (const key of [
      'certificateNumber',
      'propertyNumber',
      'plotNumber',
      'registrationContractNumber',
    ]) {
      if ((values[key]?.length || 0) > 1) {
        diagnostics.fields[key]!.state = 'conflict';
        diagnostics.warnings.push(`Conflicting ${key}; compare source documents.`);
      }
    }
    for (const key of ['issueDate', 'registrationDate']) {
      if (!validScanDate(normalizeDocumentDate(field(key))))
        diagnostics.fields[key]!.state = 'missing';
    }
    const missingFields = [
      !certificateNumber && 'certificateNumber',
      !ownerNameEn && 'ownerNameEn',
      !(propertyNumber || plotNumber) && 'propertyNumber',
    ].filter((value): value is string => !!value);
    const result: DldTitleDeedExtractedData = {
      certificateNumber,
      ownerNameEn,
      ownerNameAr,
      propertyNumber,
      plotNumber,
      owners,
      mortgageState,
      issueDate: normalizeDocumentDate(field('issueDate')),
      issuingAuthorityEn: en('issuingAuthority'),
      issuingAuthorityAr: ar('issuingAuthority'),
      isBlockchainVerified: false,
      propertyTypeEn: en('propertyType'),
      propertyTypeAr: ar('propertyType'),
      communityEn: en('community'),
      communityAr: ar('community'),
      municipalityNumber: field('municipalityNumber'),
      buildingNumber: field('buildingNumber'),
      buildingNameEn: en('buildingName'),
      buildingNameAr: ar('buildingName'),
      floorNumber: field('floorNumber'),
      parkingNumber: field('parkingNumber'),
      mortgageStatusEn: en('mortgageStatus'),
      mortgageStatusAr: ar('mortgageStatus'),
      isMortgaged: mortgageState === 'mortgaged',
      suiteAreaSqM: numeric('suiteAreaSqM'),
      balconyAreaSqM: numeric('balconyAreaSqM'),
      totalAreaSqM,
      totalAreaSqFt,
      commonAreaSqM: numeric('commonAreaSqM'),
      ownerDldNumber:
        owners.length > 1 || ambiguousOwner ? '' : owners[0]?.dldNumber || field('ownerDldNumber'),
      ownerSharePercent:
        owners.length > 1 || ambiguousOwner
          ? 0
          : (owners[0]?.sharePercent ?? numeric('ownerSharePercent')),
      ownedAreaSqM:
        owners.length > 1 || ambiguousOwner
          ? 0
          : (owners[0]?.ownedAreaSqM ?? numeric('ownedAreaSqM')),
      purchasedFromEn: en('purchasedFrom'),
      purchasedFromAr: ar('purchasedFrom'),
      registrationContractNumber: field('registrationContractNumber'),
      registrationDate: normalizeDocumentDate(field('registrationDate')),
      purchasePriceAed: numeric('purchasePriceAed'),
      purchasePriceWordsEn: en('purchasePriceWordsEn'),
      confidenceScore: 0,
      scannedAt: new Date().toISOString(),
      reviewConfirmed: false,
      demoOnly: false,
      missingFields,
      diagnostics,
    };
    const flagConflict = (key: string) => {
      diagnostics.fields[key]!.state = 'conflict';
      diagnostics.warnings.push(`Conflicting ${key}; compare all source candidates.`);
    };
    for (const key of [
      'suiteAreaSqM',
      'balconyAreaSqM',
      'totalAreaSqM',
      'totalAreaSqFt',
      'commonAreaSqM',
      'purchasePriceAed',
    ]) {
      if (numericDisagreement(key, values[key] || [])) flagConflict(key);
    }
    // Compare every printed total, including aliases that contain square-foot units.
    const totals = [
      ...(values.totalAreaSqM || []).map(raw => ({
        raw,
        value: normalizedNumber('totalAreaSqM', raw),
        converted: squareFeet(raw),
      })),
      ...(values.totalAreaSqFt || [])
        .map(raw => ({ raw, value: normalizedNumber('totalAreaSqFt', raw), converted: true }))
        .map(candidate => ({
          ...candidate,
          value: candidate.value === undefined ? undefined : candidate.value / 10.7639104167,
        })),
    ].filter(
      (candidate): candidate is { raw: string; value: number; converted: boolean } =>
        candidate.value !== undefined
    );
    if (
      totals.some((candidate, index) =>
        totals
          .slice(index + 1)
          .some(
            other =>
              Math.abs(candidate.value - other.value) >
              (candidate.converted || other.converted ? 0.011 : 0.000001)
          )
      )
    ) {
      flagConflict('totalAreaSqM');
      flagConflict('totalAreaSqFt');
      diagnostics.fields.totalAreaSqM!.values = [
        ...new Set(totals.map(candidate => candidate.raw)),
      ];
      diagnostics.fields.totalAreaSqFt!.values = [...diagnostics.fields.totalAreaSqM!.values];
    }
    for (const key of ['issueDate', 'registrationDate']) {
      const dates = (values[key] || []).map(normalizeDocumentDate).filter(validScanDate);
      if (new Set(dates).size > 1) flagConflict(key);
    }
    const mortgageStates = (values.mortgageStatus || []).flatMap(value => {
      const tokens = [languageValue([value], 'en'), languageValue([value], 'ar')];
      return tokens
        .map(token =>
          /^(?:not mortgaged|unmortgaged|غير مرهون[ة]?)(?:\s|$)/i.test(token)
            ? 'not_mortgaged'
            : /^(?:mortgaged|مرهون[ة]?)(?:\s|$)/i.test(token)
              ? 'mortgaged'
              : ''
        )
        .filter(Boolean);
    });
    if (new Set(mortgageStates).size > 1) {
      flagConflict('mortgageStatus');
      result.mortgageState = 'unknown';
    }
    refreshCoverage(diagnostics);
    return result;
  }

  /**
   * Alias for scanTitleDeed conforming to standard document ingestion interfaces
   */
  async scanDocument(fileOrPreset?: File | 'sample'): Promise<DldTitleDeedExtractedData> {
    return this.scanTitleDeed(fileOrPreset);
  }

  /**
   * Maps extracted Title Deed data directly into Tenancy Contract payload
   */
  toTenancyContractPayload(
    extracted: DldTitleDeedExtractedData,
    basePayload: TenancyContractPayload
  ): TenancyContractPayload {
    if (!canUseScan(extracted)) throw new Error('Confirm review before autofill.');
    const propertyTitle = `${extracted.propertyTypeEn} in ${extracted.buildingNameEn}`;
    const unitNumber = `Unit ${extracted.propertyNumber}, Floor ${extracted.floorNumber}, ${extracted.buildingNameEn}`;
    const community = `${extracted.communityEn}, Dubai (Plot: ${extracted.plotNumber})`;

    const landlord: ContractParty = {
      name: extracted.ownerNameEn,
      emiratesIdOrPassport: basePayload.landlord.emiratesIdOrPassport,
      phone: basePayload.landlord.phone || '',
      email: basePayload.landlord.email || '',
    };

    return {
      ...basePayload,
      propertyTitle,
      unitNumber,
      community,
      landlord,
    };
  }

  /**
   * Returns demo scanned Title Deed data (Akram Dib Nehme - Viridis A Unit 504)
   */
  getDemoExtractedData(): DldTitleDeedExtractedData {
    const demo = {
      ...VIRIDIS_504_SAMPLE_TITLE_DEED,
      scannedAt: new Date().toISOString(),
      demoOnly: true,
      reviewConfirmed: false,
      isBlockchainVerified: false,
    };
    return demo;
  }

  /**
   * Converts Extracted Title Deed into a clean CRM Property Inventory object
   */
  toCrmPropertyListing(extracted: DldTitleDeedExtractedData) {
    if (!canUseScan(extracted)) throw new Error('Confirm review before autofill.');
    const knownNumber = (
      key: 'totalAreaSqFt' | 'totalAreaSqM' | 'purchasePriceAed'
    ): number | undefined => {
      const evidence = extracted.diagnostics?.fields[key];
      return Number.isFinite(extracted[key]) &&
        extracted[key] >= 0 &&
        (evidence
          ? evidence.state === 'extracted' || evidence.state === 'derived'
          : extracted[key] > 0)
        ? extracted[key]
        : undefined;
    };
    return {
      title: `${extracted.buildingNameEn} — Unit ${extracted.propertyNumber} (${extracted.propertyTypeEn})`,
      propertyType: extracted.propertyTypeEn,
      community: extracted.communityEn,
      building: extracted.buildingNameEn,
      unitNumber: extracted.propertyNumber,
      floor: extracted.floorNumber,
      parking: extracted.parkingNumber,
      plotNumber: extracted.plotNumber,
      municipalityNumber: extracted.municipalityNumber,
      sizeSqFt: knownNumber('totalAreaSqFt'),
      sizeSqM: knownNumber('totalAreaSqM'),
      ownerName: extracted.ownerNameEn,
      ownerDldId: extracted.ownerDldNumber,
      lastPurchasePriceAed: knownNumber('purchasePriceAed'),
      titleDeedNumber: extracted.certificateNumber,
      mortgageStatus:
        extracted.mortgageState === 'unknown' || !extracted.mortgageStatusEn
          ? undefined
          : extracted.mortgageStatusEn,
    };
  }

  /**
   * Exports extracted data as a structured JSON object
   */
  exportToJson(extracted?: DldTitleDeedExtractedData): Record<string, any> {
    const data = extracted || this.getCachedTitleDeed();
    return JSON.parse(JSON.stringify(data));
  }

  /**
   * Exports extracted data as a formatted JSON string
   */
  exportToJsonString(extracted?: DldTitleDeedExtractedData): string {
    return JSON.stringify(this.exportToJson(extracted), null, 2);
  }

  /**
   * Persists extracted Title Deed record to backend database and local cache
   */
  async saveToDatabase(
    extracted?: DldTitleDeedExtractedData,
    options?: VaultSaveOptions
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    const data = extracted || this.getCachedTitleDeed();
    if (!data) return { success: false, error: 'No reviewed document.' };
    const revision = this.cacheRevision;
    const result = await saveReviewedScan(
      'title_deed',
      data,
      data.certificateNumber,
      data.ownerNameEn,
      options
    );
    if (result.success && revision === this.cacheRevision) this.setCachedTitleDeed(data);
    return result;
  }
}

export const henryTitleDeedScannerService = new HenryTitleDeedScannerService();
export default henryTitleDeedScannerService;
