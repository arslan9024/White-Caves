import { describe, expect, it, vi } from 'vitest';
import {
  languageValue,
  markFieldReviewed,
  normalizeDocumentText,
  parseDocumentNumber,
  readDocumentFields,
} from './henryDocumentParsing';
import eid, { EMPTY_EMIRATES_ID } from './HenryEmiratesIdScannerService';
import deed from './HenryTitleDeedScannerService';
import { canUseScan } from './henryScanReview';

describe('Henry synthetic document extraction', () => {
  it('locates duplicate values under the actual label rather than the first unrelated occurrence', () => {
    const { diagnostics } = readDocumentFields('Unrelated TEST\nName: TEST\nName: TEST\nArea: ١٢٣', {
      name: ['Name'], area: ['Area'],
    });
    const ranges = diagnostics.fields.name!.textRanges!;
    expect(ranges).toHaveLength(2);
    expect(ranges[0]!.start).toBeGreaterThan(diagnostics.sourceText!.indexOf('TEST'));
    for (const range of ranges) expect(diagnostics.sourceText!.slice(range.start, range.end)).toBe('TEST');
    const area = diagnostics.fields.area!.textRanges![0]!;
    expect(diagnostics.sourceText!.slice(area.start, area.end)).toBe('123');
    expect(markFieldReviewed(diagnostics, 'name', 'EDITED')!.fields.name!.textRanges).toBeUndefined();
  });
  it('bounds retained source text and omits locators beyond the retained portion', () => {
    const { diagnostics } = readDocumentFields(`${'x'.repeat(65536)}\nName: TEST`, { name: ['Name'] });
    expect(diagnostics.sourceText).toHaveLength(65536);
    expect(diagnostics.fields.name!.values).toEqual(['TEST']);
    expect(diagnostics.fields.name!.textRanges).toBeUndefined();
  });
  it('rebases dual-side source ranges into the combined normalized text', async () => {
    const front = eid.parseOcrText('ID Number: 784-2001-0000001-1\nName: TEST PERSON', '');
    const back = eid.parseOcrText('ID Number: 784-2001-0000001-1\nEmployer: TEST COMPANY', '');
    const scan = vi.spyOn(eid, 'scanEmiratesId').mockResolvedValueOnce(front).mockResolvedValueOnce(back);
    try {
      const merged = await eid.scanDualSide(new File(['a'], 'front.png'), new File(['b'], 'back.png'));
      const diagnostics = merged.diagnostics!;
      const range = diagnostics.fields.employer!.textRanges![0]!;
      expect(diagnostics.sourceText!.slice(range.start, range.end)).toBe('TEST COMPANY');
      expect(range.start).toBeGreaterThan(front.diagnostics!.sourceText!.length);
      expect(diagnostics.fields.idNumber!.textRanges).toHaveLength(2);
    } finally { scan.mockRestore(); }
  });
  it.each([
    ['١٬٢٣٤٫٥٦', 1234.56],
    ['۱۲۳۴٫۵۶', 1234.56],
    ['1,234.56 sqm', 1234.56],
    ['38,76 m2', 38.76],
    ['0 sqm', 0],
    ['', undefined],
    ['12,34,5', undefined],
  ])('normalizes numeric value %s without inventing missing zero', (raw, expected) => {
    expect(parseDocumentNumber(raw)).toBe(expected);
  });

  it('preserves lines and stops bilingual neighbouring columns', () => {
    const { values } = readDocumentFields(
      'Name / الاسم： TEST PERSON شخص تجريبي   Nationality:\nTESTLAND\nEmployer:\n',
      {
        fullName: ['Name', 'الاسم'],
        nationality: ['Nationality'],
        employer: ['Employer'],
      }
    );
    expect(languageValue(values.fullName!, 'en')).toBe('TEST PERSON');
    expect(languageValue(values.fullName!, 'ar')).toBe('شخص تجريبي');
    expect(values.nationality).toEqual(['TESTLAND']);
    expect(values.employer).toEqual([]);
    expect(normalizeDocumentText('۱–٢\r\n X')).toBe('1-2\n X');
  });

  const variants = {
    labelled: (text: string) => text,
    unicode: (text: string) =>
      text.replace(/:/g, '：').replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]!),
    columns: (text: string) => text.replace(/: /g, ' | ').replace(/\n/g, '\r\n'),
  };
  it.each(Object.entries(variants))(
    'extracts every visible ID field: synthetic %s corpus',
    (_, transform) => {
      const fixture = `رقم الهوية: ٧٨٤-٢٠٠١-٠٠٠٠٠٠١-١
Card Number: 100000001 Chip Number: 200000001
Name / الاسم: TEST PERSON شخص تجريبي
Date of Birth / تاريخ الميلاد: 03.02.2001
Issue Date: 2025-01-04
Expiry Date / تاريخ الانتهاء: 04/01/2030
Nationality: Testland الجنسية: دولة تجريبية
Gender / الجنس: F أنثى
Occupation: Test Engineer المهنة: مهندس
Employer: SYNTHETIC COMPANY L.L.C جهة العمل: شركة تجريبية
Issuing Place: Dubai مكان الإصدار: دبي`;
      const data = eid.parseOcrText(transform(fixture), 'ignored.pdf');
      expect(data).toMatchObject({
        idNumber: '784-2001-0000001-1',
        cardNumber: '100000001',
        chipNumber: '200000001',
        fullNameEn: 'TEST PERSON',
        fullNameAr: 'شخص تجريبي',
        dateOfBirth: '03/02/2001',
        issueDate: '04/01/2025',
        expiryDate: '04/01/2030',
        nationalityEn: 'Testland',
        nationalityAr: 'دولة تجريبية',
        nationalityCode: '',
        gender: 'F',
        occupationEn: 'Test Engineer',
        occupationAr: 'مهندس',
        employerEn: 'SYNTHETIC COMPANY L.L.C',
        employerAr: 'شركة تجريبية',
        issuingPlaceEn: 'Dubai',
        issuingPlaceAr: 'دبي',
      });
      expect(data.diagnostics?.coverage).toBe(1);
      // Deterministic corpus benchmark: all 12 supported labelled categories, no conflicts.
      expect(
        Object.values(data.diagnostics!.fields).filter(field => field.state === 'extracted')
      ).toHaveLength(12);
      expect(
        Object.values(data.diagnostics!.fields).filter(field => field.state === 'conflict')
      ).toHaveLength(0);
    }
  );

  it.each(Object.entries(variants))(
    'extracts all visible deed fields: synthetic %s corpus',
    (_, transform) => {
      const fixture = `Title Deed Number / رقم الشهادة
900001/2030
Issue Date: 01/02/2030
Issuing Authority: Dubai Land Department جهة الإصدار: دائرة الأراضي
Property Type: Apartment نوع العقار: شقة
Community: Test District المنطقة: منطقة تجريبية
Plot Number: 100 Municipality Number: 200-300
Building Number: 4 Building Name: TEST TOWER اسم المبنى: برج تجريبي
Unit Number: 501 Floor Number: 5 Parking Number: P1-10
Mortgage Status: Not mortgaged حالة الرهن: غير مرهونة
Suite Area: ١٬٢٠٠٫٥٠ sqm Balcony Area: 0 sqm Total Area: 1,200.50 sqm
Total Area SqFt: 12922.07 Common Area: 12.5 sqm
Owner DLD Number: 900001
Owner Name: TEST OWNER اسم المالك: مالك تجريبي
Ownership Share: 100% Owned Area: 1200.50 sqm
Purchased From: TEST SELLER اسم البائع: بائع تجريبي
Registration Contract Number: 800001/2030 Registration Date: 01/02/2030
Purchase Price: 1,234,567.89 AED
Amount in Words: One million synthetic dirhams`;
      const data = deed.parseDocumentText(transform(fixture));
      expect(data).toMatchObject({
        certificateNumber: '900001/2030',
        issueDate: '01/02/2030',
        issuingAuthorityEn: 'Dubai Land Department',
        issuingAuthorityAr: 'دائرة الأراضي',
        propertyTypeEn: 'Apartment',
        propertyTypeAr: 'شقة',
        communityEn: 'Test District',
        communityAr: 'منطقة تجريبية',
        plotNumber: '100',
        municipalityNumber: '200-300',
        buildingNumber: '4',
        buildingNameEn: 'TEST TOWER',
        buildingNameAr: 'برج تجريبي',
        propertyNumber: '501',
        floorNumber: '5',
        parkingNumber: 'P1-10',
        mortgageStatusEn: 'Not mortgaged',
        mortgageStatusAr: 'غير مرهونة',
        mortgageState: 'not_mortgaged',
        isMortgaged: false,
        suiteAreaSqM: 1200.5,
        balconyAreaSqM: 0,
        totalAreaSqM: 1200.5,
        totalAreaSqFt: 12922.07,
        commonAreaSqM: 12.5,
        ownerDldNumber: '900001',
        ownerNameEn: 'TEST OWNER',
        ownerNameAr: 'مالك تجريبي',
        ownerSharePercent: 100,
        ownedAreaSqM: 1200.5,
        purchasedFromEn: 'TEST SELLER',
        purchasedFromAr: 'بائع تجريبي',
        registrationContractNumber: '800001/2030',
        registrationDate: '01/02/2030',
        purchasePriceAed: 1234567.89,
        purchasePriceWordsEn: 'One million synthetic dirhams',
      });
      expect(data.diagnostics?.fields.balconyAreaSqM?.state).toBe('extracted');
      expect(data.confidenceScore).toBe(0);
      expect(
        Object.values(data.diagnostics!.fields).filter(field => field.state === 'conflict')
      ).toHaveLength(0);
      expect(data.missingFields).toEqual([]);
    }
  );

  it('distinguishes empty values, visible zero, unknown mortgage and derived area', () => {
    const empty = deed.parseDocumentText('');
    expect(empty.totalAreaSqM).toBe(0);
    expect(empty.diagnostics?.coverage).toBe(0);
    expect(empty.mortgageState).toBe('unknown');
    const data = deed.parseDocumentText('Total Area: 100 sq ft\nBalcony Area: 0');
    expect(data.totalAreaSqM).toBe(9.29);
    expect(data.totalAreaSqFt).toBe(100);
    expect(data.diagnostics?.fields.totalAreaSqM?.state).toBe('derived');
    expect(data.diagnostics?.fields.balconyAreaSqM?.state).toBe('extracted');
  });

  it('preserves multiple owners and blocks selecting the first as sole owner', () => {
    const data = deed.parseDocumentText(`Certificate Number: 900001/2030
Unit Number: 100
Owner Number: 100001 Owner Name: TEST ALPHA Ownership Share: 50% Owned Area: 20
Owner Number: 100002 Owner Name: TEST BETA Ownership Share: 50% Owned Area: 20`);
    expect(data.owners).toEqual([
      { dldNumber: '100001', nameEn: 'TEST ALPHA', nameAr: '', sharePercent: 50, ownedAreaSqM: 20 },
      { dldNumber: '100002', nameEn: 'TEST BETA', nameAr: '', sharePercent: 50, ownedAreaSqM: 20 },
    ]);
    expect(data.ownerNameEn).toBe('');
    expect(canUseScan({ ...data, reviewConfirmed: true, missingFields: [] })).toBe(false);
  });

  it('reads ownership information rows without concatenating distinct owners', () => {
    const data = deed.parseDocumentText(`Certificate Number: 900002/2030
Unit Number: 100
Ownership Information
Owner Number | Owner Name | Ownership Share | Owned Area
100001 | TEST ALPHA مالك أول | 25% | 10
100002 | TEST BETA مالك ثان | 75% | 30`);
    expect(data.owners).toHaveLength(2);
    expect(data.owners?.[1]).toMatchObject({
      dldNumber: '100002',
      nameEn: 'TEST BETA',
      nameAr: 'مالك ثان',
      sharePercent: 75,
      ownedAreaSqM: 30,
    });
    expect(data.ownerNameEn).toBe('');
  });

  it('does not substitute default nationality translations or infer names from unrelated numbers', () => {
    const data = eid.parseOcrText(
      'Card Number:\nNationality:\nOccupation:\n100000001\nName:\nExpiry Date:',
      ''
    );
    expect(data.fullNameEn).toBe('');
    expect(data.cardNumber).toBe('');
    expect(data.nationalityAr).toBe('');
  });

  it('rejects invalid MRZ without discarding separately visible identity or guessing sex', () => {
    const data = eid.parseOcrText(
      'Name: TEST PERSON\nILARE1000000010784200100000011\n0102030<3001040XXX<<<<<<<<<<<0\nPERSON<<TEST<<<<<<<<<<<<<<<<<<',
      ''
    );
    expect(data.fullNameEn).toBe('TEST PERSON');
    expect(data.gender).toBe('');
    expect(data.mrz).toBeUndefined();
    expect(data.diagnostics?.warnings.join(' ')).toContain('MRZ');
  });

  it('retains validated synthetic MRZ while requiring century review and keeping unspecified sex empty', () => {
    const data = eid.parseOcrText(
      'ILARE1000000018784200100000011\n0102030<3001042XXX<<<<<<<<<<<4\nPERSON<<TEST<<<<<<<<<<<<<<<<<<',
      ''
    );
    expect(data).toMatchObject({
      idNumber: '784-2001-0000001-1',
      cardNumber: '100000001',
      fullNameEn: 'TEST PERSON',
      firstName: 'TEST',
      lastName: 'PERSON',
      gender: '',
      dateOfBirth: '',
      expiryDate: '',
    });
    expect(data.mrz).toBeDefined();
    expect(
      data.diagnostics?.warnings.filter(warning => warning.includes('century ambiguous'))
    ).toHaveLength(2);
  });
  it('blocks inconsistent separately validated MRZ identities rather than selecting the first', () => {
    const first = 'ILARE1000000018784200100000011';
    const second = 'ILARE1000000029784200100000022';
    const line = '0102030<3001042XXX<<<<<<<<<<<4';
    const check = (text: string) =>
      String(
        [...text].reduce(
          (sum, char, index) =>
            sum +
            (char === '<' ? 0 : /\d/.test(char) ? Number(char) : char.charCodeAt(0) - 55) *
              [7, 3, 1][index % 3]!,
          0
        ) % 10
      );
    const composite = check(
      second.slice(5, 30) + line.slice(0, 7) + line.slice(8, 15) + line.slice(18, 29)
    );
    const secondLine = line.slice(0, 29) + composite;
    expect(eid.parseTD1Mrz(second, secondLine, 'PERSON<<TEST<<<<<<<<<<<<<<<<<<').mrz).toBeDefined();
    const parsed = eid.parseOcrText(
      `${first}\n${line}\nPERSON<<TEST<<<<<<<<<<<<<<<<<<\n${second}\n${secondLine}\nPERSON<<TEST<<<<<<<<<<<<<<<<<<`,
      ''
    );
    expect(parsed.diagnostics?.fields.idNumber?.state).toBe('conflict');
    expect(parsed.diagnostics?.fields.cardNumber?.state).toBe('conflict');
  });

  it('compares visible full dates to MRZ rather than silently overriding them', () => {
    const data = eid.parseOcrText(
      'Date of Birth: 03/02/2001\nExpiry Date: 05/01/2030\nILARE1000000018784200100000011\n0102030<3001042XXX<<<<<<<<<<<4\nPERSON<<TEST<<<<<<<<<<<<<<<<<<',
      ''
    );
    expect(data.dateOfBirth).toBe('03/02/2001');
    expect(data.expiryDate).toBe('05/01/2030');
    expect(data.diagnostics?.fields.expiryDate?.state).toBe('conflict');
  });

  const mrzCheck = (text: string) =>
    String(
      [...text].reduce(
        (sum, char, index) =>
          sum +
          (char === '<' ? 0 : /\d/.test(char) ? Number(char) : char.charCodeAt(0) - 55) *
            [7, 3, 1][index % 3]!,
        0
      ) % 10
    );
  const validMrz = (birth: string, expiry: string, name = 'PERSON<<TEST<<<<<<<<<<<<<<<<<<') => {
    const first = 'ILARE1000000018784200100000011';
    const second = `${birth}${mrzCheck(birth)}<${expiry}${mrzCheck(expiry)}XXX<<<<<<<<<<<`;
    const composite = mrzCheck(
      first.slice(5, 30) + second.slice(0, 7) + second.slice(8, 15) + second.slice(18, 29)
    );
    const lines = [first, second + composite, name];
    expect(eid.parseTD1Mrz(lines[0]!, lines[1]!, lines[2]!).mrz).toBeDefined();
    return lines.join('\n');
  };

  it.each([true, false])(
    'checks every validated MRZ short date without century inference (visible=%s)',
    visible => {
      const text = `${visible ? 'Date of Birth: 03/02/2001\nExpiry Date: 04/01/2030\n' : ''}${validMrz('010203', '300104')}
${validMrz('020203', '310104')}`;
      const parsed = eid.parseOcrText(text, '');
      for (const key of ['dateOfBirth', 'expiryDate']) {
        expect(parsed.diagnostics?.fields[key]?.state).toBe('conflict');
        expect(parsed.diagnostics?.fields[key]?.values).toHaveLength(visible ? 3 : 2);
      }
      if (!visible) {
        expect(parsed.dateOfBirth).toBe('');
        expect(parsed.expiryDate).toBe('');
      }
      expect(canUseScan({ ...parsed, reviewConfirmed: true, missingFields: [] })).toBe(false);
    }
  );

  it('retains English MRZ disagreement when Arabic candidates also conflict and are reviewed', () => {
    const parsed = eid.parseOcrText(
      `Name: TEST PERSON
الاسم: شخص أول
الاسم: شخص ثان
${validMrz('010203', '300104')}
${validMrz('010203', '300104', 'OTHER<<TEST<<<<<<<<<<<<<<<<<<<')}`,
      ''
    );
    expect(parsed.diagnostics?.fields.fullName?.conflicts).toMatchObject({
      fullNameEn: ['TEST PERSON', 'TEST OTHER'],
      fullNameAr: ['شخص أول', 'شخص ثان'],
    });
    const edited = markFieldReviewed(parsed.diagnostics, 'fullNameAr', 'شخص أول')!;
    expect(edited.fields.fullName?.conflicts?.fullNameEn).toEqual(['TEST PERSON', 'TEST OTHER']);
    expect(edited.fields.fullName?.state).toBe('conflict');
    expect(
      canUseScan({ ...parsed, diagnostics: edited, reviewConfirmed: true, missingFields: [] })
    ).toBe(false);
    expect(markFieldReviewed(edited, 'fullNameEn', 'TEST PERSON')?.fields.fullName?.state).toBe(
      'extracted'
    );
  });

  it('accepts matching validated MRZ short dates without resolving their centuries', () => {
    const parsed = eid.parseOcrText(
      `Date of Birth: 03/02/2001
Expiry Date: 04/01/2030
${validMrz('010203', '300104')}
${validMrz('010203', '300104', 'PERSON<<TEST<SECOND<<<<<<<<<<<')}`,
      ''
    );
    expect(parsed.diagnostics?.fields.dateOfBirth?.state).toBe('extracted');
    expect(parsed.diagnostics?.fields.expiryDate?.state).toBe('extracted');
  });

  const deedIdentity =
    'Certificate Number: 900001/2030\nUnit Number: 100\nOwner Number: 100001\nOwner Name: TEST OWNER\n';
  it.each([
    ['Purchase Price: 1,000 AED\nقيمة الشراء: 2000', 'purchasePriceAed'],
    ['Mortgage Status: Not mortgaged\nحالة الرهن: مرهونة', 'mortgageStatus'],
    ['Issue Date: 01/02/2030\nتاريخ الإصدار: 02/02/2030', 'issueDate'],
    ['Registration Date: 01/02/2030\nتاريخ التسجيل: 02/02/2030', 'registrationDate'],
    ['Suite Area: 20 sqm\nمساحة الوحدة: 30 sqm', 'suiteAreaSqM'],
    ['Balcony Area: 0 sqm\nمساحة الشرفة: 1 sqm', 'balconyAreaSqM'],
    ['Common Area: 20 sqm\nالمساحة المشتركة: 30 sqm', 'commonAreaSqM'],
    ['Total Area: 20 sqm\nالمساحة الإجمالية: 30 sqm', 'totalAreaSqM'],
    ['Total Area SqFt: 200\nArea SqFt: 300', 'totalAreaSqFt'],
    ['Total Area: 20 sqm\nTotal Area: 300 sq ft', 'totalAreaSqM'],
    ['Total Area: 20 sqm\nTotal Area SqFt: 300', 'totalAreaSqFt'],
    ['Ownership Share: 100%\nالحصة: 50%', 'ownerSharePercent'],
    ['Owned Area: 20 sqm\nالمساحة المملوكة: 30 sqm', 'ownedAreaSqM'],
  ])('blocks conflicting normalized deed evidence: %s', (text, key) => {
    const parsed = deed.parseDocumentText(deedIdentity + text);
    expect(parsed.diagnostics?.fields[key]?.state).toBe('conflict');
    expect(canUseScan({ ...parsed, reviewConfirmed: true, missingFields: [] })).toBe(false);
    expect(() =>
      deed.toCrmPropertyListing({ ...parsed, reviewConfirmed: true, missingFields: [] })
    ).toThrow('Confirm review');
  });

  it.each([
    'Purchase Price: 1,000.50 AED\nقيمة الشراء: ١٬٠٠٠٫٥٠',
    'Mortgage Status: Not mortgaged\nحالة الرهن: غير مرهونة',
    'Mortgage Status: Mortgaged\nحالة الرهن: مرهونة',
    'Issue Date: 01/02/2030\nتاريخ الإصدار: 2030-02-01',
    'Registration Date: 01/02/2030\nتاريخ التسجيل: 2030-02-01',
    'Suite Area: 20.00 sqm\nمساحة الوحدة: ٢٠',
    'Suite Area: 20 sqm\nمساحة الوحدة: 215.28 sq ft',
    'Balcony Area: 0 sqm\nمساحة الشرفة: ٠',
    'Common Area: 20.00 sqm\nالمساحة المشتركة: ٢٠',
    'Total Area: 20 sqm\nTotal Area: 215.28 sq ft',
    'Total Area: 20 sqm\nTotal Area SqFt: 215.28',
    'Total Area SqFt: 215.28\nArea SqFt: 20 sqm',
    'Ownership Share: 100%\nالحصة: ١٠٠',
    'Owned Area: 20 sqm\nالمساحة المملوكة: 215.28 sq ft',
  ])('accepts equivalent normalized deed aliases: %s', text => {
    const parsed = deed.parseDocumentText(deedIdentity + text);
    expect(
      Object.values(parsed.diagnostics!.fields).filter(field => field.state === 'conflict')
    ).toEqual([]);
    expect(canUseScan({ ...parsed, reviewConfirmed: true })).toBe(true);
  });

  it('limits converted total-area equivalence to printed rounding, not percentage differences', () => {
    const equivalent = deed.parseDocumentText(
      deedIdentity + 'Total Area: 20 sqm\nTotal Area SqFt: 215.38'
    );
    expect(equivalent.diagnostics?.fields.totalAreaSqM?.state).toBe('extracted');
    const different = deed.parseDocumentText(
      deedIdentity + 'Total Area: 20 sqm\nTotal Area SqFt: 215.50'
    );
    expect(different.diagnostics?.fields.totalAreaSqM?.state).toBe('conflict');
    expect(canUseScan({ ...different, reviewConfirmed: true })).toBe(false);
  });

  it('normalizes repeated owner metrics per owner rather than comparing distinct owners', () => {
    const parsed = deed.parseDocumentText(`Certificate Number: 900001/2030
Unit Number: 100
Owner Number: 100001 Owner Name: TEST ALPHA Ownership Share: 25% Owned Area: 20 sqm
Owner Number: 100001 Owner Name: TEST ALPHA الحصة: ٢٥ المساحة المملوكة: 215.28 sq ft
Owner Number: 100002 Owner Name: TEST BETA Ownership Share: 75% Owned Area: 60 sqm`);
    expect(parsed.owners).toHaveLength(2);
    expect(parsed.diagnostics?.fields.ownedAreaSqM?.state).not.toBe('conflict');
    expect(parsed.diagnostics?.fields.ownerSharePercent?.state).not.toBe('conflict');
    expect(parsed.diagnostics?.fields.ownerName?.state).toBe('conflict');
  });

  it('detects repeated conflicting IDs and dates and rejects invalid calendar dates', () => {
    const data = eid.parseOcrText(
      'ID Number: 784-2001-0000001-1\nID Number: 784-2001-0000002-2\nExpiry Date: 31/02/2030\nExpiry Date: 01/03/2030',
      ''
    );
    expect(data.diagnostics?.fields.idNumber?.state).toBe('conflict');
    expect(data.expiryDate).toBe('');
    expect(canUseScan({ ...data, reviewConfirmed: true, missingFields: [] })).toBe(false);
  });

  it('rejects mismatched card numbers even if IDs match', async () => {
    const spy = vi
      .spyOn(eid, 'scanEmiratesId')
      .mockResolvedValueOnce({ ...EMPTY_EMIRATES_ID, cardNumber: '100000001' })
      .mockResolvedValueOnce({ ...EMPTY_EMIRATES_ID, cardNumber: '100000002' });
    try {
      await expect(
        eid.scanDualSide(new File(['a'], 'front.png'), new File(['b'], 'back.png'))
      ).rejects.toThrow('card numbers differ');
    } finally {
      spy.mockRestore();
    }
  });

  it('isolates reviewed cache and subscriber mutation', () => {
    const data = {
      ...EMPTY_EMIRATES_ID,
      idNumber: '784-2001-0000001-1',
      fullNameEn: 'TEST PERSON',
      expiryDate: '01/01/2030',
      missingFields: [],
      reviewConfirmed: true,
    };
    const unsubscribe = eid.onEmiratesIdUpdated(value => {
      if (value) value.idNumber = 'changed';
    });
    eid.setCachedEmiratesId(data);
    data.idNumber = 'changed';
    const cached = eid.getCachedEmiratesId()!;
    cached.idNumber = 'changed';
    expect(eid.getCachedEmiratesId()?.idNumber).toBe('784-2001-0000001-1');
    unsubscribe();
    eid.clearCachedEmiratesId();
  });

  it('recognizes separated PDF columns without mistaking name words for labels', () => {
    const schema = { fullName: ['Name'], nationality: ['Nationality'], employer: ['Employer'] };
    expect(
      readDocumentFields('Name | TEST PERSON | Nationality | India', schema).values
    ).toMatchObject({ fullName: ['TEST PERSON'], nationality: ['India'] });
    expect(
      readDocumentFields('Name: TEST NATIONALITY PERSON\nEmployer: TEST COMPANY', schema).values
        .fullName
    ).toEqual(['TEST NATIONALITY PERSON']);
  });

  it('uses every canonical owner number alias, including Arabic party numbers', () => {
    const data = deed.parseDocumentText(`رقم الطرف: 100001 اسم المالك: مالك أول الحصة: 50
رقم الطرف: 100002 اسم المالك: مالك ثان الحصة: 50`);
    expect(data.owners?.map(owner => owner.dldNumber)).toEqual(['100001', '100002']);
    expect(data.ownerNameAr).toBe('');
    expect(data.diagnostics?.fields.ownerName?.state).toBe('conflict');
  });

  it('fails closed for ambiguous names associated with one owner number', () => {
    const data = deed.parseDocumentText(
      'Owner Number: 100001\nOwner Name: TEST ALPHA\nOwner Name: TEST BETA'
    );
    expect(data.owners).toEqual([]);
    expect(data.ownerDldNumber).toBe('');
    expect(data.ownerSharePercent).toBe(0);
    expect(data.ownedAreaSqM).toBe(0);
    expect(data.ownerNameEn).toBe('');
    expect(data.diagnostics?.fields.ownerName?.state).toBe('conflict');
  });

  it('preserves conflicting ownership rows with the same party number', () => {
    const data = deed.parseDocumentText(`Owner Number | Owner Name | Ownership Share
100001 | TEST ALPHA | 50
100001 | TEST BETA | 50`);
    expect(data.owners).toHaveLength(2);
    expect(data.diagnostics?.fields.ownerName?.state).toBe('conflict');
  });

  it.each(['dateOfBirth', 'issueDate', 'expiryDate'] as const)(
    'compares valid %s dates in normalized form',
    key => {
      const label = {
        dateOfBirth: 'Date of Birth',
        issueDate: 'Issue Date',
        expiryDate: 'Expiry Date',
      }[key];
      const data = eid.parseOcrText(`${label}: 04/01/2030\n${label}: 2030-01-04`, '');
      expect(data.diagnostics?.fields[key]?.state).toBe('extracted');
      expect(data.diagnostics?.fields[key]?.values).toHaveLength(2);
      expect(
        eid.parseOcrText(`${label}: 04/01/2030\n${label}: 2030-01-05`, '').diagnostics?.fields[key]
          ?.state
      ).toBe('conflict');
    }
  );

  it('unions back-side MRZ conflicts even when selected names and nationalities agree', async () => {
    const back = eid.parseOcrText(
      `Name: DIFFERENT PERSON
Nationality: India
ILARE1000000018784200100000011
0102030<3001042XXX<<<<<<<<<<<4
PERSON<<TEST<<<<<<<<<<<<<<<<<<`,
      ''
    );
    back.diagnostics!.fields.nationality = {
      state: 'conflict',
      source: 'text',
      values: ['India', 'TESTLAND'],
    };
    const spy = vi
      .spyOn(eid, 'scanEmiratesId')
      .mockResolvedValueOnce({
        ...EMPTY_EMIRATES_ID,
        fullNameEn: 'DIFFERENT PERSON',
        nationalityEn: 'India',
        diagnostics: readDocumentFields('Name: DIFFERENT PERSON\nNationality: India', {
          fullName: ['Name'],
          nationality: ['Nationality'],
        }).diagnostics,
      })
      .mockResolvedValueOnce({ ...EMPTY_EMIRATES_ID, ...back });
    try {
      const merged = await eid.scanDualSide(
        new File(['a'], 'front.png'),
        new File(['b'], 'back.png')
      );
      expect(merged.diagnostics?.fields.fullName?.state).toBe('conflict');
      expect(merged.diagnostics?.fields.fullName?.values).toContain('TEST PERSON');
      expect(merged.diagnostics?.fields.nationality?.state).toBe('conflict');
      expect(merged.diagnostics?.fields.nationality?.values).toContain('TESTLAND');
      const evidence = merged.diagnostics!;
      const arabicEdit = markFieldReviewed(evidence, 'fullNameAr', 'شخص تجريبي')!;
      expect(arabicEdit.fields.fullName?.state).toBe('conflict');
      expect(
        markFieldReviewed(arabicEdit, 'fullNameEn', 'TEST PERSON')?.fields.fullName?.state
      ).toBe('extracted');
    } finally {
      spy.mockRestore();
    }
  });

  it('does not invent conflicts for equivalent front/back dates', async () => {
    const front = {
      ...EMPTY_EMIRATES_ID,
      expiryDate: '04/01/2030',
      diagnostics: readDocumentFields('Expiry Date: 04/01/2030', { expiryDate: ['Expiry Date'] })
        .diagnostics,
    };
    const back = {
      ...EMPTY_EMIRATES_ID,
      expiryDate: '04/01/2030',
      diagnostics: readDocumentFields('Expiry Date: 2030-01-04', { expiryDate: ['Expiry Date'] })
        .diagnostics,
    };
    const spy = vi
      .spyOn(eid, 'scanEmiratesId')
      .mockResolvedValueOnce(front)
      .mockResolvedValueOnce(back);
    try {
      expect(
        (await eid.scanDualSide(new File(['a'], 'front.png'), new File(['b'], 'back.png')))
          .diagnostics?.fields.expiryDate?.state
      ).toBe('extracted');
    } finally {
      spy.mockRestore();
    }
  });

  it('tracks both front/back language mismatches so one edit cannot resolve both', async () => {
    const diagnostics = readDocumentFields('Name: TEST ALPHA أول', {
      fullName: ['Name'],
    }).diagnostics;
    const spy = vi
      .spyOn(eid, 'scanEmiratesId')
      .mockResolvedValueOnce({
        ...EMPTY_EMIRATES_ID,
        fullNameEn: 'TEST ALPHA',
        fullNameAr: 'أول',
        diagnostics,
      })
      .mockResolvedValueOnce({
        ...EMPTY_EMIRATES_ID,
        fullNameEn: 'TEST BETA',
        fullNameAr: 'ثان',
        diagnostics,
      });
    try {
      const merged = await eid.scanDualSide(
        new File(['a'], 'front.png'),
        new File(['b'], 'back.png')
      );
      const arabic = markFieldReviewed(merged.diagnostics, 'fullNameAr', 'أول')!;
      expect(arabic.fields.fullName?.conflicts).toEqual({
        fullNameEn: ['TEST ALPHA', 'TEST BETA'],
      });
      expect(arabic.fields.fullName?.state).toBe('conflict');
      expect(markFieldReviewed(arabic, 'fullNameEn', 'TEST ALPHA')?.fields.fullName?.state).toBe(
        'extracted'
      );
    } finally {
      spy.mockRestore();
    }
  });

  it.each(['fullName', 'nationality', 'occupation', 'employer', 'issuingPlace', 'ownerName'])(
    'resolves %s language conflicts independently',
    field => {
      const diagnostics = {
        fields: {
          [field]: {
            state: 'conflict' as const,
            source: 'text' as const,
            values: ['TEST ALPHA أول', 'TEST BETA ثان'],
          },
        },
        coverage: 0,
        warnings: [],
      };
      const reviewed = markFieldReviewed(diagnostics, `${field}Ar`, 'أول')!;
      expect(reviewed.fields[field]?.state).toBe('conflict');
      expect(markFieldReviewed(reviewed, `${field}En`, 'TEST ALPHA')?.fields[field]?.state).toBe(
        'extracted'
      );
      expect(diagnostics.fields[field]?.state).toBe('conflict');
    }
  );

  it('lets direct editable fields resolve their own conflicts only', () => {
    const diagnostics = {
      fields: {
        expiryDate: {
          state: 'conflict' as const,
          source: 'text' as const,
          values: ['04/01/2030', '05/01/2030'],
        },
        gender: { state: 'conflict' as const, source: 'text' as const, values: ['M', 'F'] },
      },
      coverage: 0,
      warnings: [],
    };
    const reviewed = markFieldReviewed(diagnostics, 'expiryDate', '04/01/2030')!;
    expect(reviewed.fields.expiryDate?.state).toBe('extracted');
    expect(reviewed.fields.gender?.state).toBe('conflict');
  });
});
