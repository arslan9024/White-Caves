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
   * Compiles the official 3-page bilingual DLD Tenancy Contract HTML matching the official Land Department layout exactly
   */
  generateDldTenancyContractHtml(data: DldTenancyContractData, page: number | 'all' = 'all'): string {
    const isBlank = !data.tenantName && !data.ownerName;

    // Helper for dotted underline value cell
    const renderDottedField = (enLabel: string, value: string | number | undefined, arLabel: string, extraSub?: string) => `
      <div style="display: flex; justify-content: space-between; align-items: baseline; padding: 4px 6px; font-size: 10px;">
        <span style="font-weight: 700; color: #1E293B; min-width: 140px; text-align: left;">
          ${enLabel} ${extraSub ? `<span style="font-size: 8px; color: #64748B; font-weight: normal;">${extraSub}</span>` : ''}
        </span>
        <span style="flex-grow: 1; margin: 0 10px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800; color: #0F172A; font-size: 10.5px; line-height: 1.2;">
          ${value !== undefined && value !== '' ? value : '&nbsp;'}
        </span>
        <span style="font-weight: 700; color: #1E293B; min-width: 140px; text-align: right; direction: rtl;">
          ${arLabel}
        </span>
      </div>
    `;

    const page1Html = `
      <div class="dld-page" style="page-break-after: always; min-height: 1080px; padding: 25px 32px; font-family: 'Segoe UI', Arial, sans-serif; color: #1E293B; background: #FFFFFF; box-sizing: border-box; position: relative;">
        <!-- Official Full-Color Header Logos & Title -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; margin-bottom: 4px; border-bottom: 2px solid #E2E8F0;">
          <!-- Left: Official Government of Dubai Full-Color Crest -->
          <div style="text-align: left; display: flex; align-items: center; gap: 10px;">
            <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="#F8FAFC" stroke="#DC2626" stroke-width="2.5"/>
              <path d="M50 14 C34 14 22 26 22 42 C22 58 36 78 50 86 C64 78 78 58 78 42 C78 26 66 14 50 14 Z" fill="#DC2626"/>
              <circle cx="50" cy="42" r="16" fill="#F59E0B"/>
              <path d="M50 30 L54 38 L62 39 L56 45 L58 53 L50 49 L42 53 L44 45 L38 39 L46 38 Z" fill="#FFFFFF"/>
              <path d="M30 68 Q50 78 70 68" stroke="#FFFFFF" stroke-width="3" fill="none"/>
            </svg>
            <div>
              <div style="font-weight: 900; font-size: 15px; color: #0F172A; line-height: 1.1; letter-spacing: 0.5px;">حكومة دبـــــــــــي</div>
              <div style="font-size: 8.5px; color: #DC2626; font-weight: 900; letter-spacing: 1px;">GOVERNMENT OF DUBAI</div>
            </div>
          </div>

          <!-- Right: Official Dubai Land Department Logo -->
          <div style="text-align: right; display: flex; align-items: center; gap: 10px; justify-content: flex-end;">
            <div>
              <div style="font-weight: 900; font-size: 15px; color: #0F172A; line-height: 1.1; letter-spacing: 0.5px;">دائــــرة الأراضــــي والأمـــــلاك</div>
              <div style="font-size: 9px; color: #059669; font-weight: 900; letter-spacing: 0.5px;">Land Department</div>
            </div>
            <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="#F8FAFC" stroke="#059669" stroke-width="2.5"/>
              <path d="M50 18 L50 82 M50 26 Q32 36 30 54 M50 26 Q68 36 70 54 M50 40 Q28 50 26 66 M50 40 Q72 50 74 66" stroke="#059669" stroke-width="3.5" stroke-linecap="round" fill="none"/>
              <circle cx="50" cy="22" r="5" fill="#F59E0B"/>
            </svg>
          </div>
        </div>

        <!-- Center Official Form Title -->
        <div style="text-align: center; margin: 6px 0 12px 0;">
          <div style="font-size: 22px; font-weight: 900; color: #0F172A; letter-spacing: 4px; line-height: 1.2;">عــــقـــــد إيــــجــــــار</div>
          <div style="font-size: 12px; font-weight: 900; color: #DC2626; letter-spacing: 3px; margin-top: 1px;">TENANCY CONTRACT</div>
        </div>

        <!-- Date Line -->
        <div style="display: flex; justify-content: flex-start; align-items: baseline; font-size: 10px; margin-bottom: 8px; color: #1E293B;">
          <span style="font-weight: 700;">Date</span>
          <span style="display: inline-block; width: 140px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800; margin: 0 8px;">
            ${data.contractDate || '&nbsp;'}
          </span>
          <span style="font-weight: 700;">التاريخ</span>
        </div>

        <!-- 1. Owner / Lessor Information -->
        <div style="margin-bottom: 8px; border: 1px solid #1E293B; border-radius: 2px; overflow: hidden;">
          <div style="background: #1E293B; color: #FFFFFF; display: flex; justify-content: space-between; padding: 3px 10px; font-weight: 800; font-size: 11px;">
            <span>Owner / Lessor Information</span>
            <span style="direction: rtl;">معلومات المالك / المؤجر</span>
          </div>
          <div style="padding: 3px 4px; background: #FFFFFF;">
            ${renderDottedField("Owner's Name", data.ownerName, "اسم المالك")}
            ${renderDottedField("Lessor's Name", data.lessorName, "اسم المؤجر")}
            ${renderDottedField("Lessor's Emirates ID", data.lessorEmiratesId, "الهوية الإماراتية للمؤجر")}
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 2px 6px; font-size: 9.5px;">
              <div style="display: flex; align-items: baseline; justify-content: space-between;">
                <span style="font-weight: 700; color: #1E293B;">License No. <span style="font-size: 7.5px; color: #64748B;">Incase of a Company</span></span>
                <span style="flex-grow: 1; margin: 0 6px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800;">${data.lessorLicenseNo || '&nbsp;'}</span>
                <span style="font-weight: 700; direction: rtl;">رقم الرخصة <span style="font-size: 7.5px; color: #64748B;">في حال كانت شركة</span></span>
              </div>
              <div style="display: flex; align-items: baseline; justify-content: space-between;">
                <span style="font-weight: 700; color: #1E293B;">Licensing Authority <span style="font-size: 7.5px; color: #64748B;">Incase of a Company</span></span>
                <span style="flex-grow: 1; margin: 0 6px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800;">${data.lessorLicensingAuthority || '&nbsp;'}</span>
                <span style="font-weight: 700; direction: rtl;">سلطة الترخيص <span style="font-size: 7.5px; color: #64748B;">في حال كانت شركة</span></span>
              </div>
            </div>

            ${renderDottedField("Lessor's Email", data.lessorEmail, "البريد الإلكتروني للمؤجر")}
            ${renderDottedField("Lessor's Phone", data.lessorPhone, "رقم هاتف المؤجر")}
          </div>
        </div>

        <!-- 2. Tenant Information -->
        <div style="margin-bottom: 8px; border: 1px solid #1E293B; border-radius: 2px; overflow: hidden;">
          <div style="background: #1E293B; color: #FFFFFF; display: flex; justify-content: space-between; padding: 3px 10px; font-weight: 800; font-size: 11px;">
            <span>Tenant Information</span>
            <span style="direction: rtl;">معلومات المستأجر</span>
          </div>
          <div style="padding: 3px 4px; background: #FFFFFF;">
            ${renderDottedField("Tenant's Name", data.tenantName, "اسم المستأجر")}
            ${renderDottedField("Tenant's Emirates ID", data.tenantEmiratesId, "الهوية الإماراتية للمستأجر")}
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 2px 6px; font-size: 9.5px;">
              <div style="display: flex; align-items: baseline; justify-content: space-between;">
                <span style="font-weight: 700; color: #1E293B;">License No. <span style="font-size: 7.5px; color: #64748B;">Incase of a Company</span></span>
                <span style="flex-grow: 1; margin: 0 6px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800;">${data.tenantLicenseNo || '&nbsp;'}</span>
                <span style="font-weight: 700; direction: rtl;">رقم الرخصة <span style="font-size: 7.5px; color: #64748B;">في حال كانت شركة</span></span>
              </div>
              <div style="display: flex; align-items: baseline; justify-content: space-between;">
                <span style="font-weight: 700; color: #1E293B;">Licensing Authority <span style="font-size: 7.5px; color: #64748B;">Incase of a Company</span></span>
                <span style="flex-grow: 1; margin: 0 6px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800;">${data.tenantLicensingAuthority || '&nbsp;'}</span>
                <span style="font-weight: 700; direction: rtl;">سلطة الترخيص <span style="font-size: 7.5px; color: #64748B;">في حال كانت شركة</span></span>
              </div>
            </div>

            ${renderDottedField("Tenant's Email", data.tenantEmail, "البريد الإلكتروني للمستأجر")}
            ${renderDottedField("Tenant's Phone", data.tenantPhone, "رقم هاتف المستأجر")}
          </div>
        </div>

        <!-- 3. Property Information -->
        <div style="margin-bottom: 8px; border: 1px solid #1E293B; border-radius: 2px; overflow: hidden;">
          <div style="background: #1E293B; color: #FFFFFF; display: flex; justify-content: space-between; padding: 3px 10px; font-weight: 800; font-size: 11px;">
            <span>Property Information</span>
            <span style="direction: rtl;">معلومات العقار</span>
          </div>
          <div style="padding: 3px 4px; background: #FFFFFF;">
            <!-- Usage Radio Bar -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 3px 6px; font-size: 10px;">
              <span style="font-weight: 700; color: #1E293B;">Property Usage</span>
              <div style="display: flex; gap: 24px; font-weight: 700;">
                <span><span style="font-size: 13px;">${data.propertyUsage === 'industrial' ? '🔘' : '⚪'}</span> Industrial صناعي</span>
                <span><span style="font-size: 13px;">${data.propertyUsage === 'commercial' ? '🔘' : '⚪'}</span> Commercial تجاري</span>
                <span><span style="font-size: 13px;">${data.propertyUsage === 'residential' || !data.propertyUsage ? '🔘' : '⚪'}</span> Residential سكني</span>
              </div>
              <span style="font-weight: 700; color: #1E293B; direction: rtl;">استخدام العقار</span>
            </div>

            <!-- 2-Column Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                ${renderDottedField("Plot No.", data.plotNo, "رقم الأرض")}
                ${renderDottedField("Building Name", data.buildingName, "اسم المبنى")}
                ${renderDottedField("Property Type", data.propertyType, "نوع الوحدة")}
                ${renderDottedField("Location", data.location, "الموقع")}
              </div>
              <div>
                ${renderDottedField("Makani No.", data.makaniNo, "رقم مكاني")}
                ${renderDottedField("Property No.", data.propertyNo, "رقم العقار")}
                ${renderDottedField("Property Area (s.m)", data.propertyAreaSqM ? `${data.propertyAreaSqM}` : '', "مساحة العقار (متر.مربع)")}
                ${renderDottedField("Premises No. (DEWA)", data.premisesNoDewa, "رقم المبنى (ديوا)")}
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Contract Information -->
        <div style="margin-bottom: 8px; border: 1px solid #1E293B; border-radius: 2px; overflow: hidden;">
          <div style="background: #1E293B; color: #FFFFFF; display: flex; justify-content: space-between; padding: 3px 10px; font-weight: 800; font-size: 11px;">
            <span>Contract Information</span>
            <span style="direction: rtl;">معلومات العقد</span>
          </div>
          <div style="padding: 3px 4px; background: #FFFFFF;">
            <!-- Contract Period & Value -->
            <div style="display: grid; grid-template-columns: 1.3fr 1fr; gap: 10px; padding: 2px 6px; font-size: 10px;">
              <div style="display: flex; align-items: baseline; justify-content: space-between;">
                <span style="font-weight: 700; color: #1E293B;">Contract Period</span>
                <span style="font-weight: 600; font-size: 9.5px; margin-left: 4px;">From من</span>
                <span style="flex-grow: 1; margin: 0 4px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800;">${data.contractPeriodFrom || '&nbsp;'}</span>
                <span style="font-weight: 600; font-size: 9.5px;">To إلى</span>
                <span style="flex-grow: 1; margin: 0 4px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800;">${data.contractPeriodTo || '&nbsp;'}</span>
                <span style="font-weight: 700; direction: rtl;">فترة العقد</span>
              </div>
              <div style="display: flex; align-items: baseline; justify-content: space-between;">
                <span style="font-weight: 700; color: #1E293B;">Contract Value</span>
                <span style="flex-grow: 1; margin: 0 8px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800;">${data.contractValue || data.annualRent ? `AED ${(data.contractValue || data.annualRent).toLocaleString()}` : '&nbsp;'}</span>
                <span style="font-weight: 700; direction: rtl;">قيمة العقد</span>
              </div>
            </div>

            <!-- Annual Rent & Security Deposit -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              ${renderDottedField("Annual Rent", data.annualRent ? `AED ${data.annualRent.toLocaleString()}` : '', "الايجار السنوي")}
              ${renderDottedField("Security Deposit Amount", data.securityDepositAmount ? `AED ${data.securityDepositAmount.toLocaleString()}` : '', "مبلغ التأمين")}
            </div>

            ${renderDottedField("Mode of Payment", data.modeOfPayment, "طريقة الدفع")}
          </div>
        </div>

        <!-- 5. Signatures -->
        <div style="border: 1px solid #1E293B; border-radius: 2px; overflow: hidden; margin-top: 4px;">
          <div style="background: #1E293B; color: #FFFFFF; display: flex; justify-content: space-between; padding: 3px 10px; font-weight: 800; font-size: 11px;">
            <span>Signatures</span>
            <span style="direction: rtl;">التوقيعات</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; padding: 12px 14px; gap: 24px; font-size: 10px; background: #FFFFFF;">
            <!-- Tenant Signature Line -->
            <div style="display: flex; align-items: baseline; justify-content: space-between;">
              <span style="font-weight: 700;">Tenant Signature</span>
              <span style="font-weight: 700; direction: rtl;">توقيع المستأجر</span>
              <span style="display: inline-block; width: 80px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800; margin: 0 4px;">${data.tenantSignature || '&nbsp;'}</span>
              <span style="font-weight: 700;">Date</span>
              <span style="display: inline-block; width: 60px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800; margin: 0 4px;">${data.tenantSignatureDate || '&nbsp;'}</span>
              <span style="font-weight: 700; direction: rtl;">التاريخ</span>
            </div>

            <!-- Lessor Signature Line -->
            <div style="display: flex; align-items: baseline; justify-content: space-between;">
              <span style="font-weight: 700;">Lessor's Signature</span>
              <span style="font-weight: 700; direction: rtl;">توقيع المؤجر</span>
              <span style="display: inline-block; width: 80px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800; margin: 0 4px;">${data.lessorSignature || '&nbsp;'}</span>
              <span style="font-weight: 700;">Date</span>
              <span style="display: inline-block; width: 60px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800; margin: 0 4px;">${data.lessorSignatureDate || '&nbsp;'}</span>
              <span style="font-weight: 700; direction: rtl;">التاريخ</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const page2Html = `
      <div class="dld-page" style="page-break-after: always; min-height: 1080px; padding: 25px 32px; font-family: 'Segoe UI', Arial, sans-serif; color: #1E293B; background: #FFFFFF; box-sizing: border-box;">
        <!-- Official Full-Color Header Logos -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; margin-bottom: 4px; border-bottom: 2px solid #E2E8F0;">
          <div style="text-align: left; display: flex; align-items: center; gap: 10px;">
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="#F8FAFC" stroke="#DC2626" stroke-width="2.5"/>
              <path d="M50 14 C34 14 22 26 22 42 C22 58 36 78 50 86 C64 78 78 58 78 42 C78 26 66 14 50 14 Z" fill="#DC2626"/>
              <circle cx="50" cy="42" r="16" fill="#F59E0B"/>
            </svg>
            <div>
              <div style="font-weight: 900; font-size: 14px; color: #0F172A; line-height: 1.1;">حكومة دبـــــــــــي</div>
              <div style="font-size: 8px; color: #DC2626; font-weight: 900; letter-spacing: 0.5px;">GOVERNMENT OF DUBAI</div>
            </div>
          </div>
          <div style="text-align: right; display: flex; align-items: center; gap: 10px; justify-content: flex-end;">
            <div>
              <div style="font-weight: 900; font-size: 14px; color: #0F172A; line-height: 1.1;">دائــــرة الأراضــــي والأمـــــلاك</div>
              <div style="font-size: 8.5px; color: #059669; font-weight: 900;">Land Department</div>
            </div>
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="#F8FAFC" stroke="#059669" stroke-width="2.5"/>
              <path d="M50 18 L50 82 M50 26 Q32 36 30 54 M50 26 Q68 36 70 54 M50 40 Q28 50 26 66 M50 40 Q72 50 74 66" stroke="#059669" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            </svg>
          </div>
        </div>

        <!-- Terms and Conditions Banner -->
        <div style="background: #1E293B; color: #FFFFFF; display: flex; justify-content: space-between; padding: 4px 12px; font-weight: 800; font-size: 11px; margin-bottom: 8px; border-radius: 2px;">
          <span>Terms and Conditions</span>
          <span style="direction: rtl;">الأحكام و الشروط</span>
        </div>

        <!-- 14 Bilingual Standard Legal Terms -->
        <table style="width: 100%; border-collapse: collapse; font-size: 8.5px; line-height: 1.4; color: #1E293B;">
          <tbody>
            ${[
              [
                "1. The tenant has inspected the premises and agreed to lease the unit on its current condition.",
                ".١ عاين المستأجر الوحدة موضوع الايجار ووافق على إستئجار العقار على حالته الحالية"
              ],
              [
                "2. Tenant undertakes to use the premises for designated purpose, tenant has no rights to transfer or relinquish the tenancy contract either with or without counterpart without landlord written approval. Also, tenant is not allowed to sublease the premises or any part thereof to third party in whole or in part unless it is legally permitted.",
                ".٢ يتعهد المستأجر باستعمال المأجور للغرض المخصص له، و لا يجوز للمستأجر تحويل أو التنازل عن عقد الايجار للغير بمقابل أو دون مقابل دون موافقة المالك خطيا، كما لا يجوز للمستأجر تأجير المأجور أو أي جزء منه من الباطن مالم يسمح بذلك قانونا"
              ],
              [
                "3. The tenant undertakes not to make any amendments, modifications or addendums to the premises subject of the contract without obtaining the landlord written approval. Tenant shall be liable for any damages or failure due to that.",
                ".٣ يتعهد المستأجر بعدم إجراء أي تعديلات أو إضافات على العقار موضوع العقد دون موافقة المالك الخطية، و يكون المستأجر مسؤولا عن أي أضرار أو نقص أو تلف يلحق بالعقار"
              ],
              [
                "4. The tenant shall be responsible for payment of all electricity, water, cooling and gas charges resulting of occupying leased unit unless other condition agreed in written.",
                ".٤ يكون المستأجر مسؤولا عن سداد كافة فواتير الكهرباء و المياه و التبريد و الغاز المترتبة عن اشغاله المأجور مالم يتم الاتفاق على غير ذلك كتابيا"
              ],
              [
                "5. The tenant must pay the rent amount in the manner and dates agreed with the landlord.",
                ".٥ يتعهد المستأجر بسداد مبلغ الايجار المتفق عليه في هذا العقد في التواريخ و الطريقة المتفق عليها"
              ],
              [
                "6. The tenant fully undertakes to comply with all the regulations and instructions related to the management of the property and the use of the premises and of common areas such (parking, swimming pools, gymnasium, etc…).",
                ".٦ يلتزم المستأجر التقيد التام بالانظمة و التعليمات المتعلقة باستخدام المأجور و المنافع المشتركة (كمواقف السيارات، أحواض السباحة، النادي الصحي، الخ)"
              ],
              [
                "7. Tenancy contract parties declare all mentioned emails addresses and phone numbers are correct, all formal and legal notifications will be sent to those addresses in case of dispute between parties",
                ".٧ يقر أطراف التعاقد بصحة العناوين و أرقام الهواتف المذكورة أعلاه، و تكون تلك العناوين هي المعتمدة رسميا للإخطارات و الأعلانات القضائية في حال نشوء أي نزاع بين أطراف العقد"
              ],
              [
                "8. The landlord undertakes to enable the tenant of the full use of the premises including its facilities (swimming pool, gym, parking lot, etc) and do the regular maintenance as intended unless other condition agreed in written, and not to do any act that would detract from the premises benefit.",
                ".٨ يتعهد المؤجر بتمكين المستأجر من الانتفاع التام بالعقار للغرض المؤجر لأجله و المرافق الخاصة به (حوض سباحة، نادي صحي، مواقف سيارات.... إلخ) كما يكون مسؤولا عن أعمال الصيانة مالم يتم الاتفاق على غير ذلك، و عدم التعرض له في منفعة العقار"
              ],
              [
                "9. By signing this agreement from the first party, the \"Landlord\" hereby confirms and undertakes that he is the current owner of the property or his legal representative under legal power of attorney duly entitled by the competent authorities.",
                ".٩ يعتبر توقيع المؤجر على هذا العقد إقرار منه بأنه المالك الحالي للعقار أو الوكيل القانوني للمالك بموجب وكالة قانونية موثقة وفق الأصول لدى الجهات المختصة"
              ],
              [
                "10. Any disagreement or dispute may arise from execution or interpretation of this contract shall be settled by the Rental Dispute Center.",
                ".١٠ أي خلاف أو نزاع قد ينشأ عن تنفيذ أو تفسير هذا العقد يعود البت فيه لمركز فض المنازعات الإيجارية"
              ],
              [
                "11. This contract is subject to all provisions of Law No (26) of 2007 regulating the relation between landlords and tenants in the emirate of Dubai as amended, and as it will be changed or amended from time to time, as long with any related legislations and regulations applied in the emirate of Dubai.",
                ".١١ يخضع هذا العقد لكافة أحكام القانون رقم ( 26 ) لسنة 2007 بشأن تنظيم العلاقة بين مؤجري و مستأجري العقارات في إماراة دبي، و تعديلاته و أي تغيير أو تعديل يطرأ عليه من وقت لآخر، كما يخضع للتشريعات و اللوائح الأخرى ذات العلاقة النافذة في دبي"
              ],
              [
                "12. Any additional condition will not be considered in case it conflicts with law.",
                ".١٢ لا يعتد بأي شرط تم إضافته إلى هذا العقد في حال تعارضه مع القانون"
              ],
              [
                "13. In case of discrepancy occurs between Arabic and non Arabic texts with regards to the interpretation of this agreement or the scope of its application, the Arabic text shall prevail.",
                ".١٣ في حال حدوث أي تعارض أو اختلاف في التفسير بين النص العربي والنص الأجنبي يعتمد النص العربي"
              ],
              [
                "14. The landlord undertakes to register this tenancy contract on EJARI affiliated to Dubai LandDepartment and provide with all required documents.",
                ".١٤ يتعهد المؤجر بتسجيل عقد الايجار في نظام إيجاري التابع لدائرة الأراضي و الأملاك و توفير كافة المستندات اللازمة لذلك"
              ]
            ].map(([en, ar], idx) => `
              <tr style="border-bottom: 1px solid #E2E8F0; vertical-align: top;">
                <td style="width: 50%; padding: 4.5px 8px; text-align: left;">${en}</td>
                <td style="width: 50%; padding: 4.5px 8px; text-align: right; direction: rtl; font-weight: 600;">${ar}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Page 2 Signatures -->
        <div style="border: 1px solid #1E293B; border-radius: 2px; overflow: hidden; margin-top: 14px;">
          <div style="background: #1E293B; color: #FFFFFF; display: flex; justify-content: space-between; padding: 3px 10px; font-weight: 800; font-size: 11px;">
            <span>Signatures</span>
            <span style="direction: rtl;">التوقيعات</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; padding: 10px 14px; gap: 24px; font-size: 10px; background: #FFFFFF;">
            <div style="display: flex; align-items: baseline; justify-content: space-between;">
              <span style="font-weight: 700;">Tenant Signature</span>
              <span style="font-weight: 700; direction: rtl;">توقيع المستأجر</span>
              <span style="display: inline-block; width: 80px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800; margin: 0 4px;">${data.tenantSignature || '&nbsp;'}</span>
              <span style="font-weight: 700;">Date</span>
              <span style="display: inline-block; width: 60px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800; margin: 0 4px;">${data.tenantSignatureDate || '&nbsp;'}</span>
              <span style="font-weight: 700; direction: rtl;">التاريخ</span>
            </div>
            <div style="display: flex; align-items: baseline; justify-content: space-between;">
              <span style="font-weight: 700;">Lessor's Signature</span>
              <span style="font-weight: 700; direction: rtl;">توقيع المؤجر</span>
              <span style="display: inline-block; width: 80px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800; margin: 0 4px;">${data.lessorSignature || '&nbsp;'}</span>
              <span style="font-weight: 700;">Date</span>
              <span style="display: inline-block; width: 60px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800; margin: 0 4px;">${data.lessorSignatureDate || '&nbsp;'}</span>
              <span style="font-weight: 700; direction: rtl;">التاريخ</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const page3Html = `
      <div class="dld-page" style="min-height: 1080px; padding: 25px 32px; font-family: 'Segoe UI', Arial, sans-serif; color: #1E293B; background: #FFFFFF; box-sizing: border-box; position: relative;">
        <!-- Official Full-Color Header Logos -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; margin-bottom: 4px; border-bottom: 2px solid #E2E8F0;">
          <div style="text-align: left; display: flex; align-items: center; gap: 10px;">
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="#F8FAFC" stroke="#DC2626" stroke-width="2.5"/>
              <path d="M50 14 C34 14 22 26 22 42 C22 58 36 78 50 86 C64 78 78 58 78 42 C78 26 66 14 50 14 Z" fill="#DC2626"/>
              <circle cx="50" cy="42" r="16" fill="#F59E0B"/>
            </svg>
            <div>
              <div style="font-weight: 900; font-size: 14px; color: #0F172A; line-height: 1.1;">حكومة دبـــــــــــي</div>
              <div style="font-size: 8px; color: #DC2626; font-weight: 900; letter-spacing: 0.5px;">GOVERNMENT OF DUBAI</div>
            </div>
          </div>
          <div style="text-align: right; display: flex; align-items: center; gap: 10px; justify-content: flex-end;">
            <div>
              <div style="font-weight: 900; font-size: 14px; color: #0F172A; line-height: 1.1;">دائــــرة الأراضــــي والأمـــــلاك</div>
              <div style="font-size: 8.5px; color: #059669; font-weight: 900;">Land Department</div>
            </div>
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="#F8FAFC" stroke="#059669" stroke-width="2.5"/>
              <path d="M50 18 L50 82 M50 26 Q32 36 30 54 M50 26 Q68 36 70 54 M50 40 Q28 50 26 66 M50 40 Q72 50 74 66" stroke="#059669" stroke-width="3.5" stroke-linecap="round" fill="none"/>
            </svg>
          </div>
        </div>

        <!-- 1. Know Your Rights Banner -->
        <div style="margin-bottom: 8px; border: 1px solid #1E293B; border-radius: 2px; overflow: hidden;">
          <div style="background: #1E293B; color: #FFFFFF; display: flex; justify-content: space-between; padding: 3px 10px; font-weight: 800; font-size: 11px;">
            <span>Know your Rights</span>
            <span style="direction: rtl;">لمعرفة حقوق الأطراف</span>
          </div>
          <div style="padding: 6px 10px; font-size: 9px; line-height: 1.45; display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              • You may visit Rental Dispute Center website through <a href="https://www.dubailand.gov.ae" style="color: #1E293B; text-decoration: underline;">www.dubailand.gov.ae</a> in case of any rental dispute between parties.<br/>
              • Law No 26 of 2007 regulating relationship between landlords and tenants.<br/>
              • Law No 33 of 2008 amending law 26 of year 2007.<br/>
              • Law No 43 of 2013 determining rent increases for properties
            </div>
            <div style="direction: rtl; text-align: right;">
              • يمكنكم زيارة موقع مركز فض المنازعات الإيجارية من خلال <span style="text-decoration: underline;">www.dubailand.gov.ae</span> في حال نشوء أي نزاع إيجاري بين الأطراف<br/>
              • الإطلاع على قانون رقم 26 لسنة 2007 بشأن تنظيم العلاقة بين المؤجرين والمستأجرين<br/>
              • الإطلاع على قانون رقم 33 لسنة 2008 الخاص بتعديل بعض أحكام قانون 26 لعام 2007<br/>
              • الإطلاع على قانون رقم 43 لسنة 2013 بشأن تحديد زيادة بدل الإيجار
            </div>
          </div>
        </div>

        <!-- 2. Attachments for Ejari Registration -->
        <div style="margin-bottom: 8px; border: 1px solid #1E293B; border-radius: 2px; overflow: hidden;">
          <div style="background: #1E293B; color: #FFFFFF; display: flex; justify-content: space-between; padding: 3px 10px; font-weight: 800; font-size: 11px;">
            <span>Attachments for Ejari Registration</span>
            <span style="direction: rtl;">مرفقات التسجيل في إيجاري</span>
          </div>
          <div style="padding: 6px 10px; font-size: 9px; line-height: 1.45; display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              1. Original unified tenancy contract<br/>
              2. Original emirates ID of applicant
            </div>
            <div style="direction: rtl; text-align: right;">
              .١ نسخة أصلية عن عقد الايجار الموحد<br/>
              .٢ الهوية الإماراتية الأصلية لمقدم الطلب
            </div>
          </div>
        </div>

        <!-- 3. Additional Terms -->
        <div style="margin-bottom: 12px; border: 1px solid #1E293B; border-radius: 2px; overflow: hidden; position: relative;">
          <div style="background: #1E293B; color: #FFFFFF; display: flex; justify-content: space-between; padding: 3px 10px; font-weight: 800; font-size: 11px;">
            <span>Additional Terms</span>
            <span style="direction: rtl;">شروط إضافية</span>
          </div>

          <!-- Light Watermark EJARI -->
          <div style="position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%); font-size: 60px; font-weight: 900; color: rgba(203, 213, 225, 0.25); letter-spacing: 12px; pointer-events: none; text-align: center; line-height: 1;">
            إيجــــــــاري<br/><span style="font-size: 40px; letter-spacing: 8px;">EJARI</span>
          </div>

          <div style="padding: 6px 10px; min-height: 180px; position: relative; z-index: 1;">
            ${[1, 2, 3, 4, 5].map((num) => {
              const arabicNum = ['', '١', '٢', '٣', '٤', '٥'][num];
              const termValue = (data.additionalTerms && data.additionalTerms[num - 1]) 
                ? data.additionalTerms[num - 1].replace(/^[0-9]+\.\s*/, '') 
                : '';

              return `
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; font-size: 10px;">
                  <span style="font-weight: 700; color: #1E293B; min-width: 25px;">${num}.</span>
                  <span style="flex-grow: 1; margin: 0 10px; border-bottom: 1px dotted #94A3B8; font-weight: 700; color: #0F172A; font-size: 9.5px;">
                    ${termValue || '&nbsp;'}
                  </span>
                  <span style="font-weight: 700; color: #1E293B; min-width: 25px; text-align: right;">.${arabicNum}</span>
                </div>
              `;
            }).join('')}

            <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #475569; margin-top: 10px; border-top: 1px solid #F1F5F9; padding-top: 6px;">
              <span style="max-width: 48%;">Note : You may add addendum to this tenancy contract in case you have additional terms while it needs to be signed by all parties</span>
              <span style="max-width: 48%; direction: rtl; text-align: right;">ملاحظة: يمكن إضافة ملحق إلى هذا العقد في حال وجود أي شروط إضافية، على أن يوقع من أطراف التعاقد</span>
            </div>
          </div>
        </div>

        <!-- Page 3 Signatures -->
        <div style="border: 1px solid #1E293B; border-radius: 2px; overflow: hidden; margin-top: 8px;">
          <div style="background: #1E293B; color: #FFFFFF; display: flex; justify-content: space-between; padding: 3px 10px; font-weight: 800; font-size: 11px;">
            <span>Signatures</span>
            <span style="direction: rtl;">التوقيعات</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; padding: 10px 14px; gap: 24px; font-size: 10px; background: #FFFFFF;">
            <div style="display: flex; align-items: baseline; justify-content: space-between;">
              <span style="font-weight: 700;">Tenant Signature</span>
              <span style="font-weight: 700; direction: rtl;">توقيع المستأجر</span>
              <span style="display: inline-block; width: 80px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800; margin: 0 4px;">${data.tenantSignature || '&nbsp;'}</span>
              <span style="font-weight: 700;">Date</span>
              <span style="display: inline-block; width: 60px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800; margin: 0 4px;">${data.tenantSignatureDate || '&nbsp;'}</span>
              <span style="font-weight: 700; direction: rtl;">التاريخ</span>
            </div>
            <div style="display: flex; align-items: baseline; justify-content: space-between;">
              <span style="font-weight: 700;">Lessor's Signature</span>
              <span style="font-weight: 700; direction: rtl;">توقيع المؤجر</span>
              <span style="display: inline-block; width: 80px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800; margin: 0 4px;">${data.lessorSignature || '&nbsp;'}</span>
              <span style="font-weight: 700;">Date</span>
              <span style="display: inline-block; width: 60px; border-bottom: 1px dotted #94A3B8; text-align: center; font-weight: 800; margin: 0 4px;">${data.lessorSignatureDate || '&nbsp;'}</span>
              <span style="font-weight: 700; direction: rtl;">التاريخ</span>
            </div>
          </div>
        </div>

        <!-- Official DLD Footer -->
        <div style="border-top: 1px solid #CBD5E1; padding-top: 6px; margin-top: 8px; font-size: 8px; color: #475569; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>Tel:</strong> 8004488 &nbsp;|&nbsp; <strong>Fax:</strong> +971 4 222 2251 &nbsp;|&nbsp; <strong>P.O.Box</strong> 1166, Dubai, U.A.E.
          </div>
          <div>
            <strong>Website:</strong> www.dubailand.gov.ae &nbsp;|&nbsp; <strong>E-mail:</strong> support@dubailand.gov.ae
          </div>
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
