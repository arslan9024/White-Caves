import { describe, it, expect } from 'vitest';
import { getScoreLevel, getScoreColor, getScoreLabel } from './LeadScoreBadge.logic';

describe('LeadScoreBadge.logic', () => {
  it('classifies numeric scores into correct tier levels', () => {
    expect(getScoreLevel(95)).toBe('S');
    expect(getScoreLevel(80)).toBe('A');
    expect(getScoreLevel(60)).toBe('B');
    expect(getScoreLevel(40)).toBe('C');
    expect(getScoreLevel(20)).toBe('D');
  });

  it('maps score levels to colors and labels', () => {
    expect(getScoreColor('S')).toBe('#ef4444');
    expect(getScoreColor('D')).toBe('#94a3b8');
    expect(getScoreLabel('S')).toBe('Super Hot');
    expect(getScoreLabel('D')).toBe('Cold');
  });
});
