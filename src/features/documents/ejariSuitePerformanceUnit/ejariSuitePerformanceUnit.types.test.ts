import { describe, expect, it } from 'vitest';

import {
  isEjariPerformanceReport,
  isEjariPerformanceSample,
  isEjariPerformanceSampleArray,
  isEjariPerformanceThresholds,
  type EjariPerformanceReport,
  type EjariPerformanceSample,
  type EjariPerformanceThresholds,
} from './ejariSuitePerformanceUnit.types';

describe('isEjariPerformanceSample', () => {
  it('returns true for a well-formed sample', () => {
    const sample: EjariPerformanceSample = {
      operationName: 'generateContract',
      durationMs: 120,
      unitsProcessed: 4,
    };

    expect(isEjariPerformanceSample(sample)).toBe(true);
  });

  it('returns false when a required field is missing', () => {
    const malformed = { operationName: 'generateContract', durationMs: 120 };

    expect(isEjariPerformanceSample(malformed)).toBe(false);
  });

  it('returns false when a field has the wrong primitive type', () => {
    const malformed = {
      operationName: 'generateContract',
      durationMs: '120',
      unitsProcessed: 4,
    };

    expect(isEjariPerformanceSample(malformed)).toBe(false);
  });

  it('returns false for null and non-object values', () => {
    expect(isEjariPerformanceSample(null)).toBe(false);
    expect(isEjariPerformanceSample(undefined)).toBe(false);
    expect(isEjariPerformanceSample('not-an-object')).toBe(false);
    expect(isEjariPerformanceSample(42)).toBe(false);
  });
});

describe('isEjariPerformanceSampleArray', () => {
  it('returns true for an array of well-formed samples, including the empty array', () => {
    const samples: EjariPerformanceSample[] = [
      { operationName: 'validateContract', durationMs: 10, unitsProcessed: 1 },
      { operationName: 'validateContract', durationMs: 20, unitsProcessed: 2 },
    ];

    expect(isEjariPerformanceSampleArray(samples)).toBe(true);
    expect(isEjariPerformanceSampleArray([])).toBe(true);
  });

  it('returns false when any element is malformed', () => {
    const samples = [
      { operationName: 'validateContract', durationMs: 10, unitsProcessed: 1 },
      { operationName: 'validateContract', durationMs: 'oops', unitsProcessed: 2 },
    ];

    expect(isEjariPerformanceSampleArray(samples)).toBe(false);
  });

  it('returns false for a non-array value', () => {
    expect(isEjariPerformanceSampleArray({ length: 0 })).toBe(false);
  });
});

describe('isEjariPerformanceThresholds', () => {
  it('returns true for a well-formed thresholds object', () => {
    const thresholds: EjariPerformanceThresholds = { maxAverageDurationMsPerUnit: 50 };

    expect(isEjariPerformanceThresholds(thresholds)).toBe(true);
  });

  it('returns false when the field is missing or has the wrong type', () => {
    expect(isEjariPerformanceThresholds({})).toBe(false);
    expect(isEjariPerformanceThresholds({ maxAverageDurationMsPerUnit: '50' })).toBe(false);
    expect(isEjariPerformanceThresholds(null)).toBe(false);
  });
});

describe('isEjariPerformanceReport', () => {
  it('returns true for a well-formed report', () => {
    const report: EjariPerformanceReport = {
      operationName: 'generateContract',
      sampleCount: 2,
      totalDurationMs: 200,
      averageDurationMs: 100,
      unitsPerSecond: 10,
      withinThreshold: true,
    };

    expect(isEjariPerformanceReport(report)).toBe(true);
  });

  it('returns true for a report using Infinity as unitsPerSecond', () => {
    const report: EjariPerformanceReport = {
      operationName: 'generateContract',
      sampleCount: 1,
      totalDurationMs: 0,
      averageDurationMs: 0,
      unitsPerSecond: Infinity,
      withinThreshold: true,
    };

    expect(isEjariPerformanceReport(report)).toBe(true);
    expect(report.unitsPerSecond).toBe(Infinity);
  });

  it('returns false when withinThreshold is not a boolean', () => {
    const malformed = {
      operationName: 'generateContract',
      sampleCount: 2,
      totalDurationMs: 200,
      averageDurationMs: 100,
      unitsPerSecond: 10,
      withinThreshold: 'true',
    };

    expect(isEjariPerformanceReport(malformed)).toBe(false);
  });

  it('returns false for null and arrays', () => {
    expect(isEjariPerformanceReport(null)).toBe(false);
    expect(isEjariPerformanceReport([])).toBe(false);
  });
});
