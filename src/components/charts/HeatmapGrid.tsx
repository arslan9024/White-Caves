import React, { memo, useState } from 'react';
import * as S from './HeatmapGrid.styles';

interface HeatmapGridProps {
  data: number[][];
  cols?: number;
  showLegend?: boolean;
  onCellClick?: (row: number, col: number, value: number) => void;
}

/**
 * HeatmapGrid - Interactive Heatmap Visualization Component
 * 
 * Displays a 2D grid with color intensity based on values.
 * Perfect for showing activity, frequency, or performance matrices.
 * Includes interactive tooltips and optional legend.
 * 
 * @example
 * <HeatmapGrid
 *   data={[
 *     [10, 20, 30, 40],
 *     [15, 25, 35, 45],
 *     [20, 30, 40, 50]
 *   ]}
 *   cols={4}
 *   showLegend={true}
 *   onCellClick={(row, col, value) => console.log(value)}
 * />
 */
const HeatmapGrid = memo(({
  data,
  cols = 4,
  showLegend = true,
  onCellClick
}: HeatmapGridProps) => {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const flatData = data.flat();
  const maxValue = Math.max(...flatData);
  const rows = Math.ceil(flatData.length / cols);

  return (
    <S.HeatmapGridContainer>
      <S.HeatmapGrid rows={rows} cols={cols}>
        {flatData.map((value, idx) => (
          <S.HeatmapCell
            key={idx}
            value={value}
            maxValue={maxValue}
            onClick={() => onCellClick?.(Math.floor(idx / cols), idx % cols, value)}
            onMouseEnter={() => setHoveredCell({ row: Math.floor(idx / cols), col: idx % cols })}
            onMouseLeave={() => setHoveredCell(null)}
            role="button"
            tabIndex={0}
            aria-label={`Cell ${idx}: ${value}`}
          >
            {hoveredCell?.row === Math.floor(idx / cols) && hoveredCell?.col === idx % cols ? (
              <S.HeatmapTooltip style={{ opacity: 1 }}>
                {value}
              </S.HeatmapTooltip>
            ) : null}
            {value > 0 ? value : ''}
          </S.HeatmapCell>
        ))}
      </S.HeatmapGrid>

      {showLegend && (
        <S.HeatmapLegend>
          <span>Low</span>
          <S.LegendGradient>
            {[0, 0.33, 0.66, 1].map((intensity, idx) => (
              <S.LegendBar key={idx} intensity={intensity} />
            ))}
          </S.LegendGradient>
          <S.LegendLabel>High</S.LegendLabel>
        </S.HeatmapLegend>
      )}
    </S.HeatmapGridContainer>
  );
});

HeatmapGrid.displayName = 'HeatmapGrid';

export default HeatmapGrid;
