import React from 'react';
import { StyledAspectRatio, AspectRatioContent } from './AspectRatio.styles';

const AspectRatio = React.memo(({
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
