import { describe, it, expect, beforeEach } from 'vitest';
import henryTenancyContractTemplateService, {
  BLANK_DLD_TENANCY_CONTRACT,
  DEMO_PREFILLED_TENANCY_CONTRACT,
} from './HenryTenancyContractTemplateService';
import henryTitleDeedScannerService from './HenryTitleDeedScannerService';
import henryEmiratesIdScannerService from './HenryEmiratesIdScannerService';
import henryPassportScannerService from './HenryPassportScannerService';

describe('HenryTenancyContractTemplateService — Official DLD Tenancy Contract Engine', () => {
  beforeEach(() => {
    henryTenancyContractTemplateService.resetDraft();
  });

  it('generates a fresh blank template with proper defaults and ID', () => {
    const blank = henryTenancyContractTemplateService.getBlankTemplate();
    expect(blank.contractId).toMatch(/^TC-DLD-/);
    expect(blank.propertyUsage).toBe('residential');
    expect(blank.ownerName).toBe('');
    expect(blank.tenantName).toBe('');
    expect(blank.additionalTerms.length).toBe(5);
  });

  it('saves and loads active draft cleanly from storage', () => {
    const draft = henryTenancyContractTemplateService.getBlankTemplate();
    draft.ownerName = 'Alexander Wright';
    draft.buildingName = 'Marina Gate 2';
    draft.annualRent = 120000;

    henryTenancyContractTemplateService.saveDraft(draft);
    const loaded = henryTenancyContractTemplateService.loadActiveDraft();

    expect(loaded.ownerName).toBe('Alexander Wright');
    expect(loaded.buildingName).toBe('Marina Gate 2');
    expect(loaded.annualRent).toBe(120000);
  });

  it('auto-populates contract fields from Title Deed extraction', () => {
    const deedData = henryTitleDeedScannerService.getDemoExtractedData();
    let contract = henryTenancyContractTemplateService.getBlankTemplate();

    contract = henryTenancyContractTemplateService.populateFromTitleDeed(contract, deedData);

    expect(contract.ownerName).toBe('AKRAM DIB NEHME');
    expect(contract.buildingName).toBe('VIRIDIS A');
    expect(contract.propertyNo).toBe('504');
    expect(contract.plotNo).toBe('5120');
    expect(contract.propertyAreaSqM).toBe(38.76);
    expect(contract.location).toContain('Madinat Hind 4');
  });

  it('auto-populates tenant fields from Emirates ID extraction', () => {
    const eidData = henryEmiratesIdScannerService.getDemoExtractedData();
    let contract = henryTenancyContractTemplateService.getBlankTemplate();

    contract = henryTenancyContractTemplateService.populateFromEmiratesId(contract, eidData, 'tenant');

    expect(contract.tenantName).toBe('Arslan Malik Bashir Ahmad');
    expect(contract.tenantEmiratesId).toBe('784-1993-1805733-0');
  });

  it('auto-populates tenant fields from International Passport extraction', () => {
    const passportData = henryPassportScannerService.getDemoExtractedData();
    let contract = henryTenancyContractTemplateService.getBlankTemplate();

    contract = henryTenancyContractTemplateService.populateFromPassport(contract, passportData, 'tenant');

    expect(contract.tenantName).toBe('Arslan Malik');
    expect(contract.tenantEmiratesId).toContain('DR0760143');
    expect(contract.tenantEmiratesId).toContain('PAK');
  });

  it('compiles 3-page bilingual HTML with official DLD structure and signatures', () => {
    const preset = henryTenancyContractTemplateService.getDemoPreset();
    const fullHtml = henryTenancyContractTemplateService.generateDldTenancyContractHtml(preset, 'all');

    expect(fullHtml).toContain('GOVERNMENT OF DUBAI');
    expect(fullHtml).toContain('TENANCY CONTRACT');
    expect(fullHtml).toContain('AKRAM DIB NEHME');
    expect(fullHtml).toContain('Arslan Malik');
    expect(fullHtml).toContain('VIRIDIS A');
    expect(fullHtml).toContain('AED 48,000');
    expect(fullHtml).toContain('Terms and Conditions');
    expect(fullHtml).toContain('Know your Rights');
    expect(fullHtml).toContain('support@dubailand.gov.ae');
  });
});
