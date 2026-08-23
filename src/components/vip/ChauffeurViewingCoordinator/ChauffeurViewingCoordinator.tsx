import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(245,158,11,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(245,158,11,0.06); border-bottom: 1px solid rgba(245,158,11,0.15); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 8px;`;
const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 16px;`;

const ServiceCard = styled.div<{ $selected: boolean }>`
  padding: 16px;
  border-radius: 14px;
  background: ${p => p.$selected ? 'rgba(245,158,11,0.1)' : 'rgba(15,23,42,0.7)'};
  border: 2px solid ${p => p.$selected ? 'rgba(245,158,11,0.4)' : 'rgba(100,116,139,0.15)'};
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.07); }
`;
const ServiceHeader = styled.div`display: flex; align-items: center; justify-content: space-between;`;
const ServiceName = styled.div`font-size: 0.85rem; font-weight: 700; color: #E2E8F0; display: flex; align-items: center; gap: 8px;`;
const ServicePrice = styled.div<{ $selected: boolean }>`font-size: 0.78rem; font-weight: 800; color: ${p => p.$selected ? '#F59E0B' : '#64748B'};`;
const ServiceDesc = styled.div`font-size: 0.72rem; color: #64748B; margin-top: 6px; line-height: 1.5;`;

const BookingPanel = styled.div`padding: 16px; border-radius: 12px; background: rgba(245,158,11,0.07); border: 1px solid rgba(245,158,11,0.2);`;
const BookTitle = styled.div`font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #F59E0B; margin-bottom: 12px;`;
const TimeGrid = styled.div`display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;`;
const TimeSlot = styled.button<{ $avail: boolean; $selected: boolean }>`
  padding: 8px 6px;
  border-radius: 8px;
  border: 1px solid ${p => p.$selected ? '#F59E0B' : p.$avail ? 'rgba(100,116,139,0.25)' : 'rgba(239,68,68,0.2)'};
  background: ${p => p.$selected ? 'rgba(245,158,11,0.2)' : 'transparent'};
  color: ${p => p.$selected ? '#F59E0B' : p.$avail ? '#94A3B8' : '#EF4444'};
  font-size: 0.68rem; font-weight: 700; cursor: ${p => p.$avail ? 'pointer' : 'not-allowed'};
  transition: all 0.15s ease;
`;

const BookBtn = styled.button`
  width: 100%; padding: 12px; border-radius: 10px; border: none;
  background: linear-gradient(90deg, #D97706, #F59E0B);
  color: #000; font-size: 0.85rem; font-weight: 800; cursor: pointer;
  transition: all 0.2s ease; margin-top: 12px;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`;

const SERVICES = [
  { id: 'jet', emoji: '✈️', name: 'Private Jet Transfer', price: 'AED 18,000/flight', desc: 'Same-day charter from Dubai International or DWC. Capacity up to 8 passengers.' },
  { id: 'chauffeur', emoji: '🚗', name: 'Luxury Chauffeur', price: 'AED 1,200/day', desc: 'Rolls-Royce Ghost or Bentley Mulsanne with professional licensed chauffeur.' },
  { id: 'yacht', emoji: '⛵', name: 'Superyacht Arrival', price: 'AED 25,000/day', desc: '68ft superyacht for waterfront property approach with full concierge.' },
  { id: 'helicopter', emoji: '🚁', name: 'Helicopter Viewing', price: 'AED 8,500/hr', desc: 'Aerial property tour with pilot narration and photography package.' },
];

const TIMES = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30'];
const UNAVAIL = [2, 5]; // indices

export const ChauffeurViewingCoordinator: FC = () => {
  const [selectedService, setSelectedService] = useState('chauffeur');
  const [selectedTime, setSelectedTime] = useState('10:30');
  const [booked, setBooked] = useState(false);

  const service = SERVICES.find(s => s.id === selectedService)!;

  return (
    <Wrapper data-testid="chauffeur-viewing-coordinator">
      <Header>
        <Title>🚗 VIP Transport Coordinator</Title>
        <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold, #F59E0B)', fontWeight: 700 }}>CONCIERGE</div>
      </Header>
      <Body>
        {SERVICES.map(s => (
          <ServiceCard key={s.id} $selected={s.id === selectedService} onClick={() => setSelectedService(s.id)}>
            <ServiceHeader>
              <ServiceName>{s.emoji} {s.name}</ServiceName>
              <ServicePrice $selected={s.id === selectedService}>{s.price}</ServicePrice>
            </ServiceHeader>
            <ServiceDesc>{s.desc}</ServiceDesc>
          </ServiceCard>
        ))}

        <BookingPanel>
          <BookTitle>📅 Book {service.name}</BookTitle>
          <TimeGrid>
            {TIMES.map((t, i) => (
              <TimeSlot key={t} $avail={!UNAVAIL.includes(i)} $selected={t === selectedTime} onClick={() => !UNAVAIL.includes(i) && setSelectedTime(t)}>
                {UNAVAIL.includes(i) ? '✗' : t}
              </TimeSlot>
            ))}
          </TimeGrid>
          {!booked ? (
            <BookBtn onClick={() => setBooked(true)}>🎯 Confirm Booking — {selectedTime}</BookBtn>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px', color: 'var(--accent-green, #10B981)', fontWeight: 700 }}>
              ✅ Booked! {service.emoji} at {selectedTime}. White Caves concierge will confirm within 15 mins.
            </div>
          )}
        </BookingPanel>
      </Body>
    </Wrapper>
  );
};
export default ChauffeurViewingCoordinator;
