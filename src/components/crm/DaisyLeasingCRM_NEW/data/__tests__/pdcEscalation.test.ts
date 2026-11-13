// Tests: PDC Bounce Escalation State Machine — pdcEscalation.ts
import { describe, it, expect } from 'vitest';
import {
  addBusinessDays,
  isGracePeriodExpired,
  nextEscalationStage,
  openBounceEscalation,
  advanceBounceStage,
  buildLandlordNotification,
  scanBouncedCheques,
  BounceStage,
} from '../pdcEscalation';
import { PDCCheque } from '../leasing';

const MOCK_CHEQUE: PDCCheque = {
  id: 7,
  leaseId: 3,
  chequeNumber: 'CHQ-BOUNCE-001',
  bankName: 'Emirates NBD',
  amount: 15000,
  dueDate: '2026-01-01',
  status: 'bounced',
  tenantName: 'Omar Al Mansouri',
  unit: 'Office 304',
  presentedDate: '2025-12-30',
  clearedDate: null,
  notes: null,
};

describe('addBusinessDays', () => {
  it('skips weekends and adds exactly N business days', () => {
    // Friday 2026-01-02 + 3 business days → Wednesday 2026-01-07
    const result = addBusinessDays('2026-01-02', 3);
    expect(result).toBe('2026-01-07');
  });

  it('adding 0 business days returns the same date', () => {
    const result = addBusinessDays('2026-03-10', 0);
    expect(result).toBe('2026-03-10');
  });
});

describe('isGracePeriodExpired', () => {
  it('returns true when deadline is in the past', () => {
    expect(isGracePeriodExpired('2020-01-01', new Date('2026-01-01'))).toBe(true);
  });

  it('returns false when deadline is in the future', () => {
    expect(isGracePeriodExpired('2099-12-31', new Date('2026-01-01'))).toBe(false);
  });
});

describe('nextEscalationStage', () => {
  it('maps cheque_returned → landlord_notified', () => {
    expect(nextEscalationStage('cheque_returned')).toBe('landlord_notified');
  });

  it('returns null for terminal stages', () => {
    expect(nextEscalationStage('resolved')).toBeNull();
    expect(nextEscalationStage('written_off')).toBeNull();
  });

  it('maps legal_notice_sent → legal_escalated', () => {
    expect(nextEscalationStage('legal_notice_sent')).toBe('legal_escalated');
  });
});

describe('openBounceEscalation', () => {
  it('creates a record at cheque_returned stage', () => {
    const record = openBounceEscalation(MOCK_CHEQUE, 'insufficient_funds', '2026-01-05');
    expect(record.currentStage).toBe('cheque_returned');
    expect(record.chequeNumber).toBe('CHQ-BOUNCE-001');
    expect(record.bounceReason).toBe('insufficient_funds');
    expect(record.landlordNotified).toBe(false);
    expect(record.events).toHaveLength(1);
  });

  it('sets gracePeriodDeadline 3 business days after returnDate', () => {
    const record = openBounceEscalation(MOCK_CHEQUE, 'insufficient_funds', '2026-01-05');
    // 2026-01-05 (Mon) + 3 biz days = 2026-01-08 (Thu)
    expect(record.gracePeriodDeadline).toBe('2026-01-08');
  });
});

describe('advanceBounceStage', () => {
  it('transitions correctly and appends event', () => {
    const record = openBounceEscalation(MOCK_CHEQUE, 'insufficient_funds', '2026-01-05');
    const result = advanceBounceStage(
      record,
      'landlord_notified',
      'agent:Daisy',
      'Landlord alerted via email.'
    );
    expect(result.success).toBe(true);
    expect(result.record.currentStage).toBe('landlord_notified');
    expect(result.record.landlordNotified).toBe(true);
    expect(result.record.events).toHaveLength(2);
  });

  it('is idempotent — rejects duplicate stage transition', () => {
    const record = openBounceEscalation(MOCK_CHEQUE, 'insufficient_funds', '2026-01-05');
    const first = advanceBounceStage(record, 'landlord_notified', 'agent', 'First');
    const second = advanceBounceStage(first.record, 'landlord_notified', 'agent', 'Duplicate');
    expect(second.success).toBe(false);
    expect(second.message).toContain('Already at stage');
  });

  it('blocks transitions from terminal stages', () => {
    const record = openBounceEscalation(MOCK_CHEQUE, 'account_closed', '2026-01-05');
    const resolved = advanceBounceStage(record, 'resolved', 'agent', 'Settled');
    const attempt = advanceBounceStage(resolved.record, 'legal_escalated', 'agent', 'Too late');
    expect(attempt.success).toBe(false);
    expect(attempt.message).toContain('terminal');
  });

  it('sets legalNoticeDate when transitioning to legal_notice_sent', () => {
    let record = openBounceEscalation(MOCK_CHEQUE, 'payment_stopped', '2026-01-05');
    record = advanceBounceStage(record, 'landlord_notified', 'agent', '').record;
    record = advanceBounceStage(record, 'grace_period_active', 'system', '').record;
    record = advanceBounceStage(record, 'grace_period_expired', 'system', '').record;
    const r = advanceBounceStage(record, 'legal_notice_sent', 'legal', 'Notice sent.');
    expect(r.record.legalNoticeDate).not.toBeNull();
  });
});

describe('buildLandlordNotification', () => {
  it('returns a notification with urgency and message', () => {
    const record = openBounceEscalation(MOCK_CHEQUE, 'insufficient_funds', '2026-01-05');
    const notification = buildLandlordNotification(record);
    expect(notification.chequeNumber).toBe('CHQ-BOUNCE-001');
    expect(notification.amount).toBe(15000);
    expect(notification.urgency).toMatch(/^(high|critical)$/);
    expect(notification.message).toContain('PDC Bounce Alert');
  });
});

describe('scanBouncedCheques', () => {
  it('filters only bounced cheques', () => {
    const cheques: PDCCheque[] = [
      { ...MOCK_CHEQUE, id: 1, status: 'cleared' },
      { ...MOCK_CHEQUE, id: 2, status: 'bounced' },
      { ...MOCK_CHEQUE, id: 3, status: 'pending' },
      { ...MOCK_CHEQUE, id: 4, status: 'bounced' },
    ];
    const result = scanBouncedCheques(cheques);
    expect(result).toHaveLength(2);
    result.forEach(r => expect(r.status).toBe('bounced'));
  });

  it('returns empty array when no bounced cheques', () => {
    const cheques: PDCCheque[] = [{ ...MOCK_CHEQUE, id: 1, status: 'cleared' }];
    expect(scanBouncedCheques(cheques)).toHaveLength(0);
  });
});
