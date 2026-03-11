import styled from 'styled-components';

export const KanbanBoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(250, 250, 250, 0.3) 100%);
  border-radius: 12px;
  min-height: 400px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(25, 25, 25, 0.6) 100%);
  }
`;

export const KanbanColumn = styled.div<{ color?: string }>`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.9) 100%);
  border-radius: 10px;
  border-top: 4px solid ${props => props.color || '#3b82f6'};
  padding: 16px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(25, 25, 25, 0.9) 100%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    &:hover {
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
    }
  }

  @media (max-width: 768px) {
    min-height: auto;
  }
`;

export const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.08);

  @media (prefers-color-scheme: dark) {
    border-bottom-color: rgba(255, 255, 255, 0.12);
  }
`;

export const ColumnTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.9);
  margin: 0;
  letter-spacing: -0.3px;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.95);
  }

  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

export const ColumnBadge = styled.span`
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  min-width: 24px;
  text-align: center;

  @media (prefers-color-scheme: dark) {
    background: rgba(96, 165, 250, 0.2);
  }
`;

export const CardList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.04);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }

  @media (prefers-color-scheme: dark) {
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.04);
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
`;

export const KanbanCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  cursor: grab;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  &:active {
    cursor: grabbing;
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
  }
`;

export const CardTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  margin-bottom: 8px;
  word-break: break-word;

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.95);
  }
`;

export const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.6);

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const AddCardButton = styled.button`
  width: 100%;
  padding: 12px;
  border: 2px dashed rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.05);
  border-radius: 8px;
  color: #3b82f6;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(96, 165, 250, 0.08);
  }
`;
