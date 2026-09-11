import React from 'react';
import { WidgetContainer, InfoGrid, InfoCard } from './HeroCursorWidget.style';
import { useHeroCursorLogic } from './HeroCursorWidget.logic';
import { MousePointer2 } from 'lucide-react';
export const HeroCursorWidget: React.FC = () => {
  const { t, isRtl } = useHeroCursorLogic();
  const entries = Object.entries(t).filter(([k]) => !['title','subtitle'].includes(k));
  return (
    <WidgetContainer $isRtl={isRtl}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h3>{t.title}</h3><p>{t.subtitle}</p></div>
        <MousePointer2 size={32} color="#D4AF37" />
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
