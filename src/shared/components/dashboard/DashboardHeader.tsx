import React from 'react';
import UserStatusBar from './UserStatusBar';
import './DashboardHeader.css';

export interface UserStatusBarPassthroughProps {
  showTime?: boolean;
  showDate?: boolean;
  showOnlineStatus?: boolean;
  showGreeting?: boolean;
  userName?: string;
  compact?: boolean;
  className?: string;
}

export interface DashboardHeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  showStatusBar?: boolean;
  statusBarProps?: UserStatusBarPassthroughProps;
  breadcrumbs?: React.ReactNode;
  className?: string;
}

const DashboardHeader = React.memo<DashboardHeaderProps>(({
  title,
  subtitle,
  actions,
  showStatusBar = true,
  statusBarProps = {},
  breadcrumbs,
  className = ''
}) => {
  const baseClass = 'wc-dashboard-header';
  const classes = [baseClass, className].filter(Boolean).join(' ');

  return (
    <header className={classes}>
      {showStatusBar && (
        <UserStatusBar {...statusBarProps} />
      )}
      
      {breadcrumbs && (
        <nav className={`${baseClass}__breadcrumbs`} aria-label="Breadcrumb">
          {breadcrumbs}
        </nav>
      )}
      
      <div className={`${baseClass}__main`}>
        <div className={`${baseClass}__text`}>
          {title && <h1 className={`${baseClass}__title`}>{title}</h1>}
          {subtitle && <p className={`${baseClass}__subtitle`}>{subtitle}</p>}
        </div>
        
        {actions && (
          <div className={`${baseClass}__actions`}>
            {actions}
          </div>
        )}
      </div>
    </header>
  );
});

DashboardHeader.displayName = 'DashboardHeader';

export default DashboardHeader;
