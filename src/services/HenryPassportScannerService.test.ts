import { afterEach, describe, it, expect, vi } from 'vitest';
import passport, { ARSLAN_MALIK_SAMPLE_PASSPORT } from './HenryPassportScannerService';
import extractor from './HenryEmiratesIdScannerService';
import { canUseScan } from './henryScanReview';
import { markFieldReviewed } from './henryDocumentParsing';

const text = `Full Name: TEST TRAVELER
Passport Number: T12345678
Country Code: UTO
Date of Birth: 02/03/1990
Expiry Date: 04/05/2035`;
const reviewed = () => ({ ...passport.parsePassportText(text), reviewConfirmed: true });
afterEach(() => { vi.restoreAllMocks(); passport.clearCachedPassport(); });

describe('Henry passport source extraction', () => {
  it.each(['application/pdf', 'image/jpeg', 'image/png'])('reads uploaded %s, never filenames', async type => {
    const read = vi.spyOn(extractor, 'extractDocumentText').mockResolvedValue({ ocrText: text, streamText: '' });
    const file = new File(['synthetic OCR input'], 'arslan-malik.pdf', { type });
    const result = await passport.scanPassport(file);
    expect(read).toHaveBeenCalledWith(file, undefined, expect.any(Function));
    expect(result).toMatchObject({ fullName: 'TEST TRAVELER', passportNumber: 'T12345678', demoOnly: false, reviewConfirmed: false, gender: '' });
    expect(result.fatherName).toBe('');
    expect(result.bookletNumber).toBe('');
    expect(passport.getCachedPassport()).toBeNull();
    expect(canUseScan(result)).toBe(false);
    expect(canUseScan({ ...result, reviewConfirmed: true })).toBe(true);
  });

  it('parses bilingual Arabic labels and digits', () => {
    const result = passport.parsePassportText('الاسم الكامل: مسافر تجريبي\nرقم جواز السفر: T12345678\nبلد الإصدار: دولة تجريبية\nتاريخ الميلاد: ٠٢/٠٣/١٩٩٠\nتاريخ الانتهاء: ٠٤/٠٥/٢٠٣٥');
    expect(result.fullName).toBe('مسافر تجريبي');
    expect(result.dateOfBirth).toBe('02/03/1990');
    expect(canUseScan({ ...result, reviewConfirmed: true })).toBe(true);
  });
  it('reads printed four-digit dates with English or Arabic month names, never two-digit years', () => {
    expect(passport.parsePassportText('Date of Birth: 12 AUG / AOUT 1974').dateOfBirth).toBe('12/08/1974');
    expect(passport.parsePassportText('تاريخ الميلاد: ١٢ أغسطس ١٩٧٤').dateOfBirth).toBe('12/08/1974');
    expect(passport.parsePassportText('Date of Birth: 12 AUG 74').dateOfBirth).toBe('');
  });

  it('validates TD3 length, every check digit, composite and does not infer centuries', () => {
    const line1 = 'P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<';
    const line2 = 'L898902C36UTO7408122F1204159ZE184226B<<<<<10';
    const parsed = passport.parseTD3Mrz(line1, line2);
    expect(parsed).toMatchObject({ fullName: 'ANNA MARIA ERIKSSON', passportNumber: 'L898902C3', gender: 'F' });
    expect(parsed.dateOfBirth).toBeUndefined();
    expect(parsed.dateOfExpiry).toBeUndefined();
    const sexless = `${line2.slice(0, 20)}<${line2.slice(21, 43)}`;
    const composite = sexless.slice(0, 10) + sexless.slice(13, 20) + sexless.slice(21, 43);
    const digit = composite.split('').reduce((sum, char, index) =>
      sum + (char === '<' ? 0 : parseInt(char, 36)) * [7, 3, 1][index % 3]!, 0) % 10;
    expect(passport.parseTD3Mrz(line1, sexless + digit).gender).toBe('');
    expect(passport.parseTD3Mrz(line1.slice(1), line2)).toEqual({});
    for (const position of [9, 19, 27, 42, 43]) {
      const damaged = line2.slice(0, position) + (line2[position] === '0' ? '1' : '0') + line2.slice(position + 1);
      expect(passport.parseTD3Mrz(line1, damaged)).toEqual({});
    }
    const result = passport.parsePassportText(`${line1}\n${line2}`);
    expect(result.dateOfBirth).toBe('');
    expect(canUseScan({ ...result, reviewConfirmed: true })).toBe(false);
    const conflict = passport.parsePassportText(`Passport Number: T12345678\nDate of Birth: 12/08/1975\n${line1}\n${line2}`);
    expect(conflict.diagnostics?.fields.passportNumber.state).toBe('conflict');
    expect(conflict.diagnostics?.fields.dateOfBirth.state).toBe('conflict');
  });

  it('keeps competing source readings blocked until specifically corrected', () => {
    const result = passport.parsePassportText(`${text}\nPassport Number: X98765432`);
    expect(result.diagnostics?.fields.passportNumber.state).toBe('conflict');
    expect(canUseScan({ ...result, reviewConfirmed: true })).toBe(false);
    result.diagnostics = markFieldReviewed(result.diagnostics, 'passportNumber', result.passportNumber);
    expect(canUseScan({ ...result, reviewConfirmed: true })).toBe(true);
  });

  it('collects checksum-valid MRZ name conflicts from native and OCR sources', async () => {
    const line1 = 'P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<';
    const line2 = 'L898902C36UTO7408122F1204159ZE184226B<<<<<10';
    const otherName = line1.replace('ERIKSSON', 'ANDERSON');
    const visible = 'Date of Birth: 12/08/1974\nExpiry Date: 15/04/2012';
    vi.spyOn(extractor, 'extractDocumentText').mockResolvedValue({
      ocrText: `${visible}\n${line1}\n${line2}`, streamText: `${otherName}\n${line2}`,
    });
    const result = await passport.scanPassport(new File(['synthetic'], 'passport.pdf', { type: 'application/pdf' }));
    expect(passport.parseTD3Mrz(otherName, line2).passportNumber).toBe('L898902C3');
    expect(result.diagnostics?.fields.fullName).toMatchObject({
      state: 'conflict', values: ['ANNA MARIA ERIKSSON', 'ANNA MARIA ANDERSON'],
    });
    expect(result.diagnostics?.fields.surname.state).toBe('conflict');
    expect(canUseScan({ ...result, reviewConfirmed: true, expiryAcknowledgedFor: result.dateOfExpiry })).toBe(false);
    expect(passport.getCachedPassport()).toBeNull();
    const repeated = passport.parsePassportText(`${visible}\n${line1}\n${line2}\n${line1}\n${line2}`);
    expect(repeated.diagnostics?.fields.fullName.state).toBe('extracted');
  });

  it('does not let an invalid first MRZ hide a later valid candidate', () => {
    const line1 = 'P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<';
    const line2 = 'L898902C36UTO7408122F1204159ZE184226B<<<<<10';
    const result = passport.parsePassportText(`${line1}\n${line2.slice(0, -1)}1\n${line1}\n${line2}`);
    expect(result.passportNumber).toBe('L898902C3');
    expect(result.diagnostics?.warnings).toContain('TD3 MRZ failed format or check digits; review visible fields.');
  });

  it('retains every valid MRZ identity and short-date disagreement without inferring centuries', () => {
    const line1 = 'P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<';
    const line2 = 'L898902C36UTO7408122F1204159ZE184226B<<<<<10';
    const check = (value: string) => String(value.split('').reduce((sum, char, index) =>
      sum + (char === '<' ? 0 : parseInt(char, 36)) * [7, 3, 1][index % 3]!, 0) % 10);
    const number = 'X898902C3';
    const birth = '750812';
    const expiry = '130415';
    const changed = number + check(number) + 'UTO' + birth + check(birth) + 'F' +
      expiry + check(expiry) + line2.slice(28, 43);
    const other = changed + check(changed.slice(0, 10) + changed.slice(13, 20) + changed.slice(21, 43));
    expect(passport.parseTD3Mrz(line1, other).passportNumber).toBe(number);
    const result = passport.parsePassportText(`${line1}\n${line2}\n${line1}\n${other}`);
    expect(result.dateOfBirth).toBe('');
    expect(result.dateOfExpiry).toBe('');
    for (const key of ['passportNumber', 'dateOfBirth', 'dateOfExpiry']) {
      expect(result.diagnostics?.fields[key].state).toBe('conflict');
      expect(result.diagnostics?.fields[key].values).toHaveLength(2);
    }
    const labelled = passport.parsePassportText(`Passport Number: FIRST\nPassport Number: SECOND\n${line1}\n${line2}\n${line1}\n${other}`);
    expect(labelled.diagnostics?.fields.passportNumber.values).toEqual(['FIRST', 'SECOND', 'L898902C3', number]);
  });

  it('fails OCR honestly and never falls back to a fixture', async () => {
    vi.spyOn(extractor, 'extractDocumentText').mockRejectedValue(new Error('unreadable'));
    await expect(passport.scanPassport(new File(['bad'], 'malik.png', { type: 'image/png' }))).rejects.toThrow('unreadable');
    expect(passport.getCachedPassport()).toBeNull();
    expect(canUseScan({ ...passport.parsePassportText('unrelated text'), reviewConfirmed: true })).toBe(false);
  });

  it('isolates reviewed cache and rejects demos even with forged confirmation', async () => {
    const listener = vi.fn();
    const unsubscribe = passport.onPassportUpdated(listener);
    const data = reviewed();
    passport.setCachedPassport(data);
    data.fullName = 'MUTATED';
    expect(passport.getCachedPassport()?.fullName).toBe('TEST TRAVELER');
    const copy = passport.getCachedPassport()!;
    copy.fullName = 'OTHER MUTATION';
    expect(passport.getCachedPassport()?.fullName).toBe('TEST TRAVELER');
    expect(listener).toHaveBeenCalled();
    passport.clearCachedPassport();
    const demo = { ...ARSLAN_MALIK_SAMPLE_PASSPORT, reviewConfirmed: true };
    passport.setCachedPassport(demo);
    expect(passport.getCachedPassport()).toBeNull();
    expect(() => passport.toContractParty(demo)).toThrow('review');
    expect((await passport.saveToDatabase(demo)).success).toBe(false);
    unsubscribe();
  });

  it('maps reviewed source fields without invented phone or email', () => {
    expect(passport.toContractParty(reviewed())).toMatchObject({ name: 'TEST TRAVELER', phone: '', email: '' });
    expect(passport.toViewingClientPayload(reviewed()).clientName).toBe('TEST TRAVELER');
  });

  it('requires acknowledgment for the exact expired passport date and rejects impossible dates', () => {
    const expired = { ...reviewed(), dateOfExpiry: '01/01/2020' };
    expect(canUseScan(expired)).toBe(false);
    expect(canUseScan({ ...expired, expiryAcknowledgedFor: expired.dateOfExpiry })).toBe(true);
    expect(canUseScan({ ...reviewed(), dateOfBirth: '31/02/1990' })).toBe(false);
  });
});
