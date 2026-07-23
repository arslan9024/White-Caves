import React from 'react';
import {
  Funnel,
  FunnelChart as RechartsFunnelChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export interface FunnelDatum {
  name: string;
  value: number;
}

interface FunnelChartProps {
  data: FunnelDatum[];
  title?: string;
  height?: number;
  isLoading?: boolean;
}

const cardStyle: React.CSSProperties = {
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 12,
  padding: 16,
  background: 'rgba(20,20,20,0.65)',
};

const FunnelChart: React.FC<FunnelChartProps> = ({
  data,
  title = 'Lead Funnel',
  height = 280,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div style={cardStyle} aria-busy="true" aria-live="polite">
        <h3>{title}</h3>
        <p>Loading funnel data…</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={cardStyle} role="status" aria-live="polite">
        <h3>{title}</h3>
        <p>No funnel data available.</p>
      </div>
    );
  }

  return (
    <section style={cardStyle} aria-label={title}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsFunnelChart>
          <Tooltip />
          <Funnel dataKey="value" data={data} isAnimationActive>
            <LabelList position="right" fill="#F5F5F0" stroke="none" dataKey="name" />
          </Funnel>
        </RechartsFunnelChart>
      </ResponsiveContainer>
    </section>
  );
};

export default FunnelChart;
