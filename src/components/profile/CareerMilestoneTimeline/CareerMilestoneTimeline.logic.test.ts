import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCareerMilestoneTimelineLogic, MILESTONES } from './CareerMilestoneTimeline.logic';

describe('useCareerMilestoneTimelineLogic Hook', () => {
  it('returns corporate agency career milestones with statutory references', () => {
    const { result } = renderHook(() => useCareerMilestoneTimelineLogic());
    expect(result.current.milestones).toHaveLength(4);
    expect(result.current.milestones[0].year).toBe('2023');
    expect(result.current.milestones[0].title).toContain('DET License 1388443');
    expect(result.current.milestones[1].title).toContain('RERA ORN 44483');
    expect(result.current.milestones).toEqual(MILESTONES);
  });
});
