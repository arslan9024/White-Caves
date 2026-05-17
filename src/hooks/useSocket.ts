/**
 * useSocket — Real-time Socket.io hook
 *
 * Manages the Socket.io connection lifecycle tied to the current user session
 * and dispatches incoming server events to Redux so any component can react
 * to real-time updates without polling.
 *
 * Events handled:
 *   whatsapp:meta:message   → addNotification (Meta / Nadia pipeline)
 *   whatsapp:linda:message  → addNotification (Linda / whatsapp-web.js channel)
 *   notification:new        → addNotification
 *   lead:updated            → addNotification
 *   conversation:updated    → (nadia slice updated externally — triggers re-fetch)
 *   agent:presence          → (logged; future presence indicator)
 *
 * Both WhatsApp channels are handled separately to keep Nadia (Meta) and
 * Linda (whatsapp-web.js) independent.
 */

import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { addNotification } from '../store/slices/notificationSlice';
import socketService, { SocketStatus } from '../services/socketService';
import { createLogger } from '../utils/logger';

const log = createLogger('useSocket');

export interface UseSocketReturn {
  /** Current connection status */
  status: SocketStatus;
  /** Whether the socket is fully connected */
  isConnected: boolean;
  /** Manually reconnect (e.g. after token refresh) */
  reconnect: () => void;
}

export function useSocket(): UseSocketReturn {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth?.token ?? null);
  const [status, setStatus] = useState<SocketStatus>(socketService.getStatus());

  // Keep status in sync with the service
  useEffect(() => {
    const unsubscribe = socketService.onStatusChange(setStatus);
    return unsubscribe;
  }, []);

  // Connect / reconnect when the JWT token changes
  useEffect(() => {
    if (!token) {
      socketService.disconnect();
      return;
    }

    socketService.connect(token);

    // ── Meta API channel (Nadia / Nina pipeline) ──────────────────────────
    const offMetaMsg = socketService.onMetaMessage((payload) => {
      log.debug('Meta WhatsApp message received', { from: payload.from });
      dispatch(
        addNotification({
          type: 'info',
          title: '💬 WhatsApp (Meta)',
          message: `New message from ${payload.from}: ${payload.content.substring(0, 80)}${payload.content.length > 80 ? '…' : ''}`,
          duration: 6000,
        })
      );
    });

    const offMetaStatus = socketService.onMetaStatus((payload) => {
      if (payload.status === 'failed') {
        log.warn('Meta message delivery failed', { messageId: payload.messageId });
        dispatch(
          addNotification({
            type: 'error',
            title: '⚠️ WhatsApp Delivery Failed',
            message: `Message to ${payload.recipientId ?? 'unknown'} failed to deliver.`,
            duration: 8000,
          })
        );
      }
    });

    // ── Linda channel (whatsapp-web.js LocalAuth) ─────────────────────────
    const offLindaMsg = socketService.onLindaMessage((payload) => {
      log.debug('Linda WhatsApp message received', { from: payload.from });
      dispatch(
        addNotification({
          type: 'info',
          title: '💬 WhatsApp (Linda)',
          message: `New message from ${payload.from}: ${payload.body.substring(0, 80)}${payload.body.length > 80 ? '…' : ''}`,
          duration: 6000,
        })
      );
    });

    // ── CRM notifications ─────────────────────────────────────────────────
    const offNotification = socketService.onNotification((payload) => {
      log.debug('CRM notification received', { type: payload.type, title: payload.title });
      dispatch(
        addNotification({
          type: payload.type,
          title: payload.title,
          message: payload.message,
          duration: 5000,
        })
      );
    });

    // ── Lead updates ──────────────────────────────────────────────────────
    const offLead = socketService.onLeadUpdated((payload) => {
      log.debug('Lead updated', { leadId: payload.leadId, status: payload.status });
      dispatch(
        addNotification({
          type: 'info',
          title: '📋 Lead Updated',
          message: `Lead status changed to "${payload.status}"${payload.score !== undefined ? ` (score: ${payload.score})` : ''}`,
          duration: 4000,
        })
      );
    });

    // ── Conversation updates (Nadia) ──────────────────────────────────────
    const offConversation = socketService.onConversationUpdated((payload) => {
      log.debug('Nadia conversation updated', { conversationId: payload.conversationId });
    });

    // ── Agent presence ────────────────────────────────────────────────────
    const offPresence = socketService.onAgentPresence((payload) => {
      log.debug(`Agent ${payload.email} is now ${payload.online ? 'online' : 'offline'}`);
    });

    return () => {
      offMetaMsg();
      offMetaStatus();
      offLindaMsg();
      offNotification();
      offLead();
      offConversation();
      offPresence();
    };
  }, [token, dispatch]);

  // Graceful disconnect on unmount (app-level — component unmounts on logout)
  useEffect(() => {
    return () => {
      // Only disconnect if the hook is unmounting because the user logged out
      // (token will be null at that point); don't disconnect on re-renders.
    };
  }, []);

  const reconnect = useCallback(() => {
    if (token) {
      socketService.disconnect();
      socketService.connect(token);
    }
  }, [token]);

  return {
    status,
    isConnected: status === 'connected',
    reconnect,
  };
}
