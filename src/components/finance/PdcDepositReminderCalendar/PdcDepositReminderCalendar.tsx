import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { apiClient } from '../../../services/apiClient';

/** Typed GraphQL response shape for postDatedCheques query */
interface PdcChequeItem {
  id: string;
  amount: number;
  dueDate: string;
  status: string;
}

interface PdcGraphQLResponse {
  postDatedCheques: PdcChequeItem[];
}

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const shineGold = keyframes`to { background-position: 200% center; }`;

const Wrapper = styled.div`
  width: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.75) 100%);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(212, 175, 55, 0.4);
  box-shadow: 0 40px 100px rgba(212, 175, 55, 0.15), inset 0 1px 0 rgba(255, 255, 255, 1);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1) ease;
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Header = styled.div`
  padding: 18px 24px;
  background: rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(212, 175, 55, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(to right, #C5A059 0%, #D4AF37 50%, #E6C27A 100%);
  background-size: 200% auto;
  color: #0f0f0f;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shineGold} 5s linear infinite;
`;

const Body = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 16px;
`;

const DayHeader = styled.div`
  text-align: center;
  font-size: 0.7rem;
  font-weight: 800;
  color: #64748B;
  padding: 6px 0;
`;

const DayCell = styled.div<{ $hasEvent: boolean; $today: boolean; $type?: string }>`
  aspect-ratio: 1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: ${p => p.$today ? 900 : 700};
  cursor: ${p => p.$hasEvent ? 'pointer' : 'default'};
  background: ${p => p.$today ? 'rgba(212, 175, 55, 0.15)' :
    p.$type === 'deposit' ? 'rgba(245,158,11,0.1)' :
    p.$type === 'warning' ? 'rgba(239,68,68,0.1)' :
    p.$type === 'paid' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.6)'};
  border: 1px solid ${p => p.$today ? '#D4AF37' :
    p.$type === 'deposit' ? 'rgba(245,158,11,0.3)' :
    p.$type === 'warning' ? 'rgba(239,68,68,0.3)' :
    p.$type === 'paid' ? 'rgba(16,185,129,0.3)' : 'rgba(0,0,0,0.04)'};
  color: ${p => p.$today ? '#0f0f0f' : '#334155'};
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: ${p => p.$today ? '0 4px 12px rgba(212, 175, 55, 0.2)' : 'none'};
  
  &:hover {
    transform: ${p => p.$hasEvent ? 'translateY(-2px) scale(1.05)' : 'none'};
    box-shadow: ${p => p.$hasEvent ? '0 8px 16px rgba(212, 175, 55, 0.15)' : 'none'};
    border-color: ${p => p.$hasEvent ? '#D4AF37' : 'inherit'};
  }
`;

const ChequeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ChequeCard = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 12px;
  background: #FFFFFF;
  border: 1px solid ${p => ({ UPCOMING: 'rgba(245,158,11,0.2)', DUE: 'rgba(239,68,68,0.2)', DEPOSITED: 'rgba(16,185,129,0.2)', BOUNCED: 'rgba(239,68,68,0.3)' }[p.$status] || 'rgba(0,0,0,0.05)')};
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  
  &:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 16px 40px rgba(212, 175, 55, 0.1);
  }
`;

const ChequeNum = styled.div`
  font-size: 0.75rem;
  color: #64748B;
  font-weight: 700;
  min-width: 80px;
`;

const ChequeAmount = styled.div`
  font-size: 1rem;
  font-weight: 900;
  color: #0f0f0f;
`;

const ChequeDue = styled.div`
  font-size: 0.75rem;
  color: #94A3B8;
  margin-top: 2px;
  font-weight: 600;
`;

const StatusBadge = styled.div<{ $status: string }>`
  margin-left: auto;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  background: ${p => ({ UPCOMING: 'rgba(245,158,11,0.1)', DUE: 'rgba(239,68,68,0.1)', DEPOSITED: 'rgba(16,185,129,0.1)', BOUNCED: 'rgba(239,68,68,0.15)' }[p.$status] || 'rgba(0,0,0,0.05)')};
  color: ${p => ({ UPCOMING: '#D97706', DUE: '#DC2626', DEPOSITED: '#059669', BOUNCED: '#DC2626' }[p.$status] || '#64748B')};
  border: 1px solid ${p => ({ UPCOMING: 'rgba(245,158,11,0.2)', DUE: 'rgba(239,68,68,0.2)', DEPOSITED: 'rgba(16,185,129,0.2)', BOUNCED: 'rgba(239,68,68,0.3)' }[p.$status] || 'transparent')};
`;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const EVENTS: Record<number, { type: string }> = {
  3: { type: 'paid' }, 7: { type: 'warning' }, 14: { type: 'deposit' }, 21: { type: 'deposit' }, 28: { type: 'warning' }
};

type Cheque = {
  id: string;
  amount: number;
  dueDate: string;
  status: string;
};

export const PdcDepositReminderCalendar: FC = () => {
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheques = async () => {
      try {
        const query = `
          query {
            postDatedCheques {
              id
              amount
              dueDate
              status
            }
          }
        `;
        const res = await apiClient.post<{ data?: PdcGraphQLResponse }>('/graphql', { query });
        if (res?.data?.postDatedCheques) {
          setCheques(res.data.postDatedCheques);
        }
      } catch (err) {
        console.error('Failed to fetch PDCs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCheques();
  }, []);

  return (
    <Wrapper data-testid="pdc-deposit-reminder-calendar">
      <Header>
        <Title>📅 PDC Deposit Reminder Calendar</Title>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #64748B)' }}>7-day bank notification</div>
      </Header>
      <Body style={{ opacity: loading ? 0.6 : 1 }}>
        <CalendarGrid>
          {DAYS.map(d => <DayHeader key={d}>{d}</DayHeader>)}
          {Array.from({ length: 35 }).map((_, i) => {
            const day = i - 2;
            const dayNum = day + 1;
            if (day < 0 || day >= 31) return <div key={i} />;
            const ev = EVENTS[dayNum];
            return (
              <DayCell key={i} $hasEvent={!!ev} $today={dayNum === 14} $type={ev?.type}>
                {dayNum}
              </DayCell>
            );
          })}
        </CalendarGrid>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.65rem', color: 'var(--text-secondary, #64748B)' }}>
          <span style={{ color: 'var(--accent-gold, #F59E0B)' }}>■</span> Due Soon
          <span style={{ color: 'var(--accent-red, #EF4444)' }}>■</span> 7-Day Alert
          <span style={{ color: 'var(--accent-green, #10B981)' }}>■</span> Deposited
        </div>
        <ChequeList>
          {cheques.length === 0 && !loading && <div style={{ color: 'var(--text-secondary, #64748B)', fontSize: '0.8rem', textAlign: 'center', padding: '10px' }}>No cheques found.</div>}
          {cheques.map(c => (
            <ChequeCard key={c.id} $status={c.status}>
              <ChequeNum>{c.id}</ChequeNum>
              <div><ChequeAmount>AED {c.amount.toLocaleString()}</ChequeAmount><ChequeDue>{new Date(c.dueDate).toLocaleDateString('en-AE')}</ChequeDue></div>
              <StatusBadge $status={c.status}>{c.status}</StatusBadge>
            </ChequeCard>
          ))}
        </ChequeList>
      </Body>
    </Wrapper>
  );
};
export default PdcDepositReminderCalendar;
