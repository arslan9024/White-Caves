import React from 'react';
import type { ExtractionDiagnostics } from '../../../services/henryDocumentParsing';

export function HenryExtractionEvidence({ diagnostics }: { diagnostics?: ExtractionDiagnostics }) {
  if (!diagnostics) return null;
  return <section aria-label="Extraction evidence">
    <p>Visible field coverage: {Math.round(diagnostics.coverage * 100)}% (not accuracy or official verification).
      {diagnostics.ocrConfidence !== undefined && <> OCR engine score: {Math.round(diagnostics.ocrConfidence)} / 100 (not authenticity).</>}</p>
    {diagnostics.warnings.map((warning, index) => <p role="alert" key={index}>{warning}</p>)}
    <details><summary>Field evidence and missing values</summary>
      <ul>{Object.entries(diagnostics.fields).map(([key, field]) =>
        <li key={key}>{key}: {field.state} ({field.source}){field.values.length > 0 && ` — ${field.values.join(' | ')}`}</li>)}</ul>
    </details>
  </section>;
}
