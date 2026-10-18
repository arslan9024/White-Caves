/**
 * HenryTenancyContractScannerService.ts
 *
 * Official Dubai Land Department (DLD) Tenancy Contract Optical AI Parser & Learning Engine.
 *
 * Core Capabilities:
 * 1. Autonomous Fill Detection (evaluates whether contract is Filled vs Blank/Unfilled).
 * 2. Grouped Semantic Extraction (Landlord, Tenant, Property, Rent/PDC, Addenda, Signatures).
 * 3. Completeness Scoring (Calculates fill percentage & lists missing fields).
 * 4. Machine Learning & Reference Training (Stores parsed contracts to teach Henry AI auto-fill rules).
 * 5. 1-Click Inter-Module Mapping (Auto-fills Preparation Studio, CRM Landlord/Tenant Profiles, Ejari Vault).
 */

import { ScanReview, canUseScan, saveReviewedScan, validScanDate, VaultSaveOptions } from './henryScanReview';
import henryEmiratesIdScannerService from './HenryEmiratesIdScannerService';
import { readDocumentFields, normalizeDocumentDate, parseDocumentNumber, flagDocumentConflicts } from './henryDocumentParsing';
import logger from '../utils/logger';
import type { DldTenancyContractData } from './HenryTenancyContractTemplateService';

export interface ScannedTenancyParty {
  name: string;
  emiratesId: string;
  email: string;
  phone: string;
  licenseNo?: string;
  licensingAuthority?: string;
}

export interface ScannedTenancyProperty {
  usage: 'residential' | 'commercial' | 'industrial' | '';
  buildingName: string;
  propertyNumber: string;
  plotNumber: string;
  propertyType: string;
  areaSqM?: number;
  areaSqFt?: number;
  location: string;
  makaniNo?: string;
  premisesNoDewa?: string;
}

export interface ScannedTenancyFinancials {
  periodFrom: string;
  periodTo: string;
  annualRentAed: number;
  contractValueAed?: number;
  securityDepositAed?: number;
  modeOfPayment: string;
}

export interface ScannedTenancySignatures {
  hasTenantSigned: boolean;
  tenantSignedDate?: string;
  hasLessorSigned: boolean;
  lessorSignedDate?: string;
}

export type DldScannedContractResult = ScannedTenancyContractResult;

export interface ScannedTenancyContractResult extends ScanReview {
  contractReference?: string;
  // Classification & Fill State
  isFilled: boolean;
  fillScorePercent: number;
  totalFieldsCount: number;
  filledFieldsCount: number;
  missingFields: string[];
  classification: 'blank_template' | 'partially_filled' | 'fully_executed';

  // Metadata
  contractDate: string;

  // Grouped Fields
  landlord: ScannedTenancyParty;
  tenant: ScannedTenancyParty;
  property: ScannedTenancyProperty;
  financials: ScannedTenancyFinancials;
  additionalTerms: string[];
  signatures: ScannedTenancySignatures;

  // Extraction Telemetry
  confidenceScore: number;
  scannedAt: string;
  documentFormat?: string;
}

export const SANIT_SINGH_CAMELIA_608_SAMPLE: ScannedTenancyContractResult = {
  demoOnly: true, reviewConfirmed: false,
  isFilled: true,
  fillScorePercent: 92,
  totalFieldsCount: 20,
  filledFieldsCount: 18,
  missingFields: ['DEWA Premise Number', 'Makani Number'],
  classification: 'fully_executed',
  contractDate: '10-07-2026',

  landlord: {
    name: 'SANIT SINGH NAGPAL',
    emiratesId: '784-1999-5371408-8',
    email: 'nagpalsanit@gmail.com',
    phone: '0504458097',
    licenseNo: '',
    licensingAuthority: '',
  },

  tenant: {
    name: 'KESHIVANI MAYADEVAN',
    emiratesId: '784-1984-7391875-7',
    email: 'shivanimayadevan9@gmail.com',
    phone: '050 7915250',
    licenseNo: '',
    licensingAuthority: '',
  },

  property: {
    usage: 'residential',
    buildingName: 'CAMELIA',
    propertyNumber: '608',
    plotNumber: '176',
    propertyType: 'LAND',
    areaSqM: 112.24,
    areaSqFt: 1208.14,
    location: 'DAMAC HILLS 2',
    makaniNo: '',
    premisesNoDewa: '',
  },

  financials: {
    periodFrom: '13-07-2026',
    periodTo: '12-07-2027',
    annualRentAed: 112000,
    contractValueAed: 112000,
    securityDepositAed: 5600,
    modeOfPayment: '3 CHEQUES',
  },

  additionalTerms: [
    '1. Addendum is part of contract.',
    '2. Contract valid 1 year; renewal needs landlord approval.',
    '3. Deposit non-refundable if house not clean, undamaged, with service proof.',
    '4. Landlord arranges pre-move-in cleaning, painting, AC service.',
    '5. Key handover after EJARI, DEWA receipt, DAMAC permit.',
  ],

  signatures: {
    hasTenantSigned: true,
    tenantSignedDate: '10-07-2026',
    hasLessorSigned: true,
    lessorSignedDate: '10-07-2026',
  },

  confidenceScore: 0.998,
  scannedAt: new Date().toISOString(),
};

export const SVETLANA_JANUSIA_XH2858B_SAMPLE: ScannedTenancyContractResult = {
  demoOnly: true, reviewConfirmed: false,
  isFilled: true,
  fillScorePercent: 95,
  totalFieldsCount: 20,
  filledFieldsCount: 19,
  missingFields: ['Lessor Emirates ID (Overseas Landlord)'],
  classification: 'fully_executed',
  contractDate: '13-01-2026',

  landlord: {
    name: 'SVETLANA LEVITSKAYA',
    emiratesId: '',
    email: 'svetlanaln@hotmail.com',
    phone: '974 5550 1054',
    licenseNo: '',
    licensingAuthority: '',
  },

  tenant: {
    name: 'WILLIAM MICHAEL ABERNETHY',
    emiratesId: '784197927183794',
    email: 'wmabernethy@gmail.com',
    phone: '0585969529',
    licenseNo: '',
    licensingAuthority: '',
  },

  property: {
    usage: 'residential',
    buildingName: 'Janusia',
    propertyNumber: 'XH2858B',
    plotNumber: '6340',
    propertyType: '3 BHK + Maid Room',
    areaSqM: 198.98,
    areaSqFt: 2141.80,
    location: 'Damac Hills 2',
    makaniNo: '257',
    premisesNoDewa: '918014964',
  },

  financials: {
    periodFrom: '27-01-2026',
    periodTo: '26-01-2027',
    annualRentAed: 120000,
    contractValueAed: 120000,
    securityDepositAed: 6000,
    modeOfPayment: '4 CHEQUES',
  },

  additionalTerms: [
    '1. The addendum attached to this is an integral part of the tenancy contract.',
    '2. This is renewal contract valid for 1 year only. Renewal of the contract is subject to the approval of the landlord.',
    "3. The security deposit is paid from previous contract and not refundable if the house isn't returned clean, undamaged, and with proof of required services.",
    '4. The landlord will confirm and arrange the maintenance, including cleaning, painting, and AC service, for the tenant before MOVE-IN.',
    '5. The key handover will be processed after the submission of EJARI, DEWA receipt, and MOVE-IN permit by DAMAC.',
  ],

  signatures: {
    hasTenantSigned: true,
    tenantSignedDate: '13-01-2026',
    hasLessorSigned: true,
    lessorSignedDate: '26-01-2026',
  },

  confidenceScore: 0.999,
  scannedAt: new Date().toISOString(),
};

export const BLANK_DLD_TEMPLATE_SAMPLE: ScannedTenancyContractResult = {
  demoOnly: true, reviewConfirmed: false,
  isFilled: false,
  fillScorePercent: 0,
  totalFieldsCount: 20,
  filledFieldsCount: 0,
  missingFields: [
    'Landlord Name',
    'Landlord Emirates ID',
    'Tenant Name',
    'Tenant Emirates ID',
    'Building Name',
    'Property Number',
    'Plot Number',
    'Area SqM',
    'Location',
    'Contract Period From',
    'Contract Period To',
    'Annual Rent',
    'Contract Value',
    'Security Deposit',
    'Mode of Payment',
    'Tenant Signature',
    'Lessor Signature',
    'DEWA Premise Number',
    'Makani Number',
  ],
  classification: 'blank_template',
  contractDate: '',

  landlord: {
    name: '',
    emiratesId: '',
    email: '',
    phone: '',
  },

  tenant: {
    name: '',
    emiratesId: '',
    email: '',
    phone: '',
  },

  property: {
    usage: 'residential',
    buildingName: '',
    propertyNumber: '',
    plotNumber: '',
    propertyType: '',
    areaSqM: 0,
    areaSqFt: 0,
    location: '',
  },

  financials: {
    periodFrom: '',
    periodTo: '',
    annualRentAed: 0,
    contractValueAed: 0,
    securityDepositAed: 0,
    modeOfPayment: '',
  },

  additionalTerms: [],

  signatures: {
    hasTenantSigned: false,
    hasLessorSigned: false,
  },

  confidenceScore: 1.0,
  scannedAt: new Date().toISOString(),
};


class HenryTenancyContractScannerService {
  private inMemoryCache: ScannedTenancyContractResult | null = null;
  private listeners: Set<(data: ScannedTenancyContractResult | null) => void> = new Set();

  private trainingMemory: ScannedTenancyContractResult[] = [];

  /**
   * Keeps extracted contract data in session memory only
   */
  setCachedContract(data: ScannedTenancyContractResult): void {
    if (!canUseScan(data)) return;
    this.inMemoryCache = structuredClone(data);
    this.notifyListeners(this.inMemoryCache);
  }

  /**
   * Retrieves active contract from temporary session cache
   */
  getCachedContract(): ScannedTenancyContractResult | null {
    if (this.inMemoryCache && canUseScan(this.inMemoryCache)) return structuredClone(this.inMemoryCache);
    return null;
  }

  /**
   * Clears the active contract session cache
   */
  clearCachedContract(): void {
    this.inMemoryCache = null;
    this.notifyListeners(null);
  }

  /**
   * Registers a subscriber listener to receive active contract cache mutations
   */
  onContractUpdated(listener: (data: ScannedTenancyContractResult | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(data: ScannedTenancyContractResult | null): void {
    this.listeners.forEach((listener) => {
      try {
        listener(data ? structuredClone(data) : null);
      } catch (err) {
        logger.error('Henry tenancy cache listener failed', { errorName: err instanceof Error ? err.name : 'UnknownError' });
      }
    });
  }

  /**
   * Returns benchmark reference sample 1 (Sanit Singh Nagpal & Keshivani Mayadevan - Camelia 608)
   */
  getDemoExtractedData(): ScannedTenancyContractResult {
    this.clearCachedContract();
    const demo = { ...structuredClone(SANIT_SINGH_CAMELIA_608_SAMPLE), scannedAt: new Date().toISOString(), demoOnly: true, reviewConfirmed: false };
    return demo;
  }

  /**
   * Returns benchmark reference sample 2 (Svetlana Levitskaya & William Michael Abernethy - Janusia XH2858B)
   */
  getSvetlanaJanusiaSample(): ScannedTenancyContractResult {
    this.clearCachedContract();
    const demo = { ...structuredClone(SVETLANA_JANUSIA_XH2858B_SAMPLE), scannedAt: new Date().toISOString(), demoOnly: true, reviewConfirmed: false };
    return demo;
  }

  /**
   * Returns blank template reference result
   */
  getBlankTemplateData(): ScannedTenancyContractResult {
    this.clearCachedContract();
    return { ...structuredClone(BLANK_DLD_TEMPLATE_SAMPLE), scannedAt: new Date().toISOString() };
  }

  /**
   * Scans an uploaded Tenancy Contract PDF / image or returns reference sample
   */
  async scanContract(
    fileOrPreset?: File | 'sample' | 'sample_sanit' | 'sample_svetlana' | 'blank'
  ): Promise<ScannedTenancyContractResult> {
    this.clearCachedContract();
    if (!(fileOrPreset instanceof File)) {
        let result: ScannedTenancyContractResult;
        if (fileOrPreset === 'blank') {
          result = this.getBlankTemplateData();
        } else if (fileOrPreset === 'sample_svetlana') {
          result = this.getSvetlanaJanusiaSample();
        } else {
          result = this.getDemoExtractedData();
        }
        return { ...structuredClone(result), demoOnly: true, reviewConfirmed: false };
    }
    if (!['application/pdf', 'image/png', 'image/jpeg'].includes(fileOrPreset.type) ||
      !fileOrPreset.size || fileOrPreset.size > 10 * 1024 * 1024)
      throw new Error('Upload a non-empty PDF, JPEG or PNG up to 10 MB.');
    const extraction = await henryEmiratesIdScannerService.extractDocumentText(fileOrPreset, undefined, text => {
      const parsed = this.parseContractText(text);
      return [!!parsed.landlord.name, !!parsed.tenant.name, !!parsed.property.buildingName,
        !!parsed.property.propertyNumber, validScanDate(parsed.financials.periodFrom),
        validScanDate(parsed.financials.periodTo), parsed.financials.annualRentAed > 0].filter(Boolean).length / 7;
    });
    const result = this.parseContractText([extraction.ocrText, extraction.streamText].filter(Boolean).join('\n'));
    result.documentFormat = fileOrPreset.type;
    result.diagnostics!.ocrConfidence = extraction.ocrConfidence;
    result.diagnostics!.warnings.push(...(extraction.warnings || []));
    return result;
  }

  parseContractText(text: string): ScannedTenancyContractResult {
    const { values, diagnostics } = readDocumentFields(text, {
      contractReference: ['Contract Number', 'Contract Reference', 'رقم العقد'],
      contractDate: ['Contract Date', 'تاريخ العقد'],
      'landlord.name': ['Landlord Name', 'Lessor Name', 'Owner Name', 'اسم المؤجر', 'اسم المالك'],
      'tenant.name': ['Tenant Name', 'اسم المستأجر'],
      'landlord.emiratesId': ['Landlord Emirates ID', 'Lessor Emirates ID', 'هوية المؤجر'],
      'tenant.emiratesId': ['Tenant Emirates ID', 'هوية المستأجر'],
      'landlord.phone': ['Landlord Phone', 'هاتف المؤجر'], 'tenant.phone': ['Tenant Phone', 'هاتف المستأجر'],
      'landlord.email': ['Landlord Email'], 'tenant.email': ['Tenant Email'],
      'landlord.licenseNo': ['Landlord License Number', 'Lessor License Number'],
      'tenant.licenseNo': ['Tenant License Number'],
      'landlord.licensingAuthority': ['Lessor Licensing Authority'],
      'tenant.licensingAuthority': ['Tenant Licensing Authority'],
      'property.buildingName': ['Building Name', 'اسم المبنى'],
      'property.propertyNumber': ['Property Number', 'Property No', 'Unit Number', 'Unit No', 'رقم العقار', 'رقم الوحدة'],
      'property.plotNumber': ['Plot Number', 'Plot No', 'رقم الأرض'],
      'property.location': ['Location', 'الموقع'], 'property.propertyType': ['Property Type', 'نوع العقار'],
      'property.areaSqM': ['Area SqM', 'Area (sqm)', 'المساحة'],
      'property.areaSqFt': ['Area SqFt', 'Area (sqft)'],
      'property.usage': ['Property Usage', 'استخدام العقار'],
      'property.premisesNoDewa': ['DEWA Premises Number'], 'property.makaniNo': ['Makani Number', 'رقم مكاني'],
      'financials.periodFrom': ['Period From', 'Start Date', 'Contract Period From', 'تاريخ البداية', 'تاريخ بدء العقد'],
      'financials.periodTo': ['Period To', 'End Date', 'Contract Period To', 'تاريخ النهاية', 'تاريخ انتهاء العقد'],
      'financials.annualRentAed': ['Annual Rent', 'Annual Rent AED', 'الإيجار السنوي'],
      'financials.contractValueAed': ['Contract Value', 'قيمة العقد'],
      'financials.securityDepositAed': ['Security Deposit', 'مبلغ التأمين'],
      'financials.modeOfPayment': ['Mode of Payment', 'Payment Method', 'طريقة الدفع'],
      cheques: ['Number of Cheques', 'عدد الشيكات'],
      additionalTerms: ['Additional Terms', 'الشروط الإضافية'],
    }, ['additionalTerms']);
    const v = (key: string) => values[key]?.[0] || '';
    flagDocumentConflicts(diagnostics);
    const number = (key: string) => /[-−]\s*\d/.test(v(key)) ? undefined : parseDocumentNumber(v(key));
    const n = (key: string) => number(key) ?? 0;
    const party = (key: string): ScannedTenancyParty => ({
      name: v(`${key}.name`), emiratesId: v(`${key}.emiratesId`), phone: v(`${key}.phone`), email: v(`${key}.email`),
      licenseNo: v(`${key}.licenseNo`), licensingAuthority: v(`${key}.licensingAuthority`),
    });
    const usage = v('property.usage').toLowerCase();
    const required = ['landlord.name', 'tenant.name', 'property.buildingName', 'property.propertyNumber',
      'financials.periodFrom', 'financials.periodTo', 'financials.annualRentAed'];
    const missingFields = required.filter(key => !v(key));
    const countInMode = v('financials.modeOfPayment').match(/(\d+)\s*(?:cheques?|checks?|شيك)/i)?.[1];
    if (countInMode && v('cheques') && Number(countInMode) !== Number(v('cheques'))) {
      diagnostics.fields['financials.modeOfPayment'] = { state: 'conflict', source: 'text',
        values: [v('financials.modeOfPayment'), `${v('cheques')} CHEQUES`] };
    }
    return {
      contractReference: v('contractReference'), contractDate: normalizeDocumentDate(v('contractDate')),
      landlord: party('landlord'), tenant: party('tenant'),
      property: {
        usage: ['residential', 'سكني'].includes(usage) ? 'residential'
          : ['commercial', 'تجاري'].includes(usage) ? 'commercial'
          : ['industrial', 'صناعي'].includes(usage) ? 'industrial' : '',
        buildingName: v('property.buildingName'), propertyNumber: v('property.propertyNumber'),
        plotNumber: v('property.plotNumber'), propertyType: v('property.propertyType'), location: v('property.location'),
        areaSqM: number('property.areaSqM'), areaSqFt: number('property.areaSqFt'),
        makaniNo: v('property.makaniNo'), premisesNoDewa: v('property.premisesNoDewa'),
      },
      financials: {
        periodFrom: normalizeDocumentDate(v('financials.periodFrom')), periodTo: normalizeDocumentDate(v('financials.periodTo')),
        annualRentAed: n('financials.annualRentAed'), contractValueAed: number('financials.contractValueAed'),
        securityDepositAed: number('financials.securityDepositAed'),
        modeOfPayment: v('financials.modeOfPayment') || (v('cheques') ? `${v('cheques')} CHEQUES` : ''),
      },
      additionalTerms: values.additionalTerms || [],
      signatures: { hasTenantSigned: false, hasLessorSigned: false },
      isFilled: !missingFields.length, fillScorePercent: Math.round(diagnostics.coverage * 100),
      totalFieldsCount: Object.keys(values).length, filledFieldsCount: Object.values(values).filter(items => items.length).length,
      missingFields, classification: Object.values(values).some(items => items.length) ? 'partially_filled' : 'blank_template',
      confidenceScore: 0, scannedAt: new Date().toISOString(), demoOnly: false, reviewConfirmed: false, diagnostics,
    };
  }

  /**
   * Alias for scanContract conforming to standard document ingestion interfaces
   */
  async scanDocument(
    fileOrPreset?: File | 'sample' | 'sample_sanit' | 'sample_svetlana' | 'blank'
  ): Promise<ScannedTenancyContractResult> {
    return this.scanContract(fileOrPreset);
  }

  /**
   * Teaches Henry AI by archiving parsed contract into reference training memory pool
   */
  teachFromScannedContract(contract: ScannedTenancyContractResult): void {
    if (!canUseScan(contract as ScanReview)) return;
    const existing = this.trainingMemory;
    const filtered = existing.filter(
      (c) =>
        !(
          c.landlord.name === contract.landlord.name &&
          c.property.buildingName === contract.property.buildingName &&
          c.property.propertyNumber === contract.property.propertyNumber
        )
    );
    filtered.unshift({
      ...structuredClone(contract),
      scannedAt: new Date().toISOString(),
    });
    this.trainingMemory = filtered;
    this.trainingMemory = filtered.slice(0, 20);
  }

  /**
   * Retrieves all reference contracts in Henry's training pool
   */
  getTrainingReferenceContracts(): ScannedTenancyContractResult[] {
    return structuredClone(this.trainingMemory);
  }

  /**
   * Converts Extracted Scanned Contract into DldTenancyContractData for 1-click loading into the Preparation Studio
   */
  toDldTenancyContractData(scanned: ScannedTenancyContractResult, previewOnly = false): DldTenancyContractData {
    if (!previewOnly && !canUseScan(scanned as ScanReview)) throw new Error('Confirm contract review before autofill.');
    return {
      contractId: scanned.contractReference || '',
      contractDate: scanned.contractDate,
      ownerName: scanned.landlord.name,
      lessorName: scanned.landlord.name,
      lessorEmiratesId: scanned.landlord.emiratesId,
      lessorLicenseNo: scanned.landlord.licenseNo || '',
      lessorLicensingAuthority: scanned.landlord.licensingAuthority || '',
      lessorEmail: scanned.landlord.email,
      lessorPhone: scanned.landlord.phone,
      tenantName: scanned.tenant.name,
      tenantEmiratesId: scanned.tenant.emiratesId,
      tenantLicenseNo: scanned.tenant.licenseNo || '',
      tenantLicensingAuthority: scanned.tenant.licensingAuthority || '',
      tenantEmail: scanned.tenant.email,
      tenantPhone: scanned.tenant.phone,
      propertyUsage: scanned.property.usage,
      buildingName: scanned.property.buildingName,
      propertyNo: scanned.property.propertyNumber,
      plotNo: scanned.property.plotNumber,
      propertyType: scanned.property.propertyType,
      propertyAreaSqM: scanned.property.areaSqM ?? 0,
      location: scanned.property.location,
      premisesNoDewa: scanned.property.premisesNoDewa || '',
      makaniNo: scanned.property.makaniNo || '',
      contractPeriodFrom: scanned.financials.periodFrom,
      contractPeriodTo: scanned.financials.periodTo,
      annualRent: scanned.financials.annualRentAed,
      contractValue: scanned.financials.contractValueAed ?? 0,
      securityDepositAmount: scanned.financials.securityDepositAed ?? 0,
      modeOfPayment: scanned.financials.modeOfPayment,
      additionalTerms: scanned.additionalTerms,
      tenantSignature: scanned.signatures.hasTenantSigned ? scanned.tenant.name : undefined,
      tenantSignatureDate: scanned.signatures.tenantSignedDate,
      lessorSignature: scanned.signatures.hasLessorSigned ? scanned.landlord.name : undefined,
      lessorSignatureDate: scanned.signatures.lessorSignedDate,
      status: scanned.isFilled ? 'ready_for_signature' : 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Converts Extracted Contract into CRM Landlord Profile object
   */
  toCrmLandlordProfile(scanned: ScannedTenancyContractResult) {
    if (!canUseScan(scanned as ScanReview)) throw new Error('Confirm contract review before autofill.');
    return {
      fullName: scanned.landlord.name,
      emiratesId: scanned.landlord.emiratesId,
      email: scanned.landlord.email,
      phone: scanned.landlord.phone,
      ownedProperty: `${scanned.property.buildingName} Unit ${scanned.property.propertyNumber} (${scanned.property.location})`,
      currentAnnualRentAed: scanned.financials.annualRentAed,
      leaseExpiryDate: scanned.financials.periodTo,
      source: 'Henry Tenancy OCR Ingestion',
    };
  }

  /**
   * Converts Extracted Contract into CRM Tenant Profile object
   */
  toCrmTenantProfile(scanned: ScannedTenancyContractResult) {
    if (!canUseScan(scanned as ScanReview)) throw new Error('Confirm contract review before autofill.');
    return {
      fullName: scanned.tenant.name,
      emiratesId: scanned.tenant.emiratesId,
      email: scanned.tenant.email,
      phone: scanned.tenant.phone,
      leasedUnit: `${scanned.property.buildingName} Unit ${scanned.property.propertyNumber}`,
      annualRentAed: scanned.financials.annualRentAed,
      leaseStartDate: scanned.financials.periodFrom,
      leaseEndDate: scanned.financials.periodTo,
      source: 'Henry Tenancy OCR Ingestion',
    };
  }

  /**
   * Exports extracted data as a structured JSON object
   */
  exportToJson(scanned?: ScannedTenancyContractResult): Record<string, any> {
    const data = scanned || this.getCachedContract() || SANIT_SINGH_CAMELIA_608_SAMPLE;
    return JSON.parse(JSON.stringify(data));
  }

  /**
   * Exports extracted data as a formatted JSON string for clipboard and APIs
   */
  exportToJsonString(scanned?: ScannedTenancyContractResult): string {
    return JSON.stringify(this.exportToJson(scanned), null, 2);
  }

  /**
   * Persists extracted Tenancy Contract record to backend database and session cache
   */
  async saveToDatabase(scanned?: ScannedTenancyContractResult, options: VaultSaveOptions = {}): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!scanned) return { success: false, error: 'Review required. Nothing was saved.' };
    if (!scanned.contractReference?.trim()) return { success: false, error: 'Enter a source contract reference before saving. Nothing was saved.' };
    return saveReviewedScan('tenancy_contract', scanned, scanned.contractReference, scanned.tenant.name, options);
  }
}

export const henryTenancyContractScannerService = new HenryTenancyContractScannerService();
export default henryTenancyContractScannerService;
