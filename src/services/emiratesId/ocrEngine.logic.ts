/**
 * ocrEngine.logic.ts — Multi-Page PDF & Tesseract.js Optical Character Recognition Pipeline
 */

import logger from '../../utils/logger';
import { validScanDate } from '../henryScanReview';
import { parseOcrText } from './parser.logic';
import { renderPdfToCanvasAndText, preProcessImageOnCanvas } from './pdfRenderer.logic';
import { PdfPageLimitError } from './types';

export async function extractDocumentText(
  file: File,
  onProgress?: (progress: number) => void,
  coverage?: (text: string) => number
): Promise<{ ocrText: string; streamText: string; ocrConfidence?: number; warnings?: string[] }> {
  let streamText = '';
  let worker: import('tesseract.js').Worker | undefined;
  const warnings: string[] = [];
  const texts: string[] = [];
  const confidences: number[] = [];
  const completedResult = () => ({
    ocrText: texts.join('\n'),
    streamText,
    ocrConfidence: confidences.length
      ? confidences.reduce((sum, value) => sum + value, 0) / confidences.length
      : undefined,
    warnings,
  });
  const requiredCoverage =
    coverage ||
    ((text: string) => {
      const parsed = parseOcrText(text, '');
      return (
        [!!parsed.idNumber, !!parsed.fullNameEn, validScanDate(parsed.expiryDate || '')].filter(
          Boolean
        ).length / 3
      );
    });
  const deadline = Date.now() + 90000;
  const bounded = async <T>(operation: Promise<T>, passLimit = 30000): Promise<T> => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([
        operation,
        new Promise<never>((_, reject) => {
          timer = setTimeout(
            () => reject(new Error('OCR timed out. Rescan a smaller, clearer image.')),
            Math.max(1, Math.min(passLimit, deadline - Date.now()))
          );
        }),
      ]);
    } finally {
      clearTimeout(timer);
    }
  };
  try {
    if (typeof window === 'undefined') return { ocrText: '', streamText: '' };
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    let ocrInput: File | string = file;
    let pageImages: string[] = [];

    if (isPdf) {
      const { canvasDataUrls, pdfText } = await bounded(
        renderPdfToCanvasAndText(file, requiredCoverage)
      );
      pageImages = canvasDataUrls;
      ocrInput = canvasDataUrls[0] || file;
      streamText = pdfText;
    } else if (file.type.startsWith('image/')) {
      const processedUrl = await preProcessImageOnCanvas(file, 0, true, warnings);
      if (!processedUrl) throw new Error('Image could not be safely decoded.');
      ocrInput = processedUrl;
    }

    if (onProgress) onProgress(30);
    if (isPdf && !pageImages.length) {
      warnings.push(
        'Native PDF text read without OCR. Check image-only or omitted fields against the original.'
      );
      return { ocrText: '', streamText, warnings };
    }

    const Tesseract = await import('tesseract.js');
    // Language assets run locally in the worker; document pixels are never sent to an OCR API.
    const pendingWorker = Tesseract.createWorker('eng+ara', 1, {
      logger: (m: { status?: string; progress?: number }) => {
        if (m.status === 'recognizing text' && typeof m.progress === 'number')
          onProgress?.(30 + Math.round(m.progress * 60));
      },
    });
    let expired = false;
    pendingWorker.then(
      async created => {
        if (expired) {
          try {
            await created.terminate();
          } catch {
            logger.warn('Henry late worker cleanup failed');
          }
        }
      },
      () => undefined
    );
    try {
      worker = await bounded(pendingWorker);
    } catch (error) {
      expired = true;
      throw error;
    }
    for (const input of pageImages.length ? pageImages : [ocrInput]) {
      const candidates = [await bounded(worker.recognize(input), 20000)];
      const score = (candidate: (typeof candidates)[number]) =>
        requiredCoverage(candidate.data.text || '');
      const confidence = (candidate: (typeof candidates)[number]) =>
        Number.isFinite(candidate.data.confidence) ? candidate.data.confidence : -Infinity;
      let best = candidates[0]!;
      try {
        if (confidence(best) < 60 || score(best) < 1) {
          warnings.push(
            'Low OCR quality or missing required fields. Check focus, lighting and orientation; all fields need source review.'
          );
          // At most five passes per page; clean complete documents use one.
          for (const angle of [0, 90, 180, 270]) {
            const retryInput = await bounded(
              preProcessImageOnCanvas(pageImages.length ? input : file, angle, false),
              15000
            );
            if (!retryInput) continue;
            const retry = await bounded(worker.recognize(retryInput), 20000);
            candidates.push(retry);
            if (
              score(retry) > score(best) ||
              (score(retry) === score(best) && confidence(retry) > confidence(best))
            )
              best = retry;
            if (score(best) === 1 && confidence(best) >= 60) break;
          }
        }
      } finally {
        // Keep independent readable candidates even when a later pass fails.
        texts.push(
          [
            ...new Set(
              [best, ...candidates].map(candidate => candidate.data.text || '').filter(Boolean)
            ),
          ].join('\n')
        );
        if (Number.isFinite(best.data.confidence)) confidences.push(best.data.confidence);
        else warnings.push('OCR confidence unavailable; review every field against the source.');
      }
    }

    return completedResult();
  } catch (error) {
    logger.error('Henry OCR extraction failed');
    if (error instanceof PdfPageLimitError) throw error;
    if (!streamText.trim() && !texts.some(text => text.trim()))
      throw new Error('OCR unavailable or timed out. Nothing extracted; rescan or retry.');
    warnings.push(
      'OCR recovery incomplete or timed out; completed candidates retained. Review omitted or image-only fields and compare all source evidence.'
    );
    return completedResult();
  } finally {
    if (worker) {
      try {
        await bounded(worker.terminate(), 3000);
      } catch {
        logger.warn('Henry OCR worker cleanup failed');
      }
    }
  }
}
