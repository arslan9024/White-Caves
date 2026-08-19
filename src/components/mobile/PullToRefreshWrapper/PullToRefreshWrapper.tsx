/**
 * PullToRefreshWrapper.tsx — View Layer (4-Way Component Architecture)
 * Touch gesture pull-to-refresh container for mobile CRM lists.
 */

import React, { FC, ReactNode } from 'react';
import { RefreshCw, ArrowDown } from 'lucide-react';
import { usePullToRefreshLogic } from './logic/PullToRefreshWrapper.logic';
import {
  WrapperContainer,
  PullIndicator,
  SpinningIcon,
  ContentShift,
} from './styles/PullToRefreshWrapper.style';

interface Props {
  onRefresh: () => Promise<void>;
  children: ReactNode;
}

export const PullToRefreshWrapper: FC<Props> = ({ onRefresh, children }) => {
  const {
    isPulling,
    isRefreshing,
    pullDistance,
    threshold,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  } = usePullToRefreshLogic(onRefresh);

  const showIndicator = isPulling || isRefreshing;
  const offset = isPulling ? pullDistance * 0.6 : isRefreshing ? 44 : 0;
  const readyToRelease = pullDistance >= threshold;

  return (
    <WrapperContainer
      data-testid="pull-to-refresh-wrapper"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {showIndicator && (
        <PullIndicator $distance={offset + 48} $active={isPulling}>
          <SpinningIcon $spinning={isRefreshing}>
            {isRefreshing ? (
              <RefreshCw size={18} />
            ) : (
              <ArrowDown
                size={18}
                style={{
                  transform: readyToRelease ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                  color: '#fff',
                }}
              />
            )}
          </SpinningIcon>
        </PullIndicator>
      )}
      <ContentShift $offset={offset}>{children}</ContentShift>
    </WrapperContainer>
  );
};

export default PullToRefreshWrapper;
