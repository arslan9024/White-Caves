/**
 * [Category 4: Processing Engine]
 * Machine Readable Zone (MRZ) Algorithmic Parser
 * Supports:
 *   - TD1: 3 lines of 30 characters (Emirates ID / National ID back)
 *   - TD3: 2 lines of 44 characters (Passports)
 * Converts 2-digit YYMMDD dates to ISO YYYY-MM-DD with century heuristics.
 */

export interface MrzParsedData {
  documentType: 'TD1' | 'TD3';
  issuingState: string;
  documentNumber: string;
  nationalIdNumber?: string;
  birthDate: string;
  sex: string;
  expiryDate: string;
  nationality: string;
  lastName: string;
  firstName: string;
  fullName: string;
  confidence: number;
}

export function formatMrzDate(yymmdd: string | null | undefined, isExpiry = false): string {
  if (!yymmdd || String(yymmdd).length < 6) return '';
  const s = String(yymmdd);
  const yy = parseInt(s.substring(0, 2), 10);
  const mm = s.substring(2, 4);
  const dd = s.substring(4, 6);

  const currentYear = new Date().getFullYear();
  const currentYY = currentYear % 100;

  let fullYear: number;
  if (isExpiry) {
    fullYear = 2000 + yy;
  } else {
    fullYear = yy > currentYY + 5 ? 1900 + yy : 2000 + yy;
  }

  return `${fullYear}-${mm}-${dd}`;
}

export function extractMrzLines(rawLines: string[]): { type: 'TD1' | 'TD3'; lines: string[] } | null {
  if (!Array.isArray(rawLines)) return null;

  const candidateLines = rawLines
    .map((l) =>
      String(l || '')
        .replace(/\s+/g, '')
        .toUpperCase(),
    )
    .filter((l) => l.includes('<') && l.length >= 26);

  // Check for 3-line TD1 MRZ (ID cards: ~30 characters)
  if (candidateLines.length >= 3) {
    const last3 = candidateLines.slice(-3);
    if (last3.every((l) => l.length >= 27 && l.length <= 32)) {
      return {
        type: 'TD1',
        lines: last3.map((l) => l.padEnd(30, '<').substring(0, 30)),
      };
    }
  }

  // Check for 2-line TD3 MRZ (Passports: ~44 characters)
  if (candidateLines.length >= 2) {
    const last2 = candidateLines.slice(-2);
    if (last2.every((l) => l.length >= 40 && l.length <= 46)) {
      return {
        type: 'TD3',
        lines: last2.map((l) => l.padEnd(44, '<').substring(0, 44)),
      };
    }
  }

  return null;
}

export function cleanMrzField(text: string): string {
  if (!text) return '';
  return text.replace(/<+/g, ' ').trim();
}

export function parseMrzPayload(rawLines: string[]): MrzParsedData | null {
  const mrz = extractMrzLines(rawLines);
  if (!mrz) return null;

  if (mrz.type === 'TD1') {
    const [line1, line2, line3] = mrz.lines;
    const issuingCountry = cleanMrzField(line1.substring(2, 5));
    const docNumber = cleanMrzField(line1.substring(5, 14));
    const optData = cleanMrzField(line1.substring(15, 30));

    const dob = formatMrzDate(line2.substring(0, 6), false);
    const sex = line2.substring(7, 8).replace('<', 'X');
    const expiry = formatMrzDate(line2.substring(8, 14), true);
    const nationality = cleanMrzField(line2.substring(15, 18));

    const nameParts = line3.split('<<');
    const lastName = cleanMrzField(nameParts[0] || '');
    const firstName = cleanMrzField(nameParts.slice(1).join(' ') || '');
    const fullName = `${firstName} ${lastName}`.trim();

    return {
      documentType: 'TD1',
      issuingState: issuingCountry,
      documentNumber: docNumber,
      nationalIdNumber: optData,
      birthDate: dob,
      sex,
      expiryDate: expiry,
      nationality,
      lastName,
      firstName,
      fullName,
      confidence: 0.95,
    };
  }

  if (mrz.type === 'TD3') {
    const [line1, line2] = mrz.lines;
    const issuingCountry = cleanMrzField(line1.substring(2, 5));
    const nameSection = line1.substring(5);
    const nameParts = nameSection.split('<<');
    const lastName = cleanMrzField(nameParts[0] || '');
    const firstName = cleanMrzField(nameParts.slice(1).join(' ') || '');
    const fullName = `${firstName} ${lastName}`.trim();

    const docNumber = cleanMrzField(line2.substring(0, 9));
    const nationality = cleanMrzField(line2.substring(10, 13));
    const dob = formatMrzDate(line2.substring(13, 19), false);
    const sex = line2.substring(20, 21).replace('<', 'X');
    const expiry = formatMrzDate(line2.substring(21, 27), true);

    return {
      documentType: 'TD3',
      issuingState: issuingCountry,
      documentNumber: docNumber,
      birthDate: dob,
      sex,
      expiryDate: expiry,
      nationality,
      lastName,
      firstName,
      fullName,
      confidence: 0.95,
    };
  }

  return null;
}

