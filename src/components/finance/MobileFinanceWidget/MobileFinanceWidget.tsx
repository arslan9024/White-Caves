import React from 'react';
import { WidgetContainer, ActionGrid, ActionCard } from './MobileFinanceWidget.style';
import { useMobileFinanceLogic } from './MobileFinanceWidget.logic';
import { Smartphone, CheckCircle2, Receipt, BarChart3 } from 'lucide-react';
export const MobileFinanceWidget: React.FC = () => {
  const { t, isRtl } = useMobileFinanceLogic();
  const icons: Record<string, React.ReactNode> = { check: <CheckCircle2 size={28} color="var(--color-10b981, #10B981)" />, receipt: <Receipt size={28} color="var(--color-3b82f6, #3B82F6)" />, chart: <BarChart3 size={28} color="var(--accent-gold, #D4AF37)" /> };
  return (
    <WidgetContainer $isRtl={isRtl}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h3>{t.title}</h3><p>{t.subtitle}</p></div>
        <Smartphone size={32} color="var(--color-1e293b, #1E293B)" />
      </div>
      <ActionGrid>
        {t.actions.map((a: any) => (
          <ActionCard key={a.id} style={{ position: 'relative' }}>
            {icons[a.icon]}
            <div className="label">{a.label}</div>
            {a.count > 0 && <div className="count">{a.count} {t.pending}</div>}
          </ActionCard>
        ))}
      </ActionGrid>
    </WidgetContainer>
  );
};
