/**
 * useWhatsAppSettings Hook
 * ========================
 * Extracted from WhatsAppSettingsPage — owns Redux state, WebSocket lifecycle,
 * settings CRUD, connection management, and test messaging.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createLogger } from '../utils/logger';
import { authFetch } from '../utils/authFetch';
import type { RootState, AppDispatch } from '../store/store';
import {
  connectWhatsApp,
  disconnectWhatsApp,
} from '../store/slices/whatsappSlice';

const log = createLogger('WhatsApp');

interface WhatsAppSettings {
  businessName: string;
  businessPhone: string;
  businessDescription: string;
  profileImage: string;
  webhookUrl: string;
  apiToken: string;
}

const MAX_RECONNECT_ATTEMPTS = 5;
const BASE_RECONNECT_DELAY_MS = 2000;

export function useWhatsAppSettings() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const whatsappState = useSelector((state: RootState) => state.whatsapp);

  // Local component state
  const [settings, setSettings] = useState<WhatsAppSettings>({
    businessName: '',
    businessPhone: '',
    businessDescription: '',
    profileImage: '',
    webhookUrl: '',
    apiToken: '',
  });
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [activeTab, setActiveTab] = useState('status');

  // Message testing state
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [sendingTest, setSendingTest] = useState(false);

  // WebSocket refs
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);
  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track component mount state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, []);

  // Authorization check
  useEffect(() => {
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch initial settings
  useEffect(() => {
    const controller = new AbortController();
    fetchSettings(controller.signal);
    return () => controller.abort();
  }, []);

  // WebSocket lifecycle
  useEffect(() => {
    if (whatsappState.session?.sessionId) {
      setupWebSocket();
    }
    return () => { cleanupWebSocket(); };
  }, [whatsappState.session?.sessionId]);

  // ─── WebSocket Methods ────────────────────────────────────────────

  const setupWebSocket = useCallback((): void => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/whatsapp/status`;

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        log.debug('WebSocket connected');
        reconnectAttemptsRef.current = 0;
      };

      wsRef.current.onmessage = (event: MessageEvent) => {
        try {
          JSON.parse(event.data);
          log.debug('Status update received');
        } catch (error) {
          log.error('Failed to parse WebSocket message', error);
        }
      };

      wsRef.current.onerror = (error: Event) => {
        log.error('WebSocket error', error);
      };

      wsRef.current.onclose = () => {
        log.debug('WebSocket disconnected');
        scheduleWebSocketReconnect();
      };
    } catch (error) {
      log.error('Failed to setup WebSocket', error);
    }
  }, []);

  const scheduleWebSocketReconnect = useCallback((): void => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      log.warn(`WebSocket reconnection failed after ${MAX_RECONNECT_ATTEMPTS} attempts. Giving up.`);
      return;
    }

    const delay = BASE_RECONNECT_DELAY_MS * Math.pow(2, reconnectAttemptsRef.current);
    reconnectAttemptsRef.current += 1;
    log.debug(`WebSocket reconnect attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms`);

    reconnectTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setupWebSocket();
      }
    }, delay);
  }, [setupWebSocket]);

  const cleanupWebSocket = useCallback((): void => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  // ─── Settings API Methods ─────────────────────────────────────────

  const fetchSettings = useCallback(async (signal?: AbortSignal): Promise<void> => {
    try {
      const response = await authFetch('/api/whatsapp/settings', { signal });
      if (response.ok) {
        const data = await response.json();
        if (isMountedRef.current) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      } else {
        log.warn(`Failed to fetch WhatsApp settings (HTTP ${response.status})`);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      log.error('Error fetching settings', error);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSaveSettings = useCallback(async (): Promise<void> => {
    try {
      setSaving(true);
      const response = await authFetch('/api/whatsapp/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSavedMessage('Settings saved successfully!');
        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) setSavedMessage('');
        }, 3000);
      } else {
        setSavedMessage('Error saving settings');
      }
    } catch (error) {
      log.error('Error saving settings', error);
      setSavedMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  }, [settings]);

  // ─── Connection Management ────────────────────────────────────────

  const handleInitializeConnection = useCallback(async (): Promise<void> => {
    try {
      const response = await authFetch('/api/whatsapp/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: `session_${Date.now()}`,
          ownerEmail: user?.email || '',
        }),
      });

      if (!response.ok) {
        setSavedMessage('Failed to initialize connection');
        return;
      }

      setSavedMessage('WhatsApp service initialized!');

      try {
        await dispatch(connectWhatsApp()).unwrap();
      } catch (dispatchError) {
        log.error('Redux dispatch error', dispatchError);
      }
    } catch (error) {
      log.error('Error initializing connection', error);
      setSavedMessage('Error initializing connection');
    }
  }, [user?.email, dispatch]);

  const handleDisconnect = useCallback(async (): Promise<void> => {
    try {
      const response = await authFetch('/api/whatsapp/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setSavedMessage('WhatsApp disconnected successfully');
        try {
          await dispatch(disconnectWhatsApp()).unwrap();
        } catch (dispatchError) {
          log.error('Redux dispatch error', dispatchError);
        }
      }
    } catch (error) {
      log.error('Error disconnecting', error);
      setSavedMessage('Error disconnecting');
    }
  }, [dispatch]);

  // ─── Message Testing ──────────────────────────────────────────────

  const handleSendTestMessage = useCallback(async (): Promise<void> => {
    if (!testPhone || !testMessage) {
      setSavedMessage('Please enter phone and message');
      return;
    }

    try {
      setSendingTest(true);
      const response = await authFetch('/api/whatsapp/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: testPhone,
          message: testMessage,
          priority: 'normal',
        }),
      });

      if (response.ok) {
        setSavedMessage('Test message sent successfully!');
        setTestMessage('');
        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) setSavedMessage('');
        }, 3000);
      } else {
        setSavedMessage('Failed to send test message');
      }
    } catch (error) {
      log.error('Error sending test message', error);
      setSavedMessage('Error sending test message');
    } finally {
      setSendingTest(false);
    }
  }, [testPhone, testMessage]);

  return {
    // Redux state
    whatsappState,
    // Settings
    settings,
    saving,
    savedMessage,
    activeTab,
    setActiveTab,
    handleChange,
    handleSaveSettings,
    // Connection
    handleInitializeConnection,
    handleDisconnect,
    // Test messaging
    testPhone,
    setTestPhone,
    testMessage,
    setTestMessage,
    sendingTest,
    handleSendTestMessage,
  };
}
