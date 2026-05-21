import React, { FC, ReactNode } from 'react';

interface AuthenticatedPageShellProps {
  children: ReactNode;
  className?: string;
  contentAnchorId?: string;
  skipLinkLabel?: string;
}

/**
 * Shared authenticated page shell baseline for post-login UX refactor waves.
 * Keeps skip-link accessibility and page wrapper contract consistent.
 */
const AuthenticatedPageShell: FC<AuthenticatedPageShellProps> = ({
  children,
  className = 'unified-dashboard',
  contentAnchorId = 'dashboard-main',
  skipLinkLabel = 'Skip to dashboard content',
}) => {
  return (
    <div className={className}>
      <a className="dashboard-skip-link" href={`#${contentAnchorId}`}>
        {skipLinkLabel}
      </a>
      {children}
    </div>
  );
};

export default AuthenticatedPageShell;
