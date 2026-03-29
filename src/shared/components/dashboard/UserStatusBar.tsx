import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import './UserStatusBar.css';

export interface UserStatusBarProps {
  showTime?: boolean;
  showDate?: boolean;
  showOnlineStatus?: boolean;
  showGreeting?: boolean;
  userName?: string;
  compact?: boolean;
  className?: string;
}

interface NavigationState {
  isOnline?: boolean;
}

interface AuthUser {
  displayName?: string;
  name?: string;
}

interface RootState {
  navigation?: NavigationState;
  auth?: { user?: AuthUser };
}

const UserStatusBar = React.memo<UserStatusBarProps>(({
  showTime = true,
  showDate = true,
  showOnlineStatus = true,
  showGreeting = true,
  userName,
  compact = false,
  className = ''
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const isOnline = useSelector((state: RootState) => state.navigation?.isOnline ?? true);
  const user = useSelector((state: RootState) => state.auth?.user);
  const displayName = userName || user?.displayName || user?.name || 'User';

  useEffect(() => {
    // Update every 30s — minute-level precision is sufficient for a dashboard clock
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString('en-AE', {
      hour: '2-digit',
      minute: '2-digit',
      second: compact ? undefined : '2-digit',
      hour12: true
    });
  }, [currentTime, compact]);

  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString('en-AE', {
      weekday: compact ? 'short' : 'long',
      year: 'numeric',
      month: compact ? 'short' : 'long',
      day: 'numeric'
    });
  }, [currentTime, compact]);

  const greeting = useMemo(() => {
    // Use Dubai time (UTC+4) for consistent greetings
    const dubaiHour = parseInt(
      new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dubai', hour: 'numeric', hour12: false }).format(currentTime),
      10
    );
    if (dubaiHour < 12) return 'Good Morning';
    if (dubaiHour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, [currentTime]);

  const baseClass = 'wc-status-bar';
  const classes = [
    baseClass,
    compact && `${baseClass}--compact`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {showGreeting && (
        <div className={`${baseClass}__greeting`}>
          <span className={`${baseClass}__greeting-text`}>{greeting},</span>
          <span className={`${baseClass}__greeting-name`}>{displayName}</span>
        </div>
      )}
      
      <div className={`${baseClass}__info`}>
        {showOnlineStatus && (
          <div className={`${baseClass}__online`}>
            <span className={`${baseClass}__dot ${isOnline ? `${baseClass}__dot--online` : `${baseClass}__dot--offline`}`} />
            <span className={`${baseClass}__online-text`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        )}
        
        {(showTime || showDate) && (
          <div className={`${baseClass}__datetime`}>
            {showTime && (
              <span className={`${baseClass}__time`}>{formattedTime}</span>
            )}
            {showDate && (
              <span className={`${baseClass}__date`}>{formattedDate}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

UserStatusBar.displayName = 'UserStatusBar';

export default UserStatusBar;
