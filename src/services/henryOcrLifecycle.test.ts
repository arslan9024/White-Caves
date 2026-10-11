import { afterEach, describe, expect, it, vi } from 'vitest';
import scanner from './HenryEmiratesIdScannerService';

const ocr = vi.hoisted(() => ({
  recognize: vi.fn(),
  terminate: vi.fn().mockResolvedValue(undefined),
  createWorker: vi.fn(),
}));
vi.mock('tesseract.js', () => ({ createWorker: ocr.createWorker }));
const pdf = vi.hoisted(() => ({ getDocument: vi.fn(), destroy: vi.fn().mockResolvedValue(undefined) }));
vi.mock('pdfjs-dist', () => ({ getDocument: pdf.getDocument, GlobalWorkerOptions: { workerSrc: 'local-worker' } }));

describe('Henry bounded local OCR lifecycle', () => {
  afterEach(() => { vi.restoreAllMocks(); vi.clearAllMocks(); vi.useRealTimers(); });

  const input = new File(['synthetic pixels'], 'synthetic.png', { type: 'image/png' });
  const prepare = () => {
    const adapter = scanner as unknown as { preProcessImageOnCanvas(file: File): Promise<string> };
    vi.spyOn(adapter, 'preProcessImageOnCanvas').mockResolvedValue('data:image/png;base64,c3ludGhldGlj');
    ocr.createWorker.mockResolvedValue({ recognize: ocr.recognize, terminate: ocr.terminate });
  };

  it('uses bilingual local workers and keeps raw confidence separate', async () => {
    prepare();
    ocr.recognize.mockResolvedValue({ data: { text: 'Name: TEST PERSON', confidence: 82 } });
    const result = await scanner.extractDocumentText(input);
    expect(ocr.createWorker).toHaveBeenCalledWith('eng+ara', 1, expect.any(Object));
    expect(result.ocrConfidence).toBe(82);
    expect(ocr.recognize).toHaveBeenCalledTimes(1);
    expect(ocr.terminate).toHaveBeenCalledTimes(1);
  });

  it('bounds low-quality retry to one auto-rotation pass and preserves quality warning', async () => {
    prepare();
    ocr.recognize.mockResolvedValueOnce({ data: { text: 'unreadable', confidence: 25 } })
      .mockResolvedValueOnce({ data: { text: 'Name: TEST PERSON', confidence: 75 } });
    const result = await scanner.extractDocumentText(input);
    expect(result.ocrText).toBe('Name: TEST PERSON');
    expect(result.warnings?.[0]).toContain('Low OCR quality');
    expect(ocr.recognize).toHaveBeenCalledTimes(2);
    expect(ocr.recognize).toHaveBeenLastCalledWith(expect.any(String), { rotateAuto: true });
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
    let finish!: (worker: { recognize: typeof ocr.recognize; terminate: typeof ocr.terminate }) => void;
    ocr.createWorker.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
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
    pdf.getDocument.mockReturnValue({ promise: Promise.resolve({ numPages: 1, getPage: async () => ({
      getTextContent: async () => ({ items: [
        { str: 'Name: TEST PERSON', transform: [1, 0, 0, 1, 10, 200], width: 100 },
        { str: 'Expiry Date: 01/01/2030', transform: [1, 0, 0, 1, 10, 180], width: 120 },
        { str: 'ID Number: 784-2001-0000001-1', transform: [1, 0, 0, 1, 10, 160], width: 140 },
        { str: `Employer: ${'SYNTHETIC COMPANY '.repeat(10)}`, transform: [1, 0, 0, 1, 10, 140], width: 150 },
      ] }),
    }) }), destroy: pdf.destroy });
    const result = await scanner.extractDocumentText(file);
    expect(result.streamText).toContain('TEST PERSON\nExpiry Date');
    expect(ocr.createWorker).not.toHaveBeenCalled();
    expect(pdf.destroy).toHaveBeenCalledTimes(1);
  });

  it('cleans up and rejects oversized PDF page counts', async () => {
    const file = new File(['synthetic PDF'], 'synthetic.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'arrayBuffer', { value: async () => new ArrayBuffer(0) });
    pdf.getDocument.mockReturnValue({ promise: Promise.resolve({ numPages: 3 }), destroy: pdf.destroy });
    await expect(scanner.extractDocumentText(file)).rejects.toThrow('Scan at most two pages at a time.');
    expect(pdf.destroy).toHaveBeenCalledTimes(1);
    expect(ocr.createWorker).not.toHaveBeenCalled();
  });
});
