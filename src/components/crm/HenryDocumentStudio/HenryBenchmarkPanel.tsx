import React, { useEffect, useState } from 'react';
import type { ExtractionDiagnostics } from '../../../services/henryDocumentParsing';
import { benchmarkFields, evaluateHenryBenchmark, type BenchmarkValues } from '../../../services/henryBenchmark';

export function HenryBenchmarkPanel({ diagnostics, scannerValues }: {
  diagnostics: ExtractionDiagnostics;
  scannerValues?: Readonly<BenchmarkValues>;
}) {
  const [consent, setConsent] = useState(false);
  const [source, setSource] = useState<'real' | 'synthetic'>('real');
  const [labels, setLabels] = useState<BenchmarkValues>({});
  const [report, setReport] = useState<ReturnType<typeof evaluateHenryBenchmark> | null>(null);
  const [error, setError] = useState('');
  const schema = Object.hasOwn(diagnostics.fields, 'idNumber') ? 'emirates_id' : 'title_deed';
  const recordFields = schema === 'emirates_id' ? benchmarkFields.slice(0, 5) : benchmarkFields.slice(5);
  useEffect(() => {
    setLabels({});
    setConsent(false);
    setReport(null);
    setError('');
  }, [diagnostics, scannerValues]);
  const evaluate = () => {
    try {
      if (!scannerValues) throw new Error('Original scanner snapshot unavailable.');
      const predicted: BenchmarkValues = {};
      for (const field of benchmarkFields) {
        const evidence = diagnostics.fields[field];
        if (evidence?.source === 'review') throw new Error('Rescan before evaluating: manually corrected predictions are not scanner evidence.');
        predicted[field] = evidence && evidence.state !== 'missing' && evidence.state !== 'conflict'
          ? scannerValues[field] || '' : '';
      }
      setReport(evaluateHenryBenchmark([{ source, consent, expected: labels, predicted }], schema));
      setError('');
    } catch {
      setReport(null);
      setError('Consent and at least one label are required. Rescan if fields were manually corrected or the original scanner snapshot is unavailable.');
    }
  };
  return <details>
    <summary>Local accuracy comparison (opt-in)</summary>
    <p>No upload or persistence. Labels stay in this mounted browser panel; clear them when finished.
      Missing predictions count as failures. Blank labeled values mean absent on the original.
      Use normalized scanner formats for labels: DD/MM/YYYY dates and numeric square metres.
      Partial labels do not count as a full-record match. This does not calibrate OCR confidence.</p>
    <label>Sample origin <select value={source} onChange={event => { setSource(event.target.value as 'real' | 'synthetic'); setReport(null); }}>
      <option value="real">Real document, consent required</option>
      <option value="synthetic">Synthetic fixture, not real-world evidence</option>
    </select></label>
    <label><input type="checkbox" checked={consent} onChange={event => { setConsent(event.target.checked); setReport(null); }} />
      I have permission to evaluate this real document locally</label>
    {recordFields.map(field => <div key={field} style={{ display: 'block' }}>
      <label><input type="checkbox" aria-label={`Label ${field}`} checked={Object.hasOwn(labels, field)}
        onChange={event => {
          setLabels(previous => {
            const next = { ...previous };
            if (event.target.checked) next[field] = '';
            else delete next[field];
            return next;
          });
          setReport(null);
        }} />Label {field}</label>
      {Object.hasOwn(labels, field) && <input aria-label={`${field} ground truth`} maxLength={500}
        value={labels[field]} onChange={event => { setLabels(previous => ({ ...previous, [field]: event.target.value })); setReport(null); }} />}
    </div>)}
    <button type="button" onClick={evaluate} disabled={source === 'real' && !consent}>Compare locally</button>
    <button type="button" onClick={() => { setLabels({}); setConsent(false); setReport(null); setError(''); }}>Clear local labels</button>
    {error && <p role="alert">{error}</p>}
    {report && <output aria-label="Aggregate benchmark report"><pre>{JSON.stringify(report, null, 2)}</pre></output>}
  </details>;
}
