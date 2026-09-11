import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0;display:flex;align-items:center;gap:8px`;

const StatGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px`;
const StatCard = styled.div<{$color:string}>`background:${p=>p.$color}10;border:1px solid ${p=>p.$color}30;border-radius:12px;padding:16px;text-align:center`;
const SVal = styled.div<{$color:string}>`font-size:1.6rem;font-weight:900;color:${p=>p.$color}`;
const SLab = styled.div`font-size:.7rem;color:#94A3B8;margin-top:4px;text-transform:uppercase;letter-spacing:1px;font-weight:700`;

const QueueList = styled.div`display:flex;flex-direction:column;gap:12px`;
const QItem = styled.div`background:rgba(30,41,59,0.5);border:1px solid rgba(100,116,139,0.3);border-radius:12px;padding:16px;display:flex;justify-content:space-between;align-items:center`;

const UserInfo = styled.div`display:flex;align-items:center;gap:12px`;
const Avatar = styled.div`width:40px;height:40px;border-radius:20px;background:#38BDF8;color:#FFF;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.9rem`;
const Name = styled.div`font-size:.9rem;font-weight:700;color:#E2E8F0`;
const DocType = styled.div`font-size:.7rem;color:#94A3B8;margin-top:4px`;

const Actions = styled.div`display:flex;gap:8px`;
const Btn = styled.button<{$type:'approve'|'reject'|'view'}>`
  padding:8px 16px;border-radius:6px;font-size:.75rem;font-weight:700;cursor:pointer;border:none;
  background:${p=>p.$type==='approve'?'#10B981':p.$type==='reject'?'rgba(239,68,68,0.2)':'rgba(56,189,248,0.2)'};
  color:${p=>p.$type==='approve'?'#FFF':p.$type==='reject'?'#EF4444':'#38BDF8'};
`;

const QUEUE = [
  { id: 1, name: 'Alexei Volkov', doc: 'Emirates ID (Front & Back) + Passport' },
  { id: 2, name: 'Sarah Jenkins', doc: 'Passport + Proof of Address' },
];

export const KYCVerificationDashboard: FC = () => {
  return (
    <Wrap data-testid="kyc-verification-dashboard">
      <Title>🛡️ KYC Compliance Queue</Title>
      
      <StatGrid>
        <StatCard $color="#F59E0B"><SVal $color="#F59E0B">24</SVal><SLab>Pending Review</SLab></StatCard>
        <StatCard $color="#10B981"><SVal $color="#10B981">142</SVal><SLab>Verified (MTD)</SLab></StatCard>
        <StatCard $color="#EF4444"><SVal $color="#EF4444">3</SVal><SLab>Rejected (MTD)</SLab></StatCard>
      </StatGrid>

      <QueueList>
        {QUEUE.map(q => (
          <QItem key={q.id}>
            <UserInfo>
              <Avatar>{q.name.charAt(0)}</Avatar>
              <div>
                <Name>{q.name}</Name>
                <DocType>{q.doc}</DocType>
              </div>
            </UserInfo>
            <Actions>
              <Btn $type="view">Review Docs</Btn>
              <Btn $type="approve">Approve</Btn>
              <Btn $type="reject">Reject</Btn>
            </Actions>
          </QItem>
        ))}
      </QueueList>
    </Wrap>
  );
};
export default KYCVerificationDashboard;
