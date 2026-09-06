import { describe, expect, it } from 'vitest';

import {
  evaluateEjariPerformance,
  type EjariPerformanceSample,
  type EjariPerformanceThresholds,
} from './ejariSuitePerformanceUnit.logic';

describe('evaluateEjariPerformance', () => {
  const baseThresholds: EjariPerformanceThresholds = {
    maxAverageDurationMsPerUnit: 50,
  };

  it('aggregates a happy-path batch into the expected report values', () => {
    const samples: EjariPerformanceSample[] = [
      { operationName: 'generateContract', durationMs: 100, unitsProcessed: 2 },
      { operationName: 'generateContract', durationMs: 200, unitsProcessed: 3 },
      { operationName: 'generateContract', durationMs: 300, unitsProcessed: 5 },
    ];

    const report = evaluateEjariPerformance(samples, baseThresholds);

    expect(report.operationName).toBe('generateContract');
    expect(report.sampleCount).toBe(3);
    expect(report.totalDurationMs).toBe(600);
    expect(report.averageDurationMs).toBe(200);
    // totalUnits = 10, totalDurationMs = 600 => (10 / 600) * 1000
    expect(report.unitsPerSecond).toBeCloseTo(16.6666667, 5);
    expect(report.withinThreshold).toBe(false);
  });

  it('throws on an empty samples array', () => {
    expect(() => evaluateEjariPerformance([], baseThresholds)).toThrow(/must not be empty/i);
  });

  it('throws when a sample has a negative durationMs', () => {
    const samples: EjariPerformanceSample[] = [
      { operationName: 'validateDocument', durationMs: -1, unitsProcessed: 1 },
    ];

    expect(() => evaluateEjariPerformance(samples, baseThresholds)).toThrow(/negative durationMs/i);
  });

  it('throws when a sample has unitsProcessed < 1', () => {
    const samples: EjariPerformanceSample[] = [
      { operationName: 'validateDocument', durationMs: 10, unitsProcessed: 0 },
    ];

    expect(() => evaluateEjariPerformance(samples, baseThresholds)).toThrow(/unitsProcessed < 1/i);
  });

  it('throws when samples reference more than one distinct operationName', () => {
    const samples: EjariPerformanceSample[] = [
      { operationName: 'generateContract', durationMs: 10, unitsProcessed: 1 },
      { operationName: 'validateDocument', durationMs: 20, unitsProcessed: 1 },
    ];

    expect(() => evaluateEjariPerformance(samples, baseThresholds)).toThrow(
      /more than one distinct operationName/i
    );
  });

  it('sets withinThreshold to true when averageDurationMs equals the threshold exactly', () => {
    const samples: EjariPerformanceSample[] = [
      { operationName: 'renewLease', durationMs: 50, unitsProcessed: 1 },
    ];

    const report = evaluateEjariPerformance(samples, {
      maxAverageDurationMsPerUnit: 50,
    });

    expect(report.averageDurationMs).toBe(50);
    expect(report.withinThreshold).toBe(true);
  });

  it('sets withinThreshold to false when averageDurationMs exceeds the threshold', () => {
    const samples: EjariPerformanceSample[] = [
      { operationName: 'renewLease', durationMs: 51, unitsProcessed: 1 },
    ];

    const report = evaluateEjariPerformance(samples, {
      maxAverageDurationMsPerUnit: 50,
    });

    expect(report.withinThreshold).toBe(false);
  });

  it('returns Infinity for unitsPerSecond when totalDurationMs is 0', () => {
    const samples: EjariPerformanceSample[] = [
      { operationName: 'cacheLookup', durationMs: 0, unitsProcessed: 1 },
      { operationName: 'cacheLookup', durationMs: 0, unitsProcessed: 4 },
    ];

    const report = evaluateEjariPerformance(samples, baseThresholds);

    expect(report.unitsPerSecond).toBe(Infinity);
    expect(report.totalDurationMs).toBe(0);
    expect(report.averageDurationMs).toBe(0);
    expect(report.withinThreshold).toBe(true);
  });

  it('does not mutate the input samples array or its elements', () => {
    const samples: EjariPerformanceSample[] = [
      { operationName: 'generateContract', durationMs: 100, unitsProcessed: 2 },
      { operationName: 'generateContract', durationMs: 200, unitsProcessed: 3 },
    ];
    const snapshot = JSON.parse(JSON.stringify(samples)) as unknown;

    evaluateEjariPerformance(samples, baseThresholds);

    expect(JSON.parse(JSON.stringify(samples))).toEqual(snapshot);
    expect(samples.length).toBe(2);
  });

  it('computes correct totals for a larger multi-sample batch', () => {
    const samples: EjariPerformanceSample[] = Array.from({ length: 10 }, (_, i) => ({
      operationName: 'bulkExport',
      durationMs: 10 * (i + 1),
      unitsProcessed: i + 1,
    }));

    const report = evaluateEjariPerformance(samples, {
      maxAverageDurationMsPerUnit: 1000,
    });

    // totalDurationMs = 10 * (1+2+...+10) = 10 * 55 = 550
    expect(report.totalDurationMs).toBe(550);
    expect(report.sampleCount).toBe(10);
    expect(report.averageDurationMs).toBe(55);
    // totalUnits = 1+2+...+10 = 55; unitsPerSecond = (55/550)*1000 = 100
    expect(report.unitsPerSecond).toBe(100);
    expect(report.withinThreshold).toBe(true);
  });
});
