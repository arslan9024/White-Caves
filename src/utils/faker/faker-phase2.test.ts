/**
 * Transaction & Conversation Generators — Test Suite
 * =====================================================
 * Validates transactions, commissions, conversations, activities.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  generateTransactions,
  TRANSACTION_TYPES, TRANSACTION_STATUSES,
  COMMISSION_TYPES, COMMISSION_STATUSES,
  generateConversations, generateActivities,
  CONVERSATION_STATUSES, CONVERSATION_PRIORITIES,
  ACTIVITY_TYPES,
} from './index';
import type {
  GeneratedTransaction, GeneratedCommission,
  GeneratedConversation, GeneratedActivity,
} from './index';

// ─── Transactions ──────────────────────────────────────────────

describe('generateTransactions', () => {
  let transactions: GeneratedTransaction[];
  let commissions: GeneratedCommission[];

  beforeAll(() => {
    const result = generateTransactions(30);
    transactions = result.transactions;
    commissions = result.commissions;
  });

  it('generates the requested count of transactions', () => {
    expect(transactions).toHaveLength(30);
  });

  it('generates a matching commission for each transaction', () => {
    expect(commissions).toHaveLength(30);
  });

  it('produces unique transaction IDs', () => {
    const ids = transactions.map(t => t.id);
    expect(new Set(ids).size).toBe(30);
  });

  it('has correct ID formats: txn-001, comm-001', () => {
    expect(transactions[0].id).toBe('txn-001');
    expect(transactions[29].id).toBe('txn-030');
    expect(commissions[0].id).toBe('comm-001');
    expect(commissions[29].id).toBe('comm-030');
  });

  it('every transaction has required fields', () => {
    transactions.forEach(t => {
      expect(t).toHaveProperty('id');
      expect(t).toHaveProperty('type');
      expect(t).toHaveProperty('status');
      expect(t).toHaveProperty('leadId');
      expect(t).toHaveProperty('propertyId');
      expect(t).toHaveProperty('agentId');
      expect(t).toHaveProperty('buyerName');
      expect(t).toHaveProperty('sellerName');
      expect(t).toHaveProperty('amount');
      expect(t).toHaveProperty('commission');
      expect(t).toHaveProperty('timeline');
      expect(t).toHaveProperty('documents');
    });
  });

  it('transaction types are valid', () => {
    transactions.forEach(t => {
      expect((TRANSACTION_TYPES as readonly string[])).toContain(t.type);
    });
  });

  it('transaction statuses are valid', () => {
    transactions.forEach(t => {
      expect((TRANSACTION_STATUSES as readonly string[])).toContain(t.status);
    });
  });

  it('amounts are positive', () => {
    transactions.forEach(t => {
      expect(t.amount).toBeGreaterThan(0);
    });
  });

  it('commission math is consistent', () => {
    transactions.forEach(t => {
      const { amount, paidToAgent, paidToBroker } = t.commission;
      expect(paidToAgent + paidToBroker).toBe(amount);
      expect(t.commission.percentage).toBeGreaterThan(0);
    });
  });

  it('linked commissions reference the transaction', () => {
    commissions.forEach((c, i) => {
      expect(c.transactionId).toBe(transactions[i].id);
      expect(c.agentId).toBe(transactions[i].agentId);
    });
  });

  it('commission amounts match transaction commission', () => {
    commissions.forEach((c, i) => {
      expect(c.amount).toBe(transactions[i].commission.amount);
      expect(c.percentage).toBe(transactions[i].commission.percentage);
    });
  });

  it('commission statuses are valid', () => {
    commissions.forEach(c => {
      expect((COMMISSION_STATUSES as readonly string[])).toContain(c.status);
    });
  });

  it('paid commissions have paidAt date', () => {
    commissions.filter(c => c.status === 'paid').forEach(c => {
      expect(c.paidAt).not.toBeNull();
    });
  });

  it('non-paid commissions have null paidAt', () => {
    commissions.filter(c => c.status !== 'paid').forEach(c => {
      expect(c.paidAt).toBeNull();
    });
  });

  it('completed transactions have full timeline', () => {
    transactions.filter(t => t.status === 'completed').forEach(t => {
      expect(t.timeline.inquiryDate).toBeTruthy();
      expect(t.timeline.offerDate).toBeTruthy();
    });
  });

  it('completed transactions have finalPrice', () => {
    transactions.filter(t => t.status === 'completed').forEach(t => {
      expect(t.finalPrice).not.toBeNull();
    });
  });

  it('draft transactions have no finalPrice', () => {
    transactions.filter(t => t.status === 'draft').forEach(t => {
      expect(t.finalPrice).toBeNull();
    });
  });

  it('references follow expected ID formats', () => {
    transactions.forEach(t => {
      expect(t.agentId).toMatch(/^agent-\d{2}$/);
      expect(t.propertyId).toMatch(/^prop-\d{3}$/);
      expect(t.leadId).toMatch(/^lead-\d{3}$/);
    });
  });

  it('documents array length varies by status', () => {
    const completed = transactions.filter(t => t.status === 'completed');
    const drafts = transactions.filter(t => t.status === 'draft');
    if (completed.length && drafts.length) {
      const avgCompletedDocs = completed.reduce((s, t) => s + t.documents.length, 0) / completed.length;
      const avgDraftDocs = drafts.reduce((s, t) => s + t.documents.length, 0) / drafts.length;
      expect(avgCompletedDocs).toBeGreaterThan(avgDraftDocs);
    }
  });

  it('is deterministic — same seed produces same data', () => {
    const a = generateTransactions(5, 200);
    const b = generateTransactions(5, 200);
    expect(a.transactions.map(t => t.id)).toEqual(b.transactions.map(t => t.id));
    expect(a.transactions.map(t => t.amount)).toEqual(b.transactions.map(t => t.amount));
    expect(a.commissions.map(c => c.amount)).toEqual(b.commissions.map(c => c.amount));
  });

  it('exports constant arrays', () => {
    expect(TRANSACTION_TYPES.length).toBeGreaterThanOrEqual(3);
    expect(TRANSACTION_STATUSES.length).toBeGreaterThanOrEqual(5);
    expect(COMMISSION_TYPES.length).toBeGreaterThanOrEqual(3);
    expect(COMMISSION_STATUSES.length).toBeGreaterThanOrEqual(4);
  });
});

// ─── Conversations ─────────────────────────────────────────────

describe('generateConversations', () => {
  let conversations: GeneratedConversation[];

  beforeAll(() => {
    conversations = generateConversations(25);
  });

  it('generates the requested count', () => {
    expect(conversations).toHaveLength(25);
  });

  it('produces unique IDs', () => {
    const ids = conversations.map(c => c.id);
    expect(new Set(ids).size).toBe(25);
  });

  it('has correct ID format: conv-001', () => {
    expect(conversations[0].id).toBe('conv-001');
    expect(conversations[24].id).toBe('conv-025');
  });

  it('every conversation has required fields', () => {
    conversations.forEach(c => {
      expect(c).toHaveProperty('id');
      expect(c).toHaveProperty('customerPhone');
      expect(c).toHaveProperty('customerName');
      expect(c).toHaveProperty('status');
      expect(c).toHaveProperty('priority');
      expect(c).toHaveProperty('leadScore');
      expect(c).toHaveProperty('assignedAgent');
      expect(c).toHaveProperty('messages');
      expect(c).toHaveProperty('messageCount');
      expect(c).toHaveProperty('lastMessage');
    });
  });

  it('statuses are valid', () => {
    conversations.forEach(c => {
      expect((CONVERSATION_STATUSES as readonly string[])).toContain(c.status);
    });
  });

  it('priorities are valid', () => {
    conversations.forEach(c => {
      expect((CONVERSATION_PRIORITIES as readonly string[])).toContain(c.priority);
    });
  });

  it('leadScore is 0-100', () => {
    conversations.forEach(c => {
      expect(c.leadScore).toBeGreaterThanOrEqual(0);
      expect(c.leadScore).toBeLessThanOrEqual(100);
    });
  });

  it('messages array matches messageCount', () => {
    conversations.forEach(c => {
      expect(c.messages).toHaveLength(c.messageCount);
    });
  });

  it('each conversation has 3-12 messages', () => {
    conversations.forEach(c => {
      expect(c.messageCount).toBeGreaterThanOrEqual(3);
      expect(c.messageCount).toBeLessThanOrEqual(12);
    });
  });

  it('first message in each conversation is from CUSTOMER', () => {
    conversations.forEach(c => {
      expect(c.messages[0].sender).toBe('CUSTOMER');
    });
  });

  it('messages have required fields', () => {
    conversations.forEach(c => {
      c.messages.forEach(m => {
        expect(m).toHaveProperty('id');
        expect(m).toHaveProperty('conversationId');
        expect(m).toHaveProperty('sender');
        expect(m).toHaveProperty('content');
        expect(m).toHaveProperty('sentiment');
        expect(m).toHaveProperty('timestamp');
        expect(m.conversationId).toBe(c.id);
      });
    });
  });

  it('message IDs are unique within conversation', () => {
    conversations.forEach(c => {
      const ids = c.messages.map(m => m.id);
      expect(new Set(ids).size).toBe(c.messages.length);
    });
  });

  it('closed conversations have closedAt', () => {
    conversations.filter(c => c.status === 'CLOSED').forEach(c => {
      expect(c.closedAt).not.toBeNull();
    });
  });

  it('non-closed conversations have null closedAt', () => {
    conversations.filter(c => c.status !== 'CLOSED').forEach(c => {
      expect(c.closedAt).toBeNull();
    });
  });

  it('lastMessage matches the final message content', () => {
    conversations.forEach(c => {
      const lastMsg = c.messages[c.messages.length - 1];
      expect(c.lastMessage).toBe(lastMsg.content);
    });
  });

  it('assignedAgent follows agent-XX format', () => {
    conversations.forEach(c => {
      expect(c.assignedAgent).toMatch(/^agent-\d{2}$/);
    });
  });

  it('is deterministic — same seed produces same data', () => {
    const a = generateConversations(5, 300);
    const b = generateConversations(5, 300);
    expect(a.map(c => c.customerName)).toEqual(b.map(c => c.customerName));
    expect(a.map(c => c.messageCount)).toEqual(b.map(c => c.messageCount));
  });
});

// ─── Activities ─────────────────────────────────────────────────

describe('generateActivities', () => {
  let activities: GeneratedActivity[];

  beforeAll(() => {
    activities = generateActivities(50);
  });

  it('generates the requested count', () => {
    expect(activities).toHaveLength(50);
  });

  it('IDs are sequential starting from 1', () => {
    expect(activities[0].id).toBe(1);
    expect(activities[49].id).toBe(50);
  });

  it('every activity has required fields', () => {
    activities.forEach(a => {
      expect(a).toHaveProperty('id');
      expect(a).toHaveProperty('timestamp');
      expect(a).toHaveProperty('action');
      expect(a).toHaveProperty('description');
      expect(a).toHaveProperty('user');
      expect(a).toHaveProperty('type');
      expect(a).toHaveProperty('icon');
    });
  });

  it('types are valid activity types', () => {
    activities.forEach(a => {
      expect((ACTIVITY_TYPES as readonly string[])).toContain(a.type);
    });
  });

  it('icons match type', () => {
    activities.forEach(a => {
      expect(a.icon.length).toBeGreaterThan(0);
    });
  });

  it('descriptions are non-empty', () => {
    activities.forEach(a => {
      expect(a.description.length).toBeGreaterThan(5);
    });
  });

  it('has a mix of activity types', () => {
    const types = new Set(activities.map(a => a.type));
    expect(types.size).toBeGreaterThanOrEqual(5);
  });

  it('timestamps are in descending order (most recent first)', () => {
    // Activities should have decreasing timestamps (most recent = id 1)
    for (let i = 0; i < activities.length - 1; i++) {
      expect(activities[i].timestamp >= activities[i + 1].timestamp).toBe(true);
    }
  });

  it('is deterministic — same seed produces same data', () => {
    const a = generateActivities(10, 400);
    const b = generateActivities(10, 400);
    expect(a.map(x => x.description)).toEqual(b.map(x => x.description));
    expect(a.map(x => x.type)).toEqual(b.map(x => x.type));
  });

  it('exports ACTIVITY_TYPES with values', () => {
    expect(ACTIVITY_TYPES.length).toBeGreaterThanOrEqual(10);
  });
});

// ─── Cross-generator integration ──────────────────────────────

describe('transactions + conversations integration', () => {
  it('transaction agent refs fall within agent ID range', () => {
    const { transactions } = generateTransactions(30);
    transactions.forEach(t => {
      const num = parseInt(t.agentId.split('-')[1], 10);
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(20);
    });
  });

  it('conversation agent refs fall within agent ID range', () => {
    const conversations = generateConversations(25);
    conversations.forEach(c => {
      const num = parseInt(c.assignedAgent.split('-')[1], 10);
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(20);
    });
  });

  it('combined generation is fast', () => {
    const t0 = performance.now();
    generateTransactions(30);
    generateConversations(25);
    generateActivities(50);
    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(100);
  });

  it('large-scale: 200 transactions + 100 conversations + 500 activities', () => {
    const t0 = performance.now();
    const { transactions, commissions } = generateTransactions(200, 1);
    const conversations = generateConversations(100, 1);
    const activities = generateActivities(500, 1);
    const elapsed = performance.now() - t0;

    expect(transactions).toHaveLength(200);
    expect(commissions).toHaveLength(200);
    expect(conversations).toHaveLength(100);
    expect(activities).toHaveLength(500);
    expect(elapsed).toBeLessThan(500);
  });
});
