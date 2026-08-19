import { describe, it, expect, vi } from 'vitest';
import henryTitleDeedScannerService, {
  VIRIDIS_504_SAMPLE_TITLE_DEED,
} from './HenryTitleDeedScannerService';
import { DEMO_TENANCY_PAYLOAD } from '../components/crm/HenryDocumentStudio/data/HenryDocumentStudio.data';

describe('HenryTitleDeedScannerService — DLD Title Deed OCR & Extraction Engine', () => {
  it('scans Title Deed and returns complete 22-field bilingual property payload', async () => {
    const data = await henryTitleDeedScannerService.scanTitleDeed('sample');

    expect(data.certificateNumber).toBe('140764/2023');
    expect(data.issueDate).toBe('18/07/2023');
    expect(data.propertyTypeEn).toBe('Hotel Apartment');
    expect(data.propertyTypeAr).toBe('شقة فندقية');
    expect(data.buildingNameEn).toBe('VIRIDIS A');
    expect(data.buildingNameAr).toBe('فريديس ايه A');
    expect(data.propertyNumber).toBe('504');
    expect(data.floorNumber).toBe('5');
    expect(data.parkingNumber).toBe('P2-56');
    expect(data.plotNumber).toBe('5120');
    expect(data.municipalityNumber).toBe('914 - 18558');
    expect(data.totalAreaSqM).toBe(38.76);
    expect(data.totalAreaSqFt).toBe(417.21);
    expect(data.suiteAreaSqM).toBe(32.48);
    expect(data.balconyAreaSqM).toBe(6.28);
    expect(data.ownerNameEn).toBe('AKRAM DIB NEHME');
    expect(data.ownerNameAr).toBe('أكرم ديب نعمة');
    expect(data.ownerDldNumber).toBe('6108481');
    expect(data.purchasedFromEn).toBe('FRONT LINE INVESTMENT MANAGEMENT L.L.C');
    expect(data.registrationContractNumber).toBe('131762/2023');
    expect(data.purchasePriceAed).toBe(353000);
    expect(data.confidenceScore).toBeGreaterThanOrEqual(0.99);
  });

  it('maps extracted Title Deed data directly into Tenancy Contract payload', () => {
    const tenancyPayload = henryTitleDeedScannerService.toTenancyContractPayload(
      VIRIDIS_504_SAMPLE_TITLE_DEED,
      DEMO_TENANCY_PAYLOAD
    );

    expect(tenancyPayload.propertyTitle).toContain('VIRIDIS A');
    expect(tenancyPayload.unitNumber).toContain('Unit 504');
    expect(tenancyPayload.community).toContain('Madinat Hind 4');
    expect(tenancyPayload.landlord.name).toBe('AKRAM DIB NEHME');
    expect(tenancyPayload.landlord.emiratesIdOrPassport).toBe('DLD-6108481');
  });

  it('converts extracted Title Deed into a clean CRM Property Inventory item', () => {
    const listing = henryTitleDeedScannerService.toCrmPropertyListing(
      VIRIDIS_504_SAMPLE_TITLE_DEED
    );

    expect(listing.title).toBe('VIRIDIS A — Unit 504 (Hotel Apartment)');
    expect(listing.sizeSqFt).toBe(417.21);
    expect(listing.sizeSqM).toBe(38.76);
    expect(listing.lastPurchasePriceAed).toBe(353000);
    expect(listing.ownerName).toBe('AKRAM DIB NEHME');
    expect(listing.parking).toBe('P2-56');
  });

  it('exports extracted data as formatted JSON string', () => {
    const jsonStr = henryTitleDeedScannerService.exportToJsonString(
      VIRIDIS_504_SAMPLE_TITLE_DEED
    );
    expect(jsonStr).toContain('AKRAM DIB NEHME');
    expect(jsonStr).toContain('140764/2023');
    expect(jsonStr).toContain('VIRIDIS A');
  });

  it('manages temporary session cache and dispatches listener updates', () => {
    const listener = vi.fn();
    const unsubscribe = henryTitleDeedScannerService.onTitleDeedUpdated(listener);

    henryTitleDeedScannerService.setCachedTitleDeed(VIRIDIS_504_SAMPLE_TITLE_DEED);
    expect(henryTitleDeedScannerService.getCachedTitleDeed()?.certificateNumber).toBe('140764/2023');
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ certificateNumber: '140764/2023' }));

    henryTitleDeedScannerService.clearCachedTitleDeed();
    expect(henryTitleDeedScannerService.getCachedTitleDeed()).toBeNull();
    expect(listener).toHaveBeenCalledWith(null);

    unsubscribe();
  });

  it('supports scanDocument alias with automatic session caching', async () => {
    const data = await henryTitleDeedScannerService.scanDocument('sample');
    expect(data.certificateNumber).toBe('140764/2023');
    expect(henryTitleDeedScannerService.getCachedTitleDeed()?.buildingNameEn).toBe('VIRIDIS A');
  });
});
