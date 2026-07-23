import React, { useMemo } from 'react';

export interface DashboardWidgetOption {
  id: string;
  label: string;
  enabled: boolean;
  description?: string;
}

interface DashboardConfiguratorProps {
  widgets: DashboardWidgetOption[];
  onToggleWidget: (id: string, enabled: boolean) => void;
  onReset?: () => void;
  title?: string;
}

const cardStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  padding: 16,
  background: 'rgba(20,20,20,0.65)',
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'start',
  gap: 12,
  padding: '10px 0',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
};

const DashboardConfigurator: React.FC<DashboardConfiguratorProps> = ({
  widgets,
  onToggleWidget,
  onReset,
  title = 'Dashboard Configurator',
}) => {
  const enabledCount = useMemo(() => widgets.filter(widget => widget.enabled).length, [widgets]);

  if (widgets.length === 0) {
    return (
      <section style={cardStyle} aria-label={title}>
        <h3>{title}</h3>
        <p>No widgets available to configure.</p>
      </section>
    );
  }

  return (
    <section style={cardStyle} aria-label={title}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}
      >
        <div>
          <h3 style={{ marginBottom: 4 }}>{title}</h3>
          <small>
            {enabledCount} of {widgets.length} enabled
          </small>
        </div>
        {onReset ? (
          <button type="button" onClick={onReset} aria-label="Reset dashboard configuration">
            Reset
          </button>
        ) : null}
      </div>

      <div style={{ marginTop: 8 }}>
        {widgets.map(widget => (
          <div key={widget.id} style={itemStyle}>
            <label htmlFor={`widget-${widget.id}`} style={{ flex: 1 }}>
              <strong>{widget.label}</strong>
              {widget.description ? (
                <div style={{ marginTop: 4, opacity: 0.85, fontSize: 12 }}>
                  {widget.description}
                </div>
              ) : null}
            </label>
            <input
              id={`widget-${widget.id}`}
              type="checkbox"
              checked={widget.enabled}
              onChange={event => onToggleWidget(widget.id, event.target.checked)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default DashboardConfigurator;
