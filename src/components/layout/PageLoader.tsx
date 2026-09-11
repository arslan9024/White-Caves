import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`0%{opacity:0.4;transform:scale(0.95)}50%{opacity:1;transform:scale(1)}100%{opacity:0.4;transform:scale(0.95)}`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  min-width: 100%;
  height: 100%;
  width: 100%;
  color: #38BDF8;
  font-family: 'Inter', sans-serif;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  border: 3px solid rgba(56, 189, 248, 0.2);
  border-top-color: #38BDF8;
  animation: ${pulse} 1s infinite ease-in-out;
  margin-bottom: 16px;
`;

export const PageLoader: FC = () => {
  return (
    <Wrap aria-busy="true" aria-live="polite">
      <Spinner />
      <div style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px' }}>LOADING MODULE...</div>
    </Wrap>
  );
};
export default PageLoader;
