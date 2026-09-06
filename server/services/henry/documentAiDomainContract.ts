export type DocumentAiDocumentType = 'passport' | 'title_deed' | 'contract';

export interface DocumentAiExtractionContract {
  documentType: DocumentAiDocumentType;
  extractedAt: string;
  confidenceScore: number;
  fields: Record<string, string>;
}

export interface DocumentAiContractIssue {
  path: string;
  message: string;
}

const REQUIRED_FIELDS_BY_TYPE: Record<DocumentAiDocumentType, readonly string[]> = {
  passport: ['passportNumber', 'fullName'],
  title_deed: ['certificateNumber', 'ownerName'],
  contract: ['contractDate', 'landlordName', 'tenantName'],
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isValidIsoDate = (value: string): boolean => Number.isFinite(Date.parse(value));

export const validateDocumentAiExtractionContract = (input: unknown): DocumentAiContractIssue[] => {
  const issues: DocumentAiContractIssue[] = [];

  if (!isRecord(input)) {
    return [{ path: 'input', message: 'must be an object' }];
  }

  const { documentType, extractedAt, confidenceScore, fields } = input;

  if (documentType !== 'passport' && documentType !== 'title_deed' && documentType !== 'contract') {
    issues.push({
      path: 'documentType',
      message: 'must be one of: passport, title_deed, contract',
    });
  }

  if (typeof extractedAt !== 'string' || !isValidIsoDate(extractedAt)) {
    issues.push({ path: 'extractedAt', message: 'must be a valid ISO date string' });
  }

  if (
    typeof confidenceScore !== 'number' ||
    Number.isNaN(confidenceScore) ||
    confidenceScore < 0 ||
    confidenceScore > 1
  ) {
    issues.push({ path: 'confidenceScore', message: 'must be a number between 0 and 1' });
  }

  if (!isRecord(fields)) {
    issues.push({ path: 'fields', message: 'must be an object map of extracted fields' });
    return issues;
  }

  const requiredFields =
    documentType === 'passport' || documentType === 'title_deed' || documentType === 'contract'
      ? REQUIRED_FIELDS_BY_TYPE[documentType]
      : [];

  for (const fieldName of requiredFields) {
    const value = fields[fieldName];
    if (typeof value !== 'string' || !value.trim()) {
      issues.push({
        path: `fields.${fieldName}`,
        message: 'is required and must be a non-empty string',
      });
    }
  }

  return issues;
};

export const isDocumentAiExtractionContract = (
  input: unknown
): input is DocumentAiExtractionContract =>
  validateDocumentAiExtractionContract(input).length === 0;
