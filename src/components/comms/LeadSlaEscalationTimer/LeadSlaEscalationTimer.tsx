/**
 * LeadSlaEscalationTimer — Wave 51 GOAL-053
 * 15-minute lead SLA escalation timer with auto-reassignment to available supervisors
 * White Caves Real Estate LLC — Communications & CRM Suite
 */
import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.02); }`;

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

const SlaBadge = styled.span`
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

const LeadQueue = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LeadItem = styled.div<{ $urgent: boolean; $escalated: boolean }>`
  padding: 12px 14px;
  border-radius: 10px;
  background: ${p => p.$escalated ? 'rgba(239, 68, 68, 0.12)' : p.$urgent ? 'rgba(245, 158, 11, 0.08)' : 'rgba(15, 23, 42, 0.7)'};
  border: 1px solid ${p => p.$escalated ? 'rgba(239, 68, 68, 0.4)' : p.$urgent ? 'rgba(245, 158, 11, 0.3)' : 'rgba(100, 116, 139, 0.15)'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: ${p => p.$urgent && !p.$escalated ? pulse : 'none'} 2s infinite;
`;

const LeadInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const LeadName = styled.div`
  font-size: 0.85rem;
  font-weight: 800;
  color: #FFF;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LeadMeta = styled.div`
  font-size: 0.7rem;
  color: #94A3B8;
`;

const TimerSection = styled.div`
  text-align: right;
`;

const TimeRemaining = styled.div<{ $urgent: boolean; $escalated: boolean }>`
  font-size: 1.1rem;
  font-weight: 900;
  color: ${p => p.$escalated ? '#EF4444' : p.$urgent ? '#F59E0B' : '#10B981'};
`;

const AssignedAgent = styled.div`
  font-size: 0.65rem;
  color: #64748B;
  font-weight: 600;
`;

const ClaimBtn = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: #10B981;
  color: #FFF;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
  &:hover { filter: brightness(1.1); }
`;

interface Lead {
  id: string;
  name: string;
  inquiry: string;
  source: string;
  secondsRemaining: number;
  assignedTo: string;
  escalated: boolean;
}

export const LeadSlaEscalationTimer: FC = () => {
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'Khalid Al Mansoori', inquiry: 'AED 15M Penthouse Palm Jumeirah', source: 'WhatsApp Inbound', secondsRemaining: 742, assignedTo: 'Agent Sarah', escalated: false },
    { id: '2', name: 'David Miller', inquiry: 'Downtown 2BR Investment Villa', source: 'PropertyFinder VIP', secondsRemaining: 184, assignedTo: 'Agent Tariq', escalated: false },
    { id: '3', name: 'Olga Romanova', inquiry: 'Off-Plan Emaar Beachfront Cash Buyer', source: 'Direct Web Portal', secondsRemaining: 0, assignedTo: 'Supervisor Elena (Auto-Escalated)', escalated: true },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLeads(prev => prev.map(lead => {
        if (lead.secondsRemaining <= 0) {
          return {
            ...lead,
            secondsRemaining: 0,
            escalated: true,
            assignedTo: lead.assignedTo.includes('Supervisor') ? lead.assignedTo : 'Supervisor Elena (Auto-Escalated)'
          };
        }
        return { ...lead, secondsRemaining: lead.secondsRemaining - 1 };
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleClaim = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
    alert('Lead Claimed & WhatsApp Session Opened with Lead!');
  };

  return (
    <Wrap data-testid="lead-sla-escalation-timer">
      <Head>
        <Title>⏱️ 15-Minute Inbound Lead SLA & Escalation Engine</Title>
        <SlaBadge>P0 DISPATCH</SlaBadge>
      </Head>
      <Body>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
          <div style={{ padding: '8px', background: 'rgba(15,23,42,0.7)', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8', textTransform: 'uppercase' }}>Target Response</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10B981' }}>&lt; 5 Minutes</div>
          </div>
          <div style={{ padding: '8px', background: 'rgba(15,23,42,0.7)', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8', textTransform: 'uppercase' }}>Escalation Threshold</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F59E0B' }}>15 Minutes</div>
          </div>
          <div style={{ padding: '8px', background: 'rgba(15,23,42,0.7)', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8', textTransform: 'uppercase' }}>Auto Re-Route</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#EF4444' }}>Supervisor Pool</div>
          </div>
        </div>

        <LeadQueue>
          {leads.map(lead => {
            const isUrgent = lead.secondsRemaining < 300 && !lead.escalated;
            return (
              <LeadItem key={lead.id} $urgent={isUrgent} $escalated={lead.escalated}>
                <LeadInfo>
                  <LeadName>
                    {lead.name}
                    <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>
                      {lead.source}
                    </span>
                  </LeadName>
                  <LeadMeta>{lead.inquiry}</LeadMeta>
                  <AssignedAgent>👤 Assigned: {lead.assignedTo}</AssignedAgent>
                </LeadInfo>
                <TimerSection>
                  <TimeRemaining $urgent={isUrgent} $escalated={lead.escalated}>
                    {lead.escalated ? '🚨 ESCALATED' : `⏱ ${formatTimer(lead.secondsRemaining)}`}
                  </TimeRemaining>
                  <ClaimBtn onClick={() => handleClaim(lead.id)}>✓ Claim Lead</ClaimBtn>
                </TimerSection>
              </LeadItem>
            );
          })}
        </LeadQueue>
      </Body>
    </Wrap>
  );
};

export default LeadSlaEscalationTimer;
