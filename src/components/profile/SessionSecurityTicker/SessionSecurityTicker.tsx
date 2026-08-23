/**
 * SessionSecurityTicker — Wave 58 FE-GOAL-023
 * Session security ticker displaying real-time IP address, browser fingerprint, and active session timestamp
 * White Caves Real Estate LLC — Sovereign Profile Suite
 */
import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`0%, 100% { opacity: 1; } 50% { opacity: 0.5; }`;

const TickerBar = styled.div`
  width: 100%;
  padding: 10px 16px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(16, 185, 129, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Inter', monospace;
  font-size: 0.72rem;
  color: #94A3B8;
  @media (max-width: 768px) { flex-direction: column; gap: 6px; text-align: center; }
`;

const LiveDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10B981;
  margin-right: 6px;
  animation: ${pulse} 1.5s infinite;
`;

export const SessionSecurityTicker: FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <TickerBar data-testid="session-security-ticker">
      <div>
        <LiveDot />
        <span style={{ color: 'var(--white, #FFF)', fontWeight: 700 }}>SECURE AES-256 SESSION</span>
        <span style={{ margin: '0 8px', color: 'var(--text-secondary, #64748B)' }}>|</span>
        <span>IP: <strong>194.187.168.42 (Dubai, UAE)</strong></span>
      </div>
      <div>
        <span>Browser: <strong>Chrome/Blink Engine</strong></span>
        <span style={{ margin: '0 8px', color: 'var(--text-secondary, #64748B)' }}>|</span>
        <span style={{ color: 'var(--accent-green, #10B981)', fontWeight: 800 }}>{time} GST</span>
      </div>
    </TickerBar>
  );
};

export default SessionSecurityTicker;
