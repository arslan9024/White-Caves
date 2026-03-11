import React, { memo, useState } from 'react';
import * as S from './KanbanBoard.styles';

interface KanbanColumn {
  id: string;
  title: string;
  color?: string;
  cards: Array<{
    id: string;
    title: string;
    meta?: string;
  }>;
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onCardAdd?: (columnId: string) => void;
  onCardMove?: (cardId: string, fromColumn: string, toColumn: string) => void;
}

/**
 * KanbanBoard - Kanban Column Board Component
 * 
 * A drag-and-drop ready Kanban board with multiple columns and cards.
 * Displays card counts and allows for visual task management.
 * 
 * @example
 * <KanbanBoard
 *   columns={[
 *     {
 *       id: 'todo',
 *       title: 'To Do',
 *       color: '#ef4444',
 *       cards: [{ id: '1', title: 'Task 1' }]
 *     }
 *   ]}
 *   onCardAdd={(columnId) => console.log('Add card to', columnId)}
 * />
 */
const KanbanBoard = memo(({
  columns,
  onCardAdd,
  onCardMove
}: KanbanBoardProps) => {
  return (
    <S.KanbanBoardContainer>
      {columns.map((column) => (
        <S.KanbanColumn key={column.id} color={column.color}>
          <S.ColumnHeader>
            <S.ColumnTitle>{column.title}</S.ColumnTitle>
            <S.ColumnBadge>
              {column.cards.length}
            </S.ColumnBadge>
          </S.ColumnHeader>

          <S.CardList>
            {column.cards.map((card) => (
              <S.KanbanCard
                key={card.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('cardId', card.id);
                  e.dataTransfer.setData('fromColumn', column.id);
                }}
              >
                <S.CardTitle>{card.title}</S.CardTitle>
                {card.meta && <S.CardMeta>{card.meta}</S.CardMeta>}
              </S.KanbanCard>
            ))}
          </S.CardList>

          <S.AddCardButton
            onClick={() => onCardAdd?.(column.id)}
            aria-label={`Add card to ${column.title}`}
          >
            + Add Card
          </S.AddCardButton>
        </S.KanbanColumn>
      ))}
    </S.KanbanBoardContainer>
  );
});

KanbanBoard.displayName = 'KanbanBoard';

export default KanbanBoard;
