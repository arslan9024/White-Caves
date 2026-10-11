import { afterEach, describe, expect, it, vi } from 'vitest';
import scanner from './HenryEmiratesIdScannerService';

const ocr = vi.hoisted(() => ({
  recognize: vi.fn(),
  terminate: vi.fn().mockResolvedValue(undefined),
  createWorker: vi.fn(),
}));
vi.mock('tesseract.js', () => ({ createWorker: ocr.createWorker }));
const pdf = vi.hoisted(() => ({
  getDocument: vi.fn(),
  destroy: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('pdfjs-dist', () => ({
  getDocument: pdf.getDocument,
  GlobalWorkerOptions: { workerSrc: 'local-worker' },
}));

describe('Henry bounded local OCR lifecycle', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const input = new File(['synthetic pixels'], 'synthetic.png', { type: 'image/png' });
  const complete = 'ID Number: 784-2001-0000001-1\nName: TEST PERSON\nExpiry Date: 01/01/2030';
  const prepare = () => {
    const adapter = scanner as unknown as { preProcessImageOnCanvas(file: File): Promise<string> };
    vi.spyOn(adapter, 'preProcessImageOnCanvas').mockResolvedValue(
      'data:image/png;base64,c3ludGhldGlj'
    );
    ocr.createWorker.mockResolvedValue({ recognize: ocr.recognize, terminate: ocr.terminate });
  };

  it('uses bilingual local workers and keeps raw confidence separate', async () => {
    prepare();
    ocr.recognize.mockResolvedValue({ data: { text: complete, confidence: 82 } });
    const result = await scanner.extractDocumentText(input);
    expect(ocr.createWorker).toHaveBeenCalledWith('eng+ara', 1, expect.any(Object));
    expect(result.ocrConfidence).toBe(82);
    expect(ocr.recognize).toHaveBeenCalledTimes(1);
    expect(ocr.terminate).toHaveBeenCalledTimes(1);
  });

  it('stops adaptive recovery once required coverage and confidence are adequate', async () => {
    prepare();
    ocr.recognize
      .mockResolvedValueOnce({ data: { text: 'unreadable', confidence: 25 } })
      .mockResolvedValueOnce({ data: { text: complete, confidence: 75 } });
    const result = await scanner.extractDocumentText(input);
    expect(result.ocrText).toContain(complete);
    expect(result.warnings?.[0]).toContain('Low OCR quality');
    expect(ocr.recognize).toHaveBeenCalledTimes(2);
    expect(ocr.recognize).toHaveBeenLastCalledWith(expect.any(String));
    expect(ocr.terminate).toHaveBeenCalledTimes(1);
  });

  it.each([90, 180, 270])(
    'recovers synthetic %s-degree candidates with bounded passes',
    async angle => {
      prepare();
      const passes = 2 + angle / 90;
      ocr.recognize.mockImplementation(async () => ({
        data: {
          text: ocr.recognize.mock.calls.length === passes ? complete : 'unreadable',
          confidence: ocr.recognize.mock.calls.length === passes ? 80 : 20,
        },
      }));
      const result = await scanner.extractDocumentText(input);
      expect(result.ocrText.startsWith(complete)).toBe(true);
      expect(ocr.recognize).toHaveBeenCalledTimes(passes);
      const adapter = scanner as unknown as {
        preProcessImageOnCanvas(file: File, rotation?: number, enhance?: boolean): Promise<string>;
      };
      expect(adapter.preProcessImageOnCanvas).toHaveBeenLastCalledWith(input, angle, false);
      expect(ocr.terminate).toHaveBeenCalledTimes(1);
    }
  );

  it.each([false, true])(
    'bounds rotated canvas pixels, warns on natural resolution and releases it (failure=%s)',
    async fail => {
      const context = {
        translate: vi.fn(),
        rotate: vi.fn(),
        drawImage: vi.fn(),
        putImageData: vi.fn(),
        getImageData: vi.fn(() => {
          if (fail) throw new Error('Synthetic canvas failure');
          return { data: new Uint8ClampedArray(4) };
        }),
      };
      const canvas = {
        width: 0,
        height: 0,
        getContext: () => context,
        toDataURL: () => 'synthetic bounded image',
      };
      vi.spyOn(document, 'createElement').mockReturnValue(canvas as unknown as HTMLCanvasElement);
      const revoke = vi.fn();
      vi.stubGlobal(
        'URL',
        class extends URL {
          static createObjectURL() {
            return 'blob:synthetic';
          }
          static revokeObjectURL = revoke;
        }
      );
      vi.stubGlobal(
        'Image',
        class {
          naturalWidth = 640;
          naturalHeight = 400;
          width = 640;
          height = 400;
          onload: (() => void) | null = null;
          onerror: (() => void) | null = null;
          set src(value: string) {
            if (value) queueMicrotask(() => this.onload?.());
          }
        }
      );
      const adapter = scanner as unknown as {
        preProcessImageOnCanvas(
          file: File,
          rotation: number,
          enhance: boolean,
          warnings: string[]
        ): Promise<string>;
      };
      const warnings: string[] = [];
      const result = await adapter.preProcessImageOnCanvas(input, 90, false, warnings);
      expect(context.rotate).toHaveBeenCalledWith(Math.PI / 2);
      expect(context.drawImage).toHaveBeenCalledWith(expect.anything(), -800, -500, 1600, 1000);
      expect(warnings[0]).toContain('Small source resolution');
      expect(result).toBe(fail ? '' : 'synthetic bounded image');
      expect(canvas.width).toBe(0);
      expect(canvas.height).toBe(0);
      expect(revoke).toHaveBeenCalledTimes(1);
    }
  );

  it('prefers required-field recovery over long high-confidence irrelevant text', async () => {
    prepare();
    ocr.recognize
      .mockResolvedValueOnce({ data: { text: 'HEADER '.repeat(200), confidence: 99 } })
      .mockResolvedValueOnce({ data: { text: complete, confidence: 70 } });
    const result = await scanner.extractDocumentText(input);
    expect(result.ocrText.startsWith(complete)).toBe(true);
    expect(result.ocrConfidence).toBe(70);
    expect(ocr.recognize).toHaveBeenCalledTimes(2);
  });

  it('preserves inconsistent independently readable candidates for source review', async () => {
    prepare();
    ocr.recognize
      .mockResolvedValueOnce({ data: { text: complete, confidence: 40 } })
      .mockResolvedValueOnce({
        data: {
          text: complete.replace('TEST PERSON', 'OTHER PERSON').replace('0000001', '0000002'),
          confidence: 80,
        },
      });
    const result = await scanner.scanEmiratesId(input);
    expect(result.diagnostics?.fields.idNumber?.state).toBe('conflict');
    expect(result.diagnostics?.fields.fullName?.state).toBe('conflict');
    expect(result.reviewConfirmed).toBe(false);
  });

  it('caps unrecoverable scans at five passes, never running an unbounded rotation loop', async () => {
    prepare();
    ocr.recognize.mockResolvedValue({ data: { text: 'unreadable', confidence: 20 } });
    const result = await scanner.extractDocumentText(input);
    expect(result.ocrConfidence).toBe(20);
    expect(ocr.recognize).toHaveBeenCalledTimes(5);
    expect(ocr.terminate).toHaveBeenCalledTimes(1);
  });

  it('terminates recognition after its individual pass deadline', async () => {
    prepare();
    vi.useFakeTimers();
    ocr.recognize.mockImplementation(() => new Promise(() => undefined));
    const assertion = expect(scanner.extractDocumentText(input)).rejects.toThrow('timed out');
    await vi.advanceTimersByTimeAsync(20001);
    await assertion;
    expect(ocr.terminate).toHaveBeenCalledTimes(1);
  });

  it.each([false, true])(
    'retains completed readable candidates after retry timeout (conflict=%s)',
    async conflict => {
      prepare();
      vi.useFakeTimers();
      ocr.recognize.mockResolvedValueOnce({ data: { text: complete, confidence: 40 } });
      if (conflict)
        ocr.recognize.mockResolvedValueOnce({
          data: {
            text: complete.replace('TEST PERSON', 'OTHER PERSON').replace('0000001', '0000002'),
            confidence: 45,
          },
        });
      ocr.recognize.mockImplementation(() => new Promise(() => undefined));
      const operation = scanner.extractDocumentText(input);
      await vi.advanceTimersByTimeAsync(20001);
      const result = await operation;
      expect(result.ocrText).toContain(complete);
      expect(result.warnings?.join(' ')).toContain('recovery incomplete');
      expect(ocr.terminate).toHaveBeenCalledTimes(1);
      const parsed = scanner.parseOcrText(result.ocrText, '');
      expect(parsed.fullNameEn).not.toBe('');
      if (conflict) {
        expect(parsed.diagnostics?.fields.idNumber?.state).toBe('conflict');
        expect(parsed.diagnostics?.fields.fullName?.state).toBe('conflict');
      }
    }
  );

  it('retains first-page OCR conflicts and native PDF text after a subsequent page timeout', async () => {
    prepare();
    vi.useFakeTimers();
    const adapter = scanner as unknown as {
      renderPdfToCanvasAndText(file: File): Promise<{ canvasDataUrls: string[]; pdfText: string }>;
    };
    vi.spyOn(adapter, 'renderPdfToCanvasAndText').mockResolvedValue({
      canvasDataUrls: ['page one', 'page two'],
      pdfText: 'Native PDF heading',
    });
    ocr.recognize
      .mockResolvedValueOnce({ data: { text: complete, confidence: 40 } })
      .mockResolvedValueOnce({
        data: { text: complete.replace('TEST PERSON', 'OTHER PERSON'), confidence: 80 },
      })
      .mockImplementation(() => new Promise(() => undefined));
    const operation = scanner.extractDocumentText(
      new File(['pdf'], 'synthetic.pdf', { type: 'application/pdf' })
    );
    await vi.advanceTimersByTimeAsync(20001);
    const result = await operation;
    expect(result.streamText).toBe('Native PDF heading');
    expect(result.ocrText).toContain('TEST PERSON');
    expect(result.ocrText).toContain('OTHER PERSON');
    expect(scanner.parseOcrText(result.ocrText, '').diagnostics?.fields.fullName?.state).toBe(
      'conflict'
    );
    expect(result.warnings?.join(' ')).toContain('recovery incomplete');
    expect(ocr.terminate).toHaveBeenCalledTimes(1);
  });

  it('cleans worker after recognition rejects, without returning fixture identity', async () => {
    prepare();
    ocr.recognize.mockRejectedValue(new Error('synthetic worker failure'));
    await expect(scanner.extractDocumentText(input)).rejects.toThrow('Nothing extracted');
    expect(ocr.terminate).toHaveBeenCalledTimes(1);
  });

  it('terminates a worker that becomes ready after the document deadline', async () => {
    prepare();
    vi.useFakeTimers();
    let finish!: (worker: {
      recognize: typeof ocr.recognize;
      terminate: typeof ocr.terminate;
    }) => void;
    ocr.createWorker.mockImplementation(
      () =>
        new Promise(resolve => {
          finish = resolve;
        })
    );
    const operation = scanner.extractDocumentText(input);
    const assertion = expect(operation).rejects.toThrow('timed out');
    await vi.advanceTimersByTimeAsync(90001);
    await assertion;
    finish({ recognize: ocr.recognize, terminate: ocr.terminate });
    await Promise.resolve();
    expect(ocr.terminate).toHaveBeenCalledTimes(1);
  });

  it('prefers adequate native PDF text and preserves lines with no OCR worker', async () => {
    const file = new File(['synthetic PDF'], 'synthetic.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'arrayBuffer', { value: async () => new ArrayBuffer(0) });
    pdf.getDocument.mockReturnValue({
      promise: Promise.resolve({
        numPages: 1,
        getPage: async () => ({
          getTextContent: async () => ({
            items: [
              { str: 'Name: TEST PERSON', transform: [1, 0, 0, 1, 10, 200], width: 100 },
              { str: 'Expiry Date: 01/01/2030', transform: [1, 0, 0, 1, 10, 180], width: 120 },
              {
                str: 'ID Number: 784-2001-0000001-1',
                transform: [1, 0, 0, 1, 10, 160],
                width: 140,
              },
              {
                str: `Employer: ${'SYNTHETIC COMPANY '.repeat(10)}`,
                transform: [1, 0, 0, 1, 10, 140],
                width: 150,
              },
            ],
          }),
        }),
      }),
      destroy: pdf.destroy,
    });
    const result = await scanner.extractDocumentText(file);
    expect(result.streamText).toContain('TEST PERSON\nExpiry Date');
    expect(ocr.createWorker).not.toHaveBeenCalled();
    expect(pdf.destroy).toHaveBeenCalledTimes(1);
  });

  it('cleans up and rejects oversized PDF page counts', async () => {
    const file = new File(['synthetic PDF'], 'synthetic.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'arrayBuffer', { value: async () => new ArrayBuffer(0) });
    pdf.getDocument.mockReturnValue({
      promise: Promise.resolve({ numPages: 3 }),
      destroy: pdf.destroy,
    });
    await expect(scanner.extractDocumentText(file)).rejects.toThrow(
      'Scan at most two pages at a time.'
    );
    expect(pdf.destroy).toHaveBeenCalledTimes(1);
    expect(ocr.createWorker).not.toHaveBeenCalled();
  });
});
