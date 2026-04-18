import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('./ninaEngine', () => ({
  Intent: {
    PROPERTY_INQUIRY: 'PROPERTY_INQUIRY',
    VIEWING_REQUEST: 'VIEWING_REQUEST',
    PURCHASE_INTEREST: 'PURCHASE_INTEREST',
    COMPLAINT: 'COMPLAINT',
    GREETING: 'GREETING',
    UNKNOWN: 'UNKNOWN',
  },
}));

import { ConversationMemory } from './conversationMemory';

function makeMsg(content: string, overrides: Record<string, unknown> = {}) {
  return { id: 'msg-' + Date.now(), conversationId: 'tc', content, sender: 'CUSTOMER', timestamp: new Date(), ...overrides };
}
function makeIR(intent = 'PROPERTY_INQUIRY') {
  return { primary: { intent, confidence: 0.9 }, sentiment: { sentiment: 'NEUTRAL', score: 0 }, suggestedResponse: 'r', entities: [], topics: [], requiresAgentHandoff: false, timestamp: Date.now() };
}

describe('ConversationMemory', () => {
  let memory: ConversationMemory;
  beforeEach(() => { memory = new ConversationMemory(); });

  describe('getOrCreateContext', () => {
    it('creates new', () => { const c = memory.getOrCreateContext('n'); expect(c.conversationId).toBe('n'); });
    it('returns same', () => { expect(memory.getOrCreateContext('a')).toBe(memory.getOrCreateContext('a')); });
    it('empty arrays', () => { const c = memory.getOrCreateContext('a'); expect(c.recentIntents).toEqual([]); expect(c.patterns).toEqual([]); });
    it('timestamps', () => { const c = memory.getOrCreateContext('a'); expect(c.createdAt).toBeInstanceOf(Date); });
    it('duration 0', () => { expect(memory.getOrCreateContext('a').duration).toBe(0); });
  });

  describe('updateContext', () => {
    it('adds message', () => { memory.getOrCreateContext('u'); memory.updateContext('u', makeMsg('hi', { conversationId: 'u' }) as any, makeIR() as any); expect(memory.getOrCreateContext('u').messageHistory.length).toBe(1); });
    it('updates intents', () => { memory.getOrCreateContext('u2'); const r = memory.updateContext('u2', makeMsg('v', { conversationId: 'u2' }) as any, makeIR('PROPERTY_INQUIRY') as any); expect(r.recentIntents).toContain('PROPERTY_INQUIRY'); });
  });

  describe('getContext', () => {
    it('undefined for unknown', () => { expect(memory.getContext('no')).toBeUndefined(); });
    it('returns after create', () => { memory.getOrCreateContext('e'); expect(memory.getContext('e')).toBeDefined(); });
  });

  describe('extractCustomerInfo', () => {
    it('extracts name', () => { const c = memory.getOrCreateContext('n'); memory.extractCustomerInfo(c, 'My name is John Smith'); expect(c.customerName).toBe('John Smith'); });
    it('no overwrite', () => { const c = memory.getOrCreateContext('k'); c.customerName = 'O'; memory.extractCustomerInfo(c, 'My name is New'); expect(c.customerName).toBe('O'); });
  });

  describe('predictNextIntents', () => {
    it('returns array', () => { expect(Array.isArray(memory.predictNextIntents(memory.getOrCreateContext('p')))).toBe(true); });
    it('empty for fresh', () => { expect(memory.predictNextIntents(memory.getOrCreateContext('p2'))).toEqual([]); });
  });

  describe('clearOldConversations', () => {
    it('removes old', () => { const c = memory.getOrCreateContext('old'); c.lastUpdateTime = new Date(Date.now() - 90000000); memory.clearOldConversations(); expect(memory.getContext('old')).toBeUndefined(); });
    it('keeps recent', () => { memory.getOrCreateContext('r'); memory.clearOldConversations(); expect(memory.getContext('r')).toBeDefined(); });
  });

  describe('getStats', () => {
    it('totalConversations', () => { memory.getOrCreateContext('s1'); memory.getOrCreateContext('s2'); expect(memory.getStats().totalConversations).toBe(2); });
    it('0 for empty', () => { expect(memory.getStats().totalConversations).toBe(0); });
    it('totalMessages', () => { expect(typeof memory.getStats().totalMessages).toBe('number'); });
    it('averageThemes', () => { expect(typeof memory.getStats().averageThemes).toBe('number'); });
  });

  describe('exportConversation', () => {
    it('exports existing', () => { memory.getOrCreateContext('e'); const x = memory.exportConversation('e'); expect(x).toBeDefined(); expect(x!.conversationId).toBe('e'); });
    it('null for unknown', () => { expect(memory.exportConversation('nope')).toBeNull(); });
  });
});
