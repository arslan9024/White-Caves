/**
 * Linda Redux Slice
 *
 * State management for the Linda WhatsApp LocalAuth bot channel.
 * Follows the same conventions as nadiaSlice.ts.
 *
 * State covers:
 * - Connection status (status, isConnected, qrCode)
 * - Session list (for multi-bot support)
 * - Statistics (messagesSent, messagesReceived, etc.)
 * - Broadcast campaign state
 * - Conversation / message list (for admin monitoring)
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { authFetch } from '../../utils/authFetch';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface LindaSession {
  botId: string;
  role: string;
  status: string;
  isConnected: boolean;
  messagesSent: number;
  messagesReceived: number;
  reconnectAttempts: number;
}

export interface LindaStats {
  status: string;
  isConnected: boolean;
  queuedMessages: number;
  reconnectAttempts: number;
  messagesSent: number;
  messagesReceived: number;
  enabled: boolean;
}

export interface LindaBroadcastResult {
  accepted: boolean;
  recipients: number;
  channel: string;
  timestamp: string;
}

export interface LindaConversation {
  id: string;
  name: string;
  unreadCount: number;
  lastMessage?: string;
}

interface LindaState {
  // Connection
  status: string;
  isConnected: boolean;
  qrCode: string | null;

  // Sessions
  sessions: LindaSession[];

  // Statistics
  stats: LindaStats | null;

  // Conversations (monitoring)
  conversations: LindaConversation[];

  // Broadcast
  lastBroadcastResult: LindaBroadcastResult | null;
  broadcastLoading: boolean;

  // UI state
  loading: boolean;
  error: string | null;
  lastRefreshed: string | null;
}

const initialState: LindaState = {
  status: 'DISCONNECTED',
  isConnected: false,
  qrCode: null,
  sessions: [],
  stats: null,
  conversations: [],
  lastBroadcastResult: null,
  broadcastLoading: false,
  loading: false,
  error: null,
  lastRefreshed: null,
};

// ─── Async Thunks ───────────────────────────────────────────────────────────

export const fetchLindaStats = createAsyncThunk<LindaStats, void, { rejectValue: string }>(
  'linda/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authFetch('/api/linda/stats');
      const json = (await res.json()) as { success: boolean; data: LindaStats; error?: string };
      if (!json.success) return rejectWithValue(json.error ?? 'Failed to fetch Linda stats');
      return json.data;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Network error');
    }
  }
);

export const fetchLindaSessions = createAsyncThunk<LindaSession[], void, { rejectValue: string }>(
  'linda/fetchSessions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authFetch('/api/linda/sessions');
      const json = (await res.json()) as {
        success: boolean;
        data: { sessions: LindaSession[] };
        error?: string;
      };
      if (!json.success) return rejectWithValue(json.error ?? 'Failed to fetch sessions');
      return json.data.sessions;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Network error');
    }
  }
);

export const fetchLindaQR = createAsyncThunk<string | null, void, { rejectValue: string }>(
  'linda/fetchQR',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authFetch('/api/linda/qr');
      const json = (await res.json()) as {
        success: boolean;
        data: { qr: string | null };
        error?: string;
      };
      if (!json.success) return rejectWithValue(json.error ?? 'Failed to fetch QR');
      return json.data.qr;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Network error');
    }
  }
);

export const connectLinda = createAsyncThunk<void, void, { rejectValue: string }>(
  'linda/connect',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await authFetch('/api/linda/connect', { method: 'POST' });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!json.success) return rejectWithValue(json.error ?? 'Connect failed');
      // After connecting, fetch QR
      setTimeout(() => {
        dispatch(fetchLindaQR());
      }, 3000);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Network error');
    }
  }
);

export const disconnectLinda = createAsyncThunk<void, void, { rejectValue: string }>(
  'linda/disconnect',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authFetch('/api/linda/disconnect', { method: 'POST' });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (!json.success) return rejectWithValue(json.error ?? 'Disconnect failed');
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Network error');
    }
  }
);

export const sendLindaBroadcast = createAsyncThunk<
  LindaBroadcastResult,
  { phoneNumbers: string[]; message: string },
  { rejectValue: string }
>('linda/broadcast', async ({ phoneNumbers, message }, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/linda/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumbers, message }),
    });
    const json = (await res.json()) as {
      success: boolean;
      data: LindaBroadcastResult;
      error?: string;
    };
    if (!json.success) return rejectWithValue(json.error ?? 'Broadcast failed');
    return json.data;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Network error');
  }
});

export const fetchLindaConversations = createAsyncThunk<
  LindaConversation[],
  void,
  { rejectValue: string }
>('linda/fetchConversations', async (_, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/linda/conversations');
    const json = (await res.json()) as {
      success: boolean;
      data: { conversations: LindaConversation[] };
      error?: string;
    };
    if (!json.success) return rejectWithValue(json.error ?? 'Failed to fetch conversations');
    return json.data.conversations;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Network error');
  }
});

// ─── Slice ──────────────────────────────────────────────────────────────────

const lindaSlice = createSlice({
  name: 'linda',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setQRCode: (state, action: PayloadAction<string | null>) => {
      state.qrCode = action.payload;
    },
    updateStatus: (state, action: PayloadAction<{ status: string; isConnected: boolean }>) => {
      state.status = action.payload.status;
      state.isConnected = action.payload.isConnected;
    },
  },
  extraReducers: builder => {
    // fetchLindaStats
    builder
      .addCase(fetchLindaStats.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLindaStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.status = action.payload.status;
        state.isConnected = action.payload.isConnected;
        state.lastRefreshed = new Date().toISOString();
      })
      .addCase(fetchLindaStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch stats';
      });

    // fetchLindaSessions
    builder
      .addCase(fetchLindaSessions.fulfilled, (state, action) => {
        state.sessions = action.payload;
      })
      .addCase(fetchLindaSessions.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to fetch sessions';
      });

    // fetchLindaQR
    builder
      .addCase(fetchLindaQR.fulfilled, (state, action) => {
        state.qrCode = action.payload;
      })
      .addCase(fetchLindaQR.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to fetch QR';
      });

    // connectLinda
    builder
      .addCase(connectLinda.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectLinda.fulfilled, state => {
        state.loading = false;
        state.status = 'AUTHENTICATING';
      })
      .addCase(connectLinda.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Connect failed';
      });

    // disconnectLinda
    builder
      .addCase(disconnectLinda.fulfilled, state => {
        state.isConnected = false;
        state.status = 'DISCONNECTED';
        state.qrCode = null;
      })
      .addCase(disconnectLinda.rejected, (state, action) => {
        state.error = action.payload ?? 'Disconnect failed';
      });

    // sendLindaBroadcast
    builder
      .addCase(sendLindaBroadcast.pending, state => {
        state.broadcastLoading = true;
        state.error = null;
      })
      .addCase(sendLindaBroadcast.fulfilled, (state, action) => {
        state.broadcastLoading = false;
        state.lastBroadcastResult = action.payload;
      })
      .addCase(sendLindaBroadcast.rejected, (state, action) => {
        state.broadcastLoading = false;
        state.error = action.payload ?? 'Broadcast failed';
      });

    // fetchLindaConversations
    builder
      .addCase(fetchLindaConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
      })
      .addCase(fetchLindaConversations.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to fetch conversations';
      });
  },
});

export const { clearError, setQRCode, updateStatus } = lindaSlice.actions;

// ─── Selectors ──────────────────────────────────────────────────────────────

export const selectLindaStats = (state: RootState) => state.linda?.stats ?? null;
export const selectLindaStatus = (state: RootState) => state.linda?.status ?? 'DISCONNECTED';
export const selectLindaIsConnected = (state: RootState) => state.linda?.isConnected ?? false;
export const selectLindaQRCode = (state: RootState) => state.linda?.qrCode ?? null;
export const selectLindaSessions = (state: RootState) => state.linda?.sessions ?? [];
export const selectLindaError = (state: RootState) => state.linda?.error ?? null;
export const selectLindaLoading = (state: RootState) => state.linda?.loading ?? false;
export const selectLindaBroadcastLoading = (state: RootState) =>
  state.linda?.broadcastLoading ?? false;
export const selectLindaConversations = (state: RootState) => state.linda?.conversations ?? [];

export default lindaSlice.reducer;
