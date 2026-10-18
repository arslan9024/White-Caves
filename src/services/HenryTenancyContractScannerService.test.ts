import { afterEach, describe, expect, it, vi } from 'vitest';
import contract, { SANIT_SINGH_CAMELIA_608_SAMPLE, SVETLANA_JANUSIA_XH2858B_SAMPLE, BLANK_DLD_TEMPLATE_SAMPLE } from './HenryTenancyContractScannerService';
import extractor from './HenryEmiratesIdScannerService';
import { canUseScan } from './henryScanReview';

const text = `Contract Reference: SYNTHETIC-42
Landlord Name: TEST LESSOR
Tenant Name: TEST OCCUPANT
Building Name: TEST BUILDING
Unit Number: 42
Start Date: 01/01/2027
End Date: 31/12/2027
Annual Rent AED: 60,000
Security Deposit: 3,000
Mode of Payment: 4 CHEQUES`;
const reviewed = () => ({ ...contract.parseContractText(text), reviewConfirmed: true });
afterEach(() => { vi.restoreAllMocks(); contract.clearCachedContract(); });

describe('Henry tenancy source extraction', () => {
  it.each(['application/pdf', 'image/jpeg', 'image/png'])('extracts actual uploaded %s through bounded shared OCR', async type => {
    const read = vi.spyOn(extractor, 'extractDocumentText').mockResolvedValue({ ocrText: text, streamText: '' });
    const file = new File(['synthetic source'], 'sanit-svetlana.pdf', { type });
    const data = await contract.scanContract(file);
    expect(read).toHaveBeenCalledWith(file, undefined, expect.any(Function));
    expect(data).toMatchObject({ demoOnly: false, reviewConfirmed: false, contractReference: 'SYNTHETIC-42',
      landlord: { name: 'TEST LESSOR', phone: '' }, tenant: { name: 'TEST OCCUPANT' },
      property: { buildingName: 'TEST BUILDING', propertyNumber: '42', usage: '' },
      financials: { annualRentAed: 60000, securityDepositAed: 3000, modeOfPayment: '4 CHEQUES', contractValueAed: undefined },
      signatures: { hasTenantSigned: false, hasLessorSigned: false } });
    expect(data.classification).not.toBe('fully_executed');
    expect(data.diagnostics?.fields['financials.annualRentAed'].values).toEqual(['60,000']);
    expect(canUseScan(data)).toBe(false);
    expect(contract.getCachedContract()).toBeNull();
    expect(canUseScan({ ...data, reviewConfirmed: true })).toBe(true);
  });

  it('supports Arabic labels, Arabic digits and visible cheque count', () => {
    const data = contract.parseContractText(`اسم المؤجر: مؤجر تجريبي
اسم المستأجر: مستأجر تجريبي
اسم المبنى: مبنى الاختبار
رقم الوحدة: ٤٢
تاريخ البداية: ٠١/٠١/٢٠٢٧
تاريخ النهاية: ٣١/١٢/٢٠٢٧
الإيجار السنوي: ٦٠٠٠٠
عدد الشيكات: ٤`);
    expect(data.property.propertyNumber).toBe('42');
    expect(data.financials.modeOfPayment).toBe('4 CHEQUES');
    expect(canUseScan({ ...data, reviewConfirmed: true })).toBe(true);
  });

  it('never populates missing parties, rent, property or signatures from sample data', () => {
    const data = contract.parseContractText('Contract Number: TEST-BLANK');
    expect(data.landlord.name).toBe('');
    expect(data.financials.annualRentAed).toBe(0);
    expect(canUseScan({ ...data, reviewConfirmed: true })).toBe(false);
    expect(contract.toDldTenancyContractData(data, true).contractDate).toBe('');
  });

  it.each(['Additional Terms', 'الشروط الإضافية'])('retains the entire %s section without consuming the next known field', heading => {
    const terms = '1. Keep the premises clean.\n   Continue this clause on another line.\n2. Security Deposit remains refundable.\n3. لا يجوز التأجير من الباطن.';
    const data = contract.parseContractText(`${text}\n${heading}:\n${terms}\nContract Date: 18/10/2026\nTenant Email: synthetic@example.test`);
    expect(data.additionalTerms).toEqual([terms.replace(/ {3}/g, ' ')]);
    expect(data.contractDate).toBe('18/10/2026');
    expect(data.tenant.email).toBe('synthetic@example.test');
    expect(data.financials.securityDepositAed).toBe(3000);
    expect(data.diagnostics?.fields['financials.securityDepositAed'].state).not.toBe('conflict');
    const range = data.diagnostics!.fields.additionalTerms!.textRanges![0]!;
    expect(data.diagnostics!.sourceText!.slice(range.start, range.end)).toBe(data.additionalTerms[0]);
    expect(contract.toDldTenancyContractData(data, true).additionalTerms).toEqual(data.additionalTerms);
  });

  it.each(['Contract Date 18/10/2026', 'Contract Date\n18/10/2026'])('stops multiline terms at colon-free known field: %s', nextField => {
    const data = contract.parseContractText(`${text}\nAdditional Terms:\n1. First clause.\n2. Last clause.\n${nextField}`);
    expect(data.additionalTerms).toEqual(['1. First clause.\n2. Last clause.']);
    expect(data.contractDate).toBe('18/10/2026');
  });

  it('rejects impossible dates, reversed periods, zero rent and conflicting source fields', () => {
    for (const financials of [
      { ...reviewed().financials, periodTo: '31/02/2027' },
      { ...reviewed().financials, periodTo: '01/01/2026' },
      { ...reviewed().financials, annualRentAed: 0 },
    ]) expect(canUseScan({ ...reviewed(), financials })).toBe(false);
    const data = contract.parseContractText(`${text}\nAnnual Rent AED: 70,000`);
    expect(data.diagnostics?.fields['financials.annualRentAed'].state).toBe('conflict');
    expect(canUseScan({ ...data, reviewConfirmed: true })).toBe(false);
    const cheques = contract.parseContractText(`${text}\nNumber of Cheques: 3`);
    expect(cheques.diagnostics?.fields['financials.modeOfPayment'].state).toBe('conflict');
    expect(canUseScan({ ...cheques, reviewConfirmed: true })).toBe(false);
    const negative = contract.parseContractText(text.replace('60,000', '-60,000'));
    expect(negative.financials.annualRentAed).toBe(0);
    expect(canUseScan({ ...negative, reviewConfirmed: true })).toBe(false);
  });

  it('maps and caches only reviewed non-demo contracts, with detached nested data', () => {
    const data = reviewed();
    contract.setCachedContract(data);
    data.landlord.name = 'MUTATION';
    expect(contract.getCachedContract()?.landlord.name).toBe('TEST LESSOR');
    expect(contract.toDldTenancyContractData(reviewed())).toMatchObject({
      ownerName: 'TEST LESSOR', tenantName: 'TEST OCCUPANT', annualRent: 60000, contractId: 'SYNTHETIC-42',
    });
  });

  it('every sample remains demo-only even with confirmation forced on', async () => {
    contract.clearCachedContract();
    for (const sample of [SANIT_SINGH_CAMELIA_608_SAMPLE, SVETLANA_JANUSIA_XH2858B_SAMPLE, BLANK_DLD_TEMPLATE_SAMPLE]) {
      const demo = { ...sample, reviewConfirmed: true };
      expect(canUseScan(demo)).toBe(false);
      expect(() => contract.toDldTenancyContractData(demo)).toThrow('review');
      expect((await contract.saveToDatabase(demo)).success).toBe(false);
      contract.setCachedContract(demo);
      expect(contract.getCachedContract()).toBeNull();
    }
    expect((await contract.scanContract('blank')).demoOnly).toBe(true);
  });

  it('does not invent an archive reference when none is visible', async () => {
    const data = { ...reviewed(), contractReference: '' };
    expect(contract.toDldTenancyContractData(data).contractId).toBe('');
    expect(await contract.saveToDatabase(data)).toMatchObject({ success: false });
  });
});
