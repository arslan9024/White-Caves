import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import HenryEmiratesIdScannerView from './HenryEmiratesIdScannerView';
import HenryTitleDeedScannerView from './HenryTitleDeedScannerView';
import eid from '../../../services/HenryEmiratesIdScannerService';
import deed from '../../../services/HenryTitleDeedScannerService';
import * as perspective from '../../../services/henryPerspective';

afterEach(() => { vi.restoreAllMocks(); eid.clearCachedEmiratesId(); deed.clearCachedTitleDeed(); });
const original = new File(['synthetic original'], 'original.png', { type: 'image/png' });
const corrected = new File(['synthetic corrected'], 'corrected.png', { type: 'image/png' });

it.each(['emirates_id', 'title_deed'] as const)('cancels in-flight correction on initial empty %s reset before OCR', async kind => {
  URL.createObjectURL = vi.fn().mockReturnValue('blob:synthetic');
  URL.revokeObjectURL = vi.fn();
  let resolve!: (file: File) => void;
  vi.spyOn(perspective, 'correctPerspective').mockReturnValue(new Promise<File>(done => { resolve = done; }));
  vi.spyOn(eid, 'getCachedEmiratesId').mockReturnValue(null);
  vi.spyOn(deed, 'getCachedTitleDeed').mockReturnValue(null);
  const idScan = vi.spyOn(eid, 'scanEmiratesId');
  const deedScan = vi.spyOn(deed, 'scanTitleDeed');
  const isId = kind === 'emirates_id';
  render(isId ? <HenryEmiratesIdScannerView /> : <HenryTitleDeedScannerView />);
  fireEvent.click(screen.getByLabelText('Manual four-corner correction before scanning'));
  fireEvent.change(screen.getByLabelText('Upload document'), { target: { files: [original] } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirm corners and scan' }));
  expect(screen.getByRole('button', { name: 'Correcting image…' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: isId ? 'Clear & Reset' : 'Discard & Clear' }));
  expect(screen.queryByLabelText('Manual perspective correction')).not.toBeInTheDocument();
  expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:synthetic');
  await act(async () => { resolve(corrected); await Promise.resolve(); });
  expect(idScan).not.toHaveBeenCalled();
  expect(deedScan).not.toHaveBeenCalled();
  expect(screen.getByLabelText('Confirm document review')).toBeDisabled();
});

it.each(['emirates_id', 'title_deed'] as const)('archives original bytes, never corrected OCR input, in %s view', async kind => {
  URL.createObjectURL = vi.fn().mockReturnValue('blob:synthetic');
  URL.revokeObjectURL = vi.fn();
  vi.spyOn(perspective, 'correctPerspective').mockResolvedValue(corrected);
  const isId = kind === 'emirates_id';
  const service = isId ? eid : deed;
  const data = { ...service.getDemoExtractedData(), demoOnly: false, reviewConfirmed: false,
    expiryDate: '01/01/2099', missingFields: [], diagnostics: undefined };
  const scan = isId ? vi.spyOn(eid, 'scanEmiratesId').mockResolvedValue(data as Awaited<ReturnType<typeof eid.scanEmiratesId>>)
    : vi.spyOn(deed, 'scanTitleDeed').mockResolvedValue(data as Awaited<ReturnType<typeof deed.scanTitleDeed>>);
  const save = vi.spyOn(service, 'saveToDatabase').mockResolvedValue({ success: true, id: 'synthetic' });
  if (isId) render(<HenryEmiratesIdScannerView />);
  else render(<HenryTitleDeedScannerView />);
  fireEvent.click(screen.getByLabelText('Manual four-corner correction before scanning'));
  fireEvent.change(screen.getByLabelText('Upload document'), { target: { files: [original] } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirm corners and scan' }));
  await waitFor(() => expect(scan).toHaveBeenCalledWith(corrected));
  await waitFor(() => expect(screen.getByLabelText('Confirm document review')).not.toBeDisabled());
  fireEvent.click(screen.getByLabelText('Confirm document review'));
  fireEvent.click(screen.getByRole('button', { name: isId ? /Confirm & Save to KYC Vault/ : /Save to Property Vault/ }));
  await waitFor(() => expect(save).toHaveBeenCalled());
  expect(save.mock.calls[0]?.[1]?.sources).toEqual([original]);
  expect(save.mock.calls[0]?.[1]?.sources?.[0]).toBe(original);
});
