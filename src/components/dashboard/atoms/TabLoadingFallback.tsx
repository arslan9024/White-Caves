import React, { FC } from 'react';
import styled from 'styled-components';
import SuspenseLoader from '../../common/SuspenseLoader';

const TabLoadingFallbackContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 360px;
`;

export const TabLoadingFallback: FC = () => (
  <TabLoadingFallbackContainer>
    <SuspenseLoader />
  </TabLoadingFallbackContainer>
);

export default TabLoadingFallback;
