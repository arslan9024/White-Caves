import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMobileKpiTileRowLogic } from './MobileKpiTileRow.logic';

describe('MobileKpiTileRow.logic', () => {
  it('returns default KPI metrics with labels, values, and deltas', () => {
    const { result } = renderHook(() => useMobileKpiTileRowLogic());

    expect(result.current.tiles.length).toBeGreaterThanOrEqual(4);
    expect(result.current.tiles[0].id).toBe('leads');
    expect(result.current.tiles[0].value).toBe('47');
    expect(result.current.tiles[0].deltaPositive).toBe(true);
  });
});
