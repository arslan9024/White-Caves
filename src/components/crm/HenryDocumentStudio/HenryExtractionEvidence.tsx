import React from 'react';
import type { ExtractionDiagnostics } from '../../../services/henryDocumentParsing';
import { HenryBenchmarkPanel } from './HenryBenchmarkPanel';
import type { BenchmarkValues } from '../../../services/henryBenchmark';

export function HenryExtractionEvidence({ diagnostics, scannerValues }: {
  diagnostics?: ExtractionDiagnostics;
  scannerValues?: Readonly<BenchmarkValues>;
}) {
  if (!diagnostics) return null;
  return <section aria-label="Extraction evidence">
    <p>Visible field coverage: {Math.round(diagnostics.coverage * 100)}% (not accuracy or official verification).
      {diagnostics.ocrConfidence !== undefined && <> OCR engine score: {Math.round(diagnostics.ocrConfidence)} / 100 (not authenticity).</>}</p>
    {diagnostics.warnings.map((warning, index) => <p role="alert" key={index}>{warning}</p>)}
    <details><summary>Field evidence and missing values</summary>
      <ul>{Object.entries(diagnostics.fields).map(([key, field]) =>
        <li key={key}>{key}: {field.state} ({field.source}){field.values.length > 0 && ` — ${field.values.join(' | ')}`}</li>)}</ul>
    </details>
    <HenryBenchmarkPanel diagnostics={diagnostics} scannerValues={scannerValues} />
  </section>;
}
