/**
 * AnimatedHeadlineGradient — Wave 56 FE-GOAL-004
 * Animated headline gradient typography transition from Pure White to White Caves Red (#EF4444)
 * White Caves Real Estate LLC — Typography & Aesthetics Suite
 */
import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Headline = styled.h1<{ $fontSize?: string }>`
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

export const AnimatedHeadlineGradient: FC<{ title?: string; fontSize?: string }> = ({
  title = 'Dubai Luxury Real Estate. Sovereign Precision.',
  fontSize,
}) => {
  return (
    <Headline $fontSize={fontSize} data-testid="animated-headline-gradient">
      {title}
    </Headline>
  );
};

export default AnimatedHeadlineGradient;
