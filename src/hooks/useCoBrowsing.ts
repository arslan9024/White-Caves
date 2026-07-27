import { useState, useEffect, useCallback, useRef } from 'react';
import socketService from '../services/socketService';

export interface Participant {
  id: string;
  name: string;
  role: 'broker' | 'investor' | 'client' | 'admin';
  cursor: { x: number; y: number };
  avatarColor: string;
  activeTool?: string;
  lastActive: number;
}

export interface AnnotationPoint {
  x: number;
  y: number;
}

export interface AnnotationShape {
  id: string;
  type: 'pen' | 'rectangle' | 'pin';
  points?: AnnotationPoint[];
  start?: AnnotationPoint;
  end?: AnnotationPoint;
  text?: string;
  color: string;
  strokeWidth: number;
  authorId: string;
}

export type DrawingTool = 'select' | 'pen' | 'rectangle' | 'pin';

interface UseCoBrowsingOptions {
  sessionId?: string;
  currentUser?: {
    id: string;
    name: string;
    role: 'broker' | 'investor' | 'client' | 'admin';
  };
  initialColor?: string;
}

export function useCoBrowsing({
  sessionId = 'default-session',
  currentUser = { id: 'user-local', name: 'Broker Lead', role: 'broker' },
  initialColor = '#EF4444',
}: UseCoBrowsingOptions = {}) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [annotations, setAnnotations] = useState<AnnotationShape[]>([]);
  const [activeTool, setActiveTool] = useState<DrawingTool>('pen');
  const [strokeColor, setStrokeColor] = useState<string>(initialColor);
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const lastCursorTime = useRef<number>(0);

  // Broadcast cursor updates with throttling (50ms)
  const broadcastCursor = useCallback(
    (x: number, y: number) => {
      const now = Date.now();
      if (now - lastCursorTime.current < 50) return;
      lastCursorTime.current = now;

      // Local state update for current user
      setParticipants((prev) => {
        const existingIdx = prev.findIndex((p) => p.id === currentUser.id);
        const updatedParticipant: Participant = {
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.role,
          cursor: { x, y },
          avatarColor: strokeColor,
          activeTool,
          lastActive: now,
        };

        if (existingIdx >= 0) {
          const next = [...prev];
          next[existingIdx] = updatedParticipant;
          return next;
        }
        return [...prev, updatedParticipant];
      });

      // Event dispatch for component/socket integration
      window.dispatchEvent(
        new CustomEvent('cobrowsing:cursor', {
          detail: { sessionId, userId: currentUser.id, x, y },
        })
      );
    },
    [currentUser, strokeColor, activeTool, sessionId]
  );

  // Add new shape annotation
  const addAnnotation = useCallback(
    (shape: Omit<AnnotationShape, 'id' | 'authorId'>) => {
      const newShape: AnnotationShape = {
        ...shape,
        id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        authorId: currentUser.id,
      };

      setAnnotations((prev) => [...prev, newShape]);

      window.dispatchEvent(
        new CustomEvent('cobrowsing:annotation', {
          detail: { sessionId, shape: newShape },
        })
      );
    },
    [currentUser.id, sessionId]
  );

  // Clear all annotations
  const clearAnnotations = useCallback(() => {
    setAnnotations([]);
    window.dispatchEvent(
      new CustomEvent('cobrowsing:clear', {
        detail: { sessionId },
      })
    );
  }, [sessionId]);

  // Handle incoming remote events
  useEffect(() => {
    const handleRemoteCursor = (e: Event) => {
      const customEvt = e as CustomEvent<{
        sessionId: string;
        userId: string;
        name?: string;
        role?: 'broker' | 'investor' | 'client' | 'admin';
        x: number;
        y: number;
      }>;
      if (customEvt.detail.sessionId !== sessionId || customEvt.detail.userId === currentUser.id) return;

      const { userId, x, y, name, role } = customEvt.detail;

      setParticipants((prev) => {
        const idx = prev.findIndex((p) => p.id === userId);
        const updated: Participant = {
          id: userId,
          name: name || `Investor ${userId.slice(0, 4)}`,
          role: role || 'investor',
          cursor: { x, y },
          avatarColor: '#1E293B',
          lastActive: Date.now(),
        };

        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = updated;
          return copy;
        }
        return [...prev, updated];
      });
    };

    const handleRemoteAnnotation = (e: Event) => {
      const customEvt = e as CustomEvent<{ sessionId: string; shape: AnnotationShape }>;
      if (customEvt.detail.sessionId !== sessionId) return;

      setAnnotations((prev) => {
        if (prev.some((s) => s.id === customEvt.detail.shape.id)) return prev;
        return [...prev, customEvt.detail.shape];
      });
    };

    const handleRemoteClear = (e: Event) => {
      const customEvt = e as CustomEvent<{ sessionId: string }>;
      if (customEvt.detail.sessionId !== sessionId) return;
      setAnnotations([]);
    };

    window.addEventListener('cobrowsing:cursor', handleRemoteCursor);
    window.addEventListener('cobrowsing:annotation', handleRemoteAnnotation);
    window.addEventListener('cobrowsing:clear', handleRemoteClear);

    return () => {
      window.removeEventListener('cobrowsing:cursor', handleRemoteCursor);
      window.removeEventListener('cobrowsing:annotation', handleRemoteAnnotation);
      window.removeEventListener('cobrowsing:clear', handleRemoteClear);
    };
  }, [sessionId, currentUser.id]);

  return {
    participants,
    annotations,
    activeTool,
    setActiveTool,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    isConnected,
    broadcastCursor,
    addAnnotation,
    clearAnnotations,
  };
}

export default useCoBrowsing;
