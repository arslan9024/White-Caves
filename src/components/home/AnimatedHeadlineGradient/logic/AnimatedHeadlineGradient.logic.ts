/**
 * AnimatedHeadlineGradient.logic.ts — Hook & Logic Layer
 */

import { ANIMATED_HEADLINE_DATA } from '../data/AnimatedHeadlineGradient.data';

export interface UseAnimatedHeadlineProps {
  title?: string;
  fontSize?: string;
}

export function useAnimatedHeadlineGradientLogic(props?: UseAnimatedHeadlineProps) {
  const displayTitle = props?.title || ANIMATED_HEADLINE_DATA.defaultTitle;

  return {
    displayTitle,
    fontSize: props?.fontSize,
  };
}
