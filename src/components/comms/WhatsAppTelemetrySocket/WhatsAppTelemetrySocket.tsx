/**
 * WhatsAppTelemetrySocket — Wave 51 GOAL-060
 * WhatsApp message delivery & read-receipt real-time telemetry socket simulation
 * White Caves Real Estate LLC — Communications & Infrastructure Suite
 */
import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%, 100% { opacity: 1; } 50% { opacity: 0.4; }`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 2px solid rgba(37, 211, 102, 0.25);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(37, 211, 102, 0.06);
  border-bottom: 1px solid rgba(37, 211, 102, 0.15);
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

const LiveDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #25D366;
  margin-right: 6px;
  animation: ${pulse} 1.5s infinite;
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StreamList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EventRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.15);
  font-size: 0.75rem;
`;

const EventInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatusTick = styled.span<{ $status: 'sent' | 'delivered' | 'read' }>`
  font-size: 0.85rem;
  font-weight: 900;
  color: ${p => p.$status === 'read' ? '#38BDF8' : p.$status === 'delivered' ? '#94A3B8' : '#64748B'};
`;

export const WhatsAppTelemetrySocket: FC = () => {
  const [events, setEvents] = useState([
    { id: '1', recipient: '+971 50 882 1940 (Sheikh Hamdan)', message: 'Viewing Gate Pass Dispatched', status: 'read' as const, time: 'Just now' },
    { id: '2', recipient: '+44 7700 900122 (Lord Harrington)', message: 'Form B MOU Contract Link', status: 'delivered' as const, time: '1 min ago' },
    { id: '3', recipient: '+33 6 12 34 56 78 (Marc Dubois)', message: 'Penthouse Virtual Tour URL', status: 'sent' as const, time: '3 mins ago' },
    { id: '4', recipient: '+971 55 401 2299 (Fatima Al Mansoor)', message: 'Ejari Renewal Notice PDF', status: 'read' as const, time: '5 mins ago' },
  ]);

  return (
    <Wrap data-testid="whatsapp-telemetry-socket">
      <Head>
        <Title>
          <LiveDot />
          WhatsApp Webhook & Telemetry Stream
        </Title>
        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#25D366' }}>SOCKET: CONNECTED</span>
      </Head>
      <Body>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
          <div style={{ padding: '10px', background: 'rgba(15,23,42,0.7)', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
            <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Delivery Rate</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#25D366' }}>99.2%</div>
          </div>
          <div style={{ padding: '10px', background: 'rgba(15,23,42,0.7)', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
            <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Read Rate</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#38BDF8' }}>88.7%</div>
          </div>
          <div style={{ padding: '10px', background: 'rgba(15,23,42,0.7)', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
            <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Avg. Read Time</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFF' }}>38s</div>
          </div>
        </div>

        <StreamList>
          {events.map(ev => (
            <EventRow key={ev.id}>
              <EventInfo>
                <StatusTick $status={ev.status}>
                  {ev.status === 'read' ? '✓✓' : ev.status === 'delivered' ? '✓✓' : '✓'}
                </StatusTick>
                <div>
                  <div style={{ color: '#FFF', fontWeight: 700 }}>{ev.recipient}</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.68rem' }}>{ev.message}</div>
                </div>
              </EventInfo>
              <div style={{ color: '#64748B', fontSize: '0.68rem' }}>{ev.time}</div>
            </EventRow>
          ))}
        </StreamList>
      </Body>
    </Wrap>
  );
};

export default WhatsAppTelemetrySocket;
