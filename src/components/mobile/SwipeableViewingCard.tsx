/**
 * SwipeableViewingCard — Wave 23 (W23-011)
 *
 * Mobile viewing card with swipe gestures:
 *  - Right-swipe → Confirm viewing (PATCH status to confirmed)
 *  - Left-swipe → Reschedule modal
 *
 * Visual affordance: green (confirm) / blue (reschedule) gradient reveals.
 * Haptic feedback where supported (navigator.vibrate).
 *
 * @agent @Una
 */

import React, { useState, useCallback } from 'react';
import { Check, CalendarClock, MapPin, Clock, Home } from 'lucide-react';
import { useSwipeGesture } from '../../hooks/useSwipeGesture';

export interface ViewingCardData {
  id: string;
  propertyTitle: string;
  propertyAddress?: string;
  clientName: string;
  scheduledAt: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  propertyType?: string;
}

interface SwipeableViewingCardProps {
  viewing: ViewingCardData;
  onConfirm?: (viewing: ViewingCardData) => void;
  onReschedule?: (viewing: ViewingCardData, newDate: string) => void;
  onClick?: (viewing: ViewingCardData) => void;
}

function triggerHaptic() {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
}

function formatViewingTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-AE', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

const SwipeableViewingCard: React.FC<SwipeableViewingCardProps> = ({
  viewing,
  onConfirm,
  onReschedule,
  onClick,
}) => {
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');

  const handleSwipeRight = useCallback(() => {
    triggerHaptic();
    onConfirm?.(viewing);
  }, [viewing, onConfirm]);

  const handleSwipeLeft = useCallback(() => {
    triggerHaptic();
    setShowRescheduleModal(true);
  }, []);

  const handleReschedule = useCallback(() => {
    if (rescheduleDate) {
      onReschedule?.(viewing, rescheduleDate);
      setShowRescheduleModal(false);
      setRescheduleDate('');
    }
  }, [viewing, rescheduleDate, onReschedule]);

  const { handlers, swipeProgress, isSwiping } = useSwipeGesture({
    onSwipeRight: handleSwipeRight,
    onSwipeLeft: handleSwipeLeft,
    threshold: 100,
  });

  const translateX = swipeProgress * 100;
  const absProgress = Math.abs(swipeProgress);

  const statusColors: Record<string, string> = {
    scheduled: '#F59E0B',
    confirmed: '#22C55E',
    completed: '#6366F1',
    cancelled: '#EF4444',
    rescheduled: '#3B82F6',
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 12 }}>
      {/* Right swipe reveal — Confirm */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '0 20px',
          background: `linear-gradient(90deg, rgba(34,197,94,${absProgress * 0.9}) 0%, rgba(34,197,94,0.1) 100%)`,
          opacity: swipeProgress > 0 ? 1 : 0,
          transition: isSwiping ? 'none' : 'opacity 0.2s',
        }}
      >
        <Check size={24} color="#fff" />
        <span style={{ color: 'var(--white, #fff)', fontWeight: 600, marginLeft: 8, fontSize: 14 }}>
          Confirm
        </span>
      </div>

      {/* Left swipe reveal — Reschedule */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 20px',
          background: `linear-gradient(270deg, rgba(59,130,246,${absProgress * 0.9}) 0%, rgba(59,130,246,0.1) 100%)`,
          opacity: swipeProgress < 0 ? 1 : 0,
          transition: isSwiping ? 'none' : 'opacity 0.2s',
        }}
      >
        <span style={{ color: 'var(--white, #fff)', fontWeight: 600, marginRight: 8, fontSize: 14 }}>
          Reschedule
        </span>
        <CalendarClock size={24} color="#fff" />
      </div>

      {/* Card content */}
      <div
        {...handlers}
        onClick={() => !isSwiping && onClick?.(viewing)}
        role="button"
        tabIndex={0}
        aria-label={`Viewing: ${viewing.propertyTitle} with ${viewing.clientName}`}
        style={{
          position: 'relative',
          background: '#1a1a2e',
          border: '1px solid #2a2a3e',
          borderRadius: 12,
          padding: 16,
          cursor: 'pointer',
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease',
          touchAction: 'pan-y',
          userSelect: 'none',
          minHeight: 44,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Home size={20} color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 15,
                color: '#f5f5f0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {viewing.propertyTitle}
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-888, #888)', marginTop: 2 }}>
              with {viewing.clientName}
            </div>
          </div>
          <div
            style={{
              padding: '4px 8px',
              borderRadius: 6,
              background: `${statusColors[viewing.status] || '#888'}20`,
              color: statusColors[viewing.status] || '#888',
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap',
            }}
          >
            {viewing.status}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 16,
            fontSize: 13,
            color: '#aaa',
            paddingLeft: 52,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={13} /> {formatViewingTime(viewing.scheduledAt)}
          </span>
          {viewing.propertyAddress && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={13} /> {viewing.propertyAddress}
            </span>
          )}
        </div>
      </div>

      {/* Reschedule modal */}
      {showRescheduleModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            style={{
              background: '#1a1a2e',
              border: '1px solid #2a2a3e',
              borderRadius: 16,
              padding: 24,
              maxWidth: 340,
              width: '90%',
              textAlign: 'center',
            }}
          >
            <CalendarClock size={32} color="var(--accent-blue, #3B82F6)" style={{ marginBottom: 12 }} />
            <h3 style={{ color: 'var(--color-f5f5f0, #f5f5f0)', fontSize: 16, marginBottom: 8 }}>
              Reschedule Viewing
            </h3>
            <p style={{ color: 'var(--color-888, #888)', fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>
              <strong>{viewing.propertyTitle}</strong> with {viewing.clientName}
            </p>
            <input
              type="datetime-local"
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              aria-label="New viewing date and time"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #2a2a3e',
                background: '#0a0a1a',
                color: '#f5f5f0',
                fontSize: 14,
                marginBottom: 20,
                minHeight: 44,
              }}
            />
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setShowRescheduleModal(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: '1px solid #2a2a3e',
                  background: 'transparent',
                  color: '#f5f5f0',
                  cursor: 'pointer',
                  fontSize: 14,
                  minWidth: 44,
                  minHeight: 44,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                disabled={!rescheduleDate}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: rescheduleDate ? '#3B82F6' : '#333',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: rescheduleDate ? 'pointer' : 'not-allowed',
                  fontSize: 14,
                  minWidth: 44,
                  minHeight: 44,
                }}
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeableViewingCard;
