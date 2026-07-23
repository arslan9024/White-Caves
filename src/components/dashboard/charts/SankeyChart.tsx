import React from 'react';
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';

export interface SankeyNode {
  name: string;
}

export interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

interface SankeyChartProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  title?: string;
  height?: number;
  isLoading?: boolean;
}

const box: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  padding: 16,
  background: 'rgba(20,20,20,0.65)',
};

const SankeyChart: React.FC<SankeyChartProps> = ({
  nodes,
  links,
  title = 'Flow Analysis',
  height = 300,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div style={box} aria-busy="true" aria-live="polite">
        <h3>{title}</h3>
        <p>Loading flow data…</p>
      </div>
    );
  }

  if (nodes.length === 0 || links.length === 0) {
    return (
      <div style={box} role="status" aria-live="polite">
        <h3>{title}</h3>
        <p>No flow data available.</p>
      </div>
    );
  }

  return (
    <section style={box} aria-label={title}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <Sankey
          data={{ nodes, links }}
          nodePadding={36}
          nodeWidth={16}
          linkCurvature={0.5}
          margin={{ top: 8, right: 24, bottom: 8, left: 24 }}
        >
          <Tooltip />
        </Sankey>
      </ResponsiveContainer>
    </section>
  );
};

export default SankeyChart;
