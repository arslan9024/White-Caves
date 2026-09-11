import React from 'react';
import { WidgetContainer, InfoGrid, InfoCard } from './HeroCookieConsentWidget.style';
import { useHeroCookieConsentLogic } from './HeroCookieConsentWidget.logic';
import { Cookie } from 'lucide-react';
export const HeroCookieConsentWidget: React.FC = () => {
  const { t, isRtl } = useHeroCookieConsentLogic();
  const entries = Object.entries(t).filter(([k]) => !['title','subtitle'].includes(k));
  return (
    <WidgetContainer $isRtl={isRtl}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h3>{t.title}</h3><p>{t.subtitle}</p></div>
        <Cookie size={32} color="#6366F1" />
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
