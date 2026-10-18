import React from 'react';
import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { useHenryDocumentStudioLogic } from './logic/HenryDocumentStudio.logic';
import pdf from '../../../services/HenryPdfEngineService';
import eid, { EMPTY_EMIRATES_ID } from '../../../services/HenryEmiratesIdScannerService';
import deed from '../../../services/HenryTitleDeedScannerService';
import * as review from '../../../services/henryScanReview';
import logger from '../../../utils/logger';
import HenryEmiratesIdScannerView from './HenryEmiratesIdScannerView';
import HenryTitleDeedScannerView from './HenryTitleDeedScannerView';

afterEach(() => {
  vi.restoreAllMocks();
  eid.clearCachedEmiratesId();
  deed.clearCachedTitleDeed();
});

it('does not display an obsolete async invoice after switching templates', async () => {
  let finish!: (html: string) => void;
  vi.spyOn(pdf, 'generateTaxReceiptHtml').mockReturnValue(new Promise(resolve => { finish = resolve; }));
  vi.spyOn(pdf, 'generateViewingFormHtml').mockReturnValue('CURRENT VIEWING');
  const { result } = renderHook(() => useHenryDocumentStudioLogic());
  act(() => result.current.setSelectedTemplateId('tenant_service_receipt'));
  act(() => result.current.setSelectedTemplateId('viewing_form_autofill'));
  await waitFor(() => expect(result.current.compiledHtml).toBe('CURRENT VIEWING'));
  await act(async () => { finish('OBSOLETE INVOICE'); });
  expect(result.current.compiledHtml).toBe('CURRENT VIEWING');
});

it('clears an old printable preview and reports rejected invoice generation safely', async () => {
  vi.spyOn(pdf, 'generateViewingFormHtml').mockReturnValue('CURRENT VIEWING');
  vi.spyOn(pdf, 'generateTaxReceiptHtml').mockRejectedValue(new Error('synthetic failure'));
  const log = vi.spyOn(logger, 'error').mockImplementation(() => {});
  const print = vi.spyOn(pdf, 'triggerPrint').mockImplementation(() => {});
  const { result } = renderHook(() => useHenryDocumentStudioLogic());
  act(() => result.current.setSelectedTemplateId('viewing_form_autofill'));
  await waitFor(() => expect(result.current.compiledHtml).toBe('CURRENT VIEWING'));
  act(() => result.current.setSelectedTemplateId('tenant_service_receipt'));
  await waitFor(() => expect(result.current.actionSuccessMessage).toBe(
    'Document preview failed. Retry before printing or exporting.'
  ));
  expect(result.current.compiledHtml).toBe('');
  act(() => result.current.handlePrint());
  expect(print).not.toHaveBeenCalled();
  expect(log).toHaveBeenCalledWith('Henry document preview generation failed', {
    templateId: 'tenant_service_receipt',
  });
});

it.each(['emirates_id', 'title_deed'] as const)(
  'does not resurrect revoked %s confirmation when an old save completes',
  async kind => {
    let finish!: (result: { success: boolean; id: string }) => void;
    vi.spyOn(review, 'saveReviewedScan').mockReturnValue(new Promise(resolve => { finish = resolve; }));
    const idData = { ...EMPTY_EMIRATES_ID, idNumber: '784-2001-0000001-1',
      fullNameEn: 'SYNTHETIC TENANT', expiryDate: '01/01/2099',
      demoOnly: false, reviewConfirmed: true, missingFields: [] };
    const deedData = { ...deed.parseDocumentText(
      'Certificate Number: 900001/2030\nUnit Number: 100\nOwner Number: 100001 Owner Name: TEST OWNER'
    ), reviewConfirmed: true };
    expect(review.canUseScan(kind === 'emirates_id' ? idData : deedData)).toBe(true);
    const pending = kind === 'emirates_id' ? eid.saveToDatabase(idData) : deed.saveToDatabase(deedData);
    if (kind === 'emirates_id') eid.clearCachedEmiratesId();
    else deed.clearCachedTitleDeed();
    finish({ success: true, id: 'synthetic-saved-record' });
    await expect(pending).resolves.toEqual({ success: true, id: 'synthetic-saved-record' });
    expect(kind === 'emirates_id' ? eid.getCachedEmiratesId() : deed.getCachedTitleDeed()).toBeNull();
  }
);

it('transfers genuinely parsed, reviewed synthetic deed fields without benchmark data', () => {
  const data = deed.parseDocumentText(
    'Certificate Number: 900001/2030\nUnit Number: 100\nBuilding Name: TEST BUILDING\nOwner Number: 100001 Owner Name: TEST OWNER'
  );
  expect(review.canUseScan(data)).toBe(false);
  deed.setCachedTitleDeed(data);
  expect(deed.getCachedTitleDeed()).toBeNull();
  deed.setCachedTitleDeed({ ...data, reviewConfirmed: true });
  expect(deed.getCachedTitleDeed()).toMatchObject({
    certificateNumber: '900001/2030', propertyNumber: '100', ownerNameEn: 'TEST OWNER',
    demoOnly: false, reviewConfirmed: true,
  });
  deed.clearCachedTitleDeed();
  expect(deed.getCachedTitleDeed()).toBeNull();
});

it.each(['emirates_id', 'title_deed'] as const)(
  'does not report an old %s archival response as success after reset',
  async kind => {
    let finish!: (result: { success: boolean; id: string }) => void;
    const save = vi.spyOn(review, 'saveReviewedScan').mockReturnValue(new Promise(resolve => { finish = resolve; }));
    const isId = kind === 'emirates_id';
    vi.spyOn(eid, 'scanEmiratesId').mockResolvedValue({
      ...EMPTY_EMIRATES_ID, idNumber: '784-2001-0000001-1', fullNameEn: 'SYNTHETIC TENANT',
      expiryDate: '01/01/2099', demoOnly: false, reviewConfirmed: false, missingFields: [],
    });
    vi.spyOn(deed, 'scanTitleDeed').mockResolvedValue(deed.parseDocumentText(
      'Certificate Number: 900001/2030\nUnit Number: 100\nOwner Number: 100001 Owner Name: TEST OWNER'
    ));
    const createUrl = URL.createObjectURL;
    const revokeUrl = URL.revokeObjectURL;
    URL.createObjectURL = vi.fn().mockReturnValue('blob:synthetic');
    URL.revokeObjectURL = vi.fn();
    const view = render(isId ? <HenryEmiratesIdScannerView /> : <HenryTitleDeedScannerView />);
    try {
      fireEvent.change(screen.getByLabelText('Upload document'), {
        target: { files: [new File(['synthetic'], 'synthetic.png', { type: 'image/png' })] },
      });
      await waitFor(() => expect(screen.getByLabelText('Confirm document review')).not.toBeDisabled());
      fireEvent.click(screen.getByLabelText('Confirm document review'));
      fireEvent.click(screen.getByRole('button', { name: isId ? /Confirm & Save to KYC Vault/ : /Save to Property Vault/ }));
      await waitFor(() => expect(save).toHaveBeenCalledOnce());
      fireEvent.click(screen.getByRole('button', { name: isId ? 'Clear & Reset' : 'Discard & Clear' }));
      await act(async () => { finish({ success: true, id: 'synthetic-saved-record' }); });
      expect(screen.queryByText('Reviewed record saved to encrypted vault.')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Confirm document review')).toBeDisabled();
      expect(isId ? eid.getCachedEmiratesId() : deed.getCachedTitleDeed()).toBeNull();
    } finally {
      view.unmount();
      URL.createObjectURL = createUrl;
      URL.revokeObjectURL = revokeUrl;
    }
  }
);
