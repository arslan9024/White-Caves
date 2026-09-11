import React from 'react';
import { WidgetContainer, InfoGrid, InfoCard } from './HeroCacheStrategyWidget.style';
import { useHeroCacheStrategyLogic } from './HeroCacheStrategyWidget.logic';
import { Database } from 'lucide-react';
export const HeroCacheStrategyWidget: React.FC = () => {
  const { t, isRtl } = useHeroCacheStrategyLogic();
  const entries = Object.entries(t).filter(([k]) => !['title','subtitle'].includes(k));
  return (
    <WidgetContainer $isRtl={isRtl}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h3>{t.title}</h3><p>{t.subtitle}</p></div>
        <Database size={32} color="#10B981" />
      </div>
      <InfoGrid>
        {entries.slice(0, 6).map(([key, val]) => (
          <InfoCard key={key}>
            <div className="value">{typeof val === 'object' ? (Array.isArray(val) ? (val as any).length + ' items' : JSON.stringify(val).slice(0,20)) : String(val)}</div>
            <div className="label">{key.replace(/_/g,' ')}</div>
          </InfoCard>
        ))}
      </InfoGrid>
    </WidgetContainer>
  );
};
