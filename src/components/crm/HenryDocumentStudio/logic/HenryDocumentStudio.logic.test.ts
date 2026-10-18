import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHenryDocumentStudioLogic } from './HenryDocumentStudio.logic';

describe('HenryDocumentStudio.logic', () => {
  it('blocks unconfirmed downstream autofill without mutating templates', () => {
    const { result } = renderHook(() => useHenryDocumentStudioLogic());
    const before = result.current.viewingPayload;
    act(() => result.current.handleTriggerAiAutoFill());
    expect(result.current.viewingPayload).toBe(before);
    expect(result.current.actionSuccessMessage).toContain('Review required');
  });
  it('initializes document studio templates and handles template switching', () => {
    const { result } = renderHook(() => useHenryDocumentStudioLogic());

    expect(result.current.selectedTemplateId).toBe('passport_scanner');
    expect(result.current.isTenancyModalOpen).toBe(false);

    act(() => {
      result.current.setSelectedTemplateId('emirates_id_scanner');
      result.current.handleOpenTenancyModal();
    });

    expect(result.current.selectedTemplateId).toBe('emirates_id_scanner');
    expect(result.current.isTenancyModalOpen).toBe(true);
  });
  it('reports demo scans as unverified previews without training or external actions', async () => {
    const { result } = renderHook(() => useHenryDocumentStudioLogic());
    for (const scan of [result.current.handleScanEmiratesId, result.current.handleScanTitleDeed, result.current.handleScanPassport]) {
      await act(async () => { await scan(); });
      expect(result.current.actionSuccessMessage).toContain('demo preview only');
      expect(result.current.actionSuccessMessage).not.toMatch(/extracted & verified|MRZ verified/);
    }
    await act(async () => { await result.current.handleScanTenancyContract(); });
    expect(result.current.actionSuccessMessage).toContain('no model was trained');
    expect(result.current.actionSuccessMessage).not.toContain('FILLED & EXECUTED');
  });
  it('does not report clipboard success when the browser rejects export', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('Denied')) } });
    try {
      const { result } = renderHook(() => useHenryDocumentStudioLogic());
      await act(async () => { result.current.handleCopyJsonVariables(); });
      expect(result.current.actionSuccessMessage).toContain('Clipboard export failed');
    } finally { vi.unstubAllGlobals(); }
  });
});
