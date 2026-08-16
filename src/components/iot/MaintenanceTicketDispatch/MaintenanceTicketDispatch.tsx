/**
 * MaintenanceTicketDispatch — Wave 52 GOAL-062
 * Facilities maintenance ticket dispatch with contractor SLA countdown
 * White Caves Real Estate LLC — Asset Management & IoT Facilities Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 2px solid rgba(239, 68, 68, 0.25);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(239, 68, 68, 0.05);
  border-bottom: 1px solid rgba(239, 68, 68, 0.12);
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

const StatusTag = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #EF4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(239, 68, 68, 0.25);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TicketList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TicketCard = styled.div<{ $severity: 'critical' | 'high' | 'normal' }>`
  padding: 14px;
  border-radius: 10px;
  background: ${p => p.$severity === 'critical' ? 'rgba(239, 68, 68, 0.08)' : p.$severity === 'high' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(15, 23, 42, 0.7)'};
  border: 1px solid ${p => p.$severity === 'critical' ? 'rgba(239, 68, 68, 0.35)' : p.$severity === 'high' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(100, 116, 139, 0.15)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TicketInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const TTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 800;
  color: #FFF;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TMeta = styled.div`
  font-size: 0.7rem;
  color: #94A3B8;
`;

const TContractor = styled.div`
  font-size: 0.65rem;
  color: #64748B;
  font-weight: 600;
`;

const SlaBlock = styled.div`
  text-align: right;
`;

const SlaCountdown = styled.div<{ $severity: 'critical' | 'high' | 'normal' }>`
  font-size: 1rem;
  font-weight: 900;
  color: ${p => p.$severity === 'critical' ? '#EF4444' : p.$severity === 'high' ? '#F59E0B' : '#10B981'};
`;

const DispatchBtn = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: #EF4444;
  color: #FFF;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
  &:hover { filter: brightness(1.1); }
`;

export const MaintenanceTicketDispatch: FC = () => {
  const [tickets, setTickets] = useState([
    { id: 'T-1089', issue: 'Chiller & Central AC Total Breakdown', unit: 'Penthouse 4501, Marina 23', severity: 'critical' as const, slaHoursLeft: 1.5, contractor: 'CoolTech HVAC Specialists', status: 'Dispatched' },
    { id: 'T-1090', issue: 'Main Water Line Leakage in Kitchen', unit: 'Villa 12, Palm Jumeirah', severity: 'high' as const, slaHoursLeft: 3.8, contractor: 'Emirates Plumbing LLC', status: 'Under Review' },
    { id: 'T-1091', issue: 'Smart Intercom & Biometric Lock Glitch', unit: 'Apartment 804, Downtown Views', severity: 'normal' as const, slaHoursLeft: 22.0, contractor: 'SmartSecure IoT Systems', status: 'Scheduled' },
  ]);

  const handleResolve = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
    alert(`Ticket ${id} marked as inspected and resolved!`);
  };

  return (
    <Wrap data-testid="maintenance-ticket-dispatch">
      <Head>
        <Title>🔧 IoT Maintenance & Contractor Dispatch SLA</Title>
        <StatusTag>FACILITIES CONTROL</StatusTag>
      </Head>
      <Body>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
          <div style={{ padding: '8px', background: 'rgba(15,23,42,0.7)', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8' }}>Critical SLA</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#EF4444' }}>&lt; 4 Hours</div>
          </div>
          <div style={{ padding: '8px', background: 'rgba(15,23,42,0.7)', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8' }}>High SLA</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F59E0B' }}>&lt; 12 Hours</div>
          </div>
          <div style={{ padding: '8px', background: 'rgba(15,23,42,0.7)', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8' }}>Standard SLA</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10B981' }}>&lt; 48 Hours</div>
          </div>
        </div>

        <TicketList>
          {tickets.map(ticket => (
            <TicketCard key={ticket.id} $severity={ticket.severity}>
              <TicketInfo>
                <TTitle>
                  <span>{ticket.id}: {ticket.issue}</span>
                </TTitle>
                <TMeta>📍 {ticket.unit}</TMeta>
                <TContractor>👷 Contractor: {ticket.contractor}</TContractor>
              </TicketInfo>
              <SlaBlock>
                <SlaCountdown $severity={ticket.severity}>
                  ⏱ {ticket.slaHoursLeft}h SLA
                </SlaCountdown>
                <DispatchBtn onClick={() => handleResolve(ticket.id)}>
                  ✓ Resolve Ticket
                </DispatchBtn>
              </SlaBlock>
            </TicketCard>
          ))}
        </TicketList>
      </Body>
    </Wrap>
  );
};

export default MaintenanceTicketDispatch;
