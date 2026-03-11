import React from 'react';
import { StyledScrollArea, ScrollAreaViewport, ScrollAreaContent } from './ScrollArea.styles';

const ScrollArea = React.memo(({
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
