/**
 * Form12MailTracker — Wave 48 GOAL-025
 * Statutory 12-Month Ejari Eviction Notice (Form 12) certified mail tracker
 * White Caves Real Estate LLC — Tenancy & Eviction Legal Suite
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

const LawBadge = styled.span`
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

const NoticeCard = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.2);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CountdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  text-align: center;
`;

const CountBox = styled.div`
  padding: 10px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
`;

const CountNumber = styled.div`
  font-size: 1.3rem;
  font-weight: 900;
  color: #EF4444;
`;

const CountLabel = styled.div`
  font-size: 0.62rem;
  color: #94A3B8;
  text-transform: uppercase;
  font-weight: 700;
  margin-top: 2px;
`;

const MailTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StepRow = styled.div<{ $completed: boolean; $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  background: ${p => p.$completed ? 'rgba(16, 185, 129, 0.06)' : p.$active ? 'rgba(239, 68, 68, 0.08)' : 'rgba(15, 23, 42, 0.5)'};
  border: 1px solid ${p => p.$completed ? 'rgba(16, 185, 129, 0.2)' : p.$active ? 'rgba(239, 68, 68, 0.3)' : 'rgba(100, 116, 139, 0.1)'};
`;

const StepDot = styled.div<{ $completed: boolean; $active?: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${p => p.$completed ? '#10B981' : p.$active ? '#EF4444' : '#475569'};
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.div<{ $completed: boolean }>`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${p => p.$completed ? '#E2E8F0' : '#94A3B8'};
`;

const StepDate = styled.div`
  font-size: 0.65rem;
  color: #64748B;
`;

export const Form12MailTracker: FC = () => {
  const [reason, setReason] = useState('Personal Use / First-Degree Relative');
  
  const noticeServedDate = '2026-03-01';
  const noticeExpiryDate = '2027-03-01';
  const daysRemaining = 199;
  const monthsRemaining = 6;
  const weeksRemaining = 28;

  const trackingSteps = [
    { title: 'Notary Public Legal Notice Drafted (Form 12)', date: '2026-02-24', completed: true },
    { title: 'Dubai Notary Public Certification & Apostille', date: '2026-02-26', completed: true },
    { title: 'Emirates Post / Aramex Certified Mail Dispatched', date: '2026-02-28', completed: true },
    { title: 'Proof of Delivery & Tenant Signature Captured', date: '2026-03-01', completed: true },
    { title: '6-Month Midterm Compliance Check-in', date: '2026-09-01', completed: false, active: true },
    { title: 'Statutory 12-Month Eviction Vacancy Deadline', date: '2027-03-01', completed: false },
  ];

  return (
    <Wrap data-testid="form-12-mail-tracker">
      <Head>
        <Title>📬 12-Month Eviction Notice Tracker (Form 12)</Title>
        <LawBadge>DUBAI LAW 26/2007</LawBadge>
      </Head>
      <Body>
        <NoticeCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--white, #FFF)' }}>
                Villa 44, Springs 11, Emirates Living
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-94a3b8, #94A3B8)', marginTop: '2px' }}>
                Tenant: Michael Thornton | Landlord: Tariq Mansoor
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-94a3b8, #94A3B8)', fontWeight: 700, textTransform: 'uppercase' }}>Reason for Eviction</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-gold, #F59E0B)', marginTop: '2px' }}>{reason}</div>
            </div>
          </div>

          <CountdownGrid>
            <CountBox>
              <CountNumber>{daysRemaining}</CountNumber>
              <CountLabel>Days Left</CountLabel>
            </CountBox>
            <CountBox>
              <CountNumber>{weeksRemaining}</CountNumber>
              <CountLabel>Weeks</CountLabel>
            </CountBox>
            <CountBox>
              <CountNumber>{monthsRemaining}</CountNumber>
              <CountLabel>Months</CountLabel>
            </CountBox>
            <CountBox>
              <CountNumber>100%</CountNumber>
              <CountLabel>Legal Validity</CountLabel>
            </CountBox>
          </CountdownGrid>
        </NoticeCard>

        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-94a3b8, #94A3B8)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Certified Dispatch & Notice Milestone Trail
          </div>
          <MailTimeline>
            {trackingSteps.map((step, i) => (
              <StepRow key={i} $completed={step.completed} $active={step.active}>
                <StepDot $completed={step.completed} $active={step.active} />
                <StepContent>
                  <StepTitle $completed={step.completed}>{step.title}</StepTitle>
                  <StepDate>📅 {step.date}</StepDate>
                </StepContent>
                {step.completed && <span style={{ fontSize: '0.7rem', color: 'var(--accent-green, #10B981)', fontWeight: 800 }}>✓ Verified</span>}
                {step.active && <span style={{ fontSize: '0.7rem', color: 'var(--accent-red, #EF4444)', fontWeight: 800 }}>In Progress</span>}
              </StepRow>
            ))}
          </MailTimeline>
        </div>

        <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', fontSize: '0.7rem', color: 'var(--accent-gold, #F59E0B)', lineHeight: '1.5' }}>
          ⚖️ <strong>Statutory Notice Rule:</strong> Under Dubai Law No. 26 of 2007 (as amended by Law No. 33 of 2008), eviction notices must be served with a minimum of 12 months notice via Notary Public or certified registered mail.
        </div>
      </Body>
    </Wrap>
  );
};

export default Form12MailTracker;
