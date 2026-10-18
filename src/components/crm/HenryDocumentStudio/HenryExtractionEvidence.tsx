import React, { useEffect, useState } from 'react';
import type { ExtractionDiagnostics } from '../../../services/henryDocumentParsing';
import { HenryBenchmarkPanel } from './HenryBenchmarkPanel';
import type { BenchmarkValues } from '../../../services/henryBenchmark';

export function HenryExtractionEvidence({ diagnostics, scannerValues }: {
  diagnostics?: ExtractionDiagnostics;
  scannerValues?: Readonly<BenchmarkValues>;
}) {
  const [selected, setSelected] = useState('');
  useEffect(() => setSelected(''), [diagnostics]);
  if (!diagnostics) return null;
  const sourceText = typeof diagnostics.sourceText === 'string' ? diagnostics.sourceText.slice(0, 65536) : '';
  const evidence = diagnostics.fields[selected];
  const ranges = evidence?.source === 'text' && evidence.state !== 'derived' && evidence.state !== 'missing'
    ? (Array.isArray(evidence.textRanges) ? evidence.textRanges.slice(0, 1000) : []).filter(range => range && Number.isInteger(range.start) && Number.isInteger(range.end) &&
      range.start >= 0 && range.end > range.start && range.end <= sourceText.length).sort((a, b) => a.start - b.start) : [];
  let cursor = 0;
  const highlighted: React.ReactNode[] = [];
  for (const range of ranges) {
    if (range.start < cursor) continue;
    highlighted.push(sourceText.slice(cursor, range.start),
      <mark key={range.start}>{sourceText.slice(range.start, range.end)}</mark>);
    cursor = range.end;
  }
  highlighted.push(sourceText.slice(cursor));
  return <section aria-label="Extraction evidence">
    <p>Visible field coverage: {Math.round(diagnostics.coverage * 100)}% (not accuracy or official verification).
      {diagnostics.ocrConfidence !== undefined && <> OCR engine score: {Math.round(diagnostics.ocrConfidence)} / 100 (not authenticity).</>}</p>
    {diagnostics.warnings.map((warning, index) => <p role="alert" key={index}>{warning}</p>)}
    <details><summary>Field evidence and missing values</summary>
      <ul>{Object.entries(diagnostics.fields).map(([key, field]) =>
        <li key={key}><button type="button" aria-pressed={selected === key} onClick={() => setSelected(key)}>
          {key}: {field.state} ({field.source}){field.values.length > 0 && ` — ${field.values.join(' | ')}`}</button></li>)}</ul>
      <p>Source text evidence only (normalized OCR/native PDF text). Original image/page coordinates are unavailable.
        Highlights locate labelled source candidates, not proof that a normalized or derived value was printed.</p>
      {selected && !ranges.length && <p role="status">No exact source-text locator for {selected}; compare the original manually.</p>}
      {sourceText ? <pre aria-label="Source text evidence" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', maxHeight: 320, overflow: 'auto' }}>
        {highlighted}</pre> : <p>Source text unavailable.</p>}
    </details>
    <HenryBenchmarkPanel diagnostics={diagnostics} scannerValues={scannerValues} />
  </section>;
}
