import { useState, useEffect } from 'react';
import type { SupervisorDef } from '../../../data/assistants108Registry.data';
import type { DepartmentNodeItem } from './DepartmentManager.types';
import { getDepartmentSubItems, getUnassignedSquadPool } from './DepartmentManager.data';

export type SquadDragSource = 'assigned' | 'pool';

export interface DraggedSquadItem {
  source: SquadDragSource;
  index: number;
}

export interface DragOverTarget {
  target: SquadDragSource;
  index: number;
}

export function useDepartmentSubItemsModalLogic(
  isOpen: boolean,
  department: DepartmentNodeItem | null
) {
  const [assignedSquads, setAssignedSquads] = useState<SupervisorDef[]>([]);
  const [unassignedPool, setUnassignedPool] = useState<SupervisorDef[]>([]);
  const [draggedItem, setDraggedItem] = useState<DraggedSquadItem | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<DragOverTarget | null>(null);

  // Initialize 9 squads and unassigned pool when modal opens or department changes
  useEffect(() => {
    if (isOpen && department) {
      const items = getDepartmentSubItems(department.slug || department._id);
      // Guarantee exactly 9 squads
      setAssignedSquads(items.slice(0, 9));
      setUnassignedPool(getUnassignedSquadPool());
      setDraggedItem(null);
      setDragOverTarget(null);
    }
  }, [isOpen, department]);

  const handleSquadDragStart = (e: React.DragEvent, source: SquadDragSource, index: number) => {
    const payload: DraggedSquadItem = { source, index };
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem(payload);
  };

  const handleSquadDragOver = (e: React.DragEvent, target: SquadDragSource, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!dragOverTarget || dragOverTarget.target !== target || dragOverTarget.index !== index) {
      setDragOverTarget({ target, index });
    }
  };

  const handleSquadDragLeave = () => {
    setDragOverTarget(null);
  };

  const handleSquadDrop = (e: React.DragEvent, target: SquadDragSource, targetIndex: number) => {
    e.preventDefault();
    let sourceItem = draggedItem;

    try {
      const raw = e.dataTransfer.getData('application/json');
      if (raw) {
        sourceItem = JSON.parse(raw);
      }
    } catch {
      // Fallback to state
    }

    setDraggedItem(null);
    setDragOverTarget(null);

    if (!sourceItem) return;

    const { source, index: sourceIndex } = sourceItem;

    // ── Case 1: Reorder/Swap between 9 assigned slots ─────────────────────
    if (source === 'assigned' && target === 'assigned') {
      if (sourceIndex === targetIndex) return;

      const sourceSquadItem = assignedSquads[sourceIndex];
      const targetSquadItem = assignedSquads[targetIndex];

      setAssignedSquads(prev => {
        const next = [...prev];
        const sourceSquad = next[sourceIndex];
        const targetSquad = next[targetIndex];
        if (!sourceSquad || !targetSquad) return prev;

        // Slot codes and position numbers Squad #1..#9 remain strictly fixed per slot
        const targetCode = targetSquad.code || `SQ-${String(targetIndex + 1).padStart(2, '0')}`;
        const sourceCode = sourceSquad.code || `SQ-${String(sourceIndex + 1).padStart(2, '0')}`;

        next[targetIndex] = {
          ...sourceSquad,
          code: targetCode,
          supervisorIndex: targetIndex + 1,
        };
        next[sourceIndex] = {
          ...targetSquad,
          code: sourceCode,
          supervisorIndex: sourceIndex + 1,
        };
        return next;
      });

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      if (token && sourceSquadItem?.id) {
        fetch('/api/corporate-departments/assign-squad', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            squadId: sourceSquadItem.id,
            slotOrder: targetIndex + 1,
          }),
        }).catch(() => {});
      }
      return;
    }

    // ── Case 2: Assign from Unassigned Pool into an Active Slot ─────────────
    if (source === 'pool' && target === 'assigned') {
      const poolSquad = unassignedPool[sourceIndex];
      const displacedSquad = assignedSquads[targetIndex];
      if (!poolSquad || !displacedSquad) return;

      // Displaced squad moves to unassigned pool with standby status
      setUnassignedPool(prev => {
        const next = [...prev];
        next.splice(sourceIndex, 1);
        next.unshift({
          ...displacedSquad,
          departmentId: 'unassigned-pool',
          departmentName: 'Unassigned Operational Pool',
          status: 'standby',
          supervisorIndex: 0,
        });
        return next;
      });

      // Active slot receives the squad from the pool
      setAssignedSquads(prev => {
        const next = [...prev];
        next[targetIndex] = {
          ...poolSquad,
          departmentId: department?.slug || department?._id || 'department',
          departmentName: department?.title || 'Department',
          status: 'optimal',
          supervisorIndex: targetIndex + 1,
        };
        return next;
      });
      return;
    }

    // ── Case 3: Move from Active Slot into Unassigned Pool ──────────────────
    if (source === 'assigned' && target === 'pool') {
      const activeSquad = assignedSquads[sourceIndex];
      if (!activeSquad) return;

      // Add to unassigned pool
      setUnassignedPool(prev => [
        {
          ...activeSquad,
          departmentId: 'unassigned-pool',
          departmentName: 'Unassigned Operational Pool',
          status: 'standby',
          supervisorIndex: 0,
        },
        ...prev,
      ]);

      // Replace active slot with top pool squad or a reserve stand-in to maintain 9 slots
      setAssignedSquads(prev => {
        const next = [...prev];
        const topPool = unassignedPool[0];
        if (topPool) {
          next[sourceIndex] = {
            ...topPool,
            departmentId: department?.slug || department?._id || 'department',
            departmentName: department?.title || 'Department',
            status: 'optimal',
            supervisorIndex: sourceIndex + 1,
          };
          setUnassignedPool(p => p.slice(1));
        } else {
          next[sourceIndex] = {
            id: `reserve-slot-${Date.now()}-${sourceIndex + 1}`,
            name: `Squad ${sourceIndex + 1} Reserve Specialist`,
            code: `SQ-${(sourceIndex + 1).toString().padStart(2, '0')}`,
            title: `Operational Standby Unit ${sourceIndex + 1}`,
            departmentId: department?.slug || department?._id || 'department',
            departmentName: department?.title || 'Department',
            supervisorIndex: sourceIndex + 1,
            icon: 'Shield',
            color: department?.color || '#EF4444',
            avatar: '',
            status: 'optimal',
            description: 'Statutory reserve squad allocated to maintain 9 operational slots.',
            specialty: 'Departmental Task Execution & SLA Assurance',
            assignedTasks: ['Statutory Verification', 'Escrow Check'],
            capabilities: ['RERA Compliance', 'Escrow Monitoring'],
            slaResponseTime: '< 15 mins',
            metrics: {
              accuracyRate: 99.8,
              tasksCompletedToday: 12,
              systemHealth: 'optimal',
            },
          };
        }
        return next;
      });
      return;
    }

    // ── Case 4: Reorder within Unassigned Pool ──────────────────────────────
    if (source === 'pool' && target === 'pool') {
      if (sourceIndex === targetIndex) return;
      setUnassignedPool(prev => {
        const next = [...prev];
        const [moved] = next.splice(sourceIndex, 1);
        if (moved) {
          next.splice(targetIndex, 0, moved);
        }
        return next;
      });
    }
  };

  const handleSquadDragEnd = () => {
    setDraggedItem(null);
    setDragOverTarget(null);
  };

  const handleMoveToPool = (assignedIndex: number) => {
    const squad = assignedSquads[assignedIndex];
    if (!squad) return;

    setUnassignedPool(prev => [
      {
        ...squad,
        departmentId: 'unassigned-pool',
        departmentName: 'Unassigned Operational Pool',
        status: 'standby',
        supervisorIndex: 0,
      },
      ...prev,
    ]);

    setAssignedSquads(prev => {
      const next = [...prev];
      next[assignedIndex] = {
        id: `reserve-${Date.now()}-${assignedIndex + 1}`,
        name: `Squad ${assignedIndex + 1} Standby Unit`,
        code: `SQ-${(assignedIndex + 1).toString().padStart(2, '0')}`,
        title: `Tier 3 Reserve Unit ${assignedIndex + 1}`,
        departmentId: department?.slug || department?._id || 'department',
        departmentName: department?.title || 'Department',
        supervisorIndex: assignedIndex + 1,
        icon: 'Shield',
        color: department?.color || '#EF4444',
        avatar: '',
        status: 'optimal',
        description: 'Standby reserve unit maintaining 9-slot operational protocol.',
        specialty: 'Autonomous Execution & Compliance Audit',
        assignedTasks: ['Standby Verification', 'SLA Escrow Watch'],
        capabilities: ['Audit', 'Verification'],
        slaResponseTime: '< 15 mins',
        metrics: {
          accuracyRate: 99.8,
          tasksCompletedToday: 10,
          systemHealth: 'optimal',
        },
      };
      return next;
    });
  };

  return {
    assignedSquads,
    unassignedPool,
    draggedItem,
    dragOverTarget,
    handleSquadDragStart,
    handleSquadDragOver,
    handleSquadDragLeave,
    handleSquadDrop,
    handleSquadDragEnd,
    handleMoveToPool,
  };
}
