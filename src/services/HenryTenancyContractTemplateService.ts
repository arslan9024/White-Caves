/**
 * HenryTenancyContractTemplateService.ts
 *
 * Official Dubai Land Department (DLD) Unified Tenancy Contract Core Engine.
 * Manages the blank reusable template in LocalStorage, multi-source OCR field mapping,
 * and high-fidelity 3-page bilingual (English & Arabic) contract generation.
 *
 * Standards:
 * - Dubai Law No. (26) of 2007 & Law No. (33) of 2008
 * - Law No. (43) of 2013 on Rental Caps
 * - DLD Official Form (عقد إيجار)
 */

import { safeStorage } from '../utils/safeStorage';
import type { DldTitleDeedExtractedData } from './HenryTitleDeedScannerService';
import type { EmiratesIdExtractedData } from './HenryEmiratesIdScannerService';
import type { InternationalPassportExtractedData } from './HenryPassportScannerService';

export interface DldTenancyContractData {
  contractId: string;
  contractDate: string;

  // ── Owner / Lessor Information (معلومات المالك / المؤجر) ──
  ownerName: string;
  lessorName: string;
  lessorEmiratesId: string;
  lessorLicenseNo: string;
  lessorLicensingAuthority: string;
  lessorEmail: string;
  lessorPhone: string;

  // ── Tenant Information (معلومات المستأجر) ──
  tenantName: string;
  tenantEmiratesId: string;
  tenantLicenseNo: string;
  tenantLicensingAuthority: string;
  tenantEmail: string;
  tenantPhone: string;

  // ── Property Information (معلومات العقار) ──
  propertyUsage: 'residential' | 'commercial' | 'industrial';
  plotNo: string;
  makaniNo: string;
  buildingName: string;
  propertyNo: string;
  propertyType: string;
  propertyAreaSqM: number;
  location: string;
  premisesNoDewa: string;

  // ── Contract Information (معلومات العقد) ──
  contractPeriodFrom: string;
  contractPeriodTo: string;
  contractValue: number;
  annualRent: number;
  securityDepositAmount: number;
  modeOfPayment: string;

  // ── Signatures (التوقيعات) ──
  tenantSignature?: string;
  tenantSignatureDate?: string;
  lessorSignature?: string;
  lessorSignatureDate?: string;

  // ── Additional Terms (شروط إضافية) ──
  additionalTerms: string[];

  // ── Metadata ──
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'ready_for_signature' | 'signed' | 'registered_ejari';
  esignToken?: string;
}

const STORAGE_KEYS = {
  BLANK_TEMPLATE: 'whitecaves_dld_tenancy_blank_template_v1',
  ACTIVE_DRAFT: 'whitecaves_dld_tenancy_active_draft_v1',
  SAVED_CONTRACTS: 'whitecaves_dld_tenancy_saved_contracts_v1',
};

export const BLANK_DLD_TENANCY_CONTRACT: DldTenancyContractData = {
  contractId: '',
  contractDate: '',
  ownerName: '',
  lessorName: '',
  lessorEmiratesId: '',
  lessorLicenseNo: '',
  lessorLicensingAuthority: '',
  lessorEmail: '',
  lessorPhone: '',
  tenantName: '',
  tenantEmiratesId: '',
  tenantLicenseNo: '',
  tenantLicensingAuthority: '',
  tenantEmail: '',
  tenantPhone: '',
  propertyUsage: 'residential',
  plotNo: '',
  makaniNo: '',
  buildingName: '',
  propertyNo: '',
  propertyType: '',
  propertyAreaSqM: 0,
  location: '',
  premisesNoDewa: '',
  contractPeriodFrom: '',
  contractPeriodTo: '',
  contractValue: 0,
  annualRent: 0,
  securityDepositAmount: 0,
  modeOfPayment: '4 Cheques',
  additionalTerms: [
    '1. The tenant shall maintain the interior of the premises in clean and good tenantable repair.',
    '2. Minor maintenance up to AED 500 shall be borne by the tenant; major maintenance by the landlord.',
    '3. Subleasing or sharing the property without prior written landlord authorization is strictly prohibited.',
    '4. Notice period for lease renewal or vacation shall be at least 90 days prior to contract expiry.',
    '5. Security deposit is refundable upon successful move-out inspection and settlement of final DEWA bill.',
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'draft',
};

export const DEMO_PREFILLED_TENANCY_CONTRACT: DldTenancyContractData = {
  contractId: 'TC-DLD-2026-0891',
  contractDate: '18/08/2026',
  ownerName: 'AKRAM DIB NEHME',
  lessorName: 'AKRAM DIB NEHME',
  lessorEmiratesId: '784-1985-1234567-1',
  lessorLicenseNo: '',
  lessorLicensingAuthority: '',
  lessorEmail: 'akram.nehme@gmail.com',
  lessorPhone: '+971 50 123 4567',
  tenantName: 'Arslan Malik Bashir Ahmad',
  tenantEmiratesId: '784-1993-1805733-0',
  tenantLicenseNo: '1388443',
  tenantLicensingAuthority: 'DET Dubai',
  tenantEmail: 'admin@whitecaves.com',
  tenantPhone: '+971 4 335 0592',
  propertyUsage: 'residential',
  plotNo: '5120',
  makaniNo: '24185 62940',
  buildingName: 'VIRIDIS A (DAMAC Hills 2)',
  propertyNo: '504',
  propertyType: 'Hotel Apartment',
  propertyAreaSqM: 38.76,
  location: 'Madinat Hind 4, Dubai',
  premisesNoDewa: '204918273',
  contractPeriodFrom: '01/09/2026',
  contractPeriodTo: '31/08/2027',
  contractValue: 48000,
  annualRent: 48000,
  securityDepositAmount: 4800,
  modeOfPayment: '4 Cheques (PDC)',
  tenantSignature: 'Arslan Malik',
  tenantSignatureDate: '18/08/2026',
  lessorSignature: 'Akram Dib Nehme',
  lessorSignatureDate: '18/08/2026',
  additionalTerms: [
    '1. The tenant shall maintain the interior of the premises in clean and good tenantable repair.',
    '2. Minor maintenance up to AED 500 shall be borne by the tenant; major maintenance by the landlord.',
    '3. Subleasing or sharing the property without prior written landlord authorization is strictly prohibited.',
    '4. Notice period for lease renewal or vacation shall be at least 90 days prior to contract expiry.',
    '5. Security deposit is refundable upon successful move-out inspection and settlement of final DEWA bill.',
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'ready_for_signature',
  esignToken: 'ESIGN-DLD-WC-99214',
};

class HenryTenancyContractTemplateService {
  private activeDraftMemory: DldTenancyContractData | null = null;
  private savedContractsMemory: DldTenancyContractData[] = [];

  /**
   * Returns a fresh, blank copy of the official DLD Tenancy Contract Template
   */
  getBlankTemplate(): DldTenancyContractData {
    return {
      ...BLANK_DLD_TENANCY_CONTRACT,
      contractId: `TC-DLD-${Date.now().toString().slice(-6)}`,
      contractDate: new Date().toLocaleDateString('en-GB'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Returns demo prefilled contract with scanned Title Deed & Emirates ID data
   */
  getDemoPreset(): DldTenancyContractData {
    return {
      ...DEMO_PREFILLED_TENANCY_CONTRACT,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Save active draft to LocalStorage & memory cache
   */
  saveDraft(data: DldTenancyContractData): void {
    const updated = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.activeDraftMemory = updated;
    safeStorage.setJSON(STORAGE_KEYS.ACTIVE_DRAFT, updated);
  }

  /**
   * Load active draft from LocalStorage or memory cache or fall back to blank template
   */
  loadActiveDraft(): DldTenancyContractData {
    const draft = safeStorage.getJSON<DldTenancyContractData>(STORAGE_KEYS.ACTIVE_DRAFT) || this.activeDraftMemory;
    if (draft && draft.contractId) {
      return draft;
    }
    return this.getBlankTemplate();
  }

  /**
   * Reset active draft to a fresh blank template in LocalStorage
   */
  resetDraft(): DldTenancyContractData {
    const blank = this.getBlankTemplate();
    this.saveDraft(blank);
    return blank;
  }

  /**
   * Save a finalized contract into the saved contracts registry
   */
  saveContract(data: DldTenancyContractData): void {
    const saved = safeStorage.getJSON<DldTenancyContractData[]>(STORAGE_KEYS.SAVED_CONTRACTS) || this.savedContractsMemory;
    const filtered = saved.filter(c => c.contractId !== data.contractId);
    filtered.unshift({
      ...data,
      updatedAt: new Date().toISOString(),
    });
    this.savedContractsMemory = filtered;
    safeStorage.setJSON(STORAGE_KEYS.SAVED_CONTRACTS, filtered);
  }

  /**
   * Retrieve list of saved contracts from LocalStorage or memory cache
   */
  getSavedContracts(): DldTenancyContractData[] {
    return safeStorage.getJSON<DldTenancyContractData[]>(STORAGE_KEYS.SAVED_CONTRACTS) || this.savedContractsMemory;
  }

  /**
   * Auto-fill contract data from scanned Title Deed
   */
  populateFromTitleDeed(current: DldTenancyContractData, deed: DldTitleDeedExtractedData): DldTenancyContractData {
    return {
      ...current,
      ownerName: deed.ownerNameEn || current.ownerName,
      lessorName: deed.ownerNameEn || current.lessorName,
      buildingName: deed.buildingNameEn || current.buildingName,
      propertyNo: deed.propertyNumber || current.propertyNo,
      plotNo: deed.plotNumber || current.plotNo,
      propertyType: deed.propertyTypeEn || current.propertyType,
      propertyAreaSqM: deed.totalAreaSqM || current.propertyAreaSqM,
      location: deed.communityEn ? `${deed.communityEn}, Dubai` : current.location,
      makaniNo: deed.municipalityNumber || current.makaniNo,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Auto-fill contract data from scanned Emirates ID (as Tenant or Landlord)
   */
  populateFromEmiratesId(
    current: DldTenancyContractData,
    eid: EmiratesIdExtractedData,
    role: 'tenant' | 'landlord' = 'tenant'
  ): DldTenancyContractData {
    if (role === 'tenant') {
      return {
        ...current,
        tenantName: eid.fullNameEn || current.tenantName,
        tenantEmiratesId: eid.idNumber || current.tenantEmiratesId,
        updatedAt: new Date().toISOString(),
      };
    } else {
      return {
        ...current,
        ownerName: eid.fullNameEn || current.ownerName,
        lessorName: eid.fullNameEn || current.lessorName,
        lessorEmiratesId: eid.idNumber || current.lessorEmiratesId,
        updatedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Auto-fill contract data from scanned International Passport (as Tenant or Landlord)
   */
  populateFromPassport(
    current: DldTenancyContractData,
    passport: InternationalPassportExtractedData,
    role: 'tenant' | 'landlord' = 'tenant'
  ): DldTenancyContractData {
    if (role === 'tenant') {
      return {
        ...current,
        tenantName: passport.fullName || current.tenantName,
        tenantEmiratesId: `Passport: ${passport.passportNumber} (${passport.issuingCountryCode})`,
        updatedAt: new Date().toISOString(),
      };
    } else {
      return {
        ...current,
        ownerName: passport.fullName || current.ownerName,
        lessorName: passport.fullName || current.lessorName,
        lessorEmiratesId: `Passport: ${passport.passportNumber} (${passport.issuingCountryCode})`,
        updatedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Compiles the official 3-page bilingual DLD Tenancy Contract HTML matching the official Land Department layout
   */
  generateDldTenancyContractHtml(data: DldTenancyContractData, page: number | 'all' = 'all'): string {
    const isBlank = !data.tenantName && !data.ownerName;

    const page1Html = `
      <div class="dld-page" style="page-break-after: always; min-height: 1050px; padding: 25px 30px; font-family: 'Segoe UI', Arial, sans-serif; color: #1E293B; background: #FFFFFF; box-sizing: border-box;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0F172A; padding-bottom: 12px; margin-bottom: 12px;">
          <div style="text-align: left;">
            <div style="font-weight: 800; font-size: 14px; color: #0F172A; letter-spacing: 0.5px;">حكومة دبـــــــــــي</div>
            <div style="font-size: 10px; color: #475569; font-weight: bold; text-transform: uppercase;">GOVERNMENT OF DUBAI</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 20px; font-weight: 900; color: #0F172A; letter-spacing: 2px;">عــــقـــــد إيــــجــــــار</div>
            <div style="font-size: 12px; font-weight: 800; color: #DC2626; letter-spacing: 3px;">TENANCY CONTRACT</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 800; font-size: 14px; color: #0F172A;">دائــــرة الأراضــــي والأمـــــلاك</div>
            <div style="font-size: 10px; color: #475569; font-weight: bold; text-transform: uppercase;">Land Department</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 10px; color: #334155; font-weight: 600;">
          <div><strong>Contract Ref:</strong> <span style="font-family: monospace; color: #DC2626;">${data.contractId || '____________________'}</span></div>
          <div><strong>Date / التاريخ:</strong> <span>${data.contractDate || '____ / ____ / ________'}</span></div>
        </div>

        <!-- Section 1: Owner / Lessor Information -->
        <div style="margin-bottom: 10px; border: 1px solid #0F172A; border-radius: 4px; overflow: hidden;">
          <div style="background: #0F172A; color: #FFFFFF; display: flex; justify-content: space-between; padding: 4px 10px; font-weight: 800; font-size: 11px;">
            <span>Owner / Lessor Information</span>
            <span>معلومات المالك / المؤجر</span>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 10.5px;">
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="width: 25%; padding: 5px 8px; font-weight: 700; background: #F8FAFC;">Owner's Name</td>
              <td style="width: 50%; padding: 5px 8px; font-weight: 800; color: #0F172A;">${data.ownerName || '<span style="color:#CBD5E1">________________________________________</span>'}</td>
              <td style="width: 25%; padding: 5px 8px; font-weight: 700; text-align: right; background: #F8FAFC;">اسم المالك</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 5px 8px; font-weight: 700; background: #F8FAFC;">Lessor's Name</td>
              <td style="padding: 5px 8px; font-weight: 800; color: #0F172A;">${data.lessorName || '<span style="color:#CBD5E1">________________________________________</span>'}</td>
              <td style="padding: 5px 8px; font-weight: 700; text-align: right; background: #F8FAFC;">اسم المؤجر</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 5px 8px; font-weight: 700; background: #F8FAFC;">Lessor's Emirates ID / Passport</td>
              <td style="padding: 5px 8px; font-family: monospace; font-weight: 700; color: #DC2626;">${data.lessorEmiratesId || '<span style="color:#CBD5E1">____________________</span>'}</td>
              <td style="padding: 5px 8px; font-weight: 700; text-align: right; background: #F8FAFC;">الهوية الإماراتية للمؤجر</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 5px 8px; font-weight: 700; background: #F8FAFC;">License No. <span style="font-size: 8.5px; font-weight: normal; color: #64748B;">(In case of Company)</span></td>
              <td style="padding: 5px 8px; font-weight: 600;">
                <span style="display: inline-block; width: 45%;"><strong>No:</strong> ${data.lessorLicenseNo || 'N/A'}</span>
                <span style="display: inline-block; width: 50%;"><strong>Auth:</strong> ${data.lessorLicensingAuthority || 'N/A'}</span>
              </td>
              <td style="padding: 5px 8px; font-weight: 700; text-align: right; background: #F8FAFC;">رقم الرخصة وسلطة الترخيص</td>
            </tr>
            <tr>
              <td style="padding: 5px 8px; font-weight: 700; background: #F8FAFC;">Email & Phone</td>
              <td style="padding: 5px 8px; font-weight: 600;">
                <span style="display: inline-block; width: 55%;">✉️ ${data.lessorEmail || '<span style="color:#CBD5E1">_________________</span>'}</span>
                <span style="display: inline-block; width: 40%;">📞 ${data.lessorPhone || '<span style="color:#CBD5E1">_________________</span>'}</span>
              </td>
              <td style="padding: 5px 8px; font-weight: 700; text-align: right; background: #F8FAFC;">البريد الإلكتروني والهاتف</td>
            </tr>
          </table>
        </div>

        <!-- Section 2: Tenant Information -->
        <div style="margin-bottom: 10px; border: 1px solid #0F172A; border-radius: 4px; overflow: hidden;">
          <div style="background: #0F172A; color: #FFFFFF; display: flex; justify-content: space-between; padding: 4px 10px; font-weight: 800; font-size: 11px;">
            <span>Tenant Information</span>
            <span>معلومات المستأجر</span>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 10.5px;">
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="width: 25%; padding: 5px 8px; font-weight: 700; background: #F8FAFC;">Tenant's Name</td>
              <td style="width: 50%; padding: 5px 8px; font-weight: 800; color: #0F172A;">${data.tenantName || '<span style="color:#CBD5E1">________________________________________</span>'}</td>
              <td style="width: 25%; padding: 5px 8px; font-weight: 700; text-align: right; background: #F8FAFC;">اسم المستأجر</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 5px 8px; font-weight: 700; background: #F8FAFC;">Tenant's Emirates ID / Passport</td>
              <td style="padding: 5px 8px; font-family: monospace; font-weight: 700; color: #2563EB;">${data.tenantEmiratesId || '<span style="color:#CBD5E1">____________________</span>'}</td>
              <td style="padding: 5px 8px; font-weight: 700; text-align: right; background: #F8FAFC;">الهوية الإماراتية للمستأجر</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 5px 8px; font-weight: 700; background: #F8FAFC;">License No. <span style="font-size: 8.5px; font-weight: normal; color: #64748B;">(In case of Company)</span></td>
              <td style="padding: 5px 8px; font-weight: 600;">
                <span style="display: inline-block; width: 45%;"><strong>No:</strong> ${data.tenantLicenseNo || 'N/A'}</span>
                <span style="display: inline-block; width: 50%;"><strong>Auth:</strong> ${data.tenantLicensingAuthority || 'N/A'}</span>
              </td>
              <td style="padding: 5px 8px; font-weight: 700; text-align: right; background: #F8FAFC;">رقم الرخصة وسلطة الترخيص</td>
            </tr>
            <tr>
              <td style="padding: 5px 8px; font-weight: 700; background: #F8FAFC;">Email & Phone</td>
              <td style="padding: 5px 8px; font-weight: 600;">
                <span style="display: inline-block; width: 55%;">✉️ ${data.tenantEmail || '<span style="color:#CBD5E1">_________________</span>'}</span>
                <span style="display: inline-block; width: 40%;">📞 ${data.tenantPhone || '<span style="color:#CBD5E1">_________________</span>'}</span>
              </td>
              <td style="padding: 5px 8px; font-weight: 700; text-align: right; background: #F8FAFC;">البريد الإلكتروني والهاتف</td>
            </tr>
          </table>
        </div>

        <!-- Section 3: Property Information -->
        <div style="margin-bottom: 10px; border: 1px solid #0F172A; border-radius: 4px; overflow: hidden;">
          <div style="background: #0F172A; color: #FFFFFF; display: flex; justify-content: space-between; padding: 4px 10px; font-weight: 800; font-size: 11px;">
            <span>Property Information</span>
            <span>معلومات العقار</span>
          </div>
          <div style="padding: 6px 10px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; font-size: 10px; font-weight: 700;">
            <span><strong>Usage / استخدام العقار:</strong></span>
            <span>
              <span style="margin-right: 15px;">[ ${data.propertyUsage === 'residential' ? '●' : '○'} ] Residential (سكني)</span>
              <span style="margin-right: 15px;">[ ${data.propertyUsage === 'commercial' ? '●' : '○'} ] Commercial (تجاري)</span>
              <span>[ ${data.propertyUsage === 'industrial' ? '●' : '○'} ] Industrial (صناعي)</span>
            </span>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="width: 20%; padding: 4px 8px; font-weight: 700; background: #F8FAFC;">Plot No. (رقم الأرض)</td>
              <td style="width: 30%; padding: 4px 8px; font-weight: 700;">${data.plotNo || '________'}</td>
              <td style="width: 20%; padding: 4px 8px; font-weight: 700; background: #F8FAFC;">Makani No. (رقم مكاني)</td>
              <td style="width: 30%; padding: 4px 8px; font-weight: 700; font-family: monospace;">${data.makaniNo || '________'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 4px 8px; font-weight: 700; background: #F8FAFC;">Building Name (المبنى)</td>
              <td style="padding: 4px 8px; font-weight: 800; color: #0F172A;">${data.buildingName || '____________________'}</td>
              <td style="padding: 4px 8px; font-weight: 700; background: #F8FAFC;">Property No. (رقم العقار)</td>
              <td style="padding: 4px 8px; font-weight: 800; color: #DC2626;">Unit ${data.propertyNo || '____'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 4px 8px; font-weight: 700; background: #F8FAFC;">Property Type (نوع الوحدة)</td>
              <td style="padding: 4px 8px; font-weight: 700;">${data.propertyType || 'Apartment / Villa'}</td>
              <td style="padding: 4px 8px; font-weight: 700; background: #F8FAFC;">Area Sq.M (مساحة العقار)</td>
              <td style="padding: 4px 8px; font-weight: 700;">${data.propertyAreaSqM ? `${data.propertyAreaSqM} m² (${Math.round(data.propertyAreaSqM * 10.7639)} sq.ft)` : '________ m²'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 8px; font-weight: 700; background: #F8FAFC;">Location (الموقع)</td>
              <td style="padding: 4px 8px; font-weight: 700;">${data.location || '____________________'}</td>
              <td style="padding: 4px 8px; font-weight: 700; background: #F8FAFC;">DEWA Premise (رقم ديوا)</td>
              <td style="padding: 4px 8px; font-weight: 700; font-family: monospace;">${data.premisesNoDewa || '________'}</td>
            </tr>
          </table>
        </div>

        <!-- Section 4: Contract Information -->
        <div style="margin-bottom: 10px; border: 1px solid #0F172A; border-radius: 4px; overflow: hidden;">
          <div style="background: #0F172A; color: #FFFFFF; display: flex; justify-content: space-between; padding: 4px 10px; font-weight: 800; font-size: 11px;">
            <span>Contract Information</span>
            <span>معلومات العقد</span>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="width: 25%; padding: 4px 8px; font-weight: 700; background: #F8FAFC;">Contract Period (فترة العقد)</td>
              <td style="width: 75%; padding: 4px 8px; font-weight: 700;" colspan="3">
                From (من): <strong>${data.contractPeriodFrom || '__/__/____'}</strong> &nbsp;&nbsp;➔&nbsp;&nbsp; To (إلى): <strong>${data.contractPeriodTo || '__/__/____'}</strong>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="width: 25%; padding: 4px 8px; font-weight: 700; background: #F8FAFC;">Annual Rent (الايجار السنوي)</td>
              <td style="width: 25%; padding: 4px 8px; font-weight: 900; color: #16A34A; font-size: 11px;">AED ${(data.annualRent || 0).toLocaleString()}</td>
              <td style="width: 25%; padding: 4px 8px; font-weight: 700; background: #F8FAFC;">Contract Value (قيمة العقد)</td>
              <td style="width: 25%; padding: 4px 8px; font-weight: 900; color: #0F172A; font-size: 11px;">AED ${(data.contractValue || data.annualRent || 0).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 4px 8px; font-weight: 700; background: #F8FAFC;">Security Deposit (مبلغ التأمين)</td>
              <td style="padding: 4px 8px; font-weight: 700; color: #D97706;">AED ${(data.securityDepositAmount || 0).toLocaleString()}</td>
              <td style="padding: 4px 8px; font-weight: 700; background: #F8FAFC;">Mode of Payment (طريقة الدفع)</td>
              <td style="padding: 4px 8px; font-weight: 700;">${data.modeOfPayment || '4 Cheques (PDC)'}</td>
            </tr>
          </table>
        </div>

        <!-- Signatures Box -->
        <div style="border: 1px solid #0F172A; border-radius: 4px; overflow: hidden;">
          <div style="background: #0F172A; color: #FFFFFF; display: flex; justify-content: space-between; padding: 4px 10px; font-weight: 800; font-size: 11px;">
            <span>Signatures</span>
            <span>التوقيعات</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; padding: 10px; gap: 15px; font-size: 10px;">
            <div style="border: 1px dashed #CBD5E1; padding: 8px; border-radius: 4px; min-height: 55px;">
              <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 6px;">
                <span>Tenant Signature / توقيع المستأجر:</span>
                <span>Date: ${data.tenantSignatureDate || '____/____/________'}</span>
              </div>
              <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 16px; color: #2563EB; text-align: center;">
                ${data.tenantSignature || '<span style="font-family: inherit; font-size: 10px; color: #94A3B8;">[ Awaiting Signature ]</span>'}
              </div>
            </div>
            <div style="border: 1px dashed #CBD5E1; padding: 8px; border-radius: 4px; min-height: 55px;">
              <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 6px;">
                <span>Lessor's Signature / توقيع المؤجر:</span>
                <span>Date: ${data.lessorSignatureDate || '____/____/________'}</span>
              </div>
              <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 16px; color: #DC2626; text-align: center;">
                ${data.lessorSignature || '<span style="font-family: inherit; font-size: 10px; color: #94A3B8;">[ Awaiting Signature ]</span>'}
              </div>
            </div>
          </div>
        </div>

        <div style="text-align: center; font-size: 9px; color: #94A3B8; margin-top: 10px;">
          Page 1 of 3 — Dubai Land Department (DLD) Official Unified Tenancy Contract Form
        </div>
      </div>
    `;

    const page2Html = `
      <div class="dld-page" style="page-break-after: always; min-height: 1050px; padding: 25px 30px; font-family: 'Segoe UI', Arial, sans-serif; color: #1E293B; background: #FFFFFF; box-sizing: border-box;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0F172A; padding-bottom: 10px; margin-bottom: 12px;">
          <div>
            <div style="font-weight: 800; font-size: 13px; color: #0F172A;">حكومة دبـــــــــــي — دائــــرة الأراضــــي والأمـــــلاك</div>
            <div style="font-size: 10px; color: #475569;">GOVERNMENT OF DUBAI — LAND DEPARTMENT</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 14px; font-weight: 900; color: #0F172A;">الأحــــكــــام والــــشـــــروط</div>
            <div style="font-size: 10px; font-weight: 800; color: #DC2626;">TERMS AND CONDITIONS</div>
          </div>
        </div>

        <div style="border: 1px solid #0F172A; border-radius: 4px; overflow: hidden; margin-bottom: 12px;">
          <div style="background: #0F172A; color: #FFFFFF; display: flex; justify-content: space-between; padding: 4px 10px; font-weight: 800; font-size: 11px;">
            <span>Standard Terms (Law No. 26 of 2007 as amended)</span>
            <span>الشروط والأحكام القياسية المعتمدة</span>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 8.5px; line-height: 1.35;">
            <tbody>
              ${[
                ['1. The tenant has inspected the premises and agreed to lease the unit in its current condition.', '١. عاين المستأجر الوحدة موضوع الإيجار ووافق على استئجار العقار على حالته الحالية.'],
                ['2. Tenant undertakes to use the premises for designated purpose; tenant has no rights to transfer or sublease without landlord written approval.', '٢. يتعهد المستأجر باستعمال المأجور للغرض المخصص له، ولا يجوز له التنازل أو التأجير من الباطن دون موافقة المالك خطياً.'],
                ['3. The tenant undertakes not to make amendments or modifications without landlord written approval.', '٣. يتعهد المستأجر بعدم إجراء أي تعديلات أو إضافات على العقار دون موافقة المالك الخطية.'],
                ['4. The tenant shall be responsible for payment of all electricity, water, cooling and gas charges resulting from occupancy.', '٤. يكون المستأجر مسؤولاً عن سداد كافة فواتير الكهرباء والمياه والتبريد والغاز المترتبة على إشغاله.'],
                ['5. The tenant must pay the rent amount in the manner and dates agreed with the landlord.', '٥. يتعهد المستأجر بسداد مبلغ الإيجار المتفق عليه في التواريخ والطريقة المحددة.'],
                ['6. The tenant fully undertakes to comply with all regulations related to the management and common areas.', '٦. يلتزم المستأجر بالتقيد التام بالأنظمة والتعليمات المتعلقة باستخدام المأجور والمنافع المشتركة.'],
                ['7. Tenancy parties declare mentioned emails and phone numbers are correct for legal notifications.', '٧. يقر أطراف التعاقد بصحة العناوين وأرقام الهواتف المذكورة أعلاه للإخطارات الرسمية.'],
                ['8. The landlord undertakes to enable tenant full use of premises and regular maintenance.', '٨. يتعهد المؤجر بتمكين المستأجر من الانتفاع التام بالعقار والقيام بأعمال الصيانة الدورية.'],
                ['9. The landlord confirms and undertakes that he is the current legal owner or authorized representative.', '٩. يقر المؤجر بأنه المالك الحالي للعقار أو الوكيل القانوني بموجب وكالة موثقة أصولاً.'],
                ['10. Any dispute from execution or interpretation shall be settled by the Rental Dispute Center (RDC).', '١٠. أي نزاع ينشأ عن تنفيذ أو تفسير هذا العقد يعود البت فيه لمركز فض المنازعات الإيجارية.'],
                ['11. This contract is subject to Law No (26) of 2007 and applicable Dubai legislation.', '١١. يخضع هذا العقد لكافة أحكام القانون رقم (26) لسنة 2007 وتعديلاته والتشريعات النافذة في دبي.'],
                ['12. Any additional condition conflicting with the law shall be deemed void.', '١٢. لا يعتد بأي شرط تم إضافته إلى هذا العقد في حال تعارضه مع نصوص القانون.'],
                ['13. In case of discrepancy between English and Arabic texts, the Arabic text shall prevail.', '١٣. في حال حدوث أي تعارض أو اختلاف في التفسير بين النصين، يعتمد النص العربي.'],
                ['14. The landlord undertakes to register this tenancy contract on EJARI affiliated to Dubai Land Department.', '١٤. يتعهد المؤجر بتسجيل عقد الإيجار في نظام إيجاري التابع لدائرة الأراضي والأملاك.'],
              ].map(([en, ar], i) => `
                <tr style="border-bottom: 1px solid #F1F5F9; background: ${i % 2 === 0 ? '#FFFFFF' : '#F8FAFC'};">
                  <td style="width: 50%; padding: 5px 8px; color: #334155;">${en}</td>
                  <td style="width: 50%; padding: 5px 8px; text-align: right; color: #0F172A; font-weight: 600;">${ar}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Signatures Box Page 2 -->
        <div style="border: 1px solid #0F172A; border-radius: 4px; overflow: hidden;">
          <div style="background: #0F172A; color: #FFFFFF; display: flex; justify-content: space-between; padding: 4px 10px; font-weight: 800; font-size: 11px;">
            <span>Signatures / التوقيعات</span>
            <span>Page 2 Endorsement</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; padding: 8px; gap: 15px; font-size: 9.5px;">
            <div style="border: 1px dashed #CBD5E1; padding: 6px; border-radius: 4px;">
              <div>Tenant Signature: <strong>${data.tenantSignature || '____________________'}</strong></div>
              <div>Date: ${data.tenantSignatureDate || '____/____/________'}</div>
            </div>
            <div style="border: 1px dashed #CBD5E1; padding: 6px; border-radius: 4px;">
              <div>Lessor Signature: <strong>${data.lessorSignature || '____________________'}</strong></div>
              <div>Date: ${data.lessorSignatureDate || '____/____/________'}</div>
            </div>
          </div>
        </div>

        <div style="text-align: center; font-size: 9px; color: #94A3B8; margin-top: 15px;">
          Page 2 of 3 — Dubai Land Department (DLD) Official Unified Tenancy Contract Terms
        </div>
      </div>
    `;

    const page3Html = `
      <div class="dld-page" style="min-height: 1050px; padding: 25px 30px; font-family: 'Segoe UI', Arial, sans-serif; color: #1E293B; background: #FFFFFF; box-sizing: border-box;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0F172A; padding-bottom: 10px; margin-bottom: 12px;">
          <div>
            <div style="font-weight: 800; font-size: 13px; color: #0F172A;">حكومة دبـــــــــــي — دائــــرة الأراضــــي والأمـــــلاك</div>
            <div style="font-size: 10px; color: #475569;">GOVERNMENT OF DUBAI — LAND DEPARTMENT</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 13px; font-weight: 900; color: #0F172A;">حقوق الأطراف والشروط الإضافية</div>
            <div style="font-size: 10px; font-weight: 800; color: #DC2626;">KNOW YOUR RIGHTS & ADDENDUM</div>
          </div>
        </div>

        <!-- Know Your Rights & Attachments -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          <div style="border: 1px solid #0F172A; border-radius: 4px; overflow: hidden;">
            <div style="background: #0F172A; color: #FFFFFF; padding: 4px 8px; font-weight: 800; font-size: 10.5px; display: flex; justify-content: space-between;">
              <span>Know your Rights</span>
              <span>لمعرفة حقوق الأطراف</span>
            </div>
            <div style="padding: 8px; font-size: 9px; line-height: 1.4; color: #334155;">
              • You may visit Rental Dispute Center website (<a href="https://www.dubailand.gov.ae" style="color: #2563EB;">www.dubailand.gov.ae</a>).<br/>
              • Law No 26 of 2007 regulating relationship between landlords and tenants.<br/>
              • Law No 33 of 2008 amending law 26 of year 2007.<br/>
              • Law No 43 of 2013 determining rent increases for properties.
            </div>
          </div>

          <div style="border: 1px solid #0F172A; border-radius: 4px; overflow: hidden;">
            <div style="background: #0F172A; color: #FFFFFF; padding: 4px 8px; font-weight: 800; font-size: 10.5px; display: flex; justify-content: space-between;">
              <span>Attachments for Ejari</span>
              <span>مرفقات التسجيل في إيجاري</span>
            </div>
            <div style="padding: 8px; font-size: 9px; line-height: 1.4; color: #334155;">
              1. Original unified tenancy contract signed by both parties.<br/>
              2. Original Emirates ID / Passport & Visa of applicant & tenant.<br/>
              3. Copy of Title Deed certificate registered at DLD.<br/>
              4. Recent DEWA Premise Bill / Connection receipt.
            </div>
          </div>
        </div>

        <!-- Section: Additional Terms (Addendum) -->
        <div style="border: 1px solid #0F172A; border-radius: 4px; overflow: hidden; margin-bottom: 14px;">
          <div style="background: #0F172A; color: #FFFFFF; display: flex; justify-content: space-between; padding: 4px 10px; font-weight: 800; font-size: 11px;">
            <span>Additional Terms & Special Addenda</span>
            <span>شروط إضافية ملحقة بالعقد</span>
          </div>
          <div style="padding: 10px 12px; background: #F8FAFC;">
            ${(data.additionalTerms || []).map((term, idx) => `
              <div style="display: flex; gap: 8px; margin-bottom: 6px; font-size: 9.5px; line-height: 1.4; color: #1E293B;">
                <span style="font-weight: 800; color: #DC2626;">${idx + 1}.</span>
                <span>${term.replace(/^[0-9]+\.\s*/, '')}</span>
              </div>
            `).join('')}
            <div style="font-size: 8.5px; color: #64748B; font-style: italic; margin-top: 8px; border-top: 1px dashed #CBD5E1; padding-top: 4px;">
              Note: You may add an addendum to this tenancy contract in case you have additional terms while it needs to be signed by all parties. (ملاحظة: يمكن إضافة ملحق إلى هذا العقد في حال وجود أي شروط إضافية على أن يوقع من أطراف التعاقد)
            </div>
          </div>
        </div>

        <!-- Final Signatures & Legal Endorsement -->
        <div style="border: 1px solid #0F172A; border-radius: 4px; overflow: hidden; margin-bottom: 12px;">
          <div style="background: #0F172A; color: #FFFFFF; display: flex; justify-content: space-between; padding: 4px 10px; font-weight: 800; font-size: 11px;">
            <span>Final Signatures & Authorizations</span>
            <span>التوقيعات والاعتماد النهائي</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; padding: 12px; gap: 15px; font-size: 10px;">
            <div style="border: 1px dashed #CBD5E1; padding: 10px; border-radius: 4px;">
              <div style="font-weight: 700; margin-bottom: 4px;">Tenant Signature / توقيع المستأجر:</div>
              <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 18px; color: #2563EB; margin: 6px 0;">
                ${data.tenantSignature || '________________________'}
              </div>
              <div style="font-size: 9px; color: #64748B;">Date: ${data.tenantSignatureDate || '____/____/________'}</div>
            </div>
            <div style="border: 1px dashed #CBD5E1; padding: 10px; border-radius: 4px;">
              <div style="font-weight: 700; margin-bottom: 4px;">Lessor Signature / توقيع المؤجر:</div>
              <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 18px; color: #DC2626; margin: 6px 0;">
                ${data.lessorSignature || '________________________'}
              </div>
              <div style="font-size: 9px; color: #64748B;">Date: ${data.lessorSignatureDate || '____/____/________'}</div>
            </div>
          </div>
        </div>

        <!-- Official DLD Footer -->
        <div style="border-top: 1px solid #CBD5E1; padding-top: 8px; font-size: 8.5px; color: #64748B; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>Tel:</strong> 8004488 / +971 4 222 2251 &nbsp;|&nbsp; <strong>P.O.Box:</strong> 1166, Dubai, U.A.E.
          </div>
          <div>
            <strong>Website:</strong> www.dubailand.gov.ae &nbsp;|&nbsp; <strong>Email:</strong> support@dubailand.gov.ae
          </div>
        </div>

        <div style="text-align: center; font-size: 9px; color: #94A3B8; margin-top: 8px;">
          Page 3 of 3 — Dubai Land Department (DLD) Official Unified Tenancy Contract Addendum & Rights
        </div>
      </div>
    `;

    if (page === 1) return page1Html;
    if (page === 2) return page2Html;
    if (page === 3) return page3Html;

    return `
      <div class="dld-contract-document" style="background: #E2E8F0; padding: 10px; display: flex; flex-direction: column; gap: 20px;">
        ${page1Html}
        ${page2Html}
        ${page3Html}
      </div>
    `;
  }
}

export const henryTenancyContractTemplateService = new HenryTenancyContractTemplateService();
export default henryTenancyContractTemplateService;
