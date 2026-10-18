import { describe, expect, it } from 'vitest';
import engine from './HenryPdfEngineService';
import { DEMO_EJARI_RECORD, DEMO_TENANCY_PAYLOAD, DEMO_TENANT_TAX_RECEIPT } from '../components/crm/HenryDocumentStudio/data/HenryDocumentStudio.data';

describe('Henry preparation preview claims', () => {
  it('preserves contract fields without synthetic live signing or witness verification', () => {
    const html = engine.generateTenancyContractHtml({ ...DEMO_TENANCY_PAYLOAD, esignToken: 'ignored-demo-token' });
    expect(html).toContain(DEMO_TENANCY_PAYLOAD.contractNumber);
    expect(html).toContain('PREPARATION PREVIEW');
    expect(html).not.toMatch(/whitecaves\.ae\/sign|E-SIGN ACTIVE|LINK READY|Witness: \[VERIFIED\]/);
    expect(html).toContain('SIGNATURES NOT VERIFIED');
  });
  it('labels printed Ejari layouts as synthetic, never government registration or archival', () => {
    const html = engine.generateGovernmentEjariArchiveHtml(DEMO_EJARI_RECORD);
    expect(DEMO_EJARI_RECORD.ejariNumber).toBe('DEMO-NOT-A-REGISTERED-EJARI');
    expect(html).toContain('NOT A GOVERNMENT RECORD');
    expect(html).toContain('Not archived');
    expect(html).toContain('NOT AN EJARI CERTIFICATE');
    expect(html).not.toMatch(/0120260721003974|OFFICIAL GOVERNMENT RECORD|permanently archived|\[DLD REST QR\]/);
  });
  it('retains invoice amounts without payment or tax-approval assurance', async () => {
    const html = await engine.generateTaxReceiptHtml(DEMO_TENANT_TAX_RECEIPT);
    expect(html).toContain('AED 5,250');
    expect(html).toContain('PAYMENT NOT VERIFIED');
    expect(html).toContain('TAX COMPLIANCE NOT VERIFIED');
    expect(html).not.toMatch(/STATUS: PAID \/ CLEARED|FTA UAE COMPLIANT/);
  });
});
