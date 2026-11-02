/**
 * merger.logic.ts — Dual-Side Card Merging & External Payload Mappings
 */

import { ContractParty, ViewingFormPayload } from '../HenryPdfEngineService';
import { canUseScan, scanExpiry, validScanDate } from '../henryScanReview';
import { normalizeDocumentDate, refreshCoverage } from '../henryDocumentParsing';
import { EmiratesIdExtractedData } from './types';

export function mergeDualSideResults(
  frontResult: EmiratesIdExtractedData,
  backResult: EmiratesIdExtractedData,
  frontFile: File,
  backFile: File
): EmiratesIdExtractedData {
  if (frontResult.idNumber && backResult.idNumber && frontResult.idNumber !== backResult.idNumber)
    throw new Error('Front/back ID numbers differ. Rescan the same card.');
  if (
    frontResult.cardNumber &&
    backResult.cardNumber &&
    frontResult.cardNumber !== backResult.cardNumber
  )
    throw new Error('Front/back card numbers differ. Rescan the same card.');

  const mergedFields = { ...(frontResult.diagnostics?.fields || {}) };
  for (const [key, evidence] of Object.entries(backResult.diagnostics?.fields || {})) {
    const front = mergedFields[key];
    if (front?.state === 'conflict' || evidence.state === 'conflict') {
      mergedFields[key] = {
        state: 'conflict',
        source: 'text',
        values: [...new Set([...(front?.values || []), ...evidence.values])],
        ...(front?.conflicts || evidence.conflicts
          ? { conflicts: { ...front?.conflicts, ...evidence.conflicts } }
          : {}),
      };
    } else if (front?.state === 'missing' || !front) mergedFields[key] = evidence;
    else if (
      key !== 'fullName' &&
      key !== 'nationality' &&
      evidence.state !== 'missing' &&
      JSON.stringify(front.values) !== JSON.stringify(evidence.values)
    ) {
      const normalize = (value: string) => {
        const date = normalizeDocumentDate(value);
        return (key.endsWith('Date') || key === 'dateOfBirth') && validScanDate(date)
          ? date
          : value;
      };
      if (new Set([...front.values, ...evidence.values].map(normalize)).size > 1)
        mergedFields[key] = {
          state: 'conflict',
          source: 'text',
          values: [...front.values, ...evidence.values],
        };
    }
  }

  for (const key of ['fullNameEn', 'fullNameAr', 'nationalityEn', 'nationalityAr'] as const) {
    const front = frontResult[key].trim().toUpperCase();
    const back = backResult[key].trim().toUpperCase();
    if (front && back && front !== back) {
      const field = key.startsWith('fullName') ? 'fullName' : 'nationality';
      const existing = mergedFields[field];
      mergedFields[field] = {
        state: 'conflict',
        source: 'text',
        values: [...new Set([...(existing?.values || []), frontResult[key], backResult[key]])],
        conflicts: { ...existing?.conflicts, [key]: [frontResult[key], backResult[key]] },
      };
    }
  }

  const frontText = frontResult.diagnostics?.sourceText || '';
  const backText = backResult.diagnostics?.sourceText || '';
  const sourceText = `${frontText}\n${backText}`.slice(0, 65536);
  for (const [key, evidence] of Object.entries(mergedFields)) {
    const frontRanges = frontResult.diagnostics?.fields[key]?.textRanges || [];
    const backRanges = (backResult.diagnostics?.fields[key]?.textRanges || []).map(range => ({
      start: range.start + frontText.length + 1,
      end: range.end + frontText.length + 1,
    }));
    mergedFields[key] = {
      ...evidence,
      textRanges: [...frontRanges, ...backRanges].filter(range => range.end <= sourceText.length),
    };
  }

  const merged: EmiratesIdExtractedData = {
    ...frontResult,
    idNumber: frontResult.idNumber || backResult.idNumber,
    rawIdNumber: (frontResult.idNumber || backResult.idNumber).replace(/\D/g, ''),
    fullNameAr: frontResult.fullNameAr || backResult.fullNameAr,
    dateOfBirth: frontResult.dateOfBirth || backResult.dateOfBirth,
    issueDate: frontResult.issueDate || backResult.issueDate,
    nationalityEn: frontResult.nationalityEn || backResult.nationalityEn,
    nationalityAr: frontResult.nationalityAr || backResult.nationalityAr,
    nationalityCode: frontResult.nationalityCode || backResult.nationalityCode,
    gender: frontResult.gender || backResult.gender,
    fullNameEn: frontResult.fullNameEn || backResult.fullNameEn,
    expiryDate: frontResult.expiryDate || backResult.expiryDate,
    cardNumber: backResult.cardNumber || frontResult.cardNumber,
    chipNumber: backResult.chipNumber || frontResult.chipNumber,
    mrz: backResult.mrz || frontResult.mrz,
    occupationEn: backResult.occupationEn || frontResult.occupationEn,
    occupationAr: backResult.occupationAr || frontResult.occupationAr,
    employerEn: backResult.employerEn || frontResult.employerEn,
    employerAr: backResult.employerAr || frontResult.employerAr,
    issuingPlaceEn: backResult.issuingPlaceEn || frontResult.issuingPlaceEn,
    issuingPlaceAr: backResult.issuingPlaceAr || frontResult.issuingPlaceAr,
    confidenceScore: Math.max(frontResult.confidenceScore, backResult.confidenceScore),
    scannedAt: new Date().toISOString(),
    scannedSide: 'both',
    documentFormat: `${frontFile.type || 'image'}, ${backFile.type || 'image'}`,
    reviewConfirmed: false,
    diagnostics: {
      fields: mergedFields,
      sourceText,
      coverage: 0,
      warnings: [
        ...(frontResult.diagnostics?.warnings || []),
        ...(backResult.diagnostics?.warnings || []),
      ],
    },
  };

  merged.missingFields = [
    !/^784-\d{4}-\d{7}-\d$/.test(merged.idNumber) && 'idNumber',
    !merged.fullNameEn.trim() && 'fullNameEn',
    !validScanDate(merged.expiryDate) && 'expiryDate',
  ].filter((value): value is string => !!value);
  Object.assign(merged, scanExpiry(merged.expiryDate));
  refreshCoverage(merged.diagnostics!);
  merged.detectedFieldsCount = Object.values(mergedFields).filter(
    field => field.state === 'extracted'
  ).length;

  return merged;
}

export function toContractParty(
  extracted: EmiratesIdExtractedData,
  phone = '',
  email = ''
): ContractParty {
  if (!canUseScan(extracted)) throw new Error('Confirm review before autofill.');
  return {
    name: extracted.fullNameEn,
    emiratesIdOrPassport: extracted.idNumber,
    phone,
    email,
  };
}

export function toViewingClientPayload(
  extracted: EmiratesIdExtractedData,
  base: Partial<ViewingFormPayload> = {}
): Partial<ViewingFormPayload> {
  if (!canUseScan(extracted)) throw new Error('Confirm review before autofill.');
  return {
    ...base,
    clientName: extracted.fullNameEn,
    clientPassportOrEid: extracted.idNumber,
  };
}

export function exportToJson(extracted: EmiratesIdExtractedData): Record<string, any> {
  const { diagnostics, ...safeData } = extracted;
  void diagnostics;
  return safeData;
}

export function exportToJsonString(extracted: EmiratesIdExtractedData): string {
  return JSON.stringify(exportToJson(extracted), null, 2);
}
