/**
 * AmenityBookingCalendar — Wave 52 GOAL-067
 * Community amenity booking calendar (Private Tennis Court, Infinity Pool, Rooftop BBQ, Cinema Room)
 * White Caves Real Estate LLC — Asset Management & Lifestyle Concierge Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 2px solid rgba(16, 185, 129, 0.25);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(16, 185, 129, 0.06);
  border-bottom: 1px solid rgba(16, 185, 129, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  color: #FFF;
  font-size: 0.92rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Tag = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #10B981;
  background: rgba(16, 185, 129, 0.12);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(16, 185, 129, 0.3);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AmenitySelector = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const AmenityBtn = styled.button<{ $selected: boolean }>`
  padding: 10px 8px;
  border-radius: 10px;
  border: 1px solid ${p => p.$selected ? '#10B981' : 'rgba(100, 116, 139, 0.2)'};
  background: ${p => p.$selected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.7)'};
  color: ${p => p.$selected ? '#FFF' : '#94A3B8'};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  &:hover { border-color: #10B981; }
`;

const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const SlotCard = styled.button<{ $selected: boolean; $booked: boolean }>`
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${p => p.$selected ? '#10B981' : 'rgba(100, 116, 139, 0.2)'};
  background: ${p => p.$selected ? 'rgba(16, 185, 129, 0.15)' : p.$booked ? 'rgba(100, 116, 139, 0.08)' : 'rgba(15, 23, 42, 0.7)'};
  color: ${p => p.$selected ? '#FFF' : p.$booked ? '#64748B' : '#E2E8F0'};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: ${p => p.$booked ? 'not-allowed' : 'pointer'};
  text-align: center;
  transition: all 0.2s ease;
  &:hover { ${p => !p.$booked && 'border-color: #10B981;'} }
`;

const BookBtn = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #059669, #10B981);
  color: #FFF;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`;

const AMENITIES = [
  { id: 'tennis', name: '🎾 Tennis Court', location: 'Podium Level 4' },
  { id: 'pool', name: '🏊 Infinity Pool Cabana', location: 'Rooftop Sky Deck' },
  { id: 'bbq', name: '🍖 Sky BBQ Lounge', location: 'East Terrace' },
  { id: 'cinema', name: '🎬 Private Cinema', location: 'Clubhouse Level 2' },
];

export const AmenityBookingCalendar: FC = () => {
  const [selectedAmenity, setSelectedAmenity] = useState('tennis');
  const [bookingDate, setBookingDate] = useState('2026-08-16');
  const [selectedSlot, setSelectedSlot] = useState('06:00 PM - 07:00 PM');
  const [confirmed, setConfirmed] = useState(false);

  const slots = [
    { time: '08:00 AM - 09:00 AM', booked: false },
    { time: '10:00 AM - 11:00 AM', booked: true },
    { time: '02:00 PM - 03:00 PM', booked: false },
    { time: '04:00 PM - 05:00 PM', booked: true },
    { time: '06:00 PM - 07:00 PM', booked: false },
    { time: '07:00 PM - 08:00 PM', booked: false },
    { time: '08:00 PM - 09:00 PM', booked: false },
    { time: '09:00 PM - 10:00 PM', booked: true },
  ];

  return (
    <Wrap data-testid="amenity-booking-calendar">
      <Head>
        <Title>🏊 Community Amenity & Lifestyle Booking Calendar</Title>
        <Tag>RESIDENT PORTAL</Tag>
      </Head>
      <Body>
        <AmenitySelector>
          {AMENITIES.map(a => (
            <AmenityBtn 
              key={a.id} 
              $selected={selectedAmenity === a.id}
              onClick={() => { setSelectedAmenity(a.id); setConfirmed(false); }}
            >
              <span>{a.name}</span>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary, #64748B)' }}>{a.location}</span>
            </AmenityBtn>
          ))}
        </AmenitySelector>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-94a3b8, #94A3B8)', fontWeight: 700, textTransform: 'uppercase' }}>
            Available Time Slots for {bookingDate}
          </div>
          <input 
            type="date" 
            value={bookingDate} 
            onChange={e => setBookingDate(e.target.value)}
            style={{ padding: '6px 10px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(100,116,139,0.25)', color: 'var(--white, #FFF)', borderRadius: '6px', fontSize: '0.75rem' }} 
          />
        </div>

        <SlotGrid>
          {slots.map((s, idx) => (
            <SlotCard
              key={idx}
              $selected={selectedSlot === s.time}
              $booked={s.booked}
              onClick={() => !s.booked && setSelectedSlot(s.time)}
            >
              <div>{s.time}</div>
              <div style={{ fontSize: '0.62rem', color: s.booked ? 'var(--accent-red, #EF4444)' : 'var(--accent-green, #10B981)', marginTop: '2px' }}>
                {s.booked ? 'RESERVED' : 'FREE'}
              </div>
            </SlotCard>
          ))}
        </SlotGrid>

        {confirmed ? (
          <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center', color: 'var(--accent-green, #10B981)', fontWeight: 800, fontSize: '0.82rem' }}>
            ✓ Reservation Confirmed for {selectedSlot} on {bookingDate}! Digital Access QR Pass Generated.
          </div>
        ) : (
          <BookBtn onClick={() => setConfirmed(true)}>
            🗓️ Reserve Amenity ({selectedSlot})
          </BookBtn>
        )}
      </Body>
    </Wrap>
  );
};

export default AmenityBookingCalendar;
