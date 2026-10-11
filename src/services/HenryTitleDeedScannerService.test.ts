import { describe, it, expect, vi } from 'vitest';
import henryTitleDeedScannerService, {
  VIRIDIS_504_SAMPLE_TITLE_DEED,
} from './HenryTitleDeedScannerService';
import { DEMO_TENANCY_PAYLOAD } from '../components/crm/HenryDocumentStudio/data/HenryDocumentStudio.data';
import { canUseScan } from './henryScanReview';

describe('HenryTitleDeedScannerService — DLD Title Deed OCR & Extraction Engine', () => {
  it('deduplicates exact rows and merges absent labelled/table owner fields', () => {
    const data = henryTitleDeedScannerService.parseDocumentText(`Certificate Number: 900001/2030
Unit Number: 100
Owner Number: 100001 Owner Name: TEST OWNER اسم المالك: مالك تجريبي
Owner Number | Owner Name | Ownership Share | Owned Area
100001 | test owner مالك تجريبي | 100% | 20
100001 | test owner مالك تجريبي | 100% | 20`);
    expect(data.owners).toEqual([{ dldNumber: '100001', nameEn: 'TEST OWNER', nameAr: 'مالك تجريبي', sharePercent: 100, ownedAreaSqM: 20 }]);
    expect(data.diagnostics?.fields.ownerName?.state).toBe('extracted');
    expect(canUseScan({ ...data, reviewConfirmed: true })).toBe(true);
  });
  it('leaves unprinted shares and areas absent on duplicate owners', () => {
    const data = henryTitleDeedScannerService.parseDocumentText(`Owner Number | Owner Name
100001 | TEST OWNER
100001 | TEST OWNER`);
    expect(data.owners).toHaveLength(1);
    expect(data.owners?.[0]?.sharePercent).toBeUndefined();
    expect(data.owners?.[0]?.ownedAreaSqM).toBeUndefined();
    expect(data.diagnostics?.fields.ownerSharePercent?.state).toBe('missing');
  });
  it.each([
    ['100001 | TEST BETA | 50% | 20', 'ownerName'],
    ['100001 | TEST ALPHA | 60% | 20', 'ownerSharePercent'],
    ['100001 | TEST ALPHA | 50% | 30', 'ownedAreaSqM'],
  ])('blocks contradictory owner row %s', (row, key) => {
    const data = henryTitleDeedScannerService.parseDocumentText(`Owner Number | Owner Name | Ownership Share | Owned Area
100001 | TEST ALPHA | 50% | 20
${row}`);
    expect(data.diagnostics?.fields[key]?.state).toBe('conflict');
    expect(data.ownerNameEn).toBe('');
    expect(canUseScan({ ...data, reviewConfirmed: true, missingFields: [] })).toBe(false);
  });
  it.each([
    ['Owner Number | Owner Name | Owner Name', '100001 | TEST ALPHA | TEST BETA', 'ownerName'],
    ['Owner Number | Owner Number | Owner Name', '100001 | 100002 | TEST ALPHA', 'ownerDldNumber'],
    ['Owner Number | Owner Name | Ownership Share | Ownership Share', '100001 | TEST ALPHA | 50% | 60%', 'ownerSharePercent'],
  ])('rejects ambiguous duplicate table columns %s', (headers, row, key) => {
    const data = henryTitleDeedScannerService.parseDocumentText(`${headers}\n${row}`);
    expect(data.owners).toEqual([]);
    expect(data.diagnostics?.fields[key]?.state).toBe('conflict');
  });
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

  it('does not fabricate BUKO values from an unreadable sample-named upload', async () => {
    const { default: eid } = await import('./HenryEmiratesIdScannerService');
    const ocr = vi.spyOn(eid, 'extractDocumentText').mockResolvedValue({ ocrText: '', streamText: '' });
    const file = new File(['bytes'], 'BUKO_COMMODITY_TitleDeed_93757.pdf', { type: 'application/pdf' });
    await expect(henryTitleDeedScannerService.scanTitleDeed(file)).rejects.toThrow('No readable text');
    ocr.mockRestore();
  });

  it('maps extracted Title Deed data directly into Tenancy Contract payload', () => {
    const tenancyPayload = henryTitleDeedScannerService.toTenancyContractPayload(
      { ...VIRIDIS_504_SAMPLE_TITLE_DEED, demoOnly: false, reviewConfirmed: true },
      DEMO_TENANCY_PAYLOAD
    );

    expect(tenancyPayload.propertyTitle).toContain('VIRIDIS A');
    expect(tenancyPayload.unitNumber).toContain('Unit 504');
    expect(tenancyPayload.community).toContain('Madinat Hind 4');
    expect(tenancyPayload.landlord.name).toBe('AKRAM DIB NEHME');
    expect(tenancyPayload.landlord.emiratesIdOrPassport).toBe(DEMO_TENANCY_PAYLOAD.landlord.emiratesIdOrPassport);
  });

  it('converts extracted Title Deed into a clean CRM Property Inventory item', () => {
    const listing = henryTitleDeedScannerService.toCrmPropertyListing(
      { ...VIRIDIS_504_SAMPLE_TITLE_DEED, demoOnly: false, reviewConfirmed: true }
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
      { ...VIRIDIS_504_SAMPLE_TITLE_DEED, demoOnly: false, reviewConfirmed: true }
    );
    expect(jsonStr).toContain('AKRAM DIB NEHME');
    expect(jsonStr).toContain('140764/2023');
    expect(jsonStr).toContain('VIRIDIS A');
  });

  it('manages temporary session cache and dispatches listener updates', () => {
    const listener = vi.fn();
    const unsubscribe = henryTitleDeedScannerService.onTitleDeedUpdated(listener);

    henryTitleDeedScannerService.setCachedTitleDeed({ ...VIRIDIS_504_SAMPLE_TITLE_DEED, demoOnly: false, reviewConfirmed: true });
    expect(henryTitleDeedScannerService.getCachedTitleDeed()?.certificateNumber).toBe('140764/2023');
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ certificateNumber: '140764/2023' }));

    henryTitleDeedScannerService.clearCachedTitleDeed();
    expect(henryTitleDeedScannerService.getCachedTitleDeed()).toBeNull();
    expect(listener).toHaveBeenCalledWith(null);

    unsubscribe();
  });

  it('supports scanDocument demo alias without publishing sample data', async () => {
    const data = await henryTitleDeedScannerService.scanDocument('sample');
    expect(data.certificateNumber).toBe('140764/2023');
    expect(data.demoOnly).toBe(true);
    expect(henryTitleDeedScannerService.getCachedTitleDeed()).toBeNull();
  });
});
