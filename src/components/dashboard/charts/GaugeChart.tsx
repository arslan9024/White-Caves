import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface GaugeChartProps {
  value: number;
  max?: number;
  title?: string;
  isLoading?: boolean;
  height?: number;
}

const shell: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  padding: 16,
  background: 'rgba(20,20,20,0.65)',
  textAlign: 'center',
};

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  max = 100,
  title = 'Performance',
  isLoading = false,
  height = 250,
}) => {
  if (isLoading) {
    return (
      <div style={shell} aria-busy="true" aria-live="polite">
        <h3>{title}</h3>
        <p>Loading gauge…</p>
      </div>
    );
  }

  const safeMax = Math.max(1, max);
  const clampedValue = Math.max(0, Math.min(value, safeMax));
  const remainder = safeMax - clampedValue;

  return (
    <section style={shell} aria-label={title}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Tooltip formatter={(v) => [`${v}`, 'Value']} />
          <Pie
            dataKey="value"
            data={[
              { name: 'Current', value: clampedValue },
              { name: 'Remaining', value: remainder },
            ]}
            startAngle={180}
            endAngle={0}
            innerRadius="55%"
            outerRadius="85%"
          >
            <Cell fill="#C9A84C" />
            <Cell fill="rgba(255,255,255,0.12)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <strong style={{ fontSize: 24 }}>{Math.round((clampedValue / safeMax) * 100)}%</strong>
    </section>
  );
};

export default GaugeChart;
