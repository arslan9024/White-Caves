/**
 * VIPViewingBookingModal.tsx
 *
 * White Caves Real Estate LLC — Private VIP Property Viewing & Chauffeur Experience.
 * Provides private viewing bookings with Maybach / Rolls-Royce VIP transfers, helicopter transfers,
 * and confidential Non-Disclosure Agreement (NDA) options for UHNW buyers.
 */

import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface VIPViewingBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle?: string;
  propertyLocation?: string;
}

export const VIPViewingBookingModal: FC<VIPViewingBookingModalProps> = ({
  isOpen,
  onClose,
  propertyTitle = 'Amazonia Luxury Garden Villa',
  propertyLocation = 'DAMAC Hills 2, Dubai, UAE',
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [transportType, setTransportType] = useState<'maybach' | 'rolls_royce' | 'self'>('maybach');
  const [ndaRequired, setNdaRequired] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          fontFamily: 'inherit',
        }}
        data-testid="vip-viewing-booking-modal"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '540px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            color: '#0F172A',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              padding: '1.5rem',
              color: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <span
                style={{
                  background: 'linear-gradient(90deg, #D97706, #F59E0B)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                👑 White Caves Sovereign Concierge
              </span>
              <h3 style={{ margin: '8px 0 4px 0', fontSize: '1.25rem', fontWeight: 800 }}>
                Private VIP Property Viewing
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8' }}>
                {propertyTitle} • {propertyLocation}
              </p>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
              }}
            >
              ✕
            </button>
          </div>

          {/* Form Content */}
          <div style={{ padding: '1.5rem' }}>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  background: '#ECFDF5',
                  borderRadius: '12px',
                  border: '1px solid #A7F3D0',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🥂</div>
                <h4 style={{ margin: 0, color: '#065F46', fontSize: '1.15rem', fontWeight: 800 }}>
                  VIP Viewing Reserved
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#047857', marginTop: '6px', marginBottom: 0 }}>
                  Your private concierge and chauffeur details have been transmitted. You will receive an encrypted confirmation shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Date & Time */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Preferred Time
                    </label>
                    <select
                      value={selectedTime}
                      onChange={e => setSelectedTime(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.85rem',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="10:00 AM">10:00 AM (Morning Tour)</option>
                      <option value="02:00 PM">02:00 PM (Afternoon Tour)</option>
                      <option value="05:30 PM">05:30 PM (Sunset & Twilight Tour)</option>
                      <option value="08:00 PM">08:00 PM (Private Evening Immersion)</option>
                    </select>
                  </div>
                </div>

                {/* VIP Chauffeur Selection */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    VIP Chauffeur & Transfer Selection
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {[
                      { id: 'maybach', title: 'Mercedes-Maybach', icon: '🚘' },
                      { id: 'rolls_royce', title: 'Rolls-Royce Phantom', icon: '🚗' },
                      { id: 'self', title: 'Direct Arrival', icon: '📍' },
                    ].map(item => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setTransportType(item.id as any)}
                        style={{
                          background: transportType === item.id ? '#0F172A' : '#F8FAFC',
                          color: transportType === item.id ? '#FFFFFF' : '#334155',
                          border: transportType === item.id ? '2px solid #EF4444' : '1px solid #E2E8F0',
                          borderRadius: '10px',
                          padding: '10px 6px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{item.icon}</div>
                        {item.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* NDA Toggle */}
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', display: 'block' }}>
                      🔒 Confidential NDA Protocol
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      Strict Non-Disclosure Agreement for high-profile investors
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={ndaRequired}
                    onChange={e => setNdaRequired(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#EF4444' }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{
                    background: '#EF4444',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.25)',
                    marginTop: '4px',
                  }}
                >
                  Confirm Private VIP Viewing Request
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VIPViewingBookingModal;
