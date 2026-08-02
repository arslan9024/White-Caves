/**
 * SwipeableLeadCard.tsx — Presentation Layer (W23-010 / REQ-MOB-011)
 *
 * Mobile-optimised lead card component with touch drag affordances for
 * phone calls (swipe right) and lead snoozing (swipe left).
 */

import React from 'react';
import './SwipeableLeadCard.css';
import { useSwipeableLeadCardLogic, LeadCardData } from './SwipeableLeadCard.logic';

interface SwipeableLeadCardProps {
  lead: LeadCardData;
  onSnooze?: (leadId: string) => void;
  onCall?: (phone: string) => void;
}

export const SwipeableLeadCard: React.FC<SwipeableLeadCardProps> = ({
  lead,
  onSnooze,
  onCall,
}) => {
  const {
    dragOffset,
    isSwiping,
    showSnoozeModal,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    confirmSnooze,
    cancelSnooze,
  } = useSwipeableLeadCardLogic(lead, onSnooze, onCall);

  const getBgClass = () => {
    if (dragOffset > 20) return 'swipe-bg-layer call-bg';
    if (dragOffset < -20) return 'swipe-bg-layer snooze-bg';
    return '';
  };

  return (
    <>
      <div className="swipe-card-wrapper">
        {/* Background Action Affordance */}
        {dragOffset !== 0 && (
          <div className={getBgClass()}>
            {dragOffset > 20 && <span>📞 Call {lead.name}</span>}
            {dragOffset < -20 && <span>⏰ Snooze 7 Days</span>}
          </div>
        )}

        {/* Foreground Card */}
        <div
          className={`swipe-card-content ${isSwiping ? 'dragging' : ''}`}
          style={{ transform: `translateX(${dragOffset}px)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-1e293b, #1E293B)' }}>{lead.name}</h4>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red, #EF4444)' }}>
              {lead.status || 'NEW'}
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #64748B)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {lead.phone && <span>📞 {lead.phone}</span>}
            {lead.community && <span>📍 {lead.community}</span>}
            {lead.budget && <span style={{ fontWeight: 700, color: 'var(--accent-red, #EF4444)' }}>AED {lead.budget.toLocaleString()}</span>}
          </div>
        </div>
      </div>

      {/* Snooze Confirmation Modal */}
      {showSnoozeModal && (
        <div className="snooze-modal-overlay">
          <div className="snooze-modal-card">
            <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem', color: 'var(--color-1e293b, #1E293B)' }}>Snooze Lead?</h3>
            <p style={{ margin: '0 0 20px', fontSize: '0.9rem', color: 'var(--text-secondary, #64748B)' }}>
              Snooze <strong>{lead.name}</strong> for 7 days? You will receive a automated follow-up reminder.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={cancelSnooze}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--text-secondary, #CBD5E1)', background: 'var(--white, #FFFFFF)', color: 'var(--color-475569, #475569)', fontWeight: 700 }}
              >
                Cancel
              </button>
              <button
                onClick={confirmSnooze}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--accent-red, #EF4444)', color: 'var(--white, #FFFFFF)', fontWeight: 700 }}
              >
                Snooze 7 Days
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SwipeableLeadCard;
