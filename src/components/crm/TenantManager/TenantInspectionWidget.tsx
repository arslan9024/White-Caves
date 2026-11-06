// FILE: src/components/crm/TenantManager/TenantInspectionWidget.tsx
/**
 * White Caves Real Estate LLC - Move-In Snag Checklist Widget
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { ClipboardCheck, CheckCircle } from 'lucide-react';
import { MoveInInspectionItem } from './TenantManager.types';
import { SectionCard, DataTable, StatusPill, ActionButton } from './TenantManager.styles';

interface TenantInspectionWidgetProps {
  items: MoveInInspectionItem[];
  onResolveItem: (id: string) => void;
}

export const TenantInspectionWidget: FC<TenantInspectionWidgetProps> = ({
  items,
  onResolveItem,
}) => {
  return (
    <SectionCard data-testid="tenant-inspection-widget">
      <h2 className="section-title">
        <ClipboardCheck size={18} color="#ef4444" />
        <span>Move-in Handover & Snag Checklist Protocol</span>
      </h2>
      <DataTable>
        <thead>
          <tr>
            <th>Zone / Room</th>
            <th>Inspection Element</th>
            <th>Observation & Condition</th>
            <th>Notes</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>
                <strong>{item.room}</strong>
              </td>
              <td>{item.element}</td>
              <td>{item.condition}</td>
              <td style={{ color: '#94a3b8' }}>{item.notes || '—'}</td>
              <td>
                <StatusPill $variant={item.status}>{item.status}</StatusPill>
              </td>
              <td>
                {item.status === 'flagged' ? (
                  <ActionButton
                    onClick={() => onResolveItem(item.id)}
                    data-testid={`btn-resolve-snag-${item.id}`}
                  >
                    Accept Resolution
                  </ActionButton>
                ) : (
                  <span style={{ fontSize: 11, color: '#4ade80' }}>
                    <CheckCircle size={12} style={{ verticalAlign: 'middle', marginRight: 2 }} />
                    Verified
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </SectionCard>
  );
};
