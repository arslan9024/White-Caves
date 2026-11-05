import React from 'react';
import type { DepartmentNodeItem } from './DepartmentManager.types';
import type { SupervisorDef } from '../../../data/assistants108Registry.data';
import type { DepartmentSlotDef } from './DepartmentManager.data';
import { convertDepartmentToSubDept, convertSubDeptToDepartment } from './DepartmentManager.data';

export interface DragPayload {
  type: 'dept-slot' | 'pool-item' | 'sub-slot';
  slotIndex?: number;
  subIndex?: number;
  poolItemId?: string;
}

export function handleDepartmentSlotDropHelper(
  e: React.DragEvent,
  targetIndex: number,
  departments: DepartmentNodeItem[],
  slots: DepartmentSlotDef[],
  unassignedPool: SupervisorDef[],
  draggedDeptIndex: number | null,
  token: string,
  setDepartments: React.Dispatch<React.SetStateAction<DepartmentNodeItem[]>>,
  setUnassignedPool: React.Dispatch<React.SetStateAction<SupervisorDef[]>>,
  setSelectedSlotIndex: (idx: number) => void
) {
  const rawData = e.dataTransfer.getData('text/plain');
  if (!rawData) return;

  let payload: DragPayload;
  try {
    payload = JSON.parse(rawData);
  } catch {
    const idx = parseInt(rawData, 10);
    payload = { type: 'dept-slot', slotIndex: isNaN(idx) ? undefined : idx };
  }

  if (payload.type === 'pool-item' && payload.poolItemId) {
    const poolItem = unassignedPool.find(p => p.id === payload.poolItemId);
    if (!poolItem) return;

    setUnassignedPool(prev => prev.filter(p => p.id !== payload.poolItemId));
    const targetSlot = slots[targetIndex];
    const prevOccupant = targetSlot?.dept;

    setDepartments(prev => {
      let filtered = prev;
      if (prevOccupant) {
        setUnassignedPool(p => [convertDepartmentToSubDept(prevOccupant), ...p]);
        filtered = prev.filter(d => d._id !== prevOccupant._id);
      }
      const newDept = convertSubDeptToDepartment(poolItem, targetIndex + 1);
      const next = [...filtered];
      next.splice(targetIndex, 0, newDept);
      return next.slice(0, 12).map((d, i) => ({
        ...d,
        order: i + 1,
        code: `DEPT-${String(i + 1).padStart(2, '0')}`,
      }));
    });
    setSelectedSlotIndex(targetIndex);
    return;
  }

  const sourceIndex = payload.slotIndex !== undefined ? payload.slotIndex : draggedDeptIndex;
  if (
    sourceIndex === null ||
    sourceIndex === undefined ||
    isNaN(sourceIndex) ||
    sourceIndex === targetIndex
  )
    return;

  const sourceItem = departments[sourceIndex];
  const targetItem = departments[targetIndex];
  if (!sourceItem || !targetItem) return;

  const targetFixedCode = targetItem.code || `DEPT-${String(targetIndex + 1).padStart(2, '0')}`;
  const sourceFixedCode = sourceItem.code || `DEPT-${String(sourceIndex + 1).padStart(2, '0')}`;

  setDepartments(prev => {
    const next = [...prev];
    const sItem = next[sourceIndex];
    const tItem = next[targetIndex];
    if (!sItem || !tItem) return prev;

    next[targetIndex] = { ...sItem, code: targetFixedCode, order: targetIndex + 1 };
    next[sourceIndex] = { ...tItem, code: sourceFixedCode, order: sourceIndex + 1 };
    return next;
  });

  setSelectedSlotIndex(targetIndex);

  if (token) {
    fetch('/api/corporate-departments/swap-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ departmentAId: sourceItem._id, departmentBId: targetItem._id }),
    }).catch(() => {});
  }
}

export function handleSubDeptDropHelper(
  e: React.DragEvent,
  targetSubIndex: number,
  activeDepartment: DepartmentNodeItem | null,
  activeSubDepts: SupervisorDef[],
  unassignedPool: SupervisorDef[],
  setUnassignedPool: React.Dispatch<React.SetStateAction<SupervisorDef[]>>,
  setSubDeptsMap: React.Dispatch<React.SetStateAction<Record<string, SupervisorDef[]>>>
) {
  if (!activeDepartment) return;

  const rawData = e.dataTransfer.getData('text/plain');
  if (!rawData) return;
  let payload: DragPayload;
  try {
    payload = JSON.parse(rawData);
  } catch {
    return;
  }

  const deptKey = activeDepartment._id || activeDepartment.slug;
  const currentSubs = [...activeSubDepts];

  if (payload.type === 'pool-item' && payload.poolItemId) {
    const poolItem = unassignedPool.find(p => p.id === payload.poolItemId);
    if (!poolItem) return;
    setUnassignedPool(prev => prev.filter(p => p.id !== payload.poolItemId));
    const oldSub = currentSubs[targetSubIndex];
    if (oldSub) {
      setUnassignedPool(prev => [oldSub, ...prev]);
    }
    currentSubs[targetSubIndex] = {
      ...poolItem,
      code: `SQ-${String(targetSubIndex + 1).padStart(2, '0')}`,
      supervisorIndex: targetSubIndex + 1,
    };
    setSubDeptsMap(prev => ({ ...prev, [deptKey]: currentSubs }));
    return;
  }

  if (payload.type === 'sub-slot' && payload.subIndex !== undefined) {
    const sourceSubIndex = payload.subIndex;
    if (sourceSubIndex === targetSubIndex) return;

    const itemA = currentSubs[sourceSubIndex];
    const itemB = currentSubs[targetSubIndex];
    if (!itemA || !itemB) return;

    currentSubs[targetSubIndex] = {
      ...itemA,
      code: `SQ-${String(targetSubIndex + 1).padStart(2, '0')}`,
      supervisorIndex: targetSubIndex + 1,
    };
    currentSubs[sourceSubIndex] = {
      ...itemB,
      code: `SQ-${String(sourceSubIndex + 1).padStart(2, '0')}`,
      supervisorIndex: sourceSubIndex + 1,
    };
    setSubDeptsMap(prev => ({ ...prev, [deptKey]: currentSubs }));
  }
}
