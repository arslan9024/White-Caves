import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFollowUpSequenceBuilderLogic } from './FollowUpSequenceBuilder.logic';

describe('FollowUpSequenceBuilder.logic', () => {
  it('initializes with default sequence steps and channel color palette', () => {
    const { result } = renderHook(() => useFollowUpSequenceBuilderLogic());

    expect(result.current.steps.length).toBe(5);
    expect(result.current.steps[0].channel).toBe('whatsapp');
    expect(result.current.CHANNEL_COLORS.whatsapp).toBe('#22c55e');
  });

  it('adds and removes sequence steps', () => {
    const { result } = renderHook(() => useFollowUpSequenceBuilderLogic());

    act(() => {
      result.current.addStep();
    });
    expect(result.current.steps.length).toBe(6);
    expect(result.current.steps[5].day).toBe(21);

    const stepIdToRemove = result.current.steps[0].id;
    act(() => {
      result.current.removeStep(stepIdToRemove);
    });
    expect(result.current.steps.length).toBe(5);
    expect(result.current.steps.some((s) => s.id === stepIdToRemove)).toBe(false);
  });
});
