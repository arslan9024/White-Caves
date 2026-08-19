import { describe, it, expect, vi } from 'vitest';
import henryTenancyContractScannerService, {
  SANIT_SINGH_CAMELIA_608_SAMPLE,
  BLANK_DLD_TEMPLATE_SAMPLE,
} from './HenryTenancyContractScannerService';

describe('HenryTenancyContractScannerService — Optical AI Parser & Fill Detection', () => {
  it('accurately parses filled contract and calculates 92% completeness score', async () => {
    const result = await henryTenancyContractScannerService.scanContract('sample');

    expect(result.isFilled).toBe(true);
    expect(result.fillScorePercent).toBe(92);
    expect(result.classification).toBe('fully_executed');
    expect(result.landlord.name).toBe('SANIT SINGH NAGPAL');
    expect(result.tenant.name).toBe('KESHIVANI MAYADEVAN');
    expect(result.property.buildingName).toBe('CAMELIA');
    expect(result.property.propertyNumber).toBe('608');
    expect(result.property.plotNumber).toBe('176');
    expect(result.property.areaSqM).toBe(112.24);
    expect(result.property.location).toBe('DAMAC HILLS 2');
    expect(result.financials.annualRentAed).toBe(112000);
    expect(result.financials.securityDepositAed).toBe(5600);
    expect(result.financials.modeOfPayment).toBe('3 CHEQUES');
    expect(result.additionalTerms.length).toBe(5);
    expect(result.additionalTerms[0]).toContain('Addendum is part of contract');
  });

  it('correctly classifies blank template with 0% fill score', async () => {
    const result = await henryTenancyContractScannerService.scanContract('blank');

    expect(result.isFilled).toBe(false);
    expect(result.fillScorePercent).toBe(0);
    expect(result.classification).toBe('blank_template');
    expect(result.landlord.name).toBe('');
    expect(result.tenant.name).toBe('');
    expect(result.missingFields.length).toBeGreaterThan(10);
  });

  it('converts scanned contract to DldTenancyContractData for 1-click preparation studio loading', () => {
    const dldData = henryTenancyContractScannerService.toDldTenancyContractData(SANIT_SINGH_CAMELIA_608_SAMPLE);

    expect(dldData.ownerName).toBe('SANIT SINGH NAGPAL');
    expect(dldData.tenantName).toBe('KESHIVANI MAYADEVAN');
    expect(dldData.buildingName).toBe('CAMELIA');
    expect(dldData.propertyNo).toBe('608');
    expect(dldData.annualRent).toBe(112000);
    expect(dldData.status).toBe('ready_for_signature');
  });

  it('accurately parses Svetlana Levitskaya Janusia sample with 95% completeness including DEWA', async () => {
    const result = await henryTenancyContractScannerService.scanContract('sample_svetlana');

    expect(result.isFilled).toBe(true);
    expect(result.fillScorePercent).toBe(95);
    expect(result.classification).toBe('fully_executed');
    expect(result.landlord.name).toBe('SVETLANA LEVITSKAYA');
    expect(result.tenant.name).toBe('WILLIAM MICHAEL ABERNETHY');
    expect(result.property.buildingName).toBe('Janusia');
    expect(result.property.propertyNumber).toBe('XH2858B');
    expect(result.property.plotNumber).toBe('6340');
    expect(result.property.makaniNo).toBe('257');
    expect(result.property.premisesNoDewa).toBe('918014964');
    expect(result.property.areaSqM).toBe(198.98);
    expect(result.financials.annualRentAed).toBe(120000);
    expect(result.financials.securityDepositAed).toBe(6000);
    expect(result.financials.modeOfPayment).toBe('4 CHEQUES');
    expect(result.additionalTerms[4]).toContain('MOVE-IN permit by DAMAC');
  });

  it('manages temporary session cache and dispatches listener updates', () => {
    const listener = vi.fn();
    const unsubscribe = henryTenancyContractScannerService.onContractUpdated(listener);

    henryTenancyContractScannerService.setCachedContract(SANIT_SINGH_CAMELIA_608_SAMPLE);
    expect(henryTenancyContractScannerService.getCachedContract()?.landlord.name).toBe('SANIT SINGH NAGPAL');
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ fillScorePercent: 92 }));

    henryTenancyContractScannerService.clearCachedContract();
    expect(henryTenancyContractScannerService.getCachedContract()).toBeNull();
    expect(listener).toHaveBeenCalledWith(null);

    unsubscribe();
  });

  it('supports scanDocument alias with automatic session caching', async () => {
    const data = await henryTenancyContractScannerService.scanDocument('sample');
    expect(data.landlord.name).toBe('SANIT SINGH NAGPAL');
    expect(henryTenancyContractScannerService.getCachedContract()?.property.buildingName).toBe('CAMELIA');
  });

  it('teaches Henry AI and archives reference contract into training pool', () => {
    henryTenancyContractScannerService.teachFromScannedContract(SANIT_SINGH_CAMELIA_608_SAMPLE);
    const pool = henryTenancyContractScannerService.getTrainingReferenceContracts();

    expect(pool.length).toBeGreaterThan(0);
    expect(pool.some(c => c.landlord.name === 'SVETLANA LEVITSKAYA' || c.landlord.name === 'SANIT SINGH NAGPAL')).toBe(true);
  });
});
