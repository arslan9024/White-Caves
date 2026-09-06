/**
 * documentExtractDataPassports.logic.ts
 *
 * Pure, dependency-free logic for extracting structured passport data from
 * raw OCR text produced by a document scanning pipeline. Supports parsing of
 * the ICAO 9303 TD3 (passport booklet) Machine Readable Zone (MRZ), which
 * consists of two 44-character lines, and produces a normalized, validated
 * result describing the passport holder and document metadata.
 *
 * This module performs NO I/O, NO network calls, and has NO external
 * dependencies. It is intended to be called by a higher-level service that
 * supplies raw OCR text (e.g. from an OCR provider) and consumes the
 * structured result.
 */

/** Supported sex/gender codes as encoded in the MRZ. */
export type PassportSex = 'M' | 'F' | 'X';

/** A single field-level validation issue discovered during extraction. */
export interface PassportExtractionIssue {
  readonly field: string;
  readonly message: string;
}

/** Normalized, structured passport data extracted from a document. */
export interface ExtractedPassportData {
  readonly documentType: string;
  readonly issuingCountry: string;
  readonly surname: string;
  readonly givenNames: string;
  readonly passportNumber: string;
  readonly nationality: string;
  readonly dateOfBirth: string; // ISO 8601 date (YYYY-MM-DD)
  readonly sex: PassportSex;
  readonly expiryDate: string; // ISO 8601 date (YYYY-MM-DD)
  readonly personalNumber: string | null;
}

/** Result of an extraction attempt: either success with data, or failure with issues. */
export type PassportExtractionResult =
  | {
      readonly success: true;
      readonly data: ExtractedPassportData;
      readonly issues: readonly PassportExtractionIssue[];
    }
  | {
      readonly success: false;
      readonly data: null;
      readonly issues: readonly PassportExtractionIssue[];
    };

const MRZ_LINE_LENGTH = 44;
const MRZ_CHAR_PATTERN = /^[A-Z0-9<]+$/;

const CHAR_VALUES: Readonly<Record<string, number>> = (() => {
  const values: Record<string, number> = { '<': 0 };
  for (let i = 0; i <= 9; i += 1) {
    values[String(i)] = i;
  }
  for (let i = 0; i < 26; i += 1) {
    values[String.fromCharCode(65 + i)] = i + 10;
  }
  return values;
})();

const WEIGHTS: readonly number[] = [7, 3, 1];

/**
 * Extracts the two MRZ lines from a raw OCR text blob. Lines are matched by
 * looking for consecutive lines composed only of MRZ-legal characters
 * (A-Z, 0-9, and filler '<') that are each exactly 44 characters long once
 * whitespace is stripped.
 */
export function findMrzLines(rawText: string): readonly string[] | null {
  const candidateLines = rawText
    .split(/\r?\n/)
    .map(line => line.replace(/\s+/g, '').toUpperCase())
    .filter(line => line.length > 0);

  const mrzCandidates = candidateLines.filter(
    line => line.length === MRZ_LINE_LENGTH && MRZ_CHAR_PATTERN.test(line)
  );

  if (mrzCandidates.length < 2) {
    return null;
  }

  // Use the last two matching lines, which is the common position of the MRZ
  // block at the bottom of a passport data page.
  return mrzCandidates.slice(-2);
}

/** Computes the ICAO 9303 check digit for a given MRZ field string. */
export function computeCheckDigit(field: string): number {
  let sum = 0;
  for (let i = 0; i < field.length; i += 1) {
    const char = field[i];
    const value = CHAR_VALUES[char];
    if (value === undefined) {
      throw new Error(`Invalid MRZ character encountered while computing check digit: "${char}"`);
    }
    sum += value * WEIGHTS[i % WEIGHTS.length];
  }
  return sum % 10;
}

function stripFiller(value: string): string {
  return value.replace(/</g, ' ').trim();
}

function parseNameField(nameField: string): { surname: string; givenNames: string } {
  const [surnamePart = '', ...rest] = nameField.split('<<');
  const givenPart = rest.join(' ');
  return {
    surname: stripFiller(surnamePart.replace(/</g, ' ')),
    givenNames: stripFiller(givenPart.replace(/</g, ' ')),
  };
}

function parseMrzDate(raw: string): string | null {
  if (!/^\d{6}$/.test(raw)) {
    return null;
  }
  const yy = Number(raw.slice(0, 2));
  const mm = raw.slice(2, 4);
  const dd = raw.slice(4, 6);
  const monthNum = Number(mm);
  const dayNum = Number(dd);
  if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
    return null;
  }
  // Passports commonly do not distinguish century; assume 2000s for years
  // below the current two-digit year threshold used for birth vs expiry
  // documents is out of scope here, so we apply the standard MRZ heuristic:
  // years 00-49 => 2000-2049, years 50-99 => 1950-1999. Callers needing more
  // context-aware century resolution should post-process this field.
  const century = yy <= 49 ? 2000 : 1900;
  const year = century + yy;
  return `${String(year).padStart(4, '0')}-${mm}-${dd}`;
}

function addIssue(issues: PassportExtractionIssue[], field: string, message: string): void {
  issues.push({ field, message });
}

/**
 * Parses two 44-character TD3 MRZ lines into structured, validated passport
 * data. All ICAO check digits (document number, date of birth, expiry date,
 * and composite) are verified; failures are reported as issues rather than
 * thrown, so callers can decide how to handle partially-trusted OCR data.
 */
export function parseTd3Mrz(line1: string, line2: string): PassportExtractionResult {
  const issues: PassportExtractionIssue[] = [];

  const normalizedLine1 = line1.toUpperCase();
  const normalizedLine2 = line2.toUpperCase();

  if (normalizedLine1.length !== MRZ_LINE_LENGTH) {
    addIssue(
      issues,
      'line1',
      `Line 1 must be exactly ${MRZ_LINE_LENGTH} characters, got ${normalizedLine1.length}`
    );
  }
  if (normalizedLine2.length !== MRZ_LINE_LENGTH) {
    addIssue(
      issues,
      'line2',
      `Line 2 must be exactly ${MRZ_LINE_LENGTH} characters, got ${normalizedLine2.length}`
    );
  }
  if (issues.length > 0) {
    return { success: false, data: null, issues };
  }
  if (!MRZ_CHAR_PATTERN.test(normalizedLine1)) {
    addIssue(issues, 'line1', 'Line 1 contains characters outside A-Z, 0-9, and "<"');
  }
  if (!MRZ_CHAR_PATTERN.test(normalizedLine2)) {
    addIssue(issues, 'line2', 'Line 2 contains characters outside A-Z, 0-9, and "<"');
  }
  if (issues.length > 0) {
    return { success: false, data: null, issues };
  }

  const documentTypeCode = normalizedLine1.slice(0, 2);
  const issuingCountry = stripFiller(normalizedLine1.slice(2, 5));
  const nameField = normalizedLine1.slice(5, 44);
  const { surname, givenNames } = parseNameField(nameField);

  const passportNumberRaw = normalizedLine2.slice(0, 9);
  const passportNumberCheckDigit = normalizedLine2.slice(9, 10);
  const nationality = stripFiller(normalizedLine2.slice(10, 13));
  const dobRaw = normalizedLine2.slice(13, 19);
  const dobCheckDigit = normalizedLine2.slice(19, 20);
  const sexRaw = normalizedLine2.slice(20, 21);
  const expiryRaw = normalizedLine2.slice(21, 27);
  const expiryCheckDigit = normalizedLine2.slice(27, 28);
  const personalNumberRaw = normalizedLine2.slice(28, 42);
  const personalNumberCheckDigit = normalizedLine2.slice(42, 43);
  const compositeCheckDigit = normalizedLine2.slice(43, 44);

  const passportNumber = stripFiller(passportNumberRaw).replace(/\s+/g, '');
  if (passportNumber.length === 0) {
    addIssue(issues, 'passportNumber', 'Passport number is empty');
  }

  const expectedPassportCheck = computeCheckDigit(passportNumberRaw);
  if (String(expectedPassportCheck) !== passportNumberCheckDigit) {
    addIssue(
      issues,
      'passportNumber',
      `Check digit mismatch: expected ${expectedPassportCheck}, found ${passportNumberCheckDigit}`
    );
  }

  const dateOfBirth = parseMrzDate(dobRaw);
  if (dateOfBirth === null) {
    addIssue(issues, 'dateOfBirth', `Unable to parse date of birth from raw value "${dobRaw}"`);
  } else {
    const expectedDobCheck = computeCheckDigit(dobRaw);
    if (String(expectedDobCheck) !== dobCheckDigit) {
      addIssue(
        issues,
        'dateOfBirth',
        `Check digit mismatch: expected ${expectedDobCheck}, found ${dobCheckDigit}`
      );
    }
  }

  const expiryDate = parseMrzDate(expiryRaw);
  if (expiryDate === null) {
    addIssue(issues, 'expiryDate', `Unable to parse expiry date from raw value "${expiryRaw}"`);
  } else {
    const expectedExpiryCheck = computeCheckDigit(expiryRaw);
    if (String(expectedExpiryCheck) !== expiryCheckDigit) {
      addIssue(
        issues,
        'expiryDate',
        `Check digit mismatch: expected ${expectedExpiryCheck}, found ${expiryCheckDigit}`
      );
    }
  }

  let sex: PassportSex | null = null;
  if (sexRaw === 'M' || sexRaw === 'F' || sexRaw === 'X') {
    sex = sexRaw;
  } else if (sexRaw === '<') {
    sex = 'X';
  } else {
    addIssue(issues, 'sex', `Unrecognized sex code "${sexRaw}"`);
  }

  const personalNumberStripped = stripFiller(personalNumberRaw).replace(/\s+/g, '');
  const personalNumber = personalNumberStripped.length > 0 ? personalNumberStripped : null;
  if (personalNumber !== null) {
    const expectedPersonalCheck = computeCheckDigit(personalNumberRaw);
    // Per ICAO 9303, an all-filler check digit ('<') indicates the field is
    // not used for verification, which is common in many national passports.
    if (
      personalNumberCheckDigit !== '<' &&
      String(expectedPersonalCheck) !== personalNumberCheckDigit
    ) {
      addIssue(
        issues,
        'personalNumber',
        `Check digit mismatch: expected ${expectedPersonalCheck}, found ${personalNumberCheckDigit}`
      );
    }
  }

  const compositeField =
    passportNumberRaw +
    passportNumberCheckDigit +
    dobRaw +
    dobCheckDigit +
    expiryRaw +
    expiryCheckDigit +
    personalNumberRaw +
    personalNumberCheckDigit;
  const expectedCompositeCheck = computeCheckDigit(compositeField);
  if (String(expectedCompositeCheck) !== compositeCheckDigit) {
    addIssue(
      issues,
      'composite',
      `Composite check digit mismatch: expected ${expectedCompositeCheck}, found ${compositeCheckDigit}`
    );
  }

  if (surname.length === 0) {
    addIssue(issues, 'surname', 'Surname is empty');
  }
  if (issuingCountry.length === 0) {
    addIssue(issues, 'issuingCountry', 'Issuing country is empty');
  }
  if (nationality.length === 0) {
    addIssue(issues, 'nationality', 'Nationality is empty');
  }

  if (
    dateOfBirth === null ||
    expiryDate === null ||
    sex === null ||
    issues.some(issue => issue.field === 'composite')
  ) {
    return { success: false, data: null, issues };
  }

  const data: ExtractedPassportData = {
    documentType: documentTypeCode,
    issuingCountry,
    surname,
    givenNames,
    passportNumber,
    nationality,
    dateOfBirth,
    sex,
    expiryDate,
    personalNumber,
  };

  return { success: true, data, issues };
}

/**
 * Top-level entry point: locates the MRZ within raw OCR text and parses it
 * into structured passport data. Returns a failure result with descriptive
 * issues when the MRZ cannot be located or fails validation.
 */
export function extractPassportDataFromOcrText(rawText: string): PassportExtractionResult {
  const mrzLines = findMrzLines(rawText);
  if (mrzLines === null) {
    return {
      success: false,
      data: null,
      issues: [
        {
          field: 'mrz',
          message: 'Could not locate two 44-character MRZ lines in the provided OCR text',
        },
      ],
    };
  }
  return parseTd3Mrz(mrzLines[0], mrzLines[1]);
}

/**
 * Checks whether an already-extracted passport is expired relative to a
 * reference date (defaults to now).
 */
export function isPassportExpired(
  data: ExtractedPassportData,
  referenceDate: Date = new Date()
): boolean {
  const expiry = new Date(`${data.expiryDate}T00:00:00.000Z`);
  return expiry.getTime() < referenceDate.getTime();
}
