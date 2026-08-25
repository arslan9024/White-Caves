import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLeadKanbanBoardLogic } from './LeadKanbanBoard.logic';

describe('LeadKanbanBoard.logic', () => {
  it('initializes with 6 default pipeline columns', () => {
    const { result } = renderHook(() => useLeadKanbanBoardLogic());

    expect(result.current.columns.length).toBe(6);
    expect(result.current.columns[0].id).toBe('new');
    expect(result.current.columns[0].leads.length).toBe(2);
  });

  it('moves a lead between columns via drag and drop handlers', () => {
    const { result } = renderHook(() => useLeadKanbanBoardLogic());

    act(() => {
      result.current.handleDragStart('l1', 'new');
    });

    act(() => {
      result.current.handleDrop('contacted');
    });

    const newCol = result.current.columns.find((c) => c.id === 'new');
    const contactedCol = result.current.columns.find((c) => c.id === 'contacted');

    expect(newCol?.leads.some((l) => l.id === 'l1')).toBe(false);
    expect(contactedCol?.leads.some((l) => l.id === 'l1')).toBe(true);
  });
});
