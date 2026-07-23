import React, { FC } from 'react';
import type { GroupedModuleItem } from '../../config/crmNavigationSchema';

interface DashboardModuleGridProps {
  modulesByZone: Array<[string, GroupedModuleItem[]]>;
  zoneLabels: Record<string, string>;
  onOpenModule: (moduleId: string) => void;
}

const DashboardModuleGrid: FC<DashboardModuleGridProps> = ({ modulesByZone, zoneLabels, onOpenModule }) => {
  if (!modulesByZone.length) return null;

  return (
    <section className="dashboard-module-grid" aria-label="Department modules">
      {modulesByZone.map(([zone, items]) => (
        <article key={zone} className="dashboard-module-grid__zone">
          <h3>{zoneLabels[zone] ?? zone}</h3>
          <div className="dashboard-module-grid__cards">
            {items.map(module => (
              <button
                key={module.id}
                type="button"
                className="dashboard-module-grid__card"
                onClick={() => onOpenModule(module.id)}
              >
                <span>{module.icon}</span>
                <div>
                  <strong>{module.label}</strong>
                  <small>{zoneLabels[module.zone] ?? module.zone}</small>
                </div>
              </button>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
};

export default DashboardModuleGrid;
