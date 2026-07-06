import React from 'react';

export interface HeatmapCell {
  x: string;
  y: string;
  value: number;
}

interface HeatmapChartProps {
  data: HeatmapCell[];
  title?: string;
  columns: string[];
  rows: string[];
  isLoading?: boolean;
}

const wrap: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  padding: 16,
  background: 'rgba(20,20,20,0.65)',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gap: 6,
  marginTop: 12,
};

const HeatmapChart: React.FC<HeatmapChartProps> = ({
  data,
  title = 'Activity Heatmap',
  columns,
  rows,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div style={wrap} aria-busy="true" aria-live="polite">
        <h3>{title}</h3>
        <p>Loading heatmap…</p>
      </div>
    );
  }

  if (data.length === 0 || columns.length === 0 || rows.length === 0) {
    return (
      <div style={wrap} role="status" aria-live="polite">
        <h3>{title}</h3>
        <p>No heatmap data available.</p>
      </div>
    );
  }

  const max = Math.max(...data.map(item => item.value), 1);

  return (
    <section style={wrap} aria-label={title}>
      <h3>{title}</h3>
      <div
        style={{
          ...gridStyle,
          gridTemplateColumns: `120px repeat(${columns.length}, minmax(36px, 1fr))`,
        }}
      >
        <div />
        {columns.map(col => (
          <strong key={col} style={{ fontSize: 12, textAlign: 'center' }}>
            {col}
          </strong>
        ))}

        {rows.map(row => (
          <React.Fragment key={row}>
            <strong style={{ fontSize: 12 }}>{row}</strong>
            {columns.map(col => {
              const point = data.find(item => item.x === col && item.y === row);
              const intensity = point ? point.value / max : 0;
              return (
                <div
                  key={`${row}-${col}`}
                  title={`${row} / ${col}: ${point?.value ?? 0}`}
                  aria-label={`${row} ${col} ${point?.value ?? 0}`}
                  style={{
                    height: 30,
                    borderRadius: 6,
                    background: `rgba(201,168,76,${Math.max(0.1, intensity)})`,
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default HeatmapChart;
