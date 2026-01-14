import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API calls
export const fetchWhatsAppSession = createAsyncThunk(
  'whatsapp/fetchSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/whatsapp/session');
      if (!response.ok) throw new Error('Failed to fetch session');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWhatsAppStats = createAsyncThunk(
  'whatsapp/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/whatsapp/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWhatsAppContacts = createAsyncThunk(
  'whatsapp/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/whatsapp/contacts');
      if (!response.ok) throw new Error('Failed to fetch contacts');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWhatsAppMessages = createAsyncThunk(
  'whatsapp/fetchMessages',
  async (contactId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/whatsapp/messages/${contactId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendWhatsAppMessage = createAsyncThunk(
  'whatsapp/sendMessage',
  async ({ contactId, message }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/whatsapp/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId, message })
      });
      if (!response.ok) throw new Error('Failed to send message');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const connectWhatsApp = createAsyncThunk(
  'whatsapp/connect',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/whatsapp/connect', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to connect');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const disconnectWhatsApp = createAsyncThunk(
  'whatsapp/disconnect',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/whatsapp/disconnect', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to disconnect');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  session: null,
  stats: null,
  contacts: [],
  messages: [],
  connected: false,
  loading: false,
  error: null,
  lastFetch: null,
  activeContact: null,
  pollingInterval: null,
  messageInput: '',
  sendingMessage: false,
};

const whatsappSlice = createSlice({
  name: 'whatsapp',
  initialState,
  reducers: {
    setActiveContact: (state, action) => {
      state.activeContact = action.payload;
    },
    setMessageInput: (state, action) => {
      state.messageInput = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Optimistic message add
    optimisticAddMessage: (state, action) => {
      state.messages.push(action.payload);
      state.messageInput = '';
    },
    // Start/stop polling
    setPollingInterval: (state, action) => {
      state.pollingInterval = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch Session
    builder
      .addCase(fetchWhatsAppSession.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.connected = action.payload.session.connected;
        state.error = null;
      })
      .addCase(fetchWhatsAppSession.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Fetch Stats
    builder
      .addCase(fetchWhatsAppStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWhatsAppStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.lastFetch = Date.now();
      })
      .addCase(fetchWhatsAppStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Contacts
    builder
      .addCase(fetchWhatsAppContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWhatsAppContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.contacts;
        state.lastFetch = Date.now();
      })
      .addCase(fetchWhatsAppContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Messages
    builder
      .addCase(fetchWhatsAppMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWhatsAppMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
        state.lastFetch = Date.now();
      })
      .addCase(fetchWhatsAppMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Send Message
    builder
      .addCase(sendWhatsAppMessage.pending, (state) => {
        state.sendingMessage = true;
        state.error = null;
      })
      .addCase(sendWhatsAppMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;
        // Message already added optimistically, just reset input
        state.messageInput = '';
        state.error = null;
      })
      .addCase(sendWhatsAppMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.payload;
      });

    // Connect
    builder
      .addCase(connectWhatsApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectWhatsApp.fulfilled, (state) => {
        state.loading = false;
        state.connected = true;
        state.error = null;
      })
      .addCase(connectWhatsApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Disconnect
    builder
      .addCase(disconnectWhatsApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(disconnectWhatsApp.fulfilled, (state) => {
        state.loading = false;
        state.connected = false;
        state.error = null;
      })
      .addCase(disconnectWhatsApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setActiveContact,
  setMessageInput,
  clearError,
  optimisticAddMessage,
  setPollingInterval
} = whatsappSlice.actions;

export default whatsappSlice.reducer;
