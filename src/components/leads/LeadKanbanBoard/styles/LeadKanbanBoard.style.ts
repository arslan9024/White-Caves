/**
 * LeadKanbanBoard.style.ts — Styles Layer (4-Way Component Architecture)
 * Drag-and-drop CRM pipeline board with 6 stage columns.
 */

import styled from 'styled-components';

export const BoardRoot = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem;
  min-height: 600px;
  background: #f8fafc;
  border-radius: 12px;
  scrollbar-width: thin;
  scrollbar-color: #ef4444 #e2e8f0;
`;

export const Column = styled.div<{ $isDragOver?: boolean }>`
  min-width: 240px;
  width: 240px;
  flex-shrink: 0;
  background: ${({ $isDragOver }) => ($isDragOver ? '#fef2f2' : '#ffffff')};
  border: 2px solid ${({ $isDragOver }) => ($isDragOver ? '#ef4444' : '#e2e8f0')};
  border-radius: 10px;
  padding: 0.75rem;
  transition: border-color 0.2s ease, background 0.2s ease;
`;

export const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

export const ColumnTitle = styled.span`
  font-weight: 700;
  font-size: 0.8125rem;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const ColumnCount = styled.span`
  background: #ef4444;
  color: #fff;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0 0.45rem;
  min-width: 20px;
  text-align: center;
`;

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 60px;
`;

export const LeadCard = styled.div<{ $isDragging?: boolean }>`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: grab;
  box-shadow: ${({ $isDragging }) =>
    $isDragging ? '0 8px 24px rgba(239,68,68,0.18)' : '0 2px 6px rgba(0,0,0,0.05)'};
  opacity: ${({ $isDragging }) => ($isDragging ? 0.7 : 1)};
  transition: box-shadow 0.2s ease, transform 0.15s ease;

  &:hover {
    box-shadow: 0 6px 18px rgba(239, 68, 68, 0.12);
    transform: translateY(-1px);
  }

  &:active {
    cursor: grabbing;
  }
`;

export const CardName = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

export const CardMeta = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

export const CardBudget = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #ef4444;
  margin-top: 0.35rem;
  display: block;
`;

export const HotBadge = styled.span<{ $heat: 'hot' | 'warm' | 'cold' }>`
  display: inline-block;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${({ $heat }) =>
    $heat === 'hot' ? '#fef2f2' : $heat === 'warm' ? '#fff7ed' : '#f0f9ff'};
  color: ${({ $heat }) =>
    $heat === 'hot' ? '#ef4444' : $heat === 'warm' ? '#f97316' : '#0284c7'};
`;
