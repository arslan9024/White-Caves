/**
 * AnimatedHeadlineGradient.tsx — View Layer (4-Way Component Architecture)
 * Sits at folder root: Pure presentational shell drawing data variables and logic hooks.
 */

import React, { FC } from 'react';
import { useAnimatedHeadlineGradientLogic, UseAnimatedHeadlineProps } from './logic/AnimatedHeadlineGradient.logic';
import { Headline } from './styles/AnimatedHeadlineGradient.style';

export interface AnimatedHeadlineGradientProps extends UseAnimatedHeadlineProps {
  className?: string;
}

export const AnimatedHeadlineGradient: FC<AnimatedHeadlineGradientProps> = ({
  title,
  fontSize,
  className,
}) => {
  const { displayTitle, fontSize: dynamicFontSize } = useAnimatedHeadlineGradientLogic({ title, fontSize });

  return (
    <Headline
      $fontSize={dynamicFontSize}
      className={className}
      data-testid="animated-headline-gradient"
    >
      {displayTitle}
    </Headline>
  );
};

export default AnimatedHeadlineGradient;
