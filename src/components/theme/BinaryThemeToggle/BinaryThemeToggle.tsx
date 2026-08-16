import React, { FC, useState } from 'react';
import styled from 'styled-components';

const ToggleWrapper = styled.button<{ $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 2px solid #EF4444;
  background: ${({ $isDark }) => ($isDark ? '#0F172A' : '#FFFFFF')};
  color: ${({ $isDark }) => ($isDark ? '#FFFFFF' : '#1E293B')};
  font-weight: 800;
  font-size: 0.8rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.25);
  transition: all 0.2s ease;
`;

export const BinaryThemeToggle: FC = () => {
  const [isDark, setIsDark] = useState(true);

  return (
    <ToggleWrapper
      $isDark={isDark}
      onClick={() => setIsDark((prev) => !prev)}
      data-testid="binary-theme-toggle"
    >
      <span>{isDark ? '🌙 Slate Dark' : '☀️ Crisp Light'}</span>
    </ToggleWrapper>
  );
};

export default BinaryThemeToggle;
