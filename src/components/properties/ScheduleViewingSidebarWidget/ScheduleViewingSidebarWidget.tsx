/**
 * ScheduleViewingSidebarWidget — Wave 62 FE-GOAL-065
 * Schedule a private viewing sticky sidebar widget with date/time pickers and WhatsApp VIP concierge handoff
 * White Caves Real Estate LLC — Property Detail Suite
 */
import React, { FC, useState } from 'react';
import styled from 'styled-components';

const WidgetCard = styled.div`
  width: 100%;
  max-width: 360px;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(239, 68, 68, 0.35);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const WTitle = styled.h4`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 800;
  color: #FFF;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FLabel = styled.label`
  font-size: 0.68rem;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
`;

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(7, 11, 20, 0.8);
  color: #FFF;
  font-size: 0.8rem;
  outline: none;
  &:focus { border-color: #EF4444; }
`;

const Select = styled.select`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(7, 11, 20, 0.8);
  color: #FFF;
  font-size: 0.8rem;
  outline: none;
  &:focus { border-color: #EF4444; }
`;

const BookBtn = styled.button`
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #DC2626, #EF4444);
  color: #FFF;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`;

export const ScheduleViewingSidebarWidget: FC<{ propertyTitle?: string }> = ({
  propertyTitle = 'Signature Beachfront Villa, Palm Jumeirah',
}) => {
  const [date, setDate] = useState('2026-08-18');
  const [slot, setSlot] = useState('11:00 AM');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [booked, setBooked] = useState(false);

  const handleBook = () => {
    if (!name || !phone) {
      alert('Please enter your name and contact phone number.');
      return;
    }
    setBooked(true);
  };

  return (
    <WidgetCard data-testid="schedule-viewing-sidebar-widget">
      <WTitle>📅 Schedule Private Viewing</WTitle>
      <div style={{ fontSize: '0.72rem', color: 'var(--color-94a3b8, #94A3B8)' }}>{propertyTitle}</div>

      <Field>
        <FLabel>Preferred Date</FLabel>
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </Field>

      <Field>
        <FLabel>Time Slot</FLabel>
        <Select value={slot} onChange={e => setSlot(e.target.value)}>
          <option value="10:00 AM">10:00 AM (Morning)</option>
          <option value="11:30 AM">11:30 AM (Morning)</option>
          <option value="02:00 PM">02:00 PM (Afternoon)</option>
          <option value="04:30 PM">04:30 PM (Sunset / Golden Hour)</option>
        </Select>
      </Field>

      <Field>
        <FLabel>Your Name</FLabel>
        <Input placeholder="e.g. Lord Harrington" value={name} onChange={e => setName(e.target.value)} />
      </Field>

      <Field>
        <FLabel>WhatsApp / Mobile Number</FLabel>
        <Input placeholder="+971 50 000 0000" value={phone} onChange={e => setPhone(e.target.value)} />
      </Field>

      {booked ? (
        <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--accent-green, #10B981)', color: 'var(--accent-green, #10B981)', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center' }}>
          ✓ VIP Viewing Requested for {date} at {slot}! Senior broker assigned.
        </div>
      ) : (
        <BookBtn onClick={handleBook}>
          ⚡ Confirm VIP Viewing Request
        </BookBtn>
      )}
    </WidgetCard>
  );
};

export default ScheduleViewingSidebarWidget;
