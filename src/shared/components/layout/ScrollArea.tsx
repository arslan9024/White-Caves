import React from 'react';
import { StyledScrollArea, ScrollAreaViewport, ScrollAreaContent } from './ScrollArea.styles';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Child elements */
  children?: React.ReactNode;
  /** Height of the scroll area */
  height?: string;
  /** Width of the scroll area */
  width?: string;
  /** Scroll direction */
  direction?: 'vertical' | 'horizontal' | 'both';
}

const ScrollArea = React.memo<ScrollAreaProps>(({
  children,
  height = '400px',
  width,
  direction = 'vertical',
  className = '',
  ...props
}) => {
  return (
    <StyledScrollArea $height={height} $width={width} className={className} {...props}>
      <ScrollAreaViewport $direction={direction}>
        <ScrollAreaContent>
          {children}
        </ScrollAreaContent>
      </ScrollAreaViewport>
    </StyledScrollArea>
  );
});

ScrollArea.displayName = 'ScrollArea';

export default ScrollArea;
