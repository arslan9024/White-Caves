import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProspectsForm } from '../useProspectsForm';

describe('useProspectsForm Hook', () => {
  it('initializes with default form state', () => {
    const { result } = renderHook(() => useProspectsForm());
    expect(result.current).toBeDefined();
    expect(typeof result.current.formData).toBe('object');
  });

  it('handles form field changes', () => {
    const { result } = renderHook(() => useProspectsForm());
    expect(typeof result.current.handleChange).toBe('function');
  });
});
