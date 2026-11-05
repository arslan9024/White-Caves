import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setOnlineStatus } from '../../store/navigationSlice';

export default function UniversalComponents(): React.ReactElement | null {
  const dispatch = useDispatch();

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

  // Zero floating widgets rendered globally to keep dashboard 100% clean
  return null;
}
