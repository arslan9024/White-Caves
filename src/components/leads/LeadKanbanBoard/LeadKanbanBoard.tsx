/**
 * LeadKanbanBoard.tsx — View Layer (4-Way Component Architecture)
 * Drag-and-drop CRM pipeline board with 6 stage columns:
 * New → Contacted → Viewing → Offer → Closed → Lost
 */

import React, { FC } from 'react';
import { Phone, User } from 'lucide-react';
import { useLeadKanbanBoardLogic } from './logic/LeadKanbanBoard.logic';
import type { ColumnId } from './logic/LeadKanbanBoard.logic';
import {
  BoardRoot,
  Column,
  ColumnHeader,
  ColumnTitle,
  ColumnCount,
  CardList,
  LeadCard,
  CardName,
  CardMeta,
  CardBudget,
  HotBadge,
} from './styles/LeadKanbanBoard.style';

export const LeadKanbanBoard: FC = () => {
  const {
    columns,
    draggingId,
    dragOverColumn,
    handleDragStart,
    handleDragOverColumn,
    handleDrop,
    handleDragEnd,
  } = useLeadKanbanBoardLogic();

  return (
    <BoardRoot data-testid="lead-kanban-board">
      {columns.map((col) => (
        <Column
          key={col.id}
          $isDragOver={dragOverColumn === col.id}
          onDragOver={(e) => {
            e.preventDefault();
            handleDragOverColumn(col.id as ColumnId);
          }}
          onDrop={() => handleDrop(col.id as ColumnId)}
          data-testid={`kanban-column-${col.id}`}
        >
          <ColumnHeader>
            <ColumnTitle>{col.label}</ColumnTitle>
            <ColumnCount>{col.leads.length}</ColumnCount>
          </ColumnHeader>
          <CardList>
            {col.leads.map((lead) => (
              <LeadCard
                key={lead.id}
                $isDragging={draggingId === lead.id}
                draggable
                onDragStart={() => handleDragStart(lead.id, col.id as ColumnId)}
                onDragEnd={handleDragEnd}
                data-testid={`lead-card-${lead.id}`}
              >
                <CardName>{lead.name}</CardName>
                <CardMeta>
                  <Phone size={11} />
                  {lead.phone}
                </CardMeta>
                <CardMeta>
                  <User size={11} />
                  {lead.source}
                </CardMeta>
                <CardBudget>{lead.budget}</CardBudget>
                <HotBadge $heat={lead.heat}>{lead.heat}</HotBadge>
              </LeadCard>
            ))}
          </CardList>
        </Column>
      ))}
    </BoardRoot>
  );
};

export default LeadKanbanBoard;
