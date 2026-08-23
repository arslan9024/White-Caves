/**
 * PasswordStrengthMeter — Wave 63 FE-GOAL-078
 * Real-time password entropy calculation and visual strength progress meter
 * White Caves Real Estate LLC — Auth & Security Suite
 */
import React, { FC, useState } from 'react';
import styled from 'styled-components';

const MeterContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: 'Inter', sans-serif;
`;

const BarTrack = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(100, 116, 139, 0.2);
  border-radius: 3px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $score: number }>`
  height: 100%;
  width: ${p => (p.$score / 4) * 100}%;
  background: ${p => 
    p.$score <= 1 ? '#EF4444' : 
    p.$score === 2 ? '#F59E0B' : 
    p.$score === 3 ? '#38BDF8' : '#10B981'
  };
  transition: all 0.3s ease;
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.68rem;
  font-weight: 700;
`;

export const PasswordStrengthMeter: FC<{ password?: string }> = ({ password = '' }) => {
  const calculateScore = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const score = calculateScore(password);
  const labels = ['Too Weak', 'Weak', 'Moderate', 'Strong', 'Enterprise Grade (AES Ready)'];

  return (
    <MeterContainer data-testid="password-strength-meter">
      <BarTrack>
        <BarFill $score={score} />
      </BarTrack>
      <StatusRow>
        <span style={{ color: 'var(--color-94a3b8, #94A3B8)' }}>Security Entropy:</span>
        <span style={{ color: score === 4 ? 'var(--accent-green, #10B981)' : score >= 2 ? 'var(--accent-gold, #F59E0B)' : 'var(--accent-red, #EF4444)' }}>
          {labels[score]}
        </span>
      </StatusRow>
    </MeterContainer>
  );
};

export default PasswordStrengthMeter;
