import { describe, expect, it } from 'vitest';
import type { PayrollAgentBatchResult } from './financeEngineAgentPayroll.logic';
import {
  DEFAULT_PAYROLL_AGENT_CONFIG,
  createPayrollAgentConfig,
  isPayrollAgentStatus,
  isPayrollFrequency,
  isValidPayrollPeriod,
  summarizePayrollAgentRun,
  type PayrollAgentRunRequest,
  type PayrollPeriod,
} from './financeEngineAgentPayroll.types';

describe('isPayrollFrequency', () => {
  it('accepts all known frequency values', () => {
    expect(isPayrollFrequency('weekly')).toBe(true);
    expect(isPayrollFrequency('biweekly')).toBe(true);
    expect(isPayrollFrequency('semimonthly')).toBe(true);
    expect(isPayrollFrequency('monthly')).toBe(true);
  });

  it('rejects unknown or malformed values', () => {
    expect(isPayrollFrequency('yearly')).toBe(false);
    expect(isPayrollFrequency('')).toBe(false);
    expect(isPayrollFrequency('Weekly')).toBe(false);
  });
});

describe('isPayrollAgentStatus', () => {
  it('accepts all known status values', () => {
    expect(isPayrollAgentStatus('idle')).toBe(true);
    expect(isPayrollAgentStatus('running')).toBe(true);
    expect(isPayrollAgentStatus('completed')).toBe(true);
    expect(isPayrollAgentStatus('failed')).toBe(true);
  });

  it('rejects unknown status values', () => {
    expect(isPayrollAgentStatus('paused')).toBe(false);
    expect(isPayrollAgentStatus('')).toBe(false);
  });
});

describe('isValidPayrollPeriod', () => {
  it('accepts a valid period where start precedes end', () => {
    const period: PayrollPeriod = {
      start: '2024-01-01',
      end: '2024-01-15',
      frequency: 'semimonthly',
    };
    expect(isValidPayrollPeriod(period)).toBe(true);
  });

  it('accepts a period where start equals end', () => {
    const period: PayrollPeriod = {
      start: '2024-01-01',
      end: '2024-01-01',
      frequency: 'weekly',
    };
    expect(isValidPayrollPeriod(period)).toBe(true);
  });

  it('rejects a period where start is after end', () => {
    const period: PayrollPeriod = {
      start: '2024-02-01',
      end: '2024-01-01',
      frequency: 'monthly',
    };
    expect(isValidPayrollPeriod(period)).toBe(false);
  });

  it('rejects a period with an unknown frequency', () => {
    const period = {
      start: '2024-01-01',
      end: '2024-01-15',
      frequency: 'yearly',
    } as unknown as PayrollPeriod;
    expect(isValidPayrollPeriod(period)).toBe(false);
  });

  it('rejects a period with unparseable dates', () => {
    const period: PayrollPeriod = {
      start: 'not-a-date',
      end: '2024-01-15',
      frequency: 'weekly',
    };
    expect(isValidPayrollPeriod(period)).toBe(false);
  });
});

describe('createPayrollAgentConfig', () => {
  it('returns the default configuration when no overrides are given', () => {
    const config = createPayrollAgentConfig();
    expect(config).toEqual(DEFAULT_PAYROLL_AGENT_CONFIG);
  });

  it('applies a valid maxBatchSize override', () => {
    const config = createPayrollAgentConfig({ maxBatchSize: 25 });
    expect(config.maxBatchSize).toBe(25);
    expect(config.failFast).toBe(DEFAULT_PAYROLL_AGENT_CONFIG.failFast);
  });

  it('falls back to the default maxBatchSize for non-positive values', () => {
    expect(createPayrollAgentConfig({ maxBatchSize: 0 }).maxBatchSize).toBe(
      DEFAULT_PAYROLL_AGENT_CONFIG.maxBatchSize
    );
    expect(createPayrollAgentConfig({ maxBatchSize: -10 }).maxBatchSize).toBe(
      DEFAULT_PAYROLL_AGENT_CONFIG.maxBatchSize
    );
  });

  it('falls back to the default maxBatchSize for non-integer values', () => {
    expect(createPayrollAgentConfig({ maxBatchSize: 1.5 }).maxBatchSize).toBe(
      DEFAULT_PAYROLL_AGENT_CONFIG.maxBatchSize
    );
  });

  it('respects an explicit failFast override', () => {
    const config = createPayrollAgentConfig({ failFast: true });
    expect(config.failFast).toBe(true);
  });

  it('carries through custom tax brackets', () => {
    const taxBrackets = [{ upTo: 100, rate: 0.05 }];
    const config = createPayrollAgentConfig({ taxBrackets });
    expect(config.taxBrackets).toBe(taxBrackets);
  });
});

describe('summarizePayrollAgentRun', () => {
  const period: PayrollPeriod = {
    start: '2024-01-01',
    end: '2024-01-15',
    frequency: 'semimonthly',
  };
  const request: PayrollAgentRunRequest = {
    runId: 'run-1',
    period,
    config: DEFAULT_PAYROLL_AGENT_CONFIG,
  };

  it('marks a fully successful batch as completed', () => {
    const batch: PayrollAgentBatchResult = {
      processedCount: 2,
      successCount: 2,
      failedCount: 0,
      totalNetPay: 1000,
      outcomes: [],
    };
    const summary = summarizePayrollAgentRun(request, batch);
    expect(summary.status).toBe('completed');
    expect(summary.runId).toBe('run-1');
    expect(summary.period).toBe(period);
    expect(summary.batch).toBe(batch);
  });

  it('marks a fully failed batch as failed', () => {
    const batch: PayrollAgentBatchResult = {
      processedCount: 2,
      successCount: 0,
      failedCount: 2,
      totalNetPay: 0,
      outcomes: [],
    };
    const summary = summarizePayrollAgentRun(request, batch);
    expect(summary.status).toBe('failed');
  });

  it('marks a partially successful batch as completed', () => {
    const batch: PayrollAgentBatchResult = {
      processedCount: 2,
      successCount: 1,
      failedCount: 1,
      totalNetPay: 500,
      outcomes: [],
    };
    const summary = summarizePayrollAgentRun(request, batch);
    expect(summary.status).toBe('completed');
  });

  it('marks an empty batch (no tasks processed) as completed', () => {
    const batch: PayrollAgentBatchResult = {
      processedCount: 0,
      successCount: 0,
      failedCount: 0,
      totalNetPay: 0,
      outcomes: [],
    };
    const summary = summarizePayrollAgentRun(request, batch);
    expect(summary.status).toBe('completed');
  });
});
