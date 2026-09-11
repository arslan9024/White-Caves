import React, { FC } from 'react';
import { Database, Clock, ShieldAlert, Settings, RefreshCw, Play } from 'lucide-react';
import { useComplianceArchitectureLogic } from './ComplianceArchitectureWidget.logic';
import {
  WidgetContainer,
  WidgetHeader,
  ArchitectureGrid,
  ModuleCard,
  EngineStatus,
  ActionsContainer,
  ActionButton
} from './ComplianceArchitectureWidget.style';

export const ComplianceArchitectureWidget: FC = () => {
  const {
    t,
    isRtl,
    lastSyncTime,
    handleReindex,
    handleRunRules
  } = useComplianceArchitectureLogic();

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <div>
          <h3><Settings size={28} /> {t.title}</h3>
          <p>{t.subtitle}</p>
        </div>
      </WidgetHeader>

      <EngineStatus>
        <div className="status-dot" />
        <span className="status-text">{t.status_active}</span>
        <span className="sync-text">{t.status_sync.replace('{time}', lastSyncTime)}</span>
      </EngineStatus>

      <ArchitectureGrid>
        <ModuleCard $color="var(--color-3b82f6, #3B82F6)">
          <div className="icon-wrapper">
            <Database size={24} />
          </div>
          <h4>{t.registry_title}</h4>
          <p>{t.registry_desc}</p>
        </ModuleCard>

        <ModuleCard $color="var(--color-f59e0b, #F59E0B)">
          <div className="icon-wrapper">
            <Clock size={24} />
          </div>
          <h4>{t.expiry_title}</h4>
          <p>{t.expiry_desc}</p>
        </ModuleCard>

        <ModuleCard $color="var(--color-ef4444, #EF4444)">
          <div className="icon-wrapper">
            <ShieldAlert size={24} />
          </div>
          <h4>{t.aml_title}</h4>
          <p>{t.aml_desc}</p>
        </ModuleCard>
      </ArchitectureGrid>

      <ActionsContainer>
        <ActionButton $variant="secondary" onClick={handleReindex}>
          <RefreshCw size={18} /> {t.btn_reindex}
        </ActionButton>
        <ActionButton $variant="primary" onClick={handleRunRules}>
          <Play size={18} /> {t.btn_run_rules}
        </ActionButton>
      </ActionsContainer>
    </WidgetContainer>
  );
};
