import React, { FC } from 'react';

type GenericEntity = Record<string, unknown>;

interface ContextSelection {
  label: string;
  meta: string;
  type: 'tab' | 'module' | 'record';
}

interface CRMContextPanelProps {
  isSuperUser: boolean;
  activeWorkspaceLabel: string;
  activeWorkspaceMeta: string;
  selectedContext: ContextSelection | null;
  recentActivities: GenericEntity[];
  onOpenCommandPalette: () => void;
  onOpenQuickAction: () => void;
}

const getActivityText = (activity: GenericEntity): string =>
  (typeof activity.description === 'string' && activity.description) ||
  (typeof activity.message === 'string' && activity.message) ||
  (typeof activity.type === 'string' && activity.type) ||
  'Workspace activity update';

const getActivityTime = (activity: GenericEntity): string =>
  (typeof activity.timestamp === 'string' && activity.timestamp) ||
  (typeof activity.time === 'string' && activity.time) ||
  'Just now';

const CRMContextPanel: FC<CRMContextPanelProps> = ({
  isSuperUser,
  activeWorkspaceLabel,
  activeWorkspaceMeta,
  selectedContext,
  recentActivities,
  onOpenCommandPalette,
  onOpenQuickAction,
}) => {
  return (
    <aside className="crm-context-panel" aria-label="CRM contextual panel">
      <section className="crm-context-card">
        <p className="crm-context-card__eyebrow">Active Context</p>
        <h3>{selectedContext?.label ?? activeWorkspaceLabel}</h3>
        <p>{selectedContext?.meta ?? activeWorkspaceMeta}</p>
        <div className="crm-context-card__chips">
          <span className="crm-context-chip">Event-driven</span>
          {isSuperUser && <span className="crm-context-chip crm-context-chip--lion">MD priority</span>}
        </div>
      </section>

      <section className="crm-context-card">
        <p className="crm-context-card__eyebrow">Quick Actions</p>
        <div className="crm-context-actions">
          <button type="button" onClick={onOpenCommandPalette}>
            ⌘ Open command palette
          </button>
          <button type="button" onClick={onOpenQuickAction}>
            + New executive action
          </button>
        </div>
      </section>

      <section className="crm-context-card">
        <p className="crm-context-card__eyebrow">Operational Timeline</p>
        <div className="crm-context-timeline" role="list">
          {recentActivities.slice(0, 5).map((activity, index) => (
            <div key={`${getActivityText(activity)}-${index}`} className="crm-context-timeline__item" role="listitem">
              <span className="crm-context-timeline__dot" aria-hidden="true" />
              <div>
                <strong>{getActivityText(activity)}</strong>
                <small>{getActivityTime(activity)}</small>
              </div>
            </div>
          ))}
          {recentActivities.length === 0 && (
            <div className="crm-context-timeline__empty">No activity yet for this workspace.</div>
          )}
        </div>
      </section>
    </aside>
  );
};

export default CRMContextPanel;
