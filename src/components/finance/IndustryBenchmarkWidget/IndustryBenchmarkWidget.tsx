import React from 'react';
import { WidgetContainer, BenchTable, StatusBadge } from './IndustryBenchmarkWidget.style';
import { useIndustryBenchmarkLogic } from './IndustryBenchmarkWidget.logic';
import { BarChart3 } from 'lucide-react';

export const IndustryBenchmarkWidget: React.FC = () => {
  const { t, isRtl, benchmarks } = useIndustryBenchmarkLogic();
  return (
    <WidgetContainer $isRtl={isRtl}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h3>{t.title}</h3><p>{t.subtitle}</p></div>
        <BarChart3 size={32} color="var(--color-3b82f6, #3B82F6)" />
      </div>
      <BenchTable>
        <thead><tr><th>Segment</th><th>{t.your_rate}</th><th>{t.market_avg}</th><th>Diff</th><th>Status</th></tr></thead>
        <tbody>
          {benchmarks.map((b: any) => (
            <tr key={b.label}>
              <td>{b.label}</td>
              <td>{b.yours}%</td>
              <td>{b.market}%</td>
              <td style={{ color: b.diff > 0 ? '#B91C1C' : b.diff < 0 ? '#166534' : '#92400E' }}>{b.diff > 0 ? '+' : ''}{b.diff.toFixed(1)}%</td>
              <td><StatusBadge $status={b.diff > 0 ? 'above' : b.diff < 0 ? 'below' : 'at_par'}>{b.status}</StatusBadge></td>
            </tr>
          ))}
        </tbody>
      </BenchTable>
    </WidgetContainer>
  );
};
