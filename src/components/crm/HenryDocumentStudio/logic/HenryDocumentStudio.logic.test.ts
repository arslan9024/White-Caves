import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHenryDocumentStudioLogic } from './HenryDocumentStudio.logic';

describe('HenryDocumentStudio.logic', () => {
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
});
