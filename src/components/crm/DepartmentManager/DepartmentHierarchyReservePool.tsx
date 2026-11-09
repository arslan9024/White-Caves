import React from 'react';
import { hierarchyStyles as s } from './DepartmentHierarchy.styles';
import { UnassignedPoolItem } from './DepartmentHierarchy.types';

interface DepartmentHierarchyReservePoolProps {
  unassignedPool: UnassignedPoolItem[];
  onDragStartPool: (id: string) => void;
}

export const DepartmentHierarchyReservePool: React.FC<DepartmentHierarchyReservePoolProps> = ({
  unassignedPool,
  onDragStartPool,
}) => {
  return (
    <div className={s.poolContainer} data-testid="unassigned-pool-deck">
      <div className={s.poolHeader}>
        <div className={s.poolTitle}>
          <span>📦</span>
          <span>Unassigned Operational Reserve Pool (Zero-Delete Preservation)</span>
        </div>
        <span className={s.poolCountPill} data-testid="pool-count-pill">
          {unassignedPool.length} Units Available
        </span>
      </div>

      <div className={s.poolGrid}>
        {unassignedPool.slice(0, 15).map(item => (
          <div
            key={item.id}
            draggable
            onDragStart={() => onDragStartPool(item.id)}
            className={s.poolItemCard}
            data-testid={`pool-item-${item.id}`}
            title="Drag onto any Director or Manager card to assign"
          >
            <div className={s.poolItemAvatar}>⚡</div>
            <div className="overflow-hidden">
              <div className={s.poolItemName}>{item.name}</div>
              <div className={s.poolItemTitle}>{item.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
