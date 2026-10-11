import { afterEach, describe, it, expect, vi } from 'vitest';
import { act, render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import HenrySharedDocumentUploader from './HenrySharedDocumentUploader';
import HenryEmiratesIdScannerView from './HenryEmiratesIdScannerView';
import HenryTitleDeedScannerView from './HenryTitleDeedScannerView';
import eid from '../../../services/HenryEmiratesIdScannerService';
import deed from '../../../services/HenryTitleDeedScannerService';

const editor = vi.hoisted(() => ({
  callbacks: [] as { onConfirm: (corrected: File, original: File) => void; onCancel: () => void }[],
}));
vi.mock('./HenryPerspectiveEditor', () => ({
  HenryPerspectiveEditor: (props: typeof editor.callbacks[number]) => {
    editor.callbacks.push(props);
    return <section aria-label="Manual perspective correction" />;
  },
}));
afterEach(() => {
  vi.restoreAllMocks();
  editor.callbacks.length = 0;
  eid.clearCachedEmiratesId();
  deed.clearCachedTitleDeed();
});

describe('HenrySharedDocumentUploader', () => {
  it.each(['emirates_id', 'title_deed'] as const)(
    'invalidates late editor callbacks on every reset while %s extraction is initially empty',
    kind => {
      const isId = kind === 'emirates_id';
      vi.spyOn(eid, 'getCachedEmiratesId').mockReturnValue(null);
      vi.spyOn(deed, 'getCachedTitleDeed').mockReturnValue(null);
      const idScan = vi.spyOn(eid, 'scanEmiratesId');
      const dualScan = vi.spyOn(eid, 'scanDualSide');
      const deedScan = vi.spyOn(deed, 'scanTitleDeed');
      render(isId ? <HenryEmiratesIdScannerView /> : <HenryTitleDeedScannerView />);
      fireEvent.click(screen.getByLabelText('Manual four-corner correction before scanning'));
      const original = new File(['original'], 'original.png', { type: 'image/png' });
      const corrected = new File(['corrected'], 'corrected.png', { type: 'image/png' });
      for (let reset = 0; reset < 2; reset++) {
        fireEvent.change(screen.getByLabelText('Upload document'), { target: { files: [original] } });
        const stale = editor.callbacks.at(-1)!;
        expect(screen.getByLabelText('Manual perspective correction')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: isId ? 'Clear & Reset' : 'Discard & Clear' }));
        expect(screen.queryByLabelText('Manual perspective correction')).not.toBeInTheDocument();
        fireEvent.change(screen.getByLabelText('Upload document'), { target: { files: [original] } });
        act(() => { stale.onCancel(); stale.onConfirm(corrected, original); });
        expect(screen.getByLabelText('Manual perspective correction')).toBeInTheDocument();
        expect(idScan).not.toHaveBeenCalled();
        expect(dualScan).not.toHaveBeenCalled();
        expect(deedScan).not.toHaveBeenCalled();
        expect(screen.getByLabelText('Confirm document review')).toBeDisabled();
        fireEvent.click(screen.getByRole('button', { name: isId ? 'Clear & Reset' : 'Discard & Clear' }));
      }
    }
  );

  it('renders title, subtitle, dropzone, and calls onSampleLoad when sample button clicked', () => {
    const onSampleLoad = vi.fn();
    render(
      <HenrySharedDocumentUploader
        title="Sample Document Uploader"
        subtitle="Upload official PDF or scanned image"
        onSampleLoad={onSampleLoad}
        onFileUpload={() => {}}
      />
    );

    expect(screen.getByText('Sample Document Uploader')).toBeInTheDocument();
    expect(screen.getByText('Upload official PDF or scanned image')).toBeInTheDocument();

    const sampleBtn = screen.getByText(/Load Demo Benchmark/i);
    fireEvent.click(sampleBtn);
    expect(onSampleLoad).toHaveBeenCalled();
  });
});
