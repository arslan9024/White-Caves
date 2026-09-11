import React from 'react';
import { WidgetContainer, ChartTabs, ChartTab, ChartArea, Bar } from './InteractiveChartsWidget.style';
import { useInteractiveChartsLogic } from './InteractiveChartsWidget.logic';
import { BarChart3 } from 'lucide-react';
export const InteractiveChartsWidget: React.FC = () => {
  const { t, isRtl, chartType, setChartType } = useInteractiveChartsLogic();
  const maxVal = Math.max(...t.revenue);
  return (
    <WidgetContainer $isRtl={isRtl}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h3>{t.title}</h3><p>{t.subtitle}</p></div>
        <BarChart3 size={32} color="var(--color-3b82f6, #3B82F6)" />
      </div>
      <ChartTabs>{t.chart_types.map((ct: string, i: number) => (<ChartTab key={ct} $active={chartType === i} onClick={() => setChartType(i)}>{ct}</ChartTab>))}</ChartTabs>
      <ChartArea>
        {t.revenue.map((val: number, i: number) => (
          <React.Fragment key={i}>
            <Bar $height={(val / maxVal) * 100} $color="var(--color-3b82f6, #3B82F6)" title={`${t.months[i]}: AED ${val}M`} />
            <Bar $height={(t.expenses[i] / maxVal) * 100} $color="var(--accent-red, #EF4444)" title={`${t.months[i]}: AED ${t.expenses[i]}M`} />
          </React.Fragment>
        ))}
      </ChartArea>
      <div style={{ display: 'flex', gap: '16px', marginTop: '12px', justifyContent: 'center', fontSize: '0.8rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--color-3b82f6, #3B82F6)' }} /> Revenue</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--accent-red, #EF4444)' }} /> Expenses</span>
      </div>
    </WidgetContainer>
  );
};
