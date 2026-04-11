/**
 * NADIA Redux Slice - State Management
 * Handles conversations, messages, queue, and polling coordination
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import nadiaAPI from '@/services/nadiaAPI';
import {
  Conversation,
  Message,
  QueuedConversation,
  QueueStats,
  NadiaState,
  ListConversationsQuery,
  SendMessagePayload,
  AssignAgentPayload,
} from '@/types/nadia';

/**
 * Initial State
 */
const initialState: NadiaState = {
  conversations: [],
  messages: [],
  queue: [],
  stats: {
    totalQueued: 0,
    byPriority: { URGENT: 0, HIGH: 0, NORMAL: 0, LOW: 0 },
    avgResponseTimeMinutes: 0,
    agentAvailability: 0,
    oldestInQueueMinutes: 0,
  },
  selectedConversationId: null,
  loading: false,
  error: null,
  lastUpdated: null,
  lastMessageSent: null,
};

/**
 * Async Thunks
 */

/**
 * Fetch all conversations
 */
export const fetchConversations = createAsyncThunk<
  Conversation[],
  ListConversationsQuery | undefined,
  { rejectValue: string }
>(
  'nadia/fetchConversations',
  async (query, { rejectWithValue }) => {
    try {
      return await nadiaAPI.conversations.list(query);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch conversations'
      );
    }
  }
);

/**
 * Fetch messages for a specific conversation
 */
export const fetchMessages = createAsyncThunk<
  { conversationId: string; messages: Message[] },
  string,
  { rejectValue: string }
>(
  'nadia/fetchMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const messages = await nadiaAPI.messages.listByConversation(conversationId, 0, 100);
      return { conversationId, messages };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch messages'
      );
    }
  }
);

/**
 * Send a message in a conversation
 */
export const sendMessage = createAsyncThunk<
  Message,
  { conversationId: string; content: string; sender: 'CUSTOMER' | 'AGENT' },
  { rejectValue: string }
>(
  'nadia/sendMessage',
  async (payload, { rejectWithValue }) => {
    try {
      return await nadiaAPI.messages.send(payload.conversationId, {
        conversationId: payload.conversationId,
        content: payload.content,
        sender: payload.sender,
      });
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to send message'
      );
    }
  }
);

/**
 * Fetch queue
 */
export const fetchQueue = createAsyncThunk<
  { queue: QueuedConversation[]; stats: QueueStats },
  undefined,
  { rejectValue: string }
>(
  'nadia/fetchQueue',
  async (_, { rejectWithValue }) => {
    try {
      const [queue, stats] = await Promise.all([
        nadiaAPI.queue.list(),
        nadiaAPI.queue.getStats(),
      ]);
      return { queue, stats };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch queue'
      );
    }
  }
);

/**
 * Assign agent to queued conversation
 */
export const assignAgent = createAsyncThunk<
  QueuedConversation,
  AssignAgentPayload,
  { rejectValue: string }
>(
  'nadia/assignAgent',
  async (payload, { rejectWithValue }) => {
    try {
      return await nadiaAPI.queue.assignAgent(payload.queueId, payload.agentPhone);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to assign agent'
      );
    }
  }
);

/**
 * Close conversation
 */
export const closeConversation = createAsyncThunk<
  Conversation,
  { conversationId: string; reason?: string },
  { rejectValue: string }
>(
  'nadia/closeConversation',
  async (payload, { rejectWithValue }) => {
    try {
      return await nadiaAPI.conversations.close(payload.conversationId, payload.reason);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to close conversation'
      );
    }
  }
);

/**
 * Redux Slice
 */
const nadiaSlice = createSlice({
  name: 'nadia',
  initialState,
  reducers: {
    /**
     * Select a conversation
     */
    selectConversation: (state, action: PayloadAction<string | null>) => {
      state.selectedConversationId = action.payload;
    },

    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Reset state
     */
    resetNadia: () => initialState,
  },
  extraReducers: (builder) => {
    /**
     * Fetch Conversations Handlers
     */
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
        state.lastUpdated = new Date();
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch conversations';
      });

    /**
     * Fetch Messages Handlers
     */
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
        state.lastUpdated = new Date();
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch messages';
      });

    /**
     * Send Message Handlers
     */
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
        state.lastMessageSent = new Date();
        state.lastUpdated = new Date();
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send message';
      });

    /**
     * Fetch Queue Handlers
     */
    builder
      .addCase(fetchQueue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQueue.fulfilled, (state, action) => {
        state.loading = false;
        state.queue = action.payload.queue;
        state.stats = action.payload.stats;
        state.lastUpdated = new Date();
      })
      .addCase(fetchQueue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch queue';
      });

    /**
     * Assign Agent Handlers
     */
    builder
      .addCase(assignAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignAgent.fulfilled, (state, action) => {
        state.loading = false;
        // Remove assigned conversation from queue
        state.queue = state.queue.filter((q) => q.queueId !== action.payload.queueId);
        // Update in conversations if exists
        const convId = action.payload.conversationId;
        const conv = state.conversations.find((c) => c.id === convId);
        if (conv) {
          conv.assignedAgent = action.payload.queueId;
          conv.status = 'ACTIVE';
        }
        state.lastUpdated = new Date();
      })
      .addCase(assignAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to assign agent';
      });

    /**
     * Close Conversation Handlers
     */
    builder
      .addCase(closeConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(closeConversation.fulfilled, (state, action) => {
        state.loading = false;
        // Update in conversations
        const index = state.conversations.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.conversations[index] = action.payload;
        }
        // Clear selection if closed conversation was selected
        if (state.selectedConversationId === action.payload.id) {
          state.selectedConversationId = null;
        }
        state.lastUpdated = new Date();
      })
      .addCase(closeConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to close conversation';
      });
  },
});

/**
 * Actions
 */
export const { selectConversation, clearError, resetNadia } = nadiaSlice.actions;

/**
 * Selectors
 */
export const selectNadiaConversations = (state: RootState) => state.nadia.conversations;
export const selectNadiaMessages = (state: RootState) => state.nadia.messages;
export const selectNadiaQueue = (state: RootState) => state.nadia.queue;
export const selectNadiaStats = (state: RootState) => state.nadia.stats;
export const selectSelectedConversationId = (state: RootState) =>
  state.nadia.selectedConversationId;
export const selectSelectedConversation = (state: RootState) => {
  const id = state.nadia.selectedConversationId;
  return state.nadia.conversations.find((c: any) => c.id === id) || null;
};
export const selectNadiaLoading = (state: RootState) => state.nadia.loading;
export const selectNadiaError = (state: RootState) => state.nadia.error;
export const selectNadiaLastUpdated = (state: RootState) => state.nadia.lastUpdated;

/**
 * Derived Selectors
 */
export const selectConversationCount = (state: RootState) =>
  state.nadia.conversations.length;
export const selectQueuedCount = (state: RootState) => state.nadia.queue.length;
export const selectUrgentCount = (state: RootState) =>
  state.nadia.stats.byPriority.URGENT;
export const selectHighPriorityCount = (state: RootState) =>
  state.nadia.stats.byPriority.HIGH;
export const selectActiveConversations = (state: RootState) =>
  state.nadia.conversations.filter((c: any) => c.status === 'ACTIVE');
export const selectHotLeads = (state: RootState) =>
  state.nadia.conversations
    .filter((c: any) => c.leadScore >= 75)
    .sort((a: any, b: any) => b.leadScore - a.leadScore);

/**
 * Reducer Export
 */
export default nadiaSlice.reducer;
