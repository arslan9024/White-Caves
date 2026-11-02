/**
 * pdfRenderer.logic.ts — High-Res Canvas Rasterization & Image Preprocessing Pipeline
 */

import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import logger from '../../utils/logger';
import { imageQualityWarnings } from '../henryImageQuality';
import { PdfPageLimitError } from './types';

export async function renderPdfToCanvasAndText(
  file: File,
  coverage?: (text: string) => number
): Promise<{ canvasDataUrls: string[]; pdfText: string }> {
  if (typeof window === 'undefined') return { canvasDataUrls: [], pdfText: '' };
  let loadingTask: import('pdfjs-dist').PDFDocumentLoadingTask | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      if (loadingTask)
        void loadingTask.destroy().catch(() => logger.warn('Henry timed-out PDF cleanup failed'));
      reject(new Error('PDF reading timed out'));
    }, 30000);
  });
  const bounded = <T>(operation: Promise<T>): Promise<T> => Promise.race([operation, deadline]);
  try {
    const pdfjs = await import('pdfjs-dist');
    if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
    }
    const arrayBuffer = await bounded(file.arrayBuffer());
    loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdfDoc = await bounded(loadingTask.promise);
    if (pdfDoc.numPages > 2) throw new PdfPageLimitError();

    let combinedPdfText = '';
    const canvasDataUrls: string[] = [];

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await bounded(pdfDoc.getPage(i));
      const textContent = await bounded(page.getTextContent());
      const items = textContent.items
        .filter(
          (item): item is import('pdfjs-dist/types/src/display/api').TextItem => 'str' in item
        )
        .sort(
          (a, b) =>
            Math.round(b.transform[5] / 3) - Math.round(a.transform[5] / 3) ||
            a.transform[4] - b.transform[4]
        );
      const pageText = items
        .map((item, index) => {
          const previous = items[index - 1];
          const separator =
            previous && Math.abs(item.transform[5] - previous.transform[5]) >= 3
              ? '\n'
              : previous && item.transform[4] - previous.transform[4] - previous.width > 15
                ? ' | '
                : ' ';
          return `${separator}${item.str}`;
        })
        .join('');
      combinedPdfText += `\n--- PAGE ${i} ---\n${pageText}`;

      if (
        coverage
          ? coverage(pageText) < 1
          : pageText.replace(/\s/g, '').length < 150 || (pageText.match(/:/g)?.length || 0) < 4
      ) {
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({
          scale: Math.min(2, Math.sqrt(4_000_000 / (base.width * base.height))),
        });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          try {
            await bounded(
              page.render({ canvasContext: ctx, viewport, canvas } as unknown as Parameters<
                typeof page.render
              >[0]).promise
            );
            canvasDataUrls.push(canvas.toDataURL('image/png'));
          } finally {
            canvas.width = 0;
            canvas.height = 0;
          }
        }
      }
    }

    return { canvasDataUrls, pdfText: combinedPdfText };
  } catch (error) {
    logger.error('Henry PDF extraction failed');
    if (error instanceof PdfPageLimitError) throw error;
    throw new Error('PDF could not be read. Upload at most two readable pages.');
  } finally {
    clearTimeout(timer);
    if (loadingTask) {
      let cleanupTimer: ReturnType<typeof setTimeout> | undefined;
      try {
        await Promise.race([
          loadingTask.destroy(),
          new Promise<never>((_, reject) => {
            cleanupTimer = setTimeout(() => reject(new Error('PDF cleanup timeout')), 3000);
          }),
        ]);
      } catch {
        logger.warn('Henry PDF cleanup failed or timed out');
      } finally {
        clearTimeout(cleanupTimer);
      }
    }
  }
}

export async function preProcessImageOnCanvas(
  file: File | string,
  rotation = 0,
  enhance = true,
  warnings?: string[]
): Promise<string> {
  if (typeof window === 'undefined') return '';
  return new Promise(resolve => {
    const img = new Image();
    const objectUrl = typeof file === 'string' ? file : URL.createObjectURL(file);
    const release = () => {
      if (typeof file !== 'string') URL.revokeObjectURL(objectUrl);
    };
    const timeout = window.setTimeout(() => {
      release();
      img.src = '';
      resolve('');
    }, 15000);
    img.onload = () => {
      window.clearTimeout(timeout);
      release();
      let canvas: HTMLCanvasElement | undefined;
      try {
        canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve('');
          return;
        }

        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        if (!width || !height || width * height > 40_000_000)
          throw new Error('Image dimensions exceed decoding budget');
        if (warnings && Math.max(width, height) < 1000)
          warnings.push(
            'Small source resolution (heuristic advisory); enlarging cannot restore missing detail. Rescan if characters are unclear.'
          );
        const scale = Math.min(
          2.5,
          2200 / Math.max(width, height),
          Math.sqrt(4_000_000 / (width * height))
        );
        const sideways = rotation === 90 || rotation === 270;
        canvas.width = (sideways ? height : width) * scale;
        canvas.height = (sideways ? width : height) * scale;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(
          img,
          (-width * scale) / 2,
          (-height * scale) / 2,
          width * scale,
          height * scale
        );
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        if (warnings)
          warnings.push(
            ...imageQualityWarnings(imgData, width, height).filter(
              warning => !warning.includes('low source resolution')
            )
          );
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          const gray = 0.299 * (d[i] ?? 0) + 0.587 * (d[i + 1] ?? 0) + 0.114 * (d[i + 2] ?? 0);
          const enhanced = enhance
            ? gray > 130
              ? Math.min(255, gray * 1.15)
              : Math.max(0, gray * 0.85)
            : gray;
          d[i] = enhanced;
          d[i + 1] = enhanced;
          d[i + 2] = enhanced;
        }
        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch {
        logger.warn('Henry image preprocessing unavailable');
        resolve('');
      } finally {
        if (canvas) {
          canvas.width = 0;
          canvas.height = 0;
        }
        img.onload = null;
        img.onerror = null;
        img.src = '';
      }
    };
    img.onerror = () => {
      window.clearTimeout(timeout);
      release();
      resolve('');
    };
    img.src = objectUrl;
  });
}
