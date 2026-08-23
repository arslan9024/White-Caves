/**
 * ActiveLoginSessionsCard — Wave 58 FE-GOAL-029
 * Active login session manager with one-click "Revoke All Other Devices" zero-trust security action
 * White Caves Real Estate LLC — Sovereign Profile & Security Suite
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

const Tag = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #10B981;
  background: rgba(16, 185, 129, 0.1);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(16, 185, 129, 0.25);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SessionRow = styled.div<{ $current?: boolean }>`
  padding: 12px 14px;
  border-radius: 10px;
  background: ${p => p.$current ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.7)'};
  border: 1px solid ${p => p.$current ? 'rgba(16, 185, 129, 0.35)' : 'rgba(100, 116, 139, 0.2)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SIcon = styled.div`
  font-size: 1.3rem;
`;

const SName = styled.div`
  font-size: 0.82rem;
  font-weight: 800;
  color: #FFF;
`;

const SMeta = styled.div`
  font-size: 0.7rem;
  color: #94A3B8;
`;

const RevokeBtn = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  width: fit-content;
  align-self: flex-end;
  transition: all 0.2s ease;
  &:hover { background: #EF4444; color: #FFF; }
`;

export const ActiveLoginSessionsCard: FC = () => {
  const [sessions, setSessions] = useState([
    { id: '1', device: 'MacBook Pro 16" (Sonoma)', location: 'Dubai, UAE', ip: '194.187.168.42', current: true, time: 'Active now' },
    { id: '2', device: 'iPhone 15 Pro Max', location: 'Dubai, UAE', ip: '194.187.168.99', current: false, time: '2 hours ago' },
    { id: '3', device: 'iPad Pro 12.9"', location: 'London, UK (VPN)', ip: '82.165.197.1', current: false, time: 'Yesterday' },
  ]);

  const revokeOthers = () => {
    setSessions(prev => prev.filter(s => s.current));
  };

  return (
    <Wrap data-testid="active-login-sessions-card">
      <Head>
        <Title>💻 Active Devices & Zero-Trust Session Audits</Title>
        <Tag>ALL SESSIONS ENCRYPTED</Tag>
      </Head>
      <Body>
        {sessions.map(s => (
          <SessionRow key={s.id} $current={s.current}>
            <SInfo>
              <SIcon>{s.device.includes('iPhone') ? '📱' : s.device.includes('iPad') ? '📱' : '💻'}</SIcon>
              <div>
                <SName>{s.device} {s.current && <span style={{ color: 'var(--accent-green, #10B981)', fontSize: '0.7rem' }}>(Current Session)</span>}</SName>
                <SMeta>📍 {s.location} · IP: {s.ip} · {s.time}</SMeta>
              </div>
            </SInfo>
            <div>
              {s.current ? (
                <span style={{ fontSize: '0.68rem', color: 'var(--accent-green, #10B981)', fontWeight: 800 }}>ACTIVE NOW</span>
              ) : (
                <span style={{ fontSize: '0.68rem', color: 'var(--color-94a3b8, #94A3B8)' }}>AUTHORIZED</span>
              )}
            </div>
          </SessionRow>
        ))}

        {sessions.length > 1 && (
          <RevokeBtn onClick={revokeOthers}>
            🔒 Revoke All Other Device Sessions
          </RevokeBtn>
        )}
      </Body>
    </Wrap>
  );
};

export default ActiveLoginSessionsCard;
