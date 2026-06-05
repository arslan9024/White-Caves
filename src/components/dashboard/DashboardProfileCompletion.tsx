import React, { FC } from 'react';

interface ProfileCompletionItem {
  id: string;
  label: string;
  complete: boolean;
}

interface DashboardProfileCompletionProps {
  percent: number;
  items: ProfileCompletionItem[];
  onFinishSetup: () => void;
}

const DashboardProfileCompletion: FC<DashboardProfileCompletionProps> = ({
  percent,
  items,
  onFinishSetup,
}) => {
  return (
    <section className="dashboard-profile-completion" aria-label="Profile setup status">
      <div className="dashboard-profile-completion__copy">
        <p className="dashboard-profile-completion__eyebrow">Post-login setup</p>
        <h2>Complete your profile</h2>
        <p>
          Your profile is {percent}% complete. Finishing setup improves lead assignment accuracy
          and team coordination.
        </p>
      </div>
      <div className="dashboard-profile-completion__actions">
        <ul>
          {items.map(item => (
            <li key={item.id}>
              <span aria-hidden="true">{item.complete ? '✅' : '⬜'}</span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        <button type="button" className="dashboard-profile-completion__cta" onClick={onFinishSetup}>
          Finish profile setup
        </button>
      </div>
    </section>
  );
};

export default DashboardProfileCompletion;
