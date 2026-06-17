import React, { FC } from 'react';

interface ProfileCompletionItem {
  id: string;
  label: string;
  complete: boolean;
}

interface DashboardGreetingBannerProps {
  currentModule?: string | null;
  currentRole: string;
  workspaceLabel: string;
  roleLabel: string;
  roleDescription: string;
  greetingLine: string;
  userEmail: string;
  profileCompletionPercent: number;
  profileCompletionItems: ProfileCompletionItem[];
  showProfileCompletion: boolean;
  onOpenProfile: () => void;
}

const DashboardGreetingBanner: FC<DashboardGreetingBannerProps> = ({
  currentModule,
  currentRole,
  workspaceLabel,
  roleLabel,
  roleDescription,
  greetingLine,
  userEmail,
  profileCompletionPercent,
  profileCompletionItems,
  showProfileCompletion,
  onOpenProfile,
}) => {
  return (
    <>
      <section className="dashboard-page-header">
        <div className="dashboard-page-header__copy">
          <span className="dashboard-page-header__eyebrow">
            {currentModule ?? currentRole} / {workspaceLabel}
          </span>
          <h1>{roleLabel} Dashboard</h1>
          <p className="dashboard-page-header__subtitle">{roleDescription}</p>
          <p className="dashboard-page-header__greeting">{greetingLine}</p>
        </div>
        <div className="dashboard-page-header__meta">
          <div className="dashboard-breadcrumbs" aria-label="Breadcrumb">
            <span>CRM</span>
            <span aria-hidden="true">/</span>
            <span>{roleLabel}</span>
            <span aria-hidden="true">/</span>
            <span>{workspaceLabel}</span>
          </div>
          <div className="dashboard-page-header__status">
            <span className="dashboard-status-pill">Live workspace</span>
            <span className="dashboard-status-pill dashboard-status-pill--muted">{userEmail}</span>
          </div>
        </div>
      </section>

      {showProfileCompletion && (
        <section className="dashboard-profile-completion" aria-label="Profile setup status">
          <div className="dashboard-profile-completion__copy">
            <p className="dashboard-profile-completion__eyebrow">Post-login setup</p>
            <h2>Complete your profile</h2>
            <p>
              Your profile is {profileCompletionPercent}% complete. Finishing setup improves lead
              assignment accuracy and team coordination.
            </p>
          </div>
          <div className="dashboard-profile-completion__actions">
            <ul>
              {profileCompletionItems.map(item => (
                <li key={item.id}>
                  <span aria-hidden="true">{item.complete ? '✅' : '⬜'}</span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="dashboard-profile-completion__cta" onClick={onOpenProfile}>
              Finish profile setup
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default DashboardGreetingBanner;
