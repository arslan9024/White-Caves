import React from 'react';
import { WidgetContainer, MetricsGrid, MetricCard, ModuleChip } from './FinanceI18NWidget.style';
import { useFinanceI18NLogic } from './FinanceI18NWidget.logic';
import { Languages } from 'lucide-react';
export const FinanceI18NWidget: React.FC = () => {
  const { t, isRtl } = useFinanceI18NLogic();
  return (
    <WidgetContainer $isRtl={isRtl}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h3>{t.title}</h3><p>{t.subtitle}</p></div>
        <Languages size={32} color="var(--color-3b82f6, #3B82F6)" />
      </div>
      <MetricsGrid>
        <MetricCard><div className="value">{t.key_count}</div><div className="label">Total Keys</div></MetricCard>
        <MetricCard><div className="value">{t.coverage_en}</div><div className="label">EN Coverage</div></MetricCard>
        <MetricCard><div className="value">{t.coverage_ar}</div><div className="label">AR Coverage</div></MetricCard>
      </MetricsGrid>
      <div>{t.modules.map((m: string) => <ModuleChip key={m}>{m}</ModuleChip>)}</div>
    </WidgetContainer>
  );
};
