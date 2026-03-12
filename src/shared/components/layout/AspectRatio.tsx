import React from 'react';
import { StyledAspectRatio, AspectRatioContent } from './AspectRatio.styles';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Child elements */
  children?: React.ReactNode;
  /** Aspect ratio as a number (e.g. 16/9 = 1.778) */
  ratio?: number;
}

const AspectRatio = React.memo<AspectRatioProps>(({
  children,
  ratio = 16 / 9,
  className = '',
  ...props
}) => {
  return (
    <StyledAspectRatio $ratio={ratio} className={className} {...props}>
      <AspectRatioContent>
        {children}
      </AspectRatioContent>
    </StyledAspectRatio>
  );
});

AspectRatio.displayName = 'AspectRatio';

export default AspectRatio;
