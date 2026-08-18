/**
 * MobileKpiTileRow.tsx — View Layer (4-Way Component Architecture)
 * Horizontally-scrollable compact KPI tile row for mobile CRM dashboard header.
 */

import React, { FC } from 'react';
import { Users, Eye, FileText, TrendingUp, Home, AlertCircle } from 'lucide-react';
import { useMobileKpiTileRowLogic } from './logic/MobileKpiTileRow.logic';
import {
  ScrollRow,
  Tile,
  TileIcon,
  TileValue,
  TileLabel,
  DeltaBadge,
} from './styles/MobileKpiTileRow.style';

const ICON_MAP: Record<string, React.ReactNode> = {
  Users: <Users size={18} />,
  Eye: <Eye size={18} />,
  FileText: <FileText size={18} />,
  TrendingUp: <TrendingUp size={18} />,
  Home: <Home size={18} />,
  AlertCircle: <AlertCircle size={18} />,
};

export const MobileKpiTileRow: FC = () => {
  const { tiles } = useMobileKpiTileRowLogic();

  return (
    <ScrollRow data-testid="mobile-kpi-tile-row">
      {tiles.map(tile => (
        <Tile key={tile.id} $color={tile.color}>
          <TileIcon $color={tile.color} style={{ color: tile.color }}>
            {ICON_MAP[tile.icon]}
          </TileIcon>
          <TileValue>{tile.value}</TileValue>
          <TileLabel>{tile.label}</TileLabel>
          <DeltaBadge $positive={tile.deltaPositive}>{tile.delta}</DeltaBadge>
        </Tile>
      ))}
    </ScrollRow>
  );
};

export default MobileKpiTileRow;
