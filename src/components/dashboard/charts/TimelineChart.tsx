import React from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export interface TimelinePoint {
  label: string;
  value: number;
}

interface TimelineChartProps {
  data: TimelinePoint[];
  title?: string;
  isLoading?: boolean;
  height?: number;
}

const panel: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  padding: 16,
  background: 'rgba(20,20,20,0.65)',
};

const TimelineChart: React.FC<TimelineChartProps> = ({
  data,
  title = 'Timeline',
  isLoading = false,
  height = 280,
}) => {
  if (isLoading) {
    return (
      <div style={panel} aria-busy="true" aria-live="polite">
        <h3>{title}</h3>
        <p>Loading timeline…</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={panel} role="status" aria-live="polite">
        <h3>{title}</h3>
        <p>No timeline points available.</p>
      </div>
    );
  }

  return (
    <section style={panel} aria-label={title}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 6 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="label" stroke="#D6D6D6" />
          <YAxis stroke="#D6D6D6" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#C9A84C" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
};

export default TimelineChart;
