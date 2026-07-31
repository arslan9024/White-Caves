/**
 * SwipeableLeadCard — Wave 23 (W23-010)
 *
 * Mobile lead card with swipe gestures:
 *  - Right-swipe → tel: call intent
 *  - Left-swipe → Snooze confirmation (7 days)
 *
 * Visual affordance: green (call) / amber (snooze) gradient reveals during drag.
 * 44×44px minimum touch targets per WCAG 2.1.
 *
 * @agent @Una
 */

import React, { useState, useCallback } from 'react';
import { Phone, Clock, User, MapPin, DollarSign } from 'lucide-react';
import { useSwipeGesture } from '../../hooks/useSwipeGesture';

export interface LeadCardData {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  area?: string;
  budget?: string;
  status: string;
  source?: string;
  createdAt?: string;
}

interface SwipeableLeadCardProps {
  lead: LeadCardData;
  onCall?: (lead: LeadCardData) => void;
  onSnooze?: (lead: LeadCardData) => void;
  onClick?: (lead: LeadCardData) => void;
}

const SwipeableLeadCard: React.FC<SwipeableLeadCardProps> = ({
  lead,
  onCall,
  onSnooze,
  onClick,
}) => {
  const [showSnoozeConfirm, setShowSnoozeConfirm] = useState(false);

  const handleSwipeRight = useCallback(() => {
    if (lead.phone) {
      window.location.href = `tel:${lead.phone}`;
      onCall?.(lead);
    }
  }, [lead, onCall]);

  const handleSwipeLeft = useCallback(() => {
    setShowSnoozeConfirm(true);
  }, []);

  const confirmSnooze = useCallback(() => {
    onSnooze?.(lead);
    setShowSnoozeConfirm(false);
  }, [lead, onSnooze]);

  const { handlers, swipeProgress, isSwiping } = useSwipeGesture({
    onSwipeRight: handleSwipeRight,
    onSwipeLeft: handleSwipeLeft,
    threshold: 100,
  });

  const translateX = swipeProgress * 100;
  const absProgress = Math.abs(swipeProgress);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 12 }}>
      {/* Swipe reveal backgrounds */}
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
        <Phone size={24} color="#fff" />
        <span style={{ color: 'var(--white, #fff)', fontWeight: 600, marginLeft: 8, fontSize: 14 }}>
          Call
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 20px',
          background: `linear-gradient(270deg, rgba(245,158,11,${absProgress * 0.9}) 0%, rgba(245,158,11,0.1) 100%)`,
          opacity: swipeProgress < 0 ? 1 : 0,
          transition: isSwiping ? 'none' : 'opacity 0.2s',
        }}
      >
        <span style={{ color: 'var(--white, #fff)', fontWeight: 600, marginRight: 8, fontSize: 14 }}>
          Snooze
        </span>
        <Clock size={24} color="#fff" />
      </div>

      {/* Card content */}
      <div
        {...handlers}
        onClick={() => !isSwiping && onClick?.(lead)}
        role="button"
        tabIndex={0}
        aria-label={`Lead: ${lead.name}`}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #C9A84C 0%, #8B7332 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <User size={20} color="#fff" />
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
              {lead.name}
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-888, #888)', marginTop: 2 }}>
              {lead.source || 'Direct'} • {lead.status}
            </div>
          </div>
          <div
            style={{
              padding: '4px 8px',
              borderRadius: 6,
              background: 'rgba(201,168,76,0.15)',
              color: '#C9A84C',
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {lead.status}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 16,
            fontSize: 13,
            color: '#aaa',
            paddingLeft: 52,
          }}
        >
          {lead.area && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={13} /> {lead.area}
            </span>
          )}
          {lead.budget && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <DollarSign size={13} /> {lead.budget}
            </span>
          )}
        </div>
      </div>

      {/* Snooze confirmation modal */}
      {showSnoozeConfirm && (
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
              maxWidth: 320,
              width: '90%',
              textAlign: 'center',
            }}
          >
            <Clock size={32} color="var(--accent-gold, #F59E0B)" style={{ marginBottom: 12 }} />
            <h3 style={{ color: 'var(--color-f5f5f0, #f5f5f0)', fontSize: 16, marginBottom: 8 }}>
              Snooze Lead?
            </h3>
            <p style={{ color: 'var(--color-888, #888)', fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>
              <strong>{lead.name}</strong> will be hidden for 7 days and reappear in your active leads.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setShowSnoozeConfirm(false)}
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
                onClick={confirmSnooze}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#F59E0B',
                  color: '#0a0a0f',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 14,
                  minWidth: 44,
                  minHeight: 44,
                }}
              >
                Snooze 7 Days
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeableLeadCard;
