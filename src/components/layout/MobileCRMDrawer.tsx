import React, { FC, useEffect, useRef } from 'react';
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
  const touchStartXRef = useRef<number | null>(null);
  const touchCurrentXRef = useRef<number | null>(null);

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

  const handleTouchStart: React.TouchEventHandler<HTMLElement> = event => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
    touchCurrentXRef.current = touchStartXRef.current;
  };

  const handleTouchMove: React.TouchEventHandler<HTMLElement> = event => {
    touchCurrentXRef.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd: React.TouchEventHandler<HTMLElement> = () => {
    if (touchStartXRef.current == null || touchCurrentXRef.current == null) {
      touchStartXRef.current = null;
      touchCurrentXRef.current = null;
      return;
    }

    const swipeDelta = touchCurrentXRef.current - touchStartXRef.current;
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    const shouldClose = isRtl ? swipeDelta > 60 : swipeDelta < -60;

    if (shouldClose) {
      onClose();
    }

    touchStartXRef.current = null;
    touchCurrentXRef.current = null;
  };

  return (
    <div className="mobile-crm-drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        className="mobile-crm-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="CRM navigation drawer"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
