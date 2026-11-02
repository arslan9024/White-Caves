/**
 * parser.logic.ts — MRZ & OCR Layout Entity Extraction Logic
 */

import { parse as parseMrz } from 'mrz';
import logger from '../../utils/logger';
import { validScanDate } from '../henryScanReview';
import {
  languageValue,
  normalizeDocumentDate,
  normalizeDocumentText,
  readDocumentFields,
  refreshCoverage,
} from '../henryDocumentParsing';
import { EmiratesIdExtractedData, ID_LABELS, NATIONALITY_REGISTRY } from './types';

export function detectDocumentSide(textOrFileName: string): 'front' | 'back' | 'both' {
  const lower = (textOrFileName || '').toLowerCase();
  const hasMrz =
    /ilare|p<are|[0-9]{7}[a-z][0-9]{7}/i.test(lower) ||
    lower.includes('mrz') ||
    lower.includes('back');
  const hasFront =
    /784-\d{4}-\d{7}-\d|resident identity|united arab emirates|identity card|front/i.test(lower);
  if (hasMrz && hasFront) return 'both';
  if (hasMrz) return 'back';
  if (hasFront) return 'front';
  return 'both';
}

export function formatEmiratesId(rawNumber: string): string {
  const cleaned = (rawNumber || '').replace(/\D/g, '');
  if (cleaned.length === 15) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 14)}-${cleaned.slice(14)}`;
  }
  return rawNumber;
}

export function resolveNationality(input: string): { en: string; ar: string; code: string } {
  if (!input) return { en: '', ar: '', code: '' };
  const cleaned = input.toUpperCase().replace(/[^A-Z]/g, '');

  for (const [key, val] of Object.entries(NATIONALITY_REGISTRY)) {
    if (cleaned === key) {
      return val;
    }
  }
  return { en: input.trim(), ar: '', code: '' };
}

export function parseTD1Mrz(
  line1: string,
  line2: string,
  line3: string
): Partial<EmiratesIdExtractedData> {
  const l1 = (line1 || '').trim().toUpperCase().replace(/\s+/g, '');
  const l2 = (line2 || '').trim().toUpperCase().replace(/\s+/g, '');
  const l3 = (line3 || '').trim().toUpperCase().replace(/\s+/g, '');

  try {
    const parsed = parseMrz([l1, l2, l3]);
    if (parsed && parsed.valid && parsed.fields) {
      const docNumber = parsed.fields.documentNumber || l1.slice(5, 14).replace(/</g, '');
      const rawId = l1.slice(15, 30).replace(/</g, '') || parsed.fields.optional1 || '';
      const idNumber = /^784\d{12}$/.test(rawId) ? formatEmiratesId(rawId) : '';
      const nat = resolveNationality(parsed.fields.nationality || '');

      return {
        idNumber: idNumber || '',
        rawIdNumber: idNumber ? rawId : '',
        cardNumber: docNumber,
        // TD1 dates have no century. Only a matching visible four-digit date resolves them.
        dateOfBirth: '',
        gender: parsed.fields.sex === 'female' ? 'F' : parsed.fields.sex === 'male' ? 'M' : '',
        expiryDate: '',
        nationalityEn: nat.en,
        nationalityAr: nat.ar,
        nationalityCode: nat.code,
        firstName: parsed.fields.firstName || '',
        lastName: parsed.fields.lastName || '',
        fullNameEn: `${parsed.fields.firstName || ''} ${parsed.fields.lastName || ''}`.trim() || '',
        mrz: { line1: l1, line2: l2, line3: l3 },
      };
    }
  } catch {
    logger.warn('Henry MRZ rejected: invalid format or check digits');
  }

  return {};
}

export function parseOcrText(rawText: string, fileName: string): Partial<EmiratesIdExtractedData> {
  void fileName;
  const text = normalizeDocumentText(rawText);
  const { values, diagnostics } = readDocumentFields(text, ID_LABELS);
  const field = (key: string) => values[key]?.[0] || '';
  const en = (key: string) => languageValue(values[key] || [], 'en');
  const ar = (key: string) => languageValue(values[key] || [], 'ar');
  const visibleIds = [...text.matchAll(/(?<!\d)784[ -]?\d{4}[ -]?\d{7}[ -]?\d(?!\d)/g)].map(match =>
    formatEmiratesId(match[0])
  );
  values.idNumber = [...new Set(visibleIds)];
  diagnostics.fields.idNumber!.values = values.idNumber;
  diagnostics.fields.idNumber!.state = visibleIds.length ? 'extracted' : 'missing';
  const nationality = resolveNationality(en('nationality'));
  const sex = `${field('gender')}`.trim();
  const result: Partial<EmiratesIdExtractedData> = {
    idNumber: values.idNumber[0] || '',
    rawIdNumber: (values.idNumber[0] || '').replace(/\D/g, ''),
    cardNumber: field('cardNumber'),
    chipNumber: field('chipNumber'),
    fullNameEn: en('fullName'),
    fullNameAr: ar('fullName'),
    dateOfBirth: normalizeDocumentDate(field('dateOfBirth')),
    issueDate: normalizeDocumentDate(field('issueDate')),
    expiryDate: normalizeDocumentDate(field('expiryDate')),
    nationalityEn: en('nationality'),
    nationalityAr: ar('nationality'),
    nationalityCode: nationality.code,
    gender: /^(?:M|male|ذكر)(?:\s|$)/i.test(sex)
      ? 'M'
      : /^(?:F|female|أنثى|انثى)(?:\s|$)/i.test(sex)
        ? 'F'
        : '',
    occupationEn: en('occupation'),
    occupationAr: ar('occupation'),
    employerEn: en('employer'),
    employerAr: ar('employer'),
    issuingPlaceEn: en('issuingPlace'),
    issuingPlaceAr: ar('issuingPlace'),
    diagnostics,
  };
  const lines = text
    .toUpperCase()
    .split('\n')
    .map(line => line.replace(/\s/g, ''));
  const mrzSources = lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => /^(?:IL|ID)ARE[A-Z0-9<]+$/.test(line))
    .map(({ index }) => ({
      index,
      fields: parseTD1Mrz(lines[index]!, lines[index + 1] || '', lines[index + 2] || ''),
    }));
  const mrzSource = mrzSources.find(source => source.fields.mrz) || mrzSources[0];
  const start = mrzSource?.index ?? -1;
  if (start >= 0) {
    const mrz = mrzSource!.fields;
    if (!mrz.mrz)
      diagnostics.warnings.push(
        'MRZ check digits or format invalid; no identity inferred from MRZ.'
      );
    else {
      result.mrz = mrz.mrz;
      result.firstName = mrz.firstName;
      result.lastName = mrz.lastName;
      for (const key of [
        'idNumber',
        'cardNumber',
        'fullNameEn',
        'gender',
        'nationalityCode',
      ] as const) {
        const evidenceKey =
          key === 'fullNameEn' ? 'fullName' : key === 'nationalityCode' ? 'nationality' : key;
        const candidate = mrz[key];
        if (!candidate) continue;
        if (
          result[key] &&
          result[key]!.toUpperCase().replace(/\s+/g, ' ') !==
            candidate.toUpperCase().replace(/\s+/g, ' ')
        ) {
          diagnostics.fields[evidenceKey]!.state = 'conflict';
          diagnostics.fields[evidenceKey]!.values.push(candidate);
          if (evidenceKey !== key) {
            const reviewKey = key === 'nationalityCode' ? 'nationalityEn' : key;
            diagnostics.fields[evidenceKey]!.conflicts = {
              ...diagnostics.fields[evidenceKey]!.conflicts,
              [reviewKey]: [result[key]!, candidate],
            };
          }
          diagnostics.warnings.push(`Visible ${key} conflicts with validated MRZ.`);
        } else if (!result[key]) {
          Object.assign(result, { [key]: candidate });
          diagnostics.fields[evidenceKey] = {
            state: 'extracted',
            source: 'mrz',
            values: [candidate],
          };
        }
      }
      for (const key of [
        'idNumber',
        'cardNumber',
        'fullNameEn',
        'nationalityCode',
        'gender',
      ] as const) {
        const candidates = [
          ...new Set(
            [
              result[key],
              ...mrzSources.filter(source => source.fields.mrz).map(source => source.fields[key]),
            ].filter((value): value is string => !!value)
          ),
        ];
        if (
          new Set(candidates.map(value => value.trim().replace(/\s+/g, ' ').toUpperCase())).size > 1
        ) {
          const evidenceKey =
            key === 'fullNameEn' ? 'fullName' : key === 'nationalityCode' ? 'nationality' : key;
          const reviewKey = key === 'nationalityCode' ? 'nationalityEn' : key;
          const evidence = diagnostics.fields[evidenceKey]!;
          evidence.state = 'conflict';
          evidence.values = [...new Set([...evidence.values, ...candidates])];
          evidence.conflicts = { ...evidence.conflicts, [reviewKey]: candidates };
          diagnostics.warnings.push(
            `Independent MRZ candidates disagree on ${key}; compare the source.`
          );
        }
      }
      for (const [key, offset] of [
        ['dateOfBirth', 0],
        ['expiryDate', 8],
      ] as const) {
        const shortDates = [
          ...new Set(
            mrzSources
              .filter(source => source.fields.mrz)
              .map(source => lines[source.index + 1]!.slice(offset, offset + 6))
          ),
        ];
        const visibleDates = (values[key] || []).map(normalizeDocumentDate).filter(validScanDate);
        if (!visibleDates.length)
          diagnostics.warnings.push(
            `${key}: MRZ century ambiguous; enter the visible four-digit date.`
          );
        if (
          shortDates.length > 1 ||
          visibleDates.some(date =>
            shortDates.some(
              shortDate =>
                `${date.slice(8, 10)}${date.slice(3, 5)}${date.slice(0, 2)}` !== shortDate
            )
          )
        ) {
          diagnostics.fields[key]!.state = 'conflict';
          diagnostics.fields[key]!.values = [
            ...new Set([...diagnostics.fields[key]!.values, ...shortDates]),
          ];
          diagnostics.warnings.push(
            `${key}: validated MRZ dates disagree with each other or visible dates; compare the source without inferring a century.`
          );
        }
      }
    }
  }
  for (const key of [
    'idNumber',
    'cardNumber',
    'chipNumber',
    'dateOfBirth',
    'issueDate',
    'expiryDate',
  ]) {
    const candidates = values[key]?.map(value => {
      const date = normalizeDocumentDate(value);
      return key.endsWith('Date') || key === 'dateOfBirth'
        ? validScanDate(date)
          ? date
          : value
        : value;
    });
    if (new Set(candidates).size > 1) {
      diagnostics.fields[key]!.state = 'conflict';
      diagnostics.warnings.push(`Conflicting ${key}; review sources.`);
    }
    for (const key of ['fullName', 'nationality'] as const) {
      const conflicts: Record<string, string[]> = {};
      for (const language of ['en', 'ar'] as const) {
        const candidates = [
          ...new Set(
            (values[key] || []).map(value => languageValue([value], language)).filter(Boolean)
          ),
        ];
        if (new Set(candidates.map(value => value.toUpperCase())).size > 1)
          conflicts[`${key}${language === 'en' ? 'En' : 'Ar'}`] = candidates;
      }
      if (Object.keys(conflicts).length) {
        diagnostics.fields[key]!.state = 'conflict';
        const existing = diagnostics.fields[key]!.conflicts || {};
        diagnostics.fields[key]!.conflicts = Object.fromEntries(
          [...new Set([...Object.keys(existing), ...Object.keys(conflicts)])].map(reviewKey => [
            reviewKey,
            [...new Set([...(existing[reviewKey] || []), ...(conflicts[reviewKey] || [])])],
          ])
        );
        diagnostics.warnings.push(`Conflicting ${key}; review independent OCR/source candidates.`);
      }
    }
  }
  for (const key of ['dateOfBirth', 'issueDate', 'expiryDate'] as const) {
    if (!validScanDate(result[key] || '')) {
      result[key] = '';
      if (diagnostics.fields[key]!.state !== 'conflict') diagnostics.fields[key]!.state = 'missing';
    }
  }
  for (const key of ['cardNumber', 'chipNumber'] as const) {
    if (result[key] && !/^\d{8,16}$/.test(result[key]!)) {
      result[key] = '';
      diagnostics.fields[key]!.state = 'missing';
      diagnostics.warnings.push(`${key}: unreadable numeric identifier; compare the original.`);
    }
  }
  if (!result.gender && diagnostics.fields.gender!.state !== 'conflict')
    diagnostics.fields.gender!.state = 'missing';
  refreshCoverage(diagnostics);
  return result;
}
