/**
 * useWhatsAppData — Comprehensive Hook Tests
 *
 * Covers: initial state, conversation filtering, message sending,
 * AI auto-response, quick replies, agent assignment, priority colors,
 * timer cleanup, Nadia toggle
 */

import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// ── Mock external data ───────────────────────────────────────────
const MOCK_CONVERSATIONS = [
  {
    id: 'conv-1',
    contact: { name: 'Ahmed Khan', phone: '+971501234567', avatar: '👤', status: 'online' },
    lastMessage: 'Interested in apartments',
    unread: 2,
    time: '10:30',
    priority: 'hot',
    tags: ['buyer'],
    messages: [{ id: 1, type: 'received', text: 'Hello', time: '10:00', status: 'read' }],
  },
  {
    id: 'conv-2',
    contact: { name: 'Sara Ali', phone: '+971509876543', avatar: '👩', status: 'offline' },
    lastMessage: 'Send me details',
    unread: 0,
    time: '09:15',
    priority: 'warm',
    tags: ['seller'],
    messages: [{ id: 2, type: 'sent', text: 'Hi Sara', time: '09:00', status: 'delivered' }],
  },
  {
    id: 'conv-3',
    contact: { name: 'John Smith', phone: '+971507777777', avatar: '👨', status: 'away' },
    lastMessage: 'Not interested right now',
    unread: 0,
    time: '08:00',
    priority: 'cold',
    tags: [],
    messages: [],
  },
];

const MOCK_QUICK_REPLIES = [
  { id: 1, text: 'Thank you for your interest!' },
  { id: 2, text: 'I will send you the details shortly.' },
];

const MOCK_FEATURES = [
  {
    id: '1',
    name: 'Auto Response',
    description: 'Automated replies',
    category: 'Communication',
    status: 'active',
  },
];

// Mock authFetch — return NadiaConversationApiItem-shaped data that maps to expected Conversation objects.
// customerPhone is used as both name and phone by mapNadiaConversation, so include searchable text in it.
vi.mock('../../../../utils/authFetch', () => ({
  authFetch: vi.fn().mockImplementation(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          data: [
            {
              id: 'conv-1',
              customerPhone: 'Ahmed Khan',
              status: 'open',
              intent: 'buyer',
              leadScore: 75,
              updatedAt: new Date().toISOString(),
              messages: [
                {
                  id: '1',
                  direction: 'inbound',
                  body: 'Hello',
                  status: 'read',
                  timestamp: new Date().toISOString(),
                },
              ],
            },
            {
              id: 'conv-2',
              customerPhone: 'Sara Ali +971509876543',
              status: 'open',
              intent: 'seller',
              leadScore: 50,
              updatedAt: new Date().toISOString(),
              messages: [
                {
                  id: '2',
                  direction: 'outbound',
                  body: 'Hi Sara',
                  status: 'delivered',
                  timestamp: new Date().toISOString(),
                },
              ],
            },
            {
              id: 'conv-3',
              customerPhone: 'John Smith',
              status: 'open',
              intent: null,
              leadScore: 20,
              updatedAt: new Date().toISOString(),
              messages: [],
            },
          ],
        }),
    })
  ),
}));

vi.mock('../data/conversations', () => ({
  DUMMY_CONVERSATIONS: [
    {
      id: 'conv-1',
      contact: { name: 'Ahmed Khan', phone: '+971501234567', avatar: '👤', status: 'online' },
      lastMessage: 'Interested in apartments',
      unread: 2,
      time: '10:30',
      priority: 'hot',
      tags: ['buyer'],
      messages: [{ id: 1, type: 'received', text: 'Hello', time: '10:00', status: 'read' }],
    },
    {
      id: 'conv-2',
      contact: { name: 'Sara Ali', phone: '+971509876543', avatar: '👩', status: 'offline' },
      lastMessage: 'Send me details',
      unread: 0,
      time: '09:15',
      priority: 'warm',
      tags: ['seller'],
      messages: [{ id: 2, type: 'sent', text: 'Hi Sara', time: '09:00', status: 'delivered' }],
    },
    {
      id: 'conv-3',
      contact: { name: 'John Smith', phone: '+971507777777', avatar: '👨', status: 'away' },
      lastMessage: 'Not interested right now',
      unread: 0,
      time: '08:00',
      priority: 'cold',
      tags: [],
      messages: [],
    },
  ],
  QUICK_REPLIES: [
    { id: 1, text: 'Thank you for your interest!' },
    { id: 2, text: 'I will send you the details shortly.' },
  ],
}));

vi.mock('../data/features', () => ({
  NADIA_WHATSAPP_FEATURES: [
    {
      id: '1',
      name: 'Auto Response',
      description: 'Automated replies',
      category: 'Communication',
      status: 'active',
    },
  ],
}));

import { useWhatsAppData } from './useWhatsAppData';

describe('useWhatsAppData', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('returns all conversations after loading', async () => {
      const { result } = renderHook(() => useWhatsAppData());
      await waitFor(() => expect(result.current.conversations).toHaveLength(3));
    });

    it('returns null selected conversation', () => {
      const { result } = renderHook(() => useWhatsAppData());
      expect(result.current.selectedConversation).toBeNull();
    });

    it('returns empty message input', () => {
      const { result } = renderHook(() => useWhatsAppData());
      expect(result.current.messageInput).toBe('');
    });

    it('returns empty search query', () => {
      const { result } = renderHook(() => useWhatsAppData());
      expect(result.current.searchQuery).toBe('');
    });

    it('returns "all" filter priority', () => {
      const { result } = renderHook(() => useWhatsAppData());
      expect(result.current.filterPriority).toBe('all');
    });

    it('nadia is active by default', () => {
      const { result } = renderHook(() => useWhatsAppData());
      expect(result.current.nadiaActive).toBe(true);
    });

    it('returns quick replies', () => {
      const { result } = renderHook(() => useWhatsAppData());
      expect(result.current.quickReplies).toEqual(MOCK_QUICK_REPLIES);
    });

    it('returns features', () => {
      const { result } = renderHook(() => useWhatsAppData());
      expect(result.current.features).toEqual(MOCK_FEATURES);
    });
  });

  describe('conversation filtering', () => {
    it('filters by contact name', async () => {
      const { result } = renderHook(() => useWhatsAppData());
      await waitFor(() => expect(result.current.conversations).toHaveLength(3));
      act(() => {
        result.current.setSearchQuery('ahmed');
      });
      expect(result.current.filteredConversations).toHaveLength(1);
      expect(result.current.filteredConversations[0].id).toBe('conv-1');
    });

    it('filters by phone number', async () => {
      const { result } = renderHook(() => useWhatsAppData());
      await waitFor(() => expect(result.current.conversations).toHaveLength(3));
      act(() => {
        result.current.setSearchQuery('9876543');
      });
      expect(result.current.filteredConversations).toHaveLength(1);
      expect(result.current.filteredConversations[0].id).toBe('conv-2');
    });

    it('filters by priority', async () => {
      const { result } = renderHook(() => useWhatsAppData());
      await waitFor(() => expect(result.current.conversations).toHaveLength(3));
      act(() => {
        result.current.setFilterPriority('hot');
      });
      expect(result.current.filteredConversations).toHaveLength(1);
      expect(result.current.filteredConversations[0].id).toBe('conv-1');
    });

    it('combines search and priority filter', async () => {
      const { result } = renderHook(() => useWhatsAppData());
      await waitFor(() => expect(result.current.conversations).toHaveLength(3));
      act(() => {
        result.current.setSearchQuery('sara');
        result.current.setFilterPriority('warm');
      });
      expect(result.current.filteredConversations).toHaveLength(1);
      expect(result.current.filteredConversations[0].id).toBe('conv-2');
    });

    it('returns all conversations when filter is "all"', async () => {
      const { result } = renderHook(() => useWhatsAppData());
      await waitFor(() => expect(result.current.conversations).toHaveLength(3));
      act(() => {
        result.current.setFilterPriority('all');
      });
      expect(result.current.filteredConversations).toHaveLength(3);
    });

    it('returns empty array when no matches', async () => {
      const { result } = renderHook(() => useWhatsAppData());
      await waitFor(() => expect(result.current.conversations).toHaveLength(3));
      act(() => {
        result.current.setSearchQuery('nonexistent');
      });
      expect(result.current.filteredConversations).toHaveLength(0);
    });
  });

  describe('message sending', () => {
    it('does nothing when no message input', async () => {
      const { result } = renderHook(() => useWhatsAppData());
      await waitFor(() => expect(result.current.conversations).toHaveLength(3));
      act(() => {
        result.current.setSelectedConversation(MOCK_CONVERSATIONS[0] as Conversation);
        result.current.setMessageInput('');
      });
      act(() => {
        result.current.handleSendMessage();
      });
      expect(result.current.conversations[0].messages).toHaveLength(1);
    });

    it('does nothing when no conversation selected', async () => {
      const { result } = renderHook(() => useWhatsAppData());
      await waitFor(() => expect(result.current.conversations).toHaveLength(3));
      act(() => {
        result.current.setMessageInput('Hello');
      });
      act(() => {
        result.current.handleSendMessage();
      });
      // No crash, message still in input
    });

    it('adds message to conversation', async () => {
      const { result } = renderHook(() => useWhatsAppData());
      await waitFor(() => expect(result.current.conversations).toHaveLength(3));
      act(() => {
        result.current.setSelectedConversation({ ...MOCK_CONVERSATIONS[0] } as Conversation);
        result.current.setMessageInput('Test message');
      });
      act(() => {
        result.current.handleSendMessage();
      });
      const conv = result.current.conversations.find(c => c.id === 'conv-1');
      expect(conv!.messages).toHaveLength(2);
      expect(conv!.messages[1].text).toBe('Test message');
      expect(conv!.messages[1].type).toBe('sent');
    });

    it('clears message input after send', async () => {
      const { result } = renderHook(() => useWhatsAppData());
      await waitFor(() => expect(result.current.conversations).toHaveLength(3));
      act(() => {
        result.current.setSelectedConversation({ ...MOCK_CONVERSATIONS[0] } as Conversation);
        result.current.setMessageInput('Test message');
      });
      act(() => {
        result.current.handleSendMessage();
      });
      expect(result.current.messageInput).toBe('');
    });

    it('updates lastMessage on the conversation', async () => {
      const { result } = renderHook(() => useWhatsAppData());
      await waitFor(() => expect(result.current.conversations).toHaveLength(3));
      act(() => {
        result.current.setSelectedConversation({ ...MOCK_CONVERSATIONS[0] } as Conversation);
        result.current.setMessageInput('New last message');
      });
      act(() => {
        result.current.handleSendMessage();
      });
      const conv = result.current.conversations.find(c => c.id === 'conv-1');
      expect(conv!.lastMessage).toBe('New last message');
    });
  });

  describe('AI auto-response', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('adds AI response after timeout when Nadia is active', async () => {
      const { result } = renderHook(() => useWhatsAppData());
      // Flush API fetch Promises while fake timers are active
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
      });
      act(() => {
        result.current.setSelectedConversation({ ...MOCK_CONVERSATIONS[0] } as Conversation);
        result.current.setMessageInput('Hello AI');
      });
      act(() => {
        result.current.handleSendMessage();
      });
      // Before timeout: only user message added
      const convBefore = result.current.conversations.find(c => c.id === 'conv-1');
      expect(convBefore!.messages).toHaveLength(2);

      // After 2s timeout
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      const convAfter = result.current.conversations.find(c => c.id === 'conv-1');
      expect(convAfter!.messages).toHaveLength(3);
      expect(convAfter!.messages[2].type).toBe('ai');
      expect(convAfter!.messages[2].text).toContain('Nadia AI');
    });

    it('does not add AI response when Nadia is inactive', async () => {
      const { result } = renderHook(() => useWhatsAppData());
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
      });
      act(() => {
        result.current.setNadiaActive(false);
      });
      act(() => {
        result.current.setSelectedConversation({ ...MOCK_CONVERSATIONS[0] } as Conversation);
        result.current.setMessageInput('Hello');
      });
      act(() => {
        result.current.handleSendMessage();
      });
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      const conv = result.current.conversations.find(c => c.id === 'conv-1');
      expect(conv!.messages).toHaveLength(2); // Only original + sent
    });
  });

  describe('quick replies', () => {
    it('sets message input to quick reply text', () => {
      const { result } = renderHook(() => useWhatsAppData());
      act(() => {
        result.current.handleQuickReply('Thank you!');
      });
      expect(result.current.messageInput).toBe('Thank you!');
    });

    it('hides quick replies panel after selection', () => {
      const { result } = renderHook(() => useWhatsAppData());
      act(() => {
        result.current.setShowQuickReplies(true);
      });
      expect(result.current.showQuickReplies).toBe(true);
      act(() => {
        result.current.handleQuickReply('Hi');
      });
      expect(result.current.showQuickReplies).toBe(false);
    });
  });

  describe('agent assignment', () => {
    it('assigns agent and closes panel', () => {
      const { result } = renderHook(() => useWhatsAppData());
      act(() => {
        result.current.setShowAgentAssign(true);
      });
      expect(result.current.showAgentAssign).toBe(true);
      act(() => {
        result.current.handleAgentAssign('agent-1');
      });
      expect(result.current.assignedAgent).toBe('agent-1');
      expect(result.current.showAgentAssign).toBe(false);
    });
  });

  describe('priority colors', () => {
    it('returns red for hot priority', () => {
      const { result } = renderHook(() => useWhatsAppData());
      expect(result.current.getPriorityColor('hot')).toBe('#ef4444');
    });

    it('returns amber for warm priority', () => {
      const { result } = renderHook(() => useWhatsAppData());
      expect(result.current.getPriorityColor('warm')).toBe('#f59e0b');
    });

    it('returns blue for cold priority', () => {
      const { result } = renderHook(() => useWhatsAppData());
      expect(result.current.getPriorityColor('cold')).toBe('#3b82f6');
    });

    it('returns gray for unknown priority', () => {
      const { result } = renderHook(() => useWhatsAppData());
      expect(result.current.getPriorityColor('unknown')).toBe('#6b7280');
    });
  });

  describe('toggle states', () => {
    it('toggles features panel', () => {
      const { result } = renderHook(() => useWhatsAppData());
      expect(result.current.showFeatures).toBe(false);
      act(() => {
        result.current.setShowFeatures(true);
      });
      expect(result.current.showFeatures).toBe(true);
    });

    it('toggles Nadia active state', () => {
      const { result } = renderHook(() => useWhatsAppData());
      expect(result.current.nadiaActive).toBe(true);
      act(() => {
        result.current.setNadiaActive(false);
      });
      expect(result.current.nadiaActive).toBe(false);
    });
  });

  describe('cleanup', () => {
    it('cleans up timer on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      const { result, unmount } = renderHook(() => useWhatsAppData());

      act(() => {
        result.current.setSelectedConversation({ ...MOCK_CONVERSATIONS[0] } as Conversation);
        result.current.setMessageInput('Hello');
      });
      act(() => {
        result.current.handleSendMessage();
      });

      unmount();
      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });
  });
});
