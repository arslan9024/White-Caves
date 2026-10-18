import { describe, expect, it } from 'vitest';
import { benchmarkFields, evaluateHenryBenchmark, type BenchmarkValues } from './henryBenchmark';
import scanner from './HenryTitleDeedScannerService';

describe('Henry labeled aggregate evaluation — synthetic evidence only', () => {
  it('evaluates actual parser evidence from an in-memory synthetic corpus', () => {
    const corpus = ['Certificate Number: 123/2026\nOwner Name: SYNTHETIC OWNER\nPlot Number: 42', 'رقم الشهادة: 123/2026\nاسم المالك: مالك تجريبي\nرقم الأرض: 42'];
    const samples = corpus.map(text => {
      const data = scanner.parseDocumentText(text);
      return {
        source: 'synthetic' as const, consent: false,
        expected: { certificateNumber: '123/2026', plotNumber: '42' },
        predicted: { certificateNumber: data.certificateNumber, plotNumber: data.plotNumber },
      };
    });
    const report = evaluateHenryBenchmark(samples);
    expect(report.fields.certificateNumber.recall).toBe(1);
    expect(report.fields.plotNumber.precision).toBe(1);
    expect(report.source).toBe('synthetic');
    expect(report.fullRecordExactMatch).toBe(0);
  });
  it('counts absent and incorrect predictions in recall denominators', () => {
    const report = evaluateHenryBenchmark([
      { source: 'synthetic', consent: false, expected: { idNumber: 'SYNTHETIC' }, predicted: {} },
      { source: 'synthetic', consent: false, expected: { idNumber: 'SYNTHETIC' }, predicted: { idNumber: 'WRONG' } },
      { source: 'synthetic', consent: false, expected: { idNumber: 'SYNTHETIC' }, predicted: { idNumber: 'SYNTHETIC' } },
    ]);
    expect(report.fields.idNumber).toEqual({ truePositive: 1, falsePositive: 1, falseNegative: 2, labeledSamples: 3, precision: 0.5, recall: 1 / 3 });
    expect(report.fullRecordExactMatch).toBe(0);
    expect(report.realSamples).toBe(0);
    expect(report.calibration).toBe('uncalibrated');
    expect(JSON.stringify(report)).not.toMatch(/SYNTHETIC|WRONG/);
  });
  it('requires all supported field labels for full-record matching', () => {
    const expected = Object.fromEntries(benchmarkFields.map(field => [field, ''])) as BenchmarkValues;
    const report = evaluateHenryBenchmark([{ source: 'synthetic', consent: false, expected, predicted: {} }]);
    expect(report.fullRecordExactMatch).toBe(1);
    expect(report.fields.idNumber.precision).toBeNull();
    expect(report.fields.idNumber.recall).toBeNull();
    const deed = { certificateNumber: '', ownerName: '', propertyNumber: '', plotNumber: '', totalAreaSqM: '' };
    expect(evaluateHenryBenchmark([{ source: 'synthetic', consent: false, expected: deed, predicted: {} }], 'title_deed').fullRecordExactMatch).toBe(1);
  });
  it('does not mistake false positives on absent fields for exact matches', () => {
    const report = evaluateHenryBenchmark([{ source: 'synthetic', consent: false, expected: { idNumber: '' }, predicted: { idNumber: 'EXTRA' } }]);
    expect(report.fields.idNumber.falsePositive).toBe(1);
    expect(report.fields.idNumber.falseNegative).toBe(0);
  });
  it('enforces real-sample opt-in and never claims calibration from consent alone', () => {
    const sample = { source: 'real' as const, consent: false, expected: { idNumber: 'LABEL' }, predicted: {} };
    expect(() => evaluateHenryBenchmark([sample])).toThrow(/consent/);
    expect(evaluateHenryBenchmark([{ ...sample, consent: true }]).calibration).toBe('uncalibrated');
  });
  it('rejects unbounded inputs and arbitrary report field names', () => {
    expect(() => evaluateHenryBenchmark([{ source: 'synthetic', consent: false, expected: { idNumber: 'x'.repeat(501) }, predicted: {} }])).toThrow(/500/);
    expect(() => evaluateHenryBenchmark([{ source: 'synthetic', consent: false, expected: { personalLabel: 'x' } as BenchmarkValues, predicted: {} }])).toThrow(/supported/);
    expect(() => evaluateHenryBenchmark([])).not.toThrow();
  });
});
