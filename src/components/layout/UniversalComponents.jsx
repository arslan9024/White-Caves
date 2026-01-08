import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineStatus, updateCurrentTime } from '../../store/navigationSlice';
import ClickToChat from '../ClickToChat';
import './UniversalComponents.css';

export default function UniversalComponents() {
  const dispatch = useDispatch();
  const { isOnline } = useSelector(state => state.navigation);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(updateCurrentTime(new Date().toISOString()));
    }, 1000);
    return () => clearInterval(timer);
  }, [dispatch]);

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
      }, 3000);
      
      return () => clearTimeout(hideTimer);
    }
  }, [isOnline, isHovered]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <>
      <ClickToChat />
      
      <div 
        className={`universal-time-display ${isVisible ? 'visible' : 'hidden'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? 'Connected' : 'Offline'}
        </span>
      </div>
    </>
  );
}
