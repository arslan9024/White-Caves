import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineStatus } from '../../store/navigationSlice';
import { TIMING } from '../../constants/app';
import { CavesFloatingWidget, CavesFloatingSearch } from '../shared';
import { TimeDisplayContainer, ConnectionStatus } from './UniversalComponents/styles';


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavigationState {
  isOnline: boolean;
}

interface RootState {
  navigation: NavigationState;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function UniversalComponents(): React.ReactElement {
  const dispatch = useDispatch();
  const { isOnline } = useSelector((state: RootState) => state.navigation);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Clock dispatch removed — no components consume state.navigation.currentTime
  // Online status tracking is handled below

  useEffect(() => {
    const handleOnline = () => dispatch(setOnlineStatus(true));
    const handleOffline = () => dispatch(setOnlineStatus(false));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    dispatch(setOnlineStatus(navigator.onLine));
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  useEffect(() => {
    setIsVisible(true);
    
    if (!isHovered) {
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, TIMING.SUCCESS_DISMISS);
      
      return () => clearTimeout(hideTimer);
    }
  }, [isOnline, isHovered]);

  const handleMouseEnter = useCallback((): void => {
    setIsHovered(true);
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback((): void => {
    setIsHovered(false);
  }, []);

  return (
    <>
      <CavesFloatingSearch />
      <CavesFloatingWidget />


      
      <TimeDisplayContainer 
        $isVisible={isVisible}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ConnectionStatus $isOnline={isOnline}>
          {isOnline ? 'Connected' : 'Offline'}
        </ConnectionStatus>
      </TimeDisplayContainer>
    </>
  );
}
