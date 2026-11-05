import React, { FC } from 'react';
import { Briefcase, X, GripVertical, ArrowDownToLine, PlusCircle, AlertCircle } from 'lucide-react';
import type { DepartmentNodeItem } from './DepartmentManager.types';
import { useDepartmentSubItemsModalLogic } from './DepartmentSubItemsModal.logic';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalScrollArea,
  SubItemsGrid,
  SubItemCard,
  UnassignedPoolSection,
} from './DepartmentSubItemsModal.styles';

export interface DepartmentSubItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: DepartmentNodeItem | null;
  isReadOnly?: boolean;
}

export const DepartmentSubItemsModal: FC<DepartmentSubItemsModalProps> = ({
  isOpen,
  onClose,
  department,
  isReadOnly = false,
}) => {
  const {
    assignedSquads,
    unassignedPool,
    draggedItem,
    dragOverTarget,
    savedFeedback,
    handleSavePriorities,
    handleMoveUp,
    handleMoveDown,
    handleSquadDragStart,
    handleSquadDragOver,
    handleSquadDragLeave,
    handleSquadDrop,
    handleSquadDragEnd,
    handleMoveToPool,
  } = useDepartmentSubItemsModalLogic(isOpen, department);

  if (!isOpen || !department) return null;

  return (
    <ModalOverlay onClick={onClose} data-testid="department-subitems-modal">
      <ModalContainer $color={department.color} onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <ModalHeader $color={department.color}>
          <div className="header-left">
            <div className="icon-wrap">
              <Briefcase size={20} />
            </div>
            <div className="title-group">
              <div className="badge-row">
                <span className="dept-code">{department.code}</span>
                <span className="count-tag">
                  1-12-108 Protocol · 9 Operational Sub-Departments & Managers
                </span>
              </div>
              <h2>{department.title} — Squad Hierarchy & Manager Priorities</h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!isReadOnly && (
              <button
                type="button"
                onClick={handleSavePriorities}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: savedFeedback ? '#10B981' : 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid ' + (savedFeedback ? '#10B981' : '#EF4444'),
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                data-testid="save-manager-priorities-btn"
              >
                {savedFeedback ? '✓ Priorities Saved!' : '💾 Save Manager Priorities'}
              </button>
            )}
            <button className="close-btn" onClick={onClose} title="Close Modal">
              <X size={20} />
            </button>
          </div>
        </ModalHeader>

        {/* Scrollable Sub-Items Area */}
        <ModalScrollArea>
          <div
            style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94A3B8)', lineHeight: 1.4 }}
          >
            Each department operates <strong>9 dedicated operational squads</strong> under the
            1-12-108 Protocol. Managers are ordered by strategic importance (Rank #1 to #9).
            {!isReadOnly && (
              <span>
                {' '}
                Use ▲/▼ or drag to reorder priorities, or swap specialists to/from the unassigned
                pool.
              </span>
            )}
          </div>

          {/* ── 1. The 9 Active Department Squad Slots ────────────────────────── */}
          <SubItemsGrid data-testid="active-squads-grid">
            {assignedSquads.map((sub, idx) => (
              <SubItemCard
                key={sub.id || idx}
                $color={department.color}
                $isDragging={draggedItem?.source === 'assigned' && draggedItem.index === idx}
                $isDragOver={dragOverTarget?.target === 'assigned' && dragOverTarget.index === idx}
                draggable={!isReadOnly}
                onDragStart={e => !isReadOnly && handleSquadDragStart(e, 'assigned', idx)}
                onDragOver={e => !isReadOnly && handleSquadDragOver(e, 'assigned', idx)}
                onDragLeave={!isReadOnly ? handleSquadDragLeave : undefined}
                onDrop={e => !isReadOnly && handleSquadDrop(e, 'assigned', idx)}
                onDragEnd={!isReadOnly ? handleSquadDragEnd : undefined}
                data-testid={`subitem-card-${idx + 1}`}
              >
                <div className="sub-top">
                  <div className="top-left">
                    {!isReadOnly && (
                      <>
                        <div
                          className="drag-handle"
                          title="Drag to swap squad positions or move to unassigned pool"
                          data-testid={`squad-drag-handle-${idx + 1}`}
                        >
                          <GripVertical size={14} />
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            marginRight: '4px',
                          }}
                        >
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveUp(idx)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: idx === 0 ? '#475569' : '#94A3B8',
                              cursor: idx === 0 ? 'default' : 'pointer',
                              fontSize: '0.72rem',
                              padding: '2px 4px',
                            }}
                            title="Promote Manager Priority"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === assignedSquads.length - 1}
                            onClick={() => handleMoveDown(idx)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: idx === assignedSquads.length - 1 ? '#475569' : '#94A3B8',
                              cursor: idx === assignedSquads.length - 1 ? 'default' : 'pointer',
                              fontSize: '0.72rem',
                              padding: '2px 4px',
                            }}
                            title="Demote Manager Priority"
                          >
                            ▼
                          </button>
                        </div>
                      </>
                    )}
                    <span className="index-pill">Rank #{idx + 1}</span>
                  </div>

                  <div className="top-actions">
                    <div className="status-pill">
                      <div className="dot" />
                      <span>{(sub.status || 'optimal').toUpperCase()}</span>
                    </div>

                    {!isReadOnly && (
                      <button
                        type="button"
                        className="pool-btn"
                        onClick={() => handleMoveToPool(idx)}
                        title="Unassign to Operational Pool"
                        data-testid={`squad-unassign-btn-${idx + 1}`}
                      >
                        <ArrowDownToLine size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="sub-info">
                  <span className="name">{sub.name}</span>
                  <span className="title">{sub.title}</span>
                  <span className="specialty">{sub.specialty}</span>
                </div>

                {sub.assignedTasks && sub.assignedTasks.length > 0 && (
                  <div className="tasks-wrap">
                    {sub.assignedTasks.slice(0, 3).map((t, taskIdx) => (
                      <span key={taskIdx} className="task-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="sub-footer">
                  <span className="sla">SLA: {sub.slaResponseTime || '< 15 mins'}</span>
                  <span className="accuracy">
                    {sub.metrics?.accuracyRate ? `${sub.metrics.accuracyRate}% acc` : '99.8% acc'}
                  </span>
                </div>
              </SubItemCard>
            ))}
          </SubItemsGrid>

          {/* ── 2. Unassigned Operational Pool ─────────────────────────────── */}
          <UnassignedPoolSection data-testid="unassigned-pool-section">
            <div className="pool-title-row">
              <div className="pool-heading">
                <h3>Unassigned Department & Squad Pool</h3>
                <span className="pool-count-tag" data-testid="pool-count-tag">
                  {unassignedPool.length} Available in Reserve
                </span>
              </div>
              <span className="pool-hint">
                Drag into any active slot above to deploy or swap specialists.
              </span>
            </div>

            {unassignedPool.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  color: '#64748B',
                  fontSize: '0.8rem',
                }}
              >
                All specialists are currently allocated to operational squads.
              </div>
            ) : (
              <SubItemsGrid>
                {unassignedPool.map((poolSquad, pIdx) => (
                  <SubItemCard
                    key={poolSquad.id || `pool-${pIdx}`}
                    $isPool={true}
                    $isDragging={draggedItem?.source === 'pool' && draggedItem.index === pIdx}
                    $isDragOver={dragOverTarget?.target === 'pool' && dragOverTarget.index === pIdx}
                    draggable={true}
                    onDragStart={e => handleSquadDragStart(e, 'pool', pIdx)}
                    onDragOver={e => handleSquadDragOver(e, 'pool', pIdx)}
                    onDragLeave={handleSquadDragLeave}
                    onDrop={e => handleSquadDrop(e, 'pool', pIdx)}
                    onDragEnd={handleSquadDragEnd}
                    data-testid={`pool-card-${pIdx + 1}`}
                  >
                    <div className="sub-top">
                      <div className="top-left">
                        <div
                          className="drag-handle"
                          title="Drag into any slot above to deploy"
                          data-testid={`pool-drag-handle-${pIdx + 1}`}
                        >
                          <GripVertical size={14} />
                        </div>
                        <span className="index-pill">Pool Reserve</span>
                      </div>

                      <div className="top-actions">
                        <div className="status-pill">
                          <div className="dot" />
                          <span>STANDBY</span>
                        </div>
                      </div>
                    </div>

                    <div className="sub-info">
                      <span className="name">{poolSquad.name}</span>
                      <span className="title">{poolSquad.title}</span>
                      <span className="specialty">{poolSquad.specialty}</span>
                    </div>

                    {poolSquad.assignedTasks && poolSquad.assignedTasks.length > 0 && (
                      <div className="tasks-wrap">
                        {poolSquad.assignedTasks.slice(0, 2).map((t, taskIdx) => (
                          <span key={taskIdx} className="task-tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="sub-footer">
                      <span className="sla">Status: On Standby</span>
                      <span className="accuracy" style={{ color: '#F59E0B' }}>
                        Ready for Deploy
                      </span>
                    </div>
                  </SubItemCard>
                ))}
              </SubItemsGrid>
            )}
          </UnassignedPoolSection>
        </ModalScrollArea>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default DepartmentSubItemsModal;
