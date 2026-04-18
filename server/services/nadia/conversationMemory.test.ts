/**
 * conversationMemory � Test Suite
 * 19 tests covering ConversationMemory class
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./ninaEngine', () => ({
  Intent: {
    PROPERTY_SEARCH: 'property_search',
    SCHEDULE_TOUR: 'schedule_tour',
    MAKE_OFFER: 'make_offer',
    FINANCING: 'financing',
    COMPLAINT: 'complaint',
    GENERAL_INQUIRY: 'general_inquiry',
    INFORMATION_REQUEST: 'information_request',
  },
}));

import { ConversationMemory } from './conversationMemory';

describe('ConversationMemory', () => {
  let memory: ConversationMemory;

  beforeEach(() => {
    memory = new ConversationMemory();
  });

  it('creates an instance', () => {
    expect(memory).toBeInstanceOf(ConversationMemory);
  });

  it('has getOrCreateContext method', () => {
    expect(typeof memory.getOrCreateContext).toBe('function');
  });

  it('has updateContext method', () => {
    expect(typeof memory.updateContext).toBe('function');
  });

  it('has getContext method', () => {
    expect(typeof memory.getContext).toBe('function');
  });

  it('has extractCustomerInfo method', () => {
    expect(typeof memory.extractCustomerInfo).toBe('function');
  });

  it('has predictNextIntents method', () => {
    expect(typeof memory.predictNextIntents).toBe('function');
  });

  it('has clearOldConversations method', () => {
    expect(typeof memory.clearOldConversations).toBe('function');
  });

  it('has getStats method', () => {
    expect(typeof memory.getStats).toBe('function');
  });

  it('has exportConversation method', () => {
    expect(typeof memory.exportConversation).toBe('function');
  });

  it('getOrCreateContext creates new context', () => {
    const ctx = memory.getOrCreateContext('conv_1');
    expect(ctx).toBeDefined();
    expect(ctx.conversationId).toBe('conv_1');
  });

  it('getOrCreateContext returns same context for same id', () => {
    const ctx1 = memory.getOrCreateContext('conv_1');
    const ctx2 = memory.getOrCreateContext('conv_1');
    expect(ctx1).toBe(ctx2);
  });

  it('getOrCreateContext has empty messageHistory', () => {
    const ctx = memory.getOrCreateContext('conv_new');
    expect(ctx.messageHistory).toEqual([]);
  });

  it('getContext returns undefined for unknown id', () => {
    const ctx = memory.getContext('unknown');
    expect(ctx).toBeUndefined();
  });

  it('getContext returns context after creation', () => {
    memory.getOrCreateContext('conv_1');
    const ctx = memory.getContext('conv_1');
    expect(ctx).toBeDefined();
    expect(ctx!.conversationId).toBe('conv_1');
  });

  it('getStats returns object with totalConversations', () => {
    const stats = memory.getStats();
    expect(stats).toHaveProperty('totalConversations');
    expect(typeof stats.totalConversations).toBe('number');
  });

  it('getStats counts created contexts', () => {
    memory.getOrCreateContext('a');
    memory.getOrCreateContext('b');
    const stats = memory.getStats();
    expect(stats.totalConversations).toBe(2);
  });

  it('exportConversation returns null for unknown', () => {
    const result = memory.exportConversation('unknown');
    expect(result).toBeNull();
  });

  it('exportConversation returns context for known', () => {
    memory.getOrCreateContext('conv_1');
    const result = memory.exportConversation('conv_1');
    expect(result).toBeDefined();
    expect(result!.conversationId).toBe('conv_1');
  });

  it('clearOldConversations does not throw', () => {
    memory.getOrCreateContext('conv_1');
    expect(() => memory.clearOldConversations()).not.toThrow();
  });
});
