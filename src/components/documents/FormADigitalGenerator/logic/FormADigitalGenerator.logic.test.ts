import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormADigitalGeneratorLogic } from './FormADigitalGenerator.logic';

describe('FormADigitalGenerator.logic', () => {
  it('updates form fields and handles generation and reset', () => {
    const { result } = renderHook(() => useFormADigitalGeneratorLogic());

    expect(result.current.form.agentName).toBe('Arsalan Malik');
    expect(result.current.generated).toBe(false);

    act(() => {
      result.current.update('sellerName', 'Mohammed Al Qasimi');
    });

    act(() => {
      result.current.update('propertyAddress', 'Villa 45, Palm Jumeirah');
    });

    act(() => {
      result.current.update('listingPrice', '15,000,000');
    });

    act(() => {
      result.current.handleGenerate();
    });

    expect(result.current.form.sellerName).toBe('Mohammed Al Qasimi');
    expect(result.current.generated).toBe(true);

    act(() => {
      result.current.handleReset();
    });

    expect(result.current.form.sellerName).toBe('');
    expect(result.current.generated).toBe(false);
  });
});
