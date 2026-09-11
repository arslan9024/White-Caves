import React from 'react';
import { WidgetContainer, AlertCard } from './FinanceAlertsWidget.style';
import { useFinanceAlertsLogic } from './FinanceAlertsWidget.logic';
import { Bell, AlertTriangle, AlertCircle, Info } from 'lucide-react';
export const FinanceAlertsWidget: React.FC = () => {
  const { t, isRtl } = useFinanceAlertsLogic();
  const icon = (s: string) => s === 'critical' ? <AlertCircle size={20} color="#EF4444" /> : s === 'warning' ? <AlertTriangle size={20} color="#F59E0B" /> : <Info size={20} color="#3B82F6" />;
  return (
    <WidgetContainer $isRtl={isRtl}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h3>{t.title}</h3><p>{t.subtitle}</p></div>
        <Bell size={32} color="var(--accent-red, #EF4444)" />
      </div>
      {t.alerts.map((a: any) => (<AlertCard key={a.id} $severity={a.severity}>{icon(a.severity)}<div><div className="type">{a.type}</div><div className="message">{a.message}</div></div></AlertCard>))}
    </WidgetContainer>
  );
};
