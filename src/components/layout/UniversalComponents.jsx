import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineStatus, updateCurrentTime } from '../../store/navigationSlice';
import ClickToChat from '../ClickToChat';
import './UniversalComponents.css';

export default function UniversalComponents() {
  const dispatch = useDispatch();
  const { isOnline, currentTime } = useSelector(state => state.navigation);

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

  return (
    <>
      <ClickToChat />
      
      <div className="universal-time-display">
        <span className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? 'Connected' : 'Offline'}
        </span>
      </div>
    </>
  );
}
