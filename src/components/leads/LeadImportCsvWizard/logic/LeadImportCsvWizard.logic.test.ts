import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLeadImportCsvWizardLogic } from './LeadImportCsvWizard.logic';

describe('LeadImportCsvWizard.logic', () => {
  it('initializes on step 1 with empty filename and default field mappings', () => {
    const { result } = renderHook(() => useLeadImportCsvWizardLogic());

    expect(result.current.step).toBe(1);
    expect(result.current.fileName).toBe('');
    expect(result.current.rowCount).toBe(0);
    expect(result.current.mappings.length).toBe(5);
    expect(result.current.CRM_FIELDS).toContain('budget');
  });

  it('progresses through file select, import, and reset steps', () => {
    const { result } = renderHook(() => useLeadImportCsvWizardLogic());

    act(() => {
      result.current.handleFileSelect();
    });
    expect(result.current.step).toBe(2);
    expect(result.current.fileName).toBe('leads_export_Aug2026.csv');
    expect(result.current.rowCount).toBe(247);

    act(() => {
      result.current.handleImport();
    });
    expect(result.current.step).toBe(3);

    act(() => {
      result.current.handleReset();
    });
    expect(result.current.step).toBe(1);
    expect(result.current.fileName).toBe('');
  });
});
