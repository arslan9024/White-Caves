/**
 * NotificationDropdownBell — Wave 61 FE-GOAL-059
 * Executive notification bell icon with unread badge counter and glassmorphic dropdown feed
 * White Caves Real Estate LLC — Navigation & Comms Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const slideDown = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Container = styled.div`
  position: relative;
  font-family: 'Inter', sans-serif;
`;

const BellButton = styled.button`
  position: relative;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.25);
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFF;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: #EF4444; }
`;

const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: #EF4444;
  color: #FFF;
  font-size: 0.62rem;
  font-weight: 900;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #0F172A;
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  background: #0F172A;
  border: 1.5px solid rgba(239, 68, 68, 0.35);
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  z-index: 1000;
  animation: ${slideDown} 0.2s ease;
`;

const DHead = styled.div`
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.08);
  border-bottom: 1px solid rgba(239, 68, 68, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FeedList = styled.div`
  max-height: 260px;
  overflow-y: auto;
`;

const FeedItem = styled.div<{ $unread?: boolean }>`
  padding: 10px 14px;
  border-bottom: 1px solid rgba(100, 116, 139, 0.1);
  background: ${p => p.$unread ? 'rgba(239, 68, 68, 0.06)' : 'transparent'};
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
  &:hover { background: rgba(239, 68, 68, 0.1); }
`;

export const NotificationDropdownBell: FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications] = useState([
    { id: '1', title: 'New VIP Lead Ingest', desc: 'Sheikh Tariq Al Qasimi requested an off-market viewing.', time: '2m ago', unread: true },
    { id: '2', title: 'Form B Digital Signature', desc: 'Seller completed cryptographic signature.', time: '18m ago', unread: true },
    { id: '3', title: 'DEWA Premise Link Verified', desc: 'Move-in transfer registered with Ejari #9210.', time: '1h ago', unread: false },
  ]);

  return (
    <Container data-testid="notification-dropdown-bell">
      <BellButton onClick={() => setOpen(!open)} aria-label="Notifications">
        🔔
        <Badge>2</Badge>
      </BellButton>

      {open && (
        <Dropdown>
          <DHead>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--white, #FFF)' }}>Executive Alerts</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--accent-red, #EF4444)', fontWeight: 700, cursor: 'pointer' }}>Mark All Read</span>
          </DHead>
          <FeedList>
            {notifications.map(n => (
              <FeedItem key={n.id} $unread={n.unread}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--white, #FFF)' }}>{n.title}</span>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary, #64748B)' }}>{n.time}</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-94a3b8, #94A3B8)' }}>{n.desc}</div>
              </FeedItem>
            ))}
          </FeedList>
        </Dropdown>
      )}
    </Container>
  );
};

export default NotificationDropdownBell;
