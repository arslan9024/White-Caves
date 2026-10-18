import { useEffect, useRef, useState } from 'react';
import { editGenericField, extractGenericSource, genericReady, parseGenericDocument, rankGenericTypes,
  saveGenericDocument, type GenericScan } from '../../../../services/henryGenericDocuments';
import type { GenericDocumentType } from '../../../../../server/shared/henryDocumentRegistry';
import type { VaultSaveOptions } from '../../../../services/henryScanReview';

export function useHenryGenericDocument() {
  const [scan, setScan] = useState<GenericScan | null>(null);
  const [source, setSource] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [text, setText] = useState<string | null>(null);
  const [extraction, setExtraction] = useState<Awaited<ReturnType<typeof extractGenericSource>> | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [options, setOptions] = useState<VaultSaveOptions>({});
  const [resetSignal, setResetSignal] = useState(0);
  const revision = useRef(0);
  useEffect(() => () => { revision.current++; }, []);
  useEffect(() => {
    if (!source) { setSourceUrl(''); return; }
    const url = URL.createObjectURL(source);
    setSourceUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [source]);
  const invalidate = () => {
    revision.current++;
    setScan(null); setSource(null); setText(null); setOptions({}); setExtraction(null);
    setBusy(false); setMessage(''); setError('');
  };
  const reset = () => {
    invalidate();
    setResetSignal(value => value + 1);
  };
  const upload = async (file: File, original = file) => {
    reset();
    const version = revision.current;
    setBusy(true);
    try {
      if (!original.size || original.size > 4 * 1024 * 1024 ||
        !['application/pdf', 'image/png', 'image/jpeg'].includes(original.type))
        throw new Error('Original must be a non-empty PDF, PNG or JPEG at most 4 MB.');
      const extracted = await extractGenericSource(file);
      if (version !== revision.current) return;
      setSource(original); setText(extracted.text); setExtraction(extracted);
    } catch (failure) {
      if (version === revision.current) setError(failure instanceof Error ? failure.message : 'Extraction failed.');
    } finally {
      if (version === revision.current) setBusy(false);
    }
  };
  const chooseType = (type: GenericDocumentType | '') => {
    revision.current++;
    const next = type && text !== null ? parseGenericDocument(type, text) : null;
    if (next && extraction) {
      next.diagnostics.warnings.push(...extraction.warnings);
      next.diagnostics.ocrConfidence = extraction.ocrConfidence;
    }
    setScan(next);
    setOptions({});
    setError(''); setMessage('');
  };
  const edit = (key: string, value: string) => {
    revision.current++;
    setScan(current => current ? editGenericField(current, key, value) : null);
    setMessage(''); setError('');
  };
  const confirm = (confirmed: boolean) => {
    revision.current++;
    setScan(current => current ? { ...current, reviewConfirmed: confirmed } : null);
    setMessage('');
  };
  const save = async () => {
    if (!scan || !source || !genericReady(scan) || busy) return;
    const version = revision.current;
    setBusy(true); setError(''); setMessage('');
    try {
      const id = await saveGenericDocument(scan, source, options);
      if (version !== revision.current) return;
      setScan(current => current ? { ...current, reviewConfirmed: false } : null);
      setMessage(`Reviewed document and immutable original saved to encrypted vault. Document ID: ${id}. Signature status remains draft.`);
    } catch (failure) {
      if (version === revision.current) {
        setScan(current => current ? { ...current, reviewConfirmed: false } : null);
        setError(failure instanceof Error ? failure.message : 'Save failed.');
      }
    } finally {
      if (version === revision.current) setBusy(false);
    }
  };
  return { scan, text, source, sourceUrl, busy, message, error, options, resetSignal, reset, invalidate, upload, chooseType, edit, confirm, save,
    setOptions: (value: VaultSaveOptions) => { setOptions(value); confirm(false); },
    candidates: text === null ? [] : rankGenericTypes(text) };
}
