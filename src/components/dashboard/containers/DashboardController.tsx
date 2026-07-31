import React, { FC, ReactNode } from 'react';

interface DashboardControllerProps {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  isLoading?: boolean;
}

export const DashboardController: FC<DashboardControllerProps> = ({
  title,
  subtitle,
  children,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div
        className="dashboard-controller loading-state"
        style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-888, #888)' }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-controller">
      <div className="dashboard-controller__header" style={{ marginBottom: '1.5rem' }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            margin: '0 0 0.5rem 0',
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="dashboard-controller__content">{children}</div>
    </div>
  );
};
