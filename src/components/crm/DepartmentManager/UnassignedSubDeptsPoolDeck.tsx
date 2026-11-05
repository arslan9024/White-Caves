import React, { FC, useState } from 'react';
import { Layers, ArrowUpCircle, GripVertical, Search } from 'lucide-react';
import type { SupervisorDef } from '../../../data/assistants108Registry.data';
import { UnassignedPoolSection, SubItemsGrid, SubItemCard } from './DepartmentSubItemsModal.styles';

export interface UnassignedSubDeptsPoolDeckProps {
  unassignedPool: SupervisorDef[];
  onPromoteSubDept: (subId: string) => void;
  onDropOnPool: (e: React.DragEvent) => void;
}

export const UnassignedSubDeptsPoolDeck: FC<UnassignedSubDeptsPoolDeckProps> = ({
  unassignedPool,
  onPromoteSubDept,
  onDropOnPool,
}) => {
  const [query, setQuery] = useState('');

  const filtered = unassignedPool.filter(sub => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      sub.name.toLowerCase().includes(q) ||
      sub.title.toLowerCase().includes(q) ||
      sub.code.toLowerCase().includes(q) ||
      (sub.specialty && sub.specialty.toLowerCase().includes(q)) ||
      (sub.description && sub.description.toLowerCase().includes(q))
    );
  });

  const handleDragStart = (e: React.DragEvent, subId: string) => {
    const payload = { type: 'pool-item', poolItemId: subId };
    e.dataTransfer.setData('text/plain', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <UnassignedPoolSection
      data-testid="workspace-unassigned-pool-deck"
      onDragOver={e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }}
      onDrop={onDropOnPool}
      style={{
        marginTop: '28px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '12px',
        padding: '18px',
        border: '1.5px dashed var(--border-color, rgba(255, 255, 255, 0.15))',
      }}
    >
      <div className="pool-title-row">
        <div className="pool-heading">
          <Layers size={18} color="#F59E0B" />
          <h3>Unassigned Operational Reserve Pool Deck</h3>
          <span className="pool-count-tag" data-testid="workspace-pool-count-tag">
            {unassignedPool.length} Available in Pool
          </span>
        </div>
        <span className="pool-hint">
          Drag any card to a department slot in the sidebar or center grid to assign · Drop cards
          here to demote
        </span>
      </div>

      {/* Quick Search inside Pool */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '12px 0 16px 0',
          maxWidth: '360px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: '4px 10px',
            flex: 1,
          }}
        >
          <Search size={13} color="#94A3B8" />
          <input
            type="text"
            placeholder="Search researched pool units..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '0.75rem',
              outline: 'none',
              width: '100%',
            }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          style={{ textAlign: 'center', padding: '24px', color: '#64748B', fontSize: '0.82rem' }}
        >
          {unassignedPool.length === 0
            ? 'No unassigned sub-departments in pool. Drag a department card here to demote, or add new units.'
            : 'No matching reserve units found.'}
        </div>
      ) : (
        <SubItemsGrid>
          {filtered.map((sub, idx) => (
            <SubItemCard
              key={sub.id || `pool-${idx}`}
              $isPool={true}
              draggable={true}
              onDragStart={e => handleDragStart(e, sub.id)}
              data-testid={`workspace-pool-card-${sub.id}`}
              style={{ cursor: 'grab' }}
            >
              <div className="sub-top">
                <div
                  className="top-left"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <div
                    title="Drag to assign to any department slot"
                    style={{ color: '#64748B', display: 'flex', alignItems: 'center' }}
                  >
                    <GripVertical size={13} />
                  </div>
                  <span className="index-pill">{sub.code || `SUB-0${idx + 1}`}</span>
                  <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Researched Unit</span>
                </div>

                <div className="top-actions">
                  <div className="status-pill">
                    <div className="dot" />
                    <span>STANDBY</span>
                  </div>

                  <button
                    type="button"
                    className="pool-btn"
                    onClick={() => onPromoteSubDept(sub.id)}
                    title="Promote to Top Corporate Department"
                    data-testid={`promote-btn-${sub.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#10B981',
                      fontWeight: 700,
                      fontSize: '0.68rem',
                      padding: '2px 6px',
                    }}
                  >
                    <ArrowUpCircle size={14} />
                    <span>Promote</span>
                  </button>
                </div>
              </div>

              <div className="sub-info">
                <span className="name">{sub.name}</span>
                <span className="title" style={{ color: '#F59E0B' }}>
                  {sub.title}
                </span>
                <span className="specialty">{sub.specialty}</span>
              </div>

              {sub.description && (
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted, #94A3B8)',
                    lineHeight: 1.3,
                  }}
                >
                  {sub.description}
                </div>
              )}

              <div className="sub-footer">
                <span className="sla">Protocol: 1-12-108 Pool</span>
                <span className="accuracy" style={{ color: '#F59E0B' }}>
                  Ready to Assign
                </span>
              </div>
            </SubItemCard>
          ))}
        </SubItemsGrid>
      )}
    </UnassignedPoolSection>
  );
};

export default UnassignedSubDeptsPoolDeck;
