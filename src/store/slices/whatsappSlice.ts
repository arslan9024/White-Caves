/**
 * WhatsApp Redux State Management
 * 
 * Manages:
 * - Session state (connection, authentication)
 * - Messages (sending, receiving, history)
 * - Queue (pending messages)
 * - UI state (modals, loading states)
 */

import { createSlice, createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { logout } from '../authSlice';
import type { RootState } from '../store';
import { authFetch } from '../../utils/authFetch';

// ================================
// Types
// ================================

export interface WhatsAppSession {
  sessionId: string;
  ownerEmail: string;
  phoneNumber?: string;
  businessName?: string;
  connectionStatus: 'disconnected' | 'connecting' | 'qr_pending' | 'authenticated' | 'error';
  connectedAt?: Date;
  messageCount: number;
  autoReplyEnabled: boolean;
  chatbotEnabled: boolean;
}

export interface WhatsAppMessage {
  id: string;
  phoneNumber: string;
  body: string;
  type: 'text' | 'media';
  direction: 'sent' | 'received';
  timestamp: Date;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  retryCount?: number;
  priority?: 'high' | 'normal' | 'low';
}

export interface WhatsAppQueue {
  size: number;
  maxSize: number;
  processing: number;
  messages: WhatsAppMessage[];
}

export interface WhatsAppHealth {
  activeSessions: number;
  authenticatedSessions: number;
  uptime: number;
  status: 'operational' | 'degraded' | 'offline';
}

export interface WhatsAppState {
  session: WhatsAppSession | null;
  messages: WhatsAppMessage[];
  queue: WhatsAppQueue;
  health: WhatsAppHealth;
  loading: {
    connecting: boolean;
    disconnecting: boolean;
    sending: boolean;
    fetchingHistory: boolean;
  };
  error: string | null;
  success: string | null;
  qrCode: string | null;
  showModal: boolean;
  modalType: 'qr' | 'messages' | 'queue' | 'settings' | null;
}

// ================================
// Initial State
// ================================

const initialState: WhatsAppState = {
  session: null,
  messages: [],
  queue: {
    size: 0,
    maxSize: 100,
    processing: 0,
    messages: []
  },
  health: {
    activeSessions: 0,
    authenticatedSessions: 0,
    uptime: 0,
    status: 'offline'
  },
  loading: {
    connecting: false,
    disconnecting: false,
    sending: false,
    fetchingHistory: false
  },
  error: null,
  success: null,
  qrCode: null,
  showModal: false,
  modalType: null
};

// ================================
// Helpers
// ================================

/** Safely extract error message from a non-OK fetch Response */
async function extractErrorMessage(response: Response): Promise<string> {
  let errorData: Record<string, unknown> = {};
  try {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      errorData = await response.json();
    }
  } catch {
    // Response body not parseable — use default message
  }
  return (typeof errorData?.message === 'string' ? errorData.message : '') ||
         (typeof errorData?.error === 'string' ? errorData.error : '') ||
         `Request failed with status ${response.status}`;
}

// ================================
// Async Thunks
// ================================

export const initializeWhatsAppSession = createAsyncThunk(
  'whatsapp/initializeSession',
  async (
    { sessionId, ownerEmail }: { sessionId: string; ownerEmail: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authFetch('/api/whatsapp/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, ownerEmail })
      });

      if (!response.ok) {
        let errorData: Record<string, unknown> = {};
        try {
          const contentType = response.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            errorData = await response.json();
          }
        } catch {
          // Response body not parseable — use default message
        }
        const msg = (typeof errorData?.message === 'string' ? errorData.message : '') ||
                    (typeof errorData?.error === 'string' ? errorData.error : '') ||
                    `Request failed with status ${response.status}`;
        return rejectWithValue(msg);
      }

      return await response.json();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return rejectWithValue(message);
    }
  }
);

export const connectWhatsApp = createAsyncThunk(
  'whatsapp/connect',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/whatsapp/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionMethod: 'qr' })
      });

      if (!response.ok) {
        const msg = await extractErrorMessage(response);
        return rejectWithValue(msg);
      }

      return await response.json();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return rejectWithValue(message);
    }
  }
);

export const getSessionStatus = createAsyncThunk(
  'whatsapp/getSessionStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/whatsapp/session');

      if (!response.ok) {
        const msg = await extractErrorMessage(response);
        return rejectWithValue(msg);
      }

      return await response.json();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return rejectWithValue(message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'whatsapp/sendMessage',
  async (
    { phoneNumber, message, priority = 'normal' }: { phoneNumber: string; message: string; priority?: 'high' | 'normal' | 'low' },
    { rejectWithValue }
  ) => {
    try {
      const response = await authFetch('/api/whatsapp/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, message, priority })
      });

      if (!response.ok) {
        const msg = await extractErrorMessage(response);
        return rejectWithValue(msg);
      }

      return await response.json();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return rejectWithValue(message);
    }
  }
);

export const getQueueStatus = createAsyncThunk(
  'whatsapp/getQueueStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/whatsapp/queue-status');

      if (!response.ok) {
        const msg = await extractErrorMessage(response);
        return rejectWithValue(msg);
      }

      return await response.json();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return rejectWithValue(message);
    }
  }
);

export const disconnectWhatsApp = createAsyncThunk(
  'whatsapp/disconnect',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/whatsapp/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const msg = await extractErrorMessage(response);
        return rejectWithValue(msg);
      }

      return await response.json();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return rejectWithValue(message);
    }
  }
);

export const getServiceHealth = createAsyncThunk(
  'whatsapp/getServiceHealth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/whatsapp/health');

      if (!response.ok) {
        const msg = await extractErrorMessage(response);
        return rejectWithValue(msg);
      }

      return await response.json();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return rejectWithValue(message);
    }
  }
);

// ================================
// Slice
// ================================

const whatsappSlice = createSlice({
  name: 'whatsapp',
  initialState,
  reducers: {
    // Sync actions
    setQRCode: (state, action: PayloadAction<string>) => {
      state.qrCode = action.payload;
      state.showModal = true;
      state.modalType = 'qr';
    },
    clearQRCode: (state) => {
      state.qrCode = null;
      state.showModal = false;
      state.modalType = null;
    },
    addMessage: (state, action: PayloadAction<WhatsAppMessage>) => {
      state.messages.push(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    toggleModal: (state, action: PayloadAction<{ show: boolean; type?: 'qr' | 'messages' | 'queue' | 'settings' | null }>) => {
      state.showModal = action.payload.show;
      if (action.payload.type) {
        state.modalType = action.payload.type;
      }
    },
    updateSessionStatus: (state, action: PayloadAction<Partial<WhatsAppSession>>) => {
      if (state.session) {
        state.session = { ...state.session, ...action.payload };
      }
    },
    addQueuedMessage: (state, action: PayloadAction<WhatsAppMessage>) => {
      state.queue.messages.push(action.payload);
      state.queue.size = state.queue.messages.length;
    },
    removeQueuedMessage: (state, action: PayloadAction<string>) => {
      state.queue.messages = state.queue.messages.filter(m => m.id !== action.payload);
      state.queue.size = state.queue.messages.length;
    }
  },
  extraReducers: (builder) => {
    // Initialize Session
    builder
      .addCase(initializeWhatsAppSession.pending, (state) => {
        state.loading.connecting = true;
        state.error = null;
      })
      .addCase(initializeWhatsAppSession.fulfilled, (state, action) => {
        state.loading.connecting = false;
        state.session = action.payload.sessionId ? {
          sessionId: action.payload.sessionId,
          ownerEmail: action.payload.ownerEmail,
          connectionStatus: 'connecting' as const,
          messageCount: 0,
          autoReplyEnabled: false,
          chatbotEnabled: false,
        } : null;
        state.success = 'Session initialized';
      })
      .addCase(initializeWhatsAppSession.rejected, (state, action) => {
        state.loading.connecting = false;
        state.error = action.payload as string;
      });

    // Connect WhatsApp
    builder
      .addCase(connectWhatsApp.pending, (state) => {
        state.loading.connecting = true;
        state.error = null;
      })
      .addCase(connectWhatsApp.fulfilled, (state, action) => {
        state.loading.connecting = false;
        state.qrCode = action.payload.qrCode;
        state.showModal = true;
        state.modalType = 'qr';
        state.success = 'QR code generated. Scan to connect.';
      })
      .addCase(connectWhatsApp.rejected, (state, action) => {
        state.loading.connecting = false;
        state.error = action.payload as string;
      });

    // Get Session Status
    builder
      .addCase(getSessionStatus.fulfilled, (state, action) => {
        state.session = action.payload;
      })
      .addCase(getSessionStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Send Message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading.sending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading.sending = false;
        state.success = 'Message sent successfully';
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading.sending = false;
        state.error = action.payload as string;
      });

    // Get Queue Status
    builder
      .addCase(getQueueStatus.fulfilled, (state, action) => {
        state.queue = action.payload.queue;
      })
      .addCase(getQueueStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Disconnect
    builder
      .addCase(disconnectWhatsApp.pending, (state) => {
        state.loading.disconnecting = true;
        state.error = null;
      })
      .addCase(disconnectWhatsApp.fulfilled, (state) => {
        state.loading.disconnecting = false;
        state.session = null;
        state.messages = [];
        state.success = 'WhatsApp disconnected';
      })
      .addCase(disconnectWhatsApp.rejected, (state, action) => {
        state.loading.disconnecting = false;
        state.error = action.payload as string;
      });

    // Get Service Health
    builder
      .addCase(getServiceHealth.fulfilled, (state, action) => {
        state.health = action.payload.health;
      })
      .addCase(getServiceHealth.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // --- SECURITY: Reset all WhatsApp data on logout ---
    builder.addCase(logout, () => initialState);
  }
});

export const {
  setQRCode,
  clearQRCode,
  addMessage,
  clearError,
  clearSuccess,
  toggleModal,
  updateSessionStatus,
  addQueuedMessage,
  removeQueuedMessage
} = whatsappSlice.actions;

// ================================
// Selectors
// ================================

export const selectWhatsAppSession = (state: RootState) => state.whatsapp.session;
export const selectWhatsAppMessages = (state: RootState) => state.whatsapp.messages;
export const selectWhatsAppQueue = (state: RootState) => state.whatsapp.queue;
export const selectWhatsAppHealth = (state: RootState) => state.whatsapp.health;
export const selectWhatsAppLoading = (state: RootState) => state.whatsapp.loading;
export const selectWhatsAppError = (state: RootState) => state.whatsapp.error;
export const selectWhatsAppSuccess = (state: RootState) => state.whatsapp.success;
export const selectWhatsAppQRCode = (state: RootState) => state.whatsapp.qrCode;
export const selectWhatsAppModal = createSelector(
  (state: RootState) => state.whatsapp.showModal,
  (state: RootState) => state.whatsapp.modalType,
  (show, type) => ({ show, type })
);
export const selectWhatsAppIsConnected = (state: RootState) => 
  state.whatsapp.session?.connectionStatus === 'authenticated';
export const selectWhatsAppIsConnecting = (state: RootState) => 
  state.whatsapp.session?.connectionStatus === 'connecting' || 
  state.whatsapp.session?.connectionStatus === 'qr_pending';

export default whatsappSlice.reducer;
