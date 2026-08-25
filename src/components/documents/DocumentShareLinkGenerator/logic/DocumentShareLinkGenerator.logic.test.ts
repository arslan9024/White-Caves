import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDocumentShareLinkGeneratorLogic } from './DocumentShareLinkGenerator.logic';

describe('DocumentShareLinkGenerator.logic', () => {
  it('generates secure document share link with optional PIN and expiry', () => {
    const { result } = renderHook(() => useDocumentShareLinkGeneratorLogic());

    expect(result.current.link).toBe('');

    act(() => {
      result.current.setRequirePin(true);
    });

    act(() => {
      result.current.handleGenerate();
    });

    expect(result.current.link).toContain('https://docs.whitecaves.ae/share/');
    expect(result.current.pin.length).toBe(4);
  });
});
