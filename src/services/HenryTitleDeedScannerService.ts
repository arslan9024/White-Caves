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
import { ScanReview, VaultSaveOptions, canUseScan, saveReviewedScan } from './henryScanReview';

export interface DldTitleDeedExtractedData extends ScanReview {
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
  demoOnly: true, reviewConfirmed: false,
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
  demoOnly: true, reviewConfirmed: false,
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
  private inMemoryCache: DldTitleDeedExtractedData | null = null;
  private listeners: Set<(data: DldTitleDeedExtractedData | null) => void> = new Set();

  /**
   * Keeps reviewed Title Deed data in session memory only
   */
  setCachedTitleDeed(data: DldTitleDeedExtractedData): void {
    if (!canUseScan(data)) { this.clearCachedTitleDeed(); return; }
    this.inMemoryCache = { ...data };
    this.notifyListeners(this.inMemoryCache);
  }

  /**
   * Retrieves active Title Deed from temporary session cache
   */
  getCachedTitleDeed(): DldTitleDeedExtractedData | null {
    if (this.inMemoryCache) return this.inMemoryCache;
    return null;
  }

  /**
   * Clears the active Title Deed session cache
   */
  clearCachedTitleDeed(): void {
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
    const sample = { ...BUKO_COMMODITY_MADINAT_HIND_TITLE_DEED_SAMPLE, scannedAt: new Date().toISOString(), demoOnly: true, reviewConfirmed: false, isBlockchainVerified: false };
    return sample;
  }

  private notifyListeners(data: DldTitleDeedExtractedData | null): void {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
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
    if (typeof fileOrPreset === 'string') return fileOrPreset === 'sample_buko' ? this.getBukoSample() : this.getDemoExtractedData();
    const file = fileOrPreset;
    if (!['image/png', 'image/jpeg', 'application/pdf'].includes(file.type) || !file.size || file.size > 10 * 1024 * 1024) throw new Error('Use a PNG, JPEG or PDF under 10 MB.');
    const { ocrText, streamText } = await henryEmiratesIdScannerService.extractDocumentText(file);
    const text = `${ocrText}\n${streamText}`;
    if (!text.trim()) throw new Error('No readable text. Rescan in good lighting with all deed edges visible.');
    return { ...this.parseDocumentText(text), documentFormat: file.type };
  }

  parseDocumentText(text: string): DldTitleDeedExtractedData {
    // Only explicit labelled values are extracted; filenames and registry samples are not evidence.
    const field = (label: string) => text.match(new RegExp(`(?:${label})[ \t]*[:：][ \t]*([^\\n\\r]+)`, 'i'))?.[1]?.trim() || '';
    const number = (label: string) => {
      const value = field(label).replace(/,/g, '').match(/^[0-9]+(?:\.[0-9]+)?/);
      return value ? Number(value[0]) : 0;
    };
    const certificateNumber = field('Certificate Number|Certificate No\\.?|Title Deed Number|رقم الشهادة');
    const ownerNameEn = field('Owner Name|Owner|اسم المالك');
    const propertyNumber = field('Property Number|Unit Number|Unit No\\.?|رقم العقار');
    const plotNumber = field('Plot Number|Plot No\\.?|رقم الارض');
    const totalAreaSqM = number('Total Area|Area SqM|المساحة');
    const missingFields = [!certificateNumber && 'certificateNumber', !ownerNameEn && 'ownerNameEn', !(propertyNumber || plotNumber) && 'propertyNumber'].filter((value): value is string => !!value);
    return {
      certificateNumber, ownerNameEn, propertyNumber, plotNumber,
      issueDate: field('Issue Date|Date of Issue'), issuingAuthorityEn: field('Issuing Authority'), issuingAuthorityAr: '', isBlockchainVerified: false,
      propertyTypeEn: field('Property Type'), propertyTypeAr: '', communityEn: field('Community|Area Name'), communityAr: '', municipalityNumber: field('Municipality Number'), buildingNumber: field('Building Number'), buildingNameEn: field('Building Name'), buildingNameAr: '', floorNumber: field('Floor Number|Floor'), parkingNumber: field('Parking Number'), mortgageStatusEn: field('Mortgage Status'), mortgageStatusAr: '', isMortgaged: /^mortgaged$/i.test(field('Mortgage Status')),
      suiteAreaSqM: number('Suite Area'), balconyAreaSqM: number('Balcony Area'), totalAreaSqM, totalAreaSqFt: totalAreaSqM ? Number((totalAreaSqM * 10.7639).toFixed(2)) : 0, commonAreaSqM: number('Common Area'),
      ownerDldNumber: field('Owner DLD Number|Owner Number'), ownerNameAr: field('اسم المالك'), ownerSharePercent: number('Ownership Share|Owner Share'), ownedAreaSqM: number('Owned Area'), purchasedFromEn: field('Purchased From'), purchasedFromAr: '', registrationContractNumber: field('Registration Contract Number'), registrationDate: field('Registration Date'), purchasePriceAed: number('Purchase Price|Purchase Value'), purchasePriceWordsEn: '',
      confidenceScore: 0, scannedAt: new Date().toISOString(), reviewConfirmed: false, demoOnly: false, missingFields,
    };
  }

  /**
   * Alias for scanTitleDeed conforming to standard document ingestion interfaces
   */
  async scanDocument(
    fileOrPreset?: File | 'sample'
  ): Promise<DldTitleDeedExtractedData> {
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
    const demo = { ...VIRIDIS_504_SAMPLE_TITLE_DEED, scannedAt: new Date().toISOString(), demoOnly: true, reviewConfirmed: false, isBlockchainVerified: false };
    return demo;
  }

  /**
   * Converts Extracted Title Deed into a clean CRM Property Inventory object
   */
  toCrmPropertyListing(extracted: DldTitleDeedExtractedData) {
    if (!canUseScan(extracted)) throw new Error('Confirm review before autofill.');
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
      sizeSqFt: extracted.totalAreaSqFt,
      sizeSqM: extracted.totalAreaSqM,
      ownerName: extracted.ownerNameEn,
      ownerDldId: extracted.ownerDldNumber,
      lastPurchasePriceAed: extracted.purchasePriceAed,
      titleDeedNumber: extracted.certificateNumber,
      mortgageStatus: extracted.mortgageStatusEn,
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
  async saveToDatabase(extracted?: DldTitleDeedExtractedData, options?: VaultSaveOptions): Promise<{ success: boolean; id?: string; error?: string }> {
    const data = extracted || this.getCachedTitleDeed();
    if (!data) return { success: false, error: 'No reviewed document.' };
    const result = await saveReviewedScan('title_deed', data, data.certificateNumber, data.ownerNameEn, options);
    if (result.success) this.setCachedTitleDeed(data);
    return result;
  }
}

export const henryTitleDeedScannerService = new HenryTitleDeedScannerService();
export default henryTitleDeedScannerService;
