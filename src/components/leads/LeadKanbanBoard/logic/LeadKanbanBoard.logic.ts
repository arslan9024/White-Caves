/**
 * LeadKanbanBoard.logic.ts — Logic Layer (4-Way Component Architecture)
 * Manages drag-and-drop state across pipeline columns.
 */

import { useState, useCallback, useRef } from 'react';

export type LeadHeat = 'hot' | 'warm' | 'cold';

export interface KanbanLead {
  id: string;
  name: string;
  phone: string;
  budget: string;
  heat: LeadHeat;
  source: string;
  agentInitials: string;
  daysInStage: number;
}

export type ColumnId = 'new' | 'contacted' | 'viewing' | 'offer' | 'closed' | 'lost';

export interface KanbanColumn {
  id: ColumnId;
  label: string;
  leads: KanbanLead[];
}

const INITIAL_COLUMNS: KanbanColumn[] = [
  {
    id: 'new',
    label: 'New Leads',
    leads: [
      { id: 'l1', name: 'Ahmed Al Mansouri', phone: '+971 55 123 4567', budget: 'AED 2.5M', heat: 'hot', source: 'PropertyFinder', agentInitials: 'SJ', daysInStage: 1 },
      { id: 'l2', name: 'Sarah Williams', phone: '+971 50 987 6543', budget: 'AED 8,500/mo', heat: 'warm', source: 'Bayut', agentInitials: 'MK', daysInStage: 3 },
    ],
  },
  {
    id: 'contacted',
    label: 'Contacted',
    leads: [
      { id: 'l3', name: 'Rajiv Sharma', phone: '+971 56 234 5678', budget: 'AED 1.8M', heat: 'warm', source: 'Referral', agentInitials: 'SJ', daysInStage: 2 },
    ],
  },
  {
    id: 'viewing',
    label: 'Viewing',
    leads: [
      { id: 'l4', name: 'Emma Johnson', phone: '+971 52 345 6789', budget: 'AED 4.2M', heat: 'hot', source: 'WhatsApp', agentInitials: 'NA', daysInStage: 1 },
    ],
  },
  {
    id: 'offer',
    label: 'Offer',
    leads: [
      { id: 'l5', name: 'Wang Wei', phone: '+971 54 456 7890', budget: 'AED 6.8M', heat: 'hot', source: 'Walk-in', agentInitials: 'MK', daysInStage: 4 },
    ],
  },
  {
    id: 'closed',
    label: 'Closed',
    leads: [
      { id: 'l6', name: 'Fatima Al Zahra', phone: '+971 55 567 8901', budget: 'AED 3.1M', heat: 'warm', source: 'Portal', agentInitials: 'SJ', daysInStage: 0 },
    ],
  },
  {
    id: 'lost',
    label: 'Lost',
    leads: [],
  },
];

export function useLeadKanbanBoardLogic() {
  const [columns, setColumns] = useState<KanbanColumn[]>(INITIAL_COLUMNS);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ColumnId | null>(null);
  const dragSourceColumn = useRef<ColumnId | null>(null);
  const draggingIdRef = useRef<string | null>(null);

  const handleDragStart = useCallback((leadId: string, colId: ColumnId) => {
    draggingIdRef.current = leadId;
    setDraggingId(leadId);
    dragSourceColumn.current = colId;
  }, []);

  const handleDragOverColumn = useCallback((colId: ColumnId) => {
    setDragOverColumn(colId);
  }, []);

  const handleDrop = useCallback(
    (targetColId: ColumnId) => {
      const sourceColId = dragSourceColumn.current;
      const activeId = draggingIdRef.current || draggingId;
      if (!activeId || !sourceColId) return;
      if (sourceColId === targetColId) {
        setDraggingId(null);
        draggingIdRef.current = null;
        setDragOverColumn(null);
        return;
      }

      setColumns((prev) => {
        const next = prev.map((col) => ({ ...col, leads: [...col.leads] }));
        const srcCol = next.find((c) => c.id === sourceColId);
        const tgtCol = next.find((c) => c.id === targetColId);
        if (!srcCol || !tgtCol) return prev;
        const idx = srcCol.leads.findIndex((l) => l.id === activeId);
        if (idx === -1) return prev;
        const [moved] = srcCol.leads.splice(idx, 1);
        tgtCol.leads.push({ ...moved, daysInStage: 0 });
        return next;
      });

      setDraggingId(null);
      draggingIdRef.current = null;
      setDragOverColumn(null);
      dragSourceColumn.current = null;
    },
    [draggingId],
  );

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverColumn(null);
    dragSourceColumn.current = null;
  }, []);

  return {
    columns,
    draggingId,
    dragOverColumn,
    handleDragStart,
    handleDragOverColumn,
    handleDrop,
    handleDragEnd,
  };
}
