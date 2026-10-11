export const benchmarkFields = [
  'idNumber', 'fullName', 'expiryDate', 'nationality', 'dateOfBirth',
  'certificateNumber', 'ownerName', 'propertyNumber', 'plotNumber', 'totalAreaSqM',
] as const;
export type BenchmarkField = (typeof benchmarkFields)[number];
export type BenchmarkValues = Partial<Record<BenchmarkField, string>>;
const scannerFieldMapping = {
  idNumber: 'idNumber', fullName: 'fullNameEn', expiryDate: 'expiryDate',
  nationality: 'nationalityEn', dateOfBirth: 'dateOfBirth',
  certificateNumber: 'certificateNumber', ownerName: 'ownerNameEn',
  propertyNumber: 'propertyNumber', plotNumber: 'plotNumber', totalAreaSqM: 'totalAreaSqM',
} as const;

/** Copy normalized outputs, never raw evidence, before any review correction. */
export function snapshotBenchmarkValues(extracted: object): Readonly<BenchmarkValues> {
  const fields = extracted as Record<string, unknown>;
  const values: BenchmarkValues = {};
  for (const field of benchmarkFields) {
    const value = fields[scannerFieldMapping[field]];
    if (typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value)))
      values[field] = String(value);
  }
  return Object.freeze(values);
}
export interface LabeledScan {
  source: 'synthetic' | 'real';
  consent: boolean;
  expected: BenchmarkValues;
  predicted: BenchmarkValues;
}
export interface FieldMetric {
  truePositive: number;
  falsePositive: number;
  falseNegative: number;
  labeledSamples: number;
  precision: number | null;
  recall: number | null;
}

/** Exact NFC/trim comparison, not fuzzy matching. Reports never contain sample values. */
export function evaluateHenryBenchmark(samples: readonly LabeledScan[], schema: 'emirates_id' | 'title_deed' | 'combined' = 'combined') {
  if (!['emirates_id', 'title_deed', 'combined'].includes(schema)) throw new Error('Unsupported evaluation schema.');
  const recordFields = schema === 'combined' ? benchmarkFields
    : schema === 'emirates_id' ? benchmarkFields.slice(0, 5) : benchmarkFields.slice(5);
  if (samples.length > 1000) throw new Error('At most 1000 labeled scans per local evaluation.');
  const fields = Object.fromEntries(benchmarkFields.map(field => [field, {
    truePositive: 0, falsePositive: 0, falseNegative: 0, labeledSamples: 0,
    precision: null, recall: null,
  }])) as Record<BenchmarkField, FieldMetric>;
  let exactRecords = 0;
  let realSamples = 0;
  for (const sample of samples) {
    if (!['real', 'synthetic'].includes(sample.source) || (sample.source === 'real' && sample.consent !== true))
      throw new Error('Explicit consent is required for each real sample.');
    if (!sample.expected || !sample.predicted) throw new Error('Labeled and predicted fields required.');
    for (const values of [sample.expected, sample.predicted]) {
      if (Object.keys(values).some(key => !benchmarkFields.includes(key as BenchmarkField)) ||
        Object.values(values).some(value => typeof value !== 'string' || value.length > 500))
        throw new Error('Use supported fields and text values of at most 500 characters.');
    }
    const labeled = recordFields.filter(field => Object.hasOwn(sample.expected, field));
    if (!labeled.length) throw new Error('At least one explicitly labeled field is required.');
    if (sample.source === 'real') realSamples++;
    let exact = true;
    for (const field of labeled) {
      const metric = fields[field];
      const expected = sample.expected[field]!.normalize('NFC').trim();
      const predicted = (sample.predicted[field] || '').normalize('NFC').trim();
      metric.labeledSamples++;
      if (predicted && predicted === expected) metric.truePositive++;
      else {
        if (predicted) metric.falsePositive++;
        if (expected) metric.falseNegative++;
      }
      if (predicted !== expected) exact = false;
    }
    // Partial labels cannot count as a full-record exact match.
    if (exact && labeled.length === recordFields.length) exactRecords++;
  }
  for (const metric of Object.values(fields)) {
    const predictions = metric.truePositive + metric.falsePositive;
    const expected = metric.truePositive + metric.falseNegative;
    metric.precision = predictions ? metric.truePositive / predictions : null;
    metric.recall = expected ? metric.truePositive / expected : null;
  }
  return {
    source: realSamples === 0 ? 'synthetic' : realSamples === samples.length ? 'real' : 'mixed',
    schema,
    samples: samples.length,
    realSamples,
    syntheticSamples: samples.length - realSamples,
    fields,
    fullRecordExactMatch: samples.length ? exactRecords / samples.length : null,
    fullyLabeledSamples: samples.filter(sample => recordFields.every(field => Object.hasOwn(sample.expected, field))).length,
    calibration: 'uncalibrated',
    calibrationReason: 'Local labels are not an independently validated representative dataset or confidence calibration protocol.',
  } as const;
}
