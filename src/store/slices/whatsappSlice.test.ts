import { describe, it, expect } from 'vitest';
import reducer, {
  setQRCode,
  clearQRCode,
  addMessage,
  clearError,
  clearSuccess,
  toggleModal,
  updateSessionStatus,
  addQueuedMessage,
  removeQueuedMessage,
  initializeWhatsAppSession,
  connectWhatsApp,
  getSessionStatus,
  sendMessage,
  getQueueStatus,
  disconnectWhatsApp,
  getServiceHealth,
  selectWhatsAppSession,
  selectWhatsAppMessages,
  selectWhatsAppQueue,
  selectWhatsAppHealth,
  selectWhatsAppLoading,
  selectWhatsAppError,
  selectWhatsAppSuccess,
  selectWhatsAppQRCode,
  selectWhatsAppModal,
  selectWhatsAppIsConnected,
  selectWhatsAppIsConnecting,
} from './whatsappSlice';
import { logout } from '../authSlice';
import type { WhatsAppMessage, WhatsAppSession } from './whatsappSlice';
import type { RootState } from '../store';

// ─── Helpers ───────────────────────────────────────────────────────
const initialState = () => reducer(undefined, { type: '@@INIT' });
type WaState = ReturnType<typeof initialState>;

const makeMessage = (id: string, overrides: Partial<WhatsAppMessage> = {}): WhatsAppMessage => ({
  id,
  phoneNumber: '+971501234567',
  body: 'Test message',
  type: 'text',
  direction: 'sent',
  timestamp: new Date('2026-01-01T00:00:00Z'),
  status: 'sent',
  ...overrides,
});

const makeSession = (overrides: Partial<WhatsAppSession> = {}): WhatsAppSession => ({
  sessionId: 'sess-1',
  ownerEmail: 'owner@whitecaves.com',
  connectionStatus: 'authenticated',
  messageCount: 0,
  autoReplyEnabled: false,
  chatbotEnabled: false,
  ...overrides,
});

const rootWith = (overrides: Partial<WaState> = {}) =>
  ({ whatsapp: { ...initialState(), ...overrides } }) as unknown as RootState;

// ─── Initial State ────────────────────────────────────────────────
describe('whatsappSlice', () => {
  describe('initial state', () => {
    it('starts with null session', () => {
      expect(initialState().session).toBeNull();
    });

    it('starts with empty messages', () => {
      expect(initialState().messages).toEqual([]);
    });

    it('starts with default queue', () => {
      const q = initialState().queue;
      expect(q.size).toBe(0);
      expect(q.maxSize).toBe(100);
      expect(q.processing).toBe(0);
      expect(q.messages).toEqual([]);
    });

    it('starts with offline health', () => {
      expect(initialState().health.status).toBe('offline');
    });

    it('starts with all loading flags false', () => {
      const l = initialState().loading;
      expect(l.connecting).toBe(false);
      expect(l.disconnecting).toBe(false);
      expect(l.sending).toBe(false);
      expect(l.fetchingHistory).toBe(false);
    });

    it('starts with no error, success, qrCode, modal', () => {
      const s = initialState();
      expect(s.error).toBeNull();
      expect(s.success).toBeNull();
      expect(s.qrCode).toBeNull();
      expect(s.showModal).toBe(false);
      expect(s.modalType).toBeNull();
    });
  });

  // ─── Sync Actions ──────────────────────────────────────────────
  describe('setQRCode', () => {
    it('sets QR code and opens QR modal', () => {
      const state = reducer(initialState(), setQRCode('qr-data-url'));
      expect(state.qrCode).toBe('qr-data-url');
      expect(state.showModal).toBe(true);
      expect(state.modalType).toBe('qr');
    });
  });

  describe('clearQRCode', () => {
    it('clears QR code and closes modal', () => {
      let state = reducer(initialState(), setQRCode('qr'));
      state = reducer(state, clearQRCode());
      expect(state.qrCode).toBeNull();
      expect(state.showModal).toBe(false);
      expect(state.modalType).toBeNull();
    });
  });

  describe('addMessage', () => {
    it('appends a message to the list', () => {
      const msg = makeMessage('m-1');
      const state = reducer(initialState(), addMessage(msg));
      expect(state.messages).toHaveLength(1);
      expect(state.messages[0].id).toBe('m-1');
    });

    it('appends multiple messages', () => {
      let state = initialState();
      state = reducer(state, addMessage(makeMessage('m-1')));
      state = reducer(state, addMessage(makeMessage('m-2')));
      expect(state.messages).toHaveLength(2);
    });
  });

  describe('clearError / clearSuccess', () => {
    it('clearError sets error to null', () => {
      const prev = { ...initialState(), error: 'Something went wrong' };
      const state = reducer(prev, clearError());
      expect(state.error).toBeNull();
    });

    it('clearSuccess sets success to null', () => {
      const prev = { ...initialState(), success: 'Great!' };
      const state = reducer(prev, clearSuccess());
      expect(state.success).toBeNull();
    });
  });

  describe('toggleModal', () => {
    it('opens modal with type', () => {
      const state = reducer(initialState(), toggleModal({ show: true, type: 'messages' }));
      expect(state.showModal).toBe(true);
      expect(state.modalType).toBe('messages');
    });

    it('closes modal', () => {
      let state = reducer(initialState(), toggleModal({ show: true, type: 'settings' }));
      state = reducer(state, toggleModal({ show: false }));
      expect(state.showModal).toBe(false);
    });

    it('preserves modalType when type not provided on close', () => {
      let state = reducer(initialState(), toggleModal({ show: true, type: 'queue' }));
      state = reducer(state, toggleModal({ show: false }));
      expect(state.modalType).toBe('queue'); // type not cleared
    });
  });

  describe('updateSessionStatus', () => {
    it('updates session fields when session exists', () => {
      const prev: WaState = {
        ...initialState(),
        session: makeSession({ connectionStatus: 'connecting' }),
      };
      const state = reducer(prev, updateSessionStatus({ connectionStatus: 'authenticated' }));
      expect(state.session?.connectionStatus).toBe('authenticated');
    });

    it('does nothing when session is null', () => {
      const state = reducer(initialState(), updateSessionStatus({ connectionStatus: 'authenticated' }));
      expect(state.session).toBeNull();
    });

    it('preserves other session fields', () => {
      const prev: WaState = {
        ...initialState(),
        session: makeSession({ messageCount: 5 }),
      };
      const state = reducer(prev, updateSessionStatus({ autoReplyEnabled: true }));
      expect(state.session?.messageCount).toBe(5);
      expect(state.session?.autoReplyEnabled).toBe(true);
    });
  });

  describe('queue management', () => {
    it('addQueuedMessage adds message and updates size', () => {
      const msg = makeMessage('q-1');
      const state = reducer(initialState(), addQueuedMessage(msg));
      expect(state.queue.messages).toHaveLength(1);
      expect(state.queue.size).toBe(1);
    });

    it('removeQueuedMessage removes message and updates size', () => {
      let state = reducer(initialState(), addQueuedMessage(makeMessage('q-1')));
      state = reducer(state, addQueuedMessage(makeMessage('q-2')));
      expect(state.queue.size).toBe(2);

      state = reducer(state, removeQueuedMessage('q-1'));
      expect(state.queue.size).toBe(1);
      expect(state.queue.messages[0].id).toBe('q-2');
    });

    it('removeQueuedMessage with non-existent id does nothing harmful', () => {
      let state = reducer(initialState(), addQueuedMessage(makeMessage('q-1')));
      state = reducer(state, removeQueuedMessage('nonexistent'));
      expect(state.queue.size).toBe(1);
    });
  });

  // ─── Async Thunks (reducer cases) ──────────────────────────────
  describe('initializeWhatsAppSession', () => {
    const args = { sessionId: 's-1', ownerEmail: 'test@test.com' };

    it('pending → loading.connecting = true, error = null', () => {
      const state = reducer(initialState(), initializeWhatsAppSession.pending('req-1', args));
      expect(state.loading.connecting).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled → creates session, sets success', () => {
      const payload = { sessionId: 's-1', ownerEmail: 'test@test.com' };
      const state = reducer(
        initialState(),
        initializeWhatsAppSession.fulfilled(payload, 'req-1', args)
      );
      expect(state.loading.connecting).toBe(false);
      expect(state.session?.sessionId).toBe('s-1');
      expect(state.session?.connectionStatus).toBe('connecting');
      expect(state.success).toBe('Session initialized');
    });

    it('fulfilled with no sessionId → session is null', () => {
      const payload = { sessionId: '', ownerEmail: '' };
      const state = reducer(
        initialState(),
        initializeWhatsAppSession.fulfilled(payload, 'req-1', args)
      );
      expect(state.session).toBeNull();
    });

    it('rejected → error set, loading stopped', () => {
      const state = reducer(
        initialState(),
        initializeWhatsAppSession.rejected(null, 'req-1', args, 'Session init failed')
      );
      expect(state.loading.connecting).toBe(false);
      expect(state.error).toBe('Session init failed');
    });
  });

  describe('connectWhatsApp', () => {
    it('pending → loading.connecting = true', () => {
      const state = reducer(initialState(), connectWhatsApp.pending('req-1'));
      expect(state.loading.connecting).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled → shows QR code, opens modal', () => {
      const payload = { qrCode: 'qr-image-data' };
      const state = reducer(
        initialState(),
        connectWhatsApp.fulfilled(payload, 'req-1')
      );
      expect(state.loading.connecting).toBe(false);
      expect(state.qrCode).toBe('qr-image-data');
      expect(state.showModal).toBe(true);
      expect(state.modalType).toBe('qr');
      expect(state.success).toContain('QR code');
    });

    it('rejected → error set', () => {
      const state = reducer(
        initialState(),
        connectWhatsApp.rejected(null, 'req-1', undefined, 'Connection failed')
      );
      expect(state.loading.connecting).toBe(false);
      expect(state.error).toBe('Connection failed');
    });
  });

  describe('getSessionStatus', () => {
    it('fulfilled → sets session', () => {
      const session = makeSession();
      const state = reducer(
        initialState(),
        getSessionStatus.fulfilled(session, 'req-1')
      );
      expect(state.session).toEqual(session);
    });

    it('rejected → sets error', () => {
      const state = reducer(
        initialState(),
        getSessionStatus.rejected(null, 'req-1', undefined, 'Status check failed')
      );
      expect(state.error).toBe('Status check failed');
    });
  });

  describe('sendMessage', () => {
    const args = { phoneNumber: '+971501234567', message: 'Hello' };

    it('pending → loading.sending = true', () => {
      const state = reducer(initialState(), sendMessage.pending('req-1', args));
      expect(state.loading.sending).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled → success message, loading stopped', () => {
      const state = reducer(
        initialState(),
        sendMessage.fulfilled({ success: true }, 'req-1', args)
      );
      expect(state.loading.sending).toBe(false);
      expect(state.success).toContain('sent');
    });

    it('rejected → error set', () => {
      const state = reducer(
        initialState(),
        sendMessage.rejected(null, 'req-1', args, 'Send failed')
      );
      expect(state.loading.sending).toBe(false);
      expect(state.error).toBe('Send failed');
    });
  });

  describe('getQueueStatus', () => {
    it('fulfilled → updates queue', () => {
      const queue = { size: 5, maxSize: 100, processing: 2, messages: [] };
      const state = reducer(
        initialState(),
        getQueueStatus.fulfilled({ queue }, 'req-1')
      );
      expect(state.queue).toEqual(queue);
    });

    it('rejected → error set', () => {
      const state = reducer(
        initialState(),
        getQueueStatus.rejected(null, 'req-1', undefined, 'Queue fetch failed')
      );
      expect(state.error).toBe('Queue fetch failed');
    });
  });

  describe('disconnectWhatsApp', () => {
    it('pending → loading.disconnecting = true', () => {
      const state = reducer(initialState(), disconnectWhatsApp.pending('req-1'));
      expect(state.loading.disconnecting).toBe(true);
    });

    it('fulfilled → clears session and messages', () => {
      const prev: WaState = {
        ...initialState(),
        session: makeSession(),
        messages: [makeMessage('m-1')],
      };
      const state = reducer(prev, disconnectWhatsApp.fulfilled({}, 'req-1'));
      expect(state.loading.disconnecting).toBe(false);
      expect(state.session).toBeNull();
      expect(state.messages).toEqual([]);
      expect(state.success).toContain('disconnected');
    });

    it('rejected → error set', () => {
      const state = reducer(
        initialState(),
        disconnectWhatsApp.rejected(null, 'req-1', undefined, 'Disconnect failed')
      );
      expect(state.loading.disconnecting).toBe(false);
      expect(state.error).toBe('Disconnect failed');
    });
  });

  describe('getServiceHealth', () => {
    it('fulfilled → updates health', () => {
      const health = { activeSessions: 3, authenticatedSessions: 2, uptime: 99.9, status: 'operational' as const };
      const state = reducer(
        initialState(),
        getServiceHealth.fulfilled({ health }, 'req-1')
      );
      expect(state.health).toEqual(health);
    });

    it('rejected → error set', () => {
      const state = reducer(
        initialState(),
        getServiceHealth.rejected(null, 'req-1', undefined, 'Health check failed')
      );
      expect(state.error).toBe('Health check failed');
    });
  });

  // ─── logout (extraReducer) ─────────────────────────────────────
  describe('logout', () => {
    it('resets to initial state on logout', () => {
      const prev: WaState = {
        ...initialState(),
        session: makeSession(),
        messages: [makeMessage('m-1')],
        error: 'old error',
        qrCode: 'qr-data',
      };
      const state = reducer(prev, logout());
      expect(state).toEqual(initialState());
    });
  });

  // ─── Selectors ─────────────────────────────────────────────────
  describe('selectors', () => {
    it('selectWhatsAppSession', () => {
      const session = makeSession();
      expect(selectWhatsAppSession(rootWith({ session }))).toEqual(session);
      expect(selectWhatsAppSession(rootWith())).toBeNull();
    });

    it('selectWhatsAppMessages', () => {
      const msgs = [makeMessage('m-1')];
      expect(selectWhatsAppMessages(rootWith({ messages: msgs }))).toHaveLength(1);
      expect(selectWhatsAppMessages(rootWith())).toEqual([]);
    });

    it('selectWhatsAppQueue', () => {
      expect(selectWhatsAppQueue(rootWith()).size).toBe(0);
    });

    it('selectWhatsAppHealth', () => {
      expect(selectWhatsAppHealth(rootWith()).status).toBe('offline');
    });

    it('selectWhatsAppLoading', () => {
      const l = selectWhatsAppLoading(rootWith());
      expect(l.connecting).toBe(false);
      expect(l.sending).toBe(false);
    });

    it('selectWhatsAppError / selectWhatsAppSuccess', () => {
      expect(selectWhatsAppError(rootWith())).toBeNull();
      expect(selectWhatsAppError(rootWith({ error: 'fail' }))).toBe('fail');
      expect(selectWhatsAppSuccess(rootWith())).toBeNull();
      expect(selectWhatsAppSuccess(rootWith({ success: 'ok' }))).toBe('ok');
    });

    it('selectWhatsAppQRCode', () => {
      expect(selectWhatsAppQRCode(rootWith())).toBeNull();
      expect(selectWhatsAppQRCode(rootWith({ qrCode: 'data' }))).toBe('data');
    });

    it('selectWhatsAppModal', () => {
      const result = selectWhatsAppModal(rootWith({ showModal: true, modalType: 'settings' }));
      expect(result).toEqual({ show: true, type: 'settings' });
    });

    it('selectWhatsAppIsConnected', () => {
      expect(selectWhatsAppIsConnected(rootWith())).toBe(false);
      expect(selectWhatsAppIsConnected(
        rootWith({ session: makeSession({ connectionStatus: 'authenticated' }) })
      )).toBe(true);
      expect(selectWhatsAppIsConnected(
        rootWith({ session: makeSession({ connectionStatus: 'connecting' }) })
      )).toBe(false);
    });

    it('selectWhatsAppIsConnecting', () => {
      expect(selectWhatsAppIsConnecting(rootWith())).toBe(false);
      expect(selectWhatsAppIsConnecting(
        rootWith({ session: makeSession({ connectionStatus: 'connecting' }) })
      )).toBe(true);
      expect(selectWhatsAppIsConnecting(
        rootWith({ session: makeSession({ connectionStatus: 'qr_pending' }) })
      )).toBe(true);
      expect(selectWhatsAppIsConnecting(
        rootWith({ session: makeSession({ connectionStatus: 'authenticated' }) })
      )).toBe(false);
    });
  });

  // ─── Action Sequences ─────────────────────────────────────────
  describe('action sequences', () => {
    it('connect flow: init → QR → authenticate → send → disconnect', () => {
      const args = { sessionId: 's-1', ownerEmail: 'test@test.com' };
      let state = initialState();

      // Init
      state = reducer(state, initializeWhatsAppSession.pending('r1', args));
      expect(state.loading.connecting).toBe(true);
      state = reducer(state, initializeWhatsAppSession.fulfilled(
        { sessionId: 's-1', ownerEmail: 'test@test.com' },
        'r1', args
      ));
      expect(state.session?.connectionStatus).toBe('connecting');

      // QR code
      state = reducer(state, setQRCode('qr-data'));
      expect(state.qrCode).toBe('qr-data');

      // Authenticated
      state = reducer(state, updateSessionStatus({ connectionStatus: 'authenticated' }));
      expect(state.session?.connectionStatus).toBe('authenticated');

      state = reducer(state, clearQRCode());
      expect(state.qrCode).toBeNull();

      // Send message
      const msgArgs = { phoneNumber: '+971-123', message: 'Hello' };
      state = reducer(state, sendMessage.pending('r2', msgArgs));
      state = reducer(state, sendMessage.fulfilled({ success: true }, 'r2', msgArgs));
      expect(state.loading.sending).toBe(false);

      // Disconnect
      state = reducer(state, disconnectWhatsApp.fulfilled({}, 'r3'));
      expect(state.session).toBeNull();
    });

    it('error → clear → retry flow', () => {
      let state = reducer(
        initialState(),
        connectWhatsApp.rejected(null, 'r1', undefined, 'Network error')
      );
      expect(state.error).toBe('Network error');

      state = reducer(state, clearError());
      expect(state.error).toBeNull();

      state = reducer(state, connectWhatsApp.fulfilled({ qrCode: 'qr' }, 'r2'));
      expect(state.qrCode).toBe('qr');
      expect(state.error).toBeNull();
    });
  });
});
