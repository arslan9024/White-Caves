import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { HenryPerspectiveEditor } from './HenryPerspectiveEditor';
import { HenrySharedDocumentUploader } from './HenrySharedDocumentUploader';
import { correctPerspective } from '../../../services/henryPerspective';

vi.mock('../../../services/henryPerspective', async importOriginal => ({
  ...await importOriginal<typeof import('../../../services/henryPerspective')>(), correctPerspective: vi.fn(),
}));
afterEach(() => vi.restoreAllMocks());
beforeEach(() => {
  URL.createObjectURL = vi.fn().mockReturnValue('blob:synthetic');
  URL.revokeObjectURL = vi.fn();
});
const original = new File(['synthetic'], 'original.png', { type: 'image/png' });
const corrected = new File(['warped'], 'corrected.png', { type: 'image/png' });

it('requires explicit corners confirmation and passes corrected OCR input alongside untouched original', async () => {
  vi.mocked(correctPerspective).mockResolvedValue(corrected);
  const upload = vi.fn();
  render(<HenrySharedDocumentUploader docType="title_deed" title="Deed" onFileUpload={upload} />);
  fireEvent.click(screen.getByLabelText('Manual four-corner correction before scanning'));
  fireEvent.change(screen.getByLabelText('Upload document'), { target: { files: [original] } });
  expect(upload).not.toHaveBeenCalled();
  expect(screen.getByLabelText('TL x')).toHaveValue(0);
  fireEvent.click(screen.getByRole('button', { name: 'Confirm corners and scan' }));
  await waitFor(() => expect(upload).toHaveBeenCalledWith(corrected, original));
});

it('scans PDFs without presenting unsupported corner correction', async () => {
  const upload = vi.fn();
  render(<HenrySharedDocumentUploader docType="emirates_id" title="ID" onFileUpload={upload} />);
  fireEvent.click(screen.getByLabelText('Manual four-corner correction before scanning'));
  const pdf = new File(['synthetic pdf'], 'test.pdf', { type: 'application/pdf' });
  fireEvent.change(screen.getByLabelText('Upload document'), { target: { files: [pdf] } });
  await waitFor(() => expect(upload).toHaveBeenCalledWith(pdf, undefined));
  expect(screen.queryByLabelText('Manual perspective correction')).toBeNull();
});

it('clears a pending correction when a demo or external discard resets the scanner', () => {
  const sample = vi.fn();
  const { rerender } = render(<HenrySharedDocumentUploader docType="title_deed" title="Deed"
    onFileUpload={vi.fn()} onSampleLoad={sample} />);
  fireEvent.click(screen.getByLabelText('Manual four-corner correction before scanning'));
  fireEvent.change(screen.getByLabelText('Upload document'), { target: { files: [original] } });
  fireEvent.click(screen.getByRole('button', { name: /Load Demo Benchmark/ }));
  expect(screen.queryByLabelText('Manual perspective correction')).toBeNull();
  expect(sample).toHaveBeenCalledOnce();
  fireEvent.change(screen.getByLabelText('Upload document'), { target: { files: [original] } });
  rerender(<HenrySharedDocumentUploader docType="title_deed" title="Deed" onFileUpload={vi.fn()} resetSignal={1} />);
  expect(screen.queryByLabelText('Manual perspective correction')).toBeNull();
  expect(URL.revokeObjectURL).toHaveBeenCalled();
});

it('rejects invalid corners and suppresses a stale correction after file changes or cancellation', async () => {
  let resolve!: (file: File) => void;
  vi.mocked(correctPerspective).mockReturnValue(new Promise<File>(done => { resolve = done; }));
  const confirm = vi.fn(), cancel = vi.fn();
  const { rerender } = render(<HenryPerspectiveEditor file={original} onConfirm={confirm} onCancel={cancel} />);
  fireEvent.change(screen.getByLabelText('TR x'), { target: { value: '0' } });
  expect(screen.getByRole('button', { name: 'Confirm corners and scan' })).toBeDisabled();
  fireEvent.change(screen.getByLabelText('TR x'), { target: { value: '1' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirm corners and scan' }));
  rerender(<HenryPerspectiveEditor file={corrected} onConfirm={confirm} onCancel={cancel} />);
  resolve(corrected);
  await waitFor(() => expect(screen.getByRole('button', { name: 'Confirm corners and scan' })).not.toBeDisabled());
  expect(confirm).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Confirm corners and scan' }));
  fireEvent.click(screen.getByRole('button', { name: 'Cancel correction' }));
  resolve(corrected);
  await Promise.resolve();
  expect(cancel).toHaveBeenCalledOnce();
  expect(confirm).not.toHaveBeenCalled();
});
