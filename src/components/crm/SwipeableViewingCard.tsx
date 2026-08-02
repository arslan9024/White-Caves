/**
 * SwipeableViewingCard.tsx — Presentation Layer (W23-011 / REQ-MOB-011)
 *
 * Swipeable viewing card component:
 * - Swipe right: Confirm viewing
 * - Swipe left: Reschedule viewing modal
 */

import React from 'react';
import './SwipeableViewingCard.css';
import { useSwipeableViewingCardLogic, ViewingCardData } from './SwipeableViewingCard.logic';

interface SwipeableViewingCardProps {
  viewing: ViewingCardData;
  onConfirm?: (viewingId: string) => void;
  onReschedule?: (viewingId: string, newDate: string) => void;
}

export const SwipeableViewingCard: React.FC<SwipeableViewingCardProps> = ({
  viewing,
  onConfirm,
  onReschedule,
}) => {
  const {
    dragOffset,
    isSwiping,
    showRescheduleModal,
    newScheduledDate,
    setNewScheduledDate,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    confirmReschedule,
    cancelReschedule,
  } = useSwipeableViewingCardLogic(viewing, onConfirm, onReschedule);

  const getBgClass = () => {
    if (dragOffset > 20) return 'viewing-bg-layer confirm-bg';
    if (dragOffset < -20) return 'viewing-bg-layer reschedule-bg';
    return '';
  };

  return (
    <>
      <div className="viewing-card-wrapper">
        {/* Drag Action Layer */}
        {dragOffset !== 0 && (
          <div className={getBgClass()}>
            {dragOffset > 20 && <span>✓ Confirm Viewing</span>}
            {dragOffset < -20 && <span>📅 Reschedule</span>}
          </div>
        )}

        {/* Card Body */}
        <div
          className={`viewing-card-content ${isSwiping ? 'dragging' : ''}`}
          style={{ transform: `translateX(${dragOffset}px)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-1e293b, #1E293B)' }}>{viewing.propertyTitle}</h4>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '12px', background: viewing.status === 'confirmed' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)', color: viewing.status === 'confirmed' ? 'var(--status-green, #22C55E)' : 'var(--status-amber, #EAB308)' }}>
              {viewing.status.toUpperCase()}
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #64748B)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>👤 Client: <strong>{viewing.clientName}</strong></div>
            <div>⏰ Scheduled: <strong>{viewing.scheduledAt}</strong></div>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="reschedule-modal-overlay">
          <div className="reschedule-modal-card">
            <h3 style={{ margin: '0 0 12px', fontSize: '1.2rem', color: 'var(--color-1e293b, #1E293B)' }}>Reschedule Viewing</h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: 'var(--text-secondary, #64748B)' }}>
              Select a new date and time for <strong>{viewing.clientName}</strong>'s viewing of {viewing.propertyTitle}.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-475569, #475569)', marginBottom: '6px' }}>NEW DATE & TIME</label>
              <input
                type="datetime-local"
                value={newScheduledDate}
                onChange={(e) => setNewScheduledDate(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={cancelReschedule}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--text-secondary, #CBD5E1)', background: 'var(--white, #FFFFFF)', color: 'var(--color-475569, #475569)', fontWeight: 700 }}
              >
                Cancel
              </button>
              <button
                onClick={confirmReschedule}
                disabled={!newScheduledDate}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: newScheduledDate ? 'var(--accent-red, #EF4444)' : 'var(--color-94a3b8, #94A3B8)', color: 'var(--white, #FFFFFF)', fontWeight: 700, cursor: newScheduledDate ? 'pointer' : 'not-allowed' }}
              >
                Save New Time
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SwipeableViewingCard;
