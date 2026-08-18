/**
 * MobileKpiTileRow.style.ts — Style Layer
 */

import styled from 'styled-components';

export const ScrollRow = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px 16px 12px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Tile = styled.div<{ $color: string }>`
  flex-shrink: 0;
  scroll-snap-align: start;
  min-width: 130px;
  background: #fff;
  border-radius: 16px;
  padding: 14px 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const TileIcon = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${({ $color }) => $color}1a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

export const TileValue = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  font-family: 'Inter', sans-serif;
  line-height: 1;
  margin-bottom: 4px;
`;

export const TileLabel = styled.div`
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
  margin-bottom: 6px;
`;

export const DeltaBadge = styled.span<{ $positive: boolean }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ $positive }) => ($positive ? '#22c55e' : '#ef4444')};
`;
