/**
 * AnimatedHeadlineGradient.style.ts — UI Style Layer & Styled-Components
 * Enforces White Caves Red / Brilliant White high-density gradient transition.
 */

import styled, { keyframes } from 'styled-components';

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const Headline = styled.h1<{ $fontSize?: string }>`
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: ${p => p.$fontSize || 'clamp(2rem, 5vw, 3.8rem)'};
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1.1;
  background: linear-gradient(135deg, #FFFFFF 0%, #F87171 45%, #EF4444 80%, #FFFFFF 100%);
  background-size: 250% 250%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradientShift} 6s ease infinite;
  text-shadow: 0 10px 30px rgba(239, 68, 68, 0.2);
`;
