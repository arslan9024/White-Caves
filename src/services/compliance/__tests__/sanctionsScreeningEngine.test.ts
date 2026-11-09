import { describe, it, expect } from 'vitest';
import { screenClientAgainstWatchlists } from '../sanctionsScreeningEngine';

describe('Compliance: Sanctions, PEP & goAML Screening Engine', () => {
  it('returns CLEAR status for clean luxury buyers', () => {
    const report = screenClientAgainstWatchlists({
      fullName: 'Alexander Wright',
      passportNumber: 'GB9823412',
      nationality: 'British'
    });

    expect(report.riskLevel).toBe('CLEAR');
    expect(report.recommendation).toBe('PROCEED_TRANSACTION');
    expect(report.goAmlReportRequired).toBe(false);
    expect(report.matches).toHaveLength(0);
  });

  it('triggers MEDIUM_PEP_REVIEW and Enhanced Due Diligence for Politically Exposed Persons', () => {
    const report = screenClientAgainstWatchlists({
      fullName: 'Mansoor Al-Sabah',
      passportNumber: 'KW887123',
      nationality: 'Kuwaiti'
    });

    expect(report.riskLevel).toBe('MEDIUM_PEP_REVIEW');
    expect(report.recommendation).toBe('ENHANCED_DUE_DILIGENCE_REQUIRED');
    expect(report.goAmlReportRequired).toBe(false);
    expect(report.matches[0].sourceList).toBe('FATF_PEP_INDEX');
  });

  it('triggers CRITICAL_SANCTION_HIT and goAML STR filing requirement for sanctioned individuals', () => {
    const report = screenClientAgainstWatchlists({
      fullName: 'Viktor Bout',
      passportNumber: 'RU0019283',
      nationality: 'Russian'
    });

    expect(report.riskLevel).toBe('CRITICAL_SANCTION_HIT');
    expect(report.recommendation).toBe('FREEZE_AND_FILE_STR');
    expect(report.goAmlReportRequired).toBe(true);
    expect(report.matches[0].sourceList).toBe('UN_SECURITY_COUNCIL');
  });
});
