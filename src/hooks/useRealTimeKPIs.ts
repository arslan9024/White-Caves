import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import {
  setRealtimeKPIs,
  updateUserKPI,
  setConnectionStatus,
  setActiveUsers,
  setError,
  selectConnectionStatus,
} from '../store/slices/analyticsSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

interface UseRealTimeKPIsOptions {
  enabled?: boolean;
  departmentId?: string;
}

export const useRealTimeKPIs = (options: UseRealTimeKPIsOptions = {}) => {
  const { enabled = true, departmentId = 'default' } = options;
  const dispatch = useDispatch();
  const connectionStatus = useSelector(selectConnectionStatus);
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const getAuthToken = useCallback((): string => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return token;
  }, []);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      return;
    }

    try {
      const token = getAuthToken();
      dispatch(setConnectionStatus('reconnecting'));

      socketRef.current = io(API_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: Math.min(1000 * 2 ** reconnectAttemptsRef.current, 30000),
        reconnectionDelayMax: 30000,
        reconnectionAttempts: maxReconnectAttempts,
      });

      socketRef.current.on('connected', (data: Record<string, unknown>) => {
        reconnectAttemptsRef.current = 0;
        dispatch(setConnectionStatus('connected'));
        dispatch(setError(null));

        // Subscribe to KPI updates
        socketRef.current?.emit('subscribe:kpi');
      });

      socketRef.current.on(
        'kpi:update',
        (data: { kpis: Record<string, unknown>; timestamp: string }) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dispatch(setRealtimeKPIs(data.kpis as any));
        }
      );

      socketRef.current.on('kpi:personal', (kpi: Record<string, unknown>) => {
        const userId = kpi.userId as string;
        dispatch(updateUserKPI({ userId, kpi: kpi as Partial<unknown> }));
      });

      socketRef.current.on('presence:update', (data: { activeUsers: number }) => {
        dispatch(setActiveUsers(data.activeUsers));
      });

      socketRef.current.on('error', (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        dispatch(setError(errorMessage));
        dispatch(setConnectionStatus('disconnected'));
      });

      socketRef.current.on('disconnect', () => {
        dispatch(setConnectionStatus('disconnected'));
        reconnectAttemptsRef.current += 1;
      });

      socketRef.current.on('connect_error', (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : 'Connection error';
        dispatch(setError(errorMessage));
        if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          dispatch(setConnectionStatus('disconnected'));
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection setup failed';
      dispatch(setError(errorMessage));
      dispatch(setConnectionStatus('disconnected'));
    }
  }, [dispatch, getAuthToken]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      dispatch(setConnectionStatus('disconnected'));
    }
  }, [dispatch]);

  const sendActivityUpdate = useCallback((activity: Record<string, unknown>) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('activity:new', activity);
    }
  }, []);

  const sendComment = useCallback((entityId: string, comment: Record<string, unknown>) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('comment:new', { entityId, ...comment });
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      disconnect();
      return;
    }

    connect();

    return () => {
      // Keep connection alive on unmount unless disabled
      if (!enabled) {
        disconnect();
      }
    };
  }, [enabled, connect, disconnect]);

  return {
    isConnected: connectionStatus === 'connected',
    connectionStatus,
    sendActivityUpdate,
    sendComment,
    reconnect: connect,
    disconnect,
  };
};
