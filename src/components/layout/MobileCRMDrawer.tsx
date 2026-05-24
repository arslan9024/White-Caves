import React, { FC, useEffect } from 'react';
import type { RoleTab } from '../../config/ROLE_TAB_MAPPING';

interface CRMModuleEntry {
  label: string;
}

interface MobileCRMDrawerProps {
  isOpen: boolean;
  tabs: RoleTab[];
  activeTab: string;
  selectedCRMModule: string | null;
  isSuperUser: boolean;
  moduleEntries: Array<[string, CRMModuleEntry]>;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
  onSelectModule: (moduleId: string) => void;
}

const MobileCRMDrawer: FC<MobileCRMDrawerProps> = ({
  isOpen,
  tabs,
  activeTab,
  selectedCRMModule,
  isSuperUser,
  moduleEntries,
  onClose,
  onSelectTab,
  onSelectModule,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="mobile-crm-drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        className="mobile-crm-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="CRM navigation drawer"
        onClick={event => event.stopPropagation()}
      >
        <div className="mobile-crm-drawer__header">
          <strong>CRM Navigation</strong>
          <button type="button" onClick={onClose} aria-label="Close navigation drawer">
            ✕
          </button>
        </div>

        <div className="mobile-crm-drawer__section">
          <span className="mobile-crm-drawer__label">Workspaces</span>
          <div className="mobile-crm-drawer__list">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`mobile-crm-drawer__item ${activeTab === tab.id && !selectedCRMModule ? 'active' : ''}`}
                onClick={() => {
                  onSelectTab(tab.id);
                  onClose();
                }}
              >
                <span aria-hidden="true">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {isSuperUser && (
          <div className="mobile-crm-drawer__section">
            <span className="mobile-crm-drawer__label">AI CRM Modules</span>
            <div className="mobile-crm-drawer__list">
              {moduleEntries.map(([key, module]) => (
                <button
                  key={key}
                  type="button"
                  className={`mobile-crm-drawer__item ${selectedCRMModule === key ? 'active' : ''}`}
                  onClick={() => {
                    onSelectModule(key);
                    onClose();
                  }}
                >
                  <span aria-hidden="true">🤖</span>
                  <span>{module.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default MobileCRMDrawer;
