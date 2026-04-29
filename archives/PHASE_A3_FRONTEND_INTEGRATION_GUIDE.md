# Phase A3: Frontend WhatsApp Integration Guide

**Status**: READY FOR IMPLEMENTATION  
**Estimated Duration**: 3-4 hours  
**Priority**: HIGH  
**Dependencies**: Phase A2 COMPLETE ✅

---

## Overview

This guide walks through integrating the production-ready WhatsApp backend (Phase A2) into the White Caves frontend. The goal is to create a fully functional UI for WhatsApp connection, configuration, and message sending.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│             User Pages                              │
│  (WhatsAppSettingsPage.tsx)                         │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│          Redux State Management                     │
│  ├─ whatsappSlice (state + async thunks)           │
│  └─ Selectors (connection status, phone, etc)      │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│          React Components                           │
│  ├─ QRCodeScanner.tsx (polling, display)           │
│  ├─ ConnectionStatus.tsx (status indicator)        │
│  ├─ MessageTestForm.tsx (send messages)            │
│  └─ SessionConfig.tsx (settings)                   │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│        API Service Layer (whatsappAPI.ts)           │
│  ├─ connectWhatsApp()                              │
│  ├─ disconnectWhatsApp()                           │
│  ├─ getSessionStatus()                             │
│  ├─ getQRStatus()                                  │
│  ├─ sendMessage()                                  │
│  └─ getServiceHealth()                             │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│      Backend Express Routes (Phase A2) ✅           │
│  └─ 7 production endpoints (already implemented)   │
└─────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Step 1: Redux Setup (30 minutes)

#### 1.1 Create `whatsappSlice.ts`

```typescript
// src/redux/slices/whatsappSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import * as whatsappAPI from '../../services/whatsappAPI';

// Async Thunks
export const connectWhatsApp = createAsyncThunk(
  'whatsapp/connect',
  async (_, { rejectWithValue }) => {
    try {
      const response = await whatsappAPI.connectWhatsApp();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to connect');
    }
  }
);

export const getSessionStatus = createAsyncThunk(
  'whatsapp/getStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await whatsappAPI.getSessionStatus();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch status');
    }
  }
);

export const getQRStatus = createAsyncThunk(
  'whatsapp/getQRStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await whatsappAPI.getQRStatus();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch QR status');
    }
  }
);

export const disconnectWhatsApp = createAsyncThunk(
  'whatsapp/disconnect',
  async (_, { rejectWithValue }) => {
    try {
      const response = await whatsappAPI.disconnectWhatsApp();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to disconnect');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'whatsapp/sendMessage',
  async (
    { phoneNumber, message }: { phoneNumber: string; message: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await whatsappAPI.sendMessage(phoneNumber, message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to send message');
    }
  }
);

export const getServiceHealth = createAsyncThunk(
  'whatsapp/getHealth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await whatsappAPI.getServiceHealth();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch health');
    }
  }
);

// State Interface
interface WhatsAppState {
  sessionId: string | null;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error' | 'qr_pending';
  phoneNumber: string | null;
  businessName: string | null;
  connectedAt: string | null;
  messageCount: number;
  
  // QR Code
  qrCode: string | null;
  qrExpired: boolean;
  
  // Settings
  autoReplyEnabled: boolean;
  chatbotEnabled: boolean;
  businessHoursOnly: boolean;
  welcomeMessage: string;
  quickReplies: string[];
  
  // UI State
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  
  // Health
  isHealthy: boolean;
  uptime: number;
}

const initialState: WhatsAppState = {
  sessionId: null,
  connectionStatus: 'disconnected',
  phoneNumber: null,
  businessName: null,
  connectedAt: null,
  messageCount: 0,
  
  qrCode: null,
  qrExpired: false,
  
  autoReplyEnabled: false,
  chatbotEnabled: false,
  businessHoursOnly: false,
  welcomeMessage: 'Welcome to White Caves!',
  quickReplies: [],
  
  loading: false,
  error: null,
  successMessage: null,
  
  isHealthy: false,
  uptime: 0
};

const whatsappSlice = createSlice({
  name: 'whatsapp',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    setAutoReply: (state, action: PayloadAction<boolean>) => {
      state.autoReplyEnabled = action.payload;
    },
    setChatbot: (state, action: PayloadAction<boolean>) => {
      state.chatbotEnabled = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Connect WhatsApp
    builder
      .addCase(connectWhatsApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectWhatsApp.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionId = action.payload.sessionId;
        state.connectionStatus = action.payload.connectionStatus;
        state.qrCode = action.payload.qrCode;
        state.successMessage = 'WhatsApp connection initiated. Please scan QR code.';
      })
      .addCase(connectWhatsApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.connectionStatus = 'error';
      });

    // Get Session Status
    builder
      .addCase(getSessionStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSessionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionId = action.payload.sessionId;
        state.connectionStatus = action.payload.connectionStatus;
        state.phoneNumber = action.payload.phoneNumber;
        state.businessName = action.payload.businessName;
        state.connectedAt = action.payload.connectedAt;
        state.messageCount = action.payload.messageCount;
        state.autoReplyEnabled = action.payload.autoReplyEnabled;
        state.chatbotEnabled = action.payload.chatbotEnabled;
        state.welcomeMessage = action.payload.welcomeMessage;
        state.quickReplies = action.payload.quickReplies;
      })
      .addCase(getSessionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get QR Status (for polling)
    builder
      .addCase(getQRStatus.pending, (state) => {
        // Don't set loading for polling queries
      })
      .addCase(getQRStatus.fulfilled, (state, action) => {
        if (action.payload.authenticated) {
          state.connectionStatus = 'connected';
          state.phoneNumber = action.payload.phoneNumber;
          state.successMessage = 'WhatsApp connected successfully!';
        }
      })
      .addCase(getQRStatus.rejected, (state) => {
        // Silent fail on polling
      });

    // Disconnect WhatsApp
    builder
      .addCase(disconnectWhatsApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(disconnectWhatsApp.fulfilled, (state) => {
        state.loading = false;
        state.connectionStatus = 'disconnected';
        state.phoneNumber = null;
        state.sessionId = null;
        state.qrCode = null;
        state.successMessage = 'WhatsApp disconnected successfully.';
      })
      .addCase(disconnectWhatsApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Send Message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messageCount += 1;
        state.successMessage = `Message sent successfully (ID: ${action.payload.messageId})`;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Service Health
    builder
      .addCase(getServiceHealth.fulfilled, (state, action) => {
        state.isHealthy = action.payload.healthy;
        state.uptime = action.payload.status.uptime;
      });
  }
});

export const { clearError, clearSuccess, setAutoReply, setChatbot } = whatsappSlice.actions;

// Selectors
export const selectConnectionStatus = (state: any) => state.whatsapp.connectionStatus;
export const selectPhoneNumber = (state: any) => state.whatsapp.phoneNumber;
export const selectQRCode = (state: any) => state.whatsapp.qrCode;
export const selectMessageCount = (state: any) => state.whatsapp.messageCount;
export const selectLoading = (state: any) => state.whatsapp.loading;
export const selectError = (state: any) => state.whatsapp.error;
export const selectSuccess = (state: any) => state.whatsapp.successMessage;
export const selectAutoReply = (state: any) => state.whatsapp.autoReplyEnabled;
export const selectChatbot = (state: any) => state.whatsapp.chatbotEnabled;
export const selectIsHealthy = (state: any) => state.whatsapp.isHealthy;

export default whatsappSlice.reducer;
```

#### 1.2 Register in Redux Store

```typescript
// src/redux/store.ts - Add to configureStore

import whatsappReducer from './slices/whatsappSlice';

export const store = configureStore({
  reducer: {
    // ... existing reducers
    whatsapp: whatsappReducer
  }
});
```

---

### Step 2: API Service Layer (20 minutes)

#### 2.1 Create `whatsappAPI.ts`

```typescript
// src/services/whatsappAPI.ts

import axios from 'axios';

const API_BASE = '/api/whatsapp';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for auth token if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Initiate WhatsApp connection (QR code)
 */
export const connectWhatsApp = async (connectionMethod = 'qr') => {
  return api.post('/connect', { connectionMethod });
};

/**
 * Get current WhatsApp session status
 */
export const getSessionStatus = async () => {
  return api.get('/session');
};

/**
 * Poll for QR code status (for UI polling)
 */
export const getQRStatus = async () => {
  return api.get('/qr-status');
};

/**
 * Send a message via WhatsApp
 */
export const sendMessage = async (phoneNumber: string, message: string) => {
  return api.post('/send-message', { phoneNumber, message });
};

/**
 * Disconnect WhatsApp session
 */
export const disconnectWhatsApp = async () => {
  return api.post('/disconnect');
};

/**
 * Check service health
 */
export const getServiceHealth = async () => {
  return api.get('/service-health');
};

/**
 * Setup polling for QR code status
 */
export const setupQRPoller = (
  onStatusChange: (status: any) => void,
  intervalMs = 2000
) => {
  const pollerId = setInterval(async () => {
    try {
      const response = await getQRStatus();
      onStatusChange(response.data);
      
      // Stop polling if authenticated
      if (response.data.authenticated) {
        clearInterval(pollerId);
      }
    } catch (error) {
      console.error('QR polling error:', error);
    }
  }, intervalMs);

  return pollerId; // Return ID to allow clearing
};

export default api;
```

---

### Step 3: Components (1.5 - 2 hours)

#### 3.1 QR Code Scanner Component

```typescript
// src/components/WhatsApp/QRCodeScanner.tsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getQRStatus, selectConnectionStatus } from '../../redux/slices/whatsappSlice';
import { setupQRPoller } from '../../services/whatsappAPI';

const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  border: 2px dashed #ddd;
`;

const QRImage = styled.img`
  width: 300px;
  height: 300px;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StatusText = styled.p`
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  max-width: 300px;
`;

const WarningText = styled.p`
  font-size: 0.85rem;
  color: #e74c3c;
  background: #fadbd8;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
`;

interface QRCodeScannerProps {
  qrCode: string | null;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ qrCode }) => {
  const [pollerInterval, setPollerInterval] = useState<NodeJS.Timeout | null>(null);
  const dispatch = useDispatch();
  const connectionStatus = useSelector(selectConnectionStatus);

  useEffect(() => {
    if (!qrCode || connectionStatus === 'connected') {
      return;
    }

    // Start polling for QR status changes
    const pollerId = setupQRPoller((status) => {
      if (status.authenticated) {
        // Dispatch to update Redux state
        dispatch(getSessionStatus());
        clearInterval(pollerId);
      }
    }, 2000);

    setPollerInterval(pollerId);

    // Cleanup on unmount
    return () => {
      if (pollerId) clearInterval(pollerId);
    };
  }, [qrCode, connectionStatus, dispatch]);

  if (!qrCode) {
    return (
      <QRCodeContainer>
        <StatusText>
          Click "Connect WhatsApp" to generate QR code
        </StatusText>
      </QRCodeContainer>
    );
  }

  return (
    <QRCodeContainer>
      <h3>Scan with WhatsApp</h3>
      {qrCode.startsWith('data:image') ? (
        <QRImage src={qrCode} alt="WhatsApp QR Code" />
      ) : (
        <div style={{ fontSize: '0.9rem', color: '#666' }}>
          {qrCode}
        </div>
      )}
      <StatusText>
        📱 Open WhatsApp on your phone and scan the QR code
      </StatusText>
      <WarningText>
        ⏱️ QR code expires in 60 seconds. If it expires, click "Connect WhatsApp" again.
      </WarningText>
    </QRCodeContainer>
  );
};

export default QRCodeScanner;
```

#### 3.2 Connection Status Component

```typescript
// src/components/WhatsApp/ConnectionStatus.tsx

import React from 'react';
import styled from 'styled-components';

interface StatusBadgeProps {
  status: 'connected' | 'disconnected' | 'connecting' | 'error' | 'qr_pending';
}

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f0f8ff;
  border-radius: 8px;
  border-left: 4px solid #3498db;
`;

const StatusBadge = styled.span<StatusBadgeProps>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  
  ${(props) => {
    switch (props.status) {
      case 'connected':
        return `
          background: #d4edda;
          color: #155724;
          &::before {
            content: '●';
            color: #28a745;
          }
        `;
      case 'connecting':
        return `
          background: #fff3cd;
          color: #856404;
          &::before {
            content: '⟳';
            animation: spin 1s linear infinite;
          }
        `;
      case 'qr_pending':
        return `
          background: #cfe2ff;
          color: #084298;
          &::before {
            content: '📱';
          }
        `;
      case 'error':
        return `
          background: #f8d7da;
          color: #721c24;
          &::before {
            content: '⚠';
          }
        `;
      default:
        return `
          background: #e2e3e5;
          color: #383d41;
          &::before {
            content: '○';
          }
        `;
    }
  }}
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const InfoText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #555;
`;

interface ConnectionStatusProps {
  status: 'connected' | 'disconnected' | 'connecting' | 'error' | 'qr_pending';
  phoneNumber?: string | null;
  messageCount?: number;
  connectedAt?: string | null;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  status,
  phoneNumber,
  messageCount = 0,
  connectedAt
}) => {
  const getStatusLabel = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'qr_pending':
        return 'Waiting for QR Scan';
      case 'error':
        return 'Connection Error';
      default:
        return 'Disconnected';
    }
  };

  return (
    <StatusContainer>
      <div>
        <div style={{ marginBottom: '0.5rem' }}>
          <StatusBadge status={status}>{getStatusLabel()}</StatusBadge>
        </div>
        {phoneNumber && (
          <InfoText>
            📱 Connected to: <strong>{phoneNumber}</strong>
          </InfoText>
        )}
        {messageCount > 0 && (
          <InfoText>
            💬 Messages sent: <strong>{messageCount}</strong>
          </InfoText>
        )}
        {connectedAt && (
          <InfoText>
            🕐 Connected since: <strong>{new Date(connectedAt).toLocaleString()}</strong>
          </InfoText>
        )}
      </div>
    </StatusContainer>
  );
};

export default ConnectionStatus;
```

#### 3.3 Message Test Form Component

```typescript
// src/components/WhatsApp/MessageTestForm.tsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { sendMessage, selectLoading, selectError, selectSuccess } from '../../redux/slices/whatsappSlice';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #25d366;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover:not(:disabled) {
    background: #20ba58;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const AlertMessage = styled.div<{ type: 'success' | 'error' }>`
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  background: ${(props) => (props.type === 'success' ? '#d4edda' : '#f8d7da')};
  color: ${(props) => (props.type === 'success' ? '#155724' : '#721c24')};
  border: 1px solid ${(props) => (props.type === 'success' ? '#c3e6cb' : '#f5c6cb')};
`;

interface MessageTestFormProps {
  isConnected: boolean;
}

export const MessageTestForm: React.FC<MessageTestFormProps> = ({ isConnected }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.trim() || !message.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Dispatch send message
    dispatch(sendMessage({ phoneNumber, message }) as any);

    // Clear form
    setPhoneNumber('');
    setMessage('');
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h3>📤 Send Test Message</h3>

      {error && <AlertMessage type="error">❌ {error}</AlertMessage>}
      {success && <AlertMessage type="success">✅ {success}</AlertMessage>}

      <FormGroup>
        <Label htmlFor="phone">Recipient Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+971501234567"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={!isConnected || loading}
          required
        />
        <small style={{ color: '#666' }}>
          Format: +[country code][number] or 971501234567
        </small>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!isConnected || loading}
          required
        />
        <small style={{ color: '#666' }}>
          Character count: {message.length}
        </small>
      </FormGroup>

      <Button type="submit" disabled={!isConnected || loading}>
        {loading ? '📤 Sending...' : '📤 Send Message'}
      </Button>
    </FormContainer>
  );
};

export default MessageTestForm;
```

#### 3.4 Main WhatsApp Settings Page

```typescript
// src/pages/WhatsAppSettingsPage.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  connectWhatsApp,
  disconnectWhatsApp,
  getSessionStatus,
  getServiceHealth,
  selectConnectionStatus,
  selectPhoneNumber,
  selectQRCode,
  selectMessageCount,
  selectLoading,
  selectError,
  selectSuccess,
  selectIsHealthy,
  clearError,
  clearSuccess
} from '../redux/slices/whatsappSlice';
import { ConnectionStatus } from '../components/WhatsApp/ConnectionStatus';
import { QRCodeScanner } from '../components/WhatsApp/QRCodeScanner';
import { MessageTestForm } from '../components/WhatsApp/MessageTestForm';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  p {
    color: #666;
    margin: 0;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
`;

const PrimaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #25d366;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover:not(:disabled) {
    background: #20ba58;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const DangerButton = styled(PrimaryButton)`
  background: #e74c3c;

  &:hover:not(:disabled) {
    background: #c0392b;
  }
`;

const SecondaryButton = styled(PrimaryButton)`
  background: #3498db;

  &:hover:not(:disabled) {
    background: #2980b9;
  }
`;

const AlertMessage = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  background: ${(props) => {
    switch (props.type) {
      case 'success':
        return '#d4edda';
      case 'error':
        return '#f8d7da';
      case 'info':
        return '#d1ecf1';
      default:
        return '#f0f0f0';
    }
  }};
  color: ${(props) => {
    switch (props.type) {
      case 'success':
        return '#155724';
      case 'error':
        return '#721c24';
      case 'info':
        return '#0c5460';
      default:
        return '#333';
    }
  }};
  border: 1px solid ${(props) => {
    switch (props.type) {
      case 'success':
        return '#c3e6cb';
      case 'error':
        return '#f5c6cb';
      case 'info':
        return '#bee5eb';
      default:
        return '#ddd';
    }
  }};
`;

export const WhatsAppSettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const connectionStatus = useSelector(selectConnectionStatus);
  const phoneNumber = useSelector(selectPhoneNumber);
  const qrCode = useSelector(selectQRCode);
  const messageCount = useSelector(selectMessageCount);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const isHealthy = useSelector(selectIsHealthy);

  const isConnected = connectionStatus === 'connected';

  useEffect(() => {
    // Fetch initial session status
    dispatch(getSessionStatus() as any);
    dispatch(getServiceHealth() as any);

    // Clear messages after 5 seconds
    const timer = setTimeout(() => {
      if (error) dispatch(clearError());
      if (success) dispatch(clearSuccess());
    }, 5000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleConnect = () => {
    dispatch(connectWhatsApp() as any);
  };

  const handleDisconnect = () => {
    if (confirm('Are you sure you want to disconnect WhatsApp?')) {
      dispatch(disconnectWhatsApp() as any);
    }
  };

  const handleRefresh = () => {
    dispatch(getSessionStatus() as any);
    dispatch(getServiceHealth() as any);
  };

  return (
    <PageContainer>
      <Header>
        <h1>📱 WhatsApp Settings</h1>
        <p>Manage your WhatsApp connection and send test messages</p>
      </Header>

      {error && <AlertMessage type="error">❌ {error}</AlertMessage>}
      {success && <AlertMessage type="success">✅ {success}</AlertMessage>}

      <ConnectionStatus
        status={connectionStatus}
        phoneNumber={phoneNumber}
        messageCount={messageCount}
      />

      <ButtonGroup>
        {!isConnected ? (
          <PrimaryButton onClick={handleConnect} disabled={loading}>
            {loading ? '⏳ Connecting...' : '🔗 Connect WhatsApp'}
          </PrimaryButton>
        ) : (
          <DangerButton onClick={handleDisconnect} disabled={loading}>
            {loading ? '⏳ Disconnecting...' : '🔌 Disconnect'}
          </DangerButton>
        )}
        <SecondaryButton onClick={handleRefresh} disabled={loading}>
          🔄 Refresh Status
        </SecondaryButton>
      </ButtonGroup>

      <ContentGrid>
        <div>
          <h2>Scan QR Code</h2>
          <QRCodeScanner qrCode={qrCode} />
        </div>

        <div>
          <MessageTestForm isConnected={isConnected} />
        </div>
      </ContentGrid>

      {isHealthy && (
        <AlertMessage type="info">
          ✅ WhatsApp service is healthy and operational
        </AlertMessage>
      )}
    </PageContainer>
  );
};

export default WhatsAppSettingsPage;
```

---

### Step 4: Routing (10 minutes)

Add to your router configuration:

```typescript
// src/router/routes.ts or App.tsx

import WhatsAppSettingsPage from '../pages/WhatsAppSettingsPage';

// Add this route
{
  path: '/admin/whatsapp-settings',
  element: <ProtectedRoute><WhatsAppSettingsPage /></ProtectedRoute>,
  label: 'WhatsApp Settings',
  icon: '📱'
}
```

---

## Integration Testing Checklist

### ✅ Manual Testing
- [ ] Click "Connect WhatsApp" → QR code displays
- [ ] Scan QR with phone → "Waiting for QR Scan" status
- [ ] After phone auth → "Connected" status with phone number
- [ ] Message form activates when connected
- [ ] Send test message → Success message appears
- [ ] Refresh status → Shows correct message count
- [ ] Click "Disconnect" → Returns to disconnected state

### ✅ Error Handling
- [ ] Try to send without connecting → Error message
- [ ] Try to send without phone number → Error message
- [ ] QR expires (wait 60s) → Can request new QR
- [ ] Network error → Proper error message
- [ ] Service unhealthy → Health check shows error

### ✅ Browser Console
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] All Redux actions logged correctly
- [ ] API calls successful

---

## Performance Considerations

1. **QR Code Polling**: Default 2-second interval (configurable)
2. **Session Refresh**: Manual with "Refresh Status" button
3. **Message Form**: Disables inputs while sending
4. **Redux DevTools**: Install to debug state changes

---

## Next Steps After A3

When Phase A3 is complete:

1. **Phase A4: E2E Testing**
   - Write comprehensive tests
   - Test all user flows
   - Performance benchmarks

2. **Phase A5: Production Deployment**
   - Deploy to staging
   - User acceptance testing
   - Production release

---

## Support & Debugging

**Issue: QR code not displaying**
- Check backend is running: `npm run dev`
- Verify `/api/whatsapp/connect` endpoint works
- Check Redux DevTools for state updates

**Issue: Messages not sending**
- Verify WhatsApp is authenticated (check status)
- Check phone number format (include country code)
- Check service health: `GET /api/whatsapp/service-health`

**Issue: Redux state not updating**
- Open Redux DevTools (install extension)
- Look for action dispatches
- Check for errors in Redux slice reducers

---

**Status**: READY TO IMPLEMENT  
**Estimated Time**: 3-4 hours  
**Next Milestone**: Phase A4 E2E Testing

---
